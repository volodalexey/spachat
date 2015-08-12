define('switcher_core',
    function() {

        var switcher_core = function() {
        };

        switcher_core.prototype = {

            __class_name: "switcher_core",

            optionsDefinition: function(_module, mode) {
                var _this = this;

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
                        _module.currentListOptions = _module.messages_ListOptions;
                        break;
                    case _module.body.MODE.CONTACT_LIST:
                        _this.previousModeSwitcher = _module.body.MODE.MESSAGES;
                        _module.currentPaginationOptions = _module.contactList_PaginationOptions;
                        _module.currentGoToOptions = _module.contactList_GoToOptions;
                        _module.current_Extra_Toolbar_Options = _module.contactList_ExtraToolbarOptions;
                        _module.currnetFilterOptions = _module.contactList_FilterOptions;
                        _module.currentListOptions = _module.contactList_ListOptions;
                        break;
                    case _module.body.MODE.LOGGER:
                        _this.previousModeSwitcher = _module.body.MODE.LOGGER;
                        _module.currentPaginationOptions = _module.logger_PaginationOptions;
                        _module.currentGoToOptions = _module.logger_GoToOptions;
                        _module.current_Extra_Toolbar_Options = _module.logger_ExtraToolbarOptions;
                        _module.currnetFilterOptions = _module.logger_FilterOptions;
                        _module.currentListOptions = _module.logger_ListOptions;
                        break;
                    case _module.MODE.CHATS:
                        _this.previousModeSwitcher = _module.MODE.CHATS;
                        _module.currentPaginationOptions = _module.chats_PaginationOptions;
                        _module.currentGoToOptions = _module.chats_GoToOptions;
                        _module.current_Extra_Toolbar_Options = _module.chats_ExtraToolbarOptions;
                        _module.currnetFilterOptions = _module.chats_FilterOptions;
                        _module.currentListOptions = _module.chats_ListOptions;
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
                    case _module.MODE.BLOGS:
                        _this.previousModeSwitcher = _module.MODE.BLOGS;
                        _module.currentPaginationOptions = _module.blogs_PaginationOptions;
                        _module.currentGoToOptions = _module.blogs_GoToOptions;
                        _module.current_Extra_Toolbar_Options = _module.blogs_ExtraToolbarOptions;
                        _module.currnetFilterOptions = _module.blogs_FilterOptions;
                        _module.currentListOptions = _module.blogs_ListOptions;
                        break;
                    case _module.MODE.CREATE_BLOG:
                        _module.current_Extra_Toolbar_Options = _module.createBlog_ExtraToolbarOptions;
                        _module.currnetFilterOptions = _module.createBlog_FilterOptions;
                        _module.currentPaginationOptions = _module.createBlog_PaginationOptions;
                        _module.currentGoToOptions = _module.createBlog_GoToOptions;
                        break;
                    case _module.MODE.JOIN_BLOG:
                        _module.current_Extra_Toolbar_Options = _module.joinBlog_ExtraToolbarOptions;
                        _module.currnetFilterOptions = _module.joinBlog_FilterOptions;
                        _module.currentPaginationOptions = _module.joinBlog_PaginationOptions;
                        _module.currentGoToOptions = _module.joinBlog_GoToOptions;
                        break;
                    case _module.MODE.USERS:
                        _module.current_Extra_Toolbar_Options = _module.users_ExtraToolbarOptions;
                        _module.currnetFilterOptions = _module.users_FilterOptions;
                        _module.currentPaginationOptions = _module.users_PaginationOptions;
                        _module.currentGoToOptions = _module.users_GoToOptions;
                        _module.currentListOptions = _module.users_ListOptions;
                        break;
                    case _module.MODE.JOIN_USER:
                        _module.current_Extra_Toolbar_Options = _module.joinUser_ExtraToolbarOptions;
                        _module.currnetFilterOptions = _module.joinUser_FilterOptions;
                        _module.currentPaginationOptions = _module.joinUser_PaginationOptions;
                        _module.currentGoToOptions = _module.joinUser_GoToOptions;
                        _module.currentListOptions = _module.joinUser_ListOptions;
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
                    case _module.MODE.CONNECTIONS:
                        _module.current_Extra_Toolbar_Options = _module.connections_ExtraToolbarOptions;
                        _module.currnetFilterOptions = _module.connections_FilterOptions;
                        _module.currentPaginationOptions = _module.connections_PaginationOptions;
                        _module.currentGoToOptions = _module.connections_GoToOptions;
                        _module.currentListOptions = _module.connections_ListOptions;
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
                }
            },

            tableDefinition: function(_module, mode){
                var _this = this, table_name;

                switch (mode) {
                    case _module.body.MODE.MESSAGES:
                        table_name = ['messages'];
                        break;
                    case _module.body.MODE.LOGGER:
                        table_name = ['log_messages'];
                        break;
                }
                return table_name;
            },

            toggleActiveButton: function(btnsArray, mode) {
                btnsArray.forEach(function(_button){
                    if (_button.dataset.mode_to === mode) {
                        _button.classList.add('c-100');
                    } else {
                        _button.classList.remove('c-100');
                    }
                })
            }
        };

        return switcher_core;
    }
);