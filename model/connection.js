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
module.exports.crypted_password = crypted_password;

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
                bcrypt.compare(password, result[0].password, function (err, res) {
                    if (res === true) {
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
        con.query("SELECT `user_ID`, `uuid`, `language`, `last_name`, `first_name`, `login`, `email`, `email_confirmation`, `insta`, `facebook`, `github`, `ft`, `google`, `nb_views`, `nb_comments`, `nb_ratings`, `profile_picture`, `dark_mode` FROM `users` WHERE `uuid` = ?", [user_uuid], (err, result) => {
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
const user_exists_login_oauth = async (login, oauth) => {
    return new Promise((resolve, reject) => {
        con.query("SELECT `user_ID`, `uuid`, `language`, `last_name`, `first_name`, `login`, `email`, `email_confirmation`, `insta`, `facebook`, `github`, `ft`, `google`, `nb_views`, `nb_comments`, `nb_ratings`, `profile_picture` FROM `users` WHERE `" + oauth + "` = ?", [login], (err, result) => {
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
module.exports.user_exists_login_oauth = user_exists_login_oauth;

// Return all information (except the password) from users based on the login
const user_exists_login = async (login) => {
    return new Promise((resolve, reject) => {
        con.query("SELECT `user_ID`, `uuid`, `language`, `last_name`, `first_name`, `login`, `email`, `email_confirmation`, `insta`, `facebook`, `github`, `ft`, `google`, `nb_views`, `nb_comments`, `nb_ratings`, `profile_picture` FROM `users` WHERE `login` = ?", [login], (err, result) => {
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
module.exports.user_exists_login = user_exists_login;

// Return all information (except the password) from users based on the email
const user_exists_email = async (email) => {
    return new Promise((resolve, reject) => {
        con.query("SELECT `user_ID`, `uuid`, `language`, `last_name`, `first_name`, `login`, `email`, `email_confirmation`, `insta`, `facebook`, `github`, `ft`, `google`, `nb_views`, `nb_comments`, `nb_ratings`, `profile_picture` FROM `users` WHERE `email` = ?", [email], (err, result) => {
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
module.exports.user_exists_email = user_exists_email;

// Create a user (no OAuth)
const post_users = async (last_name, first_name, login, email, password) => {
    return new Promise(async (resolve, resject) => {
        let sql = "INSERT INTO `users` (`uuid`, `language`, `last_name`, `first_name`, `login`, `email`, `password`, `email_confirmation`) VALUES (?)";
        let uuid = uuidv4();
        let email_confirmation = uuidv4();
        let crypted_pass = await crypted_password(password);
        let sql_values = [uuid, 'English', last_name, first_name, login, email, crypted_pass, email_confirmation];
        con.query(sql, [sql_values], (err, result) => {
            if (err)
                throw err;
        });
        resolve(email_confirmation);
    });
}
module.exports.post_users = post_users;

// Create a user (with OAuth)
const post_users_oauth = async (login, email, profile_picture, oauth) => {
    return new Promise((resolve, reject) => {
        let log = login.split('@')[0];
        let sql = "INSERT INTO `users` (`uuid`, `language`, `login`, `email`, `profile_picture`, `" + oauth + "`) VALUES (?)";
        let uuid = uuidv4();
        let sql_values = [uuid, 'English', log, email, profile_picture, login];
        con.query(sql, [sql_values], (err, result) => {
            if (err)
                throw err;
            else
                resolve(uuid);
            })
    });
}
module.exports.post_users_oauth = post_users_oauth;

// Create a user ft
const post_users_oauth_ft = async (last_name, first_name, login, email, language, profile_picture) => {
    return new Promise((resolve, reject) => {
        let sql = "INSERT INTO `users` (`uuid`, `first_name`, `last_name`, `language`, `login`, `email`, `profile_picture`, `ft`) VALUES (?)";
        let uuid = uuidv4();
        let sql_values = [uuid, first_name, last_name, language, login, email, profile_picture, login];
        con.query(sql, [sql_values], (err, result) => {
            if (err)
                throw err;
            else
                resolve(uuid);
            })
    });
}
module.exports.post_users_oauth_ft = post_users_oauth_ft;

// Create a user Insta
const post_users_oauth_insta = async (login, first_name, last_name, profile_picture) => {
    return new Promise((resolve, reject) => {
        let sql = "INSERT INTO `users` (`uuid`, `language`, `login`, `first_name`, `last_name`, `profile_picture`, `insta`) VALUES (?)";
        let uuid = uuidv4();
        let sql_values = [uuid, 'English', login, first_name, last_name, profile_picture, login];
        con.query(sql, [sql_values], (err, result) => {
            if (err)
                throw err;
        });
        resolve(uuid);
    });
}
module.exports.post_users_oauth_insta = post_users_oauth_insta;

// Create a user Facebook
const post_users_oauth_facebook = async (login, first_name, last_name) => {
    return new Promise((resolve, reject) => {
        let sql = "INSERT INTO `users` (`uuid`, `language`, `login`, `first_name`, `last_name`, `facebook`) VALUES (?)";
        let uuid = uuidv4();
        let new_login = first_name + '_' + last_name;
        let sql_values = [uuid, 'English', new_login, first_name, last_name, login];
        con.query(sql, [sql_values], (err, result) => {
            if (err)
                throw err;
        });
        resolve(uuid);
    });
}
module.exports.post_users_oauth_facebook = post_users_oauth_facebook;