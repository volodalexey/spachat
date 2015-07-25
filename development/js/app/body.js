define('body', [
        'chat',
        'throw_event_core',
        'template_core',
        'render_layout_core',
        'ajax_core',
        'users',

        'text!../templates/element/triple_element_template.ejs',
        'text!../templates/element/button_template.ejs',
        'text!../templates/element/label_template.ejs',
        'text!../templates/element/input_template.ejs',
        'text!../templates/element/textarea_template.ejs',
        'text!../templates/detail_view_container_template.ejs',
        'text!../templates/chat_info_template.ejs',
        'text!../templates/panel_users_template.ejs',
        'text!../templates/user_info_template.ejs'
    ],
    function(chat,
             throw_event_core,
             template_core,
             render_layout_core,
             ajax_core,
             users,
             triple_element_template,
             button_template,
             label_template,
             input_template,
             textarea_template,
             detail_view_container_template,
             chat_info_template,
             panel_users_template,
             user_info_template) {

        var body = function(options) {
        };

        body.prototype = {

            configMap: {
                "USER_INFO_EDIT": '/configs/user_info_config.json',
                "USER_INFO_SHOW": '/configs/user_info_config.json',
                "CREATE_CHAT": '/configs/chats_info_config.json',
                "JOIN_CHAT": '/configs/chats_info_config.json',
                "CHATS": '/configs/chats_info_config.json',
                "USERS": '/configs/users_info_config.json',
                "DETAIL_VIEW": '/configs/chats_info_config.json'
            },
            /*
             collectionDescriptionChats: {
             "id": 'chats',
             "db_name": 'chats',
             "table_names": ['chats'],
             "db_version": 1,
             "keyPath": "chatId"
             },*/

            MODE: {
                SETTING: 'SETTING',
                MESSAGES: 'MESSAGES',
                CONTACT_LIST: 'CONTACT_LIST',
                LOGGER: 'LOGGER',

                CREATE_CHAT: 'CREATE_CHAT',
                JOIN_CHAT: 'JOIN_CHAT',
                CHATS: 'CHATS',
                USERS: 'USERS',

                DETAIL_VIEW: 'DETAIL_VIEW',

                USER_INFO_EDIT: 'USER_INFO_EDIT',
                USER_INFO_SHOW: 'USER_INFO_SHOW'
            },

            render: function(options, _module) {
                var _this = this;
                _this.module = _module;
                if (_this.module.bodyOptions.show) {
                    switch (_this.module.bodyOptions.mode) {
                        case _this.MODE.SETTING:
                            _this.module.settings.renderSettings(options, _module);
                            break;
                        case _this.MODE.CONTACT_LIST:
                            _this.module.contact_list.renderContactList(options, _module);
                            break;
                        case _this.MODE.MESSAGES:
                        case _this.MODE.LOGGER:
                            _this.module.messages.render(options, _module);
                            break;
                        case _this.MODE.USER_INFO_SHOW:
                            _this.elementMap = {
                                "USER_INFO_SHOW": _this.module.panel_body
                            };
                            _this.dataMap = {
                                "USER_INFO_SHOW": users.collectionDescription
                            };
                            _this.body_mode = _this.MODE.USER_INFO_SHOW;
                            _this.renderLayout(null, null);
                            break;
                        case _this.MODE.USER_INFO_EDIT:
                            _this.elementMap = {
                                "USER_INFO_EDIT": _this.module.panel_body
                            };
                            _this.dataMap = {
                                "USER_INFO_EDIT": users.collectionDescription
                            };
                            _this.body_mode = _this.MODE.USER_INFO_EDIT;
                            var data = {
                                "user": _this.module.user
                            };
                            _this.renderLayout(data, function() {
                                _this.module.cashBodyElement();
                            });
                            break;
                        case _this.MODE.CREATE_CHAT:
                            _this.elementMap = {
                                "CREATE_CHAT": _this.module.panel_body
                            };
                            _this.body_mode = _this.MODE.CREATE_CHAT;
                            _this.renderLayout(null, null);
                            break;
                        case _this.MODE.JOIN_CHAT:
                            _this.elementMap = {
                                "JOIN_CHAT": _this.module.panel_body
                            };
                            _this.body_mode = _this.MODE.JOIN_CHAT;
                            _this.renderLayout(null, null);
                            break;
                        case _this.MODE.CHATS:
                            _this.elementMap = {
                                "CHATS": _this.module.panel_body
                            };
                            _this.dataMap = {
                                "CHATS": _this.module.collectionDescription
                            };
                            _this.body_mode = _this.MODE.CHATS;
                            _this.renderLayout(options, null);
                            break;
                        case _this.MODE.USERS:
                            _this.elementMap = {
                                "USERS": _this.module.panel_body
                            };
                            _this.body_mode = _this.MODE.USERS;
                            _this.renderLayout(null, null);
                            break;
                        case _this.MODE.DETAIL_VIEW:
                            _this.elementMap = {
                                "DETAIL_VIEW": options.detail_view
                            };
                            _this.dataMap = {
                                "DETAIL_VIEW": _this.module.collectionDescription
                            };
                            _this.body_mode = _this.MODE.DETAIL_VIEW;
                            _this.renderLayout(options, function() {
                                _this.module.rotatePointer(options);
                            });
                            break;
                    }
                    _this.previousMode = _this.module.bodyOptions.mode;
                }
            },

            limitationQuantityRecords: function(data) {
                var _this = this;
                if (data.length) {
                    if (_this.module.messagesOptions.final > data.length || !_this.module.messagesOptions.final) {
                        _this.module.messagesOptions.final = data.length;
                    }
                }
                if (_this.module.messagesOptions.previousStart !== _this.module.messagesOptions.start ||
                    _this.module.messagesOptions.previousFinal !== _this.module.messagesOptions.final) {
                    _this.module.panel_body.innerHTML = "";
                    _this.module.messagesOptions.previousStart = _this.module.messagesOptions.start;
                    _this.module.messagesOptions.previousFinal = _this.module.messagesOptions.final;
                }
                data = data.slice(_this.module.messagesOptions.start, _this.module.messagesOptions.final);
                return data;
            },

            usersFilter: function(options, users) {
                var _this = this;
                users.every(function(_user) {
                    if (_user.userId === _this.module.navigator.userId) {
                        _this.module.user = _user;
                    }
                    return !_this.module.user;
                });
                return _this.module.user;
            },

            chatsFilter: function(options, chats) {
                var chat_info;
                chats.every(function(_chat) {
                    if (_chat.chatId === options.chat_id_value) {
                        chat_info = _chat;
                    }
                    return !chat_info;
                });
                return chat_info;
            },

            transferData: function(options, data) {
                var _this = this;

                data = this.limitationQuantityRecords(data);
                var dataUpdated = {
                    "data": data,
                    "detail_view_template": _this.detail_view_container_template,
                    "openChatsInfoArray": _this.module.openChatsInfoArray
                };
                return dataUpdated;
            },

            destroy: function() {
                var _this = this;
            }

        };

        extend(body, throw_event_core);
        extend(body, template_core);
        extend(body, render_layout_core);
        extend(body, ajax_core);

        body.prototype.chat_info_template = body.prototype.template(chat_info_template);
        body.prototype.user_info_template = body.prototype.template(user_info_template);
        body.prototype.triple_element_template = body.prototype.template(triple_element_template);
        body.prototype.button_template = body.prototype.template(button_template);
        body.prototype.label_template = body.prototype.template(label_template);
        body.prototype.input_template = body.prototype.template(input_template);
        body.prototype.textarea_template = body.prototype.template(textarea_template);
        body.prototype.panel_users_template = body.prototype.template(panel_users_template);
        body.prototype.detail_view_container_template = body.prototype.template(detail_view_container_template);

        body.prototype.dataMap = {
            "USER_INFO_EDIT": '',
            "USER_INFO_SHOW": '',
            "CREATE_CHAT": '',
            'JOIN_CHAT': '',
            "CHATS": '',
            "USERS": '',
            "DETAIL_VIEW": '',
            "FILTER_MY_CHATS": ''
        };

        body.prototype.templateMap = {
            "USER_INFO_EDIT": body.prototype.user_info_template,
            "USER_INFO_SHOW": body.prototype.user_info_template,
            "CREATE_CHAT": body.prototype.chat_info_template,
            "JOIN_CHAT": body.prototype.chat_info_template,
            "CHATS": body.prototype.chat_info_template,
            "USERS": body.prototype.panel_users_template,
            "DETAIL_VIEW": body.prototype.detail_view_container_template,
            "FILTER_MY_CHATS": body.prototype.filter_my_chats_template
        };

        body.prototype.dataHandlerMap = {
            "USER_INFO_EDIT": body.prototype.usersFilter,
            "USER_INFO_SHOW": body.prototype.usersFilter,
            "CREATE_CHAT": null,
            "JOIN_CHAT": null,
            "CHATS": body.prototype.transferData,
            "USERS": null,
            "DETAIL_VIEW": body.prototype.chatsFilter,
            "FILTER_CHATS": ''
        };

        return body;
    });
