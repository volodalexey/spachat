import React from 'react'

const ChatResize = React.createClass({
  render(){
    return (
      <div data-role="chat_resize_container" className="clear chat-resize-container">
        <div className="line" data-role="resize_line"></div>
      </div>
    )
  }
});

export default ChatResize;