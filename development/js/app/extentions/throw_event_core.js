define('throw_event_core', [
        'event_core'
    ],
    function (
        event_core
) {

        var throw_event_core = function() {};

        throw_event_core.prototype = {

            __class_name: "throw_event_core",

            /**
             * Adds or removes event listener
             * defines from which place this function was called
             * @param element
             * @param eventName
             * @param listener
             * @param phase
             */
            addRemoveListener: function(action, element, eventName, listener, phase) {
                if (!element || !listener || !eventName) {
                    return;
                }
                if (action === 'add') {
                    element.addEventListener(eventName, listener, phase);
                } else if (action === 'remove') {
                    element.removeEventListener(eventName, listener, phase);
                }
            },

            dataActionRouter: function(event) {
                var _this = this, action, n = 3, parent;
                var element = event.target;
                var getDataAction =  function(element, n) {
                    action = element.getAttribute('data-action');
                    if (element.disabled) {
                        action = null;
                        return;

                    }
                    if (!action && n > 0) {
                        parent = element.parentNode;
                        getDataAction(parent, n-1);
                    }
                };
                getDataAction(element, n);
                if (_this[action]) {
                    if(!parent){
                        _this[action](event);
                    } else {
                        _this[action]({'target': parent});
                    }
                }
            },

            throwEventRouter: function(event) {
                var _this = this;
                var action = event.target.dataset.action;
                var data_throw_to = event.target.dataset.throw_to;
                var data_mode_to = event.target.dataset.mode_to;
                var data_chat_part = event.target.dataset.chat_part;

                if (_this.throwEvent) {
                    event.data_throw_to = data_throw_to;
                    event.data_mode_to = data_mode_to;
                    event.data_chat_part = data_chat_part;
                    if (!event.data_param) {
                        event.data_param = true;
                    } else {
                        event.data_param = false;
                    }
                    _this.throwEvent(action, event);
                }
            },

            throwEvent: function(name, data) {
                this.trigger('throw', name, data);
            },

            triggerRouter: function(event) {
                var action = event.target.getAttribute('data-action');
                if (action) {
                    this.trigger(action);
                }
            }
        };

        extend(throw_event_core, event_core);

        return throw_event_core;
    }
);