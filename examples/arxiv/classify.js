var title = null
var id = null
var published = null
var authors = null
var summary = null
var relevantBtn = null
var irrelevantBtn = null

function createVisualization () {
  title = document.createElement('h1')
  title.innerText = 'Article'

  id = document.createElement('a')
  id.setAttribute('href', 'URL')
  id.innerText = 'URL'

  published = document.createElement('p')
  published.innerText = 'PUBLISHED'

  authors = document.createElement('p')
  authors.innerText = 'AUTHORS'

  summary = document.createElement('p')
  summary.innerText = 'SUMMARY'

  relevantBtn = document.createElement('button')
  relevantBtn.innerText = 'Relevant!'
  relevantBtn.setAttribute('onclick', 'relevant()')

  irrelevantBtn = document.createElement('button')
  irrelevantBtn.innerText = 'Irrelevant'
  irrelevantBtn.setAttribute('onclick', 'irrelevant()')

  var box = document.getElementById('visualization')
  box.appendChild(title)
  box.appendChild(id)
  box.appendChild(published)
  box.appendChild(authors)
  box.appendChild(relevantBtn)
  box.appendChild(irrelevantBtn)
  box.appendChild(summary)
}

var _cb = null
global.relevant = function () {
  if (_cb && id) {
    var link = id.innerText
    _cb(null, JSON.stringify({
      link: link,
      relevant: true
    }))
  }
}

global.irrelevant = function () {
  if (_cb && id) {
    var link = id.innerText
    _cb(null, JSON.stringify({
      link: link,
      relevant: false
    }))
  }
}

module.exports['/pando/1.0.0'] = function (x, cb) {
  if (typeof document !== 'undefined' && title === null) {
    createVisualization()
  }

  var entry = JSON.parse(x)

  if (title !== null) {
    title.innerText = entry.title
    id.setAttribute('href', entry.link)
    id.innerText = entry.link
    published.innerText = entry.publishedDate
    if (typeof entry.author === 'string') {
      authors.innerText = entry.author
    } else {
      authors.innerText = entry.author.map(function (a) { return a.name }).join(', ')
    }
    summary.innerText = entry.content
    _cb = cb
  } else {
    // Hack in case Pando was not started with the '--start-idle' option
    setTimeout(function () {
      cb(true) // Error to force reassignment to another node
    }, 3000)
  }
}
