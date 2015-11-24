import React from 'react'

import Button from './button'
import LinkButton from './link_button'
import Input from './input'
import Label from './label'
import Select from './select'

const TripleElement = React.createClass({
  definingElement(){
    switch (this.props.config.element) {
      case "button":
        if (this.props.config.link) {
          return <LinkButton config={this.props.config}/>;
        } else {
          return <Button config={this.props.config}/>;
        }
        break;
      case "label":
        return <Label config={this.props.config}/>;
        break;
      case "input":
        return <Input config={this.props.config}/>;
        break;
      case "select":
        return <Select config={this.props.config}/>;
        break;
    }
  },

  render(){
    return this.definingElement();
  }
});

export default TripleElement;