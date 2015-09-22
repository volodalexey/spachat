define('render_layout_core', [
        'indexeddb',
        'async_core',
        'dom_core',
        'extend_core'
    ],
    function(indexeddb,
             async_core,
             dom_core,
             extend_core) {

        var render_layout_core = function() {
        };
        render_layout_core.prototype = {

            __class_name: "render_layout_core",

            renderLayout: function(options, callback) {
                var _this = this;
                _this.iconsArray = [];
                _this.loadBodyConfig(null, options, function(confErr) {
                    _this.loadBodyData(confErr, options, function(dataErr, options, data) {
                        _this.fillBody(dataErr, options, data, function(templErr) {
                            if (templErr) {
                                console.error(templErr);
                                return;
                            }

                            // success
                            if (callback) {
                                callback();
                            }
                        });
                    });

                });
            },

            loadBodyConfig: function(_err, options, callback) {
                var _this = this;
                if (_err) {
                    callback(_err);
                    return;
                }

                if (_this.configMap[_this.body_mode]) {
                    var currentConfig = _this.configMap[_this.body_mode];

                    if (_this.configHandlerMap[_this.body_mode]) {
                        var context = _this.configHandlerContextMap[_this.body_mode] ? _this.configHandlerContextMap[_this.body_mode] : _this;
                        _this.config = _this.configHandlerMap[_this.body_mode].call(context, currentConfig);
                    } else {
                        _this.config = currentConfig;
                    }
                    if (_this.MODE && _this.body_mode === _this.MODE.USER_INFO_SHOW ||
                        _this.MODE && _this.body_mode === _this.MODE.USER_INFO_EDIT) {
                        _this.module.config = _this.config;
                    }
                    callback();
                } else {
                    callback();
                }
            },

            loadBodyData: function(_err, options, callback) {
                var _this = this;
                if (_err) {
                    callback(_err);
                    return;
                }

                if (_this.dataMap[_this.body_mode]) {
                    var collectionDescription = _this.dataMap[_this.body_mode];

                    if (_this.module.user) {
                        callback(null, _this.module.user);
                        return;
                    }

                    indexeddb.getAll(collectionDescription, null, function(getAllErr, data) {
                        if (getAllErr) {
                            callback(getAllErr);
                        } else {
                            if (_this.dataHandlerMap[_this.body_mode]) {
                                var context = _this.dataHandlerContextMap[_this.body_mode] ? _this.dataHandlerContextMap[_this.body_mode] : _this;
                                callback(null, options, _this.dataHandlerMap[_this.body_mode].call(context, options, data));
                            } else {
                                callback(null, options, data);
                            }
                        }
                    });
                } else {
                    callback(null, null, options);
                }
            },

            fillBody: function(_err, options, data, callback) {
                var _this = this;
                if (_err) {
                    callback(_err);
                    return;
                }

                var currentTemplate = _this.templateMap[_this.body_mode];
                if (currentTemplate) {
                    _this.elementMap[_this.body_mode].innerHTML = currentTemplate({
                        config: _this.config,
                        mode: _this.body_mode,
                        data: data,
                        options: options,
                        description: _this.description,
                        triple_element_template: _this.triple_element_template,
                        join_locations_template: _this.join_locations_template,
                        location_wrapper_template: _this.location_wrapper_template,
                        button_template: _this.button_template,
                        input_template: _this.input_template,
                        label_template: _this.label_template,
                        textarea_template: _this.textarea_template,
                        select_template: _this.select_template
                    });
                    if (_this.cashBodyElement) {
                        _this.cashBodyElement();
                    }
                }
                if (callback) {
                    callback();
                }
            },


            prepareConfig: function(rawConfig) {
                var byDataLocation = {};
                rawConfig.forEach(function(_config) {
                    if (!_config.location) {
                        return;
                    }
                    if (!byDataLocation[_config.location]) {
                        byDataLocation[_config.location] = {
                            configs: []
                        };
                    }
                    if (!_config.role) {
                        byDataLocation[_config.location].configs.push(_config);
                    } else if (_config.role === 'locationWrapper') {
                        byDataLocation[_config.location].wrapperConfig = _config;
                    }
                });

                rawConfig.byDataLocation = byDataLocation;
                return rawConfig;
            }
        };
        extend_core.prototype.inherit(render_layout_core, async_core);
        extend_core.prototype.inherit(render_layout_core, dom_core);

        return render_layout_core;
    }
);