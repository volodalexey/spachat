define('register', [
        'overlay_core',
        'event_core',

        'indexeddb'
    ],
    function(overlay_core,
             event_core,
             indexeddb) {

        var register = function() {
        };

        register.prototype = {

            link: 'register',

            initialize: function() {
                var _this = this;
                _this.register_container = document.querySelector('[data-role="register_container_global"]');
                _this.login_container = document.querySelector('[data-role="login_container_global"]');
                _this.form = _this.register_container.querySelector('form');
                _this.register = _this.form.querySelector('[data-action="register"]');
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
                _this.register_container.classList.remove("hidden_login");
                _this.addEventListeners();
                _this.toggleWaiter(true);
            },

            bindContexts: function() {
                var _this = this;
                _this.bindedToRegister = _this.toRegister.bind(_this);
            },

            addEventListeners: function() {
                var _this = this;
                _this.removeEventListeners();
                if(_this.register){
                    _this.register.addEventListener('click', _this.bindedToRegister, false);
                }
            },

            removeEventListeners: function() {
                var _this = this;
                if(_this.register){
                    _this.register.removeEventListener('click', _this.bindedToRegister, false);
                }
            },

            toRegister: function(){
                var _this = this;
                event.preventDefault();
                _this.userName = _this.form.elements.user_name.value;
                _this.password = _this.form.elements.password_new.value;
                _this.password_confirm = _this.form.elements.password_confirm.value;
                if(_this.userName !== "" && _this.password !== "" && _this.password_confirm !== ""){
                    if(_this.password === _this.password_confirm){
                        _this.registerNewUser(function() {
                            _this.navigatorData.userID =_this.account.userId;
                            history.pushState(null, null, 'chat');
                            _this.navigator.navigate();

                        });
                    } else {
                        _this.navigatorData.userID = "";
                        _this.form.elements.password_new.value = "";
                        _this.form.elements.password_confirm.value = "";
                    }
                }
            },

            registerNewUser: function(callback){
                var _this = this;
                _this.account = {
                    userId: _this.renderID(),
                    userPassword: _this.form.elements.password_new.value,
                    userName: _this.form.elements.user_name.value
                };
                _this.indexeddb.addOrUpdateAll(
                    _this.data.collection,
                    [
                        _this.account
                    ],
                    function(error) {
                        if (error) {
                            console.error(error);
                            return;
                        }
                        console.log("account", _this.account);
                        callback();
                    }
                );
            },


            renderID: function() {
                function s4() {
                    return Math.floor((1 + Math.random()) * 0x10000)
                        .toString(16)
                        .substring(1);
                }
                return s4() + s4() + '-' + s4() + '-' + s4() + '-' +
                    s4() + '-' + s4() + s4() + s4();
            }
        };

        extend(register, overlay_core);
        extend(register, event_core);

        return (new register()).initialize();

    }
);