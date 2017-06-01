# foundation-experiments

> Ideas for Foundation 7

## Install

```bash
git clone https://github.com/gakimball/foundation-experiments
cd foundation-experiments
npm install
npm start
```

## Explanations

This is a tab plugin written in both plain JavaScript and React. Both plugins are backed by one API that manages state and handles keyboard input.

### Core Library

#### StateContainer

This is a base abstract class to create a state container class. A state container class is attached to a plugin, and handles the internal state of the plugin. It's up to the plugin to decide how to update when state changes. For a vanilla JS plugin, the DOM will be updated manually. For a React plugin, `setState()` will be used to trigger a component re-render.

#### TabState

This is an example state container for use by a tab plugin. Any state container will hold at least three things:

- Internal state
- Plugin options (provided by user)
- Reference to root DOM element

Our tab plugin is fairly simple, so right now it only keeps track of one thing: the index of the active tab. It also has a helper function to find the tallest tab pane in a series.

A plugin instance will create a new `TabState` to maintain internal state. The plugin can then subscribe to any changes to state and respond accordingly.

```js
class TabPlugin {
  constructor(elem, options) {
    this.state = new TabState(elem, options);
    this.state.listen((prop, oldValue, newValue) => {
      // prop is the state property that changed
      // oldValue and newValue are what you'd expect
    });
  }
}
```

Our vanilla JS plugin needs to react whenever the active tab changes, by focusing the new tab, unfocusing the old tab, selecting the new tab pane, and deselecting the old tab pane.

```js
class TabPlugin {
  // ...

  update(prop, oldValue, newValue) {
    switch (prop) {
      case 'activeTab': {
        this.unHighlightTab(oldValue);
        this.highlightTab(newValue);
        this.hideTabPane(oldValue);
        this.showTabPane(newValue);
      }
    }
  }
}
```

Our React plugin also needs to... *react*, which we can do through `setState()`. In fact, we can pass the exact property/value pair through to the component state, so they're always identical.

```js
class Tabs extends Component {
  componentDidMount() {
    this.tabState.listen((prop, oldValue, newValue) => {
      this.setState({
        [prop]: newValue,
      });
    });
  }
}
```

### Vanilla Plugins

This example tab plugin takes most of the core functionality of the existing Foundation 6 tabs plugin, and reimplements it using the `TabState` manager, all without jQuery.

Some things to note:

- All event handlers are on the base tab container, so we don't have to bind/unbind events for every individual tab.
- All DOM mutations are split into discrete functions. This could make testing easier.

This tab plugin class also extends from a base `Plugin` class, similar to Foundation 6. I didn't port over all the functionality, but there's a few new experimental things in there.

The tab plugin class has a static `options` member, which works kind of like React's `PropTypes`. You can set the type of each option and the default value.

```js
class TabPlugin extends Plugin {
  static options = {
    activeCollapse: [Boolean, false],
    autoFocus: [Boolean, false],
    matchHeight: [Boolean, false],
    wrapOnKeys: [Boolean, true],
  }
}
```

Because all HTML attributes are strings, we can cast them to the value we need by defining the types as plugin-level metadata. For example, `"false"` can be changed to a real `false`, and a number can be changed to a real number. The base `Plugin` class reads all data attributes from the plugin that match the options in this list, all while typecasting the values.

### React Plugins

The React plugins duplicate the functionality of the vanilla JS plugins, using the same state management tools in the background. The `options` list shown in the previous section is also reused as the `PropTypes` of the component.

The tab plugin is an interesting edge case, because you have two separate components (the tabstrip and the tab panes) that need to communicate. Because they don't share a common parent component, you can't use any built-in React tricks.

Instead, I created a very small pub/sub tool called `TabRegistry`. The tabstrip and tab panes share a common ID, so we have each component subscribe to that ID. Then, the tabstrip can send messages to the tab panes, such as when the active tab changes.

If more components end up needing a pub/sub mechanism, we can find (or write) a small pub/sub library to help us.

## License

MIT &copy; [Geoff Kimball](http://geoffkimball.com)
