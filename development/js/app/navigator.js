define('navigator',
    [
        'chat_platform',
        'panel_platform',
        'login',
        'register'
    ],
    function(chat_platform,
             panel_platform,
             login,
             register) {

        var navigator = function() {
            this.bindContexts();
            this.login_outer_container = document.querySelector('[data-role="login_outer_container"]');
            this.main_container = document.querySelector('[data-role="main_container"]');
            this.addEventListeners();
            this.userId = null;
            this.pages = [chat_platform, login, register];
            this.currentPage = null;
        };

        navigator.prototype = {

            bindContexts: function() {
                var _this = this;
                _this.bindedNavigate = _this.navigate.bind(_this);
                _this.bindedRedirectToLogin = _this.redirectToLogin.bind(_this);
                _this.bindedNotifyCurrentPage = _this.notifyCurrentPage.bind(_this);
            },

            addEventListeners: function() {
                var _this = this;
                _this.removeEventListeners();
                window.addEventListener('popstate', _this.bindedNavigate, false);
                window.addEventListener('resize', _this.bindedNotifyCurrentPage, false);
                panel_platform.on('throw', _this.bindedNotifyCurrentPage, false);
            },

            removeEventListeners: function() {
                var _this = this;
                window.removeEventListener('popstate', _this.bindedNavigate, false);
                window.removeEventListener('resize', _this.bindedNotifyCurrentPage, false);
                panel_platform.off('addNewPanel');
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
                if(!(_this.currentPage === login || _this.currentPage === register) && !_this.userId ) {
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
            }
        };

        return new navigator();
    }
);