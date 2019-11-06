'use strict'

const request = require('request');
const express = require('express');
const router = express.Router();
const config = require('../../config');
const model_connect = require('../../../model/connection.js');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const jwt = require('jsonwebtoken');

// Allow Cross-origin requests
const cors = require('cors')
router.options("http://localhost:3000", cors());
router.use(cors({origin: "http://localhost:3000", credentials: true}));

router.use(cookieParser());
router.use(bodyParser.json());
router.use(bodyParser.urlencoded({ extended: true }));

// *** Connection with Google OAuth2 *** //
router.post('/oauth_google', async (req, res) => {
  let token = req.body.code;
  let google_req_token = `https://oauth2.googleapis.com/token`;
  let redirect_uri = 'http://localhost:3000/oauth_google';
  let grant_type = "authorization_code";
  request.post(google_req_token,
  {form:{code: token, client_id: config.CLIENT_GOOGLE, client_secret: config.SECRET_GOOGLE, redirect_uri: redirect_uri, grant_type: grant_type}},
  function(err, httpResponse, body) {
    if (err) throw err;
    else {
      let user_token = (JSON.parse(body)).access_token;
      if (user_token == undefined) {
          res.status(401).send('Unauthorized: authentification with Google failed');
      }
      else {
        let google_req_me = `https://openidconnect.googleapis.com/v1/userinfo?`;
        request.get(google_req_me, {headers:{'Authorization': `Bearer ${user_token}`}}, async (err, httpResponse, body) => {
          if (err) {
              res.status(401).send('Error connecting to Google');
              throw err;
          }
          else {
            let user_image_url = (JSON.parse(body)).picture;
            let user_email = (JSON.parse(body)).email;
            let user_verfied = (JSON.parse(body)).email_verified;
            if (user_verfied === false)
              res.status(401).send('Error connecting to Google');
            else {
              let user_exists = await model_connect.user_exists_login_oauth(user_email, 'google');
              if (user_exists == 'vide') {
                let uuid = await model_connect.post_users_oauth(user_email, user_email, user_image_url, 'google');
                // Issuing authentification token
                const payload = { uuid } ;
                const cookie_token = jwt.sign(payload, config.SESS_SECRET, {
                  expiresIn: '1h'
                });
                res.status(201).cookie('token', cookie_token, { httpOnly: true }).send({token: cookie_token});
              } else {
                // Issuing authentification token
                let uuid = (JSON.parse(user_exists))[0].uuid;
                const payload = { uuid } ;
                const cookie_token = jwt.sign(payload, config.SESS_SECRET, {
                  expiresIn: '1h'
                });
                res.status(200).cookie('token', cookie_token, { httpOnly: true }).send({token: cookie_token});
              }
            }
          }
        });
      }
    }
  });
});

module.exports = router;