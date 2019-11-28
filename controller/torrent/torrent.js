'use strict'

const films_db = require('../../model/films.js');
const TorrentSearchApi = require('torrent-search-api');
const webtorrent = require('webtorrent');
const TORRENT_OPTIONS = {
    path: './views/public/torrents' // Folder to download files to (default=`/tmp/webtorrent/`)
}
// TorrentSearchApi.enableProvider('ThePirateBay');
// TorrentSearchApi.enableProvider('KickassTorrents');
// TorrentSearchApi.enableProvider('Torrent9');

// Enable provider
const enable_providers = async (source) => {
    TorrentSearchApi.enableProvider(source);
    return new Promise(async (resolve, reject) => {
        const providers = await TorrentSearchApi.getActiveProviders();
        console.log(providers);
        resolve(providers);
    });
}

// Search the API to return infos and the magnet
const get_magnet = async (movie_infos) => {
    console.log('****************************');
    console.log(movie_infos.title);
    console.log('****************************');
    return new Promise(async (resolve, reject) => {
        const torrents = await TorrentSearchApi.search(movie_infos.title, 'Movies', 20)
        resolve(torrents);
    });
}

//
const dowload_torrent = async (torrents, movie_infos) => {
    // console.log('IN dowload_torrent : ' + torrents[0].title);
    if (torrents[0]) {
        console.log(torrents[0]);
        const magnet = await TorrentSearchApi.getMagnet(torrents[0]);
        if (magnet) {
            console.log('MAGNET ****' + magnet);
            try {
                const webtorrent_client = new webtorrent();
                webtorrent_client.add(magnet, TORRENT_OPTIONS, function (torrent) {
                    // Torrents can contain many files. Let's use the .mp4 file
                    var file = torrent.files.find(function (file) {
                        console.log(file.name);
                        return file.name.endsWith('.mp4') || file.name.endsWith('.mkv') || file.name.endsWith('.avi') || file.name.endsWith('.webm')
                    });
                    console.log(file);
                    const extension_split = file.name.split('.');
                    const extension = extension_split[extension_split.length - 1]
                    const year = movie_infos.release_date.split('-')[0];
                    films_db.add_torrent(movie_infos.id, file.path, extension, file.name, year, magnet);
                    // A la fin du DL on update la db
                    console.log("IN DOWNLOAD_TORRENT --> BEFORE 'done");
                    torrent.on('done', function () {
                        console.log("*/*/*/*/*/ TORRENT DONE \\*\\*\\*\\*\\*");
                        films_db.torrent_done(magnet);
                    });
                    console.log("IN DOWNLOAD_TORRENT --> AFTER 'done");
                });
            } catch(err) { console.log('Error downloading the torrent : ' + err) }

        } else {
            console.log('ERROR ==> PAS DE MAGNET');
        }
    } else {
        console.log('ERROR ==> PAS DE MAGNET');
    }
}

const ft_torrent = async (movie_infos, source) => {
    return new Promise(async (resolve, reject) => {
        const providers = await enable_providers(source[0]);
        console.log('return de providers : ' + providers);
        const torrents = await get_magnet(movie_infos);
        // LIGNE A METTRE EN COMMENTAIRE POUR NE PAS DOWLOAD LE TORRENT
        // =====> =====> =====>
        dowload_torrent(torrents, movie_infos);
        // <===== <===== <=====
        resolve(torrents);
    });
}
module.exports.ft_torrent = ft_torrent;