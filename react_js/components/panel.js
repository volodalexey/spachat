import React from 'react'
import { render } from 'react-dom'
import Localization from '../js/localization.js'

import Location_Wrapper from './location_wrapper'
import Triple_Element from '../components/triple_element'
import Popup from '../components/popup'
import Decription from '../components/description'
import ChatResize from '../components/chat_resize'
import PanelExtraToolbar from '../components/panel_extra_toolbar'

const Panel = React.createClass({
  getDefaultProps() {
    return {
      mainContainer: {
        "element": "div",
        "class": "flex-inner-container"
      },
      MODE: {
        LEFT: 'LEFT',
        RIGHT: "RIGHT"
      },
      leftBtnConfig: {
        "element": "button",
        "icon": "notepad_icon",
        "data": {
          "action": "togglePanel",
          "role": "mainButtonLeftPanel",
          "description": 46
        },
        "class": "panel-button left-panel-button"
      },
      rightBtnConfig: {
        "element": "button",
        "icon": "folder_icon",
        "data": {
          "action": "togglePanel",
          "role": "mainButtonRightPanel",
          "description": 47
        },
        "class": "panel-button right-panel-button"
      },
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
          "class": "flex-item-1-0p c-50 border-c300 min-height-2-6em hide"
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
          "class": "flex-item-1-0p c-50 border-c300 min-height-2-6em hide"
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

  render() {
    let location = this.props.location;

    var left_activeTab = "CHATS";
    var right_activeTab = "";
    let mode_toolbar = location === 'left' ? left_activeTab : right_activeTab;

    let btnConfig = (location === 'left') ? this.props.leftBtnConfig : this.props.rightBtnConfig;
    let panel_toolbar_class = (location === 'left') ? 'w-100p flex-dir-col flex-item-auto c-200' : 'w-100p flex-dir-col c-200';
    return (
      <section data-role={location + '_panel_outer_container'} className={location + '-panel p-fx panel animate c-100'}>
        <div className="p-rel h-100p flex-dir-col">
          <Triple_Element config={btnConfig}/>
          <div data-role={location + '_panel_inner_container'}
               className="min-width-350 flex-item-1-auto clear flex-dir-col h-100p">
            <header id={location} data-role={location + '_panel_toolbar'} className={panel_toolbar_class}></header>
            <div data-role={location + '_extra_toolbar_container'}
                 className="flex-sp-around flex-item-auto c-200">
              <PanelExtraToolbar mode={mode_toolbar}/>
            </div>
            <div data-role={location + '_filter_container'} className="flex wrap flex-item-auto c-200">
            </div>
            <div data-role="panel_body" className="overflow-a flex-item-1-auto"></div>
            <footer className="flex-item-auto">
              <div data-role={location + '_go_to_container'} className="c-200"></div>
              <div data-role={location + '_pagination_containe'}
                   className="flex filter_container justContent c-200"></div>
            </footer>
          </div>
        </div>
      </section>
    )
  }
});

export default Panel;