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
                        "size_custom": _this.chat.settings_ListOptions.size_custom,
                        "index": _this.chat.index
                    };
                    _this.renderLayout(data, function(){
                        _this.addEventListener();
                        _this.cashElements();
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

            changeChatSize: function(element) {
                var _this = this;
                if (element.dataset.value && _this.chat.chat_element) {
                    _this.chat.chat_element.style.width = element.dataset.value + 'px';
                    _this.toggleShowSplitterItems(false, _this.chat.splitter_left);
                    _this.toggleShowSplitterItems(false, _this.chat.splitter_right);
                } else {
                    _this.toggleShowSplitterItems(true, _this.chat.splitter_left);
                    _this.toggleShowSplitterItems(true, _this.chat.splitter_right);
                }
                if (element.dataset.key){
                    _this.sizeButtonsArray.forEach(function(_button) {
                        if (_button.dataset.key === element.dataset.key) {
                            _this.chat.settings_ListOptions[_button.dataset.key] = true;
                            _this.chat.settings_ListOptions.size_current = element.dataset.value + 'px';
                        } else {
                            _this.chat.settings_ListOptions[_button.dataset.key] = false;
                        }
                    });
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
