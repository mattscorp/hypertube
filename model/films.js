'use strict'
// to post http requests
const request = require('request');
// mysql connection credentials
const db_connect = require('../model/db_connect.js');
let con = db_connect.con;

//// FROM AND TO THE DATABASE ////

// GET 20 the films from the db
//      --> "order" is the column to sort the movies by
//      --> "offset" is the number of asnwers to skip
const film_db = async (movie_ID) => {
    return new Promise((resolve, reject) => {
        let sql = "SELECT * FROM `films` WHERE `moviedb_ID` = ?";
        con.query(sql, [movie_ID], (err, result) => {
            if (err)
                throw err;
            else {
                if (result == '')
                    resolve('vide');
                else
                    resolve(JSON.stringify(result));
            }
        });
    });
}
module.exports.film_db = film_db;




//// FROM api.themoviedb.org ////

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
const popular_movies = async (page, public_category, film_category, rating, duration, decade) => {
    return new Promise((resolve, reject) => {
        let US_CERTIFICATE = '';
        let CATEGORY = '';
        let rating_URL = '';
        let duration_URL = '';
        let decade_URL = '';
        let decadeTop = 0;
        if (public_category != 'all')
            US_CERTIFICATE = `&certification_country=US&certification.lte=${public_category}`;
        if (film_category != 'all' && genres[film_category.toLowerCase()])
            CATEGORY = `&with_genres=${genres[film_category.toLowerCase()]}`;
        if (rating != '1')
            rating_URL = `&vote_average.gte=${rating}`;
        if (duration != '')
            duration_URL = `&with_runtime.lte=${duration}`;
        if (decade != '') {
            decadeTop = +decade + +10;
            decade_URL = `&release_date.gte=${decade}-01-01&release_date.lte=${decadeTop}-01-01`;
        }
        let sql = `https://api.themoviedb.org/3/discover/movie?api_key=${API_KEY}&asort_by=popularity.desc&vote_count.gte=10${duration_URL}${decade_URL}${rating_URL}${US_CERTIFICATE}${CATEGORY}&page=${page}`
        request(sql, {json: true}, function (error, response, body) {
            resolve(body);
        });
    });
}
module.exports.popular_movies = popular_movies;

// GET search a movie by name
const search_movies = async (page, public_category, film_category, name, rating, duration, decade) => {
    return new Promise((resolve, reject) => {
        let US_CERTIFICATE = '';
        let CATEGORY = '';
        let rating_URL = '';
        let duration_URL = '';
        let decade_URL = '';
        if (public_category != 'all')
            US_CERTIFICATE = `&certification_country=US&certification.lte=${public_category}`;
        if (film_category != 'all' && genres[film_category.toLowerCase()])
            CATEGORY = `&with_genres=${genres[film_category.toLowerCase()]}`;
        if (rating != '1')
            rating_URL = `&vote_average.gte=${rating}`;
        if (duration != '' && duration != undefined)
            duration_URL = `&with_runtime.lte=${duration}`;
        if (decade != '') {
            decadeTop = +decade + +10;
            decade_URL = `&release_date.gte=${decade}-01-01&release_date.lte=${decadeTop}-01-01`;
        }
        let sql = `https://api.themoviedb.org/3/search/movie?api_key=${API_KEY}&vote_count.gte=10&query=${name}${duration_URL}${decade_URL}${rating_URL}${US_CERTIFICATE}${CATEGORY}&page=${page}`;
        request(sql, {json: true}, function (error, response, body) {
            resolve(body);
        });
    });
}
module.exports.search_movies = search_movies;

const movie_infos = async (movie_id) => {
    return new Promise((resolve, reject) => {
        let url = `https://api.themoviedb.org/3/movie/${movie_id}?api_key=${API_KEY}&language=en-US`;
        request(url, {json: true}, function (error, response, body) {
            resolve(body);
        });
    });
}
module.exports.movie_infos = movie_infos;

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



const movie_cast= async (movie_id) => {
    return new Promise((resolve, reject) => {
        let url = `https://api.themoviedb.org/3/movie/${movie_id}/credits?api_key=${API_KEY}`;
        request(url, {json: true}, function (error, response, body) {
            resolve(body);
        });
    });
}
module.exports.movie_cast = movie_cast;