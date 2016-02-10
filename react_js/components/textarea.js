import React from 'react'
import Localization from '../js/localization.js'

const Textarea = React.createClass({
  render_att: function() {
    let params = {};
    if (this.props.config.data) {
      for (var configDataKey in this.props.config.data) {
        if (this.props.config.data[configDataKey] !== "") {
          params['data-' + configDataKey] = this.props.config.data[configDataKey];
        }
      }
    }
    if (this.props.config.rows) {
      params['rows'] = this.props.config.rows;
    }
    if (this.props.config.value !== "") {
      params['value'] = this.props.config.value;
    }
    return params;
  },

  render: function() {
    return (
      <textarea className={this.props.config.class ? this.props.config.class : ''} {...this.render_att()}>
        {this.props.config.text}
      </textarea>
    )
  }
});

export default Textarea;