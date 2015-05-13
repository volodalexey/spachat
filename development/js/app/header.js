define('header', [
        'event_core',
        'ajax_core',
        'settings',
        'contact_list',
        'pagination',
        'text!../html/filter_template.html',
        'text!../html/header_template.html'
    ],
    function(event_core,
             ajax_core,
             settings,
             contact_list,
             pagination,
             filter_template,
             header_template) {

        var header = function() {
        };

        header.prototype = {

            toolbarElement: 'button',

            initialize: function(newChat) {
                var _this = this;
                _this.header_template = _.template(header_template);
                _this.filter_template = _.template(filter_template);
                _this.newChat = newChat;

                _this.addEventListeners();


                _this.outer_container = _this.newChat.querySelector('[data-role="body_outer_container"]');

                _this.sendRequest("/mock/header_navbar_config.json", function(err, config) {
                    if (err) {
                        console.log(err);
                    } else {
                        _this.header_navbar_config = JSON.parse(config);
                        _this.header_container = _this.newChat.querySelector('[data-role="header_outer_container"]');
                        _this.body_outer_container = _this.newChat.querySelector('[data-role="body_outer_container"]');
                        _this.header_container.innerHTML = _this.header_template({
                            header_btn: _this.header_navbar_config
                        });
                        _this.trigger('resizeMessagesContainer');
                        //var btnsHeader = _this.header_container.querySelectorAll('[data-role="btnHeader"]');
                        //for (var i = 0, l = btnsHeader.length; i < l; i++) {
                        //    var name = btnsHeader[i].getAttribute('data-action');
                        //    btnsHeader[i].addEventListener('click', _this[name].bind(_this), false);
                        //}
                        _this.addToolbarListeners();
                    }
                });
                _this.filter_container = _this.newChat.querySelector('[data-role="filter_container"]');
                _this.valueEnablePagination = false;
            },

            addEventListeners: function() {
                var _this = this;
                _this.removeEventListeners();
                settings.on('resizeMessagesContainer', _this.throwEvent.bind(_this, 'resizeMessagesContainer'), _this);
                settings.on('calcOuterContainerHeight', _this.calcOuterContainerHeight.bind(_this), _this);
                settings.on('renderMassagesEditor', _this.throwEvent.bind(_this, 'renderMassagesEditor'), _this);
                contact_list.on('calcOuterContainerHeight', _this.calcOuterContainerHeight.bind(_this), _this);
                contact_list.on('renderMassagesEditor', _this.throwEvent.bind(_this, 'renderMassagesEditor'), _this);
            },

            removeEventListeners: function() {
                settings.off('resizeMessagesContainer');
                settings.off('calcOuterContainerHeight');
                settings.off('renderMassagesEditor');
                contact_list.off('calcOuterContainerHeight');
                contact_list.off('renderMassagesEditor');
            },

            addToolbarListeners: function() {
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
            },

            throwEvent: function(name) {
                var _this = this;
                _this.trigger(name);
            },

            renderContactList: function() {
                var _this = this;
                contact_list.initialize(_this.newChat);
            },

            renderSettings: function() {
                var _this = this;
                settings.initialize(_this.newChat);
            },

            renderFilter: function() {
                var _this = this;
                _this.filter_container = _this.newChat.querySelector('[data-role="filter_container"]');
                if (_this.filter_container.classList.contains('hide')) {
                    _this.filter_container.innerHTML = _this.filter_template();
                    _this.filter_container.classList.remove('hide');
                    pagination.initialize(_this.newChat, _this.valueEnablePagination);
                    _this.enable_pagination = _this.newChat.querySelector('[data-role="enable_pagination"]');
                    _this.valueEnablePagination = _this.enable_pagination.checked;
                    _this.valueEnablePagination = pagination.showPagination();
                    _this.trigger('resizeMessagesContainer');
                } else {
                    _this.valueEnablePagination = _this.newChat.querySelector('[data-role="enable_pagination"]').checked;
                    _this.filter_container.innerHTML = "";
                    _this.filter_container.classList.add('hide');
                    _this.trigger('resizeMessagesContainer');
                }
            },

            calcOuterContainerHeight: function() {
                var _this = this;
                var height = window.innerHeight - _this.header_container.clientHeight;
                var marginHeader = parseInt(window.getComputedStyle(_this.header_container, null).getPropertyValue('margin-top'));
                _this.body_outer_container.style.height = height - marginHeader + "px";
            }
        }

        extend(header, event_core);
        extend(header, ajax_core);
        return header;
    });
