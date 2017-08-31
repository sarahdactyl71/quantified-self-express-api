const environment = process.env.NODE_ENV || 'development'
const configuration = require('../../knexfile')[environment]
const database = require('knex')(configuration)

const getFood = (id) => {
  return database.raw("SELECT * FROM foods WHERE id=?", [id])
}

const getAllFoods = () => {
  return database.raw("SELECT * FROM foods")
}

const createFood = (name, calories) => {
  return database.raw('INSERT INTO foods (name, calories) VALUES (?, ?)', [name, calories])
}

module.exports = {
  getFood,
  getAllFoods,
  createFood,
}
