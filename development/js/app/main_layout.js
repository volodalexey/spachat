define('main_layout', [
        'template_core',
        'ajax_core',
        'navigator',
        'dom_core',
        'extend_core',
        'popap_manager',
        'description_manager',
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

            render: function() {
                var _this = this;
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


