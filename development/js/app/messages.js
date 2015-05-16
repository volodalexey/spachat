define('messages', [

        'text!../html/message_template.html'
    ],
    function(

        message_template
    ) {

        var messages = function() {
        };

        messages.prototype = {

            message_template: _.template(message_template),

            initialize: function(options) {
                var _this = this;
                _this.data = {
                    options: options,
                    chat: options.chat,
                    collection: {
                        "id": options.chat.chatsArray.length,
                        "db_name": options.chat.chatsArray.length + '_chat_messages',
                        "table_name": options.chat.chatsArray.length + '_chat_messages',
                        "db_version": 1,
                        "keyPath": "id"
                    }
                };

                _this.addEventListeners();
                _this.messages_container = _this.data.chat.chatElem.querySelector('[data-role="messages_container"]');
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
                if (!_this.messages_container) {
                    return;
                }

                _this.messages_container.innerHTML = "";
                // TODO use trigger to chat ?
                _this.data.chat.indexeddb.getAll(_this.data.collection, function(getAllErr, messages) {
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
                            message: messages[i].innerHTML
                        }));
                    }
                    _this.messages_container.innerHTML = generatedMessages.join('');
                    _this.scrollTo(options);
                });
            },

            addMessage: function(options, newMessage) {
                var _this = this;
                // TODO check which page is current
                _this.data.chat.indexeddb.addOrUpdateAll(
                    _this.data.collection,
                    [
                        {
                            id: new Date().getTime(),
                            innerHTML: newMessage
                        }
                    ],
                    function(error) {
                        if (error) {
                            return;
                        }
                        _this.messages_container.innerHTML = _this.messages_container.innerHTML + _this.message_template({
                                message: newMessage
                            });
                        _this.scrollTo(options);
                    }
                );
            }
        };

        return messages;
    });
