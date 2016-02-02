import React from 'react'
import { Router, Route, Link, History, Redirect } from 'react-router'

import users_bus from '../js/users_bus.js'
import chats_bus from '../js/chats_bus.js'
import switcher_core from '../js/switcher_core.js'
import extend_core from '../js/extend_core.js'

import Location_Wrapper from './location_wrapper'
import PanelUsers from './panel_users'
import PanelChats from './panel_chats'
import Messages from './message'
import Settings from './setting'

const Body = React.createClass({
  MODE: {
    SETTINGS: 'SETTINGS',
    MESSAGES: 'MESSAGES',
    CONTACT_LIST: 'CONTACT_LIST',
    LOGGER: 'LOGGER',

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
  },

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
          "disabled": false,
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
          "disabled": false,
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
          "disabled": false,
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
          "disabled": false,
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
          "disabled": true,
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
          "disabled": true,
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
      create_chat_config: [
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
        }
      ],
      join_chat_config: [
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
      ],
      detail_view_config: [
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
      chats_info_config: [
        {
          "element": "svg",
          "icon": "pointer_icon.svg",
          "data": {
            "mode": "CHATS"
          }
        },
        {
          "element": "label",
          "type": "text",
          "data": {
            "role": "my_chat_id_label",
            "key": "chat_id",
            "mode": "CHATS"
          },
          "disabled": false
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
      ],
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

  defineConfigs(mode){
    switch (mode) {
      case this.MODE.CHATS:
        return {
          chats_info_config: this.props.chats_info_config,
          detail_view_config: this.props.detail_view_config
        };
        break;
      case this.MODE.CREATE_CHAT:
        return this.props.create_chat_config;
        break;
      case this.MODE.JOIN_CHAT:
        return this.props.join_chat_config;
        break;
      case this.MODE.DETAIL_VIEW:
        return this.props.detail_view_config;
        break;
      case this.MODE.USERS:
      case this.MODE.JOIN_USER:
        return this.props.users_info_config;
        break;
      case this.MODE.CREATE_BLOG:
      case this.MODE.JOIN_BLOG:
      case this.MODE.BLOGS:
        return null;
        break;

      case this.MODE.USER_INFO_SHOW:
        return this.props.user_info_show_config;
        break;
      case this.MODE.USER_INFO_EDIT:
        return this.props.user_info_edit_config;
        break;
      case this.MODE.CONNECTIONS:
        return this.props.connections_config;
        break;

      case this.MODE.MESSAGES:
      case this.MODE.LOGGER:
      case this.MODE.SETTINGS:
        return {};
        break;

      default:
        return null;
        break;
    }
  },

  defineComponents(mode, configs){
    var items = [], data, self = this;
    switch (mode) {
      case this.MODE.USERS:
        data = [{
          userName: "Bacy",
          user_id: "fghnjmd-f-beb-erg84g5t4g4"
        },
          {
            userName: "Pety",
            user_id: "454857y75 5yt4n5nt45t-n4597"
          }];
        return <PanelUsers data={data}/>;
        break;
      case this.MODE.JOIN_USER:
        data = {"readyForFriendRequest": this.props.data.joinUser_ListOptions.readyForRequest};
        items.push(<Location_Wrapper key={1} events={this.props.events} configs={configs} data={data}/>);
        return items;
        break;
      case this.MODE.CHATS:
        let chat_ids = this.limitationQuantityRecords(this.props.data.chat_ids);
        data = {
          "chat_ids": chat_ids,
          "openChatsInfoArray": self.props.data.openChatsInfoArray,
          "closingChatsInfoArray": self.props.data.closingChatsInfoArray,
          "openChats": this.props.data.openChats
        };
        return <PanelChats events={self.props.events} data={data} configs={configs}/>;
        break;
      case this.MODE.USER_INFO_SHOW:
        data = this.props.userInfo;
        items.push(<Location_Wrapper key={1} events={this.props.events} configs={configs} data={data}/>);
        return items;
        break;
      case this.MODE.USER_INFO_EDIT:
        items.push(<Location_Wrapper key={1} events={this.props.events} configs={configs} data={this.props.userInfo}
                                     mode={this.MODE.USER_INFO_SHOW}/>);
        return items;
        break;

      case this.MODE.MESSAGES:
        return <Messages data={this.props.data} handleEvent={this.props.handleEvent}/>;
        break;
      case this.MODE.SETTINGS:
        return <Settings data={this.props.data} handleEvent={this.props.handleEvent}/>;
        break;
      default:
        items.push(<Location_Wrapper key={1} events={this.props.events} configs={configs}/>);
        break;
    }
    return items;
  },

  limitationQuantityRecords(data){
    if (data && data.length) {
      var currentOptions = this.optionsDefinition(this.props.data, this.props.mode);
      if (currentOptions.listOptions.final > data.length || !currentOptions.listOptions.final) {
        currentOptions.listOptions.final = data.length;
      }


      data = data.slice(currentOptions.listOptions.start, currentOptions.listOptions.final);
    }

    return data;
  },

  render(){
    let configs = this.defineConfigs(this.props.mode);
    if (!configs) {
      return <div></div>
    } else {
      return (
        <div>
          {this.defineComponents(this.props.mode, configs)}
        </div>
      )
    }
  }
});
extend_core.prototype.inherit(Body, switcher_core);

export default Body;