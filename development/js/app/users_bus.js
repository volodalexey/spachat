define('users_bus', [
        'indexeddb'
    ],
    function(
        indexeddb
    ) {

        var users_bus = function() {
            this.user_id = null;
            // database only for credentials for each user
            this.credentialsDatabaseDescription = {
                "db_name": 'user_credentials',
                "table_descriptions": [{
                    "table_name": 'user_credentials',
                    "table_parameter": {"keyPath": "user_id"}
                }]
            };
            // database for all user content
            // db_name - depends from user id
            this.userDatabaseDescription = {
                "table_descriptions": [{
                    "table_name": 'users',
                    "table_indexes": [{
                        "indexName": 'user_ids',
                        "indexKeyPath": 'user_ids',
                        "indexParameter": { multiEntry: true }
                    }],
                    "table_parameter": {"keyPath": "user_id"}
                }, {
                    "table_name": 'information',
                    "table_indexes": [{
                        "indexName": 'user_ids',
                        "indexKeyPath": 'user_ids',
                        "indexParameter": { multiEntry: true }
                    }],
                    "table_parameter": {"keyPath": "user_id"}
                }]
            }
        };

        users_bus.prototype = {

            getUserCredentials: function(userName, userPassword, callback) {
                var _this = this;
                indexeddb.getAll(_this.credentialsDatabaseDescription, null, function(getAllErr, allUsers) {
                    if (getAllErr) {
                        callback(getAllErr);
                        return;
                    }

                    var userCredentials;
                    allUsers.every(function(_user) {
                        if (_user.userName === userName) {
                            if (userPassword && _user.userPassword === userPassword) {
                                userCredentials = _user;
                            } else {
                                userCredentials = _user;
                            }
                        }
                        return !userCredentials;
                    });

                    callback(null, userCredentials);
                });
            },

            storeNewUser: function(user_id, userName, userPassword, callback) {
                var _this = this;
                _this.getUserCredentials(userName, null, function(getAllErr, userCredentials) {
                    if (getAllErr) {
                        callback(getAllErr);
                        return;
                    }

                    if (userCredentials) {
                        callback(new Error('User with such username is already exist!'));
                        return;
                    }

                    var accountCredentials = {
                        user_id: user_id,
                        userName: userName,
                        userPassword: userPassword
                    };

                    indexeddb.addOrUpdateAll(
                        _this.credentialsDatabaseDescription,
                        null,
                        [
                            accountCredentials
                        ],
                        function(error) {
                            if (error) {
                                callback(error);
                                return;
                            }

                            // TODO use user model
                            var userInfo = {
                                user_id: user_id,
                                userName: userName,
                                userPassword: userPassword,
                                user_ids: [],
                                chat_ids: []
                            };

                            _this.userDatabaseDescription.db_name = user_id; // temp to store user
                            indexeddb.addOrUpdateAll(
                                _this.userDatabaseDescription,
                                'information',
                                [
                                    userInfo
                                ],
                                function(err) {
                                    _this.userDatabaseDescription.db_name = null; // roll back temp
                                    if (err) {
                                        callback(err);
                                        return;
                                    }
                                    callback(null, userInfo);
                                }
                            );
                        }
                    );
                });
            },

            setUserId: function(user_id) {
                this.user_id = user_id;
                this.userDatabaseDescription.db_name = user_id;
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

            getContactsInfo: function(options, user_ids, _callback) {
                if (user_ids.length) {
                    indexeddb.getByKeysPath(
                        this.userDatabaseDescription,
                        'users',
                        user_ids,
                        function(user_id) {
                            return {
                                user_id: user_id,
                                userName: '-//-//-//-'
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
                var _this = this;
                indexeddb.getByKeyPath(
                    _this.userDatabaseDescription,
                    'information',
                    _this.user_id,
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
                    this.userDatabaseDescription,
                    'information',
                    [userInfo],
                    _callback
                )
            },

            addNewUserToIndexedDB: function(user_description, callback) {
                indexeddb.addOrUpdateAll(
                    this.userDatabaseDescription,
                    'users',
                    [
                        user_description
                    ],
                    function(error) {
                        if (error) {
                            callback(error);
                            return;
                        }

                        callback(null, user_description);
                    }
                );
            }
        };


        return new users_bus();
    })
;