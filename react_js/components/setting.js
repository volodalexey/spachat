import React from 'react'

import event_bus from '../js/event_bus.js'
import extend_core from '../js/extend_core.js'
import dom_core from '../js/dom_core.js'

import Location_Wrapper from './location_wrapper'

const Settings = React.createClass({
  getDefaultProps(){
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
          "data": {
            "key": "size_350",
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
            "key": "size_700",
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
            "key": "size_1050",
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
            "key": "size_custom",
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

  getInitialState(){
    return {}
  },

  handleClick(event){
    var element = this.getDataParameter(event.currentTarget, 'action');
    if (element) {
      switch (element.dataset.action) {
        case 'changeSendEnter':
          this.changeSendEnter(element);
          break;
        case 'changeChatSize':
          this.changeChatSize(element);
          break;
      }
    }
  },

  handleChange(){
  },

  changeSendEnter: function(element) {
    if (!element) return;
    this.props.data.formatOptions.sendEnter = element.checked;
    this.props.handleEvent.changeState({formatOptions: this.props.data.formatOptions});
  },

  changeChatSize(element){
    let self = this;
    if (element.dataset.value){
      this.props.data.settings_ListOptions.size_current = element.dataset.value + 'px';
    }
    if (element.dataset.key) {

      if (this.props.data.settings_ListOptions[element.dataset.key] === element.dataset.key) {
        this.props.data.settings_ListOptions[element.dataset.key] = true;
      }
      this.props.data.settings_ListOptions.size.forEach(function(size_obj) {
        let keys = Object.keys(size_obj), key = keys[0];
        if (key === element.dataset.key){
          size_obj[key] = true;
          if (key === 'size_custom'){
            self.props.data.settings_ListOptions.size_current = self.props.data.settings_ListOptions.size_custom_value;
          }
        } else {
          size_obj[key] = false;
        }
      });
    }
      this.props.handleEvent.changeState({settings_ListOptions: this.props.data.settings_ListOptions});
  },

  renderItems(configs){
    let items = [], self = this;
    let data = {
      "chat_id": this.props.data.chat_id,
      "sendEnter": this.props.data.formatOptions.sendEnter,
      "size_custom": this.props.data.settings_ListOptions.size_custom,
      "index": this.props.data.index
    };
    let onEvent = {
      onClick: this.handleClick,
      onChange: this.handleChange
    };
    this.props.data.settings_ListOptions.size.forEach(function(size_obj) {
      Object.assign(data, size_obj);
    });
    //data = {
    //  "size_350": this.props.data.settings_ListOptions.size['size_350'],
    //  "size_700": this.props.data.settings_ListOptions.size['size_700'],
    //  "size_1050": this.props.data.settings_ListOptions.size['size_1050'],
    //  "adjust_width": this.props.data.settings_ListOptions.size['adjust_width']
    //};
    let calcDisplay = function(_config){
      if (!_config.data) return true;
      if (self.props.data.settings_ListOptions.size_custom){
        if (_config.data.role === 'adjust_width' || _config.data.role === 'adjust_width_label'){
          return false;
        }
        if (_config.data.role === 'saveAsCustomWidth'){
          return true;
        }
      } else {
        if (_config.data.role === 'adjust_width' || _config.data.role === 'adjust_width_label'){
          return true;
        }
        if (_config.data.role === 'saveAsCustomWidth'){
          return false;
        }
      }
    };
    items.push(<Location_Wrapper key={1} events={this.props.events} configs={configs} data={data}
                                      events={onEvent} calcDisplay = {calcDisplay}/>);
    return items;
  },

  render(){

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