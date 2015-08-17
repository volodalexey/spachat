define('websocket', [
        'throw_event_core',
        'extend_core'
    ],
    function(throw_event_core, extend_core) {

        var websocket = function() {
            this.bindContexts();
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
                this.socket = new WebSocket('ws://' + window.location.host + this.href);
            },

            dispose: function() {
                this.removeSocketListeners(this.socket);
                this.socket.close();
                this.socket = null;
            },

            addSocketListeners: function() {
                if (!this.socket) {
                    return;
                }
                var _this = this;
                _this.removeSocketListeners();
                _this.socket.onopen = _this.bindedOnOpen;
                _this.socket.onclose  = _this.bindedOnClose;
                _this.socket.onmessage  = _this.bindedOnMessage;
                _this.socket.onerror  = _this.bindedOnError;
            },

            removeSocketListeners: function() {
                if (!this.socket) {
                    return;
                }
                var _this = this;
                _this.socket.onopen = null;
                _this.socket.onclose  = null;
                _this.socket.onmessage  = null;
                _this.socket.onerror  = null;
            },

            onOpen: function(event) {
                console.log('WebSocket connection established');
            },

            onClose: function(event) {
                if (event.wasClean) {
                    console.warn('WebSocket connection closed');
                } else {
                    console.error(new Error('WebSocket connection abort'));
                }
                console.log('Code: ' + event.code + ' reason: ' + event.reason);
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
                this.trigger('message', parsedMessageData);
            },

            onError: function(error) {
                console.error(error);
            },

            sendMessage: function(data) {
                var senddata = data;
                if (typeof data !== "string") {
                    senddata = JSON.stringify(data);
                }
                this.socket.send(senddata);
            }
        };
        extend_core.prototype.inherit(websocket, throw_event_core);

        return new websocket();
    }
);
