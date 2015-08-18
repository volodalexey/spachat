define('login', [
        'overlay_core',
        'throw_event_core',
        'extend_core',
        //
        'users_bus',
        'indexeddb',
        'websocket'
    ],
    function(
        overlay_core,
        throw_event_core,
        extend_core,
        //
        users_bus,
        indexeddb,
        websocket
    ) {

        /**
         * login constructor
         * login layout is always visible, if it is hidden it has absolute 1px x 1px size for browser auto add user name and user password
         * if it is visible => cash all elements in initialization
         */
        var login = function() {
            this.link = /login/; // is used for navigator

            this.bindContexts();
        };

        login.prototype = {

            cashElements: function() {
                var _this = this;
                _this.login_outer_container = document.querySelector('[data-role="login_outer_container"]');
                _this.loginForm = _this.login_outer_container.querySelector('[data-role="loginForm"]');
                _this.redirectToRegisterElement = _this.loginForm.querySelector('[data-action="clickRedirectToRegister"]');
            },

            unCashElements: function() {
                var _this = this;
                _this.login_outer_container = null;
                _this.loginForm = null;
                _this.redirectToRegisterElement = null;
            },

            render: function(options) {
                if (!options || !options.navigator) {
                    console.error(new Error('Invalid input options for render'));
                    return;
                }
                var _this = this;
                _this.cashElements();
                _this.navigator = options.navigator;
                _this.login_outer_container.classList.remove("hidden");
                _this.addEventListeners();
                _this.toggleWaiter();
            },

            dispose: function() {
                var _this = this;
                _this.removeEventListeners();
            },

            bindContexts: function() {
                var _this = this;
                _this.bindedOnSubmit = _this.onSubmit.bind(_this);
                _this.bindedRedirectToRegister = _this.redirectToRegister.bind(_this);
            },

            addEventListeners: function() {
                var _this = this;
                _this.removeEventListeners();
                _this.addRemoveListener('add', _this.loginForm, 'submit', _this.bindedOnSubmit, false);
                _this.addRemoveListener('add', _this.redirectToRegisterElement, 'click', _this.bindedRedirectToRegister, false);
            },

            removeEventListeners: function() {
                var _this = this;
                _this.addRemoveListener('remove', _this.loginForm, 'submit', _this.bindedOnSubmit, false);
                _this.addRemoveListener('remove', _this.redirectToRegisterElement, 'click', _this.bindedRedirectToRegister, false);
            },

            onSubmit: function(event) {
                var _this = this;
                event.preventDefault();
                var userName = _this.loginForm.elements.userName.value;
                var userPassword = _this.loginForm.elements.userPassword.value;
                if (userName && userPassword) {
                    _this.toggleWaiter(true);
                    indexeddb.getAll(users_bus.collectionDescription, null,  function(getAllErr, users) {
                        _this.toggleWaiter();
                        if (getAllErr) {
                            alert(getAllErr);
                            return;
                        }

                        var user;
                        users.every(function(_user) {
                            if (_user.userName === userName && _user.userPassword === userPassword) {
                                user = _user;
                            }
                            return !user;
                        });

                        if (user) {
                            users_bus.setUserId(user.user_id);
                            websocket.createAndListen();
                            history.pushState(null, null, 'chat');
                            _this.navigator.navigate();
                        } else {
                            users_bus.setUserId(null);
                            _this.loginForm.reset();
                            alert(new Error('User with such username or password not found!'));
                        }
                    });
                }
            },

            redirectToRegister: function() {
                var _this = this;
                history.pushState(null, null, 'register');
                _this.navigator.navigate();
            },

            destroy: function() {
                var _this = this;
                _this.removeEventListeners();
                _this.unCashElements();
            }
        };

        extend_core.prototype.inherit(login, overlay_core);
        extend_core.prototype.inherit(login, throw_event_core);

        return new login();

    }
);