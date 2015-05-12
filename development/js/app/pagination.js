define('pagination', [
        'event_core',
        'text!../html/pagination_template.html'
    ],
    function(
        event_core,
        pagination_template
    ) {

        var pagination = function() {

        };

        pagination.prototype = {


            initialize: function(newChat, valPagination) {
                var _this = this;
                _this.newChat = newChat;
                _this.pagination_template = _.template(pagination_template);
                _this.paginationContainer = _this.newChat.querySelector('[data-role="pagination_container"]');

                _this.paginationContainer.innerHTML = _this.pagination_template();


                _this.btnBack = _this.paginationContainer.querySelector('[data-role="back"]');
                _this.btnBack.addEventListener('click', _this.selectBack.bind(_this), false);
                _this.btnfirst = _this.paginationContainer.querySelector('[data-role="first"]');
                _this.btnfirst.addEventListener('click', _this.selectFirst.bind(_this), false);
                _this.btnLast = _this.paginationContainer.querySelector('[data-role="last"]');
                _this.btnLast.addEventListener('click', _this.selectLast.bind(_this), false);
                _this.btnForward = _this.paginationContainer.querySelector('[data-role="forward"]');
                _this.btnForward.addEventListener('click', _this.selectForward.bind(_this), false);
                _this.inpCurrent = _this.paginationContainer.querySelector('[data-role="current"]');
                _this.inpCurrent.addEventListener('click', _this.selectCurrent.bind(_this), false);

                _this.per_page = _this.newChat.querySelector('[data-role="per_page"]');

                _this.enable_pagination = _this.newChat.querySelector('[data-role="enable_pagination"]');
                _this.enable_pagination.checked = valPagination;
                _this.enable_pagination.addEventListener('change', _this.showPagination.bind(_this), false);
                _this.messages_container = _this.newChat.querySelector('[data-role="messages_container"]');

                return _this;
            },

            renderPagination: function(){
                var _this = this;
                _this.paginationContainer.innerHTML = _this.pagination_template();
            },

            countQuantityPages: function() {
                var _this = this;
                var quantityMes = localStorage.length;
                _this.per_page_value = parseInt(_this.per_page.value);
                var quantityPages = Math.ceil(quantityMes / _this.per_page_value);
                var start = quantityPages * _this.per_page_value - _this.per_page_value;
                var final = quantityPages * _this.per_page_value;
                //_this.messages_container.innerHTML = "";
                _this.fillingMes(start, final);

                var curPage = Math.ceil((start + 1) / _this.per_page_value);
                _this.inpCurrent.value = curPage;

            },

            fillingMes: function(start, final) {
                var _this = this;
                _this.messages_container.innerHTML = "";
                if(final > localStorage.length){
                    final = localStorage.length;
                }
                for (var i = start; i < final; i++) {
                    var newMessage = document.createElement('div');
                    var key = localStorage.key(i);
                    newMessage.innerHTML = localStorage.getItem(key);
                    _this.messages_container.appendChild(newMessage);
                }
            },

            showPagination: function() {
                var _this = this;

                var valueEnablePagination;

                if (_this.enable_pagination.checked) {
                    valueEnablePagination = _this.enable_pagination.checked;
                    _this.paginationContainer.classList.remove("hide");
                    _this.countQuantityPages();
                } else {
                    valueEnablePagination = _this.enable_pagination.checked;
                    _this.paginationContainer.classList.add("hide");
                    //_this.messages_container.innerHTML = "";
                    _this.fillingMes(0, localStorage.length);
                }
                _this.trigger('resizeMessagesContainer');

                return valueEnablePagination;
            },

            selectFirst: function() {

            },

            selectLast: function() {

            },

            selectBack: function() {

            },

            selectForward: function() {

            },

            selectCurrent: function() {
                var _this = this;
                var start = (_this.inpCurrent.value - 1) * parseInt(_this.per_page.value);
                var final = (_this.inpCurrent.value - 1) * parseInt(_this.per_page.value) + parseInt(_this.per_page.value);
                _this.fillingMes(start, final);
            }

        }
        extend(pagination, event_core);

        return new pagination();
    });
