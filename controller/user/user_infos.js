'use strict'

const express = require('express');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const router = express.Router();
const config = require('../config');
const with_auth = require('./authentification_middleware');
const user = require('../../model/connection.js');
const jwt = require('jsonwebtoken');

router.use(cookieParser());
router.use(bodyParser.json());
router.use(bodyParser.urlencoded({ extended: true }));

// Allow Cross-origin requests
const cors = require('cors')
router.options("http://localhost:3000", cors());
router.use(cors({origin: "http://localhost:3000", credentials: true}));

// **** GET USER INFORMATION FROM THE COOKIES **** //
router.post('/user_infos', with_auth, async (req, res) => {
    let user_infos = await user.get_users(req.uuid);
    res.status(200).send(user_infos);
});

module.exports = router;