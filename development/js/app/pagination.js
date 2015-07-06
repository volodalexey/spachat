define('pagination', [
        'throw_event_core',
        'ajax_core',
        'template_core',
        'render_layout_core',
        'indexeddb',

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

            cashMainElements: function() {
                var _this = this;
                _this.buttons_show_choice = Array.prototype.slice.call(_this.pagination_container.querySelectorAll('[data-role="choice"]'));
            },

            addMainEventListener: function() {
                var _this = this;
                _this.removeMainEventListeners();
                _this.addRemoveListener('add', _this.pagination_container, 'click', _this.bindedThrowEventRouter, false);
                _this.addRemoveListener('add', _this.pagination_container, 'click', _this.bindedDataActionRouter, false);
            },

            removeMainEventListeners: function() {
                var _this = this;
                _this.addRemoveListener('remove', _this.pagination_container, 'click', _this.bindedThrowEventRouter, false);
                _this.addRemoveListener('remove', _this.pagination_container, 'click', _this.bindedDataActionRouter, false);
            },

            cashContextElements: function() {
                var _this = this;
                _this.input_choose_page = _this.go_to_container.querySelector('[data-role="choice_per_page"]');
            },

            addContextEventListener: function() {
                var _this = this;
                _this.removeContextEventListeners();
                _this.addRemoveListener('add', _this.go_to_container, 'input', _this.bindedDataActionRouter, false);
                _this.addRemoveListener('add', _this.go_to_container, 'click', _this.bindedDataActionRouter, false);
            },

            removeContextEventListeners: function() {
                var _this = this;
                _this.addRemoveListener('remove', _this.go_to_container, 'input', _this.bindedDataActionRouter, false);
                _this.addRemoveListener('remove', _this.go_to_container, 'click', _this.bindedDataActionRouter, false);
            },

            unCashElements: function() {
                var _this = this;
                _this.buttons_show_choice = null;
                _this.input_choose_page = null;
                _this.pagination_container = null;
                _this.go_to_container = null;
            },

            render: function(options, chat) {
                var _this = this;
                _this.chat = chat;
                 _this.collectionDescription= {
                     "id": _this.chat.chatId,
                     "db_name": _this.chat.chatId + '_chat',
                     "table_names": [_this.chat.chatId + '_messages'],
                     "db_version": 1,
                     "keyPath": "id"
                     /*"id": _this.chat.chatsArray.length,
                     "db_name": _this.chat.chatsArray.length + '_chat_messages',
                     "table_name": _this.chat.chatsArray.length + '_chat_messages',
                     "db_version": 1,
                     "keyPath": "id"*/
                 };
                _this.pagination_container = _this.chat.chat_element.querySelector('[data-role="pagination_container"]');
                _this.go_to_container = _this.chat.chat_element.querySelector('[data-role="go_to_container"]');
                if (_this.chat.paginationOptions.show) {
                    _this.countQuantityPages(function(){
                        _this.disableButtonsPagination();
                        _this.body_mode = _this.MODE.PAGINATION;
                        _this.elementMap = {
                            PAGINATION: _this.pagination_container
                        };
                        var data = {
                            firstPage: _this.chat.paginationOptions.firstPage,
                            currentPage: _this.chat.paginationOptions.currentPage,
                            lastPage:  _this.chat.paginationOptions.lastPage,
                            disableBack: _this.chat.paginationOptions.disableBack,
                            disableFirst: _this.chat.paginationOptions.disableFirst,
                            disableLast: _this.chat.paginationOptions.disableLast,
                            disableForward: _this.chat.paginationOptions.disableForward
                        };
                        _this.renderLayout(data, function(){
                            _this.addMainEventListener();
                            _this.cashMainElements();
                            _this.renderGoTo();
                            if (_this.buttons_show_choice && _this.chat.goToOptions.show) {
                                _this.buttons_show_choice.forEach(function(btn){
                                    btn.dataset.toggle = false;
                                });
                            }
                        });
                    });
                } else {
                    _this.pagination_container.innerHTML = "";
                    _this.go_to_container.innerHTML = "";
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
                if (_this.chat.goToOptions.show){
                    if (!_this.previousShow) {
                        _this.previousShow = true;
                        _this.buttons_show_choice.forEach(function(btn){
                            btn.dataset.toggle = false;
                        });
                        _this.elementMap = {
                            GO_TO: _this.go_to_container
                        };
                        var data = {
                            mode_change: _this.chat.goToOptions.mode_change,
                            rteChoicePage: _this.chat.goToOptions.rteChoicePage,
                            page: _this.chat.goToOptions.page
                        };
                        _this.body_mode = _this.MODE.GO_TO;
                        _this.renderLayout(data, function(){
                            _this.addContextEventListener();
                            _this.cashContextElements();
                        });
                    }
                } else {
                    _this.previousShow = false;
                    _this.go_to_container.innerHTML = "";
                    if (_this.buttons_show_choice) {
                        _this.buttons_show_choice.forEach(function(btn){
                            btn.dataset.toggle = true;
                        });
                    }
                }
            },

            countQuantityPages: function(callback) {
                var _this = this, quantityPages;
                indexeddb.getAll(_this.collectionDescription, null, function(getAllErr, messages) {
                    var quantityMessage = messages.length;
                    if (quantityMessage !== 0) {
                        quantityPages = Math.ceil(quantityMessage / _this.chat.paginationOptions.perPageValue);
                    } else {
                        quantityPages = 1;
                    }
                    if (_this.chat.paginationOptions.currentPage === null) {
                        _this.chat.messagesOptions.start = quantityPages * _this.chat.paginationOptions.perPageValue - _this.chat.paginationOptions.perPageValue;
                        _this.chat.messagesOptions.final = quantityPages * _this.chat.paginationOptions.perPageValue;
                        _this.chat.paginationOptions.currentPage = quantityPages;
                    } else {
                        _this.chat.messagesOptions.start = (_this.chat.paginationOptions.currentPage - 1) * _this.chat.paginationOptions.perPageValue;
                        _this.chat.messagesOptions.final = (_this.chat.paginationOptions.currentPage - 1) * _this.chat.paginationOptions.perPageValue + _this.chat.paginationOptions.perPageValue;
                    }
                    _this.chat.paginationOptions.lastPage = quantityPages;
                    //_this.disableButtonsPagination();
                    callback();
                });
            },

            switchPage: function(event) {
                var _this = this;
                if (event.target.dataset.role === "first" || event.target.dataset.role === "last") {
                    _this.chat.paginationOptions.currentPage = parseInt(event.target.dataset.value);
                }
                if (event.target.dataset.role === "back") {
                    _this.chat.paginationOptions.currentPage = parseInt(_this.chat.paginationOptions.currentPage) - 1;
                }
                if (event.target.dataset.role === "forward") {
                    _this.chat.paginationOptions.currentPage = parseInt(_this.chat.paginationOptions.currentPage) + 1;
                }

                if (_this.chat.goToOptions.rteChoicePage && event.target.dataset.role === "choice_per_page") {
                    if (event.target.value === "" ){
                        _this.chat.goToOptions.page = null;
                    } else {
                        var value = parseInt(event.target.value);
                        _this.chat.paginationOptions.currentPage = value;
                        _this.chat.goToOptions.page = value;
                    }
                }

                if (!_this.chat.goToOptions.rteChoicePage && event.target.dataset.role === "go_to_page") {
                    if (_this.input_choose_page.value === "" ){
                        _this.chat.goToOptions.page = null;
                    } else {
                        var value = parseInt(_this.input_choose_page.value);
                        _this.chat.paginationOptions.currentPage = value;
                        _this.chat.goToOptions.page = value;
                    }
                    _this.previousShow = false;
                }

                _this.chat.render(null, null);
            },

            disableButtonsPagination: function() {
                var _this = this;
                if (_this.chat.paginationOptions.currentPage === _this.chat.paginationOptions.firstPage) {
                    _this.chat.paginationOptions.disableBack = true;
                    _this.chat.paginationOptions.disableFirst = true;
                } else {
                    _this.chat.paginationOptions.disableBack = false;
                    _this.chat.paginationOptions.disableFirst = false;
                }
                if (_this.chat.paginationOptions.currentPage === _this.chat.paginationOptions.lastPage){
                    _this.chat.paginationOptions.disableForward = true;
                    _this.chat.paginationOptions.disableLast = true;
                } else {
                    _this.chat.paginationOptions.disableForward = false;
                    _this.chat.paginationOptions.disableLast = false;
                }
            },

            changeRTE: function(event) {
                var _this = this;
                if (event.target.checked) {
                    _this.chat.goToOptions.mode_change = "rte";
                    _this.chat.goToOptions.rteChoicePage = true;
                } else {
                    _this.chat.goToOptions.mode_change = "nrte";
                    _this.chat.goToOptions.rteChoicePage = false;
                }
                _this.previousShow = false;
                _this.chat.render(null, null);
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
