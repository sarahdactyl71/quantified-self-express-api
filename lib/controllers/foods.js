const Food = require('../../lib/models/food')

const showFood = (request, response, next) => {
  const id = request.params.id
  Food.getFood(id)
  .then((data) => {
    if (data.rowCount == 0) { return response.sendStatus(404) }

    response.json(data.rows[0])
  })
}

const foodIndex = (request, response) => {
  Food.getAllFoods()
  .then((data) => {
    response.json(data.rows)
  })
}

const create = (request, response) => {
  var name = request.body.name
  var calories = request.body.calories

  if(!name || !calories) {
    return response.status(422).send({ error: "Missing required fields"})
  }
  Food.createFood(name, calories).then( () => {
    Food.getAllFoods().then((data) => {
      return response.json(data.rows)
    })
  })
}

const deleteFood = (request, response) => {
  const foodID = request.params.id

  Food.deleteByID(foodID).then( () => {
    Food.getAllFoods().then((data) => {
      return response.json(data.rows)
    })
  })
}

module.exports = { showFood,
                  foodIndex,
                  create,
                  }
