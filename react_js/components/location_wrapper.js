import React from 'react'

import TripleElement from './triple_element'

const Location_Wrapper = React.createClass({
  prepareConfig(){
    var rawConfig = this.props.configs;
    if(!rawConfig) return rawConfig;
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
    var items = [], hide, self = this;
    wrapperItems.map((element_config, idx) => {
      if(element_config.data && element_config.data.action === "togglePanel" && self.props.hide) {
        hide = true;
      } else {
        hide = false;
      }
      items.push(<TripleElement mode={this.props.mode} events={this.props.events} key={idx} config={element_config}
                                hide={hide} data={this.props.data} calcDisplay={this.props.calcDisplay}/>);
    });
    return items;
  },

  renderAttMainContainer(){
    var params = {};
    if (this.props.mainContainer.class) {
      params["className"] = this.props.mainContainer.class;
    }
    if (this.props.mainContainer.data) {
      for (var dataKey in this.props.mainContainer.data) {
        if (this.props.mainContainer.data[dataKey] !== "") {
          params['data-' + dataKey] = this.props.mainContainer.data[dataKey];
        }
      }
    }
    return params;
  },

  render(){
    var rawConfig = this.prepareConfig();
    var elements = [];
    if(Object.keys(rawConfig.byDataLocation).length === 0){
      elements.push(this.wrapperItems(rawConfig));
    } else {
      for (let key in rawConfig.byDataLocation) {
        let wrapperConfig = rawConfig.byDataLocation[key].wrapperConfig;
        let wrapperItems = rawConfig.byDataLocation[key].configs;
        elements.push(this.wrapper(wrapperConfig, wrapperItems));
      }
    }
    if(this.props.mainContainer){
      return <div {...this.renderAttMainContainer()}>{elements}</div>
    } else {
      return <div>{elements}</div>
    }
    //return <div className={this.props.mainContainer ? this.props.mainContainer.class : ""}>{elements}</div>
  }
});

export default Location_Wrapper;