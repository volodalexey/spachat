define('messages', [
        'throw_event_core',
        'template_core',
        'id_core',

        'indexeddb',
        'message',

        'text!../templates/body/message_template.ejs',
        'text!../templates/body/log_message_template.ejs'
    ],
    function(throw_event_core,
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

                _this.collectionDescription = {
                    "db_name": _this.chat.chatId + '_chat',
                    "table_names": [],
                    "db_version": 1,
                    "keyPath": "id"
                };

                _this.tableDefinition(_this.chat.bodyOptions.mode);
                _this.fillListMessage(options);
            },

            tableDefinition: function(mode){
                var _this = this;

                switch (mode) {
                    case _this.chat.body.MODE.MESSAGES:
                        _this.collectionDescription.table_names = [_this.chat.chatId + '_messages'];
                        break;
                    case _this.chat.body.MODE.LOGGER:
                        _this.collectionDescription.table_names = [_this.chat.chatId + '_logs'];
                        break;
                }
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
                indexeddb.getAll(
                    _this.collectionDescription,
                    null,
                    function(getAllErr, messages) {
                        if (getAllErr) {
                            _this.chat.body_container.innerHTML = getAllErr.message || getAllErr;
                            return;
                        }

                        if (messages.length === 0) {
                            _this.chat.body_container.innerHTML = "";
                        }

                        if (_this.chat.messagesOptions.final > messages.length || !_this.chat.messagesOptions.final) {
                            _this.chat.messagesOptions.final = messages.length;
                        }
                        if (_this.chat.messagesOptions.previousStart !== _this.chat.messagesOptions.start ||
                            _this.chat.messagesOptions.previousFinal !== _this.chat.messagesOptions.final) {
                            _this.chat.body_container.innerHTML = "";
                            _this.chat.messagesOptions.previousStart = _this.chat.messagesOptions.start;
                            _this.chat.messagesOptions.previousFinal = _this.chat.messagesOptions.final;

                            var generatedMessages = [];
                            var currentTemplate;
                            switch (_this.chat.bodyOptions.mode) {
                                case _this.chat.body.MODE.LOGGER:
                                    currentTemplate = _this.log_message_template;
                                    break;
                                case _this.chat.body.MODE.MESSAGES:
                                    currentTemplate = _this.message_template;
                                    break;
                            }

                            for (var i = _this.chat.messagesOptions.start; i < _this.chat.messagesOptions.final; i++) {
                                generatedMessages.push(currentTemplate({
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
            addLocalMessage: function(log, options, callback) {
                var _this = this;
                // TODO distinct this chat messages from other
                var message = new Message({innerHTML: options.messageInnerHTML});

                if (_this.chat.formatOptions.iSender){
                    message.ids[message.id].sender = 1 ;
                } else {
                    message.ids[message.id].sender = 0;
                }

                _this.tableDefinition(log);
                indexeddb.addOrUpdateAll(
                    _this.collectionDescription,
                    null,
                    [
                        message
                    ],
                    function(error) {
                        switch (_this.chat.bodyOptions.mode) {
                            case _this.chat.body.MODE.MESSAGES:
                                _this.chat.webrtc.broadcastMessage(JSON.stringify(message));
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
                //_this.chat.messagesOptions.final += 1;
                _this.chat.paginationMessageOptions.currentPage = null;
                _this.chat.render(null, null);
                _this.scrollTo(options);
            },

            addRemoteMessage: function(remoteMessage, callback) {
                var _this = this;
                // TODO distinct this chat messages from other
                var message = new Message(remoteMessage);
                _this.tableDefinition(log);

                indexeddb.addOrUpdateAll(
                    _this.collectionDescription,
                    null,
                    [
                        message
                    ],
                    function(error) {
                        callback && callback(error, message);
                    }
                );
            },

            destroy: function() {
                var _this = this;
            }
        };
        extend(messages, throw_event_core);
        extend(messages, template_core);
        extend(messages, id_core);

        messages.prototype.message_template = messages.prototype.template(message_template);
        messages.prototype.log_message_template = messages.prototype.template(log_message_template);

        return messages;
    });
