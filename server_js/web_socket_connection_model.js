var id_Generator = require('./id_generator');

var Web_socket_connection_model = function(wsConnection) {
};

Web_socket_connection_model.prototype = {

  apply_new_wsc: function(wsc) {
    wsc.ws_device_id = id_Generator.generateId(); // temp device id until the device send offer
    wsc.chats_ids = [];
    wsc.users_ids = [];
    wsc.ready_states = [];
    wsc.__proto__.put_user_id = Web_socket_connection_model.prototype.put_user_id;
    wsc.__proto__.put_chat_id = Web_socket_connection_model.prototype.put_chat_id;
    wsc.__proto__.delete_chat_id = Web_socket_connection_model.prototype.delete_chat_id;
    wsc.__proto__.send_error = Web_socket_connection_model.prototype.send_error;
    wsc.__proto__.has_user_id = Web_socket_connection_model.prototype.has_user_id;
    wsc.__proto__.has_chat_id = Web_socket_connection_model.prototype.has_chat_id;
    wsc.__proto__.get_ws_device_id = Web_socket_connection_model.prototype.get_ws_device_id;
    wsc.__proto__.has_ready_state = Web_socket_connection_model.prototype.has_ready_state;
    wsc.__proto__.put_ready_state = Web_socket_connection_model.prototype.put_ready_state;
  },

  clean_wsc: function(wsc) {
    wsc.ws_device_id = null;
    wsc.chats_ids = null;
    wsc.users_ids = null;
    wsc.ready_states = null;
    wsc.__proto__.put_user_id = null;
    wsc.__proto__.put_chat_id = null;
    wsc.__proto__.delete_chat_id = null;
    wsc.__proto__.send_error = null;
    wsc.__proto__.has_user_id = null;
    wsc.__proto__.has_chat_id = null;
    wsc.__proto__.get_ws_device_id = null;
    wsc.__proto__.has_ready_state = null;
    wsc.__proto__.put_ready_state = null;
  },

  has_user_id: function(user_id) {
    var foundUserId = false;
    var wsc = this;
    wsc.users_ids.every(function(_user_id) {
      if (_user_id === user_id) {
        foundUserId = _user_id;
      }
      return !foundUserId;
    });
    return foundUserId;
  },

  has_chat_id: function(chat_id) {
    var foundChatId = false;
    var wsc = this;
    wsc.chats_ids.every(function(_chat_id) {
      if (_chat_id === chat_id) {
        foundChatId = _chat_id;
      }

      return !foundChatId;
    });
    return foundChatId;
  },

  put_user_id: function(user_id) {
    var wsc = this;
    if (wsc.has_user_id(user_id) === false) {
      wsc.users_ids.push(user_id);
    }
  },

  put_chat_id: function(chat_id) {
    var wsc = this;
    if (wsc.has_chat_id(chat_id) === false) {
      wsc.chats_ids.push(chat_id);
    }
  },

  delete_chat_id: function(chat_id) {
    var wsc = this;
    if (wsc.has_chat_id(chat_id)) {
      wsc.chats_ids.splice(wsc.chats_ids.indexOf(chat_id), 1);
    }
  },

  send_error: function(error, parsedMessageData) {
    var wsc = this;
    console.log(error);
    var strErr = JSON.stringify({
      message: error.toString(),
      type: "error",
      request_type: parsedMessageData.request_type,
      chat_description: parsedMessageData.chat_description
    });
    if (wsc.readyState !== wsc.CLOSED) {
      wsc.send(strErr);
    } // TODO remove from connections?
  },

  get_ws_device_id: function() {
    var wsc = this;
    return wsc.ws_device_id;
  },

  has_ready_state: function(state_key, state_value) {
    var found_ready_state = false;
    var wsc = this;
    wsc.ready_states.every(function(_ready_state) {
      if (_ready_state[state_key] === state_value) {
        found_ready_state = _ready_state;
      }

      return !found_ready_state;
    });
    return found_ready_state;
  },

  put_ready_state: function(state_key, state_value, ready_state) {
    var wsc = this;
    var found_ready_state = wsc.has_ready_state(state_key, state_value);
    if (found_ready_state) {
      found_ready_state.ready_state = ready_state;
    } else {
      var new_ready_state = {};
      new_ready_state[state_key] = state_value;
      new_ready_state.ready_state = ready_state;
      this.ready_states.push(new_ready_state);
    }
  }
};

module.exports = new Web_socket_connection_model();