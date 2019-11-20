'use strict'

const with_auth = require('../user/authentification_middleware');
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
            let popular_movies = await films.popular_movies(page, public_category, category, rating, duration, decade);
            if (popular_movies == '')
                res.status(204);
            else
                res.status(200);
            res.send(popular_movies.results);
        }
        // ** SEARCH ** --> search movies by name
        //    "movie_name": 
        else if (req.query.action.toLowerCase() == "search") {
            let name = req.query.movie_name;
            page = req.query.page;
            let search_movies = await films.search_movies(page, public_category, category, name, rating, duration, decade);
            if (search_movies == '')
                res.status(204);
            else
                res.status(200);
            res.send(search_movies.results);
        }
        // ** SIMILAR ** --> get movies that are similar to the parameter "movie_ID"
        else if (req.query.action.toLowerCase() == "similar") {
            let similar_movies = await films.similar_movies(req.query.movie_id);
            if (similar_movies == '')
                res.status(204);
            else
                res.status(200);
            res.send(similar_movies.results);
        }
        // https://developers.themoviedb.org/3/movies/get-similar-movies
    }
});

router.get('/movie_infos', with_auth, async (req, res) => {
    if (req.query.movie_id && req.query.movie !== "") {
        let movie_infos = await films.movie_infos(req.query.movie_id);
        if (movie_infos == '')
            res.status(204);
        else
            res.status(200).send(movie_infos);
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
            res.status(204).send('The movie needs to be downloaded');
            // On prend les providers
            torrents.ft_torrent(movie_infos_api, 'Rarbg');
        }
        else {
            res.status(200).send(movie_infos_db);
        }
    }
});

module.exports = router;