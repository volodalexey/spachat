define('switcher',
    function() {

        var switcher = function() {
        };

        switcher.prototype = {

            __class_name: "switcher",

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
                        _module.collectionDescription.table_names = ['users'];
                        _this.currentPaginationOptions = _module.paginationChatsOptions;
                        _this.currentGoToOptions = _module.goToChatsOptions;
                        break;
                }
            }
        };

        return switcher;
    }
);