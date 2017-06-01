import React, { Children, Component } from 'react';
import PropTypes from 'prop-types';
import TabsRegistry from './registry';

export class TabsContent extends Component {
  static propTypes = {
    children: PropTypes.node.isRequired,
    target: PropTypes.string.isRequired,
  }

  state = {
    activePane: null,
  }

  constructor(props) {
    super(props);

    this.stopListening = TabsRegistry.listen(props.target, (message, content) => {
      switch (message) {
        case 'activeTab':
          this.setState({
            activePane: content,
          });
          break;
        case 'height': {
          this.setState({
            paneHeight: content,
          });
          break;
        }
      }
    });
  }

  componentWillUnmount() {
    this.stopListening();
  }

  render() {
    const { children, target } = this.props;
    const { activePane, paneHeight } = this.state;

    return (
      <div className="tabs-content" data-tabs-content={target}>
        {Children.map(children, child =>
          <child.type
            {...child.props}
            active={activePane === child.props.id}
            height={paneHeight}
          />
        )}
      </div>
    )
  }
}
