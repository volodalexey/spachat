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
            _this.connectionByDeviceId = {};
            _this.channel = 'test';
            _this.bindContexts();
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
                        options.onicecandidate = function(localOfferDescription) {
                            _this.mode = _this.MODE.WAITING;
                            var deviceId = _this.extractDeviceId(localOfferDescription);
                            _this.trigger('deviceId', deviceId);
                            console.log('Extracted device id from offer => ', deviceId);
                            _this.trigger('sendToWebSocket', {
                                type: 'offer',
                                userId: chat.userId,
                                deviceId: chat.deviceId,
                                offerDescription: localOfferDescription
                            });
                        };
                        _this.createLocalOfferAuto(
                            options,
                            function(createError) {
                                if (createError) {
                                    _this.trigger('error', { message: createError });
                                    return;
                                }
                            }
                        );
                        break;
                    case _this.MODE.CREATING_ANSWER:
                        options.onicecandidate = function(description) {
                            _this.mode = _this.MODE.WAITING;
                            _this.localAnswerDescription = description;
                            _this.trigger('sendToWebSocket', {
                                type: 'answer',
                                userId: chat.userId,
                                answerDescription: _this.localAnswerDescription
                            });
                        };
                        _this.createLocalAnswerAuto(
                            options,
                            function(createError) {
                                if (createError) {
                                    _this.trigger('error', { message: createError });
                                    return;
                                }
                            }
                        );
                        break;
                    case _this.MODE.ACCEPTING_ANSWER:
                        _this.acceptRemoteAnswerAuto(
                            options,
                            function(createError) {
                                if (createError) {
                                    _this.trigger('error', { message: createError });
                                    return;
                                }

                                _this.trigger('sendToWebSocket', {
                                    type: 'accept',
                                    userId: chat.userId,
                                    localOfferDescription: _this.localOfferDescription
                                });
                                _this.mode = _this.MODE.WAITING;
                            }
                        );
                    break;
                }
            },

            renderHanshake: function() {
                var _this = this;
                _this.chat.body_container.innerHTML = _this.webrtc_template({data: _this});
                _this.addEventListeners();
            },

            renderWaiter: function() {
                var _this = this;
                _this.chat.body_container.innerHTML = _this.waiter_template();
            },

            bindContexts: function() {
                var _this = this;
                _this.bindedEventRouter = _this.clickEventRouter.bind(_this);
            },

            addEventListeners: function() {
                var _this = this;
                _this.removeEventListeners();
                _this.chat.body_container.addEventListener('click', _this.bindedEventRouter, false);
            },

            removeEventListeners: function() {
                var _this = this;
                _this.chat.body_container.removeEventListener('click', _this.bindedEventRouter, false);
            },

            clickEventRouter: function(event) {
                var _this = this;
                var action = event.target.getAttribute('data-action');
                if (_this[action]) {
                    _this[action](event);
                }
            },

            /**
             * create offer session description protocol and send it to the server
             * @param options
             * @param callback
             */
            createLocalOfferAuto: function(options, callback) {
                var _this = this;
                _this.createRTCPeerConnection(
                    {
                        onicecandidate: options.onicecandidate
                    },
                    function(createError) {
                        if (createError) {
                            callback(createError);
                            return;
                        }

                        _this.createLocalOffer(options, callback);
                    }
                );
            },

            /**
             * create answer session description protocol and send it to the server
             * @param options
             * @param callback
             */
            createLocalAnswerAuto: function(options, callback) {
                var _this = this;
                _this.createRTCPeerConnection(
                    {
                        onicecandidate: options.onicecandidate
                    },
                    function(createError) {
                        if (createError) {
                            callback(createError);
                            return;
                        }

                        _this.createLocalAnswer(options, callback);
                    }
                );
            },

            acceptRemoteAnswerAuto: function(options, callback) {
                var _this = this;
                _this.trigger('log', { message: 'try: acceptRemoteAnswerAuto:setRemoteDescription' });
                try {
                    _this.remoteAnswerDescription = new RTCSessionDescription(options.remoteAnswerDescription);
                    _this.peerConnection.setRemoteDescription(_this.remoteAnswerDescription);
                } catch (error) {
                    if (callback) {
                        callback(error);
                    }
                    return;
                }

                _this.trigger('log', { message: 'done: acceptRemoteAnswerAuto:setRemoteDescription' });
                if (callback) {
                    callback();
                }
            },

            /**
             * create real time communication
             * @param options
             * @param callback
             */
            createRTCPeerConnection: function(options, callback) {
                var _this = this;
                _this.trigger('log', { message: 'try: createRTCPeerConnection' });
                try {
                    _this.peerConnection = new webkitRTCPeerConnection(_this.configuration.RTC, _this.configuration.constraints);
                } catch (error) {
                    if (callback) {
                        callback(error);
                    }
                    return;
                }

                _this.peerConnection.onicecandidate = function(e) {
                    if (e.candidate == null) {
                        _this.trigger('log', { message: 'done: ICE candidate' });
                        if (options.onicecandidate) {
                            options.onicecandidate(_this.peerConnection.localDescription);
                        }
                    }
                };

                _this.peerConnection.ondatachannel = function(event) {
                    console.log('Data Channel established');
                    _this.dataChannel = event.channel;
                    _this.addDataChannelListeners();
                };
                _this.trigger('log', { message: 'done: createRTCPeerConnection' });
                if (callback) {
                    callback(null);
                }
            },

            addDataChannelListeners: function() {
                var _this = this;
                if (!_this.dataChannel) {
                    return;
                }
                _this.removeDataChannelListeners();

                _this.dataChannel.onopen = function() {
                    console.log('Data channel connection established!!!');
                    _this.trigger('webrtc:done');
                };
                _this.dataChannel.onmessage = function(e) {
                    var remoteMessage = JSON.parse(e.data);
                    _this.chat.messages.addRemoteMessage(remoteMessage, function(error, message) {
                        _this.chat.messages.renderMessage({ scrollTop : true }, message);
                    });
                };
            },

            removeDataChannelListeners: function() {
                var _this = this;
                if (!_this.dataChannel) {
                    return;
                }

                _this.dataChannel.onopen = undefined;
                _this.dataChannel.onmessage = undefined;
            },

            setupDataChannel: function(options, callback) {
                var _this = this;

                try {
                    _this.dataChannel = _this.peerConnection.createDataChannel(_this.channel, {reliable: true});
                } catch (error) {
                    callback(error);
                }

                _this.addDataChannelListeners();
                callback(null);
            },

            createLocalOffer: function(options, callback) {
                var _this = this;
                _this.trigger('log', { message: 'try: createLocalOffer' });
                if (!_this.peerConnection) {
                    if (callback) {
                        callback(new Error('No peer connection'));
                    }
                    return;
                }

                _this.trigger('log', { message: 'try: createLocalOffer:setupDataChannel' });
                _this.setupDataChannel({}, function(setupError) {
                    if (setupError) {
                        _this.trigger('log', setupError);
                        if (callback) {
                            callback(setupError);
                        }
                        return;
                    }
                    _this.trigger('log', { message: 'done: createLocalOffer:setupDataChannel' });
                    _this.trigger('log', { message: 'try: createLocalOffer:createOffer' });

                    _this.peerConnection.createOffer(
                        function(desc) {
                            _this.trigger('log', { message: 'done: createLocalOffer:createOffer' });
                            _this.trigger('log', { message: 'try: createLocalOffer:setLocalDescription' });
                            _this.peerConnection.setLocalDescription(
                                desc,
                                function() {
                                    _this.trigger('log', { message: 'done: createLocalOffer:setLocalDescription' });
                                    if (callback) {
                                        callback();
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
                _this.trigger('log', { message: 'try: createLocalAnswer' });
                if (!_this.peerConnection) {
                    if (callback) {
                        callback(new Error('No peer connection'));
                    }
                    return;
                }

                _this.trigger('log', { message: 'try: createLocalAnswer:setRemoteDescription' });
                try {
                    _this.remoteOfferDescription = new RTCSessionDescription(options.remoteOfferDescription);
                    _this.peerConnection.setRemoteDescription(_this.remoteOfferDescription);
                } catch (error) {
                    if (callback) {
                        callback(new Error('No peer connection'));
                    }
                    return;
                }
                _this.trigger('log', { message: 'done: createLocalAnswer:setRemoteDescription' });
                _this.trigger('log', { message: 'try: createLocalAnswer:createAnswer' });

                _this.peerConnection.createAnswer(
                    function(desc) {
                        _this.trigger('log', { message: 'done: createLocalAnswer:createAnswer' });
                        _this.trigger('log', { message: 'try: createLocalAnswer:setLocalDescription' });
                        _this.peerConnection.setLocalDescription(
                            desc,
                            function() {
                                _this.trigger('log', { message: 'done: createLocalAnswer:setLocalDescription' });
                                if (callback) {
                                    callback();
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
            }
        };
        extend(webrtc, throw_event_core);
        extend(webrtc, template_core);

        webrtc.prototype.webrtc_template = webrtc.prototype.template(webrtc_template);
        webrtc.prototype.waiter_template = webrtc.prototype.template(waiter_template);

        return webrtc;
    }
);
