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
          return <LinkButton dateParent={this.props.dateParent} events={this.props.events} config={this.props.config}/>;
        } else {
          return <Button dateParent={this.props.dateParent} events={this.props.events} config={this.props.config}
                  hide={this.props.hide} />;
        }
        break;
      case "label":
        return <Label dateParent={this.props.dateParent} events={this.props.events} config={this.props.config}/>;
        break;
      case "input":
        return <Input dateParent={this.props.dateParent} events={this.props.events} config={this.props.config}/>;
        break;
      case "select":
        return <Select dateParent={this.props.dateParent} events={this.props.events} config={this.props.config}/>;
        break;
    }
  },

  render(){
    return this.definingElement();
  }
});

export default TripleElement;