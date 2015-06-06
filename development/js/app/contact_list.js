define('contact_list', [
        'event_core',
        'ajax_core',
        'template_core',
        'indexeddb',
        'render_layout_core',

        'text!../html/contact_list_template.html',
        'text!../html/element/triple_element_template.html',
        'text!../html/element/button_template.html',
        'text!../html/element/label_template.html',
        'text!../html/element/input_template.html'
    ],
    function(event_core,
             ajax_core,
             template_core,
             indexeddb,
             render_layout_core,
             contact_list_template,
             triple_element_template,
             button_template,
             label_template,
             input_template) {

        var contact_list = function(options) {
            this.body_outer_container = options.chat.body_outer_container;
            this.header_container = options.chat.chatElem.querySelector('[data-role="header_outer_container"]');

        };

        contact_list.prototype = {

            MODE: {
                CONTACT_LIST: 'CONTACT_LIST',
                MESSAGES: 'MESSAGES'
            },

            configMap: {
                "CONTACT_LIST": '/mock/contact_list_config.json'
            },

            renderContactList: function(options) {
                var _this = this;
                _this.chat = options.chat;
                _this.filter_container = _this.header_container.querySelector('[data-role="filter_container"]');

                if (!_this.filter_container.classList.contains('hide')) {
                    _this.filter_container.classList.add('hide');
                }
                //_this.trigger('calcOuterContainerHeight');
                if (_this.chat.data.body_mode === _this.chat.MODE.CONTACT_LIST) {
                    _this.trigger('renderMassagesEditor');
                    _this.chat.data.body_mode = _this.chat.MODE.MESSAGES;
                    _this.body_outer_container.classList.remove('background');
                } else {
                    _this.chat.data.body_mode = _this.chat.MODE.CONTACT_LIST;
                    _this.body_outer_container.classList.add('background');
                    _this.body_mode = _this.chat.data.body_mode;
                    _this.elementMap = {
                        "CONTACT_LIST": _this.body_outer_container
                    };
                    _this.renderLayout(null);
                }
            }
        }

        extend(contact_list, event_core);
        extend(contact_list, ajax_core);
        extend(contact_list, template_core);
        extend(contact_list, render_layout_core);

        contact_list.prototype.contact_list_template = contact_list.prototype.template(contact_list_template);
        contact_list.prototype.triple_element_template = contact_list.prototype.template(triple_element_template);
        contact_list.prototype.button_template = contact_list.prototype.template(button_template);
        contact_list.prototype.label_template = contact_list.prototype.template(label_template);
        contact_list.prototype.input_template = contact_list.prototype.template(input_template);

        contact_list.prototype.dataMap = {
            "CONTACT_LIST": ""
        };

        contact_list.prototype.templateMap = {
            "CONTACT_LIST": contact_list.prototype.contact_list_template
        };

        return contact_list;
    });
