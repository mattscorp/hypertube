// mysql connection credentials
const db_connect = require('../model/db_connect.js');
let con = db_connect.con;

// Return all information (except the password) from users based on the user_uuid
const get_users = async (user_uuid) => {
    return new Promise((resolve, reject) => {
        con.query("SELECT `user_ID`, `uuid`, `language`, `last_name`, `first_name`, `login`, `email_confirmation`, `insta`, `facebook`, `github`, `42`, `nb_views`, `nb_comments`, `nb_ratings`, `profile_picture` FROM `users` WHERE `uuid` = ?", [user_uuid], (err, result) => {
            if (err)
                throw err;
            else {
                resolve(JSON.stringify(result));
            }
        });
    });
}
module.exports.get_users = get_users;

// Create a user (no OAuth)
const post_users = async (values) => {
    let sql = "INSERT INTO `users` (`uuid`, `language`, `last_name`, `first_name`, `login`, `profile_picture`, `email`) VALUES (?)";
    let sql_values = [values.uuid, values.language, values.last_name, values.first_name, values.login, values.profile_picture, values.email];
    con.query(sql, [sql_values], (err, result) => {
        if (err)
            throw err;
        console.log(result);
    })
}
module.exports.post_users = post_users;