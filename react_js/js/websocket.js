import extend_core from '../js/extend_core.js'
import id_core from '../js/id_core.js'
import event_bus from '../js/event_bus.js'

import Popup from '../components/popup'

var Websocket = function() {
  this.bindContexts();
  this.responseCallbacks = [];
  this.protocol = window.location.origin.indexOf('https') >= 0 ? 'wss://' : 'ws://';
};

Websocket.prototype = {

  href: '/websocket',

  bindContexts: function() {
    var self = this;
    self.bindedOnOpen = self.onOpen.bind(self);
    self.bindedOnClose = self.onClose.bind(self);
    self.bindedOnMessage = self.onMessage.bind(self);
    self.bindedOnError = self.onError.bind(self);
  },

  createAndListen: function() {
    this.create();
    this.addSocketListeners();
  },

  create: function() {
    try {
      this.socket = new WebSocket(this.protocol + window.location.host + this.href);
    } catch (e) {
      event_bus.trigger('changeStatePopup', {
        show: true,
        type: 'error',
        message: e.message ? e.message : e,
        onDataActionClick: function(action) {
          switch (action) {
            case 'confirmCancel':
              this.setState(Popup.prototype.handleClose(this.state));
              break;
          }
        }
      });
    }
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
    var self = this;
    self.removeSocketListeners();
    self.socket.onopen = self.bindedOnOpen;
    self.socket.onclose = self.bindedOnClose;
    self.socket.onmessage = self.bindedOnMessage;
    self.socket.onerror = self.bindedOnError;
  },

  removeSocketListeners: function() {
    if (!this.socket) {
      return;
    }
    var sels = this;
    sels.socket.onopen = null;
    sels.socket.onclose = null;
    sels.socket.onmessage = null;
    sels.socket.onerror = null;
  },

  onOpen: function(event) {
    console.log('WebSocket connection established');
  },

  onClose: function(event) {
    var newState;
    if (event.wasClean) {
      console.warn('WebSocket connection closed');
    } else {
      event_bus.trigger('changeStatePopup', {
        show: true,
        type: 'error',
        message: 103,
        onDataActionClick: function(action) {
          switch (action) {
            case 'confirmCancel':
              newState = Popup.prototype.handleClose(this.state);
              this.setState(newState);
              break;
          }
        }
      });
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
      event_bus.trigger('web_socket_message', parsedMessageData);
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
extend_core.prototype.inherit(Websocket, id_core);

export default new Websocket();
