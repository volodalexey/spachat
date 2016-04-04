import React from 'react'
import ReactDOM from 'react-dom'
import { Router, Route, Link, History, Redirect } from 'react-router'

import extend_core from '../js/extend_core.js'
import switcher_core from '../js/switcher_core.js'
import dom_core from '../js/dom_core.js'
import event_bus from '../js/event_bus.js'
import messages from '../js/messages.js'
import webrtc from '../js/webrtc.js'
import websocket from '../js/websocket.js'
import chats_bus from '../js/chats_bus.js'
import users_bus from '../js/users_bus.js'
import model_core from '../js/model_core.js'
import indexeddb from '../js/indexeddb.js'

import Header from '../components/header'
import Filter from '../components/filter'
import ExtraToolbar from '../components/extra_toolbar'
import Body from '../components/body'
import Editor from '../components/editor'
import Pagination from '../components/pagination'
import GoTo from '../components/go_to'
import Popup from '../components/popup'
import ToggleVisibleChatPart from '../components/toggle_visible_chat_part'

const Chat = React.createClass({
  chatsArray: [],

  getDefaultProps: function() {
    return {
      location: {
        TOP: "TOP",
        BOTTOM: "BOTTOM"
      }
    }
  },

  getInitialState: function() {
    return {
      hideTopPart: false,
      hideBottomPart: false,
      toggleTopButtonLeft: '0px',
      toggleBottomButtonLeft: '0px',
      padding: {
        bottom: 5
      },
      headerOptions: {
        show: true,
        mode: Header.prototype.MODE.TAB
      },
      filterOptions: {
        show: false
      },
      bodyOptions: {
        show: true,
        mode: Body.prototype.MODE.MESSAGES
      },
      editorOptions: {
        show: true,
        mode: Editor.prototype.MODE.MAIN_PANEL
      },
      formatOptions: {
        show: false,
        offScroll: false,
        sendEnter: false,
        iSender: true
      },
      messages_GoToOptions: {
        text: "messages_GoToOptions",
        show: false,
        rteChoicePage: true,
        mode_change: "rte",
        page: null,
        pageShow: 1
      },
      messages_PaginationOptions: {
        text: "messages_PaginationOptions",
        show: false,
        mode_change: "rte",
        currentPage: null,
        firstPage: 1,
        lastPage: null,
        showEnablePagination: false,
        showChoicePerPage: false,
        perPageValue: 1,
        perPageValueShow: 1,
        perPageValueNull: false,
        rtePerPage: true,
        disableBack: false,
        disableFirst: false,
        disableLast: false,
        disableForward: false
      },
      messages_FilterOptions: {
        text: "messages_FilterOptions",
        show: false
      },
      messages_ExtraToolbarOptions: {
        show: true
      },
      messages_ListOptions: {
        text: "messages_ListOptions",
        start: 0,
        last: null,
        previousStart: 0,
        previousFinal: 0,
        restore: false,
        innerHTML: "",
        data_download: true
      },

      logger_GoToOptions: {
        text: '"logger_GoToOptions',
        show: false,
        rteChoicePage: true,
        mode_change: "rte",
        page: null,
        pageShow: 1
      },
      logger_PaginationOptions: {
        text: "logger_PaginationOptions",
        show: false,
        mode_change: "rte",
        currentPage: null,
        firstPage: 1,
        lastPage: null,
        showEnablePagination: false,
        showChoicePerPage: false,
        perPageValue: 25,
        perPageValueShow: 25,
        perPageValueNull: false,
        rtePerPage: true,
        disableBack: false,
        disableFirst: false,
        disableLast: false,
        disableForward: false
      },
      logger_FilterOptions: {
        show: false
      },
      logger_ExtraToolbarOptions: {
        show: true
      },
      logger_ListOptions: {
        text: "logger_ListOptions",
        start: 0,
        last: null,
        previousStart: 0,
        previousFinal: 0,
        restore: false,
        data_download: true
      },

      contactList_FilterOptions: {
        text: "contactList_FilterOptions",
        show: false
      },
      contactList_ExtraToolbarOptions: {
        show: true
      },
      contactList_PaginationOptions: {
        text: "contactList_PaginationOptions",
        show: false,
        mode_change: "rte",
        currentPage: null,
        firstPage: 1,
        lastPage: null,
        showEnablePagination: false,
        showChoicePerPage: false,
        perPageValue: 50,
        perPageValueShow: 50,
        perPageValueNull: false,
        rtePerPage: true,
        disableBack: false,
        disableFirst: false,
        disableLast: false,
        disableForward: false
      },
      contactList_GoToOptions: {
        text: "contactList_GoToOptions",
        show: false,
        rteChoicePage: true,
        mode_change: "rte",
        page: null,
        pageShow: 1
      },
      contactList_ListOptions: {
        text: "contactList_ListOptions",
        start: 0,
        last: null,
        previousStart: 0,
        previousFinal: 0,
        restore: false,
        data_download: false
      },

      settings_ExtraToolbarOptions: {
        show: false
      },
      settings_FilterOptions: {
        show: false
      },
      settings_PaginationOptions: {
        show: false
      },
      settings_GoToOptions: {
        text: "settings_GoToOptions",
        show: false
      },
      settings_ListOptions: {
        text: "settings_ListOptions",
        current_data_key: null,
        size_custom_value: '350px',
        size_current: '350px',
        adjust_width: false
      }
    }
  },

  componentWillMount: function() {
    let index = this.props.index, self = this, data = this.props.data;
    if (this.props.data.mode && this.props.data.mode === 'raw') {
      this.setState({logMessages: this.props.data.logMessages,
        index: index});
    } else if (this.props.data.mode && this.props.data.mode === 'ready'){
      if (!data.restoreOption) {
        this.setState({
          chat_id: data.chat_description.chat_id,
          createdByUserId: data.chat_description.createdByUserId,
          createdDatetime: data.chat_description.createdDatetime,
          user_ids: data.chat_description.user_ids,
          index: index
        });
      } else {
        data.chat_description.index = index;
        this.setState(data.chat_description);
        let currentOptions = this.optionsDefinition(data.chat_description, data.chat_description.bodyOptions.mode);
        if (currentOptions.paginationOptions.showEnablePagination) {
          Pagination.prototype.countPagination(currentOptions, null, data.chat_description.bodyOptions.mode,
            {"chat_id": data.chat_description.chat_id}, function(_newState) {
              self.setState(_newState);
            });
        }
      }
    }
  },

  componentDidMount: function() {
    if (this.props.data.mode === 'raw') {
      let self = this;
      this.state.logMessages.push('sendingMessage chat_create');
      this.setState({logMessages: this.state.logMessages,
      chat_mode: this.props.data.mode});
      event_bus.on('web_socket_message', this.onChatMessageRouter);
      event_bus.on('send_log_message', this.getLogMessage);
      if (this.props.data.show && this.props.data.chat_id) {
        this.state.logMessages.push('Getting chat description');
        this.setState({logMessages: this.state.logMessages});
        indexeddb.getByKeyPath(
          chats_bus.collectionDescription,
          null,
          this.props.data.chat_id,
          function(getError, chatDescription) {
            if (getError) {
              return console.error(getError);
            }

            if (chatDescription) {
              websocket.sendMessage({
                type: "chat_join",
                from_user_id: users_bus.getUserId(),
                chat_description: {
                  chat_id: chatDescription.chat_id,
                  restoreOption: self.props.data.restoreOption
                }
              });
            } else {
              console.error(new Error('Chat with such id not found in the database!'));
            }
          }
        );
      } else {
        websocket.sendMessage({
          type: "chat_create",
          from_user_id: users_bus.getUserId()
        });
      }
    } else {
      this.props.data.chat_description.chat_mode = this.props.data.mode;
      this.setState(this.props.data.chat_description);

      this.chat = ReactDOM.findDOMNode(this);
      this.splitter_left = this.chat.querySelector('[data-splitteritem="left"]');
      this.splitter_right = this.chat.querySelector('[data-splitteritem="right"]');

      event_bus.on('changeMode', this.changeMode, this);
      event_bus.on('getChatDescription', this.getChatDescription, this);
      event_bus.on('chat_message', this.onChatMessage, this);
      event_bus.on('chat_toggled_ready', this.onChatToggledReady, this);
      event_bus.on('srv_chat_join_request', this.onChatJoinRequest, this);

      this.splitter_left.addEventListener('mousedown', this.startResize);
      this.splitter_left.addEventListener('touchstart', this.startResize);
      this.splitter_left.addEventListener('touchmove', this.startResize);
      this.splitter_left.addEventListener('touchend', this.startResize);

      this.splitter_right.addEventListener('mousedown', this.startResize);
      this.splitter_right.addEventListener('touchstart', this.startResize);
      this.splitter_right.addEventListener('touchmove', this.startResize);
      this.splitter_right.addEventListener('touchend', this.startResize);
    }
  },

  componentWillUnmount: function() {
    if (this.state.chat_mode === 'raw') {
      event_bus.off('web_socket_message', this.onChatMessageRouter);
      event_bus.off('send_log_message', this.getLogMessage);
    } else if(this.state.chat_mode === 'ready'){
      event_bus.off('changeMode', this.changeMode, this);
      event_bus.off('getChatDescription', this.getChatDescription, this);
      event_bus.off('chat_message', this.onChatMessage, this);
      event_bus.off('chat_toggled_ready', this.onChatToggledReady, this);
      event_bus.off('srv_chat_join_request', this.onChatJoinRequest, this);

      this.splitter_left.removeEventListener('mousedown', this.startResize);
      this.splitter_left.removeEventListener('touchstart', this.startResize);
      this.splitter_left.removeEventListener('touchmove', this.startResize);
      this.splitter_left.removeEventListener('touchend', this.startResize);

      this.splitter_right.removeEventListener('mousedown', this.startResize);
      this.splitter_right.removeEventListener('touchstart', this.startResize);
      this.splitter_right.removeEventListener('touchmove', this.startResize);
      this.splitter_right.removeEventListener('touchend', this.startResize);

      this.chat = null;
      this.splitter_left = null;
      this.splitter_right = null;
    }
  },

  getLogMessage: function(chat_id, message) {
    if (chat_id !== this.state.chat_id) return;
    this.state.logMessages.push(message);
    this.setState({logMessages: this.state.logMessages});
  },

  startResize: function(event) {
    event.stopPropagation();
    event.preventDefault();
    switch (event.type) {
      case 'mousedown':
      case 'touchstart':
        event_bus.trigger('transformToResizeState', event, this);
        break;
      case 'touchmove':
      case 'touchend':
        event_bus.trigger('redirectResize', event, this);
        break;
    }
  },

  getChatDescription: function(chatId, _callback) {
    if (this.state.chat_id === chatId) {
      if (_callback) {
        _callback(this.state);
      }
    }
  },

  handleClick: function(event) {
    let element = this.getDataParameter(event.currentTarget, 'action'), self = this,
      currentOptions, gto, po;
    if (element) {
      switch (element.dataset.action) {
        case 'changeMode':
          this.changeMode(element);
          break;
        case 'changeRTE':
          currentOptions = this.optionsDefinition(this.state, this.state.bodyOptions.mode);
          currentOptions = Filter.prototype.changeRTE(element, currentOptions);
          if (currentOptions.paginationOptions.rtePerPage) {
            Pagination.prototype.countPagination(currentOptions, null, this.state.bodyOptions.mode,
              {"chat_id": this.state.chat_id}, function(_newState) {
                self.setState(_newState);
              });
          } else {
            this.setState(currentOptions);
          }
          break;
        case 'showPerPage':
          currentOptions = this.optionsDefinition(this.state, this.state.bodyOptions.mode);
          currentOptions.paginationOptions.currentPage = null;
          if (currentOptions.paginationOptions.showEnablePagination) {
            Pagination.prototype.countPagination(currentOptions, null, this.state.bodyOptions.mode,
              {"chat_id": this.state.chat_id}, function(_newState) {
                self.setState(_newState);
              });
          }
          break;
        case 'changeRTE_goTo':
          currentOptions = this.optionsDefinition(this.state, this.state.bodyOptions.mode);
          currentOptions = GoTo.prototype.changeRTE(element, currentOptions);
          if (currentOptions.goToOptions.rteChoicePage) {
            Pagination.prototype.countPagination(currentOptions, null, this.state.bodyMode,
              {"chat_id": this.state.chat_id}, function(_newState) {
                self.setState(_newState);
              });
          } else {
            this.setState(currentOptions);
          }
          break;
        case "switchPage":
          currentOptions = this.optionsDefinition(this.state, this.state.bodyOptions.mode);
          gto = currentOptions.goToOptions;
          po = currentOptions.paginationOptions;
          if (gto.page) {
            po.currentPage = gto.page;
          }
          Pagination.prototype.countPagination(currentOptions, null, this.state.bodyOptions.mode,
            {"chat_id": this.state.chat_id}, function(_newState) {
              self.setState(_newState);
            });
          break;
        case 'closeChat':
        case 'saveStatesChat':
        case 'saveAndCloseChat':
          event_bus.trigger('toCloseChat', element.dataset.action, this.state.chat_id);
          break;
        case 'hideTopPart':
          this.setState({hideTopPart: !this.state.hideTopPart});
          break;
        case 'hideBottomPart':
          this.setState({hideBottomPart: !this.state.hideBottomPart});
          break;
      }
    }
  },

  handleChange: function(event) {
    let element = this.getDataParameter(event.currentTarget, 'action'), self = this, currentOptions;
    if (element) {
      switch (element.dataset.action) {
        case 'changePerPage':
          currentOptions = this.optionsDefinition(this.state, this.state.bodyOptions.mode);
          currentOptions = Filter.prototype.changePerPage(element, currentOptions);
          if (currentOptions.paginationOptions.show && currentOptions.paginationOptions.rtePerPage) {
            Pagination.prototype.countPagination(currentOptions, null, this.state.bodyOptions.mode,
              {"chat_id": this.state.chat_id}, function(_newState) {
                self.setState(_newState);
              });
          } else {
            this.setState(currentOptions);
          }
          break;
        case 'changePage':
          currentOptions = this.optionsDefinition(this.state, this.state.bodyOptions.mode);
          currentOptions = Pagination.prototype.changePage(element, currentOptions);
          Pagination.prototype.countPagination(currentOptions, null, this.state.bodyOptions.mode,
            {"chat_id": this.state.chat_id}, function(_newState) {
              self.setState(_newState);
            });
          break;
      }
    }
  },

  changeMode: function(element, chat_id) {
    if (chat_id && chat_id !== this.state.chat_id) return;
    this.switchModes([
      {
        chat_part: element.dataset.chat_part,
        newMode: element.dataset.mode_to,
        target: element
      }
    ]);
  },

  switchModes: function(_array) {
    let self = this, currentOptions, po;
    _array.forEach(function(_obj) {
        switch (_obj.chat_part) {
          case 'body':
            switch (_obj.newMode) {
              case Body.prototype.MODE.SETTINGS:
                self.state.bodyOptions.mode = Body.prototype.MODE.SETTINGS;
                self.state.editorOptions.show = false;
                self.setState({bodyOptions: self.state.bodyOptions, editorOptions: self.state.editorOptions});
                break;
              case 'CONTACT_LIST':
                self.state.bodyOptions.mode = Body.prototype.MODE.CONTACT_LIST;
                self.state.editorOptions.show = false;
                self.setState({bodyOptions: self.state.bodyOptions, editorOptions: self.state.editorOptions});
                break;
              case Body.prototype.MODE.MESSAGES:
                self.state.bodyOptions.mode = Body.prototype.MODE.MESSAGES;
                self.state.editorOptions.show = true;
                self.setState({bodyOptions: self.state.bodyOptions, editorOptions: self.state.editorOptions});
                break;
              case Body.prototype.MODE.LOGGER:
                self.state.bodyOptions.mode = Body.prototype.MODE.LOGGER;
                self.state.editorOptions.show = false;
                self.setState({bodyOptions: self.state.bodyOptions, editorOptions: self.state.editorOptions});
                break;
            }
            break;
          case 'editor':
            switch (_obj.newMode) {
              case Editor.prototype.MODE.MAIN_PANEL:
                self.state.editorOptions.show = true;
                self.setState({editorOptions: self.state.editorOptions});
                break;
              case Editor.prototype.MODE.FORMAT_PANEL:
                self.state.formatOptions.show = !self.state.formatOptions.show;
                self.setState({formatOptions: self.state.formatOptions});
                break;
            }
            break;
          case 'pagination':
            switch (_obj.newMode) {
              case Pagination.prototype.MODE.PAGINATION:
                if (_obj.target) {
                  currentOptions = self.optionsDefinition(self.state, self.state.bodyOptions.mode);
                  po = currentOptions.paginationOptions;
                  po.show = _obj.target.checked;
                  po.showEnablePagination = _obj.target.checked;
                  self.setState({[po.text]: po});
                  if (po.showEnablePagination) {
                    Pagination.prototype.countPagination(currentOptions, null, self.state.bodyOptions.mode,
                      {chat_id: self.state.chat_id}, function(_newState) {
                        self.setState(_newState);
                      });
                  }
                }
                break;
              case Pagination.prototype.MODE.GO_TO:
                break;
            }
            break;
          case 'filter':
            switch (_obj.newMode) {
              case Filter.prototype.MODE.MESSAGES_FILTER:
              case Filter.prototype.MODE.CONTACT_LIST_FILTER:
                currentOptions = self.optionsDefinition(self.state, self.state.bodyOptions.mode);
                currentOptions.filterOptions.show = !currentOptions.filterOptions.show;
                self.setState({[currentOptions.filterOptions.text]: currentOptions.filterOptions});
                break;
            }
            break;
        }
      }
    );
  },

  onChatMessageRouter: function(messageData) {
    if (this.state.chat_id && this.state.chat_id !== messageData.chat_description.chat_id) return;
    switch (messageData.type) {
      case 'chat_created':
        this.state.logMessages.push('get chatId: ' + messageData.chat_description.chat_id);
        this.setState({logMessages: this.state.logMessages,
          chat_id: messageData.chat_description.chat_id});
        console.log(this.chatsArray);
        let index = this.chatsArray.indexOf(this.props.data);
        this.chatsArray[index].chat_description = this.state;
        console.log(this.chatsArray);
        event_bus.trigger('chatJoinApproved', messageData);
        break;
    }
  },

  defineSplitterClass: function(className) {
    if (!this.state.settings_ListOptions.adjust_width ||
      this.state.settings_ListOptions.current_data_key !== "custom_size") {
      className = className + 'hidden';
    }
    return className;
  },

  onChatToggledReady: function(eventData) {
    this.chat_ready_state = eventData.ready_state;
  },

  onChatJoinRequest: function(eventData) {
    let self = this, newState;
    event_bus.set_ws_device_id(eventData.target_ws_device_id);
    if (!this.chat_ready_state || !this.amICreator(this.state)) {
      return;
    }

    event_bus.trigger('changeStatePopup', {
      show: true,
      type: 'confirm',
      message: eventData.request_body.message,
      onDataActionClick: function(action) {
        switch (action) {
          case 'confirmOk':
            newState = Popup.prototype.handleClose(this.state);
            if (!self.isInUsers(self.state, eventData.from_user_id)) {
              // add user and save chat with this user
              self.state.user_ids.push(eventData.from_user_id);
              chats_bus.updateChatField(self.state.chat_id, 'user_ids', self.state.user_ids, function(error) {
                if (error) {
                  event_bus.trigger('changeStatePopup', {
                    show: true,
                    type: 'confirm',
                    message: err,
                    onDataActionClick: function(action) {
                      switch (action) {
                        case 'confirmCancel':
                          newState = Popup.prototype.handleClose(self.state);
                          self.setState(newState);
                          break;
                      }
                    }
                  });
                  return;
                }
                self._listenWebRTCConnection();
                webrtc.handleConnectedDevices(eventData.user_wscs_descrs);
              });
            } else {
              self._listenWebRTCConnection();
              webrtc.handleConnectedDevices(eventData.user_wscs_descrs);
            }
            this.setState(newState);
            break;
          case 'confirmCancel':
            newState = Popup.prototype.handleClose(this.state);
            this.setState(newState);
            break;
        }
      }
    });

  },

  changeState: function(newState) {
    this.setState(newState);
  },

  valueOfKeys: ['chat_id', 'createdByUserId', 'createdDatetime', 'user_ids'],

  valueOfChat: function() {
    let toStringObject = {}, self = this;
    self.valueOfKeys.forEach(function(key) {
      toStringObject[key] = self.state[key];
    });
    return toStringObject;
  },

  _webRTCConnectionReady: function(eventConnection) {
    if (eventConnection.hasChatId(this.state.chat_id)) {
      // if connection for chat join request
      var messageData = {
        type: "chatJoinApproved",
        from_user_id: users_bus.getUserId(),
        chat_description: this.valueOfChat()
      };
      if (eventConnection.isActive()) {
        eventConnection.dataChannel.send(JSON.stringify(messageData));
        this._notListenWebRTCConnection();
      } else {
        console.warn('No friendship data channel!');
      }
    }
  },

  _notListenWebRTCConnection: function() {
    webrtc.off('webrtc_connection_established', this._webRTCConnectionReady);
  },

  _listenWebRTCConnection: function() {
    this._notListenWebRTCConnection();
    webrtc.on('webrtc_connection_established', this._webRTCConnectionReady, this);
  },

  onChatMessage: function(eventData) {
    if (this.state.chat_id !== eventData.chat_description.chat_id)
      return;
    let self = this, newState = this.state;
    messages.prototype.addRemoteMessage(eventData, this.state.bodyOptions.mode, this.state.chat_id,
      function(err) {
        if (err) {
          console.error(err);
          return;
        }

        if (newState.messages_PaginationOptions.showEnablePagination) {
          newState.messages_PaginationOptions.currentPage = null;
          Pagination.prototype.countPagination(null, newState, newState.bodyOptions.mode,
            {"chat_id": newState.chat_id}, function(_newState) {
              self.setState(_newState);
            });
        } else {
          self.setState({messages_PaginationOptions: newState.messages_PaginationOptions});
        }
      });
  },

  render: function() {
    if (this.props.data.mode === 'raw') {
      let items = [];
      this.state.logMessages.forEach(function(_message, index) {
        items.push(<div key={index}>{_message}</div>);
      });
      return (
        <section className="modal">
          <button>Close</button>
          <div>
            Messages:
            {items}
          </div>
        </section>
      )
    } else {
      let handleEvent = {
        changeState: this.changeState
      };
      let onEvent = {
        onClick: this.handleClick,
        onChange: this.handleChange
      };
      return (
        <section className="modal" data-chat_id={this.props.data.chat_description.chat_id}
                 style={{width: this.state.settings_ListOptions.size_current}}>
          <div className={this.defineSplitterClass('chat-splitter-item ')} data-role="splitter_item"
               data-splitteritem="left">
          </div>
          <div className={this.defineSplitterClass('chat-splitter-item right ')} data-role="splitter_item"
               data-splitteritem="right">
          </div>
          <div className={this.props.scrollEachChat ? 'w-inh ' : 'p-fx w-inh'} style={{'zIndex': 3}}>
            <div className={this.state.hideTopPart ? "hide" : ""}>
              <Header data={this.state} handleEvent={handleEvent} events={onEvent}/>
              <div data-role="extra_toolbar_container" className="flex-sp-around flex-shrink-0 c-200">
                <ExtraToolbar mode={this.state.bodyOptions.mode} data={this.state} events={onEvent}/>
              </div>
              <div data-role="filter_container"
                   className={this.state.hideTopPart ?
             "flex wrap background-pink flex-shrink-0 c-200 hide" :
              "flex wrap background-pink flex-shrink-0 c-200"}>
                <Filter mode={this.state.bodyOptions.mode} data={this.state} handleEvent={handleEvent}
                        events={onEvent}/>
              </div>
            </div>
            <ToggleVisibleChatPart data={this.state} location={this.props.location.TOP} events={onEvent}
                                   handleEvent={handleEvent}/>
          </div>
          <div data-role="body_container"
               className={this.props.scrollEachChat ? "modal-body overflow-y-scroll p-rel" : "modal-body p-rel"}
               data-param_content="message">
            <Body mode={this.state.bodyOptions.mode} data={this.state} options={this.props.data} events={onEvent}
                  userInfo={null} handleEvent={handleEvent}/>
          </div>
          <div className={this.props.scrollEachChat ? 'w-inh' : 'p-fx w-inh'} style={{'zIndex': 4, 'bottom': 0}}>
            <ToggleVisibleChatPart data={this.state} location={this.props.location.BOTTOM} events={onEvent}
                                   handleEvent={handleEvent}/>
            <footer className={this.state.hideBottomPart ? "flex-item-auto hide" : "flex-item-auto"}>
              <Editor mode={this.state.bodyOptions.mode} data={this.state} events={onEvent} handleEvent={handleEvent}/>
              <div data-role="go_to_container" className="c-200">
                <GoTo mode={this.state.bodyOptions.mode} data={this.state} events={onEvent}/>
              </div>
              <div data-role="pagination_container" className="flex filter_container justContent c-200">
                <Pagination mode={this.state.bodyOptions.mode} data={this.state} events={onEvent}
                            handleEvent={handleEvent}/>
              </div>
            </footer>
          </div>
        </section>
      )
    }
  }
});

extend_core.prototype.inherit(Chat, dom_core);
extend_core.prototype.inherit(Chat, switcher_core);
extend_core.prototype.inherit(Chat, model_core);
extend_core.prototype.inherit(Chat, extend_core);

export default Chat;