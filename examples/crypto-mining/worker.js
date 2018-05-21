#!/usr/bin/env node
// Intended to be started by master in a different process
// usage: ./worker
//
var pull = require('pull-stream')
var sync = require('pull-sync')
var toPull = require('stream-to-pull-stream')
var split = require('split')
var log = require('debug')('worker')
var probe = require('pull-probe')

process.stdout.on('error', function (err) {
  if (err.code === 'EPIPE') {
    process.exit(1)
  } else {
    throw err
  }
})

log('worker started')

var stdio = sync({
  source: toPull.source(process.stdin.pipe(split(undefined, null, { trailing: false }))),
  sink: pull(
    pull.map(function (x) { return x + '\n' }),
    toPull.sink(process.stdout, function (err) {
      if (err) throw err
      log('closing')
    })
  )
})

pull(
  stdio,
  pull.through(function (x) { log('worker input: ' + x) }),
  pull.asyncMap(require('./miner.js')['/pando/1.0.0']),
  pull.through(function (x) { log('worker output: ' + x) }),
  probe('worker:sink'),
  stdio
)
