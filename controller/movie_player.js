'use strict'

const with_auth = require('./user/authentification_middleware');
const fs = require("fs");
const express = require('express');
const router = express.Router();
const movie_model = require('../model/films.js');
const torrentStream = require("torrent-stream");

router.get('/movie_player', with_auth, async (req, res) => {
    if (req.query && req.query.moviedb_id && req.query.moviedb_id != '') {
        //////
        // console.log('IN STREAM_DL : ' + req.query.id);
        // let movie_infos = await movie_model.film_db(req.query.id);
        // console.log(movie_infos);
        // if (movie_infos == 'vide')     {
        //     res.status(204).send('Pas de magnet');
        // } else {
        //     let path = JSON.parse(movie_infos)[0].path;
        //     console.log(path);
        //     if (fs.existsSync(`./views/public/torrents/${path}`)) {
        //         console.log('IN "/stream_DL" : Le fichier existe');
        //         fs.stat(`./views/public/torrents/${path}`, function(err, stats) {
        //             if (err) { /* If we can't get information about the file */
        //                 if (err.code === 'ENOENT') {
        //                     console.log('ERROR');
        //                     // 404 Error if file not found
        //                     return res.sendStatus(404);
        //                 }
        //             res.end(err);
        //             } else { /* If we have information about the file available */
        //                 console.log(stats);
        //                 let range = req.query.range;
        //                 console.log('range : ' + range);
        //                 if (!range) {
        //                     // 416 Wrong range
        //                     return res.sendStatus(416);
        //                 }
        //             }
        //         });
        //     } else
        //     console.log('IN "/stream_DL" : Le fichier n\'existe pas');
        // }
        //////
        if (req.headers && req.headers.range) {
            const movie_in_db = './views/public/torrents/' + JSON.parse(await movie_model.film_db(req.query.moviedb_id))[0];
            console.log(await movie_in_db);
            if (movie_in_db && movie_in_db != null && movie_in_db != undefined && movie_in_db != '') {
                // Si le film est totalement telechargé on le balance
                if (movie_in_db.download_complete) {
                    const range = req.headers.range;
                    try {
                        const stat = fs.statSync(movie_in_db.path)
                        const fileSize = stat.size;
                        console.log('range : ' + range);
                        if (range) {
                            console.log('part 1');
                            const parts = range.replace(/bytes=/, "").split("-");
                            const start = parseInt(parts[0], 10);
                            const end = parts[1] ? parseInt(parts[1], 10) : fileSize - 1;
                            const chunksize = parseInt(end-start, 10) + 1
                            console.log('chunksize :' +  chunksize);
                            console.log('end :' +  end);
                            const file = fs.createReadStream(movie_in_db.path, {start, end})
                            const head = {
                                'Content-Range': `bytes ${start}-${end}/${fileSize}`,
                                'Accept-Ranges': 'bytes',
                                'Content-Length': chunksize,
                                'Content-Type': 'video/mp4',
                            }
                            res.writeHead(206, head);
                            file.pipe(res);
                        } else {
                            console.log('part 2');
                            const head = {
                                'Content-Length': fileSize,
                                'Content-Type': 'video/mp4',
                            }
                            res.writeHead(200, head)
                            fs.createReadStream(movie_in_db.path).pipe(res)
                        }
                    } catch (err) {
                        throw err;
                    }
                }
                // Sinon on le retelecharge et on balance en live
                else {
                    const engine = torrentStream(movie_in_db.magnet, { path: "./views/public/torrents1/" })
                    engine.files.forEach((file) => {
                        if (
                        path.extname(file.name) === ".mp4" ||
                        path.extname(file.name) === ".mkv" ||
                        path.extname(file.name) === ".avi"
                        ) {
                            console.log('LAAAAAAA');
                            const fileStream = file.createReadStream()
                            fileStream.pipe(res)
                        }
                    })
                }
            }
        }
    }
});

module.exports = router;