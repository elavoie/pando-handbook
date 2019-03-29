#!/usr/bin/env node

var pull = require('pull-stream')
var split = require('split')
var toPull = require('stream-to-pull-stream')
var argv = require('minimist')(process.argv)

var startStep = argv['start-step'] ? Number(argv['start-step']) : 0
var endStep = argv['end-step'] ? Number(argv['end-step']) : Infinity

var logs = {}
var lastMessage = {}
var currentStep = 0

pull(
  toPull.source(process.stdin.pipe(split(undefined, null, { trailing: false }))),
  pull.filter(function (s) {
    var step = currentStep++
    if (step < startStep || step > endStep) return false
    
    return s.match('pando-computing:monitoring') 
  }),
  pull.drain(function (s) {
    var m = s.match('.*pando-computing:monitoring ({.*})')
    var s = JSON.parse(m[1])
    for (var id in s.volunteers) {
      var canon = JSON.stringify(s.volunteers[id])
      if (lastMessage[id] === canon) { continue }
      else { lastMessage[id] = canon }

      if (!logs[id]) { logs[id] = [] }
      logs[id].push(s.volunteers[id])
    }
  }, function () {
    var combined = {}
    for (var id in logs) {
      var timeElapsed = 0
      var totalItems = 0
      var name = ''
      logs[id].forEach(function (s) {
        timeElapsed += s.lastReportInterval / 1000
        totalItems += s.nbItems
        name = s.deviceName
      })
      if (name.indexOf('Huawei') !== -1) {
        combined[name + ' (' + id + ')'] = {
          id: id,
          name: name + ' (' + id + ')',
          throughput: totalItems/timeElapsed
        }
      } else if (!combined[name]) {
        combined[name] = {
          id: id,
          name: name,
          throughput: totalItems/timeElapsed
        }
      } else {
        combined[name].throughput += totalItems/timeElapsed
      } 
    }

    // Prepare calculation of percentages
    var totalThroughput = 0
    for (var name in combined) {
      totalThroughput += combined[name].throughput
    }

    // Display
    for (var name in combined) {
      console.log(name + ' ' + Number(combined[name].throughput).toFixed(2) + ' ' + Number((combined[name].throughput/totalThroughput) * 100).toFixed(2) + '%')
    }

    console.log('Total: ' + Number(totalThroughput).toFixed(2) + ' items/s')
  })
)
