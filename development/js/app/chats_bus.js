define('chats_bus', [
        'indexeddb'
    ],
    function(
        indexeddb
    ) {

        var chats_bus = function() {
            this.collectionDescription = {
                "id": 'chats',
                "db_name": 'chats',
                "table_names": ['chats'],
                "db_version": 1,
                "keyPath": "chat_id"
            };
        };

        chats_bus.prototype = {
            getChats: function(getError, options, chatsIds, _callback) {
                if (chatsIds && chatsIds.length) {
                    indexeddb.getByKeysPath(
                        this.collectionDescription,
                        chatsIds,
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
            }

        };


        return new chats_bus();
    })
;