'use strict'
const fs = require('fs');
const path = require('path');
const last_seen = require('../model/last_seen.js');
const rimraf = require("rimraf");

const directoryPath = path.join(__dirname, '/../views/public/torrents');

const delete_movie = to_delete => {
    console.log("I WILL DELETE " + to_delete)
    rimraf(to_delete, function () {
        fs.rmdir(to_delete)
    });
}

const cron = async () => {
    let date = new Date
    let getFileUpdatedDate = '';
    let last_seen_res = '';
    let date_diff = 0
    setInterval(async () => {
        date = new Date;
        fs.readdir(directoryPath, async function (err, files) {
            //handling error
            if (err) {
                return console.log('Unable to scan directory: ' + err);
            } 
            files.forEach(async function (file) {
                last_seen_res = await last_seen.last_seen(file);
                if (last_seen_res != 'vide' && last_seen_res != null) {
                    // Calculate the difference in days
                    date_diff = (date - last_seen_res);
                    if (Math.floor(date_diff/1000/60/60/24) > 30)
                        delete_movie(directoryPath + '/' + file);
                } else {
                    delete_movie(directoryPath + '/' + file);
                }
            });
        });
    // Done every day
    }, 86400000)
};
module.exports.cron = cron