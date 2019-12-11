'use strict'

const with_auth = require('./user/authentification_middleware');
const express = require('express');
const router = express.Router();
// model functions
const ratingModel = require('./../model/ratingModel.js');

router.post('/rate_movie', with_auth, async (req, res) => {
    if (req.uuid && req.uuid != '' && req.body.moviedb_ID && req.body.moviedb_ID != '' && req.body.rating && req.body.rating != '') {
        // On recherche la note précédente de l'utilisateur sur ce film
        let prev_rating = await ratingModel.prev_rating(req.uuid, req.body.moviedb_ID);
        // si pas de note --> insert
        if (prev_rating == 'vide') {
            ratingModel.post_rating(req.uuid, req.body.moviedb_ID, req.body.rating);
            res.sendStatus(204);
        }
        // si déjà une note (et qu'elle est différente de la prev_rating) --> update
        else if (prev_rating.rating != req.body.rating) {
            ratingModel.update_rating(req.uuid, req.body.moviedb_ID, req.body.rating);
            res.sendStatus(200);
        }
    } else {
        res.sendStatus(400);
    }
});

router.get('/get_rate_average', with_auth, async (req, res) => {
    if (req.query.moviedb_ID && req.query.moviedb_ID != '') {
        let average_rating = await ratingModel.average_rating(req.query.moviedb_ID);
        if (average_rating  == 'vide')
            res.sendStatus(204);
        else
            res.status(200).send(average_rating);
    } else {
        res.sendStatus(400);
    }
})

router.get('/user_rating', with_auth, async (req, res) => {
    if (req.query.moviedb_ID && req.query.moviedb_ID != '') {
        let user_rating = await ratingModel.user_rating(req.query.moviedb_ID, req.uuid)
        if (user_rating  == 'vide')
            res.sendStatus(204);
        else
            res.status(200).send(user_rating);
    } else {
        res.sendStatus(400);
    }
})

module.exports = router;
