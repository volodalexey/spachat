define('html_log_message', [
    'extend_core'
  ],
  function(extend_core) {
    var defaultOptions = {
      innerHTML: ""
    };
    /**
     * HTML_log_message model
     * @param options - options to override basic parameters
     */
    var HTML_log_message = function(options) {
      if (!options.id) {
        this.id = Date.now();
      }
      this.extend(this, defaultOptions);
      this.extend(this, options);
    };

    HTML_log_message.prototype = {

      toJSON: function() {
        return {
          id: this.id,
          innerHTML: this.innerHTML
        }
      }

    };

    extend_core.prototype.inherit(HTML_log_message, extend_core);

    return HTML_log_message;
  });
