define('chat', [
        'header',
        'editor',
        'pagination',
        'settings',
        'contact_list',
        'messages',
        'webrtc',
        'websocket',
        'body',

        'ajax_core',
        'template_core',
        'id_core',
        'extend_core',
        'message_core',
        'event_core',

        'text!../html/chat_template.html',
        'text!../html/waiter_template.html',
        'text!../html/console_log_template.html'
    ],
    function(Header,
             Editor,
             Pagination,
             Settings,
             Contact_list,
             Messages,
             Webrtc,
             websocket,
             Body,
             ajax_core,
             template_core,
             id_core,
             extend_core,
             message_core,
             event_core,
             chat_template,
             waiter_template,
             console_log_template) {

        var defaultOptions = {
            padding: {
                bottom: 5
            },
            headerOptions: {
                show: true
            },
            filterOptions: {
                show: false
            },
            bodyOptions: {
                show: true
            },
            editorOptions: {
                show: true
            },
            formatOptions: {
                show: false,
                offScroll: false
            },
            goToOptions: {
                show: false,
                rteChoicePage: true,
                mode_change: "rte"
            },
            paginationOptions: {
                show: false,
                mode_change: "rte",
                currentPage: null,
                firstPage: 1,
                lastPage: null,
                showEnablePagination: false,
                showChoicePerPage: false,
                perPageValue: 1,
                rtePerPage: true,
                disableBack: false,
                disableFirst: false,
                disableLast: false,
                disableForward: false
            },
            messagesOptions: {
                start: 0,
                last: null
            }
        };

        var chat = function(options) {
            this.extend(this, defaultOptions);

            this.header = new Header({chat: this});
            this.headerOptions.mode = this.header.MODE.TAB;
            this.editor = new Editor({chat: this});
            this.editorOptions.mode = this.editor.MODE.MAIN_PANEL;
            this.pagination = new Pagination({chat: this});
            this.settings = new Settings({chat: this});
            this.contact_list = new Contact_list({chat: this});
            this.messages = new Messages({chat: this});
            this.webrtc = new Webrtc({chat: this});
            this.body = new Body({chat: this});
            this.bodyOptions.mode = this.body.MODE.MESSAGES;

            this.extend(this, options);
            this.bindContexts();
        };

        chat.prototype = {

            valueOfKeys: ['chatId', 'userId'],

            bindContexts: function() {
                var _this = this;
                //_this.bindedThrowRouter = _this.throwRouter.bind(_this);
            },

            valueOf: function() {
                var toStringObject = {};
                var _this = this;
                _this.valueOfKeys.forEach(function(key) {
                    toStringObject[key] = _this[key];
                });
                return toStringObject;
            },

            chatsArray: [],

            MODE: {
                SETTING: 'SETTING',
                //MESSAGES: 'MESSAGES',
                CONTACT_LIST: 'CONTACT_LIST',
                MESSAGES_DISCONNECTED: 'MESSAGES_DISCONNECTED',
                CREATED_AUTO: 'CREATED_AUTO',
                JOINED_AUTO_OFFER: 'JOINED_AUTO_OFFER',
                JOINED_AUTO_ANSWER: 'JOINED_AUTO_ANSWER',
                JOINED_AUTO_ACCEPT: 'JOINED_AUTO_ACCEPT'
            },

            cashElements: function() {
                var _this = this;
                _this.chat_element = _this.chat_wrapper.querySelector('section');
                _this.header_container = _this.chat_element.querySelector('[data-role="header_container"]');
                _this.header_waiter_container = _this.chat_element.querySelector('[data-role="waiter_container"]');
                _this.body_container = _this.chat_element.querySelector('[data-role="body_container"]');
            },

            console: {
                log: function(event) {
                    var _this = this;
                    var txt = _this.console_log_template(event);
                    var div = document.createElement('div');
                    div.innerHTML = txt;
                    var nodeArray = [];
                    nodeArray.push.apply(nodeArray, div.childNodes);
                    Array.prototype.forEach.call(nodeArray, function(node) {
                        _this.body_container.appendChild(node);
                    });
                }
            },

            initialization: function(options) {
                var _this = this;
                _this.chat_wrapper = options && options.chat_wrapper ? options.chat_wrapper : _this.chat_wrapper;
                _this.chat_wrapper.innerHTML = _this.chat_template();
                _this.cashElements();
                _this.header_waiter_container.innerHTML = _this.waiter_template();
                _this.addEventListeners();
                _this.render(options);
                _this.webrtc.render(options, this);
            },

            render: function(options, _array) {
                var _this = this;
                _this.editor.render(options, this);
                _this.header.render(null, _array, this);
                _this.pagination.render(options, this);
                _this.body.render({scrollTop: true}, this);
                //_this.messages.render({start: 0, scrollTop: true}, this);
            },

            changeMode: function(event) {
                var _this = this;
                _this.switchModes([
                    {
                        chat_part: event.target.dataset.chat_part,
                        newMode: event.target.dataset.mode_to,
                        target: event.target
                    }
                ]);
            },

            switchModes: function(_array) {
                var _this = this;
                _array.forEach(function(_obj) {
                    switch (_obj.chat_part) {
                        case "header":
                            switch (_obj.newMode) {
                                case _this.header.MODE.FILTER:
                                    if (_obj.target) {
                                        var bool_Value = _obj.target.dataset.toggle === "true";
                                        _this.filterOptions.show = bool_Value;
                                        _obj.target.dataset.toggle = !bool_Value;
                                    }
                                    _this.toggleShowState({
                                        key: 'show',
                                        restore: true,
                                        toggle: true
                                    }, _this.paginationOptions, _obj);
                                    _this.bodyOptions.mode = _this.body.MODE.MESSAGES;
                                    _this.toggleShowState({
                                        key: 'show',
                                        restore: true,
                                        toggle: true
                                    }, _this.formatOptions, _obj);
                                    _this.toggleShowState({
                                        key: 'show',
                                        restore: true,
                                        toggle: true
                                    }, _this.goToOptions, _obj);
                                    _this.editorOptions.show = true;
                                    break;
                            }
                            break;
                        case "body":
                            switch (_obj.newMode) {
                                case _this.body.MODE.SETTING:
                                    _this.bodyOptions.mode = _this.body.MODE.SETTING;
                                    _this.filterOptions.show = false;
                                    _this.editorOptions.show = false;
                                    _this.toggleShowState({
                                        key: 'show',
                                        save: true,
                                        toggle: false
                                    }, _this.paginationOptions, _obj);
                                    _this.toggleShowState({
                                        key: 'show',
                                        save: true,
                                        toggle: false
                                    }, _this.formatOptions, _obj);
                                    _this.toggleShowState({
                                        key: 'show',
                                        save: true,
                                        toggle: false
                                    }, _this.goToOptions, _obj);
                                    break;
                                case _this.body.MODE.CONTACT_LIST:
                                    _this.bodyOptions.mode = _this.body.MODE.CONTACT_LIST;
                                    _this.filterOptions.show = false;
                                    _this.editorOptions.show = false;
                                    _this.toggleShowState({
                                        key: 'show',
                                        save: true,
                                        toggle: false
                                    }, _this.paginationOptions, _obj);
                                    _this.toggleShowState({
                                            key: 'show',
                                            save: true,
                                            toggle: false
                                    }, _this.formatOptions, _obj);
                                    _this.toggleShowState({
                                        key: 'show',
                                        save: true,
                                        toggle: false
                                    }, _this.goToOptions, _obj);
                                    break;
                                case _this.body.MODE.MESSAGES:
                                    _this.bodyOptions.mode = _this.body.MODE.MESSAGES;
                                    _this.editorOptions.show = true;
                                    _this.toggleShowState({
                                        key: 'show',
                                        restore: true,
                                        toggle: true
                                    }, _this.paginationOptions, _obj);
                                    _this.toggleShowState({
                                        key: 'show',
                                        restore: true,
                                        toggle: true
                                    }, _this.formatOptions, _obj);
                                    _this.toggleShowState({
                                        key: 'show',
                                        restore: true,
                                        toggle: true
                                    }, _this.goToOptions, _obj);
                                    break;
                            }
                            break;
                        case "editor":
                            switch (_obj.newMode) {
                                case _this.editor.MODE.MAIN_PANEL:

                                    _this.editorOptions.show = true;
                                    break;
                                case _this.editor.MODE.FORMAT_PANEL:
                                    if (_obj.target) {
                                        var bool_Value = _obj.target.dataset.toggle === "true";
                                        _this.formatOptions.show = bool_Value;
                                        _obj.target.dataset.toggle = !bool_Value;
                                    }
                                    break;
                            }
                            break;
                        case "pagination":
                            switch (_obj.newMode) {
                                case _this.pagination.MODE.PAGINATION:
                                    if (_obj.target) {
                                        _this.paginationOptions.show = _obj.target.checked;
                                        _this.paginationOptions.showEnablePagination = _obj.target.checked;
                                    }
                                    _this.toggleShowState({key: 'show', toggle: false}, _this.paginationOptions, _obj);
                                    //_this.toggleShowState({key: 'show', toggle: false}, _this.goToOptions, _obj);
                                    break;
                                case _this.pagination.MODE.GO_TO:
                                    //_this.goToOptions.show = true;
                                    _this.toggleShowState({key: 'show', toggle: false}, _this.goToOptions, _obj);
                                    break;
                            }
                    }
                });
                _this.render(null, _array);
            },

            addEventListeners: function() {
                var _this = this;
                _this.removeEventListeners();
                _this.header.on('throw', _this.throwRouter, _this);
                _this.editor.on('throw', _this.throwRouter, _this);
                _this.pagination.on('throw', _this.throwRouter, _this);
                //_this.pagination.on('fillListMessage', function(obj) {
                //    _this.fillMessages(obj);
                //}, _this);
                _this.webrtc.on('log', _this.console.log, _this);
                _this.webrtc.on('sendToWebSocket', _this.sendToWebSocket, _this);
                _this.on('notifyChat', _this.onMessageRouter, _this);
            },

            removeEventListeners: function() {
                var _this = this;
                _this.header.off('throw');
                _this.editor.off('throw');
                _this.pagination.off('throw');
                _this.webrtc.off('log');
                _this.webrtc.off('sendToWebSocket');
                _this.off('notifyChat');
            },

            throwRouter: function(action, event) {
                if (this[action]) {
                    this[action](event);
                }
            },

            renderPagination: function() {
                var _this = this;
                _this.pagination.initialize({chat: _this});
            },

            fillMessages: function(obj) {
                var _this = this;
                _this.messages.fillListMessage(obj);
            },

            sendToWebSocket: function(sendData) {
                var _this = this;
                sendData.chat_description = this.valueOf();
                websocket.sendMessage(sendData);
                _this.proceedNextMessage();
            },

            /**
             * server stored local offer for current chat
             * need to join this offer of wait for connections if current user is creator
             */
            serverStoredOffer: function(event) {
                var _this = this;

                if (event.chat_description.offer.userId === _this.userId) {
                    // I am the creator of server stored offer
                    // Waiting for answer
                    _this.console.log.call(_this, {message: 'waiting for connection'});
                    _this.mode = _this.MODE.MESSAGES_DISCONNECTED;
                    _this.switchModes([
                        {
                            'chat_part': 'header',
                            'newMode': _this.header.MODE.TAB
                        },
                        {
                            'chat_part': 'body',
                            'newMode': _this.body.MODE.MESSAGES
                        },
                        {
                            'chat_part': 'editor',
                            'newMode': _this.editor.MODE.MAIN_PANEL
                        }
                        ,
                        {
                            'chat_part': 'pagination',
                            'newMode': _this.pagination.MODE.PAGINATION
                        }
                    ]);
                } else {
                    // I am NOT the creator of server stored offer
                    // Somebody created offer while I was trying to create my offer
                    // Create answer
                    _this.mode = _this.MODE.JOINED_AUTO_ANSWER;
                    _this.render({
                        remoteOfferDescription: event.chat_description.offer.offerDescription
                    });
                }
            },

            serverStoredAnswer: function(event) {
                var _this = this;
                if (event.chat_description.answer.userId === _this.userId) {
                    // I am the creator of server stored answer
                    // Waiting for accept
                    _this.console.log.call(_this, {message: 'waiting for accept connection'});
                    _this.mode = _this.MODE.MESSAGES_DISCONNECTED;
                    _this.switchModes([
                        {
                            'chat_part': 'header',
                            'newMode': _this.header.MODE.TAB
                        },
                        {
                            'chat_part': 'body',
                            'newMode': _this.body.MODE.MESSAGES
                        },
                        {
                            'chat_part': 'editor',
                            'newMode': _this.editor.MODE.MAIN_PANEL
                        }
                    ]);
                } else {
                    // I am NOT the creator of server stored answer
                    // Accept answer if I am the offer creator
                    if (event.chat_description.offer.userId === _this.userId) {
                        _this.mode = _this.MODE.JOINED_AUTO_ACCEPT;
                        _this.render({
                            remoteAnswerDescription: event.chat_description.answer.answerDescription
                        });
                    } else {
                        console.error(new Error('Offer and Answer do not make sense!'));
                    }
                }
            },

            onMessageRouter: function(eventData) {
                var _this = this;
                _this.initializeMessagesStack();
                if (_this.messagesStack.length) {
                    _this.messagesStack.push(eventData);
                } else {
                    if (_this[eventData.notify_data]) {
                        _this[eventData.notify_data](eventData);
                    } else {
                        console.error(new Error('No message handler'));
                    }
                }
            },

            /**
             * both peers are notified with this function
             * if all server side steps were made
             */
            chatConnectionEstablished: function() {
                console.log('chatConnectionEstablished');
            },

            toggleShowState: function(_options, toggleObject, _obj) {
                if (_obj.target && _obj.target.dataset.role === "enablePagination") {
                    toggleObject[_options.key] = _obj.target.checked;
                    return;

                }
                if (_obj.target && _obj.target.dataset.role === 'choice') {
                    toggleObject[_options.key] = _obj.target.dataset.toggle === "true";
                    return;

                }
                if (!toggleObject.previousSave) {
                    if (_options.save && _options.save === true) {
                        toggleObject.previousSave = true;
                        toggleObject.previousShow = toggleObject[_options.key];
                    }
                }
                if (_options.restore) {
                    if (toggleObject.previousSave) {
                        toggleObject[_options.key] = toggleObject.previousShow;

                    } else {
                        toggleObject[_options.key] = toggleObject.show;
                    }
                    toggleObject.previousSave = false;
                    return;

                }
                toggleObject[_options.key] = _options.toggle;
            }

        };
        extend(chat, ajax_core);
        extend(chat, template_core);
        extend(chat, id_core);
        extend(chat, extend_core);
        extend(chat, message_core);
        extend(chat, event_core);

        chat.prototype.chat_template = chat.prototype.template(chat_template);
        chat.prototype.waiter_template = chat.prototype.template(waiter_template);
        chat.prototype.console_log_template = chat.prototype.template(console_log_template);

        return chat;
    });

