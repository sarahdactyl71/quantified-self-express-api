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

const createFood = (request, response) => {
  const foodID = request.params.food_id
  const mealID = request.params.meal_id

  if(!foodID || !mealID) {
    return response.status(422).send({ error: "Missing required fields"})
  }
  Meal.createMeal(foodID, mealID).then( () => {
    Meal.getAllMeals().then((data) => {
      return response.json(data.rows)
    })
  })
}

const deleteFood = (request, response, next) => {
  const foodID = request.params.food_id
  const mealID = request.params.meal_id
  Meal.deleteFoodFromMeal(mealID, foodID)
  .then((data) => {
    if (data.rowCount < 1) {
      response.sendStatus(404)
    } else {
      response.sendStatus(200)
    }
  })
}

module.exports = { allMeals, showMeal, deleteFood, createFood }
