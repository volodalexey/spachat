import React from 'react'
import { History } from 'react-router'

import users_bus from '../js/users_bus.js'
import overlay_core from '../js/overlay_core.js'
import extend_core from '../js/extend_core.js'
import event_bus from '../js/event_bus.js'

import Panel from '../components/panel'
import Popup from '../components/popup'
import ChatsManager from '../components/chats_manager'
import Description from '../components/description'
import ChatResize from '../components/chat_resize'

const ChatApp = React.createClass({
  mixins: [History],

  getInitialState: function() {
    return {
      windowWidth: window.innerWidth,
      userInfo: {},
      popupOptions: {
        messagePopupShow: false,
        type: '',
        options: {},
        onDataActionClick: null
      }
    };
  },

  getDefaultProps: function() {
    return {
      LEFT: 'left',
      RIGHT: 'right'
    }
  },

  handleResize: function() {
    this.setState({windowWidth: window.innerWidth});
  },

  componentDidMount: function() {
    event_bus.on('changeStatePopup', this.handleChangePopup, this);
    event_bus.on('logout', this.logout, this);
    event_bus.on('setUserId', this.logout, this);
  },

  componentWillUnmount: function() {
    event_bus.off('changeStatePopup', this.handleChangePopup, this);
    event_bus.off('logout', this.logout, this);
    event_bus.off('setUserId', this.logout, this);
  },

  componentWillMount: function() {
    users_bus.checkLoginState();
    let self = this,
      userId = users_bus.getUserId();
    if (!userId) {
      this.history.pushState(null, 'login');
    } else {
      users_bus.getMyInfo(null, function(error, _options, userInfo) {
        self.setState({userInfo: userInfo});
        self.toggleWaiter();
      });
    }
  },

  handleChangePopup: function(options) {
    let newState;
    newState = Popup.prototype.handleChangeState(this.state, options.show, options.type,
      options.message, options.onDataActionClick.bind(this));
    this.setState(newState);
  },

  logout(user_id){
    let self = this;
    if (!user_id) {
      let panelDescription = {};
      this.toggleWaiter(true);
      event_bus.trigger('getPanelDescription', function(description, location) {
        panelDescription[location] = description;
      });
      this.savePanelStates(panelDescription, function() {
        self.toggleWaiter();
        self.history.pushState(null, 'login');
      })
    }
  },

  savePanelStates: function(panelDescription, callback) {
    let self = this;
    users_bus.getMyInfo(null, function(error, options, userInfo) {
      if (error) {
        callback(error);
        return;
      }

      self.extend(userInfo, panelDescription);
      users_bus.saveMyInfo(userInfo, function(err) {
        if (err) {
          callback(err);
          return;
        }

        callback();
      });
    });
  },

  render: function() {
    if (this.state.userInfo && this.state.userInfo.hasOwnProperty('user_id')) {
      return (
        <div>
          <Panel location={this.props.LEFT} userInfo={this.state.userInfo}/>
          <div data-role="main_container" className="w-100p h-100p p-abs">
            <ChatsManager />
          </div>
          <Panel location={this.props.RIGHT} userInfo={this.state.userInfo}/>
          <Popup show={this.state.popupOptions.messagePopupShow} options={this.state.popupOptions}/>
          <Description />
          <ChatResize />
        </div>
      )
    } else {
      return (
        <div>
          <Popup show={this.state.popupOptions.messagePopupShow} options={this.state.popupOptions}/>
        </div>
      )
    }
  }
});
extend_core.prototype.inherit(ChatApp, overlay_core);
extend_core.prototype.inherit(ChatApp, extend_core);

export default ChatApp;