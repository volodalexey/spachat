import websocket from '../js/websocket'
import event_core from '../js/event_core'
import extend_core from '../js/extend_core'
import event_bus from '../js/event_bus'
import users_bus from '../js/users_bus'
import chats_bus from '../js/chats_bus'
import sync_core from '../js/sync_core'
import Connection from '../js/connection'

var WebRTC = function() {
  this.configuration = {
    RTC: {
      "iceServers": [
        {"url": "stun:23.21.150.121"}
      ]
    },
    constraints: {
      "optional": [
        {"DtlsSrtpKeyAgreement": true}
      ]
    }
  };
  this.connections = [];
  this.addEventListeners();
};

WebRTC.prototype = {

  addEventListeners: function() {
    this.removeEventListeners();
    event_bus.on('chatDestroyed', this.destroyConnectionChat, this);
    event_bus.on('connectionDestroyed', this.onConnectionDestroyed, this);
    event_bus.on('web_socket_message', this.onWebSocketMessage, this);
  },

  removeEventListeners: function() {
    event_bus.off('chatDestroyed', this.destroyConnectionChat);
    event_bus.off('connectionDestroyed', this.onConnectionDestroyed);
    event_bus.off('web_socket_message', this.onWebSocketMessage);
  },

  createConnection: function(options) {
    var connection = new Connection(options);
    this.connections.push(connection);
    event_bus.trigger('changeConnection');
    return connection;
  },

  getConnection: function(ws_device_id) {
    var connection;
    this.connections.every(function(_connection) {
      if (_connection.ws_device_id === ws_device_id) {
        connection = _connection;
      }
      return !connection;
    });

    return connection;
  },

  getConnectionByUserId: function(user_id) {
    var connection, user;
    this.connections.every(function(_connection) {

      _connection.users_ids.every(function(_user) {
        if (_user === user_id) {
          user = _user;
        }

        return !user;
      });

      if (user) {
        connection = _connection;
      }

      return !connection;
    });

    return connection;
  },

  getAllConnections: function() {
    return this.connections;
  },

  /**
   * this function is invoked when chat was created or joined
   */
  handleConnectedDevices: function(wscs_descrs) {
    var self = this;
    if (!wscs_descrs && !Array.isArray(wscs_descrs)) {
      return;
    }
    wscs_descrs.forEach(function(ws_descr) {
      self.handleDeviceActive(ws_descr);
    });
  },

  handleDeviceActive: function(ws_descr) {
    var self = this;
    if (event_bus.ws_device_id === ws_descr.ws_device_id) {
      console.warn('the information about myself');
      return;
    }

    var connection = self.getConnection(ws_descr.ws_device_id);
    if (connection && connection.canApplyNextState() === false) {
      connection.storeContext(ws_descr);
      self.trigger('webrtc_connection_established', connection);
      return;
    }
    if (!connection) {
      // if connection with such ws_device_id not found create offer for this connection
      connection = self.createConnection({
        ws_device_id: ws_descr.ws_device_id
      });
    }
    // change readyState for existing connection
    connection.active.readyState = Connection.prototype.readyStates.WILL_CREATE_OFFER;
    connection.storeContext(ws_descr);
    self.onActiveChangeState(connection);
  },

  /**
   * server stored local offer for current chat
   * need to join this offer of wait for connections if current user is creator
   */
  handleDevicePassive: function(messageData) {
    var self = this;
    if (event_bus.get_ws_device_id() === messageData.from_ws_device_id) {
      console.warn('the information about myself');
      return;
    }
    var connection = self.getConnection(messageData.from_ws_device_id);
    if (connection && connection.canApplyNextState() === false) {
      connection.storeContext(messageData);
      return;
    }

    if (!connection) {
      // if connection with such ws_device_id not found create answer for offer
      connection = self.createConnection({
        ws_device_id: messageData.from_ws_device_id
      });
    }
    // change readyState for existing connection
    connection.passive.readyState = Connection.prototype.readyStates.WILL_CREATE_ANSWER;
    connection.passive.remoteOfferDescription = messageData.offerDescription;
    connection.storeContext(messageData);
    self.onPassiveChangeState(connection);
  },

  handleDeviceAnswer: function(messageData) {
    var _this = this;
    // I am NOT the creator of server stored answer
    if (event_bus.get_ws_device_id() === messageData.from_ws_device_id) {
      console.warn('the information about myself');
      return;
    }

    var connection = _this.getConnection(messageData.from_ws_device_id);
    if (connection && connection.canApplyNextState() === false) {
      connection.storeContext(messageData);
      return;
    } else if (!connection) {
      console.error(new Error('Answer for connection thet is not exist!'));
    }

    if (event_bus.get_ws_device_id() === messageData.to_ws_device_id) {
      // Accept answer if I am the offer creator
      connection.active.readyState = Connection.prototype.readyStates.WILL_ACCEPT_ANSWER;
      connection.active.remoteAnswerDescription = messageData.answerDescription;
      connection.storeContext(messageData);
      _this.onActiveChangeState(connection);
    }
  },

  extractSDPDeviceId: function(RTCSessionDescription) {
    return RTCSessionDescription.sdp.match(/a=fingerprint:sha-256\s*(.+)/)[1];
  },

  onActiveICECandidate: function(curConnection, result) {
    if (!curConnection.active) {
      curConnection.log('error', {message: "Aborted create offer! Connection doesn't have active "});
      return;
    }

    curConnection.active.readyState = Connection.prototype.readyStates.WAITING;
    curConnection.sendToWebSocket({
      type: 'webrtc_offer',
      from_user_id: users_bus.getUserId(),
      from_ws_device_id: event_bus.get_ws_device_id(),
      to_ws_device_id: curConnection.getWSDeviceId(),
      offerDescription: result.peerConnection.localDescription
    });
  },

  onLocalOfferCreated: function(curConnection, createError, result) {
    if (createError) {
      curConnection.log('error', {message: createError});
      return;
    }
    if (!curConnection.active) {
      curConnection.log('error', {message: "Aborted create offer! Connection doesn't have active "});
      return;
    }

    curConnection.active.peerConnection = result.peerConnection;
    curConnection.active.dataChannel = result.dataChannel;
    curConnection.log('log', {message: 'done: createLocalOfferAuto'});
  },

  onAcceptedRemoteAnswer: function(curConnection, createError) {
    if (createError) {
      curConnection.log('error', {message: createError});
      return;
    }
    if (!curConnection.active) {
      curConnection.log('error', {message: "Aborted accept answer! Connection doesn't have active "});
      return;
    }

    curConnection.sendToWebSocket({
      type: 'webrtc_accept',
      from_user_id: users_bus.getUserId(),
      from_ws_device_id: event_bus.get_ws_device_id(),
      to_ws_device_id: curConnection.getWSDeviceId()
    });
  },

  onActiveChangeState: function(curConnection) {
    var _this = this;
    switch (curConnection.active.readyState) {
      case Connection.prototype.readyStates.WILL_CREATE_OFFER:
        curConnection.active.readyState = Connection.prototype.readyStates.CREATING_OFFER;
        _this.createLocalOfferAuto(
          curConnection,
          _this.onActiveICECandidate.bind(_this, curConnection),
          _this.onLocalOfferCreated.bind(_this, curConnection)
        );
        break;
      case Connection.prototype.readyStates.WILL_ACCEPT_ANSWER:
        curConnection.active.readyState = Connection.prototype.readyStates.ACCEPTING_ANSWER;
        _this.acceptRemoteAnswerAuto(
          curConnection,
          _this.onAcceptedRemoteAnswer.bind(_this, curConnection)
        );
        break;
    }
  },

  onPassiveICECandidate: function(curConnection, result) {
    var _this = this;
    if (!curConnection.passive) {
      curConnection.log('error', {message: "Aborted create offer! Connection doesn't have passive "});
      return;
    }

    //curConnection.passive.peerConnection.ondatachannel = _this.onReceivedDataChannel.bind(_this, curConnection);
    curConnection.passive.readyState = Connection.prototype.readyStates.WAITING;
    curConnection.sendToWebSocket({
      type: 'webrtc_answer',
      from_user_id: users_bus.getUserId(),
      from_ws_device_id: event_bus.get_ws_device_id(),
      to_ws_device_id: curConnection.getWSDeviceId(),
      answerDescription: result.peerConnection.localDescription
    });
  },

  onLocalAnswerCreated: function(curConnection, createError, result) {
    if (createError) {
      curConnection.log('error', {message: createError});
      return;
    }
    if (!curConnection.passive) {
      curConnection.log('error', {message: "Aborted create offer! Connection doesn't have passive "});
      return;
    }

    curConnection.passive.peerConnection = result.peerConnection;
    curConnection.log('log', {message: 'done: createLocalAnswerAuto'});
  },

  onPassiveChangeState: function(curConnection) {
    var _this = this;
    switch (curConnection.passive.readyState) {
      case Connection.prototype.readyStates.WILL_CREATE_ANSWER:
        curConnection.passive.readyState = Connection.prototype.readyStates.CREATING_ANSWER;
        _this.createLocalAnswerAuto(
          curConnection,
          _this.onPassiveICECandidate.bind(_this, curConnection),
          _this.onLocalAnswerCreated.bind(_this, curConnection)
        );
        break;
    }
  },

  /**
   * create offer session description protocol (sdp)
   * when internet connection will be established
   * sdp will be sent to the server
   */
  createLocalOfferAuto: function(curConnection, onICECandidate, callback) {
    var _this = this;
    _this.createRTCPeerConnection(
      curConnection,
      onICECandidate,
      function(createError, peerConnection) {
        if (createError) {
          callback(createError);
          return;
        }

        _this.createLocalOffer(curConnection, peerConnection, callback);
      }
    );
  },

  /**
   * create answer session description protocol
   * when internet connection will be established
   * sdp will be sent to the server
   */
  createLocalAnswerAuto: function(curConnection, onICECandidate, callback) {
    var _this = this;
    _this.createRTCPeerConnection(
      curConnection,
      onICECandidate,
      function(createError, peerConnection) {
        if (createError) {
          callback(createError);
          return;
        }

        _this.createLocalAnswer(curConnection, peerConnection, callback);
      }
    );
  },

  acceptRemoteAnswerAuto: function(curConnection, callback) {
    var _this = this;
    curConnection.log('log', {message: 'try: acceptRemoteAnswerAuto:setRemoteDescription'});
    try {
      var _RTCSessionDescription = window.webkitRTCSessionDescription || window.mozRTCSessionDescription ||
        window.RTCSessionDescription;
      var remoteAnswerDescription = new _RTCSessionDescription(curConnection.active.remoteAnswerDescription);
      curConnection.active.peerConnection.setRemoteDescription(remoteAnswerDescription);
    } catch (error) {
      if (callback) {
        callback(error);
      }
      return;
    }

    curConnection.log('log', {message: 'done: acceptRemoteAnswerAuto:setRemoteDescription'});
    if (callback) {
      callback(null);
    }
  },

  /**
   * each time client tries to define its address
   */
  _onICECandidate: function(curConnection, peerConnection, onICECandidate, event) {
    if (event.candidate == null) {
      curConnection.log('log', {message: 'done: ICE candidate'});
      if (onICECandidate) {
        onICECandidate({
          peerConnection: peerConnection
        });
      }
    } else {
      curConnection.log('log', {message: 'next: ICE candidate'});
    }
  },

  _onReceivedDataChannel: function(curConnection, event) {
    curConnection.log('log', {message: 'Data Channel received'});
    if (!curConnection.passive) {
      this._removeDataChannelListeners(event.channel);
      return;
    }
    curConnection.passive.dataChannel = event.channel;
    this._addDataChannelListeners(curConnection.passive.dataChannel, curConnection, 'passive');
  },

  _onICEConnectionStateChange: function(curConnection, event) {
    if (event.target.iceConnectionState === 'disconnected') {
      console.warn('Peer connection was disconnected', event);
      curConnection.destroy();
      curConnection.destroyTrigger();
    } else {
      console.log('oniceconnectionstatechange', event.target.iceConnectionState);
    }
  },

  _addPeerConnectionListeners: function(peerConnection, curConnection, onICECandidate) {
    if (!peerConnection) {
      return;
    }
    var _this = this;
    _this._removePeerConnectionListeners(peerConnection);

    peerConnection.ondatachannel = _this._onReceivedDataChannel.bind(_this, curConnection);
    peerConnection.onicecandidate = _this._onICECandidate.bind(_this, curConnection, peerConnection, onICECandidate);
    peerConnection.oniceconnectionstatechange = _this._onICEConnectionStateChange.bind(_this, curConnection);
    //peerConnection.onnegotiationneeded = function(ev) { console.log('onnegotiationneeded', ev); };
    peerConnection.onsignalingstatechange = function(ev) {
      console.log('onsignalingstatechange', ev.target.signalingState);
    };
  },

  _removePeerConnectionListeners: function(peerConnection) {
    if (!peerConnection) {
      return;
    }
    var _this = this;

    peerConnection.ondatachannel = null;
    peerConnection.onicecandidate = null;
    peerConnection.oniceconnectionstatechange = null;
    //peerConnection.onnegotiationneeded = null;
    peerConnection.onsignalingstatechange = null;
  },

  /**
   * create peer connection and pass it to the device id state
   */
  createRTCPeerConnection: function(curConnection, onICECandidate, callback) {
    var _this = this;
    curConnection.log('log', {message: 'try: createRTCPeerConnection'});
    try {
      var _peerConnection = window.webkitPeerConnection00 || window.webkitRTCPeerConnection || window.mozRTCPeerConnection ||
        window.RTCPeerConnection || window.PeerConnection;
      var peerConnection = new _peerConnection(_this.configuration.RTC, _this.configuration.constraints);
    } catch (error) {
      if (callback) {
        callback(error);
      }
      return;
    }

    _this._addPeerConnectionListeners(peerConnection, curConnection, onICECandidate);

    curConnection.log('log', {message: 'done: createRTCPeerConnection'});
    if (callback) {
      callback(null, peerConnection);
    }
  },

  notMode: function(mode) {
    if (mode === 'active') {
      return 'passive';
    } else if (mode === 'passive') {
      return 'active';
    }
  },

  onDataChannelOpen: function(curConnection, activeOrPassive) {
    if (curConnection[activeOrPassive]) {
      curConnection.log('log', {message: 'Data channel connection opened!'});
      curConnection.dataChannel = curConnection[activeOrPassive].dataChannel;
      curConnection.peerConnection = curConnection[activeOrPassive].peerConnection;
      var notMode = this.notMode(activeOrPassive);
      this._removePeerConnectionListeners(curConnection[notMode].peerConnection);
      this._removeDataChannelListeners(curConnection[notMode].dataChannel);
      curConnection.setDefaultActive();
      curConnection.setDefaultPassive();
      this.trigger('webrtc_connection_established', curConnection);
    } else {
      curConnection.log('log', {message: 'fail to set data channel for ' + activeOrPassive});
    }
  },

  onDataChannelMessage: function(curConnection, event) {
    try {
      var messageData = JSON.parse(event.data);
    } catch (e) {
      console.error(e);
      return;
    }

    users_bus.isDeletedUser(messageData, function(err, deleted_user, userInfo, messageData) {
      if (err) return console.error(err);

      if (messageData.type === 'notifyUser') {
        event_bus.trigger('notifyUser', messageData);
      }
      if (deleted_user) return;

      if (messageData.lastModifyDatetime) {
        sync_core.needSyncUserData(messageData, userInfo);
      }

      if (messageData.type === 'syncRequestUserData') {
        sync_core.requestUserData(messageData);
      } else if (messageData.type === 'syncResponseUserData') {
        sync_core.responseUserData(messageData, userInfo);
      }
      
      if(!messageData.chat_description) return;
      chats_bus.isDeletedContact(messageData, function(err, deleted_user, chat_description, messageData) {
        if(err) return console.error(err);
        
        if (!chat_description && messageData.type === 'chatJoinApproved') {
          event_bus.trigger('chatJoinApproved', messageData);
          return;
        }
        
        if(!chat_description || deleted_user && messageData.chat_type !== "user_restore_in_chat_response") return;

        if(chat_description && chat_description.is_deleted) return;

        if (messageData.chat_description && messageData.chat_description.lastChangedDatetime) {
          sync_core.needSyncChatDescription(messageData, chat_description);
        }
        if (messageData.type === 'notifyChat') {
          event_bus.trigger('notifyChat', messageData);
        } else if (messageData.type === 'syncRequestChatData') {
          sync_core.requestChatData(messageData);
        } else if (messageData.type === 'syncResponseChatData') {
          sync_core.responseChatData(messageData);
        } else if (messageData.type === 'syncLeftUsersChats') {
          sync_core.syncLeftUsersChats(messageData);
        } else if (messageData.type === 'syncRequestChatMessages') {
          event_bus.trigger('getSynchronizeChatMessages', messageData);
        } else if (messageData.type === 'syncResponseChatMessages') {
          event_bus.trigger('syncResponseChatMessages', messageData);
        }
      });
    });
  },

  onDataChannelClose: function(curConnection, event) {
    this._removeDataChannelListeners(curConnection.dataChannel);
    this.connections.splice(this.connections.indexOf(curConnection), 1);
    event_bus.trigger('changeConnection');
    console.warn('Data channel was closed', event);
  },

  onDataChannelError: function(curConnection, event) {
    console.error('Data channel error', event);
  },

  _addDataChannelListeners: function(dataChannel, curConnection, activeOrPassive) {
    var _this = this;
    if (!dataChannel) {
      console.error(new Error('Data channel is not provided!'));
      return;
    }
    _this._removeDataChannelListeners(dataChannel);

    dataChannel.onopen = _this.onDataChannelOpen.bind(_this, curConnection, activeOrPassive);
    dataChannel.onmessage = _this.onDataChannelMessage.bind(_this, curConnection);
    dataChannel.onclose = _this.onDataChannelClose.bind(_this, curConnection);
    dataChannel.onerror = _this.onDataChannelError.bind(_this, curConnection);
  },

  _removeDataChannelListeners: function(dataChannel) {
    if (!dataChannel) {
      return;
    }

    dataChannel.onopen = null;
    dataChannel.onmessage = null;
    dataChannel.onclose = null;
    dataChannel.onerror = null;
  },

  /**
   * create data channel with channel id equal to chat id
   */
  _createDataChannel: function(curConnection, peerConnection, onDataChannelCreated, callback) {
    var _this = this;

    try {
      var dataChannel = peerConnection.createDataChannel(curConnection.getWSDeviceId(), {reliable: true});
    } catch (error) {
      if (onDataChannelCreated) {
        onDataChannelCreated(error, null, null, null, callback);
      }
      return;
    }

    _this._addDataChannelListeners(dataChannel, curConnection, 'active');
    if (onDataChannelCreated) {
      onDataChannelCreated(null, curConnection, peerConnection, dataChannel, callback);
    }
  },

  _onCreateOfferSuccess: function(curConnection, peerConnection, dataChannel, callback, localDescription) {
    curConnection.log('log', {message: 'done: createLocalOffer:createOffer'});
    curConnection.log('log', {message: 'try: createLocalOffer:setLocalDescription'});
    peerConnection.setLocalDescription(
      localDescription,
      function() {
        curConnection.log('log', {message: 'done: createLocalOffer:setLocalDescription'});
        if (callback) {
          callback(null, {
            peerConnection: peerConnection,
            dataChannel: dataChannel
          });
        }
      },
      function(error) {
        if (callback) {
          callback(error);
        }
      }
    );
  },

  _onCreateOfferError: function(curConnection, callback, error) {
    if (callback) {
      callback(error);
    }
  },

  _onDataChannelCreated: function(createError, curConnection, peerConnection, dataChannel, callback) {
    var _this = this;
    if (createError) {
      if (callback) {
        callback(createError);
      }
      return;
    }
    curConnection.log('log', {message: 'done: createLocalOffer:setupDataChannel'});
    curConnection.log('log', {message: 'try: createLocalOffer:createOffer'});

    peerConnection.createOffer(
      _this._onCreateOfferSuccess.bind(_this, curConnection, peerConnection, dataChannel, callback),
      _this._onCreateOfferError.bind(_this, curConnection, callback)
      //,{ mandatory: { OfferToReceiveVideo: true, OfferToReceiveAudio: true }}
    );
  },

  createLocalOffer: function(curConnection, peerConnection, callback) {
    var _this = this;
    curConnection.log('log', {message: 'try: createLocalOffer'});
    if (!peerConnection) {
      var err = new Error('No peer connection');
      if (callback) {
        callback(err);
      } else {
        console.error(err);
      }
      return;
    }

    curConnection.log('log', {message: 'try: createLocalOffer:setupDataChannel'});
    _this._createDataChannel(
      curConnection,
      peerConnection,
      _this._onDataChannelCreated.bind(_this),
      callback
    );
  },

  _onCreateAnswerSuccess: function(curConnection, peerConnection, callback, localDescription) {
    curConnection.log('log', {message: 'done: createLocalAnswer:createAnswer'});
    curConnection.log('log', {message: 'try: createLocalAnswer:setLocalDescription'});
    peerConnection.setLocalDescription(
      localDescription,
      function() {
        curConnection.log('log', {message: 'done: createLocalAnswer:setLocalDescription'});
        if (callback) {
          callback(null, {
            peerConnection: peerConnection
          });
        }
      },
      function(error) {
        if (callback) {
          callback(error);
        }
      }
    );
  },

  _onCreateAnswerError: function(curConnection, callback, error) {
    if (callback) {
      callback(error);
    }
  },

  createLocalAnswer: function(curConnection, peerConnection, callback) {
    var _this = this;
    curConnection.log('log', {message: 'try: createLocalAnswer'});
    if (!peerConnection) {
      var err = new Error('No peer connection');
      if (callback) {
        callback(err);
      } else {
        console.error(err);
      }
      return;
    }

    curConnection.log('log', {message: 'try: createLocalAnswer:setRemoteDescription'});
    try {
      var _RTCSessionDescription = window.webkitRTCSessionDescription || window.mozRTCSessionDescription ||
        window.RTCSessionDescription;
      var remoteOfferDescription = new _RTCSessionDescription(curConnection.passive.remoteOfferDescription);
      peerConnection.setRemoteDescription(remoteOfferDescription);
    } catch (error) {
      if (callback) {
        callback(error);
      }
      return;
    }
    curConnection.log('log', {message: 'done: createLocalAnswer:setRemoteDescription'});
    curConnection.log('log', {message: 'try: createLocalAnswer:createAnswer'});

    peerConnection.createAnswer(
      _this._onCreateAnswerSuccess.bind(_this, curConnection, peerConnection, callback),
      _this._onCreateAnswerError.bind(_this, curConnection, callback)
      //,{ mandatory: { OfferToReceiveVideo: true, OfferToReceiveAudio: true }}
    );
  },

  destroy: function() {
    this.onConnectionsDestroyed(this.connections);
    this.connections = [];
  },

  /**
   * broadcast for all connections data channels
   */
  broadcastMessage: function(connections, broadcastData) {
    var _this = this, unused = [];
    connections.forEach(function(_connection) {
      if (_connection.isActive()) {
        _connection.dataChannel.send(broadcastData);
      } else if (_connection.dataChannel) {
        unused.push(_connection);
      }
    });
    while (unused.length) {
      var toRemoveConnection = unused.shift();
      var removeIndex = connections.indexOf(toRemoveConnection);
      if (removeIndex === -1) {
        console.log('removed old client connection',
          'ws_device_id => ', connections[removeIndex].ws_device_id);
        connections.splice(removeIndex, 1);
      }
    }
  },

  getChatConnections: function(connections, chat_id, active) {
    var webrtc_chat_connections = [];
    connections.forEach(function(webrtc_connection) {
      if (!active || webrtc_connection.isActive()) {
        if (webrtc_connection.hasChatId(chat_id)) {
          webrtc_chat_connections.push(webrtc_connection);
        }
      }
    });
    return webrtc_chat_connections;
  },

  broadcastChatMessage: function(chat_id, broadcastData) {
    this.broadcastMessage(this.getChatConnections(this.connections, chat_id), broadcastData);
  },

  destroyConnectionChat: function(chat_description, deleting) {
    var type = deleting ? 'chat_delete' : 'chat_leave';
    this.connections.forEach(function(connetion) {
      connetion.removeChatId(chat_description.chat_id);
    });
    this.connections.filter((_connection) => {
      if (_connection.checkDestroy()) {
        this.cleanConnection(_connection);
        return false;
      }
      return true
    });
    websocket.sendMessage({
      type: type,
      from_user_id: users_bus.getUserId(),
      chat_description: chat_description
    });
  },
  
  cleanConnection(connection) {
    this._removeDataChannelListeners(connection.dataChannel);
    this._removePeerConnectionListeners(connection.peerConnection);
    connection.dataChannel && connection.dataChannel.close();
  },

  onConnectionDestroyed: function(connection) {
    var _this = this;
    _this.cleanConnection(connection);
    let index = _this.connections.indexOf(connection);
    if (index > -1) {
      _this.connections.splice(index, 1);
    }
  },

  onConnectionsDestroyed(connections){
    if(Array.isArray(connections)){
      this.connections.filter((_connection) => {
        let notFound = connections.indexOf(_connection) === -1;
        if (!notFound) {
          this.cleanConnection(_connection);
        }
        return notFound;
      });
    }
  },

  onWebSocketMessage: function(messageData) {
    var _this = this;

    switch (messageData.type) {
      case 'notify_webrtc':
        if (_this[messageData.notify_data]) {
          _this[messageData.notify_data](messageData);
        }
        break;
    }
  }
};
extend_core.prototype.inherit(WebRTC, event_core);

export default new WebRTC();