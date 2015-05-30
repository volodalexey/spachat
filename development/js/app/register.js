define('register', [
        'overlay_core',
        'event_core',
        'template_core',

        'indexeddb',

        'text!../html/register_template.html'
    ],
    function(overlay_core,
             event_core,
             template_core,

             indexeddb,

             register_template) {

        /**
         * register constructor
         */
        var register = function() {
            this.link = /register/; // is used for navigator
            this.collectionDescription = {
                "db_name": 'authentication',
                "table_name": 'authentication',
                "db_version": 1,
                "keyPath": "userId"
            };
            this.bindContexts();
            this.register_template = this.template(register_template);
        };

        register.prototype = {

            cashElements: function() {
                var _this = this;
                _this.registerForm = _this.navigator.main_container.querySelector('[data-role="registerForm"]');
                _this.redirectToLogin = _this.registerForm.querySelector('[data-action="redirectToLogin"]');
            },

            render: function(options) {
                if (!options || !options.navigator || !options.navigator.main_container) {
                    console.error(new Error('Invalid input options for render'));
                    return;
                }
                var _this = this;
                _this.navigator = options.navigator;
                _this.navigator.main_container.innerHTML = _this.register_template();
                _this.cashElements();
                _this.addEventListeners();
                _this.toggleWaiter();
            },

            bindContexts: function() {
                var _this = this;
                _this.bindedRegisterWorkflow = _this.registerWorkflow.bind(_this);
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
                _this.addRemoveListener(_this.registerForm, 'submit', _this.bindedRegisterWorkflow, false);
                _this.addRemoveListener(_this.redirectToLogin, 'click', _this.navigator.bindedRedirectToLogin, false);
            },

            removeEventListeners: function() {
                var _this = this;
                _this.addRemoveListener(_this.registerForm, 'submit', _this.bindedRegisterWorkflow, false);
                _this.addRemoveListener(_this.redirectToLogin, 'click', _this.navigator.bindedRedirectToLogin, false);
            },

            registerWorkflow: function(){
                var _this = this;
                event.preventDefault();
                var userName = _this.registerForm.elements.userName.value;
                var userPassword = _this.registerForm.elements.userPassword.value;
                var userPasswordConfirm = _this.registerForm.elements.userPasswordConfirm.value;
                if(userName && userPassword && userPasswordConfirm){
                    if (userPassword === userPasswordConfirm) {
                        _this.toggleWaiter(true);
                        _this.registerNewUser(
                            {
                                userName: userName,
                                userPassword: userPassword
                            },
                            function(regErr) {
                                if (regErr) {
                                    _this.toggleWaiter();
                                    console.error(regErr);
                                    return;
                                }
                                
                                _this.navigatorData.userId =_this.account.userId;
                                history.pushState(null, null, 'chat');
                                _this.navigator.navigate();
                            }
                        );
                    } else {
                        _this.navigator.userId = null;
                        _this.registerForm.elements.userPassword.value = "";
                        _this.registerForm.elements.userPasswordConfirm.value = "";
                        console.error(new Error('Passwords don\'t match!'));
                    }
                }
            },

            registerNewUser: function(options, callback){
                var _this = this;
                indexeddb.getAll(_this.collectionDescription, function(getAllErr, users) {
                    if (getAllErr) {
                        callback(getAllErr);
                        return;
                    }
                    
                    var user;
                    users.every(function(_user) {
                        if (_user.userName === options.userName) {
                            user = _user;
                        }
                        return !_user;
                    });

                    if (user) {
                        callback(new Error('User with such username is already exist!'));
                        return;
                    }

                    var account = {
                        userId: _this.generateId(),
                        userName: _this.form.elements.userName.value,
                        userPassword: _this.form.elements.userPassword.value
                    };

                    indexeddb.addOrUpdateAll(
                        _this.collectionDescription,
                        [
                            account
                        ],
                        function(error) {
                            if (error) {
                                callback(error);
                                return;
                            }
                            
                            callback(account);
                        }
                    );
                });
            },

            s4: function() {
                return Math.floor((1 + Math.random()) * 0x10000).toString(16).substring(1);
            },

            generateId: function() {
                return this.s4() + this.s4() + '-' + this.s4() + '-' + this.s4() + '-' +
                    this.s4() + '-' + this.s4() + this.s4() + this.s4();
            }
        };

        extend(register, overlay_core);
        extend(register, event_core);
        extend(register, template_core);

        return new register();

    }
);