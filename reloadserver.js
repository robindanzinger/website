import * as websocket from 'websocket'
const WSS = websocket.server
import http from 'http'
import fs from 'fs'
import {watch} from './lib/watch.js'

export function reloadserver() {
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


  watch(['./src/blog', './src/Pages', './src', './src/css', './src/js'], updateClients, {filetypes: ['html', 'css', 'js'], sleep: 100} );

  async function updateClients () {
    console.log(`update ${connections.length} clients`)
    connections.forEach(c => c.send('reload'))
  }

}
