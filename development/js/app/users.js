define('users', [

    ],
    function(

    ) {

        var users = function() {
            this.collectionDescription = {
                "id": "users",
                "db_name": 'users',
                "table_names": ['users'],
                "db_version": 1,
                "keyPath": "userId"
            };
        };

        users.prototype = {};


        return new users();
    })
;