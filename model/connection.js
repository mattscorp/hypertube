// mysql connection credentials
const db_connect = require('../model/db_connect.js');
let con = db_connect.con;

const test = async function(req, res) {
    return new Promise((resolve, reject) => {
        con.query("SELECT * FROM `films`", function(err, result) {
            if (err)
                throw err;
            else
                resolve(JSON.stringify(result));
        });
    })
}
module.exports.test = test;