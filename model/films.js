'use strict'

// mysql connection credentials
const db_connect = require('../model/db_connect.js');
let con = db_connect.con;

//// FROM AND TO THE DATABASE ////

// GET 20 the films from the db
//      --> "order" is the column to sort the movies by
//      --> "offset" is the number of asnwers to skip
const film_list = async (order, offset) => {
    return new Promise((resolve, reject) => {
        let values = [offset];
        let sql = "SELECT `film_ID`, `name`, `year`, `picture`, `director`, `casting`, `producer`, `summary`, `duration`, `date` FROM `films` ORDER BY `" + order + "` DESC LIMIT 20 OFFSET " + offset;
        con.query(sql, (err, result) => {
            if (err)
                throw err;
            else {
                resolve(JSON.stringify(result));
            }
        });
    });
}
module.exports.film_list = film_list;




//// FROM api.themoviedb.org ////

const request = require('request');
const API_KEY = "208ecb5c1ee27eb7b9bc731dc8656bd2";
let genres =  {
    "action": 28,
    "adventure": 12,
    "animation": 16,
    "comedy": 35,
    "crime": 80,
    "documentary": 99,
    "drama": 18,
    "family": 10751,
    "fantasy": 14,
    "history": 36,
    "horror": 27,
    "music": 10402,
    "mystery": 9648,
    "romance": 10749,
    "science fiction": 878,
    "tv movie": 10770,
    "thriller": 53,
    "war": 10752,
    "western": 37
}

// GET the most popular movies
//      --> film public: 'all' if not specified, 'G' for General Audiences
//      --> film category: 'all if not specified, 
const popular_movies = async (page, public_category, film_category) => {
    return new Promise((resolve, reject) => {
        let US_CERTIFICATE = '';
        let CATEGORY = '';
        if (public_category != 'all')
            US_CERTIFICATE = `&certification_country=US&certification.lte=${public_category}`;
        if (film_category != 'all' && genres[film_category.toLowerCase()])
            CATEGORY = `&with_genres=${genres[film_category.toLowerCase()]}`;
        let sql = `https://api.themoviedb.org/3/discover/movie?api_key=${API_KEY}&asort_by=popularity.desc${US_CERTIFICATE}${CATEGORY}&page=${page}`
        request(sql, {json: true}, function (error, response, body) {
            resolve(body);
        });
    });
}
module.exports.popular_movies = popular_movies;

// GET search a movie by name
const search_movies = async (page, public_category, film_category, name) => {
    return new Promise((resolve, reject) => {
        let US_CERTIFICATE = '';
        let CATEGORY = '';
        if (public_category != 'all')
            US_CERTIFICATE = `&certification_country=US&certification.lte=${public_category}`;
        if (film_category != 'all' && genres[film_category.toLowerCase()])
            CATEGORY = `&with_genres=${genres[film_category.toLowerCase()]}`;
        let sql = `https://api.themoviedb.org/3/search/movie?api_key=${API_KEY}&query=${name}${US_CERTIFICATE}${CATEGORY}&page=${page}`;
        request(sql, {json: true}, function (error, response, body) {
            resolve(body);
        });
    });
}
module.exports.search_movies = search_movies;

// GET search similar movies
const similar_movies = async (movie_ID) => {
    return new Promise((resolve, reject) => {
        let sql = `https://api.themoviedb.org/3/movie/${movie_ID}/similar?api_key=${API_KEY}&language=en-US&page=1`;
        console.log(sql);
        request(sql, {json: true}, function (error, response, body) {
            console.log('error:', error); // Print the error if one occurred
            console.log('statusCode:', response && response.statusCode); // Print the response status code if a response was received
            console.log('body:', body); // Print the HTML for the Google homepage.
            resolve(body);
        });
    });
}
module.exports.similar_movies = similar_movies;