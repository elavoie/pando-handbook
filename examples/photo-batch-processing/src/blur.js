var luminance = require('luminance')
var getPixels = require('get-pixels')
var savePixels = require('save-pixels')
var resample = require('ndarray-resample')
var zeros = require('zeros')
var blur = require('ndarray-gaussian-filter')
var path = require('path')
var log = require('debug')('blur')
var pando = require('pando-computing')

var beforeImg = null
var afterImg = null
var box = null
function createVisualization () {
  var title = document.createElement('h1')
  title.innerText = 'Processing Image'

  var beforeHeader = document.createElement('h2')
  beforeHeader.innerText = 'Before Image'
  beforeImg = new Image()
  beforeImg.width = 300
  beforeImg.height = 300

  var afterHeader = document.createElement('h2')
  afterHeader.innerText = 'After Image'
  afterImg = document.createElement('canvas')
  afterImg.width = 300
  afterImg.height = 300

  box = document.getElementById('visualization')
  box.appendChild(title)
  box.appendChild(beforeHeader)
  box.appendChild(beforeImg)
  box.appendChild(afterHeader)
  box.appendChild(afterImg)
}

module.exports['/pando/1.0.0'] = function (x, cb) {
  var info = JSON.parse(x)

  if (typeof document === 'undefined') {
    console.error('This script only runs in browsers')
    setTimeout(function () {
      cb(true)
    }, 3000)
  }

  // Visualization
  if (beforeImg === null) {
    createVisualization()
  }

  // Processing
  var startTime = new Date()
  log(JSON.stringify(info))
  var url = info.baseUrl + '/' + info.entity + '/' + info.preview
  // HACK: When Pando runs inside Docker the external IP address is unknown,
  //       replace with location.origin to get it
  url = url.replace(new RegExp(location.protocol + '//.*:8080'), location.protocol + '//' + location.hostname + ':8080')
  console.log('loading ' + url)
  beforeImg.src = url
  beforeImg.onload = function () {
    // Process
    log('performing convolution')
    getPixels(url, 'image/jpg', function (err, image) {
      if (err) {
        console.error(err)
        return cb(err)
      }
      var dataTransferTime = new Date() - startTime
      startTime = new Date()

      image = luminance(image)
      blur(image, 5)


      // Visualize the result
      var result = zeros([300, 300])
      resample(result, image)
      box.removeChild(afterImg)
      afterImg = savePixels(result, 'canvas')
      box.appendChild(afterImg)

      // Save the result
      savePixels(image, 'canvas').toBlob(function (resultBlob) {
        var cpuTime = new Date() - startTime
        startTime = new Date()

        // Transfer the data
        var url = info.result.baseUrl
        log('transferring result to ' + url)
        
        var filepath = info.result.entity + '/' + info.result.preview

        var form = new FormData()
        form.append('file', resultBlob, filepath)

        var xhr = new XMLHttpRequest()
        xhr.open('POST', url, true)

        xhr.onload = function () {
          if (xhr.status === 200) {

            dataTransferTime += new Date() - startTime
            pando.report({
              cpuTime: cpuTime,
              dataTransferTime: dataTransferTime,
              nbItems: 1,
              units: 'image'
            })

            console.log('transferred result')
            cb(null, JSON.stringify(info))
          } else {
            console.log('transfer error')  
            throw 'transfer error'
          }
        }
        xhr.send(form)
      }, 'image/jpeg')
    })
  }
}
