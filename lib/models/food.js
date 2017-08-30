const environment = process.env.NODE_ENV || 'development'
const configuration = require('../../knexfile')[environment]
const database = require('knex')(configuration)

const getFood = (id) => {
  return database.raw("SELECT * FROM foods WHERE id=?", [id]) 
}

module.exports = {
  getFood,
}