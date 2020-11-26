import { chapters, updateTranslations } from "./lines.js";

let textFrozen = false;
let currentChapter = "Prologue";
let currentEpisode = "0";
let timeout;
let currentLineSpeed;
let lines;
let textSpeed = 20;
let isLineFinished = true;

const dialogContainer = document.getElementById("dialog");

function initializeTextSpeed() {
  const textSpeedSelect = document.getElementById("text-speed");
  const textSpeedOptions = textSpeedSelect.options;

  const savedTextSpeed = localStorage.getItem("textSpeed");
  if (savedTextSpeed) {
    textSpeed = parseInt(savedTextSpeed);
  }

  Array.apply(null, textSpeedOptions).some(function(option, index) {
    if (option.value == textSpeed) {
      textSpeedSelect.selectedIndex = index;
      return true;
    }

    return false;
  });

  textSpeedSelect.addEventListener("change", function(evt) {
    textSpeed = parseInt(textSpeedSelect.value);
    localStorage.setItem("textSpeed", textSpeed);
  });
}

function initializeTextPosition() {
  const savedChapter = localStorage.getItem("currentChapter");
  if (savedChapter) {
    currentChapter = savedChapter;
  }

  const savedEpisode = localStorage.getItem("currentEpisode");
  if (savedEpisode) {
    currentEpisode = savedEpisode;
  }

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
}

function initalizeUpdateTranslations() {
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
}

function initializeHideJapaneseText() {
  const hideJapaneseCheckbox = document.getElementById("checkbox-hide-text-jp");
  const textJPElement = document.getElementById("text-jp");
  const savedHideJapaneseTextStatus = localStorage.getItem("hideJapaneseText");

  if (savedHideJapaneseTextStatus === "true") {
    hideJapaneseCheckbox.checked = true;
    textJPElement.classList.add("hide");
    dialogContainer.classList.add("hide-text-jp");
  }

  hideJapaneseCheckbox.addEventListener("click", function(evt) {
    textJPElement.classList.toggle("hide");
    dialogContainer.classList.toggle("hide-text-jp");

    if (textJPElement.classList.contains("hide")) {
      localStorage.setItem("hideJapaneseText", "true");
    } else {
      localStorage.removeItem("hideJapaneseText");
    }
  });
}

function render(line) {
  const chapter = document.getElementById("chapter");
  chapter.value = currentChapter;
  const episode = document.getElementById("episode");
  episode.value = currentEpisode;
  const lineNumber = document.getElementById("line-number");
  lineNumber.value = lines.current;
  const updateBtn = document.getElementById("update");
  updateBtn.title = `Last update : ${new Date(
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
  currentLineSpeed = textSpeed;
  isLineFinished = false;

  function* iterateText() {
    yield* txt;
  }

  function sanitize(string) {
    const map = {
      "&": "&amp;",
      "<": "&lt;",
      ">": "&gt;",
      '"': "&quot;",
      "'": "&#x27;",
      "/": "&#x2F;",
    };
    const reg = /[&<>"'/]/ig;
    return String(string).replace(reg, (match) => (map[match]));
  }

  function typeCharacter() {
    if (currentLineSpeed == 0) {
      english.innerHTML = sanitize(txt);
      isLineFinished = true;
      return;
    }
    const character = characters.next();
    if (!character.done) {
      english.innerHTML += sanitize(character.value);
      timeout = setTimeout(typeCharacter, currentLineSpeed);
    } else {
      isLineFinished = true;
    }
  }

  const characters = iterateText();
  timeout && clearTimeout(timeout);
  typeCharacter();
}

export function advanceText() {
  if (!isLineFinished) {
    currentLineSpeed = 0;
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
  if (textFrozen) {
    dialogContainer.style.display = "none";
  } else {
    dialogContainer.style.display = "block";
  }
}

initializeTextSpeed();
initializeTextPosition();
initalizeUpdateTranslations();
initializeHideJapaneseText();
