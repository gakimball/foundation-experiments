import React, { Component } from 'react';
import PropTypes from 'prop-types';
import cls from 'classnames';

export class TabsTitle extends Component {
  static propTypes = {
    children: PropTypes.node.isRequired,
    href: PropTypes.string.isRequired,
    index: PropTypes.number,
    onClick: PropTypes.func,
    selected: PropTypes.bool,
  }

  static defaultProps = {
    index: -1,
    onClick: () => {},
    selected: false,
  }

  componentDidUpdate() {
    if (this.props.selected) {
      this.anchor.focus();
    }
  }

  handleClick = () => {
    this.props.onClick(this.props.index);
  }

  render() {
    const { children, href, onClick, selected } = this.props;
    const target = href.replace(/^#/, '');

    return (
      <li
        className={cls('tabs-title', { 'is-active': selected })}
        role="presentation"
        onClick={this.handleClick}
      >
        <a
          href={href}
          id={`${target}-label`}
          role="tab"
          aria-selected={selected}
          aria-controls={target}
          tabIndex={selected ? 0 : -1}
          ref={e => { this.anchor = e; }}
        >
          {children}
        </a>
      </li>
    )
  }
}
