define('pagination', [
        'event_core',
        'ajax_core',

        'text!../html/pagination_template.html',
        'text!../html/choice_per_page_template.html',
        'text!../html/element/triple_element_template.html',
        'text!../html/element/button_template.html',
        'text!../html/element/label_template.html',
        'text!../html/element/input_template.html'
    ],
    function(event_core,
             ajax_core,
             pagination_template,
             choice_per_page_template,
             triple_element_template,
             button_template,
             label_template,
             input_template) {

        var pagination = function() {

        };

        pagination.prototype = {

            pagination_template: _.template(pagination_template),
            choice_per_page_template: _.template(choice_per_page_template),
            triple_element_template: _.template(triple_element_template),
            button_template: _.template(button_template),
            label_template: _.template(label_template),
            input_template: _.template(input_template),

            initialize: function(options, callback) {
                var _this = this;
                _this.data = {
                    options: options,
                    collection: {
                        "id": options.chat.chatsArray.length,
                        "db_name": options.chat.chatsArray.length + '_chat_messages',
                        "table_name": options.chat.chatsArray.length + '_chat_messages',
                        "db_version": 1,
                        "keyPath": "id"
                    }
                };
                _this.chat = options.chat;
                _this.chatElem = _this.chat.chatElem;
                _this.outer_container = _this.chatElem.querySelector('[data-role="body_outer_container"]');
                _this.pagination_container = _this.chatElem.querySelector('[data-role="pagination_container"]');
                _this.messages_container = _this.chatElem.querySelector('[data-role="messages_container"]');
                _this.choice_per_page_container = _this.outer_container.querySelector('[data-role="per_page_container"]');
                _this.sendRequest("/mock/pagination_navbar_config.json", function(err, res) {
                    if (err) {
                        console.log(err);
                    } else {
                        _this.pagination_navbar_config = JSON.parse(res);
                    }

                    _this.renderPagination(callback);
                });
                return _this;
            },

            renderPagination: function(callback) {
                var _this = this;
                _this.enable_pagination = _this.chatElem.querySelector('[data-role="enable_pagination"]');
                _this.per_page = _this.chatElem.querySelector('[data-role="per_page"]');
                if (_this.per_page) {
                    _this.per_page.value = _this.chat.data.per_page_value;
                    if (_this.per_page.value === "") {
                        _this.per_page.value = 2;
                        _this.chat.data.per_page_value = 2;
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
                }, callback);
            },

            showPagination: function(callback, _callback) {
                var _this = this;
                if (_this.enable_pagination) {
                    _this.chat.data.valueEnablePagination = _this.enable_pagination.checked;
                    _this.chat.data.per_page_value = parseInt(_this.per_page.value);
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
                        _this.choice_per_page_container = _this.outer_container.querySelector('[data-role="per_page_container"]');
                        _this.choice_per_page_container.innerHTML = "";
                        _this.trigger('fillListMessage', {start: 0, callback: _callback});
                    }
                } else {
                    if (_this.chat.data.valueEnablePagination) {
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
                _this.chat.indexeddb.getAll(_this.data.collection, function(getAllErr, messages) {
                    var quantityMes = messages.length;
                    var quantityPages = Math.ceil(quantityMes / _this.chat.data.per_page_value);
                    if (_this.chat.data.curPage === null) {
                        start = quantityPages * _this.chat.data.per_page_value - _this.chat.data.per_page_value;
                        final = quantityPages * _this.chat.data.per_page_value;
                        _this.chat.data.curPage = quantityPages;
                    } else {
                        start = (_this.chat.data.curPage - 1) * _this.chat.data.per_page_value;
                        final = (_this.chat.data.curPage - 1) * _this.chat.data.per_page_value + _this.chat.data.per_page_value;
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
                _this.renderPagination();
            }
            ,

            selectLast: function() {
                var _this = this;
                _this.chat.data.curPage = parseInt(_this.btnLast.value);
                _this.renderPagination();
            },

            selectBack: function() {
                var _this = this;
                _this.chat.data.curPage = parseInt(_this.chat.data.curPage) - 1;
                _this.renderPagination();
            },

            selectForward: function() {
                var _this = this;
                _this.chat.data.curPage = parseInt(_this.chat.data.curPage) + 1;
                _this.renderPagination();
            },

            showChoicePerPage: function() {
                var _this = this;
                /*if(_this.chat.data.showChoicePerPage){
                    _this.chat.data.showChoicePerPage = false;
                    _this.choice_per_page_container.innerHTML = "";
                    _this.trigger('calcMessagesContainerHeight');
                } else {
                    _this.chat.data.showChoicePerPage = true;
                    _this.sendRequest("/mock/choice_per_page_config.json", function(err, res) {
                        if (err) {
                            console.log(err);
                        } else {
                            _this.choice_per_page_config = JSON.parse(res);
                            _this.renderChoicePerPage();
                            _this.trigger('calcMessagesContainerHeight');
                        }
                    })
                }*/
                if (_this.choice_per_page_container.innerHTML === "") {

                    _this.sendRequest("/mock/choice_per_page_config.json", function(err, res) {
                        if (err) {
                            console.log(err);
                        } else {
                            _this.choice_per_page_config = JSON.parse(res);
                            _this.chat.data.showChoicePerPage = true;
                            _this.renderChoicePerPage();
                            _this.trigger('calcMessagesContainerHeight');
                        }
                    })
                } else {
                    _this.choice_per_page_container.innerHTML = "";
                    _this.chat.data.showChoicePerPage = false;
                    _this.trigger('calcMessagesContainerHeight');
                }
            },

            renderChoicePerPage: function() {
                var _this = this;
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
                }
            },

            selectCurrent: function() {
                var _this = this;
                _this.chat.data.curPage = _this.inp_choise_per_page.value;
                if (_this.chat.data.redraw_choice_page_mode === "rte") {
                    _this.renderPagination();
                }
            },

            goToCurrentPage: function() {
                var _this = this;
                _this.chat.data.curPage = _this.inp_choise_per_page.value;
                //_this.choice_per_page_container.innerHTML = "";
                _this.renderPagination();
            },

            changeRTE: function() {
                var _this = this;
                if (_this.rte_go_to_page.checked) {
                    _this.chat.data.redraw_choice_page_mode = "rte";
                } else {
                    _this.chat.data.redraw_choice_page_mode = "nrte";
                }
                _this.renderChoicePerPage();

            }

        }
        extend(pagination, event_core);
        extend(pagination, ajax_core);

        return pagination;
    })
;
