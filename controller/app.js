const express = require('express');
const bodyParser = require('body-parser');

// create express app
const app = express();

// parse requests of content-type - application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: true }))
// parse requests of content-type - application/json
app.use(bodyParser.json())

// mysql connection credentials
const db_connect = require('../model/db_connect.js');
let con = db_connect.con;

// define a simple route
app.get('/', (req, res) => {
  con.query("SELECT * FROM `users`", function(err, result) {
    if (err)
      throw err;
    else
      console.log(result);
  });
  res.json({"message": "Welcome to EasyNotes application. Take notes quickly. Organize and keep track of all your notes."});
});

// listen for requests
app.listen(3000, () => {
  console.log("Server is listening on port 3000");
});