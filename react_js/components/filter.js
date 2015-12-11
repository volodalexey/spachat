import React from 'react'
import Triple_Element from '../components/triple_element'
import Location_Wrapper from './location_wrapper'

const Filter = React.createClass({
  getDefaultProps() {
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
      ]
    }
  },

  defineConfig(mode){
    switch (mode){
      case 'CHATS':
        return this.props.chatsFilterConfig;
        break;
      case 'USERS':
        return this.props.usersFilterConfig;
        break;
    }
  },

  prepareConfig(config, mode){
    config = config.filter( function(obj){
      if(!obj.redraw_mode){
        return obj;
      } else {
        return obj.redraw_mode === mode;
      }
    });
    return config;
  },

  defineOptions(mode){
    var options = {};
    switch (mode){
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
      default:
        options = null;
        break;
    }
    return options;
  },

  changeRTE(element, state){
    switch (state.bodyMode){
      case "CHATS":
        if(element.checked){
          state.chats_PaginationOptions.mode_change = "rte";
          state.chats_PaginationOptions.rtePerPage = true;
          return {chats_PaginationOptions: state.chats_PaginationOptions };
        } else {
          state.chats_PaginationOptions.mode_change = "nrte";
          state.chats_PaginationOptions.rtePerPage = false;
          return {chats_PaginationOptions: state.chats_PaginationOptions };
        }
        break;
      case "USERS":
        if(element.checked){
          state.users_PaginationOptions.mode_change = "rte";
          state.users_PaginationOptions.rtePerPage = true;
          return {users_PaginationOptions: state.users_PaginationOptions };
        } else {
          state.users_PaginationOptions.mode_change = "nrte";
          state.users_PaginationOptions.rtePerPage = false;
          return {users_PaginationOptions: state.users_PaginationOptions };
        }
        break;
    }
  },

  showPerPage(element, state){
    switch (state.bodyMode){
      case "CHATS":
          state.chats_PaginationOptions.currentPage = null;
        if(state.chats_PaginationOptions.showEnablePagination) {
          //pagination.countQuantityPages
        }
          return {chats_PaginationOptions: state.chats_PaginationOptions };
        break;
      case "USERS":
        state.users_PaginationOptions.currentPage = null;
        if(state.users_PaginationOptions.showEnablePagination) {
          //pagination.countQuantityPages
        }
          return {users_PaginationOptions: state.users_PaginationOptions };
        break;
    }
  },

  render(){
    var options = this.defineOptions(this.props.mode);
    if(options && options.filterOptions.show) {
      var configs = this.defineConfig(this.props.mode);
      if(!configs){
        return <div></div>
      }

      configs = this.prepareConfig(configs, options.paginationOptions.mode_change);
      let mainContainer = {
        "element": "div",
        "class": "flex-item flex-wrap"
      };
      let data={
        "perPageValue": options.paginationOptions.perPageValue,
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

export default Filter;