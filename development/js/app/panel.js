define('panel', [
        'event_core',
        'ajax_core',
        'template_core',

        'indexeddb',

        'text!../html/panel_left_template.html',
        'text!../html/panel_right_template.html',
        'text!../html/user_info_template.html',
        'text!../html/element/triple_element_template.html',
        'text!../html/element/button_template.html',
        'text!../html/element/label_template.html',
        'text!../html/element/input_template.html'
    ],
    function(event_core,
             ajax_core,
             template_core,

             indexeddb,

             panel_left_template,
             panel_right_template,
             user_info_template,
             triple_element_template,
             button_template,
             label_template,
             input_template) {

        var panel = function(description) {
            this.bindToolbarContext();
            this.bindMainContexts();
            this.bindContentContexts();

            this.type = description.type;
            this.panel_platform = description.panel_platform;
            this.outer_container = description.outer_container;
            this.inner_container = description.inner_container;
            this.panel_mode = description.panel_mode;
        };

        panel.prototype = {

            panelArray: [],

            collectionDescription: {
                "db_name": 'authentication',
                "table_name": 'authentication',
                "db_version": 1,
                "keyPath": "userId"
            },

            MODE: {
                USER_INFO_EDIT: 'USER_INFO_EDIT',
                USER_INFO_SHOW: 'USER_INFO_SHOW',
                ROOM_CREATE: 'ROOM_CREATE',
                ROOM_JOIN: 'ROOM_JOIN'
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
                _this.outer_container.style.zIndex = _this.z_index;
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

            bindMainContexts: function() {
                var _this = this;
                _this.bindedTogglePanelWorkflow = _this.togglePanelWorkflow.bind(_this);
                _this.bindedInutUserInfo = _this.inputUserInfo.bind(_this);
            },

            bindToolbarContext: function() {
                var _this = this;
                _this.bindedThrowEventRouter = _this.throwEventRouter.bind(_this);
                //_this.bindedDownloadUserInfo = _this.downloadUserInfo.bind(_this);
            },

            bindContentContexts: function() {
                var _this = this;
                _this.bindedChangeUserInfo = _this.changeUserInfo.bind(_this);
                _this.bindedLogout = _this.logout.bind(_this);
                _this.bindedCancelChangeUserInfo = _this.cancelChangeUserInfo.bind(_this);
                _this.bindedSaveChangeUserInfo = _this.saveChangeUserInfo.bind(_this);
            },

            addMainEventListener: function() {
                var _this = this;
                _this.removeMainEventListeners();
                _this.addRemoveListener(_this.togglePanelElement, 'click', _this.bindedTogglePanelWorkflow, false);
                _this.addRemoveListener(_this.panel_body, 'input', _this.bindedInutUserInfo, false);
            },

            removeMainEventListeners: function() {
                var _this = this;
                _this.addRemoveListener(_this.togglePanelElement, 'click', _this.bindedTogglePanelWorkflow, false);
                _this.addRemoveListener(_this.panel_body, 'input', _this.bindedInutUserInfo, false);
            },

            addRemoveListener: function(element, eventName, listener, phase) {
                if (!element || !listener || !eventName) {
                    return;
                }
                if (this.addRemoveListener.caller === this.addToolbarEventListener ||
                    this.addRemoveListener.caller === this.addContentEventListener ||
                    this.addRemoveListener.caller === this.addMainEventListener) {
                    element.addEventListener(eventName, listener, phase);
                } else if (this.addRemoveListener.caller === this.removeToolbarEventListeners ||
                    this.addRemoveListener.caller === this.removeContentEventListeners ||
                    this.addRemoveListener.caller === this.removeMainEventListeners) {
                    element.removeEventListener(eventName, listener, phase);
                }
            },

            addToolbarEventListener: function() {
                var _this = this;
                _this.removeContentEventListeners();
                _this.addRemoveListener(_this.panel_toolbar, 'click', _this.bindedThrowEventRouter, false);
                //if (_this.userInfo) {
                //    _this.userInfo.addEventListener('click', _this.bindedDownloadUserInfo, false);
                //}
            },

            removeToolbarEventListeners: function() {
                var _this = this;
                _this.addRemoveListener(_this.panel_toolbar, 'click', _this.bindedThrowEventRouter, false);
                //if (_this.userInfo) {
                //    _this.userInfo.removeEventListener('click', _this.bindedDownloadUserInfo, false);
                //}
            },

            addContentEventListener: function() {
                var _this = this;
                _this.removeContentEventListeners();
                if (_this.panel_mode === _this.MODE.USER_INFO_SHOW) {
                    _this.addRemoveListener(_this.change_user_info, 'click', _this.bindedChangeUserInfo, false);
                    _this.addRemoveListener(_this.logout_user, 'click', _this.bindedLogout, false);
                } else if (_this.panel_mode === _this.MODE.USER_INFO_EDIT) {
                    _this.addRemoveListener(_this.cancel_change_user_info, 'click', _this.bindedCancelChangeUserInfo, false);
                    _this.addRemoveListener(_this.save_change_user_info, 'click', _this.bindedSaveChangeUserInfo, false);
                }
            },

            removeContentEventListeners: function() {
                var _this = this;
                if (_this.panel_mode === _this.MODE.USER_INFO_SHOW) {
                    _this.addRemoveListener(_this.change_user_info, 'click', _this.bindedChangeUserInfo, false);
                    _this.addRemoveListener(_this.logout_user, 'click', _this.bindedLogout, false);
                } else if (_this.panel_mode === _this.MODE.USER_INFO_EDIT) {
                    _this.addRemoveListener(_this.cancel_change_user_info, 'click', _this.bindedCancelChangeUserInfo, false);
                    _this.addRemoveListener(_this.save_change_user_info, 'click', _this.bindedSaveChangeUserInfo, false);
                }
            },

            openOrClosePanel: function(bigMode, forceClose) {
                var _this = this;
                if (!forceClose && _this.outer_container.style[_this.type] !== '0px') {
                    _this.previous_z_index = _this.outer_container.style.zIndex;
                    _this.outer_container.style.zIndex = ++_this.z_index;
                    _this.outer_container.style[_this.type] = "0px";
                    _this.fillPanelToolbar();
                    if (_this.panel_mode === _this.MODE.USER_INFO_EDIT ||
                        _this.panel_mode === _this.MODE.USER_INFO_SHOW) {
                        _this.downloadUserInfo();
                    }
                    if (bigMode === true) {
                        _this.resizePanel();
                    }
                } else {
                    _this.z_index--;
                    _this.outer_container.style.zIndex = _this.previous_z_index;
                    _this.outer_container.style[_this.type] = (-_this.outer_container.offsetWidth) + 'px';
                    if (bigMode === true) {
                        _this.togglePanelElement.classList.remove("pull-for-" + _this.type + "-panel");
                        _this.togglePanelElement.classList.add("panel-button");
                    }
                    _this.removeContentEventListeners();
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

            downloadUserInfo: function() {
                var _this = this;
                indexeddb.getAll(_this.collectionDescription, function(getAllErr, users) {
                    if (getAllErr) {
                        console.error(getAllErr);
                    } else {
                        _this.user = null;
                        users.every(function(_user) {
                            if (_user.userId === _this.navigator.userId) {
                                _this.user = _user;
                            }
                            return !_this.user;
                        });

                        if (!_this.user) {
                            console.error(new Error('User not found!'));
                            return;
                        }

                        if (_this.user_info_config) {
                            _this.renderUserInfo();
                        } else {
                            _this.sendRequest("/mock/user_info_config.json", function(err, res) {
                                if (err) {
                                    console.error(err);
                                    return;
                                }

                                _this.user_info_config = JSON.parse(res);
                                _this.renderUserInfo();
                            });
                        }
                    }
                });
            },

            renderUserInfo: function() {
                var _this = this;
                _this.user_info_config.forEach(function(element) {
                    if (element.data_role === "user_name_input" || element.data_role === "user_name") {
                        if (element.value === "") {
                            element.value = _this.user.userName;
                        }
                    }
                    if (element.data_role === "user_id_input") {
                        element.value = _this.user.userId;
                    }
                });
                _this.fillTemplateUserInfo();
            },

            fillTemplateUserInfo: function() {
                var _this = this;

                _this.panel_body.innerHTML = _this.user_info_template({
                    config: _this.user_info_config,
                    triple_element_template: _this.triple_element_template,
                    button_template: _this.button_template,
                    input_template: _this.input_template,
                    label_template: _this.label_template,
                    mode: _this.panel_mode
                });

                _this.user_name = _this.panel_body.querySelector('[data-role="user_name_input"]');
                _this.old_password = _this.panel_body.querySelector('[data-role="user_old_password_input"]');
                _this.new_password = _this.panel_body.querySelector('[data-role="user_new_password_input"]');
                _this.confirm_password = _this.panel_body.querySelector('[data-role="user_confirm_password_input"]');

                _this.change_user_info = _this.panel_body.querySelector('button[data-action="change_user_info"]');
                _this.logout_user = _this.panel_body.querySelector('button[data-action="logout"]');
                _this.cancel_change_user_info = _this.panel_body.querySelector('button[data-action="cancel_change_user_info"]');
                _this.save_change_user_info = _this.panel_body.querySelector('button[data-action="save_change_user_info"]');
                _this.addContentEventListener();
            },

            inputUserInfo: function(event) {
                var _this = this;
                if (_this.user_info_config) {
                    var param = event.target.getAttribute("data-role");
                    _this.user_info_config.forEach(function(element) {
                            if (param === element.data_role) {
                                element.value = event.target.value;
                            }
                        }
                    )
                }
            },

            clearUserInfo: function() {
                var _this = this;
                _this.user_info_config.forEach(function(element) {
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
                _this.renderUserInfo();
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
                                _this.downloadUserInfo();
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
                _this.fillTemplateUserInfo();
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
        panel.prototype.triple_element_template = panel.prototype.template(triple_element_template);
        panel.prototype.button_template = panel.prototype.template(button_template);
        panel.prototype.label_template = panel.prototype.template(label_template);
        panel.prototype.input_template = panel.prototype.template(input_template);

        return panel;
    });
