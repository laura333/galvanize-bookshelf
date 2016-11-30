'use strict';

const express = require('express');
const knex = require('../knex');

// eslint-disable-next-line new-cap
const router = express.Router();
const { camelizeKeys, decamelizeKeys } = require('humps');

// YOUR CODE HERE

router.get('/books', (_req, res, next) => {
    knex('books')
        .orderBy('title')
        .then((rows) => {
          var books = camelizeKeys(rows);
            res.send(books);
        })
        .catch((err) => {
            next(err);
        });
});

router.get('/books/:id', (req, res, next) => {
    knex('books')
        .where('id', req.params.id)
        .first()
        .then((row) => {
          var book = camelizeKeys(row);
            if (!book) {
                return next();
            }
            res.send(book);
        })
        .catch((err) => {
            next(err);
        });
});

router.post('/books', (req, res, next) => {
  // console.log("***********");
  // console.log(req.body.coverUrl);
  // console.log("***********");

    knex('books')
        .insert({
            title: req.body.title,
            author: req.body.author,
            genre: req.body.genre,
            description: req.body.description,
            cover_url: req.body.coverUrl
        }, '*')
        .then((rows) => {
          var books = camelizeKeys(rows[0]);
            res.send(books);
        })
        .catch((err) => {
            next(err);
        });
});

router.patch('/books/:id', (req, res, next) => {
    knex('books')
        .where('id', req.params.id)
        .first()
        .then((row) => {
          var book = camelizeKeys(row);
            if (!book) {
                return next();
            }
            return knex('books')
                .update({
                    title: req.body.title,
                    author: req.body.author,
                    genre: req.body.genre,
                    description: req.body.description,
                    cover_url: req.body.coverUrl
                }, '*')
                .where('id', req.params.id);
        })
        .then((rows) => {
          var books = camelizeKeys(rows[0]);
            res.send(books);
        })
        .catch((err) => {
            next(err);
        });
});

router.delete('/books/:id', (req, res, next) => {
  let book;

  knex('books')
  .where('id', req.params.id)
  .first()
  .then((row) => {
    if (!row) {
      return next();
    }

    book = row;

    return knex('books')
    .del()
    .where('id', req.params.id);
  })
  .then(() => {
    delete book.id;
    res.send(book);
  })
  .catch((err) => {
    next(err);
  });
});

module.exports = router;
