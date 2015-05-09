define('event', ['Underscore'],
    function () {

        var event = function() {};

        event.prototype = {

            __class_name: "event",

            initializeListeners: function() {
                if (!this.listeners) {
                    this.listeners = {};
                }
            },

            on: function(event, handler, context) {
                this.initializeListeners();

                if (this.listeners[event] === undefined) {
                    this.listeners[event] = [];
                }

                if (this.listeners[event].indexOf(handler) === -1) {
                    this.listeners[event].push({
                        handler : handler,
                        context : context || this
                    });
                }
                return this;
            },

            off: function(event, handler) {
                this.initializeListeners();
                var idx;
                if (!event) {
                    this.listeners = {};
                    return this;
                }
                if (!this.listeners[event]) { return this; }

                if (!handler) {
                    delete this.listeners[event];
                } else {
                    idx = _.map(this.listeners[event], function(listener) { return listener.handler }).indexOf(handler);
                    if (idx !== -1) {
                        this.listeners[event].splice(idx, 1);
                    }
                }
                return this;
            },

            trigger: function(name) {
                this.initializeListeners();
                var args = Array.prototype.slice.call(arguments, 1);
                (this.listeners[name] || []).forEach(function(listener){
                    listener.handler.apply(listener.context, args);
                });
                return this;
            }
        };

        return event;
    }
);