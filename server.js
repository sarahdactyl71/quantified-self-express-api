const express = require('express')
const app = express()
const bodyParser = require('body-parser')

const environment = process.env.NODE_ENV || 'development'
const configuration = require('./knexfile')[environment]
const database = require('knex')(configuration)

const Food = require('./lib/models/food')
const Meal = require('./lib/models/meal')
const foodController = require('./lib/controllers/foods')
const mealController = require('./lib/controllers/meals')

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
  mealController.allMeals(request, response)
})

app.get('/api/v1/meals/:id/foods', (request, response) => {
  const id = request.params.id
  Meal.getMeal(id)
  .then( (data) => {
    Meal.getMealsFoods(id)
    .then( (foods) => {
      const meal = Meal.addFoodsToMeal(data, foods)
      response.json(meal)
    })
  })
})

if (!module.parent) {
  app.listen(app.get('port'), () => {
    console.log(`${app.locals.title} is running on ${app.get('port')}.`)
  })
}

module.exports = app
