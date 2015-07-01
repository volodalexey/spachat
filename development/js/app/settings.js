define('settings', [
        'chat',
        'event_core',
        'ajax_core',
        'template_core',
        'indexeddb',
        'render_layout_core',

        'text!../templates/setting_template.ejs',
        'text!../templates/element/triple_element_template.ejs',
        'text!../templates/element/button_template.ejs',
        'text!../templates/element/label_template.ejs',
        'text!../templates/element/input_template.ejs'
    ],
    function(chat,
             event_core,
             ajax_core,
             template_core,
             indexeddb,
             render_layout_core,

             setting_template,
             triple_element_template,
             button_template,
             label_template,
             input_template) {

        var settings = function(options) {

        };

        settings.prototype = {

            configMap: {
                SETTING: ''
            },

            renderSettings: function(options, chat) {
                var _this = this;
                _this.chat = chat;

                if (!_this.chat.body.previousMode || _this.chat.body.previousMode !== _this.chat.bodyOptions.mode) {
                    _this.chat.messagesOptions.previousFinal = 0;
                    _this.chat.messagesOptions.previousStart = 0;
                    _this.body_container = _this.chat.body_container;
                    _this.body_container.classList.add('background');
                    _this.body_mode = _this.chat.bodyOptions.mode;
                    _this.elementMap = {
                        "SETTING": _this.body_container
                    };
                    _this.renderLayout(null, null);
                } else {
                    _this.chat.switchModes([
                        {
                            'chat_part':'body',
                            'newMode': _this.chat.body.MODE.MESSAGES
                        }
                    ]);
                }
            }

        };

        extend(settings, event_core);
        extend(settings, ajax_core);
        extend(settings, template_core);
        extend(settings, render_layout_core);

        settings.prototype.setting_template = settings.prototype.template(setting_template);
        settings.prototype.triple_element_template = settings.prototype.template(triple_element_template);
        settings.prototype.button_template = settings.prototype.template(button_template);
        settings.prototype.label_template = settings.prototype.template(label_template);
        settings.prototype.input_template = settings.prototype.template(input_template);

        settings.prototype.dataMap = {
            "SETTING": ""
        };

        settings.prototype.templateMap = {
            "SETTING": settings.prototype.setting_template
        };

        return settings;
    });
