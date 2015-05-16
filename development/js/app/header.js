define('header', [
        'event_core',
        'ajax_core',
        'pagination',
        'text!../html/filter_template.html',
        'text!../html/header_template.html'
    ],
    function(event_core,
             ajax_core,
             pagination,
             filter_template,
             header_template) {

        var header = function() {
        };

        header.prototype = {

            header_template: _.template(header_template),
            filter_template: _.template(filter_template),

            initialize: function(options) {
                var _this = this;

                _this.chat = options.chat;

                _this.header_container = _this.chat.chatElem.querySelector('[data-role="header_outer_container"]');
                _this.body_outer_container = _this.chat.chatElem.querySelector('[data-role="body_outer_container"]');
                _this.renderByMode();
            },

            renderByMode: function() {
                var _this = this;
                switch (_this.chat.data.mode) {
                    case "webrtc":
                        _this.header_container.innerHTML = _this.header_template({
                            description: 'Web RTC Initialization'
                        });
                        break;
                    case "messages":
                        _this.sendRequest("/mock/header_navbar_config.json", function(err, config) {
                            if (err) {
                                console.log(err);
                            } else {
                                _this.header_navbar_config = JSON.parse(config);
                                _this.header_container.innerHTML = _this.header_template({
                                    header_btn: _this.header_navbar_config,
                                    description: 'Chat Messages'
                                });
                                _this.trigger('resizeMessagesContainer');
                                var btnsHeader = _this.header_container.querySelectorAll('[data-role="btnHeader"]');
                                for (var i = 0, l = btnsHeader.length; i < l; i++) {
                                    var name = btnsHeader[i].getAttribute('data-action');
                                    btnsHeader[i].addEventListener('click', _this[name].bind(_this), false);
                                }
                                //_this.addToolbarListeners();
                            }
                        });
                        _this.filter_container = _this.chat.chatElem.querySelector('[data-role="filter_container"]');
                        break;
                }
            },

            addEventListeners: function() {
                var _this = this;
                _this.removeEventListeners();

            },

            removeEventListeners: function() {
                var _this = this;
                _this.perPage.removeEventListener('input', _this.changePerPage.bind(_this), false);

            },

            renderFilter: function() {
                var _this = this;
                _this.filter_container = _this.chat.chatElem.querySelector('[data-role="filter_container"]');
                var param = _this.body_outer_container.getAttribute('param-content');
                if (param !== "message") {
                    _this.trigger('renderMassagesEditor');
                    _this.trigger('renderPagination');
                    _this.body_outer_container.setAttribute("param-content", "message");
                    _this.body_outer_container.classList.remove('background');
                }
                if (_this.filter_container.classList.contains('hide')) {
                    _this.filter_container.innerHTML = _this.filter_template();
                    _this.filter_container.classList.remove('hide');

                    _this.enablePagination = _this.filter_container.querySelector('input[data-role="enable_pagination"]');
                    if (_this.enablePagination) {
                        _this.enablePagination.checked = _this.chat.data.valueEnablePagination;
                        //_this.enablePagination.removeEventListener('change', _this.renderPagination.bind(_this), false);

                        _this.enablePagination.addEventListener('change', _this.renderPagination.bind(_this), false);
                    }
                    _this.perPage = _this.filter_container.querySelector('input[data-role="per_page"]');
                    if (_this.perPage) {
                        //_this.perPage.removeEventListener('input', _this.changePerPage.bind(_this), false);

                        _this.perPage.addEventListener('input', _this.changePerPage.bind(_this), false);
                        _this.perPage.value = _this.chat.data.per_page_value;
                    }
                    _this.trigger('resizeMessagesContainer');
                } else {
                    _this.valueEnablePagination = _this.chat.chatElem.querySelector('[data-role="enable_pagination"]').checked;
                    _this.per_page = _this.chat.chatElem.querySelector('[data-role="per_page"]');
                    _this.per_page_value = parseInt(_this.per_page.value);
                    _this.filter_container.innerHTML = "";
                    _this.filter_container.classList.add('hide');
                    _this.trigger('resizeMessagesContainer');
                }
                _this.trigger('calcOuterContainerHeight');
            },

            renderContactList: function() {
                var _this = this;
                _this.trigger("renderContactList");
            },

            renderSettings: function() {
                var _this = this;
                _this.trigger("renderSettings");
            },

            renderPagination: function() {
                var _this = this;

                _this.trigger("renderPagination");
            },

            changePerPage: function() {
                var _this = this;
                _this.chat.data.per_page_value = parseInt(_this.perPage.value);
                if (_this.chat.data.valueEnablePagination) {
                    if (_this.perPage.value !== "") {
                        _this.trigger("changePerPage");

                    }
                }
            }

            /* addToolbarListeners: function() {
             var _this = this;
             _this.removeToolbarListeners();
             if (!_this.header_container || !_this.header_navbar_config) {
             return;
             }
             _.each(_this.header_navbar_config, function(_configItem) {
             if (_configItem.element === _this.toolbarElement) {
             _this.header_container.addEventListener('click', _this.toolbarEventRouter.bind(_this), false);
             }
             });
             },

             removeToolbarListeners: function() {
             var _this = this;
             if (!_this.header_container || !_this.header_navbar_config) {
             return;
             }
             _.each(_this.header_navbar_config, function(_configItem) {
             if (_configItem.element === _this.toolbarElement) {
             _this.header_container.removeEventListener('click', _this.toolbarEventRouter.bind(_this), false);
             }
             });
             },

             toolbarEventRouter: function(event) {
             var _this = this;
             var action = event.target.getAttribute('data-action');
             _this[action](event);
             },*/

        }

        extend(header, event_core);
        extend(header, ajax_core);
        return header;
    });
