define('overlay', ['text!../html/waiter_template.html'],
    function(waiter_template) {

        var overlay = function() {
        };
        overlay.prototype = {

            __class_name: "overlay",

            renderWaiter: function(){
                var _this = this;
                //_this.waiter_template = _.template(waiter_template);
                _this.waiter_outer_container = document.querySelector('[data-role="waiter_outer_container"]');
                //_this.waiter_outer_container.innerHTML = _this.waiter_template();
                return _this;
            },

            toggleWaiter: function(show) {
                this.waiter_outer_container.classList[(show === true ? 'add' : 'remove')]('hide');
            }
        };

        return overlay;
    }
);