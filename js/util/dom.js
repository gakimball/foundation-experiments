/**
 * Polyfill for `Element.prototype.closest`. Finds the nearest parent to `elem` that matches `selector`.
 * @private
 * @param {Element} elem - Element to start searching from.
 * @param {String} selector - Selector to match against.
 * @returns {?Element} Found parent, or `null`.
 */
export function closest(elem, selector) {
  if (Element.prototype.closest) {
    return elem.closest(selector);
  }

  let target = elem;

  while (target && target.nodeType === 1) {
    if (target.matches(selector)) {
      return target;
    }

    element = element.parentNode;
  }

  return null;
}

/**
 * Find all siblings of an element, optionally filtered by a selector.
 * @param {Element} elem - Elem to find siblings of.
 * @param {?String} [selector=null] - Selector to filter by.
 */
export function siblings(elem, selector = null) {
  return Array.prototype.filter.call(elem.parentNode.children, child => {
    if (selector) {
      return child !== el && child.matches(selector);
    }

    return child !== el;
  });
}
