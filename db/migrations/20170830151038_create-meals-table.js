exports.up = function(knex, Promise) {
  let createQuery = `CREATE TABLE meals(
    id SERIAL PRIMARY KEY NOT NULL,
    name TEXT
  )`
  return knex.raw(createQuery)
};

exports.down = function(knex, Promise) {
  let dropQuery = `DROP TABLE meals`
  return knex.raw(dropQuery)
};