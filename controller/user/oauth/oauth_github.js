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

// *** Connection with Github OAuth2 *** //
router.post('/oauth_github', async (req, res) => {
    console.log('*** Github POST ***');
    let token = req.body.code;
    console.log('token : ' + token);
    let github_req_token = `https://github.com/login/oauth/access_token`;
    request.post(github_req_token,
      {form:{client_id: config.CLIENT_GITHUB, client_secret: config.SECRET_GITHUB, code: token, redirect_uri: 'http://localhost:3000/oauth_github'}},
      function(err, httpResponse, body){
        if (err) throw err;
        else {
            let user_token = body.split('=')[1].split('&')[0];
            if (user_token == undefined) {
                console.log('Authorization denied');
                res.status(401).send('Unauthorized: authentification with Github failed');
            }
            else {
                let github_req_me = `https://api.github.com/user`;
                request.get(github_req_me, {headers:{'User-Agent': 'node.js', score: 'user', 'Authorization': `bearer ${user_token}`}}, async (err, httpResponse, body) => {
                    if (err) {
                        res.status(401).send('Error connecting to Github');
                        throw err;
                    }
                    else {
                        console.log(JSON.parse(body));
                        let user_email = JSON.parse(body).email;
                        console.log('email : ' + user_email);
                        let user_login = JSON.parse(body).login;
                        console.log('login : ' + user_login);
                        let user_image_url = JSON.parse(body).avatar_url;
                        console.log('image_url : ' + user_image_url);
                        let user_exists = await model_connect.user_exists_login(user_login);
                        if (user_exists == 'vide') {
                            model_connect.post_users_oauth(user_login, user_email, user_image_url, 'github')
                            console.log('UNKNOWN USER --> creating new');
                            res.status(201).send('UNKNOWN USER --> creating new');
                        }
                        else {
                            console.log('USER EXISTS --> ' + (user_exists));
                            res.status(200).send('USER EXISTS --> ' + (user_exists));
                        }
                    }
                })
            }
        }
      });
  });

module.exports = router;