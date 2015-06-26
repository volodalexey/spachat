define('pagination', [
        'event_core',
        'ajax_core',
        'template_core',
        'render_layout_core',
        'indexeddb',

        'text!../html/pagination_template.html',
        'text!../html/choice_per_page_template.html',
        'text!../html/element/triple_element_template.html',
        'text!../html/element/button_template.html',
        'text!../html/element/label_template.html',
        'text!../html/element/input_template.html'
    ],
    function(event_core,
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
                "PAGINATION": '/mock/pagination_navbar_config.json',
                "GO_TO": '/mock/choice_per_page_config.json'
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

            render: function(options, chat) {
                var _this = this;
                _this.chat = chat;
                 _this.collectionDescription= {
                     "id": _this.chat.chatsArray.length,
                     "db_name": _this.chat.chatsArray.length + '_chat_messages',
                     "table_name": _this.chat.chatsArray.length + '_chat_messages',
                     "db_version": 1,
                     "keyPath": "id"
                 };
                _this.pagination_container = _this.chat.chat_element.querySelector('[data-role="pagination_container"]');
                _this.go_to_container = _this.chat.chat_element.querySelector('[data-role="go_to_container"]');
                if (_this.chat.paginationOptions.show) {
                    _this.countQuantityPages(function(){
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
                            mode: _this.chat.goToOptions.mode,
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
                indexeddb.getAll(_this.collectionDescription, function(getAllErr, messages) {
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
                    _this.disableButtonsPaginatin();
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
                        _this.chat.paginationOptions.currentPage = 1;
                        _this.chat.goToOptions.page = null;
                    } else {
                        var value = parseInt(event.target.value);
                        _this.chat.paginationOptions.currentPage = value;
                        _this.chat.goToOptions.page = value;
                    }
                }

                if (!_this.chat.goToOptions.rteChoicePage && event.target.dataset.role === "go_to_page") {
                    if (_this.input_choose_page.value === "" ){
                        _this.chat.paginationOptions.currentPage = 1;
                        _this.chat.goToOptions.page = null;
                    } else {
                        var value = parseInt(_this.input_choose_page.value);
                        _this.chat.paginationOptions.currentPage = value;
                        _this.chat.goToOptions.page = value;
                    }
                }

                _this.chat.render(null, null);
            },

            changeRTE: function(event) {
                var _this = this;
                if (event.target.checked) {
                    _this.chat.goToOptions.mode = "rte";
                    _this.chat.goToOptions.rteChoicePage = true;
                } else {
                    _this.chat.goToOptions.mode = "nrte";
                    _this.chat.goToOptions.rteChoicePage = false;
                }
                _this.previousShow = false;
                _this.chat.render(null, null);
            },

            disableButtonsPaginatin: function() {
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


            /* _this.per_page = _this.chatElem.querySelector('[data-role="per_page"]');
             if (_this.per_page) {
             _this.per_page.value = _this.chat.data.perPageValue;
             if (_this.per_page.value === "") {
             _this.per_page.value = 2;
             _this.chat.data.perPageValue = 2;
             }
             }
             _this.showPagination(function() {
             _this.pagination_container.innerHTML = _this.pagination_template({
             config: _this.pagination_navbar_config
             });
             _this.btnBack = _this.pagination_container.querySelector('[data-role="back"]');
             _this.btnBack.addEventListener('click', _this.selectBack.bind(_this), false);
             _this.btnFirst = _this.pagination_container.querySelector('[data-role="first"]');
             _this.btnFirst.addEventListener('click', _this.selectFirst.bind(_this), false);
             _this.btnLast = _this.pagination_container.querySelector('[data-role="last"]');
             _this.btnLast.addEventListener('click', _this.selectLast.bind(_this), false);
             _this.btnForward = _this.pagination_container.querySelector('[data-role="forward"]');
             _this.btnForward.addEventListener('click', _this.selectForward.bind(_this), false);
             _this.lblCurrent = _this.pagination_container.querySelector('[data-role="current"]');
             _this.btnChoiceLeft = _this.pagination_container.querySelector('[data-location="left"]');
             _this.btnChoiceLeft.addEventListener('click', _this.showChoicePerPage.bind(_this), false);
             _this.btnChoiceRight = _this.pagination_container.querySelector('[data-location="right"]');
             _this.btnChoiceRight.addEventListener('click', _this.showChoicePerPage.bind(_this), false);
             //_this.trigger('resizeMessagesContainer');
             }, callback);*/


            showPagination: function(callback, _callback) {
                var _this = this;
                if (_this.enable_pagination) {
                    _this.chat.data.showEnablePagination = _this.enable_pagination.checked;
                    _this.chat.data.perPageValue = parseInt(_this.per_page.value);
                    if (_this.enable_pagination.checked) {
                        if(_this.chat.data.showChoicePerPage){
                            _this.showChoicePerPage();
                        }
                        _this.pagination_container.classList.remove("hide");
                        _this.countQuantityPages(callback);
                        if(_callback){
                            _callback();
                        }
                    } else {
                        _this.pagination_container.classList.add("hide");
                        _this.choice_per_page_container = _this.outer_container.querySelector('[data-role="go_to_container"]');
                        _this.choice_per_page_container.innerHTML = "";
                        _this.trigger('fillListMessage', {start: 0, callback: _callback});
                    }
                } else {
                    if (_this.chat.data.showEnablePagination) {
                        if(_this.chat.data.showChoicePerPage){
                            _this.showChoicePerPage();
                        }
                        _this.pagination_container.classList.remove("hide");
                        _this.countQuantityPages(callback);
                    } else {
                        _this.pagination_container.classList.add("hide");
                        _this.trigger('fillListMessage', {start: 0, callback: _callback});
                    }
                }
            },

            choicePaginationNavbarConfig: function(callback) {
                var _this = this;
                _this.pagination_navbar_config.forEach(function(element) {
                    if (element.data_role === "current" && element.element === "label") {
                        element.text = _this.chat.data.currentPage;
                    }
                    if (element.data_role === "first") {
                        element.value = _this.chat.data.firstPage;
                        element.text = _this.chat.data.firstPage;
                    }
                    if (element.data_role === "last") {
                        element.value = _this.chat.data.lastPage;
                        element.text = _this.chat.data.lastPage;
                    }
                });
                if (_this.chat.data.currentPage === _this.chat.data.firstPage) {
                    _this.pagination_navbar_config.forEach(function(element) {
                        if (element.data_role === "first" || element.data_role === "back" || element.data_location === "left") {
                            element.disable = true;
                        }
                    });
                } else {
                    _this.pagination_navbar_config.forEach(function(element) {
                        if (element.data_role === "first" || element.data_role === "back" || element.data_location === "left") {
                            element.disable = false;
                        }
                        if (element.data_role === "first") {
                            element.value = _this.chat.data.firstPage;
                            element.text = _this.chat.data.firstPage;
                        }
                    });
                }
                if (_this.chat.data.currentPage === _this.chat.data.lastPage) {
                    _this.pagination_navbar_config.forEach(function(element) {
                        if (element.data_role === "last" || element.data_role === "forward" || element.data_location === "right") {
                            element.disable = true;
                        }
                    });
                } else {
                    _this.pagination_navbar_config.forEach(function(element) {
                        if (element.data_role === "last" || element.data_role === "forward" || element.data_location === "right") {
                            element.disable = false;
                        }
                    });
                }
                if (callback) {
                    callback();
                }
            },



/*
                _this.choice_per_page_container.innerHTML = _this.choice_per_page_template({
                    choice_per_page_config: _this.choice_per_page_config,
                    triple_element_template: _this.triple_element_template,
                    button_template: _this.button_template,
                    input_template: _this.input_template,
                    label_template: _this.label_template,
                    mode: _this.chat.data.redraw_choice_page_mode
                });
                _this.inp_choise_per_page = _this.chatElem.querySelector('input[data-role="choice_per_page"]');
                if (_this.inp_choise_per_page) {
                    _this.inp_choise_per_page.value = _this.chat.data.currentPage;
                    _this.inp_choise_per_page.addEventListener('input', _this.selectCurrent.bind(_this), false);
                }
                _this.rte_go_to_page = _this.chatElem.querySelector('input[data-role="rte_choice_per_page"]');
                if (_this.rte_go_to_page) {
                    _this.rte_go_to_page.addEventListener('change', _this.changeRTE.bind(_this), false);
                    _this.rte_go_to_page.checked = true;
                }
                _this.btn_go_to_page = _this.chatElem.querySelector('button[data-role="go_to_page"]');
                if (_this.btn_go_to_page) {
                    _this.btn_go_to_page.addEventListener('click', _this.goToCurrentPage.bind(_this), false);
                    _this.rte_go_to_page.checked = false;
                }
                _this.label_go_to_page = _this.chatElem.querySelector('label[data-role="go_to_page"]');
                if (_this.label_go_to_page) {
                    _this.rte_go_to_page.checked = true;
                }*/


            selectCurrent: function() {
                var _this = this;
                _this.chat.data.currentPage = _this.inp_choise_per_page.value;
                if (_this.chat.data.redraw_choice_page_mode === "rte") {
                    _this.render();
                }
            },

            goToCurrentPage: function() {
                var _this = this;
                _this.chat.data.currentPage = _this.inp_choise_per_page.value;
                //_this.choice_per_page_container.innerHTML = "";
                _this.render();
            }



        };
        extend(pagination, event_core);
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
