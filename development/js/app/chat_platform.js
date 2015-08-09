define('chat_platform', [
        'chat',
        'websocket',
        'webrtc',
        'event_bus',
        'indexeddb',
        'users_bus',
        'chats_bus',
        //
        'overlay_core',
        'throw_event_core',
        'template_core',
        'dom_core',
        'extend_core',
        //
        'text!../templates/chat_platform_template.ejs'
    ],
    function(Chat,
             websocket,
             webrtc,
             event_bus,
             indexeddb,
             users_bus,
             chats_bus,
             //
             overlay_core,
             throw_event_core,
             template_core,
             dom_core,
             extend_core,
             //
             chat_platform_template) {

        var chat_platform = function() {
            this.link = /chat/;
            this.withPanels = true;
            this.bindContexts();
            this.UIbuttonsByChatId = {};
        };

        chat_platform.prototype = {

            bindContexts: function() {
                var _this = this;
                _this.bindedOnThrowEvent = _this.onThrowEvent.bind(_this);
            },

            render: function
                (options) {
                if (!options || !options.navigator) {
                    console.error(new Error('Invalid input options for render'));
                    return;
                }
                var _this = this;
                _this.cashMainElements();
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

            cashMainElements: function() {
                var _this = this;
                _this.mainConteiner = document.querySelector('[data-role="main_container"]');
            },

            cashElements: function() {
                var _this = this;
                _this.chat_wrapper = _this.mainConteiner.querySelector('[data-role="chat_wrapper"]');
            },

            unCashElements: function() {
                var _this = this;
                _this.mainConteiner = null;
                _this.chat_wrapper = null;
            },

            addEventListeners: function() {
                var _this = this;
                _this.removeEventListeners();
                event_bus.on('throw', _this.bindedOnThrowEvent, false);
                event_bus.on('addNewChatAuto', _this.addNewChatAuto, _this);
                event_bus.on('getOpenChats', _this.getOpenChats, _this);
                event_bus.on('chatsDestroy', _this.destroyChats, _this);
                event_bus.on('toCloseChat', _this.toCloseChat, _this);
                event_bus.on('notifyChat', _this.onChatMessageRouter, _this);
                websocket.on('message', _this.onChatMessageRouter, _this);
                _this.on('resize', _this.resizeChats, _this);
                _this.on('joinByChatIdAuto', _this.joinByChatIdAuto, _this);
                _this.on('showChat', _this.showChat, _this);
            },

            removeEventListeners: function() {
                var _this = this;
                event_bus.off('throw', _this.bindedOnThrowEvent);
                event_bus.off('addNewChatAuto', _this.addNewChatAuto);
                event_bus.off('getOpenChats', _this.getOpenChats);
                event_bus.off('chatsDestroy', _this.destroyChats);
                event_bus.off('toCloseChat', _this.toCloseChat);
                event_bus.off('notifyChat', _this.onChatMessageRouter);
                websocket.off('message', _this.onChatMessageRouter);
                _this.off('resize');
                _this.off('joinByChatIdAuto');
                _this.off('showChat');
            },

            getOpenChats: function(callback) {
                var openChats = {};
                Chat.prototype.chatsArray.forEach(function(chat) {
                    openChats[chat.chatId] = true;
                });
                callback(openChats);
            },

            /**
             * invoke each chat to resize its view
             */
            resizeChats: function() {
                //Chat.prototype.chatsArray.forEach(function(_chat) {
                //    _chat.calcMessagesContainerHeight();
                //});
            },

            onThrowEvent: function(eventName, eventData) {
                if (!eventName) {
                    return;
                }

                if (this[eventName]) {
                    this[eventName](eventData);
                }
            },

            /**
             * handle message from web-socket (if it is connected with chats some how)
             */
            onChatMessageRouter: function(messageData) {
                var _this = this;

                switch (messageData.type) {
                    case 'chat_created':
                        _this.chatCreateApproved(messageData);
                        break;
                    case 'chat_joined':
                        _this.chatJoinApproved(messageData);
                        break;
                    case 'notifyChat':
                        Chat.prototype.chatsArray.forEach(function(_chat) {
                            if (messageData.chat_description.chatId === _chat.chatId) {
                                _chat.trigger('notifyChat', messageData);
                            }
                        });
                        break;
                }
            },

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
                        type: "create_chat",
                        userId: users_bus.getUserId(),
                        deviceId: event_bus.getDeviceId(),
                        tempDeviceId: event_bus.getTempDeviceId(),
                        chat_description: chat_description
                    });
                });
            },

            /**
             * check generated chat id in the local database
             */
            checkGeneratedChatId: function(chatId, callback) {
                var _this = this;
                indexeddb.getByKeyPath(
                    chats_bus.collectionDescription,
                    chatId,
                    function(getError, chat) {
                        if (getError) {
                            callback(getError);
                            return;
                        }

                        if (chat) {
                            console.log('Duplicated chat id found. Try generating the new one');
                            _this.checkGeneratedChatId(chatId, callback);
                        } else {
                            callback(null, chatId);
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
                event_bus.setAnyDeviceId(event);
                _this.addNewChatToIndexedDB(event);
            },

            addNewChatToIndexedDB: function(event) {
                var _this = this;
                var chat = new Chat(event.chat_description);
                indexeddb.addOrUpdateAll(
                    chats_bus.collectionDescription,
                    null,
                    [
                        chat.toChatDescription()
                    ],
                    function(error) {
                        if (error) {
                            console.error(error);
                            return;
                        }
                        _this.addNewChatToUserChats(chat, function(){
                            _this.chatWorkflow(event);
                        });
                    }
                );
            },

            addNewChatToUserChats: function(chat, callback){
                users_bus.getMyInfo(null, function(error, options, info) {
                    info.chatsIds.push(chat.chatId);
                    indexeddb.addOrUpdateAll(
                        users_bus.collectionDescription,
                        null,
                        [
                            info
                        ],
                        function(error) {
                            if (error) {
                                console.error(error);
                                return;
                            }
                            if(callback) {
                                event_bus.trigger('AddedNewChat', info.chatsIds.length);
                                callback();
                            }
                        }
                    );
                });
            },

            chatWorkflow: function(event) {
                this.createChatLayout(
                    event,
                    {
                        chat_wrapper: this.chat_wrapper
                    }
                );
            },

            /**
             * create chat layout
             * create tables in indexeddb for chat
             */
            createChatLayout: function(messageData, renderOptions) {
                var _this = this;
                if (messageData.type === "chat_joined") {
                    indexeddb.getByKeyPath(
                        chats_bus.collectionDescription,
                        messageData.chat_description.chatId,
                        function(getError, localChatDescription) {
                            if (getError) {
                                console.error(getError);
                                return;
                            }

                            if (localChatDescription && messageData.restore_chat_state) {
                                messageData.chat_description = localChatDescription;
                            }
                            _this.handleChat(messageData, renderOptions, false);
                        }
                    );
                } else {
                    _this.handleChat(messageData, renderOptions, true);
                }
            },

            handleChat: function(messageData, renderOptions, new_chat) {
                var newChat = new Chat(messageData.chat_description);
                Chat.prototype.chatsArray.push(newChat);

                indexeddb.open(newChat.collectionDescription, function(err) {
                    if (err) {
                        console.log(err);
                    }
                    newChat.initialize(renderOptions);
                    if (messageData.restore_chat_state &&
                        messageData.chat_description.bodyOptions &&
                        messageData.chat_description.bodyOptions.mode) {
                        newChat.switchModes( [{
                            'chat_part': 'body',
                            'newMode': messageData.chat_description.bodyOptions.mode
                        }], renderOptions);
                    } else {
                        newChat.switchModes( [{
                            'chat_part': 'body',
                            'newMode': newChat.body.MODE.MESSAGES
                        }], renderOptions);
                    }

                    webrtc.handleConnectedDevices(messageData.connectedDevices, newChat);
                });
            },

            /**
             * sends current chat description to the server
             * @param event - click event
             */
            joinByChatIdAuto: function(element) {
                var _this = this;
                var wrapper = element.parentNode.parentNode;
                var input = wrapper.querySelector('[data-role="chat_id_input"]');
                if (!_this.mainConteiner || !websocket || !wrapper || !input || !input.value) {
                    return;
                }

                _this['joinByChatIdAuto_'] = element;
                element.disabled = true;

                var chat_description = {
                    "chatId": input.value
                };

                if (!event_bus.getDeviceId() && !event_bus.getTempDeviceId()) {
                    event_bus.setTempDeviceId(Chat.prototype.generateId());
                }
                websocket.sendMessage({
                    type: "chat_join",
                    userId: users_bus.getUserId(),
                    deviceId: event_bus.getDeviceId(),
                    tempDeviceId: event_bus.getTempDeviceId(),
                    chat_description: chat_description
                });
            }
            ,

            /**
             * join request for this chat was approved by the server
             * make offer for each device for this chat
             */
            chatJoinApproved: function(event) {
                var _this = this;
                if (event_bus.isEqualAnyDeviceId(event)) {
                    // if join request created this device
                    event_bus.setAnyDeviceId(event);
                }

                indexeddb.getByKeyPath(
                    chats_bus.collectionDescription,
                    event.chat_description.chatId,
                    function(getError, chat_description) {
                        if (getError) {
                            console.error(getError);
                            return;
                        }

                        if (!chat_description) {
                            _this.addNewChatToIndexedDB(event);
                        } else if (chat_description && !_this.isChatOpened(chat_description.chatId)) {
                            _this.chatWorkflow(event);
                        } else if (chat_description) {
                            webrtc.handleConnectedDevices(event.connectedDevices, _this.isChatOpened(chat_description.chatId));
                        }
                    }
                );
            },

            hideUIButton: function(chatId, buttonsElement) {
                var _this = this;
                if (!_this.UIbuttonsByChatId[chatId]) {
                    _this.UIbuttonsByChatId[chatId] = {};
                    _this.UIbuttonsByChatId[chatId].buttons = [];
                }
                buttonsElement.forEach(function(buttonElement){
                    _this.UIbuttonsByChatId[chatId].buttons.push(buttonElement);
                    if (buttonElement.style.display === 'none') {
                        buttonElement.style.display = 'inherit';
                    } else {
                        buttonElement.style.display = 'none';
                    }
                });
            },

            unHideUIButton: function(chatId) {
                var _this = this;
                if (_this.UIbuttonsByChatId[chatId] && _this.UIbuttonsByChatId[chatId].buttons) {
                    _this.UIbuttonsByChatId[chatId].buttons.forEach(function(button) {
                        if (button.style.display === 'none') {
                            button.style.display = 'inherit';
                        } else {
                            button.style.display = 'none';
                        }
                    });
                }
                _this.UIbuttonsByChatId[chatId].buttons = [];
            },

            /**
             * find chat in the database and send chat id to the server
             * to receive approved join message
             */
            showChat: function(element) {
                var _this = this;
                var parentElement = _this.traverseUpToDataset(element, 'role', 'chatWrapper');
                var control_buttons = Array.prototype.slice.call(parentElement.querySelectorAll('button[data-mode="DETAIL_VIEW"]'));
                var restore_options = element.dataset.restore_chat_state;
                if (!parentElement) {
                    console.error(new Error('Parent element not found!'));
                    return;
                }

                if (!parentElement.dataset.chatid) {
                    console.error(new Error('Chat wrapper does not have chat id!'));
                    return;
                }

                var chatId = parentElement.dataset.chatid;
                if (_this.isChatOpened(chatId)) {
                    console.error(new Error('Chat is already opened!'));
                    return;
                }
                _this.hideUIButton(chatId, control_buttons);
                indexeddb.getByKeyPath(
                    chats_bus.collectionDescription,
                    chatId,
                    function(getError, chat) {
                        if (getError) {
                            console.error(getError);
                            _this.unHideUIButton(chatId);
                            return;
                        }

                        if (chat) {
                            if (!event_bus.getDeviceId() && !event_bus.getTempDeviceId()) {
                                event_bus.setTempDeviceId(Chat.prototype.generateId());
                            }
                            websocket.sendMessage({
                                type: "chat_join",
                                userId: users_bus.getUserId(),
                                deviceId: event_bus.getDeviceId(),
                                tempDeviceId: event_bus.getTempDeviceId(),
                                chat_description: chat,
                                restore_chat_state: restore_options
                            });
                        } else {
                            console.error(new Error('Chat with such id not found in the database!'));
                            _this.unHideUIButton(chatId);
                        }
                    }
                );
            },

            destroy: function() {
                var _this = this;
                _this.removeEventListeners();
                _this.unCashElements();
                _this.UIbuttonsByChatId = {};
            },

            saveStatesChats: function(chatToDestroy) {
                var _this = this;
                if (confirm("Save settings this chat and close it ?")) {

                    var chatDescription = chatToDestroy.toChatDescription();

                    indexeddb.addOrUpdateAll(
                        chats_bus.collectionDescription,
                        null,
                        [
                            chatDescription
                        ],
                        function(error) {
                            if (error){
                                console.error(error);
                                return;
                            }
                            _this.destroyChat(chatToDestroy);
                        }
                    );
                }
            },

            toCloseChat: function(chatToDestroyId, saveStates) {
                var _this = this, chatToDestroy;
                Chat.prototype.chatsArray.every(function(_chat) {
                    if (_chat.chatId === chatToDestroyId) {
                        chatToDestroy = _chat;
                    }
                    return !chatToDestroy;
                });
                if (saveStates) {
                    _this.saveStatesChats(chatToDestroy);
                } else {
                    _this.closeChat(chatToDestroy);
                }
            },

            closeChat: function(chatToDestroy) {
                var _this = this;
                if (confirm("Close this chat ?")) {
                    _this.destroyChat(chatToDestroy);
                }
            },

            destroyChat: function(chatToDestroy) {
                Chat.prototype.chatsArray.splice(Chat.prototype.chatsArray.indexOf(chatToDestroy), 1);
                chatToDestroy.destroyChat();
                event_bus.trigger('chatDestroyed', chatToDestroy.chatId);
                // TODO close indexeddb connections
            },

            destroyChats: function() {
                Chat.prototype.chatsArray.forEach(function(chatToDestroy) {
                    console.log(Chat.prototype.chatsArray, chatToDestroy.chatId);
                    chatToDestroy.destroyChat();
                });
                Chat.prototype.chatsArray = [];
            },

            /**
             * chat whether requested chat by its id is opened or not
             * @param chatId
             * @returns openedChat
             */
            isChatOpened: function(chatId) {
                var openedChat;
                Chat.prototype.chatsArray.every(function(_chat) {
                    if (_chat.chatId === chatId) {
                        openedChat = _chat;
                    }
                    return !openedChat;
                });

                return openedChat;
            }
        };
        extend_core.prototype.inherit(chat_platform, overlay_core);
        extend_core.prototype.inherit(chat_platform, throw_event_core);
        extend_core.prototype.inherit(chat_platform, template_core);
        extend_core.prototype.inherit(chat_platform, dom_core);

        chat_platform.prototype.chat_platform_template = chat_platform.prototype.template(chat_platform_template);

        return new chat_platform();
    })
;