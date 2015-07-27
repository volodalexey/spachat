define('pagination', [
        'throw_event_core',
        'ajax_core',
        'template_core',
        'render_layout_core',
        'indexeddb',
        "switcher_core",
        'overlay_core',
        //
        'text!../templates/pagination_template.ejs',
        'text!../templates/choice_per_page_template.ejs',
        'text!../templates/element/triple_element_template.ejs',
        'text!../templates/element/button_template.ejs',
        'text!../templates/element/label_template.ejs',
        'text!../templates/element/input_template.ejs'
    ],
    function(throw_event_core,
             ajax_core,
             template_core,
             render_layout_core,
             indexeddb,
             switcher_core,
             overlay_core,
             //
             pagination_template,
             choice_per_page_template,
             triple_element_template,
             button_template,
             label_template,
             input_template) {

        var pagination = function() {
            this.bindMainContexts();
        };

        pagination.prototype = {

            MODE: {
                "PAGINATION": 'PAGINATION',
                "GO_TO": 'GO_TO'
            },

            configMap: {
                "PAGINATION": '/configs/pagination_navbar_config.json',
                "GO_TO": '/configs/choice_per_page_config.json'
            },

            bindMainContexts: function() {
                var _this = this;
                _this.bindedThrowEventRouter = _this.throwEventRouter.bind(_this);
                _this.bindedDataActionRouter = _this.dataActionRouter.bind(_this);
            },

            //override extended throwEvent to use trigger on chat
            throwEvent: function(name, data) {
                this.module && this.module.trigger('throw', name, data);
            },

            cashMainElements: function() {
                var _this = this;
                _this.buttons_show_choice = Array.prototype.slice.call(_this.module.pagination_container.querySelectorAll('[data-role="choice"]'));
            },

            addMainEventListener: function() {
                var _this = this;
                _this.removeMainEventListeners();
                _this.addRemoveListener('add', _this.module.pagination_container, 'click', _this.bindedThrowEventRouter, false);
                _this.addRemoveListener('add', _this.module.pagination_container, 'click', _this.bindedDataActionRouter, false);
            },

            removeMainEventListeners: function() {
                var _this = this;
                _this.addRemoveListener('remove', _this.module.pagination_container, 'click', _this.bindedThrowEventRouter, false);
                _this.addRemoveListener('remove', _this.module.pagination_container, 'click', _this.bindedDataActionRouter, false);
            },

            cashContextElements: function() {
                var _this = this;
                _this.input_choose_page = _this.module.go_to_container.querySelector('[data-role="choice_per_page"]');
            },

            addContextEventListener: function() {
                var _this = this;
                _this.removeContextEventListeners();
                _this.addRemoveListener('add', _this.module.go_to_container, 'input', _this.bindedDataActionRouter, false);
                _this.addRemoveListener('add', _this.module.go_to_container, 'click', _this.bindedDataActionRouter, false);
            },

            removeContextEventListeners: function() {
                var _this = this;
                _this.addRemoveListener('remove', _this.module.go_to_container, 'input', _this.bindedDataActionRouter, false);
                _this.addRemoveListener('remove', _this.module.go_to_container, 'click', _this.bindedDataActionRouter, false);
            },

            unCashElements: function() {
                var _this = this;
                _this.buttons_show_choice = null;
                _this.input_choose_page = null;
            },

            render: function(options, _module, mode) {
                var _this = this;
                _this.module = _module;
                _this.bodyOptionsMode = mode;
                if (_this.module.MODE && _this.module.bodyOptions.mode === _this.module.MODE.DETAIL_VIEW) {
                    _this.bodyOptionsMode = _this.module.MODE.CHATS;
                }
                _this.optionsDefinition(_this.module, _this.bodyOptionsMode);
                if (_this.module.currentPaginationOptions.show) {
                    _this.showHorizontalSpinner(_this.module.pagination_container);
                    _this.countQuantityPages(function(){
                        _this.disableButtonsPagination();
                        _this.body_mode = _this.MODE.PAGINATION;
                        _this.elementMap = {
                            PAGINATION: _this.module.pagination_container
                        };
                        var data = {
                            firstPage: _this.module.currentPaginationOptions.firstPage,
                            currentPage: _this.module.currentPaginationOptions.currentPage,
                            lastPage:  _this.module.currentPaginationOptions.lastPage,
                            disableBack: _this.module.currentPaginationOptions.disableBack,
                            disableFirst: _this.module.currentPaginationOptions.disableFirst,
                            disableLast: _this.module.currentPaginationOptions.disableLast,
                            disableForward: _this.module.currentPaginationOptions.disableForward
                        };
                        _this.renderLayout(data, function(){
                            _this.addMainEventListener();
                            _this.cashMainElements();
                            _this.renderGoTo();
                            if (_this.buttons_show_choice && _this.module.currentGoToOptions.show) {
                                _this.buttons_show_choice.forEach(function(btn){
                                    btn.dataset.toggle = false;
                                });
                            }
                        });
                    });
                } else {
                    _this.module.pagination_container.innerHTML = "";
                    _this.module.go_to_container.innerHTML = "";
                    if (_this.buttons_show_choice) {
                        _this.buttons_show_choice.forEach(function(btn){
                            btn.dataset.toggle = true;
                        });
                    }
                    _this.previousShow = false;
                }
            },

            renderGoTo: function() {
                var _this = this;
                if (_this.module.currentGoToOptions.show){
                    if (!_this.previousShow) {
                        _this.showHorizontalSpinner(_this.module.go_to_container);
                        _this.previousShow = true;
                        _this.buttons_show_choice.forEach(function(btn){
                            btn.dataset.toggle = false;
                        });
                        _this.elementMap = {
                            GO_TO: _this.module.go_to_container
                        };
                        var data = {
                            mode_change: _this.module.currentGoToOptions.mode_change,
                            rteChoicePage: _this.module.currentGoToOptions.rteChoicePage,
                            page: _this.module.currentGoToOptions.page
                        };
                        _this.body_mode = _this.MODE.GO_TO;
                        _this.renderLayout(data, function(){
                            _this.addContextEventListener();
                            _this.cashContextElements();
                        });
                    }
                } else {
                    _this.previousShow = false;
                    _this.module.go_to_container.innerHTML = "";
                    if (_this.buttons_show_choice) {
                        _this.buttons_show_choice.forEach(function(btn){
                            btn.dataset.toggle = true;
                        });
                    }
                }
            },

            countQuantityPages: function(callback) {
                var _this = this, quantityPages;
                _this.optionsDefinition(_this.module, _this.bodyOptionsMode);
                indexeddb.getAll(_this.module.collectionDescription, null, function(getAllErr, messages) {
                    var quantityMessage = messages.length;
                    if (quantityMessage !== 0) {
                        quantityPages = Math.ceil(quantityMessage / _this.module.currentPaginationOptions.perPageValue);
                    } else {
                        quantityPages = 1;
                    }
                    if (_this.module.currentPaginationOptions.currentPage === null) {
                        _this.module.messagesOptions.start = quantityPages * _this.module.currentPaginationOptions.perPageValue - _this.module.currentPaginationOptions.perPageValue;
                        _this.module.messagesOptions.final = quantityPages * _this.module.currentPaginationOptions.perPageValue;
                        _this.module.currentPaginationOptions.currentPage = quantityPages;
                    } else {
                        _this.module.messagesOptions.start = (_this.module.currentPaginationOptions.currentPage - 1) * _this.module.currentPaginationOptions.perPageValue;
                        _this.module.messagesOptions.final = (_this.module.currentPaginationOptions.currentPage - 1) * _this.module.currentPaginationOptions.perPageValue + _this.module.currentPaginationOptions.perPageValue;
                    }
                    _this.module.currentPaginationOptions.lastPage = quantityPages;
                    if (callback) {
                        callback();
                    }
                });
            },

            switchPage: function(element) {
                var _this = this;
                if (_this.module.MODE && _this.module.bodyOptions.mode === _this.module.MODE.DETAIL_VIEW) {
                    _this.module.bodyOptions.mode = _this.module.MODE.CHATS;
                }
                if (element.dataset.role === "first" || element.dataset.role === "last") {
                    _this.module.currentPaginationOptions.currentPage = parseInt(element.dataset.value);
                }
                if (element.dataset.role === "back") {
                    _this.module.currentPaginationOptions.currentPage = parseInt(_this.module.currentPaginationOptions.currentPage) - 1;
                }
                if (element.dataset.role === "forward") {
                    _this.module.currentPaginationOptions.currentPage = parseInt(_this.module.currentPaginationOptions.currentPage) + 1;
                }

                if (_this.module.currentGoToOptions.rteChoicePage && element.dataset.role === "choice_per_page") {
                    if (element.value === "" ){
                        _this.module.currentGoToOptions.page = null;
                    } else {
                        var value = parseInt(element.value);
                        _this.module.currentPaginationOptions.currentPage = value;
                        _this.module.currentGoToOptions.page = value;
                    }
                }

                if (!_this.module.currentGoToOptions.rteChoicePage && element.dataset.role === "go_to_page") {
                    if (_this.input_choose_page.value === "" ){
                        _this.module.currentGoToOptions.page = null;
                    } else {
                        var value = parseInt(_this.input_choose_page.value);
                        _this.module.currentPaginationOptions.currentPage = value;
                        _this.module.currentGoToOptions.page = value;
                    }
                    _this.previousShow = false;
                }

                _this.module.render(null, null);
            },

            disableButtonsPagination: function() {
                var _this = this;
                if (_this.module.currentPaginationOptions.currentPage === _this.module.currentPaginationOptions.firstPage) {
                    _this.module.currentPaginationOptions.disableBack = true;
                    _this.module.currentPaginationOptions.disableFirst = true;
                } else {
                    _this.module.currentPaginationOptions.disableBack = false;
                    _this.module.currentPaginationOptions.disableFirst = false;
                }
                if (_this.module.currentPaginationOptions.currentPage === _this.module.currentPaginationOptions.lastPage){
                    _this.module.currentPaginationOptions.disableForward = true;
                    _this.module.currentPaginationOptions.disableLast = true;
                } else {
                    _this.module.currentPaginationOptions.disableForward = false;
                    _this.module.currentPaginationOptions.disableLast = false;
                }
            },

            changeRTE: function(element) {
                var _this = this;

                if (_this.module.MODE && _this.module.bodyOptions.mode === _this.module.MODE.DETAIL_VIEW) {
                    _this.module.bodyOptions.mode = _this.module.MODE.CHATS;
                }
                _this.optionsDefinition(_this.module, _this.module.bodyOptions.mode);
                _this.module.previous_Filter_Options = false;

                if (element.checked) {
                    _this.module.currentGoToOptions.mode_change = "rte";
                    _this.module.currentGoToOptions.rteChoicePage = true;
                } else {
                    _this.module.currentGoToOptions.mode_change = "nrte";
                    _this.module.currentGoToOptions.rteChoicePage = false;
                }
                _this.previousShow = false;
                _this.module.render(null, null);
            },

            destroy: function() {
                var _this = this;
                _this.removeMainEventListeners();
                _this.removeContextEventListeners();
                _this.unCashElements();
            }
        };
        extend(pagination, throw_event_core);
        extend(pagination, ajax_core);
        extend(pagination, template_core);
        extend(pagination, render_layout_core);
        extend(pagination, switcher_core);
        extend(pagination, overlay_core);

        pagination.prototype.pagination_template = pagination.prototype.template(pagination_template);
        pagination.prototype.choice_per_page_template = pagination.prototype.template(choice_per_page_template);
        pagination.prototype.triple_element_template = pagination.prototype.template(triple_element_template);
        pagination.prototype.button_template = pagination.prototype.template(button_template);
        pagination.prototype.label_template = pagination.prototype.template(label_template);
        pagination.prototype.input_template = pagination.prototype.template(input_template);

        pagination.prototype.dataMap = {
            "PAGINATION": "",
            "GO_TO": ""
        };

        pagination.prototype.templateMap = {
            "PAGINATION": pagination.prototype.pagination_template,
            "GO_TO": pagination.prototype.choice_per_page_template
        };

        return pagination;
    })
;
