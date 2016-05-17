import React from 'react'
import {element} from './element'
import localization from '../js/localization'

const Input = React.createClass({

  renderExtraAttributes(){
    let options = {}, config = this.props.config;
    if (config.data && config.data.key === "page") {
      options.value = this.props.data[config.data.key];
    }
    if (config.type === "text") {
      if (config.data && config.data.key && this.props.data) {
        if (this.props.data[config.data.key]) {
          options.value = this.props.data[config.data.key];
        }
      }
    }
    if (config.name) {
      options.id = this.props.config.id;
      if (this.props.config.type === "radio" && this.props.data.index !== undefined) {
        options.name = this.props.config.name + '_' + this.props.data.index;
      }
    }

    return options;
  },

  renderContent: function() {
    let content;
    if (typeof this.props.config.text === "number") {
      content = localization.getLocText(this.props.config.text);
    } else {
      content = this.props.config.text;
    }
    return {__html: content};
  },

  render: function() {
    let pureInput = (
      <input  {...element.renderAttributes(this.props, this.renderExtraAttributes())}
        {...element.renderHandlers(this.props)} />
    );
    return (
      this.props.config.text ?
        <div className="flex-item flex-wrap flex-align-c flex-item-auto">
          {pureInput}
          <span dangerouslySetInnerHTML={this.renderContent()}/>
        </div>
        : pureInput
    )
  }
});

export default Input;