define('editor', [
        'event_core',
        'async_core',
        'ajax_core',
        'template_core',
        'indexeddb',

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
             indexeddb,

             editor_template,
             edit_btn_template,
             triple_element_template,
             button_template,
             label_template,
             input_template) {

        var editor = function(options) {
            this.chatElem = options.chat.chatElem;
            this.editor_mode = "MAIN_PANEL";
            this.bindMainContexts();
        };

        editor.prototype = {

            MODE: {
                "MAIN_PANEL": 'MAIN_PANEL',
                "EDITOR_PANEL": 'EDITOR_PANEL'
            },

            configMap: {
                "MAIN_PANEL": '/mock/editor_navbar_config.json',
                "EDITOR_PANEL": '/mock/edit_navbar_config.json'
            },

            bindMainContexts: function() {
                var _this = this;
                _this.bindedTriggerRouter = _this.triggerRouter.bind(_this);
                _this.bindedRenderEditPanel = _this.renderEditPanel.bind(_this);
                _this.bindedSendMessage = _this.sendMessage.bind(_this);
            },

            addMainEventListener: function() {
                var _this = this;
                _this.removeMainEventListeners();
                _this.addRemoveListener('add', _this.controls_container, 'click', _this.bindedTriggerRouter, false);
                _this.on('renderEditPanel', _this.bindedRenderEditPanel, _this);
                _this.on('sendMessage', _this.bindedRenderEditPanel, _this);
            },

            removeMainEventListeners: function() {
                var _this = this;
                _this.addRemoveListener('remove', _this.controls_container, 'click', _this.bindedTriggerRouter, false);
                _this.off('renderEditPanel', _this.bindedRenderEditPanel, _this);
                _this.off('sendMessage', _this.bindedRenderEditPanel, _this);
            },

            cashElements: function() {
                var _this = this;
                _this.controls_container = _this.editor_container.querySelector('[data-role="controls_container"]');
                //_this.messageElem = _this.editor_container.querySelector('[data-role="message_container"]');
                _this.btnEditPanel = _this.controls_container.querySelector('[data-action="btnEditPanel"]');
            },

            renderEditorPanel: function(options, chat) {
                var _this = this;
                _this.chat = chat;
                var t = _this.previousShow;
                var tt = _this.chat.editorOptions.show;
                _this.editor_container = _this.chat.chat_element.querySelector('[data-role="editor_container"]');

                //if (!_this.previousShow ) {
                    if (_this.chat.editorOptions.show) {
                        if (!_this.previousShow ) {
                            _this.previousShow = true;

                            _this.loadConfig(null, function(confErr) {
                                _this.loadData(confErr, function(dataErr, data) {
                                    _this.fillTemplate(dataErr, data, function(templErr) {
                                        if (templErr) {
                                            console.error(templErr);
                                            return;
                                        }
                                        _this.cashElements();
                                        _this.addMainEventListener();
                                        // success
                                    });
                                });
                            });
                        }
                        return;
                    }


                //} else {
                    _this.previousShow = false;
                    _this.editor_container.innerHTML = "";
                //}
                //_this.previousShow = _this.chat.editorOptions.show;

            },

            loadConfig: function(_err, callback) {
                var _this = this;
                if (_err) {
                    callback(_err);
                    return;
                }

                if (_this.configMap[_this.editor_mode]) {
                    _this.sendRequest(_this.configMap[_this.editor_mode], function(err, res) {
                        if (err) {
                            callback(err);
                            return;
                        }
                        _this.edit_navbar_config = JSON.parse(res);
                        callback();
                    });
                } else {
                    callback();
                }
            },

            loadData: function(_err, callback) {
                var _this = this;
                if (_err) {
                    callback(_err);
                    return;
                }

                if (_this.dataMap[_this.editor_mode]) {
                    var collectionDescription = _this.dataMap[_this.editor_mode];
                    if (_this.data) {
                        callback(null, _this.data);
                        return;
                    }

                    indexeddb.getAll(collectionDescription, function(getAllErr, data) {
                        if (getAllErr) {
                            callback(getAllErr);
                        } else {
                            _this.data = data;
                            if (_this.dataHandlerMap[_this.editor_mode]) {
                                callback(null, _this.dataHandlerMap[_this.editor_mode].call(_this, data));
                            } else {
                                callback(null, data);
                            }
                        }
                    });
                } else {
                    callback();
                }
            },

            fillTemplate: function(_err, data, callback) {
                var _this = this;
                if (_err) {
                    callback(_err);
                    return;
                }

                var currentTemplate = _this.templateMap[_this.editor_mode];
                if (currentTemplate) {
                    _this.editor_container.innerHTML += currentTemplate({
                        config: _this.edit_navbar_config,
                        triple_element_template: _this.triple_element_template,
                        button_template: _this.button_template,
                        input_template: _this.input_template,
                        label_template: _this.label_template,
                        textarea_template: _this.textarea_template,
                        mode: _this.editor_mode,
                        data: data
                    });
                    callback();
                }
            },

            renderEditPanel: function() {
                var _this = this;
                if (_this.btnEditPanel) {
                    if (_this.btnEditPanel.innerHTML !== "") {

                        _this.btnEditPanel.innerHTML = "";
                        return;
                    }

                    _this.editor_mode = _this.MODE.EDITOR_PANEL;

                    _this.loadConfig(null, function(confErr) {
                        _this.loadData(confErr, function(dataErr, data) {
                            _this.fillTemplate(dataErr, data, function(templErr) {
                                if (templErr) {
                                    console.error(templErr);
                                    return;
                                }
                                _this.cashElements();
                                _this.addMainEventListener();
                                callback();
                                // success
                            });
                        });
                    });

                    {
                        _this.btnEditPanel.innerHTML = _this.edit_btn_template({
                            config: _this.edit_navbar_config,
                            icons: _this.edit_btn_icon_config
                        });
                        var btnPanel = _this.chatElem.querySelectorAll('[data-role="btnEdit"]');
                        for (var i = 0, l = btnPanel.length; i < l; i++) {
                            if (btnPanel[i].localName === "button") {
                                btnPanel[i].addEventListener('click', _this.addEdit(btnPanel[i]), false);
                            }
                            if (btnPanel[i].localName === "input") {
                                btnPanel[i].addEventListener('change', _this.changeEdit(), false);
                            }
                        }
                    }
                    //_this.messages_container = _this.chatElem.querySelector('[data-role="messages_container"]');
                    _this.container = _this.messageElem.querySelector(".container");
                    _this.trigger('calcMessagesContainerHeight');

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

        editor.prototype.dataMap = {
            "MAIN_PANEL": "",
            "EDITOR_PANEL": ""
        };

        editor.prototype.templateMap = {
            "MAIN_PANEL": editor.prototype.editor_template,
            "EDITOR_PANEL": ''
        };

        return editor;
    });
