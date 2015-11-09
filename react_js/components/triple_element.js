import React from 'react'

import Button from './button'
import Input from './input'
import Label from './label'

const Triple_element = React.createClass({
    render(){
        return (
            <div>
                {(() => {
                    if (this.props.config.element === "button") {
                        return <Button config={this.props.config}/>
                    }
                    if (this.props.config.element === "label") {
                        return <Label config={this.props.config}/>
                    }
                    if (this.props.config.element === "input") {
                        return <Input config={this.props.config}/>
                    }
                })()}
            </div>)
    }
});

export default Triple_element;