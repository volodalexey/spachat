import React from 'react'

import event_bus from '../js/event_bus.js'
import users_bus from '../js/users_bus.js'
import extend_core from '../js/extend_core.js'
import dom_core from '../js/dom_core.js'
import indexeddb from '../js/indexeddb.js'
import chats_bus from '../js/chats_bus.js'
import ajax_core from '../js/ajax_core.js'
import messages from '../js/messages.js'

import Chat from '../components/chat'
import Popup from '../components/popup'

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

    this.mainConteiner = document.querySelector('[data-role="main_container"]');
  },

  componentWillUnmount: function() {
    event_bus.off('showChat', this.showChat);
    event_bus.off('addNewChatAuto', this.createNewChat);
    event_bus.off('getOpenChats', this.getOpenChats);
    event_bus.off('toCloseChat', this.toCloseChat);
    event_bus.off('chatsDestroy', this.destroyChats);

    this.mainConteiner = null;
  },

  getOpenChats: function(callback) {
    let openChats = {};
    Chat.prototype.chatsArray.forEach(function(chat) {
      openChats[chat.chat_id] = true;
    });
    callback(openChats);
  },

  showChat: function(element) {
    let self = this, newState,
      parentElement = this.traverseUpToDataset(element, 'role', 'chatWrapper'),
      restoreOption = element.dataset.restore_chat_state;
    if (!parentElement) {
      console.error(new Error('Parent element not found!'));
      return;
    }

    if (!parentElement.dataset.chat_id) {
      console.error(new Error('Chat wrapper does not have chat id!'));
      return;
    }

    let chatId = parentElement.dataset.chat_id;
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
          self.handleChat(chatDescription, restoreOption, false);
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
    let openedChat;
    Chat.prototype.chatsArray.every(function(_chat) {
      if (_chat.chat_id === chatId) {
        openedChat = _chat;
      }
      return !openedChat;
    });

    return openedChat;
  },

  handleChat: function(chatDescription, restoreOption, newChat) {
    let self = this, chat = {};
    chat.chat_id = chatDescription.chat_id;
    chat.chatDescription = chatDescription;
    chat.restoreOption = restoreOption;
    Chat.prototype.chatsArray.push(chat);
    let description = messages.prototype.setCollectionDescription(chatDescription.chat_id);
    indexeddb.open(description, newChat, function(err) {
      if (err) {
        console.error(err);
        return;
      }

      event_bus.trigger("changeOpenChats", "CHATS");
      self.forceUpdate();
    });
  },

  createNewChat: function() {
    let self = this;
    this.get_JSON_res('/api/uuid', function(err, res) {
      if (err) {
        callback(err);
        return;
      }
      let chatDescription = {};
      chatDescription.chat_id = res.uuid;
      chatDescription.user_ids = [];
      chatDescription.user_ids.push(users_bus.getUserId());
      self.addNewChatToIndexedDB(chatDescription, function(err) {
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
          self.handleChat(chatDescription, null, true);
        });
      })
    });
  },

  addNewChatToIndexedDB: function(chat_description, callback) {
    chats_bus.putChatToIndexedDB(chat_description, callback);
  },

  toCloseChat: function(saveStates, chatId) {
    let self = this;
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

  closeChat: function(description) {
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
            self.destroyChat(description);
            newState = Popup.prototype.handleClose(this.state);
            this.setState(newState);
            break;
        }
      }
    });
  },

  destroyChat: function(description) {
    let position = this.getDestroyChatPosition(description.chat_id);
    Chat.prototype.chatsArray.splice(position, 1);
    event_bus.trigger('chatDestroyed', description.chat_id);
    event_bus.trigger("changeOpenChats");
    this.forceUpdate();
  },

  destroyChats: function() {
    Chat.prototype.chatsArray = [];
  },

  getDestroyChatPosition: function(chat_id) {
    let destroyChatPosition;
    Chat.prototype.chatsArray.every(function(_chat, index) {
      if (_chat.chat_id === chat_id) {
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