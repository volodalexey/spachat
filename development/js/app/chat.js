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
        'indexeddb',
        'users_bus',
        'extra_toolbar',
        'filter',
        //
        'ajax_core',
        'template_core',
        'id_core',
        'extend_core',
        'message_core',
        'throw_event_core',
        "switcher_core",
        'app/extensions/model_core',
        'overlay_core',
        'render_layout_core',
        //
        'text!../templates/chat_template.ejs',
        'text!../templates/waiter_template.ejs',
        'text!../templates/console_log_template.ejs',
        'text!../templates/element/triple_element_template.ejs',
        'text!../templates/element/button_template.ejs',
        'text!../templates/element/label_template.ejs',
        'text!../templates/element/input_template.ejs',
        'text!../templates/filter_template.ejs'

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
             indexeddb,
             users_bus,
             Extra_toolbar,
             Filter,
             //
             ajax_core,
             template_core,
             id_core,
             extend_core,
             message_core,
             throw_event_core,
             switcher_core,
             model_core,
             overlay_core,
             render_layout_core,
             //
             chat_template,
             waiter_template,
             console_log_template,
             triple_element_template,
             button_template,
             label_template,
             input_template,
             filter_template) {

        var defaultOptions = {
            padding: {
                bottom: 5
            },
            headerOptions: {
                show: true,
                mode: Header.prototype.MODE.TAB
            },
            filterOptions: {
                show: false
            },
            bodyOptions: {
                show: true,
                mode: Body.prototype.MODE.MESSAGES
            },
            editorOptions: {
                show: true,
                mode: Editor.prototype.MODE.MAIN_PANEL
            },
            formatOptions: {
                show: false,
                offScroll: false,
                sendEnter: false,
                iSender: true
            },
            messagesOptions: {
                start: 0,
                last: null,
                previousStart: 0,
                previousFinal: 0,
                restore: false,
                innerHTML: ""
            },

            messages_GoToOptions: {
                text: "mes",
                show: false,
                rteChoicePage: true,
                mode_change: "rte"
            },
            messages_PaginationOptions: {
                text: "mes",
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
            messages_FilterOptions: {
                show: false
            },
            messages_ExtraToolbarOptions: {
                show: true
            },

            logger_GoToOptions: {
                show: false,
                rteChoicePage: true,
                mode_change: "rte"
            },
            logger_PaginationOptions: {
                text: "log",
                show: false,
                mode_change: "rte",
                currentPage: null,
                firstPage: 1,
                lastPage: null,
                showEnablePagination: false,
                showChoicePerPage: false,
                perPageValue: 25,
                perPageValueNull: false,
                rtePerPage: true,
                disableBack: false,
                disableFirst: false,
                disableLast: false,
                disableForward: false
            },
            logger_FilterOptions: {
                show: false
            },
            logger_ExtraToolbarOptions: {
                show: true
            },

            contactList_FilterOptions: {
                show: false
            },
            contactList_ExtraToolbarOptions: {
                show: true
            },
            contactList_PaginationOptions: {
                text: "contact",
                show: false,
                mode_change: "rte",
                currentPage: null,
                firstPage: 1,
                lastPage: null,
                showEnablePagination: false,
                showChoicePerPage: false,
                perPageValue: 50,
                perPageValueNull: false,
                rtePerPage: true,
                disableBack: false,
                disableFirst: false,
                disableLast: false,
                disableForward: false
            },
            contactList_GoToOptions: {
                text: "contact",
                show: false,
                rteChoicePage: true,
                mode_change: "rte"
            },

            settings_ExtraToolbarOptions: {
                show: false
            },
            settings_FilterOptions: {
                show: false
            },
            settings_PaginationOptions: {
                show: false
            },
            settings_GoToOptions: {
                show: false
            }
        };

        var chat = function(options, restore_chat_state) {
            this.extend(this, defaultOptions);
            if (options) {
                this.extend(this, options);
            }
            this.setCollectionDescription();
            this.body = new Body({chat: this});
            this.header = new Header({chat: this});
            this.editor = new Editor({chat: this});
            this.pagination = new Pagination({chat: this});
            this.settings = new Settings({chat: this});
            this.contact_list = new Contact_list({chat: this});
            this.messages = new Messages({chat: this});
            this.extra_toolbar = new Extra_toolbar({chat: this});
            this.filter = new Filter({chat: this});

            this.bindContexts();
            this.setCreator();
            this.addMyUserId();
        };

        chat.prototype = {

            setCollectionDescription: function() {
                if (!this.collectionDescription) {
                    this.collectionDescription = {
                        "db_name": this.chatId + '_chat',
                        "table_names": ['messages', 'log_messages'],
                        "table_options": [{ autoIncrement: true, keyPath: "id" }, { keyPath: "id" }],
                        "db_version": 1
                    };
                }
            },

            valueOfKeys: ['chatId'],

            bindContexts: function() {
                var _this = this;
                //_this.bindedThrowRouter = _this.throwRouter.bind(_this);
            },

            valueOfChat: function() {
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
                _this.extra_toolbar_container = _this.chat_element.querySelector('[data-role="extra_toolbar_container"]');
                _this.filter_container = _this.chat_element.querySelector('[data-role="filter_container"]');
                _this.body_container = _this.chat_element.querySelector('[data-role="body_container"]');
                _this.pagination_container = _this.chat_element.querySelector('[data-role="pagination_container"]');
                _this.go_to_container = _this.chat_element.querySelector('[data-role="go_to_container"]');
            },

            cashExtraToolbarElement: function() {
                var _this = this;
                _this.btn_Filter = _this.extra_toolbar_container.querySelector('[data-role="btn_Filter"]');
            },

            unCashElements: function() {
                var _this = this;
                _this.chat_element = null;
                _this.header_container = null;
                _this.header_waiter_container = null;
                _this.body_container = null;
                _this.btn_Filter = null;
            },

            console: {
                log: function(event) {
                    var _this = this;
                    var txt = _this.console_log_template(event);
                    _this.messages.addMessage(_this.body.MODE.LOGGER,
                        {scrollTop: true, messageInnerHTML: txt}, null);
                }
            },

            initialize: function(options) {
                var _this = this;
                _this.chat_wrapper = options && options.chat_wrapper ? options.chat_wrapper : _this.chat_wrapper;
                _this.chat_wrapper.insertAdjacentHTML('beforeend', _this.chat_template({chat: this}));
                _this.cashElements();
                _this.header_waiter_container.innerHTML = _this.waiter_template();
                _this.addEventListeners();
            },

            render: function(options, _array) {
                var _this = this;
                _this.editor.render(options, _this);
                _this.header.render(options, _array, _this);
                _this.extra_toolbar.renderExtraToolbar(_this, _this.bodyOptions.mode, function(){
                    _this.filter.renderFilter(_this, _this.bodyOptions.mode, function() {
                        _this.pagination.render(options, _this, _this.bodyOptions.mode);
                        _this.body.render({scrollTop: true}, _this);
                    });
                });
            },

            /**
             * prepare change mode from UI event
             */
            changeMode: function(element) {
                var _this = this;
                _this.switchModes([
                    {
                        chat_part: element.dataset.chat_part,
                        newMode: element.dataset.mode_to,
                        target: element
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
                        case "body":
                            switch (_obj.newMode) {
                                case _this.body.MODE.SETTINGS:
                                    _this.bodyOptions.mode = _this.body.MODE.SETTINGS;
                                    _this.editorOptions.show = false;
                                    _this.toggleShowState({
                                        key: 'show',
                                        save: true,
                                        toggle: false
                                    }, _this.formatOptions, _obj);
                                    _this.toggleShowState({
                                        key: 'show',
                                        save: true,
                                        toggle: false
                                    }, _this.messages_PaginationOptions, _obj);
                                    _this.toggleShowState({
                                        key: 'show',
                                        save: true,
                                        toggle: false
                                    }, _this.messages_GoToOptions, _obj);
                                    _this.toggleShowState({
                                        key: 'show',
                                        save: true,
                                        toggle: false
                                    }, _this.messages_FilterOptions, _obj);
                                    _this.toggleShowState({
                                        key: 'show',
                                        save: true,
                                        toggle: false
                                    }, _this.logger_PaginationOptions, _obj);
                                    _this.toggleShowState({
                                        key: 'show',
                                        save: true,
                                        toggle: false
                                    }, _this.logger_GoToOptions, _obj);
                                    _this.toggleShowState({
                                        key: 'show',
                                        save: true,
                                        toggle: false
                                    }, _this.logger_FilterOptions, _obj);
                                    _this.toggleShowState({
                                        key: 'show',
                                        save: true,
                                        toggle: false
                                    }, _this.contactList_FilterOptions, _obj);
                                    _this.toggleShowState({
                                        key: 'show',
                                        save: true,
                                        toggle: false
                                    }, _this.contactList_PaginationOptions, _obj);
                                    _this.toggleShowState({
                                        key: 'show',
                                        save: true,
                                        toggle: false
                                    }, _this.contactList_GoToOptions, _obj);
                                    _this.toggleText({
                                        key: 'innerHTML',
                                        save: true
                                    }, _this.messagesOptions, _this.editor.message_inner_container);
                                    break;
                                case _this.body.MODE.CONTACT_LIST:
                                    _this.bodyOptions.mode = _this.body.MODE.CONTACT_LIST;
                                    _this.editorOptions.show = false;
                                    _this.messagesOptions.final = null;
                                    _this.toggleShowState({
                                        key: 'show',
                                        save: true,
                                        toggle: false
                                    }, _this.formatOptions, _obj);
                                    _this.toggleShowState({
                                        key: 'show',
                                        save: true,
                                        toggle: false
                                    }, _this.messages_PaginationOptions, _obj);
                                    _this.toggleShowState({
                                        key: 'show',
                                        save: true,
                                        toggle: false
                                    }, _this.messages_GoToOptions, _obj);
                                    _this.toggleShowState({
                                        key: 'show',
                                        save: true,
                                        toggle: false
                                    }, _this.messages_FilterOptions, _obj);
                                    _this.toggleShowState({
                                        key: 'show',
                                        save: true,
                                        toggle: false
                                    }, _this.logger_PaginationOptions, _obj);
                                    _this.toggleShowState({
                                        key: 'show',
                                        save: true,
                                        toggle: false
                                    }, _this.logger_GoToOptions, _obj);
                                    _this.toggleShowState({
                                        key: 'show',
                                        save: true,
                                        toggle: false
                                    }, _this.logger_FilterOptions, _obj);
                                    _this.toggleShowState({
                                        key: 'show',
                                        restore: true,
                                        toggle: true
                                    }, _this.contactList_FilterOptions, _obj);
                                    _this.toggleShowState({
                                        key: 'show',
                                        restore: true,
                                        toggle: true
                                    }, _this.contactList_PaginationOptions, _obj);
                                    _this.toggleShowState({
                                        key: 'show',
                                        restore: true,
                                        toggle: true
                                    }, _this.contactList_GoToOptions, _obj);
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
                                    }, _this.formatOptions, _obj);
                                    _this.toggleShowState({
                                        key: 'show',
                                        restore: true,
                                        toggle: true
                                    }, _this.messages_PaginationOptions, _obj);
                                    _this.toggleShowState({
                                        key: 'show',
                                        restore: true,
                                        toggle: true
                                    }, _this.messages_GoToOptions, _obj);
                                    _this.toggleShowState({
                                        key: 'show',
                                        restore: true,
                                        toggle: true
                                    }, _this.messages_FilterOptions, _obj);
                                    _this.toggleShowState({
                                        key: 'show',
                                        save: true,
                                        toggle: false
                                    }, _this.logger_PaginationOptions, _obj);
                                    _this.toggleShowState({
                                        key: 'show',
                                        save: true,
                                        toggle: false
                                    }, _this.logger_GoToOptions, _obj);
                                    _this.toggleShowState({
                                        key: 'show',
                                        save: true,
                                        toggle: false
                                    }, _this.logger_FilterOptions, _obj);
                                    _this.toggleShowState({
                                        key: 'show',
                                        save: true,
                                        toggle: false
                                    }, _this.contactList_FilterOptions, _obj);
                                    _this.toggleShowState({
                                        key: 'show',
                                        save: true,
                                        toggle: false
                                    }, _this.contactList_PaginationOptions, _obj);
                                    _this.toggleShowState({
                                        key: 'show',
                                        save: true,
                                        toggle: false
                                    }, _this.contactList_GoToOptions, _obj);
                                    _this.toggleText({
                                        key: 'innerHTML',
                                        restore: true
                                    }, _this.messagesOptions, _this.editor.message_inner_container);
                                    break;
                                case _this.body.MODE.LOGGER:
                                    _this.bodyOptions.mode = _this.body.MODE.LOGGER;
                                    _this.editorOptions.show = false;
                                    _this.messagesOptions.final = null;
                                    _this.toggleShowState({
                                        key: 'show',
                                        save: true,
                                        toggle: false
                                    }, _this.messages_PaginationOptions, _obj);
                                    _this.toggleShowState({
                                        key: 'show',
                                        save: true,
                                        toggle: false
                                    }, _this.messages_GoToOptions, _obj);
                                    _this.toggleShowState({
                                        key: 'show',
                                        save: true,
                                        toggle: false
                                    }, _this.messages_FilterOptions, _obj);
                                    _this.toggleShowState({
                                        key: 'show',
                                        restore: true,
                                        toggle: true
                                    }, _this.logger_PaginationOptions, _obj);
                                    _this.toggleShowState({
                                        key: 'show',
                                        restore: true,
                                        toggle: true
                                    }, _this.logger_GoToOptions, _obj);
                                    _this.toggleShowState({
                                        key: 'show',
                                        restore: true,
                                        toggle: true
                                    }, _this.logger_FilterOptions, _obj);
                                    _this.toggleShowState({
                                        key: 'show',
                                        save: true,
                                        toggle: false
                                    }, _this.contactList_FilterOptions, _obj);
                                    _this.toggleShowState({
                                        key: 'show',
                                        save: true,
                                        toggle: false
                                    }, _this.contactList_PaginationOptions, _obj);
                                    _this.toggleShowState({
                                        key: 'show',
                                        save: true,
                                        toggle: false
                                    }, _this.contactList_GoToOptions, _obj);
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
                                    _this.toggleShowState({
                                        key: 'show',
                                        toggle: false
                                    }, _this.currentPaginationOptions, _obj);
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
                        case "filter":
                            switch (_obj.newMode) {
                                case _this.filter.MODE.MESSAGES_FILTER: case _this.filter.MODE.CONTACT_LIST_FILTER:
                                    if (_obj.target) {
                                        var bool_Value = _obj.target.dataset.toggle === "true";
                                        _this.optionsDefinition(_this, _this.bodyOptions.mode);
                                        _this.currnetFilterOptions.show = bool_Value;
                                        _obj.target.dataset.toggle = !bool_Value;
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

            destroyChat: function() {
                var _this = this;
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
                this.extra_toolbar.destroy();
                this.extra_toolbar = null;
                this.filter.destroy();
                this.filter = null;
                webrtc.destroy(_this);
                this.body.destroy();
                this.body = null;
                _this.chat_element.remove();
                _this.unCashElements();
            },

            toChatDescription: function() {
                var _this = this;
                return {
                    chatId: _this.chatId,
                    userIds: _this.userIds,
                    createdDatetime: _this.createdDatetime,
                    createdByUserId: _this.createdByUserId,
                    receivedDatetime: _this.receivedDatetime,
                    collectionDescription: _this.collectionDescription,
                    padding: _this.padding,
                    headerOptions: _this.headerOptions,
                    filterOptions: _this.filterOptions,
                    bodyOptions: _this.bodyOptions,
                    editorOptions: _this.editorOptions,
                    formatOptions: _this.formatOptions,
                    messagesOptions: _this.messagesOptions,
                    messages_GoToOptions: _this.messages_GoToOptions,
                    messages_PaginationOptions: _this.messages_PaginationOptions,
                    messages_FilterOptions: _this.messages_FilterOptions,
                    messages_ExtraToolbarOptions: _this.messages_ExtraToolbarOptions,
                    logger_GoToOptions: _this.logger_GoToOptions,
                    logger_PaginationOptions: _this.logger_PaginationOptions,
                    logger_FilterOptions: _this.logger_FilterOptions,
                    logger_ExtraToolbarOptions: _this.logger_ExtraToolbarOptions,
                    contactList_FilterOptions: _this.contactList_FilterOptions,
                    contactList_ExtraToolbarOptions: _this.contactList_ExtraToolbarOptions,
                    contactList_PaginationOptions: _this.contactList_PaginationOptions,
                    contactList_GoToOptions: _this.contactList_GoToOptions,
                    settings_ExtraToolbarOptions: _this.settings_ExtraToolbarOptions,
                    settings_FilterOptions: _this.settings_FilterOptions,
                    settings_PaginationOptions: _this.settings_PaginationOptions,
                    settings_GoToOptions: _this.settings_GoToOptions
                };
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
                sendData.chat_description = this.valueOfChat();
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

        };
        extend(chat, ajax_core);
        extend(chat, template_core);
        extend(chat, id_core);
        extend(chat, extend_core);
        extend(chat, message_core);
        extend(chat, throw_event_core);
        extend(chat, switcher_core);
        extend(chat, model_core);
        extend(chat, render_layout_core);
        extend(chat, overlay_core);

        chat.prototype.chat_template = chat.prototype.template(chat_template);
        chat.prototype.waiter_template = chat.prototype.template(waiter_template);
        chat.prototype.console_log_template = chat.prototype.template(console_log_template);
        chat.prototype.triple_element_template = chat.prototype.template(triple_element_template);
        chat.prototype.button_template = chat.prototype.template(button_template);
        chat.prototype.label_template = chat.prototype.template(label_template);
        chat.prototype.input_template = chat.prototype.template(input_template);
        chat.prototype.filter_template = chat.prototype.template(filter_template);

        return chat;
    });

