define('message', [
        'id_core',
        'extend_core',
        'event_bus'
    ],
    function(
        id_core,
        extend_core,
        event_bus
    ) {
        var defaultOptions = {
            innerHTML : ""
        };
        /**
         * Message model
         * @param options - options to override basic parameters
         */
        var Message = function(options) {
            if (!options.id) {
                this.id = this.generateId();
            }
            this.extend(this, defaultOptions);
            this.extend(this, options);

            if (!this.ids) {
                this.ids = {};
            }

            this.pushDeviceId();
        };

        Message.prototype = {

            READYSTATES: {
                CREATED: 'CREATED',
                SENDING: 'SENDING',
                SENT: 'SENT'
            },

            pushDeviceId: function() {
                if (!event_bus.getDeviceId()) {
                    return;
                }

                if (!this.ids[event_bus.getDeviceId()]) {
                    this.ids[event_bus.getDeviceId()] = {};
                }

                if (!this.ids[event_bus.getDeviceId()].dateTime) {
                    this.ids[event_bus.getDeviceId()].dateTime = Date.now();
                }

                this.onMessageCreate();
            },

            onMessageCreate: function() {
                if (!event_bus.getDeviceId()) {
                    return;
                }

                if (!this.ids[event_bus.getDeviceId()].readyState) {
                    this.ids[event_bus.getDeviceId()].readyState = this.READYSTATES.CREATED;
                }
            },

            prepareToSend: function() {
                this.pushDeviceId();

                this.ids[event_bus.getDeviceId()].readyState = this.READYSTATES.SENDING;
            }

        };

        extend(Message, id_core);
        extend(Message, extend_core);

        return Message;
    });
