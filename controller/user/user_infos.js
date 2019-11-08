'use strict'

const express = require('express');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const router = express.Router();
const with_auth = require('./authentification_middleware');
const user = require('../../model/connection.js');
const user_infos = require('../../model/user_infos_model.js');

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

// **** UPDATE USER INFORMATION (login, email, first and last name) **** //
router.post('/update_account', with_auth, async (req, res) => {
    let login = req.body.body.split('login: "')[1].split('"')[0];
    let email = req.body.body.split('email: "')[1].split('"')[0];
    let first_name = req.body.body.split('first_name: "')[1].split('"')[0];
    let last_name = req.body.body.split('last_name: "')[1].split('"')[0];
    user_infos.update_user_infos(login, first_name, last_name, email, req.uuid);
    res.status(201).send('User information updated');
});

// **** CHANGE PASSWORD **** //
router.post('/update_password', with_auth, async (req, res) => {
    let new_password = req.body.body.split('new_password: "')[1].split('"')[0];
    let confirm_password = req.body.body.split('confirm_password: "')[1].split('"')[0];
    let old_password = req.body.body.split('old_password: "')[1].split('"')[0];
    let login = req.body.body.split('login: "')[1].split('"')[0];
    if (new_password !== confirm_password)
        res.status(418).send('Passwords don\'t match');
    else {
        let uuid = await user.user_connect(login, old_password);
        if (uuid == '0') {
          res.status(401);
          res.send("Connection refused: the password is wrong.");
        } else {
            user_infos.update_password(new_password, req.uuid);
            res.status(201).send('User information updated');
        }
    }
});

// **** UPDATE DARK MODE **** //
router.post('/dark_mode', with_auth, async(req, res) => {
    let infos = await user.get_users(req.uuid);
    user_infos.dark_mode_update((JSON.parse(infos))[0].dark_mode, req.uuid);
})


module.exports = router;