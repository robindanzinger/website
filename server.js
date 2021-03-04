import express from 'express'
const app = express()
import {reloadserver} from './reloadserver.js'
import {watch} from './lib/watch.js'
const port = 3000
import fs from 'fs'
import {exec} from 'child_process'
import util from 'util'
const asyncExec = util.promisify(exec);

app.use(express.static('src'))
app.use(express.static('dist', {extensions:['html']}))

app.get("/page/", function (req, res) {
  const html = fs.readFileSync(`./src/Pages/index.html`, 'utf-8')
  res.send(renderPage(html))
})
app.get("/blog/:filename", function (req, res) {
  const file = req.params.filename.indexOf(".html") > 0 ? req.params.filename : req.params.filename + ".html" 
  const html = fs.readFileSync(`./src/blog/${file}`, 'utf-8')
  const fullhtml = html.substring(0, html.indexOf('</body>')) + `
      <script src="/reloadpage.js"></script>
      </body>
      </html>
   `
  res.send(fullhtml)
})
app.get("/page/:filename", function (req, res) {
  const file = req.params.filename.indexOf(".html") > 0 ? req.params.filename : req.params.filename + ".html" 
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
reloadserver()

// generate asciidoc
async function createAsciiDoc(filename) {
  console.log('file', filename)
  const cmd = `asciidoctor ./src/blog/${filename}`
  try {
    await asyncExec(cmd);
  } catch (e) {
    console.log(e)
  }
}
console.log('watch')
watch(['./src/blog'], createAsciiDoc, {filetypes: ['adoc'], sleep: 100})

app.listen(port, () => console.log(`Listening to port ${port}`))
