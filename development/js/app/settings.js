define('settings', [
        'chat',
        'throw_event_core',
        'ajax_core',
        'template_core',
        'indexeddb',
        'render_layout_core',
        'overlay_core',
        'extend_core',
        'switcher_core',

        'text!../templates/setting_template.ejs',
        'text!../templates/element/triple_element_template.ejs',
        'text!../templates/element/location_wrapper_template.ejs',
        'text!../templates/element/button_template.ejs',
        'text!../templates/element/label_template.ejs',
        'text!../templates/element/input_template.ejs'
    ],
    function(chat,
             throw_event_core,
             ajax_core,
             template_core,
             indexeddb,
             render_layout_core,
             overlay_core,
             extend_core,
             switcher_core,

             setting_template,
             triple_element_template,
             location_wrapper_template,
             button_template,
             label_template,
             input_template) {

        var settings = function() {
            this.bindMainContexts();
        };

        settings.prototype = {

            configMap: {
                SETTINGS: '/configs/settings_config.json'
            },

            bindMainContexts: function() {
                var _this = this;
                _this.bindedThrowEventRouter = _this.throwEventRouter.bind(_this);
                _this.bindedDataActionRouter = _this.dataActionRouter.bind(_this);
            },

            addEventListener: function() {
                var _this = this;
                _this.removeEventListeners();
                _this.addRemoveListener('add', _this.body_container, 'click', _this.bindedThrowEventRouter, false);
                _this.addRemoveListener('add', _this.body_container, 'click', _this.bindedDataActionRouter, false);
            },

            removeEventListeners: function() {
                var _this = this;
                _this.addRemoveListener('remove', _this.body_container, 'click', _this.bindedThrowEventRouter, false);
                _this.addRemoveListener('remove', _this.body_container, 'click', _this.bindedDataActionRouter, false);
            },

            cashElements: function() {
                var _this = this;
                _this.sizeButtonsArray = Array.prototype.slice.call(_this.chat.body_container.querySelectorAll('[data-role="sizeChatButton"]'));
                _this.save_custom_width = _this.chat.body_container.querySelector('[data-role="saveAsCustomWidth"]');
                _this.adjust_width = _this.chat.body_container.querySelector('[data-role="adjust_width"]');
                _this.adjust_width_label = _this.chat.body_container.querySelector('[data-role="adjust_width_label"]');
            },

            //override extended throwEvent to use trigger on chat
            throwEvent: function(name, data) {
                this.chat && this.chat.trigger('throw', name, data);
            },

            renderSettings: function(options, chat) {
                var _this = this;
                _this.chat = chat;
                if (!_this.chat.body.previousMode || _this.chat.body.previousMode !== _this.chat.bodyOptions.mode) {
                    _this.body_container = _this.chat.body_container;
                    _this.showSpinner(_this.body_container);
                    _this.body_mode = _this.chat.bodyOptions.mode;
                    _this.elementMap = {
                        "SETTINGS": _this.body_container
                    };
                    var data = {
                        "sendEnter": _this.chat.formatOptions.sendEnter,
                        "size_350": _this.chat.settings_ListOptions.size_350,
                        "size_700": _this.chat.settings_ListOptions.size_700,
                        "size_1050": _this.chat.settings_ListOptions.size_1050,
                        "adjust_width": _this.chat.settings_ListOptions.adjust_width,
                        "size_custom": _this.chat.settings_ListOptions.size_custom,
                        "index": _this.chat.index
                    };
                    _this.renderLayout(data, function(){
                        _this.addEventListener();
                        _this.cashElements();
                        _this.showSizeElement();
                        _this.showSplitterItems();
                    });
                }
            },

            changeSendEnter: function(element) {
                var _this = this;
                if (element.checked) {
                    _this.chat.formatOptions.sendEnter = true;
                } else {
                    _this.chat.formatOptions.sendEnter = false;
                }
            },

            saveAsCustomWidth: function() {
                var _this = this;
                _this.sizeButtonsArray.forEach(function(_input) {
                    if (_input.dataset.value) {
                        if (_this.chat.settings_ListOptions[_input.dataset.key]) {
                            _this.chat.settings_ListOptions.size_custom_value = _input.dataset.value + 'px';
                            _this.chat.settings_ListOptions.size_current = _input.dataset.value + 'px';
                        }
                        _this.chat.settings_ListOptions[_input.dataset.key] = false;
                    } else {
                        _this.chat.settings_ListOptions.size_custom = true;
                    }
                });
                _this.chat.body.previousMode = null;
                _this.renderSettings(null, _this.chat);
            },

            changeAdjustWidth: function(element) {
                var _this = this;
                if (element.checked) {
                    _this.chat.settings_ListOptions.adjust_width = true;
                } else {
                    _this.chat.settings_ListOptions.adjust_width = false;
                }
                _this.showSplitterItems();
            },

            changeChatSize: function(element) {
                var _this = this;
                if (element.dataset.value && _this.chat.chat_element) {
                    _this.chat.chat_element.style.width = element.dataset.value + 'px';
                    _this.chat.settings_ListOptions.size_current = element.dataset.value + 'px';
                }
                if (element.dataset.key){
                    _this.sizeButtonsArray.forEach(function(_input) {
                        if (_input.dataset.key === element.dataset.key) {
                            _this.chat.settings_ListOptions[_input.dataset.key] = true;
                            if (_input.dataset.key === 'size_custom') {
                                _this.chat.chat_element.style.width = _this.chat.settings_ListOptions.size_custom_value;
                                _this.chat.settings_ListOptions.size_current = _this.chat.settings_ListOptions.size_custom_value;
                            }
                        } else {
                            _this.chat.settings_ListOptions[_input.dataset.key] = false;
                        }
                    });
                }
                _this.showSizeElement();
                _this.showSplitterItems();
            },

            showSizeElement: function() {
                var _this = this;
                if (_this.chat.settings_ListOptions.size_custom) {
                    _this.adjust_width.classList.remove('hide');
                    _this.adjust_width_label.classList.remove('hide');
                    _this.save_custom_width.classList.add('hide');
                } else {
                    _this.save_custom_width.classList.remove('hide');
                    _this.adjust_width.classList.add('hide');
                    _this.adjust_width_label.classList.add('hide');
                }
            },

            showSplitterItems: function(chat) {
                var _this = this;
                if (!_this.chat){
                    _this.chat = chat;
                }
                if (_this.chat.settings_ListOptions.size_custom && _this.chat.settings_ListOptions.adjust_width) {
                    _this.toggleShowSplitterItems(true, _this.chat.splitter_left);
                    _this.toggleShowSplitterItems(true, _this.chat.splitter_right);
                } else {
                    _this.toggleShowSplitterItems(false, _this.chat.splitter_left);
                    _this.toggleShowSplitterItems(false, _this.chat.splitter_right);
                }
            },

            destroy: function() {
                var _this = this;
                _this.removeEventListeners();
            }

        };

        extend_core.prototype.inherit(settings, throw_event_core);
        extend_core.prototype.inherit(settings, ajax_core);
        extend_core.prototype.inherit(settings, template_core);
        extend_core.prototype.inherit(settings, render_layout_core);
        extend_core.prototype.inherit(settings, overlay_core);
        extend_core.prototype.inherit(settings, switcher_core);

        settings.prototype.setting_template = settings.prototype.template(setting_template);
        settings.prototype.triple_element_template = settings.prototype.template(triple_element_template);
        settings.prototype.location_wrapper_template = settings.prototype.template(location_wrapper_template);
        settings.prototype.button_template = settings.prototype.template(button_template);
        settings.prototype.label_template = settings.prototype.template(label_template);
        settings.prototype.input_template = settings.prototype.template(input_template);

        settings.prototype.configHandlerMap = {
            SETTINGS: settings.prototype.prepareConfig
        };
        settings.prototype.configHandlerContextMap = {};

        settings.prototype.dataMap = {
            "SETTINGS": ""
        };

        settings.prototype.templateMap = {
            "SETTINGS": settings.prototype.setting_template
        };

        return settings;
    });
