const express = require('express')
const app = express()
const bodyParser = require('body-parser')

const environment = process.env.NODE_ENV || 'development'
const configuration = require('./knexfile')[environment]
const database = require('knex')(configuration)

const Food = require('./lib/models/food')
const Meal = require('./lib/models/meal')
const foodController = require('./lib/controllers/foods')
// const mealController = require('./lib/controllers/meals')

app.set('port', process.env.PORT || 3000)
app.locals.title = 'Quantified Self Express API'

app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }))

app.get('/', (request, response) => {
  response.send(app.locals.title)
})

app.get('/api/v1/foods', (request, response) => {
  database.raw("SELECT * FROM foods")
  .then((data) => {
    response.json(data.rows)
  })
})

app.get('/api/v1/foods/:id', (request, response) => {
  foodController.showFood(request, response)
})

app.get('/api/v1/meals', (request, response) => {
  // Meal.getAllMeals()
  // .then((data) => {
  //   if (data.rowCount == 0) { return response.sendStatus(404) }
  //   response.json(data.rows)
  // })

  // database.raw('SELECT * FROM meals')
  // .then((data) => {
  //   Promise.all(
  //     data.rows.map( (meal) => { 
  //       database.raw(
  //         `SELECT foods.id AS id, name, calories FROM foods
  //         INNER JOIN meals_foods ON foods.id = meals_foods.food_id
  //         WHERE meals_foods.meal_id = ?`, [meal.id]
  //       )
  //       .then( (data) => { data.rows })
  //     })
  //   )
  //   .then( (foods) => {
  //     let i = 0;
  //     return data.rows.map( (meal) => {
  //       let mealObject = new Meal(meal)
  //       mealObject.foods = foods[i]
  //       i++
  //       return mealObject
  //     })
  //     response.json(data.rows)
  //   })
  // })

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
})

if (!module.parent) {
  app.listen(app.get('port'), () => {
    console.log(`${app.locals.title} is running on ${app.get('port')}.`)
  })
}

module.exports = app
