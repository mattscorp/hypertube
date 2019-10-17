// curl https://api.themoviedb.org/3/authentication/token/new?api_key=208ecb5c1ee27eb7b9bc731dc8656bd2;

var request = require('request');
// request('https://api.themoviedb.org/3/authentication/token/new?api_key=208ecb5c1ee27eb7b9bc731dc8656bd2', function (error, response, body) {
//   console.log('error:', error); // Print the error if one occurred
//   let token = JSON.stringify(body);
//   console.log('token = ' + token.split("\\")[9].split('"')[1]);
//   console.log('statusCode:', response && response.statusCode); // Print the response status code if a response was received
//   console.log('body:', body); // Print the HTML for the Google homepage.
// });

const API_KEY = "208ecb5c1ee27eb7b9bc731dc8656bd2";

// GET the most popular movies
/*
let sql = `https://api.themoviedb.org/3/discover/movie?api_key=${API_KEY}&sort_by=popularity.desc`
request(sql, function (error, response, body) {
  console.log('error:', error); // Print the error if one occurred
  console.log('statusCode:', response && response.statusCode); // Print the response status code if a response was received
  console.log('body:', body.split('{')[1].split('}')[0]); // Print the HTML for the Google homepage.
});
*/

// GET search a movie by name
/*
let name = "rocky II";
let sql = `https://api.themoviedb.org/3/search/movie?api_key=${API_KEY}&query=${name}`;
request(sql, function (error, response, body) {
    console.log('error:', error); // Print the error if one occurred
    console.log('statusCode:', response && response.statusCode); // Print the response status code if a response was received
    console.log('body:', body); // Print the HTML for the Google homepage.
});
*/

let genres =  {
  "Action": 28,
  "Adventure": 12,
  "Animation": 16,
  "Comedy": 35,
  "Crime": 80,
  "Documentary": 99,
  "Drama": 18,
  "Family": 10751,
  "Fantasy": 14,
  "History": 36,
  "Horror": 27,
  "Music": 10402,
  "Mystery": 9648,
  "Romance": 10749,
  "Science Fiction": 878,
  "TV Movie": 10770,
  "Thriller": 53,
  "War": 10752,
  "Western": 37
}
console.log(genres["Western"]);