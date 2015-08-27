define('users_bus', [
        'indexeddb',
        'chats_bus'
    ],
    function(
        indexeddb,
        chats_bus
    ) {

        var users_bus = function() {
            this.user_id = null;
            this.collectionDescription = {
                "db_name": 'users',
                "table_names": ['users'],
                "db_version": 1,
                "table_indexes": [[ 'user_ids', 'user_ids', { multiEntry: true } ]],
                "keyPath": "user_id"
            };
        };

        users_bus.prototype = {

            setUserId: function(user_id) {
                this.user_id = user_id;
            },

            getUserId: function() {
                return this.user_id;
            },

            excludeUser: function(options, user_ids) {
                var _this = this;
                var index = user_ids.indexOf(_this.getUserId());
                if (index !== -1) {
                    user_ids.splice(index, 1);
                }
                return user_ids;
            },

            getContactsId: function(chat_id, _callback) {
                var _this = this;
                indexeddb.getByKeyPath(
                    chats_bus.collectionDescription,
                    chat_id,
                    function(getError, chat_description) {
                        if (getError) {
                            console.error(getError);
                            return;
                        }

                        if (chat_description) {
                            chat_description.user_ids = _this.excludeUser(null, chat_description.user_ids);
                            _this.getContactsInfo(null, chat_description.user_ids, _callback);
                        }
                    }
                );
            },

            getContactsInfo: function(options, user_ids, _callback) {
                if (user_ids.length) {
                    indexeddb.getByKeysPath(
                        this.collectionDescription,
                        user_ids,
                        function(user_id) {
                            return {
                                userName: 'unknown'
                            }
                        },
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
                    this.user_id,
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
                            user_id: userInfo.user_id,
                            userName: userInfo.userName
                        });
                    }
                });
            },

            hasInArray: function(_array, item) {
                var found;
                _array.every(function(_item) {
                    if (_item === item) {
                        found = _item;
                    }
                    return !found;
                });
                return found;
            },

            putItemIntoArray: function(arrayName, item, callback) {
                var _this = this;
                _this.getMyInfo({}, function(error, _options, userInfo) {
                    if (error) {
                        callback && callback(error);
                        return;
                    }

                    if (!_this.hasInArray(userInfo[arrayName], item)) {
                        userInfo[arrayName].push(item);
                        _this.saveMyInfo(userInfo, function(err) {
                            callback && callback(err, userInfo);
                        });
                    } else {
                        callback && callback(null, userInfo);
                    }
                });
            },

            putUserIdAndSave: function(user_id, callback) {
                this.putItemIntoArray('user_ids', user_id, callback);
            },

            putChatIdAndSave: function(chat_id, callback) {
                this.putItemIntoArray('chat_ids', chat_id, callback);
            },

            saveMyInfo: function(userInfo, _callback) {
                indexeddb.addOrUpdateAll(
                    this.collectionDescription,
                    null,
                    [userInfo],
                    _callback
                )
            }
        };


        return new users_bus();
    })
;