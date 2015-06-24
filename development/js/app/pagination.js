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
            },

            addMainEventListener: function() {
                var _this = this;
                _this.removeMainEventListeners();
                _this.addRemoveListener('add', _this.pagination_container, 'click', _this.bindedThrowEventRouter, false);
            },

            removeMainEventListeners: function() {
                var _this = this;
            },

            cashElements: function() {
                var _this = this;
                _this.buttons_show_choice = Array.prototype.slice.call(_this.pagination_container.querySelectorAll('[data-role="choice"]'));
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
                        _this.elementMap = {
                            PAGINATION: _this.pagination_container
                        };
                        _this.body_mode = _this.MODE.PAGINATION;
                        _this.renderLayout(null, function(){
                            _this.addMainEventListener();
                            _this.cashElements();
                            _this.renderGoTo();
                        });
                } else {
                    _this.pagination_container.innerHTML = "";
                    _this.go_to_container.innerHTML = "";
                    if (_this.buttons_show_choice) {
                        _this.buttons_show_choice.forEach(function(btn){
                            btn.dataset.toggle = true;
                        });
                    }
                }
            },

            renderGoTo: function() {
                var _this = this;
                if (_this.chat.goToOptions.show){
                    _this.buttons_show_choice.forEach(function(btn){
                        btn.dataset.toggle = false;
                    });
                    _this.elementMap = {
                        GO_TO: _this.go_to_container
                    };
                    var data = {
                        choice_mode: "nrte"
                    };
                    _this.body_mode = _this.MODE.GO_TO;
                    _this.renderLayout(data, null);
                } else {
                    _this.go_to_container.innerHTML = "";
                    if (_this.buttons_show_choice) {
                        _this.buttons_show_choice.forEach(function(btn){
                            btn.dataset.toggle = true;
                        });
                    }
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

            countQuantityPages: function(callback) {
                var _this = this;
                var start;
                var final;
                indexeddb.getAll(_this.data.collectionDescription, function(getAllErr, messages) {
                    var quantityMes = messages.length;
                    var quantityPages = Math.ceil(quantityMes / _this.chat.data.perPageValue);
                    if (_this.chat.data.curPage === null) {
                        start = quantityPages * _this.chat.data.perPageValue - _this.chat.data.perPageValue;
                        final = quantityPages * _this.chat.data.perPageValue;
                        _this.chat.data.curPage = quantityPages;
                    } else {
                        start = (_this.chat.data.curPage - 1) * _this.chat.data.perPageValue;
                        final = (_this.chat.data.curPage - 1) * _this.chat.data.perPageValue + _this.chat.data.perPageValue;
                    }
                    _this.trigger('fillListMessage', {start: start, final: final});
                    _this.chat.data.lastPage = quantityPages;
                    _this.choicePaginationNavbarConfig(callback);
                });
            },

            choicePaginationNavbarConfig: function(callback) {
                var _this = this;
                _this.pagination_navbar_config.forEach(function(element) {
                    if (element.data_role === "current" && element.element === "label") {
                        element.text = _this.chat.data.curPage;
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
                if (_this.chat.data.curPage === _this.chat.data.firstPage) {
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
                if (_this.chat.data.curPage === _this.chat.data.lastPage) {
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

            selectFirst: function() {
                var _this = this;
                _this.chat.data.curPage = parseInt(_this.btnFirst.value);
                _this.render();
            }
            ,

            selectLast: function() {
                var _this = this;
                _this.chat.data.curPage = parseInt(_this.btnLast.value);
                _this.render();
            },

            selectBack: function() {
                var _this = this;
                _this.chat.data.curPage = parseInt(_this.chat.data.curPage) - 1;
                _this.render();
            },

            selectForward: function() {
                var _this = this;
                _this.chat.data.curPage = parseInt(_this.chat.data.curPage) + 1;
                _this.render();
            },

            showChoicePerPage: function() {
                var _this = this;
                if (_this.choice_per_page_container.innerHTML === "" ) {

                    _this.sendRequest("/mock/choice_per_page_config.json", function(err, res) {
                        if (err) {
                            console.log(err);
                        } else {
                            _this.choice_per_page_config = JSON.parse(res);
                            _this.chat.data.showChoicePerPage = true;
                            _this.renderGoTo();
                            _this.trigger('calcMessagesContainerHeight');
                        }
                    })
                } else {
                    _this.choice_per_page_container.innerHTML = "";
                    _this.chat.data.showChoicePerPage = false;
                    _this.trigger('calcMessagesContainerHeight');
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
                    _this.inp_choise_per_page.value = _this.chat.data.curPage;
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
                _this.chat.data.curPage = _this.inp_choise_per_page.value;
                if (_this.chat.data.redraw_choice_page_mode === "rte") {
                    _this.render();
                }
            },

            goToCurrentPage: function() {
                var _this = this;
                _this.chat.data.curPage = _this.inp_choise_per_page.value;
                //_this.choice_per_page_container.innerHTML = "";
                _this.render();
            },

            changeRTE: function() {
                var _this = this;
                if (_this.rte_go_to_page.checked) {
                    _this.chat.data.redraw_choice_page_mode = "rte";
                } else {
                    _this.chat.data.redraw_choice_page_mode = "nrte";
                }
                _this.renderGoTo();

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
