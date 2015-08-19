define('navigator',
    [
        'chat_platform',
        'panel_platform',
        'login',
        'register',
        'users_bus',
        //
        'description_core',
        'throw_event_core',
        'dom_core',
        'extend_core'
    ],
    function (
        chat_platform,
        panel_platform,
        login,
        register,
        users_bus,
        //
        description_core,
        throw_event_core,
        dom_core,
        extend_core
    ) {

        var navigator = function() {
            this.pages = [chat_platform, login, register];
            this.currentPage = null;
        };

        navigator.prototype = {

            cashElements: function() {
                var _this = this;
                _this.button_description = document.querySelector('[data-role="description"]');
                _this.login_outer_container = document.querySelector('[data-role="login_outer_container"]');
                _this.main_container = document.querySelector('[data-role="main_container"]');
            },

            unCashElements: function() {
                var _this = this;
                _this.button_description = null;
                _this.login_outer_container = null;
                _this.main_container = null;
            },

            bindContexts: function() {
                var _this = this;
                _this.bindedNavigate = _this.navigate.bind(_this);
                _this.bindedRedirectToLogin = _this.redirectToLogin.bind(_this);
                _this.bindedNotifyCurrentPage = _this.notifyCurrentPage.bind(_this);
                _this.bindedShowDescription = description_core.showDescription.bind(_this, _this.button_description);
            },

            addEventListeners: function() {
                var _this = this;
                _this.removeEventListeners();
                window.addEventListener('popstate', _this.bindedNavigate, false);
                window.addEventListener('resize', _this.bindedNotifyCurrentPage, false);
                panel_platform.on('throw', _this.bindedNotifyCurrentPage, false);

                _this.addRemoveListener('add', document.body, 'mousedown', _this.bindedShowDescription, false);
                _this.addRemoveListener('add', document.body, 'mousemove', _this.bindedShowDescription, false);
                _this.addRemoveListener('add', document.body, 'touchend', _this.bindedShowDescription, true);
                _this.addRemoveListener('add', document.body, 'touchmove', _this.bindedShowDescription, false);
                _this.addRemoveListener('add', document.body, 'touchstart', _this.bindedShowDescription, false);
                _this.addRemoveListener('add', document.body, 'click', _this.bindedShowDescription, true);
            },

            removeEventListeners: function() {
                var _this = this;
                window.removeEventListener('popstate', _this.bindedNavigate, false);
                window.removeEventListener('resize', _this.bindedNotifyCurrentPage, false);
                panel_platform.off('addNewPanel');

                _this.addRemoveListener('remove', document.body, 'mousedown', _this.bindedShowDescription, false);
                _this.addRemoveListener('remove', document.body, 'mousemove', _this.bindedShowDescription, false);
                _this.addRemoveListener('remove', document.body, 'touchend', _this.bindedShowDescription, true);
                _this.addRemoveListener('remove', document.body, 'touchmove', _this.bindedShowDescription, false);
                _this.addRemoveListener('remove', document.body, 'touchstart', _this.bindedShowDescription, false);
                _this.addRemoveListener('remove', document.body, 'click', _this.bindedShowDescription, true);
            },

            getCurrentPage: function(href) {
                var _this = this;
                _this.currentPage = null;
                _this.pages.every(function(page) {
                    if (page.link instanceof RegExp && page.link.test(href)) {
                        _this.currentPage = page;
                    }
                    return !_this.currentPage;
                });
            },
            
            redirectToLogin: function() {
                history.pushState(null, null, 'login');
                this.navigate();
            },

            navigate: function() {
                var _this = this;
                var href = window.location.href;
                var oldCurrentPage = _this.currentPage;
                _this.getCurrentPage(href);
                if (oldCurrentPage && oldCurrentPage !== _this.currentPage) {
                    oldCurrentPage.dispose();
                    if (oldCurrentPage.withPanels && (_this.currentPage && !_this.currentPage.withPanels)) {
                        panel_platform.disposePanels();
                    }
                }
                if(!(_this.currentPage === login || _this.currentPage === register) && !users_bus.getUserId() ) {
                    _this.redirectToLogin();
                } else if (_this.currentPage) {
                    if (_this.currentPage !== login) {
                        _this.login_outer_container.classList.add("hidden");
                    } else {
                        _this.main_container.innerHTML = '';
                    }
                    if (_this.currentPage.withPanels) {
                        panel_platform.renderPanels({ navigator: _this });
                    }
                    _this.currentPage.render && _this.currentPage.render({ navigator: _this });
                } else {
                    _this.redirectToLogin();
                }
            },

            notifyCurrentPage: function(eventName, eventData) {
                if (!eventName) {
                    return;
                }

                var eventName = eventName;
                if (typeof eventName === 'object') {
                    eventName = eventName.type;
                }
                this.currentPage.trigger(eventName, eventData);
                if (this.currentPage.withPanels) {
                    panel_platform.trigger(eventName, eventData);
                }
            },

            destroy: function() {
                var _this = this;
                _this.removeEventListeners();
                _this.unCashElements();
            }
        };
        extend_core.prototype.inherit(navigator, throw_event_core);
        extend_core.prototype.inherit(navigator, dom_core);


        return new navigator();
    }
);