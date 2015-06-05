define('chat_platform', [
        'chat',
        'websocket',

        'overlay_core',
        'event_core',
        'template_core',
        'indexeddb',

        'text!../html/chat_platform_template.html'
    ],
    function(chat,
             websocket,

             overlay_core,
             event_core,
             template_core,
             indexeddb,

             chat_platform_template) {

        var chat_platform = function() {
            this.link = /chat/;
            this.withPanels = true;
            this.mainConteiner = document.querySelector('[data-role="main_container"]');
        };

        chat_platform.prototype = {

            collectionDescription: {
                "id": 'chats',
                "db_name": 'chats',
                "table_name": 'chats',
                "db_version": 1,
                "keyPath": "chatId"
            },

            render: function(options) {
                if (!options || !options.navigator) {
                    console.error(new Error('Invalid input options for render'));
                    return;
                }
                var _this = this;
                _this.navigator = options.navigator;
                if (!_this.mainConteiner) {
                    return;
                }
                _this.mainConteiner.innerHTML = _this.chat_platform_template({});
                _this.cashElements();
                _this.addEventListeners();
                _this.toggleWaiter();
            },

            dispose: function() {
                var _this = this;
                _this.removeEventListeners();
            },

            cashElements: function() {
                var _this = this;
                _this.chat_wrapper = _this.mainConteiner.querySelector('[data-role="chat_wrapper"]');
            },

            addEventListeners: function() {
                var _this = this;
                _this.removeEventListeners();
                _this.on('addNewChat', _this.addNewChat, _this);
                _this.on('resize', _this.resizeChats, _this);
            },

            removeEventListeners: function() {
                var _this = this;
                _this.off('addNewChat');
                _this.off('resize');
            },

            resizeChats: function() {
                chat.prototype.chatsArray.forEach(function(_chat) {
                    _chat.calcMessagesContainerHeight();
                });
            },

            addNewChat: function() {
                var _this = this;
                if (!_this.mainConteiner) {
                    return;
                }
                var newChat = new chat(_this.navigator.userId);
                var chat_item = {
                    "userId": _this.navigator.userId,
                    "chatId": newChat.chatId
                };

                websocket.sendMessage({
                    "type": "create",
                    "chat_item": chat_item
                });


                indexeddb.addOrUpdateAll(
                    _this.collectionDescription,
                    [
                        chat_item
                    ],
                    function(error) {
                        if (error) {
                            console.error(error);
                            return;
                        }
                        //callback();
                    }
                );


                var newChatElem = document.createElement('section');
                chat.prototype.chatsArray.push(newChat);
                newChat.initialize(newChatElem, _this.chat_wrapper);
            }

        };
        extend(chat_platform, overlay_core);
        extend(chat_platform, event_core);
        extend(chat_platform, template_core);

        chat_platform.prototype.chat_platform_template = chat_platform.prototype.template(chat_platform_template);

        return new chat_platform();
    });