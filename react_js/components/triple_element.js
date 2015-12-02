import React from 'react'

import Button from './button'
import LinkButton from './link_button'
import Input from './input'
import Label from './label'
import Select from './select'
import Textarea from './textarea'

const TripleElement = React.createClass({
  definingElement(){
    switch (this.props.config.element) {
      case "button":
        if (this.props.config.link) {
          return <LinkButton mode={this.props.mode} events={this.props.events} config={this.props.config}/>;
        } else {
          return <Button mode={this.props.mode} events={this.props.events} config={this.props.config}
                  hide={this.props.hide} />;
        }
        break;
      case "label":
        return <Label events={this.props.events} config={this.props.config}/>;
        break;
      case "input":
        return <Input events={this.props.events} config={this.props.config}/>;
        break;
      case "select":
        return <Select events={this.props.events} config={this.props.config}/>;
        break;
      case "textarea":
        return <Textarea events={this.props.events} config={this.props.config}/>;
        break;
      case "svg":
        return <img src={"components/icon/" + this.props.config.icon} className="transition-all" data-role="pointer" />;
        break;
      default:
        return <div/>
      break;
    }
  },

  render(){
    return this.definingElement();
  }
});

export default TripleElement;