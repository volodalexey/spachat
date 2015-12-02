import React from 'react'
import { Router, Route, Link, History, Redirect } from 'react-router'

import Location_Wrapper from './location_wrapper'

const MODE = {
  CREATE_CHAT: 'CREATE_CHAT',
  JOIN_CHAT: 'JOIN_CHAT',
  CHATS: 'CHATS',
  USERS: 'USERS',
  JOIN_USER: 'JOIN_USER',

  USER_INFO_EDIT: 'USER_INFO_EDIT',
  USER_INFO_SHOW: 'USER_INFO_SHOW',
  DETAIL_VIEW: 'DETAIL_VIEW',

  CONNECTIONS: 'CONNECTIONS',

  CREATE_BLOG: 'CREATE_BLOG',
  JOIN_BLOG: 'JOIN_BLOG',
  BLOGS: 'BLOGS',

  PAGINATION: "PAGINATION",
  GO_TO: "GO_TO",
  FILTER: 'FILTER'
};

const Body = React.createClass({
  getDefaultProps() {
    return {
      user_info_edit_config: [
        {
          "role": "locationWrapper",
          "classList": "w-100p p-t-b flex-sp-between",
          "location": "user_name"
        },
        {
          "element": "label",
          "icon": "",
          "text": 36,
          "class": "",
          "location": "user_name",
          "data": {
            "role": "user_name_label"
          },
          "htmlFor": "user_name",
          "name": "",
          "sort": 1,
          "disable": false,
          "mode": "USER_INFO_EDIT"
        },
        {
          "element": "input",
          "type": "text",
          "icon": "",
          "text": "",
          "class": "",
          "location": "user_name",
          "data": {
            "role": "userName",
            "input": true,
            "main": "user_name_input",
            "key": "userName"
          },
          "name": "",
          "id": "user_name",
          "disabled" : false,
          "sort": 2,
          "mode": "USER_INFO_EDIT"
        },
        {
          "role": "locationWrapper",
          "classList": "w-100p p-t-b flex-sp-between",
          "location": "old_password"
        },
        {
          "element": "label",
          "icon": "",
          "text": 39,
          "class": "",
          "location": "old_password",
          "data": {
            "role": "user_old_password_label"
          },
          "htmlFor": "user_old_password",
          "name": "",
          "sort": 3,
          "disable": false,
          "mode": "USER_INFO_EDIT"
        },
        {
          "element": "input",
          "type": "password",
          "icon": "",
          "text": "",
          "class": "",
          "location": "old_password",
          "data": {
            "role": "passwordOld",
            "input": true,
            "key": "passwordOld"
          },
          "name": "",
          "id": "user_old_password",
          "disabled" : false,
          "sort": 4,
          "mode": "USER_INFO_EDIT"
        },
        {
          "role": "locationWrapper",
          "classList": "w-100p p-t-b flex-sp-between",
          "location": "new_password"
        },
        {
          "element": "label",
          "icon": "",
          "text": 40,
          "class": "",
          "location": "new_password",
          "data": {
            "role": "user_new_password_label"
          },
          "htmlFor": "user_new_password",
          "name": "",
          "sort": 5,
          "disable": false,
          "mode": "USER_INFO_EDIT"
        },
        {
          "element": "input",
          "type": "password",
          "icon": "",
          "text": "",
          "class": "",
          "location": "new_password",
          "data": {
            "role": "passwordNew",
            "input": true,
            "key": "passwordNew"
          },
          "name": "",
          "id": "user_new_password",
          "disabled" : false,
          "sort": 6,
          "mode": "USER_INFO_EDIT"
        },
        {
          "role": "locationWrapper",
          "classList": "w-100p p-t-b flex-sp-between",
          "location": "confirm_password"
        },
        {
          "element": "label",
          "icon": "",
          "text": 41,
          "class": "",
          "location": "confirm_password",
          "data": {
            "role": "user_confirm_password_label"
          },
          "htmlFor": "user_confirm_password",
          "name": "",
          "sort": 7,
          "disable": false,
          "mode": "USER_INFO_EDIT"
        },
        {
          "element": "input",
          "type": "password",
          "icon": "",
          "text": "",
          "class": "",
          "location": "confirm_password",
          "data": {
            "role": "passwordConfirm",
            "input": true,
            "key": "passwordConfirm"
          },
          "name": "",
          "id": "user_confirm_password",
          "disabled" : false,
          "sort": 8,
          "mode": "USER_INFO_EDIT"
        },
        {
          "role": "locationWrapper",
          "classList": "w-100p p-t-b flex-sp-around c-200",
          "location": "navbar"
        },
        {
          "element": "button",
          "icon": "cancel_icon",
          "text": 42,
          "class": "button-convex",
          "location": "navbar",
          "data": {
            "role": "",
            "action": "cancelChangeUserInfo"
          },
          "name": "",
          "disable": false,
          "sort": 9,
          "mode": "USER_INFO_EDIT"
        },
        {
          "element": "button",
          "icon": "ok_icon",
          "text": 43,
          "class": "button-convex",
          "location": "navbar",
          "data": {
            "role": "",
            "action": "saveChangeUserInfo"
          },
          "name": "",
          "disable": false,
          "sort": 10,
          "mode": "USER_INFO_EDIT"
        }
      ],
      user_info_show_config: [
        {
          "role": "locationWrapper",
          "classList": "w-100p p-t-b flex-sp-between",
          "location": "user_id"
        },
        {
          "element": "label",
          "icon": "",
          "text": 9,
          "class": "",
          "location": "user_id",
          "data": {
            "role": "user_id_label"
          },
          "htmlFor": "user_id",
          "name": "",
          "sort": 1,
          "disable": false,
          "mode": "USER_INFO_SHOW"
        },
        {
          "element": "input",
          "type": "text",
          "icon": "",
          "text": "",
          "class": "",
          "location": "user_id",
          "data": {
            "role": "user_id",
            "key": "user_id"
          },
          "name": "",
          "id": "user_id",
          "disabled" : true,
          "sort": 2,
          "mode": "USER_INFO_SHOW"
        },

        {
          "role": "locationWrapper",
          "classList": "w-100p p-t-b flex-sp-between",
          "location": "user_name"
        },
        {
          "element": "label",
          "icon": "",
          "text": 36,
          "class": "",
          "location": "user_name",
          "data": {
            "role": "user_name_label"
          },
          "htmlFor": "user_name",
          "name": "",
          "sort": 3,
          "disable": false,
          "mode": "USER_INFO_SHOW"
        },
        {
          "element": "input",
          "type": "text",
          "icon": "",
          "text": "",
          "class": "",
          "location": "user_name",
          "data": {
            "key": "userName",
            "role": "userName"
          },
          "name": "",
          "id": "user_name",
          "disabled" : true,
          "sort": 4,
          "mode": "USER_INFO_SHOW"
        },

        {
          "role": "locationWrapper",
          "classList": "w-100p p-t-b flex-sp-around c-200",
          "location": "navbar"
        },
        {
          "element": "button",
          "icon": "change_user_info_icon",
          "text": 37,
          "class": "button-convex",
          "location": "navbar",
          "data": {
            "role": "",
            "action": "changeUserInfo"
          },
          "name": "",
          "disable": false,
          "sort": 5,
          "mode": "USER_INFO_SHOW"
        },
        {
          "element": "button",
          "icon": "exit_icon",
          "text": 38,
          "class": "button-convex",
          "location": "navbar",
          "data": {
            "role": "",
            "throw": "true",
            "action": "logout"
          },
          "name": "",
          "disable": false,
          "sort": 6,
          "mode": "USER_INFO_SHOW"
        },

        {
          "role": "locationWrapper",
          "classList": "w-100p p-t-b flex-sp-start",
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
            "role": "selectLanguage",
            "warn": true
          }
        }
      ],
      chats_info_config: [
        {
          "role": "locationWrapper",
          "classList": "w-100p p-t-b flex-sp-around",
          "location": "chatAuto"
        },
        {
          "element": "button",
          "text": 3,
          "class": "button-inset-square",
          "location": "chatAuto",
          "data": {
            "throw": "true",
            "action": "addNewChatAuto",
            "mode": "CREATE_CHAT"
          },
          "disable": false
        },

        {
          "role": "locationWrapper",
          "classList": "w-100p p-t-b flex-sp-around",
          "location": "chatManual"
        },
        {
          "element": "button",
          "text": 4,
          "class": "button-inset-square",
          "location": "chatManual",
          "data": {
            "throw": "true",
            "action": "addNewChatManual",
            "mode": "CREATE_CHAT"
          },
          "disable": false
        },

        {
          "role": "locationWrapper",
          "classList": "w-100p flex-sp-between",
          "location": "chat_id_input"
        },
        {
          "element": "label",
          "text": 5,
          "location": "chat_id_input",
          "htmlFor": "chat_id_input"
        },
        {
          "element": "input",
          "type": "text",
          "class": "flex-item-w50p",
          "location": "chat_id_input",
          "data": {
            "role": "chat_id_input"
          },
          "id": "chat_id_input"
        },

        {
          "role": "locationWrapper",
          "classList": "w-100p flex-sp-between",
          "location": "chat_message_input"
        },
        {
          "element": "label",
          "text": 77,
          "location": "chat_message_input",
          "htmlFor": "chat_message_input"
        },
        {
          "element": "input",
          "type": "text",
          "class": "flex-item-w50p",
          "location": "chat_message_input",
          "data": {
            "role": "chat_message_input"
          },
          "id": "chat_message_input"
        },

        {
          "role": "locationWrapper",
          "classList": "w-100p flex-sp-around",
          "location": "chat_id_btn"
        },
        {
          "element": "button",
          "text": 6,
          "class": "button-inset-square",
          "location": "chat_id_btn",
          "data": {
            "throw": "true",
            "action": "requestChatByChatId",
            "mode": "JOIN_CHAT"
          },
          "disable": false
        },

        {
          "role": "locationWrapper",
          "classList": "w-100p flex-sp-between",
          "location": "remote_offer_label"
        },
        {
          "element": "label",
          "text": 7,
          "location": "remote_offer_label",
          "data": {
            "role": "remote_offer_label",
            "mode": "JOIN_CHAT"
          },
          "disable": false
        },

        {
          "role": "locationWrapper",
          "classList": "w-100p flex-sp-between",
          "location": "remote_offer"
        },
        {
          "element": "textarea",
          "rows": "5",
          "class": "w-100p",
          "location": "remote_offer",
          "data": {
            "role": "remote_offer_textarea",
            "mode": "JOIN_CHAT"
          },
          "disabled": false
        },

        {
          "role": "locationWrapper",
          "classList": "w-100p flex-sp-around",
          "location": "remote_offer_btn"
        },
        {
          "element": "button",
          "text": 8,
          "class": "button-inset-square",
          "location": "remote_offer_btn",
          "data": {
            "throw": "true",
            "action": "joinChatByChatSdp",
            "mode": "JOIN_CHAT"
          },
          "disable": false
        },

        {
          "role": "locationWrapper",
          "classList": "w-100p flex-sp-between",
          "location": "chats"
        },
        {
          "element": "svg",
          "icon": "pointer_icon.svg",
          "location": "chats",
          "data": {
            "mode": "CHATS"
          }
        },
        {
          "element": "label",
          "type": "text",
          "location": "chats",
          "data": {
            "role": "my_chat_id_label",
            "key": "chat_id",
            "mode": "CHATS"
          },
          "disabled": false
        },

        {
          "role": "locationWrapper",
          "classList": "w-100p flex-sp-between",
          "location": "user_id"
        },
        {
          "element": "label",
          "type": "text",
          "text": 9,
          "location": "user_id",
          "data": {
            "role": "user_id_label",
            "mode": "DETAIL_VIEW"
          },
          "disabled": false
        },
        {
          "element": "label",
          "type": "text",
          "class": "flex-item-w50p",
          "location": "user_id",
          "data": {
            "role": "user_id",
            "key": "user_ids",
            "mode": "DETAIL_VIEW"
          },
          "disabled": false
        },

        {
          "role": "locationWrapper",
          "classList": "w-100p flex-sp-around",
          "location": "navbar"
        },
        {
          "element": "button",
          "icon": "open_icon",
          "text": 10,
          "class": "button-convex",
          "location": "navbar",
          "data": {
            "throw": "true",
            "action": "showChat",
            "mode": "DETAIL_VIEW"
          },
          "disable": false
        },
        {
          "element": "button",
          "icon": "save_open_icon",
          "text": 58,
          "class": "button-convex",
          "location": "navbar",
          "data": {
            "throw": "true",
            "restore_chat_state": true,
            "action": "showChat",
            "mode": "DETAIL_VIEW"
          },
          "disable": false
        },
        {
          "element": "button",
          "icon": "exit_icon",
          "text": 20,
          "location": "navbar",
          "data": {
            "role": "closeChat",
            "action": "closeChat",
            "mode": "DETAIL_VIEW"
          },
          "class": "button-convex",
          "name": "CloseChat"
        },
        {
          "element": "button",
          "icon": "save_not_exit_icon",
          "text": 43,
          "location": "navbar",
          "data": {
            "role": "saveStatesChat",
            "action": "closeChat",
            "description": 78,
            "mode": "DETAIL_VIEW"
          },
          "class": "button-convex",
          "name": "saveStatesChat"
        },
        {
          "element": "button",
          "icon": "save_exit_icon",
          "location": "navbar",
          "text": 56,
          "data": {
            "role": "saveAndCloseChat",
            "action": "closeChat",
            "mode": "DETAIL_VIEW",
            "description": 57
          },
          "class": "button-convex",
          "name": "SaveCloseChat"
        }
      ],
      connections_config: [
        {
          "element": "button",
          "icon": "exit_icon",
          "text": 38,
          "class": "button-convex",
          "data": {
            "role": "",
            "action": "logout",
            "throw": "true",
            "location": "navbar"
          },
          "name": "",
          "disable": false,
          "sort": 6,
          "mode": "USER_INFO_SHOW"
        }
      ],
      users_info_config: [
        {
          "role": "locationWrapper",
          "classList": "w-100p flex-sp-between",
          "location": "user_id"
        },
        {
          "element": "label",
          "icon": "",
          "text": 67,
          "class": "",
          "location": "user_id",
          "data": {
            "role": "user_id_label"
          },
          "htmlFor": "user_id",
          "name": "",
          "disable": false
        },
        {
          "element": "input",
          "type": "text",
          "icon": "",
          "text": "",
          "class": "flex-item-w50p",
          "location": "user_id",
          "data": {
            "role": "user_id_input"
          },
          "name": "",
          "id": "user_id",
          "disabled": false
        },
        {
          "role": "locationWrapper",
          "classList": "w-100p flex-sp-between",
          "location": "user_message"
        },
        {
          "element": "label",
          "icon": "",
          "text": 77,
          "class": "",
          "location": "user_message",
          "data": {
            "role": "user_message_label"
          },
          "htmlFor": "user_message",
          "name": ""
        },
        {
          "element": "input",
          "type": "text",
          "icon": "",
          "text": "",
          "class": "flex-item-w50p",
          "location": "user_message",
          "data": {
            "role": "user_message_input"
          },
          "name": "",
          "id": "user_message"
        },
        {
          "role": "locationWrapper",
          "classList": "w-100p flex-sp-around",
          "location": "user_id_btn"
        },
        {
          "element": "button",
          "icon": "",
          "text": 68,
          "class": "button-inset-square",
          "location": "user_id_btn",
          "data": {
            "throw": "true",
            "action": "requestFriendByUserId",
            "mode": "JOIN_USER"
          },
          "name": "",
          "disable": false
        },
        {
          "role": "locationWrapper",
          "classList": "w-100p",
          "location": "user_id_apply"
        },
        {
          "element": "input",
          "type": "checkbox",
          "text": 69,
          "class": "check-box-size",
          "location": "user_id_apply",
          "data": {
            "key": "readyForFriendRequest",
            "role": "btnEdit",
            "action": "readyForFriendRequest",
            "name": ""
          }
        }
      ]
    }
  },

  defineConfigs(mode){
    switch(mode){
      case MODE.CHATS: case MODE.CREATE_CHAT: case MODE.JOIN_CHAT:
        return this.props.chats_info_config;
        break;
      case MODE.DETAIL_VIEW:
        return this.props.chats_info_config;
        break;
      case MODE.USERS: case MODE.JOIN_USER:
        return this.props.users_info_config;
        break;
      case MODE.CREATE_BLOG: case MODE.JOIN_BLOG: case MODE.BLOGS:
        return null;
      break;

      case MODE.USER_INFO_SHOW:
        return this.props.user_info_show_config;
        break;
      case MODE.USER_INFO_EDIT:
        return this.props.user_info_edit_config;
        break;
      case MODE.CONNECTIONS:
        return this.props.connections_config;
        break;

      default:
        return null;
      break;
    }
  },

  render(){
    let configs = this.defineConfigs(this.props.mode);
    if(!configs){
      return <div></div>
    } else {
      return (
        <div>
          <Location_Wrapper configs={configs} />
        </div>
      )
    }
  }
});



export default Body;