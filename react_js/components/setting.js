import React from 'react'

import event_bus from '../js/event_bus.js'
import extend_core from '../js/extend_core.js'
import dom_core from '../js/dom_core.js'
import websocket from '../js/websocket.js'
import users_bus from '../js/users_bus.js'

import Location_Wrapper from './location_wrapper'

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
            "key": "chat_id"
          },
          "disabled": true
        },
        {
          "role": "locationWrapper",
          "classList": "w-100p p-t-b flex-sp-between",
          "location": "logger_massage"
        },
        {
          "element": "button",
          "text": 34,
          "location": "logger_massage",
          "data": {
            "throw": "true",
            "action": "changeMode",
            "chat_part": "body",
            "mode_to": "LOGGER"
          },
          "disable": true
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
            "action": "toggleChatUsersFriendship"
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

  toggleChatUsersFriendship: function(element) {
    let self = this;
    websocket.sendMessage({
      type: "chat_toggle_ready",
      chat_description: {
        chat_id: self.props.data.chat_id
      },
      from_user_id: users_bus.getUserId(),
      ready_state: element.checked
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
    if (element.checked) {
      this.props.data.settings_ListOptions.adjust_width = true;
    } else {
      this.props.data.settings_ListOptions.adjust_width = false;
    }
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
        "adjust_width": this.props.data.settings_ListOptions.adjust_width
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
    return <div >
      {this.renderItems(this.props.setting_config)}
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