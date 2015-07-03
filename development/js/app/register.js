define('register', [
        'overlay_core',
        'event_core',
        'template_core',
        'id_core',

        'indexeddb',

        'text!../templates/register_template.ejs'
    ],
    function(overlay_core,
             event_core,
             template_core,
             id_core,

             indexeddb,

             register_template) {

        /**
         * register constructor
         */
        var register = function() {
            this.link = /register/; // is used for navigator
            this.collectionDescription = {
                "db_name": 'authentication',
                "table_names": ['authentication'],
                "db_version": 1,
                "keyPath": "userId"
            };
            this.bindContexts();
            this.register_template = this.template(register_template);
        };

        register.prototype = {

            cashMainElements: function() {
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
                _this.cashMainElements();
                _this.addEventListeners();
                _this.toggleWaiter();
            },

            dispose: function() {
                var _this = this;
                _this.removeEventListeners();
            },

            bindContexts: function() {
                var _this = this;
                _this.bindedRegisterWorkflow = _this.registerWorkflow.bind(_this);
            },

            addEventListeners: function() {
                var _this = this;
                _this.removeEventListeners();
                _this.addRemoveListener('add', _this.registerForm, 'submit', _this.bindedRegisterWorkflow, false);
                _this.addRemoveListener('add', _this.redirectToLogin, 'click', _this.navigator.bindedRedirectToLogin, false);
            },

            removeEventListeners: function() {
                var _this = this;
                _this.addRemoveListener('remove', _this.registerForm, 'submit', _this.bindedRegisterWorkflow, false);
                _this.addRemoveListener('remove', _this.redirectToLogin, 'click', _this.navigator.bindedRedirectToLogin, false);
            },

            registerWorkflow: function(event){
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
                            function(regErr, account) {
                                if (regErr) {
                                    _this.toggleWaiter();
                                    console.error(regErr);
                                    return;
                                }
                                
                                _this.navigator.userId = account.userId;
                                history.pushState(null, null, 'chat');
                                _this.navigator.navigate();
                            }
                        );
                    } else {
                        _this.navigator.userId = null;
                        _this.registerForm.reset();
                        console.error(new Error('Passwords don\'t match!'));
                    }
                }
            },

            registerNewUser: function(options, callback){
                var _this = this;
                indexeddb.getAll(_this.collectionDescription, null, function(getAllErr, users) {
                    if (getAllErr) {
                        callback(getAllErr);
                        return;
                    }
                    
                    var user;
                    users.every(function(_user) {
                        if (_user.userName === options.userName) {
                            user = _user;
                        }
                        return !user;
                    });

                    if (user) {
                        callback(new Error('User with such username is already exist!'));
                        return;
                    }

                    var account = {
                        userId: _this.generateId(),
                        userName: options.userName,
                        userPassword: options.userPassword
                    };

                    indexeddb.addOrUpdateAll(
                        _this.collectionDescription,
                        null,
                        [
                            account
                        ],
                        function(error) {
                            if (error) {
                                callback(error);
                                return;
                            }
                            
                            callback(null, account);
                        }
                    );
                });
            }
        };

        extend(register, overlay_core);
        extend(register, event_core);
        extend(register, template_core);
        extend(register, id_core);

        return new register();

    }
);