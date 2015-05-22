define('chat_platform', [
        'chat',
        'panel_platform',
        'overlay_core',
        'event_core'
    ],
    function(chat,
             panel_platform,
             overlay_core,
             event_core) {

        var chat_platform = function() {
        };

        chat_platform.prototype = {

            link: 'chat',

            initialize: function() {
                var _this = this;
                _this.bindContexts();
                _this.addEventListeners();
                _this.login_container = document.querySelector('[data-role="login_container_global"]');
                _this.messages_container_Array = document.querySelectorAll('[data-role="messages_container"]');
                return _this;
            },

            render: function() {
                var _this = this;
                _this.trigger('addNewPanel');
                //panel_platform.addNewPanel();
                _this.toggleWaiter(true);
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
                //panel_platform.on('clearStory', _this.bindedClearStory, _this);
                //panel_platform.on('addNewChat', _this.bindedAddNewChat, _this);
            },

            removeEventListeners: function() {
                var _this = this;
                window.removeEventListener('resize', _this.bindedOnresizeWindow, false);
                //panel_platform.off('clearStory');
                //panel_platform.off('addNewChat');
            },

            onresizeWindow: function() {
                var _this = this;
                panel_platform.resizePanels();

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
                _.each(chat.prototype.chatsArray, function(chat) {
                    chat.querySelector('[data-role="messages_container"]').innerHTML = "";
                })
            }

        };
        extend(chat_platform, overlay_core);
        extend(chat_platform, event_core);

        return new chat_platform().initialize();
    });