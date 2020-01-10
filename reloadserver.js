const WSS = require('websocket').server
const http = require('http')
const fs = require('fs')

function init() {
  let connections = []
  const server = http.createServer()
  server.listen(3003)

  const wss = new WSS({
    httpServer: server,
    autoAcceptConnections: false 
  })

  wss.on('request', request => {
    const connection = request.accept('autoreload', request.origin)
    connections.push(connection)
    setTimeout(() => {
      connections = connections.filter(c => c.state === 'open')
    }, 500)
  })

  let waitForUpdate = false

  function watch (pages) {
    pages.forEach(p => {

      console.log('watch dir:', p)
      fs.watch(p, (evt, filename) => {
        if (waitForUpdate) {
          return
        }
        if (watchFileType(filename)) {
          console.log('run update for file:', filename)
          waitForUpdate = true
          setTimeout(updateClients, 100);
        }
      })
    })
  }

  function watchFileType(filename) {
    return /.*\.(?:html|css)$/.test(filename)
  }

  function updateClients () {
    console.log(`update ${connections.length} clients`)
    connections.forEach(c => c.send('reload'))
    waitForUpdate = false
  }

  watch(['./src/Pages', './src', './src/css', './src/js']);
}


module.exports = {init}
