#!/usr/bin/env node
var baboon = require('luminance')(require('baboon-image'))
var imshow = require('ndarray-imshow')

var filter = require('ndarray-pack')(
  [[0, 1, 0],
  [1, -4, 1],
  [0, 1, 0]])

require('ndarray-convolve')(baboon, filter)
imshow(baboon)
