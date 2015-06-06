define('settings', [
        'chat',
        'event_core',
        'ajax_core',
        'template_core',
        'indexeddb',

        'text!../html/setting_template.html',
        'text!../html/element/triple_element_template.html',
        'text!../html/element/button_template.html',
        'text!../html/element/label_template.html',
        'text!../html/element/input_template.html'
    ],
    function(chat,
             event_core,
             ajax_core,
             template_core,
             indexeddb,

             setting_template,
             triple_element_template,
             button_template,
             label_template,
             input_template) {

        var settings = function(options) {

        };

        settings.prototype = {

            configMap: {
                "SETTING": ''
            },

            renderSettings: function(options) {
                var _this = this;
                _this.chat = options.chat;
                this.body_outer_container = options.chat.body_outer_container;
                this.header_container = options.chat.chatElem.querySelector('[data-role="header_outer_container"]');
                _this.filter_container = _this.header_container.querySelector('[data-role="filter_container"]');

                if (!_this.filter_container.classList.contains('hide')) {
                    _this.filter_container.classList.add('hide');
                }
                //_this.trigger('calcOuterContainerHeight');
                if (_this.chat.data.body_mode === _this.chat.MODE.SETTING) {
                    _this.trigger('renderMassagesEditor');
                    _this.chat.data.body_mode = _this.chat.MODE.MESSAGES;
                    _this.body_outer_container.classList.remove('background');
                } else {
                    _this.chat.data.body_mode = _this.chat.MODE.SETTING;
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

        extend(settings, event_core);
        extend(settings, ajax_core);
        extend(settings, template_core);

        settings.prototype.setting_template = settings.prototype.template(setting_template);
        settings.prototype.triple_element_template = settings.prototype.template(triple_element_template);
        settings.prototype.button_template = settings.prototype.template(button_template);
        settings.prototype.label_template = settings.prototype.template(label_template);
        settings.prototype.input_template = settings.prototype.template(input_template);


        settings.prototype.dataMap = {
            "SETTING": ""
        };

        settings.prototype.templateMap = {
            "SETTING": settings.prototype.setting_template
        };

        return settings;
    });
