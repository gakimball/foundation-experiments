import StateContainer from './state-container';

export default class TabState extends StateContainer {
  constructor(elem, options) {
    super(elem, options);

    this.state = {
      activeTab: 0,
    };

    this.tabCount = 0;
    this.elem = elem;

    this.checkElem();
  }

  checkElem() {
    this.tabCount = this.elem.querySelectorAll('.tabs-title').length;
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

    if (nextIndex >= this.tabCount) {
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
        this.update('activeTab', this.tabCount - 1);
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

    return maxHeight;
  }
}
