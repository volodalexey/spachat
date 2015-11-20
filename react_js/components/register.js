import React from 'react'
import { Router, Route, Link, History, Redirect } from 'react-router'

import Button from './button'
import Input from './input'
import Label from './label'
import Location_Wrapper from './location_wrapper'

const Register = React.createClass({
  getDefaultProps() {
    return {
      mainContainer: {
        "element": "div",
        "class": "flex-inner-container"
      },
      configs: [
        {
          "role": "locationWrapper",
          "classList": "w-100p p-t-b flex-just-center",
          "location": "language"
        },
        {
          "element": "label",
          "text": 100,
          "class": "p-r-l-1em",
          "location": "language",
          "data": {
            "role": "labelLanguage"
          }
        },
        {
          "element": "select",
          "location": "language",
          "select_options": [
            {
              "text": "English",
              "value": "en"
            },
            {
              "text": "Русский",
              "value": "ru"
            }
          ],
          "data": {
            "action": "changeLanguage",
            "role": "selectLanguage"
          }
        },
        {
          "role": "locationWrapper",
          "classList": "w-100p p-t-b flex-sp-around",
          "location": "loginButton"
        },
        {
          "element": "button",
          "type": "button",
          "text": 52,
          "location": "loginButton",
          "link": "/login",
          "data": {
            "action": "redirectToLogin",
            "role": "loginButton"
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
        },
        {
          "role": "locationWrapper",
          "classList": "w-100p p-t-b flex-sp-between",
          "location": "userPassword"
        },
        {
          "element": "label",
          "text": 50,
          "class": "flex-item-w50p",
          "location": "userPassword",
          "data": {
            "role": "labelUserPassword"
          }
        },
        {
          "element": "input",
          "type": "password",
          "class": "flex-item-w50p",
          "location": "userPassword",
          "name": "userPassword",
          "data": {
            "key": "userPassword"
          }
        },
        {
          "role": "locationWrapper",
          "classList": "w-100p p-t-b flex-sp-between",
          "location": "userPasswordConfirm"
        },
        {
          "element": "label",
          "text": 41,
          "class": "flex-item-w50p",
          "location": "userPasswordConfirm",
          "data": {
            "role": "labelConfirmUserPassword"
          }
        },
        {
          "element": "input",
          "type": "password",
          "class": "flex-item-w50p",
          "location": "userPasswordConfirm",
          "name": "userPasswordConfirm",
          "data": {
            "key": "userPasswordConfirm"
          }
        },
        {
          "role": "locationWrapper",
          "classList": "w-100p p-t-b flex-sp-around",
          "location": "registerButton"
        },
        {
          "element": "button",
          "type": "submit",
          "text": 53,
          "location": "registerButton",
          "link": "/chat",
          "data": {
            "description": 55,
            "action": "register",
            "role": "registerButton"
          },
          "class": "button-inset"
        }
      ]
    }
  },

  render() {
    return (
      <form className="flex-inner-container form-small" data-role="registerForm">
        <Location_Wrapper mainContainer={this.props.mainContainer} configs={this.props.configs}/>
      </form>
    )
  }
});

export default Register;