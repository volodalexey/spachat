define('panel', [
        'event_core',
        'ajax_core',

        'text!../html/body_left_panel_template.html',
        'text!../html/body_right_panel_template.html',
        'text!../html/user_info_template.html',
        'text!../html/element/triple_element_template.html',
        'text!../html/element/button_template.html',
        'text!../html/element/label_template.html',
        'text!../html/element/input_template.html'
    ],
    function(event_core,
             ajax_core,
             body_left_panel_template,
             body_right_panel_template,
             user_info_template,
             triple_element_template,
             button_template,
             label_template,
             input_template) {

        var panel = function() {
        };

        panel.prototype = {

            panelArray: [],

            body_left_panel_template: _.template(body_left_panel_template),
            body_right_panel_template: _.template(body_right_panel_template),
            user_info_template: _.template(user_info_template),
            triple_element_template: _.template(triple_element_template),
            button_template: _.template(button_template),
            label_template: _.template(label_template),
            input_template: _.template(input_template),

            initialize: function() {
                var _this = this;
                _this.bindContextsContent();
                _this.bindContextsMain();
                _this.render();
                return _this;
            },

            render: function() {
                var _this = this;
                _this.leftPanel = document.querySelector('[data-action="leftPanel"]');
                _this.btnLeftPanel = _this.leftPanel.querySelector('[data-action="btnLeftPanel"]');
                _this.bodyLeftPanel = _this.leftPanel.querySelector('[data-role="body_left_panel"]');
                _this.leftPanel.style.left = -_this.leftPanel.offsetWidth + 'px';
                _this.leftPanel.style.maxWidth = window.innerWidth + 'px';
                _this.btnLeftPanel.style.left = _this.leftPanel.offsetWidth + 'px';

                _this.rightPanel = document.querySelector('[data-action="rightPanel"]');
                _this.btnRightPanel = _this.rightPanel.querySelector('[data-action="btnRightPanel"]');
                _this.bodyRightPanel = _this.rightPanel.querySelector('[data-role="body_right_panel"]');
                _this.rightPanel.style.right = -_this.rightPanel.offsetWidth + 'px';
                _this.rightPanel.style.maxWidth = window.innerWidth + 'px';
                _this.btnRightPanel.style.right = _this.rightPanel.offsetWidth + 'px';

                _this.rightPanel.classList.remove("hidden");
                _this.leftPanel.classList.remove("hidden");
                _this.leftPanel.classList.add("animate");
                _this.rightPanel.classList.add("animate");
                _this.bodyLeftPanel.classList.remove("hidden");
                _this.bodyRightPanel.classList.remove("hidden");
                _this.addMainEventListener();
            },

            bindContextsMain: function() {
                var _this = this;
                _this.bindedWorkRightPanel = _this.workRightPanel.bind(_this);
                _this.bindedWorkLeftPanel = _this.workLeftPanel.bind(_this);
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
            },

            removeMainEventListeners: function() {
                var _this = this;
                if (_this.btnRightPanel) {
                    _this.btnRightPanel.removeEventListener('click', _this.bindedWorkRightPanel, false);
                }
                if (_this.btnLeftPanel) {
                    _this.btnLeftPanel.removeEventListener('click', _this.bindedWorkLeftPanel, false);
                }
            },

            bindContextsContent: function() {
                var _this = this;
                _this.bindedThrowEventAddNewChat = _this.throwEvent.bind(_this, 'addNewChat');
                _this.bindedThrowEventClearStory = _this.throwEvent.bind(_this, 'clearStory');
                _this.bindedRenderUserInfo = _this.renderUserInfo.bind(_this);
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
                    _this.userInfo.addEventListener('click', _this.bindedRenderUserInfo, false);
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
                    _this.userInfo.removeEventListener('click', _this.bindedRenderUserInfo, false);
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
                        if (_this.leftPanel.clientWidth + _this.btnLeftPanel.clientWidth > document.body.clientWidth) {
                            if (_this.leftPanel.style.left !== '0px') {
                                _this.fillingTemplateBodyLeftPanel();
                                _this.resizePanel();
                            } else {
                                _this.leftPanel.style.left = -_this.leftPanel.offsetWidth + 'px';
                                _this.btnLeftPanel.style.left = _this.leftPanel.offsetWidth + 'px';
                                _this.btnLeftPanel.classList.add("btnPanel");
                                _this.bodyLeftPanel.innerHTML = "";
                            }
                        } else {
                            if (_this.leftPanel.style.left !== '0px') {
                                _this.fillingTemplateBodyLeftPanel();
                            } else {
                                _this.leftPanel.style.left = -_this.leftPanel.offsetWidth + 'px';
                                _this.bodyLeftPanel.innerHTML = "";
                            }
                        }
                    }
                })
            },

            fillingTemplateBodyLeftPanel: function() {
                var _this = this;
                _this.leftPanel.style.left = 0 + 'px';
                _this.bodyLeftPanel.innerHTML = _this.body_left_panel_template({
                    config: _this.panel_config,
                    triple_element_template: _this.triple_element_template,
                    button_template: _this.button_template,
                    input_template: _this.input_template,
                    label_template: _this.label_template
                });
                _this.addChat = _this.bodyLeftPanel.querySelector('button[data-action="addChat"]');
                _this.clearStory = _this.bodyLeftPanel.querySelector('[data-action="btnClearListMessage"]');
                _this.addContentEventListener();
            },

            workRightPanel: function() {
                var _this = this;
                _this.sendRequest("/mock/panel_config.json", function(err, res) {
                    if (err) {
                        console.log(err);
                    } else {
                        _this.panel_config = JSON.parse(res);
                        if (_this.rightPanel.clientWidth + _this.btnRightPanel.clientWidth > document.body.clientWidth) {
                            if (_this.rightPanel.style.right !== '0px') {
                                _this.fillingTemplateBodyRightPanel();
                                _this.resizePanel();
                            } else {
                                _this.rightPanel.style.right = -_this.rightPanel.offsetWidth + 'px';
                                _this.btnRightPanel.style.right = _this.rightPanel.offsetWidth + 'px';
                                _this.btnRightPanel.classList.add("btnPanel");
                                _this.bodyRightPanel.innerHTML = "";
                            }
                        } else {
                            if (_this.rightPanel.style.right !== '0px') {
                                _this.fillingTemplateBodyRightPanel();
                            } else {
                                _this.rightPanel.style.right = -_this.rightPanel.offsetWidth + 'px';
                                _this.bodyRightPanel.innerHTML = "";
                            }
                        }
                    }
                })
            },

            fillingTemplateBodyRightPanel: function() {
                var _this = this;
                _this.rightPanel.style.right = 0 + 'px';
                _this.bodyRightPanel.innerHTML = _this.body_right_panel_template({
                    config: _this.panel_config,
                    triple_element_template: _this.triple_element_template,
                    button_template: _this.button_template,
                    input_template: _this.input_template,
                    label_template: _this.label_template
                });
                _this.userInfo = _this.rightPanel.querySelector('[data-action="btn_user_info"]');
                _this.addContentEventListener();
            },

            renderUserInfo: function() {
                var _this = this;
                _this.user_info_container = _this.rightPanel.querySelector('[data-role="user_info_container"]');

                if (_this.user_info_container.innerHTML === "") {
                    _this.sendRequest("/mock/user_info_config.json", function(err, res) {
                        if (err) {
                            console.log(err);
                        } else {
                            _this.user_info_config = JSON.parse(res);
                            _this.user_info_container.innerHTML = _this.user_info_template({
                                config: _this.user_info_config,
                                triple_element_template: _this.triple_element_template,
                                button_template: _this.button_template,
                                input_template: _this.input_template,
                                label_template: _this.label_template
                            });
                        }
                    })
                } else {
                    _this.user_info_container.innerHTML = "";
                }
            },

            resizePanel: function() {
                var _this = this;
                var widthPanel;
                if (_this.leftPanel.style.left === '0px') {
                    widthPanel = _this.leftPanel.clientWidth + _this.btnLeftPanel.clientWidth;
                    if (widthPanel > document.body.clientWidth) {
                        _this.btnLeftPanel.style.left = parseInt(_this.btnLeftPanel.style.left) - _this.btnLeftPanel.clientWidth + 'px';
                        _this.btnLeftPanel.style.left = 0 + "px";
                        _this.btnLeftPanel.classList.remove("btnPanel");
                    }
                    else {
                        _this.btnLeftPanel.style.left = _this.leftPanel.offsetWidth + 'px';
                        _this.btnLeftPanel.classList.add("btnPanel");
                    }
                }
                if (_this.rightPanel.style.right === '0px') {
                    widthPanel = _this.rightPanel.clientWidth + _this.btnRightPanel.clientWidth;
                    if (widthPanel > document.body.clientWidth) {
                        _this.btnRightPanel.style.right = _this.rightPanel.clientWidth - _this.btnRightPanel.clientWidth + 'px';
                        _this.btnRightPanel.classList.remove("btnPanel");
                        _this.btnRightPanel.classList.add("floatR");
                    }
                    else {
                        _this.btnRightPanel.style.right = _this.rightPanel.offsetWidth + 'px';
                        _this.btnRightPanel.classList.add("btnPanel");
                    }
                }
            }

        }
        extend(panel, event_core);
        extend(panel, ajax_core);

        return panel;
    });
