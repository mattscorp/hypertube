'use strict'

const with_auth = require('../user/authentification_middleware');
const express = require('express');
const router = express.Router();
// model functions
const films = require('../../model/films.js');

router.get('/moviedb', with_auth, async (req, res) => {
    if (!req.query.action || (req.query.action != "popular" && req.query.action != "search" && req.query.action != "similar")) {
        res.status(400);
        res.send("Specify the action to be performed: 'popular' to get popular movies, 'search' to get a particular movie");
    } else {
        // Optional [public] --> 'G' for general public, 'R' for restricted. Default is 'all'
        // Optional [page] --> return the n-page
        // Optional [category] --> 'drama', 'western', etc. By default 'all'
        let public_category = (req.query.public && (req.query.public == "G" || req.query.public == "R")) ? req.query.public : "all";
        let category = (req.query.category) ? req.query.category : "all";
        let page = 1;
        // ** POPULAR ** --> returns the most popular movies
        if (req.query.action.toLowerCase() == "popular") {
            if (req.query.page)
                page = req.query.page;
            let popular_movies = await films.popular_movies(page, public_category, category);
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
            let search_movies = await films.search_movies(page, public_category, category, name);
            if (search_movies == '')
                res.status(204);
            else
                res.status(200);
            res.send(search_movies.results);
        }
        // ** SIMILAR ** --> get movies that are similar to the parameter "movie_ID"
        else if (req.query.action.toLowerCase() == "similar") {
            console.log(req.query.movie_ID);
            let similar_movies = await films.similar_movies(req.query.movie_ID);
            if (similar_movies == '')
                res.status(204);
            else
                res.status(200);
            res.send(similar_movies.results);
        }
        // https://developers.themoviedb.org/3/movies/get-similar-movies
    }
});

module.exports = router;