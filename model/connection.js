'use strict'
const bcrypt = require('bcryptjs');
const uuidv4 = require('uuid/v4');
const ent = require('ent');

// mysql connection credentials
const db_connect = require('../model/db_connect.js');
let con = db_connect.con;

// Checks whether the user credentials are valid
//      --> if successful, resolves the uuid
//      --> if not, resolves '0'
const user_connect = async (login, password) => {
    return new Promise((resolve, reject) => {
        let sql = "SELECT * FROM `users` WHERE `login` = ?";
        con.query(sql, [login], (err, result) => {
            if (err)
                throw err;
            else if (result != '') {
                bcrypt.compare(ent.encode(result[0].password), password, function (err, result) {
                    if (result === true)
                        resolve(result[0].uuid);
                    else
                        resolve('0');
                });
            } else {
                resolve('0');
            }
        });
    });
}
module.exports.user_connect = user_connect;

// Return all information (except the password) from users based on the user_uuid
const get_users = async (user_uuid) => {
    return new Promise((resolve, reject) => {
        con.query("SELECT `user_ID`, `uuid`, `language`, `last_name`, `first_name`, `login`, `email_confirmation`, `insta`, `facebook`, `github`, `42`, `nb_views`, `nb_comments`, `nb_ratings`, `profile_picture` FROM `users` WHERE `uuid` = ?", [user_uuid], (err, result) => {
            if (err)
                throw err;
            else {
                resolve(JSON.stringify(result));
            }
        });
    });
}
module.exports.get_users = get_users;

// Return all information (except the password) from users based on the login
const get_users_login = async (login) => {
    return new Promise((resolve, reject) => {
        con.query("SELECT `user_ID`, `uuid`, `language`, `last_name`, `first_name`, `login`, `email_confirmation`, `insta`, `facebook`, `github`, `42`, `nb_views`, `nb_comments`, `nb_ratings`, `profile_picture` FROM `users` WHERE `login` = ?", [login], (err, result) => {
            if (err)
                throw err;
            else {
                if (result == '') {
                    resolve('vide');
                } else
                    resolve(JSON.stringify(result));
            }
        });
    });
}
module.exports.get_users_login = get_users_login;

// Create a user (no OAuth)
const post_users = (last_name, first_name, login, email, password) => {
    let sql = "INSERT INTO `users` (`uuid`, `language`, `last_name`, `first_name`, `login`, `email`, `password`) VALUES (?)";
    let uuid = uuidv4();
    let sql_values = [uuid, 'English', last_name, first_name, login, email, password];
    con.query(sql, [sql_values], (err, result) => {
        if (err)
            throw err;
    })
}
module.exports.post_users = post_users;

