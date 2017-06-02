import Plugin from '../util/plugin';
import TabState from '../../core/tabs';

export default class TabPlugin extends Plugin {
  static options = {
    activeCollapse: [Boolean, false],
    autoFocus: [Boolean, false],
    matchHeight: [Boolean, false],
    wrapOnKeys: [Boolean, true],
  }

  constructor(elem, options) {
    super(elem, options);
    this.state = new TabState(this.elem, this.options);
    this.state.listen(this.update);
    this.initialFocusChecked = false;
    this.setup();
  }

  setup() {
    // DOM element cache
    this.tabs = this.elem.querySelectorAll('.tabs-title');
    this.paneContainer = document.querySelector(`[data-tabs-content="${this.elem.id}"]`);

    // Event listeners
    this.event(this.elem, 'click', this.handleTabClick);
    this.event(this.elem, 'keydown', this.handleKeyDown);

    const maxHeight = this.options.matchHeight ? this.state.getTallestTab() : null;

    // Initial DOM changes
    this.tabs.forEach(tab => {
      const anchor = tab.querySelector('a');
      const tabTarget = anchor.getAttribute('href').replace(/^#/, '');
      const pane = this.paneContainer.querySelector(`#${tabTarget}`);
      const anchorLabel = `${tabTarget}-label`;

      requestAnimationFrame(() => {
        tab.setAttribute('role', 'presentation');

        anchor.id = anchorLabel;
        anchor.setAttribute('role', 'tab')
        anchor.setAttribute('aria-selected', 'false');
        anchor.setAttribute('aria-controls', tabTarget);

        pane.setAttribute('role', 'tabpanel');
        pane.setAttribute('aria-hidden', 'true');
        pane.setAttribute('aria-labelledby', anchorLabel);

        if (maxHeight) {
          pane.style.height = `${maxHeight}px`;
        }
      });
    });

    this.state.fetch();
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
        this.unHighlightTab(oldValue);
        this.highlightTab(newValue);
        this.hideTabPane(oldValue);
        this.showTabPane(newValue);
      }
    }
  }

  getTabPane(index) {
    const tab = this.tabs[index];
    const target = tab.querySelector('a').getAttribute('href');
    return document.querySelector(target);
  }

  highlightTab(index) {
    if (typeof index === 'number') {
      const tab = this.tabs[index];
      const anchor = tab.querySelector('a');

      requestAnimationFrame(() => {
        tab.classList.add('is-active');
        anchor.setAttribute('aria-selected', 'true');
        anchor.setAttribute('tabindex', '0');

        if (this.initialFocusChecked || this.options.autoFocus) {
          anchor.focus();
        } else {
          this.initialFocusChecked = true;
        }
      });
    }
  }

  unHighlightTab(index) {
    if (typeof index === 'number') {
      const tab = this.tabs[index];
      const anchor = tab.querySelector('a');

      requestAnimationFrame(() => {
        tab.classList.remove('is-active');
        anchor.setAttribute('aria-selected', 'false');
        anchor.setAttribute('tabindex', '-1');
      });
    }
  }

  showTabPane(index) {
    if (typeof index === 'number') {
      const pane = this.getTabPane(index);

      if (pane) {
        requestAnimationFrame(() => {
          pane.classList.add('is-active');
          pane.setAttribute('aria-hidden', 'false');
        });
      }
    }
  }

  hideTabPane(index) {
    if (typeof index === 'number') {
      const pane = this.getTabPane(index);

      if (pane) {
        requestAnimationFrame(() => {
          pane.classList.remove('is-active');
          pane.setAttribute('aria-hidden', 'true');
        });
      }
    }
  }
}
