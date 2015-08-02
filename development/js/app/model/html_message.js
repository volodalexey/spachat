define('html_message', [
        'id_core',
        'extend_core',
        'model_core',
        'users_bus',
        'event_bus'
    ],
    function(
        id_core,
        extend_core,
        model_core,
        users_bus,
        event_bus
    ) {
        var defaultOptions = {
            innerHTML : ""
        };
        /**
         * HTML_message model
         * @param options - options to override basic parameters
         */
        var HTML_message = function(options) {
            if (!options.messageId) {
                this.messageId = this.generateId();
            }
            this.extend(this, defaultOptions);
            this.extend(this, options);

            this.setCreator();
            this.addMyUserId();
        };

        HTML_message.prototype = {

            toJSON: function() {
                return {
                    createdDatetime: this.createdDatetime,
                    createdByUserId: this.createdByUserId,
                    receivedDatetime: this.receivedDatetime,
                    messageId: this.messageId,
                    userIds: this.userIds,
                    innerHTML: this.innerHTML
                }
            }

        };

        extend(HTML_message, id_core);
        extend(HTML_message, extend_core);
        extend(HTML_message, model_core);

        return HTML_message;
    });
