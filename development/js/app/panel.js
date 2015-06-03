define('panel', [
        'event_core',
        'ajax_core',
        'template_core',

        'indexeddb',

        'text!../html/panel_left_template.html',
        'text!../html/panel_right_template.html',
        'text!../html/user_info_template.html',
        'text!../html/chat_info_template.html',
        'text!../html/element/triple_element_template.html',
        'text!../html/element/button_template.html',
        'text!../html/element/label_template.html',
        'text!../html/element/input_template.html',
        'text!../html/element/textarea_template.html'

    ],
    function(event_core,
             ajax_core,
             template_core,
             indexeddb,
             panel_left_template,
             panel_right_template,
             user_info_template,
             chat_info_template,
             triple_element_template,
             button_template,
             label_template,
             input_template,
             textarea_template) {

        var panel = function(description) {
            this.bindToolbarContext();
            this.bindMainContexts();
            //this.bindContentContexts();

            this.type = description.type;
            this.panel_platform = description.panel_platform;
            this.outer_container = description.outer_container;
            this.inner_container = description.inner_container;
            this.panel_mode = description.panel_mode;
        };

        panel.prototype = {

            panelArray: [],

            collectionDescription: {
                "id": 'authentication',
                "db_name": 'authentication',
                "table_name": 'authentication',
                "db_version": 1,
                "keyPath": "userId"
            },

            MODE: {
                USER_INFO_EDIT: 'USER_INFO_EDIT',
                USER_INFO_SHOW: 'USER_INFO_SHOW',
                CREATE_CHAT: 'CREATE_CHAT',
                JOIN_CHAT: 'JOIN_CHAT',
                MY_CHATS: 'MY_CHATS'
            },

            configMap: {
                "USER_INFO_EDIT": '/mock/user_info_config.json',
                "USER_INFO_SHOW": '/mock/user_info_config.json',
                "CREATE_CHAT": '/mock/chats_info_config.json',
                "JOIN_CHAT": '/mock/chats_info_config.json',
                "MY_CHATS": ''
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

            cashBodyPanelElement: function() {
                var _this = this;
                if (_this.panel_mode === _this.MODE.USER_INFO_EDIT) {
                    _this.user_name = _this.panel_body.querySelector('[data-role="user_name_input"]');
                    _this.old_password = _this.panel_body.querySelector('[data-role="user_old_password_input"]');
                    _this.new_password = _this.panel_body.querySelector('[data-role="user_new_password_input"]');
                    _this.confirm_password = _this.panel_body.querySelector('[data-role="user_confirm_password_input"]');
                }
            },

            bindMainContexts: function() {
                var _this = this;
                _this.bindedTogglePanelWorkflow = _this.togglePanelWorkflow.bind(_this);
                _this.bindedInutUserInfo = _this.inputUserInfo.bind(_this);
                _this.bindedEventRouter = _this.eventRouter.bind(_this);
                _this.bindedThrowEventRouter = _this.throwEventRouter.bind(_this);
            },

            bindToolbarContext: function() {
                var _this = this;
                _this.bindedEventRouter = _this.eventRouter.bind(_this);
            },

            addMainEventListener: function() {
                var _this = this;
                _this.removeMainEventListeners();
                _this.addRemoveListener('add', _this.togglePanelElement, 'click', _this.bindedTogglePanelWorkflow, false);
                _this.addRemoveListener('add', _this.panel_body, 'input', _this.bindedInutUserInfo, false);
                _this.addRemoveListener('add', _this.panel_body, 'click', _this.bindedEventRouter, false);
                _this.addRemoveListener('add', _this.panel_body, 'click', _this.bindedThrowEventRouter, false);
            },

            removeMainEventListeners: function() {
                var _this = this;
                _this.addRemoveListener('remove', _this.togglePanelElement, 'click', _this.bindedTogglePanelWorkflow, false);
                _this.addRemoveListener('remove', _this.panel_body, 'input', _this.bindedInutUserInfo, false);
                _this.addRemoveListener('remove', _this.panel_body, 'click', _this.bindedEventRouter, false);
                _this.addRemoveListener('remove', _this.panel_body, 'click', _this.bindedThrowEventRouter, false);
            },

            addToolbarEventListener: function() {
                var _this = this;
                //_this.addRemoveListener('add', _this.panel_toolbar, 'click', _this.bindedThrowEventRouter, false);
                _this.addRemoveListener('add', _this.panel_toolbar, 'click', _this.bindedEventRouter, false);
            },

            removeToolbarEventListeners: function() {
                var _this = this;
                //_this.addRemoveListener('remove', _this.panel_toolbar, 'click', _this.bindedThrowEventRouter, false);
                _this.addRemoveListener('remove', _this.panel_toolbar, 'click', _this.bindedEventRouter, false);
            },

            openOrClosePanel: function(bigMode, forceClose) {
                var _this = this;
                if (!forceClose && _this.outer_container.style[_this.type] !== '0px') {
                    _this.previous_z_index = _this.outer_container.style.zIndex;
                    _this.outer_container.style.zIndex = ++panel.prototype.z_index;
                    _this.outer_container.style[_this.type] = "0px";
                    _this.fillPanelToolbar();
                    _this.renderPanelBody();
                    if (bigMode === true) {
                        _this.resizePanel();
                    }
                } else {
                    panel.prototype.z_index--;
                    _this.outer_container.style.zIndex = _this.previous_z_index;
                    _this.outer_container.style[_this.type] = (-_this.outer_container.offsetWidth) + 'px';
                    if (bigMode === true) {
                        _this.togglePanelElement.classList.remove("pull-for-" + _this.type + "-panel");
                        _this.togglePanelElement.classList.add("panel-button");
                    }
                    _this.panel_body.innerHTML = "";
                }
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
                    _this.sendRequest("/mock/panel_config.json", function(err, res) {
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

            renderPanelBody: function() {
                var _this = this;
                _this.loadBodyConfig(null, function(confErr) {
                    _this.loadBodyData(confErr, function(dataErr, data) {
                        _this.fillPanelBodyTemplate(dataErr, data, function(templErr) {
                            if (templErr) {
                                console.error(templErr);
                                return;
                            }

                            // success
                        });
                    });
                });
            },

            loadBodyConfig: function(_err, callback) {
                var _this = this;
                if (_err) {
                    callback(_err);
                    return;
                }

                if (_this.configMap[_this.panel_mode]) {

                    if (_this.panel_mode === _this.MODE.USER_INFO_SHOW || _this.panel_mode === _this.MODE.USER_INFO_EDIT) {
                        if (_this.panel_body_config) {
                            callback();
                            return;
                        }
                    }

                    _this.sendRequest(_this.configMap[_this.panel_mode], function(err, res) {
                        if (err) {
                            callback(err);
                            return;
                        }
                        _this.panel_body_config = JSON.parse(res);
                        callback();
                    });
                } else {
                    callback();
                }
            },

            loadBodyData: function(_err, callback) {
                var _this = this;
                if (_err) {
                    callback(_err);
                    return;
                }

                if (_this.dataMap[_this.panel_mode]) {
                    var collectionDescription = _this.dataMap[_this.panel_mode];
                    indexeddb.getAll(collectionDescription, function(getAllErr, data) {
                        if (getAllErr) {
                            callback(getAllErr);
                        } else {
                            if (_this.dataHandlerMap[_this.panel_mode]) {
                                callback(null, _this.dataHandlerMap[_this.panel_mode].call(_this, data));
                            } else {
                                callback(null, data);
                            }
                        }
                    });
                } else {
                    callback();
                }
            },

            fillPanelBodyTemplate: function(_err, data, callback) {
                var _this = this;
                if (_err) {
                    callback(_err);
                    return;
                }

                var currentTemplate = _this.templateMap[_this.panel_mode];
                if (currentTemplate) {
                    _this.panel_body.innerHTML = currentTemplate({
                        config: _this.panel_body_config,
                        triple_element_template: _this.triple_element_template,
                        button_template: _this.button_template,
                        input_template: _this.input_template,
                        label_template: _this.label_template,
                        textarea_template: _this.textarea_template,
                        mode: _this.panel_mode,
                        data: data
                    });
                    _this.cashBodyPanelElement();
                }
            },

            usersFilter: function(users) {
                var _this = this;
                _this.data = null;
                users.every(function(_user) {
                    if (_user.userId === _this.navigator.userId) {
                        _this.data = _user;
                    }
                    return !_this.data;
                });
                return _this.data;
            },

            inputUserInfo: function(event) {
                var _this = this;
                if (_this.panel_body_config) {
                    var param = event.target.getAttribute("data-role");
                    _this.panel_body_config.forEach(function(element) {
                            if (param === element.data_role) {
                                element.value = event.target.value;
                            }
                        }
                    )
                }
            },

            clearUserInfo: function() {
                var _this = this;
                _this.panel_body_config.forEach(function(element) {
                        if (element.data_role === "user_name_input" || element.data_role === "user_old_password_input" ||
                            element.data_role === "user_new_password_input" || element.data_role === "user_confirm_password_input") {
                            element.value = "";
                        }
                    }
                )
            },

            cancelChangeUserInfo: function() {
                var _this = this;
                _this.panel_mode = _this.MODE.USER_INFO_SHOW;
                _this.clearUserInfo();
                _this.fillPanelBodyTemplate(null, _this.data);
            },

            saveChangeUserInfo: function() {
                var _this = this;
                if (_this.user_name.value && _this.old_password.value && _this.new_password.value && _this.confirm_password.value) {
                    if (_this.old_password.value === _this.user.userPassword) {
                        if (_this.new_password.value === _this.confirm_password.value) {
                            _this.updateUserInfo(function() {
                                _this.panel_mode = _this.MODE.USER_INFO_SHOW;
                                _this.clearUserInfo();
                                _this.user_info_config = null;
                                //_this.downloadUserInfo();
                                _this.renderPanelBody();
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
                _this.panel_mode = _this.MODE.USER_INFO_EDIT;
                _this.fillPanelBodyTemplate(null, _this.data);
            },

            logout: function() {
                var _this = this;
                _this.navigator.userId = null;
                _this.panel_mode = _this.MODE.USER_INFO_SHOW;
                _this.removeMainEventListeners();
                _this.removeToolbarEventListeners();
                history.pushState(null, null, 'login');
                _this.navigator.navigate();
            },

            switchPanelMode: function(event) {
                var _this = this;
                _this.panel_mode = event.target.getAttribute("data-mode");
                _this.renderPanelBody();
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
        extend(panel, event_core);
        extend(panel, ajax_core);
        extend(panel, template_core);

        panel.prototype.panel_left_template = panel.prototype.template(panel_left_template);
        panel.prototype.panel_right_template = panel.prototype.template(panel_right_template);
        panel.prototype.user_info_template = panel.prototype.template(user_info_template);
        panel.prototype.chat_info_template = panel.prototype.template(chat_info_template);
        panel.prototype.triple_element_template = panel.prototype.template(triple_element_template);
        panel.prototype.button_template = panel.prototype.template(button_template);
        panel.prototype.label_template = panel.prototype.template(label_template);
        panel.prototype.input_template = panel.prototype.template(input_template);
        panel.prototype.textarea_template = panel.prototype.template(textarea_template);

        panel.prototype.dataMap = {
            "USER_INFO_EDIT": panel.prototype.collectionDescription,
            "USER_INFO_SHOW": panel.prototype.collectionDescription,
            "CREATE_CHAT": '',
            'JOIN_CHAT': '',
            "MY_CHATS": ''
        };

        panel.prototype.templateMap = {
            "USER_INFO_EDIT": panel.prototype.user_info_template,
            "USER_INFO_SHOW": panel.prototype.user_info_template,
            "CREATE_CHAT": panel.prototype.chat_info_template,
            "JOIN_CHAT": panel.prototype.chat_info_template,
            "MY_CHATS": panel.prototype.chat_info_template
        };

        panel.prototype.dataHandlerMap = {
            "USER_INFO_EDIT": panel.prototype.usersFilter,
            "USER_INFO_SHOW": panel.prototype.usersFilter,
            "CREATE_CHAT": null,
            "JOIN_CHAT": null,
            "MY_CHATS": null
        };

        return panel;
    });
