export default function observable({ target, listeners }) {
  let observable;

  const set = (target, name, value) => {
    target[name] = value;
    for (const listener of listeners) {
      if (listener.selector === name) {
        listener.handler(observable);
      }
    }
    return true;
  };

  const get = (target, name) => {
    return Object.freeze(target[name]);
  };

  const handler = {
    set,
    get,
  };

  observable = new Proxy(target, handler);

  return observable;
}
