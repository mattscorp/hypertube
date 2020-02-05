let con = require('./model/db_connect').con;
let con1 = require('./model/db_connect').con1;

function createTables () {
    return (new Promise((resolve, reject) => {
        let tables_created = 0;
        //Create table comments
        con.query('CREATE TABLE comments (comment_ID INT(11) UNSIGNED AUTO_INCREMENT PRIMARY KEY NOT NULL, film_ID INT(11) UNSIGNED, uuid TEXT, first_name VARCHAR(255), comment TEXT, date DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP)', [], (err) => {
            if (err) {
                console.log(err.stack);
                reject('Failed to create table comments');
            }
            tables_created++;
            if (tables_created === 5) {
                resolve(true);
            }
        });
        //Create table films
        con.query('CREATE TABLE films (film_ID INT(11) UNSIGNED AUTO_INCREMENT PRIMARY KEY NOT NULL, moviedb_ID INT(11) UNSIGNED, path TEXT, extension VARCHAR(10), name VARCHAR(100), year INT(5) UNSIGNED, download_complete INT(5), magnet TEXT, date DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP)', [], (err) => {
            if (err) {
                console.log(err.stack);
                reject('Failed to create table films');
            }
            tables_created++;
            if (tables_created === 5) {
                resolve(true);
            }
        })
        //Create table ratings
        con.query('CREATE TABLE ratings (rating_ID INT(11) UNSIGNED AUTO_INCREMENT PRIMARY KEY NOT NULL, film_ID INT(11) UNSIGNED, user_ID INT(11) UNSIGNED, rating DEC(3, 1) UNSIGNED, date DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP)', [], (err) => {
            if (err) {
                console.log(err.stack);
                reject('Failed to create ratings');
            }
            tables_created++;
            if (tables_created === 5) {
                resolve(true);
            }
        })
        //Create table users
        con.query('CREATE TABLE users (user_ID INT(11) UNSIGNED AUTO_INCREMENT PRIMARY KEY NOT NULL, uuid TEXT, language TEXT, last_name VARCHAR(255), first_name VARCHAR(255), login VARCHAR(100), password TEXT, email VARCHAR(255), email_confirmation TEXT, insta VARCHAR(100), google VARCHAR(100), facebook VARCHAR(100), github VARCHAR(100), ft VARCHAR(100), nb_views INT(11) UNSIGNED NOT NULL DEFAULT 0, nb_comments INT(11) UNSIGNED NOT NULL DEFAULT 0, nb_ratings INT(11) UNSIGNED NOT NULL DEFAULT 0, profile_picture TEXT, recup_password TEXT, dark_mode INT(11))', [], (err) => {
            if (err) {
                console.log(err.stack);
                reject('Failed to create table users');
            }
            tables_created++;
            if (tables_created === 5) {
                resolve(true);
            }
        })
        //Create table views
        con.query('CREATE TABLE views (view_ID INT(11) UNSIGNED AUTO_INCREMENT PRIMARY KEY NOT NULL, moviedb_ID VARCHAR(10), user_ID TEXT, viewed INT(1), time_viewed FLOAT, duration FLOAT, date_modified DATETIME, date DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP)', [], (err) => {
            if (err) {
                console.log(err.stack);
                reject('Failed to create table views');
            }
            tables_created++;
            if (tables_created === 5) {
                resolve(true);
            }
        })
    }))
}

con1.query('DROP DATABASE IF EXISTS `hypertube`', [], (err) => {
    if (err) {
        console.log(err.stack);
        process.exit(0);
    }
    con1.query('CREATE DATABASE `hypertube`', [], (err) => {
        if (err) {
            console.log(err.stack);
            process.exit(0);
        }
        con1.query('USE `hypertube`', [], (err) => {
            if (err) {
                console.log(err.stack);
                process.exit(0);
            }
            createTables().then(() => {
                con1.end();
                console.log('Setup done, database is ready');
                console.log('You can now launch server with npm start');
            }).catch((reason) => {
                con1.end();
                console.log('Failed to setup database:\n\t' + reason);
            })
        })
    })
});