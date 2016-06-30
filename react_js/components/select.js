import React from 'react'
import {element} from './element'
import localization from '../js/localization'

const Select = React.createClass({

  render() {
    let defaultValue, self = this,
      options = this.props.config.select_options.map((option, i) => {
        if (self.props.data[self.props.config.data.key] === option.value) {
          defaultValue = option.value;
        }
        return <option key={i} value={option.value}>{localization.getLocText(option.text)}</option>
      });

    return (
      <select
        defaultValue={defaultValue} {...element.renderAttributes(this.props)} {...element.renderHandlers(this.props)}>
        {options}
      </select>
    )
  }
});

export default Select;