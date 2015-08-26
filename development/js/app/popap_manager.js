define('popap_manager', [
        'throw_event_core',
        'extend_core',
        'template_core',
        'render_layout_core',
        'dom_core',
        //
        'text!../templates/element/triple_element_template.ejs',
        'text!../templates/popap_template.ejs',
        'text!../templates/element/location_wrapper_template.ejs',
        'text!../templates/element/button_template.ejs',
        'text!../templates/element/label_template.ejs',
        'text!../templates/element/input_template.ejs',
        //
        'text!../configs/popap/confirm_config.json'

    ],
    function(throw_event_core,
             extend_core,
             template_core,
             render_layout_core,
             dom_core,
             //
             triple_element_template,
             popap_template,
             location_wrapper_template,
             button_template,
             label_template,
             input_template,
             //
             confirm_config) {

        var popap_manager = function() {
            this.bindMainContexts();
        };

        popap_manager.prototype = {

            MODE: {
                POPAP: 'POPAP'
            },

            confirm_config: JSON.parse(confirm_config),

            bindMainContexts: function() {
                var _this = this;
                _this.bindedOnDataActionClick = _this.onDataActionClick.bind(_this);
            },

            cashElement: function() {
                var _this = this;
                _this.popapOuterContainer = document.querySelector('[data-role="popap_outer_container"]');
                _this.popapContainer = document.querySelector('[data-role="popap_inner_container"]');
            },

            render: function(options) {
                var _this = this;
                _this.body_mode = _this.MODE.POPAP;
                _this.elementMap = {
                    "POPAP": _this.popapContainer
                };
                _this.config = _this.prepareConfig(options.config);
                _this.getDescriptionIcon(null, null, null, function(res){
                    _this.icon_config = [{svg: res, name: 'description_icon'}];
                    _this.fillBody(null, null, options, null);
                    _this.popapOuterContainer.classList.remove('hide');
                });
            },

            renderPopap: function(type, options, onDataActionClick) {
                var _this = this, config;
                _this.onDataActionClick = onDataActionClick;
                switch (type) {
                    case 'confirm':
                        config = _this.confirm_config;
                        break;
                    case 'error':

                        break;
                    case 'success':

                        break;
                }
                this.render({
                    "body_text": typeof options.message === "number" ? window.getLocText(options.message) : options.message,
                    "config": config
                });
            },

            onDataActionClick: function(event) {
                var _this = this;
                if (_this.onDataActionClick) {
                    _this.onDataActionClick(event);
                }
            },

            onClose: function() {
                var _this = this;
                _this.popapContainer.innerHTML = null;
                _this.onDataActionClick = null;
                _this.popapOuterContainer.classList.add('hide');
            },

            onHandlers: function() {
                var _this = this;
                _this.offHandlers();
                _this.addRemoveListener('add', _this.popapContainer, 'click', _this.bindedOnDataActionClick, false);
            },

            offHandlers: function() {
                var _this = this;
                _this.addRemoveListener('remove', _this.popapContainer, 'click', _this.bindedOnDataActionClick, false);
            },

            destroy: function() {
                var _this = this;
            }
        };

        extend_core.prototype.inherit(popap_manager, throw_event_core);
        extend_core.prototype.inherit(popap_manager, template_core);
        extend_core.prototype.inherit(popap_manager, render_layout_core);
        extend_core.prototype.inherit(popap_manager, dom_core);

        popap_manager.prototype.triple_element_template = popap_manager.prototype.template(triple_element_template);
        popap_manager.prototype.location_wrapper_template = popap_manager.prototype.template(location_wrapper_template);
        popap_manager.prototype.button_template = popap_manager.prototype.template(button_template);
        popap_manager.prototype.label_template = popap_manager.prototype.template(label_template);
        popap_manager.prototype.input_template = popap_manager.prototype.template(input_template);
        popap_manager.prototype.popap_template = popap_manager.prototype.template(popap_template);

        popap_manager.prototype.templateMap = {
            "POPAP": popap_manager.prototype.popap_template
        };

        return new popap_manager();
    });
