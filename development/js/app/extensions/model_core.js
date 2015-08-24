define([
        'users_bus'
    ],
    function (
        users_bus
    ) {

        var model_core = function() {
        };

        model_core.prototype = {

            __class_name: "model_core",

            setCreator: function(_instance) {
                var instance = _instance ? _instance : this;
                if (!instance.createdByUserId) {
                    instance.createdByUserId = users_bus.getUserId();
                    instance.createdDatetime = Date.now();
                } else {
                    instance.receivedDatetime = Date.now();
                }
            },

            isInUsers: function(_instance, user_id) {
                var instance = _instance ? _instance : this;
                var check_user_id = user_id ? user_id : users_bus.getUserId();
                var inUsers;
                if (instance.user_ids) {
                    instance.user_ids.every(function(_user_id) {
                        if (_user_id === check_user_id) {
                            inUsers = _user_id;
                        }
                        return !inUsers;
                    });
                }

                return inUsers;
            },

            addMyUserId: function(_instance) {
                var instance = _instance ? _instance : this;
                if (!instance.user_ids) {
                    instance.user_ids = [];
                }
                if (!model_core.prototype.isInUsers(instance)) {
                    instance.user_ids.push(users_bus.getUserId());
                }
            },

            amICreator: function(_instance) {
                var instance = _instance ? _instance : this;
                return instance.createdByUserId === users_bus.getUserId();
            }
        };

        return model_core;
    }
);