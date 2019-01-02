var interleaving = require('pull-lend-stream-random-tester')
var pando = require('pando-computing')

module.exports['/pando/1.0.0'] = function (x, cb) {
  var startTime = new Date()
  var options = JSON.parse(x)
  for (var i = 0; i < options.executions; ++i) {
    options.seed = Math.round(Math.random() * Math.pow(2, 31))
    try {
      interleaving(options)
    } catch (e) {
      return cb(null, JSON.stringify({
        options: options,
        success: false
      }))
    }
  }
  delete options.seed
  pando.report({
    cpuTime: new Date() - startTime,
    nbItems: options.executions,
    units: 'Tests'
  })

  cb(null, JSON.stringify({
    options: options,
    success: true
  }))
}
