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

            isInUsers: function(_instance) {
                var instance = _instance ? _instance : this;
                var inUsers;
                if (instance.userIds) {
                    instance.userIds.every(function(userId) {
                        if (userId === users_bus.getUserId()) {
                            inUsers = userId;
                        }
                        return !inUsers;
                    });
                }

                return inUsers;
            },

            addMyUserId: function(_instance) {
                var instance = _instance ? _instance : this;
                if (!instance.userIds) {
                    instance.userIds = [];
                }
                if (!model_core.prototype.isInUsers(instance)) {
                    instance.userIds.push(users_bus.getUserId());
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