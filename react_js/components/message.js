import React from 'react'

import html_message from '../js/html_message.js'
import messages from '../js/messages.js'
import extend_core from '../js/extend_core.js'
import switcher_core from '../js/switcher_core.js'

import Body from '../components/body'

const Messages = React.createClass({

  getInitialState: function() {
    return {
      messages: [],
      previousStart: 0,
      previousFinal: 0
    }
  },

  getMessages: function() {
    let self = this;
    messages.prototype.getAllMessages(this.props.data.chat_id, this.props.data.bodyOptions.mode, function(err, messages) {
      let currentOptions = self.optionsDefinition(self.props.data, self.props.data.bodyOptions.mode),
        po = currentOptions.paginationOptions,
        lo = currentOptions.listOptions;
      if (po.showEnablePagination) {
        messages = Body.prototype.limitationQuantityRecords(messages, self.props.data, self.props.data.bodyOptions.mode);
        if (lo.start !== self.state.previousStart || lo.final !== self.state.previousFinal) {
          self.setState({messages: messages, previousStart: lo.start, previousFinal: lo.final});
        }
      } else {
        if (messages && messages.length !== self.state.messages.length) {
          self.setState({messages: messages, previousStart: 0, previousFinal: 0});
        }
      }
    });
  },

  renderItems: function() {
    var self = this, items = [];
    this.state.messages.forEach(function(_message) {
      items.push(self.renderItem(_message));
    });
    return items;
  },

  renderItem: function(message) {
    if (message.createdDatetime) {
      var timeCreated = new Date(message.createdDatetime);
      timeCreated = timeCreated.toISOString()
    }
    if (html_message.prototype.amICreator(message)) {
      return (
        <div className="flex-sp-start margin-t-b" key={message.messageId}>
          <div className="message myMessage flex-item-1-auto flex-dir-col flex-sp-between">
            <div className="message-container" dangerouslySetInnerHTML={{__html: message.innerHTML}}></div>
            <div className="date-format">
              {timeCreated}
            </div>
          </div>
          <div className="width-40px flex-just-center flex-dir-col">
            <div className="user-info flex-item-1-auto c-01">{message.createdByUserId}</div>
          </div>
        </div>
      )
    } else {
      if (message.receivedDatetime) {
        var timeReceived = new Date(message.receivedDatetime);
        timeReceived = timeReceived.toISOString()
      }
      return (
        <div className="flex-sp-start margin-t-b" key={message.messageId}>
          <div className="width-40px flex-just-center flex-dir-col">
            <div className="user-info c-50">{message.createdByUserId}</div>
          </div>
          <div className="message flex-item-1-auto flex-dir-col flex-sp-between">
            <div className="message-container" dangerouslySetInnerHTML={{__html: message.innerHTML}}></div>
            <div className="date-format">{timeCreated}</div>
            <div className="date-format">{timeReceived}</div>
          </div>
        </div>
      )
    }
  },

  render: function() {
    this.getMessages();
    return <div>{this.renderItems(this.state.messages)}</div>
  }
});

extend_core.prototype.inherit(Messages, switcher_core);

export default Messages;