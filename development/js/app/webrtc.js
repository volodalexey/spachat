define('webrtc', [
        'event_core',

        'text!../html/webrtc_template.html',
        'text!../html/waiter_template.html'
    ],
    function(event_core,
             webrtc_template,
             waiter_template) {

        var webrtc = function() {
        };

        webrtc.prototype = {

            webrtc_template: _.template(webrtc_template),
            waiter_template: _.template(waiter_template),

            initialize: function(options) {
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
                _this.data = {
                    mode: "start",
                    channel: "test"
                };
                _this.chat = options.chat;

                return _this;
            },

            renderHanshake: function() {
                var _this = this;
                _this.chat.body_outer_container.innerHTML = _this.webrtc_template({data: _this.data});
                _this.addEventListeners();
            },

            renderWaiter: function() {
                var _this = this;
                _this.chat.body_outer_container.innerHTML = _this.waiter_template();
            },

            addEventListeners: function() {
                var _this = this;
                _this.removeEventListeners();
                _this.bindedEventRouter = _this.clickEventRouter.bind(_this);
                _this.chat.body_outer_container.addEventListener('click', _this.bindedEventRouter, false);
            },

            removeEventListeners: function() {
                var _this = this;
                _this.chat.body_outer_container.removeEventListener('click', _this.bindedEventRouter, false);
            },

            clickEventRouter: function(event) {
                var _this = this;
                var action = event.target.getAttribute('data-action');
                if (_this[action]) {
                    _this[action](event);
                }
            },

            clickCreateLocalOffer: function(event) {
                var _this = this;
                _this.removeEventListeners();
                _this.renderWaiter();
                _this.createRTCPeerConnection({mode: "localOffer"});
                _this.createLocalOffer();
            },

            clickAnswerRemoteOffer: function(event) {
                var _this = this;
                _this.removeEventListeners();
                _this.data.mode = "remoteOffer";
                _this.renderHanshake();
            },

            createRTCPeerConnection: function(options) {
                var _this = this;
                _this.data.peerConnection = new webkitRTCPeerConnection(_this.configuration.RTC, _this.configuration.constraints);

                _this.data.peerConnection.onicecandidate = function(e) {
                    if (e.candidate == null) {
                        _this.data.mode = options.mode;
                        _this.renderHanshake();
                    }
                };

                //onaddstream
                //ondatachannel
                //oniceconnectionstatechange
                //onnegotiationneeded
                //onremovestream
                //onsignalingstatechange
            },

            setupDataChannel: function(options, callback) {
                var _this = this;

                try {
                    _this.data.dataChannel = _this.data.peerConnection.createDataChannel(_this.data.channel, {reliable: true});
                } catch (error) {
                    callback(error);
                }

                _this.data.dataChannel.onopen = function() {
                    console.log('Connected');
                    _this.chat.data.mode = "messages";
                    _this.chat.renderByMode();
                };
                _this.data.dataChannel.onmessage = function(e) {
                    var data = JSON.parse(e.data);
                    writeToChatLog(data.message, "text-info");
                };
                callback(null);
            },

            createLocalOffer: function() {
                var _this = this;
                if (!_this.data.peerConnection) {
                    return;
                }

                _this.setupDataChannel({}, function(setupError) {
                    if (setupError) {
                        console.error(setupError);
                        return;
                    }

                    _this.data.peerConnection.createOffer(
                        function(desc) {
                            _this.data.localOfferDescription = desc;
                            _this.data.peerConnection.setLocalDescription(
                                _this.data.localOfferDescription,
                                function() {
                                    console.log('createLocalOffer / setLocalDescription - DONE');
                                },
                                function() {
                                    console.error('createLocalOffer / setLocalDescription - ERROR');
                                }
                            );
                        },
                        function() {
                            console.error('createLocalOffer / setLocalDescription - createOffer');
                        }
                    );
                });
            },

            clickSubmitRemoteOffer: function() {
                var _this = this;
                var remoteOfferDescription = _this.chat.body_outer_container.querySelector('[data-role="remoteOfferDescription"]');

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
                _this.data.remoteOfferDescription = new RTCSessionDescription(options.remoteOfferDescription);
                _this.data.peerConnection.setRemoteDescription(_this.data.remoteOfferDescription);

                _this.data.peerConnection.createAnswer(
                    function(desc) {
                        _this.data.localAnswerDescription = desc;
                        _this.data.peerConnection.setLocalDescription(
                            _this.data.localAnswerDescription,
                            function() {
                                console.log('createLocalAnswer / setLocalDescription - DONE');
                            },
                            function(e) {
                                console.error('createLocalAnswer / setLocalDescription - ERROR');
                            }
                        );
                    },
                    function() {
                        console.error('createLocalAnswer / createAnswer - ERROR');
                    }
                );
            },

            clickSubmitRemoteAnswer: function(event) {
                var _this = this;
                var remoteAnswerDescription = _this.chat.body_outer_container.querySelector('[data-role="remoteAnswerDescription"]');

                if (remoteAnswerDescription) {
                    _this.data.remoteAnswerDescription = new RTCSessionDescription(JSON.parse(remoteAnswerDescription.value));
                    _this.data.peerConnection.setRemoteDescription(_this.data.remoteAnswerDescription);
                    _this.renderWaiter();
                }
            }
        };
        extend(webrtc, event_core);

        return webrtc;
    }
);
