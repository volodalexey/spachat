define('header', [
        'event_core',
        'ajax_core',
        'async_core',
        'template_core',
        'indexeddb',

        'pagination',

        'text!../html/filter_template.html',
        'text!../html/header_template.html',
        'text!../html/element/triple_element_template.html',
        'text!../html/element/button_template.html',
        'text!../html/element/label_template.html',
        'text!../html/element/input_template.html'
    ],
    function(event_core,
             ajax_core,
             async_core,
             template_core,
             indexeddb,
             pagination,
             filter_template,
             header_template,
             triple_element_template,
             button_template,
             label_template,
             input_template) {

        var header = function(options) {
            this.bindMainContexts();
        };

        header.prototype = {

            configMap: {
                "WEBRTC": '',
                MESSAGES_DISCONNECTED: '/mock/header_navbar_config.json'
            },

            MODE_DESCRIPTION: {
                WEBRTC: 'Web RTC Initialization',
                MESSAGES_DISCONNECTED: 'Chat Messages'
            },

            bindMainContexts: function() {
                var _this = this;
                _this.bindedTriggerRouter = _this.triggerRouter.bind(_this);
                _this.bindedRenderFilter = _this.renderFilter.bind(_this);
            },

            addMainEventListener: function() {
                var _this = this;
                _this.removeMainEventListeners();
                _this.addRemoveListener('add', _this.header_outer_container, 'click', _this.bindedTriggerRouter, false);
                _this.on('renderFilter', _this.bindedRenderFilter, _this);
            },

            removeMainEventListeners: function() {
                var _this = this;
                _this.addRemoveListener('remove', _this.header_outer_container, 'click', _this.bindedTriggerRouter, false);
                _this.off('renderFilter', _this.bindedRenderFilter, _this);

            },

            render: function(options, chat) {
                var _this = this;
                _this.chat = chat;

                switch (_this.chat.mode) {
                    case _this.chat.MODE.MESSAGES_DISCONNECTED:
                        _this.loadHeaderConfig(null, function(confErr) {
                            _this.loadHeaderData(confErr, function(dataErr, data) {
                                _this.fillHeader(dataErr, data, function(templErr) {
                                    if (templErr) {
                                        console.error(templErr);
                                        return;
                                    }
                                    _this.filter_container = _this.chat.header_outer_container.querySelector('[data-role="filter_container"]');
                                    _this.addMainEventListener();
                                });
                            });
                        });
                        break;
                    case "WEBRTC":
                        _this.fillHeader(null, null, null);
                        break;
                }
            },

            loadHeaderConfig: function(_err, callback) {
                var _this = this;
                if (_err) {
                    callback(_err);
                    return;
                }

                if (_this.configMap[_this.chat.mode]) {
                    _this.sendRequest(_this.configMap[_this.chat.mode], function(err, res) {
                        if (err) {
                            callback(err);
                            return;
                        }
                        _this.header_config = JSON.parse(res);
                        callback();
                    });
                } else {
                    callback();
                }
            },

            loadHeaderData: function(_err, callback) {
                var _this = this;
                if (_err) {
                    callback(_err);
                    return;
                }

                if (_this.dataMap[_this.chat.mode]) {
                    var collectionDescription = _this.dataMap[_this.chat.mode];
                    indexeddb.getAll(collectionDescription, function(getAllErr, data) {
                        if (getAllErr) {
                            callback(getAllErr);
                        } else {
                            if (_this.dataHandlerMap[_this.chat.mode]) {
                                callback(null, _this.dataHandlerMap[_this.chat.mode].call(_this, data));
                            } else {
                                callback(null, data);
                            }
                        }
                    });
                } else {
                    callback();
                }
            },

            fillHeader: function(_err, data, callback) {
                var _this = this;
                if (_err) {
                    callback(_err);
                    return;
                }
                var currentTemplate = _this.templateMap[_this.chat.mode];
                if (currentTemplate) {
                    _this.chat.header_outer_container.innerHTML = currentTemplate({
                        header_btn: _this.header_config,
                        triple_element_template: _this.triple_element_template,
                        button_template: _this.button_template,
                        input_template: _this.input_template,
                        label_template: _this.label_template,
                        mode: _this.chat.mode,
                        data: data,
                        description: _this.MODE_DESCRIPTION[_this.chat.mode]
                    });
                }
                callback();
            },



            // --------------------- Filter
            forceRenderMessages: function(callback) {
                var _this = this;
                if (_this.chat.data.body_mode !== "messages") {
                    _this.trigger('renderMassagesEditor', callback);
                    //_this.trigger('renderPagination');
                    _this.chat.data.body_mode = "messages";
                    _this.body_outer_container.setAttribute("param-content", "message");
                    _this.body_outer_container.classList.remove('background');
                } else {
                    callback();
                }
            },

            renderFilter: function() {
                var _this = this;

                if (_this.chat.data.body_mode !== _this.chat.MODE.MESSAGES) {
                    _this.chat.data.body_mode = _this.chat.MODE.MESSAGES;
                    _this.body_outer_container.classList.remove('background');
                    _this.trigger('renderMassagesEditor');
                }




                _this.sendRequest("/mock/filter_navbar_config.json", function(err, res) {
                    if (err) {
                        console.log(err);
                    } else {
                        _this.filter_navbar_config = JSON.parse(res);

                        _this.forceRenderMessages(function() {
                            if (_this.filter_container.classList.contains('hide')) {
                                _this.filter_container.classList.remove('hide');
                                _this.filter_container.innerHTML = _this.filter_template({
                                    filter_navbar_config: _this.filter_navbar_config,
                                    triple_element_template: _this.triple_element_template,
                                    button_template: _this.button_template,
                                    input_template: _this.input_template,
                                    label_template: _this.label_template,
                                    mode: _this.chat.data.redraw_mode
                                });
                                _this.enablePagination = _this.filter_container.querySelector('input[data-role="enable_pagination"]');
                                if (_this.enablePagination) {
                                    _this.enablePagination.checked = _this.chat.data.valueEnablePagination;
                                    _this.enablePagination.addEventListener('change', _this.renderPagination.bind(_this), false);
                                }
                                _this.labeltPerPage = _this.filter_container.querySelector('input[data-role="per_page"]');
                                if (_this.labeltPerPage) {
                                    _this.labeltPerPage.addEventListener('input', _this.changePerPage.bind(_this), false);
                                    _this.labeltPerPage.value = _this.chat.data.per_page_value;
                                }
                                _this.btnPerPage = _this.filter_container.querySelector('button[data-role="per_page"]');
                                if (_this.btnPerPage) {
                                    _this.btnPerPage.addEventListener('click', _this.showPerPage.bind(_this), false);
                                }
                                _this.real_time_editing = _this.filter_container.querySelector('input[data-role="real_time_editing"]');
                                if (_this.real_time_editing) {
                                    _this.real_time_editing.addEventListener('change', _this.changeRealTimeEditing.bind(_this), false);
                                }
                                if (_this.chat.data.redraw_mode === "rte") {
                                    _this.real_time_editing.checked = true;
                                } else {
                                    _this.real_time_editing.checked = false;
                                }
                            } else {
                                _this.valueEnablePagination = _this.chat.chat_element.querySelector('[data-role="enable_pagination"]').checked;
                                _this.per_page = _this.chat.chat_element.querySelector('[data-role="per_page"]');
                                _this.per_page_value = parseInt(_this.per_page.value);
                                _this.filter_container.innerHTML = "";
                                _this.filter_container.classList.add('hide');
                            }
                            _this.trigger('resizeMessagesContainer');
                            _this.trigger('calcOuterContainerHeight');

                        });
                    }
                })
            },

            changeRealTimeEditing: function() {
                var _this = this;
                var array_per_page_nrte = _this.filter_navbar_config.filter(function(obj) {
                    return obj.service_id === "per_page" && obj.redraw_mode === "nrte"
                });
                var array_per_page_rte = _this.filter_navbar_config.filter(function(obj) {
                    return obj.service_id === "per_page" && obj.redraw_mode === "rte"
                });

                if (_this.real_time_editing.checked) {
                    _this.chat.data.redraw_mode = "rte";
                    _this.array_per_page = array_per_page_rte;
                } else {
                    _this.chat.data.redraw_mode = "nrte";
                    _this.array_per_page = array_per_page_nrte;
                }
                var parentDiv = _this.real_time_editing.parentNode;
                parentDiv.innerHTML = "";
                _this.array_per_page.forEach(function(obj) {
                    console.log(obj)
                    parentDiv.innerHTML += _this.triple_element_template({
                        element: obj,
                        button_template: _this.button_template,
                        input_template: _this.input_template,
                        label_template: _this.label_template
                    });
                });
                _this.labeltPerPage = _this.filter_container.querySelector('input[data-role="per_page"]');
                if (_this.labeltPerPage) {
                    _this.labeltPerPage.addEventListener('input', _this.changePerPage.bind(_this), false);
                    _this.labeltPerPage.value = _this.chat.data.per_page_value;
                }
                _this.btnPerPage = _this.filter_container.querySelector('button[data-role="per_page"]');
                if (_this.btnPerPage) {
                    _this.btnPerPage.addEventListener('click', _this.showPerPage.bind(_this), false);
                }
                _this.real_time_editing = _this.filter_container.querySelector('input[data-role="real_time_editing"]');
                if (_this.real_time_editing) {
                    _this.real_time_editing.addEventListener('change', _this.changeRealTimeEditing.bind(_this), false);
                }

            },

            renderPagination: function() {
                var _this = this;
                _this.trigger("renderPagination");
            },

            changePerPage: function() {
                var _this = this;
                _this.chat.data.per_page_value = parseInt(_this.labeltPerPage.value);

                if (_this.chat.data.redraw_mode === "rte") {
                    _this.chat.data.curPage = null;
                    if (_this.chat.data.valueEnablePagination) {
                        if (_this.labeltPerPage.value !== "") {
                            _this.trigger("changePerPage");
                        }
                    }
                }
            },

            showPerPage: function() {
                var _this = this;

                _this.chat.data.per_page_value = parseInt(_this.labeltPerPage.value);
                _this.chat.data.curPage = null;
                if (_this.chat.data.valueEnablePagination) {
                    if (_this.labeltPerPage.value !== "") {
                        _this.trigger("changePerPage");
                    }
                }
            }

        };
        extend(header, event_core);
        extend(header, async_core);
        extend(header, ajax_core);
        extend(header, template_core);

        header.prototype.header_template = header.prototype.template(header_template);
        header.prototype.filter_template = header.prototype.template(filter_template);
        header.prototype.triple_element_template = header.prototype.template(triple_element_template);
        header.prototype.button_template = header.prototype.template(button_template);
        header.prototype.label_template = header.prototype.template(label_template);
        header.prototype.input_template = header.prototype.template(input_template);

        header.prototype.dataMap = {
            "WEBRTC": '',
            MESSAGES_DISCONNECTED: ''
        };

        header.prototype.templateMap = {
            "WEBRTC": header.prototype.header_template,
            MESSAGES_DISCONNECTED: header.prototype.header_template
        };

        return header;
    });
