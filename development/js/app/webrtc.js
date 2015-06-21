define('webrtc', [
        'event_core',
        'template_core',

        'text!../html/webrtc_template.html',
        'text!../html/waiter_template.html'
    ],
    function(event_core,
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
            _this.channel = 'test';
            _this.bindContexts();
        };

        webrtc.prototype = {

            MODE: {
                LOCAL_OFFER: 'LOCAL_OFFER',
                LOCAL_ANSWER: 'LOCAL_ANSWER'
            },

            render: function(options, chat) {
                var _this = this;
                _this.chat = chat;
                switch (chat.mode) {
                    case chat.MODE.CREATED_AUTO: case chat.MODE.JOINED_AUTO_OFFER:
                        _this.createLocalOfferAuto(
                            options,
                            function(createError) {
                                if (createError) {
                                    _this.trigger('error', { message: createError });
                                    return;
                                }

                                _this.trigger('sendToWebSocket', {
                                    type: 'offer',
                                    userId: chat.userId,
                                    offerDescription: _this.localOfferDescription
                                });
                            }
                        );
                        break;
                    case chat.MODE.JOINED_AUTO_ANSWER:
                        _this.createLocalAnswerAuto(
                            options,
                            function(createError) {
                                if (createError) {
                                    _this.trigger('error', { message: createError });
                                    return;
                                }

                                _this.trigger('sendToWebSocket', {
                                    type: 'answer',
                                    userId: chat.userId,
                                    answerDescription: _this.localAnswerDescription
                                });
                            }
                        );
                        break;
                    case chat.MODE.JOINED_AUTO_ACCEPT:
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

            createLocalOfferManual: function(event) {
                var _this = this;
                _this.removeEventListeners();
                _this.renderWaiter();
                _this.createRTCPeerConnection({mode: _this.MODE.LOCAL_OFFER});
                _this.createLocalOffer();
            },

            /**
             * create session description protocol and send it to the server
             * @param options
             * @param callback
             */
            createLocalOfferAuto: function(options, callback) {
                var _this = this;
                _this.createRTCPeerConnection(
                    {mode: _this.MODE.LOCAL_OFFER},
                    function(createError) {
                        if (createError) {
                            callback(createError);
                            return;
                        }

                        _this.createLocalOffer(options, callback);
                    }
                );
            },

            createLocalAnswerAuto: function(options, callback) {
                var _this = this;
                _this.createRTCPeerConnection(
                    {mode: _this.MODE.LOCAL_ANSWER},
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
                _this.trigger('log', { message: 'try: acceptRemoteAnswerAuto' });
                try {
                    _this.remoteAnswerDescription = new RTCSessionDescription(options.remoteAnswerDescription);
                    _this.peerConnection.setRemoteDescription(_this.remoteAnswerDescription);
                } catch (error) {
                    if (callback) {
                        callback(error);
                    }
                    return;
                }

                _this.trigger('log', { message: 'done: acceptRemoteAnswerAuto' });
            },

            clickAnswerRemoteOffer: function(event) {
                var _this = this;
                _this.removeEventListeners();
                _this.mode = "remoteOffer";
                _this.renderHanshake();
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
                        _this.mode = options.mode;
                        //_this.renderHanshake();
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
                    _this.chat.mode = "messages";
                    _this.trigger('')
                    _this.chat.renderByMode();
                };
                _this.dataChannel.onmessage = function(e) {
                    var message = JSON.parse(e.data);
                    _this.chat.newMessages.addMessage({remote: true}, message);
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
                    _this.data.dataChannel = _this.data.peerConnection.createDataChannel(_this.data.channel, {reliable: true});
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
                            _this.localOfferDescription = desc;
                            _this.peerConnection.setLocalDescription(
                                _this.localOfferDescription,
                                function() {
                                    _this.trigger('log', { message: 'done: createLocalOffer:createOffer' });
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

            clickSubmitRemoteOffer: function() {
                var _this = this;
                var remoteOfferDescription = _this.chat.body_container.querySelector('[data-role="remoteOfferDescription"]');

                if (remoteOfferDescription) {
                    _this.createRTCPeerConnection({mode: "localAnswer"});
                    _this.createLocalAnswer({
                        remoteOfferDescription: JSON.parse(remoteOfferDescription.value)
                    });
                    _this.renderWaiter();
                }
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

                _this.trigger('log', { message: 'try: createLocalAnswer:setupDataChannel' });
                try {
                    _this.remoteOfferDescription = new RTCSessionDescription(options.remoteOfferDescription);
                    _this.peerConnection.setRemoteDescription(_this.remoteOfferDescription);
                } catch (error) {
                    if (callback) {
                        callback(new Error('No peer connection'));
                    }
                    return;
                }
                _this.trigger('log', { message: 'done: createLocalAnswer:setupDataChannel' });
                _this.trigger('log', { message: 'try: createLocalAnswer:createAnswer' });

                _this.peerConnection.createAnswer(
                    function(desc) {
                        _this.localAnswerDescription = desc;
                        _this.peerConnection.setLocalDescription(
                            _this.localAnswerDescription,
                            function() {
                                _this.trigger('log', { message: 'done: createLocalAnswer:createAnswer' });
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

            clickSubmitRemoteAnswer: function(event) {
                var _this = this;
                var remoteAnswerDescription = _this.chat.body_container.querySelector('[data-role="remoteAnswerDescription"]');

                if (remoteAnswerDescription) {
                    _this.remoteAnswerDescription = new RTCSessionDescription(JSON.parse(remoteAnswerDescription.value));
                    _this.peerConnection.setRemoteDescription(_this.remoteAnswerDescription);
                    _this.renderWaiter();
                }
            }
        };
        extend(webrtc, event_core);
        extend(webrtc, template_core);

        webrtc.prototype.webrtc_template = webrtc.prototype.template(webrtc_template);
        webrtc.prototype.waiter_template = webrtc.prototype.template(waiter_template);

        return webrtc;
    }
);
