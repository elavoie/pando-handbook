var debug = require('debug')
var log = debug('square')
var pando = require('pando-computing')

module.exports['/pando/1.0.0'] = function (x, cb) {
  log('started processing ' + x)
  var startTime = new Date()
  setTimeout(function () {
    x = Number.parseInt(JSON.parse(x))
    var r = x * x
    log('returning ' + r)
    var endTime = new Date()

    pando.report({
      cpuTime: endTime - startTime,
      nbItems: 1,
      units: 'Numbers'
    })
    cb(null, r)
  }, 1000)
}
