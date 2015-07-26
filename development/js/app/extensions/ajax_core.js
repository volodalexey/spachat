define('ajax_core', [],
    function() {

        var ajax_core = function() {
        };

        ajax_core.prototype = {

            __class_name: "ajax_core",

            sendRequest: function(name, callback) {
                var xhr = new XMLHttpRequest();
                xhr.open('GET', name, true);

                xhr.onreadystatechange = function() {
                    if (xhr.readyState == 4) {
                        if (xhr.status != 200) {
                            callback('Error ' + xhr.status + ': ' + xhr.statusText);
                        } else {
                            callback(null, xhr.responseText);
                        }
                    }
                };
                xhr.send();
            }
        };
        return ajax_core;
    });
