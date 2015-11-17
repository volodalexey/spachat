import React from 'react'

import Button from './button'
import Link_button from './link_button'
import Input from './input'
import Label from './label'

const Triple_element = React.createClass({
  definingElement(){
    if (this.props.config.element === "button" && this.props.config.link) {
      return <Link_button config={this.props.config}/>
    }
    if(this.props.config.element === "button" && !this.props.config.link) {
      return <Button config={this.props.config}/>
    }
    if (this.props.config.element === "label") {
      return <Label config={this.props.config}/>
    }
    if (this.props.config.element === "input") {
      return <Input config={this.props.config}/>
    }
  },

  render(){
    return this.definingElement();
  }
});

export default Triple_element;