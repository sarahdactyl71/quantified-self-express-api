const express = require('express')
const app = express()
const cors = require('cors')
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
app.use(cors())

app.get('/', (request, response) => {
  response.send(app.locals.title)
})

app.get('/api/v1/foods', (request, response) => {
  foodController.foodIndex(request, response)
})

app.get('/api/v1/foods/:id', (request, response) => {
  foodController.showFood(request, response)
})

app.post('/api/v1/foods', (request, response) => {
  foodController.create(request, response)
})

app.delete('/api/v1/foods/:id', (request, response) => {
  foodController.deleteFood(request, response)
})

app.get('/api/v1/meals', (request, response) => {
  mealController.allMeals(request, response)
})

app.get('/api/v1/meals/:id/foods', (request, response) => {
  mealController.showMeal(request, response)
})

app.put('/api/v1/foods/:id', (request, response) => {
  foodController.update(request, response)
})

app.post('/api/v1/meals/:id/foods/:id', (request, response) => {
  mealController.createFood(request, response)
})

app.delete('/api/v1/meals/:id/foods/:id', (request, response) => {
  mealController.deleteFood(request, response)
})

if (!module.parent) {
  app.listen(app.get('port'), () => {
    console.log(`${app.locals.title} is running on ${app.get('port')}.`)
  })
}

module.exports = app
