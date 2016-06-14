var web_socket_connection_model = require('./web_socket_connection_model');
var Chats_message_router = require('./chats_message_router');
var Users_message_router = require('./users_message_router');
var WebRTC_message_router = require('./webrtc_message_router');

var Web_socket_connections_collection = function() {
  this.chats_message_router = new Chats_message_router(this);
  this.users_message_router = new Users_message_router(this);
  this.webrtc_message_router = new WebRTC_message_router(this);

  this.msgMap = {
    chat_create: this.chats_message_router.onDeviceCreateChat,
    chat_join: this.chats_message_router.onDeviceChatJoin,
    chat_join_request: this.chats_message_router.onDeviceChatJoinRequest,
    chat_toggle_ready: this.chats_message_router.onDeviceChatReady,
    user_add: this.users_message_router.onDeviceAddUser,
    user_add_auto: this.users_message_router.onDeviceAddUser,
    user_toggle_ready: this.users_message_router.onDeviceToggleReady,
    friendship_confirmed: this.users_message_router.onDeviceConfirmedFriendship,
    webrtc_offer: this.webrtc_message_router.onDeviceOffer,
    webrtc_answer: this.webrtc_message_router.onDeviceAnswer,
    webrtc_accept: this.webrtc_message_router.onDeviceAccept,
    "/api/chat/websocketconnections": this.chats_message_router.ws_getChatWebSocketsConnections,
    chat_leave: this.chats_message_router.onDeviceChatLeave
  };

  this.contextMap = {
    chat_create: this.chats_message_router,
    chat_join: this.chats_message_router,
    chat_join_request: this.chats_message_router,
    chat_toggle_ready: this.chats_message_router,
    user_add: this.users_message_router,
    user_add_auto: this.users_message_router,
    user_toggle_ready: this.users_message_router,
    friendship_confirmed: this.users_message_router,
    webrtc_offer: this.webrtc_message_router,
    webrtc_answer: this.webrtc_message_router,
    webrtc_accept: this.webrtc_message_router,
    "/api/chat/websocketconnections": this.chats_message_router,
    chat_leave: this.chats_message_router
  };
};

Web_socket_connections_collection.prototype = {

  apply_wss: function(clients) {
    this.clients = clients;
  },

  get_all_wsc: function() {
    if (this.clients) {
      return this.clients;
    } else {
      return [];
    }
  },

  destroy: function() {
    this.clients = null;
    this.chats_message_router = null;
    this.users_message_router = null;
  },

  on_wsc_close: function(wsc) {
    web_socket_connection_model.clean_wsc(wsc);
  },

  on_wsc_open: function(wsc) {
    web_socket_connection_model.apply_new_wsc(wsc);
  },

  on_wsc_message: function(wsc, messageData) {
    var _this = this;
    try {
      var parsedMessageData = JSON.parse(messageData);
    } catch (e) {
      console.error(e);
      return;
    }
    var routeKey;
    if (parsedMessageData.url) {
      routeKey = 'url';
    } else {
      routeKey = 'type';
    }

    var handler = _this.msgMap[parsedMessageData[routeKey]];
    var context = _this.contextMap[parsedMessageData[routeKey]];
    console.log('Received message ' + routeKey + ' => ', parsedMessageData[routeKey]);
    if (handler && context) {
      handler.call(context, wsc, parsedMessageData);
    }
  },

  broadcast_message: function(messageData) {
    this.get_all_wsc().forEach(function(wsc) {
      if (wsc.readyState !== wsc.CLOSED) {
        wsc.send(messageData);
      }
    });
  },

  get_ws_device_wsc: function(ws_device_id) {
    var target_wsc = null;
    this.get_all_wsc().forEach(function(wsc) {
      if (wsc.readyState !== wsc.CLOSED && wsc.ws_device_id === ws_device_id) {
        target_wsc = wsc;
      }
    });
    return target_wsc;
  }
};

module.exports = new Web_socket_connections_collection();