import React from 'react'

import users_bus from '../js/users_bus.js'

import Triple_Element from '../components/triple_element'

const ExtraToolbar = React.createClass({
  getDefaultProps: function() {
    return {
      usersExtraToolbarConfig: [
        {
          "element": "button",
          "icon": "filter_users_icon",
          "text": 26,
          "class": "button-inset-square",
          "data": {
            "action": "changeMode",
            "description": 27,
            "role": "btn_Filter",
            "toggle": true,
            "chat_part": "filter",
            "mode_to": "USERS_FILTER"
          },
          "name": "",
          "disabled": false
        }
      ],
      chatsExtraToolbarConfig: [
        {
          "element": "button",
          "icon": "filter_chats_icon",
          "text": 26,
          "class": "button-inset-square",
          "data": {
            "action": "changeMode",
            "role": "btn_Filter",
            "toggle": true,
            "chat_part": "filter",
            "mode_to": "CHATS_FILTER"
          },
          "name": "",
          "disabled": false
        }
      ],
      messagesExtraToolbarConfig: [
        {
          "element": "button",
          "icon": "filter_messages_icon",
          "text": 26,
          "class": "button-inset-square",
          "data": {
            "action": "changeMode",
            "role": "btn_Filter",
            "toggle": true,
            "chat_part": "filter",
            "mode_to": "MESSAGES_FILTER"
          },
          "name": "",
          "disabled": false
        },
        {
          "element": "button",
          "icon": "",
          "text": 120,
          "class": "button-inset-square",
          "data": {
            "action": "synchronizeMessages",
            "role": "synchronizeMessages"
          },
          "disabled": false
        }
      ],
      contactListExtraToolbarConfig: [
        {
          "element": "button",
          "icon": "filter_users_icon",
          "text": 26,
          "class": "button-inset-square",
          "data": {
            "throw": "true",
            "action": "changeMode",
            "role": "btn_Filter",
            "toggle": true,
            "chat_part": "filter",
            "mode_to": "CONTACT_LIST_FILTER"
          },
          "name": "",
          "disabled": false
        }
      ],
      loggerExtraToolbarConfig: [
        {
          "element": "button",
          "icon": "filter_log_messages_icon",
          "text": 26,
          "class": "button-inset-square",
          "data": {
            "throw": "true",
            "action": "changeMode",
            "role": "btn_Filter",
            "toggle": true,
            "chat_part": "filter",
            "mode_to": "MESSAGES_FILTER"
          },
          "name": "",
          "disabled": false
        }
      ]
    }
  },

  defineConfig: function(mode) {
    switch (mode) {
      case 'CHATS':
        return this.props.chatsExtraToolbarConfig;
        break;
      case 'USERS':
        return this.props.usersExtraToolbarConfig;
        break;
      case 'MESSAGES':
        return this.props.messagesExtraToolbarConfig;
        break;
      case 'CONTACT_LIST':
        return this.props.contactListExtraToolbarConfig;
        break;
      case 'LOGGER':
        return this.props.loggerExtraToolbarConfig;
        break;
    }
  },

  defineOptions: function(mode) {
    switch (mode) {
      case 'CREATE_CHAT':
        return this.props.data.createChat_ExtraToolbarOptions;
        break;
      case 'CHATS':
        return this.props.data.chats_ExtraToolbarOptions;
        break;
      case 'USERS':
        return this.props.data.users_ExtraToolbarOptions;
        break;
      case 'MESSAGES':
        return this.props.data.messages_ExtraToolbarOptions;
        break;
      case 'CONTACT_LIST':
        return this.props.data.contactList_ExtraToolbarOptions;
        break;
      case 'LOGGER':
        return this.props.data.logger_ExtraToolbarOptions;
        break;
    }
  },

  calcDisplay(_config){
    if (!_config.data) return true;
    if(_config.data.role === 'synchronizeMessages'){
      let index = this.props.data.user_ids.indexOf(users_bus.getUserId());
      return (index !== -1 && this.props.data.user_ids.length > 1 ||
      index === -1 && this.props.data.user_ids.length > 0)
    }
  },

  render: function() {
    let options = this.defineOptions(this.props.mode);
    if (options && options.show) {
      var configs = this.defineConfig(this.props.mode);
      if (!configs) {
        return <div></div>
      }

      return <div>
        {
          configs.map(function(config, i) {
            return <Triple_Element key={i} events={this.props.events} config={config} calcDisplay={this.calcDisplay}/>
          }, this)
        }
      </div>
    } else {
      return <div></div>
    }

  }
});

export default ExtraToolbar;