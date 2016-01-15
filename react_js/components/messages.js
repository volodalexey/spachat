import React from 'react'
import html_message from '../js/html_message.js'
import messages from '../js/messages.js'

const Messages = React.createClass({

  getInitialState(){
    return {
      messages: []
    }
  },

  componentDidMount(){
    //this.getMessages();
  },

  getMessages(){
    var self = this;
    messages.prototype.getAllMessages(this.props.data.chat_id, this.props.data.bodyOptions.mode, function(messages) {
      self.setState({messages: messages});
      //var mes = messages;
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
            <div className="message-container">{message.innerHTML}</div>
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
            <div className="message-container">{message.innerHTML}</div>
            <div className="date-format">{timeCreated}</div>
            <div className="date-format">{timeReceived}</div>
          </div>
        </div>
      )
    }
  },

  render(){
    //if(!this.props.data.messages_ListOptions.currentPage){
    //  this.getMessages();
    //}
    /*{this.renderItems()}*/
    return <div></div>
  }
});




export default Messages;