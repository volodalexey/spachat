var WebRTC_message_router = function(wscc) {
  this.wscc = wscc;
};

WebRTC_message_router.prototype = {

  onDeviceOffer: function(cur_wsc, parsedMessageData) {
    var target_wsc = this.wscc.get_ws_device_wsc(parsedMessageData.to_ws_device_id);
    if (!target_wsc) {
      cur_wsc.send_error(new Error('Target connection is not found!'), parsedMessageData);
      return;
    }

    var responseData = {
      type: 'notify_webrtc',
      notify_data: 'handleDevicePassive',
      from_ws_device_id: cur_wsc.ws_device_id,
      from_user_id: parsedMessageData.from_user_id,
      to_ws_device_id: target_wsc.ws_device_id,
      offerDescription: parsedMessageData.offerDescription
    };

    target_wsc.send(JSON.stringify(responseData));

    console.log(
      'Offer from',
      'ws_device_id = ' + cur_wsc.ws_device_id,
      'user_id = ' + responseData.from_user_id,
      'to ws_device_id = ' + target_wsc.ws_device_id);
  },

  onDeviceAnswer: function(cur_wsc, parsedMessageData) {
    var target_wsc = this.wscc.get_ws_device_wsc(parsedMessageData.to_ws_device_id);
    if (!target_wsc) {
      cur_wsc.send_error(new Error('Target connection is not found!'), parsedMessageData);
      return;
    }

    var responseData = {
      type: 'notify_webrtc',
      notify_data: 'handleDeviceAnswer',
      from_ws_device_id: cur_wsc.ws_device_id,
      from_user_id: parsedMessageData.from_user_id,
      to_ws_device_id: target_wsc.ws_device_id,
      answerDescription: parsedMessageData.answerDescription
    };

    target_wsc.send(JSON.stringify(responseData));

    console.log(
      'Answer from',
      'ws_device_id = ' + cur_wsc.ws_device_id,
      'user_id = ' + responseData.from_user_id,
      'to ws_device_id = ' + target_wsc.ws_device_id);
  },

  onDeviceAccept: function(cur_wsc, parsedMessageData) {
    var target_wsc = this.wscc.get_ws_device_wsc(parsedMessageData.to_ws_device_id);
    if (!target_wsc) {
      cur_wsc.send_error(new Error('Target connection is not found!'), parsedMessageData);
      return;
    }

    var responseData = {
      type: 'notify_webrtc',
      notify_data: 'handleDeviceAccept',
      from_ws_device_id: parsedMessageData.ws_device_id,
      from_user_id: parsedMessageData.from_user_id,
      to_ws_device_id: target_wsc.ws_device_id
    };

    target_wsc.send(JSON.stringify(responseData));

    console.log(
      'Accept from',
      'ws_device_id = ' + cur_wsc.ws_device_id,
      'user_id = ' + responseData.from_user_id,
      'to ws_device_id = ' + target_wsc.ws_device_id);
  }
};

module.exports = WebRTC_message_router;