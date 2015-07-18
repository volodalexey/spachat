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
        'event_bus',
        //
        'ajax_core',
        'template_core',
        'id_core',
        'extend_core',
        'message_core',
        'throw_event_core',
        "switcher_core",
        //
        'text!../templates/chat_template.ejs',
        'text!../templates/waiter_template.ejs',
        'text!../templates/console_log_template.ejs'
    ],
    function(Header,
             Editor,
             Pagination,
             Settings,
             Contact_list,
             Messages,
             webrtc,
             websocket,
             Body,
             event_bus,
             //
             ajax_core,
             template_core,
             id_core,
             extend_core,
             message_core,
             throw_event_core,
             switcher_core,
             //
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
                offScroll: false,
                sendEnter: false,
                iSender: true
            },
            goToMessageOptions: {
                show: false,
                rteChoicePage: true,
                mode_change: "rte"
            },
            goToLoggerOptions: {
                show: false,
                rteChoicePage: true,
                mode_change: "rte"
            },
            paginationMessageOptions: {
                show: false,
                mode_change: "rte",
                currentPage: null,
                firstPage: 1,
                lastPage: null,
                showEnablePagination: false,
                showChoicePerPage: false,
                perPageValue: 1,
                perPageValueNull: false,
                rtePerPage: true,
                disableBack: false,
                disableFirst: false,
                disableLast: false,
                disableForward: false
            },
            paginationLoggerOptions: {
                show: false,
                mode_change: "rte",
                currentPage: null,
                firstPage: 1,
                lastPage: null,
                showEnablePagination: false,
                showChoicePerPage: false,
                perPageValue: 10,
                perPageValueNull: false,
                rtePerPage: true,
                disableBack: false,
                disableFirst: false,
                disableLast: false,
                disableForward: false
            },
            messagesOptions: {
                start: 0,
                last: null,
                previousStart: 0,
                previousFinal: 0,
                restore: false,
                innerHTML: ""
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
            this.body = new Body({chat: this});
            this.bodyOptions.mode = this.body.MODE.MESSAGES; // TODO move to description

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

            cashElements: function() {
                var _this = this;
                _this.chat_element = _this.chat_wrapper.querySelector('section[data-chat_id="' + _this.chatId + '"]');
                _this.header_container = _this.chat_element.querySelector('[data-role="header_container"]');
                _this.header_waiter_container = _this.chat_element.querySelector('[data-role="waiter_container"]');
                _this.body_container = _this.chat_element.querySelector('[data-role="body_container"]');
                _this.pagination_container = _this.chat_element.querySelector('[data-role="pagination_container"]');
                _this.go_to_container = _this.chat_element.querySelector('[data-role="go_to_container"]');
            },

            unCashElements: function() {
                var _this = this;
                _this.chat_element = null;
                _this.header_container = null;
                _this.header_waiter_container = null;
                _this.body_container = null;
            },

            console: {
                log: function(event) {
                    var _this = this;
                    var txt = _this.console_log_template(event);
                    _this.messages.addLocalMessage(_this.body.MODE.LOGGER,
                        {scrollTop: true, messageInnerHTML: txt}, null);
                }
            },

            initialize: function(options) {
                var _this = this;
                _this.chat_wrapper = options && options.chat_wrapper ? options.chat_wrapper : _this.chat_wrapper;
                _this.chat_wrapper.insertAdjacentHTML( 'beforeend', _this.chat_template({ chat: this}) );
                _this.cashElements();
                _this.header_waiter_container.innerHTML = _this.waiter_template();
                _this.addEventListeners();
            },

            render: function(options, _array) {
                var _this = this;
                _this.editor.render(options, this);
                _this.header.render(options, _array, this);
                _this.pagination.render(options, this, _this.bodyOptions.mode);
                _this.body.render({scrollTop: true}, this);
            },

            /**
             * prepare change mode from UI event
             * @param event - UI event
             */
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

            /**
             * switch mode of all dependencies in the chat followed by array of descriptions
             * @param _array - array of descriptions
             */
            switchModes: function(_array, options) {
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
                                    switch (_this.bodyOptions.mode) {
                                        case _this.body.MODE.SETTING: case _this.body.MODE.CONTACT_LIST:
                                            _this.bodyOptions.mode = _this.body.MODE.MESSAGES;
                                            _this.toggleShowState({
                                                key: 'show',
                                                restore: true,
                                                toggle: true
                                            }, _this.paginationMessageOptions, _obj);
                                            _this.toggleShowState({
                                                key: 'show',
                                                restore: true,
                                                toggle: true
                                            }, _this.formatOptions, _obj);
                                            _this.toggleShowState({
                                                key: 'show',
                                                restore: true,
                                                toggle: true
                                            }, _this.goToMessageOptions, _obj);
                                            _this.editorOptions.show = true;
                                            break;
                                        case  _this.body.MODE.LOGGER:
                                            break;
                                    }
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
                                    }, _this.paginationMessageOptions, _obj);
                                    _this.toggleShowState({
                                        key: 'show',
                                        save: true,
                                        toggle: false
                                    }, _this.formatOptions, _obj);
                                    _this.toggleShowState({
                                        key: 'show',
                                        save: true,
                                        toggle: false
                                    }, _this.goToMessageOptions, _obj);
                                    _this.toggleShowState({
                                        key: 'show',
                                        save: true,
                                        toggle: false
                                    }, _this.paginationLoggerOptions, _obj);
                                    _this.toggleShowState({
                                        key: 'show',
                                        save: true,
                                        toggle: false
                                    }, _this.goToLoggerOptions, _obj);
                                    _this.toggleText({
                                        key: 'innerHTML',
                                        save: true
                                    }, _this.messagesOptions, _this.editor.message_inner_container);
                                    break;
                                case _this.body.MODE.CONTACT_LIST:
                                    _this.bodyOptions.mode = _this.body.MODE.CONTACT_LIST;
                                    _this.filterOptions.show = false;
                                    _this.editorOptions.show = false;
                                    _this.toggleShowState({
                                        key: 'show',
                                        save: true,
                                        toggle: false
                                    }, _this.paginationMessageOptions, _obj);
                                    _this.toggleShowState({
                                            key: 'show',
                                            save: true,
                                            toggle: false
                                    }, _this.formatOptions, _obj);
                                    _this.toggleShowState({
                                        key: 'show',
                                        save: true,
                                        toggle: false
                                    }, _this.goToMessageOptions, _obj);
                                    _this.toggleShowState({
                                        key: 'show',
                                        save: true,
                                        toggle: false
                                    }, _this.paginationLoggerOptions, _obj);
                                    _this.toggleShowState({
                                        key: 'show',
                                        save: true,
                                        toggle: false
                                    }, _this.goToLoggerOptions, _obj);
                                    _this.toggleText({
                                        key: 'innerHTML',
                                        save: true
                                    }, _this.messagesOptions, _this.editor.message_inner_container);
                                    break;
                                case _this.body.MODE.MESSAGES:
                                    _this.bodyOptions.mode = _this.body.MODE.MESSAGES;
                                    _this.editorOptions.show = true;
                                    _this.toggleShowState({
                                        key: 'show',
                                        restore: true,
                                        toggle: true
                                    }, _this.paginationMessageOptions, _obj);
                                    _this.toggleShowState({
                                        key: 'show',
                                        restore: true,
                                        toggle: true
                                    }, _this.formatOptions, _obj);
                                    _this.toggleShowState({
                                        key: 'show',
                                        restore: true,
                                        toggle: true
                                    }, _this.goToMessageOptions, _obj);
                                    _this.toggleShowState({
                                        key: 'show',
                                        save: true,
                                        toggle: false
                                    }, _this.paginationLoggerOptions, _obj);
                                    _this.toggleShowState({
                                        key: 'show',
                                        save: true,
                                        toggle: false
                                    }, _this.goToLoggerOptions, _obj);
                                    _this.toggleText({
                                        key: 'innerHTML',
                                        restore: true
                                    }, _this.messagesOptions, _this.editor.message_inner_container);
                                    break;
                                case _this.body.MODE.LOGGER:
                                    _this.bodyOptions.mode = _this.body.MODE.LOGGER;
                                    _this.filterOptions.show = false;
                                    _this.editorOptions.show = false;
                                    _this.messagesOptions.final = null;

                                    _this.toggleShowState({
                                        key: 'show',
                                        save: true,
                                        toggle: false
                                    }, _this.paginationMessageOptions, _obj);
                                    _this.toggleShowState({
                                        key: 'show',
                                        save: true,
                                        toggle: false
                                    }, _this.goToMessageOptions, _obj);
                                    _this.toggleShowState({
                                        key: 'show',
                                        restore: true,
                                        toggle: true
                                    }, _this.paginationLoggerOptions, _obj);
                                    _this.toggleShowState({
                                        key: 'show',
                                        restore: true,
                                        toggle: true
                                    }, _this.goToLoggerOptions, _obj);
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
                                        _this.optionsDefinition(_this, _this.bodyOptions.mode);
                                        _this.currentPaginationOptions.show = _obj.target.checked;
                                        _this.currentPaginationOptions.showEnablePagination = _obj.target.checked;
                                        if (!_obj.target.checked) {
                                            _this.messagesOptions.previousStart = 0;
                                            _this.messagesOptions.previousFinal = null;
                                            _this.messagesOptions.start = 0;
                                            _this.messagesOptions.final = null;
                                        }
                                    }
                                    _this.toggleShowState({key: 'show', toggle: false}, _this.currentPaginationOptions, _obj);
                                    break;
                                case _this.pagination.MODE.GO_TO:
                                    _this.optionsDefinition(_this, _this.bodyOptions.mode);
                                    if (_obj.target) {
                                        var bool_Value = _obj.target.dataset.toggle === "true";
                                        _this.currentGoToOptions.show = bool_Value;
                                    }
                                    break;
                            }
                            break;
                    }
                });
                _this.render(options, _array);
            },

            addEventListeners: function() {
                var _this = this;
                _this.removeEventListeners();
                _this.on('throw', _this.throwRouter, _this);
                _this.on('log', _this.console.log, _this);
                _this.on('notifyChat', _this.onMessageRouter, _this);
            },

            removeEventListeners: function() {
                var _this = this;
                _this.off('throw', _this.throwRouter);
                _this.off('log');
                _this.off('notifyChat');
            },

            throwRouter: function(action, event) {
                if (this[action]) {
                    this[action](event);
                }
            },

            destroyChat: function(event) {
                var _this = this;
                if (confirm("Close this chat ?")) {
                    _this.removeEventListeners();
                    this.header.destroy();
                    this.header = null;
                    this.editor.destroy();
                    this.editor = null;
                    this.pagination.destroy();
                    this.pagination = null;
                    this.settings.destroy();
                    this.settings = null;
                    this.contact_list.destroy();
                    this.contact_list = null;
                    this.messages.destroy();
                    this.messages = null;
                    webrtc.destroy(_this);
                    this.body.destroy();
                    this.body = null;
                    _this.chat_element.remove();
                    _this.unCashElements();
                    event_bus.trigger('destroyChat', _this);
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
                //_this.proceedNextMessage();
            },

            onMessageRouter: function(eventData) {
                var _this = this;
                _this.initializeMessagesStack();
                if (_this.messagesStack.length) {
                    _this.messagesStack.push(eventData);
                } else {
                    if (_this[eventData.notify_data]) {
                        _this[eventData.notify_data](eventData);
                    } else if (webrtc[eventData.notify_data]) {
                        webrtc[eventData.notify_data](_this, eventData);
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
            }

            /*toggleShowState: function(_options, toggleObject, _obj) {
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
            },
*/

        };
        extend(chat, ajax_core);
        extend(chat, template_core);
        extend(chat, id_core);
        extend(chat, extend_core);
        extend(chat, message_core);
        extend(chat, throw_event_core);
        extend(chat, switcher_core);

        chat.prototype.chat_template = chat.prototype.template(chat_template);
        chat.prototype.waiter_template = chat.prototype.template(waiter_template);
        chat.prototype.console_log_template = chat.prototype.template(console_log_template);

        return chat;
    });

