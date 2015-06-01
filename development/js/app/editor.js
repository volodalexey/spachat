define('editor', [
        'event_core',
        'async_core',
        'ajax_core',
        'template_core',

        'text!../html/editor_template.html',
        'text!../html/edit_btn_template.html',
        'text!../html/element/triple_element_template.html',
        'text!../html/element/button_template.html',
        'text!../html/element/label_template.html',
        'text!../html/element/input_template.html'
    ],
    function(event_core,
             async_core,
             ajax_core,
             template_core,

             editor_template,
             edit_btn_template,
             triple_element_template,
             button_template,
             label_template,
             input_template) {

        var editor = function() {
        };

        editor.prototype = {

            initialize: function(options) {
                var _this = this;

                _this.chat = options.chat;

                return _this;
            },

            renderEditorPanel: function(callback) {
                var _this = this;

                _this.editor_container = _this.chat.chatElem.querySelector('[data-role="editor_container"]');

                _this.sendRequest("/mock/editor_navbar_config.json", function(err, res) {
                    if (err) {
                        console.log(err);
                    } else {
                        _this.editor_navbar_config = JSON.parse(res);

                        _this.editor_container.innerHTML += _this.editor_template({
                            editor_navbar_config: _this.editor_navbar_config,
                            triple_element_template: _this.triple_element_template,
                            button_template: _this.button_template,
                            input_template: _this.input_template,
                            label_template: _this.label_template
                        });

                        _this.submit = _this.chat.chatElem.querySelector('[data-role="submit"]');
                        _this.format = _this.chat.chatElem.querySelector('[data-role="format"]');
                        if (_this.format) {
                            _this.btnEditPanel = _this.chat.chatElem.querySelector('[data-action="btnEditPanel"]');
                        }
                        _this.messageElem = _this.chat.chatElem.querySelector('[data-role="message_container"]');
                        _this.loadEditNavbarConfig(function(err) {
                            if (err) {
                                console.log(err);
                                return;
                            }
                            _this.bindContexts();
                            _this.addEventListeners();

                            _this.edit_navbar_config_Filter = _this.edit_navbar_config.filter(function(btn) {
                                return btn.icon
                            });
                            _this.edit_btn_icon = _this.edit_navbar_config_Filter.map(function(btn) {
                                return btn.icon;
                            });
                            _this.edit_btn_icon_config = _this.loadEditNavbarIcon(function(err) {
                                if (err) {
                                    console.log(err);
                                    return;
                                }
                            });
                            callback();
                        });
                    }
                })
            },

            bindContexts: function() {
                var _this = this;
                _this.bindedSendMessage = _this.sendMessage.bind(_this, 'sendMessage');
                _this.bindedRenderEditPanel = _this.renderEditPanel.bind(_this);
            },

            addEventListeners: function() {
                var _this = this;
                _this.removeEventListeners();

                _this.submit.addEventListener('click', _this.bindedSendMessage, false);
                _this.format.addEventListener('click', _this.bindedRenderEditPanel, false);
            },

            removeEventListeners: function() {
                var _this = this;

                _this.submit.removeEventListener('click', _this.bindedSendMessage, false);
                _this.format.removeEventListener('click', _this.bindedRenderEditPanel, false);
            },

            throwEvent: function(name) {
                var _this = this;
                _this.trigger(name);
            },

            renderEditPanel: function() {
                var _this = this;
                if (_this.btnEditPanel) {
                    if (_this.btnEditPanel.innerHTML !== "") {
                        _this.btnEditPanel.innerHTML = "";
                    } else {
                        _this.btnEditPanel.innerHTML = _this.edit_btn_template({
                            config: _this.edit_navbar_config,
                            icons: _this.edit_btn_icon_config
                        });
                        var btnPanel = _this.chat.chatElem.querySelectorAll('[data-role="btnEdit"]');
                        for (var i = 0, l = btnPanel.length; i < l; i++) {
                            if (btnPanel[i].localName === "button") {
                                btnPanel[i].addEventListener('click', _this.addEdit(btnPanel[i]), false);
                            }
                            if (btnPanel[i].localName === "input") {
                                btnPanel[i].addEventListener('change', _this.changeEdit(), false);
                            }
                        }
                    }
                    _this.messages_container = _this.chat.chatElem.querySelector('[data-role="messages_container"]');
                    _this.container = _this.messageElem.querySelector(".container");
                    _this.trigger('calcMessagesContainerHeight');
                    if (_this.messages_container) {
                        _this.messages_container.scrollTop = 9999;
                    }
                }
            },

            addEdit: function(btn) {
                var _this = this;
                return function() {
                    var command = btn.getAttribute("name");
                    var param = btn.hasAttribute("param");

                    _this.container.focus();
                    if (param) {
                        document.execCommand(command, null, "red");
                    } else {
                        document.execCommand(command, null, null);
                    }
                }
            },

            changeEdit: function() {
                var _this = this;
                return function() {
                    _this.addRemoveClassElements([_this.container], "onScroll");
                }
            },

            addRemoveClassElements: function(arElem, className) {
                arElem.forEach(function(elem) {
                    if (elem.classList.contains(className)) {
                        elem.classList.remove(className);
                    } else {
                        elem.classList.add(className);
                    }
                });
            },

            loadEditNavbarConfig: function(callback) {
                var _this = this;
                var name = '/mock/edit_navbar_config.json';
                _this.sendRequest(name, function(err, res) {
                    if (err) {
                        callback(err);
                    } else {
                        _this.edit_navbar_config = JSON.parse(res);
                        callback();
                    }
                })
            },

            loadEditNavbarIcon: function(callback) {
                var _this = this;
                var arrIcon = [];
                var index;
                for (index = 0; index < _this.edit_btn_icon.length; ++index) {
                    var name = '/html/icon/' + _this.edit_btn_icon[index] + '.html';
                    arrIcon.push({"icon": _this.edit_btn_icon[index], "name": name});
                }
                _this.async_eachSeries(arrIcon,
                    function(obj, _callback) {
                        _this.sendRequest(obj.name, function(err, res) {
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
                            callback(allError);
                        } else {
                            _this.edit_btn_icon_config = arrIcon;
                            callback();
                        }
                    }
                );
            },

            // TODO move to editor ?
            sendMessage: function() {
                var _this = this;
                if (!_this.messageElem) {
                    return;
                }

                // TODO replace with data-role
                var newMessage = _this.messageElem.firstElementChild;
                var pattern = /[^\s{0,}$|^$]/;
                if (pattern.test(newMessage.innerText)) {
                    _this.chat.newMessages.addMessage({scrollTop: true}, newMessage.innerHTML);
                    newMessage.innerText = "";
                }
            }
        };

        extend(editor, event_core);
        extend(editor, async_core);
        extend(editor, ajax_core);
        extend(editor, template_core);

        editor.prototype.editor_template = editor.prototype.template(editor_template);
        editor.prototype.edit_btn_template = editor.prototype.template(edit_btn_template);
        editor.prototype.triple_element_template = editor.prototype.template(triple_element_template);
        editor.prototype.button_template = editor.prototype.template(button_template);
        editor.prototype.label_template = editor.prototype.template(label_template);
        editor.prototype.input_template = editor.prototype.template(input_template);

        return editor;
    });
