define('id_core', [
    ],
    function() {

        /**
         * generate "unique" id
         */
        var id_core = function() {
        };

        id_core.prototype = {

            __class_name: "id_core",

            s4: function() {
                return Math.floor((1 + Math.random()) * 0x10000).toString(16).substring(1);
            },

            s4Date: function() {
                return Date.now().toString(16).substring(1);
            },

            generateId: function() {
                return this.s4() + this.s4() + '-' + this.s4() + '-' + this.s4() + '-' +
                    this.s4() + '-' + this.s4() + this.s4() + this.s4Date();
            }
        };

        return id_core;
    }
);