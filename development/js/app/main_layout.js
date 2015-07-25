define('main_layout', [
        'template_core',
        'ajax_core',
        'navigator',
        'dom_core',
        //
        'text!../templates/index_template.ejs',
        'text!../templates/element/triple_element_template.ejs',
        'text!../templates/element/button_template.ejs',
        'text!../templates/element/label_template.ejs'
    ],
    function(template_core,
             ajax_core,
             navigator,
             dom_core,
            //
             index_template,
             triple_element_template,
             button_template,
             label_template
    ) {

        var Main_layout = function() {};

        Main_layout.prototype = {

            render: function() {
                var _this = this;

                _this.sendRequest('/configs/indexed_config.json', function(err, res) {
                    if (err) {
                        document.body.innerHTML = err;
                        return;
                    }

                    try {
                        var indexed_config = JSON.parse(res);
                    } catch (e) {
                        document.body.innerHTML = e;
                        return;
                    }
                    _this.getDescriptionIcon(null, null, null, function(res){
                        document.body.innerHTML += _this.index_template({
                            config: indexed_config,
                            icon_config: [{svg: res, name: 'description_icon'}],
                            triple_element_template: _this.triple_element_template,
                            button_template: _this.button_template,
                            label_template: _this.label_template
                        });

                        navigator.cashElements();
                        navigator.bindContexts();
                        navigator.addEventListeners();
                        navigator.navigate();
                    });
                });
            }
        };
        extend(Main_layout, ajax_core);
        extend(Main_layout, template_core);
        extend(Main_layout, dom_core);
        Main_layout.prototype.index_template = Main_layout.prototype.template(index_template);
        Main_layout.prototype.triple_element_template = Main_layout.prototype.template(triple_element_template);
        Main_layout.prototype.button_template = Main_layout.prototype.template(button_template);
        Main_layout.prototype.label_template = Main_layout.prototype.template(label_template);

        return new Main_layout();

    }
);