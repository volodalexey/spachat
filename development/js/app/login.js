define('login', [
        'overlay_core',
        'event_core',

        'indexeddb'
    ],
    function(overlay_core,
             event_core,

             indexeddb
    ) {

        var login = function() {
        };

        login.prototype = {

            link: 'login',

            initialize: function() {
                var _this = this;
                _this.login_container = document.querySelector('[data-role="login_container_global"]');
                _this.main_container = document.querySelector('[data-role="main_container"]');
                _this.submit = _this.login_container.querySelector('[data-action="submit"]');
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
                return _this;
            },

            render: function() {
                var _this = this;
                _this.login_container.classList.remove("hidden_login");
                _this.addEventListeners();
                _this.toggleWaiter(true);
            },

            addEventListeners: function() {
                var _this = this;
                _this.removeEventListeners();
                _this.submit.addEventListener('click', _this.onSubmit.bind(_this), false);
            },

            removeEventListeners: function() {
                var _this = this;
                _this.submit.removeEventListener('click', _this.onSubmit.bind(_this), false);
            },

            onSubmit: function(event) {
                var _this = this;
                event.preventDefault();

                console.log("onSubmit");
                _this.authentification(function() {
                    history.pushState({"name": "chat"}, null, 'chat');
                    window.history.go(0);
                });

            },

            authentification: function(callback){
                var _this = this, account;
                _this.form = _this.login_container.querySelector('form');

                account = {
                    userId: _this.form.elements.userId.value,
                    password: _this.form.elements.password.value
                };

                _this.indexeddb.addOrUpdateAll(
                    _this.data.collection,
                    [
                        account
                    ],
                    function(error) {
                        if (error) {
                            console.error(error);

                            return;
                        }
                        console.log("account", account);
                        callback();
                    }
                );


                console.log(_this.form.elements.userId.value);

                console.log(_this.form.elements.password.value);

            }
        };

        extend(login, overlay_core);
        extend(login, event_core);

        return (new login()).initialize();

    }
);