'use strict'
const bcrypt = require('bcryptjs');
const uuidv4 = require('uuid/v4');

// mysql connection credentials
const db_connect = require('../model/db_connect.js');
let con = db_connect.con;

// Returns a crypted password
const crypted_password = async (password) => {
    return new Promise((resolve, reject) => {
        bcrypt.hash(password, 12, function(err, hash) {
            if (err)
                throw err;
            else
                resolve(hash);
        });
    });
}

// Checks whether the user credentials are valid
//      --> if successful, resolves the uuid
//      --> if not, resolves '0'
const user_connect = async (login, password) => {
    return new Promise((resolve, reject) => {
        let sql = "SELECT * FROM `users` WHERE `login` = ?";
        con.query(sql, [login], async (err, result) => {
            if (err)
                throw err;
            else if (result != '') {
                console.log('Connection : ' + password);
                console.log('Connection result : ' + result[0].password);
                bcrypt.compare(result[0].password, password, function (err, res) {
                    console.log(res);
                    if (res === true) {
                        console.log(res);
                        resolve(result[0].uuid);
                    }
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
const post_users = async (last_name, first_name, login, email, password) => {
    console.log(password);
    let sql = "INSERT INTO `users` (`uuid`, `language`, `last_name`, `first_name`, `login`, `email`, `password`) VALUES (?)";
    let uuid = uuidv4();
    console.log('Creation : ' + password);
    let crypted_pass = await crypted_password(password);
    console.log('Creation crypted : ' + crypted_pass);
    let sql_values = [uuid, 'English', last_name, first_name, login, email, crypted_pass];
    con.query(sql, [sql_values], (err, result) => {
        if (err)
            throw err;
    })
}
module.exports.post_users = post_users;

