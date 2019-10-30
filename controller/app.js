'use strict'

const express = require('express');
const bodyParser = require('body-parser');
const config = require('./config');
// create express app
const app = express();
// parse requests of content-type - application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: true }))
// parse requests of content-type - application/json
app.use(bodyParser.json())
// CORS requests
const cors = require('cors')
app.options("http://localhost:3000", cors());
app.use(cors({origin: "http://localhost:3000", credentials: true}));
// disables 'x-powered-by', this makes it more difficult for users to see that we are using Express.
app.disable('x-powered-by');

/**** CONNECTION ****/
// Connection / account creation
const user = require('./user/connect.js');
app.use(user);
// Connection with Facebook OAuth2
const oauth_facebook = require('./user/oauth/oauth_facebook.js');
app.use(oauth_facebook);
// Connection with Instagram OAuth2
const oauth_insta = require('./user/oauth/oauth_insta.js');
app.use(oauth_insta);
// Connection with 42 OAuth2
const oauth_ft = require('./user/oauth/oauth_ft.js');
app.use(oauth_ft);
// Connection with Github OAuth2
const oauth_github = require('./user/oauth/oauth_github.js');
app.use(oauth_github);
// Connection with Google OAuth2
const oauth_google = require('./user/oauth/oauth_google.js');
app.use(oauth_google);

/**** API THEMOVIEDB.ORG ****/
const themoviedb = require('./themoviedb/themoviedb.js');
app.use(themoviedb);

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

// listen for requests
app.listen(config.PORT, () => {
  console.log("Server is listening on port " + config.PORT);
});