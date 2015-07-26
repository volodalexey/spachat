define('throw_event_core', [
        'event_core',
        'event_bus',
        'dom_core'

    ],
    function (
        event_core,
        event_bus,
        dom_core
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
                var _this = this, element = _this.getDataParameter(event.target, 'action');
                if (element) {
                    if (_this[element.dataset.action]) {
                        _this[element.dataset.action](element);
                    }
                }
            },

            throwEventRouter: function(event) {
                var _this = this, element = _this.getDataParameter(event.target, 'action');
                if (element) {
                    if (element.dataset.action && element.dataset.throw) {
                        _this.throwEvent(element.dataset.action, element);
                    }
                }
            },

            throwEvent: function(name, data) {
                event_bus.trigger('throw', name, data);
            },

            triggerRouter: function(event) {
                var action = event.target.dataset.action;
                if (action) {
                    this.trigger(action);
                }
            }
        };

        extend(throw_event_core, event_core);
        extend(throw_event_core, dom_core);

        return throw_event_core;
    }
);