import React, { Children, Component } from 'react';
import PropTypes from 'prop-types';
import TabState from '../../../core/tabs';
import TabsRegistry from './registry';

export class Tabs extends Component {
  static propTypes = {
    activeCollapse: PropTypes.bool,
    autoFocus: PropTypes.bool,
    id: PropTypes.string.isRequired,
    matchHeight: PropTypes.bool,
    wrapOnKeys: PropTypes.bool,
  }

  static defaultProps = {
    activeCollapse: false,
    autoFocus: false,
    matchHeight: false,
    wrapOnKeys: true,
  }

  state = {
    activeTab: null,
  }

  constructor(props) {
    super(props);

    this.ping = TabsRegistry.register(props.id);
  }

  componentDidMount() {
    this.tabState = new TabState(this.element, this.props);
    this.tabState.listen((prop, oldValue, newValue) => {
      if (prop === 'activeTab') {
        this.ping('activeTab', this.getTabTarget(newValue));
      }

      this.setState({
        [prop]: newValue,
      });
    });
    this.tabState.fetch();

    if (this.props.matchHeight) {
      this.ping('height', this.tabState.getTallestTab());
    }
  }

  getTabTarget(index) {
    const children = Children.toArray(this.props.children);
    return children[index].props.href.replace(/^#/, '');
  }

  handleTabClick = index => {
    this.tabState.toggleTab(index);
  }

  handleKeyDown = ({ nativeEvent: { key } }) => {
    this.tabState.handleKey(key);
  }

  render() {
    const { children, id } = this.props;
    const { activeTab } = this.state;

    return (
      <ul
        id={id}
        className="tabs"
        onClick={this.handleClick}
        onKeyDown={this.handleKeyDown}
        ref={e => { this.element = e; }}
      >
        {Children.map(children, (child, index) =>
          <child.type
            {...child.props}
            selected={activeTab === index}
            index={index}
            onClick={this.handleTabClick}
          />
        )}
      </ul>
    );
  }
}
