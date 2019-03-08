#!/usr/bin/env node

var fs = require('fs')
var data = JSON.parse(fs.readFileSync(process.argv[2]))

var results = {
  nbAttempts: 0,
  nbConfirmed: 0,
  latencies: []
}

var attempts = {}

for (var i = 0; i < data.length; ++i) {
  var ev = data[i]  
  if (ev.type === 'webrtc-connection-attempt') {
    results.nbAttempts++

    if (!attempts[ev.origin]) {
      attempts[ev.origin] = {}
    }
    attempts[ev.origin][ev.destination] = ev
  } else if (ev.type === 'webrtc-connection-confirmed') {
    results.nbConfirmed++
    results.latencies.push(new Date(ev.timestamp) - new Date(attempts[ev.origin][ev.destination].timestamp))
  }
}

var min = Infinity
var max = -Infinity

for (var i = 0; i < results.latencies.length; ++i) {
  var latency = Number(results.latencies[i])
  if (latency < min) {
    min = latency
  } 

  if (latency > max) {
    max = latency 
  }
}


var step = (max + 100) / 20.
var pdf_latencies = []
var counts = []
for (var i = 0; i <= 20; ++i) {
  pdf_latencies.push(i*step)
  var count = 0
  for (var j = 0; j < results.latencies.length; ++j) {
    if (results.latencies[j] <= i*step) {
      count++
    }
  }
  counts.push(count)
}

console.log('nb attempts: ' + results.nbAttempts)
console.log('nb confirmed: ' + results.nbConfirmed)
console.log('success %: ' + (results.nbConfirmed/results.nbAttempts)*100)
console.log('min latency (ms): ' + min)
console.log('max latency (ms): ' + max)
console.log('latencies: ' + JSON.stringify(pdf_latencies))
console.log('counts: ' + JSON.stringify(counts))
