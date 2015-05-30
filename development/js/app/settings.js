define('settings', [
        'chat',
        'event_core',
        'ajax_core',
        'template_core',

        'text!../html/setting_template.html'
    ],
    function(chat,
             event_core,
             ajax_core,
             template_core,

             setting_template) {

        var settings = function() {
        };

        settings.prototype = {

            initialize: function(options) {
                var _this = this;

                _this.addEventListeners();
                _this.chat = options.chat;
                _this.setting_template = _this.template(setting_template);
                _this.body_outer_container = _this.chat.body_outer_container;
                _this.renderSettings();
                return _this;
            },

            addEventListeners: function() {
                var _this = this;
                _this.removeEventListeners();
            },

            removeEventListeners: function() {
                var _this = this;
            },

            renderSettings: function() {
                var _this = this;
                _this.filter_container = _this.chat.header_container.querySelector('[data-role="filter_container"]');
                if (!_this.filter_container.classList.contains('hide')) {
                    _this.filter_container.classList.add('hide');
                }
                _this.trigger('calcOuterContainerHeight');
                if (_this.chat.data.body_mode === "setting") {
                    _this.trigger('renderMassagesEditor');
                    _this.chat.data.body_mode = "messages";
                    _this.body_outer_container.classList.remove('background');
                } else {
                    _this.body_outer_container.innerHTML = _this.setting_template();
                    _this.chat.data.body_mode = "setting";
                    _this.body_outer_container.classList.add('background');
                }
            }
        }

        extend(settings, event_core);
        extend(settings, ajax_core);
        extend(settings, template_core);


        return settings;
    });
