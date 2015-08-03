define('overlay_core', [
        'template_core',
        'extend_core',
        //
        'text!../templates/spinner_template.ejs',
        'text!../templates/horizontal_spinner_template.ejs'
    ],
    function(
        template_core,
        extend_core,
        //
        spinner_template,
        horizontal_spinner_template) {

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
                _this.waiter_outer_container.classList[(show === true ? 'remove' : 'add')]('hide');
            },

            showSpinner: function(element){
                var _this = this;
                element.innerHTML = _this.spinner_template();
            },

            showHorizontalSpinner: function(element){
                var _this = this;
                element.innerHTML = _this.horizontal_spinner_template();
            }
        };

        extend_core.prototype.inherit(overlay_core, template_core);

        overlay_core.prototype.spinner_template = overlay_core.prototype.template(spinner_template);
        overlay_core.prototype.horizontal_spinner_template = overlay_core.prototype.template(horizontal_spinner_template);

        return overlay_core;
    }
);