import _ from 'lodash';

/**
 * Base plugin class.
 */
export default class Plugin {
  /**
   * Initialize a plugin, storing a reference to the container DOM element, and parsing options from the HTML.
   * @param {HTMLElement} elem - Container element.
   * @param {Object} options - Plugin instance options.
   * @param {String} id - Unique ID of plugin instance.
   */
  constructor(elem, options, id) {
    if (this.constructor === Plugin) {
      throw new Error('Do not call the Plugin class directly.');
    }

    this.elem = elem;
    this.options = options || this.getOptions();
    this.eventHandlers = [];
    this.elem.setAttribute('data-foundation-id', id);
  }

  /**
   * Register an event listener for a plugin element.
   * @param {HTMLElement} target - Event target.
   * @param {String} event - Event to listen to.
   * @param {Function} func - Callback to run when event fires.
   */
  event(target, event, func) {
    target.addEventListener(event, func);
    this.eventHandlers.push({ target, event, func });
  }

  /**
   * Trigger a custom event, optionally with data. The event name is automatically namespaced.
   * @param {String} name - Name of event.
   * @param [data] - Data to pass to event.
   */
  trigger(name, data = null) {
    const eventName = `${name}.zf.${this.constructor.identifier}`;
    let event;

    if (window.CustomEvent) {
      event = new CustomEvent(eventName, { detail: data });
    } else {
      event = document.createEvent('CustomEvent');
      event.initCustomEvent(eventName, true, true, data);
    }

    this.elem.dispatchEvent(event);
  }

  /**
   * Finish destroying a plugin by removing all event listeners, and finally firing a `destroyed` event. A plugin should call this in its own `destroy` event *after* all cleanup has been done, using `super.destroy();`.
   */
  destroy() {
    this.eventHandlers.forEach(({ target, event, func }) => {
      target.removeEventListener(event, func);
    });
    this.trigger('destroyed');
  }

  /**
   * Signal that a plugin instance is done initiailizing. A plugin should call this when it's done setting up the DOM.
   */
  ready() {
    this.trigger('init');
  }

  /**
   * Get the options for a plugin instance from the attributes on the HTML. Plugin options must be defined on a plugin class's static `options` property.
   */
  getOptions() {
    // Plugins with no options don't need any of this
    if (!this.constructor.options) {
      return {};
    }

    const attributes = this.elem.attributes;
    const defaults = this.constructor.options;
    const options = _.mapValues(defaults, value => value[1]);

    for (const i in attributes) {
      const attr = attributes[i];

      // Only examine data attributes
      if (attr.name && attr.name.indexOf('data-') === 0) {
        const optionName = _.camelCase(attr.name.replace(/^data-/, ''));

        if (optionName in options) {
          const type = defaults[optionName][0];
          const attrValue = attr.value === '' ? true : attr.value;
          let value;

          // You can't cast to false with Boolean('false')
          if (type === Boolean) {
            if (attrValue === 'true') {
              value = true;
            } else {
              value = false;
            }
          } else if (Array.isArray(type)) {
            if (type.indexOf(attrValue) > -1) {
              value = attrValue;
            } else {
              value = defaults[optionName][1];
            }
          } else {
            value = type(attrValue);
          }

          options[optionName] = value;
        }
      }
    }

    return options;
  }
}
