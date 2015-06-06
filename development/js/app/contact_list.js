define('contact_list', [
        'event_core',
        'ajax_core',
        'template_core',
        'indexeddb',

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
             contact_list_template,
             triple_element_template,
             button_template,
             label_template,
             input_template) {

        var contact_list = function(options) {

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
                this.body_outer_container = options.chat.body_outer_container;
                this.header_container = options.chat.chatElem.querySelector('[data-role="header_outer_container"]');
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
                    _this.loadBodyConfig(null, function(confErr) {
                        _this.loadBodyData(confErr, function(dataErr, data) {
                            _this.fillChatBody(dataErr, data, function(templErr) {
                                if (templErr) {
                                    console.error(templErr);
                                    return;
                                }

                                // success
                            });
                        });
                    });
                }

            },

            loadBodyConfig: function(_err, callback) {
                var _this = this;
                if (_err) {
                    callback(_err);
                    return;
                }

                if (_this.configMap[_this.chat.data.body_mode]) {
                    _this.sendRequest(_this.configMap[_this.chat.data.body_mode], function(err, res) {
                        if (err) {
                            callback(err);
                            return;
                        }
                        _this.chat_body_config = JSON.parse(res);
                        callback();
                    });
                } else {
                    callback();
                }
            },

            loadBodyData: function(_err, callback) {
                var _this = this;
                if (_err) {
                    callback(_err);
                    return;
                }

                if (_this.dataMap[_this.chat.data.body_mode]) {
                    var collectionDescription = _this.dataMap[_this.chat.data.body_mode];
                    indexeddb.getAll(collectionDescription, function(getAllErr, data) {
                        if (getAllErr) {
                            callback(getAllErr);
                        } else {
                            if (_this.dataHandlerMap[_this.chat.data.body_mode]) {
                                callback(null, _this.dataHandlerMap[_this.chat.data.body_mode].call(_this, data));
                            } else {
                                callback(null, data);
                            }
                        }
                    });
                } else {
                    callback();
                }
            },

            fillChatBody: function(_err, data, callback) {
                var _this = this;
                if (_err) {
                    callback(_err);
                    return;
                }
                var currentTemplate = _this.templateMap[_this.chat.data.body_mode];
                if (currentTemplate) {
                    _this.body_outer_container.innerHTML = currentTemplate({
                        config: _this.chat_body_config,
                        triple_element_template: _this.triple_element_template,
                        button_template: _this.button_template,
                        input_template: _this.input_template,
                        label_template: _this.label_template,
                        mode: _this.chat.data.body_mode,
                        data: data
                    });
                }
            }
        };

        extend(contact_list, event_core);
        extend(contact_list, ajax_core);
        extend(contact_list, template_core);

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
