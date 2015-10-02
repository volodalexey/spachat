define('register', [
        'overlay_core',
        'throw_event_core',
        'template_core',
        'ajax_core',
        'extend_core',
        'render_layout_core',
        //
        'id_core',
        'users_bus',
        'websocket',
        'indexeddb',
        'popap_manager',
        //
        'text!../templates/register_template.ejs',
        'text!../templates/element/triple_element_template.ejs',
        'text!../templates/element/button_template.ejs',
        'text!../templates/element/label_template.ejs',
        'text!../templates/element/location_wrapper_template.ejs',
        'text!../templates/element/input_template.ejs',
        'text!../templates/element/select_template.ejs',
        //
        'text!../configs/register_config.json'
    ],
    function(overlay_core,
             throw_event_core,
             template_core,
             ajax_core,
             extend_core,
             render_layout_core,
            //
             id_core,
             users_bus,
             websocket,
             indexeddb,
             popap_manager,
            //
             register_template,
             triple_element_template,
             button_template,
             label_template,
             location_wrapper_template,
             input_template,
             select_template,
             //
             register_config) {

        /**
         * register constructor
         */
        var register = function() {
            this.link = /\/register/; // is used for navigator
            this.bindContexts();
        };

        register.prototype = {

            register_config: JSON.parse(register_config),

            MODE: {
                REGISTER: 'REGISTER'
            },

            cashMainElements: function() {
                var _this = this;
                _this.registerForm = _this.navigator.main_container.querySelector('[data-role="registerForm"]');
                _this.redirectToLoginElement = _this.registerForm.querySelector('[data-action="redirectToLogin"]');
            },

            unCashMainElements: function() {
                var _this = this;
                _this.registerForm = null;
                _this.redirectToLoginElement = null;
            },

            render: function(options) {
                if (!options || !options.navigator || !options.navigator.main_container) {
                    popap_manager.renderPopap(
                        'error',
                        {message: 92},
                        function(action) {
                            switch (action) {
                                case 'confirmCancel':
                                    popap_manager.onClose();
                                    break;
                            }
                        }
                    );
                    return;
                }
                var _this = this;
                _this.navigator = options.navigator;
                _this.elementMap = {
                    "REGISTER": _this.navigator.main_container
                };
                _this.body_mode = _this.MODE.REGISTER;
                _this.renderLayout(null, function() {
                    _this.cashMainElements();
                    _this.addEventListeners();
                    _this.toggleWaiter();
                });
            },

            dispose: function() {
                var _this = this;
                _this.removeEventListeners();
            },

            bindContexts: function() {
                var _this = this;
                _this.bindedRegisterWorkflow = _this.registerWorkflow.bind(_this);
                _this.bindedRedirectToLogin = _this.redirectToLogin.bind(_this);
            },

            addEventListeners: function() {
                var _this = this;
                _this.removeEventListeners();
                _this.addRemoveListener('add', _this.registerForm, 'submit', _this.bindedRegisterWorkflow, false);
                _this.addRemoveListener('add', _this.redirectToLoginElement, 'click', _this.bindedRedirectToLogin, false);
            },

            removeEventListeners: function() {
                var _this = this;
                _this.addRemoveListener('remove', _this.registerForm, 'submit', _this.bindedRegisterWorkflow, false);
                _this.addRemoveListener('remove', _this.redirectToLoginElement, 'click', _this.bindedRedirectToLogin, false);
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
                                _this.toggleWaiter();
                                if (regErr) {
                                    popap_manager.renderPopap(
                                        'error',
                                        {message: regErr},
                                        function(action) {
                                            switch (action) {
                                                case 'confirmCancel':
                                                    popap_manager.onClose();
                                                    break;
                                            }
                                        }
                                    );
                                    return;
                                }

                                popap_manager.renderPopap(
                                    'success',
                                    {message: 96},
                                    function(action) {
                                        switch (action) {
                                            case 'confirmCancel':
                                                popap_manager.onClose();
                                                _this.redirectToLogin();
                                                break;
                                        }
                                    }
                                );
                            }
                        );
                    } else {
                        users_bus.setUserId(null);
                        _this.registerForm.reset();
                        popap_manager.renderPopap(
                            'error',
                            {message: 91},
                            function(action) {
                                switch (action) {
                                    case 'confirmCancel':
                                        popap_manager.onClose();
                                        break;
                                }
                            }
                        );
                    }
                } else {
                    popap_manager.renderPopap(
                        'error',
                        {message: 88},
                        function(action) {
                            switch (action) {
                                case 'confirmCancel':
                                    popap_manager.onClose();
                                    break;
                            }
                        }
                    );
                }
            },

            registerNewUser: function(options, callback) {
                var _this = this;
                _this.get_JSON_res('/api/uuid', function(err, res) {
                    if (err) {
                        callback(err);
                        return;
                    }

                    users_bus.storeNewUser(
                        res.uuid,
                        options.userName,
                        options.userPassword,
                        function(err, account) {
                            if (err) {
                                callback(err);
                                return;
                            }

                            // successful register
                            callback(null, account);
                        }
                    );
                });
            },

            redirectToLogin: function() {
                var _this = this;
                _this.registerForm.reset();
                history.pushState(null, null, 'login');
                _this.navigator.navigate();
            },

            destroy: function() {
                var _this = this;
                _this.removeEventListeners();
                _this.unCashMainElements();
            }
        };

        extend_core.prototype.inherit(register, overlay_core);
        extend_core.prototype.inherit(register, throw_event_core);
        extend_core.prototype.inherit(register, template_core);
        extend_core.prototype.inherit(register, id_core);
        extend_core.prototype.inherit(register, ajax_core);
        extend_core.prototype.inherit(register, render_layout_core);

        register.prototype.register_template = register.prototype.template(register_template);
        register.prototype.triple_element_template = register.prototype.template(triple_element_template);
        register.prototype.button_template = register.prototype.template(button_template);
        register.prototype.label_template = register.prototype.template(label_template);
        register.prototype.location_wrapper_template = register.prototype.template(location_wrapper_template);
        register.prototype.input_template = register.prototype.template(input_template);
        register.prototype.select_template = register.prototype.template(select_template);

        register.prototype.configMap = {
            "REGISTER": register.prototype.register_config
        };

        register.prototype.dataMap = {
            "REGISTER": ''
        };

        register.prototype.templateMap = {
            "REGISTER": register.prototype.register_template
        };

        register.prototype.configHandlerMap = {
            "REGISTER": register.prototype.prepareConfig
        };
        register.prototype.configHandlerContextMap = {};
        register.prototype.dataHandlerMap = {
            "REGISTER": ''
        };
        register.prototype.dataHandlerContextMap = {
            "REGISTER": null
        };


        return new register();

    }
);