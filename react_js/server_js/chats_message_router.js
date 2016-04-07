var id_Generator = require('./id_generator');

var Chats_message_router = function(wscc) {
  this.wscc = wscc;
};

Chats_message_router.prototype = {

  get_chat_wscs: function(chat_id) {
    var chat_wscs = [];
    this.wscc.get_all_wsc().forEach(function(wsc) {
      if (wsc.readyState !== wsc.CLOSED && wsc.has_chat_id(chat_id)) {
        chat_wscs.push(wsc);
      }
    });
    return chat_wscs;
  },

  broadcast_chat_message: function(chat_id, responseData) {
    var active_wscs = [];
    this.get_chat_wscs(chat_id).forEach(function(wsc) {
      if (wsc.readyState !== wsc.CLOSED) {
        responseData.target_ws_device_id = wsc.ws_device_id;
        wsc.send(JSON.stringify(responseData));
        active_wscs.push(wsc);
      }
    });
    return active_wscs;
  },

  get_chat_wscs_descrs: function(chat_id) {
    return this.get_chat_wscs(chat_id).filter(function(wsc) {
      return wsc.readyState !== wsc.CLOSED;
    }).map(function(wsc) {
      return {
        chat_id: chat_id,
        ws_device_id: wsc.get_ws_device_id()
      };
    });
  },

  onDeviceCreateChat: function(cur_wsc, parsedMessageData) {
    var chat_id = id_Generator.generateId();
    cur_wsc.put_chat_id(chat_id);
    cur_wsc.put_user_id(parsedMessageData.from_user_id);

    var responseData = {
      type: 'chat_created',
      from_user_id: parsedMessageData.from_user_id,
      from_ws_device_id: cur_wsc.ws_device_id,
      chat_description: {
        chat_id: chat_id
      }
    };

    cur_wsc.send(JSON.stringify(responseData));

    console.log('Create chat from',
      'ws_device_id = ' + cur_wsc.ws_device_id,
      'user_id = ' + parsedMessageData.from_user_id,
      'to chat_id = ' + responseData.chat_description.chat_id);
  },

  onDeviceChatJoin: function(cur_wsc, parsedMessageData) {
    cur_wsc.put_chat_id(parsedMessageData.chat_description.chat_id);
    cur_wsc.put_user_id(parsedMessageData.from_user_id);

    var responseData = {
      type: 'chat_joined',
      from_user_id: parsedMessageData.from_user_id,
      from_ws_device_id: cur_wsc.ws_device_id,
      chat_wscs_descrs: this.get_chat_wscs_descrs(parsedMessageData.chat_description.chat_id),
      chat_description: parsedMessageData.chat_description,
      restore_chat_state: parsedMessageData.restore_chat_state
    };

    this.broadcast_chat_message(parsedMessageData.chat_description.chat_id, responseData);

    console.log('Join chat from',
      'ws_device_id = ' + cur_wsc.ws_device_id,
      'user_id = ' + responseData.from_user_id,
      'to chat_id = ' + responseData.chat_description.chat_id);
  },

  onDeviceChatReady: function(cur_wsc, parsedMessageData) {
    cur_wsc.put_user_id(parsedMessageData.from_user_id);
    cur_wsc.put_ready_state(
      'chat_id',
      parsedMessageData.chat_description.chat_id,
      parsedMessageData.ready_state
    );

    var responseData = {
      type: 'notifyChat',
      chat_type: 'chat_toggled_ready',
      from_ws_device_id: cur_wsc.ws_device_id,
      from_user_id: parsedMessageData.from_user_id,
      chat_description: parsedMessageData.chat_description,
      ready_state: parsedMessageData.ready_state
    };

    cur_wsc.send(JSON.stringify(responseData));

    console.log('Device toggled ready chat state',
      'ws_device_id = ' + cur_wsc.ws_device_id,
      'user_id = ' + responseData.from_user_id,
      'chat_id = ' + responseData.chat_description.chat_id,
      'ready_state = ' + parsedMessageData.ready_state);
  },

  onDeviceChatJoinRequest: function(cur_wsc, parsedMessageData) {
    cur_wsc.put_user_id(parsedMessageData.from_user_id);
    var to_chat_wscs_descrs = this.get_chat_wscs_descrs(parsedMessageData.to_chat_id);
    var responseData = {
      type: 'notifyChat',
      chat_type: 'srv_chat_join_request',
      from_ws_device_id: cur_wsc.ws_device_id,
      from_user_id: parsedMessageData.from_user_id,
      request_body: parsedMessageData.request_body,
      chat_description: {
        chat_id: parsedMessageData.to_chat_id
      },
      user_wscs_descrs: [
        {
          chat_id: parsedMessageData.to_chat_id,
          ws_device_id: cur_wsc.get_ws_device_id()
        }
      ]
    };
    console.warn('srv_chat_join_request', responseData);

    var active = this.broadcast_ready_chat_message(parsedMessageData.to_chat_id, responseData);
    if (active.length) {
      var successData = {
        type: 'notifyChat',
        chat_type: 'srv_chat_join_request_sent',
        from_ws_device_id: cur_wsc.ws_device_id,
        from_user_id: parsedMessageData.from_user_id,
        chat_description: {
          chat_id: parsedMessageData.to_chat_id
        },
        request_body: parsedMessageData.request_body
      };
      cur_wsc.send(JSON.stringify(successData));
      console.log('Join to chat request from',
        'ws_device_id = ' + cur_wsc.ws_device_id,
        'from_user_id = ' + parsedMessageData.from_user_id,
        'to wscs_device_ids = ' + to_chat_wscs_descrs.map(function(descr) {
          return descr.ws_device_id;
        })
      )
    } else {
      cur_wsc.send_error(new Error('Target chat connection is not found or not ready!'), parsedMessageData);
    }
  },

  broadcast_ready_chat_message: function(chat_id, responseData) {
    var active_wscs = [];
    this.get_chat_wscs(chat_id).forEach(function(wsc) {
      var found_ready_state = wsc.has_ready_state('chat_id', chat_id);
      if (wsc.readyState !== wsc.CLOSED && found_ready_state.ready_state) {
        responseData.target_ws_device_id = wsc.ws_device_id;
        wsc.send(JSON.stringify(responseData));
        active_wscs.push(wsc);
      }
    });
    return active_wscs;
  },

  ws_getChatWebSocketsConnections: function(cur_wsc, req) {
    var responseData = {
      response_id: req.request_id,
      type: 'response',
      chat_wscs_descrs: this.get_chat_wscs_descrs(req.chat_id)
    };

    cur_wsc.send(JSON.stringify(responseData));
  },

  onDeviceChatLeave: function(cur_wsc, parsedMessageData) {
    cur_wsc.delete_chat_id(parsedMessageData.chat_description.chat_id);
    console.log('Chat leave from',
      'ws_device_id = ' + cur_wsc.ws_device_id,
      'user_id = ' + parsedMessageData.from_user_id,
      'to chat_id = ' + parsedMessageData.chat_description.chat_id);
  }
};

module.exports = Chats_message_router;