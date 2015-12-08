import React from 'react'
import Localization from '../js/localization.js'

const Input = React.createClass({
  renderAtt() {
    var params = {};
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
      if (this.props.config.type === "radio" && this.props.index !== undefined) {
        params['name'] = this.props.config.name + '_' + this.props.index;
      } else {
        params['name'] = this.props.config.name;
      }
    }
    if (this.props.config.type === "text") {
      if (this.props.config.key) {
        params["value"] = this.props.data[this.props.config.data.key];
      }
    }

    return params;
  },

  renderContent(){
    var content;
    if (typeof this.props.config.text === "number") {
      content = Localization.getLocText(this.props.config.text);
    } else {
      content = this.props.config.text;
    }
    return {__html: content};
  },

  routerWillLeave() {
    if (this.stateInfo.value)
      return 'You have unsaved information, are you sure you want to leave this page?';
  },

  renderHandlers(){
    var handlers = {};
    if (this.props.events) {
      for (var dataKey in this.props.events) {
        handlers[dataKey] = this.props.events[dataKey];
      }
    }
    return handlers;
  },

  render() {
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