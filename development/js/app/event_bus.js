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

            isEqualAnyDeviceId: function(options) {
                return (options.deviceId && this.deviceId === options.deviceId) ||
                    (options.tempDeviceId && this.tempDeviceId === options.tempDeviceId);
            },

            setAnyDeviceId: function(options) {
                if (options.deviceId) {
                    this.setDeviceId(options.deviceId);
                } else if (options.tempDeviceId) {
                    this.setTempDeviceId(options.tempDeviceId);
                }
            }
        };

        extend(Event_bus, event_core);

        return new Event_bus();
    })
;