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

            renderSettings: function(options) {
                var _this = this;
                _this.chat = options.chat;
                this.body_outer_container = options.chat.body_outer_container;
                this.header_container = options.chat.chat_element.querySelector('[data-role="header_outer_container"]');
                _this.filter_container = _this.header_container.querySelector('[data-role="filter_container"]');

                if (!_this.filter_container.classList.contains('hide')) {
                    _this.filter_container.classList.add('hide');
                }
                //_this.trigger('calcOuterContainerHeight');
                if (_this.chat.mode === _this.chat.MODE.SETTING) {
                    //_this.trigger('renderMassagesEditor');
                    _this.chat.mode = _this.chat.MODE.MESSAGES_DISCONNECTED;
                    _this.body_outer_container.innerHTML = "";
                    _this.body_outer_container.classList.remove('background');
                    _this.trigger('renderMassagesEditor');
                } else {
                    _this.chat.mode = _this.chat.MODE.SETTING;
                    _this.body_outer_container.classList.add('background');
                    _this.body_mode = _this.chat.mode;
                    _this.elementMap = {
                        "SETTING": _this.body_outer_container
                    };
                    _this.renderLayout(null, null);
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
