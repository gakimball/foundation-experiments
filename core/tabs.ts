import StateContainer from './state-container';

/**
 * Options that can be passed to a tab instance.
 */
interface TabOptions {
  activeCollapse: boolean,
  autoFocus: boolean,
  matchHeight: boolean,
  wrapOnKeys: boolean,
}

/**
 * Internal state maintained by tabs.
 */
interface TabStateInternal {
  activeTab: number,
};

/**
 * State container for a tab plugin.
 */
export default class TabState extends StateContainer<TabOptions, TabStateInternal> {
  tabs: string[] = []
  maxHeight: number = 0
  elem: Element

  constructor(elem: Element, options: TabOptions) {
    super();

    this.state = {
      activeTab: 0,
    };

    this.tabs = [];
    this.elem = elem;

    this.parseDOM();
  }

  parseDOM(): void {
    this.tabs = Array.prototype.slice.call(this.elem.querySelectorAll('.tabs-title')).map(
      tab => tab.querySelector('a').getAttribute('href').replace(/^#/, '')
    );
  }

  handleKey(key: string): void {
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

  tabForward(): void {
    const nextIndex: number = this.state.activeTab + 1;

    if (nextIndex >= this.tabs.length) {
      if (this.options.wrapOnKeys) {
        this.update('activeTab', 0);
      }
    } else {
      this.update('activeTab', nextIndex);
    }
  }

  tabBackward(): void {
    const nextIndex: number = this.state.activeTab - 1;

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

  getTallestTab(): number {
    const panes: NodeListOf<Element> = document.querySelectorAll(`[data-tabs-content="${this.elem.id}"] .tabs-panel`);
    let maxHeight: number = 0;

    for (let i = 0; i < panes.length; i++) {
      const pane: Element = panes[i];
      pane.classList.add('is-temp-hidden');
      const { height } = pane.getBoundingClientRect();

      if (height > maxHeight) {
        maxHeight = height;
      }

      pane.classList.remove('is-temp-hidden');
    }

    this.maxHeight = maxHeight;
    return this.maxHeight;
  }

  getTabTarget(index: number): string {
    return this.tabs[index];
  }

  getTitleAttrs(index: number): object {
    return {
      role: 'presentation',
    };
  }

  getTitleAnchorAttrs(index: number): object {
    const target: string = this.tabs[index];
    const active: boolean = index === this.state.activeTab;

    return {
      id: `${target}-label`,
      role: 'tab',
      'aria-selected': active,
      'aria-controls': target,
      tabindex: active ? 0 : -1,
    };
  }

  getPanelAttrs(id: string): object {
    const tabIndex: number = this.tabs.indexOf(id);

    return {
      role: 'tabpanel',
      'aria-hidden': tabIndex !== this.state.activeTab,
      'aria-labelledby': `${id}-label`,
    };
  }

  getPanelStyle(id: number): object {
    return {
      height: this.options.matchHeight ? this.maxHeight : undefined,
    };
  }
}
