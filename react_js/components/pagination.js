import React from 'react'

import extend_core from '../js/extend_core.js'
import switcher_core from '../js/switcher_core.js'
import indexeddb from '../js/indexeddb.js'
import chats_bus from '../js/chats_bus.js'
import users_bus from '../js/users_bus.js'
import messages from '../js/messages.js'

import Triple_Element from '../components/triple_element'
import Location_Wrapper from './location_wrapper'

const Pagination = React.createClass({
  MODE: {
    "PAGINATION": 'PAGINATION',
    "GO_TO": 'GO_TO'
  },

  getDefaultProps() {
    return {
      mainContainer: {
        "element": "div",
        "class": "flex "
      },
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

  getInitialState(){
    return {
      currentOptions: {}
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

  countQuantityPages(currentOptions, callback){
    let self = this;
    if (currentOptions.listOptions.data_download){
    } else {
      switch (this.props.data.bodyMode) {
        case "CHATS":
          users_bus.getMyInfo(null, function(error, options, userInfo) {
            if (!userInfo) return;
            chats_bus.getChats(error, options, userInfo.chat_ids, function(error, options, chatsInfo) {
              if (error) {
                console.error(error);
                return;
              }
              self.handleCountPagination(chatsInfo, currentOptions, callback);
            });
          });
          break;
        case "USERS":
          users_bus.getMyInfo(null, function(error, options, userInfo) {
            if (!userInfo) return;
            users_bus.getContactsInfo(error, userInfo.user_ids, function(_error, contactsInfo) {
              if (_error) {
                console.error(_error);
                return;
              }
              self.handleCountPagination(contactsInfo, currentOptions, callback);
            });
          });
          break;
      }
    }
  },

  handleCountPagination(data, currentOptions, callback){
    let self = this, quantityPages, quantityData;
    if (data) {
      quantityData = data.length;
    } else {
      quantityData = 0;
    }
    if (quantityData !== 0) {
      quantityPages = Math.ceil(quantityData / currentOptions.paginationOptions.perPageValue);
    } else {
      quantityPages = 1;
    }
    if (currentOptions.paginationOptions.currentPage === null) {
      currentOptions.listOptions.start = quantityPages * currentOptions.paginationOptions.perPageValue -
        currentOptions.paginationOptions.perPageValue;
      currentOptions.listOptions.final = quantityPages * currentOptions.paginationOptions.perPageValue;
      currentOptions.paginationOptions.currentPage = quantityPages;
    } else {
      currentOptions.listOptions.start = (currentOptions.paginationOptions.currentPage - 1) *
        currentOptions.paginationOptions.perPageValue;
      currentOptions.listOptions.final = (currentOptions.paginationOptions.currentPage - 1) *
        currentOptions.paginationOptions.perPageValue + currentOptions.paginationOptions.perPageValue;
    }
    currentOptions.paginationOptions.lastPage = quantityPages;
    if (callback) {
      callback(currentOptions);
    }
  },

  componentWillReceiveProps(){
    let currentOptions = this.optionsDefinition(this.props.data, this.props.mode), self = this;
    if(currentOptions.paginationOptions && currentOptions.paginationOptions.show) {
      this.countQuantityPages(currentOptions, function(_currentOptions){
        if (currentOptions.paginationOptions.currentPage === currentOptions.paginationOptions.firstPage) {
          currentOptions.paginationOptions.disableBack = true;
          currentOptions.paginationOptions.disableFirst = true;
        } else {
          currentOptions.paginationOptions.disableBack = false;
          currentOptions.paginationOptions.disableFirst = false;
        }
        if (currentOptions.paginationOptions.currentPage === currentOptions.paginationOptions.lastPage) {
          currentOptions.paginationOptions.disableForward = true;
          currentOptions.paginationOptions.disableLast = true;
        } else {
          currentOptions.paginationOptions.disableForward = false;
          currentOptions.paginationOptions.disableLast = false;
        }
        self.setState({currentOptions: _currentOptions});
      });
    }
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
          <Location_Wrapper events={this.props.events} data={data} configs={this.props.configs}
                            mainContainer={this.props.mainContainer}/>
        }
      </div>
    } else {
      return <div></div>
    }

  }
});

extend_core.prototype.inherit(Pagination, switcher_core);

export default Pagination;