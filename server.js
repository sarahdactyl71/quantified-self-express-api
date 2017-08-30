const express = require('express')
const app = express()
const bodyParser = require('body-parser')

const environment = process.env.NODE_ENV || 'development'
const configuration = require('./knexfile')[environment]
const database = require('knex')(configuration)

const Food = require('./lib/models/food')
const Meal= require('./lib/models/meal')
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
  foodController.foodIndex(request, response)
})

app.get('/api/v1/foods/:id', (request, response) => {
  foodController.showFood(request, response)
})

if (!module.parent) {
  app.listen(app.get('port'), () => {
    console.log(`${app.locals.title} is running on ${app.get('port')}.`)
  })
}

module.exports = app
