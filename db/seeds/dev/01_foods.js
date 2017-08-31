exports.seed = function(knex, Promise) {
  return knex.raw('TRUNCATE foods RESTART IDENTITY CASCADE')
  .then(function() {
    return Promise.all([
      knex.raw(
        'INSERT INTO foods (name, calories) VALUES (?, ?)',
        ['potatoes', 240]
      ),
      knex.raw(
        'INSERT INTO foods (name, calories) VALUES (?, ?)',
        ['apricots', 90]
      ),
      knex.raw(
        'INSERT INTO foods (name, calories) VALUES (?, ?)',
        ['hot dog', 340]
      ),
      knex.raw(
        'INSERT INTO foods (name, calories) VALUES (?, ?)',
        ['pizza', 290]
      ),
      knex.raw(
        'INSERT INTO foods (name, calories) VALUES (?, ?)',
        ['wheat thins', 100]
      ),
      knex.raw(
        'INSERT INTO foods (name, calories) VALUES (?, ?)',
        ['mangos', 75]
      )
    ])
  })
}