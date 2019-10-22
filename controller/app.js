const express = require('express');
const cors = require('cors')
const bodyParser = require('body-parser');

// create express app
const app = express();

// model functions
const connection = require('../model/connection.js');
const films = require('../model/films.js');

// parse requests of content-type - application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: true }))
// parse requests of content-type - application/json
app.use(bodyParser.json())

//////// API ////////

// //// USERS ////
// app.route('/users')
// // GET "/users?user=XXX" 
// //    --> Return all but password from the users table
//   .get(async (req, res) => {
//     if (!req.query.user) {
//       res.status(400);
//       res.send("Specify the user_ID as 'user'");
//     } else {
//       let user = JSON.parse(await connection.get_users(req.query.user));
//       if (user == '')
//         res.status(204);
//       else
//         res.status(200);
//       res.json({ user: user});
//     }
//   })
// // POST "/users", req.body = []
// //    --> Create the user in the `users` database
//   .post((req, res) => {
//     if (req.body == '' || !req.body.uuid || !req.body.language || !req.body.last_name || !req.body.first_name || !req.body.login || !req.body.profile_picture || !req.body.login) {
//       res.status(400);
//       res.send("Specify the following : 'uuid', 'language', last_name', 'first_name', 'login', 'profile_picture', 'login'")
//     } else {
//       connection.post_users(req.body);
//       res.status(201);
//       console.log(req.body);
//       res.send("The user has been successfully created");
//       console.log("OK");
//     }
//   });

// //// FILMS db ////
// app.route('/films')
//   .get(async (req, res) => {
//     let film_list = JSON.parse(await films.film_list(req.query.order, (req.query.offset) ? req.query.offset : 0));
//     if (film_list == '')
//       res.status(204);
//     else
//       res.status(200);
//     res.send(film_list);
//   });

// //// API THEMOVIEDB.ORG ////
app.options('*', cors())
app.use(cors());
app.route('/moviedb')
  .get(async (req, res) => {
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
        //console.log("ici" + popular_movies);

        if (popular_movies == '')
          res.status(204);
        else
          res.status(200);
        console.log(popular_movies.results);
        res.send(popular_movies.results);
      }
      // ** SEARCH ** --> search movies by name
      //    "movie_name": 
      else if (req.query.action.toLowerCase() == "search") {
        let search_movies = await films.search_movies(req.query.movie_name);
        if (search_movies == '')
          res.status(204);
        else
          res.status(200);
        res.send(search_movies);
      }
      // ** SIMILAR ** --> get movies that are similar to the parameter "movie_ID"
      else if (req.query.action.toLowerCase() == "similar") {
        console.log(req.query.movie_ID);
        let similar_movies = await films.similar_movies(req.query.movie_ID);
        if (similar_movies == '')
          res.status(204);
        else
          res.status(200);
        res.send(similar_movies);
      }
      // https://developers.themoviedb.org/3/movies/get-similar-movies
    }
  });

// Connection / account creation
const user = require('./user/connect.js');
app.use(user);

// listen for requests
app.listen(8000, () => {
  console.log("Server is listening on port 8000");
});