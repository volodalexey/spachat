import React from 'react'
import {browserHistory} from 'react-router'
import users_bus from '../js/users_bus.js'
import overlay_core from '../js/overlay_core.js'
import extend_core from '../js/extend_core.js'
import event_bus from '../js/event_bus.js'
import localization from '../js/localization.js'
import dom_core from '../js/dom_core.js'
import websocket from '../js/websocket.js'

import Panel from '../components/panel'
import ChatsManager from '../components/chats_manager'
import Description from '../components/description'
import ChatResize from '../components/chat_resize'
import DialogError from '../components/dialogError'

const ChatApp = React.createClass({

  getInitialState() {
    return {
      windowWidth: window.innerWidth,
      userInfo: {},
      errorMessageAbortConnection: null,
      scrollEachChat: true
    };
  },

  getDefaultProps() {
    return {
      LEFT: 'left',
      RIGHT: 'right'
    }
  },

  handleResize() {
    this.setState({windowWidth: window.innerWidth});
  },

  componentDidMount() {
    event_bus.on('websocket_abortConnection', this.abortConnection, this);
    event_bus.on('logout', this.logout, this);
    event_bus.on('setUserId', this.logout, this);
    event_bus.on('changeScrollEachChat', this.changeScrollEachChat, this);
  },

  componentWillUnmount() {
    event_bus.off('websocket_abortConnection', this.abortConnection, this);
    event_bus.off('logout', this.logout, this);
    event_bus.off('setUserId', this.logout, this);
    event_bus.off('changeScrollEachChat', this.changeScrollEachChat, this);

  },

  componentWillMount() {
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
    localization.changeLanguage(lang, this);
  },

  abortConnection(message){
    this.setState({errorMessageAbortConnection: message});
  },

  handleDialogAbortConnection(event){
    let element = this.getDataParameter(event.target, 'action');
    if (element) {
      switch (element.dataset.action) {
        case 'confirmCancel':
          this.setState({errorMessageAbortConnection: null});
          break;
        case 'confirmOk':
          this.setState({errorMessageAbortConnection: null});
          websocket.createAndListen();
          break;
      }
    }
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

  savePanelStates(panelDescription, callback) {
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

  handleEvents(event) {
    this.descriptionContext.showDescription(event);

    if (event.type === 'mouseup' || event.type === 'touchend') {
      event_bus.trigger('onMouseUp', event);
    }
  },

  render() {
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
          <Panel location={this.props.RIGHT} userInfo={this.state.userInfo} data={this.state}
                 handleEvent={handleEvent}/>
          <DialogError show={this.state.errorMessageAbortConnection} message={this.state.errorMessageAbortConnection}
                       handleClick={this.handleDialogAbortConnection} footer={{content: 
                       <div className="flex-sp-around p-05em border-popup-footer">
                       <button className="border-radius-04em p-tb-03em-lr-1em" data-action="confirmCancel">
                        {localization.getLocText(20)}
                       </button>
                       <button className="border-radius-04em p-tb-03em-lr-1em" data-action="confirmOk">
                       {localization.getLocText(124)}
                       </button>
                       </div> }}/>
          <Description ref={(obj) => this.descriptionContext = obj}/>
          <ChatResize />
        </div>
      )
    } else {
      return <div></div>
    }
  }
});

extend_core.prototype.inherit(ChatApp, overlay_core);
extend_core.prototype.inherit(ChatApp, extend_core);
extend_core.prototype.inherit(ChatApp, dom_core);

export default ChatApp;