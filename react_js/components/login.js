import React from 'react'
import { Router, Route, Link, History, Redirect, Lifecycle } from 'react-router'


import Button from './button'
import Input from './input'
import Label from './label'
import Location_Wrapper from './location_wrapper'
import Popup from '../components/popup'
import Decription from '../components/description'

import Localization from '../js/localization.js'

const Login = React.createClass({
  //mixins: [ Lifecycle ],
  mixins: [ History ],

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
          "location": "registerButton"
        },
        {
          "element": "button",
          "type": "button",
          "location": "registerButton",
          "link": "/register",
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
          "classList": "w-100p p-t-b flex-sp-around",
          "location": "loginButton"
        },
        {
          "element": "button",
          "type": "submit",
          "text": 51,
          "location": "loginButton",
          //"link": "/chat",
          "data": {
            "action": "submit",
            "role": "loginButton"
          },
          "class": "button-inset"
        }
      ]
    }
  },

  getInitialState(){
    return {
      lang: Localization.lang,
      popupOptions:{
        messagePopupShow: false,
        type: '',
        options: {},
        onDataActionClick: null
      }
    }
  },

  componentDidMount(){
    this.loginForm = document.querySelector('[data-role="loginForm"]');
  },

  componentWillUnmount(){
    this.loginForm = null;
  },

  //  routerWillLeave() {
  //    return 'Leave page ?'
  //},

  onClick(e){
  },

  onChange(event) {
    switch (event.target.dataset.action) {
      case "changeLanguage":
        Localization.changeLanguage(event.target.value);
        break;
    }
  },

  onSubmit(event){
    var self = this;
    event.preventDefault();
    var userName = this.loginForm.elements.userName.value;
    var userPassword = this.loginForm.elements.userPassword.value;
    if (userName && userPassword) {
      console.log('userName:', userName, 'userPassword:',userPassword);
      this.history.pushState(null, '/chat');
      this.state.popupOptions.messagePopupShow = false;
      this.state.popupOptions.type = '';
      this.state.popupOptions.options = {};
      this.state.popupOptions.onDataActionClick = null;
      this.setState({popupOptions: this.state.popupOptions});
    } else {
      this.state.popupOptions.messagePopupShow = true;
      this.state.popupOptions.type = 'error';
      this.state.popupOptions.options = {message: 88};
      this.state.popupOptions.onDataActionClick = (function(action) {
            switch (action) {
              case 'confirmCancel':
                self.state.popupOptions.messagePopupShow = false;
                self.state.popupOptions.type = '';
                self.state.popupOptions.options = {};
                self.state.popupOptions.onDataActionClick = null;
                self.setState({popupOptions: self.state.popupOptions});
                break;
            }
          });
      this.setState({popupOptions: this.state.popupOptions});
    }
  },

  render() {
    let onEvent = {
      onClick: this.onClick,
      onChange: this.onChange
    };
    return (
      <div>
        <div data-role="main_container" className="w-100p h-100p p-abs">
          <div className="flex-outer-container p-fx">
            <form className="flex-inner-container form-small" data-role="loginForm" onSubmit={this.onSubmit}>
              <Location_Wrapper mainContainer={this.props.mainContainer} events={onEvent} configs={this.props.configs}/>
            </form>
          </div>
        </div>
        <Popup show={this.state.popupOptions.messagePopupShow} options={this.state.popupOptions}/>
        <Decription />
      </div>
    )
  }
});

export default Login;

