define('login', [
        'overlay_core',
        'event_core',

        'indexeddb'
    ],
    function(overlay_core,
             event_core,
             indexeddb) {

        var login = function() {
        };

        login.prototype = {

            link: 'login',

            initialize: function() {
                var _this = this;
                _this.login_container = document.querySelector('[data-role="login_container_global"]');
                _this.form = _this.login_container.querySelector('form');
                _this.submit = _this.form.querySelector('[data-action="submit"]');
                _this.register = _this.form.querySelector('[data-action="register_user"]');
                _this.data = {
                    collection: {
                        "id": 1,
                        "db_name": 'authentification',
                        "table_name": 'authentification',
                        "db_version": 2,
                        "keyPath": "userId"
                    }
                };
                _this.indexeddb = new indexeddb().initialize();
                _this.bindContexts();
                return _this;
            },

            render: function(navigator) {
                var _this = this;
                _this.navigator = navigator;
                _this.navigatorData = _this.navigator.data;
                _this.login_container.classList.remove("hidden_login");
                _this.addEventListeners();
                _this.toggleWaiter(true);
            },

            bindContexts: function() {
                var _this = this;
                _this.bindedOnSubmit = _this.onSubmit.bind(_this);
                _this.bindedOnRegister = _this.onRegister.bind(_this);
            },

            addEventListeners: function() {
                var _this = this;
                _this.removeEventListeners();
                if (_this.submit) {
                    _this.submit.addEventListener('click', _this.bindedOnSubmit, false);
                }
                if (_this.register) {
                    _this.register.addEventListener('click', _this.bindedOnRegister, false);
                }
            },

            removeEventListeners: function() {
                var _this = this;
                _this.submit.removeEventListener('click', _this.bindedOnSubmit, false);
                _this.register.removeEventListener('click', _this.bindedOnRegister, false);
            },

            onSubmit: function(event) {
                var _this = this;
                event.preventDefault();
                _this.userName = _this.form.elements.userId.value;
                _this.password = _this.form.elements.password.value;
                if (_this.userName !== "" && _this.password !== "") {
                    _this.indexeddb.getAll(_this.data.collection, function(getAllErr, users) {
                        if (getAllErr) {
                            console.error(getAllErr);
                        } else {
                            var user = _.findWhere(users, {"userName": _this.userName, "userPassword": _this.password});
                            if (!user) {
                                _this.navigatorData.userID = "";
                                _this.form.elements.password.value = "";
                                history.pushState(null, null, 'login');
                                _this.navigator.navigate();
                            } else {
                                _this.navigatorData.userID = user.userId;
                                history.pushState(null, null, 'chat');
                                _this.navigator.navigate();
                            }
                        }
                    });
                }
            },

            onRegister: function() {
                event.preventDefault();
                history.pushState(null, null, 'register');
                window.history.go(0);
            }
        };

        extend(login, overlay_core);
        extend(login, event_core);

        return (new login()).initialize();

    }
);