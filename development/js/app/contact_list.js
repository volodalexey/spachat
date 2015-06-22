define('contact_list', [
        'event_core',
        'ajax_core',
        'template_core',
        'indexeddb',
        'render_layout_core',

        'text!../html/contact_list_template.html',
        'text!../html/element/triple_element_template.html',
        'text!../html/element/button_template.html',
        'text!../html/element/label_template.html',
        'text!../html/element/input_template.html'
    ],
    function(event_core,
             ajax_core,
             template_core,
             indexeddb,
             render_layout_core,

             contact_list_template,
             triple_element_template,
             button_template,
             label_template,
             input_template) {

        var contact_list = function(options) {

        };

        contact_list.prototype = {

            configMap: {
                CONTACT_LIST: '/mock/contact_list_config.json'
            },

            renderContactList: function(options, chat) {
                var _this = this;
                _this.chat = chat;

                if (!_this.chat.body.previousMode || _this.chat.body.previousMode !== _this.chat.bodyOptions.mode) {
                    _this.body_container = _this.chat.body_container;
                    _this.body_container.classList.add('background');
                    _this.body_mode = _this.chat.bodyOptions.mode;
                    _this.elementMap = {
                        "CONTACT_LIST": _this.body_container
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

        extend(contact_list, event_core);
        extend(contact_list, ajax_core);
        extend(contact_list, template_core);
        extend(contact_list, render_layout_core);

        contact_list.prototype.contact_list_template = contact_list.prototype.template(contact_list_template);
        contact_list.prototype.triple_element_template = contact_list.prototype.template(triple_element_template);
        contact_list.prototype.button_template = contact_list.prototype.template(button_template);
        contact_list.prototype.label_template = contact_list.prototype.template(label_template);
        contact_list.prototype.input_template = contact_list.prototype.template(input_template);

        contact_list.prototype.dataMap = {
            "CONTACT_LIST": ""
        };

        contact_list.prototype.templateMap = {
            "CONTACT_LIST": contact_list.prototype.contact_list_template
        };

        return contact_list;
    });
