import React from 'react'
import { Router, Route, Link, History, Redirect } from 'react-router'

import Header from '../components/header'

const Chat = React.createClass({
  getDefaultProps(){

  },

  render() {
    return (
      <section className="modal" data-chat_id="<%= _in.chat.chat_id %>">
        <div className="chat-splitter-item hidden" data-role="splitter_item" data-splitteritem="left">
        </div>
        <div className="chat-splitter-item right hidden" data-role="splitter_item" data-splitteritem="right">
        </div>
        <Header />
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