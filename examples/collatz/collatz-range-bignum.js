var Big = require('bignumber.js')

function collatz (n) {
  n = new Big(n)
  var y = 0
  while (n.gt(1)) {
    if (n.mod(2).eq(0)) {
      n = n.div(2)
    } else {
      n = n.times(3).plus(1)
    }
    y = y + 1
  }
  return y
}

module.exports = collatz

// Pando convention
module.exports['/pando/1.0.0'] = function (x, cb) {
  try {
    var interval = JSON.parse(x)
    var start = new Big(interval.start)
    var range = new Big(interval.range)
    var limit = start.plus(range)
    var largest = 0

    for (var i = start; i.lt(limit); i = i.plus(1)) {
      var r = collatz(i)
      if (r > largest) {
        largest = r
      }
    }

    interval.largest = largest

    cb(null, JSON.stringify(interval))
  } catch (e) {
    console.log('error: ' + e)
    cb(e)
  }
}
