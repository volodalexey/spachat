define('webrtc', [
        'throw_event_core',
        'template_core',
        'event_bus',
        //
        'text!../templates/webrtc_template.ejs',
        'text!../templates/waiter_template.ejs'
    ],
    function(throw_event_core,
             template_core,
             event_bus,
            //
             webrtc_template,
             waiter_template) {

        var Connection = function(options) {
            this.deviceId = options.deviceId;
            this.active = {
                readyState: options.active && options.active.readyState ? options.active.readyState : this.readyStates.WAITING
            };
            this.passive = {
                readyState: options.passive && options.passive.readyState ? options.passive.readyState : this.readyStates.WAITING
            }
        };

        Connection.prototype = {

            readyStates: {
                WAITING: 'WAITING',
                CREATING_OFFER: 'CREATING_OFFER',
                WILL_CREATE_OFFER: 'WILL_CREATE_OFFER',
                CREATING_ANSWER: 'CREATING_ANSWER',
                WILL_CREATE_ANSWER: 'WILL_CREATE_ANSWER',
                ACCEPTING_ANSWER: 'ACCEPTING_ANSWER',
                WILL_ACCEPT_ANSWER: 'WILL_ACCEPT_ANSWER'
            },

            isEqualAnyDeviceId: function(deviceId) {
                return this.deviceId === deviceId || this.tempDeviceId === deviceId;
            },
            
            getAnyDeviceId: function() {
                return this.deviceId || this.tempDeviceId;
            },

            getDeviceId: function() {
                return this.deviceId;
            },

            setDeviceId: function(deviceId) {
                this.deviceId = deviceId;
                if (this.tempDeviceId) {
                    this.tempDeviceId = undefined;
                }
            }
        };

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
        };

        WebRTC.prototype = {

            createConnection: function(options) {
                var connection = new Connection(options);
                this.connections.push(connection);
                return connection;
            },

            getConnection: function(deviceId) {
                var connection;
                this.connections.every(function(_connection) {
                    if (_connection.isEqualAnyDeviceId(deviceId)) {
                        connection = _connection;
                    }
                    return !connection;
                });

                return connection;
            },

            /**
             * this function is invoked when chat was created or joined
             */
            serverStoredChat: function(curChat, messageData) {
                if (messageData.connectedDevices) {
                    var _this = this;
                    messageData.connectedDevices.forEach(function(devDescription) {
                        if (event_bus.isEqualAnyDeviceId(devDescription.deviceId || devDescription.tempDeviceId)) {
                            // the information about myself
                            return;
                        }
                        
                        if (!_this.getConnection(devDescription.deviceId || devDescription.tempDeviceId)) {
                            // if connection with such deviceId not found create offer for this connection
                            _this.onActiveChangeState(curChat, _this.createConnection({
                                deviceId : devDescription.deviceId,
                                active: {
                                    readyState: Connection.prototype.readyStates.WILL_CREATE_OFFER
                                }
                            }));
                        }
                    });
                }
            },

            /**
             * server stored local offer for current chat
             * need to join this offer of wait for connections if current user is creator
             */
            serverStoredOffer: function(curChat, messageData) {
                var _this = this;
                if (event_bus.getDeviceId() !== messageData.deviceId) {
                    // the information about myself
                    return;
                }
                var connection = _this.getConnection(messageData.deviceId);
                if (connection && connection.dataChannel && connection.dataChannel.readyState === "open") {
                    // connection with this device is already established
                    return;
                }
                
                if (!connection) {
                    // if connection with such deviceId not found create answer for offer
                    _this.onPassiveChangeState(curChat, _this.createConnection({
                        deviceId : messageData.deviceId,
                        passive: {
                            remoteOfferDescription: messageData.offerDescription,
                            readyState: Connection.prototype.readyStates.WILL_CREATE_ANSWER
                        }
                    }));
                } else {
                    // change readyState for existing connection
                    connection.passive.readyState = Connection.prototype.readyStates.WILL_CREATE_ANSWER;
                    connection.passive.remoteOfferDescription = messageData.offerDescription;
                    _this.onPassiveChangeState(curChat, connection);
                }
            },

            serverStoredAnswer: function(curChat, messageData) {
                var _this = this;
                // I am NOT the creator of server stored answer
                if (event_bus.getDeviceId() !== messageData.deviceId) {
                    // the information about myself
                    return;
                }

                var connection = _this.getConnection(messageData.deviceId);
                if (connection && connection.dataChannel && connection.dataChannel.readyState === "open") {
                    // connection with this device is already established
                    return;
                }

                if (messageData.offerDeviceId === event_bus.getDeviceId()) {
                    // Accept answer if I am the offer creator
                    connection.active.readyState = Connection.prototype.readyStates.WILL_ACCEPT_ANSWER;
                    connection.active.remoteAnswerDescription = event.answerDescription;
                    _this.onActiveChangeState(curChat, connection);
                }
            },

            extractDeviceId: function(RTCSessionDescription) {
                return RTCSessionDescription.sdp.match(/a=fingerprint:sha-256\s*(.+)/)[1];
            },

            onActiveChangeState: function(curChat, curConnection) {
                var _this = this;
                switch (curConnection.active.readyState) {
                    case Connection.prototype.readyStates.WILL_CREATE_OFFER:
                        curConnection.active.readyState = Connection.prototype.readyStates.CREATING_OFFER;
                        _this.createLocalOfferAuto(
                            {
                                curChat: curChat,
                                curConnection: curConnection,
                                onicecandidate: function(result) {
                                    if (!curConnection.active) {
                                        console.error(new Error('Aborted create offer!'));
                                        return;
                                    }
                                    var deviceId = _this.extractDeviceId(result.peerConnection.localDescription);
                                    event_bus.setDeviceId(deviceId);
                                    curChat.trigger('log',{ message: 'Extracted host device id from offer => ' + deviceId});

                                    curConnection.active.readyState = Connection.prototype.readyStates.WAITING;
                                    curChat.trigger('throw', 'sendToWebSocket', {
                                        type: 'chat_offer',
                                        userId: curChat.userId,
                                        deviceId: event_bus.getDeviceId(),
                                        offerDescription: result.peerConnection.localDescription
                                    });
                                }
                            },
                            function(createError, result) {
                                if (createError) {
                                    curChat.trigger('error', { message: createError });
                                    return;
                                }
                                if (!curConnection.active) {
                                    console.error(new Error('Aborted create offer!'));
                                    return;
                                }

                                curConnection.active.peerConnection = result.peerConnection;
                                curConnection.active.dataChannel = result.dataChannel;
                                curChat.trigger('log', { message: 'done: createLocalOfferAuto' });
                            }
                        );
                        break;
                    case Connection.prototype.readyStates.WILL_ACCEPT_ANSWER:
                        curConnection.active.readyState = Connection.prototype.readyStates.ACCEPTING_ANSWER;
                        _this.acceptRemoteAnswerAuto(
                            {
                                curChat: curChat,
                                curConnection: curConnection
                            },
                            function(createError) {
                                if (createError) {
                                    curChat.trigger('error', { message: createError });
                                    return;
                                }
                                if (!curConnection.active) {
                                    console.error(new Error('Aborted accept answer!'));
                                    return;
                                }

                                curConnection.active.readyState = Connection.prototype.readyStates.WAITING;
                                curChat.trigger('throw', 'sendToWebSocket', {
                                    type: 'chat_accept',
                                    userId: curChat.userId,
                                    deviceId: event_bus.getDeviceId(),
                                    answerDeviceId: curConnection.getDeviceId()
                                });
                            }
                        );
                        break;
                }
            },

            onPassiveChangeState: function(curChat, curConnection) {
                var _this = this;
                switch (curConnection.passive.readyState) {
                    case Connection.prototype.readyStates.WILL_CREATE_ANSWER:
                        curConnection.passive.readyState = Connection.prototype.readyStates.CREATING_ANSWER;
                        _this.createLocalAnswerAuto(
                            {
                                curChat: curChat,
                                curConnection: curConnection,
                                onicecandidate: function(result) {
                                    if (!curConnection.passive) {
                                        console.error(new Error('Aborted create answer!'));
                                        return;
                                    }
                                    curConnection.passive.peerConnection.ondatachannel = _this.onDataChannel.bind(_this, curChat, curConnection);
                                    curConnection.passive.readyState = Connection.prototype.readyStates.WAITING;
                                    curChat.trigger('throw', 'sendToWebSocket', {
                                        type: 'chat_answer',
                                        userId: _this.chat.userId,
                                        offerDeviceId: curConnection.getDeviceId(),
                                        deviceId: event_bus.getDeviceId(),
                                        answerDescription: result.peerConnection.localDescription
                                    });
                                }
                            },
                            function(createError, result) {
                                if (createError) {
                                    curChat.trigger('error', { message: createError });
                                    return;
                                }
                                if (!curConnection.passive) {
                                    console.error(new Error('Aborted create answer!'));
                                    return;
                                }

                                curConnection.passive.peerConnection = result.peerConnection;
                                curChat.trigger('log', { message: 'done: createLocalAnswerAuto' });
                            }
                        );
                        break;
                }
            },

            /**
             * create offer session description protocol (sdp)
             * when internet connection will be established
             * sdp will be sent it to the server
             * @param options
             * @param callback
             */
            createLocalOfferAuto: function(options, callback) {
                var _this = this;
                _this.createRTCPeerConnection(
                    options,
                    function(createError, peerConnection) {
                        if (createError) {
                            callback(createError);
                            return;
                        }

                        _this.createLocalOffer(peerConnection, options, callback);
                    }
                );
            },

            /**
             * create answer session description protocol
             * when internet connection will be established
             * sdp will be sent it to the server
             * @param options
             * @param callback
             */
            createLocalAnswerAuto: function(options, callback) {
                var _this = this;
                _this.createRTCPeerConnection(
                    options,
                    function(createError, peerConnection) {
                        if (createError) {
                            callback(createError);
                            return;
                        }

                        _this.createLocalAnswer(peerConnection, options, callback);
                    }
                );
            },

            acceptRemoteAnswerAuto: function(options, callback) {
                var _this = this;
                options.curChat.trigger('log', { message: 'try: acceptRemoteAnswerAuto:setRemoteDescription' });
                try {
                    var remoteAnswerDescription = new RTCSessionDescription(options.curConnection.active.remoteAnswerDescription);
                    options.curConnection.active.setRemoteDescription(remoteAnswerDescription);
                } catch (error) {
                    if (callback) {
                        callback(error);
                    }
                    return;
                }

                options.curChat.trigger('log', { message: 'done: acceptRemoteAnswerAuto:setRemoteDescription' });
                if (callback) {
                    callback(null);
                }
            },

            /**
             * each time client tries to define its address
             */
            onICEcandidate: function(peerConnection, onicecandidate, event) {
                if (event.candidate == null) {
                    this.curChat.trigger('log', { message: 'done: ICE candidate' });
                    if (onicecandidate) {
                        onicecandidate({
                            peerConnection: peerConnection
                        });
                    }
                } else {
                    this.curChat.trigger('log', { message: 'next: ICE candidate' });
                }
            },

            onDataChannel: function(curChat, curConnection, event) {
                curChat.trigger('log', { message: 'Data Channel established' });
                curConnection.passive.dataChannel = event.channel;
                this.addDataChannelListeners(curConnection.passive.dataChannel, curChat, curConnection, 'passive');
            },

            /**
             * create peer connection and pass it to the device id state
             * @param options
             * @param callback
             */
            createRTCPeerConnection: function(options, callback) {
                var _this = this;
                options.curChat.trigger('log', { message: 'try: createRTCPeerConnection' });
                try {
                    var peerConnection = new webkitRTCPeerConnection(_this.configuration.RTC, _this.configuration.constraints);
                } catch (error) {
                    if (callback) {
                        callback(error);
                    }
                    return;
                }

                peerConnection.onicecandidate = _this.onICEcandidate.bind(options, peerConnection, options.onicecandidate);

                options.curChat.trigger('log', { message: 'done: createRTCPeerConnection' });
                if (callback) {
                    callback(null, peerConnection);
                }
            },

            addDataChannelListeners: function(dataChannel, curChat, curConnection, activeOrPassive) {
                var _this = this;
                if (!dataChannel) {
                    return;
                }
                _this.removeDataChannelListeners(dataChannel);

                dataChannel.onopen = function() {
                    curChat.trigger('log', { message: 'Data channel connection established!' });
                    curConnection.dataChannel = curConnection[activeOrPassive].dataChannel;
                    curConnection.peerConnection = curConnection[activeOrPassive].peerConnection;
                    delete curConnection.active;
                    delete curConnection.passive;
                };
                dataChannel.onmessage = function(event) {
                    var remoteMessage = JSON.parse(event.data);
                    curChat.messages.addRemoteMessage(remoteMessage, function(error, message) {
                        curChat.messages.renderMessage({ scrollTop : true }, message);
                    });
                };
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
             * @param options
             * @param callback
             */
            createDataChannel: function(options, callback) {
                var _this = this;

                try {
                    var dataChannel = options.peerConnection.createDataChannel(options.curConnection.getAnyDeviceId(), {reliable: true});
                } catch (error) {
                    callback(error);
                }

                _this.addDataChannelListeners(dataChannel, options.curChat, options.curConnection, 'active');
                callback(null, dataChannel);
            },

            createLocalOffer: function(peerConnection, options, callback) {
                var _this = this;
                options.curChat.trigger('log', { message: 'try: createLocalOffer' });
                if (!peerConnection) {
                    if (callback) {
                        callback(new Error('No peer connection'));
                    }
                    return;
                }

                options.curChat.trigger('log', { message: 'try: createLocalOffer:setupDataChannel' });
                _this.createDataChannel(options, function(setupError, dataChannel) {
                    if (setupError) {
                        if (callback) {
                            callback(setupError);
                        }
                        return;
                    }
                    options.curChat.trigger('log', { message: 'done: createLocalOffer:setupDataChannel' });
                    options.curChat.trigger('log', { message: 'try: createLocalOffer:createOffer' });

                    peerConnection.createOffer(
                        function(localDescription) {
                            options.curChat.trigger('log', { message: 'done: createLocalOffer:createOffer' });
                            options.curChat.trigger('log', { message: 'try: createLocalOffer:setLocalDescription' });
                            peerConnection.setLocalDescription(
                                localDescription,
                                function() {
                                    options.curChat.trigger('log', { message: 'done: createLocalOffer:setLocalDescription' });
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
                        function(error) {
                            if (callback) {
                                callback(error);
                            }
                        }
                        //,{ mandatory: { OfferToReceiveVideo: true, OfferToReceiveAudio: true }}
                    );
                });
            },

            createLocalAnswer: function(peerConnection, options, callback) {
                var _this = this;
                options.curChat.trigger('log', { message: 'try: createLocalAnswer' });
                if (!peerConnection) {
                    if (callback) {
                        callback(new Error('No peer connection'));
                    }
                    return;
                }

                options.curChat.trigger('log', { message: 'try: createLocalAnswer:setRemoteDescription' });
                try {
                    var remoteOfferDescription = new RTCSessionDescription(options.curConnection.passive.remoteOfferDescription);
                    peerConnection.setRemoteDescription(remoteOfferDescription);
                } catch (error) {
                    if (callback) {
                        callback(new Error('No peer connection'));
                    }
                    return;
                }
                options.curChat.trigger('log', { message: 'done: createLocalAnswer:setRemoteDescription' });
                options.curChat.trigger('log', { message: 'try: createLocalAnswer:createAnswer' });

                peerConnection.createAnswer(
                    function(localDescription) {
                        options.curChat.trigger('log', { message: 'done: createLocalAnswer:createAnswer' });
                        options.curChat.trigger('log', { message: 'try: createLocalAnswer:setLocalDescription' });
                        peerConnection.setLocalDescription(
                            localDescription,
                            function() {
                                options.curChat.trigger('log', { message: 'done: createLocalAnswer:setLocalDescription' });
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
                    function(error) {
                        if (callback) {
                            callback(error);
                        }
                    }
                );
            },

            destroy: function() {
                var _this = this;
                _this.removeDataChannelListeners();
            },

            /**
             * broadcast for all data channels for current chat
             * @param broadcastData
             */
            broadcastMessage: function(broadcastData) {
                var _this = this;
                //for (var deviceId in _this.dataChannelsByDeviceId) {
                //    if (_this.dataChannelsByDeviceId[deviceId]) {
                //        if (_this.dataChannelsByDeviceId[deviceId].readyState === "open") {
                //            _this.dataChannelsByDeviceId[deviceId].send(broadcastData);
                //        } else {
                //            console.log('removed old data channel connection with device id => ', deviceId);
                //            delete _this.dataChannelsByDeviceId[deviceId];
                //        }
                //    } else {
                //        console.log('requested device id not found => ', deviceId);
                //    }
                //}
            }
        };
        extend(WebRTC, throw_event_core);
        extend(WebRTC, template_core);

        WebRTC.prototype.webrtc_template = WebRTC.prototype.template(webrtc_template);
        WebRTC.prototype.waiter_template = WebRTC.prototype.template(waiter_template);

        return new WebRTC();
    }
);
