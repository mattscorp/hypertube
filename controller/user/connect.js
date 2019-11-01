'use strict'

// to post http requests
const express = require('express');
const ent = require('ent');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const router = express.Router();
const config = require('../config');
// to create the token
const jwt = require('jsonwebtoken');
const with_auth = require('./authentification_middleware');
const user = require('../../model/connection.js');

router.use(cookieParser());
router.use(bodyParser.json());
router.use(bodyParser.urlencoded({ extended: true }));

// Allow Cross-origin requests
const cors = require('cors')
router.options("http://localhost:3000", cors());
router.use(cors({origin: "http://localhost:3000", credentials: true}));

// **** CONNECT OR CREATE AN ACCOUNT (no third-parties) **** //
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
      let uuid = await user.user_connect(login, password);
      if (uuid == '0') {
          res.status(401);
          res.send("Connection refused: the login or password is wrong.");
      } else {
          // Issuing authentification token
          const payload = { uuid };
          const token = jwt.sign(payload, config.SESS_SECRET, {
            expiresIn: '1h'
          });
          res.status(200);
          res.cookie('token', token, { httpOnly: true }).send({token: token});
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
          res.status(418);
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

// **** LOGOUT **** //

router.post('/logout', with_auth, async (req, res) => {
  try {
    res.status(200).cookie('token', null, { httpOnly: true }).send("The user has been successfully disconnected");
  } catch (err) {
    res.status(422).send(err);
  }
});

module.exports = router;