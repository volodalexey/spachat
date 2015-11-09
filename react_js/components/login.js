import React from 'react'
import { Router, Route, Link, History, Redirect } from 'react-router'

import Button from './button'
import Input from './input'
import Label from './label'
import Location_Wrapper from './location_wrapper'

const Login = React.createClass({
    getDefaultProps() {
        return {
            configs: [
                {
                    "role": "locationWrapper",
                    "classList": "w-100p p-t-b flex-sp-around",
                    "location": "registerButton"
                },
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
                    "role": "locationWrapper",
                    "classList": "w-100p p-t-b flex-sp-around",
                    "location": "userName"
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
                    <Location_Wrapper configs={this.props.configs} />
                }
            </div>
        )
    }
});

export default Login