var beforeImg = null
var afterImg = null
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
  afterImg = new Image()
  afterImg.width = 300
  afterImg.height = 300

  var box = document.getElementById('visualization')
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

      // Process
      console.log('copying input image to output')
      afterImg.src = dataUrl

      // Save the result
      console.log('saving result')
      DatArchive.create({
        title: 'Result Archive for ' + info.preview,
        description: 'Holds the results of the computation to transmit back'
      }).then(function (archive) {
        archive.writeFile(info.preview, buf).then(function () {
          info.result = {
            datArchive: archive.url,
            preview: info.preview
          }
          archive.commit()
          // Return the result
          return cb(null, JSON.stringify(info))
        }).catch(console.error)
      }).catch(console.error)
    // })
    })
}
