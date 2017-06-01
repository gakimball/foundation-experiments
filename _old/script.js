const { h } = maquette;

class Component {
  constructor(props) {
    // Merge provided props with the defaults
    this.props = _.assign({}, this.constructor.defaults || {}, props);
    // Bind component props to the render function
    this.render = this.render.bind(this, this.props);
  }
}

const Button = (() => {
  class Button extends Component {
    render(props) {
      return h('', {
        class: 'button',
        classes: {
          success: props.success
        }
      });
    }
  }

  Button.props = ['text', 'success'];

  Button.defaults = {
    text: 'This is the default'
  };

  return Button;
})();

const Tabs = (() => {
  class Tabs extends Component {
    render(props) {
      return h('', {
        class: 'tabs'
      });
    }
  }

  return Tabs;
})();

const Tab = (() => {
  class Tab extends Component {
    render(props) {
      return h('', {
        class: 'tabs-title',
        'aria-selected': 'false'
      }, [
        h('a', {
          href: `#${props.href}`
        }, props.children)
      ]);
    }
  }

  Tab.props = ['href'];

  return Tab;
})();

const getPlainAttributes = elem => {
  const list = [];
  const attrs = elem.attributes;

  for (let i = 0; i < attrs.length; i++) {
    const attr = attrs[i];

    if (attr.indexOf('data-') === -1) {
      list.push();
    }
  }
}

/**
 * Render a an element based on the component defined in its `data-foundation` attribute.
 * @param {HTMLElement} elem - Element to render.
 * @param {Maquette.Projector} projector - Maquette projector instance.
 */
const render = (elem, projector) => {
  const name = elem.getAttribute('data-foundation');

  if (name && name in components) {
    const Component = components[name];
    const props = (Component.props || []).map(prop => {
      const value = elem.getAttribute(`data-${prop}`);
      if (value !== null) {
        return [prop, value === '' ? true : value];
      }
    }).filter(v => typeof v !== 'undefined').concat([['children', tovdom(elem.childNodes, h)]]);
    const component = new Component(_.fromPairs(props));
    projector.merge(elem, component.render);
  }
}

/**
 * Renderable Foundation components.
 */
const components = {
  button: Button,
  tabs: Tabs,
  tab: Tab,
};

window.addEventListener('DOMContentLoaded', () => {
  const { createProjector } = maquette;
  const projector = createProjector();

  document.querySelectorAll('[data-foundation]').forEach(elem => render(elem, projector));
});
