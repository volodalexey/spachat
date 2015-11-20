import React from 'react'

import Triple_Element from './triple_element'

const Location_Wrapper = React.createClass({
  prepareConfig(){
    var rawConfig = this.props.configs;
    var byDataLocation = {};
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

  render_att(config) {
    var params = {};
    if (config.classList) {
      params['className'] = config.classList;
    }
    if (config.role) {
      params['role'] = config.role;
    }
    return params;
  },

  wrapper(wrapperConfig, wrapperItems){
    return (<div key={wrapperConfig.location} {...this.render_att(wrapperConfig)}>
      {this.wrapperItems(wrapperItems)}
    </div>)
  },

  wrapperItems(wrapperItems){
    var items = [];
    wrapperItems.map((element_config, idx) => {
      items.push(<Triple_Element key={idx} config={element_config}/>);
    });
    return items;
  },

  render(){
    var rawConfig = this.prepareConfig();
    var elements = [];
    for (let key in rawConfig.byDataLocation) {
      let wrapperConfig = rawConfig.byDataLocation[key].wrapperConfig;
      let wrapperItems = rawConfig.byDataLocation[key].configs;
      elements.push(this.wrapper(wrapperConfig, wrapperItems));
    }
    return <div className={this.props.mainContainer ? this.props.mainContainer.class : ""}>{elements}</div>
  }
});

export default Location_Wrapper;