import extend_core from '../js/extend_core.js'
import id_core from '../js/id_core.js'
import users_bus from '../js/users_bus.js'
import event_bus from '../js/event_bus.js'
import model_core from '../js/model_core.js'

var defaultOptions = {
  innerHTML: ""
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
      user_ids: this.user_ids,
      innerHTML: this.innerHTML
    }
  }

};

extend_core.prototype.inherit(HTML_message, id_core);
extend_core.prototype.inherit(HTML_message, extend_core);
extend_core.prototype.inherit(HTML_message, model_core);

export default HTML_message;
