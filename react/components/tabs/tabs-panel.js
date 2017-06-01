import React, { Component } from 'react';
import PropTypes from 'prop-types';
import cls from 'classnames';

export class TabsPanel extends Component {
  static propTypes = {
    active: PropTypes.bool,
    children: PropTypes.node.isRequired,
    height: PropTypes.number,
    id: PropTypes.string.isRequired,
  }

  static defaultProps = {
    active: false,
  }

  render() {
    const { active, children, height, id } = this.props;

    return (
      <div
        className={cls('tabs-panel', { 'is-active': active })}
        style={{ height: height ? `${height}px` : undefined }}
        role="tabpanel"
        aria-hidden={!active}
        aria-labelledby={`${id}-label`}
      >
        {children}
      </div>
    );
  }
}
