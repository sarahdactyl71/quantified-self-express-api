const assert = require('chai').assert
const app = require('../server')
const request = require('request')

const environment = process.env.NODE_ENV || 'test'
const configuration = require('../knexfile')[environment]
const database = require('knex')(configuration)

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

  describe('GET /api/v1/foods/:id', () => {
    beforeEach( (done) => {
      database.raw(
        'INSERT INTO foods (name, calories) VALUES (?, ?)', ['banana', 35]
      ).then( () => { done () })
    })

    afterEach( (done) => {
      database.raw('TRUNCATE foods RESTART IDENTITY')
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

      this.request.get('/api/v1/foods' + id, (error, response) => {
        if (error) { done (error) }

        let parsedFood = JSON.parse(response.body)

        assert.equal(parsedFood.id, id)
        assert.equal(parsedFood.name, foodName)
        assert.equal(parsedFood.calories, foodCalories)
        done ()
      })
    })
  })
})
