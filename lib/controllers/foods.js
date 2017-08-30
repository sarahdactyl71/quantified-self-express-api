const Food = require('../../lib/models/food')

const showFood = (request, response, next) => {
  const id = request.params.id
  Food.getFood(id)
  .then((data) => {
    if (data.rowCount == 0) { return response.sendStatus(404) }

    response.json(data.rows[0])
  })
}

module.exports = { showFood }