define('localization', [
    'ajax_core',
    'extend_core',
    //
    'text!../configs/localization_config.json'
  ],
  function(ajax_core,
           extend_core,
           //
           localization_config) {

    var localization = function() {
    };

    localization.prototype = {

      __class_name: "localization",

      localization_config: JSON.parse(localization_config),

      getLocConfig: function(callback) {
        window.localization_config = this.localization_config;
        window.localization = "en";
        callback();
      }
    };

    window.getLocText = function(id) {
      var text;
      window.localization_config.every(function(_config) {
        if (_config.id === id) {
          text = _config[window.localization];
        }
        return !text;
      });
      return text;
    };

    extend_core.prototype.inherit(localization, ajax_core);

    return new localization();
  }
);