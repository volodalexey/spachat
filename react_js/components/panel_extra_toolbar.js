import React from 'react'

import Triple_Element from '../components/triple_element'

const PanelExtraToolbar = React.createClass({
  getDefaultProps() {
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
      ]
    }
  },

  defineConfig(mode){
    switch (mode){
      case 'CHATS':
        return this.props.chatsExtraToolbarConfig;
        break;
      case 'USERS':
        return this.props.usersExtraToolbarConfig;
        break;
    }
  },

  defineOptions(mode){
    switch (mode){
      case 'CREATE_CHAT':
        return this.props.data.createChat_ExtraToolbarOptions;
        break;
      case 'CHATS':
        return this.props.data.chats_ExtraToolbarOptions;
        break;
      case 'USERS':
        return this.props.data.users_ExtraToolbarOptions;
        break;
    }
  },

  render(){
    var options = this.defineOptions(this.props.mode);
    if(options && options.show) {
      var configs = this.defineConfig(this.props.mode);
      if(!configs){
        return <div></div>
      }

      return <div>
        {
          configs.map(function(config, i) {
            return <Triple_Element key={i} events={this.props.events} config={config} />
          }, this)
        }
      </div>
    } else {
      return <div></div>
    }

  }
});

export default PanelExtraToolbar;