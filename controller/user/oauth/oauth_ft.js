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

// *** Connection with 42 OAuth2 *** //
router.post('/oauth_ft', async (req, res) => {
    console.log('*** 42 POST ***');
    let token = req.body.code;
    console.log('token : ' + config.UUID_42);
    let ft_req_token = `https://api.intra.42.fr/oauth/token`;
    request.post(ft_req_token,
      {form:{grant_type: 'authorization_code', client_id: config.UUID_42, client_secret: config.SECRET_42, code: token, redirect_uri: 'http://localhost:3000/oauth_ft'}},
      function(err,httpResponse,body){
        if (err) throw err;
        else {
            let user_token = (JSON.parse(body).access_token);
            if (user_token == undefined) {
                console.log('Authorization denied');
                res.status(401).send('Unauthorized: authentification with 42 failed');
            }
            else {
                let ft_req_me = `https://api.intra.42.fr/v2/me`;
                request.get(ft_req_me, {headers:{Authorization: `Bearer ${user_token}`}}, async (err, httpResponse, body) => {
                    if (err) {
                        res.status(401).send('Error connecting to 42');
                        throw err;
                    }
                    else {
                        let user_email = JSON.parse(body).email;
                        console.log('email : ' + user_email);
                        let user_login = JSON.parse(body).login;
                        console.log('login : ' + user_login);
                        let user_first_name = JSON.parse(body).first_name;
                        console.log('first_name : ' + user_first_name);
                        let user_last_name = JSON.parse(body).last_name;
                        console.log('last_name : ' + user_last_name);
                        let user_image_url = JSON.parse(body).image_url;
                        console.log('image_url : ' + user_image_url);
                        let user_language = (JSON.parse(body).campus[0]).language.name;
                        console.log('language : ' + user_language);
                        let user_exists = await model_connect.user_exists_login(user_login);
                        if (user_exists == 'vide') {
                            model_connect.post_users_oauth(user_last_name, user_first_name, user_login, user_email, user_language, user_image_url, '42')
                            console.log('UNKNOWN USER --> creating new');
                            res.status(201).send('UNKNOWN USER --> creating new');
                        }
                        else {
                            console.log('USER EXISTS --> ' + (user_exists));
                            res.status(200).send('USER EXISTS --> ' + (user_exists));
                        }
                    }
                })
                res.status(200).send('ROGER');
            }
        }
      });
  });

module.exports = router;