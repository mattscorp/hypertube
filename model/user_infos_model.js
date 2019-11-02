'use strict'

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