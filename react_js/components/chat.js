import React from 'react'
import { Router, Route, Link, History, Redirect } from 'react-router'

import extend_core from '../js/extend_core.js'
import switcher_core from '../js/switcher_core.js'
import dom_core from '../js/dom_core.js'
import event_bus from '../js/event_bus.js'
import users_bus from '../js/users_bus.js'

import Header from '../components/header'
import Filter from '../components/filter'
import ExtraToolbar from '../components/extra_toolbar'
import Body from '../components/body'
import Editor from '../components/editor'
import Pagination from '../components/pagination'

const Chat = React.createClass({
  chatsArray: [],

  getDefaultProps(){
    return {

    }
  },

  getInitialState(){
    return {
      padding: {
        bottom: 5
      },
      headerOptions: {
        show: true,
        mode: Header.prototype.MODE.TAB
      },
      filterOptions: {
        show: false
      },
      bodyOptions: {
        show: true,
        mode: Body.prototype.MODE.MESSAGES
      },
      editorOptions: {
        show: true,
        mode: Editor.prototype.MODE.MAIN_PANEL
      },
      formatOptions: {
        show: false,
        offScroll: false,
        sendEnter: false,
        iSender: true
      },
      messages_GoToOptions: {
        text: "messages_GoToOptions",
        show: false,
        rteChoicePage: true,
        mode_change: "rte"
      },
      messages_PaginationOptions: {
        text: "messages_PaginationOptions",
        show: false,
        mode_change: "rte",
        currentPage: null,
        firstPage: 1,
        lastPage: null,
        showEnablePagination: false,
        showChoicePerPage: false,
        perPageValue: 1,
        perPageValueNull: false,
        rtePerPage: true,
        disableBack: false,
        disableFirst: false,
        disableLast: false,
        disableForward: false
      },
      messages_FilterOptions: {
        text: "messages_FilterOptions",
        show: false
      },
      messages_ExtraToolbarOptions: {
        show: true
      },
      messages_ListOptions: {
        text: "mes",
        start: 0,
        last: null,
        previousStart: 0,
        previousFinal: 0,
        restore: false,
        innerHTML: "",
        data_download: true
      },

      logger_GoToOptions: {
        show: false,
        rteChoicePage: true,
        mode_change: "rte"
      },
      logger_PaginationOptions: {
        text: "logger_PaginationOptions",
        show: false,
        mode_change: "rte",
        currentPage: null,
        firstPage: 1,
        lastPage: null,
        showEnablePagination: false,
        showChoicePerPage: false,
        perPageValue: 25,
        perPageValueNull: false,
        rtePerPage: true,
        disableBack: false,
        disableFirst: false,
        disableLast: false,
        disableForward: false
      },
      logger_FilterOptions: {
        show: false
      },
      logger_ExtraToolbarOptions: {
        show: true
      },
      logger_ListOptions: {
        text: "log",
        start: 0,
        last: null,
        previousStart: 0,
        previousFinal: 0,
        restore: false,
        data_download: true
      },

      contactList_FilterOptions: {
        text: "contactList_FilterOptions",
        show: false
      },
      contactList_ExtraToolbarOptions: {
        show: true
      },
      contactList_PaginationOptions: {
        text: "contactList_PaginationOptions",
        show: false,
        mode_change: "rte",
        currentPage: null,
        firstPage: 1,
        lastPage: null,
        showEnablePagination: false,
        showChoicePerPage: false,
        perPageValue: 50,
        perPageValueNull: false,
        rtePerPage: true,
        disableBack: false,
        disableFirst: false,
        disableLast: false,
        disableForward: false
      },
      contactList_GoToOptions: {
        text: "contact",
        show: false,
        rteChoicePage: true,
        mode_change: "rte"
      },
      contactList_ListOptions: {
        text: "contact",
        start: 0,
        last: null,
        previousStart: 0,
        previousFinal: 0,
        restore: false,
        data_download: false
      },

      settings_ExtraToolbarOptions: {
        show: false
      },
      settings_FilterOptions: {
        show: false
      },
      settings_PaginationOptions: {
        show: false
      },
      settings_GoToOptions: {
        show: false
      },
      settings_ListOptions: {
        size_350: true,
        size_700: false,
        size_1050: false,
        size_custom: false,
        adjust_width: false,
        size_custom_value: '350px',
        size_current: '350px'
      }
    }
  },

  componentWillMount(){
    if(!this.props.data.restoreOption){
      this.setState({chat_id: this.props.data.chat_id});
    } else {
      this.setState(this.props.data.chatDescription);
    }
  },

  componentDidMount(){
    event_bus.on('changeMode', this.changeMode, this);
    event_bus.on('getChatDescription', this.getChatDescription, this);

  },

  componentWillUnmount: function() {
    event_bus.off('changeMode', this.changeMode, this);
    event_bus.off('getChatDescription', this.getChatDescription, this);
  },

  getChatDescription(chatId, _callback){
    if(this.state.chat_id === chatId){
      if(_callback){
        _callback(this.state);
      }
    }
  },

  handleClick(event){
    var element = this.getDataParameter(event.currentTarget, 'action');
    if (element) {
      switch (element.dataset.action) {
        case 'changeMode':
          this.changeMode(element);
          break;
        case 'changeRTE':
          var newState = Filter.prototype.changeRTE(element, this.state, this.state.bodyOptions.mode);
          this.setState(newState);
          break;
        case 'closeChat': case 'saveStatesChat': case 'saveAndCloseChat':
          event_bus.trigger('toCloseChat', element.dataset.action, this.state.chat_id, this.state);
          break;
      }
    }
  },

  handleChange(event){
    var element = this.getDataParameter(event.currentTarget, 'action');
    if (element) {
      switch (element.dataset.action) {
        case 'changePerPage':
          var newState = Filter.prototype.changePerPage(element, this.state, this.state.bodyOptions.mode);
          this.setState(newState);
          break;
      }
    }
  },

  changeMode: function(element) {
    this.switchModes([
      {
        chat_part: element.dataset.chat_part,
        newMode: element.dataset.mode_to,
        target: element
      }
    ]);
  },

  switchModes: function(_array) {
    var self = this, currentOptions;
    _array.forEach(function(_obj) {
        switch (_obj.chat_part) {
          case 'body':
            switch (_obj.newMode) {
              case Body.prototype.MODE.SETTINGS:
                self.state.bodyOptions.mode = Body.prototype.MODE.SETTINGS;
                self.state.editorOptions.show = false;
                self.setState({bodyOptions: self.state.bodyOptions, editorOptions: self.state.editorOptions});
                break;
              case 'CONTACT_LIST':
                self.state.bodyOptions.mode = Body.prototype.MODE.CONTACT_LIST;
                self.state.editorOptions.show = false;
                self.setState({bodyOptions: self.state.bodyOptions, editorOptions: self.state.editorOptions});
                break;
              case Body.prototype.MODE.MESSAGES:
                self.state.bodyOptions.mode = Body.prototype.MODE.MESSAGES;
                self.state.editorOptions.show = true;
                self.setState({bodyOptions: self.state.bodyOptions, editorOptions: self.state.editorOptions});
                break;
              case Body.prototype.MODE.LOGGER:
                self.state.bodyOptions.mode = Body.prototype.MODE.LOGGER;
                self.state.editorOptions.show = false;
                self.setState({bodyOptions: self.state.bodyOptions, editorOptions: self.state.editorOptions});
                break;
            }
            break;
          case 'editor':
            switch (_obj.newMode) {
              case Editor.prototype.MODE.MAIN_PANEL:
                self.state.editorOptions.show = true;
                self.setState({editorOptions: self.state.editorOptions});
                break;
              case Editor.prototype.MODE.FORMAT_PANEL:
                self.state.formatOptions.show = !self.state.formatOptions.show;
                self.setState({formatOptions: self.state.formatOptions});
                break;
            }
            break;
          case 'pagination':
            switch (_obj.newMode) {
              case Pagination.prototype.MODE.PAGINATION:
                if (_obj.target) {
                  currentOptions = self.optionsDefinition(self.state, self.state.bodyOptions.mode);
                  currentOptions.paginationOptions.show = _obj.target.checked;
                  currentOptions.paginationOptions.showEnablePagination = _obj.target.checked;
                  self.setState({[currentOptions.paginationOptions.text]: currentOptions.paginationOptions});
                }
                  break;
              case Pagination.prototype.MODE.GO_TO:
                break;
            }
              break;
          case 'filter':
            switch (_obj.newMode) {
              case Filter.prototype.MODE.MESSAGES_FILTER:
              case Filter.prototype.MODE.CONTACT_LIST_FILTER:
                currentOptions = self.optionsDefinition(self.state, self.state.bodyOptions.mode);
                currentOptions.filterOptions.show = !currentOptions.filterOptions.show;
                self.setState({[currentOptions.filterOptions.text]: currentOptions.filterOptions});
                break;
            }
            break;
        }
      }
    );
  },

  changeState(newState){
    this.setState(newState);
  },

  render() {
    let handleEvent = {
      changeState: this.changeState
    };
    let onEvent = {
      onClick: this.handleClick,
      onChange: this.handleChange
    };
    return (
      <section className="modal" data-chat_id={this.props.data.chat_id}>
        <div className="chat-splitter-item hidden" data-role="splitter_item" data-splitteritem="left">
        </div>
        <div className="chat-splitter-item right hidden" data-role="splitter_item" data-splitteritem="right">
        </div>
        <Header data={this.state} handleEvent={handleEvent} events={onEvent}/>
        <div data-role="extra_toolbar_container" className="flex-sp-around flex-shrink-0 p-t c-200">
          <ExtraToolbar mode={this.state.bodyOptions.mode} data={this.state} events={onEvent}/>
        </div>
        <div data-role="filter_container" className="flex wrap background-pink flex-shrink-0 c-200">
          <Filter mode={this.state.bodyOptions.mode} data={this.state} handleEvent={handleEvent} events={onEvent}/>
        </div>
        <div data-role="body_container" className="modal-body" data-param_content="message">
          <Body mode={this.state.bodyOptions.mode} data={this.state} options={this.props.data} events={onEvent}
                userInfo={null}/>
        </div>
        <footer className="flex-item-auto">
          <Editor mode={this.state.bodyOptions.mode} data={this.state} events={onEvent} handleEvent={handleEvent}/>
          <div data-role="go_to_container" className="c-100"></div>
          <div data-role="pagination_container" className="flex filter_container justContent c-200">
            <Pagination mode={this.state.bodyOptions.mode} data={this.state} events={onEvent}/>
          </div>
        </footer>
      </section>
    )
  }
});

extend_core.prototype.inherit(Chat, dom_core);
extend_core.prototype.inherit(Chat, switcher_core);

export default Chat;