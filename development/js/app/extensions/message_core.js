define('message_core',
  function() {

    var message_core = function() {
    };

    message_core.prototype = {

      __class_name: "message_core",

      initializeMessagesStack: function() {
        if (!this.messagesStack) {
          this.messagesStack = [];
        }
      },

      proceedNextMessage: function() {
        var _this = this;
        _this.initializeMessagesStack();
        if (_this.onMessageRouter) {
          var parsedMessageData = _this.messagesStack.shift();
          if (parsedMessageData) {
            _this.onMessageRouter(parsedMessageData);
          }
        }
      }
    };

    return message_core;
  }
);