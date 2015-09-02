define('chats_bus', [
        'indexeddb',
        'users_bus',
        'event_bus'
    ],
    function(
        indexeddb,
        users_bus,
        event_bus
    ) {

        var chats_bus = function() {
            // db_name - depends from user id
            this.collectionDescription = {
                "table_descriptions": [{
                    "table_name": 'chats',
                    "table_parameter": {"keyPath": "chat_id"}
                }]
            };
            this.addEventListeners();
        };

        chats_bus.prototype = {

            onSetUserId: function(user_id) {
                this.collectionDescription.db_name = user_id;
            },

            addEventListeners: function() {
                var _this = this;
                _this.removeEventListeners();
                event_bus.on('setUserId', _this.onSetUserId, _this);
            },

            removeEventListeners: function() {
                var _this = this;
                event_bus.off('setUserId', _this.onSetUserId);
            },

            getChats: function(getError, options, chat_ids, _callback) {
                if (chat_ids && chat_ids.length) {
                    indexeddb.getByKeysPath(
                        this.collectionDescription,
                        null,
                        chat_ids,
                        null,
                        function(getError, chatsInfo) {
                            if (getError) {
                                if (_callback){
                                    _callback(getError);
                                } else {
                                    console.error(getError);
                                }
                                return;
                            }

                            if (_callback){
                                _callback(null, options, chatsInfo);
                            }
                        }
                    );
                } else {
                    _callback(null, options, null);
                }
            },

            getChatContacts: function(chat_id, callback) {
                var _this = this;
                indexeddb.getByKeyPath(
                    _this.collectionDescription,
                    null,
                    chat_id,
                    function(getError, chat_description) {
                        if (getError) {
                            console.error(getError);
                            return;
                        }

                        if (chat_description) {
                            chat_description.user_ids = users_bus.excludeUser(null, chat_description.user_ids);
                            users_bus.getContactsInfo(null, chat_description.user_ids, callback);
                        }
                    }
                );
            },

            putChatToIndexedDB: function(chat_description, callback) {
                indexeddb.addOrUpdateAll(
                    this.collectionDescription,
                    null,
                    [
                        chat_description
                    ],
                    function(error) {
                        if (error) {
                            callback(error);
                            return;
                        }

                        callback(null, chat_description);
                    }
                );
            }

        };


        return new chats_bus();
    })
;