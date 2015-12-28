import React from 'react'
import { render } from 'react-dom'
import { History } from 'react-router'


import Localization from '../js/localization.js'
import users_bus from '../js/users_bus.js'
import overlay_core from '../js/overlay_core.js'
import extend_core from '../js/extend_core.js'


import Panel from '../components/panel'
import Popup from '../components/popup'
import Chat from '../components/chat'
import Description from '../components/description'
import ChatResize from '../components/chat_resize'

const ChatApp = React.createClass({
  mixins: [ History ],

  getInitialState: function() {
    return {
      windowWidth: window.innerWidth,
      userInfo: {}
    };
  },

  getDefaultProps() {
    return {
        LEFT: 'left',
        RIGHT: 'right'
    }
  },

  handleResize: function(e) {
    this.setState({windowWidth: window.innerWidth});
  },

  componentDidMount(){

  },

  componentWillMount(){
    var self = this;
    users_bus.checkLoginState();
    var userId = users_bus.getUserId();
    if (!userId){
      this.history.pushState(null, 'login');
    } else {
      users_bus.getMyInfo(null, function(error, _options, userInfo){
        self.setState({userInfo: userInfo});
        self.toggleWaiter();
      });
    }
  },

  componentWillUnmount: function() {
    //window.removeEventListener('resize', this.handleResize);
  },

  render() {
    //this.toggleWaiter(true);

    return (
      <div>
        <Panel location={this.props.LEFT} userInfo={this.state.userInfo}/>
        <div data-role="main_container" className="w-100p h-100p p-abs">
          <div className="flex-outer-container p-fx">
            <Chat />
          </div>
        </div>
        <Panel location={this.props.RIGHT} userInfo={this.state.userInfo}/>
        <Popup />
        <Description />
        <ChatResize />
      </div>
    )
  }
});
extend_core.prototype.inherit(ChatApp, overlay_core);

export default ChatApp;