import _ from 'lodash';

export default class Plugin {
  constructor(elem, options) {
    if (this.constructor === Plugin) {
      throw new Error('Do not call the Plugin class directly.');
    }

    this.elem = elem;
    this.options = this.getOptions();
  }

  getOptions() {
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
