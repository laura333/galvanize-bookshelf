'use strict';

const express = require('express');
const knex = require('../knex');
const bcrypt = require('bcrypt');

// eslint-disable-next-line new-cap
const router = express.Router();
const {camelizeKeys, decamelizeKeys} = require('humps');

// YOUR CODE HERE

router.post('/users', (req, res, next) => {
    var saltRounds = 12;
    var hash = bcrypt.hashSync(req.body.password, saltRounds);
    knex('users')
        .insert({
            first_name: req.body.firstName,
            last_name: req.body.lastName,
            email: req.body.email,
            hashed_password: hash
        }, '*')
        .then((rows) => {
            var users = camelizeKeys(rows[0]);
            console.log(users);
            delete users.hashedPassword;
            res.send(users);
            console.log(users);
        })
        .catch((err) => {
            next(err);
        });
});

module.exports = router;
