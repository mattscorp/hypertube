'use strict'

var mysql = require('mysql');

/*  CONEXION MAISON */
/*
  let con = mysql.createConnection({
  host: "localhost",  
  user: "paul",
  password: "42Pourlavie!",
  database: "hypertube"
});
module.exports.con = con;

let con_1 = mysql.createConnection({
  host: "localhost",
  user: "paul",
  password: "42Pourlavie!",
});
module.exports.con_1 = con_1;

*/

/* CONNECTION ECOLE */

let con = mysql.createConnection({
  host: "localhost",
  port: "3306",
  user: "root",
 // password: "123456",
  password: "pvictor",
  database: "hypertube"
});
module.exports.con = con;

let con_1 = mysql.createConnection({
  host: "localhost",
  port: "3306",
  user: "root",
  // password: "123456",
  password: "pvictor",

});
module.exports.con_1 = con_1;
