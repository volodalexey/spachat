define('event_bus', [
        'event_core'
    ],
    function(
         event_core
    ) {

        var Event_bus = function() {
        };

        Event_bus.prototype = {
            setTempDeviceId: function(tempDeviceId) {
                this.tempDeviceId = tempDeviceId;
            },

            getTempDeviceId: function() {
                return this.tempDeviceId;
            },

            setDeviceId: function(deviceId) {
                this.deviceId = deviceId;
                if (this.tempDeviceId) {
                    this.tempDeviceId = undefined;
                }
            },

            getDeviceId: function() {
                return this.deviceId;
            },

            isEqualAnyDeviceId: function(deviceId) {
                return this.deviceId === deviceId || this.tempDeviceId === deviceId;
            }
        };

        extend(Event_bus, event_core);

        return new Event_bus();
    })
;