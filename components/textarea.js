import React from 'react'

import {element} from './element'

const Textarea = React.createClass({

  renderExtraAttributes(){
    let options = {}, config = this.props.config;
    if (config.rows) {
      options.rows = config.rows;
    }
    if (config.value !== "") {
      options.value = config.value;
    }

    return options;
  },

  render() {
    return (
      <textarea {...element.renderAttributes(this.props, this.renderExtraAttributes())}>
        {this.props.config.text}
      </textarea>
    )
  }
});

export default Textarea;