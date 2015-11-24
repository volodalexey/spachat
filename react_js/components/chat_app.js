import React from 'react'
import { render } from 'react-dom'
import Localization from '../js/localization.js'

import Panel from '../components/panel'
import Popup from '../components/popup'
import Chat from '../components/chat'
import Description from '../components/description'
import ChatResize from '../components/chat_resize'

const ChatApp = React.createClass({
  getDefaultProps() {
    return {
        LEFT: 'left',
        RIGHT: 'right'
    }
  },

  render() {
    return (
      <div>
        <Panel location={this.props.LEFT} />
        <div data-role="main_container" className="w-100p h-100p p-abs">
          <div className="flex-outer-container p-fx">
            <Chat />
          </div>
        </div>
        <Panel location={this.props.RIGHT} />
        <Popup />
        <Decription />
        <ChatResize />
      </div>
    )
  }
});

export default ChatApp;