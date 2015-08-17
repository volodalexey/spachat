define('event_bus', [
        'event_core',
        'extend_core'
    ],
    function(
         event_core,
         extend_core
    ) {

        var Event_bus = function() {
        };

        Event_bus.prototype = {

            set_ws_device_id: function(ws_device_id) {
                this.ws_device_id = ws_device_id;
            },

            get_ws_device_id: function() {
                return this.ws_device_id;
            }
        };

        extend_core.prototype.inherit(Event_bus, event_core);

        return new Event_bus();
    })
;