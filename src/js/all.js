const contentNode = document.getElementsByClassName("content")[0]
const inputNode = document.getElementsByTagName("input")[0];
const promptNode = document.getElementById("prompt");
inputNode.addEventListener("keyup", function(event) {
    if (event.key === "Enter") {
      handleEnter()
    }
});
let pwd = "~"

const folders = {
  "index.html": "file",
  "übermich.html": "file",
  "projekte": {
    "zusammenfassung.html": "file",
    "fiducia": "file",
    "1&1": "file"
  },
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

function handleEnter() {
  const inputString = inputNode.value
  const inputArray = inputString.split(" ")
  const cmd = inputArray[0]
  const arg = inputArray[1]
  inputNode.value = ""

  appendLine(getPrompt() + inputString)
  switch(cmd) {
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
    case "matrix":
      matrix()
      break
    default: 
      appendLine("unknown command: " + cmd)
  }
  promptNode.scrollIntoView()
}

function getPrompt() {
  return style("guest@robindanzinger:" + pwd + "$ ", "brown bold") 
}

function clearContent() {
  contentNode.innerHTML = ""
}

function showFiles() {
  for (file in currentFolder) {
    console.log(file)
    if (currentFolder[file] === "file") {
      appendStyledLine(file, "bold")
    } else {
      appendStyledLine(file, "lightblue bold");
    }
  }
}

function appendLine(text) {
  console.log("append line", text)
  contentNode.innerHTML += text + "<br>"
}

function appendStyledLine(text, styles) {
  console.log("append styled line", text)
  contentNode.innerHTML += style(text,styles) + "<br>"
}

function showTable(data, styles) {
  let t = "<table>"
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
  for (pathpart of paths) {
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

function matrix() {
  clearContent()
  contentNode.style.height = "90vh"
  contentNode.innerHTML = "<canvas id='canvas' class='matrix' width='" + contentNode.offsetWidth + "' height='" + (contentNode.offsetHeight - 20) + "'></canvas>"
  const canvas = document.getElementById("canvas")
  const context = canvas.getContext("2d")
  context.font = "1.2rem monospace"
  context.fillStyle = "green"

  const width = canvas.width
  const height = canvas.height
  const fontSizeInPx = parseInt(getComputedStyle(document.documentElement).fontSize)
  const columns = Math.round(width / fontSizeInPx)
  const rows = Math.round(height / fontSizeInPx) + 2


  const rowgap = 1.5
  console.log(fontSizeInPx, "font")
  const snakes = new Array(columns)
  for (let i = 0; i < snakes.length; i++) {
    snakes[i] = []
  }

  function animate() {
    context.clearRect(0, 0, width, height)
    console.log("anim")
    requestAnimationFrame(animate)
    for (let c = 0; c < columns; c++) {
      if (Math.random() > 0.99) {
        snakes[c].push(createSnake(rows))
      }
      snakes[c].forEach(snake => {
        const x = c * fontSizeInPx
        for (let snakepart = 0; snakepart < snake.length; snakepart++) {
          const y = (snake.position - snakepart) * fontSizeInPx * rowgap
          context.fillStyle = snakepart == 0 ? "oldlace" : "green"
          context.fillText(snake.elements[snakepart], x, y)
        }
        snake.position += 1
        if (snake.position > rows + snake.length) {
          snakes[c].unshift()
        }
      })
    }
  }

const letters = "安吧八爸百北不岛的弟地东都对多二哥个关贵国过好很会见叫姐京九李零六妈么没美妹们名明那南你您起千去认日上谁什生师十识是四她台天万王我五息系先香想小谢姓休学一亿英友月张这中字".split('');
  function createSnake(maxrows) {
    return {
      "elements": letters,
      "position": 3,
      "length": 30
    }
  }

  animate()
}

