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

            body_left_panel_template: _.template(body_left_panel_template),
            body_right_panel_template: _.template(body_right_panel_template),
            user_info_template: _.template(user_info_template),
            triple_element_template: _.template(triple_element_template),
            button_template: _.template(button_template),
            label_template: _.template(label_template),
            input_template: _.template(input_template),

            initialize: function() {
                var _this = this;

                _this.leftPanel = document.querySelector('[data-action="leftPanel"]');
                _this.btnLeftPanel = _this.leftPanel.querySelector('[data-action="btnLeftPanel"]');
                _this.bodyLeftPanel = _this.leftPanel.querySelector('[data-role="body_left_panel"]');
                _this.btnLeftPanel.addEventListener('click', _this.workLeftPanel.bind(_this), false);
                _this.leftPanel.style.left = -_this.leftPanel.offsetWidth + 'px';
                _this.leftPanel.style.maxWidth = window.innerWidth + 'px';
                _this.btnLeftPanel.style.left = _this.leftPanel.offsetWidth + 'px';

                _this.rightPanel = document.querySelector('[data-action="rightPanel"]');
                _this.btnRightPanel = _this.rightPanel.querySelector('[data-action="btnRightPanel"]');
                _this.bodyRightPanel = _this.rightPanel.querySelector('[data-role="body_right_panel"]');
                _this.rightPanel.style.right = -_this.rightPanel.offsetWidth + 'px';
                _this.rightPanel.style.maxWidth = window.innerWidth + 'px';
                _this.btnRightPanel.style.right = _this.rightPanel.offsetWidth + 'px';
                _this.btnRightPanel.addEventListener('click', _this.workRightPanel.bind(_this), false);

                _this.leftPanel.classList.add("animate");
                _this.rightPanel.classList.add("animate");
                _this.bodyLeftPanel.classList.remove("hidden");
                _this.bodyRightPanel.classList.remove("hidden");
                return _this;
            },

            addListener: function() {
                var _this = this;
                var addChat = _this.bodyLeftPanel.querySelector('button[data-action="addChat"]');
                if (addChat) {
                    addChat.addEventListener('click', _this.throwEvent.bind(_this, 'addNewChat'), false);
                }
                var clearStory = _this.bodyLeftPanel.querySelector('[data-action="btnClearListMessage"]');
                if (clearStory) {
                    clearStory.addEventListener('click', _this.throwEvent.bind(_this, 'clearStory'), false);
                }
                var userInfo = _this.rightPanel.querySelector('[data-action="btn_user_info"]');
                if (userInfo) {
                    userInfo.addEventListener('click', _this.renderUserInfo.bind(_this), false);
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
                                _this.leftPanel.style.left = 0 + 'px';
                                _this.bodyLeftPanel.innerHTML = _this.body_left_panel_template({
                                    config: _this.panel_config,
                                    triple_element_template: _this.triple_element_template,
                                    button_template: _this.button_template,
                                    input_template: _this.input_template,
                                    label_template: _this.label_template
                                });
                                _this.resizePanel();
                                _this.addListener();
                            } else {
                                _this.leftPanel.style.left = -_this.leftPanel.offsetWidth + 'px';
                                _this.btnLeftPanel.style.left = _this.leftPanel.offsetWidth + 'px';
                                _this.btnLeftPanel.classList.add("btnPanel");
                                _this.bodyLeftPanel.innerHTML = "";
                            }
                        } else {
                            if (_this.leftPanel.style.left !== '0px') {
                                _this.leftPanel.style.left = 0 + 'px';
                                _this.bodyLeftPanel.innerHTML = _this.body_left_panel_template({
                                    config: _this.panel_config,
                                    triple_element_template: _this.triple_element_template,
                                    button_template: _this.button_template,
                                    input_template: _this.input_template,
                                    label_template: _this.label_template
                                });
                                _this.addListener();
                            } else {
                                _this.leftPanel.style.left = -_this.leftPanel.offsetWidth + 'px';
                                _this.bodyLeftPanel.innerHTML = "";
                            }
                        }

                    }
                })
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
                                _this.rightPanel.style.right = 0 + 'px';
                                _this.bodyRightPanel.innerHTML = _this.body_right_panel_template({
                                    config: _this.panel_config,
                                    triple_element_template: _this.triple_element_template,
                                    button_template: _this.button_template,
                                    input_template: _this.input_template,
                                    label_template: _this.label_template
                                });
                                _this.addListener();
                                _this.resizePanel();
                            } else {
                                _this.rightPanel.style.right = -_this.rightPanel.offsetWidth + 'px';
                                _this.btnRightPanel.style.right = _this.rightPanel.offsetWidth + 'px';
                                _this.btnRightPanel.classList.add("btnPanel");
                                _this.bodyRightPanel.innerHTML = "";
                            }
                        } else {
                            if (_this.rightPanel.style.right !== '0px') {
                                _this.rightPanel.style.right = 0 + 'px';
                                _this.bodyRightPanel.innerHTML = _this.body_right_panel_template({
                                    config: _this.panel_config,
                                    triple_element_template: _this.triple_element_template,
                                    button_template: _this.button_template,
                                    input_template: _this.input_template,
                                    label_template: _this.label_template
                                });
                                _this.addListener();
                            } else {
                                _this.rightPanel.style.right = -_this.rightPanel.offsetWidth + 'px';
                                _this.bodyRightPanel.innerHTML = "";
                            }
                        }
                    }
                })
            },

            renderUserInfo: function() {
                var _this = this;
                _this.user_info_container = _this.rightPanel.querySelector('[data-role="user_info_container"]');

                if(_this.user_info_container.innerHTML === ""){
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

                //_this.user_info_container = _this.bodyLeftPanel.querySelector('[data-role="user_info_container"]');
                //if(! _this.user_info_container){
                //
                //} else {
                //   //_this.body_right_panel_template.removeChild(_this.user_info_container);
                //}
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

        return new panel();
    });
