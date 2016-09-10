import React from 'react'

import {element} from './element'
import TripleElement from './triple_element'

const Location_Wrapper = React.createClass({
  
  prepareConfig() {
    let rawConfig = this.props.configs, byDataLocation = {};
    if (!rawConfig) return rawConfig;
    rawConfig.forEach(function(_config) {
      if (!_config.location) {
        return;
      }
      if (!byDataLocation[_config.location]) {
        byDataLocation[_config.location] = {
          configs: []
        };
      }
      if (!_config.role) {
        byDataLocation[_config.location].configs.push(_config);
      } else if (_config.role === 'locationWrapper') {
        byDataLocation[_config.location].wrapperConfig = _config;
      }
    });
    rawConfig.byDataLocation = byDataLocation;
    return rawConfig;
  },

  wrapper(wrapperConfig, wrapperItems) {
    return (<div key={wrapperConfig.location} {...element.renderAttributes({config: wrapperConfig})}>
      {this.wrapperItems(wrapperItems)}
    </div>)
  },

  wrapperItems(wrapperItems) {
    let items = [], hide, self = this;
    wrapperItems.map((element_config, idx) => {
      if (element_config.data && element_config.data.action === "togglePanel" && self.props.hide) {
        hide = true;
      } else {
        hide = false;
      }
      items.push(<TripleElement mode={this.props.mode} events={this.props.events} key={idx} config={element_config}
                                hide={hide} data={this.props.data} calcDisplay={this.props.calcDisplay}/>);
    });
    return items;
  },

  render() {
    let rawConfig = this.prepareConfig(), elements = [];
    if (Object.keys(rawConfig.byDataLocation).length === 0) {
      elements.push(this.wrapperItems(rawConfig));
    } else {
      for (let key in rawConfig.byDataLocation) {
        let wrapperConfig = rawConfig.byDataLocation[key].wrapperConfig;
        let wrapperItems = rawConfig.byDataLocation[key].configs;
        elements.push(this.wrapper(wrapperConfig, wrapperItems));
      }
    }
    if (this.props.mainContainer) {
      return <div {...element.renderAttributes(this.props.mainContainer)}>{elements}</div>
    } else {
      return <div>{elements}</div>
    }
  }
});

export default Location_Wrapper;