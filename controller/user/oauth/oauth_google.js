'use strict'

const request = require('request');
const express = require('express');
const router = express.Router();
const config = require('../../config');
const model_connect = require('../../../model/connection.js')

// Allow Cross-origin requests
const cors = require('cors')
router.options("http://localhost:3000", cors());
router.use(cors({origin: "http://localhost:3000", credentials: true}));

// *** Connection with Google OAuth2 *** //
router.post('/oauth_google', async (req, res) => {
    console.log('*** Google POST ***');
    let token = req.body.code;
    console.log('token : ' + token);
    console.log('config.CLIENT_GOOGLE : ' + config.CLIENT_GOOGLE);
    console.log('config.SECRET_GOOGLE : ' + config.SECRET_GOOGLE);
    let google_req_token = `https://oauth2.googleapis.com/token`;
    let redirect_uri = 'http://localhost:3000/oauth_google';
    let grant_type = "authorization_code";
    request.post(google_req_token,
      {form:{code: token, client_id: config.CLIENT_GOOGLE, client_secret: config.SECRET_GOOGLE, redirect_uri: redirect_uri, grant_type: grant_type}},
      function(err, httpResponse, body) {
            if (err) throw err;
            else {
              // let access_token = (JSON.stringify(body)).split('access_token": ""')[1];
              let user_token = (JSON.parse(body)).access_token;
              console.log(' RESPONSE FROM GOOGLE : ' + body);
              console.log(' ACCESS TOKEN : ' + user_token);
              if (user_token == undefined) {
                  console.log('Authorization denied');
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
                    console.log('email verified : ' + user_verfied);
                    console.log('email : ' + user_email);
                    console.log('image_url : ' + user_image_url);
                    console.log('*******RESPoNSE******\n\n ' + body);
                    if (user_verfied === false)
                      res.status(401).send('Error connecting to Google');
                    else {
                      let user_exists = await model_connect.user_exists_email(user_email);
                      if (user_exists == 'vide') {
                        model_connect.post_users_oauth(user_email, user_email, user_image_url, 'google')
                        console.log('UNKNOWN USER --> creating new');
                        res.status(201).send('UNKNOWN USER --> creating new');
                      } else {
                        console.log('USER EXISTS --> ' + (user_exists));
                        res.status(200).send('USER EXISTS --> ' + (user_exists));
                      }
                    }
                  }
                });
              }
            }
        });
  });

module.exports = router;