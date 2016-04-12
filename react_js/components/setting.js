import React from 'react'
import ReactDOM from 'react-dom'

import event_bus from '../js/event_bus.js'
import extend_core from '../js/extend_core.js'
import dom_core from '../js/dom_core.js'
import websocket from '../js/websocket.js'
import users_bus from '../js/users_bus.js'

import Location_Wrapper from './location_wrapper'
import Popup from './popup'

const Settings = React.createClass({
  getDefaultProps: function() {
    return {
      size_container_config: [

        {
          "role": "locationWrapper",
          "classList": "flex-item flex-wrap flex-align-c flex-item-auto",
          "location": "size_container"
        },
        {
          "element": "label",
          "text": 74,
          "class": "",
          "location": "size_container",
          "data": {
            "role": ""
          }
        }
      ],
      size_config: [
        {
          "role": "locationWrapper",
          "classList": "flex-item flex-wrap flex-align-c flex-item-auto",
          "location": "size"
        },
        {
          "element": "input",
          "type": "radio",
          "text": 70,
          "class": "check-box-size",
          "location": "size",
          "name": "size",
          "default_size": true,
          "data": {
            "key": "small_size",
            "value": 350,
            "role": "sizeChatButton",
            "action": "changeChatSize"
          }
        },
        {
          "element": "input",
          "type": "radio",
          "text": 71,
          "class": "check-box-size",
          "location": "size",
          "name": "size",
          "data": {
            "key": "medium_size",
            "value": 700,
            "role": "sizeChatButton",
            "action": "changeChatSize"
          }
        },
        {
          "element": "input",
          "type": "radio",
          "text": 72,
          "class": "check-box-size",
          "location": "size",
          "name": "size",
          "data": {
            "key": "large_size",
            "value": 1050,
            "role": "sizeChatButton",
            "action": "changeChatSize"
          }
        },
        {
          "element": "input",
          "type": "radio",
          "text": 73,
          "class": "check-box-size",
          "location": "size",
          "name": "size",
          "data": {
            "key": "custom_size",
            "role": "sizeChatButton",
            "action": "changeChatSize"
          }
        },
        {
          "element": "button",
          "icon": "",
          "text": 75,
          "location": "size",
          "data": {
            "action": "saveAsCustomWidth",
            "role": "saveAsCustomWidth"
          },
          "class": "",
          "name": "saveAsCustomWidth"
        },
        {
          "element": "input",
          "type": "checkbox",
          "class": "check-box-size",
          "location": "size",
          "name": "size",
          "data": {
            "key": "adjust_width",
            "role": "adjust_width",
            "action": "changeAdjustWidth"
          }
        },
        {
          "element": "label",
          "text": 76,
          "location": "size",
          "class": "",
          "sort": 2,
          "data": {
            "role": "adjust_width_label"
          }
        }
      ],
      setting_config_creator: [
        {
          "role": "locationWrapper",
          "classList": "w-100p p-t-b flex-sp-between",
          "location": "chat_id_container"
        },
        {
          "element": "label",
          "icon": "",
          "text": 5,
          "class": "",
          "location": "chat_id_container"
        },
        {
          "element": "input",
          "type": "text",
          "location": "chat_id_container",
          "class": "flex-item-1-auto",
          "data": {
            "key": "chat_id",
            "role": "chat_id"
          },
          "disabled": true
        },
        {
          "role": "locationWrapper",
          "classList": "w-100p p-t-b flex-sp-between",
          "location": "chat_id_controls"
        },
        {
          "element": "button",
          "text": 107,
          "location": "chat_id_controls",
          "data": {
            "action": "copyChatId"
          },
          "disable": false
        },
        {
          "element": "button",
          "text": 111,
          "location": "chat_id_controls",
          "data": {
            "action": "inviteByUrl"
          },
          "disable": false
        },
        {
          "role": "locationWrapper",
          "classList": "flex-item flex-wrap flex-align-c flex-item-auto",
          "location": "chat_users_apply"
        },
        {
          "element": "input",
          "type": "checkbox",
          "text": 79,
          "class": "check-box-size",
          "location": "chat_users_apply",
          "data": {
            "action": "toggleChatUsersFriendship",
            "key": "toggleChatUsersFriendship"
          }
        },
        {
          "role": "locationWrapper",
          "classList": "flex-item flex-wrap flex-align-c flex-item-auto",
          "location": "send_enter"
        },
        {
          "element": "input",
          "type": "checkbox",
          "text": 35,
          "class": "check-box-size",
          "location": "send_enter",
          "data": {
            "key": "sendEnter",
            "role": "btnEdit",
            "action": "changeSendEnter",
            "name": ""
          }
        },
        {
          "role": "locationWrapper",
          "classList": "flex-item flex-wrap flex-align-c flex-item-auto",
          "location": "toggle_parts_chat"
        },
        {
          "element": "input",
          "type": "checkbox",
          "text": 109,
          "class": "check-box-size",
          "location": "toggle_parts_chat",
          "data": {
            "key": "headerFooterControl",
            "action": "toggleHeaderFooter"
          }
        }
      ],
      setting_config: [
        {
          "role": "locationWrapper",
          "classList": "w-100p p-t-b flex-sp-between",
          "location": "chat_id_container"
        },
        {
          "element": "label",
          "icon": "",
          "text": 5,
          "class": "",
          "location": "chat_id_container"
        },
        {
          "element": "input",
          "type": "text",
          "location": "chat_id_container",
          "class": "flex-item-1-auto",
          "data": {
            "key": "chat_id",
            "role": "chat_id"
          },
          "disabled": true
        },
        {
          "role": "locationWrapper",
          "classList": "w-100p p-t-b flex-sp-between",
          "location": "chat_id_controls"
        },
        {
          "element": "button",
          "text": 107,
          "location": "chat_id_controls",
          "data": {
            "action": "copyChatId"
          },
          "disable": false
        },
        {
          "role": "locationWrapper",
          "classList": "flex-item flex-wrap flex-align-c flex-item-auto",
          "location": "chat_users_apply"
        },
        {
          "element": "input",
          "type": "checkbox",
          "text": 79,
          "class": "check-box-size",
          "location": "chat_users_apply",
          "data": {
            "action": "toggleChatUsersFriendship",
            "key": "toggleChatUsersFriendship"
          }
        },
        {
          "role": "locationWrapper",
          "classList": "flex-item flex-wrap flex-align-c flex-item-auto",
          "location": "send_enter"
        },
        {
          "element": "input",
          "type": "checkbox",
          "text": 35,
          "class": "check-box-size",
          "location": "send_enter",
          "data": {
            "key": "sendEnter",
            "role": "btnEdit",
            "action": "changeSendEnter",
            "name": ""
          }
        },
        {
          "role": "locationWrapper",
          "classList": "flex-item flex-wrap flex-align-c flex-item-auto",
          "location": "toggle_parts_chat"
        },
        {
          "element": "input",
          "type": "checkbox",
          "text": 109,
          "class": "check-box-size",
          "location": "toggle_parts_chat",
          "data": {
            "key": "headerFooterControl",
            "action": "toggleHeaderFooter"
          }
        }
      ]
    }
  },

  componentWillMount: function() {
    this.props.data.settings_ListOptions.current_data_key = this.defineDefaultSizeConfig(
      this.props.size_config,
      this.props.data.settings_ListOptions.current_data_key).data.key;
    this.props.handleEvent.changeState({settings_ListOptions: this.props.data.settings_ListOptions});
  },

  componentDidMount(){
    this.body = ReactDOM.findDOMNode(this);
    this.chatId = this.body.querySelector('[data-role="chat_id"]');
  },

  handleClick: function(event) {
    let element = this.getDataParameter(event.currentTarget, 'action');
    if (element) {
      switch (element.dataset.action) {
        case 'changeSendEnter':
          this.changeSendEnter(element);
          break;
        case 'changeChatSize':
          this.changeChatSize(element);
          break;
        case 'saveAsCustomWidth':
          this.saveAsCustomWidth();
          break;
        case 'changeAdjustWidth':
          this.changeAdjustWidth(element);
          break;
        case 'toggleChatUsersFriendship':
          this.toggleChatUsersFriendship(element);
          break;
        case 'copyChatId':
          this.copyChatId();
          break;
        case 'toggleHeaderFooter':
          this.toggleHeaderFooter(element);
          break;
        case 'inviteByUrl':
          this.inviteByUrl(element);
          break;
      }
    }
  },

  handleChange: function() {
  },

  changeSendEnter: function(element) {
    if (!element) return;
    this.props.data.formatOptions.sendEnter = element.checked;
    this.props.handleEvent.changeState({formatOptions: this.props.data.formatOptions});
  },

  toggleHeaderFooter(element) {
    if (!element) return;
    this.props.data.headerFooterControl = element.checked;
    this.props.handleEvent.changeState({headerFooterControl: this.props.data.headerFooterControl});
  },

  copyChatId(){
    this.chatId.disabled = false;
    this.chatId.focus();
    this.chatId.select();
    try {
      let successful = document.execCommand('copy'),
        msg = successful ? 'successful' : 'unsuccessful';
      console.log('Copy chatId was ' + msg);
    } catch(err) {
      console.log('Oops, unable to copy');
    }
    this.chatId.disabled = true;
  },

  inviteByUrl(){
    let newState, self = this,
      url = window.location.protocol + "//" + window.location.host + "/chat?join_chat_id=" + this.props.data.chat_id;
    console.log(url);
    event_bus.trigger('changeStatePopup', {
      show: true,
      type: 'confirm',
      message: 112,
      onDataActionClick: function(action) {
        switch (action) {
          case 'confirmCancel':
            newState = Popup.prototype.handleClose(this.state);
            this.setState(newState);
            break;
          case 'confirmOk':
            if(!self.props.data.toggleChatUsersFriendship){
              self.toggleChatUsersFriendship(null, true);
            }
            newState = Popup.prototype.handleClose(this.state);
            this.setState(newState);
            break;
        }
      },
    data: {"url": url}
    });
  },

  toggleChatUsersFriendship: function(element, forceChecked) {
    let self = this;
    if (!element) {
      element = this.body.querySelector('[data-action="toggleChatUsersFriendship"]');
    }

    this.props.data.toggleChatUsersFriendship = forceChecked ? forceChecked : element.checked;
    this.props.handleEvent.changeState({toggleChatUsersFriendship: this.props.data.toggleChatUsersFriendship});
    websocket.sendMessage({
      type: "chat_toggle_ready",
      chat_description: {
        chat_id: self.props.data.chat_id
      },
      from_user_id: users_bus.getUserId(),
      ready_state: this.props.data.toggleChatUsersFriendship
    });
  },

  changeChatSize: function(element) {
    if (element.dataset.value) {
      this.props.data.settings_ListOptions.size_current = element.dataset.value + 'px';
    }
    if (element.dataset.key) {
      let current_size_config = this.defineDefaultSizeConfig(this.props.size_config, element.dataset.key);
      this.props.data.settings_ListOptions.current_data_key = current_size_config.data.key;
      if (current_size_config.data.key === 'custom_size') {
        this.props.data.settings_ListOptions.size_current = this.props.data.settings_ListOptions.size_custom_value;
      }
      this.props.handleEvent.changeState({settings_ListOptions: this.props.data.settings_ListOptions});
    }
  },

  saveAsCustomWidth: function() {
    this.props.data.settings_ListOptions.size_custom_value = this.props.data.settings_ListOptions.size_current;
    this.props.handleEvent.changeState({settings_ListOptions: this.props.data.settings_ListOptions});
  },

  changeAdjustWidth: function(element) {
    this.props.data.settings_ListOptions.adjust_width = element.checked;
    this.props.handleEvent.changeState({settings_ListOptions: this.props.data.settings_ListOptions});
  },

  defineDefaultSizeConfig: function(all_size_configs, current_data_key) {
    let current_size_config = null;
    if (current_data_key) {
      all_size_configs.every(function(size_config) {
        if (size_config.data && size_config.data.key === current_data_key) {
          current_size_config = size_config;
        }
        return !current_size_config;
      });
    }
    if (current_size_config === null) {
      all_size_configs.every(function(size_config) {
        if (size_config.default_size) {
          current_size_config = size_config;
        }
        return !current_size_config;
      });
    }
    return current_size_config;
  },

  getSizeData: function(all_size_configs, current_data_key) {
    let returnObj = {},
      current_size_config = this.defineDefaultSizeConfig(all_size_configs, current_data_key);
    all_size_configs.forEach(function(size_config) {
      if (!size_config.data) return;
      let key = size_config.data.key;
      if (key === "adjust_width") return;
      returnObj[key] = size_config === current_size_config;
    });
    return returnObj;
  },

  calcDisplay: function(_config) {
    if (!_config.data) return true;
    if (this.props.data.settings_ListOptions.current_data_key === "custom_size") {
      if (_config.data.role === 'adjust_width' || _config.data.role === 'adjust_width_label') {
        return true;
      }
      if (_config.data.role === 'saveAsCustomWidth') {
        return false;
      }
    } else {
      if (_config.data.role === 'adjust_width' || _config.data.role === 'adjust_width_label') {
        return false;
      }
      if (_config.data.role === 'saveAsCustomWidth') {
        return true;
      }
    }
  },

  renderItems: function(configs) {
    let items = [],
      data = {
        "chat_id": this.props.data.chat_id,
        "sendEnter": this.props.data.formatOptions.sendEnter,
        "index": this.props.data.index,
        "adjust_width": this.props.data.settings_ListOptions.adjust_width,
        "headerFooterControl": this.props.data.headerFooterControl,
        "toggleChatUsersFriendship": this.props.data.toggleChatUsersFriendship
      };
    let onEvent = {
      onClick: this.handleClick,
      onChange: this.handleChange
    };
    Object.assign(
      data,
      this.getSizeData(this.props.size_config, this.props.data.settings_ListOptions.current_data_key)
    );

    items.push(<Location_Wrapper key={1} events={this.props.events} configs={configs} data={data}
                                 events={onEvent} calcDisplay={this.calcDisplay}/>);
    return items;
  },

  render: function() {
    let config = this.props.data.createdByUserId === users_bus.getUserId() ? this.props.setting_config_creator :
      this.props.setting_config;
    return <div >
      {this.renderItems(config)}
      <div className="textbox">
        <div className="title c-100">
          {this.renderItems(this.props.size_container_config)}
        </div>
        {this.renderItems(this.props.size_config)}
      </div>
    </div>
  }
});

extend_core.prototype.inherit(Settings, dom_core);

export default Settings;