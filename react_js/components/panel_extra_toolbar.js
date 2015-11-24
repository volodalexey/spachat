import React from 'react'

import Triple_Element from '../components/triple_element'

const PanelExtraToolbar = React.createClass({
  getDefaultProps() {
    return {
      panelUsersExtraToolbarConfig: [
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
      panelChatsExtraToolbarConfig: [
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
      ]
    }
  },

  defineMode(mode){
    switch (mode){
      case 'CHATS':
        return this.props.panelChatsExtraToolbarConfig;
        break;
      case 'USERS':
        return this.props.panelUsersExtraToolbarConfig;
        break;
    }
  },

  render(){
    var configs = this.defineMode(this.props.mode);
    if(!configs){
      return <div></div>
    }

    return <div>
      {
        configs.map(function(config, i) {
          return <Triple_Element key={i} config={config} />
        })
      }
    </div>
  }
});

export default PanelExtraToolbar;