define('messages', [
        'throw_event_core',
        'template_core',
        'id_core',
        'overlay_core',
        //
        'indexeddb',
        'html_message',
        'html_log_message',
        'webrtc',
        'event_bus',
        //
        'text!../templates/body/message_template.ejs',
        'text!../templates/body/log_message_template.ejs'
    ],
    function(throw_event_core,
             template_core,
             id_core,
             overlay_core,
             //
             indexeddb,
             HTML_message,
             HTML_log_message,
             webrtc,
             event_bus,
             //
             message_template,
             log_message_template) {

        var messages = function(options) {
            this.chat = options.chat;
        };

        messages.prototype = {

            render: function(options, chat) {
                var _this = this;

                _this.fillListMessage(options);
            },

            tableDefinition: function(mode){
                var _this = this, table_name;

                switch (mode) {
                    case _this.chat.body.MODE.MESSAGES:
                        table_name = ['messages'];
                        break;
                    case _this.chat.body.MODE.LOGGER:
                        table_name = ['log_messages'];
                        break;
                }
                return table_name;
            },

            getMessageConstructor: function(mode) {
                var _this = this, Constructor;

                switch (mode) {
                    case _this.chat.body.MODE.MESSAGES:
                        Constructor = HTML_message;
                        break;
                    case _this.chat.body.MODE.LOGGER:
                        Constructor = HTML_log_message;
                        break;
                }
                return Constructor;
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
                    _this.chat.collectionDescription,
                    _this.tableDefinition(_this.chat.bodyOptions.mode),
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
                            _this.showSpinner(_this.chat.body_container);
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
                                    message: messages[i],
                                    deviceId: event_bus.getDeviceId(),
                                    messageConstructor: HTML_message.prototype
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
             */
            addMessage: function(mode, options, callback) {
                var _this = this;
                var Message = _this.getMessageConstructor(mode);
                var message = (new Message({innerHTML: options.messageInnerHTML})).toJSON();

                indexeddb.addAll(
                    _this.chat.collectionDescription,
                    _this.tableDefinition(mode),
                    [
                        message
                    ],
                    function(error) {
                        if (error) {
                            if (callback) {
                                callback(error);
                            } else {
                                console.error(error);
                            }
                            return;
                        }

                        if (_this.chat.bodyOptions.mode === _this.chat.body.MODE.MESSAGES &&
                            mode === _this.chat.body.MODE.MESSAGES) {
                            webrtc.broadcastMessage(JSON.stringify(message));
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
                    message: message,
                    deviceId: event_bus.getDeviceId(),
                    messageConstructor: HTML_message.prototype
                });
                //_this.chat.messagesOptions.final += 1;
                _this.chat.messages_PaginationOptions.currentPage = null;
                _this.chat.render(null, null);
                _this.scrollTo(options);
            },

            addRemoteMessage: function(remoteMessage, callback) {
                var _this = this;
                // TODO distinct this chat messages from other
                var message = (new HTML_message(remoteMessage)).toJSON();

                indexeddb.addAll(
                    _this.chat.collectionDescription,
                    _this.tableDefinition(_this.chat.body.MODE.MESSAGES),
                    [
                        message
                    ],
                    function(error) {
                        if (error) {
                            if (callback) {
                                callback(error);
                            } else {
                                console.error(error);
                            }
                            return;
                        }

                        if (_this.chat.bodyOptions.mode === _this.chat.body.MODE.MESSAGES) {
                            _this.renderMessage({ scrollTop : true }, message);
                        }
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
        extend(messages, overlay_core);

        messages.prototype.message_template = messages.prototype.template(message_template);
        messages.prototype.log_message_template = messages.prototype.template(log_message_template);

        return messages;
    });
