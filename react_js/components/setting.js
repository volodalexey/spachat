import React from 'react'

import event_bus from '../js/event_bus.js'
import extend_core from '../js/extend_core.js'
import dom_core from '../js/dom_core.js'

import Location_Wrapper from './location_wrapper'

const Settings = React.createClass({
  getDefaultProps(){
    return {
      settings_config:[
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
        },
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
        },
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
          "class": "hide",
          "name": "saveAsCustomWidth"
        },
        {
          "element": "input",
          "type": "checkbox",
          "class": "check-box-size hide",
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
          "class": "hide",
          "sort": 2,
          "data": {
            "role": "adjust_width_label"
          }
        }
      ]
    }
  },

  getInitialState(){
    return {

    }
  },

  handleClick(event){
    var element = this.getDataParameter(event.currentTarget, 'action');
    if (element) {
      switch (element.dataset.action) {
        case 'changeSendEnter':
          this.changeSendEnter(element);
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

  renderItems(){
    var items = [], data;
    let onEvent = {
      onClick: this.handleClick,
      onChange: this.handleChange
    };
    data = {
      "chat_id": this.props.data.chat_id,
      "sendEnter": this.props.data.formatOptions.sendEnter,
      "size_350": this.props.data.settings_ListOptions.size_350,
      "size_700": this.props.data.settings_ListOptions.size_700,
      "size_1050": this.props.data.settings_ListOptions.size_1050,
      "adjust_width": this.props.data.settings_ListOptions.adjust_width,
      "size_custom": this.props.data.settings_ListOptions.size_custom,
      "index": this.props.data.index
    };
    items.push(<Location_Wrapper key={1} events={this.props.events} configs={this.props.settings_config} data={data}
                                 events={onEvent}/>);
    return items;
  },

  render(){

    return <div>{this.renderItems()}</div>
  }
});

extend_core.prototype.inherit(Settings, dom_core);

export default Settings;