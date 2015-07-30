define('contact_list', [
        'throw_event_core',
        'ajax_core',
        'template_core',
        'render_layout_core',
        'overlay_core',
        //
        'indexeddb',
        'users_bus',
        'chats_bus',
        //
        'text!../templates/contact_list_template.ejs',
        'text!../templates/element/triple_element_template.ejs',
        'text!../templates/element/button_template.ejs',
        'text!../templates/element/label_template.ejs',
        'text!../templates/element/input_template.ejs'
    ],
    function(throw_event_core,
             ajax_core,
             template_core,
             render_layout_core,
             overlay_core,
             //
             indexeddb,
             users_bus,
             chats_bus,
             //
             contact_list_template,
             triple_element_template,
             button_template,
             label_template,
             input_template) {

        var contact_list = function(options) {
        };

        contact_list.prototype = {

            configMap: {
                CONTACT_LIST: '/configs/contact_list_config.json'
            },

            renderContactList: function(options, chat) {
                var _this = this;
                _this.chat = chat;

                if (!_this.chat.body.previousMode || _this.chat.body.previousMode !== _this.chat.bodyOptions.mode) {
                    _this.showSpinner(_this.chat.body_container);
                    _this.getContactsId(function(error, contactsInfo) {
                        if (error) {
                            console.error(error);
                            return;
                        }

                        _this.chat.listOptions.previousFinal = 0;
                        _this.chat.listOptions.previousStart = 0;
                        _this.chat.body_container.classList.add('background');
                        _this.body_mode = _this.chat.bodyOptions.mode;
                        _this.elementMap = {
                            "CONTACT_LIST": _this.chat.body_container
                        };
                        contactsInfo = _this.chat.body.limitationQuantityRecords(contactsInfo);

                        _this.renderLayout(contactsInfo, null);
                    });

                }
            },

            getContactsId: function(_callback) {
                var _this = this;
                indexeddb.getByKeyPath(
                    chats_bus.collectionDescription,
                    _this.chat.chatId,
                    function(getError, chat) {
                        if (getError) {
                            console.error(getError);
                            return;
                        }

                        if (chat) {
                            chat.userIds = users_bus.excludeUser(null, chat.userIds);
                            users_bus.getContactsInfo(null, chat.userIds, _callback);
                        } else {
                            _this.body_container.innerHTML = ("Chat with id" + _this.chat.chatId + "not find");
                        }
                    }
                );
            },


            destroy: function() {
                var _this = this;
            }
        };

        extend(contact_list, throw_event_core);
        extend(contact_list, ajax_core);
        extend(contact_list, template_core);
        extend(contact_list, render_layout_core);
        extend(contact_list, overlay_core);

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
