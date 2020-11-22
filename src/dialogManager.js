import { chapters, updateTranslations } from "./lines.js";

let textFrozen = false;
let currentChapter = "Prologue";
let currentEpisode = "0";
let timeout;
let speed;
let finished = true;

const savedChapter = localStorage.getItem("currentChapter");
if (savedChapter) {
  currentChapter = savedChapter;
}
const savedEpisode = localStorage.getItem("currentEpisode");
if (savedEpisode) {
  currentEpisode = savedEpisode;
}

let lines;
if (currentChapter === "Episodes") {
  lines = chapters.Episodes[parseInt(currentEpisode)];
  document.getElementById("episode").style.display = "inline";
} else {
  lines = chapters[currentChapter];
}

const savedLine = localStorage.getItem("currentLine");
if (savedLine) {
  lines.current = parseInt(savedLine);
  render(lines[lines.current]);
}

document.getElementById("chapter").addEventListener("change", (evt) => {
  currentChapter = evt.target.value;
  if (currentChapter === "Episodes") {
    document.getElementById("episode").style.display = "inline";
    lines = chapters.Episodes[parseInt(currentEpisode)];
  } else {
    document.getElementById("episode").style.display = "none";
    lines = chapters[currentChapter];
  }
  render(lines.next());
});

document.getElementById("episode").addEventListener("change", (evt) => {
  currentEpisode = evt.target.value;
  lines = chapters.Episodes[parseInt(currentEpisode)];
  render(lines.next());
});

document.getElementById("line-number").addEventListener("change", (evt) => {
  lines.current = parseInt(evt.target.value) - 1;
  render(lines.next());
});

document.getElementById("update").addEventListener("click", async (evt) => {
  document.getElementById("updating").style.display = "block";
  document.getElementById("update").disabled = true;
  await updateTranslations();
  document.getElementById("updating").style.display = "none";
  document.getElementById("update").disabled = false;
  if (currentChapter === "Episodes") {
    lines = chapters.Episodes[parseInt(currentEpisode)];
    document.getElementById("episode").style.display = "inline";
  } else {
    lines = chapters[currentChapter];
  }
  const savedLine = localStorage.getItem("currentLine");
  lines.current = parseInt(savedLine);
  render(lines[lines.current]);
});

function render(line) {
  const chapter = document.getElementById("chapter");
  chapter.value = currentChapter;
  const episode = document.getElementById("episode");
  episode.value = currentEpisode;
  const lineNumber = document.getElementById("line-number");
  lineNumber.value = lines.current;
  const updatedAt = document.getElementById("updated-at");
  updatedAt.innerText = `Last update : ${new Date(
    chapters.date
  ).toLocaleString()}`;

  const name = document.getElementById("name");
  name.innerText = line.name || "";

  typeWriter(line.en);

  const japanese = document.getElementById("text-jp");
  japanese.innerText = line.jp || "";

  localStorage.setItem("currentLine", lines.current);
  localStorage.setItem("currentChapter", currentChapter);
  localStorage.setItem("currentEpisode", currentEpisode);
}

function typeWriter(txt = "") {
  const english = document.getElementById("text-en");
  english.innerText = "";
  speed = 20;
  finished = false;
  function* iterateText() {
    yield* txt;
  }
  const characters = iterateText();
  function typeCharacter() {
    const character = characters.next();
    if (!character.done) {
      english.innerHTML += character.value;
      timeout = setTimeout(typeCharacter, speed);
    } else {
      finished = true;
    }
  }
  timeout && clearTimeout(timeout);
  typeCharacter();
}

export function advanceText() {
  if (!finished) {
    speed = 1;
    return;
  }
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
