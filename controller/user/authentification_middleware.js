'use strict'

const jwt = require('jsonwebtoken');
const config = require('../config');
const secret = config.SESS_SECRET;

// Decode the token from the cookie, and checks whether the user is authentificated

const with_auth =  (req, res, next) => {
    const token = req.headers.cookie.split('=')[1].split(';')[0];
    console.log(token);
    if (token == undefined || !token)
        res.status(401).send('Unauthorized: No token provided');
    else {
        jwt.verify(token, secret, (err, decoded) => {
            if (err)
                res.status(401).send('Unauthorized: Invalid token');
            else {
                req.uuid = decoded.connection;
                next();
            }
        });
    }
}
module.exports = with_auth;