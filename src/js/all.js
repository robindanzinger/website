const contentNode = document.getElementsByClassName("content")[0]
const inputNode = document.getElementsByTagName("input")[0];
const promptNode = document.getElementById("prompt");
inputNode.addEventListener("keyup", function(event) {
    if (event.key === "Enter" || event.key === "Go") {
      handleEnter()
    }
});
let pwd = "~"

const folders = {
  "index.html": "file",
  "projects.html": "file",
  "about.html": "file",
  "example": {
    "hello": "file",
    "world": "file",
    "foo": {},
    "bar": {}
  },
  "impressum.html": "file",
  "datenschutz.html": "file"
}
let currentFolder = folders
let zoom = 0

function handleEnter() {
  const inputString = inputNode.value
  const inputArray = inputString.split(" ")
  const cmd = inputArray[0].trim()
  const arg = inputArray[1]
  inputNode.value = ""

  appendLine(getPrompt() + inputString)
  if (matrixRunning) {
    console.log("stopmatrix")
    stopMatrix()
    if (cmd === "zoomout" && zoom < 2) {
      zoom++
      matrix()
      return;
    }
  }
  zoom = 0
  
  switch(cmd) {
    case "":
      break;
    case "clear": 
      clearContent()
      break
    case "ls":
      showFiles()
      break
    case "cd":
      changeDirectory(arg)
      break
    case "help":
      showHelp()
      break
    case "open":
      openFile(arg)
      break
    case "matrix":
      matrix()
      break
    default: 
      appendLine("unknown command: " + cmd)
  }
  promptNode.scrollIntoView()
}

function getPrompt() {
  return style("guest@robindanzinger.de:" + pwd + "$ ", "brown bold") 
}

function clearContent() {
  contentNode.innerHTML = ""
}

function showFiles() {
  for (let file in currentFolder) {
    if (currentFolder[file] === "file") {
      appendStyledLine(file, "bold")
    } else {
      appendStyledLine(file, "lightblue bold");
    }
  }
}

function appendLine(text) {
  contentNode.innerHTML += text + "<br>"
}

function appendStyledLine(text, styles) {
  contentNode.innerHTML += style(text,styles) + "<br>"
}

function showTable(data) {
  let t = "<table class='simpleborder'>"
  data.forEach(row => {
    t += "<tr>"
    row.forEach(cell => {
      t += "<td>" + cell + "</td>"
    })
    t += "</tr>"
  });
  t += "</table>"
  return t
}

function style(text, styles) {
  return "<span class=\"" + styles + "\">" + text + "</span>"
}

function changeDirectory(folder = "~") {
  switch (folder) {
    case "..": 
      changeToFolder(folder)
      break;
    case ".":
      break
    case "~":
    case "": 
    case " ":
      changeToFolder("~")
      break;
    default: 
      if (exist(folder) && folder !== "_files") {
        changeToFolder(folder)
      } else {
        appendLine("Directory does not exist")
      }
  }
}

function exist(folder) {
  return getFolder(pwd + "/" + folder) != null
}

function getFolder(fullpath) {
  const paths = fullpath.split("/")
  let selectedfolder = folders
  for (let pathpart of paths) {
    if (pathpart == "~") {
      selectedfolder = folders
    } else {
      selectedfolder = selectedfolder[pathpart]
      if (!selectedfolder || selectedfolder === "file")
        return undefined 
    }
  }
  return selectedfolder 
}

function changeToFolder(folder) {
  if (folder == "..") {
    if (pwd.lastIndexOf("/") > 0) {
      pwd = pwd.substring(0, pwd.lastIndexOf("/"))
    }
  } else if (folder == "~") {
    pwd = "~"
  } else {
    pwd += "/" +folder
  }
  promptNode.innerHTML = getPrompt()
  currentFolder = getFolder(pwd)
}

function openFile(file) {
  if (currentFolder[file] !== 'file') {
    appendLine("File not found:" + file)
    return
  }
  window.location = file
}

function showHelp() {
  const lines = ["Help",
    "Version1.0",
    "",
  ]
  lines.forEach(appendLine)
  appendLine(showTable([
    [style("help:", "helpkeyword"), "Zeigt diese Hilfe an"],
    [style("clear:", "helpkeyword"), "Löscht den Inhalt des Terminals"],
    [style("ls:", "helpkeyword"), "Listet den Inhalt des aktuellen Verzeichnisses auf"],
    [style("cd [directory]:", "helpkeyword"), "Wechselt in das Verzeichnis [directory]"],
    [style("| [dir] = '..':", "nowrap helpkeyword tab"), "Wechselt in das Elternverzeichnis"],
    [style("| [dir] = '.':", "nowrap helpkeyword tab"), "Wechselt in das aktuelle Verzeichnis"],
    [style("open [file]:", "helpkeyword"), "Öffnet die angegebene Datei"],
    [style("cat [file]:", "helpkeyword"), "Zeigt den Inhalt der Datei im Terminal an"],
    [style("matrix:", "helpkeyword"), "Zeigt die Matrix an"]
  ]))
}

