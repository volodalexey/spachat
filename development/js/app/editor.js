define('editor', [
        'event_core',
        'async_core',
        'ajax_core',
        'template_core',
        'indexeddb',
        'render_layout_core',

        'text!../html/editor_template.html',
        'text!../html/editor_format_template.html',
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
             render_layout_core,
             editor_template,
             format_template,
             triple_element_template,
             button_template,
             label_template,
             input_template) {

        var editor = function(options) {
            this.chatElem = options.chat.chatElem;
            this.bindMainContexts();
        };

        editor.prototype = {

            MODE: {
                "MAIN_PANEL": 'MAIN_PANEL',
                "FORMAT_PANEL": 'FORMAT_PANEL'
            },

            configMap: {
                "MAIN_PANEL": '/mock/editor_navbar_config.json',
                "FORMAT_PANEL": '/mock/edit_navbar_config.json'
            },

            bindMainContexts: function() {
                var _this = this;
                _this.bindedThrowEventRouter = _this.throwEventRouter.bind(_this);
                _this.bindedDataActionRouter = _this.dataActionRouter.bind(_this);
            },

            addMainEventListener: function() {
                var _this = this;
                _this.removeMainEventListeners();
                _this.addRemoveListener('add', _this.controls_container, 'click', _this.bindedThrowEventRouter, false);
                _this.addRemoveListener('add', _this.controls_container, 'click', _this.bindedDataActionRouter, false);
            },

            removeMainEventListeners: function() {
                var _this = this;
                _this.addRemoveListener('remove', _this.controls_container, 'click', _this.bindedThrowEventRouter, false);
                _this.addRemoveListener('remove', _this.controls_container, 'click', _this.bindedDataActionRouter, false);
            },

            cashElements: function() {
                var _this = this;
                _this.controls_container = _this.editor_container.querySelector('[data-role="controls_container"]');
                _this.message_inner_container = _this.editor_container.querySelector('[data-role="message_inner_container"]');
                _this.btnEditPanel = _this.controls_container.querySelector('[data-action="btnEditPanel"]');
                _this.buttonFormat = _this.editor_container.querySelector('[data-toggle]');

            },

            render: function(options, chat) {
                var _this = this;
                _this.chat = chat;
                _this.editor_container = _this.chat.chat_element.querySelector('[data-role="editor_container"]');
                if (_this.chat.editorOptions.show) {
                    if (!_this.previousEditorShow) {
                        _this.previousEditorShow = true;
                        _this.body_mode = _this.MODE.MAIN_PANEL;
                        _this.elementMap = {
                            MAIN_PANEL: _this.editor_container
                        };
                        _this.renderLayout(null, function() {
                            _this.cashElements();
                            _this.addMainEventListener();
                            _this.renderFormatPanel();
                        });
                    } else {
                        _this.renderFormatPanel();
                    }
                    return;

                }
                _this.previousEditorShow = false;
                _this.editor_container.innerHTML = "";
            },

            renderFormatPanel: function() {
                var _this = this;
                if (_this.chat.formatOptions.show) {
                    _this.buttonFormat.dataset.toggle = false;
                    _this.body_mode = _this.MODE.FORMAT_PANEL;
                    _this.elementMap = {
                        FORMAT_PANEL: _this.btnEditPanel
                    };
                    var data = {
                        "offScroll": _this.chat.formatOptions.offScroll
                    };
                    _this.renderLayout(data, null);
                } else {
                    _this.btnEditPanel.innerHTML = "";

                }
            },

            addEdit: function(event) {
                var _this = this;
                var command = event.target.dataset.name;
                var param = event.target.dataset.param;
                _this.message_inner_container.focus();
                if (param) {
                    document.execCommand(command, null, "red");
                } else {
                    document.execCommand(command, null, null);
                }
            },

            changeEdit: function() {
                var _this = this;
                if (_this.message_inner_container.classList.contains("onScroll")) {
                    _this.message_inner_container.classList.remove("onScroll");
                    _this.chat.formatOptions.offScroll = false;
                } else {
                    _this.message_inner_container.classList.add("onScroll");
                    _this.chat.formatOptions.offScroll = true;
                }
            },

            // TODO move to editor ?
            sendMessage: function() {
                var _this = this;
                if (!_this.message_inner_container) {
                    return;
                }

                // TODO replace with data-role
                var newMessage = _this.message_inner_container.innerHTML;
                var pattern = /[^\s{0,}$|^$]/;
                if (pattern.test(newMessage)) {
                    _this.chat.messages.addMessage({scrollTop: true}, newMessage);
                    _this.message_inner_container.innerHTML = "";
                }
            }
        };

        extend(editor, event_core);
        extend(editor, async_core);
        extend(editor, ajax_core);
        extend(editor, template_core);
        extend(editor, render_layout_core);

        editor.prototype.editor_template = editor.prototype.template(editor_template);
        editor.prototype.format_template = editor.prototype.template(format_template);
        editor.prototype.triple_element_template = editor.prototype.template(triple_element_template);
        editor.prototype.button_template = editor.prototype.template(button_template);
        editor.prototype.label_template = editor.prototype.template(label_template);
        editor.prototype.input_template = editor.prototype.template(input_template);

        editor.prototype.dataMap = {
            "MAIN_PANEL": "",
            "FORMAT_PANEL": ""
        };

        editor.prototype.templateMap = {
            "MAIN_PANEL": editor.prototype.editor_template,
            "FORMAT_PANEL": editor.prototype.format_template
        };

        return editor;
    });
