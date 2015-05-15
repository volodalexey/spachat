define('pagination', [
        'event_core',
        'text!../html/pagination_template.html',
        'text!../html/choice_per_page_template.html'
    ],
    function(event_core,
             pagination_template,
             choice_per_page_template) {

        var pagination = function() {

        };

        pagination.prototype = {

            initialize: function(newChat, data) {
                var _this = this;
                _this.newChat = newChat;
                _this.data = data;
                _this.pagination_template = _.template(pagination_template);
                _this.choice_per_page_template = _.template(choice_per_page_template);
                _this.outer_container = _this.newChat.querySelector('[data-role="body_outer_container"]');
                _this.paginationContainer = _this.newChat.querySelector('[data-role="pagination_container"]');
                _this.paginationContainer.innerHTML = _this.pagination_template();
                _this.btnBack = _this.paginationContainer.querySelector('[data-role="back"]');
                _this.btnBack.addEventListener('click', _this.selectBack.bind(_this), false);
                _this.btnFirst = _this.paginationContainer.querySelector('[data-role="first"]');
                _this.btnFirst.addEventListener('click', _this.selectFirst.bind(_this), false);
                _this.btnLast = _this.paginationContainer.querySelector('[data-role="last"]');
                _this.btnLast.addEventListener('click', _this.selectLast.bind(_this), false);
                _this.btnForward = _this.paginationContainer.querySelector('[data-role="forward"]');
                _this.btnForward.addEventListener('click', _this.selectForward.bind(_this), false);
                _this.lblCurrent = _this.paginationContainer.querySelector('[data-role="current"]');
                /*_this.btnsChoice = _this.paginationContainer.querySelectorAll('[data-role="choice"]');
                _.each(_this.btnsChoice, function(btn) {
                    btn.addEventListener('click', _this.renderChoicePerPage.bind(_this), false);
                });*/
                _this.btnChoiceLeft = _this.paginationContainer.querySelector('[data-location="left"]');
                _this.btnChoiceLeft.addEventListener('click', _this.renderChoicePerPage.bind(_this), false);
                _this.btnChoiceRight = _this.paginationContainer.querySelector('[data-location="right"]');
                _this.btnChoiceRight.addEventListener('click', _this.renderChoicePerPage.bind(_this), false);

                _this.per_page = _this.newChat.querySelector('[data-role="per_page"]');
                if (_this.per_page) {
                    _this.per_page.value = _this.data.per_page_value;
                    _this.per_page_value = _this.data.per_page_value;
                    if (_this.per_page.value === "") {
                        _this.per_page.value = 10;
                        _this.data.per_page_value = 10;
                    }
                }
                _this.enable_pagination = _this.newChat.querySelector('[data-role="enable_pagination"]');
                if (_this.enable_pagination) {
                    _this.enable_pagination.addEventListener('change', _this.showPagination.bind(_this), false);
                } else {
                    _this.valueChecked = _this.data.valueEnablePagination;
                }
                _this.messages_container = _this.newChat.querySelector('[data-role="messages_container"]');
                _this.showPagination();
                return _this;
            },

            showPagination: function() {
                var _this = this;
                if (_this.enable_pagination) {
                    if (_this.enable_pagination.checked) {
                        _this.data.valueEnablePagination = _this.enable_pagination.checked;
                        _this.paginationContainer.classList.remove("hide");
                        _this.per_page_value = parseInt(_this.per_page.value);
                        _this.countQuantityPages();
                    } else {
                        _this.data.valueEnablePagination = _this.enable_pagination.checked;
                        _this.paginationContainer.classList.add("hide");
                        _this.data.per_page_value = parseInt(_this.per_page.value);
                        _this.trigger('fillListMessage', {start: 0, final: localStorage.length});
                    }
                    _this.trigger('resizeMessagesContainer');
                } else {
                    if (_this.valueChecked) {
                        _this.data.valueEnablePagination = _this.valueChecked;
                        _this.paginationContainer.classList.remove("hide");
                        _this.countQuantityPages();
                    } else {
                        _this.data.valueEnablePagination = _this.valueChecked;
                        _this.paginationContainer.classList.add("hide");
                        _this.trigger('fillListMessage', {start: 0, final: localStorage.length});
                    }
                }
                _this.fillFirstPage();
                _this.fillLastPage();
            },

            fillFirstPage: function() {
                var _this = this;
                if (parseInt(_this.data.curPage) === _this.data.firstPage) {
                    _this.btnFirst.disabled = true;
                    _this.btnBack.disabled = true;
                    _this.btnChoiceLeft.disabled = true;
                } else {
                    _this.btnFirst.disabled = false;
                    _this.btnBack.disabled = false;
                    _this.btnChoiceLeft.disabled = false;
                    _this.btnFirst.innerHTML = _this.data.firstPage;
                    _this.btnLast.innerHTML = _this.data.lastPage;
                }
            },

            fillLastPage: function() {
                var _this = this;
                if (parseInt(_this.data.curPage) === _this.data.lastPage) {
                    _this.btnLast.disabled = true;
                    _this.btnForward.disabled = true;
                    _this.btnChoiceRight.disabled = true;
                } else {
                    _this.btnLast.disabled = false;
                    _this.btnForward.disabled = false;
                    _this.btnChoiceRight.disabled = false;
                    _this.btnLast.innerHTML = _this.data.lastPage;
                }
            },

            countQuantityPages: function() {
                var _this = this;
                var start;
                var final;
                var quantityMes = localStorage.length;
                var quantityPages = Math.ceil(quantityMes / _this.data.per_page_value);
                if (_this.data.curPage === "") {
                    start = quantityPages * _this.per_page_value - _this.per_page_value;
                    final = quantityPages * _this.per_page_value;
                    _this.data.curPage = Math.ceil((start + 1) / _this.per_page_value);
                } else {


                    start = (parseInt(_this.data.curPage) - 1) * parseInt(_this.per_page_value);
                    final = (parseInt(_this.data.curPage) - 1) * parseInt(_this.per_page_value) + parseInt(_this.per_page_value);
                }
                _this.trigger('fillListMessage', {start: start, final: final});
                _this.lblCurrent.innerHTML = _this.data.curPage;
                _this.data.firstPage = 1;
                _this.data.lastPage = quantityPages;
            },

            selectFirst: function() {
                var _this = this;
                _this.data.curPage = _this.btnFirst.innerText;
                _this.lblCurrent.innerHTML = _this.data.curPage;
                _this.fillFirstPage();
                _this.fillLastPage();
                _this.countQuantityPages();
            },

            selectLast: function() {
                var _this = this;
                _this.data.curPage = _this.btnLast.innerText;
                _this.lblCurrent.innerHTML = _this.data.curPage;
                _this.fillFirstPage();
                _this.fillLastPage();
                _this.countQuantityPages();
            },

            selectBack: function() {
                var _this = this;
                _this.data.curPage = parseInt(_this.data.curPage) - 1;
                _this.lblCurrent.innerHTML = _this.data.curPage;
                _this.fillFirstPage();
                _this.fillLastPage();
                _this.countQuantityPages();
            },

            selectForward: function() {
                var _this = this;
                _this.data.curPage = parseInt(_this.data.curPage) + 1;
                _this.lblCurrent.innerHTML = _this.data.curPage;
                _this.fillFirstPage();
                _this.fillLastPage();
                _this.countQuantityPages();
            },

            renderChoicePerPage: function() {
                var _this = this;
                _this.choice_per_page_container = _this.outer_container.querySelector('[data-role="per_page_container"]');
                if (_this.choice_per_page_container.innerHTML === "") {
                    _this.choice_per_page_container.innerHTML = _this.choice_per_page_template();
                    _this.inp_choise_per_page = _this.newChat.querySelector('input[data-role="choice_per_page"]');
                    _this.btn_go_to_page = _this.newChat.querySelector('[data-role="go_to_page"]');
                    _this.btn_go_to_page.addEventListener('click', _this.selectCurrent.bind(_this), false);
                    _this.inp_choise_per_page.value = _this.data.curPage;
                } else {
                    _this.choice_per_page_container.innerHTML = "";
                }
                _this.trigger('calcMessagesContainerHeight');
            },

            selectCurrent: function() {
                var _this = this;
                var start = (_this.inp_choise_per_page.value - 1) * parseInt(_this.per_page_value);
                var final = (_this.inp_choise_per_page.value - 1) * parseInt(_this.per_page_value) + parseInt(_this.per_page_value);
                _this.trigger('fillListMessage', {start: start, final: final});
                _this.data.curPage = _this.inp_choise_per_page.value;
                _this.lblCurrent.innerHTML = _this.data.curPage;
                _this.choice_per_page_container.innerHTML = "";
                _this.fillFirstPage();
                _this.fillLastPage();
                _this.trigger('calcMessagesContainerHeight');
            }

        }
        extend(pagination, event_core);

        return pagination;
    });
