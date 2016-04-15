define('websocket', [
    'throw_event_core',
    'extend_core',
    'id_core',
    'popap_manager'
  ],
  function(throw_event_core,
           extend_core,
           id_core,
           popap_manager) {

    var websocket = function() {
      this.bindContexts();
      this.responseCallbacks = [];
      this.protocol = window.location.origin.indexOf('https') >= 0 ? 'wss://' : 'ws://';
    };

    websocket.prototype = {

      href: '/websocket',

      bindContexts: function() {
        var _this = this;
        _this.bindedOnOpen = _this.onOpen.bind(_this);
        _this.bindedOnClose = _this.onClose.bind(_this);
        _this.bindedOnMessage = _this.onMessage.bind(_this);
        _this.bindedOnError = _this.onError.bind(_this);
      },

      createAndListen: function() {
        this.create();
        this.addSocketListeners();
      },

      create: function() {
        this.socket = new WebSocket(this.protocol + window.location.host + this.href);
      },

      dispose: function() {
        this.removeSocketListeners();
        if (this.socket) {
          this.socket.close();
          this.socket = null;
        }
      },

      addSocketListeners: function() {
        if (!this.socket) {
          return;
        }
        var _this = this;
        _this.removeSocketListeners();
        _this.socket.onopen = _this.bindedOnOpen;
        _this.socket.onclose = _this.bindedOnClose;
        _this.socket.onmessage = _this.bindedOnMessage;
        _this.socket.onerror = _this.bindedOnError;
      },

      removeSocketListeners: function() {
        if (!this.socket) {
          return;
        }
        var _this = this;
        _this.socket.onopen = null;
        _this.socket.onclose = null;
        _this.socket.onmessage = null;
        _this.socket.onerror = null;
      },

      onOpen: function(event) {
        console.log('WebSocket connection established');
      },

      onClose: function(event) {
        if (event.wasClean) {
          console.warn('WebSocket connection closed');
        } else {
          popap_manager.renderPopap(
            'error',
            {message: 103},
            function(action) {
              switch (action) {
                case 'confirmCancel':
                  popap_manager.onClose();
                  break;
              }
            }
          );
        }
        console.warn('Code: ' + event.code + ' reason: ' + event.reason);
      },

      onMessage: function(event) {
        if (event.data) {
          try {
            var parsedMessageData = JSON.parse(event.data);
          } catch (e) {
            console.error(e);
            return;
          }
        }
        console.info('WebSocket received message data', parsedMessageData);
        if (parsedMessageData.response_id) {
          var depleted = [], nowDatetime = Date.now();
          this.responseCallbacks.forEach(function(callbDescr) {
            if (callbDescr.request_id === parsedMessageData.response_id) {
              callbDescr.responseCallback(null, parsedMessageData);
              depleted.push(callbDescr);
            } else if (nowDatetime - callbDescr.datetime > 50000) {
              callbDescr.responseCallback(new Error('Timeout fro request'));
              depleted.push(callbDescr);
            }
          });
          while (depleted.length) {
            var toRemoveCallbDescr = depleted.shift();
            var removeIndex = this.responseCallbacks.indexOf(toRemoveCallbDescr);
            if (removeIndex !== -1) {
              this.responseCallbacks.splice(removeIndex, 1);
            }
          }
        } else {
          this.trigger('message', parsedMessageData);
        }
      },

      onError: function(error) {
        console.error(error);
      },

      sendMessage: function(data) {
        var senddata = data;
        if (typeof data !== "string") {
          try {
            senddata = JSON.stringify(data);
          } catch (e) {
            console.error(e);
            return;
          }
        }
        this.socket.send(senddata);
      },

      wsRequest: function(requestData, responseCallback) {
        requestData.request_id = this.generateId();
        this.responseCallbacks.push({
          datetime: Date.now(),
          request_id: requestData.request_id,
          responseCallback: responseCallback
        });
        this.sendMessage(requestData);
      }
    };
    extend_core.prototype.inherit(websocket, throw_event_core);
    extend_core.prototype.inherit(websocket, id_core);

    return new websocket();
  }
);