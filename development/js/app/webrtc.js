define('webrtc', [
        'throw_event_core',
        'template_core',
        'extend_core',
        //
        'event_bus',
        'users_bus',
        'connection',
        //
        'text!../templates/webrtc_template.ejs',
        'text!../templates/waiter_template.ejs'
    ],
    function(throw_event_core,
             template_core,
             extend_core,
             //
             event_bus,
             users_bus,
             Connection,
            //
             webrtc_template,
             waiter_template) {

        var WebRTC = function() {
            var _this = this;
            _this.configuration = {
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
            _this.connections = [];
            _this.addEventListeners();
        };

        WebRTC.prototype = {

            createConnection: function(options) {
                var connection = new Connection(options);
                this.connections.push(connection);
                return connection;
            },

            getConnection: function(options) {
                var connection;
                this.connections.every(function(_connection) {
                    if (_connection.isEqualAnyDeviceId(options)) {
                        connection = _connection;
                    }
                    return !connection;
                });

                return connection;
            },

            /**
             * this function is invoked when chat was created or joined
             */
            handleConnectedDevices: function(connectedDevices, curInstance) {
                var _this = this;
                connectedDevices.forEach(function(devDescription) {
                    _this.handleDeviceActive(devDescription, curInstance);
                });
            },

            handleDeviceActive: function(devDescription, curInstance) {
                var _this = this;
                if (event_bus.isEqualAnyDeviceId(devDescription)) {
                    console.warn('the information about myself');
                    return;
                }

                var connection = _this.getConnection(devDescription);
                if (connection && connection.canApplyNextState() === false) {
                    return;
                }
                if (!connection) {
                    // if connection with such deviceId not found create offer for this connection
                    connection = _this.createConnection({
                        deviceId : devDescription.deviceId,
                        tempDeviceId : devDescription.tempDeviceId
                    });
                }
                // change readyState for existing connection
                connection.active.readyState = Connection.prototype.readyStates.WILL_CREATE_OFFER;
                connection.storeInstance(curInstance);
                _this.onActiveChangeState(connection);
            },

            /**
             * server stored local offer for current chat
             * need to join this offer of wait for connections if current user is creator
             */
            handleDevicePassive: function(messageData, curInstance) {
                var _this = this;
                if (event_bus.getDeviceId() === messageData.deviceId) {
                    console.warn('the information about myself');
                    return;
                }
                var connection = _this.getConnection(messageData);
                if (connection && connection.canApplyNextState() === false) {
                    return;
                }
                
                if (!connection) {
                    // if connection with such deviceId not found create answer for offer
                    connection = _this.createConnection({
                        deviceId : messageData.deviceId,
                        tempDeviceId : messageData.tempDeviceId
                    });
                }
                // change readyState for existing connection
                connection.passive.readyState = Connection.prototype.readyStates.WILL_CREATE_ANSWER;
                connection.passive.remoteOfferDescription = messageData.offerDescription;
                connection.storeInstance(curInstance);
                _this.onPassiveChangeState(connection);
            },

            handleDeviceAnswer: function(messageData, curInstance) {
                var _this = this;
                // I am NOT the creator of server stored answer
                if (event_bus.getDeviceId() === messageData.deviceId) {
                    console.warn('the information about myself');
                    return;
                }

                var connection = _this.getConnection(messageData);
                if (connection && connection.canApplyNextState() === false) {
                    return;
                } else if (!connection) {
                    console.error(new Error('Answer for connection thet is not exist!'));
                }

                if (event_bus.isEqualAnyDeviceId(messageData.toDevice)) {
                    // Accept answer if I am the offer creator
                    connection.active.readyState = Connection.prototype.readyStates.WILL_ACCEPT_ANSWER;
                    connection.active.remoteAnswerDescription = messageData.answerDescription;
                    connection.storeInstance(curInstance);
                    _this.onActiveChangeState(connection);
                }
            },

            extractDeviceId: function(RTCSessionDescription) {
                return RTCSessionDescription.sdp.match(/a=fingerprint:sha-256\s*(.+)/)[1];
            },

            onActiveICECandidate: function(curConnection, result) {
                var _this = this;
                if (!curConnection.active) {
                    curConnection.log('error', { message: "Aborted create offer! Connection doesn't have active " });
                    return;
                }
                var deviceId = _this.extractDeviceId(result.peerConnection.localDescription);
                event_bus.setDeviceId(deviceId);
                curConnection.log('log',{ message: 'Extracted host device id from offer => ' + deviceId});

                curConnection.active.readyState = Connection.prototype.readyStates.WAITING;
                curConnection.sendToWebSocket({
                    type: 'chat_offer',
                    userId: users_bus.getUserId(),
                    deviceId: event_bus.getDeviceId(),
                    tempDeviceId: event_bus.getTempDeviceId(),
                    toDevice: curConnection.getDeviceDescription(),
                    offerDescription: result.peerConnection.localDescription
                });
            },

            onLocalOfferCreated: function(curConnection, createError, result) {
                if (createError) {
                    curConnection.log('error', { message: createError });
                    return;
                }
                if (!curConnection.active) {
                    curConnection.log('error', { message: "Aborted create offer! Connection doesn't have active " });
                    return;
                }

                curConnection.active.peerConnection = result.peerConnection;
                curConnection.active.dataChannel = result.dataChannel;
                curConnection.log('log', { message: 'done: createLocalOfferAuto' });
            },
            
            onAcceptedRemoteAnswer: function(curConnection, createError) {
                if (createError) {
                    curConnection.log('error', { message: createError });
                    return;
                }
                if (!curConnection.active) {
                    curConnection.log('error', { message: "Aborted accept answer! Connection doesn't have active " });
                    return;
                }

                curConnection.sendToWebSocket({
                    type: 'chat_accept',
                    userId: users_bus.getUserId(),
                    deviceId: event_bus.getDeviceId(),
                    toDevice: curConnection.getDeviceDescription()
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
                    curConnection.log('error', { message: "Aborted create offer! Connection doesn't have passive " });
                    return;
                }
                var deviceId = _this.extractDeviceId(result.peerConnection.localDescription);
                event_bus.setDeviceId(deviceId);
                curConnection.log('log',{ message: 'Extracted host device id from offer => ' + deviceId});

                curConnection.passive.peerConnection.ondatachannel = _this.onReceivedDataChannel.bind(_this, curConnection);
                curConnection.passive.readyState = Connection.prototype.readyStates.WAITING;
                curConnection.sendToWebSocket({
                    type: 'chat_answer',
                    userId: users_bus.getUserId(),
                    toDevice: curConnection.getDeviceDescription(),
                    deviceId: event_bus.getDeviceId(),
                    answerDescription: result.peerConnection.localDescription
                });
            },

            onLocalAnswerCreated: function(curConnection, createError, result) {
                if (createError) {
                    curConnection.log('error', { message: createError });
                    return;
                }
                if (!curConnection.passive) {
                    curConnection.log('error', { message: "Aborted create offer! Connection doesn't have passive " });
                    return;
                }

                curConnection.passive.peerConnection = result.peerConnection;
                curConnection.log('log', { message: 'done: createLocalAnswerAuto' });
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
                curConnection.log('log', { message: 'try: acceptRemoteAnswerAuto:setRemoteDescription' });
                try {
                    var remoteAnswerDescription = new RTCSessionDescription(curConnection.active.remoteAnswerDescription);
                    curConnection.active.peerConnection.setRemoteDescription(remoteAnswerDescription);
                } catch (error) {
                    if (callback) {
                        callback(error);
                    }
                    return;
                }

                curConnection.log('log', { message: 'done: acceptRemoteAnswerAuto:setRemoteDescription' });
                if (callback) {
                    callback(null);
                }
            },

            /**
             * each time client tries to define its address
             */
            _onICECandidate: function(curConnection, peerConnection, onICECandidate, event) {
                if (event.candidate == null) {
                    curConnection.log('log', { message: 'done: ICE candidate' });
                    if (onICECandidate) {
                        onICECandidate({
                            peerConnection: peerConnection
                        });
                    }
                } else {
                    curConnection.log('log', { message: 'next: ICE candidate' });
                }
            },

            onReceivedDataChannel: function(curConnection, event) {
                curConnection.log('log', { message: 'Data Channel received' });
                if (!curConnection.passive) {
                    this.removeDataChannelListeners(event.channel);
                    return;
                }
                curConnection.passive.dataChannel = event.channel;
                this.addDataChannelListeners(curConnection.passive.dataChannel, curConnection, 'passive');
            },

            /**
             * create peer connection and pass it to the device id state
             */
            createRTCPeerConnection: function(curConnection, onICECandidate, callback) {
                var _this = this;
                curConnection.log('log', { message: 'try: createRTCPeerConnection' });
                try {
                    var peerConnection = new webkitRTCPeerConnection(_this.configuration.RTC, _this.configuration.constraints);
                } catch (error) {
                    if (callback) {
                        callback(error);
                    }
                    return;
                }

                peerConnection.onicecandidate = _this._onICECandidate.bind(_this, curConnection, peerConnection, onICECandidate);
                peerConnection.oniceconnectionstatechange = function(ev) { console.log('oniceconnectionstatechange', ev.target.iceConnectionState); };
                //peerConnection.onnegotiationneeded = function(ev) { console.log('onnegotiationneeded', ev); };
                peerConnection.onsignalingstatechange = function(ev) { console.log('onsignalingstatechange', ev.target.signalingState); };

                curConnection.log('log', { message: 'done: createRTCPeerConnection' });
                if (callback) {
                    callback(null, peerConnection);
                }
            },

            onDataChannelOpen: function(curConnection, activeOrPassive) {
                curConnection.log('log', { message: 'Data channel connection established!' });
                curConnection.dataChannel = curConnection[activeOrPassive].dataChannel;
                curConnection.peerConnection = curConnection[activeOrPassive].peerConnection;
                delete curConnection.active;
                delete curConnection.passive;
            },

            onDataChannelMessage: function(curConnection, event) {
                try {
                    var remoteMessage = JSON.parse(event.data);
                } catch (e) {
                    console.error(e);
                    return;
                }

                curChat.messages.addRemoteMessage(remoteMessage);
            },

            onDataChannelClose: function(curConnection, event) {
                console.log('onclose', event);
            },

            onDataChannelError: function(curConnection, event) {
                console.log('onerror', event);
            },

            addDataChannelListeners: function(dataChannel, curConnection, activeOrPassive) {
                var _this = this;
                if (!dataChannel) {
                    console.error(new Error('Data channel is not provided!'));
                    return;
                }
                _this.removeDataChannelListeners(dataChannel);

                dataChannel.onopen = _this.onDataChannelOpen.bind(_this, curConnection, activeOrPassive);
                dataChannel.onmessage = _this.onDataChannelMessage.bind(_this, curConnection);
                dataChannel.onclose = _this.onDataChannelClose.bind(_this, curConnection);
                dataChannel.onerror = _this.onDataChannelError.bind(_this, curConnection);
            },

            removeDataChannelListeners: function(dataChannel) {
                if (!dataChannel) {
                    return;
                }

                dataChannel.onopen = null;
                dataChannel.onmessage = null;
            },

            /**
             * create data channel with channel id equal to chat id
             */
            _createDataChannel: function(curConnection, peerConnection, onDataChannelCreated, callback) {
                var _this = this;

                try {
                    var dataChannel = peerConnection.createDataChannel(curConnection.getAnyDeviceId(), {reliable: true});
                } catch (error) {
                    if (onDataChannelCreated) {
                        onDataChannelCreated(error , null, null, null, callback);
                    }
                    return;
                }

                _this.addDataChannelListeners(dataChannel, curConnection, 'active');
                if (onDataChannelCreated) {
                    onDataChannelCreated(null, curConnection, peerConnection, dataChannel, callback);
                }
            },

            _onCreateOfferSuccess: function(curConnection, peerConnection, dataChannel, callback, localDescription) {
                curConnection.log('log', { message: 'done: createLocalOffer:createOffer' });
                curConnection.log('log', { message: 'try: createLocalOffer:setLocalDescription' });
                peerConnection.setLocalDescription(
                    localDescription,
                    function() {
                        curConnection.log('log', { message: 'done: createLocalOffer:setLocalDescription' });
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
                curConnection.log('log', { message: 'done: createLocalOffer:setupDataChannel' });
                curConnection.log('log', { message: 'try: createLocalOffer:createOffer' });

                peerConnection.createOffer(
                    _this._onCreateOfferSuccess.bind(_this, curConnection, peerConnection, dataChannel, callback),
                    _this._onCreateOfferError.bind(_this, curConnection, callback)
                    //,{ mandatory: { OfferToReceiveVideo: true, OfferToReceiveAudio: true }}
                );
            },

            createLocalOffer: function(curConnection, peerConnection, callback) {
                var _this = this;
                curConnection.log('log', { message: 'try: createLocalOffer' });
                if (!peerConnection) {
                    var err = new Error('No peer connection');
                    if (callback) {
                        callback(err);
                    } else {
                        console.error(err);
                    }
                    return;
                }

                curConnection.log('log', { message: 'try: createLocalOffer:setupDataChannel' });
                _this._createDataChannel(
                    curConnection,
                    peerConnection,
                    _this._onDataChannelCreated.bind(_this),
                    callback
                );
            },

            _onCreateAnswerSuccess: function(curConnection, peerConnection, callback, localDescription) {
                curConnection.log('log', { message: 'done: createLocalAnswer:createAnswer' });
                curConnection.log('log', { message: 'try: createLocalAnswer:setLocalDescription' });
                peerConnection.setLocalDescription(
                    localDescription,
                    function() {
                        curConnection.log('log', { message: 'done: createLocalAnswer:setLocalDescription' });
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
                curConnection.log('log', { message: 'try: createLocalAnswer' });
                if (!peerConnection) {
                    var err = new Error('No peer connection');
                    if (callback) {
                        callback(err);
                    } else {
                        console.error(err);
                    }
                    return;
                }

                curConnection.log('log', { message: 'try: createLocalAnswer:setRemoteDescription' });
                try {
                    var remoteOfferDescription = new RTCSessionDescription(curConnection.passive.remoteOfferDescription);
                    peerConnection.setRemoteDescription(remoteOfferDescription);
                } catch (error) {
                    if (callback) {
                        callback(error);
                    }
                    return;
                }
                curConnection.log('log', { message: 'done: createLocalAnswer:setRemoteDescription' });
                curConnection.log('log', { message: 'try: createLocalAnswer:createAnswer' });

                peerConnection.createAnswer(
                    _this._onCreateAnswerSuccess.bind(_this, curConnection, peerConnection, callback),
                    _this._onCreateAnswerError.bind(_this, curConnection, callback)
                    //,{ mandatory: { OfferToReceiveVideo: true, OfferToReceiveAudio: true }}
                );
            },

            destroy: function() {
                var _this = this;
                _this.removeDataChannelListeners();
            },

            /**
             * broadcast for all data channels
             */
            broadcastMessage: function(broadcastData) {
                var _this = this, unused = [];
                _this.connections.forEach(function(_connection) {
                    if (_connection.dataChannel && _connection.dataChannel.readyState === "open") {
                        _connection.dataChannel.send(broadcastData);
                    } else if (_connection.dataChannel) {
                        unused.push(_connection);
                    }
                });
                while (unused.length) {
                    var toRemoveConnection = unused.shift();
                    var removeIndex = _this.connections.indexOf(toRemoveConnection);
                    if (removeIndex === -1) {
                        console.log('removed old client connection',
                            'deviceId => ', _this.connections[removeIndex].deviceId,
                            'tempDeviceId => ', _this.connections[removeIndex].tempDeviceId);
                        _this.connections.splice(removeIndex, 1);
                    }
                }
            },

            destroyConnectionChat: function(chatId) {
                var _this = this;
                _this.connections.forEach(function(connetion) {
                    connetion.removeChatById(chatId);
                });
            },

            addEventListeners: function() {
                var _this = this;
                _this.removeEventListeners();
                event_bus.on('chatDestroyed', _this.destroyConnectionChat, _this);
            },

            removeEventListeners: function() {
                var _this = this;
                event_bus.off('chatDestroyed', _this.destroyConnectionChat);
            }
        };
        extend_core.prototype.inherit(WebRTC, throw_event_core);
        extend_core.prototype.inherit(WebRTC, template_core);

        WebRTC.prototype.webrtc_template = WebRTC.prototype.template(webrtc_template);
        WebRTC.prototype.waiter_template = WebRTC.prototype.template(waiter_template);

        return new WebRTC();
    }
);
