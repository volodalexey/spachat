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
                _this.bindedHandleResizer = _this.handleResizer.bind(_this);
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
                _this.chat_resize_container = document.querySelector('[data-role="chat_resize_container"]');
                _this.line_resize = _this.chat_resize_container.querySelector('[data-role="resize_line"]');
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
                _this.on('joinByChatIdAuto', _this.joinByChatIdAuto, _this);
                _this.on('showChat', _this.showChat, _this);
                _this.addRemoveListener('add', _this.chat_resize_container, 'mouseup', _this.bindedHandleResizer, false);
                _this.addRemoveListener('add', _this.chat_resize_container, 'touchend', _this.bindedHandleResizer, false);
                _this.addRemoveListener('add', _this.chat_resize_container, 'mousemove', _this.bindedHandleResizer, false);
                _this.addRemoveListener('add', _this.chat_resize_container, 'touchmove', _this.bindedHandleResizer, false);
                event_bus.on('transformToResizeState', _this.transformToResizeState, _this);
            },

            removeEventListeners: function() {
                var _this = this;
                event_bus.off('throw', _this.bindedOnThrowEvent);
                event_bus.off('addNewChatAuto', _this.addNewChatAuto);
                event_bus.off('getOpenChats', _this.getOpenChats);
                event_bus.off('chatsDestroy', _this.destroyChats);
                event_bus.off('toCloseChat', _this.toCloseChat);
                event_bus.off('notifyChat', _this.onChatMessageRouter);
                event_bus.off('transformToResizeState', _this.transformToResizeState);
                websocket.off('message', _this.onChatMessageRouter);
                _this.off('joinByChatIdAuto');
                _this.off('showChat');
                _this.addRemoveListener('remove', _this.chat_resize_container, 'mouseup', _this.bindedHandleResizer, false);
                _this.addRemoveListener('remove', _this.chat_resize_container, 'touchend', _this.bindedHandleResizer, false);
                _this.addRemoveListener('remove', _this.chat_resize_container, 'mousemove', _this.bindedHandleResizer, false);
                _this.addRemoveListener('remove', _this.chat_resize_container, 'touchmove', _this.bindedHandleResizer, false);
            },

            getOpenChats: function(callback) {
                var openChats = {};
                Chat.prototype.chatsArray.forEach(function(chat) {
                    openChats[chat.chat_id] = true;
                });
                callback(openChats);
            },

            transformToResizeState: function(event, _chat) {
                var _this = this;
                _this.chat_resize_container.classList.add('draggable');
                _this.line_resize.style.left = event.clientX + 'px';
                _this.resizeMouseDown = true;
                _this.positionrSplitterItem = event.currentTarget.dataset.splitteritem;
                _this.chatResize = _chat;
                _this.splitterWidth = _chat.splitter_left.clientWidth;
                _this.offsetLeft_splitter_left = _this.getOffset(_chat.splitter_left).offsetLeft;
                _this.offsetLeft_splitter_right = _this.getOffset(_chat.splitter_right).offsetLeft;
                _this.chatResizeWidth = _chat.chat_element.clientWidth;
            },

            handleResizer: function(event) {
                var _this = this;
                event.stopPropagation();
                event.preventDefault();
                switch (event.type) {
                    case 'mousemove':
                    case 'touchmove':
                        if (_this.resizeMouseDown) {
                            var clientX = event.clientX;
                            if (event.type === 'touchmove' && event.changedTouches) {
                                clientX = event.changedTouches[0].clientX;
                            }
                            if (!_this.resizeClientX_absolue) {
                                _this.resizeClientX_absolue = clientX;
                                _this.deltaX_absolute = clientX;
                            }
                            if (!_this.resizeClientX) {
                                _this.resizeClientX = clientX;
                            } else {
                                var deltaX = clientX - _this.resizeClientX;
                                _this.absoluteDeltaX = _this.resizeClientX_absolue - clientX;
                                _this.redraw_chat = false;
                                if (Math.abs(_this.absoluteDeltaX - deltaX) > 5) {
                                    _this.redraw_chat = true;
                                    if (_this.positionrSplitterItem === 'left' &&
                                        _this.offsetLeft_splitter_right - clientX + _this.splitterWidth > 350 ||
                                        _this.positionrSplitterItem === 'right' &&
                                        clientX - _this.offsetLeft_splitter_left > 350
                                    ) {
                                        _this.line_resize.style.left = (_this.line_resize.offsetLeft + deltaX) + 'px';
                                        _this.resizeClientX = clientX;
                                    } else {
                                        if (_this.positionrSplitterItem === 'left') {
                                            _this.line_resize.style.left = _this.offsetLeft_splitter_right - 350 + _this.splitterWidth + 'px';
                                        }
                                        if (_this.positionrSplitterItem === 'right') {
                                            _this.line_resize.style.left = _this.offsetLeft_splitter_left + 350 + 'px';
                                        }
                                        _this.resizeClientX = clientX;
                                    }
                                }
                            }
                        }
                        break;
                    case 'mouseup':
                    case 'touchend':
                        if (_this.redraw_chat ) {
                            if (_this.positionrSplitterItem === 'left') {
                                if (_this.chatResizeWidth + _this.absoluteDeltaX >= 350) {
                                    _this.chatResize.chat_element.style.width = _this.chatResizeWidth + _this.absoluteDeltaX + 'px';
                                } else {
                                    _this.chatResize.chat_element.style.width = '350px';
                                }
                            }
                            if (_this.positionrSplitterItem === 'right') {
                                if (_this.chatResizeWidth - _this.absoluteDeltaX >= 350) {
                                    _this.chatResize.chat_element.style.width = _this.chatResizeWidth - _this.absoluteDeltaX + 'px';
                                } else {
                                    _this.chatResize.chat_element.style.width = '350px';
                                }
                            }
                        }
                        _this.resizeMouseDown = false;
                        _this.chat_resize_container.classList.remove('draggable');
                        _this.line_resize.style.left = 0;
                        delete _this.positionrSplitterItem;
                        delete _this.splitterWidth;
                        delete _this.offsetLeft_splitter_left;
                        delete _this.offsetLeft_splitter_right;
                        delete _this.chatResizeWidth;
                        delete _this.resizeClientX;
                        delete _this.resizeClientX_absolue;
                        delete _this.deltaX_absolute;
                        delete _this.chatResize;
                        delete _this.redraw_chat;
                }
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
                            if (messageData.chat_description.chat_id === _chat.chat_id) {
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

                websocket.sendMessage({
                    type: "chat_create",
                    from_user_id: users_bus.getUserId()
                });
            },

            /**
             * check generated chat id in the local database
             */
            checkGeneratedChatId: function(chat_id, callback) {
                var _this = this;
                indexeddb.getByKeyPath(
                    chats_bus.collectionDescription,
                    chat_id,
                    function(getError, chat) {
                        if (getError) {
                            callback(getError);
                            return;
                        }

                        if (chat) {
                            console.log('Duplicated chat id found. Try generating the new one');
                            _this.checkGeneratedChatId(chat_id, callback);
                        } else {
                            callback(null, chat_id);
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
                event_bus.set_ws_device_id(event.from_ws_device_id);
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
                        _this.addNewChatToUserChats(chat, function() {
                            _this.chatWorkflow(event);
                        });
                    }
                );
            },

            addNewChatToUserChats: function(chat, callback) {
                users_bus.getMyInfo(null, function(error, options, info) {
                    info.chatsIds.push(chat.chat_id);
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
                            event_bus.trigger('AddedNewChat', info.chatsIds.length);
                            if (callback) {
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
                        messageData.chat_description.chat_id,
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
                newChat.index = Chat.prototype.chatsArray.indexOf(newChat);

                indexeddb.open(newChat.collectionDescription, function(err) {
                    if (err) {
                        console.log(err);
                    }
                    newChat.initialize(renderOptions);
                    if (messageData.restore_chat_state &&
                        messageData.chat_description.bodyOptions &&
                        messageData.chat_description.bodyOptions.mode) {
                        newChat.switchModes([{
                            'chat_part': 'body',
                            'newMode': messageData.chat_description.bodyOptions.mode
                        }], renderOptions);
                    } else {
                        newChat.switchModes([{
                            'chat_part': 'body',
                            'newMode': newChat.body.MODE.MESSAGES
                        }], renderOptions);
                    }

                    if (messageData.wscs_device_ids) {
                        webrtc.handleConnectedDevices(messageData.wscs_device_ids, newChat);
                    }
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
                    "chat_id": input.value
                };

                websocket.sendMessage({
                    type: "chat_join",
                    from_user_id: users_bus.getUserId(),
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
                event_bus.set_ws_device_id(event.target_ws_device_id);

                indexeddb.getByKeyPath(
                    chats_bus.collectionDescription,
                    event.chat_description.chat_id,
                    function(getError, chat_description) {
                        if (getError) {
                            console.error(getError);
                            return;
                        }

                        if (!chat_description) {
                            _this.addNewChatToIndexedDB(event);
                        } else if (chat_description && !_this.isChatOpened(chat_description.chat_id)) {
                            _this.chatWorkflow(event);
                        } else if (chat_description) {
                            webrtc.handleConnectedDevices(event.wscs_device_ids, _this.isChatOpened(chat_description.chat_id));
                        }
                    }
                );
            },

            hideUIButton: function(chat_id, buttonsElement) {
                var _this = this;
                if (!_this.UIbuttonsByChatId[chat_id]) {
                    _this.UIbuttonsByChatId[chat_id] = {};
                    _this.UIbuttonsByChatId[chat_id].buttons = [];
                }
                buttonsElement.forEach(function(buttonElement) {
                    _this.UIbuttonsByChatId[chat_id].buttons.push(buttonElement);
                    if (buttonElement.style.display === 'none') {
                        buttonElement.style.display = 'inherit';
                    } else {
                        buttonElement.style.display = 'none';
                    }
                });
            },

            unHideUIButton: function(chat_id) {
                var _this = this;
                if (_this.UIbuttonsByChatId[chat_id] && _this.UIbuttonsByChatId[chat_id].buttons) {
                    _this.UIbuttonsByChatId[chat_id].buttons.forEach(function(button) {
                        if (button.style.display === 'none') {
                            button.style.display = 'inherit';
                        } else {
                            button.style.display = 'none';
                        }
                    });
                }
                _this.UIbuttonsByChatId[chat_id].buttons = [];
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

                if (!parentElement.dataset.chat_id) {
                    console.error(new Error('Chat wrapper does not have chat id!'));
                    return;
                }

                var chat_id = parentElement.dataset.chat_id;
                if (_this.isChatOpened(chat_id)) {
                    console.error(new Error('Chat is already opened!'));
                    return;
                }
                _this.hideUIButton(chat_id, control_buttons);
                indexeddb.getByKeyPath(
                    chats_bus.collectionDescription,
                    chat_id,
                    function(getError, chatDescription) {
                        if (getError) {
                            console.error(getError);
                            _this.unHideUIButton(chat_id);
                            return;
                        }

                        if (chatDescription) {
                            websocket.sendMessage({
                                type: "chat_join",
                                from_user_id: users_bus.getUserId(),
                                chat_description: {
                                    chat_id: chatDescription.chat_id
                                },
                                restore_chat_state: restore_options
                            });
                        } else {
                            console.error(new Error('Chat with such id not found in the database!'));
                            _this.unHideUIButton(chat_id);
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
                            if (error) {
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
                    if (_chat.chat_id === chatToDestroyId) {
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
                event_bus.trigger('chatDestroyed', chatToDestroy.chat_id);
                // TODO close indexeddb connections
            },

            destroyChats: function() {
                Chat.prototype.chatsArray.forEach(function(chatToDestroy) {
                    console.log(Chat.prototype.chatsArray, chatToDestroy.chat_id);
                    chatToDestroy.destroyChat();
                });
                Chat.prototype.chatsArray = [];
            },

            /**
             * chat whether requested chat by its id is opened or not
             */
            isChatOpened: function(chat_id) {
                var openedChat;
                Chat.prototype.chatsArray.every(function(_chat) {
                    if (_chat.chat_id === chat_id) {
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