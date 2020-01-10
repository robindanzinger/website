const socket = new WebSocket('ws://localhost:3003/', 'autoreload')

console.log('sock', socket)

socket.onmessage = (msg) => {
  if (/reload/.test(msg.data)) {
    setTimeout(() => {
    location.reload(true)
    }, 100)
  }
}
