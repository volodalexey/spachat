define('overlay', [],
    function () {

        var overlay = function() {};
        overlay.prototype = {

            //__class_name: "overlay",

            initialize: function(){
                var _this = this;
                _this.waiter_outer_container = document.querySelector('[data-role="waiter_outer_container"]');
            },

            toggleOverlay: function(show) {
                if (show) {
                    this.waiter_outer_container.classList.remove('hide');
                } else {
                    this.waiter_outer_container.classList.add('hide');
                }
            },

            toggleWaiter: function(show) {
                var _this = this;
                _this.waiter_outer_container.classList[(show === true ? 'add' : 'remove')]('hide');

                //this.toggleOverlay(show);
               /* if(!show){
                    _this.waiter_outer_container.classList.remove('hide');
                } else {
                    _this.waiter_outer_container.classList.add('hide');
                }*/
            }
        };

        return new overlay();
    }
);