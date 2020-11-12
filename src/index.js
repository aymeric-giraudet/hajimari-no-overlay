import registerButtonHandlers from "./gamepad.js";
import { advanceText, backwardText, freezeText } from "./dialogManager.js";
import registerKeyHandlers from "./keyboard.js";

registerButtonHandlers({
  cross: advanceText,
  l2: backwardText,
  r2: advanceText,
  l3: freezeText,
});

registerKeyHandlers({
  ArrowRight: advanceText,
  ArrowLeft: backwardText,
  a: backwardText,
  d: advanceText,
  Tab: () => {
    const controls = document.getElementById("controls");
    if (controls.style.display === "none") {
      controls.style.display = "block";
    } else {
      controls.style.display = "none";
    }
  },
});