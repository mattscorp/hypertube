'use strict'

const torrentStream = require('torrent-stream');
const with_auth = require('./user/authentification_middleware');
const fs = require("fs");
const express = require('express');
const router = express.Router();

const movie_model = require('../model/films.js');
const torrent = require('./torrent/torrent.js');
const path = require("path");


router.get('/movie_player', with_auth, async (req, res) => {
    if (req.query && req.query.moviedb_id && req.query.moviedb_id != '') {
        let movie_infos_api = await movie_model.movie_infos(req.query.moviedb_id);
        console.log(movie_infos_api);
        if (movie_infos_api.status_code == 34) {
            console.log('The movie could not be found');
            res.sendStatus(404);
        } else if (movie_infos_api && movie_infos_api.id == req.query.moviedb_id) {
            const providers = await torrent.enable_providers(['Rarbg', 'Torrentz2', 'ThePirateBay', 'KickassTorrents', 'TorrentProject']);
            const torrents = await torrent.get_magnet(movie_infos_api);
            if (torrents && torrents[0] && torrents[0].magnet && torrents[0] !== undefined) {
                console.log(torrents[0].magnet);
                const engine = torrentStream(torrents[0].magnet, { path: "./views/public/torrents" })
                engine.on("ready", () => {
                    engine.files.forEach((file) => {
                        console.log("READY SA MERE");
                        if (path.extname(file.name) === ".mp4" || path.extname(file.name) === ".mkv" || path.extname(file.name) === ".avi" ) {
                            console.log('path : ' + file.path);
                            if (fs.existsSync(`./views/public/torrents/${file.path}`)) {
                                console.log('EXISTS');
                                fs.stat(`./views/public/torrents/${file.path}`, function(err, stats) {
                                    if (err) {
                                        if (err.code === 'ENOENT') {
                                          // 404 Error if file not found
                                          return res.sendStatus(404);
                                        }
                                        res.end(err);
                                    } else {
                                        console.log(stats);
                                        let range = req.headers.range;
                                        if (!range) {
                                            // 416 Wrong range
                                            return res.sendStatus(416);
                                        } else {
                                            const positions = range.replace(/bytes=/, "").split("-");
                                            let start = parseInt(positions[0], 10);
                                            const total = stats.size;
                                            const end = positions[1] ? parseInt(positions[1], 10) : total - 1;
                                            if (start >= end)
                                                start = end
                                            const chunksize = (end - start) + 1;
                                            res.writeHead(206, {
                                                "Content-Range": "bytes " + start + "-" + end + "/" + total,
                                                "Accept-Ranges": "bytes",
                                                "Content-Length": chunksize,
                                                "Content-Type": "video/mp4"
                                            })
                                            var stream = fs.createReadStream(`./views/public/torrents/${file.path}`, { start, end })
                                            .on("open", function() {
                                                console.log('ON STREAM')
                                                stream.pipe(res);
                                            }).on("error", function(err) {
                                                console.log('GROSSE ERREUR')
                                                res.end(err);
                                            })
                                        }
                                    }
                                })
                            } else {
                                const extension_split = file.name.split('.');
                                const extension = extension_split[extension_split.length - 1]
                                const year = movie_infos_api.release_date.split('-')[0];
                                movie_model.add_torrent(movie_infos_api.id, file.path, extension, file.name, year, torrents[0].magnet);
                                console.log("DANS LE ELSE");
                                const fileStream = file.createReadStream()
                                fileStream.pipe(res)
                            }
                        }
                    })
                })
            }
        }


    }
})

