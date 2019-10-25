const express = require('express');
const mysql = require('mysql');
const cors = require('cors')
const bodyParser = require('body-parser');
const session = require("express-session");
const MySQLStore = require('express-mysql-session')(session); // to store the session data
const config = require('./config');

// create express app
const app = express();

// parse requests of content-type - application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: true }))
// parse requests of content-type - application/json
app.use(bodyParser.json())

app.options("http://localhost:3000", cors());
app.use(cors({origin: "http://localhost:3000", credentials: true}));

app.use(session({
  secret: config.SESS_SECRET,
  resave: true,
  saveUninitialized: false
}));

// const options = {
//   host: config.HOST,
//   port: config.PORT,
//   user: config.USER,
//   password: config.PASSWORD,
//   database: config.DATABASE,
//   charset: 'utf8mb4_bin',
//   connectionLimit : 1000,
//   connectTimeout  : 60 * 60 * 1000,
//   acquireTimeout  : 60 * 60 * 1000,
//   timeout         : 60 * 60 * 1000,
// };

// const session_connection = mysql.createPool(options); // or mysql.createPool(options);
// const sessionStore = new MySQLStore({}/* session store options */, session_connection);

// session_connection.query('SELECT *', (err, result) => {
//   if (err) throw err;
//   else console.log(results);
// });   

// setInterval(() => {
//   session_connection.query('SELECT *', (err, result) => {
//       if (err) throw err;
//       else console.log(results);
//   });   
// }, 1000);

// app.use(session({
//   key: config.SESS_NAME,
//   secret: config.SESS_SECRET,
//   store: sessionStore,
//   resave: true, //This prevents unnecessary re-saves if the session wasn’t modified.
//   saveUninitialized: false, // This complies with laws that require permission before setting a cookie.
//   cookie: {
//     maxAge: parseInt(config.SESS_LIFETIME)
//   }
// }));



// disables 'x-powered-by', this makes it more difficult for users to see that we are using Express.
app.disable('x-powered-by');

// model functions
const connection = require('../model/connection.js');
const films = require('../model/films.js');



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

app.route('/moviedb')
  .get(async (req, res) => {
    console.log("SESSION : " + req.session.token);
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

// Connection / account creation
const user = require('./user/connect.js');
app.use(user);

// listen for requests
app.listen(config.PORT, () => {
  console.log("Server is listening on port " + config.PORT);
});