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

module.exports = { allMeals }