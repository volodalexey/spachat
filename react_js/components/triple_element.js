import React from 'react'

import Button from './button'
import LinkButton from './link_button'
import Input from './input'
import Label from './label'
import Select from './select'
import Textarea from './textarea'
import Svg from './svg'

const TripleElement = React.createClass({
  definingElement(){
    switch (this.props.config.element) {
      case "button":
        if (this.props.config.link) {
          return <LinkButton mode={this.props.mode} events={this.props.events} config={this.props.config}
                             data={this.props.data}/>;
        } else {
          return <Button mode={this.props.mode} events={this.props.events} config={this.props.config}
                  hide={this.props.hide} data={this.props.data} calcDisplay={this.props.calcDisplay}/>;
        }
        break;
      case "label":
        return <Label events={this.props.events} events={this.props.events} config={this.props.config}
                      data={this.props.data} calcDisplay={this.props.calcDisplay}/>;
        break;
      case "input":
        return <Input events={this.props.events} config={this.props.config} data={this.props.data}
                      calcDisplay={this.props.calcDisplay}/>;
        break;
      case "select":
        return <Select events={this.props.events} config={this.props.config} data={this.props.data}/>;
        break;
      case "textarea":
        return <Textarea events={this.props.events} config={this.props.config} data={this.props.data}/>;
        break;
      case "svg":
        return <Svg events={this.props.events} config={this.props.config} data={this.props.data} />;
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