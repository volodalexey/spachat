define('chat_platform', [
        'chat',

        'overlay_core',
        'event_core'
    ],
    function(chat,

             overlay_core,
             event_core) {

        var chat_platform = function() {
            this.link = /chat/;
            this.withPanels = true;
            this.bindContexts();
        };

        chat_platform.prototype = {

            render: function() {
                var _this = this;
                _this.addEventListeners();
                //_this.login_container = document.querySelector('[data-role="login_container_global"]');
                //_this.messages_container_Array = document.querySelectorAll('[data-role="messages_container"]');
            },

            dispose: function() {
                var _this = this;
                _this.removeEventListeners();
            },

            bindContexts: function() {
                var _this = this;
                _this.bindedOnresizeWindow = _this.onresizeWindow.bind(_this);
            },

            addEventListeners: function() {
                var _this = this;
                _this.removeEventListeners();
                _this.on('addNewRoom', _this.addNewRoom, _this);
            },

            removeEventListeners: function() {
                var _this = this;
                _this.off('addNewRoom');
            },

            onresizeWindow: function() {
                var _this = this;
                chat.prototype.chatsArray.forEach(function(_chat) {
                    _chat.calcMessagesContainerHeight();
                });
            },

            addNewRoom: function() {
                var _this = this, newChat = new chat();
                _this.mainConteiner = document.querySelector('[data-role="main_container"]');
                if (!_this.mainConteiner) {
                    return;
                }
                var newChatElem = document.createElement('div');
                chat.prototype.chatsArray.push(newChat);
                newChat.initialize(newChatElem, _this.mainConteiner);
            },

            clearStory: function() {
                chat.prototype.chatsArray.forEach(function(chat) {
                    chat.querySelector('[data-role="messages_container"]').innerHTML = "";
                });
            }

        };
        extend(chat_platform, overlay_core);
        extend(chat_platform, event_core);

        return new chat_platform();
    });