define('localization',[
    'ajax_core'

],
    function(ajax_core) {

        var localization = function() {
        };

        localization.prototype = {

            __class_name: "localization",

            getLocConfig: function(callback) {
                this.sendRequest('/configs/localization_config.json', function(err, res) {
                    if (err) {
                        callback(err);
                        return;
                    }
                    window.localization_config = JSON.parse(res);
                    window.localization = "ru";
                });
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


        extend(localization, ajax_core);

        return new localization();
    }
);