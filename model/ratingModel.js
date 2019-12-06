'use strict'
// to post http requests
const request = require('request');
// mysql connection credentials
const db_connect = require('./db_connect.js');
let con = db_connect.con;

const prev_rating = (uuid, film_ID) => {
    return new Promise((resolve, reject) => {
        let sql = "SELECT * from `ratings` WHERE `film_ID` = ? AND `user_ID` = ?";
        con.query(sql, [film_ID, uuid], (err, result) => {
            if (err)
                throw err;
            else {
                if (result == '')
                {
                    resolve('vide');
                }
                else
                    resolve(result[0]);
            }
        });
    });
};
module.exports.prev_rating = prev_rating;

const post_rating = (uuid, film_ID, rating) => {
    let sql = "INSERT INTO `ratings` (`film_ID`, `user_ID`, `rating`) VALUES (?)";
    con.query(sql, [[film_ID, uuid, rating]], (err) => {
        if (err)
            throw err;
    });
};
module.exports.post_rating = post_rating;

const update_rating = (uuid, film_ID, rating) => {
    let sql = "UPDATE `ratings` SET `rating` = ? WHERE `film_ID` = ? AND `user_ID` = ?";
    con.query(sql, [rating, film_ID, uuid], (err) => {
        if (err)
            throw err;
    });
};
module.exports.update_rating = update_rating;

const average_rating = (movie_ID) => {
    return new Promise((resolve, reject) => {
        let sql = "SELECT AVG (ALL `rating`) AS average_rating FROM `ratings` WHERE `film_ID` = ?";
        con.query(sql, [movie_ID], (err, result) => {
            if (err)
                throw err;
            else if (result == '')
                resolve('vide');
            else
                resolve(result);
        });
    });
};
module.exports.average_rating = average_rating;