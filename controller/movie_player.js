'use strict'

const with_auth = require('./user/authentification_middleware');
const fs = require("fs");
const express = require('express');
const router = express.Router();
const movie_model = require('../model/films.js');
const torrentStream = require("torrent-stream");

router.get('/movie_player', with_auth, async (req, res) => {
    if (req.query && req.query.moviedb_id && req.query.moviedb_id != '') {
        if (req.headers && req.headers.range) {
            const full_dl = JSON.parse(await movie_model.film_db(req.query.moviedb_id))[0];
            // Si le film est totalement telechargé on le balance
            // if (full_dl && full_dl.download_complete && full_dl.download_complete == 1) {
                const movie_in_db = './views/public/torrents/' + JSON.parse(await movie_model.film_db(req.query.moviedb_id))[0].path;
                console.log(await movie_in_db);
                if (movie_in_db && movie_in_db != null && movie_in_db != undefined && movie_in_db != '') {
                    const range = req.headers.range;
                    try {
                        const stat = fs.statSync(movie_in_db)
                        const fileSize = stat.size;
                        console.log('range : ' + range);
                        if (range) {
                            const parts = range.replace(/bytes=/, "").split("-");
                            const start = parseInt(parts[0], 10);
                            const end = parts[1] ? parseInt(parts[1], 10) : fileSize - 1;
                            const chunksize = parseInt(end-start, 10) + 1
                            console.log('chunksize :' +  chunksize);
                            console.log('end :' +  end);
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
            // }  // Sinon on le retelecharge en direct avec le magnet
            // else {
            //     console.log('oas encore DL')
            //     console.log(full_dl);
            //     const engine = torrentStream(full_dl.magnet, { path: "./views/public/torrents1" })
            //     engine.on('ready', () => {
            //         engine.files.forEach(file => {
            //             const fileStream = file.createReadStream();
            //             fileStream.pipe(res);
            //         });
            //     })
            // }
        }
    }
});

module.exports = router;