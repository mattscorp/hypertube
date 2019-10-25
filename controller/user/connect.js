'use strict'

const express = require('express');
let app = express();
const ent = require('ent');
const cors = require('cors')
const bodyParser = require('body-parser');
const session = require("express-session");
const mysql = require('mysql');
const MySQLStore = require('express-mysql-session')(session); // to store the session data
const uuidv4 = require('uuid/v4');
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
const connection = require('../../model/connection.js');
const router = express.Router();
const config = require('../config');
// to create the token
const jwt = require('jsonwebtoken');

const user = require('../../model/connection.js');

// const options = {
//   host: config.HOST,
//   port: config.PORT,
//   user: config.USER,
//   password: config.PASSWORD,
//   database: config.DATABASE,
//   schema: {
//     tableName: 'sessions',
//     columnNames: {
//         session_id: 'session_id',
//         expires: 'expires',
//         data: 'data'
//     }
//   }
// };
// const session_connection = mysql.createConnection(options); // or mysql.createPool(options);
// const sessionStore = new MySQLStore({}/* session store options */, session_connection);

// router.options('*', cors())
// router.use(cors());
// router.use(session({
//   key: config.SESS_NAME,
//   secret: config.SESS_SECRET,
//   store: sessionStore,
//   resave: true, //This prevents unnecessary re-saves if the session wasn’t modified.
//   saveUninitialized: false, // This complies with laws that require permission before setting a cookie.
//   cookie: {
//     maxAge: parseInt(config.SESS_LIFETIME)
//   }
// }));


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

// const session_connection = mysql.createConnection(options); // or mysql.createPool(options);
// const sessionStore = new MySQLStore({}/* session store options */, session_connection);

// connection = mysql.createConnection(db_config); // Recreate the connection, since the old one cannot be reused.

//   connection.connect(function(err) {              // The server is either down
//     if(err) {                                     // or restarting (takes a while sometimes).
//       console.log('error when connecting to db:', err);
//       setTimeout(handleDisconnect, 2000); // We introduce a delay before attempting to reconnect,
//     }                                     // to avoid a hot loop, and to allow our node script to
//   });                                     // process asynchronous requests in the meantime.
//                                           // If you're also serving http, display a 503 error.
//   connection.on('error', function(err) {
//     console.log('db error', err);
//     if(err.code === 'PROTOCOL_CONNECTION_LOST') { // Connection to the MySQL server is usually
//       handleDisconnect();                         // lost due to either server restart, or a
//     } else {                                      // connnection idle timeout (the wait_timeout
//       throw err;                                  // server variable configures this)
//     }
//   });

// router.use(session({
//   key: config.SESS_NAME,
//   secret: config.SESS_SECRET,
//   store: sessionStore,
//   resave: true, //This prevents unnecessary re-saves if the session wasn’t modified.
//   saveUninitialized: false, // This complies with laws that require permission before setting a cookie.
//   cookie: {
//     maxAge: parseInt(config.SESS_LIFETIME)
//   }
// }));



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
      console.log('ICI');
      let connection = await user.user_connect(login, password);
      if (connection == '0') {
          res.status(401);
          res.send("Connection refused: the login or password is wrong.");
      } else {
          req.session.data = connection;
          // Issuing authentification token
          const payload = { connection };
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

router.post('/logout', async (req, res) => {
  try {
    req.session.user = '';
    req.session.token = '';
    console.log(req.session.token);
  } catch (err) {
    res.status(422).send(err);
  }
});

module.exports = router;