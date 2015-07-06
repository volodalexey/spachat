define('chat_platform', [
        'chat',
        'websocket',
        'webrtc',
        'event_bus',
        //
        'overlay_core',
        'throw_event_core',
        'template_core',
        'indexeddb',
        'message_core',
        'dom_core',
        //
        'text!../templates/chat_platform_template.ejs'
    ],
    function(Chat,
             websocket,
             webrtc,
             event_bus,
             //
             overlay_core,
             throw_event_core,
             template_core,
             indexeddb,
             message_core,
             dom_core,
             //
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
                "table_names": ['chats'],
                "db_version": 1,
                "keyPath": "chatId"
            },

            render: function
                (options) {
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
            }
            ,

            dispose: function() {
                var _this = this;
                _this.removeEventListeners();
            }
            ,

            cashElements: function() {
                var _this = this;
                _this.chat_wrapper = _this.mainConteiner.querySelector('[data-role="chat_wrapper"]');
            }
            ,

            addEventListeners: function() {
                var _this = this;
                _this.removeEventListeners();
                _this.on('addNewChatAuto', _this.addNewChatAuto, _this);
                _this.on('resize', _this.resizeChats, _this);
                _this.on('joinByChatIdAuto', _this.joinByChatIdAuto, _this);
                _this.on('showChat', _this.showChat, _this);
                websocket.on('message', _this.onMessageRouter, _this);
                _this.UIbuttonsByChatId = {};
                event_bus.on('destroyChat', _this.destroyChat, _this);
            }
            ,

            removeEventListeners: function() {
                var _this = this;
                _this.off('addNewChatAuto');
                _this.off('resize');
                _this.off('joinByChatIdAuto');
                _this.off('showChat');
                websocket.off('message');
                _this.UIbuttonsByChatId = {};
                event_bus.off('destroyChat');
            }
            ,

            /**
             * invoke each chat to resize its view
             */
            resizeChats: function() {
                //Chat.prototype.chatsArray.forEach(function(_chat) {
                //    _chat.calcMessagesContainerHeight();
                //});
            }
            ,

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
            }
            ,

            /**
             * sends future chat description to the server to check if such chat is already exists on the server
             * @param event - click event
             */
            addNewChatAuto: function(event) {
                var _this = this;
                if (!_this.mainConteiner || !websocket) {
                    return;
                }

                _this.checkGeneratedChatId(Chat.prototype.generateId(), function(error, chatId) {
                    if (error) {
                        console.error(error);
                        return;
                    }
                    var chat_description = {
                        chatId: chatId
                    };
                    websocket.sendMessage({
                        type: "create",
                        userId: _this.navigator.userId,
                        chat_description: chat_description
                    });
                });
            },

            /**
             * check generated chat id in the local database
             */
            checkGeneratedChatId: function(chatId, callback) {
                var _this = this;
                indexeddb.getAll(
                    _this.collectionDescription,
                    null,
                    function(getError, chats) {
                        if (getError) {
                            callback(getError);
                            return;
                        }

                        var chat;
                        chats.every(function(_chat) {
                            if (_chat.chatId === chatId) {
                                chat = _chat;
                            }
                            return !chat;
                        });

                        if (chat) {
                            console.log('Duplicated chat id found. Try generating the new one');
                            _this.checkGeneratedChatId(chatId, callback);
                        } else {
                            callback(null, chatId)
                        }
                    }
                );
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
                    null,
                    [
                        event.chat_description
                    ],
                    function(error) {
                        if (error) {
                            console.error(error);
                            return;
                        }
                        // chat create was approved
                        // create offer
                        _this.createChatLayout(
                            event,
                            {
                                chat_wrapper: _this.chat_wrapper,
                                modeDescriptions: [{
                                    'chat_part': 'webrtc',
                                    'newMode': webrtc.prototype.MODE.CREATING_OFFER
                                }]
                            }
                        );
                    }
                );
            },

            /**
             * create chat layout
             * @param chat_description
             * @param renderOptions
             */
            createChatLayout: function(messageData, renderOptions) {
                var _this = this;
                messageData.chat_description.userId = messageData.userId;
                var newChat = new Chat(messageData.chat_description);
                Chat.prototype.chatsArray.push(newChat);
                newChat.collectionDescription = {
                    "id": newChat.chatId,
                    "db_name": newChat.chatId + '_chat',
                    "table_names": [newChat.chatId + '_logs', newChat.chatId + '_messages'],
                    "db_version": 1,
                    "keyPath": "id"
                };

                indexeddb.open(newChat.collectionDescription, function(err) {
                    if (err) {
                        console.log(err);
                    }
                    newChat.initialize(renderOptions);
                    newChat.switchModes(renderOptions.modeDescriptions, renderOptions);
                    setTimeout(function() {
                        _this.proceedNextMessage();
                    }, 0);
                });
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
            }
            ,

            /**
             * join request for this chat was approved by the server
             * make offer for extracting device id
             */
            chatJoinApproved: function(event) {
                var _this = this;
                _this.createChatLayout(
                    event,
                    {
                        chat_wrapper: _this.chat_wrapper,
                        modeDescriptions: [{
                            'chat_part': 'webrtc',
                            'newMode': webrtc.prototype.MODE.CREATING_OFFER
                        }]
                    }
                );
            },

            blockUIButton: function(chatId, buttonId, buttonElement) {
                var _this = this;
                if (!_this.UIbuttonsByChatId[chatId]) {
                    _this.UIbuttonsByChatId[chatId] = {};
                }
                _this.UIbuttonsByChatId[chatId][buttonId] = buttonElement;
                buttonElement.disabled = true;
            },

            unBlockUIButton: function(chatId, buttonId) {
                var _this = this;
                if (_this.UIbuttonsByChatId[chatId] && _this.UIbuttonsByChatId[chatId][buttonId]) {
                    _this.UIbuttonsByChatId[chatId][buttonId].disabled = false;
                    delete _this.UIbuttonsByChatId[chatId][buttonId];
                }
            },

            /**
             * find chat in the database and send chat id to the server
             * to receive approved join message
             */
            showChat: function(event) {
                var _this = this;
                var parentElement = _this.traverseUpToDataset(event.target, 'role', 'chatWrapper');
                if (!parentElement) {
                    console.error(new Error('Parent element not found!'));
                    return;
                }

                if (!parentElement.dataset.chatid) {
                    console.error(new Error('Chat wrapper does not have chat id!'));
                    return;
                }

                var chatId = parentElement.dataset.chatid;

                var openedChat;
                Chat.prototype.chatsArray.every(function(_chat) {
                    if (_chat.chatId === chatId) {
                        openedChat = _chat;
                    }
                    return !openedChat;
                });

                if (openedChat) {
                    console.error(new Error('Chat is already opened!'));
                    return;
                }

                _this.blockUIButton(chatId, 'joinByChatIdAuto__', event.target);

                indexeddb.getAll(
                    _this.collectionDescription,
                    null,
                    function(getError, chats) {
                        if (getError) {
                            console.error(getError);
                            _this.unBlockUIButton(chatId, 'joinByChatIdAuto__');
                            return;
                        }

                        var chat;
                        chats.every(function(_chat) {
                            if (_chat.chatId === chatId) {
                                chat = _chat;
                            }
                            return !chat;
                        });

                        if (chat) {
                            delete chat.offer;
                            delete chat.answer;
                            websocket.sendMessage({
                                type: "join",
                                userId: _this.navigator.userId,
                                chat_description: chat
                            });
                        } else {
                            console.error(new Error('Chat with such id not found in the database!'));
                            _this.unBlockUIButton(chatId, 'joinByChatIdAuto__');
                        }
                    }
                );
            },

            destroyChat: function(chatToDestroy) {
                var _this = this;
                Chat.prototype.chatsArray.splice(Chat.prototype.chatsArray.indexOf(chatToDestroy), 1);
                // TODO close indexeddb connections
            }

        };
        extend(chat_platform, overlay_core);
        extend(chat_platform, throw_event_core);
        extend(chat_platform, template_core);
        extend(chat_platform, message_core);
        extend(chat_platform, dom_core);

        chat_platform.prototype.chat_platform_template = chat_platform.prototype.template(chat_platform_template);

        return new chat_platform();
    })
;