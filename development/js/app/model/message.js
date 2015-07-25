define('message', [
        'id_core',
        'extend_core',
        'users_bus',
        'event_bus'
    ],
    function(
        id_core,
        extend_core,
        users_bus,
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

            if (!this.deviceIds) {
                this.deviceIds = {};
            }

            this.pushDeviceId();
        };

        Message.prototype = {

            READYSTATES: {
                CREATED: 'CREATED',
                RECEIVED: 'RECEIVED',
                SENDING: 'SENDING',
                SENT: 'SENT'
            },

            pushDeviceId: function() {
                if (!event_bus.getDeviceId()) {
                    return;
                }

                if (!this.deviceIds[event_bus.getDeviceId()]) {
                    this.deviceIds[event_bus.getDeviceId()] = {};
                }

                if (!this.deviceIds[event_bus.getDeviceId()].dateTime) {
                    this.deviceIds[event_bus.getDeviceId()].dateTime = Date.now();
                }

                if (!this.deviceIds[event_bus.getDeviceId()].userId) {
                    this.deviceIds[event_bus.getDeviceId()].userId = users_bus.getUserId();
                }

                this.onMessageCreate();
            },

            onMessageCreate: function() {
                if (!event_bus.getDeviceId()) {
                    return;
                }

                if (!this.deviceIds[event_bus.getDeviceId()].readyState) {
                    this.deviceIds[event_bus.getDeviceId()].readyState = this.READYSTATES.CREATED;
                }
            },

            prepareToSend: function() {
                this.pushDeviceId();
            },

            getCreator: function(_message) {
                var deviceIdKey;
                var message = _message ? _message : this;
                for (deviceIdKey in message.deviceIds) {
                    if (message.deviceIds[deviceIdKey].readyState === Message.prototype.READYSTATES.CREATED) {
                        return deviceIdKey;
                    }
                }
                deviceIdKey = null;
                return deviceIdKey;
            },

            isOwnMessage: function(_message) {
                var message = _message ? _message : this;
                var creatorId = Message.prototype.getCreator(message);
                return !creatorId || (creatorId === event_bus.getDeviceId() ||
                    message.deviceIds[creatorId].userId === users_bus.getUserId());
            },

            toJSON: function() {
                return {
                    id: this.id,
                    deviceIds: this.deviceIds
                }
            }

        };

        extend(Message, id_core);
        extend(Message, extend_core);

        return Message;
    });
