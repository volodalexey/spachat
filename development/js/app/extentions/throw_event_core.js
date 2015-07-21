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
/*                var _this = this, action, n = 3, parent;
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
                }*/

                var _this = this, options;
                var element = event.target;

                options = _this.getDataAction(element);
                if (options) {
                    if (_this[options.action]) {
                        if(!options.parent){
                            _this[options.action](event);
                        } else {
                            _this[options.action]({'target': options.parent});
                        }
                    }
                }

            },

            throwEventRouter: function(event) {
                var _this = this, options, element = event.target;
                options = _this.getDataAction(element);

                if (options) {
                    if (options.action && options.throw) {
                        if(!options.parent){
                            _this.throwEvent(options.action, event);
                        } else {
                            _this.throwEvent(options.action, options.parent);
                            //_this[options.action]({'target': options.parent});
                        }

                    }
                }
                //var action = event.target.dataset.action;


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