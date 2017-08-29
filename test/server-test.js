const assert = require('chai').assert
const app = require('../server')

describe('Server', function() {

  it('should exist', function() {
    assert(app.get)
  })

})
