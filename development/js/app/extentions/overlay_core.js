define('overlay_core', [],
    function() {

        var overlay_core = function() {
        };
        overlay_core.prototype = {

            __class_name: "overlay_core",

            renderWaiter: function(){
                var _this = this;
                return _this;
            },

            toggleWaiter: function(show) {
                var _this = this;
                _this.waiter_outer_container = document.querySelector('[data-role="waiter_outer_container"]');
                this.waiter_outer_container.classList[(show === true ? 'add' : 'remove')]('hide');
            }
        };

        return overlay_core;
    }
);