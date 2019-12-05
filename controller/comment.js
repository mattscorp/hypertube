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
    console.log("lOFFSET = " + req.query.offset);
    console.log("moviedb_id = " + req.query.moviedb_id);

    if(req.query.offset && req.query.offset !== "" && req.query.moviedb_id && req.query.moviedb_id !== "" )
    {
        console.log("CA EXISTE");
        let get_comment = JSON.parse(await commentModel.get_comment(req.query.moviedb_id, req.query.offset));
        console.log(get_comment);
        if (get_comment == 'vide')
         res.sendStatus(403);
    else
        res.status(200).send(get_comment);
    }
    else
     res.sendStatus(403);
});


module.exports = router;