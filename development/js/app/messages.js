define('messages', [],
    function() {

        var messages = function() {
        };

        messages.prototype = {

            initialize: function(newChat, obj) {
                var _this = this;
                _this.addEventListeners();
                _this.newChat = newChat;
                _this.messages_container = _this.newChat.querySelector('[data-role="messages_container"]');
                _this.fillListMessage(obj);
                return _this;
            },

            addEventListeners: function() {
                var _this = this;
                _this.removeEventListeners();
            },

            removeEventListeners: function() {
                var _this = this;
            },

            fillListMessage: function(obj) {
                var _this = this;
                if (_this.messages_container) {
                    _this.messages_container.innerHTML = "";
                    if (obj.final > localStorage.length) {
                        obj.final = localStorage.length;
                    }
                    for (var i = obj.start; i < obj.final; i++) {
                        var newMessage = document.createElement('div');
                        var key = localStorage.key(i);
                        newMessage.innerHTML = localStorage.getItem(key);
                        _this.messages_container.appendChild(newMessage);
                    }
                }
                _this.messages_container.scrollTop = 9999;
            }

        }
        return messages;
    });
