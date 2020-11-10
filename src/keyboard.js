let keyHandlers = {};
let previousState = {};

function keydownHandler(evt) {
  const pressedKey = evt.key;
  const keyHandler = keyHandlers[pressedKey];
  if (keyHandler) {
    if (previousState[pressedKey] === false) {
      keyHandler();
    }
    previousState[pressedKey] = true;
  }
}

function keyupHandler(evt) {
  const pressedKey = evt.key;
  const keyHandler = keyHandlers[pressedKey];
  if (keyHandler) {
    previousState[pressedKey] = false;
  }
}

export default function registerKeyHandlers(handlers) {
  keyHandlers = handlers;
  previousState = Object.fromEntries(
    Object.keys(keyHandlers).map((keyName) => [keyName, false])
  );
  window.addEventListener("keydown", keydownHandler);
  window.addEventListener("keyup", keyupHandler);
}
