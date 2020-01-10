const express = require('express')
const app = express()
const reloadserver = require('./reloadserver.js')
const port = 3000
const fs = require('fs')

app.use(express.static('src'))
app.use(express.static('dist'))

app.get("/page/", function (req, res) {
  const html = fs.readFileSync(`./src/Pages/index.html`, 'utf-8')
  res.send(renderPage(html))
})
app.get("/page/:filename", function (req, res) {
  const file = req.params.filename 
  const html = fs.readFileSync(`./src/Pages/${file}`, 'utf-8')
  res.send(renderPage(html))
})
function renderPage(html) {
  const prehtml = fs.readFileSync(`./pre.html`, 'utf-8')
  const posthtml = fs.readFileSync(`./post.html`, 'utf-8')
  return `${prehtml}
          ${html}
          <script src="/reloadpage.js"></script>
          ${posthtml}`
}
reloadserver.init()
app.listen(port, () => console.log(`Listening to port ${port}`))
