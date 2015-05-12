define ('messages',[],
    function(    ) {

        var messages = function() {
        };

        messages.prototype = {

            initialize: function(newChat){
                var _this = this;
                _this.addEventListeners();
                _this.newChat = newChat;
                return _this;
            },

            addEventListeners: function() {
                var _this = this;
                _this.removeEventListeners();
            },

            removeEventListeners: function() {
                var _this = this;
            }
        }
        return messages;
    });
