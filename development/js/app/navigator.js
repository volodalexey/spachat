define('navigator',
    [
        'chat_platform',
        'panel_platform',
        'login',
        'register',

        'indexeddb'

    ],
    function(chat_platform,
             panel_platform,
             login,
             register,
             indexeddb) {

        var navigator = function() {
        };

        navigator.prototype = {

            data: {
                userID: "",
                pages: [chat_platform, login, register],
                matchedPages: []
            },

            initialize: function() {
                var _this = this;
                _this.window = window;
                _this.bindContexts();
                _this.addEventListeners();
                _this.login = document.querySelector('[data-role="login_container_global"]');
                _this.register_container = document.querySelector('[data-role="register_container_global"]');
                _this.main = document.querySelector('[data-role="main_container"]');
                _this.leftPanel = document.querySelector('[data-action="leftPanel"]');
                _this.right_panel_outer_container = document.querySelector('[data-role="right_panel_outer_container"]');
                _this.left_panel_outer_container = document.querySelector('[data-role="left_panel_outer_container"]');
                //_this.data.authorization = false;
                return _this;
            },

            bindContexts: function() {
                var _this = this;
                _this.bindedNavigate = _this.navigate.bind(_this);
            },

            addEventListeners: function() {
                var _this = this;
                window.addEventListener('popstate', _this.bindedNavigate, false);
                //chat_platform.on('addNewPanel', panel_platform.addNewPanel, {"panel_platform": panel_platform, "navigator": _this});
                chat_platform.on('addNewPanel', _this.addPanel, _this);

                panel_platform.on('clearStory', chat_platform.clearStory, chat_platform);
                panel_platform.on('addNewChat', chat_platform.addNewChat, chat_platform);
            },

            addPanel: function() {
                var _this = this;

                panel_platform.addNewPanel(_this);
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
                //_this.data.matchedPages;

                _.each(_this.data.matchedPages, function(page) {
                    if(page !== register){
                        _this.register_container.classList.add("hidden_login");
                    } else {
                        _this.left_panel_outer_container.classList.add("hide");
                        _this.right_panel_outer_container.classList.add("hide");
                    }
                    if (page !== login) {
                        _this.login.classList.add("hidden_login");
                        _this.register_container.classList.add("hidden_login");
                    } else {
                            _this.left_panel_outer_container.classList.add("hide");
                            _this.right_panel_outer_container.classList.add("hide");
                            _this.main.innerHTML = "";
                    }
                    if(!(page === login || page === register) ){
                        if(_this.data.userID === ""){
                            history.pushState(null, null, 'login');
                            _this.navigate();
                        } else {
                            page.render && page.render(_this);
                        }
                    } else {
                        page.render && page.render(_this);
                    }

                });
                if (!_this.data.matchedPages.length ) {
                    history.pushState(null, null, 'login');
                    _this.navigate();
                }
            }


        };

        return (new navigator()).initialize();
    }
);