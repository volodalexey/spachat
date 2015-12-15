import React from 'react'
import { Router, Route, Link, History, Redirect } from 'react-router'

import Button from './button'
import Input from './input'
import Label from './label'
import Location_Wrapper from './location_wrapper'
import Popup from '../components/popup'
import Decription from '../components/description'
import Localization from '../js/localization.js'

const Register = React.createClass({
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
          //"link": "/chat",
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

  getInitialState(){
    return {
      popupOptions:{
        messagePopupShow: false,
        type: '',
        options: {},
        onDataActionClick: null
      }
    }
  },

  componentDidMount(){
    this.registerForm = document.querySelector('[data-role="registerForm"]');
  },

  componentWillUnmount(){
    this.registerForm = null;
  },

  onClick(){
  },

  onChange: function(event) {
    switch (event.target.dataset.action) {
      case "changeLanguage":
        Localization.changeLanguage(event.target.value);
        break;
    }
  },

  onSubmit(event){
    var self = this;
    event.preventDefault();
    var userName = this.registerForm.elements.userName.value;
    var userPassword = this.registerForm.elements.userPassword.value;
    var userPasswordConfirm = this.registerForm.elements.userPasswordConfirm.value;
    if (userName && userPassword && userPasswordConfirm) {
      if (userPassword === userPasswordConfirm) {
        console.log('registerNewUser');
        this.history.pushState(null, '/chat');
      } else {
        this.state.popupOptions.messagePopupShow = true;
        this.state.popupOptions.type = 'error';
        this.state.popupOptions.options = {message: 91};
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
            <form className="flex-inner-container form-small" data-role="registerForm" onSubmit={this.onSubmit}>
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

export default Register;