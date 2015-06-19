define('settings', [
        'chat',
        'event_core',
        'ajax_core',
        'template_core',
        'indexeddb',
        'render_layout_core',

        'text!../html/setting_template.html',
        'text!../html/element/triple_element_template.html',
        'text!../html/element/button_template.html',
        'text!../html/element/label_template.html',
        'text!../html/element/input_template.html'
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

                if (!_this.previewMode || _this.previewMode !== _this.chat.contentOptions.mode) {
                    _this.body_content_container = _this.chat.body_content_container;
                    _this.body_content_container.classList.add('background');
                    _this.body_mode = _this.chat.contentOptions.mode;
                    _this.elementMap = {
                        "SETTING": _this.body_content_container
                    };
                    _this.renderLayout(null, null);
                }

                _this.previewMode = _this.chat.contentOptions.mode;
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
