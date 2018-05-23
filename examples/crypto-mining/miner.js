var shajs = require('sha.js')
var log = require('debug')('miner')

// Bitcoin minimum target: '00000000FFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFF'
// Bitcoin maximum target: 'FFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFF'

module.exports['/pando/1.0.0'] = function (x, cb) {
  /*
   * {
   *   block: String,
   *   target: String (hex),
   *   range: Number (Number of nonces),
   *   seed: Number (starting nonce)
   * }
   */
  var job = JSON.parse(x)
  var block = new Buffer(job.block)
  var packedTarget = new Buffer(job.target, 'hex')
  // packedTarget format: 0xOODDDDDD
  // target: 0xDDDDDD * (2**(8*(0xOO - 3)))
  var target = new Buffer(32).fill(0)
  var data = packedTarget.slice(1)
  var offset = (32 - packedTarget[0])
  target.fill(data, offset, offset + 3)

  log('block: ' + block.toString())
  log('target: ' + target.toString('hex'))
  log('range: ' + job.range)
  log('seed: ' + job.seed)

  var result = {
    block: job.block,
    target: job.target,
    success: false, // Boolean
    attempts: 0,    // Integer
    nonce: null     // null or String
  }

  var nonce = job.seed
  while (nonce < job.seed + job.range) {
    var hash = shajs('sha256').update(nonce.toString()).update(block).digest()
    result.attempts++
    if (target.compare(hash) >= 0) {
      result.success = true
      result.nonce = nonce
      log('hash: ' + hash.toString('hex'))
      return cb(null, JSON.stringify(result))
    }
    nonce++
  }

  // None found
  return cb(null, JSON.stringify(result))
}
