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

// *** Connection with Instagram OAuth2 *** //
router.post('/oauth_insta', async (req, res) => {
    let token = req.body.code;
    let insta_req_token = `https://api.instagram.com/oauth/access_token`;
    let redirect_uri = 'http://localhost:3000/oauth_insta';
    let grant_type = "authorization_code";
    request.post(insta_req_token, {form:{code: token, client_id: config.CLIENT_INSTA, client_secret: config.SECRET_INSTA, redirect_uri: redirect_uri, grant_type: grant_type}},
    async function(err, httpResponse, body) {
        if (err) throw err;
        else {
            if ((JSON.parse(body)).user == undefined) {
                console.log('Authorization denied');
                res.status(401).send('Unauthorized: authentification with Instagram failed');
            } else {
                let user_login = (JSON.parse(body)).user.username;
                let image_url = (JSON.parse(body)).user.profile_picture;
                let user_first_name = (JSON.parse(body)).user.full_name.split(' ')[0];
                let user_last_name = (JSON.parse(body)).user.full_name.split(' ')[1];
                let user_exists = await model_connect.user_exists_login(user_login);
                if (user_exists == 'vide') {
                    let user_login = (JSON.parse(body)).user.username;
                    let uuid = await model_connect.post_users_oauth_insta(user_login, user_first_name, user_last_name, image_url)
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
});

module.exports = router;