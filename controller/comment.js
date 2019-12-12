'use strict'

const with_auth = require('./user/authentification_middleware');
const express = require('express');
const router = express.Router();
// model functions
const commentModel = require('./../model/commentModel.js');

router.post('/add_comment', with_auth, async (req, res) => {
    if (req.body.moviedb_ID && req.body.moviedb_ID !== "" && req.body.comment && req.body.comment !== "") {
        // console.log("req.body.moviedb_ID " + req.body.moviedb_ID);
        // console.log("req.body.comment  " + req.body.comment );
        let add_comment = await commentModel.add_comment(req.body.moviedb_ID, req.body.comment, req.uuid);
        if (add_comment == 'vide')
            res.sendStatus(403);
        else
            res.sendStatus(201);
    }
    else
     res.sendStatus(403);
});

router.get('/get_comment', with_auth, async (req, res) => {
    if(req.query.offset && req.query.offset !== "" && req.query.moviedb_id && req.query.moviedb_id !== "" )
    {
        let get_comment = await commentModel.get_comment(req.query.moviedb_id, req.query.offset);
        if (get_comment == 'vide')
            res.sendStatus(403);
        else
            res.status(200).send(JSON.parse(get_comment));
    }
    else if (req.query.moviedb_id && req.query.moviedb_id !== "") {
        let get_comment_after_new = await commentModel.get_comment_after_new(req.query.moviedb_id);
        if (get_comment_after_new == 'vide')
            res.sendStatus(403);
        else
            res.status(200).send(JSON.parse(get_comment_after_new));
    }
    else
        res.sendStatus(403);
});

router.post('/delete_comment', with_auth, async (req, res) => {
    if(req.body.comment && req.body.comment !== "" && req.body.comment_ID && req.body.comment_ID !== "" && req.body.uuid && req.body.uuid !== "")
    {
        let del = await commentModel.delete_comment(req.body.comment, req.body.comment_ID, req.body.uuid);
        if (del == 'vide')
            res.sendStatus(403);
        else
        res.sendStatus(201);
    }
    else
     res.sendStatus(403);
});
module.exports = router;