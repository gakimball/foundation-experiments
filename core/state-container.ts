interface StateListener {
  (prop: string, oldValue: any, newValue: any): void
}

/**
 * Class to create state containers that a plugin can subscribe to.
 */
export default abstract class StateContainer<Opts, State> {
  /**
   * Function to run when state changes.
   */
  listener: StateListener

  /**
   * Options passed to child class constructor.
   */
  options: Opts

  /**
   * Initial state set by child class constructor.
   */
  state: State

  /**
   * Update state and notify plugin listener.
   * @param prop State property to change.
   * @param newValue New value to set.
   */
  update(prop: string, newValue: any): void {
    const oldValue: any = this.state[prop];
    this.state[prop] = newValue;

    if (this.listener) {
      this.listener(prop, oldValue, newValue);
    }
  }

  /**
   * Add a listener function to fire whenever state changes.
   * @param cb Callback to register.
   */
  listen(cb: StateListener): void {
    if (typeof cb !== 'function') {
      throw new TypeError(`Listener must be a function, but got ${typeof cb} instead.`);
    }

    this.listener = cb;
  }

  /**
   * Run the listener function once for every existing state property. A UI plugin should call
   * this once while being initialized, to do initial DOM updates based on state.
   */
  fetch(): void {
    if (this.listener) {
      for (const prop in this.state) {
        this.listener(prop, undefined, this.state[prop]);
      }
    } else {
      throw new Error('A listener must be registered before fetch() can be called');
    }
  }
}
