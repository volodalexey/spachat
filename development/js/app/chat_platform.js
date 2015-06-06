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
                _this.on('addNewChatAuto', _this.addNewChatAuto, _this);
                _this.on('resize', _this.resizeChats, _this);
                websocket.on('message', _this.onMessageRouter, _this);
            },

            removeEventListeners: function() {
                var _this = this;
                _this.off('addNewChatAuto');
                _this.off('resize');
                websocket.off('message');
            },

            resizeChats: function() {
                chat.prototype.chatsArray.forEach(function(_chat) {
                    _chat.calcMessagesContainerHeight();
                });
            },

            onMessageRouter: function(event) {
                var _this = this, parsedData = JSON.parse(event);
                switch (parsedData.type) {
                    case 'created':
                        _this.chatCreateApproved(parsedData);
                        break;
                }
            },

            /**
             * sends future chat description to the server to check if such chat is already exist
             */
            addNewChatAuto: function(event) {
                var _this = this;
                if (!_this.mainConteiner || !websocket) {
                    return;
                }

                _this['addNewChatAuto__'] = event.target;
                event.target.disabled = true;

                var chat_description = {
                    "userId": _this.navigator.userId,
                    "chatId": chat.prototype.generateId()
                };

                websocket.sendMessage({
                    "type": "create",
                    "chat_description": chat_description
                });
            },

            /**
             * received confirmation from server
             * save into indexedDB
             * @param event - server approved chat description
             */
            chatCreateApproved: function(event) {
                var _this = this;
                indexeddb.addOrUpdateAll(
                    _this.collectionDescription,
                    [
                        event.chat_description
                    ],
                    function(error) {
                        if (_this['addNewChatAuto__']) {
                            _this['addNewChatAuto__'].disabled = false;
                            _this['addNewChatAuto__'] = null;
                        }
                        if (error) {
                            console.error(error);
                            return;
                        }
                        _this.createChatLayout(event.chat_description);
                    }
                );
            },

            createChatLayout: function(chat_description) {
                var _this = this;
                var newChat = new chat(chat_description);
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