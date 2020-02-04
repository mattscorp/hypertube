'use strict'

const connection = require('./connection.js');
const imgChecker = require('./imageChecker');

// mysql connection credentials
const db_connect = require('../model/db_connect.js');
let con = db_connect.con;

// Update the account information  (login, first_name, last_name, email)
const update_user_infos = (login, first_name, last_name, email, uuid) => {
    return new Promise((resolve, reject) => {
    let sql = "UPDATE `users` SET `login` = ?, `first_name` = ?, `last_name` = ?, `email` = ? WHERE `uuid` = ?";
    let sql_mail = "SELECT `email` FROM `users` WHERE `email` = ?";
    let values = [login, first_name, last_name, email, uuid];
    let values_email = [email];
   
    con.query(sql_mail, values_email, (err, result) => {
        if (err){
            resolve(0);
            throw err;
        }
        else{
            if (result == ``){
                con.query(sql, values, (err, result) => {
                    if (err){
                        resolve(0);
                        throw err;
                    }
                });
                resolve(1);
            }
            else
            {
                resolve(0);
            }
        }
        
    });
    })
    
}
module.exports.update_user_infos = update_user_infos;

// Update the account information  (login, first_name, last_name, email)
const update_password = async (password, uuid) => {
    let hash = await connection.crypted_password(password);
    let sql = "UPDATE `users` SET `password` = ? WHERE `uuid` = ?";
    let values = [hash, uuid];
    con.query(sql, values, (err, result) => {
        if (err)
            throw err;
    });
}
module.exports.update_password = update_password;

// Update the account information  (login, first_name, last_name, email)
const reset_password = async (password, uuid) => {
    return new Promise(async (resolve, reject) => {
        let hash = await connection.crypted_password(password);
        let sql = "UPDATE `users` SET `password` = ? WHERE `recup_password` = ?";
        let values = [hash, uuid];
        con.query(sql, values, (err, result) => {
            if (err) {
                resolve(false);
                throw err;
            } else {
                sql = "UPDATE `users` SET `recup_password` = NULL WHERE `recup_password` = ?";
                con.query(sql, uuid, (err, result) => {
                    if (err) {
                        resolve(false)
                        throw err;
                    } else
                        resolve(true);
                });
            }
        });
    });
}
module.exports.reset_password = reset_password;

// Confirm the email
const confirm_email = (uuid) => {
    const sql = "UPDATE `users` SET `email_confirmation` = NULL WHERE `email_confirmation` = ?";
    con.query(sql, uuid, (err, result) => {
        if (err)
            throw err;
    });
}
module.exports.confirm_email = confirm_email;

// Update the profile picture
const update_picture = (profile_picture, uuid) => {
    let sql = "UPDATE `users` SET `profile_picture` = ? WHERE `uuid` = ?";
    let values = [profile_picture, uuid];
    con.query(sql, values, (err, result) => {
        if (err)
            throw err;
    });
}
module.exports.update_picture = update_picture;

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

// Update the language
const language_update = (uuid, language) => {
    let full_language = language == 'en' ? 'English' : 'French';
    let sql = "UPDATE `users` SET `language` = ? WHERE `uuid` = ?";
    let values = [full_language, uuid];
    con.query(sql, values, (err, result) => {
        if (err)
            throw err;
    });
}
module.exports.language_update = language_update;

// Get user public profile
const get_public_profile = uuid => {
    return new Promise((resolve, reject) => {
        let sql = 'SELECT `first_name`, `login`, `profile_picture`, `nb_views`, `nb_comments`, `nb_ratings` FROM `users` WHERE uuid = ?';
        con.query(sql, [uuid], (err, result) => {
            if (err)
                throw err;
            else {
                if (result == "")
                    resolve ("vide");
                else
                    resolve(result);
            }
        });
    });
}
module.exports.get_public_profile = get_public_profile;