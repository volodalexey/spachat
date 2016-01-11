import React from 'react'

import extend_core from '../js/extend_core.js'
import switcher_core from '../js/switcher_core.js'

import Triple_Element from '../components/triple_element'
import Location_Wrapper from './location_wrapper'

const Pagination = React.createClass({
  MODE: {
    "PAGINATION": 'PAGINATION',
    "GO_TO": 'GO_TO'
  },

  getDefaultProps() {
    return {
      configs: [
        {
          "element": "button",
          "icon": "back_arrow",
          "text": "",
          "class": "",
          "data": {
            "role": "back",
            "action": "switchPage",
            "key_disable": "disableBack"
          },
          "name": ""
        },
        {
          "element": "button",
          "icon": "",
          "text": "",
          "class": "",
          "data": {
            "role": "first",
            "action": "switchPage",
            "key": "firstPage",
            "key_disable": "disableFirst"
          },
          "name": ""
        },
        {
          "element": "button",
          "icon": "",
          "text": "...",
          "class": "",
          "data": {
            "throw": "true",
            "role": "choice",
            "action": "changeMode",
            "mode_to": "GO_TO",
            "toggle": true,
            "chat_part": "pagination",
            "location": "left"
          },
          "name": ""
        },
        {
          "element": "label",
          "icon": "",
          "text": "",
          "class": "lblStyle",
          "data": {
            "role": "current",
            "key": "currentPage"
          },
          "name": "",
          "disable": false
        },
        {
          "element": "button",
          "icon": "",
          "text": "...",
          "class": "",
          "data": {
            "throw": "true",
            "role": "choice",
            "action": "changeMode",
            "mode_to": "GO_TO",
            "chat_part": "pagination",
            "location": "right",
            "toggle": true
          },
          "name": ""
        },
        {
          "element": "button",
          "icon": "",
          "text": "",
          "class": "",
          "data": {
            "role": "last",
            "action": "switchPage",
            "key": "lastPage",
            "key_disable": "disableLast"
          },
          "name": ""
        },
        {
          "element": "button",
          "icon": "forward_arrow",
          "text": "",
          "class": "",
          "data": {
            "role": "forward",
            "action": "switchPage",
            "key_disable": "disableForward"
          },
          "name": ""
        }
      ]
    }
  },

  defineOptions(mode){
    this.options = {};
    switch (mode){

      case 'CHATS':
        this.options['paginationOptions'] = this.props.data.chats_PaginationOptions;
        break;
      case 'USERS':
        this.options['paginationOptions'] = this.props.data.users_PaginationOptions;
        break;
      default:
        this.options = null;
        break;
    }
  },

  countQuantityPages(){
  },

  render(){
    var currentOptions = this.optionsDefinition(this.props.data, this.props.mode);
    if(currentOptions.paginationOptions && currentOptions.paginationOptions.show) {
      let data={
        firstPage: currentOptions.paginationOptions.firstPage,
        currentPage: currentOptions.paginationOptions.currentPage,
        lastPage: currentOptions.paginationOptions.lastPage,
        disableBack: currentOptions.paginationOptions.disableBack,
        disableFirst: currentOptions.paginationOptions.disableFirst,
        disableLast: currentOptions.paginationOptions.disableLast,
        disableForward: currentOptions.paginationOptions.disableForward
      };
      return <div>
        {
          <Location_Wrapper events={this.props.events} data={data} configs={this.props.configs}/>
        }
      </div>
    } else {
      return <div></div>
    }

  }
});

extend_core.prototype.inherit(Pagination, switcher_core);

export default Pagination;