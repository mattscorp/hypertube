'use strict'

const express = require('express');
let app = express();
const ent = require('ent');
const cors = require('cors')
const bodyParser = require('body-parser');
const session = require('express-session');
const uuidv4 = require('uuid/v4');
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
const connection = require('../../model/connection.js');
const router = express.Router();
app.use(session({
    secret:'343ji43j4n3jn4jk3n',
    resave: true,
    saveUninitialized: false
}));

const user = require('../../model/connection.js');


router.options('*', cors())
router.use(cors());
router.post('/auth', async (req, res) => {
  const action = req.body.body.split('"')[1];
  const login = (req.body.body.split('login: ')[1]).split('"')[1];
  const pre_password = (req.body.body.split('password: ')[1]).split('"')[1];
  const password = ent.encode(pre_password);
  if (!action || (action != 'creation' && action != 'login')) {
    res.send("Action needs to be set to 'creation' or to 'login'");
  } else if (!password || !login || password.trim().length === 0 || login.trim().length === 0) {
    res.status(400);
    res.send("The following variables must be completed: 'password', 'login'");
  } else {
    // Connection to the account
    if (action == 'login') {
      let connection = await user.user_connect(login, password);
      if (connection == '0') {
          res.status(200);
          res.send("Connection refused: the login or password is wrong.");
      } else {
          res.status(200);
          res.send({token: connection});
      }
      // Account creation
    } else if (action == 'creation') {
      let first_name = (req.body.body.split('first_name: ')[1]).split('"')[1];
      let last_name = (req.body.body.split('last_name: ')[1]).split('"')[1];
      let email = (req.body.body.split('email: ')[1]).split('"')[1];
      let confirm_password = (req.body.body.split('confirm_password: ')[1]).split('"')[1];
      if (confirm_password != password) {
        res.status(200);
        res.send('Passwords don\'t match');
      } else {
        if (await user.user_exists_login(login) != 'vide') {
          res.status(418);;
          res.send('This login is already in use');
        } else if (await user.user_exists_email(email) != 'vide') {
          res.status(418);;
          res.send('This email is already in use');
        } else {
          user.post_users(last_name, first_name, login, email, password);
          res.status(201);
          res.send('The user has been created');
        }
      }
    }
  }
});
module.exports = router;