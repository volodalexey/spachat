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

            initialize: function(options) {
                var _this = this;
                _this.addEventListeners();
                _this.chat = options.chat;
                _this.contact_list_template = _.template(contact_list_template);
                _this.body_outer_container = _this.chat.body_outer_container;
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
                _this.filter_container = _this.chat.header_container.querySelector('[data-role="filter_container"]');
                if (!_this.filter_container.classList.contains('hide')) {
                    _this.filter_container.classList.add('hide');
                }
                _this.trigger('calcOuterContainerHeight');
                if (_this.chat.data.body_mode === "contact_list") {
                    _this.trigger('renderMassagesEditor');
                    _this.trigger('renderPagination');
                    _this.chat.data.body_mode = "messages";
                    _this.body_outer_container.classList.remove('background');
                } else {
                    _this.body_outer_container.innerHTML = _this.contact_list_template();
                    _this.chat.data.body_mode = "contact_list";
                    _this.body_outer_container.classList.add('background');
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

        return contact_list;
    });
