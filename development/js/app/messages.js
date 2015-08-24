define('messages', [
        'throw_event_core',
        'template_core',
        'id_core',
        'overlay_core',
        'switcher_core',
        'extend_core',
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
             switcher_core,
             extend_core,
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

            render: function(options, _module) {
                var _this = this;
                _this._module = _module;
                _this.fillListMessage(options);
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
                if (!_this._module.body_container) {
                    return;
                }
                var changeMode = _this._module.body.previousMode !== _this._module.bodyOptions.mode;
                indexeddb.getAll(
                    _this._module.collectionDescription,
                    _this.tableDefinition(_this._module, _this._module.bodyOptions.mode),
                    function(getAllErr, messages) {
                        if (getAllErr) {
                            _this._module.body_container.innerHTML = getAllErr.message || getAllErr;
                            return;
                        }

                        if (messages.length === 0) {
                            _this._module.body_container.innerHTML = "";
                        }

                        if (_this._module.currentListOptions.final > messages.length || !_this._module.currentListOptions.final) {
                            _this._module.currentListOptions.final = messages.length;
                        }
                        if (_this._module.currentListOptions.previousStart !== _this._module.currentListOptions.start ||
                            _this._module.currentListOptions.previousFinal !== _this._module.currentListOptions.final ||
                            changeMode) {
                            _this.showSpinner(_this._module.body_container);
                            _this._module.currentListOptions.previousStart = _this._module.currentListOptions.start;
                            _this._module.currentListOptions.previousFinal = _this._module.currentListOptions.final;

                            var generatedMessages = [];
                            var currentTemplate;
                            switch (_this._module.bodyOptions.mode) {
                                case _this._module.body.MODE.LOGGER:
                                    currentTemplate = _this.log_message_template;
                                    break;
                                case _this._module.body.MODE.MESSAGES:
                                    currentTemplate = _this.message_template;
                                    break;
                            }

                            for (var i = _this._module.currentListOptions.start; i < _this._module.currentListOptions.final; i++) {
                                generatedMessages.push(currentTemplate({
                                    message: messages[i],
                                    ws_device_id: event_bus.get_ws_device_id(),
                                    messageConstructor: HTML_message.prototype
                                }));
                            }
                            _this._module.body_container.innerHTML = generatedMessages.join('');
                            //_this.scrollTo(options);
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
            addMessage: function(_module, mode, options, callback) {
                var _this = this;
                var Message = _this.getMessageConstructor(mode);
                var message = (new Message({innerHTML: options.messageInnerHTML})).toJSON();

                indexeddb.addAll(
                    _this.chat.collectionDescription,
                    _this.tableDefinition(_module, mode),
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
                            var messageData = {
                                type: "notifyChat",
                                chat_type: "chat_message",
                                message: message,
                                chat_description: {
                                    chat_id: _this.chat.chat_id
                                }
                            };
                            webrtc.broadcastMessage(JSON.stringify(messageData));
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
                    ws_device_id: event_bus.get_ws_device_id(),
                    messageConstructor: HTML_message.prototype
                });
                //_this._module.currentListOptions.final += 1;
                _this.chat.messages_PaginationOptions.currentPage = null;
                _this.chat.render(null, null);
                _this.scrollTo(options);
            },

            addRemoteMessage: function(remoteMessage, callback) {
                var _this = this;
                var message = (new HTML_message(remoteMessage.message)).toJSON();

                indexeddb.addAll(
                    _this.chat.collectionDescription,
                    _this.tableDefinition(_this._module, _this.chat.body.MODE.MESSAGES),
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
        extend_core.prototype.inherit(messages, throw_event_core);
        extend_core.prototype.inherit(messages, template_core);
        extend_core.prototype.inherit(messages, id_core);
        extend_core.prototype.inherit(messages, overlay_core);
        extend_core.prototype.inherit(messages, switcher_core);

        messages.prototype.message_template = messages.prototype.template(message_template);
        messages.prototype.log_message_template = messages.prototype.template(log_message_template);

        return messages;
    });
