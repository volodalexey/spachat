define('login', [
        'overlay_core',
        'event_core',

        'indexeddb'
    ],
    function(overlay_core,
             event_core,

             indexeddb) {

        /**
         * login constructor
         * login layout is always visible, if it is hidden it has absolute 1px x 1px size for browser auto add user name and user password
         * if it is visible => cash all elements in initialization
         */
        var login = function() {
            this.link = /login/; // is used for navigator
            this.login_outer_container = document.querySelector('[data-role="login_outer_container"]');
            this.loginForm = this.login_outer_container.querySelector('[data-role="loginForm"]');
            this.redirectToRegisterElement = this.loginForm.querySelector('[data-action="clickRedirectToRegister"]');
            this.collectionDescription = {
                "db_name": 'authentication',
                "table_name": 'authentication',
                "db_version": 1,
                "keyPath": "userId"
            };
            this.bindContexts();
        };

        login.prototype = {

            render: function(options) {
                if (!options || !options.navigator) {
                    console.error(new Error('Invalid input options for render'));
                    return;
                }
                var _this = this;
                _this.navigator = options.navigator;
                _this.login_outer_container.classList.remove("hidden");
                _this.addEventListeners();
                _this.toggleWaiter();
            },

            bindContexts: function() {
                var _this = this;
                _this.bindedOnSubmit = _this.onSubmit.bind(_this);
                _this.bindedRedirectToRegister = _this.redirectToRegister.bind(_this);
            },

            addRemoveListener: function(element, eventName, listener, phase) {
                if (!element || !listener || !eventName) {
                    return;
                }
                if (this.addRemoveListener.caller === this.addEventListeners) {
                    element.addEventListener(eventName, listener, phase);
                } else if (this.addRemoveListener.caller === this.removeEventListeners) {
                    element.removeEventListener(eventName, listener, phase);
                }
            },

            addEventListeners: function() {
                var _this = this;
                _this.removeEventListeners();
                _this.addRemoveListener(_this.loginForm, 'submit', _this.bindedOnSubmit, false);
                _this.addRemoveListener(_this.redirectToRegisterElement, 'click', _this.bindedRedirectToRegister, false);
            },

            removeEventListeners: function() {
                var _this = this;
                _this.addRemoveListener(_this.loginForm, 'submit', _this.bindedOnSubmit, false);
                _this.addRemoveListener(_this.redirectToRegisterElement, 'click', _this.bindedRedirectToRegister, false);
            },

            onSubmit: function(event) {
                var _this = this;
                event.preventDefault();
                var userName = _this.loginForm.elements.userName.value;
                var userPassword = _this.loginForm.elements.userPassword.value;
                if (userName && userPassword) {
                    _this.toggleWaiter(true);
                    indexeddb.getAll(_this.collectionDescription, function(getAllErr, users) {
                        _this.toggleWaiter();
                        if (getAllErr) {
                            console.error(getAllErr);
                            return;
                        }

                        var user;
                        users.every(function(_user) {
                            if (_user.userName === userName && _user.userPassword === userPassword) {
                                user = _user;
                            }
                            return !_user;
                        });

                        if (user) {
                            _this.navigator.userId = user.userId;
                            history.pushState(null, null, 'chat');
                            _this.navigator.navigate();
                        } else {
                            _this.navigator.userId = null;
                            _this.loginForm.elements.userName.value = "";
                            _this.loginForm.elements.userPassword.value = "";
                            console.error(new Error('User with such username or password not found!'));
                        }
                    });
                }
            },

            redirectToRegister: function() {
                var _this = this;
                history.pushState(null, null, 'register');
                _this.navigator.navigate();
            }
        };

        extend(login, overlay_core);
        extend(login, event_core);

        return new login();

    }
);