import React from 'react'
import switcher_core from '../js/switcher_core.js'
import extend_core from '../js/extend_core.js'
import Localization from '../js/localization'
import utils from '../js/utils'
import users_bus from '../js/users_bus'

import Location_Wrapper from './location_wrapper'
import PanelUsers from './panel_users'
import PanelChats from './panel_chats'
import Message from './message'
import Setting from './setting'
import ContactList from './contact_list'
import Connections from './connections'
import UserAvatar from './user_avarat'

const json_package = require('../package.json'),
  render_table_obj = function(obj) {
    if (obj !== null && typeof obj === 'object') {
      let keys = Object.keys(obj);
      return <table className="info-table">
        <tbody>
        {keys.map((key) => {
          return (
            <tr key={key}>
              <td>{key}</td>
              <td>{render_table_obj(obj[key])}</td>
            </tr>
          )
        })}
        </tbody>
      </table>;
    } else if (obj === null) {
      return 'null';
    } else if (obj === true) {
      return 'true';
    } else if (obj === false) {
      return 'false';
    } else {
      return obj;
    }
  },
  Body = React.createClass({
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
    SETTINGS_GLOBAL: 'SETTINGS_GLOBAL',

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
          "classList": "w-100p flex",
          "location": "user_id"
        },
        {
          "element": "label",
          "icon": "",
          "text": 9,
          "class": "flex-shrink-0",
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
          "class": "flex-grow_1 flex-shrink-1",
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
          "element": "button",
          "icon": 'blogs_icon',
          "class": "button-convex",
          "location": "user_id",
          "data": {
            "action": "copyUserId",
            "description": 126
          }
        },

        {
          "role": "locationWrapper",
          "classList": "w-100p flex",
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
          "class": "flex-grow_1",
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
              "text": 132,
              "value": "en"
            },
            {
              "text": 133,
              "value": "ru"
            }
          ],
          "data": {
            "action": "changeLanguage",
            "role": "selectLanguage",
            "warn": true,
            "key": 'lang'
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
            "role": "chat_id_input",
            "key": "chatId"
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
            "role": "chat_message_input",
            "key": "messageRequest"
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
        }
      ],
      detail_view_config: [
        {
          "role": "locationWrapper",
          "classList": "w-100p flex-sp-around",
          "location": "navbar"
        },
        {
          "element": "button",
          "icon": "save_open_icon",
          "text": 10,
          "class": "button-convex",
          "location": "navbar",
          "data": {
            "throw": "true",
            "restore_chat_state": true,
            "action": "showChat",
            "mode": "DETAIL_VIEW",
            "description": 123
          },
          "disable": false
        },
        {
          "element": "button",
          "icon": "open_icon",
          "text": 58,
          "class": "button-convex",
          "location": "navbar",
          "data": {
            "throw": "true",
            "action": "showChat",
            "mode": "DETAIL_VIEW",
            "description": 122
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
            "role": "user_id_input",
            "key": 'userId'
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
            "role": "user_message_input",
            "key": "messageRequest"
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
      settings_config: [
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
      ],
      settings_global_config: [
        {
          "role": "locationWrapper",
          "classList": "w-100p",
          "location": "scrollEachChat"
        },
        {
          "element": "input",
          "type": "checkbox",
          "text": 108,
          "class": "check-box-size",
          "location": "scrollEachChat",
          "data": {
            "key": "scrollEachChat",
            "action": "scrollEachChat"
          }
        },
        {
          "role": "locationWrapper",
          "classList": "w-100p",
          "location": "notificationOfAccession"
        },
        {
          "element": "input",
          "type": "checkbox",
          "text": 130,
          "class": "check-box-size",
          "location": "notificationOfAccession",
          "data": {
            "key": "notificationOfAccession",
            "action": "notificationOfAccession"
          }
        },
        {
          "role": "locationWrapper",
          "classList": "w-100p",
          "location": "clientVersion"
        },
        {
          "element": "",
          "content": render_table_obj({name: json_package.name, version: json_package.version, description: json_package.description}),
          "location": "clientVersion",
          "disabled": true
        }
      ]
    }
  },

  defineConfigs(mode) {
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
      case this.MODE.SETTINGS_GLOBAL:
        return this.props.settings_global_config;
        break;

      case this.MODE.CONNECTIONS:
      case this.MODE.MESSAGES:
      case this.MODE.LOGGER:
      case this.MODE.SETTINGS:
      case this.MODE.CONTACT_LIST:
        return {};
        break;

      default:
        return null;
        break;
    }
  },

  defineComponents(mode, configs) {
    let items = [], data, self = this;
    switch (mode) {
      case this.MODE.USERS:
        let contactsInfo = this.props.data.contactsInfo;
        if (this.props.data.users_PaginationOptions.show) {
          contactsInfo = users_bus.filterUsersByTypeDisplay(contactsInfo, 
            this.props.data.users_FilterOptions.typeDisplayContacts);
          contactsInfo = this.limitationQuantityRecords(contactsInfo, this.props.data, this.props.mode);
        }
        return <PanelUsers data={contactsInfo} events={this.props.events}
                           type={this.props.data.typeDisplayContacts}/>;
        break;
      case this.MODE.JOIN_USER:
        data = {
          "readyForFriendRequest": this.props.data.joinUser_ListOptions.readyForRequest,
          "userId": this.props.data.joinUser_ListOptions.userId,
          "messageRequest":  this.props.data.joinUser_ListOptions.messageRequest,
          "userName": this.props.data.userInfo.userName
        };
        if (this.props.data.joinUser_ListOptions.messageRequest){
          data.messageRequest = utils.transformationData(data, this.props.data.joinUser_ListOptions.messageRequest);
        }
        items.push(<Location_Wrapper key={1} events={this.props.events} configs={configs} data={data}/>);
        return items;
        break;
      case this.MODE.CHATS:
        let chat_ids = this.props.data.chat_ids;
        if (this.props.data.chats_PaginationOptions.show) {
          chat_ids = this.limitationQuantityRecords(chat_ids, this.props.data, this.props.mode);
        }
        data = {
          "chat_ids": chat_ids,
          "openChatsInfoArray": this.props.data.openChatsInfoArray,
          "closingChatsInfoArray": this.props.data.closingChatsInfoArray,
          "openChats": this.props.data.openChats,
          "myId": this.props.userInfo.user_id,
          "myName": this.props.userInfo.userName
        };
        return <PanelChats events={this.props.events} data={data} configs={configs}/>;
        break;
      case this.MODE.JOIN_CHAT:
        data = {
          "chatId": this.props.data.joinChat_ListOptions.chatId,
          "messageRequest":  this.props.data.joinChat_ListOptions.messageRequest,
          "userName": this.props.data.userInfo.userName
        };
        if (this.props.data.joinChat_ListOptions.messageRequest){
          data.messageRequest = utils.transformationData(data, this.props.data.joinChat_ListOptions.messageRequest);
        }
        items.push(<Location_Wrapper key={1} events={this.props.events} configs={configs} data={data}/>);
        return items;
        break;
      case this.MODE.USER_INFO_SHOW:
        data = this.props.userInfo;
        data.lang = Localization.lang;
        items.push(<Location_Wrapper key={'info'} events={this.props.events} configs={configs} data={data}/>);
        items.push(<UserAvatar key={'avatar'} events={this.props.events} configs={configs} data={this.props.data} 
                               handleEvent={this.props.handleEvent}/>);
        return items;
        break;
      case this.MODE.USER_INFO_EDIT:
        items.push(<Location_Wrapper key={1} events={this.props.events} configs={configs} data={this.props.userInfo}
                                     mode={this.MODE.USER_INFO_SHOW}/>);
        return items;
        break;

      case this.MODE.MESSAGES:
        return <Message data={this.props.data} handleEvent={this.props.handleEvent} events={this.props.events}/>;
        break;
      case this.MODE.SETTINGS:
        return <Setting data={this.props.data} events={this.props.events} handleEvent={this.props.handleEvent}/>;
        break;
      case this.MODE.CONTACT_LIST:
        return <ContactList data={this.props.data} handleEvent={this.props.handleEvent} events={this.props.events}
        onLimitationQuantityRecords={this.limitationQuantityRecords}/>;
        break;
      case this.MODE.CONNECTIONS:
        return <Connections data={this.props.data} />;
        break;
      default:
        items.push(<Location_Wrapper key={1} events={this.props.events} configs={configs}
                                     data={this.props.data}/>);
        break;
    }
    return items;
  },



  limitationQuantityRecords(data, state, mode) {
    if (data && data.length) {
      let currentOptions = this.optionsDefinition(state, mode);
      if (currentOptions.listOptions.final > data.length || !currentOptions.listOptions.final) {
        currentOptions.listOptions.final = data.length;
      }
      data = data.slice(currentOptions.listOptions.start, currentOptions.listOptions.final);
    }
    return data;
  },

  render() {
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