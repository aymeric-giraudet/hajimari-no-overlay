let controller = {};
let buttonHandlers = [];
let previousState = {
  cross: false,
  l2: false,
  r2: false,
  l3: false,
};

function connecthandler(e) {
  controller = e.gamepad;
  requestAnimationFrame(updateStatus);
}

function updateStatus() {
  var gamepads = navigator.getGamepads();
  controller = gamepads[0];
  const state = {
    cross: controller.buttons[0].pressed,
    l2: controller.buttons[6].pressed,
    r2: controller.buttons[7].pressed,
    l3: controller.buttons[10].pressed,
  };
  for (const button in buttonHandlers) {
    if (state[button] === true && previousState[button] === false) {
      buttonHandlers[button]();
    }
  }
  previousState = state;
  requestAnimationFrame(updateStatus);
}

export default function registerButtonHandlers(handlers) {
  buttonHandlers = handlers;
  window.addEventListener("gamepadconnected", connecthandler);
  // window.addEventListener("gamepaddisconnected", disconnecthandler);
}
