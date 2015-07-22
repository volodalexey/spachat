define('header', [
        'throw_event_core',
        'ajax_core',
        'async_core',
        'template_core',
        'indexeddb',
        'render_layout_core',
        "switcher_core",

        'pagination',

        'text!../templates/filter_template.ejs',
        'text!../templates/header_template.ejs',
        'text!../templates/element/triple_element_template.ejs',
        'text!../templates/element/button_template.ejs',
        'text!../templates/element/label_template.ejs',
        'text!../templates/element/input_template.ejs'
    ],
    function(throw_event_core,
             ajax_core,
             async_core,
             template_core,
             indexeddb,
             render_layout_core,
             switcher_core,

             pagination,

             filter_template,
             header_template,
             triple_element_template,
             button_template,
             label_template,
             input_template) {

        var header = function() {
            this.bindToolbarContext();
        };

        header.prototype = {

            configMap: {
                WEBRTC: '',
                TAB: '/configs/header_navbar_config.json',
                FILTER: '/configs/filter_navbar_config.json',
                WAITER: ''
            },

            MODE_DESCRIPTION: {
                WEBRTC: 'Web RTC Initialization',
                TAB: 'Chat Messages',
                WAITER: ''
            },

            MODE: {
                FILTER: 'FILTER',
                WEBRTC: 'WEBRTC',
                WAITER: 'WAITER',
                TAB: 'TAB'
            },

            bindToolbarContext: function() {
                var _this = this;
                _this.bindedThrowEventRouter = _this.throwEventRouter.bind(_this);
                _this.bindedRenderFilter = _this.renderFilter.bind(_this);
                _this.bindedDataActionRouter = _this.dataActionRouter.bind(_this);
            },

            //override extended throwEvent to use trigger on chat
            throwEvent: function(name, data) {
                this.chat && this.chat.trigger('throw', name, data);
            },

            addToolbarEventListener: function() {
                var _this = this;
                _this.removeToolbarEventListeners();
                _this.addRemoveListener('add', _this.chat.header_container, 'click', _this.bindedThrowEventRouter, false);
                _this.addRemoveListener('add', _this.chat.header_container, 'click', _this.bindedDataActionRouter, false);
                _this.addRemoveListener('add', _this.chat.header_container, 'change', _this.bindedDataActionRouter, false);
                _this.addRemoveListener('add', _this.chat.header_container, 'input', _this.bindedDataActionRouter, false);
            },

            removeToolbarEventListeners: function() {
                var _this = this;
                _this.addRemoveListener('remove', _this.chat.header_container, 'click', _this.bindedThrowEventRouter, false);
                _this.addRemoveListener('remove', _this.chat.header_container, 'click', _this.bindedDataActionRouter, false);
                _this.addRemoveListener('remove', _this.chat.header_container, 'change', _this.bindedDataActionRouter, false);
                _this.addRemoveListener('remove', _this.chat.header_container, 'input', _this.bindedDataActionRouter, false);
            },

            cashToolbarElement: function() {
                var _this = this;
                _this.filter_container = _this.chat.header_container.querySelector('[data-role="filter_container"]');
                _this.button_filter = _this.chat.header_container.querySelector('[data-toggle]');
            },

            cashBodyElement: function() {
                var _this = this;
                if (_this.body_mode === _this.MODE.FILTER) {
                    _this.enablePagination = _this.filter_container.querySelector('[data-role="enablePagination"]');
                    _this.perPageValue = _this.filter_container.querySelector('[data-role="perPageValue"]');
                    _this.rteShowPerPage = _this.filter_container.querySelector('[data-role="rteShowPerPage"]');
                }
            },

            unCashElements: function() {
                var _this = this;
                _this.filter_container = null;
                _this.button_filter = null;
                _this.enablePagination = null;
                _this.perPageValue = null;
                _this.rteShowPerPage = null;
            },

            render: function(options, _array, chat) {
                var _this = this;
                _this.chat = chat;
                if (_this.chat.headerOptions.show) {
                    switch (_this.chat.headerOptions.mode) {
                        case _this.MODE.TAB:
                            if (_array) {
                                _array.forEach(function(_obj) {
                                    if (_obj.target && _obj.target.dataset.toggle_reset_header) {
                                        _this.button_filter.dataset.toggle = true;
                                    }
                                });
                            }
                            if (!_this.previousMode || _this.previousMode !== _this.chat.headerOptions.mode) {
                                _this.previousMode = _this.MODE.TAB;
                                _this.body_mode = _this.MODE.TAB;
                                _this.description = _this.MODE_DESCRIPTION[_this.body_mode];
                                _this.elementMap = {
                                    TAB: _this.chat.header_container
                                };
                                _this.renderLayout(null, function() {
                                    _this.cashToolbarElement();
                                    _this.addToolbarEventListener();
                                    _this.renderFilter();
                                });
                            } else {
                                _this.previousMode = _this.MODE.TAB;
                                _this.renderFilter();
                            }
                            break;
                        case _this.MODE.WEBRTC:
                            _this.body_mode = _this.MODE.WEBRTC;
                            _this.previousMode = _this.MODE.WEBRTC;
                            _this.description = _this.MODE_DESCRIPTION[_this.body_mode];
                            _this.elementMap = {
                                WEBRTC: _this.chat.header_container.querySelector('[data-role="webrtc_container"]')
                            };
                            _this.fillBody(null, null, function() {
                                _this.renderFilter();
                            });
                            break;
                        case _this.MODE.WAITER:
                            _this.body_mode = _this.MODE.WAITER;
                            _this.previousMode = this.MODE.WAITER;
                            break;
                    }
                }
            },

            renderFilter: function() {
                var _this = this;
                _this.optionsDefinition(_this.chat, _this.chat.bodyOptions.mode);
                if (_this.chat.filterOptions.show) {
                    if (_this.currentPaginationOptions.perPageValueNull) {
                        _this.previousFilterShow = false;
                    }
                    if (!_this.previousFilterShow) {
                        _this.previousFilterShow = true;
                        _this.body_mode = _this.MODE.FILTER;
                        _this.elementMap = {
                            FILTER: _this.filter_container
                        };
                        _this.body_mode = _this.MODE.FILTER;
                        var data = {
                            "perPageValue": _this.currentPaginationOptions.perPageValue,
                            "showEnablePagination": _this.currentPaginationOptions.showEnablePagination,
                            "rtePerPage": _this.currentPaginationOptions.rtePerPage,
                            "mode_change": _this.currentPaginationOptions.mode_change
                        };
                        _this.renderLayout(data, null);
                    }
                }
                else {
                    _this.filter_container.innerHTML = "";
                    _this.chat.filterOptions.show = false;
                    _this.previousFilterShow = false;
                }
            },

            changePerPage: function(element) {
                var _this = this;
                var value = parseInt(element.value);

                //if (event.type !== "click") {
                    if (element.value === "" || element.value === "0") {
                        _this.currentPaginationOptions.perPageValueNull = true;
                        return;

                    }
                    if (!_this.currentPaginationOptions.rtePerPage) {
                        _this.currentPaginationOptions.currentPage = null;
                        _this.currentPaginationOptions.perPageValue = value;
                        element.focus();
                        return;

                    }
                    _this.currentPaginationOptions.perPageValue = value;
                    _this.currentPaginationOptions.currentPage = null;
                    if (_this.currentPaginationOptions.showEnablePagination) {
                        _this.chat.pagination.countQuantityPages(function() {
                            _this.chat.render(null, null);
                        });
                    }
                //}
            },

            changeRTE: function(element) {
                var _this = this;
                _this.previousFilterShow = false;
                if (element.checked) {
                    _this.currentPaginationOptions.mode_change = "rte";
                    _this.currentPaginationOptions.rtePerPage = true;
                } else {
                    _this.currentPaginationOptions.mode_change = "nrte";
                    _this.currentPaginationOptions.rtePerPage = false;
                }
                _this.chat.render(null, null);
            },

            showPerPage: function() {
                var _this = this;
                _this.currentPaginationOptions.currentPage = null;

                if (_this.currentPaginationOptions.showEnablePagination) {
                    _this.chat.pagination.countQuantityPages(function() {
                        _this.chat.render(null, null);
                    });
                }
            },

            destroy: function() {
                var _this = this;
                _this.removeToolbarEventListeners();
                _this.unCashElements();
            }

        };
        extend(header, throw_event_core);
        extend(header, async_core);
        extend(header, ajax_core);
        extend(header, template_core);
        extend(header, render_layout_core);
        extend(header, switcher_core);

        header.prototype.header_template = header.prototype.template(header_template);
        header.prototype.filter_template = header.prototype.template(filter_template);
        header.prototype.triple_element_template = header.prototype.template(triple_element_template);
        header.prototype.button_template = header.prototype.template(button_template);
        header.prototype.label_template = header.prototype.template(label_template);
        header.prototype.input_template = header.prototype.template(input_template);

        header.prototype.dataMap = {
            WEBRTC: '',
            TAB: '',
            FILTER: '',
            WAITER: ''
        };

        header.prototype.templateMap = {
            WEBRTC: header.prototype.header_template,
            TAB: header.prototype.header_template,
            FILTER: header.prototype.filter_template,
            WAITER: ''
        };

        return header;
    });
