import React from 'react'
import { Router, Route, Link, History, Redirect } from 'react-router'

import Header from '../components/header'

const Chat = React.createClass({
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
        show: true
        //,
        //mode: Body.prototype.MODE.MESSAGES
      },
      editorOptions: {
        show: true
        //,
        //mode: Editor.prototype.MODE.MAIN_PANEL
      },
      formatOptions: {
        show: false,
        offScroll: false,
        sendEnter: false,
        iSender: true
      },
      messages_GoToOptions: {
        text: "mes",
        show: false,
        rteChoicePage: true,
        mode_change: "rte"
      },
      messages_PaginationOptions: {
        text: "mes",
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
        text: "log",
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
        show: false
      },
      contactList_ExtraToolbarOptions: {
        show: true
      },
      contactList_PaginationOptions: {
        text: "contact",
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

  render() {
    return (
      <section className="modal" data-chat_id="<%= _in.chat.chat_id %>">
        <div className="chat-splitter-item hidden" data-role="splitter_item" data-splitteritem="left">
        </div>
        <div className="chat-splitter-item right hidden" data-role="splitter_item" data-splitteritem="right">
        </div>
        <Header data={this.state}/>
        <div data-role="extra_toolbar_container" className="flex-sp-around flex-shrink-0 p-t c-200">
          extra_toolbar_container
        </div>
        <div data-role="filter_container" className="flex wrap background-pink flex-shrink-0 c-200">filter_container
        </div>
        <div data-role="body_container" className="modal-body" param-content="message"></div>
        <footer className="flex-item-auto">
          <div data-role="editor_container" className="c-200"></div>
          <div data-role="go_to_container" className="c-100"></div>
          <div data-role="pagination_container" className="flex filter_container justContent c-200"></div>
        </footer>
      </section>
    )
  }
});

export default Chat;