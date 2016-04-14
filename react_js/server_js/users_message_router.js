var id_Generator = require('./id_generator');

var Users_message_router = function(wscc) {
  this.wscc = wscc;
};

Users_message_router.prototype = {

  get_user_wscs: function(user_id) {
    var target_wscs = [];
    this.wscc.get_all_wsc().forEach(function(wsc) {
      if (wsc.readyState !== wsc.CLOSED && wsc.has_user_id(user_id)) {
        target_wscs.push(wsc);
      }
    });
    return target_wscs;
  },

  broadcast_user_message: function(user_id, responseData, checkReadyState) {
    var active_wscs = [];
    this.get_user_wscs(user_id).forEach(function(wsc) {
      if (wsc.readyState !== wsc.CLOSED &&
        (!checkReadyState || wsc.ready_state)) {
        responseData.target_ws_device_id = wsc.ws_device_id;
        wsc.send(JSON.stringify(responseData));
        active_wscs.push(wsc);
      }
    });
    return active_wscs;
  },

  get_user_wscs_descrs: function(user_id) {
    return this.get_user_wscs(user_id).filter(function(wsc) {
      return wsc.readyState !== wsc.CLOSED;
    }).map(function(wsc) {
      return {
        user_id: user_id,
        ws_device_id: wsc.get_ws_device_id()
      };
    });
  },

  onDeviceAddUser: function(cur_wsc, parsedMessageData) {
    cur_wsc.put_user_id(parsedMessageData.from_user_id);
    var to_user_wscs_descrs = this.get_user_wscs_descrs(parsedMessageData.to_user_id);
    var from_user_wscs_descrs = this.get_user_wscs_descrs(parsedMessageData.from_user_id);

    var responseData = {
      type: 'user_add',
      from_ws_device_id: cur_wsc.ws_device_id,
      from_user_id: parsedMessageData.from_user_id,
      request_body: parsedMessageData.request_body,
      user_wscs_descrs: from_user_wscs_descrs // send initiator devices to target
    };
    var active = this.broadcast_user_message(parsedMessageData.to_user_id, responseData, true);
    if (active.length) {
      var successData = {
        type: 'user_add_sent',
        from_ws_device_id: cur_wsc.ws_device_id,
        from_user_id: parsedMessageData.from_user_id,
        to_user_id: parsedMessageData.to_user_id,
        request_body: parsedMessageData.request_body
        //user_wscs_descrs: to_user_wscs_descrs
      };
      cur_wsc.send(JSON.stringify(successData));
      console.log('Add user from',
        'ws_device_id = ' + cur_wsc.ws_device_id,
        'to wscs_device_ids = ' + to_user_wscs_descrs.map(function(descr) {
          return descr.ws_device_id;
        })
      )
    } else {
      parsedMessageData.request_type = 'user_add_sent';
      cur_wsc.send_error(new Error('Target connection is not found or not ready!'), parsedMessageData);
    }
  },

  onDeviceToggleReady: function(cur_wsc, parsedMessageData) {
    cur_wsc.put_user_id(parsedMessageData.from_user_id);
    cur_wsc.ready_state = parsedMessageData.ready_state;

    var responseData = {
      type: 'device_toggled_ready',
      from_user_id: parsedMessageData.from_user_id,
      from_ws_device_id: cur_wsc.ws_device_id,
      ready_state: cur_wsc.ready_state
    };

    cur_wsc.send(JSON.stringify(responseData));

    console.log('Device toggled ready state',
      'ws_device_id = ' + cur_wsc.ws_device_id,
      'user_id = ' + responseData.from_user_id,
      'ready_state = ' + cur_wsc.ready_state);
  },

  onDeviceConfirmedFriendship: function(cur_wsc, parsedMessageData) {
    cur_wsc.put_user_id(parsedMessageData.from_user_id);
    var to_user_wscs_descrs = this.get_user_wscs_descrs(parsedMessageData.to_user_id);
    var from_user_wscs_descrs = this.get_user_wscs_descrs(parsedMessageData.from_user_id);
    var responseData = {
      type: 'friendship_confirmed',
      from_user_id: parsedMessageData.from_user_id,
      to_user_id: parsedMessageData.to_user_id,
      request_body: parsedMessageData.request_body,
      user_wscs_descrs: from_user_wscs_descrs
    };
    var active = this.broadcast_user_message(parsedMessageData.to_user_id, responseData);
    if (active.length) {
      console.log('Friendship confirmed from',
        'ws_device_id = ' + cur_wsc.ws_device_id,
        'user_id = ' + parsedMessageData.from_user_id,
        'to user_id = ' + parsedMessageData.to_user_id,
        'wscs_device_ids = ' + to_user_wscs_descrs.map(function(descr) {
          return descr.ws_device_id;
        })
      );
    }
  }
};

module.exports = Users_message_router;