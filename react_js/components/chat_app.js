import React from 'react'
import { render } from 'react-dom'
import { History } from 'react-router'

import Localization from '../js/localization.js'
import users_bus from '../js/users_bus.js'
import overlay_core from '../js/overlay_core.js'
import extend_core from '../js/extend_core.js'
import event_bus from '../js/event_bus.js'

import Panel from '../components/panel'
import Popup from '../components/popup'
import Chat from '../components/chat'
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
    event_bus.on('changeStatePopup', this.handleChangePopup, this);
    event_bus.on('logout', this.logout, this);
    event_bus.on('setUserId', this.logout, this);
  },

  componentWillUnmount(){
    event_bus.off('changeStatePopup', this.handleChangePopup, this);
    event_bus.off('logout', this.logout, this);
    event_bus.off('setUserId', this.logout, this);
  },

  componentWillMount(){
    var self = this;
    users_bus.checkLoginState();
    var userId = users_bus.getUserId();
    if (!userId) {
      this.history.pushState(null, 'login');
    } else {
      users_bus.getMyInfo(null, function(error, _options, userInfo) {
        self.setState({userInfo: userInfo});
        self.toggleWaiter();
      });
    }
  },

  componentWillUnmount: function() {
    //window.removeEventListener('resize', this.handleResize);
  },

  handleChangePopup(options){
    var newState, self = this;
    newState = Popup.prototype.handleChangeState(this.state, options.show, options.type,
      options.message, options.onDataActionClick.bind(this));
    this.setState(newState);
  },

  logout(user_id){
    var self = this;
    if (!user_id) {
      var panelDescription = {};
      this.toggleWaiter(true);
      event_bus.trigger('getPanelDescription', function(description, location){
        panelDescription[location] = description;
      });
      this.savePanelStates(panelDescription, function(err) {
        self.toggleWaiter();
        self.history.pushState(null, 'login');
      })
    }
  },

  savePanelStates: function(panelDescription, callback) {
    var self = this;
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

        callback(null);
      });
    });
  },

  render() {
    if(this.state.userInfo.hasOwnProperty('user_id')){
      return (
        <div>
          <Panel location={this.props.LEFT} userInfo={this.state.userInfo}/>
          <div data-role="main_container" className="w-100p h-100p p-abs">
            <div className="flex-outer-container p-fx">
              <Chat />
            </div>
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