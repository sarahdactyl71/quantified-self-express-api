const Meal = require('../../lib/models/meal')

const allMeals = (request, response, next) => {
  Meal.getAllMeals()
  .then( (data) => {
    Promise.all(
      data.map( (meal) => { 
        return Meal.getMealsFoods(meal.id)
      })
    )
    .then( (foods) => {
      const meals = Meal.addFoodsToMeals(data, foods)
      response.json(meals)
    })
  })
}

const showMeal = (request, response, next) => {
  const id = request.params.id
  Meal.getMeal(id)
  .then( (data) => {
    Meal.getMealsFoods(id)
    .then( (foods) => {
      const meal = Meal.addFoodsToMeal(data, foods)
      response.json(meal)
    })
  })
}

module.exports = { allMeals, showMeal }