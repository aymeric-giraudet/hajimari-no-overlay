import registerButtonHandlers from "./gamepad.js";
import { advanceText, backwardText, freezeText } from "./dialogManager.js";
import registerKeyHandlers from "./keyboard.js";

document.getElementById("controls").style.display = "none";
document.getElementById("updating").style.display = "none";

if (window.api.getPlatform() === "darwin") {
  document.getElementById("name").classList.add("textStroke");
  document.getElementById("text-en").classList.add("textStroke");
}

registerButtonHandlers({
  cross: advanceText,
  l2: backwardText,
  r2: advanceText,
  l3: freezeText,
});

registerKeyHandlers({
  ArrowRight: advanceText,
  ArrowLeft: backwardText,
  Tab: () => {
    const controls = document.getElementById("controls");
    if (controls.style.display === "none") {
      controls.style.display = "flex";
    } else {
      controls.style.display = "none";
    }
  },
});
