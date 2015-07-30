define('register', [
        'overlay_core',
        'throw_event_core',
        'template_core',
        'ajax_core',

        'id_core',
        'users_bus',

        'indexeddb',

        'text!../templates/register_template.ejs',
        'text!../templates/element/triple_element_template.ejs',
        'text!../templates/element/button_template.ejs',
        'text!../templates/element/label_template.ejs'
    ],
    function(overlay_core,
             throw_event_core,
             template_core,
             ajax_core,

             id_core,
             users_bus,

             indexeddb,

             register_template,
             triple_element_template,
             button_template,
             label_template) {

        /**
         * register constructor
         */
        var register = function() {
            this.link = /register/; // is used for navigator
            this.bindContexts();
            this.register_template = this.template(register_template);
            this.triple_element_template = this.template(triple_element_template);
            this.button_template = this.template(button_template);
            this.label_template = this.template(label_template);
        };

        register.prototype = {

            cashMainElements: function() {
                var _this = this;
                _this.registerForm = _this.navigator.main_container.querySelector('[data-role="registerForm"]');
                _this.redirectToLogin = _this.registerForm.querySelector('[data-action="redirectToLogin"]');
            },

            unCashMainElements: function() {
                var _this = this;
                _this.registerForm = null;
                _this.redirectToLogin = null;
            },

            render: function(options) {
                if (!options || !options.navigator || !options.navigator.main_container) {
                    console.error(new Error('Invalid input options for render'));
                    return;
                }
                var _this = this;
                _this.navigator = options.navigator;
                _this.sendRequest('/configs/register_config.json', function(err, res) {
                    if (err) {
                        console.error(err);
                        return;
                    }
                    var registe_config = JSON.parse(res);
                    _this.getDescriptionIcon(null, null, null, function(res){
                        _this.navigator.main_container.innerHTML = _this.register_template({
                            config: registe_config,
                            icon_config: [{svg: res, name: 'description_icon'}],
                            triple_element_template: _this.triple_element_template,
                            button_template: _this.button_template,
                            label_template: _this.label_template
                        });
                        _this.cashMainElements();
                        _this.addEventListeners();
                        _this.toggleWaiter();
                    });
                });

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

            registerWorkflow: function(event) {
                var _this = this;
                event.preventDefault();
                var userName = _this.registerForm.elements.userName.value;
                var userPassword = _this.registerForm.elements.userPassword.value;
                var userPasswordConfirm = _this.registerForm.elements.userPasswordConfirm.value;
                if (userName && userPassword && userPasswordConfirm) {
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

                                users_bus.setUserId(account.userId);
                                history.pushState(null, null, 'chat');
                                _this.navigator.navigate();
                            }
                        );
                    } else {
                        users_bus.setUserId(null);
                        _this.registerForm.reset();
                        console.error(new Error('Passwords don\'t match!'));
                    }
                }
            },

            registerNewUser: function(options, callback) {
                var _this = this;
                indexeddb.getAll(users_bus.collectionDescription, null, function(getAllErr, allUsers) {
                    if (getAllErr) {
                        callback(getAllErr);
                        return;
                    }

                    var user;
                    allUsers.every(function(_user) {
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
                        userPassword: options.userPassword,
                        userIds: ["44c6c9d7-974d-489d-4b16-5b6e71ec4ed9c8921f",
                            "2700d577-4ddc-d742-9fc7-4cbaffe14ed9c965e5"
                        ],
                        chatsIds: []
                    };

                    indexeddb.addOrUpdateAll(
                        users_bus.collectionDescription,
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
            },

            destroy: function() {
                var _this = this;
                _this.removeEventListeners();
                _this.unCashMainElements();
            }
        };

        extend(register, overlay_core);
        extend(register, throw_event_core);
        extend(register, template_core);
        extend(register, id_core);
        extend(register, ajax_core);

        return new register();

    }
);