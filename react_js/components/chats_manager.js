import React from 'react'

import event_bus from '../js/event_bus.js'
import users_bus from '../js/users_bus.js'
import extend_core from '../js/extend_core.js'
import dom_core from '../js/dom_core.js'
import indexeddb from '../js/indexeddb.js'
import chats_bus from '../js/chats_bus.js'
import ajax_core from '../js/ajax_core.js'
import messages from '../js/messages.js'
import websocket from '../js/websocket.js'
import webrtc from '../js/webrtc.js'
import model_core from '../js/model_core.js'

import Chat from '../components/chat'
import Popup from '../components/popup'

var id_Generator = require('../server_js/id_generator');

const ChatsManager = React.createClass({
  getDefaultProps: function() {
    return {
      minChatsWidth: 350,
      minMove: 5,
      UIElements: {},
      withPanels: true
    }
  },

  getInitialState: function() {
    return {
      chatsArray: []
    }
  },

  componentDidMount: function() {
    event_bus.on('showChat', this.showChat, this);
    event_bus.on('addNewChatAuto', this.createNewChat, this);
    event_bus.on('getOpenChats', this.getOpenChats, this);
    event_bus.on('toCloseChat', this.toCloseChat, this);
    event_bus.on('chatsDestroy', this.destroyChats);
    event_bus.on('changeMyUsers', this.changeMyUsers);
    event_bus.on('chatJoinApproved', this.chatCreateApproved);
    event_bus.on('web_socket_message', this.onChatMessageRouter);
    event_bus.on('notifyChat', this.onChatMessageRouter);
    event_bus.on('syncResponseChatMessages', this.onChatMessageRouter);
    event_bus.on('requestChatByChatId', this.requestChatByChatId);
    event_bus.on('getSynchronizeChatMessages', this.getSynchronizeChatMessages);

    this.mainConteiner = document.querySelector('[data-role="main_container"]');
  },

  componentWillUnmount: function() {
    event_bus.off('showChat', this.showChat);
    event_bus.off('addNewChatAuto', this.createNewChat);
    event_bus.off('getOpenChats', this.getOpenChats);
    event_bus.off('toCloseChat', this.toCloseChat);
    event_bus.off('chatsDestroy', this.destroyChats);
    event_bus.off('changeMyUsers', this.changeMyUsers);
    event_bus.off('chatJoinApproved', this.chatCreateApproved);
    event_bus.off('web_socket_message', this.onChatMessageRouter);
    event_bus.off('notifyChat', this.onChatMessageRouter);
    event_bus.off('syncResponseChatMessages', this.onChatMessageRouter);
    event_bus.off('requestChatByChatId', this.requestChatByChatId);
    event_bus.off('getSynchronizeChatMessages', this.getSynchronizeChatMessages);

    this.mainConteiner = null;
  },

  getOpenChats: function(callback) {
    let openChats = {};
    Chat.prototype.chatsArray.forEach(function(chat) {
      if (!chat.chat_description) return;
      openChats[chat.chat_description.chat_id] = true;
    });
    callback(openChats);
  },

  showChat: function(element, chat_id) {
    let self = this, newState, restoreOption, parentElement;
    if (element) {
      parentElement = this.traverseUpToDataset(element, 'role', 'chatWrapper');
      restoreOption = element.dataset.restore_chat_state;
    }
    if (!parentElement && !chat_id) {
      console.error(new Error('Parent element not found!'));
      return;
    }

    if (parentElement && !parentElement.dataset.chat_id && !chat_id) {
      console.error(new Error('Chat wrapper does not have chat id!'));
      return;
    }

    let chatId = parentElement ? parentElement.dataset.chat_id : chat_id;
    if (this.isChatOpened(chatId)) {
      event_bus.trigger('changeStatePopup', {
        show: true,
        type: 'error',
        message: 93,
        onDataActionClick: function(action) {
          switch (action) {
            case 'confirmCancel':
              newState = Popup.prototype.handleClose(this.state);
              this.setState(newState);
              break;
          }
        }
      });
      return;
    }

    this.createNewChat(null, true, restoreOption, chatId);
  },

  changeMyUsers(userId){
    Chat.prototype.chatsArray.forEach(function(_chat) {
      if (_chat.chat_description.user_ids.indexOf(userId) !== -1) {
        event_bus.trigger('changeMyUserInfo', userId, _chat.chat_description.chat_id);
      }
    });
  },

  getSynchronizeChatMessages(messageData){
    messages.prototype.getSynchronizeChatMessages(messageData);
  },

  /**
   * chat whether requested chat by its id is opened or not
   */
  isChatOpened: function(chatId) {
    let openedChat;
    Chat.prototype.chatsArray.every(function(_chat) {
      if (_chat.chat_description && _chat.chat_description.chat_id === chatId || _chat.temp_chat_id === chatId) {
        openedChat = _chat;
      }
      return !openedChat;
    });

    return openedChat;
  },

  getIndexCurrentChat: function(chatId) {
    let _indexCurrentChat;
    Chat.prototype.chatsArray.every(function(_chat, index) {
      if (_chat.chat_description && _chat.chat_description.chat_id === chatId ||
        _chat.chat_id === chatId) {
        _indexCurrentChat = index;
      }
      return !_indexCurrentChat;
    });

    return _indexCurrentChat;
  },

  handleChat: function(messageData, chat_description) {
    event_bus.trigger("changeOpenChats", "CHATS");
    if (messageData.chat_wscs_descrs) {
      webrtc.handleConnectedDevices(messageData.chat_wscs_descrs);
    } else {
      websocket.wsRequest({
        chat_id: chat_description.chat_id,
        url: "/api/chat/websocketconnections"
      }, function(err, response) {
        if (err) {
          console.error(err);
          return;
        }
        webrtc.handleConnectedDevices(response.chat_wscs_descrs);
      });
    }
    this.forceUpdate();
  },

  createNewChat: function(event, show, restoreOption, chatId, message_request) {
    if (!websocket)  return;

    let newRawChat = {};
    newRawChat.mode = 'raw';
    newRawChat.temp_chat_id = id_Generator.generateId();
    if (show) {
      newRawChat.show = show;
      if (chatId) {
        newRawChat.chat_id = chatId;
      }
      if (restoreOption) {
        newRawChat.restoreOption = restoreOption;
      }
    }
    if (message_request && chatId) {
      newRawChat.chat_id = chatId;
      newRawChat.message_request = message_request;
    }
    newRawChat.logMessages = [];
    Chat.prototype.chatsArray.push(newRawChat);
    this.forceUpdate();
  },

  onChatMessageRouter: function(messageData) {
    switch (messageData.type) {
      case 'chat_joined':
        this.chatJoinApproved(messageData);
        break;
      case 'syncResponseChatMessages':
        Chat.prototype.chatsArray.forEach(function(_chat) {
          if (_chat.chat_description && messageData.chat_description.chat_id === _chat.chat_description.chat_id &&
            messageData.owner_request === users_bus.getUserId()) {
            event_bus.trigger('workflowSynchronizeMessages', messageData);
          }
        });
        break;
      case 'notifyChat':
        Chat.prototype.chatsArray.forEach(function(_chat) {
          if (_chat.chat_description && messageData.chat_description.chat_id === _chat.chat_description.chat_id) {
            event_bus.trigger(messageData.chat_type, messageData);
          }
        });
        break;
      case 'error':
        switch (messageData.request_type) {
          case 'notifyChat':
            if (messageData.chat_description && messageData.chat_description.temp_chat_id) {
              event_bus.trigger('send_log_message', messageData.chat_description.temp_chat_id,
                {text: messageData.message, type: 'error'});
            }
            break;
        }
        break;
    }
  },

  chatCreateApproved: function(event) {
    if (event.from_ws_device_id) {
      event_bus.set_ws_device_id(event.from_ws_device_id);
    }
    event_bus.trigger('send_log_message', event.chat_description.chat_id,
      {text: 'Adding chat to IndexedDB.', type: 'information'});
    this.addNewChatToIndexedDB(event.chat_description, function(err, chat) {
      if (err) {
        console.error(err);
        event_bus.trigger('send_log_message', chat.chat_id, {text: err, type: 'error'});
        return;
      }
      event_bus.trigger('send_log_message', chat.chat_id,
        {text: 'Added chat to IndexedDB. Saving chat in List Chats users.', type: 'information'});
      users_bus.putChatIdAndSave(chat.chat_id, function(err, userInfo) {
        if (err) {
          console.error(err);
          event_bus.trigger('send_log_message', chat.chat_id, {text: err, type: 'error'});
          return;
        }
        event_bus.trigger('AddedNewChat', userInfo.chat_ids.length);
        websocket.sendMessage({
          type: "chat_join",
          from_user_id: users_bus.getUserId(),
          chat_description: {
            chat_id: chat.chat_id
          }
        });
        event_bus.trigger('send_log_message', chat.chat_id,
          {text: 'Saved chat in List Chats users. Websocket sendMessage "Chat join".', type: 'information'});
      });
    })
  },

  /**
   * join request for this chat was approved by the server
   * make offer for each device for this chat
   */
  chatJoinApproved: function(event) {
    let self = this, newState, index;
    event_bus.set_ws_device_id(event.target_ws_device_id);
    event_bus.trigger('send_log_message', event.chat_description.chat_id,
      {text: 'Chat join approved. Getting chat description.', type: 'information'});

    indexeddb.getByKeyPath(
      chats_bus.collectionDescription,
      null,
      event.chat_description.chat_id,
      function(getError, chat_description) {
        if (getError) {
          console.error(getError);
          return;
        }

        if (!chat_description) {
          event_bus.trigger('changeStatePopup', {
            show: true,
            type: 'error',
            message: 86,
            onDataActionClick: function(action) {
              switch (action) {
                case 'confirmCancel':
                  newState = Popup.prototype.handleClose(this.state);
                  this.setState(newState);
                  break;
              }
            }
          });
          return;
        }

        event_bus.trigger('send_log_message', chat_description.chat_id, {
          text: 'Get chat description.',
          type: 'information'
        });
        index = self.getIndexCurrentChat(chat_description.chat_id);
        if (index === undefined) return;

        if (Chat.prototype.chatsArray[index].mode !== 'ready') {
          event_bus.trigger('send_log_message', chat_description.chat_id, {
            text: 'Upgrade to chat "ready".',
            type: 'information'
          });
          Chat.prototype.chatsArray[index].mode = 'ready';
          if (!event.chat_description.restoreOption) {
            Chat.prototype.chatsArray[index].chat_description = {};
            self.extend(Chat.prototype.chatsArray[index].chat_description,
              {
                chat_id: chat_description.chat_id,
                createdByUserId: chat_description.createdByUserId,
                createdDatetime: chat_description.createdDatetime,
                user_ids: chat_description.user_ids
              });
            Chat.prototype.chatsArray[index].chat_description.user_ids = chat_description.user_ids;
          } else {
            Chat.prototype.chatsArray[index].chat_description = chat_description;
          }
          self.handleChat(event, chat_description);
        } else if (Chat.prototype.chatsArray[index].mode === 'ready' && event.chat_wscs_descrs) {
          event_bus.trigger('send_log_message', chat_description.chat_id,
            {text: 'Webrtc handleConnectedDevices".', type: 'information'});
          webrtc.handleConnectedDevices(event.chat_wscs_descrs);
        }
      }
    );
  },

  addNewChatToIndexedDB: function(chat_description, callback) {
    let newChat = Chat.prototype.getInitialState();
    if (chat_description) {
      this.extend(newChat, chat_description)
    }
    this.setCreator(newChat);
    this.addMyUserId(newChat);
    chats_bus.putChatToIndexedDB(newChat, callback);
  },

  toCloseChat: function(saveStates, chatId, temp_chat_id) {
    let self = this;
    if (!chatId && temp_chat_id) {
      self.closeChat(null, temp_chat_id);
      return;
    }
    event_bus.trigger('getChatDescription', chatId, function(description) {
      switch (saveStates) {
        case 'closeChat':
          self.closeChat(description);
          break;
        case 'saveStatesChat':
          self.saveStatesChat(description);
          break;
        case 'saveAndCloseChat':
          self.saveAndCloseChat(description);
          break;
      }
    });
  },

  requestChatByChatId(chatId, requestMessage){
    let self = this, newState;
    indexeddb.getByKeyPath(
      chats_bus.collectionDescription,
      null,
      chatId,
      function(getError, chat_description) {
        if (getError) {
          console.error(getError);
          return;
        }

        if (!chat_description) {
          self.createNewChat(null, null, null, chatId, requestMessage);
        } else {
          if (self.isChatOpened(chatId)) {
            event_bus.trigger('changeStatePopup', {
              show: true,
              type: 'error',
              message: 93,
              onDataActionClick: function(action) {
                switch (action) {
                  case 'confirmCancel':
                    newState = Popup.prototype.handleClose(this.state);
                    this.setState(newState);
                    break;
                }
              }
            });
          } else {
            event_bus.trigger('changeStatePopup', {
              show: true,
              type: 'confirm',
              message: 114,
              onDataActionClick: function(action) {
                switch (action) {
                  case 'confirmCancel':
                    newState = Popup.prototype.handleClose(this.state);
                    this.setState(newState);
                    break;
                  case 'confirmOk':
                    newState = Popup.prototype.handleClose(this.state);
                    this.setState(newState);
                    self.showChat(null, chatId);
                    break;
                }
              }
            });
          }
        }
      }
    );
  },

  closeChat: function(description, temp_chat_id) {
    let newState, self = this;
    event_bus.trigger('changeStatePopup', {
      show: true,
      type: 'confirm',
      message: 83,
      onDataActionClick: function(action) {
        switch (action) {
          case 'confirmCancel':
            newState = Popup.prototype.handleClose(this.state);
            this.setState(newState);
            break;
          case 'confirmOk':
            self.destroyChat(description, temp_chat_id);
            newState = Popup.prototype.handleClose(this.state);
            this.setState(newState);
            break;
        }
      }
    });
  },

  destroyChat: function(description, temp_chat_id) {
    let position = this.getDestroyChatPosition((!description && temp_chat_id) ? temp_chat_id : description.chat_id);
    if (description && !temp_chat_id) {
      event_bus.trigger("chatDestroyed", description.chat_id);
      event_bus.trigger("changeOpenChats");
    }
    Chat.prototype.chatsArray.splice(position, 1);
    this.forceUpdate();
  },

  destroyChats: function() {
    Chat.prototype.chatsArray = [];
  },

  getDestroyChatPosition: function(chat_id) {
    let destroyChatPosition;
    Chat.prototype.chatsArray.every(function(_chat, index) {
      if (_chat.chat_description && _chat.chat_description.chat_id === chat_id || _chat.temp_chat_id === chat_id) {
        destroyChatPosition = index;
      }
      return !destroyChatPosition;
    });

    return destroyChatPosition;
  },

  saveStatesChat: function(description) {
    let newState, self = this;
    event_bus.trigger('changeStatePopup', {
      show: true,
      type: 'confirm',
      message: 81,
      onDataActionClick: function(action) {
        switch (action) {
          case 'confirmCancel':
            newState = Popup.prototype.handleClose(this.state);
            this.setState(newState);
            break;
          case 'confirmOk':
            self.addNewChatToIndexedDB(description, function(err) {
              if (err) {
                console.error(err);
              }
            });
            newState = Popup.prototype.handleClose(this.state);
            this.setState(newState);
            break;
        }
      }
    });
  },

  saveAndCloseChat: function(description) {
    let newState, self = this;
    event_bus.trigger('changeStatePopup', {
      show: true,
      type: 'confirm',
      message: 82,
      onDataActionClick: function(action) {
        switch (action) {
          case 'confirmCancel':
            newState = Popup.prototype.handleClose(this.state);
            this.setState(newState);
            break;
          case 'confirmOk':
            self.addNewChatToIndexedDB(description, function(err) {
              if (err) {
                console.error(err);
                return;
              }
              self.destroyChat(description);
            });
            newState = Popup.prototype.handleClose(this.state);
            this.setState(newState);
            break;
        }
      }
    });
  },

  render: function() {
    let self = this;
    if (!Chat.prototype.chatsArray.length) {
      return <div className="flex-outer-container align-start" data-role="chat_wrapper"></div>
    } else {
      let items = [];
      Chat.prototype.chatsArray.forEach(function(_chat, index) {
        items.push(<Chat data={_chat}
                         key={_chat.chat_description && _chat.chat_description.chat_id ? _chat.chat_description.chat_id : _chat.temp_chat_id}
                         mode={_chat.mode} index={index} scrollEachChat={self.props.scrollEachChat}/>);
      });
      return <div className="flex-outer-container align-start" data-role="chat_wrapper">{items}</div>;
    }
  }
});

extend_core.prototype.inherit(ChatsManager, dom_core);
extend_core.prototype.inherit(ChatsManager, ajax_core);
extend_core.prototype.inherit(ChatsManager, extend_core);
extend_core.prototype.inherit(ChatsManager, model_core);

export default ChatsManager;