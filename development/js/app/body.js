define('body', [
        'throw_event_core',
        'template_core',
        'render_layout_core',
        'ajax_core',
        'overlay_core',
        'extend_core',
        //
        'users_bus',
        'chats_bus',
        //
        'text!../templates/element/triple_element_template.ejs',
        'text!../templates/element/button_template.ejs',
        'text!../templates/element/label_template.ejs',
        'text!../templates/element/input_template.ejs',
        'text!../templates/element/textarea_template.ejs',
        'text!../templates/detail_view_container_template.ejs',
        'text!../templates/chat_info_template.ejs',
        'text!../templates/panel_users_template.ejs',
        'text!../templates/user_info_template.ejs',
        'text!../templates/join_locations_template.ejs',
        'text!../templates/element/location_wrapper_template.ejs'
    ],
    function(
        throw_event_core,
        template_core,
        render_layout_core,
        ajax_core,
        overlay_core,
        extend_core,
        //
        users_bus,
        chats_bus,
        //
        triple_element_template,
        button_template,
        label_template,
        input_template,
        textarea_template,
        detail_view_container_template,
        chat_info_template,
        panel_users_template,
        user_info_template,
        join_locations_template,
        location_wrapper_template
    ) {

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
                "JOIN_USER": '/configs/users_info_config.json',
                "DETAIL_VIEW": '/configs/chats_info_config.json',
                "CREATE_BLOG": '',
                "JOIN_BLOG": '',
                "BLOGS": '',
                "CONNECTIONS": ''
            },

            MODE: {
                SETTINGS: 'SETTINGS',
                MESSAGES: 'MESSAGES',
                CONTACT_LIST: 'CONTACT_LIST',
                LOGGER: 'LOGGER',

                CREATE_CHAT: 'CREATE_CHAT',
                JOIN_CHAT: 'JOIN_CHAT',
                CHATS: 'CHATS',
                USERS: 'USERS',
                JOIN_USER: 'JOIN_USER',

                CREATE_BLOG: 'CREATE_BLOG',
                JOIN_BLOG: 'JOIN_BLOG',
                BLOGS: 'BLOGS',

                DETAIL_VIEW: 'DETAIL_VIEW',
                USER_INFO_EDIT: 'USER_INFO_EDIT',
                USER_INFO_SHOW: 'USER_INFO_SHOW',
                CONNECTIONS: 'CONNECTIONS'
            },

            render: function(options, _module, callback) {
                var _this = this;
                _this.module = _module;
                if (_this.module.bodyOptions.show) {
                    switch (_this.module.bodyOptions.mode) {
                        case _this.MODE.SETTINGS:
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
                            users_bus.getMyInfo(options, function(error, options, userInfo) {
                                if (error) {
                                    _this.module.body_container.innerHTML = error;
                                    return;
                                }
                                _this.elementMap = {
                                    "USER_INFO_SHOW": _this.module.body_container
                                };
                                _this.body_mode = _this.MODE.USER_INFO_SHOW;
                                _this.module.user = userInfo;
                                _this.renderLayout(userInfo, null);
                            });
                            break;
                        case _this.MODE.USER_INFO_EDIT:
                                _this.elementMap = {
                                    "USER_INFO_EDIT": _this.module.body_container
                                };
                                _this.body_mode = _this.MODE.USER_INFO_EDIT;
                                _this.renderLayout( _this.module.user, function() {
                                    _this.module.cashBodyElement();
                                });
                            break;
                        case _this.MODE.CREATE_CHAT:
                            _this.elementMap = {
                                "CREATE_CHAT": _this.module.body_container
                            };
                            _this.body_mode = _this.MODE.CREATE_CHAT;
                            _this.renderLayout(null, null);
                            break;
                        case _this.MODE.JOIN_CHAT:
                            _this.elementMap = {
                                "JOIN_CHAT": _this.module.body_container
                            };
                            _this.body_mode = _this.MODE.JOIN_CHAT;
                            _this.renderLayout(null, null);
                            break;
                        case _this.MODE.CHATS:
                            users_bus.getMyInfo(options, function(error, options, userInfo) {
                                chats_bus.getChats(error, options, userInfo.chatsIds, function(error, options, chatsInfo) {
                                    if (error) {
                                        _this.module.body_container.innerHTML = error;
                                        return;
                                    }

                                    chatsInfo = _this.limitationQuantityRecords(chatsInfo);
                                    _this.elementMap = {
                                        "CHATS": _this.module.body_container
                                    };
                                    _this.body_mode = _this.MODE.CHATS;
                                    _this.renderLayout(
                                        {
                                        "data": chatsInfo.data,
                                        "detail_view_template": _this.detail_view_container_template,
                                        "openChatsInfoArray": _this.module.openChatsInfoArray,
                                        "openChats": options.openChats
                                        }, callback);
                                });
                            });
                            break;
                        case _this.MODE.USERS:
                            users_bus.getMyInfo(options, function(error, options, userInfo) {
                                    users_bus.getContactsInfo(error, userInfo.userIds, function(_error, contactsInfo) {
                                        if (_error) {
                                            _this.module.body_container.innerHTML = _error;
                                            return;
                                        }
                                        contactsInfo = _this.limitationQuantityRecords(contactsInfo);
                                        _this.elementMap = {
                                            "USERS": _this.module.body_container
                                        };
                                        _this.body_mode = _this.MODE.USERS;
                                        _this.renderLayout(contactsInfo.data, null);
                                    });
                            });
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
                                _this.module.resizePanel();
                            });
                            break;
                        case  _this.MODE.JOIN_USER:
                            _this.elementMap = {
                                "JOIN_USER": _this.module.body_container
                            };
                            _this.body_mode = _this.MODE.JOIN_USER;
                            _this.renderLayout(null, null);
                            break;
                        case  _this.MODE.CREATE_BLOG:
                            _this.module.body_container.innerHTML = "";
                            break;
                        case  _this.MODE.JOIN_BLOG:
                            _this.module.body_container.innerHTML = "";
                            break;
                        case  _this.MODE.BLOGS:
                            _this.module.body_container.innerHTML = "";
                            break;
                        case  _this.MODE.CONNECTIONS:
                            _this.module.body_container.innerHTML = "";
                            break;
                    }
                    _this.previousMode = _this.module.bodyOptions.mode;
                }
            },

            limitationQuantityRecords: function(data, forceChangeMode) {
                var _this = this;
                if (data && data.length) {
                    if (_this.module.currentListOptions.final > data.length || !_this.module.currentListOptions.final) {
                        _this.module.currentListOptions.final = data.length;
                    }
                    if (_this.module.currentListOptions.previousStart !== _this.module.currentListOptions.start ||
                        _this.module.currentListOptions.previousFinal !== _this.module.currentListOptions.final ||
                        forceChangeMode) {
                        var needRender = true;
                        _this.showSpinner(_this.module.body_container);
                        _this.module.body_container.innerHTML = "";
                        _this.module.currentListOptions.previousStart = _this.module.currentListOptions.start;
                        _this.module.currentListOptions.previousFinal = _this.module.currentListOptions.final;
                    }
                    data = data.slice(_this.module.currentListOptions.start, _this.module.currentListOptions.final);
                }

                return {data: data, needRender:needRender};
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

            destroy: function() {
                var _this = this;
            }
        };

        extend_core.prototype.inherit(body, throw_event_core);
        extend_core.prototype.inherit(body, throw_event_core);
        extend_core.prototype.inherit(body, template_core);
        extend_core.prototype.inherit(body, render_layout_core);
        extend_core.prototype.inherit(body, ajax_core);
        extend_core.prototype.inherit(body, overlay_core);

        body.prototype.chat_info_template = body.prototype.template(chat_info_template);
        body.prototype.user_info_template = body.prototype.template(user_info_template);
        body.prototype.triple_element_template = body.prototype.template(triple_element_template);
        body.prototype.button_template = body.prototype.template(button_template);
        body.prototype.label_template = body.prototype.template(label_template);
        body.prototype.input_template = body.prototype.template(input_template);
        body.prototype.textarea_template = body.prototype.template(textarea_template);
        body.prototype.panel_users_template = body.prototype.template(panel_users_template);
        body.prototype.detail_view_container_template = body.prototype.template(detail_view_container_template);
        body.prototype.join_locations_template = body.prototype.template(join_locations_template);
        body.prototype.location_wrapper_template = body.prototype.template(location_wrapper_template);

        body.prototype.dataMap = {
            "USER_INFO_EDIT": '',
            "USER_INFO_SHOW": '',
            "CREATE_CHAT": '',
            'JOIN_CHAT': '',
            "CHATS": '',
            "USERS": '',
            "DETAIL_VIEW": '',
            "FILTER_MY_CHATS": '',
            "CREATE_BLOG": '',
            "JOIN_BLOG": '',
            "BLOGS": '',
            "CONNECTIONS": ''
        };

        body.prototype.templateMap = {
            "USER_INFO_EDIT": body.prototype.user_info_template,
            "USER_INFO_SHOW": body.prototype.user_info_template,
            "CREATE_CHAT": body.prototype.chat_info_template,
            "JOIN_CHAT": body.prototype.chat_info_template,
            "CHATS": body.prototype.chat_info_template,
            "USERS": body.prototype.panel_users_template,
            "JOIN_USER": body.prototype.join_locations_template,
            "DETAIL_VIEW": body.prototype.detail_view_container_template,
            "FILTER_MY_CHATS": body.prototype.filter_my_chats_template,
            "CREATE_BLOG": '',
            "JOIN_BLOG": '',
            "BLOGS": '',
            "CONNECTIONS": ''
        };

        body.prototype.configHandlerMap = {
            "JOIN_USER": body.prototype.prepareConfig
        };
        body.prototype.configHandlerContextMap = {};

        body.prototype.dataHandlerMap = {
            "USER_INFO_EDIT": null,
            "USER_INFO_SHOW": null,
            "CREATE_CHAT": null,
            "JOIN_CHAT": null,
            "CHATS": null,
            "USERS": '',
            "DETAIL_VIEW": body.prototype.chatsFilter,
            "FILTER_CHATS": '',
            "CREATE_BLOG": '',
            "JOIN_BLOG": '',
            "BLOGS": '',
            "CONNECTIONS": ''
        };

        body.prototype.dataHandlerContextMap = {
            "USER_INFO_EDIT": null,
            "USER_INFO_SHOW": null,
            "CREATE_CHAT": null,
            "JOIN_CHAT": null,
            "CHATS": null,
            "USERS": users_bus,
            "DETAIL_VIEW": null,
            "FILTER_CHATS": null,
            "CREATE_BLOG": null,
            "JOIN_BLOG": null,
            "BLOGS": null,
            "CONNECTIONS": null
        };

        return body;
    });
