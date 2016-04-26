import indexeddb from '../js/indexeddb.js'
import id_core from '../js/id_core.js'
import extend_core from '../js/extend_core.js'
import event_bus from '../js/event_bus.js'
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
    let description = this.setCollectionDescription(chatId);
    let table = this.tableDefinition(mode);
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

  /**
   * add message to the database
   */
  addMessage(mode, message, chatId, lastModifyDatetime, callback) {
    let self = this,  Message = this.getMessageConstructor(mode),
     _message = (new Message({innerHTML: message})).toJSON();
    indexeddb.addOrPutAll(
      'put',
      this.setCollectionDescription(chatId),
      this.tableDefinition(mode),
      [
        _message
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
          chat_type: "chat_message",
          message: _message,
          chat_description: {
            chat_id: chatId
          },
          lastModifyDatetime: lastModifyDatetime
        };
        webrtc.broadcastChatMessage(chatId, JSON.stringify(messageData));

        callback && callback(error, message);
      }
    );
  },

  addRemoteMessage: function(remoteMessage, mode, chatId, callback) {
    var self = this;
    var message = (new html_message(remoteMessage.message)).toJSON();

    indexeddb.addOrPutAll(
      'add',
      this.setCollectionDescription(chatId),
      this.tableDefinition(mode),
      [
        message
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
  }
};

extend_core.prototype.inherit(Messages, id_core);
extend_core.prototype.inherit(Messages, switcher_core);

export default Messages;

