import React from 'react'

import event_bus from '../js/event_bus.js'
import users_bus from '../js/users_bus.js'
import extend_core from '../js/extend_core.js'
import dom_core from '../js/dom_core.js'
import indexeddb from '../js/indexeddb.js'
import websocket from '../js/websocket.js'
import chats_bus from '../js/chats_bus.js'
import ajax_core from '../js/ajax_core.js'

import Chat from '../components/chat'
import Popup from '../components/popup'

const ChatsManager = React.createClass({
  getDefaultProps(){
    return {
      minChatsWidth: 350,
      minMove: 5,
      UIElements: {},
      withPanels: true
    }
  },

  getInitialState(){
    return {
      chatsArray: []
    }
  },

  componentDidMount(){
    event_bus.on('showChat', this.showChat, this);
    event_bus.on('addNewChatAuto', this.createNewChat, this);
    event_bus.on('getOpenChats', this.getOpenChats, this);
    event_bus.on('toCloseChat', this.toCloseChat, this);

    this.mainConteiner = document.querySelector('[data-role="main_container"]');
    this.chatResizeContainer = document.querySelector('[data-role="chat_resize_container"]');
    this.lineResize = this.chatResizeContainer.querySelector('[data-role="resize_line"]');
  },

  componentWillUnmount(){
    event_bus.off('showChat', this.showChat);
    event_bus.off('addNewChatAuto', this.createNewChat);
    event_bus.off('getOpenChats', this.getOpenChats);
    event_bus.off('toCloseChat', this.toCloseChat);

    this.mainConteiner = null;
    this.chatResizeContainer = null;
    this.lineResize = null;
  },

  getOpenChats: function(callback) {
    var openChats = {};
    Chat.prototype.chatsArray.forEach(function(chat) {
      openChats[chat.chat_id] = true;
    });
    callback(openChats);
  },

  showChat(element){
    var self = this, newState;
    var parentElement = this.traverseUpToDataset(element, 'role', 'chatWrapper');
    var restoreOption = element.dataset.restore_chat_state;
    if (!parentElement) {
      console.error(new Error('Parent element not found!'));
      return;
    }

    if (!parentElement.dataset.chat_id) {
      console.error(new Error('Chat wrapper does not have chat id!'));
      return;
    }

    var chatId = parentElement.dataset.chat_id;
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

    indexeddb.getByKeyPath(
      chats_bus.collectionDescription,
      null,
      chatId,
      function(getError, chatDescription) {
        if (getError) {
          console.error(getError);
          return;
        }

        if (chatDescription) {
          self.handleChat(chatDescription, restoreOption);
        } else {
          console.error(new Error('Chat with such id not found in the database!'));
        }
      }
    );
  },

  /**
   * chat whether requested chat by its id is opened or not
   */
  isChatOpened: function(chatId) {
    var openedChat;
    Chat.prototype.chatsArray.every(function(_chat) {
      if (_chat.chat_id === chatId) {
        openedChat = _chat;
      }
      return !openedChat;
    });

    return openedChat;
  },

  handleChat(chatDescription, restoreOption){
    let chat = {};
    chat.chat_id = chatDescription.chat_id;
    chat.chatDescription = chatDescription;
    chat.restoreOption = restoreOption;
    Chat.prototype.chatsArray.push(chat);
    event_bus.trigger("changeOpenChats", "CHATS");
    this.forceUpdate()
  },

  createNewChat(){
    var self = this;
    this.get_JSON_res('/api/uuid', function(err, res) {
      if (err) {
        callback(err);
        return;
      }
      let chatDescription = {};
      chatDescription.chat_id = res.uuid;
      self.addNewChatToIndexedDB(chatDescription, function(err, chat) {
        if (err) {
          console.error(err);
          return;
        }
        users_bus.putChatIdAndSave(chatDescription.chat_id, function(err, userInfo) {
          if (err) {
            console.error(err);
            return;
          }

          event_bus.trigger('AddedNewChat', userInfo.chat_ids.length);
          self.handleChat(chatDescription);
        });
      })
    });
  },

  addNewChatToIndexedDB(chat_description, callback) {
    chats_bus.putChatToIndexedDB(chat_description, callback);
  },

  toCloseChat(saveStates, chatId, chatDescription){
    var self = this;
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

  closeChat(description){
    var newState, self = this;
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
            self.destroyChat(description);
            newState = Popup.prototype.handleClose(this.state);
            this.setState(newState);
            break;
        }
      }
    });
  },

  destroyChat(description){
    let position = this.getDestroyChatPosition(description.chat_id);
    Chat.prototype.chatsArray.splice(position, 1);
    event_bus.trigger('chatDestroyed', description.chat_id);
    event_bus.trigger("changeOpenChats");
    this.forceUpdate();
  },

  getDestroyChatPosition(chat_id){
    var destroyChatPosition;
    Chat.prototype.chatsArray.every(function(_chat, index) {
      if (_chat.chat_id === chat_id) {
        destroyChatPosition = index;
      }
      return !destroyChatPosition;
    });

    return destroyChatPosition;
  },

  saveStatesChat(description){
    var newState, self = this;
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
            self.saveStatesChats(description, function(err) {
              if (err) {
                console.error(err);
                return;
              }
            });
            newState = Popup.prototype.handleClose(this.state);
            this.setState(newState);
            break;
        }
      }
    });
  },

  saveStatesChats: function(chat_description, callback) {
    chats_bus.putChatToIndexedDB(chat_description, callback);
  },

  saveAndCloseChat(description){
    var newState, self = this;
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
            self.saveStatesChats(description, function(err) {
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

  render() {
    if (!Chat.prototype.chatsArray.length) {
      return <div className="flex-outer-container" data-role="chat_wrapper"></div>
    } else {
      let items = [];
      Chat.prototype.chatsArray.forEach(function(_chat) {
        items.push(<Chat data={_chat} key={_chat.chat_id}/>);
      });
      return <div className="flex-outer-container" data-role="chat_wrapper">{items}</div>;
    }
  }
});

extend_core.prototype.inherit(ChatsManager, dom_core);
extend_core.prototype.inherit(ChatsManager, ajax_core);

export default ChatsManager;