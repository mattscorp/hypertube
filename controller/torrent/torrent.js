'use strict'

const TorrentSearchApi = require('torrent-search-api');
 
// TorrentSearchApi.enableProvider('ThePirateBay');
// TorrentSearchApi.enableProvider('KickassTorrents');
// TorrentSearchApi.enableProvider('Torrent9');



const ft_0 = async (source) => {
    TorrentSearchApi.enableProvider(source);
    return new Promise(async (resolve, reject) => {
        const providers = await TorrentSearchApi.getActiveProviders();
        console.log(providers);
        resolve(providers);
    });
}


// Search '1080' in 'Movies' category and limit to 20 results
const ft_1 = async (movie_infos) => {
    console.log('****************************');
            console.log(movie_infos.title);
            console.log('****************************');
    return new Promise(async (resolve, reject) => {
        const torrents = await TorrentSearchApi.search(movie_infos.title, 'Movies', 20)
        console.log(torrents);
        resolve(torrents);
        // const details = await TorrentSearchApi.getMagnet(torrents);
        // console.log("*********************");
        // console.log(details);
    });
}

const ft_2 = async (torrents) => {
    console.log('IN FT_2 : ' + torrents[0].title);
    const magnet = await TorrentSearchApi.getMagnet(torrents[0]);
    console.log('MAGNET ****' + magnet);
}

const ft_torrent = async (movie_infos, source) => {
    const providers = await ft_0(source);
    // console.log('return de providers : ' + providers);
    const torrents = await ft_1(movie_infos);
    ft_2(torrents);
}
module.exports.ft_torrent = ft_torrent;