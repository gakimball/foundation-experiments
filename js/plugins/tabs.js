import Plugin from '../util/plugin';
import TabState from '../../core/tabs';
import applyAttrs from '../util/apply-attrs';
import applyStyles from '../util/apply-styles';

export default class TabPlugin extends Plugin {
  static options = {
    activeCollapse: [Boolean, false],
    autoFocus: [Boolean, false],
    matchHeight: [Boolean, false],
    wrapOnKeys: [Boolean, true],
  }

  static identifier = 'tabs'

  constructor(elem, options, id) {
    super(elem, options, id);
    this.state = new TabState(this.elem, this.options);
    this.state.listen(this.update);
    this.initialFocusChecked = false;
    this.setup();
  }

  setup() {
    // DOM element cache
    this.tabs = this.elem.querySelectorAll('.tabs-title');
    this.paneContainer = document.querySelector(`[data-tabs-content="${this.elem.id}"]`);

    // Setup height matching for panes
    if (this.options.matchHeight) {
      this.state.getTallestTab();
    }

    // Event listeners
    this.event(this.elem, 'click', this.handleTabClick);
    this.event(this.elem, 'keydown', this.handleKeyDown);

    // Initial DOM changes
    this.tabs.forEach((tab, index) => {
      const anchor = tab.querySelector('a');
      const target = this.state.getTabTarget(index);
      const pane = document.getElementById(target);

      requestAnimationFrame(() => {
        applyAttrs(tab, this.state.getTitleAttrs(index));
        applyAttrs(anchor, this.state.getTitleAnchorAttrs(index));
        applyAttrs(pane, this.state.getPanelAttrs(target));
      });
    });

    this.state.fetch();
    this.ready();
  }

  handleTabClick = ({ target }) => {
    if (target.getAttribute('role') === 'tab') {
      const index = Array.prototype.indexOf.call(this.tabs, target.parentNode);
      this.state.toggleTab(index);
    }
  }

  handleKeyDown = ({ key }) => {
    this.state.handleKey(key);
  }

  update = (prop, oldValue, newValue) => {
    switch (prop) {
      case 'activeTab': {
        this.updateTab(newValue);
        this.updateTab(oldValue, true);
        this.updateTabPane(newValue);
        this.updateTabPane(oldValue, true);
      }
    }
  }

  getTabPane(index) {
    const tab = this.tabs[index];
    const target = tab.querySelector('a').getAttribute('href');
    return document.querySelector(target);
  }

  updateTab(index, hide = false) {
    if (typeof index === 'number') {
      const tab = this.tabs[index];
      const anchor = tab.querySelector('a');

      requestAnimationFrame(() => {
        const method = hide ? 'remove' : 'add';
        anchor.classList[method]('is-active');
        applyAttrs(anchor, this.state.getTitleAnchorAttrs(index));

        if (!hide) {
          if (this.initialFocusChecked || this.options.autoFocus) {
            anchor.focus();
          } else {
            this.initialFocusChecked = true;
          }
        }
      });
    }
  }

  updateTabPane(index, hide = false) {
    if (typeof index === 'number') {
      const pane = document.getElementById(this.state.getTabTarget(index));

      if (pane) {
        requestAnimationFrame(() => {
          const method = hide ? 'remove' : 'add';
          pane.classList[method]('is-active');
          applyAttrs(pane, this.state.getPanelAttrs(pane.id));
          console.log(this.state.getPanelStyle());
          applyStyles(pane, this.state.getPanelStyle(pane.id));
        });
      }
    }
  }
}
