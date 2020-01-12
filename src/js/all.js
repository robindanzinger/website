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
  "home.txt": "file",
  "about.txt": "file",
  "projects": {
  },
  "example": {
    "hello": "file",
    "world": "file",
    "foo": {},
    "bar": {}
  }
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
    default: 
      appendLine("unknown command: " + cmd)
  }
}

function getPrompt() {
  return "guest@robindanzinger:" + pwd + "$ " 
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
  contentNode.innerHTML += "<br>" + text
}

function appendStyledLine(text, styles) {
  console.log("append styled line", text)
  contentNode.innerHTML += "<br><span class=\"" + styles + "\">" + text + "</span>"
}

function style(text, styleclass) {
  return "<span class=\"" + styleclass + "\">" + text + "</span>"
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
  promptNode.textContent = getPrompt()
  currentFolder = getFolder(pwd)
}

function showHelp() {
  const lines = ["Help Manual:",
    "",
    style("help:", "helpkeyword") + "Zeigt diese Hilfe an",
    style("clear:", "helpkeyword") + "Löscht den Inhalt des Terminals",
    style("cd [directory]:", "helpkeyword") + "Wechselt in das Verzeichnis f",
    style("directory=..:", "helpkeyword tab") +  "Wechselt in das Elternverzeichnis",
    style("directory=.:", "helpkeyword tab") + "Wechselt in das aktuelle Verzeichnis",
    style("open [file]:", "helpkeyword") + "Öffnet die angegebene Datei",
    style("cat [file]:", "helpkeyword") + "Zeigt den Inhalt der Datei im Terminal an",
    style("matrix:", "helpkeyword") + "Zeigt Dir die Matrix an"
  ]
  lines.forEach(appendLine)
}
