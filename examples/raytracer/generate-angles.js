#!/usr/bin/env node

var pull = require('pull-stream')
var toPull = require('stream-to-pull-stream')

process.stdout.on('error', function( err ) {
    if (err.code == "EPIPE") {
        process.exit(1);
    }
});

pull(
    pull.count(100),
    pull.map(function (x) { return 2 * Math.PI * x / 100 }),
    pull.map(function (x) { return String(x) + '\n' }),
    toPull.sink(process.stdout)
)
