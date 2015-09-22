define('main_layout', [
        'template_core',
        'ajax_core',
        'navigator',
        'dom_core',
        'extend_core',
        'popap_manager',
        'description_manager',
        'event_bus',
        //
        'text!../templates/index_template.ejs',
        'text!../templates/element/triple_element_template.ejs',
        'text!../templates/element/button_template.ejs',
        'text!../templates/element/label_template.ejs',
        'text!../templates/element/select_template.ejs',
        //
        'text!../configs/indexed_config.json'
    ],
    function(template_core,
             ajax_core,
             navigator,
             dom_core,
             extend_core,
             popap_manager,
             description_manager,
             event_bus,
             //
             index_template,
             triple_element_template,
             button_template,
             label_template,
             select_template,
             //
             indexed_config) {

        var Main_layout = function() {
        };

        Main_layout.prototype = {

            indexed_config: JSON.parse(indexed_config),

            cashElements: function() {
                var _this = this;
                _this.waiter = document.body.innerHTML;
                //_this.waiter_innerHTML = _this.waiter.innerHTML;
            },

            unCashElements: function() {
                var _this = this;
                _this.waiter = null;
                //_this.waiter_innerHTML = null;
            },

            render: function() {
                var _this = this;
                _this.addEventListeners();
                _this.cashElements();
                document.body.innerHTML += _this.index_template({
                    config: _this.indexed_config,
                    triple_element_template: _this.triple_element_template,
                    button_template: _this.button_template,
                    select_template: _this.select_template,
                    label_template: _this.label_template
                });

                navigator.cashElements();
                navigator.bindContexts();
                navigator.addEventListeners();
                navigator.navigate();
                popap_manager.cashElements();
                popap_manager.onHandlers();
                description_manager.cashElements();
                description_manager.addEventListeners();
            },

            addEventListeners: function() {
                var _this = this;
                _this.removeEventListeners();
                event_bus.on('mainRebuild', _this.rebuild, _this);
            },

            removeEventListeners: function() {
                var _this = this;
                event_bus.off('mainRebuild', _this.rebuild);
            },

            rebuild: function() {
                var _this = this;
                document.body.innerHTML = '';
                document.body.innerHTML = _this.waiter;
                _this.destroy();
                _this.render();
            },

            destroy: function() {
                var _this = this;
                _this.unCashElements();
                navigator.unCashElements();
                navigator.unBindContexts();
                navigator.removeEventListeners();
                popap_manager.unCashElements();
                popap_manager.offHandlers();
                description_manager.unCashElements();
                description_manager.removeEventListeners();
            }
        };
        extend_core.prototype.inherit(Main_layout, ajax_core);
        extend_core.prototype.inherit(Main_layout, template_core);
        extend_core.prototype.inherit(Main_layout, dom_core);
        Main_layout.prototype.index_template = Main_layout.prototype.template(index_template);
        Main_layout.prototype.triple_element_template = Main_layout.prototype.template(triple_element_template);
        Main_layout.prototype.button_template = Main_layout.prototype.template(button_template);
        Main_layout.prototype.label_template = Main_layout.prototype.template(label_template);
        Main_layout.prototype.select_template = Main_layout.prototype.template(select_template);

        return new Main_layout();

    }
);


