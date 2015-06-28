define('message', [
        'id_core',
        'extend_core'
    ],
    function(
        id_core,
        extend_core
    ) {
        var defaultOptions = {
            innerHTML : ""
        };
        /**
         * Message model
         * @param options - options to override basic parameters
         */
        var Message = function(options) {
            this.id = this.generateId();
            this.extend(this, defaultOptions);
            this.extend(this, options);

            if (!this.ids) {
                this.ids = {};
            }

            if (!this.ids[this.id]) {
                this.ids[this.id] = {};
            }

            if (!this.ids[this.id].dateTime) {
                this.ids[this.id].dateTime = Date.now();
            }

            if (!this.ids[this.id].readyState) {
                this.ids[this.id].readyState = this.READYSTATES.CREATED;
            }
        };

        Message.prototype = {

            READYSTATES: {
                CREATED: 'CREATED',
                SENDING: 'SENDING',
                SENT: 'SENT'
            }

        };

        extend(Message, id_core);
        extend(Message, extend_core);

        return Message;
    });
