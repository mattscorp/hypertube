'use strict'
// to post http requests
const request = require('request');
// mysql connection credentials
const db_connect = require('./db_connect.js');
const user_infos = require('./connection.js');
let con = db_connect.con;

// ADD A NEW COMMENT TO DE BDD //



const add_comment = async (moviedb_ID, comment, uuid) => {

    return new Promise( async (resolve, reject) => {
        let first_name = JSON.parse(await user_infos.get_users(uuid));
        let sql = "INSERT INTO `comments` (`film_ID`, `uuid`, `comment`, `first_name`) VALUES (?)";
        con.query(sql, [[moviedb_ID, uuid ,comment, first_name[0].first_name || first_name[0].login ]], (err, result) => {
            if (err)
                throw err;
            else {
                if (result == '')
                    resolve('vide');
                else
                    resolve("ok");
            }
        });
    });
}
module.exports.add_comment = add_comment;


const get_comment = async (moviedb_ID, offset) => {

    return new Promise( async (resolve, reject) => {
        let sql = "SELECT * FROM `comments` WHERE `film_ID` = ? ORDER BY `date` DESC LIMIT ?, ?";
        con.query(sql, [moviedb_ID, parseInt(offset), parseInt(offset) + 5], (err, result) => {
            if (err)
                throw err;
            else {
                if (result == '')
                    resolve('vide');
                else
                    resolve(JSON.stringify(result));
            }
        });
    });
}
module.exports.get_comment = get_comment;