/*
const with_auth = require('./user/authentification_middleware');
const fs = require("fs");
const express = require('express');
const router = express.Router();
const movie_model = require('../model/films.js');
const torrent = require('./torrent/torrent.js');
const torrentStream = require("torrent-stream");
const TorrentSearchApi = require('torrent-search-api');
const webtorrent = require('webtorrent');
const TORRENT_OPTIONS = {
    path: './views/public/torrents' // Folder to download files to (default=`/tmp/webtorrent/`)
}

router.get('/movie_player', with_auth, async (req, res) => {
    if (req.query && req.query.moviedb_id && req.query.moviedb_id != '') {
        if (req.headers && req.headers.range) {
            setTimeout( async () => {
                const movie_db = await movie_model.film_db(req.query.moviedb_id);
                if (movie_db && movie_db != null && movie_db != undefined && movie_db != '' && movie_db != 'vide') {
                    const movie_in_db = './views/public/torrents/' + JSON.parse(movie_db)[0].path;
                    // Si le film est totalement telechargé on le balance
                    console.log('MOVIE IN DB DL_COMPLETE : '+ JSON.parse(movie_db)[0].download_complete);
                    if (JSON.parse(movie_db)[0].download_complete && JSON.parse(movie_db)[0].download_complete === 1) {
                        const range = req.headers.range;
                        try {
                            const stat = fs.statSync(movie_in_db)
                            const fileSize = stat.size;
                            if (range) {
                                const parts = range.replace(/bytes=/, "").split("-");
                                const start = parseInt(parts[0], 10);
                                const end = parts[1] ? parseInt(parts[1], 10) : fileSize - 1;
                                const chunksize = parseInt(end-start, 10) + 1
                                const file = fs.createReadStream(movie_in_db, {start, end})
                                const head = {
                                    'Content-Range': `bytes ${start}-${end}/${fileSize}`,
                                    'Accept-Ranges': 'bytes',
                                    'Content-Length': chunksize,
                                    'Content-Type': 'video/mp4',
                                }
                                res.writeHead(206, head);
                                file.pipe(res);
                            } else {
                                const head = {
                                    'Content-Length': fileSize,
                                    'Content-Type': 'video/mp4',
                                }
                                res.writeHead(200, head)
                                fs.createReadStream(movie_in_db).pipe(res)
                            }
                        } catch (err) {
                            throw err;
                        }
                    }
                    // Sinon on le retelecharge et on balance en live
                    else {
                        console.log('ON EST ICI 1 ');
                        let movie_infos_api = await movie_model.movie_infos(req.query.moviedb_id);
                        console.log(movie_infos_api);
                        if (movie_infos_api.status_code == 34) {
                            console.log('The movie could not be found');
                            res.sendStatus(404);
                        } else {
                            const providers = await torrent.enable_providers(['Rarbg', 'Torrentz2', 'ThePirateBay', 'KickassTorrents', 'TorrentProject']);
                            const torrents = await torrent.get_magnet(movie_infos_api);
                            if (torrents && torrents[0] && torrents[0] != [] && torrents[0] != '') {
                                const magnet = await TorrentSearchApi.getMagnet(torrents[0]);
                                if (magnet) {
                                    try {
                                        const webtorrent_client = new webtorrent();
                                        webtorrent_client.add(magnet, TORRENT_OPTIONS, async function (torrent_ret) {
                                            var file = torrent_ret.files.find(async function (file) {
                                                return file.name.endsWith('.mp4') || file.name.endsWith('.ogg') || file.name.endsWith('.webm') || file.name.endsWith('.avi') || file.name.endsWith('.mkv')
                                            });
                                            console.log(file);
                                            const extension_split = file.name.split('.');
                                            const extension = extension_split[extension_split.length - 1]
                                            const year = movie_infos_api.release_date.split('-')[0];
                                            movie_model.add_torrent(movie_infos_api.id, file.path, extension, file.name, year, magnet);
                                            // A la fin du DL on update la db
                                            torrent_ret.on('done', function () {
                                                console.log("*\/*\/ TORRENT DOWNLOAD COMPLETE \\*\\*");
                                                movie_model.torrent_done(magnet);
                                            });
                                            // torrent_ret.on('download', function(bytes) {
                                            //     console.log('progress : ' + torrent_ret.downloaded);
                                                
                                            // })
                                            torrent_ret.files.forEach(function (file) {
                                                const fileStream = file.createReadStream();
                                                fileStream.pipe(res);
                                            });
                                            webtorrent_client.on('torrent', function () {
                                                console.log("******ON TORRENT 1*****")
                                                const fileStream = file.createReadStream();
                                                console.log('PLOP 2');
                                                console.log(fileStream);
                                                fileStream.pipe(res);
                                                // const range = req.headers.range;
                                                // if (range) {
                                                //     const parts = range.replace(/bytes=/, "").split("-");
                                                //     const start = parseInt(parts[0], 10);
                                                //     const end = parts[1] ? parseInt(parts[1], 10) : fileSize - 1;
                                                //     const chunksize = parseInt(end-start, 10) + 1
                                                //     const file = fs.createReadStream(movie_in_db, {start, end})
                                                //     const head = {
                                                //         'Content-Range': `bytes ${start}-${end}/${fileSize}`,
                                                //         'Accept-Ranges': 'bytes',
                                                //         'Content-Length': chunksize,
                                                //         'Content-Type': 'video/mp4',
                                                //     }
                                                //     res.writeHead(206, head);
                                                //     file.pipe(res);
                                                // } else {
                                                //     const head = {
                                                //         'Content-Length': fileSize,
                                                //         'Content-Type': 'video/mp4',
                                                //     }
                                                //     res.writeHead(200, head)
                                                //     fs.createReadStream(movie_in_db).pipe(res)
                                                // }
                                            })
                                            webtorrent_client.on('ready', function () {
                                                const fileStream = file.createReadStream();
                                                console.log('PLOP 2');
                                                console.log(fileStream);
                                                fileStream.pipe(res);
                                            })
                                        });
                                    }
                                    catch(err) {
                                        console.log('Error downloading the torrent : ' + err);
                                    }
                                }
                            }
                        }
                    }
                } else {
                    console.log('ON EST ICI 2');
                    let movie_infos_api = await movie_model.movie_infos(req.query.moviedb_id);
                    if (movie_infos_api.status_code == 34) {
                        console.log('The movie could not be found');
                        res.sendStatus(404);
                    } else {
                        const providers = await torrent.enable_providers(['Rarbg', 'Torrentz2', 'ThePirateBay', 'KickassTorrents', 'TorrentProject']);
                        const torrents = await torrent.get_magnet(movie_infos_api);
                        if (torrents && torrents[0] && torrents[0] != [] && torrents[0] != '') {
                            const magnet = await TorrentSearchApi.getMagnet(torrents[0]);
                            if (magnet) {
                                try {
                                    const webtorrent_client = new webtorrent();
                                    console.log(magnet);
                                    webtorrent_client.add(magnet, TORRENT_OPTIONS, async function (torrent_ret) {
                                        let file = await torrent_ret.files.find(async function (file) {
                                            return file.name.endsWith('.mp4') || file.name.endsWith('.ogg') || file.name.endsWith('.webm') || file.name.endsWith('.avi') || file.name.endsWith('.mkv')
                                        });
                                        console.log(file);
                                        const extension_split = file.name.split('.');
                                        const extension = extension_split[extension_split.length - 1]
                                        const year = movie_infos_api.release_date.split('-')[0];
                                        movie_model.add_torrent(movie_infos_api.id, file.path, extension, file.name, year, magnet);
                                        // A la fin du DL on update la db
                                        torrent_ret.on('done', function () {
                                            console.log("*\/*\/ TORRENT DOWNLOAD COMPLETE \\*\\*");
                                            movie_model.torrent_done(magnet);
                                        });
                                        torrent_ret.files.forEach(function (file) {
                                            const fileStream = file.createReadStream();
                                            fileStream.pipe(res);
                                        });
                                        // torrent_ret.on('download', function(bytes) {
                                        //     console.log('progress : ' + torrent_ret.downloaded);
                                            
                                        // })
                                        webtorrent_client.on('torrent', function () {
                                            console.log("******ON TORRENT 2*****")
                                            const fileStream = file.createReadStream();
                                            console.log('PLOP 2');
                                            console.log(fileStream);
                                            fileStream.pipe(res);
                                            // const range = req.headers.range;
                                            // if (range) {
                                            //     const parts = range.replace(/bytes=/, "").split("-");
                                            //     const start = parseInt(parts[0], 10);
                                            //     const end = parts[1] ? parseInt(parts[1], 10) : fileSize - 1;
                                            //     const chunksize = parseInt(end-start, 10) + 1
                                            //     const file = fs.createReadStream(movie_in_db, {start, end})
                                            //     const head = {
                                            //         'Content-Range': `bytes ${start}-${end}/${fileSize}`,
                                            //         'Accept-Ranges': 'bytes',
                                            //         'Content-Length': chunksize,
                                            //         'Content-Type': 'video/mp4',
                                            //     }
                                            //     res.writeHead(206, head);
                                            //     file.pipe(res);
                                            // } else {
                                            //     const head = {
                                            //         'Content-Length': fileSize,
                                            //         'Content-Type': 'video/mp4',
                                            //     }
                                            //     res.writeHead(200, head)
                                            //     fs.createReadStream(movie_in_db).pipe(res)
                                            // }
                                        })
                                        webtorrent_client.on('ready', function () {
                                            const fileStream = file.createReadStream();
                                            console.log('PLOP 1');
                                            console.log(fileStream);
                                            fileStream.pipe(res);
                                        })
                                    });
                                }
                                catch(err) {
                                    console.log('Error downloading the torrent : ' + err);
                                }
                            }
                        }
                    }

                }
            ; 1000})
        }
    }
});
*/
module.exports = router;

