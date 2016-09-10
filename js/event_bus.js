import event_core from '../js/event_core.js'
import extend_core from '../js/extend_core.js'

  var Event_bus = function() {
  };

  Event_bus.prototype = {

    set_ws_device_id: function(ws_device_id) {
      this.ws_device_id = ws_device_id;
    },

    get_ws_device_id: function() {
      return this.ws_device_id;
    }
  };

extend_core.prototype.inherit(Event_bus, event_core);

export default new Event_bus();