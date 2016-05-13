import React from 'react'
import { browserHistory } from 'react-router'
import users_bus from '../js/users_bus.js'
import overlay_core from '../js/overlay_core.js'
import extend_core from '../js/extend_core.js'
import event_bus from '../js/event_bus.js'
import Localization from '../js/localization.js'

import Panel from '../components/panel'
import Popup from '../components/popup'
import ChatsManager from '../components/chats_manager'
import Description from '../components/description'
import ChatResize from '../components/chat_resize'

const ChatApp = React.createClass({

  getInitialState: function() {
    return {
      windowWidth: window.innerWidth,
      userInfo: {},
      popupOptions: {
        messagePopupShow: false,
        type: '',
        options: {},
        onDataActionClick: null
      },
      scrollEachChat: true
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
    event_bus.on('changeScrollEachChat', this.changeScrollEachChat, this);
  },

  componentWillUnmount: function() {
    event_bus.off('changeStatePopup', this.handleChangePopup, this);
    event_bus.off('logout', this.logout, this);
    event_bus.off('setUserId', this.logout, this);
    event_bus.off('changeScrollEachChat', this.changeScrollEachChat, this);

  },

  componentWillMount: function() {
    let self = this,
      userId = users_bus.getUserId();
    if (!userId) {
      browserHistory.push('/login');
    } else {
      users_bus.getMyInfo(null, function(error, _options, userInfo) {
        self.setState({userInfo: userInfo, locationQuery: self.props.location.query});
        self.toggleWaiter();
      });
    }
  },

  changeLanguage(lang){
    Localization.changeLanguage(lang, this);
  },

  handleChangePopup: function(options) {
    let newState;
    newState = Popup.prototype.handleChangeState(this.state, options.show, options.type,
      options.message, options.onDataActionClick.bind(this), options.data);
    this.setState(newState);
  },

  changeScrollEachChat(element){
    this.setState({scrollEachChat: element.checked});
  },

  logout(user_id){
    let self = this;
    if (!user_id) {
      let panelDescription = {};
      this.toggleWaiter(true);
      event_bus.trigger('getPanelDescription', function(description, location) {
        panelDescription[location] = description;
      });
      this.savePanelStates(panelDescription, () => {
        self.toggleWaiter();
        browserHistory.push('/login');
      })
    }
  },

  savePanelStates: function(panelDescription, callback) {
    let self = this;
    users_bus.getMyInfo(null, function(error, options, userInfo) {
      if (error) return callback(error);
      
      panelDescription.left.joinUser_ListOptions.readyForRequest = false;
      self.extend(userInfo, panelDescription);
      users_bus.saveMyInfo(userInfo, function(err) {
        if (err) return callback(err);

        callback();
      });
    });
  },

  handleEvents: function(event) {
    this.descriptionContext.showDescription(event);

    if(event.type === 'mouseup' || event.type === 'touchend'){
      event_bus.trigger('onMouseUp', event);
    }
  },

  render: function() {
    if (this.state.userInfo && this.state.userInfo.hasOwnProperty('user_id')) {
      let handleEvent = {
        changeLanguage: this.changeLanguage
      };
      return (
        <div onMouseDown={this.handleEvents}
             onMouseMove={this.handleEvents}
             onMouseUp={this.handleEvents}
             onClick={this.handleEvents}
             onTouchEnd={this.handleEvents}
             onTouchMove={this.handleEvents}
             onTouchStart={this.handleEvents}>
          <Panel location={this.props.LEFT} locationQuery={this.state.locationQuery} userInfo={this.state.userInfo}/>
          <div data-role="main_container"
               className={this.state.scrollEachChat ? "w-100p h-100p p-abs" : "w-100p p-abs"}>
            <ChatsManager scrollEachChat={this.state.scrollEachChat}/>
          </div>
          <Panel location={this.props.RIGHT} userInfo={this.state.userInfo} data={this.state} handleEvent={handleEvent}/>
          <Popup show={this.state.popupOptions.messagePopupShow} options={this.state.popupOptions}/>
          <Description ref={(obj) => this.descriptionContext = obj} />
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