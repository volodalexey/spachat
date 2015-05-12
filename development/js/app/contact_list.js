define('contact_list', [
        'event_core',
        'ajax_core',
        'text!../html/contact_list_template.html'
    ],
    function(event_core,
             ajax_core,
             contact_list_template) {

        var contact_list = function() {
        };

        contact_list.prototype = {

            initialize: function(newChat) {
                var _this = this;
                _this.addEventListeners();
                _this.newChat = newChat;
                _this.contact_list_template = _.template(contact_list_template);
                _this.body_outer_container = _this.newChat.querySelector('[data-role="body_outer_container"]');
                _this.renderContactList();
                return _this;
            },

            addEventListeners: function() {
                var _this = this;
                _this.removeEventListeners();
            },

            removeEventListeners: function() {
                var _this = this;
            },

            renderContactList: function() {
                var _this = this;
                _this.trigger('calcOuterContainerHeight');
                var param = _this.body_outer_container.getAttribute('param-content');
                if (param === "contact_list") {
                    _this.trigger('renderMassagesEditor');
                    _this.body_outer_container.setAttribute("param-content", "message");
                } else {
                    _this.body_outer_container.innerHTML = _this.contact_list_template();
                    _this.body_outer_container.setAttribute("param-content", "contact_list");
                    this.sendRequest('/mock/contact_list_config.json', function(err, res) {
                        if (err) {
                            console.log("Error");
                        } else {
                            _this.contact_body = _this.body_outer_container.querySelector('[data-role="contact_body"]');
                            _this.contact_body.innerHTML = res;
                        }
                    });
                }
            }
        }

        extend(contact_list, event_core);
        extend(contact_list, ajax_core);

        return new contact_list();
    });
