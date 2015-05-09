define('pagination', [
        'chat'
    ],
    function(chat) {

        var pagination = function() {
        };

        pagination.prototype = {

            initialize: function(newChat, valPagination) {
                var _this = this;
                _this.newChat = newChat;
                _this.pagination = _this.newChat.querySelector('[data-role="pagination"]');

                _this.btnBack = _this.pagination.querySelector('[data-role="back"]');
                _this.btnBack.addEventListener('click', _this.selectBack.bind(_this), false);
                _this.btnfirst = _this.pagination.querySelector('[data-role="first"]');
                _this.btnfirst.addEventListener('click', _this.selectFirst.bind(_this), false);
                _this.btnLast = _this.pagination.querySelector('[data-role="last"]');
                _this.btnLast.addEventListener('click', _this.selectLast.bind(_this), false);
                _this.btnForward = _this.pagination.querySelector('[data-role="forward"]');
                _this.btnForward.addEventListener('click', _this.selectForward.bind(_this), false);
                _this.inpCurrent = _this.pagination.querySelector('[data-role="current"]');
                _this.inpCurrent.addEventListener('click', _this.selectCurrent.bind(_this), false);

                _this.per_page = _this.newChat.querySelector('[data-role="per_page"]');

                _this.enable_pagination = _this.newChat.querySelector('[data-role="enable_pagination"]');
                _this.enable_pagination.checked = valPagination;
                _this.enable_pagination.addEventListener('change', _this.showPagination.bind(_this), false);
                _this.messages_container = _this.newChat.querySelector('[data-role="messages_container"]');

                return _this;
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
                    _this.pagination.classList.remove("hide");
                    _this.countQuantityPages();
                } else {
                    valueEnablePagination = _this.enable_pagination.checked;
                    _this.pagination.classList.add("hide");
                    //_this.messages_container.innerHTML = "";
                    _this.fillingMes(0, localStorage.length);
                }
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
        return new pagination();
    });
