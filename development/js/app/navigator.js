define('navigator',
    [
        'chat_platform',
        'panel_platform',
        'login',
        'register',
        'users_bus',
        'event_bus',
        'popap_manager',
        //
        'throw_event_core',
        'dom_core',
        'extend_core'
    ],
    function(chat_platform,
             panel_platform,
             login,
             register,
             users_bus,
             event_bus,
             popap_manager,
             //
             throw_event_core,
             dom_core,
             extend_core) {

        var navigator = function() {
            this.pages = [chat_platform, login, register];
            this.currentPage = null;
        };

        navigator.prototype = {

            cashElements: function() {
                var _this = this;
                _this.login_outer_container = document.querySelector('[data-role="login_outer_container"]');
                _this.main_container = document.querySelector('[data-role="main_container"]');
            },

            unCashElements: function() {
                var _this = this;
                _this.login_outer_container = null;
                _this.main_container = null;
            },

            bindContexts: function() {
                var _this = this;
                _this.bindedNavigate = _this.navigate.bind(_this);
                _this.bindedRedirectToLogin = _this.redirectToLogin.bind(_this);
                _this.bindedNotifyCurrentPage = _this.notifyCurrentPage.bind(_this);
                _this.bindedOnChangeLanguage = _this.onChangeLanguage.bind(_this);
            },

            unBindContexts: function() {
                var _this = this;
                _this.bindedNavigate = null;
                _this.bindedRedirectToLogin = null;
                _this.bindedNotifyCurrentPage = null;
                _this.bindedOnChangeLanguage = null;
            },

            addEventListeners: function() {
                var _this = this;
                _this.removeEventListeners();
                window.addEventListener('popstate', _this.bindedNavigate, false);
                window.addEventListener('resize', _this.bindedNotifyCurrentPage, false);
                window.addEventListener('change', _this.bindedOnChangeLanguage, false);
                panel_platform.on('throw', _this.bindedNotifyCurrentPage, false);
            },

            removeEventListeners: function() {
                var _this = this;
                window.removeEventListener('popstate', _this.bindedNavigate, false);
                window.removeEventListener('resize', _this.bindedNotifyCurrentPage, false);
                window.removeEventListener('change', _this.bindedOnChangeLanguage, false);
                panel_platform.off('addNewPanel');
            },

            onChangeLanguage: function(event) {
                var _this = this;
                if (event.target.dataset.role === 'selectLanguage') {
                    if (event.target.dataset.warn) {
                        popap_manager.renderPopap(
                            'confirm',
                            {message: 101},
                            function(action) {
                                switch (action) {
                                    case 'confirmOk':
                                        _this.changeLanguage(event);
                                        popap_manager.onClose();
                                        break;
                                    case 'confirmCancel':
                                        event.target.value = window.localization;
                                        popap_manager.onClose();
                                        break;
                                }
                            }
                        );
                    } else {
                        _this.changeLanguage(event);
                    }
                }
            },

            changeLanguage: function(event) {
                var _this = this, current_localization = window.localization;
                window.localization = event.target.value;
                if (_this.currentPage && _this.currentPage.withPanels) {
                    event_bus.trigger("chatsDestroy");
                    event_bus.trigger("panelsDestroy");
                    event_bus.trigger("changeToggleDescription");
                    event_bus.trigger("mainRebuild");
                }
                var language = localStorage.getItem('language');
                if (!language || language !== event.target.value) {
                    localStorage.setItem('language', event.target.value);
                }
                if (current_localization !== event.target.value && _this.currentPage && !_this.currentPage.withPanels) {
                    this.navigate();
                }
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
                if (!(_this.currentPage === login || _this.currentPage === register) && !users_bus.getUserId()) {
                    _this.redirectToLogin();
                } else if (_this.currentPage) {
                    _this.main_container.innerHTML = '';
                    if (_this.currentPage.withPanels) {
                        panel_platform.renderPanels({navigator: _this});
                    }
                    _this.currentPage.render && _this.currentPage.render({navigator: _this});
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