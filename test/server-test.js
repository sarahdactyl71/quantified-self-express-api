const assert = require('chai').assert
const app = require('../server')
const request = require('request')
const Food = require('../lib/models/food')

const environment = process.env.NODE_ENV || 'test'
const configuration = require('../knexfile')[environment]
const database = require('knex')(configuration)
const pry = require('pryjs')

describe('Server', () => {
  before( (done) => {
    this.port = 9876
    this.server = app.listen(this.port, (err, result) => {
      if (err) { return done (err) }
      done()
    })

    this.request = request.defaults({
      baseUrl: 'http://localhost:9876/'
    })
  })

  after( () => this.server.close())

  it('should exist', () => {
    assert(app)
  })

  describe('GET /', () => {
    it('should return a 200', (done) => {
      this.request.get('/', (error, response) => {
        if (error) { done(error) }
        assert.equal(response.statusCode, 200)
        done()
      })
    })

    it('should have a body with the name of the application', (done) => {
      const title = app.locals.title

      this.request.get('/', (error, response) => {
        if (error) { done(error) }
        assert(response.body.includes(title), `"${response.body}" does not include "${title}".`)
        done()
      })
    })
  })

  describe("GET /api/v1/foods", () => {
    beforeEach( (done) => {
      Promise.all([
        database.raw('INSERT INTO foods (name, calories) VALUES (?, ?)', ['Monster Cake', 1000]),
        database.raw('INSERT INTO foods (name, calories) VALUES (?, ?)', ['Everything Burrito', 300])
        .then( () =>  done () )
      ])
    })

    afterEach( (done) => {
      database.raw('TRUNCATE foods RESTART IDENTITY CASCADE')
      .then( () => { done () })
    })

    it('should return two foods from the resource', (done) => {
      this.request.get('/api/v1/foods', function(error, response) {
        if (error) { done(error) }

        const parsedFoods = JSON.parse(response.body)
        const firstFood = parsedFoods[0]
        const secondFood = parsedFoods[1]

        assert.equal(parsedFoods.length, 2)
        assert.equal(secondFood.name, 'Monster Cake')
        assert.equal(firstFood.name, 'Everything Burrito')
        assert.equal(firstFood.calories, 300)
        assert.equal(secondFood.calories, 1000)

        done ()
      })
    })
  })

  describe('GET /api/v1/foods/:id', () => {
    beforeEach( (done) => {
      database.raw(
        'INSERT INTO foods (name, calories) VALUES (?, ?)', ['banana', 35]
      ).then( () => { done () })
    })

    afterEach( (done) => {
      database.raw('TRUNCATE foods RESTART IDENTITY CASCADE')
      .then( () => { done () })
    })

    it('should return 404 if resource is not found', (done) => {
      this.request.get('/api/v1/foods/0', (error, response) => {
        if (error) { done (error) }
        assert.equal(response.statusCode, 404)
        done ()
      })
    })

    it('should return the id, food, and calories from the resource found', (done) => {
      const id = 1
      const foodName = 'banana'
      const foodCalories = 35

      this.request.get('/api/v1/foods/' + id, (error, response) => {
        if (error) { done (error) }

        let parsedFood = JSON.parse(response.body)
        assert.equal(parsedFood.id, id)
        assert.equal(parsedFood.name, foodName)
        assert.equal(parsedFood.calories, foodCalories)
        done ()
      })
    })
  })

  
  describe('POST /api/v1/foods', () => {
    afterEach( (done) => {
      database.raw('TRUNCATE foods RESTART IDENTITY CASCADE')
      .then( () => { done () })
    })
    
    it('should take and return data', (done) => {
      const food = {
        name: "Sushi",
        calories: 400
      }
      
      this.request.post('/api/v1/foods', { form: food }, (error, response) => {
        if (error) { done(error) }
        
        const parsedFoods = JSON.parse(response.body)
        const firstFood = parsedFoods[0]
        
        // console.log(parsedFoods)
        
        assert.equal(parsedFoods.length, 1)
        assert.equal(firstFood.name, "Sushi")
        assert.equal(firstFood.calories, 400)
        
        done()
      })
    })
    
    it('should send 422 when food name is absent', (done) => {
      const food = {
        name: "",
        calories: "800"
      }
      
      this.request.post('/api/v1/foods', { form: food }, (error, response) => {
        if(error) { done(error) }
        
        const parsedFoods = JSON.parse(response.body)
        
        Food.getAllFoods().then((data) => {
          assert.equal(data.rows.length, 0)
        })
        assert.equal(response.statusCode, 422)
        done()
      })
    })
    
    it('should send 422 when food calories are absent', (done) => {
      const food = {
        name: "Macaroni and Cheese",
        calories: ""
      }
      
      this.request.post('/api/v1/foods', { form: food }, (error, response) => {
        if(error) { done(error) }
        
        const parsedFoods = JSON.parse(response.body)
        
        Food.getAllFoods().then((data) => {
          assert.equal(data.rows.length, 0)
        })
        assert.equal(response.statusCode, 422)
        done()
      })
    })
  })
  
  describe('PUT /api/v1/foods/:id', () => {
    beforeEach( (done) => {
      database.raw('INSERT INTO foods (name, calories) VALUES (?, ?)', ['roll', 200])
      .then( () => { done () })
    })

    afterEach( (done) => {
      database.raw('TRUNCATE foods RESTART IDENTITY CASCADE')
      .then( () => { done () })
    })

    it('should change the name and calories of the food', (done) => {
      let id = 1
      let name = 'jelly'
      let calories = 400
      const foodObject = {food: {id, name, calories}}

      this.request.put('/api/v1/foods/' + id, { form: foodObject }, (error, response) => {
        if (error) { done (error) }
        const updatedFood = JSON.parse(response.body)
        assert.equal(updatedFood.id, id)
        assert.equal(updatedFood.name, name)
        assert.equal(updatedFood.calories, calories)
      })
        done ()
      })
    })

  describe('DELETE /api/v1/meals/:id/foods/:id', () => {
    beforeEach( (done) => {
      database.raw('INSERT INTO meals (name) VALUES (?)', ['brunch'])
      database.raw('INSERT INTO foods (name, calories) VALUES (?, ?)', ['bread', 50])
      .then( () => {
        database.raw('INSERT INTO meals_foods (food_id, meal_id) VALUES (?, ?)', [1, 1])
      })
      .then( () => { done () })
    })

    afterEach( (done) => {
      database.raw('TRUNCATE foods RESTART IDENTITY CASCADE')
      database.raw('TRUNCATE meals RESTART IDENTITY CASCADE')
      database.raw('TRUNCATE meals_foods RESTART IDENTITY')
      .then( () => { done () })     
    })

    it('should remove the food from the meals_foods table', () => {
      let foodID = 1
      let mealID = 1
      this.request.delete('/api/v1/meals/' + mealID + '/foods/' + foodID, (error, response) => {
        if (error) { done (error) }
      })
      this.request.get('/api/v1/meals/' + mealID + '/foods/' + foodID, (error, response) => {
        assert.equal(response.statusCode, 404)
      })

    })
  })

  describe('GET /api/v1/meals', () => {
    beforeEach( (done) => {
      database.raw('INSERT INTO meals (name) VALUES (?)', ['brunch'])
      database.raw('INSERT INTO meals (name) VALUES (?)', ['supper'])
      database.raw('INSERT INTO foods (name, calories) VALUES (?, ?)', ['bread', 50])
      database.raw('INSERT INTO foods (name, calories) VALUES (?, ?)', ['buns', 85])
      database.raw('INSERT INTO foods (name, calories) VALUES (?, ?)', ['babka', 425])
      database.raw('INSERT INTO foods (name, calories) VALUES (?, ?)', ['roll', 200])
      .then( () => { 
        database.raw('INSERT INTO meals_foods (food_id, meal_id) VALUES (?, ?)', [1, 1])
        database.raw('INSERT INTO meals_foods (food_id, meal_id) VALUES (?, ?)', [2, 1])
        database.raw('INSERT INTO meals_foods (food_id, meal_id) VALUES (?, ?)', [3, 2])
        database.raw('INSERT INTO meals_foods (food_id, meal_id) VALUES (?, ?)', [4, 2])
        database.raw('INSERT INTO meals_foods (food_id, meal_id) VALUES (?, ?)', [1, 2])
      })
      .then( () => { done () })
    })

    afterEach( (done) => {
      database.raw('TRUNCATE foods RESTART IDENTITY CASCADE')
      database.raw('TRUNCATE meals RESTART IDENTITY CASCADE')
      database.raw('TRUNCATE meals_foods RESTART IDENTITY')
      .then( () => { done () })
    })

    it('should return the id, meal name, and foods from the resources found', (done) => {
      let name = 'brunch'
      let otherName = 'supper'
      this.request.get('/api/v1/meals', (error, response) => {
        if (error) { done (error) }
        let parsedMeals = JSON.parse(response.body)
        assert.equal(parsedMeals[0].name, name)
        assert.equal(parsedMeals[1].name, otherName)
      })
      done ()
    })
  })

  describe('GET /api/v1/meals/:id/foods', () => {
    beforeEach( (done) => {
      database.raw('INSERT INTO meals (name) VALUES (?)', ['brunch'])
      database.raw('INSERT INTO foods (name, calories) VALUES (?, ?)', ['bread', 50])
      database.raw('INSERT INTO foods (name, calories) VALUES (?, ?)', ['buns', 85])
      database.raw('INSERT INTO foods (name, calories) VALUES (?, ?)', ['babka', 425])
      database.raw('INSERT INTO foods (name, calories) VALUES (?, ?)', ['roll', 200])
      .then( () => { 
        database.raw('INSERT INTO meals_foods (food_id, meal_id) VALUES (?, ?)', [1, 1])
        database.raw('INSERT INTO meals_foods (food_id, meal_id) VALUES (?, ?)', [2, 1])
        database.raw('INSERT INTO meals_foods (food_id, meal_id) VALUES (?, ?)', [3, 1])
        database.raw('INSERT INTO meals_foods (food_id, meal_id) VALUES (?, ?)', [4, 1])
      })
      .then( () => { done () })
    })

    afterEach( (done) => {
      database.raw('TRUNCATE foods RESTART IDENTITY CASCADE')
      database.raw('TRUNCATE meals RESTART IDENTITY CASCADE')
      database.raw('TRUNCATE meals_foods RESTART IDENTITY')
      .then( () => { done () })
    })

    it('should return the food id, name, and calories from the resources found', (done) => {
      let name = 'bread'
      let id = 1
      this.request.get('/api/v1/meals/' + id + '/foods', (error, response) => {
        if (error) { done (error) }
        let parsedMeals = JSON.parse(response.body)
        assert.equal(parsedMeals[0].name, name)
        assert.equal(parsedMeals[1].name, otherName)
      })
      done ()
    }) 
  })

})
