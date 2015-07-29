define('switcher_core',
    function() {

        var switcher_core = function() {
        };

        switcher_core.prototype = {

            __class_name: "switcher_core",

            optionsDefinition: function(_module, mode) {
                var _this = this;

                if (_this.previousModeSwitcher !== mode && _module.listOptions) {
                    _module.listOptions.previousStart = 0;
                    _module.listOptions.previousFinal = null;
                    _module.listOptions.start = 0;
                    _module.listOptions.final = null;
                }
                switch (mode) {
                    case _module.body.MODE.SETTINGS:
                        _this.previousModeSwitcher = _module.body.MODE.MESSAGES;
                        _module.currentPaginationOptions = _module.settings_PaginationOptions;
                        _module.currentGoToOptions = _module.settings_GoToOptions;
                        _module.current_Extra_Toolbar_Options = _module.settings_ExtraToolbarOptions;
                        _module.currnetFilterOptions = _module.settings_FilterOptions;
                        break;
                    case _module.body.MODE.MESSAGES:
                        _this.previousModeSwitcher = _module.body.MODE.MESSAGES;
                        _module.currentPaginationOptions = _module.messages_PaginationOptions;
                        _module.currentGoToOptions = _module.messages_GoToOptions;
                        _module.current_Extra_Toolbar_Options = _module.messages_ExtraToolbarOptions;
                        _module.currnetFilterOptions = _module.messages_FilterOptions;
                        break;
                    case _module.body.MODE.CONTACT_LIST:
                        _this.previousModeSwitcher = _module.body.MODE.MESSAGES;
                        _module.currentPaginationOptions = _module.contactList_PaginationOptions;
                        _module.currentGoToOptions = _module.contactList_GoToOptions;
                        _module.current_Extra_Toolbar_Options = _module.contactList_ExtraToolbarOptions;
                        _module.currnetFilterOptions = _module.contactList_FilterOptions;
                        break;
                    case _module.body.MODE.LOGGER:
                        _this.previousModeSwitcher = _module.body.MODE.LOGGER;
                        _module.currentPaginationOptions = _module.logger_PaginationOptions;
                        _module.currentGoToOptions = _module.logger_GoToOptions;
                        _module.current_Extra_Toolbar_Options = _module.logger_ExtraToolbarOptions;
                        _module.currnetFilterOptions = _module.logger_FilterOptions;
                        break;
                    case _module.MODE.CHATS:
                        _this.previousModeSwitcher = _module.MODE.CHATS;
                        _module.currentPaginationOptions = _module.chats_PaginationOptions;
                        _module.currentGoToOptions = _module.chats_GoToOptions;
                        _module.current_Extra_Toolbar_Options = _module.chats_ExtraToolbarOptions;
                        _module.currnetFilterOptions = _module.chats_FilterOptions;
                        break;
                    case _module.MODE.CREATE_CHAT:
                        _module.current_Extra_Toolbar_Options = _module.createChat_ExtraToolbarOptions;
                        _module.currnetFilterOptions = _module.createChat_FilterOptions;
                        _module.currentPaginationOptions = _module.createChat_PaginationOptions;
                        _module.currentGoToOptions = _module.createChat_GoToOptions;
                        break;
                    case _module.MODE.JOIN_CHAT:
                        _module.current_Extra_Toolbar_Options = _module.joinChat_ExtraToolbarOptions;
                        _module.currnetFilterOptions = _module.joinChat_FilterOptions;
                        _module.currentPaginationOptions = _module.joinChat_PaginationOptions;
                        _module.currentGoToOptions = _module.joinChat_GoToOptions;
                        break;
                    case _module.MODE.USERS:
                        _module.current_Extra_Toolbar_Options = _module.users_ExtraToolbarOptions;
                        _module.currnetFilterOptions = _module.users_FilterOptions;
                        _module.currentPaginationOptions = _module.users_PaginationOptions;
                        _module.currentGoToOptions = _module.users_GoToOptions;
                        break;
                    case _module.MODE.USER_INFO_EDIT:
                        _module.current_Extra_Toolbar_Options = _module.userInfoEdit_ExtraToolbarOptions;
                        _module.currnetFilterOptions = _module.userInfoEdit_FilterOptions;
                        _module.currentPaginationOptions = _module.userInfoEdit_PaginationOptions;
                        _module.currentGoToOptions = _module.userInfoEdit_GoToOptions;
                        break;
                    case _module.MODE.USER_INFO_SHOW:
                        _module.current_Extra_Toolbar_Options = _module.userInfoShow_ExtraToolbarOptions;
                        _module.currnetFilterOptions = _module.userInfoShow_FilterOptions;
                        _module.currentPaginationOptions = _module.userInfoShow_PaginationOptions;
                        _module.currentGoToOptions = _module.userInfoShow_GoToOptions;
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
            },

            toggleText: function(_options, toggleObject, element) {
                if (!toggleObject.previousSave) {
                    if (_options.save && _options.save === true) {
                        toggleObject.previousSave = true;
                        toggleObject[_options.key] = element.innerHTML;
                    }
                }
                if (_options.restore) {
                    if (toggleObject.previousSave) {
                       toggleObject.restore = true;
                    }
                    toggleObject.previousSave = false;
                    return;
                }
            }


        };

        return switcher_core;
    }
);