define('panel', [
        'event_core',
        'ajax_core',
        'indexeddb',
        'template_core',

        'text!../html/toolbar_left_panel_template.html',
        'text!../html/toolbar_right_panel_template.html',
        'text!../html/user_info_template.html',
        'text!../html/element/triple_element_template.html',
        'text!../html/element/button_template.html',
        'text!../html/element/label_template.html',
        'text!../html/element/input_template.html'
    ],
    function(event_core,
             ajax_core,
             indexeddb,
             template_core,
             toolbar_left_panel_template,
             toolbar_right_panel_template,
             user_info_template,
             triple_element_template,
             button_template,
             label_template,
             input_template) {

        var panel = function() {
        };

        panel.prototype = {

            panelArray: [],

            /*            toolbar_left_panel_template: _.template(toolbar_left_panel_template),
             toolbar_right_panel_template: _.template(toolbar_right_panel_template),
             user_info_template: _.template(user_info_template),
             triple_element_template: _.template(triple_element_template),
             button_template: _.template(button_template),
             label_template: _.template(label_template),
             input_template: _.template(input_template),*/

            initialize: function(navigator) {
                var _this = this;

                _this.toolbar_left_panel_template = _this.template(toolbar_left_panel_template);
                _this.toolbar_right_panel_template = _this.template(toolbar_right_panel_template);
                _this.user_info_template = _this.template(user_info_template);
                _this.triple_element_template = _this.template(triple_element_template);
                _this.button_template = _this.template(button_template);
                _this.label_template = _this.template(label_template);
                _this.input_template = _this.template(input_template);

                _this.bindContextsContent();
                _this.bindContextsMain();

                _this.navigator = navigator;
                _this.navigatorData = _this.navigator.data;

                _this.data = {
                    mode: "",
                    mode_user_info: "reading",
                    z_index: 80,
                    collection: {
                        "id": 1,
                        "db_name": 'authentification',
                        "table_name": 'authentification',
                        "db_version": 2,
                        "keyPath": "userId"
                    }
                };
                _this.indexeddb = new indexeddb().initialize();
                _this.render();
                return _this;
            },

            render: function() {
                var _this = this;
                _this.left_panel_outer_container = document.querySelector('[data-role="left_panel_outer_container"]');
                _this.leftPanel = _this.left_panel_outer_container.querySelector('[data-action="leftPanel"]');
                _this.btnLeftPanel = _this.leftPanel.querySelector('[data-action="btnLeftPanel"]');
                _this.left_panel_inner_container = _this.leftPanel.querySelector('[data-role="left_panel_inner_container"]');
                _this.bodyLeftPanel = _this.left_panel_inner_container.querySelector('[data-role="body_left_panel"]');
                _this.toolbarLeftPanel = _this.left_panel_inner_container.querySelector('[data-role="toolbar_left_panel"]');
                _this.left_panel_outer_container.classList.remove("hide");
                _this.left_panel_outer_container.classList.add("animate");
                _this.left_panel_outer_container.style.maxWidth = window.innerWidth + 'px';
                _this.left_panel_outer_container.style.left = -_this.left_panel_outer_container.offsetWidth + 'px';
                _this.left_panel_outer_container.style.zIndex = _this.data.z_index;

                _this.right_panel_outer_container = document.querySelector('[data-role="right_panel_outer_container"]');
                _this.rightPanel = _this.right_panel_outer_container.querySelector('[data-action="rightPanel"]');
                _this.btnRightPanel = _this.rightPanel.querySelector('[data-action="btnRightPanel"]');
                _this.right_panel_inner_container = _this.rightPanel.querySelector('[data-role="right_panel_inner_container"]');
                _this.bodyRightPanel = _this.right_panel_inner_container.querySelector('[data-role="body_right_panel"]');
                _this.toolbarRightPanel = _this.right_panel_inner_container.querySelector('[data-role="toolbar_right_panel"]');
                _this.right_panel_outer_container.classList.remove("hide");
                _this.right_panel_outer_container.classList.add("animate");
                _this.right_panel_outer_container.style.maxWidth = window.innerWidth + 'px';
                _this.right_panel_outer_container.style.right = -_this.right_panel_outer_container.offsetWidth + 'px';
                _this.right_panel_outer_container.style.zIndex = _this.data.z_index;

                _this.addMainEventListener();
            },

            bindContextsMain: function() {
                var _this = this;
                _this.bindedWorkRightPanel = _this.workRightPanel.bind(_this);
                _this.bindedWorkLeftPanel = _this.workLeftPanel.bind(_this);
                _this.bindedInutUserInfo = _this.inputUserInfo.bind(_this);
            },

            addMainEventListener: function() {
                var _this = this;
                _this.removeMainEventListeners();
                if (_this.btnRightPanel) {
                    _this.btnRightPanel.addEventListener('click', _this.bindedWorkRightPanel, false);
                }
                if (_this.btnLeftPanel) {
                    _this.btnLeftPanel.addEventListener('click', _this.bindedWorkLeftPanel, false);
                }
                if (_this.bodyRightPanel) {
                    _this.bodyRightPanel.addEventListener("input", _this.bindedInutUserInfo, false);
                }
            },

            removeMainEventListeners: function() {
                var _this = this;
                if (_this.btnRightPanel) {
                    _this.btnRightPanel.removeEventListener('click', _this.bindedWorkRightPanel, false);
                }
                if (_this.btnLeftPanel) {
                    _this.btnLeftPanel.removeEventListener('click', _this.bindedWorkLeftPanel, false);
                }
                if (_this.bodyRightPanel) {
                    _this.bodyRightPanel.removeEventListener("input", _this.bindedInutUserInfo, false);
                }
            },

            bindContextsContent: function() {
                var _this = this;
                _this.bindedThrowEventAddNewChat = _this.throwEvent.bind(_this, 'addNewChat');
                _this.bindedThrowEventClearStory = _this.throwEvent.bind(_this, 'clearStory');
                _this.bindedDownloadUserInfo = _this.downloadUserInfo.bind(_this);
            },

            addContentEventListener: function() {
                var _this = this;
                _this.removeContentEventListeners();
                if (_this.addChat) {
                    _this.addChat.addEventListener('click', _this.bindedThrowEventAddNewChat, false);
                }
                if (_this.clearStory) {
                    _this.clearStory.addEventListener('click', _this.bindedThrowEventClearStory, false);
                }
                if (_this.userInfo) {
                    _this.userInfo.addEventListener('click', _this.bindedDownloadUserInfo, false);
                }
            },

            removeContentEventListeners: function() {
                var _this = this;
                if (_this.addChat) {
                    _this.addChat.removeEventListener('click', _this.bindedThrowEventAddNewChat, false);
                }
                if (_this.clearStory) {
                    _this.clearStory.removeEventListener('click', _this.bindedThrowEventClearStory, false);
                }
                if (_this.userInfo) {
                    _this.userInfo.removeEventListener('click', _this.bindedDownloadUserInfo, false);
                }
            },

            throwEvent: function(name) {
                var _this = this;
                _this.trigger(name);
            },

            workLeftPanel: function() {
                var _this = this;
                _this.sendRequest("/mock/panel_config.json", function(err, res) {
                    if (err) {
                        console.log(err);
                    } else {
                        _this.panel_config = JSON.parse(res);
                        if (_this.left_panel_outer_container.clientWidth + _this.btnLeftPanel.clientWidth > document.body.clientWidth) {
                            if (_this.left_panel_outer_container.style.left !== '0px') {
                                _this.data.z_index = _this.data.z_index + 1;
                                _this.left_panel_outer_container.style.zIndex = _this.data.z_index;
                                _this.left_panel_outer_container.style.left = "0px";
                                _this.fillingTemplateBodyLeftPanel();
                                _this.resizePanel();
                            } else {
                                _this.data.z_index = _this.data.z_index - 1;
                                _this.left_panel_outer_container.style.zIndex = _this.data.z_index;
                                _this.right_panel_outer_container.style.zIndex = _this.data.z_index;
                                _this.left_panel_outer_container.style.left = -_this.left_panel_outer_container.offsetWidth + 'px';
                                _this.btnLeftPanel.classList.remove("floatR");
                                _this.left_panel_inner_container.classList.remove("clear");
                                _this.btnLeftPanel.classList.add("btnPanel");
                                _this.bodyLeftPanel.innerHTML = "";
                            }
                        } else {
                            if (_this.left_panel_outer_container.style.left !== '0px') {
                                _this.data.z_index = _this.data.z_index + 1;
                                _this.left_panel_outer_container.style.zIndex = _this.data.z_index;
                                _this.left_panel_outer_container.style.left = "0px";
                                _this.fillingTemplateBodyLeftPanel();
                            } else {
                                _this.data.z_index = _this.data.z_index - 1;
                                _this.left_panel_outer_container.style.zIndex = _this.data.z_index;
                                _this.right_panel_outer_container.style.zIndex = _this.data.z_index;
                                _this.left_panel_outer_container.style.left = -_this.left_panel_outer_container.offsetWidth + 'px';
                                _this.bodyLeftPanel.innerHTML = "";
                            }
                        }
                    }
                })
            },

            fillingTemplateBodyLeftPanel: function() {
                var _this = this;
                _this.leftPanel.style.left = 0 + 'px';
                _this.toolbarLeftPanel.innerHTML = _this.toolbar_left_panel_template({
                    config: _this.panel_config,
                    triple_element_template: _this.triple_element_template,
                    button_template: _this.button_template,
                    input_template: _this.input_template,
                    label_template: _this.label_template
                });
                _this.addChat = _this.toolbarLeftPanel.querySelector('button[data-action="addChat"]');
                _this.clearStory = _this.toolbarLeftPanel.querySelector('[data-action="btnClearListMessage"]');
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
                                _this.data.z_index = _this.data.z_index + 1;
                                _this.right_panel_outer_container.style.zIndex = _this.data.z_index;
                                _this.right_panel_outer_container.style.right = '0px';
                                _this.fillingTemplateToolbarRightPanel();
                                if (_this.data.mode === _this.userInfo.getAttribute("data-mode")) {
                                    _this.downloadUserInfo();
                                }
                                _this.resizePanel();
                            } else {
                                _this.data.z_index = _this.data.z_index - 1;
                                _this.right_panel_outer_container.style.zIndex = _this.data.z_index;
                                _this.left_panel_outer_container.style.zIndex = _this.data.z_index;
                                _this.right_panel_outer_container.style.right = -_this.right_panel_outer_container.offsetWidth + 'px';
                                _this.right_panel_inner_container.classList.remove("clear");
                                _this.btnRightPanel.classList.add("btnPanel");
                                _this.bodyRightPanel.innerHTML = "";
                            }
                        } else {
                            if (_this.right_panel_outer_container.style.right !== '0px') {
                                _this.data.z_index = _this.data.z_index + 1;
                                _this.right_panel_outer_container.style.zIndex = _this.data.z_index;
                                _this.right_panel_outer_container.style.right = '0px';
                                _this.fillingTemplateToolbarRightPanel();
                                if (_this.data.mode === _this.userInfo.getAttribute("data-mode")) {
                                    _this.downloadUserInfo();
                                }
                            } else {
                                _this.data.z_index = _this.data.z_index - 1;
                                _this.right_panel_outer_container.style.zIndex = _this.data.z_index;
                                _this.left_panel_outer_container.style.zIndex = _this.data.z_index;
                                _this.right_panel_outer_container.style.right = -_this.right_panel_outer_container.offsetWidth + 'px';
                                _this.bodyRightPanel.innerHTML = "";
                            }
                        }
                    }
                })
            },

            fillingTemplateToolbarRightPanel: function() {
                var _this = this;
                _this.rightPanel.style.right = 0 + 'px';
                _this.toolbarRightPanel.innerHTML = _this.toolbar_right_panel_template({
                    config: _this.panel_config,
                    triple_element_template: _this.triple_element_template,
                    button_template: _this.button_template,
                    input_template: _this.input_template,
                    label_template: _this.label_template
                });
                _this.userInfo = _this.toolbarRightPanel.querySelector('[data-action="btn_user_info"]');
                _this.addContentEventListener();
            },

            downloadUserInfo: function(event, update) {
                var _this = this;
                if (_this.data.mode === _this.userInfo.getAttribute("data-mode")) {
                    if (_this.bodyRightPanel.innerHTML === "" || update) {
                        _this.indexeddb.getAll(_this.data.collection, function(getAllErr, users) {
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
                _this.indexeddb.addOrUpdateAll(
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
