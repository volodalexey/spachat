define('panel', [
        'throw_event_core',
        'ajax_core',
        'template_core',
        'render_layout_core',
        'extend_core',

        'pagination',
        'body',

        'indexeddb',

        'text!../templates/panel_left_template.ejs',
        'text!../templates/panel_right_template.ejs',
        'text!../templates/element/triple_element_template.ejs',
        'text!../templates/element/button_template.ejs',
        'text!../templates/element/label_template.ejs',
        'text!../templates/element/input_template.ejs',
        'text!../templates/element/textarea_template.ejs',

        'text!../templates/filter_my_chats_template.ejs'

    ],
    function(throw_event_core,
             ajax_core,
             template_core,
             render_layout_core,
             extend_core,
             Pagination,
             Body,
             indexeddb,
             panel_left_template,
             panel_right_template,
             triple_element_template,
             button_template,
             label_template,
             input_template,
             textarea_template,
             filter_my_chats_template) {

        var defaultOptions = {
            goToChatsOptions: {
                show: false,
                rteChoicePage: true,
                mode_change: "rte"
            },
            paginationChatsOptions: {
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
            informationOptions: {
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

            //this.bindToolbarContext();
            this.bindMainContexts();

            this.type = description.type;
            this.panel_platform = description.panel_platform;
            this.outer_container = description.outer_container;
            this.inner_container = description.inner_container;
            this.body_mode = description.body_mode;
            this.filter_container = description.filter_container;

            this.pagination = new Pagination();
            this.body = new Body();
            this.bodyOptions.mode = description.body_mode;
        };

        panel.prototype = {

            panelArray: [],

            openChatsArray: [],

            MODE: {
                CREATE_CHAT: 'CREATE_CHAT',
                JOIN_CHAT: 'JOIN_CHAT',
                CHATS: 'CHATS',

                USER_INFO_EDIT: 'USER_INFO_EDIT',
                USER_INFO_SHOW: 'USER_INFO_SHOW',
                DETAIL_VIEW: 'DETAIL_VIEW',

                FILTER_CHATS: 'FILTER_CHATS',
                EXTRA_TOOLBAR_CHATS: 'EXTRA_TOOLBAR_CHATS',
                FILTER_USERS: 'FILTER_USERS',
                EXTRA_TOOLBAR_USERS: ' EXTRA_TOOLBAR_USERS',

                FILTER: 'FILTER'
            },

            z_index: 80,

            render: function(options) {
                if (!options || !options.navigator || !options.panel_platform) {
                    console.error(new Error('Invalid input options for render'));
                    return;
                }
                var _this = this;

                _this.navigator = options.navigator;

                _this.cashElements();
                _this.elementMap = {
                    "USER_INFO_EDIT": _this.panel_body,
                    "USER_INFO_SHOW": _this.panel_body,
                    "CREATE_CHAT": _this.panel_body,
                    "JOIN_CHAT": _this.panel_body,
                    "CHATS": _this.panel_body
                };
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
                _this.panel_body = _this.outer_container.querySelector('[data-role="panel_body"]');
                _this.panel_toolbar = _this.outer_container.querySelector('[data-role="panel_toolbar"]');
            },

            cashBodyElement: function() {
                var _this = this;
                if (_this.bodyOptions.mode === _this.MODE.USER_INFO_EDIT) {
                    _this.user_name = _this.panel_body.querySelector('[data-main="user_name_input"]');
                    _this.old_password = _this.panel_body.querySelector('[data-role="passwordOld"]');
                    _this.new_password = _this.panel_body.querySelector('[data-role="passwordNew"]');
                    _this.confirm_password = _this.panel_body.querySelector('[data-role="passwordConfirm"]');
                }
            },

            bindMainContexts: function() {
                var _this = this;
                _this.bindedTogglePanelWorkflow = _this.togglePanelWorkflow.bind(_this);
                _this.bindedInutUserInfo = _this.inputUserInfo.bind(_this);
                _this.bindedDataActionRouter = _this.dataActionRouter.bind(_this);
                _this.bindedThrowEventRouter = _this.throwEventRouter.bind(_this);
                _this.bindedTransitionEnd = _this.transitionEnd.bind(_this);
            },

            //bindToolbarContext: function() {
            //    var _this = this;
            //    _this.bindedDataActionRouter = _this.dataActionRouter.bind(_this);
            //},

            addMainEventListener: function() {
                var _this = this;
                _this.removeMainEventListeners();
                _this.addRemoveListener('add', _this.togglePanelElement, 'click', _this.bindedTogglePanelWorkflow, false);
                _this.addRemoveListener('add', _this.panel_body, 'input', _this.bindedInutUserInfo, false);
                _this.addRemoveListener('add', _this.panel_body, 'click', _this.bindedDataActionRouter, false);
                _this.addRemoveListener('add', _this.panel_body, 'click', _this.bindedThrowEventRouter, false);
                _this.addRemoveListener('add', _this.panel_body, 'transitionend', _this.bindedTransitionEnd, false);
            },

            removeMainEventListeners: function() {
                var _this = this;
                _this.addRemoveListener('remove', _this.togglePanelElement, 'click', _this.bindedTogglePanelWorkflow, false);
                _this.addRemoveListener('remove', _this.panel_body, 'input', _this.bindedInutUserInfo, false);
                _this.addRemoveListener('remove', _this.panel_body, 'click', _this.bindedDataActionRouter, false);
                _this.addRemoveListener('remove', _this.panel_body, 'click', _this.bindedThrowEventRouter, false);
                _this.addRemoveListener('remove', _this.panel_body, 'transitionend', _this.bindedTransitionEnd, false);
            },

            addToolbarEventListener: function() {
                var _this = this;
                _this.addRemoveListener('add', _this.panel_toolbar, 'click', _this.bindedDataActionRouter, false);
            },

            removeToolbarEventListeners: function() {
                var _this = this;
                _this.addRemoveListener('remove', _this.panel_toolbar, 'click', _this.bindedDataActionRouter, false);
            },

            openOrClosePanel: function(bigMode, forceClose) {
                var _this = this;
                if (!forceClose && _this.outer_container.style[_this.type] !== '0px') {
                    _this.previous_z_index = _this.outer_container.style.zIndex;
                    _this.outer_container.style.zIndex = ++panel.prototype.z_index;
                    _this.outer_container.style[_this.type] = "0px";
                    _this.fillPanelToolbar();
                    _this.renderBodyPanel();
                    if (bigMode === true) {
                        _this.resizePanel();
                    }
                } else {
                    panel.prototype.z_index--;
                    if (_this.bodyOptions.mode === _this.MODE.DETAIL_VIEW) {
                        _this.bodyOptions.mode = _this.MODE.CHATS;
                    }
                    _this.outer_container.style.zIndex = _this.previous_z_index;
                    _this.outer_container.style[_this.type] = (-_this.outer_container.offsetWidth) + 'px';
                    if (bigMode === true) {
                        _this.togglePanelElement.classList.remove("pull-for-" + _this.type + "-panel");
                        _this.togglePanelElement.classList.add("panel-button");
                    }
                    _this.panel_body.innerHTML = "";
                }
            },

            renderBodyPanel: function(options) {
                var _this = this;
                _this.body.render(options, this);
                _this.renderExtraToolbar();
                _this.renderFilter();
                //_this.pagination.render(options, this, _this.bodyOptions.mode);
            },

            renderExtraToolbar: function() {

            },

            renderFilter: function() {
                var _this = this;
               /* if (_this.filterOptions.show) {
                   /!* _this.previous_mode = _this.body_mode;
                    _this.body_mode = _this.MODE.FILTER_CHATS;
                    var data = {
                        "perPageValue": _this.paginationChatsOptions.perPageValue,
                        "showEnablePagination": _this.paginationChatsOptions.showEnablePagination,
                        "rtePerPage": _this.paginationChatsOptions.rtePerPage,
                        "mode_change": _this.paginationChatsOptions.mode_change
                    };
                    _this.renderLayout(data, function() {
                        _this.body_mode = _this.previous_mode;
                    });*!/
                } else {
                    _this.filter_container.innerHTML = "";
                }*/
            },

            switchPanelMode: function(event) {
                var _this = this;
                _this.bodyOptions.mode = event.target.getAttribute("data-mode");
                _this.filterOptions.show = false;
                _this.filter_container.innerHTML = "";
                //_this.renderLayout(null, null);
                _this.renderBodyPanel();
            },

            change_Panel_Body_Mode: function(event) {
                var _this = this;
                _this.switch_Panel_Body_Mode({
                    panel_body_part: event.target.dataset.panel_body_part,
                    newMode: event.target.dataset.mode_to,
                    target: event.target
                })
            },

            switch_Panel_Body_Mode: function(obj) {
                var _this = this;
                switch (obj.panel_body_part) {
                    case _this.MODE.FILTER:
                        if (obj.target) {
                            var bool_Value = obj.target.dataset.toggle === "true";
                            _this.filterOptions.show = bool_Value;
                            obj.target.dataset.toggle = !bool_Value;
                        }
                        break;
                }
                _this.renderBodyPanel();
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
                        _this.togglePanel();
                    });
                }
            },

            fillPanelToolbar: function() {
                var _this = this;
                _this.panel_toolbar.innerHTML = _this['panel_' + _this.type + '_template']({
                    config: _this.panel_config,
                    triple_element_template: _this.triple_element_template,
                    button_template: _this.button_template,
                    input_template: _this.input_template,
                    label_template: _this.label_template
                });
                _this.addToolbarEventListener();
            },

            inputUserInfo: function(event) {
                var _this = this;
                if (_this.config) {
                    var param = event.target.getAttribute("data-role");
                    _this.user[param] = event.target.value;
                }
            },

            cancelChangeUserInfo: function() {
                var _this = this;
                _this.bodyOptions.mode = _this.MODE.USER_INFO_SHOW;
                _this.user = null;
                _this.renderBodyPanel();
            },

            saveChangeUserInfo: function() {
                var _this = this;
                if (_this.user_name.value && _this.old_password.value && _this.new_password.value && _this.confirm_password.value) {
                    if (_this.old_password.value === _this.user.userPassword) {
                        if (_this.new_password.value === _this.confirm_password.value) {
                            _this.updateUserInfo(function() {
                                _this.bodyOptions.mode = _this.MODE.USER_INFO_SHOW;
                                _this.user = null;
                                _this.renderBodyPanel();
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
                var account = {
                    userId: _this.navigator.userId,
                    userPassword: _this.new_password.value,
                    userName: _this.user_name.value
                };
                indexeddb.addOrUpdateAll(
                    _this.collectionDescription,
                    null,
                    [
                        account
                    ],
                    function(error) {
                        if (error) {
                            console.error(error);
                            return;
                        }
                        callback();
                    }
                );
            },

            changeUserInfo: function() {
                var _this = this;
                _this.bodyOptions.mode = _this.MODE.USER_INFO_EDIT;
                _this.renderBodyPanel();
            },

            logout: function() {
                var _this = this;
                _this.navigator.userId = null;
                _this.bodyOptions.mode = _this.MODE.USER_INFO_SHOW;
                _this.removeMainEventListeners();
                _this.removeToolbarEventListeners();
                history.pushState(null, null, 'login');
                _this.navigator.navigate();
            },

            show_more_info: function(event) {
                var _this = this, chat_id_value, element;
                element = event.target;
                chat_id_value = event.target.getAttribute("value");
                var detail_view = element.querySelector('[data-role="detail_view_container"]');
                var pointer = element.querySelector('[data-role="pointer"]');
                if (detail_view.dataset.state) {
                    _this.openChatsArray.splice(_this.openChatsArray.indexOf(chat_id_value), 1);
                    detail_view.classList.remove("max-height-auto");
                    pointer.classList.remove("rotate-90");
                    detail_view.style.maxHeight = '0em';
                    return;
                }

                if (element) {
                    _this.bodyOptions.mode = _this.MODE.DETAIL_VIEW;
                    _this.elementMap.DETAIL_VIEW = detail_view;
                    _this.renderBodyPanel({
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
                _this.openChatsArray.push(options.chat_id_value);
            },

            transitionEnd: function(event) {
                var action = event.target.getAttribute('data-role');
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
                    if (_this.outer_container.clientWidth + _this.togglePanelElement.clientWidth > document.body.clientWidth) {
                        _this.togglePanelElement.classList.add("pull-for-" + _this.type + "-panel");
                        _this.togglePanelElement.classList.remove("panel-button");
                    }
                    else {
                        _this.togglePanelElement.classList.remove("pull-for-" + _this.type + "-panel");
                        _this.togglePanelElement.classList.add("panel-button");
                    }
                }
            }

        };
        extend(panel, throw_event_core);
        extend(panel, ajax_core);
        extend(panel, template_core);
        extend(panel, render_layout_core);
        extend(panel, extend_core);

        panel.prototype.panel_left_template = panel.prototype.template(panel_left_template);
        panel.prototype.panel_right_template = panel.prototype.template(panel_right_template);
        panel.prototype.triple_element_template = panel.prototype.template(triple_element_template);
        panel.prototype.button_template = panel.prototype.template(button_template);
        panel.prototype.label_template = panel.prototype.template(label_template);
        panel.prototype.input_template = panel.prototype.template(input_template);
        panel.prototype.textarea_template = panel.prototype.template(textarea_template);

        panel.prototype.filter_my_chats_template = panel.prototype.template(filter_my_chats_template);

        return panel;
    });
