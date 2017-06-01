/**
 * Class to create state containers that a plugin can subscribe to.
 * @abstract
 */
export default class StateContainer {
  /**
   * Initialize a state container.
   */
  constructor(elem, options) {
    if (this.constructor === StateContainer) {
      throw new Error('Do not call the StateContainer class directly.');
    }

    /**
     * Function to run when state changes.
     * @type ?ListenerCallback
     */
    this.listener = null;

    this.options = options;
  }

  /**
   * Update state and notify plugin listener.
   * @param {String} prop - State prop to update.
   * @param newValue - New value to set.
   */
  update(prop, newValue) {
    const oldValue = this.state[prop];
    this.state[prop] = newValue;

    if (this.listener) {
      /**
       * Listener function that fires whenever state changes.
       * @callback ListenerFunction
       * @param {String} prop - State property that changed.
       * @param oldValue - Old value of property.
       * @param newValue - New value of property.
       */
      this.listener(prop, oldValue, newValue);
    }
  }

  /**
   * Add a listener function to fire whenever state changes.
   * @param {ListenerCallback} cb - Callback to register.
   */
  listen(cb) {
    if (typeof cb !== 'function') {
      throw new TypeError(`Listener must be a function, but got ${typeof cb} instead.`);
    }

    this.listener = cb;
  }

  /**
   * Run the listener function once for every existing state property. A UI plugin should call
   * this once while being initialized, to do initial DOM updates based on state.
   */
  fetch() {
    if (this.listener) {
      for (const prop in this.state) {
        this.listener(prop, undefined, this.state[prop]);
      }
    } else {
      throw new Error('A listener must be registered before fetch() can be called');
    }
  }
}
