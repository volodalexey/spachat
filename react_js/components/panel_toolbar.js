import React from 'react'

import Location_Wrapper from './location_wrapper'

import Triple_Element from '../components/triple_element'

const PanelToolbar = React.createClass({
  getDefaultProps() {
    return {
      panelLeftToolbarConfig: [
        {
          "role": "locationWrapper",
          "classList": "flex",
          "location": "users"
        },
        {
          "element": "button",
          "icon": "add_user_icon",
          "text": 66,
          "class": "flex-item-1-0p",
          "location": "users",
          "data": {
            "role": "btnToolbar",
            "action": "switchPanelMode",
            "mode_to": "JOIN_USER"
          },
          "disable": false
        },

        {
          "element": "button",
          "icon": "users_icon",
          "text": 32,
          "class": "flex-item-1-0p",
          "location": "users",
          "data": {
            "role": "btnToolbar",
            "action": "switchPanelMode",
            "mode_to": "USERS"
          },
          "disable": false
        },

        {
          "element": "button",
          "icon": "notepad_icon",
          "data": {
            "action": "togglePanel",
            "role": "togglePanelToolbar",
            "description": 46
          },
          "location": "users",
          "class": "flex-item-1-0p c-50 border-c300 min-height-2-6em "
        },

        {
          "role": "locationWrapper",
          "classList": "flex",
          "location": "blogs"
        },
        {
          "element": "button",
          "icon": "new_blog_icon",
          "text": 63,
          "class": "flex-item-1-0p",
          "location": "blogs",
          "data": {
            "role": "btnToolbar",
            "action": "switchPanelMode",
            "mode_to": "CREATE_BLOG"
          },
          "disable": false
        },
        {
          "element": "button",
          "icon": "add_blog_icon",
          "text": 64,
          "class": "flex-item-1-0p",
          "location": "blogs",
          "data": {
            "role": "btnToolbar",
            "action": "switchPanelMode",
            "mode_to": "JOIN_BLOG"
          },
          "disable": false
        },
        {
          "element": "button",
          "icon": "blogs_icon",
          "text": 65,
          "class": "flex-item-1-0p",
          "location": "blogs",
          "data": {
            "role": "btnToolbar",
            "action": "switchPanelMode",
            "mode_to": "BLOGS"
          },
          "disable": false
        },

        {
          "role": "locationWrapper",
          "classList": "flex",
          "location": "chats"
        },
        {
          "element": "button",
          "icon": "new_chat_icon",
          "text": 1,
          "class": "flex-item-1-0p",
          "location": "chats",
          "data": {
            "description": 2,
            "role": "btnToolbar",
            "action": "switchPanelMode",
            "mode_to": "CREATE_CHAT"
          },
          "disable": false
        },
        {
          "element": "button",
          "icon": "add_chat_icon",
          "text": 29,
          "class": "flex-item-1-0p",
          "location": "chats",
          "data": {
            "role": "btnToolbar",
            "action": "switchPanelMode",
            "mode_to": "JOIN_CHAT"
          },
          "disable": false
        },
        {
          "element": "button",
          "icon": "chats_icon",
          "text": 30,
          "class": "flex-item-1-0p",
          "location": "chats",
          "data": {
            "description": 31,
            "role": "btnToolbar",
            "action": "switchPanelMode",
            "mode_to": "CHATS"
          },
          "disable": false
        }
      ],
      panelRightToolbarConfig: [
        {
          "role": "locationWrapper",
          "classList": "flex",
          "location": "buttons"
        },
        {
          "element": "button",
          "icon": "folder_icon",
          "location": "buttons",
          "data": {
            "action": "togglePanel",
            "role": "togglePanelToolbar",
            "description": 47
          },
          "class": "flex-item-1-0p c-50 border-c300 min-height-2-6em "
        },
        {
          "element": "button",
          "icon": "user_icon",
          "text": 33,
          "class": "floatR flex-item-1-0p",
          "location": "buttons",
          "data": {
            "role": "btnToolbar",
            "action": "switchPanelMode",
            "mode_to": "USER_INFO_SHOW"
          },
          "disable": false
        },
        {
          "element": "button",
          "icon": "connections_icon",
          "text": 13,
          "class": "floatR flex-item-1-0p",
          "location": "buttons",
          "data": {
            "role": "btnToolbar",
            "action": "switchPanelMode",
            "mode_to": "CONNECTIONS"
          },
          "disable": false
        }
      ]
    }
  },

  defineConfig(location){
    switch (location) {
      case 'left':
        return this.props.panelLeftToolbarConfig;
        break;
      case 'right':
        return this.props.panelRightToolbarConfig;
        break;
    }
  },

  render(){
    var configs = this.defineConfig(this.props.location);
    if (!configs) {
      return <div></div>
    }

    return <Location_Wrapper events={this.props.events} configs={configs} hide={this.props.hide}/>;
  }
});

export default PanelToolbar;