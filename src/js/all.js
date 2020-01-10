const contentNode = document.getElementsByClassName("content")[0]
const inputNode = document.getElementsByTagName("input")[0];
inputNode.addEventListener("keyup", function(event) {
    if (event.key === "Enter") {
      handleEnter()
    }
});

let pwd = "guest@robindanzinger:~$"

console.log("current: ", contentNode.textContent)

function handleEnter() {
  console.log(inputNode.value)
  const cmd = inputNode.value
  inputNode.value = ""

console.log("input was: ", cmd)
  appendLine(pwd + cmd)
  switch(cmd) {
    case "clear": 
      clearContent()
      break;
    case "ls":
      showFiles()
      break;
    default: 
      appendLine("unknown command: " + cmd)
  }
}

const files = ["about.txt", "projects"];

function clearContent() {
  console.log("clear content")
  contentNode.innerHTML = ""
}

function showFiles() {
  console.log("show files")
  for (file of files) {
    console.log(file)
    appendLine(file)
  }
}

function appendLine(text) {
  console.log("append line", text)
  contentNode.innerHTML += "<br>" + text
}
