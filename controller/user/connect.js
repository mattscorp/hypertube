'use strict'

const express = require('express');
let app = express();
const ent = require('ent');
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

router.post('/auth', async (req, res) => {
    if (!req.body.action || (req.body.action != 'signup' && req.body.action != 'login')) {
      res.status(400);
      res.send("Action needs to be set to 'signup' or to 'login'");
    } else if (!req.body.password || !req.body.login || req.body.password.trim().length === 0 || req.body.login.trim().length === 0) {
      res.status(400);
      res.send("The following variables must be completed: 'password', 'login'");
    } else {
      if (req.body.action == 'login') {
        console.log('Tentative de connection : ' + req.body.login + req.body.password);
        let connection = await user.user_connect(req.body.login, req.body.password);
        if (connection == '0') {
            res.status(200);
            res.send("Connection refused: the login or password is wrong.");
        } else {
            res.status(200);
            res.send(connection);
        }
      }
      else {
        console.log('creation de compte TBD ' + req.body);
        res.send('creation de compte TBD ' + req.body);
      }
    }
  });

module.exports = router;