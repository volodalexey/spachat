define('messages', [
        'event_core',
        'template_core',
        'indexeddb',

        'text!../templates/message_template.ejs'
    ],
    function(
        event_core,
        template_core,
        indexeddb,

        message_template
    ) {

        var messages = function() {
        };

        messages.prototype = {

            render: function(options, chat) {
                var _this = this;

                _this.chat = chat;
                _this.data = {
                    collection: {
                        "id": _this.chat.chatId,
                        "db_name": _this.chat.chatId + '_chat_messages',
                        "table_name": _this.chat.chatId + '_chat_messages',
                        "db_version": 1,
                        "keyPath": "id"
                    }
                };
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

                _this.chat.body_container.innerHTML = "";
                indexeddb.getAll(_this.data.collection, function(getAllErr, messages) {
                    if (getAllErr) {
                        _this.chat.body_container.innerHTML = getAllErr.message || getAllErr;
                        return;
                    }

                    _this.chat.body_container.innerHTML = "";
                    if (_this.chat.messagesOptions.final > messages.length || !_this.chat.messagesOptions.final) {
                        _this.chat.messagesOptions.final = messages.length;
                    }
                    var generatedMessages = [];
                    for (var i = _this.chat.messagesOptions.start; i < _this.chat.messagesOptions.final; i++) {
                        generatedMessages.push(_this.message_template({
                            innerHTML: messages[i].innerHTML
                        }));
                    }
                    _this.chat.body_container.innerHTML = generatedMessages.join('');
                    _this.scrollTo(options);
                    if(options.callback){
                        options.callback();
                    }
                });
            },

            addMessage: function(options, newMessage) {
                var _this = this, message;
                if (options.remote) {
                    message = newMessage;
                } else {
                    message = {
                        id: new Date().getTime(),
                        innerHTML: newMessage
                    };
                    if (_this.chat.webrtc && _this.chat.webrtc.dataChannel &&
                        _this.chat.webrtc.dataChannel.readyState === "open") {
                        _this.chat.webrtc.dataChannel.send(JSON.stringify(message));
                    }
                }

                // TODO check which page is current
                indexeddb.addOrUpdateAll(
                    _this.data.collection,
                    [
                        message
                    ],
                    function(error) {
                        if (error) {
                            return;
                        }
                        _this.chat.body_container.innerHTML = _this.chat.body_container.innerHTML + _this.message_template({
                                innerHTML: message.innerHTML
                            });
                        _this.scrollTo(options);
                    }
                );
            }
        };
        extend(messages, event_core);
        extend(messages, template_core);

        messages.prototype.message_template = messages.prototype.template(message_template);

        return messages;
    });
