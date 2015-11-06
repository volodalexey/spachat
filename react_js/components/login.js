import React from 'react'
import { Router, Route, Link, History, Redirect } from 'react-router'

import Button from './button'
import Input from './input'
import Label from './label'

const Login = React.createClass({
    getDefaultProps() {
        return {
            configs: [
                {
                    "element": "button",
                    "type": "button",
                    "location": "registerButton",
                    "text": 48,
                    "data": {
                        "description": 54,
                        "action": "clickRedirectToRegister",
                        "role": "registerNewUser"
                    },
                    "class": "button-inset"
                },
                {
                    "element": "label",
                    "text": 49,
                    "class": "flex-item-w50p",
                    "location": "userName",
                    "data": {
                        "role": "labelUserName"
                    }
                },
                {
                    "element": "input",
                    "type": "text",
                    "class": "flex-item-w50p",
                    "location": "userName",
                    "name": "userName",
                    "data": {
                        "key": "userName"
                    }
                }
            ]
        }
    },

    render() {
        return (
            <div>
                {
                    this.props.configs.map(function(el, idx) {
                        if (el.element === "button"){
                            return <Button key={idx} config={el}/>
                        }
                    })
                }
            </div>
        )
    }
});

export default Login