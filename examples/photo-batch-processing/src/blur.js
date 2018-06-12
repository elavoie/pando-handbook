var luminance = require('luminance')
var getPixels = require('get-pixels')
var savePixels = require('save-pixels')
var resample = require('ndarray-resample')
var zeros = require('zeros')
var blur = require('ndarray-gaussian-filter')
var toArrayBuffer = require('to-array-buffer')

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
  console.log(JSON.stringify(info))
  var source = new DatArchive(info.datArchive)
  source.readFile(info.entity + '/' + info.preview, 'binary')
    .then(function (buf) {
      // Preview
      var blob = new Blob([buf], {type: 'image/jpg'})
      var dataUrl = URL.createObjectURL(blob)
      beforeImg.src = dataUrl
      beforeImg.onload = function () {
        // Process
        console.log('performing convolution')
        getPixels(dataUrl, 'image/jpg', function (err, image) {
          if (err) {
            console.error(err)
            return cb(err)
          }
          image = luminance(image)
          blur(image, 5)

          // Save the result
          var resultBuf = toArrayBuffer(
            savePixels(image, 'canvas').toDataURL('image/jpeg')
          )

          // Visualize the result
          var result = zeros([300, 300])
          resample(result, image)
          box.removeChild(afterImg)
          afterImg = savePixels(result, 'canvas')
          box.appendChild(afterImg)

          // Transfer the data
          console.log('transferring result')
          DatArchive.create({
            title: 'Result Archive for ' + info.preview,
            description: 'Holds the results of the computation to transmit back'
          }).then(function (archive) {
            archive.writeFile(info.preview, resultBuf).then(function () {
              info.result = {
                datArchive: archive.url,
                preview: info.preview
              }
              archive.commit()
              // Return the result
              return cb(null, JSON.stringify(info))
            }).catch(console.error)
          }).catch(console.error)
        })
      }
    })
}
