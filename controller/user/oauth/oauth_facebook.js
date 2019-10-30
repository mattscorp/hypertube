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

// *** Connection with Facebook OAuth2 *** //
router.post('/oauth_facebook', async (req, res) => {
    let token = req.body.code;
    let facebook_req_token = `https://graph.facebook.com/v5.0/oauth/access_token`;
    let redirect_uri = 'http://localhost:3000/oauth_facebook';
    request.post(facebook_req_token, {form:{code: token, client_id: config.CLIENT_FACEBOOK, client_secret: config.SECRET_FACEBOOK, redirect_uri: redirect_uri}},
    async function(err, httpResponse, body) {
        if (err) throw err;
        else {
            let user_token = (JSON.parse(body)).access_token;
            if (user_token == undefined) {
                console.log('Authorization denied');
                res.status(401).send('Unauthorized: authentification with Facebook failed');
            } else {
                let facebook_req_me = `https://graph.facebook.com/debug_token?input_token=${user_token}&access-token=${config.CLIENT_FACEBOOK}`;
                request.get(facebook_req_me, {headers:{'Authorization': `Bearer ${user_token}`}}, async (err, httpResponse, body) => {
                    if (err) {
                        res.status(401).send('Error connecting to Facebook');
                        throw err;
                    }
                    else {
                        let user_ID = '';
                        let user_ID_URL = '';
                        if ((JSON.parse(body)).data == undefined)
                            res.status(401).send('Error connecting to Facebook');
                        else {
                            user_ID = (JSON.parse(body)).data.user_id;
                            user_ID_URL = `https://graph.facebook.com/v5.0/${user_ID}?&fields=id,first_name,last_name&access-token=${user_token}/`;
                            request.get(user_ID_URL, {headers:{'Authorization': `Bearer ${user_token}`}}, async (err, httpResponse, body) => {
                                if (err) throw err;
                                else{
                                    let user_infos_id = (JSON.parse(body)).id;
                                    if(user_infos_id == undefined)
                                        res.status(401).send('Error connecting to Facebook');
                                    else {
                                        let user_infos_last_name = (JSON.parse(body)).last_name;
                                        let user_infos_first_name = (JSON.parse(body)).first_name;
                                        let user_exists = await model_connect.user_exists_login(user_infos_id);
                                        if (user_exists == 'vide') {
                                            model_connect.post_users_oauth_facebook(user_infos_id, user_infos_first_name, user_infos_last_name);
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
            }
        }
    });
});

module.exports = router;