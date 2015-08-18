define('users_bus', [
        'indexeddb',
        'chats_bus'
    ],
    function(
        indexeddb,
        chats_bus
    ) {

        var users_bus = function() {
            this.userId = null;
            this.collectionDescription = {
                "db_name": 'users',
                "table_names": ['users'],
                "db_version": 1,
                "table_indexes": [[ 'userIds', 'userIds', { multiEntry: true } ]],
                "keyPath": "userId"
            };
        };

        users_bus.prototype = {

            setUserId: function(userId) {
                this.userId = userId;
            },

            getUserId: function() {
                return this.userId;
            },

            excludeUser: function(options, userIds) {
                var _this = this;
                var result = userIds.indexOf(_this.getUserId());
                if (result !== -1) {
                    userIds.splice(userIds.indexOf(_this.getUserId()), 1);
                }
                return userIds;
            },

            getContactsId: function(chat_id, _callback) {
                var _this = this;
                indexeddb.getByKeyPath(
                    chats_bus.collectionDescription,
                    chat_id,
                    function(getError, chat) {
                        if (getError) {
                            console.error(getError);
                            return;
                        }

                        if (chat) {
                            chat.userIds = _this.excludeUser(null, chat.userIds);
                            _this.getContactsInfo(null, chat.userIds, _callback);
                        }
                    }
                );
            },

            getContactsInfo: function(options, userIds, _callback) {
                if (userIds.length) {
                    indexeddb.getByKeysPath(
                        this.collectionDescription,
                        userIds,
                        function(getError, contactsInfo) {
                            if (getError) {
                                if (_callback){
                                    _callback(getError);
                                } else {
                                    console.error(getError);
                                }
                                return;
                            }

                            if (_callback){
                                _callback(null, contactsInfo);
                            }
                        }
                    );
                } else {
                    _callback(null, null);
                }
            },

            getMyInfo: function(options, _callback) {
                indexeddb.getByKeyPath(
                    this.collectionDescription,
                    this.userId,
                    function(getError, userInfo) {
                        if (getError) {
                            if (_callback){
                                _callback(getError);
                            } else {
                                console.error(getError);
                            }
                            return;
                        }

                        if (_callback){
                            _callback(null, options, userInfo);
                        }
                    }
                );
            },

            getUserDescription: function(options, callback) {
                this.getMyInfo(options, function(error, _options, userInfo) {
                    if (error) {
                        if (callback){
                            callback(error);
                        } else {
                            console.error(error);
                        }
                        return;
                    }

                    if (callback){
                        callback(null, {
                            userId: userInfo.userId,
                            userName: userInfo.userName
                        });
                    }
                });
            }
        };


        return new users_bus();
    })
;