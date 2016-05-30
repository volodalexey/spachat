import React from 'react'
import {browserHistory} from 'react-router'

import Location_Wrapper from './location_wrapper'
import Description from '../components/description'
import DialogError from './dialogError'

import localization from '../js/localization.js'
import users_bus from '../js/users_bus.js'
import indexeddb from '../js/indexeddb.js'
import overlay_core from '../js/overlay_core.js'
import extend_core from '../js/extend_core.js'

const Login = React.createClass({

  getDefaultProps() {
    return {
      mainContainer: {
        "element": "div",
        "config": {
          "class": "flex-inner-container"
        }
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
          "data": {
            "action": "submit",
            "role": "loginButton"
          },
          "class": "button-inset"
        }
      ]
    }
  },

  getInitialState() {
    return {
      lang: localization.lang,
      errorMessage: null
    }
  },

  componentDidMount() {
    this.loginForm = document.querySelector('[data-role="loginForm"]');
    this.loginForm.addEventListener('click', this.handleClick, true);
    this.toggleWaiter();
  },

  componentWillUnmount() {
    this.loginForm = null;
  },

  handleClick(event) {
    if (event.currentTarget.dataset.action === 'clickRedirectToRegister') {
      this.clickRedirectToRegister(event);
    }
  },

  handleDialogError(){
    this.setState({errorMessage: null});
  },

  handleChange(event) {
    switch (event.target.dataset.action) {
      case "changeLanguage":
        localization.changeLanguage(event.target.value, this);
        break;
    }
  },

  handleSubmit(event) {
    event.preventDefault();

    let self = this,
      userName = this.loginForm.elements.userName.value,
      userPassword = this.loginForm.elements.userPassword.value;
    if (userName && userPassword) {
      self.toggleWaiter(true);
      indexeddb.getGlobalUserCredentials(userName, userPassword, function(err, userCredentials) {
        if (err) {
          self.toggleWaiter();
          self.setState({errorMessage: err});
          return;
        }

        if (userCredentials) {
          users_bus.setUserId(userCredentials.user_id);
          users_bus.getMyInfo(null, function(err, options, userInfo) {
            if(userInfo){
              if (userPassword === userInfo.userPassword) {
                users_bus.checkLoginState();
                if (browserHistory.desired_path && browserHistory.desired_search) {
                  browserHistory.push(browserHistory.desired_path + browserHistory.desired_search);
                  browserHistory.desired_path = null;
                  browserHistory.desired_search = null;
                } else {
                  browserHistory.push('/chat');
                }
              } else {
                self.toggleWaiter();
                self.setState({errorMessage: 104});
              }
            } else {
              self.toggleWaiter();
              self.setState({errorMessage: 127});
            }
          });
        } else {
          self.toggleWaiter();
          users_bus.setUserId(null);
          self.setState({errorMessage: 87});
        }
      });
    } else {
      this.setState({errorMessage: 88});
    }
  },

  clickRedirectToRegister(event) {
    event.preventDefault();
    event.stopPropagation();
    if (browserHistory.desired_path && browserHistory.desired_search) {
      browserHistory.push(browserHistory.desired_path + browserHistory.desired_search);
      location.replace('register?' + browserHistory.desired_path + browserHistory.desired_search);
    } else {
      location.replace('register');
    }
  },

  handleEvents(event) {
    this.descriptionContext.showDescription(event);
  },

  render() {
    let onEvent = {
      onClick: this.handleClick,
      onChange: this.handleChange
    };
    return (
      <div onMouseDown={this.handleEvents}
           onMouseMove={this.handleEvents}
           onMouseUp={this.handleEvents}
           onClick={this.handleEvents}
           onTouchEnd={this.handleEvents}
           onTouchMove={this.handleEvents}
           onTouchStart={this.handleEvents}>
        <div data-role="main_container" className="w-100p h-100p p-abs">
          <div className="flex-outer-container p-fx">
            <form className="flex-inner-container form-small" data-role="loginForm" onSubmit={this.handleSubmit}>
              <Location_Wrapper mainContainer={this.props.mainContainer} events={onEvent} configs={this.props.configs}/>
            </form>
          </div>
        </div>
        <DialogError show={this.state.errorMessage} message={this.state.errorMessage}
                     handleClick={this.handleDialogError}/>
        <Description ref={(obj) => this.descriptionContext = obj}/>
      </div>
    )
  }
});
extend_core.prototype.inherit(Login, overlay_core);

export default Login;