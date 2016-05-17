import React from 'react'
import {element} from './element'
import localization from '../js/localization'

const Select = React.createClass({

  render() {
    let defaultValue,
      options = this.props.config.select_options.map((option, i) => {
        if (localization.lang === option.value) {
          defaultValue = option.value;
        }
        return <option key={i} value={option.value}>{option.text}</option>
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