define('chat_platform', [
        'chat',
        'websocket',

        'overlay_core',
        'event_core',
        'template_core',
        'indexeddb',
        'message_core',

        'text!../html/chat_platform_template.html'
    ],
    function(Chat,
             websocket,

             overlay_core,
             event_core,
             template_core,
             indexeddb,
             message_core,

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
                _this.on('joinByChatIdAuto', _this.joinByChatIdAuto, _this);
            },

            removeEventListeners: function() {
                var _this = this;
                _this.off('addNewChatAuto');
                _this.off('resize');
                websocket.off('message');
            },

            resizeChats: function() {
                Chat.prototype.chatsArray.forEach(function(_chat) {
                    _chat.calcMessagesContainerHeight();
                });
            },

            /**
             * route message from web-socket
             * @param event
             */
            onMessageRouter: function(event) {
                var _this = this,
                    parsedMessageData = typeof event === 'string' ? JSON.parse(event) : event;

                _this.initializeMessagesStack();
                if (parsedMessageData.type === 'notifyChat') {
                    Chat.prototype.chatsArray.forEach(function(_chat) {
                        if (parsedMessageData.chat_description.chatId === _chat.chatId) {
                            _chat.trigger('notifyChat', parsedMessageData);
                            //if (_chat[parsedMessageData.notify_data]) {
                            //    _chat[parsedMessageData.notify_data](parsedMessageData);
                            //}
                        }
                    });
                } else {
                    if (_this.messagesStack.length) {
                        _this.messagesStack.push(parsedMessageData);
                    } else {
                        switch (parsedMessageData.type) {
                            case 'created':
                                _this.chatCreateApproved(parsedMessageData);
                            break;
                            case 'joined':
                                _this.chatJoinApproved(parsedMessageData);
                            break;
                            default :
                                console.error(new Error('Message handler not found'));
                        }
                    }
                }
            },

            /**
             * sends future chat description to the server to check if such chat is already exist
             * @param event - click event
             */
            addNewChatAuto: function(event) {
                var _this = this;
                if (!_this.mainConteiner || !websocket) {
                    return;
                }

                _this['addNewChatAuto__'] = event.target;
                event.target.disabled = true;

                var chat_description = {
                    chatId: Chat.prototype.generateId()
                };

                websocket.sendMessage({
                    type: "create",
                    userId: _this.navigator.userId,
                    chat_description: chat_description
                });
            },

            /**
             * received confirmation from server
             * save into indexedDB
             * @param event - server approved chat description
             */
            chatCreateApproved: function(event) {
                var _this = this;
                event.chat_description.userId = _this.navigator.userId;
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
                        event.chat_description.mode = Chat.prototype.MODE.CREATED_AUTO;
                        _this.createChatLayout(event.chat_description, { chat_wrapper: _this.chat_wrapper});
                    }
                );
            },

            /**
             * create chat layout
             * @param chat_description
             * @param renderOptions
             */
            createChatLayout: function(chat_description, renderOptions) {
                var _this = this;
                var newChat = new Chat(chat_description);
                Chat.prototype.chatsArray.push(newChat);
                newChat.initialization(renderOptions);
                setTimeout(function() {
                    _this.proceedNextMessage();
                }, 0);
            },

            /**
             * sends current chat description to the server to retrieve waitForOffer/waitForAnswer state
             * @param event - click event
             */
            joinByChatIdAuto: function(event) {
                var _this = this;
                var wrapper = event.target.parentNode.parentNode;
                var input = wrapper.querySelector('[data-role="chat_id_input"]');
                if (!_this.mainConteiner || !websocket || !wrapper || !input || !input.value) {
                    return;
                }

                _this['joinByChatIdAuto__'] = event.target;
                event.target.disabled = true;

                var chat_description = {
                    "chatId": input.value
                };

                websocket.sendMessage({
                    type: "join",
                    userId: _this.navigator.userId,
                    chat_description: chat_description
                });
            },

            chatJoinApproved: function(event) {
                var _this = this;
                var defineBehaviour = function() {
                    if (event.chat_description.offer) {
                        // Chat already has offer
                        // Create answer
                        event.chat_description.mode = Chat.prototype.MODE.JOINED_AUTO_ANSWER;
                        _this.createChatLayout(
                            event.chat_description,
                            {
                                chat_wrapper: _this.chat_wrapper,
                                remoteOfferDescription: event.chat_description.offer ? event.chat_description.offer.offerDescription : null
                            }
                        );
                    } else {
                        // Chat does not have offer
                        // Create offer
                        event.chat_description.mode = Chat.prototype.MODE.JOINED_AUTO_OFFER;
                        _this.createChatLayout(
                            event.chat_description,
                            {
                                chat_wrapper: _this.chat_wrapper
                            }
                        );
                    }
                };

                indexeddb.getAll(
                    _this.collectionDescription,
                    function(getError, chats) {
                        if (getError) {
                            if (_this['joinByChatIdAuto__']) {
                                _this['joinByChatIdAuto__'].disabled = false;
                                _this['joinByChatIdAuto__'] = null;
                            }
                            console.error(getError);
                            return;
                        }

                        var chat;
                        chats.every(function(_chat) {
                            if (_chat.chatId === event.chat_description.chatId) {
                                chat = _chat;
                            }
                            return !chat;
                        });

                        if (!chat) {
                            event.chat_description.userId = _this.navigator.userId; // since now this is user's chat too
                            indexeddb.addOrUpdateAll(
                                _this.collectionDescription,
                                [
                                    event.chat_description
                                ],
                                function(error) {
                                    if (_this['joinByChatIdAuto__']) {
                                        _this['joinByChatIdAuto__'].disabled = false;
                                        _this['joinByChatIdAuto__'] = null;
                                    }
                                    if (error) {
                                        console.error(error);
                                        return;
                                    }
                                    defineBehaviour();
                                }
                            );
                        } else {
                            defineBehaviour();
                        }
                    }
                );
            }

        };
        extend(chat_platform, overlay_core);
        extend(chat_platform, event_core);
        extend(chat_platform, template_core);
        extend(chat_platform, message_core);

        chat_platform.prototype.chat_platform_template = chat_platform.prototype.template(chat_platform_template);

        return new chat_platform();
    });