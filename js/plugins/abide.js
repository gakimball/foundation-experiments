import AbideState from 'foundation-core/abide';
import Plugin from '../util/plugin';
import { closest, siblings } from '../util/dom';

const FORM_ERROR_SELECTOR = '.form-error';

/**
 * Abide form validation plugin.
 */
export default class Abide extends Plugin {
  /**
   * Abide plugin options.
   */
  static options = {
    /**
     * When to check if inputs are valid. `change` will check after any typing, `blur` will check when an input loses focus, and `submit` will check when the form is submitted.
     * @type {String}
     * @default 'submit'
     */
    validateOn: [['change', 'blur', 'submit'], 'submit'],
  }

  static identifier = 'abide'

  /**
   * Check if an HTML element is a checkbox or radio button.
   * @param {Element} elem - Element to check.
   * @returns {Boolean}
   * @private
   */
  static isCheckboxOrRadio = elem => ['checkbox', 'radio'].indexOf(elem.getAttribute('type')) > -1

  /**
   * Check if an input should be invisible to Abide.
   * @param {Element} elem - Element to check.
   * @returns {Boolean}
   */
  static inputIsIgnored = elem => (
    elem.hasAttribute('data-abide-ignore')
    || elem.getAttribute('type') === 'hidden'
    || elem.hasAttribute('disabled')
  )

  /**
   * Create a new Abide instance on an HTML `<form>` element.
   * @param {Element} elem - Form container.
   * @param {?Object} options - Plugin options.
   */
  constructor(elem, options, id) {
    super(elem, options, id);

    /**
     * Internal state for Abide.
     * @private
     * @type {AbideState}
     */
    this.state = new AbideState(this.elem, this.options);
  }

  setup() {
    const { isCheckboxOrRadio } = this.constructor;

    // Add core form event listeners
    this.event(this.elem, 'reset', this.reset);
    this.event(this.elem, 'submit', this.validate);

    // Add validation listeners based on the validation method
    if (this.options.validateOn === 'blur') {
      this.event(this.elem, 'focusout', e => this.validateInput(e.target));
    } else if (this.options.validateOn === 'change') {
      // The input event doesn't fire for checkbox or radio elements
      this.event(this.elem, 'input', ({ target }) => {
        if (!isCheckboxOrRadio(target)) {
          this.validateInput(target);
        }
      });

      this.event(this.elem, 'change', ({ target }) => {
        if (isCheckboxOrRadio(input)) {
          this.validateInput(target);
        }
      });
    }
  }

  reset() {

  }

  validateForm() {
    this.elem.querySelectorAll('input, textarea, select').forEach(elem => validateInput(elem));
  }

  validateInput(elem) {
    const { inputIsIgnored } = this.constructor;

    if (inputIsIgnored(elem)) {
      return;
    }

    const required = this.validateRequired(elem);
    let valid = false;
    let equalToValid = true;

    switch (elem.type) {
      case 'radio':
        valid = this.validateRadio(elem);
        break;

      case 'checkbox':
        valid = required;
        break;

      case 'select':
      case 'select-one':
      case 'select-multiple':
        valid = required;

      default:
        valid = this.validateText(elem);
    }

    if (elem.hasAttribute('data-equalto')) {
      equalToValid = this.validateEqualTo(elem);
    }

    const allValid = [required, valid, equalToValid].indexOf(false) === -1;

    if (allValid) {
      const dependents = this.elem.querySelectorAll(`[data-equalto="${elem.id}"]`);
      dependents.forEach(elem => {
        if (elem.value) {
          this.validateInput(elem);
        }
      });
    }
  }

  validateRadio(elem) {
    const groupName = elem.getAttribute('name');
    const group = this.elem.querySelectorAll(`input[type="radio"][name="${groupName}"]`);
    const required = group.map(elem => elem.hasAttribute('required')).indexOf(true) > -1;

    if (!required) {
      return true;
    }

    return group.map(elem => elem.checked).indexOf(true) > -1;
  }

  validateText(elem, patternName = elem.getAttribute('type')) {
    const inputText = elem.value;
    const { patterns } = AbideState;

    if (elem.hasAttribute('pattern')) {
      patternName = elem.getAttribute('pattern');
    }

    if (inputText.length) {
      // If the pattern attribute on the element is in Abide's list of patterns, then test that regexp
      if (patternName in patterns) {
        const pattern = patterns[patternName];

        // A pattern can be a function...
        if (typeof pattern === 'function') {
          return pattern.test(elem, this.elem);
        }

        // ...or it's expected to be a regular expression
        return pattern.test(inputText);
      }

      // If the pattern name isn't also the type attribute of the field, then test it as a regexp
      if (pattern !== elem.getAttribute('type')) {
        return new RegExp(pattern).test(inputText);
      }

      return true;
    }

    // An empty field is valid if it's not required
    if (!elem.hasAttribute('required')) {
      return true;
    }

    return false;
  }

  validateRequired(elem) {
    if (elem.hasAttribute('required')) {
      switch (elem.type) {
        case 'checkbox':
          return elem.checked;

        case 'select':
        case 'select-one':
        case 'select-multiple':
          return elem.selectedIndex > -1;

        default:
          return elem.value && elem.value.length > 0;
      }
    }

    return true;
  }

  validateEqualTo(elem) {
    const dependent = this.elem.querySelector(`#${elem.getAttribute('data-equalto')}`);

    if (!dependent) {
      return false;
    }

    return dependent.value === elem.value;
  }

  /**
   * Find the label that goes with an element.
   * @param {Element} elem - Input element.
   * @returns {?Element} Found label, or `null`.
   */
  findInputLabel(elem) {
    // Look for a label that is explicitly connected to this element,
    // then look for a parent label
    return
      this.elem.querySelector(`label[for="${elem.id}"]`)
      || closest(elem, 'label');
  }

  /**
   * Find any error message containers that are associated with an input.
   * @param {Element} elem - Input element.
   * @returns {Element[]} Found error containers.
   */
  findInputErrors(elem) {
    // First look for error containers next to the input
    const errors = siblings(elem, FORM_ERROR_SELECTOR);

    // If we can't find any, then look inside all descendents of the parent of the input
    if (!errors.length) {
      errors.push.apply(errors, elem.parent.querySelectorAll(FORM_ERROR_SELECTOR));
    }

    // Finally, either way, add error labels that are specially bound to this input
    errors.push.apply(errors, this.elem.querySelectorAll(`[data-form-error-for="${elem.id}"]`));

    return errors;
  }

  findRadioLabels(elems) {
    return elems.map(elem => this.findInputLabel(elem));
  }
}
