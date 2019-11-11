'use strict'

const request = require('request');
const express = require('express');
const router = express.Router();
const config = require('../../config');
const model_connect = require('../../../model/connection.js');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const jwt = require('jsonwebtoken');

router.use(cookieParser());
router.use(bodyParser.json());
router.use(bodyParser.urlencoded({ extended: true }));

// Allow Cross-origin requests
const cors = require('cors')
router.options("http://localhost:3000", cors());
router.use(cors({origin: "http://localhost:3000", credentials: true}));

// *** Connection with Github OAuth2 *** //
router.post('/oauth_github', async (req, res) => {
    let token = req.body.code;
    let github_req_token = `https://github.com/login/oauth/access_token`;
    request.post(github_req_token,
      {form:{client_id: config.CLIENT_GITHUB, client_secret: config.SECRET_GITHUB, code: token, redirect_uri: 'http://localhost:3000/oauth_github'}},
      function(err, httpResponse, body){
        if (err) throw err;
        else {
            let user_token = body.split('=')[1].split('&')[0];
            if (user_token == undefined) {
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
                        let user_email = JSON.parse(body).email;
                        let user_login = JSON.parse(body).login;
                        let user_image_url = JSON.parse(body).avatar_url;
                        let user_exists = await model_connect.user_exists_login_oauth(user_login, 'github');
                        if (user_exists == 'vide') {
                            let uuid = await model_connect.post_users_oauth(user_login, user_email, user_image_url, 'github')
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
                })
            }
        }
      });
  });

module.exports = router;