exports.seed = function(knex, Promise) {
  return knex.raw('TRUNCATE meals_foods RESTART IDENTITY CASCADE')
  .then(function() {
    return Promise.all([
      knex.raw(
        'INSERT INTO meals_foods (food_id, meal_id) VALUES (?, ?)',
        [1, 1]
      ),
      knex.raw(
        'INSERT INTO meals_foods (food_id, meal_id) VALUES (?, ?)',
        [1, 3]
      ),
      knex.raw(
        'INSERT INTO meals_foods (food_id, meal_id) VALUES (?, ?)',
        [2, 1]
      ),
      knex.raw(
        'INSERT INTO meals_foods (food_id, meal_id) VALUES (?, ?)',
        [2, 2]
      ),
      knex.raw(
        'INSERT INTO meals_foods (food_id, meal_id) VALUES (?, ?)',
        [3, 2]
      ),
      knex.raw(
        'INSERT INTO meals_foods (food_id, meal_id) VALUES (?, ?)',
        [4, 3]
      ),
      knex.raw(
        'INSERT INTO meals_foods (food_id, meal_id) VALUES (?, ?)',
        [5, 4]
      ),
      knex.raw(
        'INSERT INTO meals_foods (food_id, meal_id) VALUES (?, ?)',
        [6, 4]
      ),
      knex.raw(
        'INSERT INTO meals_foods (food_id, meal_id) VALUES (?, ?)',
        [3, 4]
      )
    ])
  })
}