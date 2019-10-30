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

// *** Connection with Instagram OAuth2 *** //
router.post('/oauth_insta', async (req, res) => {
    console.log('*** Insta POST ***');
    let token = req.body.code;
    console.log('token : ' + token);
    console.log('config.CLIENT_INSTA : ' + config.CLIENT_INSTA);
    console.log('config.SECRET_INSTA : ' + config.SECRET_INSTA);
    let insta_req_token = `https://api.instagram.com/oauth/access_token`;
    let redirect_uri = 'http://localhost:3000/oauth_insta';
    let grant_type = "authorization_code";
    request.post(insta_req_token, {form:{code: token, client_id: config.CLIENT_INSTA, client_secret: config.SECRET_INSTA, redirect_uri: redirect_uri, grant_type: grant_type}},
    async function(err, httpResponse, body) {
        if (err) throw err;
        else {
            console.log(' RESPONSE FROM INSTA : ' + body);
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
                    model_connect.post_users_oauth_insta(user_login, user_first_name, user_last_name, image_url)
                    console.log('UNKNOWN USER --> creating new');
                    res.status(201).send('UNKNOWN USER --> creating new');
                } else {
                    console.log('USER EXISTS --> ' + (user_exists));
                    res.status(200).send('USER EXISTS --> ' + (user_exists));
                }
            }
        }
    });
});

module.exports = router;