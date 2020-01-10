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
      break;
    case "ls":
      showFiles()
      break;
    case "cd":
      changeDirectory(arg)
      break;
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
      appendLine(file)
    } else {
      appendColoredLine(file, "blue");
    }
  }
}

function appendLine(text) {
  console.log("append line", text)
  contentNode.innerHTML += "<br>" + text
}

function appendColoredLine(text, color) {
  console.log("append colored line", text)
  contentNode.innerHTML += "<br><span class=\"" + color + "\">" + text + "</span>"
}

function changeDirectory(folder = "~") {
  switch (folder) {
    case "..": 
      changeToFolder(folder)
      break;
    case ".":
      break
    case "~": 
      pwd = "~"
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
    pwd = pwd.substring(0, pwd.lastIndexOf("/"))
  } 
  else {
    pwd += "/" +folder
  }
  promptNode.textContent = getPrompt()
  currentFolder = getFolder(pwd)
}
