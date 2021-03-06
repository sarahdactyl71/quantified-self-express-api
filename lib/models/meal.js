const environment = process.env.NODE_ENV || 'development'
const configuration = require('../../knexfile')[environment]
const database = require('knex')(configuration)

class Meal {

  constructor(attrs) {
    this.id    = attrs.id;
    this.name  = attrs.name;
    this.foods = [];
  }

  static getAllMeals() {
    return database.raw('SELECT * FROM meals')
    .then((data) =>  data.rows )
  }

  static getMeal(mealID) {
    return database.raw('SELECT * FROM meals WHERE meals.id = ?', [mealID])
    .then((data) => data.rows[0])
  }

  static getMealsFoods(mealID) {

    return database.raw(
      `SELECT foods.id AS id, name, calories FROM foods
      INNER JOIN meals_foods ON foods.id = meals_foods.food_id
      WHERE meals_foods.meal_id = ?`, [mealID]
    )
    .then((data) => { return data.rows })
  }

  static addFoodsToMeals(meals, foods) {
    let i = 0
    return meals.map( (meal) => {
      let mealObject = new Meal(meal)
      mealObject.foods = foods[i]
      i++
      return mealObject
    })
  }

  static addFoodsToMeal(meal, foods) {
    let mealObject = new Meal(meal)
    mealObject.foods = foods
    return mealObject
  }

  static deleteFoodFromMeal(mealID, foodID) {
    return database.raw('DELETE FROM meals_foods WHERE meals_foods.meal_id = ? AND meals_foods.food_id = ?', [mealID, foodID])
  }

  static createMeal(foodID, mealID) {
    return database.raw('INSERT INTO meals_foods (food_id, meal_id)', [foodID, mealID])
  }
}

module.exports = Meal
