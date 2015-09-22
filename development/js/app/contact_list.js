define('contact_list', [
        'throw_event_core',
        'ajax_core',
        'template_core',
        'render_layout_core',
        'extend_core',
        //
        'indexeddb',
        'users_bus',
        'chats_bus',
        //
        'text!../templates/contact_list_template.ejs',
        'text!../templates/element/triple_element_template.ejs',
        'text!../templates/element/button_template.ejs',
        'text!../templates/element/label_template.ejs',
        'text!../templates/element/input_template.ejs',
        //
        'text!../configs/contact_list_config.json'
    ],
    function(throw_event_core,
             ajax_core,
             template_core,
             render_layout_core,
             extend_core,
             //
             indexeddb,
             users_bus,
             chats_bus,
             //
             contact_list_template,
             triple_element_template,
             button_template,
             label_template,
             input_template,
            //
             contact_list_config) {

        var contact_list = function(options) {
        };

        contact_list.prototype = {

            contact_list_config: JSON.parse(contact_list_config),

            renderContactList: function(options, chat) {
                var _this = this;
                _this.chat = chat;
                var changeMode = _this.chat.body.previousMode !== _this.chat.bodyOptions.mode;
                chats_bus.getChatContacts(_this.chat.chat_id, function(error, contactsInfo) {
                    if (error) {
                        console.error(error);
                        return;
                    }

                    contactsInfo = _this.chat.body.limitationQuantityRecords(contactsInfo, changeMode);
                    if (!contactsInfo.data || !contactsInfo.data.length) {
                        _this.chat.body_container.innerHTML = "";
                        return;
                    }
                    if (contactsInfo.needRender) {
                        _this.body_mode = _this.chat.bodyOptions.mode;
                        _this.elementMap = {
                            "CONTACT_LIST": _this.chat.body_container
                        };
                        _this.renderLayout(contactsInfo.data, null);
                    }

                });
            },

            destroy: function() {
                var _this = this;
            }
        };

        extend_core.prototype.inherit(contact_list, throw_event_core);
        extend_core.prototype.inherit(contact_list, ajax_core);
        extend_core.prototype.inherit(contact_list, template_core);
        extend_core.prototype.inherit(contact_list, render_layout_core);

        contact_list.prototype.contact_list_template = contact_list.prototype.template(contact_list_template);
        contact_list.prototype.triple_element_template = contact_list.prototype.template(triple_element_template);
        contact_list.prototype.button_template = contact_list.prototype.template(button_template);
        contact_list.prototype.label_template = contact_list.prototype.template(label_template);
        contact_list.prototype.input_template = contact_list.prototype.template(input_template);

        contact_list.prototype.configMap = {
            CONTACT_LIST: contact_list.prototype.contact_list_config
        };

        contact_list.prototype.dataMap = {
            "CONTACT_LIST": ""
        };

        contact_list.prototype.templateMap = {
            "CONTACT_LIST": contact_list.prototype.contact_list_template
        };

        contact_list.prototype.configHandlerMap = {
        };
        contact_list.prototype.configHandlerContextMap = {};

        return contact_list;
    });
