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

            initialize: function() {
                var _this = this;
                _this.addEventListeners();
                _this.login_container = document.querySelector('[data-role="login_container_global"]');
                _this.messages_container_Array = document.querySelectorAll('[data-role="messages_container"]');
                return _this;
            },

            render: function() {
                var _this = this;
                _this.trigger('renderPanels');
                _this.toggleWaiter(true);
            },

            dispose: function() {
                var _this = this;
                _this.removeEventListeners();
            },

            bindContexts: function() {
                var _this = this;
                _this.bindedOnresizeWindow = _this.onresizeWindow.bind(_this);
                _this.bindedClearStory = _this.clearStory.bind(_this);
                _this.bindedAddNewChat = _this.addNewChat.bind(_this);
            },

            addEventListeners: function() {
                var _this = this;
                _this.removeEventListeners();
                window.addEventListener('resize', _this.bindedOnresizeWindow, false);
                panel_platform.on('clearStory', _this.bindedClearStory, _this);
                panel_platform.on('addNewRoom', _this.bindedAddNewChat, _this);
            },

            removeEventListeners: function() {
                var _this = this;
                window.removeEventListener('resize', _this.bindedOnresizeWindow, false);
                panel_platform.off('clearStory');
                panel_platform.off('addNewChat');
            },

            onresizeWindow: function() {
                var _this = this;
                chat.prototype.chatsArray.forEach(function(_chat) {
                    _chat.calcMessagesContainerHeight();
                });
            },

            addNewChat: function() {
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
                var _this = this;
                localStorage.clear();
/*                _.each(chat.prototype.chatsArray, function(chat) {
                    chat.querySelector('[data-role="messages_container"]').innerHTML = "";
                });*/
                chat.prototype.chatsArray.forEach(function(chat) {
                    chat.querySelector('[data-role="messages_container"]').innerHTML = "";
                })
            }

        };
        extend(chat_platform, overlay_core);
        extend(chat_platform, event_core);

        return new chat_platform();
    });