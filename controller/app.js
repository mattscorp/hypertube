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

/**** ACCOUNT INFORMATION ****/
// Get user information (from the cookies)
const user_infos = require('./user/user_infos.js');
app.use(user_infos);

/**** API THEMOVIEDB.ORG ****/
const themoviedb = require('./themoviedb/themoviedb.js');
app.use(themoviedb);

/**** ADD / GET COMMENT ****/
const comment = require('./comment.js');
app.use(comment);

/**** ADD / GET RATING ****/
const rating = require('./rating.js');
app.use(rating);

// /**** ERROR 404 ****/
// router.get('*', (req, res) => {
//   if (req.query.movie_id && req.query.movie !== "") {
//     res.sendFile(path.join(__dirname, './index.html'));
//   }
// });
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, './index.html'));
});

// listen for requests
app.listen(config.PORT, () => {
  console.log("Server is listening on port " + config.PORT);
});