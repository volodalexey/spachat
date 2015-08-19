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
        'throw_event_core',
        "switcher_core",
        'model_core',
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
            messages_ListOptions: {
                text: "mes",
                start: 0,
                last: null,
                previousStart: 0,
                previousFinal: 0,
                restore: false,
                innerHTML: "",
                data_download: true
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
            logger_ListOptions: {
                text: "log",
                start: 0,
                last: null,
                previousStart: 0,
                previousFinal: 0,
                restore: false,
                data_download: true
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
            contactList_ListOptions: {
                text: "contact",
                start: 0,
                last: null,
                previousStart: 0,
                previousFinal: 0,
                restore: false,
                data_download: false
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
            },
            settings_ListOptions: {
                size_350: true,
                size_700: false,
                size_1050: false,
                size_custom: false,
                adjust_width: false,
                size_custom_value: '350px',
                size_current: '350px'
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
                        "db_name": this.chat_id + '_chat',
                        "table_names": ['messages', 'log_messages'],
                        "table_options": [{ autoIncrement: true, keyPath: "id" }, { keyPath: "id" }],
                        "table_indexes": [[ 'user_ids', 'user_ids', { multiEntry: true } ]],
                        "db_version": 1
                    };
                }
            },

            valueOfKeys: ['chat_id'],

            bindContexts: function() {
                var _this = this;
                //_this.bindedThrowRouter = _this.throwRouter.bind(_this);
                _this.bindedStartResizer = _this.startResizer.bind(_this);
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
                _this.chat_element = _this.chat_wrapper.querySelector('section[data-chat_id="' + _this.chat_id + '"]');
                _this.header_container = _this.chat_element.querySelector('[data-role="header_container"]');
                _this.header_waiter_container = _this.chat_element.querySelector('[data-role="waiter_container"]');
                _this.extra_toolbar_container = _this.chat_element.querySelector('[data-role="extra_toolbar_container"]');
                _this.filter_container = _this.chat_element.querySelector('[data-role="filter_container"]');
                _this.body_container = _this.chat_element.querySelector('[data-role="body_container"]');
                _this.pagination_container = _this.chat_element.querySelector('[data-role="pagination_container"]');
                _this.go_to_container = _this.chat_element.querySelector('[data-role="go_to_container"]');
                _this.splitter_left = _this.chat_element.querySelector('[data-splitteritem="left"]');
                _this.splitter_right = _this.chat_element.querySelector('[data-splitteritem="right"]');
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
                _this.extra_toolbar_container = null;
                _this.filter_container = null;
                _this.pagination_container = null;
                _this.go_to_container = null;
                _this.splitter_left = null;
                _this.splitter_right = null;
            },

            console: {
                log: function(event) {
                    var _this = this;
                    var txt = _this.console_log_template(event);
                    _this.messages.addMessage(_this, _this.body.MODE.LOGGER,
                        {scrollTop: true, messageInnerHTML: txt}, null);
                }
            },

            initialize: function(options) {
                var _this = this;
                _this.chat_wrapper = options && options.chat_wrapper ? options.chat_wrapper : _this.chat_wrapper;
                _this.chat_wrapper.insertAdjacentHTML('beforeend', _this.chat_template({chat: this}));
                _this.cashElements();
                _this.chat_element.style.width = _this.settings_ListOptions.size_current;
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
                                    }, _this.messages_ListOptions, _this.editor.message_inner_container);
                                    break;
                                case _this.body.MODE.CONTACT_LIST:
                                    _this.bodyOptions.mode = _this.body.MODE.CONTACT_LIST;
                                    _this.editorOptions.show = false;
                                    _this.messages_ListOptions.final = null;
                                    _this.logger_ListOptions.final = null;
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
                                    }, _this.messages_ListOptions, _this.editor.message_inner_container);
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
                                    }, _this.messages_ListOptions, _this.editor.message_inner_container);
                                    break;
                                case _this.body.MODE.LOGGER:
                                    _this.bodyOptions.mode = _this.body.MODE.LOGGER;
                                    _this.editorOptions.show = false;
                                    _this.messages_ListOptions.final = null;
                                    _this.logger_ListOptions.final = null;
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
                                        if (!_obj.target.checked && _this.currentListOptions) {
                                            _this.currentListOptions.previousStart = 0;
                                            _this.currentListOptions.previousFinal = null;
                                            _this.currentListOptions.start = 0;
                                            _this.currentListOptions.final = null;
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
                _this.addRemoveListener('add', _this.splitter_left, 'mousedown', _this.bindedStartResizer, false);
                _this.addRemoveListener('add', _this.splitter_right, 'mousedown', _this.bindedStartResizer, false);
                _this.addRemoveListener('add', _this.splitter_left, 'touchstart', _this.bindedStartResizer, false);
                _this.addRemoveListener('add', _this.splitter_right, 'touchstart', _this.bindedStartResizer, false);
                _this.addRemoveListener('add', _this.splitter_right, 'touchmove', _this.bindedStartResizer, false);
                _this.addRemoveListener('add', _this.splitter_left, 'touchmove', _this.bindedStartResizer, false);
                _this.addRemoveListener('add', _this.splitter_right, 'touchend', _this.bindedStartResizer, false);
                _this.addRemoveListener('add', _this.splitter_left, 'touchend', _this.bindedStartResizer, false);
            },

            removeEventListeners: function() {
                var _this = this;
                _this.off('throw', _this.throwRouter);
                _this.off('log');
                _this.addRemoveListener('remove', _this.splitter_left, 'mousedown', _this.bindedStartResizer, false);
                _this.addRemoveListener('remove', _this.splitter_left, 'touchstart', _this.bindedStartResizer, false);
                _this.addRemoveListener('remove', _this.splitter_right, 'mousedown', _this.bindedStartResizer, false);
                _this.addRemoveListener('remove', _this.splitter_right, 'touchstart', _this.bindedStartResizer, false);
                _this.addRemoveListener('remove', _this.splitter_right, 'touchmove', _this.bindedStartResizer, false);
                _this.addRemoveListener('remove', _this.splitter_left, 'touchmove', _this.bindedStartResizer, false);
                _this.addRemoveListener('remove', _this.splitter_right, 'touchend', _this.bindedStartResizer, false);
                _this.addRemoveListener('remove', _this.splitter_left, 'touchend', _this.bindedStartResizer, false);
            },

            throwRouter: function(action, event) {
                if (this[action]) {
                    this[action](event);
                }
            },

            startResizer: function(event) {
                var _this = this;
                event.stopPropagation();
                event.preventDefault();
                switch (event.type) {
                    case 'mousedown':case 'touchstart':
                    event_bus.trigger('transformToResizeState', event, _this);
                    break;
                    case 'touchmove': case 'touchend':
                    event_bus.trigger('redirectResize', event, _this);
                    break;
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
                this.body.destroy();
                this.body = null;
                _this.chat_element.remove();
                _this.unCashElements();
            },

            toChatDescription: function() {
                var _this = this;
                return {
                    chat_id: _this.chat_id,
                    user_ids: _this.user_ids,
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
                    messages_GoToOptions: _this.messages_GoToOptions,
                    messages_PaginationOptions: _this.messages_PaginationOptions,
                    messages_FilterOptions: _this.messages_FilterOptions,
                    messages_ExtraToolbarOptions: _this.messages_ExtraToolbarOptions,
                    messages_ListOptions: _this.messages_ListOptions,
                    logger_GoToOptions: _this.logger_GoToOptions,
                    logger_PaginationOptions: _this.logger_PaginationOptions,
                    logger_FilterOptions: _this.logger_FilterOptions,
                    logger_ExtraToolbarOptions: _this.logger_ExtraToolbarOptions,
                    logger_ListOptions: _this.logger_ListOptions,
                    contactList_FilterOptions: _this.contactList_FilterOptions,
                    contactList_ExtraToolbarOptions: _this.contactList_ExtraToolbarOptions,
                    contactList_PaginationOptions: _this.contactList_PaginationOptions,
                    contactList_GoToOptions: _this.contactList_GoToOptions,
                    settings_ExtraToolbarOptions: _this.settings_ExtraToolbarOptions,
                    settings_FilterOptions: _this.settings_FilterOptions,
                    settings_PaginationOptions: _this.settings_PaginationOptions,
                    settings_GoToOptions: _this.settings_GoToOptions,
                    settings_ListOptions: _this.settings_ListOptions
                };
            },

            renderPagination: function() {
                var _this = this;
                _this.pagination.initialize({chat: _this});
            },

            fillMessages: function(obj) {
                var _this = this;
                _this.messages.fillListMessage(obj);
            }

        };
        extend_core.prototype.inherit(chat, ajax_core);
        extend_core.prototype.inherit(chat, template_core);
        extend_core.prototype.inherit(chat, id_core);
        extend_core.prototype.inherit(chat, extend_core);
        extend_core.prototype.inherit(chat, throw_event_core);
        extend_core.prototype.inherit(chat, switcher_core);
        extend_core.prototype.inherit(chat, model_core);
        extend_core.prototype.inherit(chat, render_layout_core);
        extend_core.prototype.inherit(chat, overlay_core);

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

