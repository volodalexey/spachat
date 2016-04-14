import React from 'react'
import { browserHistory } from 'react-router'

import Location_Wrapper from './location_wrapper'
import Popup from '../components/popup'
import Description from '../components/description'

import ajax_core from '../js/ajax_core.js'
import extend_core from '../js/extend_core.js'

import id_core from '../js/id_core.js'
import users_bus from '../js/users_bus.js'
import Localization from '../js/localization.js'
import overlay_core from '../js/overlay_core.js'

const Register = React.createClass({

  getDefaultProps: function() {
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
          "autoComplete": "off",
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
          "autoComplete": "off",
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
          "autoComplete": "off",
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

  getInitialState: function() {
    return {
      popupOptions: {
        messagePopupShow: false,
        type: '',
        options: {},
        onDataActionClick: null
      }
    }
  },

  componentDidMount: function() {
    this.registerForm = document.querySelector('[data-role="registerForm"]');
    this.toggleWaiter();
  },

  componentWillUnmount: function() {
    this.registerForm = null;
  },

  handleClick: function() {
  },

  handleChange: function(event) {
    switch (event.target.dataset.action) {
      case "changeLanguage":
        Localization.changeLanguage(event.target.value);
        var language = localStorage.getItem('language');
        if (!language || language !== event.target.value) {
          localStorage.setItem('language', event.target.value);
        }
        break;
    }
  },

  handleSubmit: function(event) {
    event.preventDefault();
    let self = this, newState,
      userName = this.registerForm.elements.userName.value,
      userPassword = this.registerForm.elements.userPassword.value,
      userPasswordConfirm = this.registerForm.elements.userPasswordConfirm.value;
    if (userName && userPassword && userPasswordConfirm) {
      if (userPassword === userPasswordConfirm) {
        this.toggleWaiter(true);
        this.registerNewUser(
          {
            userName: userName,
            userPassword: userPassword
          },
          function(regErr) {
            self.toggleWaiter();
            if (regErr) {
              newState = Popup.prototype.handleChangeState(self.state, true, 'error', regErr,
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
            newState = Popup.prototype.handleChangeState(self.state, true, 'success', 96,
              function(action) {
                switch (action) {
                  case 'confirmCancel':
                    newState = Popup.prototype.handleClose(self.state);
                    self.setState(newState);
                    browserHistory.push('/login');
                    break;
                }
              }
            );
            self.setState(newState);
          }
        );
      } else {
        newState = Popup.prototype.handleChangeState(this.state, true, 'error', 91,
          function(action) {
            switch (action) {
              case 'confirmCancel':
                newState = Popup.prototype.handleClose(self.state);
                self.setState(newState);
                break;
            }
          }
        );
        this.setState(newState);
      }
    } else {
      newState = Popup.prototype.handleChangeState(this.state, true, 'error', 88,
        function(action) {
          switch (action) {
            case 'confirmCancel':
              newState = Popup.prototype.handleClose(self.state);
              self.setState(newState);
              break;
          }
        }
      );
      this.setState(newState);
    }
  },

  registerNewUser: function(options, callback) {
    this.get_JSON_res('/api/uuid', function(err, res) {
      if (err) {
        callback(err);
        return;
      }

      users_bus.storeNewUser(
        res.uuid,
        options.userName,
        options.userPassword,
        function(err, account) {
          if (err) {
            callback(err);
            return;
          }

          // successful register
          callback(null, account);
        }
      );
    });
  },

  handleEvents: function(event) {
    this.descriptionContext.showDescription(event);
  },

  render: function() {
    let onEvent = {
      onClick: this.handleClick,
      onChange: this.handleChange
    };
    //https://www.zigpress.com/2014/11/22/stop-chrome-messing-forms/
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
            <form autoComplete="off" className="flex-inner-container form-small" data-role="registerForm"
                  onSubmit={this.handleSubmit}>
              <input style={{display:'none'}} type="text" />
              <input style={{display:'none'}} type="password" />
              <Location_Wrapper mainContainer={this.props.mainContainer} events={onEvent} configs={this.props.configs}/>
            </form>
          </div>
        </div>
        <Popup show={this.state.popupOptions.messagePopupShow} options={this.state.popupOptions}/>
        <Description ref={(obj) => this.descriptionContext = obj} />
      </div>
    )
  }
});

extend_core.prototype.inherit(Register, id_core);
extend_core.prototype.inherit(Register, ajax_core);
extend_core.prototype.inherit(Register, overlay_core);

export default Register;