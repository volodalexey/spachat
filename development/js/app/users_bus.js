define('users_bus', [
        'indexeddb'
    ],
    function(
        indexeddb
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
                userIds.splice(userIds.indexOf(_this.getUserId()), 1);
                return userIds;
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
            }
        };


        return new users_bus();
    })
;