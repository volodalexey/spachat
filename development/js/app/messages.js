define('messages', [
        'event_core',
        'template_core',
        'id_core',

        'indexeddb',
        'message',

        'text!../templates/body/message_template.ejs',
        'text!../templates/body/log_message_template.ejs'
    ],
    function(event_core,
             template_core,
             id_core,
             indexeddb,
             Message,
             message_template,
             log_message_template) {

        var messages = function() {
        };

        messages.prototype = {

            render: function(options, chat) {
                var _this = this;

                _this.chat = chat;
                _this.messagesCollectionDescription = {
                    "id": _this.chat.chatId,
                    "db_name": _this.chat.chatId + '_chat',
                    "table_name": _this.chat.chatId + '_messages',
                    "db_version": 1,
                    "keyPath": "id"
                };
                _this.logsCollectionDescription = {
                    "id": _this.chat.chatId,
                    "db_name": _this.chat.chatId + '_chat',
                    "table_name": _this.chat.chatId + '_logs',
                    "db_version": 1,
                    "keyPath": "id"
                };

                switch (_this.chat.bodyOptions.mode) {
                    case _this.chat.body.MODE.MESSAGES:
                        _this.collectionDescription = _this.messagesCollectionDescription;
                        break;
                    case _this.chat.body.MODE.LOGGER:
                        _this.collectionDescription = _this.logsCollectionDescription;
                        break;
                }
                _this.fillListMessage(options);
            },

            scrollTo: function(options) {
                var _this = this;
                if (options.scrollTop) {
                    if (typeof options.scrollTop == 'number') {
                        _this.chat.body_container.scrollTop = options.scrollTop;
                    } else {
                        _this.chat.body_container.scrollTop = _this.chat.body_container.scrollHeight;
                    }
                }
            },

            fillListMessage: function(options) {
                var _this = this;
                if (!_this.chat.body_container) {
                    return;
                }

                //_this.chat.body_container.innerHTML = "";
                indexeddb.getAll(
                    _this.collectionDescription,
                    function(getAllErr, messages) {
                        if (getAllErr) {
                            _this.chat.body_container.innerHTML = getAllErr.message || getAllErr;
                            return;
                        }

                        if (_this.chat.messagesOptions.final > messages.length || !_this.chat.messagesOptions.final) {
                            _this.chat.messagesOptions.final = messages.length;
                        }
                        if (_this.chat.messagesOptions.previousStart !== _this.chat.messagesOptions.start || _this.chat.messagesOptions.previousFinal !== _this.chat.messagesOptions.final) {
                            _this.chat.body_container.innerHTML = "";
                            _this.chat.messagesOptions.previousStart = _this.chat.messagesOptions.start;
                            _this.chat.messagesOptions.previousFinal = _this.chat.messagesOptions.final;

                            var generatedMessages = [];
                            for (var i = _this.chat.messagesOptions.start; i < _this.chat.messagesOptions.final; i++) {
                                generatedMessages.push(_this.message_template({
                                    message: messages[i]
                                }));
                            }
                            _this.chat.body_container.innerHTML = generatedMessages.join('');
                            _this.scrollTo(options);
                        } else {
                            if (options.callback) {
                                options.callback();
                            }
                        }
                    }
                );
            },

            /**
             * add message to the database
             * @param options
             * @param messageInnerHTML
             */
            addLocalMessage: function(options, callback) {
                var _this = this;
                // TODO distinct this chat messages from other
                var message = new Message({innerHTML: options.messageInnerHTML});

                indexeddb.addOrUpdateAll(
                    _this.collectionDescription,
                    [
                        message
                    ],
                    function(error) {
                        switch (_this.chat.bodyOptions.mode) {
                            case _this.chat.body.MODE.MESSAGES:
                                if (_this.chat.webrtc && _this.chat.webrtc.dataChannel &&
                                    _this.chat.webrtc.dataChannel.readyState === "open") {
                                    _this.chat.webrtc.dataChannel.send(JSON.stringify(message));
                                }
                                break;
                        }

                        callback && callback(error, message);
                    }
                );
            },

            /**
             * show message in chat body if possible
             * @param message
             */
            renderMessage: function(options, message) {
                var _this = this;
                // TODO check which page is current
                _this.chat.body_container.innerHTML += _this.message_template({
                    message: message
                });
                _this.chat.messagesOptions.final += 1;
                _this.scrollTo(options);
            },

            addRemoteMessage: function(remoteMessage, callback) {
                var _this = this;
                // TODO distinct this chat messages from other
                var message = new Message(remoteMessage);

                indexeddb.addOrUpdateAll(
                    _this.messagesCollectionDescription,
                    [
                        message
                    ],
                    function(error) {
                        callback && callback(error, message);
                    }
                );
            }
        };
        extend(messages, event_core);
        extend(messages, template_core);
        extend(messages, id_core);

        messages.prototype.message_template = messages.prototype.template(message_template);

        return messages;
    });
