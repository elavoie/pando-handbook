var luminance = require('luminance')
var getPixels = require('get-pixels')
var savePixels = require('save-pixels')
var resample = require('ndarray-resample')
var zeros = require('zeros')
var blur = require('ndarray-gaussian-filter')
var toArrayBuffer = require('to-array-buffer')
var WebTorrent = require('webtorrent')
var Buffer = require('safe-buffer').Buffer

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

function process (info, torrent, cb) {
  torrent.on('error', function (err) {
    console.log('WebTorrent error: ' + err)
  })
  console.log('Searching for ' + info.preview)
  var file = torrent.files.find(function (file) {
    console.log('-- content: ' + file.name)
    return file.name.includes(info.preview)
  })
  if (!file) {
    console.log('File not found!')
    return cb(true)
  } else {
    console.log('File found: ' + file)
  }
  file.getBlobURL(function (err, url) {
    if (err) return cb(err)
    console.log('Displaying image')
    beforeImg.src = url

    beforeImg.onload = function () {
      // Process
      console.log('performing convolution')
      getPixels(url, 'image/jpg', function (err, image) {
        if (err) {
          console.error(err)
          return cb(err)
        }
        image = luminance(image)
        blur(image, 5)

        // Save the result
        var resultBuf = Buffer.from(
          toArrayBuffer(savePixels(image, 'canvas').toDataURL('image/jpeg'))
        )

        // Visualize the result
        var result = zeros([300, 300])
        resample(result, image)
        box.removeChild(afterImg)
        afterImg = savePixels(result, 'canvas')
        box.appendChild(afterImg)

        // Transfer the data
        console.log('seeding result')
        resultBuf.name = info.preview
        _result = resultBuf
        client.seed(resultBuf, 
        {
          announceList: [
            "wss://tracker.openwebtorrent.com",
            "wss://tracker.btorrent.xyz",
            "wss://tracker.fastcast.nz"
          ]
        },
        function (torrent) {
          info.result = {
            magnetLink: torrent.magnetURI,
            preview: info.preview
          }
          console.log('result seeded: ' + JSON.stringify(info))
          return cb(null, JSON.stringify(info))
        })
      })
    }
  })
}

var client = null 

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

  // Initialize WebTorrent
  if (client === null) {
    if (WebTorrent.WEBRTC_SUPPORT) {
      client = new WebTorrent()
      console.log('Initialized WebTorrent')
      client.on('error', function (err) { console.log('WebTorrent error: ' + err) })
    } else {
      console.log('No WebRTC support, aborting')
      return cb(true)
    }
  }


  // Processing
  console.log('Processing ' + JSON.stringify(info))
  if (client.get(info.magnetLink)) {
    console.log('Known torrent, reusing')
    process(info, client.get(info.magnetLink), cb)
  } else {
    console.log('Loading new torrent')
    client.add(info.magnetLink, function (torrent) { process(info, torrent, cb) })
  }
}
