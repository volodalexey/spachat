define('settings', [
        'chat',
        'event_core',
        'ajax_core',
        'text!../html/setting_template.html'
    ],
    function(chat,
             event_core,
             ajax_core,
             setting_template) {

        var settings = function() {
        };

        settings.prototype = {

            initialize: function(newChat) {
                var _this = this;
                _this.addEventListeners();
                _this.newChat = newChat;
                _this.setting_template = _.template(setting_template);
                _this.body_outer_container = _this.newChat.querySelector('[data-role="body_outer_container"]');
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
                _this.trigger('calcOuterContainerHeight');
                var param = _this.body_outer_container.getAttribute('param-content');
                if (param === "setting") {
                    _this.trigger('renderMassagesEditor');
                    _this.body_outer_container.setAttribute("param-content", "message");
                } else {
                    _this.body_outer_container.innerHTML = _this.setting_template();
                    _this.body_outer_container.setAttribute("param-content", "setting");
                }
            }
        }

        extend(settings, event_core);
        extend(settings, ajax_core);

        return new settings();
    });
