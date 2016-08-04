import indexeddb from '../js/indexeddb.js'
import users_bus from '../js/users_bus.js'
import event_bus from '../js/event_bus.js'

var Chats_bus = function() {
  // db_name - depends from user id
  this.collectionDescription = {
    "table_descriptions": [{
      "table_name": 'chats',
      "table_parameter": {"keyPath": "chat_id"}
    }]
  };
  this.addEventListeners();
};

Chats_bus.prototype = {

  onSetUserId: function(user_id) {
    this.collectionDescription.db_name = user_id;
  },

  addEventListeners: function() {
    var _this = this;
    _this.removeEventListeners();
    event_bus.on('setUserId', _this.onSetUserId, _this);
  },

  removeEventListeners: function() {
    var _this = this;
    event_bus.off('setUserId', _this.onSetUserId);
  },

  getChats: function(getError, options, chat_ids, _callback) {
    if (chat_ids && chat_ids.length) {
      indexeddb.getByKeysPath(
        this.collectionDescription,
        null,
        chat_ids,
        null,
        function(getError, chatsInfo) {
          if (getError) {
            if (_callback) {
              _callback(getError);
            } else {
              console.error(getError);
            }
            return;
          }

          if (_callback) {
            _callback(null, options, chatsInfo);
          }
        }
      );
    } else {
      _callback(null, options, null);
    }
  },

  getAllChats(getError, _callback){
    indexeddb.getAll(
      this.collectionDescription,
      "chats",
      function(_err, allChats) {
        if (_err) {
          console.error(_err);
          return;
        }
        if (_callback) {
          _callback(getError, allChats);
        }
      }
    );
  },

  getChatContacts: function(chat_id, callback) {
    var _this = this;
    _this.findChatDescriptionById(chat_id, function(error, chat_description) {
      if (error) {
        callback(error);
        return;
      }

      chat_description.user_ids = users_bus.excludeUser(null, chat_description.user_ids);
      users_bus.getContactsInfo(null, chat_description.user_ids, callback);
    });
  },

  findChatDescriptionById: function(chat_id, callback) {
    var _this = this;
    indexeddb.getByKeyPath(
      _this.collectionDescription,
      null,
      chat_id,
      function(getError, chat_description) {
        if (getError) {
          callback(getError);
          return;
        }

        if (!chat_description) {
          callback(new Error('Chat description not found'));
          return;
        }

        callback(null, chat_description);
      }
    );
  },

  putChatToIndexedDB: function(chat_description, callback) {
    indexeddb.addOrPutAll(
      'put',
      this.collectionDescription,
      null,
      [
        chat_description
      ],
      function(error) {
        if (error) {
          callback(error);
          return;
        }

        callback(null, chat_description);
      }
    );
  },

  updateChatField: function(chat_id, chat_field_name, chat_field_value, callback) {
    var _this = this;
    _this.findChatDescriptionById(chat_id, function(error, chat_description) {
      if (error) {
        callback(error);
        return;
      }

      chat_description[chat_field_name] = chat_field_value;
      _this.putChatToIndexedDB(chat_description, callback);
    });
  },

  isDeletedContact(messageData, callback){
    let deleted;
    indexeddb.getByKeyPath(this.collectionDescription, null, messageData.chat_description.chat_id,
      function(getError, chat_description) {
        if (getError) {
          callback(getError);
        } else {
          if (chat_description) {
            deleted = users_bus.hasInArray(chat_description.deleted_user_ids, messageData.from_user_id);
          }
          callback(null, deleted, chat_description, messageData);
        }
      });
  }
};

export default new Chats_bus();

