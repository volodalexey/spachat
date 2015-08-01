define('filter', [
        'switcher_core',
        'overlay_core',
        'render_layout_core',
        'throw_event_core',
        //
        'text!../templates/element/triple_element_template.ejs',
        'text!../templates/element/button_template.ejs',
        'text!../templates/element/label_template.ejs',
        'text!../templates/element/input_template.ejs',
        'text!../templates/filter_my_chats_template.ejs',
        'text!../templates/filter_template.ejs'
    ],
    function(switcher_core,
             overlay_core,
             render_layout_core,
             throw_event_core,
             //
             triple_element_template,
             button_template,
             label_template,
             input_template,
             filter_my_chats_template,
             filter_template) {

        var filter = function() {
            this.bindContext();
        };

        filter.prototype = {

            configMap: {
                CHATS_FILTER: '/configs/panel_chats_filter_config.json',
                USERS_FILTER: '/configs/panel_users_filter_config.json',
                MESSAGES_FILTER: '/configs/messages_filter_config.json',
                CONTACT_LIST_FILTER: '/configs/panel_chats_filter_config.json',
                LOGGER_FILTER: '/configs/messages_filter_config.json'
            },

            MODE: {
                CHATS_FILTER: 'CHATS_FILTER',
                USERS_FILTER: 'USERS_FILTER',
                MESSAGES_FILTER: 'MESSAGES_FILTER',
                CONTACT_LIST_FILTER: 'CONTACT_LIST_FILTER',
                LOGGER_FILTER: 'LOGGER'
            },

            bindContext: function() {
                var _this = this;
                _this.bindedThrowEventRouter = _this.throwEventRouter.bind(_this);
                _this.bindedDataActionRouter = _this.dataActionRouter.bind(_this);
            },

            addEventListener: function() {
                var _this = this;
                _this.removeEventListener();
                _this.addRemoveListener('add',  _this._module.filter_container, 'click', _this.bindedThrowEventRouter, false);
                _this.addRemoveListener('add',  _this._module.filter_container, 'click', _this.bindedDataActionRouter, false);
                _this.addRemoveListener('add',  _this._module.filter_container, 'input', _this.bindedDataActionRouter, false);
            },

            removeEventListener: function() {
                var _this = this;
                _this.addRemoveListener('remove',  _this._module.filter_container, 'click', _this.bindedThrowEventRouter, false);
                _this.addRemoveListener('remove',  _this._module.filter_container, 'click', _this.bindedDataActionRouter, false);
                _this.addRemoveListener('remove',  _this._module.filter_container, 'input', _this.bindedDataActionRouter, false);
            },

            renderFilter: function(_module, _mode, _callback) {
                var _this = this;
                _this._module = _module;
                _this.elementMap = {
                    CHATS_FILTER: _module.filter_container,
                    USERS_FILTER: _module.filter_container,
                    MESSAGES_FILTER: _module.filter_container,
                    CONTACT_LIST_FILTER: _module.filter_container,
                    LOGGER_FILTER: _module.filter_container
                };
                if (_mode === _module.body.MODE.DETAIL_VIEW) {
                    _this.optionsDefinition(_module, _this.MODE.CHATS);
                } else {
                    _this.optionsDefinition(_module, _mode);
                }

                if (_this._module.currnetFilterOptions.show) {
                    if (_module.btn_Filter) {
                        _module.btn_Filter.dataset.toggle = false;
                    }
                    if (_module.currentPaginationOptions.perPageValueNull) {
                        _this.previous_Filter_Options = false;
                    }
                    if (_mode !== _module.body.MODE.DETAIL_VIEW &&
                        (!_this.previous_Filter_Options || _this.previous_Filter_mode !== _mode)) {
                        _this.showHorizontalSpinner(_module.filter_container);
                        _this.previous_Filter_Options = true;
                        _this.body_mode = _mode + "_FILTER";
                        _this.previous_Filter_mode = _mode;
                        var data = {
                            "perPageValue": _module.currentPaginationOptions.perPageValue,
                            "showEnablePagination": _module.currentPaginationOptions.showEnablePagination,
                            "rtePerPage": _module.currentPaginationOptions.rtePerPage,
                            "mode_change": _module.currentPaginationOptions.mode_change
                        };
                        _this.renderLayout(data, function() {
                            _this.addEventListener();
                            _callback();
                        });
                    } else {
                        _callback();
                    }
                } else {
                    _module.filter_container.innerHTML = "";
                    _this.previous_Filter_Options = false;
                    _callback();
                }
            },

            throwEvent: function(name, data) {
                this._module && this._module.trigger('throw', name, data);
            },

            changePerPage: function(element) {
                var _this = this, value = parseInt(element.value);
                if (element.value === "" || element.value === "0") {
                    _this._module.currentPaginationOptions.perPageValueNull = true;
                    _this._module.currentPaginationOptions.currentPage = null;
                    return;
                } else {
                    _this._module.currentPaginationOptions.perPageValueNull = false;
                }

                if (!_this._module.currentPaginationOptions.rtePerPage) {
                    _this._module.currentPaginationOptions.currentPage = null;
                    _this._module.currentPaginationOptions.perPageValue = value;
                    return;
                }
                if (_this.previous_perPageValue !== value) {
                    _this._module.currentPaginationOptions.perPageValue = value;
                    _this._module.currentPaginationOptions.currentPage = null;
                    _this.previous_perPageValue = value;
                    if (_this._module.currentPaginationOptions.showEnablePagination) {
                        _this.previous_perPageValue = value;
                        _this._module.pagination.previousShow_Pagination = false;
                        _this._module.pagination.countQuantityPages(function() {
                            _this._module.render(null, null);
                        });
                    }
                }
            },

            changeRTE: function(element) {
                var _this = this;
                _this.previous_Filter_Options = false;
                if (element.checked) {
                    _this._module.currentPaginationOptions.mode_change = "rte";
                    _this._module.currentPaginationOptions.rtePerPage = true;
                    _this._module.pagination.previousShow_Pagination = false;
                } else {
                    _this._module.currentPaginationOptions.mode_change = "nrte";
                    _this._module.currentPaginationOptions.rtePerPage = false;
                }
                _this._module.render(null, null);
            },

            showPerPage: function() {
                var _this = this;
                _this._module.currentPaginationOptions.currentPage = null;
                _this._module.pagination.previousShow_Pagination = false;

                if (_this._module.currentPaginationOptions.showEnablePagination) {
                    _this._module.pagination.countQuantityPages(function() {
                        _this._module.render(null, null);
                    });
                }
            },

            destroy: function() {
                var _this = this;
                _this.removeEventListener();
            }

        };

        extend(filter, switcher_core);
        extend(filter, overlay_core);
        extend(filter, render_layout_core);
        extend(filter, throw_event_core);

        filter.prototype.triple_element_template = filter.prototype.template(triple_element_template);
        filter.prototype.button_template = filter.prototype.template(button_template);
        filter.prototype.label_template = filter.prototype.template(label_template);
        filter.prototype.input_template = filter.prototype.template(input_template);

        filter.prototype.filter_my_chats_template = filter.prototype.template(filter_my_chats_template);
        filter.prototype.filter_template = filter.prototype.template(filter_template);

        filter.prototype.templateMap = {
            CHATS_FILTER: filter.prototype.filter_my_chats_template,
            USERS_FILTER: filter.prototype.filter_my_chats_template,
            MESSAGES_FILTER: filter.prototype.filter_template,
            CONTACT_LIST_FILTER: filter.prototype.filter_my_chats_template,
            LOGGER_FILTER: filter.prototype.filter_template
        };

        filter.prototype.configHandlerMap = {};
        filter.prototype.configHandlerContextMap = {};
        filter.prototype.dataHandlerMap = {};
        filter.prototype.dataMap = {};

        return filter;
    }
);