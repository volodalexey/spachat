define('event_bus', [
        'event_core'
    ],
    function(
         event_core
    ) {

        var Event_bus = function() {
        };

        Event_bus.prototype = {};

        extend(Event_bus, event_core);

        return new Event_bus();
    })
;