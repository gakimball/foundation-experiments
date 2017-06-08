import StateContainer from './state-container';

export default class TabState extends StateContainer {
  constructor(elem, options) {
    super(elem, options);

    this.state = {
      activeTab: 0,
    };

    this.tabs = [];
    this.elem = elem;
    this.maxHeight = 0;

    this.parseDOM();
  }

  parseDOM() {
    this.tabs = Array.prototype.slice.call(this.elem.querySelectorAll('.tabs-title')).map(
      tab => tab.querySelector('a').getAttribute('href').replace(/^#/, '')
    );
  }

  handleKey(key) {
    switch (key) {
      case 'ArrowRight':
      case 'ArrowDown':
        this.tabForward();
        break;
      case 'ArrowLeft':
      case 'ArrowUp':
        this.tabBackward();
        break;
      case 'Enter':
      case 'Space':
        this.toggleTab();
        break;
    }
  }

  tabForward() {
    const nextIndex = this.state.activeTab + 1;

    if (nextIndex >= this.tabs.length) {
      if (this.options.wrapOnKeys) {
        this.update('activeTab', 0);
      }
    } else {
      this.update('activeTab', nextIndex);
    }
  }

  tabBackward() {
    const nextIndex = this.state.activeTab - 1;

    if (nextIndex < 0) {
      if (this.options.wrapOnKeys) {
        this.update('activeTab', this.tabs.length - 1);
      }
    } else {
      this.update('activeTab', nextIndex);
    }
  }

  toggleTab(index = null) {
    if (index !== null) {
      if (index === this.state.activeTab && this.options.activeCollapse) {
        this.update('activeTab', null);
      } else {
        this.update('activeTab', index);
      }
    } else {
      this.update('activetab', null);
    }
  }

  getTallestTab() {
    const panes = document.querySelectorAll(`[data-tabs-content="${this.elem.id}"] .tabs-panel`);
    let maxHeight = 0;

    panes.forEach(pane => {
      pane.classList.add('is-temp-hidden');
      const { height } = pane.getBoundingClientRect();
      if (height > maxHeight) {
        maxHeight = height;
      }
      pane.classList.remove('is-temp-hidden');
    });

    this.maxHeight = maxHeight;
    console.log(this.maxHeight);
    return this.maxHeight;
  }

  getTabTarget(index) {
    return this.tabs[index];
  }

  getTitleAttrs(index) {
    return {
      role: 'presentation',
    };
  }

  getTitleAnchorAttrs(index) {
    const target = this.tabs[index];
    const active = index === this.state.activeTab;

    return {
      id: `${target}-label`,
      role: 'tab',
      'aria-selected': active,
      'aria-controls': target,
      tabindex: active ? 0 : -1,
    };
  }

  getPanelAttrs(id) {
    const tabIndex = this.tabs.indexOf(id);

    return {
      role: 'tabpanel',
      'aria-hidden': tabIndex !== this.state.activeTab,
      'aria-labelledby': `${id}-label`,
    };
  }

  getPanelStyle(id) {
    return {
      height: this.options.matchHeight ? `${this.maxHeight}px` : undefined,
    };
  }
}
