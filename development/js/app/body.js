define('body', [
        'chat',
        'event_core',
        'template_core',
        'render_layout_core'

    ],
    function(chat,
             event_core,
             ajax_core,
             template_core) {

        var body = function(options) {
        };

        body.prototype = {

            MODE: {
                SETTING: 'SETTING',
                MESSAGES: 'MESSAGES',
                CONTACT_LIST: 'CONTACT_LIST'
            },

            render: function(options, chat) {
                var _this = this;
                _this.chat = chat;
                if (_this.chat.bodyOptions.show) {

                    switch (_this.chat.bodyOptions.mode) {
                        case _this.MODE.SETTING:
                            _this.chat.settings.renderSettings(options, chat);
                            break;
                        case _this.MODE.CONTACT_LIST:
                            _this.chat.contact_list.renderContactList(options, chat);
                            break;
                        case _this.MODE.MESSAGES:
                            _this.chat.messages.render(options, chat);
                            break;
                    }
                    _this.previousMode = _this.chat.bodyOptions.mode;
                }
            }

        };

        extend(body, event_core);
        extend(body, template_core);

        return body;
    });
