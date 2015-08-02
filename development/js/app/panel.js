define('panel', [
        'throw_event_core',
        'ajax_core',
        'template_core',
        'render_layout_core',
        'extend_core',
        'switcher_core',
        'overlay_core',
        'dom_core',
        //
        'users_bus',
        'event_bus',
        'extra_toolbar',
        'filter',
        'pagination',
        'body',
        'indexeddb',
        'websocket',
        //
        'text!../templates/panel_left_template.ejs',
        'text!../templates/panel_right_template.ejs',
        'text!../templates/element/triple_element_template.ejs',
        'text!../templates/element/button_template.ejs',
        'text!../templates/element/label_template.ejs',
        'text!../templates/element/input_template.ejs',
        'text!../templates/element/textarea_template.ejs'
    ],
    function(throw_event_core,
             ajax_core,
             template_core,
             render_layout_core,
             extend_core,
             switcher_core,
             overlay_core,
             dom_core,
             //
             users_bus,
             event_bus,
             Extra_toolbar,
             Filter,
             Pagination,
             Body,
             indexeddb,
             websocket,
             //
             panel_left_template,
             panel_right_template,
             triple_element_template,
             button_template,
             label_template,
             input_template,
             textarea_template) {

        var defaultOptions = {

            collectionDescription: {
                "id": 'chats',
                "db_name": 'chats',
                "table_names": ['chats'],
                "db_version": 1,
                "keyPath": "chatId"
            },

            chats_GoToOptions: {
                show: false,
                rteChoicePage: true,
                mode_change: "rte",
                "chat": null
            },
            chats_PaginationOptions: {
                text: "chats",
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
            chats_ExtraToolbarOptions: {
                show: true
            },
            chats_FilterOptions: {
                show: false
            },
            chats_ListOptions: {
                text: "chats",
                start: 0,
                last: null,
                previousStart: 0,
                previousFinal: 0,
                restore: false,
                data_download: false
            },

            users_ExtraToolbarOptions: {
                show: true
            },
            users_FilterOptions: {
                show: false
            },
            users_GoToOptions: {
                text: "users",
                show: false,
                rteChoicePage: true,
                mode_change: "rte",
                "user": null
            },
            users_PaginationOptions: {
                show: false,
                mode_change: "rte",
                currentPage: null,
                firstPage: 1,
                lastPage: null,
                showEnablePagination: false,
                showChoicePerPage: false,
                perPageValue: 15,
                perPageValueNull: false,
                rtePerPage: true,
                disableBack: false,
                disableFirst: false,
                disableLast: false,
                disableForward: false
            },
            users_ListOptions: {
                text: "users",
                start: 0,
                last: null,
                previousStart: 0,
                previousFinal: 0,
                restore: false,
                data_download: false
            },

            createChat_ExtraToolbarOptions: {
                show: false
            },
            createChat_FilterOptions: {
                show: false
            },
            createChat_PaginationOptions: {
                show: false
            },
            createChat_GoToOptions: {
                show: false,
                rteChoicePage: true,
                mode_change: "rte"
            },

            joinChat_ExtraToolbarOptions: {
                show: false
            },
            joinChat_FilterOptions: {
                show: false
            },
            joinChat_PaginationOptions: {
                show: false
            },
            joinChat_GoToOptions: {
                show: false,
                rteChoicePage: true,
                mode_change: "rte"
            },

            userInfoEdit_ExtraToolbarOptions: {
                show: false
            },
            userInfoEdit_FilterOptions: {
                show: false
            },
            userInfoEdit_PaginationOptions: {
                show: false
            },
            userInfoEdit_GoToOptions: {
                show: false,
                rteChoicePage: true,
                mode_change: "rte"
            },

            userInfoShow_ExtraToolbarOptions: {
                show: false
            },
            userInfoShow_FilterOptions: {
                show: false
            },
            userInfoShow_PaginationOptions: {
                show: false
            },
            userInfoShow_GoToOptions: {
                show: false,
                rteChoicePage: true,
                mode_change: "rte"
            },

            listOptions: {
                start: 0,
                last: null,
                previousStart: 0,
                previousFinal: 0
            },
            filterOptions: {
                show: false
            },
            bodyOptions: {
                show: true,
                mode: null
            }

        };

        var panel = function(description) {
            this.extend(this, defaultOptions);

            this.bindMainContexts();

            this.type = description.type;
            this.panel_platform = description.panel_platform;
            this.outer_container = description.outer_container;
            this.inner_container = description.inner_container;
            this.body_mode = description.body_mode;
            this.filter_container = description.filter_container;
            this.go_to_container = description.go_to_container;
            this.panel_toolbar = description.panel_toolbar;
            this.pagination_container = description.pagination_container;
            this.extra_toolbar_container = description.extra_toolbar_container;

            this.pagination = new Pagination();
            this.body = new Body();
            this.bodyOptions.mode = description.body_mode;
            this.extraToolbar = new Extra_toolbar({panel: this});
            this.filter = new Filter({panel: this});
        };

        panel.prototype = {

            panelArray: [],

            openChatsInfoArray: [],

            MODE: {
                CREATE_CHAT: 'CREATE_CHAT',
                JOIN_CHAT: 'JOIN_CHAT',
                CHATS: 'CHATS',
                USERS: 'USERS',
                JOIN_USER: 'JOIN_USER',

                USER_INFO_EDIT: 'USER_INFO_EDIT',
                USER_INFO_SHOW: 'USER_INFO_SHOW',
                DETAIL_VIEW: 'DETAIL_VIEW',

                PAGINATION: "PAGINATION",
                GO_TO: "GO_TO",
                FILTER: 'FILTER'
            },

            z_index: 80,

            initialization: function(options) {
                if (!options || !options.navigator || !options.panel_platform) {
                    console.error(new Error('Invalid input options for render'));
                    return;
                }
                var _this = this;
                _this.navigator = options.navigator;
                _this.cashElements();
                _this.elementMap = {};
                _this.addMainEventListener();
                _this.outer_container.classList.remove("hide");
                _this.outer_container.style.maxWidth = window.innerWidth + 'px';
                _this.outer_container.style[_this.type] = (-_this.outer_container.offsetWidth) + 'px';
                _this.outer_container.style.zIndex = panel.prototype.z_index;
            },

            dispose: function() {
                var _this = this;
                if (!_this.togglePanelElement) {
                    return;
                }
                _this.removeMainEventListeners();
                _this.togglePanel(true);
                _this.hidePanel();
            },

            hidePanel: function() {
                var _this = this;
                _this.outer_container.classList.add("hide");
            },

            cashElements: function() {
                var _this = this;
                _this.togglePanelElement = _this.outer_container.querySelector('[data-action="togglePanel"]');
                _this.body_container = _this.outer_container.querySelector('[data-role="panel_body"]');
            },

            cashBodyElement: function() {
                var _this = this;
                if (_this.bodyOptions.mode === _this.MODE.USER_INFO_EDIT) {
                    _this.user_name = _this.body_container.querySelector('[data-main="user_name_input"]');
                    _this.old_password = _this.body_container.querySelector('[data-role="passwordOld"]');
                    _this.new_password = _this.body_container.querySelector('[data-role="passwordNew"]');
                    _this.confirm_password = _this.body_container.querySelector('[data-role="passwordConfirm"]');
                }
            },

            cashExtraToolbarElement: function() {
                var _this = this;
                _this.btn_Filter = _this.extra_toolbar_container.querySelector('[data-role="btn_Filter"]');
            },

            unCashElements: function() {
                var _this = this;
                _this.btn_Filter = null;
                _this.user_name = null;
                _this.old_password = null;
                _this.new_password = null;
                _this.confirm_password = null;
            },

            bindMainContexts: function() {
                var _this = this;
                _this.bindedTogglePanelWorkflow = _this.togglePanelWorkflow.bind(_this);
                _this.bindedInputUserInfo = _this.inputUserInfo.bind(_this);
                _this.bindedDataActionRouter = _this.dataActionRouter.bind(_this);
                _this.bindedThrowEventRouter = _this.throwEventRouter.bind(_this);
                _this.bindedTransitionEnd = _this.transitionEnd.bind(_this);
                _this.bindedOnChatDestroyed = _this.onChatDestroyed.bind(_this);
                _this.bindedToggleListOptions = _this.toggleListOptions.bind(_this);
            },

            addMainEventListener: function() {
                var _this = this;
                _this.removeMainEventListeners();
                _this.addRemoveListener('add', _this.togglePanelElement, 'click', _this.bindedTogglePanelWorkflow, false);
                _this.addRemoveListener('add', _this.body_container, 'input', _this.bindedInputUserInfo, false);
                _this.addRemoveListener('add', _this.panel_toolbar, 'click', _this.bindedDataActionRouter, false);
                _this.addRemoveListener('add', _this.body_container, 'click', _this.bindedThrowEventRouter, false);
                _this.addRemoveListener('add', _this.body_container, 'click', _this.bindedDataActionRouter, false);
                _this.addRemoveListener('add', _this.body_container, 'transitionend', _this.bindedTransitionEnd, false);
                _this.on('throw', _this.throwRouter, _this);
                event_bus.on('chatDestroyed', _this.bindedOnChatDestroyed, _this);
                event_bus.on('AddedNewChat', _this.bindedToggleListOptions, _this);
            },

            removeMainEventListeners: function() {
                var _this = this;
                _this.addRemoveListener('remove', _this.togglePanelElement, 'click', _this.bindedTogglePanelWorkflow, false);
                _this.addRemoveListener('remove', _this.body_container, 'input', _this.bindedInputUserInfo, false);
                _this.addRemoveListener('remove', _this.panel_toolbar, 'click', _this.bindedDataActionRouter, false);
                _this.addRemoveListener('remove', _this.body_container, 'click', _this.bindedThrowEventRouter, false);
                _this.addRemoveListener('remove', _this.body_container, 'click', _this.bindedDataActionRouter, false);
                _this.addRemoveListener('remove', _this.body_container, 'transitionend', _this.bindedTransitionEnd, false);
                _this.off('throw', _this.throwRouter);
                event_bus.off('chatDestroyed', _this.bindedOnChatDestroyed);
                event_bus.off('AddedNewChat', _this.bindedToggleListOptions);
            },

            throwRouter: function(action, event) {
                if (this[action]) {
                    this[action](event);
                }
            },

            onChatDestroyed: function(chatId) {
                var _this = this;
                if (_this.type === "left" &&
                    (_this.bodyOptions.mode === this.MODE.CHATS || _this.bodyOptions.mode === this.MODE.DETAIL_VIEW)) {
                    var chat_info_container = _this.body_container.querySelector('[data-chatid="' + chatId + '"]');
                    if (chat_info_container) {
                        var detail_view = chat_info_container.querySelector('[data-role="detail_view_container"]');
                        if (detail_view.dataset.state) {
                            _this.bodyOptions.mode = _this.MODE.DETAIL_VIEW;
                            var pointer = chat_info_container.querySelector('[data-role="pointer"]');
                            _this.render({
                                "detail_view": detail_view,
                                "pointer": pointer,
                                "chat_id_value": chatId
                            });
                        }
                    }
                }
            },

            addToolbarEventListener: function() {
                var _this = this;
            },

            removeToolbarEventListeners: function() {
                var _this = this;
            },

            openOrClosePanel: function(bigMode, forceClose) {
                var _this = this;
                _this.showSpinner(_this.body_container);
                if (!forceClose && _this.outer_container.style[_this.type] !== '0px') {
                    _this.previous_z_index = _this.outer_container.style.zIndex;
                    _this.outer_container.style.zIndex = ++panel.prototype.z_index;
                    _this.outer_container.style[_this.type] = "0px";
                    _this.inner_container.style.maxWidth = _this.calcMaxWidth();
                    _this.fillPanelToolbar();
                    _this.render();
                    _this.resizePanel();
                } else {
                    panel.prototype.z_index--;
                    if (_this.bodyOptions.mode === _this.MODE.DETAIL_VIEW) {
                        _this.bodyOptions.mode = _this.MODE.CHATS;
                    }
                    _this.outer_container.style.zIndex = _this.previous_z_index;
                    _this.body_container.innerHTML = "";
                    _this.outer_container.style[_this.type] = (-_this.outer_container.offsetWidth) + 'px';
                    if (bigMode === true) {
                        _this.togglePanelElement.classList.remove("pull-for-" + _this.type + "-panel");
                        _this.togglePanelElement.classList.add("panel-button");
                    }
                }
            },

            switchPanelMode: function(element) {
                var _this = this;
                _this.bodyOptions.mode = element.dataset.mode;
                _this.previous_Filter_Options = false;
                _this.pagination.previousShow = false;
                if (!_this.bodyOptions.mode || _this.bodyOptions.mode === "") {
                    _this.body_container.innerHTML = "";
                    _this.filter_container.innerHTML = "";
                    _this.extra_toolbar_container.innerHTML = "";
                    _this.pagination_container.innerHTML = "";
                    _this.go_to_container.innerHTML = "";
                } else {
                    _this.showSpinner(_this.body_container);
                    _this.render();
                }
            },

            render: function(options) {
                var _this = this;
                if (!options) {
                    options = {};
                }
                if (_this.bodyOptions.mode === _this.MODE.CHATS || _this.bodyOptions.mode === _this.MODE.DETAIL_VIEW) {
                    event_bus.trigger('getOpenChats', function(openChats) {
                        options.openChats = openChats;
                        _this.proceed(options);
                    });
                } else {
                    _this.proceed(options);
                }
            },

            proceed: function(options) {
                var _this = this;
                _this.extraToolbar.renderExtraToolbar(_this, _this.bodyOptions.mode, function() {
                    _this.filter.renderFilter(_this, _this.bodyOptions.mode, function() {
                        _this.pagination.render(options, _this, _this.bodyOptions.mode);
                        _this.body.render(options, _this);
                    });
                });
            },

            changeMode: function(element) {
                var _this = this;
                if (_this.bodyOptions.mode === _this.MODE.DETAIL_VIEW) {
                    _this.bodyOptions.mode = _this.MODE.CHATS;
                }
                _this.switch_Panel_Body_Mode({
                    chat_part: element.dataset.chat_part,
                    newMode: element.dataset.mode_to,
                    target: element
                })
            },

            switch_Panel_Body_Mode: function(obj) {
                var _this = this;
                switch (obj.chat_part) {
                    case "filter":
                        if (obj.target) {
                            var bool_Value = obj.target.dataset.toggle === "true";
                            _this.optionsDefinition(_this, _this.bodyOptions.mode);
                            _this.currnetFilterOptions.show = bool_Value;
                            obj.target.dataset.toggle = !bool_Value;
                        }
                        break;
                    case "pagination":
                        switch (obj.newMode) {
                            case _this.MODE.PAGINATION:
                                if (obj.target) {
                                    _this.optionsDefinition(_this, _this.bodyOptions.mode);
                                    _this.currentPaginationOptions.show = obj.target.checked;
                                    _this.currentPaginationOptions.showEnablePagination = obj.target.checked;
                                    if (!obj.target.checked) {
                                        _this.currentListOptions.previousStart = 0;
                                        _this.currentListOptions.previousFinal = null;
                                        _this.currentListOptions.start = 0;
                                        _this.currentListOptions.final = null;
                                    }
                                }
                                _this.toggleShowState({
                                    key: 'show',
                                    toggle: false
                                }, _this.currentPaginationOptions, obj);
                                break;
                            case  _this.MODE.GO_TO:
                                _this.optionsDefinition(_this, _this.bodyOptions.mode);
                                if (obj.target) {
                                    var bool_Value = obj.target.dataset.toggle === "true";
                                    _this.currentGoToOptions.show = bool_Value;
                                }
                                break;
                        }
                        break;
                }
                _this.render();
            },

            togglePanel: function(forceClose) {
                var _this = this;
                _this.openOrClosePanel(_this.outer_container.clientWidth + _this.togglePanelElement.clientWidth > document.body.clientWidth, forceClose);
            },

            togglePanelWorkflow: function() {
                var _this = this;
                if (_this.panel_config) {
                    _this.togglePanel();
                } else {
                    _this.sendRequest("/configs/panel_config.json", function(err, res) {
                        if (err) {
                            console.error(err);
                            return;
                        }

                        _this.panel_config = JSON.parse(res);
                        _this.getDescriptionIcon(null, null, null, function(res) {
                            _this.description_icon = res;
                            _this.togglePanel();
                        });
                    });
                }
            },

            fillPanelToolbar: function() {
                var _this = this;
                _this.showHorizontalSpinner(_this.panel_toolbar);
                _this.panel_toolbar.innerHTML = _this['panel_' + _this.type + '_template']({
                    config: _this.panel_config,
                    icon_config: [{svg: _this.description_icon, name: 'description_icon'}],
                    triple_element_template: _this.triple_element_template,
                    button_template: _this.button_template,
                    input_template: _this.input_template,
                    label_template: _this.label_template
                });
                _this.addToolbarEventListener();
            },

            inputUserInfo: function(event) {
                var _this = this;
                if (event.target.dataset.input) {
                    if (_this.config) {
                        var param = event.target.dataset.role;
                        _this.user[param] = event.target.value;
                    }
                }
            },

            cancelChangeUserInfo: function() {
                var _this = this;
                _this.bodyOptions.mode = _this.MODE.USER_INFO_SHOW;
                _this.user = null;
                _this.render();
            },

            saveChangeUserInfo: function() {
                var _this = this;
                if (_this.user_name.value && _this.old_password.value && _this.new_password.value && _this.confirm_password.value) {
                    if (_this.old_password.value === _this.user.userPassword) {
                        if (_this.new_password.value === _this.confirm_password.value) {
                            _this.updateUserInfo(function() {
                                _this.bodyOptions.mode = _this.MODE.USER_INFO_SHOW;
                                _this.user = null;
                                _this.render();
                            })
                        } else {
                            console.error(new Error("New password and confirm password do not match"));
                            _this.new_password.value = "";
                            _this.confirm_password.value = "";
                        }
                    } else {
                        console.error(new Error("Old password is not correct"));
                        _this.old_password.value = "";
                        _this.new_password.value = "";
                        _this.confirm_password.value = "";
                    }
                } else {
                    console.error(new Error("Fill in all the fields"));
                }
            },

            updateUserInfo: function(callback) {
                var _this = this;
                users_bus.getMyInfo(null, function(err, options, userInfo){
                    userInfo.userPassword = _this.new_password.value;
                    userInfo.userName = _this.user_name.value;
                    indexeddb.addOrUpdateAll(
                        users_bus.collectionDescription,
                        null,
                        [
                            userInfo
                        ],
                        function(error) {
                            if (error) {
                                console.error(error);
                                return;
                            }
                            callback();
                        }
                    );
                });

            },

            changeUserInfo: function() {
                var _this = this;
                _this.bodyOptions.mode = _this.MODE.USER_INFO_EDIT;
                _this.render();
            },

            logout: function() {
                var _this = this;
                users_bus.setUserId(null);
                _this.bodyOptions.mode = _this.MODE.USER_INFO_SHOW;
                event_bus.trigger("chatsDestroy");
                _this.removeMainEventListeners();
                _this.removeToolbarEventListeners();
                history.pushState(null, null, 'login');
                _this.navigator.navigate();
            },

            show_more_info: function(element) {
                var _this = this, chat_id_value;
                chat_id_value = element.dataset.chatid;
                var detail_view = element.querySelector('[data-role="detail_view_container"]');
                var pointer = element.querySelector('[data-role="pointer"]');
                if (detail_view.dataset.state) {
                    _this.openChatsInfoArray.splice(_this.openChatsInfoArray.indexOf(chat_id_value), 1);
                    detail_view.classList.remove("max-height-auto");
                    pointer.classList.remove("rotate-90");
                    detail_view.style.maxHeight = '0em';
                    return;
                }

                if (element) {
                    _this.bodyOptions.mode = _this.MODE.DETAIL_VIEW;
                    _this.elementMap.DETAIL_VIEW = detail_view;
                    _this.render({
                        "detail_view": detail_view,
                        "pointer": pointer,
                        "chat_id_value": chat_id_value
                    });
                }
            },

            rotatePointer: function(options) {
                var _this = this;
                options.detail_view.dataset.state = "expanded";
                options.detail_view.classList.add("max-height-auto");
                options.detail_view.style.maxHeight = '15em';
                options.pointer.classList.add("rotate-90");
                _this.openChatsInfoArray.push(options.chat_id_value);
            },

            transitionEnd: function(event) {
                var action = event.target.dataset.role;
                if (action === 'detail_view_container') {
                    if (event.target.style.maxHeight === '0em') {
                        delete event.target.dataset.state;
                        event.target.innerHTML = "";
                    }
                }
            },

            resizePanel: function() {
                var _this = this;
                if (_this.outer_container.style[_this.type] === '0px') {
                    _this.inner_container.style.maxWidth = _this.calcMaxWidth();
                    if (_this.outer_container.clientWidth + _this.togglePanelElement.clientWidth > document.body.clientWidth) {
                        _this.togglePanelElement.classList.add("pull-for-" + _this.type + "-panel");
                        _this.togglePanelElement.classList.remove("panel-button");
                    }
                    else {
                        _this.togglePanelElement.classList.remove("pull-for-" + _this.type + "-panel");
                        _this.togglePanelElement.classList.add("panel-button");
                    }
                }
            },

            toggleListOptions: function(chatsLength) {
              var _this = this;
                if (_this.type === "left" ){
                    _this.chats_ListOptions.final = chatsLength;
                }
            },

            calcMaxWidth: function() {
                return document.body.offsetWidth + 'px';
            },

            requestFriendByUserId: function() {
                var _this = this;
                var user_id_input = _this.body_container.querySelector('[data-role="user_id_input"]');

                if (user_id_input && user_id_input.value) {
                    websocket.sendMessage({
                        type: "user_add",
                        userId: users_bus.getUserId(),
                        deviceId: event_bus.getDeviceId(),
                        tempDeviceId: event_bus.getTempDeviceId(),
                        request_body: {
                            userId: user_id_input.value,
                            message: ""
                        }
                    });
                }
            },

            readyForFriendRequest: function(element) {
                websocket.sendMessage({
                    type: "user_toggle_ready",
                    userId: users_bus.getUserId(),
                    deviceId: event_bus.getDeviceId(),
                    tempDeviceId: event_bus.getTempDeviceId(),
                    ready_state: element.checked
                });
            }

        };
        extend(panel, throw_event_core);
        extend(panel, ajax_core);
        extend(panel, template_core);
        extend(panel, render_layout_core);
        extend(panel, extend_core);
        extend(panel, switcher_core);
        extend(panel, overlay_core);
        extend(panel, dom_core);

        panel.prototype.panel_left_template = panel.prototype.template(panel_left_template);
        panel.prototype.panel_right_template = panel.prototype.template(panel_right_template);
        panel.prototype.triple_element_template = panel.prototype.template(triple_element_template);
        panel.prototype.button_template = panel.prototype.template(button_template);
        panel.prototype.label_template = panel.prototype.template(label_template);
        panel.prototype.input_template = panel.prototype.template(input_template);
        panel.prototype.textarea_template = panel.prototype.template(textarea_template);

        panel.prototype.templateMap = {};
        panel.prototype.configHandlerMap = {};
        panel.prototype.configHandlerContextMap = {};
        panel.prototype.dataHandlerMap = {};
        panel.prototype.dataMap = {};

        return panel;
    });
