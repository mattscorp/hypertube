'use strict'

const uuid = require('uuid/v4');
const nodemailer = require('nodemailer');
const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: '42betatest@gmail.com',
      pass: 'MatchaTest42'
    }
});
  
// mysql connection credentials
const db_connect = require('../model/db_connect.js');
let con = db_connect.con;


/**** FORGOTTEN PASSWORD ****/

// Send the email
const email_forgotten_password = (user_infos, uuid) => {
    const email_options = {
        from: 'reset_password@hypertube.com',
        to: user_infos.email,
        subject: 'HYPERTUBE - Reset your password',
        html: `<h1>PLease click <a href="http://localhost:8000/reset_password?uuid=${uuid}&login=${user_infos.login}">here</a> to reset your password.</h1>`
    };
    transporter.sendMail(email_options, function(error, info){
        if (error) {
            console.log(error);
        }
    });
}

// Adds the reset password uuid to the db + call the function to send an email
const forgotten_password = async (user_infos) => {
    const forgotten_uuid = uuid();
    const sql = "UPDATE `users` SET `recup_password` = ? WHERE `uuid` = ?";
    con.query(sql, [forgotten_uuid, user_infos.uuid], (err, result) => {
        if (err)
            throw err;
        else {
            email_forgotten_password(user_infos, forgotten_uuid);
        }
    });
}
module.exports.forgotten_password = forgotten_password;

/**** FIRST CONNECTION - EMAIL CONFIRMATION ****/
