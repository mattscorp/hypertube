'use strict'

var mysql = require('mysql');

/* CONNEXION MAISON */
/*
const HOST = 'localhost';
module.exports.HOST = HOST;
const USER = 'paul';
module.exports.USER = USER;
const PASSWORD = '42Pourlavie!';
module.exports.PASSWORD = PASSWORD;
const DATABASE = 'hypertube';
module.exports.DATABASE = DATABASE;

let con = mysql.createConnection({
  host: HOST,
  user: USER,
  password: PASSWORD,
  database: DATABASE
});
module.exports.con = con;
*/

/* CONNEXION ECOLE */

const HOST = 'localhost';
module.exports.HOST = HOST;
const USER = 'root';
module.exports.USER = USER;
// const PASSWORD = '123456';
const PASSWORD = 'pvictor';
module.exports.PASSWORD = PASSWORD;
const PORT = 3306;
module.exports.PORT = PORT;
const DATABASE = 'hypertube';
module.exports.DATABASE = DATABASE;

let con = mysql.createConnection({
  host: HOST,
  port: PORT,
  user: USER,
  password: PASSWORD,
  database: DATABASE
});
module.exports.con = con;
