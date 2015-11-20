import React from 'react'
import Localization from '../js/localization.js'

const Label = React.createClass({
  render_att() {
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

  render() {
    return (
      <label {...this.render_att()}>
        {(() => {
          if (this.props.config.text) {
            return typeof this.props.config.text === "number" ? Localization.getLocText(this.props.config.text) : this.props.config.text
          } else {
            return ''
          }

          if (this.props.config.description && typeof this.props.config.description === 'number') {
            return Localization.getLocText(this.props.config.description);
          } else {
            return this.props.config.description;
          }

          if (this.props.config.data && this.props.config.data.key) {
            return this.props.data[this.props.config.data.key];
          }
        })()}
      </label>
    )
  }
});

export default Label;