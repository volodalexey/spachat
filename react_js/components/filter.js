import React from 'react'

import switcher_core from '../js/switcher_core'
import extend_core from '../js/extend_core'

import Location_Wrapper from './location_wrapper'

const Filter = React.createClass({
  MODE: {
    BLOGS_FILTER: 'BLOGS_FILTER',
    CHATS_FILTER: 'CHATS_FILTER',
    USERS_FILTER: 'USERS_FILTER',
    MESSAGES_FILTER: 'MESSAGES_FILTER',
    CONTACT_LIST_FILTER: 'CONTACT_LIST_FILTER',
    LOGGER_FILTER: 'LOGGER',
    CONNECTIONS_FILTER: 'CONNECTIONS_FILTER'
  },

  getDefaultProps: function() {
    return {
      usersFilterConfig: [
        {
          "role": "locationWrapper",
          "classList": "elements flex-align-c flex-item-auto",
          "location": "pagination"
        },
        {
          "element": "input",
          "type": "checkbox",
          "class": "check-box-size",
          "data": {
            "throw": "true",
            "role": "enablePagination",
            "action": "changeMode",
            "mode_to": "PAGINATION",
            "chat_part": "pagination",
            "key": "showEnablePagination"
          },
          "location": "pagination"
        },
        {
          "element": "label",
          "text": 28,
          "location": "pagination"
        },

        {
          "role": "locationWrapper",
          "classList": "elements flex-align-c flex-item-auto",
          "location": "per_page"
        },
        {
          "element": "input",
          "type": "checkbox",
          "class": "check-box-size",
          "data": {
            "throw": "true",
            "role": "rteShowPerPage",
            "action": "changeRTE",
            "key": "rtePerPage"
          },
          "location": "per_page",
          "redraw_mode": "rte"
        },
        {
          "element": "label",
          "text": 19,
          "htmlFor": "show_per_page",
          "location": "per_page",
          "redraw_mode": "rte"
        },
        {
          "element": "input",
          "type": "text",
          "class": "inputWidth",
          "data": {
            "role": "perPageValue",
            "action": "changePerPage",
            "key": "perPageValue"
          },
          "id": "show_per_page",
          "onkeypress": "if((event.keyCode < 48)||(event.keyCode > 57)) event.returnValue=false",
          "location": "per_page",
          "redraw_mode": "rte"
        },

        {
          "element": "label",
          "data": {
            "role": "icon_show_per_page"
          },
          "location": "per_page",
          "redraw_mode": "nrte"
        },
        {
          "element": "input",
          "type": "checkbox",
          "class": "check-box-size",
          "data": {
            "throw": "true",
            "role": "rteChoicePerPage",
            "action": "changeRTE",
            "key": "rtePerPage"
          },
          "location": "per_page",
          "redraw_mode": "nrte"
        },
        {
          "element": "button",
          "text": 19,
          "class": "button-inset-white",
          "data": {
            "role": "show_per_page",
            "action": "showPerPage"
          },
          "htmlFor": "show_per_page",
          "location": "per_page",
          "redraw_mode": "nrte"
        },
        {
          "element": "input",
          "type": "text",
          "class": "inputWidth",
          "data": {
            "role": "perPageValue",
            "action": "changePerPage",
            "key": "perPageValue"
          },
          "id": "show_per_page",
          "onkeypress": "if((event.keyCode < 48)||(event.keyCode > 57)) event.returnValue=false",
          "location": "per_page",
          "redraw_mode": "nrte"
        }
      ],
      chatsFilterConfig: [
        {
          "role": "locationWrapper",
          "classList": "elements flex-align-c flex-item-auto",
          "location": "pagination"
        },
        {
          "element": "input",
          "type": "checkbox",
          "class": "check-box-size",
          "data": {
            "throw": "true",
            "role": "enablePagination",
            "action": "changeMode",
            "mode_to": "PAGINATION",
            "chat_part": "pagination",
            "key": "showEnablePagination"
          },
          "location": "pagination"
        },
        {
          "element": "label",
          "text": 28,
          "location": "pagination"
        },

        {
          "role": "locationWrapper",
          "classList": "elements flex-align-c flex-item-auto",
          "location": "per_page"
        },
        {
          "element": "input",
          "type": "checkbox",
          "class": "check-box-size",
          "data": {
            "throw": "true",
            "role": "rteShowPerPage",
            "action": "changeRTE",
            "key": "rtePerPage"
          },
          "location": "per_page",
          "redraw_mode": "rte"
        },
        {
          "element": "label",
          "text": 19,
          "htmlFor": "show_per_page",
          "location": "per_page",
          "redraw_mode": "rte"
        },
        {
          "element": "input",
          "type": "text",
          "class": "inputWidth ooo",
          "data": {
            "role": "perPageValue",
            "action": "changePerPage",
            "key": "perPageValue"
          },
          "id": "show_per_page",
          "onKeyPress": "if((event.keyCode < 48)||(event.keyCode > 57)) event.returnValue=false",
          "location": "per_page",

          "redraw_mode": "rte"
        },

        {
          "element": "label",
          "data": {
            "role": "icon_show_per_page"
          },
          "location": "per_page",
          "redraw_mode": "nrte"
        },
        {
          "element": "input",
          "type": "checkbox",
          "class": "check-box-size",
          "data": {
            "throw": "true",
            "role": "rteChoicePerPage",
            "action": "changeRTE",
            "key": "rtePerPage"
          },
          "location": "per_page",
          "redraw_mode": "nrte"
        },
        {
          "element": "button",
          "text": 19,
          "class": "button-inset-white",
          "data": {
            "role": "show_per_page",
            "action": "showPerPage"
          },
          "htmlFor": "show_per_page",
          "location": "per_page",
          "redraw_mode": "nrte"
        },
        {
          "element": "input",
          "type": "text",
          "class": "inputWidth",
          "data": {
            "role": "perPageValue",
            "action": "changePerPage",
            "key": "perPageValue"
          },
          "id": "show_per_page",
          "onKeyPress": "if((event.keyCode < 48)||(event.keyCode > 57)) event.returnValue=false",
          "location": "per_page",
          "redraw_mode": "nrte"
        }
      ],
      messagesFilterConfig: [
        {
          "role": "locationWrapper",
          "classList": "flex-item flex-wrap elements",
          "location": "date_filter"
        },
        {
          "element": "label",
          "text": 44,
          "location": "date_filter",
          "sort": 2
        },
        {
          "element": "input",
          "class": "inputWidth",
          "location": "date_filter",
          "sort": 3
        },
        {
          "element": "button",
          "text": 18,
          "class": "button-inset-white",
          "location": "date_filter",
          "sort": 4
        },
        {
          "element": "label",
          "text": 45,
          "location": "date_filter",
          "sort": 2
        },
        {
          "element": "input",
          "class": "inputWidth",
          "location": "date_filter",
          "sort": 3
        },
        {
          "element": "button",
          "text": 18,
          "class": "button-inset-white",
          "location": "date_filter",
          "sort": 4
        },

        {
          "role": "locationWrapper",
          "classList": "flex-item flex-wrap flex-align-c flex-item-auto",
          "location": "pagination"
        },
        {
          "element": "input",
          "type": "checkbox",
          "text": "",
          "class": "check-box-size",
          "data": {
            "throw": "true",
            "role": "enablePagination",
            "action": "changeMode",
            "mode_to": "PAGINATION",
            "chat_part": "pagination",
            "key": "showEnablePagination"
          },
          "location": "pagination",
          "sort": 3
        },
        {
          "element": "label",
          "text": 28,
          "location": "pagination",
          "sort": 2
        },

        {
          "role": "locationWrapper",
          "classList": "flex-item flex-wrap flex-align-c flex-item-auto",
          "location": "per_page"
        },
        {
          "element": "input",
          "type": "checkbox",
          "class": "check-box-size",
          "data": {
            "throw": "true",
            "role": "rteShowPerPage",
            "action": "changeRTE",
            "key": "rtePerPage"
          },
          "location": "per_page",
          "sort": 4,
          "redraw_mode": "rte"
        },
        {
          "element": "label",
          "text": 19,
          "location": "per_page",
          "sort": 2,
          "redraw_mode": "rte"
        },
        {
          "element": "input",
          "type": "text",
          "class": "inputWidth",
          "data": {
            "role": "perPageValue",
            "action": "changePerPage",
            "key": "perPageValue"
          },
          "name": "",
          "onKeyPress": "if((event.keyCode < 48)||(event.keyCode > 57)) event.returnValue=false",
          "location": "per_page",
          "sort": 3,
          "redraw_mode": "rte"
        },

        {
          "element": "label",
          "data": {
            "role": "icon_show_per_page"
          },
          "location": "per_page",
          "sort": 1,
          "redraw_mode": "nrte"
        },
        {
          "element": "input",
          "type": "checkbox",
          "class": "check-box-size",
          "data": {
            "throw": "true",
            "role": "rteChoicePerPage",
            "action": "changeRTE",
            "key": "rtePerPage"
          },
          "location": "per_page",
          "sort": 4,
          "redraw_mode": "nrte"
        },
        {
          "element": "button",
          "text": 19,
          "class": "button-inset-white",
          "data": {
            "throw": "true",
            "role": "show_per_page",
            "action": "showPerPage"
          },
          "location": "per_page",
          "sort": 2,
          "redraw_mode": "nrte"
        },
        {
          "element": "input",
          "type": "text",
          "class": "inputWidth",
          "data": {
            "role": "perPageValue",
            "action": "changePerPage",
            "key": "perPageValue"
          },
          "onKeyPress": "if((event.keyCode < 48)||(event.keyCode > 57)) event.returnValue=false",
          "location": "per_page",
          "sort": 3,
          "redraw_mode": "nrte"
        }
      ]
    }
  },

  defineConfig: function(mode) {
    switch (mode) {
      case 'CHATS':
        return this.props.chatsFilterConfig;
        break;
      case 'USERS':
        return this.props.usersFilterConfig;
        break;
      case 'MESSAGES':
        return this.props.messagesFilterConfig;
        break;
      case 'CONTACT_LIST':
        return this.props.chatsFilterConfig;
        break;
    }
  },

  prepareConfig: function(config, mode) {
    config = config.filter(function(obj) {
      if (!obj.redraw_mode) {
        return obj;
      } else {
        return obj.redraw_mode === mode;
      }
    });
    return config;
  },

  defineOptions: function(mode) {
    let options = {};
    switch (mode) {
      case 'CREATE_CHAT':
        options['filterOptions'] = this.props.data.createChat_FilterOptions;
        options['paginationOptions'] = this.props.data.createChat_PaginationOptions;
        break;
      case 'CHATS':
        options['filterOptions'] = this.props.data.chats_FilterOptions;
        options['paginationOptions'] = this.props.data.chats_PaginationOptions;
        break;
      case 'USERS':
        options['filterOptions'] = this.props.data.users_FilterOptions;
        options['paginationOptions'] = this.props.data.users_PaginationOptions;
        break;
      case 'MESSAGES':
        options['filterOptions'] = this.props.data.messages_FilterOptions;
        options['paginationOptions'] = this.props.data.messages_PaginationOptions;
        break;
      case 'CONTACT_LIST':
        options['filterOptions'] = this.props.data.contactList_FilterOptions;
        options['paginationOptions'] = this.props.data.contactList_PaginationOptions;
        break;
      case 'LOGGER':
        options['filterOptions'] = this.props.data.logger_FilterOptions;
        options['paginationOptions'] = this.props.data.logger_PaginationOptions;
        break;
      default:
        options = null;
        break;
    }
    return options;
  },

  changeRTE: function(element, currentOptions) {
      let po = currentOptions.paginationOptions;
    if (element.checked) {
      po.mode_change = "rte";
      po.rtePerPage = true;
      po.currentPage = null;
    } else {
      po.mode_change = "nrte";
      po.rtePerPage = false;
    }
    return currentOptions;
  },

  changePerPage: function(element, currentOptions) {
    let value = parseInt(element.value, 10),
      po = currentOptions.paginationOptions;
    po.perPageValueShow = element.value;
    if (!(value === 0 || Number.isNaN(value))) {
      po.perPageValue = value;
      if (po.rtePerPage) {
        po.currentPage = null;
      }
    }

    return currentOptions;
  },

  render: function() {
    var options = this.defineOptions(this.props.mode);
    if (options && options.filterOptions.show) {
      var configs = this.defineConfig(this.props.mode);
      if (!configs) {
        return <div></div>
      }

      configs = this.prepareConfig(configs, options.paginationOptions.mode_change);
      let mainContainer = {
        "element": "div",
        "class": "flex-item flex-wrap"
      };
      let data = {
        "perPageValue": options.paginationOptions.perPageValueShow,
        "showEnablePagination": options.paginationOptions.showEnablePagination,
        "rtePerPage": options.paginationOptions.rtePerPage,
        "mode_change": options.paginationOptions.mode_change
      };
      return <div>
        {
          <Location_Wrapper events={this.props.events} data={data} mainContainer={mainContainer} configs={configs}/>
        }
      </div>
    } else {
      return <div></div>
    }

  }
});

extend_core.prototype.inherit(Filter, switcher_core);

export default Filter;