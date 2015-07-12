define('switcher_core',
    function() {

        var switcher_core = function() {
        };

        switcher_core.prototype = {

            __class_name: "switcher_core",

            optionsDefinition: function(_module, mode) {
                var _this = this;

                if (_this.previousModeSwitcher !== mode && _module.messagesOptions) {
                    _module.messagesOptions.previousStart = 0;
                    _module.messagesOptions.previousFinal = null;
                    _module.messagesOptions.start = 0;
                    _module.messagesOptions.final = null;
                }
                switch (mode) {
                    case _module.body.MODE.MESSAGES:
                    case _module.body.MODE.SETTING:
                    case _module.body.MODE.CONTACT_LIST:
                        _this.previousModeSwitcher = _module.body.MODE.MESSAGES;
                        _module.collectionDescription.table_names = [_module.chatId + '_messages'];
                        _this.currentPaginationOptions = _module.paginationMessageOptions;
                        _this.currentGoToOptions = _module.goToMessageOptions;
                        break;
                    case _module.body.MODE.LOGGER:
                        _this.previousModeSwitcher = _module.body.MODE.LOGGER;
                        _module.collectionDescription.table_names = [_module.chatId + '_logs'];
                        _this.currentPaginationOptions = _module.paginationLoggerOptions;
                        _this.currentGoToOptions = _module.goToLoggerOptions;
                        break;
                    case _module.MODE.CHATS:
                        _this.previousModeSwitcher = _module.MODE.CHATS;
                        //_module.body.collectionDescription.table_names = ['users'];
                        _this.currentPaginationOptions = _module.chatsPaginationOptions;
                        _this.currentGoToOptions = _module.chatsGoToOptions;
                        _module.current_Extra_Toolbar_Options = _module.chats_Extra_Toolbar_Options;
                        _module.currnetFilterOptions = _module.chats_Filter_Options;
                        break;
                    case _module.MODE.CREATE_CHAT:
                        _module.current_Extra_Toolbar_Options = _module.create_Chat_Extra_Toolbar_Options;
                        _module.currnetFilterOptions = _module.create_Chat_Filter_Options;
                        _this.currentPaginationOptions = _module.createChatPaginationOptions;
                        _this.currentGoToOptions = _module.createChatGoToOptions;
                        break;
                    case _module.MODE.JOIN_CHAT:
                        _module.current_Extra_Toolbar_Options = _module.join_Chat_Extra_Toolbar_Options;
                        _module.currnetFilterOptions = _module.join_Chat_Filter_Options;
                        _this.currentPaginationOptions = _module.joinChatPaginationOptions;
                        _this.currentGoToOptions = _module.joinChatGoToOptions;
                        break;
                    case _module.MODE.USERS:
                        _module.current_Extra_Toolbar_Options = _module.users_Extra_Toolbar_Options;
                        _module.currnetFilterOptions = _module.users_Filter_Options;
                        _this.currentPaginationOptions = _module.usersPaginationOptions;
                        _this.currentGoToOptions = _module.usersGoToOptions;
                        break;
                    case _module.MODE.USER_INFO_EDIT:
                        _module.current_Extra_Toolbar_Options = _module.user_info_edit_Extra_Toolbar_Options;
                        _module.currnetFilterOptions = _module.user_info_edit_Filter_Options;
                        _this.currentPaginationOptions = _module.user_Info_Edit_Pagination_Options;
                        _this.currentGoToOptions = _module.user_Info_Edit_Go_To_Options;
                        break;
                    case _module.MODE.USER_INFO_SHOW:
                        _module.current_Extra_Toolbar_Options = _module.user_info_show_Extra_Toolbar_Options;
                        _module.currnetFilterOptions = _module.user_info_show_Filter_Options;
                        _this.currentPaginationOptions = _module.user_Info_Show_Pagination_Options;
                        _this.currentGoToOptions = _module.user_Info_Show_Go_To_Options;
                        break;
                }
            },

            toggleShowState: function(_options, toggleObject, _obj) {
                if (_obj.target && _obj.target.dataset.role === "enablePagination") {
                    toggleObject[_options.key] = _obj.target.checked;
                    return;

                }
                if (_obj.target && _obj.target.dataset.role === 'choice') {
                    toggleObject[_options.key] = _obj.target.dataset.toggle === "true";
                    return;

                }


                if (!toggleObject.previousSave) {
                    if (_options.save && _options.save === true) {
                        toggleObject.previousSave = true;
                        toggleObject.previousShow = toggleObject[_options.key];
                    }
                }
                if (_options.restore) {
                    if (toggleObject.previousSave) {
                        toggleObject[_options.key] = toggleObject.previousShow;

                    } else {
                        toggleObject[_options.key] = toggleObject.show;
                    }
                    toggleObject.previousSave = false;
                    return;

                }
                toggleObject[_options.key] = _options.toggle;
            }


        };

        return switcher_core;
    }
);