define('panel', [
        'throw_event_core',
        'ajax_core',
        'template_core',
        'render_layout_core',
        'extend_core',
        'switcher_core',
        'overlay_core',
        'dom_core',
        'disable_display_core',
        //
        'chats_bus',
        'users_bus',
        'event_bus',
        'extra_toolbar',
        'filter',
        'pagination',
        'body',
        'indexeddb',
        'websocket',
        'webrtc',
        //
        'text!../templates/panel_left_template.ejs',
        'text!../templates/panel_right_template.ejs',
        'text!../templates/element/triple_element_template.ejs',
        'text!../templates/element/location_wrapper_template.ejs',
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
             disable_display_core,
             //
             chats_bus,
             users_bus,
             event_bus,
             Extra_toolbar,
             Filter,
             Pagination,
             Body,
             indexeddb,
             websocket,
             webrtc,
             //
             panel_left_template,
             panel_right_template,
             triple_element_template,
             location_wrapper_template,
             button_template,
             label_template,
             input_template,
             textarea_template) {

        var defaultOptions = {

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

            joinUser_ExtraToolbarOptions: {
                show: false
            },
            joinUser_FilterOptions: {
                show: false
            },
            joinUser_PaginationOptions: {
                show: false
            },
            joinUser_GoToOptions: {
                show: false,
                rteChoicePage: true,
                mode_change: "rte"
            },
            joinUser_ListOptions: {
                readyForRequest: false
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

            createBlog_ExtraToolbarOptions: {
                show: false
            },
            createBlog_FilterOptions: {
                show: false
            },
            createBlog_PaginationOptions: {
                show: false
            },
            createBlog_GoToOptions: {
                show: false,
                rteChoicePage: true,
                mode_change: "rte"
            },

            joinBlog_ExtraToolbarOptions: {
                show: false
            },
            joinBlog_FilterOptions: {
                show: false
            },
            joinBlog_PaginationOptions: {
                show: false
            },
            joinBlog_GoToOptions: {
                show: false,
                rteChoicePage: true,
                mode_change: "rte"
            },

            blogs_ExtraToolbarOptions: {
                show: false
            },
            blogs_FilterOptions: {
                show: false
            },
            blogs_PaginationOptions: {
                show: false
            },
            blogs_GoToOptions: {
                show: false,
                rteChoicePage: true,
                mode_change: "rte"
            },
            blogs_ListOptions: {
                text: "blogs",
                start: 0,
                last: null,
                previousStart: 0,
                previousFinal: 0,
                restore: false,
                data_download: false
            },

            connections_ExtraToolbarOptions: {
                show: false
            },
            connections_FilterOptions: {
                show: false
            },
            connections_PaginationOptions: {
                show: false
            },
            connections_GoToOptions: {
                show: false,
                rteChoicePage: true,
                mode_change: "rte"
            },
            connections_ListOptions: {
                text: "connections",
                start: 0,
                last: null,
                previousStart: 0,
                previousFinal: 0,
                restore: false,
                data_download: false
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
            bodyOptions: {
                show: true,
                mode: null
            }
        };

        var panel = function(description) {
            if (description.options) {
                this.extend(this, description.options);
                this.body_mode = description.options.bodyOptions.mode;
            } else {
                this.extend(this, defaultOptions);
                this.body_mode = description.body_mode;
                this.bodyOptions.mode = description.body_mode;
            }

            this.UIElements = {};
            this.bindMainContexts();

            this.type = description.type;
            this.outer_container = description.outer_container;
            this.inner_container = description.inner_container;
            this.filter_container = description.filter_container;
            this.go_to_container = description.go_to_container;
            this.panel_toolbar = description.panel_toolbar;
            this.pagination_container = description.pagination_container;
            this.extra_toolbar_container = description.extra_toolbar_container;

            this.pagination = new Pagination();
            this.body = new Body();

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

                CONNECTIONS: 'CONNECTIONS',

                CREATE_BLOG: 'CREATE_BLOG',
                JOIN_BLOG: 'JOIN_BLOG',
                BLOGS: 'BLOGS',

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
                _this.optionsDefinition(_this, _this.bodyOptions.mode);
                _this.navigator = options.navigator;
                _this.cashElements();
                _this.elementMap = {};
                _this.addMainEventListener();
                _this.outer_container.classList.remove("hide");
                _this.outer_container.style.maxWidth = window.innerWidth + 'px';
                _this.outer_container.style[_this.type] = (-_this.outer_container.offsetWidth) + 'px';
                _this.outer_container.style.zIndex = panel.prototype.z_index;
                _this.togglePanelElement_clientWidth = _this.togglePanelElement.clientWidth;
            },

            dispose: function() {
                var _this = this;
                if (!_this.togglePanelElement) {
                    return;
                }
                _this.UIElements = {};
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

            cashToolbarElement: function() {
                var _this = this;
                _this.btns_toolbar = Array.prototype.slice.call(_this.panel_toolbar.querySelectorAll('[data-role="btnToolbar"]'));
            },

            unCashElements: function() {
                var _this = this;
                _this.btn_Filter = null;
                _this.user_name = null;
                _this.old_password = null;
                _this.new_password = null;
                _this.confirm_password = null;
                _this.btns_toolbar = null;
                _this.togglePanelElement = null;
                _this.body_container = null;
            },

            bindMainContexts: function() {
                var _this = this;
                // bind all panel handlers because each panel has the same handlers
                _this.bindedTogglePanelWorkflow = _this.togglePanelWorkflow.bind(_this);
                _this.bindedInputUserInfo = _this.inputUserInfo.bind(_this);
                _this.bindedDataActionRouter = _this.dataActionRouter.bind(_this);
                _this.bindedThrowEventRouter = _this.throwEventRouter.bind(_this);
                _this.bindedTransitionEnd = _this.transitionEnd.bind(_this);
                _this.bindedOnChatDestroyed = _this.onChatDestroyed.bind(_this);
                _this.bindedToggleListOptions = _this.toggleListOptions.bind(_this);
                _this.bindedCloseChat = _this.closeChat.bind(_this);
                _this.bindedOnPanelMessageRouter = _this.onPanelMessageRouter.bind(_this);
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
                event_bus.on('chatDestroyed', _this.bindedOnChatDestroyed);
                event_bus.on('AddedNewChat', _this.bindedToggleListOptions);
                websocket.on('message', _this.bindedOnPanelMessageRouter);
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
                websocket.off('message', _this.bindedOnPanelMessageRouter);
            },

            throwRouter: function(action, event) {
                if (this[action]) {
                    this[action](event);
                }
            },

            onChatDestroyed: function(chat_id) {
                var _this = this;
                if (_this.type === "left" &&
                    (_this.bodyOptions.mode === this.MODE.CHATS || _this.bodyOptions.mode === this.MODE.DETAIL_VIEW)) {
                    var chat_info_container = _this.body_container.querySelector('[data-chat_id="' + chat_id + '"]');
                    if (chat_info_container) {
                        var detail_view = chat_info_container.querySelector('[data-role="detail_view_container"]');
                        if (detail_view.dataset.state) {
                            _this.bodyOptions.mode = _this.MODE.DETAIL_VIEW;
                            var pointer = chat_info_container.querySelector('[data-role="pointer"]');
                            _this.render({
                                "detail_view": detail_view,
                                "pointer": pointer,
                                "chat_id_value": chat_id
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
                if (element.dataset.mode_to === _this.MODE.USER_INFO_SHOW && _this.previous_UserInfo_Mode) {
                    _this.bodyOptions.mode = _this.previous_UserInfo_Mode;
                } else {
                    _this.bodyOptions.mode = element.dataset.mode_to;
                }
                _this.previous_Filter_Options = false;
                _this.pagination.previousShow = false;
                _this.toggleActiveButton(_this.btns_toolbar, element.dataset.mode_to);
                if (!_this.bodyOptions.mode || _this.bodyOptions.mode === "") {
                    _this.body_container.innerHTML = "";
                    _this.filter_container.innerHTML = "";
                    _this.extra_toolbar_container.innerHTML = "";
                    _this.pagination_container.innerHTML = "";
                    _this.go_to_container.innerHTML = "";
                } else {
                    if (_this.previous_BodyMode && _this.previous_BodyMode  !== _this.bodyOptions.mode) {
                        _this.showSpinner(_this.body_container);
                    }
                    _this.previous_BodyMode = _this.bodyOptions.mode;
                    _this.render();
                }
                if (_this.bodyOptions.mode === _this.MODE.USER_INFO_SHOW) {
                    _this.previous_UserInfo_Mode = _this.MODE.USER_INFO_SHOW;
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
                _this.resizePanel();
            },

            proceed: function(options) {
                var _this = this;
                _this.extraToolbar.renderExtraToolbar(_this, _this.bodyOptions.mode, function() {
                    _this.filter.renderFilter(_this, _this.bodyOptions.mode, function() {
                        _this.pagination.render(options, _this, _this.bodyOptions.mode);
                        _this.body.render(options, _this, function() {
                            _this.resizePanel();
                        });
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
                    _this.get_JSON_res("/configs/panel_" + _this.type + "_toolbar_config.json", function(err, res) {
                        if (err) {
                            console.error(err);
                            return;
                        }

                        _this.panel_config = res;
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

                _this.loadToolbarIcons(function(icon_config) {
                    _this.panel_config = _this.prepareConfig(_this.panel_config);
                    _this.panel_toolbar.innerHTML = _this['panel_' + _this.type + '_template']({
                        config: _this.panel_config,
                        icon_config: icon_config,
                        triple_element_template: _this.triple_element_template,
                        location_wrapper_template: _this.location_wrapper_template,
                        button_template: _this.button_template,
                        input_template: _this.input_template,
                        label_template: _this.label_template
                    });
                    _this.addToolbarEventListener();
                    _this.cashToolbarElement();
                    _this.toggleActiveButton(_this.btns_toolbar, _this.bodyOptions.mode);
                    _this.resizePanel();
                });
            },

            loadToolbarIcons: function(callback) {
                var _this = this, iconsArray = [], icon_config = [];
                _this.panel_config.forEach(function(_config) {
                    if (_config.icon && _config.icon !== "") {
                        iconsArray.push(
                            {icon: '/templates/icon/' + _config.icon + '.html', name: _config.icon}
                        );
                    }
                });
                if (iconsArray.length) {
                    _this.async_eachSeries(iconsArray,
                        function(obj, _callback) {
                            _this.getRequest(obj.icon, function(err, res) {
                                if (err) {
                                    _callback(err);
                                } else {
                                    obj.svg = res;
                                    _callback();
                                }
                            })
                        },
                        function(allError) {
                            if (allError) {
                                console.error(allError);
                            } else {
                                icon_config = iconsArray;
                                icon_config.push({svg: _this.description_icon, name: 'description_icon'});
                                callback(icon_config);
                            }
                        }
                    );
                }
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
                _this.previous_UserInfo_Mode = _this.MODE.USER_INFO_SHOW;
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
                                _this.previous_UserInfo_Mode = _this.MODE.USER_INFO_SHOW;
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
                _this.previous_UserInfo_Mode = _this.MODE.USER_INFO_EDIT;
                _this.render();
            },

            logout: function() {
                var _this = this;
                //_this.bodyOptions.mode = _this.MODE.USER_INFO_SHOW;
                //_this.previous_UserInfo_Mode = _this.bodyOptions.mode;
                event_bus.trigger("chatsDestroy");
                _this.removeMainEventListeners();
                _this.removeToolbarEventListeners();
                websocket.dispose();
                webrtc.destroy();
                history.pushState(null, null, 'login');
                _this.navigator.navigate();
            },

            show_more_info: function(element) {
                var _this = this, chat_id_value;
                chat_id_value = element.dataset.chat_id;
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

            closeChat: function(element) {
                var _this = this, saveStates;
                if (_this.type === "left" ){
                    var parentElement = _this.traverseUpToDataset(element, 'role', 'chatWrapper');
                    var chat_id = parentElement.dataset.chat_id;

                    if (element.dataset.role === "closeChat") {
                        saveStates = false;
                    }
                    if (element.dataset.role === "saveStatesChats") {
                        saveStates = true;
                    }
                    event_bus.trigger('toCloseChat', chat_id, saveStates);
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
                var _this = this;
                var action = event.target.dataset.role;
                if (action === 'detail_view_container') {
                    if (event.target.style.maxHeight === '0em') {
                        delete event.target.dataset.state;
                        event.target.innerHTML = "";
                        _this.resizePanel();
                    }
                }
            },

            resizePanel: function() {
                var _this = this;
                if (_this.outer_container.style[_this.type] === '0px') {
                    _this.inner_container.style.maxWidth = _this.calcMaxWidth();
                    if (_this.outer_container.clientWidth + _this.togglePanelElement_clientWidth > document.body.clientWidth) {
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
                var user_message_input = _this.body_container.querySelector('[data-role="user_message_input"]');
                var requestButton = _this.body_container.querySelector('[data-action="requestFriendByUserId"]');

                if (requestButton && user_id_input && user_id_input.value && user_message_input && user_message_input.value) {
                    _this.disableButton('requestFriendByUserId', requestButton);
                    users_bus.getUserDescription({}, function(error, user_description) {
                        if (error) {
                            _this.enableButton('requestFriendByUserId');
                            console.error(error);
                            return;
                        }

                        websocket.sendMessage({
                            type: "user_add",
                            from_user_id: users_bus.getUserId(),
                            from_user_description: user_description,
                            to_user_id: user_id_input.value,
                            request_body: {
                                message: user_message_input.value
                            }
                        });
                    });
                }
            },

            readyForFriendRequest: function(element) {
                var _this = this;
                _this.joinUser_ListOptions.readyForRequest = element.checked;
                _this.disableButton('readyForFriendRequest', element);

                websocket.sendMessage({
                    type: "user_toggle_ready",
                    from_user_id: users_bus.getUserId(),
                    ready_state: element.checked
                });
            },

            /**
             * handle message from web-socket (if it is connected with chats some how)
             */
            onPanelMessageRouter: function(messageData) {
                var _this = this;
                if (_this.type !== "left" ){
                    return;
                }

                switch (messageData.type) {
                    case 'user_add':
                        // TODO check my allow user friendship status
                        if (_this.bodyOptions.mode === _this.MODE.JOIN_USER) {
                            _this.userAddApproved(messageData);
                        }
                        break;
                    case 'user_add_sent':
                        // TODO check my allow user friendship status
                        if (_this.bodyOptions.mode === _this.MODE.JOIN_USER) {
                            _this.enableButton('requestFriendByUserId');
                            console.log('Friendship request was sent');
                        }
                        break;
                    case 'device_toggled_ready':
                        _this.enableButton('readyForFriendRequest');
                        event_bus.set_ws_device_id(messageData.from_ws_device_id);
                        break;
                }
            },

            addNewUserToIndexedDB: function(user_description, callback) {
                indexeddb.addOrUpdateAll(
                    users_bus.collectionDescription,
                    null,
                    [
                        user_description
                    ],
                    function(error) {
                        if (error) {
                            callback(error);
                            return;
                        }

                        callback(null, user_description);
                    }
                );
            },

            addUserAndConnect: function(messageData) {
                users_bus.putUserIdAndSave(messageData.from_user_description.user_id, function(err) {
                    if (err) {
                        console.error(err);
                        return;
                    }

                    if (messageData.user_wscs_descrs) {
                        webrtc.handleConnectedDevices(messageData.user_wscs_descrs);
                    }
                });
            },

            userAddApproved: function(messageData) {
                var _this = this;
                event_bus.set_ws_device_id(messageData.target_ws_device_id);

                indexeddb.getByKeyPath(
                    users_bus.collectionDescription,
                    messageData.from_user_id,
                    function(getError, user_description) {
                        if (getError) {
                            console.error(getError);
                            return;
                        }

                        if (!user_description && confirm(messageData.request_body.message)) {
                            _this.addNewUserToIndexedDB(messageData.from_user_description, function(error, user_description) {
                                if (error) {
                                    console.error(error);
                                    return;
                                }

                                _this.addUserAndConnect(messageData);
                            });
                        } else if (user_description) {
                            _this.addUserAndConnect(messageData);
                        }
                    }
                );
            },

            toPanelDescription: function() {
                var _this = this, description = {};
                if (_this.bodyOptions.mode === _this.MODE.DETAIL_VIEW) {
                    _this.bodyOptions.mode = _this.MODE.CHATS;
                }
                return description = {
                    chats_GoToOptions: _this.chats_GoToOptions,
                    chats_PaginationOptions: _this.chats_PaginationOptions,
                    chats_ExtraToolbarOptions: _this.chats_ExtraToolbarOptions,
                    chats_FilterOptions: _this.chats_FilterOptions,
                    chats_ListOptions: _this.chats_ListOptions,
                    users_ExtraToolbarOptions: _this.users_ExtraToolbarOptions,
                    users_FilterOptions: _this.users_FilterOptions,
                    users_GoToOptions: _this.users_GoToOptions,
                    users_PaginationOptions: _this.users_PaginationOptions,
                    users_ListOptions: _this.users_ListOptions,
                    joinUser_ExtraToolbarOptions: _this.joinUser_ExtraToolbarOptions,
                    joinUser_FilterOptions: _this.joinUser_FilterOptions,
                    joinUser_PaginationOptions: _this.joinUser_PaginationOptions,
                    joinUser_GoToOptions: _this.joinUser_GoToOptions,
                    createChat_ExtraToolbarOptions: _this.createChat_ExtraToolbarOptions,
                    createChat_FilterOptions: _this.createChat_FilterOptions,
                    createChat_PaginationOptions: _this.createChat_PaginationOptions,
                    createChat_GoToOptions: _this.createChat_GoToOptions,
                    joinChat_ExtraToolbarOptions: _this.joinChat_ExtraToolbarOptions,
                    joinChat_FilterOptions: _this.joinChat_FilterOptions,
                    joinChat_PaginationOptions: _this.joinChat_PaginationOptions,
                    joinChat_GoToOptions: _this.joinChat_GoToOptions,
                    createBlog_ExtraToolbarOptions: _this.createBlog_ExtraToolbarOptions,
                    createBlog_FilterOptions: _this.createBlog_FilterOptions,
                    createBlog_PaginationOptions: _this.createBlog_PaginationOptions,
                    createBlog_GoToOptions: _this.createBlog_GoToOptions,
                    joinBlog_ExtraToolbarOptions: _this.joinBlog_ExtraToolbarOptions,
                    joinBlog_FilterOptions: _this.joinBlog_FilterOptions,
                    joinBlog_PaginationOptions: _this.joinBlog_PaginationOptions,
                    joinBlog_GoToOptions: _this.joinBlog_GoToOptions,
                    blogs_ExtraToolbarOptions: _this.blogs_ExtraToolbarOptions,
                    blogs_FilterOptions: _this.blogs_FilterOptions,
                    blogs_PaginationOptions: _this.blogs_PaginationOptions,
                    blogs_GoToOptions: _this.blogs_GoToOptions,
                    blogs_ListOptions: _this.blogs_ListOptions,
                    connections_ExtraToolbarOptions: _this.connections_ExtraToolbarOptions,
                    connections_FilterOptions: _this.connections_FilterOptions,
                    connections_PaginationOptions: _this.connections_PaginationOptions,
                    connections_GoToOptions: _this.connections_GoToOptions,
                    connections_ListOptions: _this.connections_ListOptions,
                    userInfoEdit_ExtraToolbarOptions: _this.userInfoEdit_ExtraToolbarOptions,
                    userInfoEdit_FilterOptions: _this.userInfoEdit_FilterOptions,
                    userInfoEdit_PaginationOptions: _this.userInfoEdit_PaginationOptions,
                    userInfoEdit_GoToOptions: _this.userInfoEdit_GoToOptions,
                    userInfoShow_ExtraToolbarOptions: _this.userInfoShow_ExtraToolbarOptions,
                    userInfoShow_FilterOptions: _this.userInfoShow_FilterOptions,
                    userInfoShow_PaginationOptions: _this.userInfoShow_PaginationOptions,
                    userInfoShow_GoToOptions: _this.userInfoShow_GoToOptions,
                    filterOptions: _this.filterOptions,
                    bodyOptions: _this.bodyOptions,
                    collectionDescription: _this.collectionDescription,
                    previous_UserInfo_Mode: _this.previous_UserInfo_Mode,
                    joinUser_ListOptions: _this.joinUser_ListOptions
            };
            }

        };
        extend_core.prototype.inherit(panel, throw_event_core);
        extend_core.prototype.inherit(panel, ajax_core);
        extend_core.prototype.inherit(panel, template_core);
        extend_core.prototype.inherit(panel, render_layout_core);
        extend_core.prototype.inherit(panel, extend_core);
        extend_core.prototype.inherit(panel, switcher_core);
        extend_core.prototype.inherit(panel, overlay_core);
        extend_core.prototype.inherit(panel, dom_core);
        extend_core.prototype.inherit(panel, disable_display_core);

        panel.prototype.panel_left_template = panel.prototype.template(panel_left_template);
        panel.prototype.panel_right_template = panel.prototype.template(panel_right_template);
        panel.prototype.triple_element_template = panel.prototype.template(triple_element_template);
        panel.prototype.location_wrapper_template = panel.prototype.template(location_wrapper_template);
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
