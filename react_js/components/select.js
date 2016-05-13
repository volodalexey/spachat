import React from 'react'

import Localization from '../js/localization.js'

const Select = React.createClass({
  displayName: 'Select',
  render_att: function() {
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

    return params;
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
    var defaultValue;
    var options = this.props.config.select_options.map(function(option, i) {
      if (Localization.lang === option.value) {
        defaultValue = option.value;
      }
      return <option key={i} value={option.value}>{option.text}</option>
    }, this);
    return (
      <div>
        <select value={defaultValue}  {...this.render_att()} {...this.renderHandlers()}>
          {options}
        </select>
      </div>
    )
  }
});

export default Select;