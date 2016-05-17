import React from 'react'

import extend_core from '../js/extend_core.js'
import switcher_core from '../js/switcher_core.js'
import indexeddb from '../js/indexeddb.js'
import chats_bus from '../js/chats_bus.js'
import users_bus from '../js/users_bus.js'
import messages from '../js/messages.js'
import event_bus from '../js/event_bus.js'
import dom_core from '../js/dom_core.js'

import Triple_Element from '../components/triple_element'
import Location_Wrapper from './location_wrapper'

const Pagination = React.createClass({
  MODE: {
    "PAGINATION": 'PAGINATION',
    "GO_TO": 'GO_TO'
  },

  getDefaultProps: function() {
    return {
      mainContainer: {
        "element": "div",
        "config":{
          "class": "flex ",
        }
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

  getInitialState: function() {
    return {
      currentOptions: {}
    }
  },

  defineOptions: function(mode) {
    this.options = {};
    switch (mode) {
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

  handleClick: function(event) {
    let element = this.getDataParameter(event.currentTarget, 'action');
    if (element) {
      switch (element.dataset.action) {
        case 'switchPage':
          this.switchPage(element);
          break;
        case 'changeMode':
          let mode = this.props.data.bodyMode ? this.props.data.bodyMode : this.props.data.bodyOptions.mode,
            currentOptions = this.optionsDefinition(this.props.data, mode);
          currentOptions.goToOptions.show = !currentOptions.goToOptions.show;
          if (currentOptions.goToOptions.show && currentOptions.goToOptions.rteChoicePage){
            currentOptions.goToOptions.pageShow = currentOptions.paginationOptions.currentPage;
            currentOptions.goToOptions.page = currentOptions.paginationOptions.currentPage;
          }
          this.props.handleEvent.changeState({[currentOptions.goToOptions.text]: currentOptions.goToOptions});
          break;
      }
    }
  },

  countPagination: function(currentOptions, state, mode, options, callback) {
    if(!currentOptions){
      currentOptions = this.optionsDefinition(state, mode);
    }
    this.countQuantityPages(currentOptions, mode, options, function(_currentOptions) {
      let po = _currentOptions.paginationOptions;
      if (po.currentPage === po.firstPage) {
        po.disableBack = true;
        po.disableFirst = true;
      } else {
        po.disableBack = false;
        po.disableFirst = false;
      }
      if (po.currentPage === po.lastPage) {
        po.disableForward = true;
        po.disableLast = true;
      } else {
        po.disableForward = false;
        po.disableLast = false;
      }
      if (callback) {
        callback({
          [po.text]: po,
          [_currentOptions.listOptions.text]: _currentOptions.listOptions
        });
      }
    });
  },

  countQuantityPages: function(currentOptions, mode, options, callback) {
    let self = this;
    if (currentOptions.listOptions.data_download) {
      messages.prototype.getAllMessages(options.chat_id, mode, function(err, messages) {
        self.handleCountPagination(messages, currentOptions, callback);
      });
    } else {
      switch (mode) {
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
        case "CONTACT_LIST":
          chats_bus.getChatContacts(options.chat_id, function(error, contactsInfo) {
            if (error) {
              console.error(error);
              return;
            }
            self.handleCountPagination(contactsInfo, currentOptions, callback);
          });
          break;
      }
    }
  },

  handleCountPagination: function(data, currentOptions, callback) {
    let quantityPages, quantityData,
      po = currentOptions.paginationOptions,
      lo = currentOptions.listOptions;
    if (!po || !lo) return;
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
    if (po.currentPage === null) {
      lo.start = quantityPages * po.perPageValue - po.perPageValue;
      lo.final = quantityPages * po.perPageValue;
      po.currentPage = quantityPages;
    } else {
      lo.start = (po.currentPage - 1) * po.perPageValue;
      lo.final = (po.currentPage - 1) * po.perPageValue + po.perPageValue;
    }
    po.lastPage = quantityPages;
    if (callback) {
      callback(currentOptions);
    }
  },

  switchPage: function(element) {
    let self = this,
      currentOptions = this.optionsDefinition(this.props.data, this.props.mode),
      po = currentOptions.paginationOptions,
      elementRole = element.dataset.role;
    if (elementRole === "first" || elementRole === "last") {
      po.currentPage = parseInt(element.dataset.value);
    }
    if (elementRole === "back") {
      po.currentPage = parseInt(po.currentPage) - 1;
    }
    if (elementRole === "forward") {
      po.currentPage = parseInt(po.currentPage) + 1;
    }
    this.countPagination(currentOptions, null, this.props.mode,
      {"chat_id": this.props.data.chat_id}, function(_newState) {
        self.props.handleEvent.changeState(_newState);
      });
  },

  changePage: function(element, currentOptions) {
    let value = parseInt(element.value, 10),
      gto = currentOptions.goToOptions,
      po = currentOptions.paginationOptions;
    gto.pageShow = element.value;
    if (!(value === 0 || Number.isNaN(value))) {
      if(value > po.lastPage){
        gto.page = po.lastPage;
      } else {
        if (value < po.firstPage){
          gto.page = po.firstPage;
        } else {
          gto.page = value;
        }
      }
      if (gto.rteChoicePage) {
        if(value > po.lastPage){
          po.currentPage = po.lastPage;
        } else {
          if (value < po.firstPage){
            po.currentPage = po.firstPage;
          } else {
            po.currentPage = value;
          }
        }
      }
    }
    return currentOptions;
  },

  render: function() {
    let onEvent = {
        onClick: this.handleClick
      },
      currentOptions = this.optionsDefinition(this.props.data, this.props.mode),
      po = currentOptions.paginationOptions;
    if (po && po.show) {
      let data = {
        firstPage: po.firstPage,
        currentPage: po.currentPage,
        lastPage: po.lastPage,
        disableBack: po.disableBack,
        disableFirst: po.disableFirst,
        disableLast: po.disableLast,
        disableForward: po.disableForward
      };
      return <div>
        {
          <Location_Wrapper events={onEvent} data={data} configs={this.props.configs}
                            mainContainer={this.props.mainContainer}/>
        }
      </div>;
    } else {
      return <div></div>;
    }

  }
});

extend_core.prototype.inherit(Pagination, switcher_core);
extend_core.prototype.inherit(Pagination, dom_core);

export default Pagination;