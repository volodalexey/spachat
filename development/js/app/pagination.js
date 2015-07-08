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

            render: function(options, chat, mode) {
                var _this = this;
                _this.chat = chat;
                 _this.collectionDescription= {
                     "id": _this.chat.chatId,
                     "db_name": _this.chat.chatId + '_chat',
                     "table_names": [],
                     "db_version": 1,
                     "keyPath": "id"
                     /*"id": _this.chat.chatsArray.length,
                     "db_name": _this.chat.chatsArray.length + '_chat_messages',
                     "table_name": _this.chat.chatsArray.length + '_chat_messages',
                     "db_version": 1,
                     "keyPath": "id"*/
                 };

                _this.optionsDefinition(mode);

                _this.pagination_container = _this.chat.chat_element.querySelector('[data-role="pagination_container"]');
                _this.go_to_container = _this.chat.chat_element.querySelector('[data-role="go_to_container"]');
                if (_this.currentPaginationOptions.show) {
                    _this.countQuantityPages(function(){
                        _this.disableButtonsPagination();
                        _this.body_mode = _this.MODE.PAGINATION;
                        _this.elementMap = {
                            PAGINATION: _this.pagination_container
                        };
                        var data = {
                            firstPage: _this.currentPaginationOptions.firstPage,
                            currentPage: _this.currentPaginationOptions.currentPage,
                            lastPage:  _this.currentPaginationOptions.lastPage,
                            disableBack: _this.currentPaginationOptions.disableBack,
                            disableFirst: _this.currentPaginationOptions.disableFirst,
                            disableLast: _this.currentPaginationOptions.disableLast,
                            disableForward: _this.currentPaginationOptions.disableForward
                        };
                        _this.renderLayout(data, function(){
                            _this.addMainEventListener();
                            _this.cashMainElements();
                            _this.renderGoTo();
                            if (_this.buttons_show_choice && _this.currentGoToOptions.show) {
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

            optionsDefinition: function(mode){
                var _this = this;

                if (_this.previousMode !== mode) {
                    _this.chat.messagesOptions.previousStart = 0;
                    _this.chat.messagesOptions.previousFinal = null;
                    _this.chat.messagesOptions.start = 0;
                    _this.chat.messagesOptions.final = null;
                }

                switch (mode) {
                    case _this.chat.body.MODE.MESSAGES: case _this.chat.body.MODE.SETTING: case _this.chat.body.MODE.CONTACT_LIST:
                         _this.previousMode = _this.chat.body.MODE.MESSAGES;
                        _this.collectionDescription.table_names = [_this.chat.chatId + '_messages'];
                        _this.currentPaginationOptions = _this.chat.paginationMessageOptions;
                        _this.currentGoToOptions = _this.chat.goToMessageOptions;
                        break;
                    case _this.chat.body.MODE.LOGGER:
                        _this.previousMode = _this.chat.body.MODE.LOGGER;
                        _this.collectionDescription.table_names = [_this.chat.chatId + '_logs'];
                        _this.currentPaginationOptions = _this.chat.paginationLoggerOptions;
                        _this.currentGoToOptions = _this.chat.goToLoggerOptions;
                        break;
                    case _this.chat.MODE.MY_CHATS:
                        _this.previousMode = _this.chat.MODE.MY_CHATS;
                        _this.collectionDescription.table_names = ['authentication'];
                        _this.currentPaginationOptions = _this.chat.paginationMyChatsOptions;
                        _this.currentGoToOptions = _this.chat.goToMyChatsOptions;
                        break;
                }
            },

            renderGoTo: function() {
                var _this = this;
                if (_this.currentGoToOptions.show){
                    if (!_this.previousShow) {
                        _this.previousShow = true;
                        _this.buttons_show_choice.forEach(function(btn){
                            btn.dataset.toggle = false;
                        });
                        _this.elementMap = {
                            GO_TO: _this.go_to_container
                        };
                        var data = {
                            mode_change: _this.currentGoToOptions.mode_change,
                            rteChoicePage: _this.currentGoToOptions.rteChoicePage,
                            page: _this.currentGoToOptions.page
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
                _this.optionsDefinition(_this.chat.bodyOptions.mode);
                indexeddb.getAll(_this.collectionDescription, null, function(getAllErr, messages) {
                    var quantityMessage = messages.length;
                    if (quantityMessage !== 0) {
                        quantityPages = Math.ceil(quantityMessage / _this.currentPaginationOptions.perPageValue);
                    } else {
                        quantityPages = 1;
                    }
                    if (_this.currentPaginationOptions.currentPage === null) {
                        _this.chat.messagesOptions.start = quantityPages * _this.currentPaginationOptions.perPageValue - _this.currentPaginationOptions.perPageValue;
                        _this.chat.messagesOptions.final = quantityPages * _this.currentPaginationOptions.perPageValue;
                        _this.currentPaginationOptions.currentPage = quantityPages;
                    } else {
                        _this.chat.messagesOptions.start = (_this.currentPaginationOptions.currentPage - 1) * _this.currentPaginationOptions.perPageValue;
                        _this.chat.messagesOptions.final = (_this.currentPaginationOptions.currentPage - 1) * _this.currentPaginationOptions.perPageValue + _this.currentPaginationOptions.perPageValue;
                    }
                    _this.currentPaginationOptions.lastPage = quantityPages;
                    //_this.disableButtonsPagination();
                    if (callback) {
                        callback();
                    }
                });
            },


            switchPage: function(event) {
                var _this = this;
                if (event.target.dataset.role === "first" || event.target.dataset.role === "last") {
                    _this.currentPaginationOptions.currentPage = parseInt(event.target.dataset.value);
                }
                if (event.target.dataset.role === "back") {
                    _this.currentPaginationOptions.currentPage = parseInt(_this.currentPaginationOptions.currentPage) - 1;
                }
                if (event.target.dataset.role === "forward") {
                    _this.currentPaginationOptions.currentPage = parseInt(_this.currentPaginationOptions.currentPage) + 1;
                }

                if (_this.currentGoToOptions.rteChoicePage && event.target.dataset.role === "choice_per_page") {
                    if (event.target.value === "" ){
                        _this.currentGoToOptions.page = null;
                    } else {
                        var value = parseInt(event.target.value);
                        _this.currentPaginationOptions.currentPage = value;
                        _this.currentGoToOptions.page = value;
                    }
                }

                if (!_this.currentGoToOptions.rteChoicePage && event.target.dataset.role === "go_to_page") {
                    if (_this.input_choose_page.value === "" ){
                        _this.currentGoToOptions.page = null;
                    } else {
                        var value = parseInt(_this.input_choose_page.value);
                        _this.currentPaginationOptions.currentPage = value;
                        _this.currentGoToOptions.page = value;
                    }
                    _this.previousShow = false;
                }

                _this.chat.render(null, null);
            },

            disableButtonsPagination: function() {
                var _this = this;
                if (_this.currentPaginationOptions.currentPage === _this.currentPaginationOptions.firstPage) {
                    _this.currentPaginationOptions.disableBack = true;
                    _this.currentPaginationOptions.disableFirst = true;
                } else {
                    _this.currentPaginationOptions.disableBack = false;
                    _this.currentPaginationOptions.disableFirst = false;
                }
                if (_this.currentPaginationOptions.currentPage === _this.currentPaginationOptions.lastPage){
                    _this.currentPaginationOptions.disableForward = true;
                    _this.currentPaginationOptions.disableLast = true;
                } else {
                    _this.currentPaginationOptions.disableForward = false;
                    _this.currentPaginationOptions.disableLast = false;
                }
            },

            changeRTE: function(event) {
                var _this = this;
                if (event.target.checked) {
                    _this.currentGoToOptions.mode_change = "rte";
                    _this.currentGoToOptions.rteChoicePage = true;
                } else {
                    _this.currentGoToOptions.mode_change = "nrte";
                    _this.currentGoToOptions.rteChoicePage = false;
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
