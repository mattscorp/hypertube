'use strict'

const with_auth = require('../user/authentification_middleware');
const fs = require("fs");
const express = require('express');
const router = express.Router();
// model functions
const films = require('../../model/films.js');
const torrents = require('../torrent/torrent.js');

router.get('/moviedb', with_auth, async (req, res) => {
    if (!req.query.action || (req.query.action != "popular" && req.query.action != "search" && req.query.action != "similar")) {
        res.status(400);
        res.send("Specify the action to be performed: 'popular' to get popular movies, 'search' to get a particular movie");
    } else {
        // Optional [public] --> 'G' for general public, 'R' for restricted. Default is 'all'
        // Optional [page] --> return the n-page
        // Optional [category] --> 'drama', 'western', etc. By default 'all'
        let public_category = req.query.public && (req.query.public == "G") ? req.query.public : "all";
        let category = (req.query.category) ? req.query.category : "all";
        let rating = (req.query.rating) ? req.query.rating : '1';
        let duration = (req.query.duration) ? req.query.duration : '';
        let decade = (req.query.decade) ? req.query.decade : '';
        let page = 1;
        // ** POPULAR ** --> returns the most popular movies
        if (req.query.action.toLowerCase() == "popular") {
            if (req.query.page)
                page = req.query.page;
            let popular_movies = await films.popular_movies(page, public_category, category, rating, duration, decade, req.query.language);
            if (popular_movies == '')
                res.status(204);
            else
                res.status(200);
            res.send(popular_movies.results);
        }
        // ** SEARCH ** --> search movies by name
        else if (req.query.action.toLowerCase() == "search") {
            let name = req.query.movie_name;
            page = req.query.page;
            let search_movies = await films.search_movies(page, public_category, category, name, rating, duration, decade, req.query.language);
            if (search_movies == '')
                res.status(204);
            else
                res.status(200);
            res.send(search_movies.results);
        }
        // ** SIMILAR ** --> get movies that are similar to the parameter "movie_ID"
        else if (req.query.action.toLowerCase() == "similar" && req.query.language != '') {
            let similar_movies = await films.similar_movies(req.query.movie_id, req.query.language);
            if (similar_movies == '' || similar_movies.status_code == 34)
                res.status(204);
            else
                res.status(200);
            res.send(similar_movies.results);
        }
        // https://developers.themoviedb.org/3/movies/get-similar-movies
    }
});

router.get('/movie_infos', with_auth, async (req, res) => {
    if (req.query.movie_id && req.query.movie !== ""&& req.query.language && req.query.language != '') {
        let movie_infos = await films.movie_infos(req.query.movie_id, req.query.language);
        if (movie_infos == '' || movie_infos.status_code == 34)
            res.status(204);
        else {
            movie_infos.revenue = movie_infos.revenue.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
            res.status(200).send(movie_infos);
        }
    }
});

router.get('/movie_cast', with_auth, async (req, res) => {
    if (req.query.movie_id && req.query.movie !== "") {
        let movie_cast = await films.movie_cast(req.query.movie_id);
        if (movie_cast == '')
            res.status(204);
        else
            res.status(200).send(movie_cast);
    }
});

/*
a. Si il est telechargé (fini), on renvoie le {status: 'finish', movie_infos: movie_infos}
b. Si il est telecharge (en cours), on renvoie {status: 'downloading', movie_infos: movie_infos}
c. Sinon on cherche le film :
    i. Si on le trouve (verification des infos), on commence a telecharger (celui avec le plus de seeders) 
            et on renvoie {status: 'downloading', movie_infos: movie_infos}
    ii. Sinon on renvoie {status: 'not found', movie_infos: ''} et on l'ajoute en BDD dans une table 'to_download'
*/
router.get('/movie_in_db', with_auth, async (req, res) => {
    if (req.query.movie_id && req.query.movie !== "") {
        let movie_infos_db = await films.film_db(req.query.movie_id);
        if (movie_infos_db == 'vide') {
            let movie_infos_api = await films.movie_infos(req.query.movie_id);
            // On prend les providers
            let torrent_infos = await torrents.ft_torrent(movie_infos_api/*, ['Rarbg', 'Torrentz2', 'ThePirateBay', 'KickassTorrents', 'TorrentProject']*/);
            res.status(201).send(torrent_infos);
        }
        else {
            //Si le telechargement est fini
            if (JSON.parse(movie_infos_db)[0].download_complete === 1)
            {
                res.status(200).send(movie_infos_db);
            }
            else // Si le telechargement est toujours en cours
            {
                res.status(206).send(movie_infos_db);
            }
        }
    }
});

