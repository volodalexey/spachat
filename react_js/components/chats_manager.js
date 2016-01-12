import React from 'react'

import event_bus from '../js/event_bus.js'
import users_bus from '../js/users_bus.js'
import extend_core from '../js/extend_core.js'
import dom_core from '../js/dom_core.js'
import indexeddb from '../js/indexeddb.js'
import websocket from '../js/websocket.js'
import chats_bus from '../js/chats_bus.js'
import disable_display_core from '../js/disable_display_core.js'
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

    this.mainConteiner = document.querySelector('[data-role="main_container"]');
    this.chatResizeContainer = document.querySelector('[data-role="chat_resize_container"]');
    this.lineResize = this.chatResizeContainer.querySelector('[data-role="resize_line"]');
  },

  componentWillUnmount(){
    event_bus.off('showChat', this.showChat);
    event_bus.off('addNewChatAuto', this.createNewChat);
    event_bus.off('getOpenChats', this.getOpenChats);

    this.mainConteiner = null;
    this.chatResizeContainer = null;
    this.lineResize = null;
  },

  getOpenChats: function(callback) {
    var openChats = {};
    this.state.chatsArray.forEach(function(chat) {
      openChats[chat.chat_id] = true;
    });
    callback(openChats);
  },

  showChat(element){
    var self = this, newState;
    var parentElement = this.traverseUpToDataset(element, 'role', 'chatWrapper');
    var controlButtons = Array.prototype.slice.call(parentElement.querySelectorAll('button[data-mode="DETAIL_VIEW"]'));
    var restoreOptions = element.dataset.restore_chat_state;
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

    this.hideUIButton(chatId, controlButtons);

    indexeddb.getByKeyPath(
      chats_bus.collectionDescription,
      null,
      chatId,
      function(getError, chatDescription) {
        if (getError) {
          console.error(getError);
          self.unHideUIButton(chatId);
          return;
        }

        if (chatDescription) {
          self.handleChat(chatDescription);
        } else {
          console.error(new Error('Chat with such id not found in the database!'));
          self.unHideUIButton(chatId);
        }
      }
    );
  },

  /**
   * chat whether requested chat by its id is opened or not
   */
  isChatOpened: function(chatId) {
    var openedChat;
    this.state.chatsArray.every(function(_chat) {
      if (_chat.chat_id === chatId) {
        openedChat = _chat;
      }
      return !openedChat;
    });

    return openedChat;
  },

  handleChat(chatDescription){
    this.state.chatsArray.push(chatDescription);
    this.setState({chatsArray: this.state.chatsArray});
    event_bus.trigger("changeOpenChats");
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

  toCloseChat(chatToDestroy, saveStates){
    switch (saveStates) {
      case 'close':
        this.closeChat(chatToDestroy);
        break;
      case 'save':
        this.saveStatesChat(chatToDestroy);
        break;
      case 'save_close':
        this.saveAndCloseChat(chatToDestroy);
        break;
    }
  },

  closeChat(chatToDestroy){
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
            newState = Popup.prototype.handleClose(this.state);
            this.setState(newState);
            self.destroyChat(chatToDestroy);
            break;
        }
      }
    });
  },

  destroyChat(chatToDestroy){
    this.state.chatsArray.splice(this.state.chatsArray.indexOf(chatToDestroy), 1);
    this.setState({"chatsArray": this.state.chatsArray});
    event_bus.trigger('chatDestroyed', chatToDestroy.chat_id);
    event_bus.trigger("changeOpenChats");
  },

  saveStatesChat(chatToDestroy){

  },

  saveAndCloseChat(chatToDestroy){

  },

  render() {
    let onEvent = {
      toCloseChat: this.toCloseChat
    };
    if (!this.state.chatsArray.length) {
      return <div className="flex-outer-container" data-role="chat_wrapper"></div>
    } else {
      let items = [];
      this.state.chatsArray.forEach(function(_chat) {
        items.push(<Chat data={_chat} key={_chat.chat_id} onEvent={onEvent}/>);
      });
      return <div className="flex-outer-container" data-role="chat_wrapper">{items}</div>;
    }
  }
});

extend_core.prototype.inherit(ChatsManager, dom_core);
extend_core.prototype.inherit(ChatsManager, ajax_core);
extend_core.prototype.inherit(ChatsManager, disable_display_core);

export default ChatsManager;