define('content', [
        'chat',
        'event_core',
        'template_core',
        'render_layout_core'

    ],
    function(chat,
             event_core,
             ajax_core,
             template_core) {

        var content = function(options) {
        };

        content.prototype = {

            MODE: {
                SETTING: 'SETTING',
                MESSAGES: 'MESSAGES',
                CONTACT_LIST: 'CONTACT_LIST'
            },

            render: function(options, chat) {
                var _this = this;
                _this.chat = chat;
                if (_this.chat.contentOptions.show) {

                    switch (_this.chat.contentOptions.mode) {
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

                }
            }

        };

        extend(content, event_core);
        extend(content, template_core);

        return content;
    });
