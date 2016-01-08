import React from 'react'

import event_bus from '../js/event_bus.js'
import users_bus from '../js/users_bus.js'
import extend_core from '../js/extend_core.js'
import dom_core from '../js/dom_core.js'
import indexeddb from '../js/indexeddb.js'
import websocket from '../js/websocket.js'
import chats_bus from '../js/chats_bus.js'
import disable_display_core from '../js/disable_display_core.js'

import Chat from '../components/chat'
import Popup from '../components/popup'

const ChatsManager = React.createClass({
  getDefaultProps(){
    return {
      minChatsWidth: 350,
      minMove: 5,
      chatsArray: [],
      openedChatsArray: [],
      UIElements: {},
      withPanels: true
    }
  },

  componentDidMount(){
    event_bus.on('showChat', this.showChat, this);
    event_bus.on('addNewChatAuto', this.addNewChatAuto, this);
    event_bus.on('notifyChat', this.onChatMessageRouter, this);


    this.mainConteiner = document.querySelector('[data-role="main_container"]');
    this.chatResizeContainer = document.querySelector('[data-role="chat_resize_container"]');
    this.lineResize = this.chatResizeContainer.querySelector('[data-role="resize_line"]');
  },

  componentWillUnmount(){
    event_bus.off('showChat', this.showChat);
    event_bus.off('addNewChatAuto', this.addNewChatAuto);
    event_bus.off('notifyChat', this.onChatMessageRouter);

    this.mainConteiner = null;
    this.chatResizeContainer = null;
    this.lineResize = null;
  },

  getOpenChats: function(callback) {
    var openChats = {};
    this.props.chatsArray.forEach(function(chat) {
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
    if(this.isChatOpened(chatId)){
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
          self.unHideUIButton(chat_id);
          return;
        }

        if (chatDescription) {
          //websocket.sendMessage({
          //  type: "chat_join",
          //  from_user_id: users_bus.getUserId(),
          //  chat_description: {
          //    chat_id: chatDescription.chat_id
          //  },
          //  restore_chat_state: restore_options
          //});
        } else {
          console.error(new Error('Chat with such id not found in the database!'));
          self.unHideUIButton(chatId);
        }
      }
    );


  },

  isChatOpened: function(chat_id) {
    var openedChat;
    this.props.chatsArray.every(function(_chat) {
      if (_chat.chat_id === chat_id) {
        openedChat = _chat;
      }
      return !openedChat;
    });

    return openedChat;
  },

  /**
   * handle message from web-socket (if it is connected with chats some how)
   */
  onChatMessageRouter: function(messageData) {
    var self = this;

    switch (messageData.type) {
      case 'chat_created':
        self.chatCreateApproved(messageData);
        break;
      case 'chat_joined':
        self.chatJoinApproved(messageData);
        break;
      case 'notifyChat':
        Chat.prototype.chatsArray.forEach(function(_chat) {
          if (messageData.chat_description.chat_id === _chat.chat_id) {
            _chat.trigger(messageData.chat_type, messageData);
          }
        });
        break;
    }
  },

  /**
   * sends future chat description to the server to check if such chat is already exists on the server
   * @param event - click event
   */
  addNewChatAuto: function(event) {
    if (!this.mainConteiner || !websocket) {
      return;
    }

    websocket.sendMessage({
      type: "chat_create",
      from_user_id: users_bus.getUserId()
    });
    //

  },

  /**
   * received confirmation from server or from webrtc connection
   * save into indexedDB
   */
  chatCreateApproved: function(event) {
    var self = this;
    if (event.from_ws_device_id) {
      event_bus.set_ws_device_id(event.from_ws_device_id);
    }

    self.addNewChatToIndexedDB(event.chat_description, function(err, chat) {
      if (err) {
        console.error(err);
        return;
      }

      users_bus.putChatIdAndSave(chat.chat_id, function(err, userInfo) {
        if (err) {
          console.error(err);
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
      });
    });
  },

  render() {
    return (<Chat />)
  }
});

extend_core.prototype.inherit(ChatsManager, dom_core);
extend_core.prototype.inherit(ChatsManager, disable_display_core);

export default ChatsManager;