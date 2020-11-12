import chapters from "./lines.js";

let textFrozen = false;
let currentChapter = "Prologue";
let timeout;

const savedChapter = localStorage.getItem("currentChapter");
if (savedChapter) {
  currentChapter = savedChapter;
}
let lines = chapters[currentChapter];

const savedLine = localStorage.getItem("currentLine");
if (savedLine) {
  lines.current = parseInt(savedLine);
  render(lines[lines.current]);
}

document.getElementById("chapter").addEventListener("change", (evt) => {
  currentChapter = evt.target.value;
  lines = chapters[currentChapter];
  render(lines.next());
});

document.getElementById("line-number").addEventListener("change", (evt) => {
  lines.current = parseInt(evt.target.value) - 1;
  render(lines.next());
});

function render(line) {
  const chapter = document.getElementById("chapter");
  chapter.value = currentChapter;
  const lineNumber = document.getElementById("line-number");
  lineNumber.value = lines.current;
  const name = document.getElementById("name");
  name.innerText = line.name || "";
  const english = document.getElementById("text-en");
  english.innerText = "";
  var i = 0;
  var txt = line.en;
  function typeWriter() {
    if (i < txt.length) {
      document.getElementById("text-en").innerHTML += txt.charAt(i);
      i++;
      timeout = setTimeout(typeWriter, 20);
    }
  }
  timeout && clearTimeout(timeout);
  typeWriter();
  const japanese = document.getElementById("text-jp");
  japanese.innerText = line.jp || "";
  localStorage.setItem("currentLine", lines.current);
  localStorage.setItem("currentChapter", currentChapter);
}

export function advanceText() {
  if (!textFrozen) {
    render(lines.next());
  }
}

export function backwardText() {
  if (!textFrozen) {
    render(lines.prev());
  }
}

export function freezeText() {
  textFrozen = !textFrozen;
  const textBox = document.getElementById("dialog");
  if (textFrozen) {
    textBox.style.display = "none";
  } else {
    textBox.style.display = "block";
  }
}
