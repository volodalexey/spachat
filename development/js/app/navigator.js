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
            },

            addEventListeners: function() {
                var _this = this;
                _this.removeEventListeners();
                window.addEventListener('popstate', _this.bindedNavigate, false);
                chat_platform.on('addNewPanel', _this.addPanel, _this);
                //panel_platform.on('clearStory', chat_platform.clearStory, chat_platform);
                //panel_platform.on('addNewChat', chat_platform.addNewChat, chat_platform);
            },

            removeEventListeners: function() {
                var _this = this;
                window.removeEventListener('popstate', _this.bindedNavigate, false);
            },

            addPanel: function() {
                var _this = this;
                panel_platform.addNewPanel(_this);
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
                _this.getCurrentPage(href);
                if(!(_this.currentPage === login || _this.currentPage === register) && !_this.userId ) {
                    _this.redirectToLogin();
                } else if (_this.currentPage) {
                    if (_this.currentPage !== login) {
                        _this.login_outer_container.classList.add("hidden");
                    } else {
                        _this.main_container.innerHTML = '';
                    }
                    _this.currentPage.render && _this.currentPage.render({ navigator: _this });
                } else {
                    _this.redirectToLogin();
                }
            }
        };

        return new navigator();
    }
);