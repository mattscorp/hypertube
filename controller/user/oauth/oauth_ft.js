

const request = require('request');
const express = require('express');
const router = express.Router();
const config = require('../../config');
const model_connect = require('../../../model/connection.js')
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

// *** Connection with 42 OAuth2 *** //
router.post('/oauth_ft', async (req, res) => {
    let token = req.body.code;
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
                        let user_login = JSON.parse(body).login;
                        let user_first_name = JSON.parse(body).first_name;
                        let user_last_name = JSON.parse(body).last_name;
                        let user_image_url = JSON.parse(body).image_url;
                        let user_language = (JSON.parse(body).campus[0]).language.name;
                        let user_exists = await model_connect.user_exists_login_oauth(user_login, 'ft');
                        if (user_exists == 'vide') {
                            let uuid = await model_connect.post_users_oauth_ft(user_last_name, user_first_name, user_login, user_email, user_language, user_image_url)
                            // Issuing authentification token
                            const payload = { uuid } ;
                            const cookie_token = jwt.sign(payload, config.SESS_SECRET, {
                            expiresIn: '1h'
                            });
                            res.status(201).cookie('token', cookie_token, { httpOnly: true }).send({token: cookie_token});
                        }
                        else {
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