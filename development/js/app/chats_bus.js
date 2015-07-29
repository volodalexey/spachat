define('chats_bus', [

    ],
    function(

    ) {

        var chats_bus = function() {
            this.collectionDescription = {
                "id": 'chats',
                "db_name": 'chats',
                "table_names": ['chats'],
                "db_version": 1,
                "keyPath": "chatId"
            };
        };

        chats_bus.prototype = {
        };


        return new chats_bus();
    })
;