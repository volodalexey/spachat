import React from 'react'

import Localization from '../js/localization.js'

const Input = React.createClass({
  renderAtt: function() {
    let params = {};
    if (this.props.config.autoComplete) {
      params["autoComplete"] = this.props.config.autoComplete;
    }
    if (this.props.config.class) {
      params["className"] = this.props.config.class;
    }
    if (this.props.config.data) {
      for (var dataKey in this.props.config.data) {
        if (this.props.config.data[dataKey] !== "") {
          params['data-' + dataKey] = this.props.config.data[dataKey];
        }
      }
    }

    let display;
    if (this.props.calcDisplay) {
      display = this.props.calcDisplay(this.props.config);
    }
    if (display !== undefined && display !== true) {
      params['style'] = {display: 'none'};
    }

    if (this.props.id) {
      params['id'] = this.props.config.id;
    }
    if (this.props.config.disabled === true) {
      params["disabled"] = 'true';
    }
    if (this.props.config.onkeypress) {
      params["onkeypress"] = this.props.config.onkeypress;
    }
    if (this.props.config.type === "checkbox" || this.props.config.type === "radio") {
      if (this.props.config.data.key) {
        if (this.props.data[this.props.config.data.key]) {
          params["checked"] = 'true';
        }
      }
    }
    if (this.props.config.data && this.props.config.data.key === "page") {
      params["value"] = this.props.data[this.props.config.data.key];
    }
    if (this.props.config.name) {
      params['id'] = this.props.config.id;
      if (this.props.config.type === "radio" && this.props.data.index !== undefined) {
        params['name'] = this.props.config.name + '_' + this.props.data.index;
      } else {
        params['name'] = this.props.config.name;
      }
    }
    if (this.props.config.type === "text") {
      if (this.props.config.data && this.props.config.data.key && this.props.data) {
        if (typeof this.props.data[this.props.config.data.key] === "number") {
          if (this.props.config.data.replace_key){
            let text = Localization.getLocText(this.props.data[this.props.config.data.key]);
            params["value"] = text.replace('{' + this.props.config.data.replace_key + '}',
              this.props.data[this.props.config.data.replace_key]);
          } else {
            params["value"] = Localization.getLocText(this.props.data[this.props.config.data.key]);
          }
        } else {
          params["value"] = this.props.data[this.props.config.data.key];
        }
      }
    }
    return params;
  },

  renderContent: function() {
    var content;
    if (typeof this.props.config.text === "number") {
      content = Localization.getLocText(this.props.config.text);
    } else {
      content = this.props.config.text;
    }
    return {__html: content};
  },

  routerWillLeave: function() {
    if (this.stateInfo.value)
      return 'You have unsaved information, are you sure you want to leave this page?';
  },

  renderHandlers: function() {
    var handlers = {};
    if (this.props.events) {
      for (var dataKey in this.props.events) {
        handlers[dataKey] = this.props.events[dataKey];
      }
    }
    return handlers;
  },

  render: function() {
    if (this.props.config.text) {
      return (
        <div className="flex-item flex-wrap flex-align-c flex-item-auto">
          <input type={this.props.config.type} {...this.renderAtt()} {...this.renderHandlers()}/>
          <span dangerouslySetInnerHTML={this.renderContent()}/>
        </div>
      );
    } else {
      return <input type={this.props.config.type} {...this.renderAtt()} {...this.renderHandlers()}/>;
    }
  }
});

export default Input;