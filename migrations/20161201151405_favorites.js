'use strict';

exports.up = function(knex, Promise) {
  return knex.schema.createTable('favorites', function(table) {
    table.increments();
    table.integer('book_id').notNullable().references('id').inTable('books').onDelete('CASCADE');
    table.integer('user_id').notNullable().references('id').inTable('users').onDelete('CASCADE');
    table.timestamp('created_at').notNullable().defaultTo(knex.fn.now());
    table.timestamp('updated_at').notNullable().defaultTo(knex.fn.now());
  });
};

exports.down = function(knex, Promise) {
  return knex.schema.dropTable('favorites');
};
