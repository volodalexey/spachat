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
            this.panel_left_template = this.template(panel_left_template);
            this.panel_right_template = this.template(panel_right_template);
            this.user_info_template = this.template(user_info_template);
            this.triple_element_template = this.template(triple_element_template);
            this.button_template = this.template(button_template);
            this.label_template = this.template(label_template);
            this.input_template = this.template(input_template);

            this.bindContextsContent();
            this.bindContextsMain();

            this.mode = "";
            this.mode_user_info = "reading";
            this.collectionDescription = {
                "db_name": 'authentication',
                "table_name": 'authentication',
                "db_version": 1,
                "keyPath": "userId"
            };
            this.type = description.type;
            this.panel_platform = description.panel_platform;
            this.outer_container = description.outer_container;
            this.inner_container = description.inner_container;
        };

        panel.prototype = {

            panelArray: [],

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

            cashElements: function() {
                var _this = this;
                _this.togglePanelElement = _this.outer_container.querySelector('[data-action="togglePanel"]');
                _this.panel_body = _this.outer_container.querySelector('[data-role="panel_body"]');
                _this.panel_toolbar = _this.outer_container.querySelector('[data-role="panel_toolbar"]');
            },

            bindContextsMain: function() {
                var _this = this;
                _this.bindedTogglePanelWorkflow = _this.togglePanelWorkflow.bind(_this);
                _this.bindedInutUserInfo = _this.inputUserInfo.bind(_this);
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

            bindContextsContent: function() {
                var _this = this;
                _this.bindedThrowEventAddNewChat = _this.throwEvent.bind(_this, 'addNewChat');
                _this.bindedThrowEventClearStory = _this.throwEvent.bind(_this, 'clearStory');
                _this.bindedDownloadUserInfo = _this.downloadUserInfo.bind(_this);
            },

            addRemoveListener: function(element, eventName, listener, phase) {
                if (!element || !listener || !eventName) {
                    return;
                }
                if (this.addRemoveListener.caller === this.addContentEventListener ||
                    this.addRemoveListener.caller === this.addMainEventListener) {
                    element.addEventListener(eventName, listener, phase);
                } else if (this.addRemoveListener.caller === this.removeContentEventListeners ||
                    this.addRemoveListener.caller === this.removeMainEventListeners) {
                    element.removeEventListener(eventName, listener, phase);
                }
            },

            addContentEventListener: function() {
                var _this = this;
                _this.removeContentEventListeners();
                //if (_this.addChat) {
                //    _this.addChat.addEventListener('click', _this.bindedThrowEventAddNewChat, false);
                //}
                //if (_this.clearStory) {
                //    _this.clearStory.addEventListener('click', _this.bindedThrowEventClearStory, false);
                //}
                //if (_this.userInfo) {
                //    _this.userInfo.addEventListener('click', _this.bindedDownloadUserInfo, false);
                //}
            },

            removeContentEventListeners: function() {
                var _this = this;
                //if (_this.addChat) {
                //    _this.addChat.removeEventListener('click', _this.bindedThrowEventAddNewChat, false);
                //}
                //if (_this.clearStory) {
                //    _this.clearStory.removeEventListener('click', _this.bindedThrowEventClearStory, false);
                //}
                //if (_this.userInfo) {
                //    _this.userInfo.removeEventListener('click', _this.bindedDownloadUserInfo, false);
                //}
            },

            throwEvent: function(name) {
                var _this = this;
                _this.trigger(name);
            },

            openOrClosePanel: function(bigMode) {
                var _this = this;
                if (_this.outer_container.style[_this.type] !== '0px') {
                    _this.previous_z_index = _this.outer_container.style.zIndex;
                    _this.outer_container.style.zIndex = ++_this.z_index;
                    _this.outer_container.style[_this.type] = "0px";
                    _this.fillPanelBody();
                    if (bigMode === true) {
                        //_this.resizePanel();
                    }
                } else {
                    _this.z_index--;
                    _this.outer_container.style.zIndex = _this.previous_z_index;
                    _this.outer_container.style[_this.type] = (-_this.outer_container.offsetWidth) + 'px';
                    if (bigMode === true) {
                        _this.togglePanelElement.classList.remove("pull-" + _this.type);
                        _this.togglePanelElement.classList.add("panel-button");
                    }
                    // TODO remove innner listeners before
                    _this.panel_body.innerHTML = "";
                }
            },

            togglePanel: function() {
                var _this = this;
                _this.openOrClosePanel(_this.outer_container.clientWidth + _this.togglePanelElement.clientWidth > document.body.clientWidth);
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

            fillPanelBody: function() {
                var _this = this;
                //_this.leftPanel.style.left = 0 + 'px';
                _this.panel_toolbar.innerHTML = _this['panel_' + _this.type + '_template']({
                    config: _this.panel_config,
                    triple_element_template: _this.triple_element_template,
                    button_template: _this.button_template,
                    input_template: _this.input_template,
                    label_template: _this.label_template
                });
                //_this.addChat = _this.toolbarLeftPanel.querySelector('button[data-action="addChat"]');
                //_this.clearStory = _this.toolbarLeftPanel.querySelector('[data-action="btnClearListMessage"]');
                _this.addContentEventListener();
            },

            workRightPanel: function() {
                var _this = this;
                _this.sendRequest("/mock/panel_config.json", function(err, res) {
                    if (err) {
                        console.log(err);
                    } else {
                        _this.panel_config = JSON.parse(res);
                        if (_this.right_panel_outer_container.clientWidth + _this.btnRightPanel.clientWidth > document.body.clientWidth) {
                            if (_this.right_panel_outer_container.style.right !== '0px') {

                                _this.fillingTemplateToolbarRightPanel();
                                if (_this.data.mode === _this.userInfo.getAttribute("data-mode")) {
                                    _this.downloadUserInfo();
                                }
                                _this.resizePanel();
                            } else {

                            }
                        } else {
                            if (_this.right_panel_outer_container.style.right !== '0px') {

                                _this.fillingTemplateToolbarRightPanel();
                                if (_this.data.mode === _this.userInfo.getAttribute("data-mode")) {
                                    _this.downloadUserInfo();
                                }
                            } else {

                            }
                        }
                    }
                })
            },

            downloadUserInfo: function(event, update) {
                var _this = this;
                if (_this.data.mode === _this.userInfo.getAttribute("data-mode")) {
                    if (_this.bodyRightPanel.innerHTML === "" || update) {
                        indexeddb.getAll(_this.data.collection, function(getAllErr, users) {
                            if (getAllErr) {
                                console.error(getAllErr);
                            } else {
                                _this.user = _.findWhere(users, {"userId": _this.navigatorData.userID});
                                if (_this.user_info_config) {
                                    _this.renderUserInfo();
                                } else {
                                    _this.sendRequest("/mock/user_info_config.json", function(err, res) {
                                        if (err) {
                                            console.log(err);
                                        } else {
                                            _this.user_info_config = JSON.parse(res);
                                            _this.renderUserInfo();
                                        }
                                    });
                                }
                            }
                        });
                    }
                } else {
                    _this.data.mode = _this.userInfo.getAttribute("data-mode");
                    _this.downloadUserInfo();
                }
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
                _this.fillingTemplateUserInfo();
            },

            fillingTemplateUserInfo: function() {
                var _this = this;

                _this.bodyRightPanel.innerHTML = _this.user_info_template({
                    config: _this.user_info_config,
                    triple_element_template: _this.triple_element_template,
                    button_template: _this.button_template,
                    input_template: _this.input_template,
                    label_template: _this.label_template,
                    mode: _this.data.mode_user_info
                });

                _this.data.mode = _this.userInfo.getAttribute("data-mode");
                //_this.user_id = _this.bodyRightPanel.querySelector('input[data-role="user_id"]');
                _this.user_name = _this.bodyRightPanel.querySelector('[data-role="user_name_input"]');
                _this.old_password = _this.bodyRightPanel.querySelector('[data-role="user_old_password_input"]');
                _this.new_password = _this.bodyRightPanel.querySelector('[data-role="user_new_password_input"]');
                _this.confirm_password = _this.bodyRightPanel.querySelector('[data-role="user_confirm_password_input"]');

                if (_this.data.mode_user_info === "reading") {
                    _this.change_user_info = _this.bodyRightPanel.querySelector('button[data-action="change_user_info"]');
                    if (_this.change_user_info) {
                        _this.change_user_info.addEventListener('click', _this.changeUserInfo.bind(_this), false);
                    }
                    _this.logout_user = _this.bodyRightPanel.querySelector('button[data-action="logout"]');
                    if (_this.logout_user) {
                        _this.logout_user.addEventListener('click', _this.logout.bind(_this), false);
                    }
                } else {
                    _this.cancel_change_user_info = _this.bodyRightPanel.querySelector('button[data-action="cancel_change_user_info"]');
                    if (_this.cancel_change_user_info) {
                        _this.cancel_change_user_info.addEventListener('click', _this.cancelChangeUserInfo.bind(_this), false);
                    }
                    _this.save_change_user_info = _this.bodyRightPanel.querySelector('button[data-action="save_change_user_info"]');
                    if (_this.save_change_user_info) {
                        _this.save_change_user_info.addEventListener('click', _this.saveChangeUserInfo.bind(_this), false);
                    }
                }
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
                _this.data.mode_user_info = "reading";
                _this.clearUserInfo();
                _this.renderUserInfo(null, true);
            },

            saveChangeUserInfo: function() {
                var _this = this;
                if (_this.user_name.value !== "" && _this.old_password.value !== "" && _this.new_password.value !== "" && _this.confirm_password.value !== "") {
                    if (_this.old_password.value === _this.user.userPassword) {
                        if (_this.new_password.value === _this.confirm_password.value) {
                            _this.updateUserInfo(function() {
                                _this.data.mode_user_info = "reading";
                                _this.clearUserInfo();
                                _this.user_info_config = null;
                                _this.downloadUserInfo(null, true);
                                //_this.renderUserInfo(true);
                            })
                        } else {
                            alert("New password and confirm password do not match");
                            _this.new_password.value = "";
                            _this.confirm_password.value = "";
                        }
                    } else {
                        alert("Old password is not correct");
                        _this.old_password.value = "";
                        _this.new_password.value = "";
                        _this.confirm_password.value = "";
                    }
                } else {
                    alert("Fill in all the fields");
                }
            },

            updateUserInfo: function(callback) {
                var _this = this;
                _this.account = {
                    userId: _this.navigatorData.userID,
                    userPassword: _this.new_password.value,
                    userName: _this.user_name.value
                };
                indexeddb.addOrUpdateAll(
                    _this.data.collection,
                    [
                        _this.account
                    ],
                    function(error) {
                        if (error) {
                            console.error(error);
                            return;
                        }
                        console.log("account", _this.account);
                        callback();
                    }
                );
            },

            changeUserInfo: function() {
                var _this = this;
                _this.data.mode = "";
                _this.data.mode_user_info = "editing";
                _this.fillingTemplateUserInfo(function() {
                    _this.user_name.value = _this.user.userName;
                });
            },

            logout: function() {
                var _this = this;
                _this.navigatorData.userID = "";
                _this.data.mode = "";
                _this.bodyRightPanel.innerHTML = "";
                _this.removeMainEventListeners();
                history.pushState(null, null, 'login');
                _this.navigator.navigate();
            },

            resizePanel: function() {
                var _this = this;
                if (_this.left_panel_outer_container.style.left === '0px') {
                    if (_this.left_panel_outer_container.clientWidth + _this.btnLeftPanel.clientWidth > document.body.clientWidth) {
                        _this.btnLeftPanel.classList.add("floatR");
                        _this.left_panel_inner_container.classList.add("clear");
                        _this.btnLeftPanel.classList.remove("btnPanel");
                    }
                    else {
                        _this.btnLeftPanel.classList.remove("floatR");
                        _this.left_panel_inner_container.classList.remove("clear");
                        _this.btnLeftPanel.classList.add("btnPanel");
                    }
                }
                if (_this.right_panel_outer_container.style.right === '0px') {
                    if (_this.right_panel_outer_container.clientWidth + _this.btnRightPanel.clientWidth > document.body.clientWidth) {
                        _this.right_panel_inner_container.classList.add("clear");
                        _this.btnRightPanel.classList.remove("btnPanel");
                    }
                    else {
                        _this.right_panel_inner_container.classList.remove("clear");
                        _this.btnRightPanel.classList.add("btnPanel");
                    }
                }
            }

        }
        extend(panel, event_core);
        extend(panel, ajax_core);
        extend(panel, template_core);

        return panel;
    });
