import React from 'react'
import ReactDOM from 'react-dom'

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
import ToggleVisibleChatPart from '../components/toggle_visible_chat_part'
import DialogConfirm from './dialogConfirm'
import DialogError from './dialogError'

const Chat = React.createClass({
  chatsArray: [],
  syncMessageDataArray: [],
  syncMessageDataFlag: false,
  valueOfKeys: ['chat_id', 'createdByUserId', 'createdDatetime', 'user_ids', 'addNewUserWhenInviting'],

  getDefaultProps() {
    return {
      location: {
        TOP: "TOP",
        BOTTOM: "BOTTOM"
      }
    }
  },

  getInitialState() {
    return {
      hideTopPart: false,
      hideBottomPart: false,
      headerFooterControl: false,
      toggleTopButtonLeft: '0px',
      toggleBottomButtonLeft: '0px',
      toggleChatUsersFriendship: false,
      addNewUserWhenInviting: true,
      lastChangedDatetime: null,
      errorMessage: null,
      confirmMessage: null,
      confirmMessageData: null,
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
        sendEnter: true,
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

  componentWillMount() {
    let index = this.props.index, self = this, data = this.props.data;
    if (this.props.data.mode && this.props.data.mode === 'raw') {
      this.setState({
        logMessages: this.props.data.logMessages,
        temp_chat_id: this.props.data.temp_chat_id,
        index: index
      });
    } else if (this.props.data.mode && this.props.data.mode === 'ready') {
      if (!data.restoreOption) {
        this.setState({
          chat_id: data.chat_description.chat_id,
          createdByUserId: data.chat_description.createdByUserId,
          createdDatetime: data.chat_description.createdDatetime,
          user_ids: data.chat_description.user_ids,
          temp_chat_id: this.props.data.temp_chat_id,
          lastChangedDatetime: this.props.data.lastChangedDatetime,
          addNewUserWhenInviting: this.props.data.chat_description.addNewUserWhenInviting,
          index: index
        });
      } else {
        data.chat_description.index = index;
        data.chat_description.temp_chat_id = this.props.data.temp_chat_id;
        this.setState(data.chat_description);
        let currentOptions = this.optionsDefinition(data.chat_description, data.chat_description.bodyOptions.mode);
        if (currentOptions.paginationOptions.showEnablePagination) {
          Pagination.prototype.countPagination(currentOptions, null, data.chat_description.bodyOptions.mode,
            {"chat_id": data.chat_description.chat_id}, function(_newState) {
              self.setState(_newState);
            });
        }
      }
      this.updateUserAvatar();
    }
  },

  componentDidMount() {
    if (this.props.data.mode === 'raw') {
      let self = this;
      self.state.logMessages.push({text: 'Create raw chat.', type: 'information'});
      this.setState({
        logMessages: this.state.logMessages,
        chat_mode: this.props.data.mode
      });
      event_bus.on('web_socket_message', this.onChatMessageRouter);
      event_bus.on('send_log_message', this.getLogMessage);
      if (this.props.data.show && this.props.data.chat_id) {
        self.state.logMessages.push({text: 'Getting chat description.', type: 'information'});
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
              self.state.logMessages.push('Get chat description. Websocket sendMessage "Chat join".');
              self.setState({logMessages: self.state.logMessages});
            } else {
              console.error(new Error('Chat with such id not found in the database!'));
            }
          }
        );
      } else if (this.props.data.message_request && this.props.data.chat_id) {
        self.state.logMessages.push({text: 'Websocket sendMessage "Chat join request".', type: 'information'});
        this.setState({logMessages: self.state.logMessages});
        websocket.sendMessage({
          type: "chat_join_request",
          from_user_id: users_bus.getUserId(),
          to_chat_id: this.props.data.chat_id,
          request_body: {
            message: this.props.data.message_request
          },
          chat_description: {
            temp_chat_id: self.state.temp_chat_id
          }
        });
      } else {
        self.state.logMessages.push({text: 'Websocket sendMessage "Chat create".', type: 'information'});
        this.setState({logMessages: self.state.logMessages});
        websocket.sendMessage({
          type: "chat_create",
          from_user_id: users_bus.getUserId(),
          chat_description: {
            temp_chat_id: self.state.temp_chat_id
          }
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
      event_bus.on('updateUserAvatar', this.updateUserAvatar, this);
      event_bus.on('workflowSynchronizeMessages', this.workflowSynchronizeMessages, this);

      this.splitter_left.addEventListener('mousedown', this.startResize);
      this.splitter_left.addEventListener('touchstart', this.startResize);
      this.splitter_left.addEventListener('touchmove', this.startResize);
      this.splitter_left.addEventListener('touchend', this.startResize);

      this.splitter_right.addEventListener('mousedown', this.startResize);
      this.splitter_right.addEventListener('touchstart', this.startResize);
      this.splitter_right.addEventListener('touchmove', this.startResize);
      this.splitter_right.addEventListener('touchend', this.startResize);

      this.checkAutoAddContact();
    }
  },

  componentWillUnmount() {
    if (this.state.chat_mode === 'raw') {
      event_bus.off('web_socket_message', this.onChatMessageRouter);
      event_bus.off('send_log_message', this.getLogMessage);
    } else if (this.state.chat_mode === 'ready') {
      event_bus.off('changeMode', this.changeMode, this);
      event_bus.off('getChatDescription', this.getChatDescription, this);
      event_bus.off('chat_message', this.onChatMessage, this);
      event_bus.off('chat_toggled_ready', this.onChatToggledReady, this);
      event_bus.off('srv_chat_join_request', this.onChatJoinRequest, this);
      event_bus.off('updateUserAvatar', this.updateUserAvatar, this);
      event_bus.off('workflowSynchronizeMessages', this.workflowSynchronizeMessages, this);

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

  checkAutoAddContact(){
    if (this.state.addNewUserWhenInviting) {
      let self = this, newUsers = [];
      chats_bus.getChatContacts(self.props.data.chat_description.chat_id, function(error, contactsInfo) {
        if (error) return console.error(error);

        if (contactsInfo) {
          contactsInfo.forEach(function(_contact) {
            if (_contact.userName === '-//-//-//-') {
              newUsers.push(_contact.user_id);
            }
          })
        }
        if (newUsers.length) {
          let active_connections = webrtc.getChatConnections(webrtc.connections, self.state.chat_id);
          if (active_connections.length) {
            newUsers.forEach(function(_contact_id) {
              let connectionUser;
              active_connections.every(function(_connection) {
                if (_connection.users_ids.indexOf(_contact_id) !== -1) {
                  connectionUser = true;
                }
                return !connectionUser;
              });
              if (connectionUser) {
                console.log('send Data');
                websocket.sendMessage({
                  type: "user_add_auto",
                  from_user_id: users_bus.getUserId(),
                  avatar_data: self.state.userInfo.avatar_data,
                  to_user_id: _contact_id,
                  chat_description: {
                    chat_id: self.state.chat_id
                  }
                });
              }
            })
          }
        }
      })
    }
  },

  updateUserAvatar(){
    let self = this;
    users_bus.getMyInfo(null, function(_err, options, userInfo) {
      self.setState({userInfo: userInfo});
    })
  },

  getLogMessage(chat_id, message) {
    if (chat_id !== this.state.chat_id && chat_id !== this.state.temp_chat_id) return;
    this.state.logMessages.push({text: message.text, type: message.type});
    this.setState({logMessages: this.state.logMessages});
  },

  startResize(event) {
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

  getChatDescription(chatId, _callback) {
    if (this.state.chat_id === chatId) {
      this.state.toggleChatUsersFriendship = false;
      this.state.temp_chat_id = null;
      if (_callback) {
        _callback(this.state);
      }
    }
  },

  handleClick(event) {
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
        case "closeRawChat":
          event_bus.trigger('toCloseChat', element.dataset.action, null, this.state.temp_chat_id);
          break;
        case 'hideTopPart':
          this.setState({hideTopPart: !this.state.hideTopPart});
          break;
        case 'hideBottomPart':
          this.setState({hideBottomPart: !this.state.hideBottomPart});
          break;
        case 'synchronizeMessages':
          this.onSynchronizeMessages();
          break;
      }
    }
  },

  handleChange(event) {
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

  changeMode(element, chat_id) {
    if (chat_id && chat_id !== this.state.chat_id) return;
    this.switchModes([
      {
        chat_part: element.dataset.chat_part,
        newMode: element.dataset.mode_to,
        target: element
      }
    ]);
  },

  switchModes(_array) {
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

  onSynchronizeMessages(){
    let self = this, index = self.state.user_ids.indexOf(users_bus.getUserId()),
      messageData, newState;
    if (index !== -1 && self.state.user_ids.length > 1 ||
      index === -1 && self.state.user_ids.length > 0) {
      messageData = {
        type: "syncRequestChatMessages",
        chat_description: {
          chat_id: self.state.chat_id
        },
        owner_request: users_bus.getUserId()
      };
      let active_connections = webrtc.getChatConnections(webrtc.connections, self.state.chat_id);
      if (active_connections.length) {
        webrtc.broadcastChatMessage(self.state.chat_id, JSON.stringify(messageData));
      } else {
        this.setState({errorMessage: 121});
      }
    }
  },

  onChatMessageRouter(messageData) {
    if (this.state.chat_id && this.state.chat_id !== messageData.chat_description.chat_id ||
      messageData.chat_description && this.state.temp_chat_id !== messageData.chat_description.temp_chat_id) return;
    switch (messageData.type) {
      case 'chat_created':
        this.state.logMessages.push({text: 'get chatId: ' + messageData.chat_description.chat_id, type: 'information'});
        this.setState({
          logMessages: this.state.logMessages,
          chat_id: messageData.chat_description.chat_id
        });
        let index = this.chatsArray.indexOf(this.props.data);
        this.chatsArray[index].chat_description = this.state;
        event_bus.trigger('chatJoinApproved', messageData);
        break;
    }
  },

  defineSplitterClass(className) {
    if (!this.state.settings_ListOptions.adjust_width ||
      this.state.settings_ListOptions.current_data_key !== "custom_size") {
      className = className + 'hidden';
    }
    return className;
  },

  onChatToggledReady(eventData) {
    this.chat_ready_state = eventData.ready_state;
  },

  onChatJoinRequest(eventData) {
    let self = this, newState;
    event_bus.set_ws_device_id(eventData.target_ws_device_id);
    if (!this.chat_ready_state || !this.amICreator(this.state)) {
      return;
    }

    this.setState({confirmMessage: eventData.request_body.message, confirmMessageData: eventData});
  },

  handleDialogError(){
    this.setState({errorMessage: null});
  },

  handleDialogChatJoinRequest(event){
    let element = this.getDataParameter(event.target, 'action');
    if (element) {
      switch (element.dataset.action) {
        case 'confirmCancel':
          break;
        case 'confirmOk':
          let data = this.state.confirmMessageData, self = this;
          if (!this.isInUsers(this.state, data.from_user_id)) {
            // add user and save chat with this user
            this.state.user_ids.push(data.from_user_id);
            this.state.lastChangedDatetime = Date.now();
            chats_bus.updateChatField(self.state.chat_id, 'user_ids', self.state.user_ids, function(error) {
              if (error) return console.error(error);

              self._listenWebRTCConnection();
              webrtc.handleConnectedDevices(data.user_wscs_descrs);
            });
          } else {
            self._listenWebRTCConnection();
            webrtc.handleConnectedDevices(data.user_wscs_descrs);
          }
          break;
      }
    }
    this.setState({confirmMessage: null, confirmMessageData: null});
  },

  changeState(newState) {
    this.setState(newState);
  },

  valueOfChat() {
    let toStringObject = {}, self = this;
    self.valueOfKeys.forEach(function(key) {
      toStringObject[key] = self.state[key];
    });
    return toStringObject;
  },

  _webRTCConnectionReady(eventConnection) {
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

  _notListenWebRTCConnection() {
    webrtc.off('webrtc_connection_established', this._webRTCConnectionReady);
  },

  _listenWebRTCConnection() {
    this._notListenWebRTCConnection();
    webrtc.on('webrtc_connection_established', this._webRTCConnectionReady, this);
  },

  onChatMessage(eventData) {
    if (this.state.chat_id !== eventData.chat_description.chat_id)
      return;
    let self = this, newState = this.state;
    this.checkingUserInChat([eventData.message.createdByUserId], this.state.user_ids);
    messages.prototype.addRemoteMessage(eventData.message, this.state.bodyOptions.mode, this.state.chat_id,
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

  workflowSynchronizeMessages(messageData){
    if (!messageData.messages.length) return;
    let self = this, newState = this.state, lastMessage;
    if (self.syncMessageDataFlag) {
      self.syncMessageDataArray.push(messageData);
    } else {
      self.syncMessageDataFlag = true;
      messages.prototype.getAllMessages(self.state.chat_id, self.state.bodyOptions.mode, function(_err, _messages) {
        if (_err) {
          self.syncMessageDataFlag = false;
          return console.error(_err);
        }

        let store = {}, remoteMessages = [], usersToChecking = [];
        if (_messages.length) {
          for (let message of _messages) {
            store[message.messageId] = true;
          }
          for (let _syncMessage of messageData.messages) {
            if (!store[_syncMessage.messageId]) {
              remoteMessages.push(_syncMessage);
              if (usersToChecking.indexOf(_syncMessage.createdByUserId) === -1) {
                usersToChecking.push(_syncMessage.createdByUserId);
              }
            }
          }
          lastMessage = _messages[_messages.length - 1];
        } else {
          remoteMessages = messageData.messages;
          lastMessage = null;
        }
        let _workflow = function() {
          self.syncMessageDataFlag = false;
          if (self.syncMessageDataArray.length) {
            let _messageData = self.syncMessageDataArray.shift();
            self.workflowSynchronizeMessages(_messageData);
          } else {
            if (newState.messages_PaginationOptions.showEnablePagination) {
              newState.messages_PaginationOptions.currentPage = null;
              Pagination.prototype.countPagination(null, newState, newState.bodyOptions.mode,
                {"chat_id": newState.chat_id}, function(_newState) {
                  self.setState(_newState);
                });
            } else {
              self.setState({messages_PaginationOptions: newState.messages_PaginationOptions});
            }
          }
        };
        if (remoteMessages.length) {
          self.checkingUserInChat(usersToChecking, self.state.user_ids);
          remoteMessages = messages.prototype.addMessageData(lastMessage, remoteMessages, true);
          messages.prototype.addAllRemoteMessages(remoteMessages, self.state.bodyOptions.mode, self.state.chat_id, function(_err) {
            if (_err) return console.error(_err);
            _workflow();
          });
        } else {
          _workflow();
        }
      });
    }
  },

  checkingUserInChat(usersToChecking, user_ids){
    let newUsers = [], self = this;
    usersToChecking.forEach(function(_user) {
      if (user_ids.indexOf(_user) === -1) {
        newUsers.push(_user);
      }
    });

    if (newUsers.length) {
      let usersArray = newUsers.concat(user_ids);
      chats_bus.updateChatField(self.state.chat_id, 'user_ids', usersArray, function(error) {
        if (error) return console.error(error);

        self.setState({user_ids: usersArray});
        
      });
    }
    self.checkAutoAddContact();
  },

  render() {
    let handleEvent = {
      changeState: this.changeState
    };
    let onEvent = {
      onClick: this.handleClick,
      onChange: this.handleChange
    };
    if (this.props.data.mode === 'raw') {
      let items = [], className;
      this.state.logMessages.forEach(function(_message, index) {
        className = (_message.type === 'error') ? "myMessage message margin-t-b color-red" : "myMessage message margin-t-b";
        items.push(
          <div key={index}
               className={className}>
            {_message.text}
          </div>);
      });
      return (
        <section className="modal">
          <Header data={this.state} chat_mode={this.props.data.mode} handleEvent={handleEvent} events={onEvent}/>
          <div className="modal-body overflow-y-scroll">
            {items}
          </div>
        </section>
      )
    } else {
      return (
        <section className="modal" data-chat_id={this.props.data.chat_description.chat_id}
                 style={{width: this.state.settings_ListOptions.size_current}}>
          <DialogError show={this.state.errorMessage} message={this.state.errorMessage}
                       handleClick={this.handleDialogError}/>
          <DialogConfirm show={this.state.confirmMessage} message={this.state.confirmMessage}
                         handleClick={this.handleDialogChatJoinRequest}/>
          <div className={this.defineSplitterClass('chat-splitter-item ')} data-role="splitter_item"
               data-splitteritem="left">
          </div>
          <div className={this.defineSplitterClass('chat-splitter-item right ')} data-role="splitter_item"
               data-splitteritem="right">
          </div>
          <div className={this.props.scrollEachChat ? 'w-inh ' : 'p-fx w-inh'} style={{'zIndex': 3}}>
            <div className={this.state.hideTopPart ? "hide" : ""}>
              <Header data={this.state} chat_mode={this.props.data.mode} handleEvent={handleEvent} events={onEvent}/>
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