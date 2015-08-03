define('settings', [
        'chat',
        'throw_event_core',
        'ajax_core',
        'template_core',
        'indexeddb',
        'render_layout_core',
        'overlay_core',
        'extend_core',

        'text!../templates/setting_template.ejs',
        'text!../templates/element/triple_element_template.ejs',
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

             setting_template,
             triple_element_template,
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
                        "sendEnter": _this.chat.formatOptions.sendEnter
                    };
                    _this.renderLayout(data, function(){
                        _this.addEventListener();
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

        settings.prototype.setting_template = settings.prototype.template(setting_template);
        settings.prototype.triple_element_template = settings.prototype.template(triple_element_template);
        settings.prototype.button_template = settings.prototype.template(button_template);
        settings.prototype.label_template = settings.prototype.template(label_template);
        settings.prototype.input_template = settings.prototype.template(input_template);

        settings.prototype.configHandlerMap = {};
        settings.prototype.configHandlerContextMap = {};

        settings.prototype.dataMap = {
            "SETTINGS": ""
        };

        settings.prototype.templateMap = {
            "SETTINGS": settings.prototype.setting_template
        };

        return settings;
    });
