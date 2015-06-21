define('event_core',
    function () {

        var event_core = function() {};

        event_core.prototype = {

            __class_name: "event_core",

            initializeListeners: function() {
                if (!this.listeners) {
                    this.listeners = {};
                }
            },

            on: function(event, handler, context) {
                this.initializeListeners();

                if (this.listeners[event] === undefined) {
                    this.listeners[event] = [];
                }

                if (this.listeners[event].indexOf(handler) === -1) {
                    this.listeners[event].push({
                        handler : handler,
                        context : context || this
                    });
                }
                return this;
            },

            off: function(event, handler) {
                this.initializeListeners();
                var idx;
                if (!event) {
                    this.listeners = {};
                    return this;
                }
                if (!this.listeners[event]) { return this; }

                if (!handler) {
                    delete this.listeners[event];
                } else {
                    idx = this.listeners[event].map(function(listener) { return listener.handler }).indexOf(handler);
                    if (idx !== -1) {
                        this.listeners[event].splice(idx, 1);
                    }
                }
                return this;
            },

            trigger: function(name) {
                this.initializeListeners();
                var args = Array.prototype.slice.call(arguments, 1);
                (this.listeners[name] || []).forEach(function(listener){
                    listener.handler.apply(listener.context, args);
                });
                return this;
            },

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
                var action = event.target.getAttribute('data-action');
                var data_throw_to = event.target.getAttribute('data-throw_to');
                var data_mode_to = event.target.getAttribute('data-mode-to');
                var data_chat_part = event.target.getAttribute('data-chat-part');
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

        return event_core;
    }
);