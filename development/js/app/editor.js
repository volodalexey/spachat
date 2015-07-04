define('editor', [
        'event_core',
        'async_core',
        'ajax_core',
        'template_core',
        'indexeddb',
        'render_layout_core',
        'description_core',

        'text!../templates/editor_template.ejs',
        'text!../templates/editor_format_template.ejs',
        'text!../templates/element/triple_element_template.ejs',
        'text!../templates/element/button_template.ejs',
        'text!../templates/element/label_template.ejs',
        'text!../templates/element/input_template.ejs'
    ],
    function(event_core,
             async_core,
             ajax_core,
             template_core,
             indexeddb,
             render_layout_core,
             description_core,

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
                "MAIN_PANEL": '/configs/editor_navbar_config.json',
                "FORMAT_PANEL": '/configs/edit_navbar_config.json'
            },

            bindMainContexts: function() {
                var _this = this;
                _this.bindedThrowEventRouter = _this.throwEventRouter.bind(_this);
                _this.bindedDataActionRouter = _this.dataActionRouter.bind(_this);
                _this.bindedSendEnter = _this.sendEnter.bind(_this);
                _this.bindedShowDescription = _this.showDescription.bind(_this);
            },

            addMainEventListener: function() {
                var _this = this;
                _this.removeMainEventListeners();
                _this.addRemoveListener('add', _this.controls_container, 'click', _this.bindedThrowEventRouter, false);
                _this.addRemoveListener('add', _this.controls_container, 'click', _this.bindedDataActionRouter, false);
                _this.addRemoveListener('add', _this.btnEditPanel, 'click', _this.bindedThrowEventRouter, false);
                _this.addRemoveListener('add', _this.btnEditPanel, 'click', _this.bindedDataActionRouter, false);
                _this.addRemoveListener('add', _this.message_inner_container, 'keypress', _this.bindedSendEnter, false);

                _this.addRemoveListener('add', _this.controls_container, 'mousedown', _this.bindedShowDescription, false);
                _this.addRemoveListener('add', _this.controls_container, 'mousemove', _this.bindedShowDescription, false);
                _this.addRemoveListener('add', _this.controls_container, 'mouseup', _this.bindedShowDescription, false);
                _this.addRemoveListener('add', _this.controls_container, 'touchmove', _this.bindedShowDescription, false);
                _this.addRemoveListener('add', _this.controls_container, 'touchstart', _this.bindedShowDescription, false);
                _this.addRemoveListener('add', _this.controls_container, 'touchend', _this.bindedShowDescription, false);
            },

            removeMainEventListeners: function() {
                var _this = this;
                _this.addRemoveListener('remove', _this.controls_container, 'click', _this.bindedThrowEventRouter, false);
                _this.addRemoveListener('remove', _this.controls_container, 'click', _this.bindedDataActionRouter, false);                _this.addRemoveListener('remove', _this.controls_container, 'click', _this.bindedThrowEventRouter, false);
                _this.addRemoveListener('remove', _this.btnEditPanel, 'click', _this.bindedDataActionRouter, false);                _this.addRemoveListener('remove', _this.controls_container, 'click', _this.bindedThrowEventRouter, false);
                _this.addRemoveListener('remove', _this.btnEditPanel, 'click', _this.bindedDataActionRouter, false);
                _this.addRemoveListener('remove', _this.message_inner_container, 'keypress', _this.bindedSendEnter, false);

                _this.addRemoveListener('remove', _this.controls_container, 'touchmove', _this.bindedShowDescription, false);
                _this.addRemoveListener('remove', _this.controls_container, 'mousemove', _this.bindedShowDescription, false);
                _this.addRemoveListener('remove', _this.controls_container, 'mousedown', _this.bindedShowDescription, false);
                _this.addRemoveListener('remove', _this.controls_container, 'touchstart', _this.bindedShowDescription, false);
                _this.addRemoveListener('remove', _this.controls_container, 'mouseup', _this.bindedShowDescription, false);
                _this.addRemoveListener('remove', _this.controls_container, 'touchend', _this.bindedShowDescription, false);
            },

            cashElements: function() {
                var _this = this;
                _this.controls_container = _this.editor_container.querySelector('[data-role="controls_container"]');
                _this.message_inner_container = _this.editor_container.querySelector('[data-role="message_inner_container"]');
                _this.btnEditPanel = _this.editor_container.querySelector('[data-role="btnEditPanel"]');
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
                        "offScroll": _this.chat.formatOptions.offScroll,
                        "sendEnter": _this.chat.formatOptions.sendEnter,
                        "iSender": _this.chat.formatOptions.iSender
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

            changeSendEnter: function(event) {
                var _this = this;
                if (event.target.checked) {
                    _this.chat.formatOptions.sendEnter = true;
                } else {
                    _this.chat.formatOptions.sendEnter = false;
                }
            },

            changeSender: function(event) {
                var _this = this;
                if (event.target.checked) {
                    _this.chat.formatOptions.iSender = true;
                } else {
                    _this.chat.formatOptions.iSender = false;
                }
            },

            sendEnter: function(event){
                var _this = this;
                if (event.keyCode === 13) {
                    if (_this.chat.formatOptions.sendEnter) {
                        _this.sendMessage();
                    }
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
                var messageInnerHTML = _this.message_inner_container.innerHTML;
                var pattern = /[^\s{0,}$|^$]/; // empty message or \n only
                if (pattern.test(messageInnerHTML)) {
                    _this.chat.messages.addLocalMessage(_this.chat.body.MODE.MESSAGES,
                        {scrollTop: true, messageInnerHTML: messageInnerHTML},
                        function(error, message) {
                            if (error) {
                                console.error(error);
                                return;
                            }

                            _this.chat.messages.renderMessage({ scrollTop : true }, message);
                            // do something with message ?
                        }
                    );
                    _this.message_inner_container.innerHTML = "";
                }
            }
        };

        extend(editor, event_core);
        extend(editor, async_core);
        extend(editor, ajax_core);
        extend(editor, template_core);
        extend(editor, render_layout_core);
        extend(editor, description_core);

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
