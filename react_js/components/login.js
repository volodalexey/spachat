import React from 'react'
import { Router, Route, Link, History, Redirect, Lifecycle } from 'react-router'

import Button from './button'
import Input from './input'
import Label from './label'
import Location_Wrapper from './location_wrapper'
import Popup from '../components/popup'
import Decription from '../components/description'

import Localization from '../js/localization.js'
import users_bus from '../js/users_bus.js'
import indexeddb from '../js/indexeddb.js'
import websocket from '../js/websocket.js'
import overlay_core from '../js/overlay_core.js'
import extend_core from '../js/extend_core.js'

const Login = React.createClass({
  //mixins: [ Lifecycle ],
  mixins: [History],

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
      popupOptions: {
        messagePopupShow: false,
        type: '',
        options: {},
        onDataActionClick: null
      }
    }
  },

  componentDidMount(){
    this.loginForm = document.querySelector('[data-role="loginForm"]');
    this.toggleWaiter();
  },

  componentWillUnmount(){
    this.loginForm = null;
  },

  //  routerWillLeave() {
  //    return 'Leave page ?'
  //},

  handleClick(e){
  },

  handleChange(event) {
    switch (event.target.dataset.action) {
      case "changeLanguage":
        Localization.changeLanguage(event.target.value);
        break;
    }
  },

  handleSubmit(event){
    var self = this, newState;
    event.preventDefault();
    var userName = this.loginForm.elements.userName.value;
    var userPassword = this.loginForm.elements.userPassword.value;
    if (userName && userPassword) {
      self.toggleWaiter(true);
      indexeddb.getGlobalUserCredentials(userName, userPassword, function(err, userCredentials) {
        self.toggleWaiter();
        if (err) {
          newState = Popup.prototype.handleChangeState(this.state, true, 'error', err,
            function(action) {
              switch (action) {
                case 'confirmCancel':
                  newState = Popup.prototype.handleClose(self.state);
                  self.setState(newState);
                  break;
              }
            }
          );
          self.setState(newState);
          return;
        }

        if (userCredentials) {
          users_bus.setUserId(userCredentials.user_id);
          users_bus.getMyInfo(null, function(err, options, userInfo) {
            if (userPassword === userInfo.userPassword) {
              users_bus.setUserId(userInfo.user_id);
              //websocket.createAndListen();
              users_bus.checkLoginState();
              self.history.pushState(null, 'chat');
            } else {
              newState = Popup.prototype.handleChangeState(this.state, true, 'error', 104,
                function(action) {
                  switch (action) {
                    case 'confirmCancel':
                      newState = Popup.prototype.handleClose(self.state);
                      self.setState(newState);
                      break;
                  }
                }
              );
              self.setState(newState);
              return;
            }
          });
        } else {
          users_bus.setUserId(null);
          newState = Popup.prototype.handleChangeState(this.state, true, 'error', 87,
            function(action) {
              switch (action) {
                case 'confirmCancel':
                  newState = Popup.prototype.handleClose(self.state);
                  self.setState(newState);
                  break;
              }
            });
          this.setState(newState);
        }
      });
    } else {
      newState = Popup.prototype.handleChangeState(this.state, true, 'error', 88,
        function(action) {
          switch (action) {
            case 'confirmCancel':
              newState = Popup.prototype.handleClose(self.state);
              self.setState(newState);
              break;
          }
        });
      this.setState(newState);
    }
  },

  render() {
    let onEvent = {
      onClick: this.handleClick,
      onChange: this.handleChange
    };
    return (
      <div>
        <div data-role="main_container" className="w-100p h-100p p-abs">
          <div className="flex-outer-container p-fx">
            <form className="flex-inner-container form-small" data-role="loginForm" onSubmit={this.handleSubmit}>
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
extend_core.prototype.inherit(Login, overlay_core);

export default Login;

