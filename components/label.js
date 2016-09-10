import React from 'react'

import {element} from './element'
import localization from '../js/localization'

const Label = React.createClass({

  renderContent() {
    let text, config = this.props.config, data = this.props.data;
    if (config.text) {
      text = typeof config.text === "number" ? localization.getLocText(config.text) : config.text;
    } else {
      text = '';
    }

    if (data && data.description) {
      if (typeof data.description === 'number') {
        text = localization.getLocText(data.description);
      } else {
        text = data.description;
      }
    }

    if (config.data && config.data.key) {
      text = data[config.data.key];
    }
    return text;
  },

  render() {
    return (
      <label {...element.renderAttributes(this.props)} {...element.renderHandlers(this.props)}>
        {this.renderContent(this.props) }
      </label>
    )
  }
});

export default Label;