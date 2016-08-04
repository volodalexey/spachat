import indexeddb from '../js/indexeddb.js'
import id_core from '../js/id_core.js'
import extend_core from '../js/extend_core.js'
import switcher_core from '../js/switcher_core.js'
import html_log_message from '../js/html_log_message.js'
import html_message from '../js/html_message.js'
import users_bus from '../js/users_bus.js'
import webrtc from '../js/webrtc.js'

var Messages = function() {
};

Messages.prototype = {

  setCollectionDescription(chatId){
    return {
      "db_name": users_bus.getUserId(),
      "table_descriptions": [{
        "table_name": chatId + '_messages',
        "table_indexes": [{
          "indexName": 'user_ids',
          "indexKeyPath": 'user_ids',
          "indexParameter": {multiEntry: true}
        }],
        "table_parameter": {autoIncrement: true, keyPath: "id"}
      }, {
        "table_name": chatId + '_log_messages',
        "table_parameter": {keyPath: "id"}
      }]
    };
  },

  getMessageConstructor(mode) {
    var Constructor;

    switch (mode) {
      case "MESSAGES":
        Constructor = html_message;
        break;
      case "LOGGER":
        Constructor = html_log_message;
        break;
    }
    return Constructor;
  },

  getAllMessages(chatId, mode, callback) {
    let description = this.setCollectionDescription(chatId),
      table = this.tableDefinition(mode);
    indexeddb.getAll(
      description,
      table,
      function(err, messages) {
        if (err) {
          callback(err);
        } else {
          callback(null, messages);
        }
      }
    );
  },

  getLastMessage(chatId, mode, callback){
    this.getAllMessages(chatId, mode, function(_err, messages) {
      if (_err) {
        callback(_err);
        return;
      }
      if (messages.length) {
        callback(null, messages[messages.length - 1]);
      } else {
        callback(null, null);
      }
    })
  },

  getCurrentMessage(chatId, messageId, mode, callback){
    let description = this.setCollectionDescription(chatId),
      table = this.tableDefinition(mode);
    indexeddb.getByKeyPath(
      description,
      table,
      messageId,
      function(getError, message) {
        if (getError) {
          callback(getError);
          return;
        }

        callback(null, message);
      }
    );
  },

  /**
   * add message to the database
   */
  addMessage(mode, message, lastChangedDatetime, chatId, lastModifyDatetime, callback) {
    let self = this, Message = this.getMessageConstructor(mode),
      newMessage = (new Message({innerHTML: message})).toJSON();
    this.getLastMessage(chatId, mode, function(_err, lastMessage) {
      if (_err) return console.log(_err);

      newMessage = self.addMessageData(lastMessage, [newMessage], false)[0];
      indexeddb.addOrPutAll(
        'put',
        self.setCollectionDescription(chatId),
        self.tableDefinition(mode),
        [
          newMessage
        ],
        function(error) {
          if (error) {
            if (callback) {
              callback(error);
            } else {
              console.error(error);
            }
            return;
          }

          var messageData = {
            type: "notifyChat",
            from_user_id: users_bus.getUserId(),
            chat_type: "chat_message",
            message: newMessage,
            chat_description: {
              chat_id: chatId,
              lastChangedDatetime: lastChangedDatetime
            },
            lastModifyDatetime: lastModifyDatetime
          };
          webrtc.broadcastChatMessage(chatId, JSON.stringify(messageData));

          callback && callback(error, lastMessage);
        }
      );
    });
  },

  updateMessages(messages, chatId, mode, callback){
    indexeddb.addOrPutAll(
      'put',
      this.setCollectionDescription(chatId),
      this.tableDefinition(mode),
      messages,
      function(error) {
        if (error) return callback(error);
        
        callback();
      }
    );
  },

  addRemoteMessage: function(remoteMessage, mode, chatId, callback) {
    let self = this;
    this.getLastMessage(chatId, mode, function(_err, lastMessage) {
      if (_err) return console.log(_err);

      remoteMessage = self.addMessageData(lastMessage, [remoteMessage], true)[0];
      indexeddb.addOrPutAll(
        'add',
        self.setCollectionDescription(chatId),
        self.tableDefinition(mode),
        [
          remoteMessage
        ],
        function(error) {
          if (error) {
            if (callback) {
              callback(error);
            } else {
              console.error(error);
            }
            return;
          }

          if (callback) {
            callback(error);
          }
        }
      );
    });
  },

  addAllRemoteMessages: function(remoteMessages, mode, chatId, callback) {
    indexeddb.addOrPutAll(
      'add',
      this.setCollectionDescription(chatId),
      this.tableDefinition(mode),
      remoteMessages,
      function(error) {
        if (error) {
          if (callback) {
            callback(error);
          } else {
            console.error(error);
          }
          return;
        }

        if (callback) {
          callback(error);
        }
      }
    );
  },

  addMessageData(lastMessage, newMessages, remote){
    let messagesArray = [];
    newMessages.forEach(function(_newMessage) {
      if (remote) {
        _newMessage = (new html_message(_newMessage)).toJSON();
      }
      if (lastMessage === null) {
        _newMessage.followed_by = {
          user_id: null,
          message_id: null
        };
      } else {
        _newMessage.followed_by = {
          user_id: lastMessage.createdByUserId,
          message_id: lastMessage.messageId
        };
      }
      messagesArray.push(_newMessage);
    });

    return messagesArray;
  },

  getSynchronizeChatMessages: function(_messageData) {
    this.getAllMessages(_messageData.chat_description.chat_id, "MESSAGES", function(_err, messages) {
      let messageData = {
        type: 'syncResponseChatMessages',
        from_user_id: users_bus.getUserId(),
        chat_description: {
          chat_id: _messageData.chat_description.chat_id,
          lastChangedDatetime: _messageData.chat_description.lastChangedDatetime
        },
        owner_request: _messageData.from_user_id,
        messages: messages
      };
      webrtc.broadcastChatMessage(messageData.chat_description.chat_id, JSON.stringify(messageData));
    });
  }

};

extend_core.prototype.inherit(Messages, id_core);
extend_core.prototype.inherit(Messages, switcher_core);

export default Messages;

