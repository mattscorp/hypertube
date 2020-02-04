'use strict'

const jwt = require('jsonwebtoken');
const config = require('../config');
const secret = config.SESS_SECRET;

// Decode the token from the cookie, and checks whether the user is authentificated

const with_auth =  (req, res, next) => {
    if (req.headers.cookie) {
        const token = req.headers.cookie.split('=')[1].split(';')[0];
    if (token == undefined || !token)
            res.status(200).send('Unauthorized: No token provided');
        else {
            jwt.verify(token, secret, (err, decoded) => {
                if (err) {
                    res.status(200).send('Unauthorized: Invalid token');
                } else {
                    req.uuid = decoded.uuid;
                    next();
                }
            });
        }
    } else {
        res.status(200).send('Unauthorized: No token provided');
    }
}
module.exports = with_auth;