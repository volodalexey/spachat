import React from 'react'
import { browserHistory } from 'react-router'

import Location_Wrapper from './location_wrapper'
import DialogError from './dialogError'
import DialogSuccess from './dialogSuccess'
import Description from '../components/description'

import ajax_core from '../js/ajax_core.js'
import extend_core from '../js/extend_core.js'
import id_core from '../js/id_core.js'
import users_bus from '../js/users_bus.js'
import localization from '../js/localization.js'
import overlay_core from '../js/overlay_core.js'
import Jdenticon from '../jdenticon-1.3.2'

const Register = React.createClass({

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

  getInitialState() {
    return {
      errorMessage: null,
      successMessage: null
    }
  },

  componentDidMount() {
    this.registerForm = document.querySelector('[data-role="registerForm"]');
    this.toggleWaiter();
  },

  componentWillUnmount() {
    this.registerForm = null;
  },

  handleClick() {
  },

  handleDialogError(){
    this.setState({errorMessage: null});
  }, 
  
  handleDialogRegisterUser(){
    browserHistory.push(this.props.location.search.slice(1));
    this.setState({successMessage: null});
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
          function(regErr, account) {
            self.toggleWaiter();
            if (regErr) {
              self.setState({errorMessage: regErr});
              return;
            }
            users_bus.setUserId(account.user_id);
            self.setState({successMessage: 96});
          }
        );
      } else {
        self.setState({errorMessage: 91});
      }
    } else {
      self.setState({errorMessage: 88});
    }
  },

  registerNewUser(options, callback) {
    this.get_JSON_res('/api/uuid', function(err, res) {
      if (err) {
        callback(err);
        return;
      }

      Jdenticon.jdenticon(res.uuid, function(avatar_data) {
        users_bus.storeNewUser(
          res.uuid,
          options.userName,
          options.userPassword,
          avatar_data,
          Date.now(),
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
    });
  },

  handleEvents(event) {
    this.descriptionContext.showDescription(event);
  },

  render() {
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
        <DialogSuccess show={this.state.successMessage} message={this.state.successMessage}
                       handleClick={this.handleDialogRegisterUser}/>
        <DialogError show={this.state.errorMessage} message={this.state.errorMessage}
                     handleClick={this.handleDialogError}/>
        <Description ref={(obj) => this.descriptionContext = obj} />
      </div>
    )
  }
});

extend_core.prototype.inherit(Register, id_core);
extend_core.prototype.inherit(Register, ajax_core);
extend_core.prototype.inherit(Register, overlay_core);

export default Register;