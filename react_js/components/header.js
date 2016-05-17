import React from 'react'

import Location_Wrapper from './location_wrapper'

const Header = React.createClass({
  MODE: {
    FILTER: 'FILTER',
    TAB: 'TAB'
  },

  MODE_DESCRIPTION: {
    TAB: 59
  },

  getDefaultProps: function(){
    return {
      mainContainer: {
        "element": "div",
        "config":{
          "data": {
            "role": 'tabs_container'
          }
        }
      },
      configs: [
        {
          "role": "locationWrapper",
          "classList": "flex-just-center",
          "location": "topPanel",
          "data": {
            "role": "topHeaderPanel"
          }
        },
        {
          "element": "button",
          "icon": "exit_icon",
          "text": null,
          "location": "topPanel",
          "data": {
            "throw": "true",
            "target": "event_bus",
            "action": "closeChat",
            "description": 21
          },
          "class": "button-margin-height min-width-4em",
          "name": "CloseChat"
        },
        {
          "element": "button",
          "icon": "save_not_exit_icon",
          "text": null,
          "location": "topPanel",
          "data": {
            "throw": "true",
            "target": "event_bus",
            "action": "saveStatesChat",
            "description": 78
          },
          "class": "button-margin-height min-width-4em",
          "name": "SaveCloseChat"
        },
        {
          "element": "button",
          "icon": "save_exit_icon",
          "text": null,
          "location": "topPanel",
          "data": {
            "throw": "true",
            "target": "event_bus",
            "action": "saveAndCloseChat",
            "description": 57
          },
          "class": "button-margin-height min-width-4em",
          "name": "SaveCloseChat"
        },
        {
          "role": "locationWrapper",
          "classList": "",
          "location": "description",
          "data": {
            "role": "header_description"
          }
        },
        {
          "element": "label",
          "text": "",
          "class": "",
          "location": "description",
          "data": {
            "role": "labelUserPassword"
          }
        },
        {
          "role": "locationWrapper",
          "classList": "flex",
          "location": "bottomPanel",
          "data": {
            "role": "btnHeaderPanel"
          }
        },
        {
          "element": "button",
          "icon": "messages_icon",
          "text": 61,
          "location": "bottomPanel",
          "data": {
            "throw": "true",
            "chat_part": "body",
            "mode_to": "MESSAGES",
            "action": "changeMode",
            "role": "btnHeader",
            "toggle_reset_header": false,
            "description": 62
          },
          "class": "flex-item-1-0p",
          "name": "Messages"
        },
        {
          "element": "button",
          "icon": "users_icon",
          "text": 24,
          "location": "bottomPanel",
          "data": {
            "throw": "true",
            "mode_to": "CONTACT_LIST",
            "chat_part": "body",
            "action": "changeMode",
            "role": "btnHeader",
            "toggle_reset_header": true,
            "description": 25
          },
          "class": "flex-item-1-0p",
          "name": "ContactList"
        },
        {
          "element": "button",
          "icon": "settings_chat_icon",
          "text": 22,
          "location": "bottomPanel",
          "data": {
            "throw": "true",
            "chat_part": "body",
            "mode_to": "SETTINGS",
            "action": "changeMode",
            "role": "btnHeader",
            "toggle_reset_header": true,
            "description": 23
          },
          "class": "flex-item-1-0p",
          "name": "Setting"
        }
      ],
      configs_raw_chat: [
        {
          "role": "locationWrapper",
          "classList": "flex-just-center",
          "location": "topPanel",
          "data": {
            "role": "topHeaderPanel"
          }
        },
        {
          "element": "button",
          "icon": "exit_icon",
          "text": null,
          "location": "topPanel",
          "data": {
            "throw": "true",
            "target": "event_bus",
            "action": "closeRawChat",
            "description": 21
          },
          "class": "button-margin-height min-width-4em",
          "name": "CloseChat"
        }
      ]
    }
  },

  defineOptions: function(chat_mode){
    if(chat_mode !== "ready") return;
    if (this.props.data.headerOptions.show) {
      let options = {}, newState = this.props.data;
      switch (this.props.data.headerOptions.mode) {
        case this.MODE.TAB:
          this.previousMode = this.MODE.TAB;
          options.description = this.MODE_DESCRIPTION[this.MODE.TAB];
          if(this.previousMode !== this.MODE.TAB){
            newState.headerOptions.mode = this.MODE.TAB;
            this.props.handleEvent.changeState({headerOptions: newState.headerOptions});
          }
          break;
      }
      return options;
    }
  },

  defineConfig(chat_mode){
    let config;
    switch (chat_mode){
      case "raw":
        return config = this.props.configs_raw_chat;
        break;
      case "ready":
        return config = this.props.configs;
        break;
    }
  },

  render: function() {
    let options = this.defineOptions(this.props.chat_mode),
      config = this.defineConfig(this.props.chat_mode);
    return (
      <header data-role="header_container" className="modal-header">
        <Location_Wrapper events={this.props.events} data={options} mainContainer={this.props.mainContainer}
                          configs={config} mode={this.props.data.bodyOptions.mode}/>
      </header>
    )
  }
});

export default Header;