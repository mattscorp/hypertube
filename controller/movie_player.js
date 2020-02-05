'use strict'

const torrentStream = require('torrent-stream');
const with_auth = require('./user/authentification_middleware');
const http = require("http")
const fs = require("fs");
const express = require('express');
const router = express.Router();
const OpenSubtitles = require("opensubtitles-api")
const OS = new OpenSubtitles({
  useragent: "TemporaryUserAgent",
  ssl: false,
})

const movie_model = require('../model/films.js');
const torrent = require('./torrent/torrent.js');
const path = require("path");

const request = require('request');

OS.login()
.then((res) => {
    console.log('\x1b[36m%s\x1b[0m', '-> OpenSubtitles connection established');
})
.catch((error) => {
    console.log('\x1b[31m%s\x1b[0m', '-> OpenSubtitles connection error', error);
});

/*
    Get subtitles
*/
const getSubtitles = async(imdbid, langs) => {
    try {
        const response = await OS.search({ imdbid, sublanguageid: langs.join(), limit: 'best' })
        return Promise.all(
            Object.entries(response).map(async(entry) => {
                const langCode = entry[0]
                return new Promise (async (resolve, reject) => {
                    let req = http.get(entry[1].vtt)
                    req.on("response", async (res) => {
                        const file = fs.createWriteStream(`./subs/${imdbid}_${langCode}`)
                        if (file) {
                            const stream = res.pipe(file)
                            if (stream) {
                                stream.on('finish', () => {
                                    try {
                                        if (fs.existsSync(`./subs/${imdbid}_${langCode}`)) {
                                            fs.readFile(`./subs/${imdbid}_${langCode}`, "utf8", (err, content) => {
                                                if (!err) {
                                                    const buffer = Buffer.from(content);
                                                    resolve({ key: langCode, value: buffer.toString("base64") })
                                                }
                                            })
                                        }
                                    } catch(err) {
                                        throw err;
                                    }
                                    
                                })
                            }
                        }
                    })
                    req.on("error", error => {
                        reject(error)
                    })
                })
            })
        )
    } catch (err) {
        console.log('Error in getting the subtitles : ' + err);
    }
}

router.get('/subtitles', async (req, res) => {
    if (req.query && req.query.imdb_id && req.query.imdb_id != '') {
        const langs = ["fre", "eng"];
        try {
            const response = await getSubtitles(req.query.imdb_id, langs)
            let subtitles = {}
            if (response) {
                response.forEach((subtitle) => {
                    subtitles = {
                        ...subtitles,
                        [subtitle.key]: subtitle.value,
                    }
                })
            }
            res.json({ subtitles })
        } catch (error) {
            res.json({ error })
        }
    }
});

/*
    If the movie is already downloaded, send it by chunks
    Else download it and in the same time pipe it to the frontend
*/

router.get('/movie_player', async (req, res) => {
    if (req.query && req.query.moviedb_id && req.query.moviedb_id != '') {
        let movie_infos_api = await movie_model.movie_infos(req.query.moviedb_id);
        if (movie_infos_api.status_code == 34) {
            console.log('The movie could not be found');
            res.status(201).send('No movie');
        } else if (movie_infos_api && movie_infos_api.id == req.query.moviedb_id) {
            const torrents = await torrent.get_magnet(movie_infos_api);
            console.log(torrents)
            if (torrents && torrents.success && torrents.success === false) {
                console.log('No magnet available');
                res.status(201).send('No movie');
            } else if (torrents && torrents[0] && torrents[0] !== undefined && torrents[0].url) {
                console.log('Magnet available')
                let torrent_magnet = `magnet:?xt=urn:btih:${torrents[0].hash}&dn=${encodeURI(movie_infos_api.original_title)}&tr=http://track.one:1234/announce&tr=udp://track.two:80`;
                const engine = torrentStream(torrent_magnet, { path: "./torrents" })
                engine.on("ready", () => {
                    engine.files.forEach((file) => {
                        if (path.extname(file.name) === ".mp4" || path.extname(file.name) === ".mkv" || path.extname(file.name) === ".avi" ) {
                            if (fs.existsSync(`./torrents/${file.path}`)) {
                                fs.stat(`./torrents/${file.path}`, function(err, stats) {
                                    if (err) {
                                        if (err.code === 'ENOENT') {
                                          // 201 Error if file not found
                                          return res.status(201).send('No movie');
                                        }
                                        res.end(err);
                                    } else {
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
                                            let extension1 = file.path.split('.');
                                            let extension2 = extension1[extension1.length - 1];
                                            let stream = {}
                                            try {
                                                if (fs.existsSync(`./torrents/${file.path}`)) {
                                                    stream = fs.createReadStream(`./torrents/${file.path}`, { start, end })
                                                    .on("open", function() {
                                                        stream.pipe(res);
                                                    }).on("error", function(err) {
                                                        res.end(err);
                                                    })
                                                }
                                            } catch(err) {
                                                throw err;
                                            }
                                        }
                                    }
                                })
                            } else {
                                const extension_split = file.name.split('.');
                                const extension = extension_split[extension_split.length - 1]
                                const year = movie_infos_api.release_date.split('-')[0];
                                movie_model.add_torrent(movie_infos_api.id, file.path, extension, file.name, year, torrents[0].url);
                                const fileStream = file.createReadStream()
                                fileStream.pipe(res)
                            }
                        }
                    })
                })
            } else {
                console.log('No torrent available');
                res.status(201).send('No movie')
            }
        }
    }
})

/*
    MOVIE_ADVANCEMENT: sent every minute to update the viewer's advancement
*/
router.post('/movie_advancement', with_auth, async (req, res) => {
    movie_model.update_time_viewed(req.uuid, req.body.imdb_ID, req.body.duration, req.body.current_time)
    res.end(JSON.stringify("RequestOK"));
})


module.exports = router;