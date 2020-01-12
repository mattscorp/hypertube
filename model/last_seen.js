// mysql connection credentials
const db_connect = require('../model/db_connect.js');
let con = db_connect.con;

const last_seen = async (path) => {
    return new Promise((resolve, reject) => {
        let sql = "SELECT `moviedb_ID` FROM `films` WHERE `path` LIKE ?";
        con.query(sql, [path + '/%'], (err, result) => {
            if (err)
                throw err;
            else {
                let value = result[0].moviedb_ID
                let sql2 = "SELECT `date_modified` FROM `views` WHERE `moviedb_ID` = ? ORDER BY `date_modified` ASC LIMIT 1";
                con.query(sql2, [value], (err, result) => {
                    if (err)
                        throw err;
                    else {
                        if (result != '')
                            resolve(result[0].date_modified)
                        else
                            resolve('vide');
                    }
                })
                // resolve(result);
            }
        })
    })
}
module.exports.last_seen = last_seen;