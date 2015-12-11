import React from 'react'
import Triple_Element from '../components/triple_element'
import Location_Wrapper from './location_wrapper'

const Pagination = React.createClass({
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

  defineOptions(mode){
    this.options = {};
    switch (mode){
      case 'CREATE_CHAT':
        this.options['paginationOptions'] = this.props.data.createChat_PaginationOptions;
        break;
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
    //return this.options;
  },

  componentDidUpdate(){
    //if(this.options && this.options.paginationOptions.show) {
    //this.countQuantityPages();
    //}
  },

  countQuantityPages(){
    //this.options.paginationOptions.currentPage = '1';
    //this.options.paginationOptions.lastPage = '3';
  },

  render(){
    this.defineOptions(this.props.mode);
    if(this.options && this.options.paginationOptions.show) {
      //this.countQuantityPages();

      let data={
        firstPage: this.options.paginationOptions.firstPage,
        currentPage: this.options.paginationOptions.currentPage,
        lastPage: this.options.paginationOptions.lastPage,
        disableBack: this.options.paginationOptions.disableBack,
        disableFirst: this.options.paginationOptions.disableFirst,
        disableLast: this.options.paginationOptions.disableLast,
        disableForward: this.options.paginationOptions.disableForward
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

export default Pagination;