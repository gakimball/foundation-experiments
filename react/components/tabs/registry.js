class TabsRegistry {
  constructor() {
    this.listeners = {};
  }

  register(name) {
    return (message, content) => {
      if (name in this.listeners) {
        this.listeners[name](message, content);
      }
    }
  }

  listen(name, cb) {
    this.listeners[name] = cb;

    return () => {
      delete this.listeners[name];
    }
  }
}

const registry = new TabsRegistry();
export default registry;
