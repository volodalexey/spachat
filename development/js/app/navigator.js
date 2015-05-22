define('navigator',
    [
        'chat_platform',
        'panel_platform',
        'login',

        'indexeddb'

    ],
    function(chat_platform,
             panel_platform,
             login,

             indexeddb
    ) {

        var navigator = function() {
        };

        navigator.prototype = {

            data: {
                pages: [chat_platform, login],
                matchedPages: []
            },

            initialize: function() {
                var _this = this;
                _this.window = window;
                _this.bindContexts();
                _this.addEventListeners();
                _this.login = document.querySelector('[data-role="login_container_global"]');
                _this.main = document.querySelector('[data-role="main_container"]');
                _this.leftPanel = document.querySelector('[data-action="leftPanel"]');
                _this.rightPanel = document.querySelector('[data-action="rightPanel"]');
                return _this;
            },

            bindContexts: function() {
                var _this = this;
                _this.bindedNavigate = _this.navigate.bind(_this);
            },

            addEventListeners: function() {
                var _this = this;
                window.addEventListener('popstate', _this.bindedNavigate, false);
                chat_platform.on('addNewPanel', panel_platform.addNewPanel, panel_platform);
                panel_platform.on('clearStory', chat_platform.clearStory, chat_platform);
                panel_platform.on('addNewChat', chat_platform.addNewChat, chat_platform);
            },

            removeEventListeners: function() {
                var _this = this;
                login.off('navigate');
                window.removeEventListener('popstate', _this.bindedNavigate, false);
            },

            throwEvent: function(name) {
                var _this = this;
                _this.trigger(name);
            },

            getCurrentPage: function(href) {
                var _this = this;
                _this.data.matchedPages = [];
                _.each(_this.data.pages, function(page) {
                    if (page.link) {
                        var pageRegExp = new RegExp(page.link, "gi");
                        if (pageRegExp.test(href)) {
                            _this.data.matchedPages.push(page);
                        }
                    }
                });
            },

            navigate: function() {
                var _this = this;
                var href = window.location.href;
                _this.getCurrentPage(href);
                _.each(_this.data.matchedPages, function(page) {
                    if (page !== login) {
                        _this.login.classList.add("hidden_login");
                    } else {
                        _this.leftPanel.classList.add("hidden");
                        _this.rightPanel.classList.add("hidden");
                    }
                    page.render && page.render();
                    if (page !== chat_platform) {
                    }
                });
                if (!_this.data.matchedPages.length) {
                    history.pushState(null, null, 'login');
                    window.history.go(0);
                    _this.navigate();
                }
            }
        };

        return (new navigator()).initialize();
    }
);