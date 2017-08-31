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
    console.log(foods)
    let mealObject = new Meal(meal)
    mealObject.foods = foods
    return mealObject
  }
}

module.exports = Meal