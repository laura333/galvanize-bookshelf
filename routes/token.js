'use strict';

const express = require('express');
const knex = require('../knex');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const boom = require('boom');
// const dotenv = require('dotenv');
const { camelizeKeys } = require('humps');
// const ev = require('express-validation');
// const validations = require('../validation/token');

// eslint-disable-next-line new-cap
const router = express.Router();

// YOUR CODE HERE

router.get('/token', (req, res) => {
    const token = req.cookies.token;

    jwt.verify(token, process.env.JWT_SECRET, (err) => {
        if (err) {
            return res.send(false);
        }
        res.send(true);
    });
});

router.post('/token', (req, res, next) => {
    const { email, password } = req.body;
    // console.log('>>>>>', req.body);

    if (!email || !email.trim()) {
        return next(boom.create(400, 'Email must not be blank.'));
    }

    if (!password || password.length < 8) {
        return next(boom.create(400, 'Password must not be blank.'));
    }

    let user;

    knex('users')
        .where('email', email)
        .first()
        .then((row) => {
            if (!row) {
                throw boom.create(400, 'Bad email or password');
            }

            user = camelizeKeys(row);

            return bcrypt.compare(password, user.hashedPassword);
        })

    .then(() => {
            delete user.hashedPassword;

            const expiry = new Date(Date.now() + 1000 * 60 * 60 * 3);
            const token = jwt.sign({ userId: user.id },
                process.env.JWT_SECRET, {
                    expiresIn: '3h'
                });

            res.cookie('token', token, {
                httpOnly: true,
                expires: expiry,
                secure: router.get('env') === 'production'
            });

            res.send(user);
        })
        // .catch(bcrypt.MISMATCH_ERROR, () => {
        //     throw boom.create(400, 'Bad email or password');
        // })
        .catch((err) => {
            next(err);
        });
});

router.delete('/token', (req, res) => {
    res.clearCookie('token');
    res.send(true);
});

module.exports = router;
