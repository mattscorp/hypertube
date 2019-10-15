const express = require('express');
const bodyParser = require('body-parser');
const request = require('request');

// create express app
const app = express();

// model functions
const connection = require('../model/connection.js')

// parse requests of content-type - application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: true }))
// parse requests of content-type - application/json
app.use(bodyParser.json())

// define a simple route
app.get('/', async function(req, res) {
  let films = JSON.parse(await connection.test());
  console.log(films);
  res.json({"message": "Welcome to EasyNotes application. Take notes quickly. Organize and keep track of all your notes."});
});

var http = require('http');

app.get('test2', async function(req, res) {
  console.log('in test2');
  return new Promise(async (resolve, reject) => {
    let test2 = await connection.test(req, res);
    resolve(test2);
  });
})

app.get('/test', (req, res) => {
  http.get('http:localhost:3000/test2', async function(req, res) {
    console.log(res);
    return ('OK');
  });
  return res.send('Received a GET HTTP method');
});
app.post('/', (req, res) => {
  return res.send('Received a POST HTTP method');
});
app.put('/', (req, res) => {
  return res.send('Received a PUT HTTP method');
});
app.delete('/', (req, res) => {
  return res.send('Received a DELETE HTTP method');
});

app.delete('/users', (req, res) => {
  return res.send('DELETE HTTP method on user resource');
});

app.delete('/users/:userId/:lol', (req, res) => {
  return res.send(
    `DELETE HTTP method on user/${req.params.userId} resource and ${req.params.lol}`,
  );
});

// listen for requests
app.listen(3000, () => {
  console.log("Server is listening on port 3000");
});