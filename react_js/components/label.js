import React from 'react'
import Localization from '../js/localization.js'

const Label = React.createClass({
  renderAtt() {
    var params = {};
    if (this.props.config.class) {
      params["className"] = this.props.config.class;
    }
    if (this.props.config.name) {
      params["name"] = this.props.config.name;
    }
    if (this.props.config.for) {
      params["for"] = this.props.config.for;
    }
    if (this.props.config.data) {
      for (var configDataKey in this.props.config.data) {
        if (this.props.config.data[configDataKey] !== "") {
          params['data-' + configDataKey] = this.props.config.data[configDataKey];
        }
      }
    }
    if (this.props.config.data && this.props.config.key) {
      params['data-' + this.props.config.key] = this.props.data[this.props.config.key];
    }
    return params;
  },

  renderContent(){
    let text;
    if (this.props.config.text) {
      text = typeof this.props.config.text === "number" ? Localization.getLocText(this.props.config.text) : this.props.config.text
    } else {
      text = '';
    }

    if(this.props.config.description){
      if (typeof this.props.config.description === 'number') {
        text = Localization.getLocText(this.props.config.description);
      } else {
        text = this.props.config.description;
      }
    }

    if (this.props.config.data && this.props.config.data.key) {
      text = this.props.data[this.props.config.data.key];
    }
    return text;
  },

  render() {
    return (
      <label {...this.renderAtt()}>
        {this.renderContent()}
      </label>
    )
  }
});

export default Label;