import React from 'react'

import event_bus from '../js/event_bus.js'

import html_message from '../js/html_message.js'
import messages from '../js/messages.js'
import extend_core from '../js/extend_core.js'
import switcher_core from '../js/switcher_core.js'

import Pagination from '../components/pagination'
import Body from '../components/body'



const Messages = React.createClass({

  getInitialState(){
    return {
      messages: []
    }
  },

  getMessages(){
    let self = this;
    messages.prototype.getAllMessages(this.props.data.chat_id, this.props.data.bodyOptions.mode, function(messages) {
      let currentOptions = self.optionsDefinition(self.props.data, self.props.data.bodyOptions.mode);
      if (currentOptions.paginationOptions.showEnablePagination) {
        messages = Body.prototype.limitationQuantityRecords(messages, self.props.data, self.props.data.bodyOptions.mode);
          //self.setState({messages: messages});
      } else {
        if(messages.length !== self.state.messages.length){
          self.setState({messages: messages});
        }
      }
    });
  },

  renderItems(){
    var self = this, items = [];
    this.state.messages.forEach(function(_message) {
      items.push(self.renderItem(_message));
    });
    return items;
  },

  renderItem(message){
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
            <img src="img\app\6.ico" width="35px" height="35px" className="border-radius-5 flex-item-auto"/>
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
            <img src="img\app\3.ico" width="35px" height="35px" className="border-radius-5 flex-item-auto"/>
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

  render(){
    this.getMessages();
    return <div>{this.renderItems(this.state.messages)}</div>
  }
});
extend_core.prototype.inherit(Messages, switcher_core);


export default Messages;