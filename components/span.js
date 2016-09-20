import React from 'react'

import {element} from './element'
import localization from '../js/localization'

const Span = React.createClass({

  renderContent() {
    let text, config = this.props.config, data = this.props.data;
    if (config.text) {
      text = typeof config.text === "number" ? localization.getLocText(config.text) : config.text;
    } else {
      text = '';
    }

    if (config.data && config.data.key) {
      if (!data[config.data.key]){
        text = null;
      }
    }
    return text;
  },

  render() {
    return (
      <label {...element.renderAttributes(this.props)} >
        {this.renderContent(this.props) }
      </label>
    )
  }
});

export default Span;