/*
    Lorsque le telechargement est fini on l'indique en BDD
*/
router.post('/torrent_done', with_auth, (req, res) => {
    const magnet = req.body.body.split('magnet=')[1];
    if (magnet && magnet != "" && magnet != undefined) {
        films.torrent_done(magnet);
    }
})

/*
    On envoie le flux video pendant le telechargement
*/
// router.get('/stream_dl', with_auth, async (req, res) => {
//     console.log('IN STREAM_DL : ' + req.query.id);
//     let movie_infos = await films.film_db(req.query.id);
//     console.log(movie_infos);
//     if (movie_infos == 'vide')     {
//         res.status(204).send('Pas de magnet');
//     } else {
//         let path = JSON.parse(movie_infos)[0].path;
//         console.log(path);
//         if (fs.existsSync(`./views/public/torrents/${path}`)) {
//             console.log('IN "/stream_DL" : Le fichier existe');
//             fs.stat(`./views/public/torrents/${path}`, function(err, stats) {
//                 if (err) { /* If we can't get information about the file */
//                     if (err.code === 'ENOENT') {
//                         console.log('ERROR');
//                         // 404 Error if file not found
//                         return res.sendStatus(404);
//                     }
//                 res.end(err);
//                 } else { /* If we have information about the file available */
//                     console.log(stats);
//                     let range = req.query.range;
//                     console.log('range : ' + range);
//                     if (!range) {
//                         // 416 Wrong range
//                         return res.sendStatus(416);
//                     }
//                 }
//             });
//         } else
//         console.log('IN "/stream_DL" : Le fichier n\'existe pas');
//     }
// })

module.exports = router;

// router.route("/stream/:magnet").get((req, res) => {
//     const engine = torrentStream(req.params.magnet, { path: "./torrents" })
//     engine.on("ready", () => {
//         engine.files.forEach((file) => {
//             if (
//                 path.extname(file.name) === ".mp4" ||
//                 path.extname(file.name) === ".mkv" ||
//                 path.extname(file.name) === ".avi"
//             ) {
//                 if (fs.existsSync(`./torrents/${file.path}`)) {
//                     fs.stat(`./torrents/${file.path}`, function(err, stats) {
//                     if (err) {
//                         if (err.code === 'ENOENT') {
//                             // 404 Error if file not found
//                             return res.sendStatus(404);
//                         }
//                         res.end(err);
//                     }
//                     var range = req.headers.range;
//                     if (!range) {
//                         // 416 Wrong range
//                         return res.sendStatus(416);
//                     }
//                     const positions = range.replace(/bytes=/, "").split("-");
//                     let start = parseInt(positions[0], 10);
//                     const total = stats.size;
//                     const end = positions[1] ? parseInt(positions[1], 10) : total - 1;
//                     if (start >= end)
//                         start = end
//                     const chunksize = (end - start) + 1;
//                     res.writeHead(206, {
//                         "Content-Range": "bytes " + start + "-" + end + "/" + total,
//                         "Accept-Ranges": "bytes",
//                         "Content-Length": chunksize,
//                         "Content-Type": "video/mp4"
//                     })
//                     var stream = fs.createReadStream(`./torrents/${file.path}`, { start, end })
//                         .on("open", function() {
//                         stream.pipe(res);
//                         }).on("error", function(err) {
//                             res.end(err);
//                         })
//                     })
//                 } else {
//                     const fileStream = file.createReadStream()
//                     fileStream.pipe(res)
//                 }
//             }
//         })
//     })
// })