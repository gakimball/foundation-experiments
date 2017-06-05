import Plugin from './util/plugin';
import uuid from './util/uuid';

class Foundation {
  /**
   * Registered plugins. To be initialized, an HTML element's `data-foundation` attribute must be one of the properties of this object.
   * @type Object.<String, Function>
   */
  plugins = {}

  /**
   * Plugin instances, keyed by unique IDs.
   * @type Object.<String, Function>
   */
  instances = {}

  /**
   * Initialize Foundation by scanning for all plugins passed to this function, and initializing them. Plugins can be passed in two ways:
   *
   * Individual plugins can be passed as arguments.
   *
   * ```js
   * import Foundation from 'foundation';
   * import { Reveal, Tabs, Accordion } from 'foundation/plugins';
   *
   * Foundation.init(Reveal, Tabs, Accordion);
   * ```
   *
   * Or, all plugins can be initialized at once:
   *
   * ```js
   * import Foundation from 'foundation';
   * import * as Plugins from 'foundation/plugins';
   *
   * Foundation.init(Plugins);
   * ```
   *
   * @param {...(Object.<String, Function>|Function)} args - Plugins to pass.
   */
  init(...args) {
    this.addPlugins(args);
    window.addEventListener('DOMContentLoaded', this.initPlugins);
  }

  /**
   * Register plugins that were passed through the `init()` function.
   * @private
   * @param {(Object.<String, Function>|Function)[]} args - Plugins to register.
   */
  addPlugins(args) {
    args.forEach(arg => {
      if (typeof arg === 'object') {
        for (const prop in arg) {
          this.addPlugin(arg[prop]);
        }
      } else {
        this.addPlugin(arg);
      }
    });
  }

  /**
   * Register a plugin.
   * @private
   * @param {Function} plugin - Plugin to register.
   */
  addPlugin(plugin) {
    this.plugins[plugin.identifier] = plugin;
  }

  /**
   * Scan the DOM for Foundation plugins and initialize them. Only registered plugins can be initialized.
   */
  initPlugins = () => {
    for (const plugin in this.plugins) {
      const Plugin = this.plugins[plugin];

      document.querySelectorAll(`[data-${plugin}]`).forEach(elem => {
        const id = uuid();
        this.instances[id] = new Plugin(elem, null, id);
      });
    }
  }

  /**
   * Get a Foundation plugin class off of a DOM element.
   * @param {(String|Element)} elem - Element selector or element instance.
   * @returns {?Object} Plugin instance, or `null` if none was found.
   */
  get(elem) {
    if (typeof elem === 'string') {
      const selector = elem;
      elem = document.querySelector(selector);

      if (!elem) {
        return null;
      }
    }

    if (elem instanceof Element) {
      const id = elem.getAttribute('data-foundation-id');
      return this.instances[id] || null;
    }
  }
}

export default new Foundation();
