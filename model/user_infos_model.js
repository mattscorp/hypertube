'use strict'

const connection = require('./connection.js');

// mysql connection credentials
const db_connect = require('../model/db_connect.js');
let con = db_connect.con;

// Update the account information  (login, first_name, last_name, email)
const update_user_infos = (login, first_name, last_name, email, uuid) => {
    let sql = "UPDATE `users` SET `login` = ?, `first_name` = ?, `last_name` = ?, `email` = ? WHERE `uuid` = ?";
    let values = [login, first_name, last_name, email, uuid];
    con.query(sql, values, (err, result) => {
        if (err)
            throw err;
    });
}
module.exports.update_user_infos = update_user_infos;

// Update the account information  (login, first_name, last_name, email)
const update_password = async (password, uuid) => {
    let hash = await connection.crypted_password(password);
    console.log(hash);
    let sql = "UPDATE `users` SET `password` = ? WHERE `uuid` = ?";
    let values = [hash, uuid];
    con.query(sql, values, (err, result) => {
        if (err)
            throw err;
    });
}
module.exports.update_password = update_password;

// Update the dark_mode
const dark_mode_update = (dark_mode, uuid) => {
    let sql = "UPDATE `users` SET `dark_mode` = ? WHERE `uuid` = ?";
    let values = [(dark_mode === 1 ? 0 : 1), uuid];
    con.query(sql, values, (err, result) => {
        if (err)
            throw err;
    });
}
module.exports.dark_mode_update = dark_mode_update;