SET SQL_MODE = 'NO_AUTO_VALUE_ON_ZERO';
SET AUTOCOMMIT = 0;
START TRANSACTION;
SET time_zone = '+00:00';

CREATE DATABASE IF NOT EXISTS `hypertube`;

USE `hypertube`;

CREATE TABLE IF NOT EXISTS `users` (
    `user_ID` INT(11) NOT NULL PRIMARY KEY AUTO_INCREMENT,
    `uuid` text,
    `language` text,
    `last_name` varchar(255) DEFAULT NULL,
    `first_name` varchar(255) DEFAULT NULL,
    `login` varchar(100) DEFAULT NULL,
    `password` text,
    `email` varchar(255) DEFAULT NULL,
    `email_confirmation` text,
    `insta` varchar(100) DEFAULT NULL,
    `google` varchar(100) DEFAULT NULL,
    `facebook` varchar(100) DEFAULT NULL,
    `github` varchar(100) DEFAULT NULL,
    `ft` varchar(100) DEFAULT NULL,
    `nb_views` int(11) NOT NULL DEFAULT 0,
    `nb_comments` int(11) NOT NULL  DEFAULT 0,
    `nb_ratings` int(11) NOT NULL  DEFAULT 0,
    `profile_picture` text,
    `recup_password` text,
    `dark_mode` INT(11) DEFAULT 0
);

CREATE TABLE IF NOT EXISTS `films` (
    `film_ID` INT(11) NOT NULL PRIMARY KEY AUTO_INCREMENT,
    `moviedb_ID` INT(11),
    `path` text,
    `extension` varchar(10),
    `name` varchar(100),
    `year` int(5),
    `download_complete` int(5),
    `magnet` TEXT,
    `date` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS `ratings` (
    `rating_ID` int(11) NOT NULL PRIMARY KEY AUTO_INCREMENT,
    `film_ID` int(11) DEFAULT NULL,
    `user_ID` TEXT,
    `rating` FLOAT,
    `date` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS `comments` (
    `comment_ID` int(11) NOT NULL PRIMARY KEY AUTO_INCREMENT,
    `film_ID` int(11) DEFAULT NULL, 
    `uuid` text,
    `first_name` varchar(255) DEFAULT NULL,
    `comment` text,
    `date` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS `views` (
    `view_ID` int(11) NOT NULL PRIMARY KEY AUTO_INCREMENT,
    `moviedb_ID` int(11) DEFAULT NULL,
    `user_ID` text,
    `viewed` int(1) DEFAULT 0,
    `time_viewed` FLOAT,
    `duration` FLOAT,
    `date` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP
);
