define('users_bus', [

    ],
    function(

    ) {

        var users = function() {
            this.userId = null;
            this.collectionDescription = {
                "db_name": 'users',
                "table_names": ['users'],
                "db_version": 1,
                "keyPath": "userId"
            };
        };

        users.prototype = {

            setUserId: function(userId) {
                this.userId = userId;
            },

            getUserId: function() {
                return this.userId;
            }

        };


        return new users();
    })
;