let matrixRunning = false
function matrix() {
  matrixRunning = true
  clearContent()
  contentNode.style.height = "calc(100vh - 5.6rem)"
  contentNode.innerHTML = "<canvas id='canvas' class='matrix' width='" + contentNode.offsetWidth + "' height='" + (contentNode.offsetHeight - 20) + "'></canvas>"
  const canvas = document.getElementById("canvas")
  const context = canvas.getContext("2d")

  let creationProbability = 0.99
  let fontsize = 1
  if (zoom == 1) {
    fontsize = 0.9
  }
  else if (zoom == 2) {
    fontsize = 0.5
  }

  const fontSizeInPx = parseInt(getComputedStyle(document.documentElement).fontSize)
  const columnwidth = fontSizeInPx * fontsize 
  const rowheight = fontSizeInPx * fontsize 
  const width = canvas.width
  const height = canvas.height
  const columns = Math.round(width / columnwidth)
  const rows = Math.round(height / rowheight) + 2

  const letters = "安吧八爸百北不岛的弟地东都对多二哥个关贵国过好很会见叫姐京九李零六妈么没美妹们名明那南你您起千去认日上谁什生师十识是四她台天万王我五息系先香想小谢姓休学一亿英友月张这中字0123456789".split('');

  const field = new Array()
  function initField() {
    for (let i = 0; i < columns; i++) {
      field.push([])
      for (let j = 0; j < rows; j++) {
        const letter = letters[Math.floor(Math.random() * letters.length)]
        field[i].push(letter)
      }
    }
  }

  function changeField() {
    for (let i = 0; i < columns; i++) {
      field.push([])
      for (let j = 0; j < rows; j++) {
        if (Math.random() > 0.95) {
          field[i][j] = letters[Math.floor(Math.random() * letters.length)]
        }
      }
    }
  }
  initField()

  const drops = new Array(columns)
  for (let i = 0; i < drops.length; i++) {
    drops[i] = []
  }
 
  let lasttime = 0

  function animate() {
    context.globalCompositeOperation = "source-over"
    context.font = fontsize + "rem monospace"
    if (Date.now() - lasttime < 50) {
      requestAnimationFrame(animate)
      return
    }
    context.clearRect(0, 0, width, height)
    if (matrixRunning) 
        requestAnimationFrame(animate)
    changeField()
    for (let c = 0; c < columns; c++) {
      if (Math.random() > creationProbability) {
        drops[c].push(createDrop(rows))
      }
      drops[c].forEach(drop => {
        const x = c * columnwidth
        for (let dropPart = 0; dropPart < drop.length; dropPart++) {
          const pos = Math.floor(drop.position)
          const r = pos - dropPart
          if (r >= 0 && r < rows) {
            context.fillStyle = getColor(dropPart, drop.length)
            const y = (pos - dropPart) * rowheight
            context.fillText(field[c][r], x, y)
          }
        }
        drop.position += drop.speed
        if (drop.position > rows + drop.length) {
          drops[c].unshift()
        }
      })
    }
    if (zoom == 1) {
      context.globalCompositeOperation = "destination-in"
      context.beginPath();
      context.lineWidth = 400
      context.moveTo(-100, height / 2  + 10);
      context.bezierCurveTo(width / 4, height / 10, width * 3 / 4, height / 9, width + 100, height * 2);
      context.stroke();
    }
    if (zoom == 2) {
      context.globalCompositeOperation = "destination-in"
      context.font = width * 0.7 + "px monospace"
      context.fillText("42", width / 10, height)
    }
    lasttime = Date.now()
  }

  function getColor(part, length) {
    const maxLightness = 60
    if (part == 0) return "oldlace"
    const lightness = Math.floor(maxLightness - (part / length * maxLightness))
    return "hsl(120, 100%, " + lightness + "%)"
  } 

  function createDrop(maxrows) {
    return {
      "position": 0,
      "length": Math.floor(Math.random() * 1.5 * maxrows) + 5,
      "speed": Math.floor(Math.random() * 7) / 7 + 0.4
    }
  }

  animate()
}

function stopMatrix() {
  matrixRunning = false
  const canvas = document.getElementById("canvas")
  canvas.parentNode.removeChild(canvas)
  contentNode.style.height = "auto"
}
