define('messages', [
        'event_core',
        'template_core',

        'text!../html/message_template.html'
    ],
    function(
        event_core,
        template_core,

        message_template
    ) {

        var messages = function() {
        };

        messages.prototype = {

            //message_template: _.template(message_template),

            initialize: function(options) {
                var _this = this;

                _this.message_template = _this.template(message_template);

                _this.chat = options.chat;
                _this.data = {
                    options: options,
                    collection: {
                        "id": _this.chat.chatsArray.length,
                        "db_name": _this.chat.chatsArray.length + '_chat_messages',
                        "table_name": _this.chat.chatsArray.length + '_chat_messages',
                        "db_version": 1,
                        "keyPath": "id"
                    }
                };
                _this.addEventListeners();
                _this.fillListMessage(options);
                return _this;
            },

            addEventListeners: function() {
                var _this = this;
                _this.removeEventListeners();
            },

            removeEventListeners: function() {
                var _this = this;
            },

            scrollTo: function(options) {
                var _this = this;
                if (options.scrollTop) {
                    if (typeof options.scrollTop == 'number') {
                        _this.messages_container.scrollTop = options.scrollTop;
                    } else {
                        _this.messages_container.scrollTop = _this.messages_container.scrollHeight;
                    }
                }
            },

            fillListMessage: function(options) {
                var _this = this;
                _this.messages_container = _this.chat.chatElem.querySelector('[data-role="messages_container"]');

                if (!_this.messages_container) {
                    return;
                }

                _this.messages_container.innerHTML = "";
                // TODO use trigger to chat ?
                _this.chat.indexeddb.getAll(_this.data.collection, function(getAllErr, messages) {
                    if (getAllErr) {
                        _this.messages_container.innerHTML = getAllErr.message || getAllErr;
                        return;
                    }

                    _this.messages_container.innerHTML = "";
                    if (options.final > messages.length || !options.final) {
                        options.final = messages.length;
                    }
                    var generatedMessages = [];
                    for (var i = options.start; i < options.final; i++) {
                        generatedMessages.push(_this.message_template({
                            innerHTML: messages[i].innerHTML
                        }));
                    }
                    _this.messages_container.innerHTML = generatedMessages.join('');
                    _this.scrollTo(options);
                    if(options.callback){
                        options.callback();
                    }
                    _this.trigger('resizeMessagesContainer');
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
                    if (_this.chat.webrtc && _this.chat.webrtc.data.dataChannel) {
                        _this.chat.webrtc.data.dataChannel.send(JSON.stringify(message));
                    }
                }

                // TODO check which page is current
                _this.chat.indexeddb.addOrUpdateAll(
                    _this.data.collection,
                    [
                        message
                    ],
                    function(error) {
                        if (error) {
                            return;
                        }
                        _this.messages_container.innerHTML = _this.messages_container.innerHTML + _this.message_template({
                                innerHTML: message.innerHTML
                            });
                        _this.scrollTo(options);
                    }
                );
            }
        };
        extend(messages, event_core);
        extend(messages, template_core);

        return messages;
    });
