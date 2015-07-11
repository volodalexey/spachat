define('webrtc', [
        'throw_event_core',
        'template_core',

        'text!../templates/webrtc_template.ejs',
        'text!../templates/waiter_template.ejs'
    ],
    function(throw_event_core,
             template_core,

             webrtc_template,
             waiter_template) {

        var webrtc = function() {
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
            _this.connectionsByDeviceId = {};
            _this.dataChannelsByDeviceId = {};
        };

        webrtc.prototype = {

            MODE: {
                WAITING: 'WAITING',
                CREATING_OFFER: 'CREATING_OFFER',
                CREATING_ANSWER: 'CREATING_ANSWER',
                ACCEPTING_ANSWER: 'ACCEPTING_ANSWER'
            },

            extractDeviceId: function(RTCSessionDescription) {
                return RTCSessionDescription.sdp.match(/a=fingerprint:sha-256\s*(.+)/)[1];
            },

            render: function(options, chat) {
                var _this = this;
                options = options ? options : {}; // TODO always check on upper level
                _this.chat = chat;
                switch (_this.mode) {
                    case _this.MODE.CREATING_OFFER:
                        var peerConnection, dataChannel;
                        options.onicecandidate = function(_options) {
                            _this.mode = _this.MODE.WAITING;
                            var deviceId = _this.extractDeviceId(_options.peerConnection.localDescription);
                            _this.connectionsByDeviceId[deviceId] = peerConnection;
                            _this.dataChannelsByDeviceId[deviceId] = dataChannel;
                            _this.chat.trigger('throw', 'setDeviceId', deviceId);
                            _this.chat.trigger('log',{ message: 'Extracted host device id from offer => ' + deviceId});
                            _this.chat.trigger('throw', 'sendToWebSocket', {
                                type: 'chat_offer',
                                userId: _this.chat.userId,
                                deviceId: _this.chat.deviceId,
                                offerDescription: _options.peerConnection.localDescription
                            });
                        };
                        _this.createLocalOfferAuto(
                            options,
                            function(createError, _options) {
                                if (createError) {
                                    _this.chat.trigger('error', { message: createError });
                                    return;
                                }

                                peerConnection = _options.peerConnection;
                                dataChannel = _options.dataChannel;
                                _this.chat.trigger('log', { message: 'done: createLocalOfferAuto' });
                            }
                        );
                        break;
                    case _this.MODE.CREATING_ANSWER:
                        var offerDeviceId;
                        options.onicecandidate = function(_options) {
                            _this.mode = _this.MODE.WAITING;
                            _this.connectionsByDeviceId[offerDeviceId].ondatachannel = _this.onDataChannel.bind(_this, offerDeviceId, options);
                            _this.chat.trigger('throw', 'sendToWebSocket', {
                                type: 'chat_answer',
                                userId: _this.chat.userId,
                                offerDeviceId: offerDeviceId,
                                deviceId: _this.chat.deviceId,
                                answerDescription: _options.peerConnection.localDescription
                            });
                        };
                        _this.createLocalAnswerAuto(
                            options,
                            function(createError, _options) {
                                if (createError) {
                                    _this.chat.trigger('error', { message: createError });
                                    return;
                                }

                                offerDeviceId = _options.offerDeviceId;
                                _this.connectionsByDeviceId[offerDeviceId] = _options.peerConnection;
                                _this.chat.trigger('log', { message: 'done: createLocalAnswerAuto' });
                            }
                        );
                        break;
                    case _this.MODE.ACCEPTING_ANSWER:
                        _this.acceptRemoteAnswerAuto(
                            options,
                            function(createError, _options) {
                                if (createError) {
                                    _this.chat.trigger('error', { message: createError });
                                    return;
                                }

                                _this.mode = _this.MODE.WAITING;
                                _this.chat.trigger('throw', 'sendToWebSocket', {
                                    type: 'chat_accept',
                                    userId: _this.chat.userId,
                                    deviceId: _this.chat.deviceId,
                                    answerDeviceId: _options.answerDeviceId
                                });
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

                        _this.createLocalOffer({ peerConnection: peerConnection }, callback);
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

                        _this.createLocalAnswer({
                            peerConnection: peerConnection,
                            remoteOfferDescription: options.remoteOfferDescription
                        }, callback);
                    }
                );
            },

            acceptRemoteAnswerAuto: function(options, callback) {
                var _this = this;
                _this.chat.trigger('log', { message: 'try: acceptRemoteAnswerAuto:setRemoteDescription' });
                try {
                    var remoteAnswerDescription = new RTCSessionDescription(options.remoteAnswerDescription);
                    var answerDeviceId = _this.extractDeviceId(remoteAnswerDescription);
                    _this.connectionsByDeviceId[_this.chat.deviceId].setRemoteDescription(remoteAnswerDescription);
                } catch (error) {
                    if (callback) {
                        callback(error);
                    }
                    return;
                }

                _this.chat.trigger('log', { message: 'done: acceptRemoteAnswerAuto:setRemoteDescription' });
                if (callback) {
                    callback(null, { answerDeviceId: answerDeviceId });
                }
            },

            /**
             * each time client tries to define its address
             * @param peerConnection
             * @param options
             * @param event
             */
            onICEcandidate: function(peerConnection, options, event) {
                if (event.candidate == null) {
                    this.chat.trigger('log', { message: 'done: ICE candidate' });
                    if (options.onicecandidate) {
                        options.onicecandidate({
                            peerConnection: peerConnection
                        });
                    }
                } else {
                    this.chat.trigger('log', { message: 'next: ICE candidate' });
                }
            },

            onDataChannel: function(offerDeviceId, options, event) {
                this.chat.trigger('log', { message: 'Data Channel established' });
                this.dataChannelsByDeviceId[offerDeviceId] = event.channel;
                this.addDataChannelListeners(event.channel);
            },

            /**
             * create peer connection and pass it to the device id state
             * @param options
             * @param callback
             */
            createRTCPeerConnection: function(options, callback) {
                var _this = this;
                _this.chat.trigger('log', { message: 'try: createRTCPeerConnection' });
                try {
                    var peerConnection = new webkitRTCPeerConnection(_this.configuration.RTC, _this.configuration.constraints);
                } catch (error) {
                    if (callback) {
                        callback(error);
                    }
                    return;
                }

                peerConnection.onicecandidate = _this.onICEcandidate.bind(_this, peerConnection, options);

                _this.chat.trigger('log', { message: 'done: createRTCPeerConnection' });
                if (callback) {
                    callback(null, peerConnection);
                }
            },

            addDataChannelListeners: function(dataChannel) {
                var _this = this;
                if (!dataChannel) {
                    return;
                }
                _this.removeDataChannelListeners(dataChannel);

                dataChannel.onopen = function() {
                    _this.chat.trigger('log', { message: 'Data channel connection established!' });
                };
                dataChannel.onmessage = function(event) {
                    var remoteMessage = JSON.parse(event.data);
                    _this.chat.messages.addRemoteMessage(remoteMessage, function(error, message) {
                        _this.chat.messages.renderMessage({ scrollTop : true }, message);
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
                    var dataChannel = options.peerConnection.createDataChannel(_this.chat.chatId, {reliable: true});
                } catch (error) {
                    callback(error);
                }

                _this.addDataChannelListeners(dataChannel);
                callback(null, dataChannel);
            },

            createLocalOffer: function(options, callback) {
                var _this = this;
                _this.chat.trigger('log', { message: 'try: createLocalOffer' });
                if (!options.peerConnection) {
                    if (callback) {
                        callback(new Error('No peer connection'));
                    }
                    return;
                }

                _this.chat.trigger('log', { message: 'try: createLocalOffer:setupDataChannel' });
                _this.createDataChannel(options, function(setupError, dataChannel) {
                    if (setupError) {
                        if (callback) {
                            callback(setupError);
                        }
                        return;
                    }
                    _this.chat.trigger('log', { message: 'done: createLocalOffer:setupDataChannel' });
                    _this.chat.trigger('log', { message: 'try: createLocalOffer:createOffer' });

                    options.peerConnection.createOffer(
                        function(localDescription) {
                            _this.chat.trigger('log', { message: 'done: createLocalOffer:createOffer' });
                            _this.chat.trigger('log', { message: 'try: createLocalOffer:setLocalDescription' });
                            options.peerConnection.setLocalDescription(
                                localDescription,
                                function() {
                                    _this.chat.trigger('log', { message: 'done: createLocalOffer:setLocalDescription' });
                                    if (callback) {
                                        callback(null, {
                                            peerConnection: options.peerConnection,
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
                    );
                });
            },

            createLocalAnswer: function(options, callback) {
                var _this = this;
                _this.chat.trigger('log', { message: 'try: createLocalAnswer' });
                if (!options.peerConnection) {
                    if (callback) {
                        callback(new Error('No peer connection'));
                    }
                    return;
                }

                _this.chat.trigger('log', { message: 'try: createLocalAnswer:setRemoteDescription' });
                try {
                    var remoteOfferDescription = new RTCSessionDescription(options.remoteOfferDescription);
                    var offerDeviceId = _this.extractDeviceId(remoteOfferDescription);
                    _this.chat.trigger('log',{ message: 'Extracted peer device id from offer => ' + offerDeviceId});
                    options.peerConnection.setRemoteDescription(remoteOfferDescription);
                } catch (error) {
                    if (callback) {
                        callback(new Error('No peer connection'));
                    }
                    return;
                }
                _this.chat.trigger('log', { message: 'done: createLocalAnswer:setRemoteDescription' });
                _this.chat.trigger('log', { message: 'try: createLocalAnswer:createAnswer' });

                options.peerConnection.createAnswer(
                    function(localDescription) {
                        _this.chat.trigger('log', { message: 'done: createLocalAnswer:createAnswer' });
                        _this.chat.trigger('log', { message: 'try: createLocalAnswer:setLocalDescription' });
                        options.peerConnection.setLocalDescription(
                            localDescription,
                            function() {
                                _this.chat.trigger('log', { message: 'done: createLocalAnswer:setLocalDescription' });
                                if (callback) {
                                    callback(null, {
                                        peerConnection: options.peerConnection,
                                        offerDeviceId: offerDeviceId
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
                _this.removeEventListeners();
                _this.removeDataChannelListeners();
            },

            /**
             * broadcast for all data channels for current chat
             * @param broadcastData
             */
            broadcastMessage: function(broadcastData) {
                var _this = this;
                for (var deviceId in _this.dataChannelsByDeviceId) {
                    if (_this.dataChannelsByDeviceId[deviceId].readyState === "open") {
                        _this.dataChannelsByDeviceId[deviceId].send(broadcastData);
                    } else {
                        console.log('removed old data channel connection with device id => ', deviceId);
                        delete _this.dataChannelsByDeviceId[deviceId];
                    }
                }
            }
        };
        extend(webrtc, throw_event_core);
        extend(webrtc, template_core);

        webrtc.prototype.webrtc_template = webrtc.prototype.template(webrtc_template);
        webrtc.prototype.waiter_template = webrtc.prototype.template(waiter_template);

        return webrtc;
    }
);
