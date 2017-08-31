exports.seed = function(knex, Promise) {
  return knex.raw('TRUNCATE meals RESTART IDENTITY CASCADE')
  .then(function() {
    return Promise.all([
      knex.raw(
        'INSERT INTO meals (name) VALUES (?)',
        ['breakfast']
      ),
      knex.raw(
        'INSERT INTO meals (name) VALUES (?)',
        ['lunch']
      ),
      knex.raw(
        'INSERT INTO meals (name) VALUES (?)',
        ['dinner']
      ),
      knex.raw(
        'INSERT INTO meals (name) VALUES (?)',
        ['snacks']
      )
    ])
  })
}