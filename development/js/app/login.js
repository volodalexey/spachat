define('login', [
        'overlay_core',
        'render_layout_core',
        'throw_event_core',
        'extend_core',
        //
        'users_bus',
        'indexeddb',
        'popap_manager',
        'websocket',
        //
        'text!../templates/login_template.ejs',
        'text!../templates/element/triple_element_template.ejs',
        'text!../templates/element/button_template.ejs',
        'text!../templates/element/label_template.ejs',
        'text!../templates/element/location_wrapper_template.ejs',
        'text!../templates/element/input_template.ejs',
        'text!../templates/element/select_template.ejs'
    ],
    function(
        overlay_core,
        render_layout_core,
        throw_event_core,
        extend_core,
        //
        users_bus,
        indexeddb,
        popap_manager,
        websocket,
        //
        login_template,
        triple_element_template,
        button_template,
        label_template,
        location_wrapper_template,
        input_template,
        select_template
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

            configMap: {
                "LOGIN": '/configs/login_config.json'
            },

            MODE: {
                LOGIN: 'LOGIN'
            },

            cashElements: function() {
                var _this = this;
                _this.loginForm = _this.navigator.main_container.querySelector('[data-role="loginForm"]');
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
                _this.navigator = options.navigator;
                _this.elementMap = {
                    "LOGIN": _this.navigator.main_container
                };
                _this.body_mode = _this.MODE.LOGIN;
                var language  = localStorage.getItem('language');
                if (language && window.localization !== language) {
                    window.localization = language;
                }
                _this.renderLayout(null, function() {
                    _this.cashElements();
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
                    indexeddb.getGlobalUserCredentials(userName, userPassword, function(err, userCredentials) {
                        _this.toggleWaiter();
                        if (err) {
                            popap_manager.renderPopap(
                                'error',
                                {message: err},
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

                        if (userCredentials) {
                            users_bus.setUserId(userCredentials.user_id);
                            websocket.createAndListen();
                            history.pushState(null, null, 'chat');
                            _this.navigator.navigate();
                        } else {
                            users_bus.setUserId(null);
                            //_this.loginForm.reset();
                            popap_manager.renderPopap(
                                'error',
                                {message: 87},
                                function(action) {
                                    switch (action) {
                                        case 'confirmCancel':
                                            popap_manager.onClose();
                                            break;
                                    }
                                }
                            );
                        }
                    });
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
        extend_core.prototype.inherit(login, render_layout_core);

        login.prototype.login_template = login.prototype.template(login_template);
        login.prototype.triple_element_template = login.prototype.template(triple_element_template);
        login.prototype.button_template = login.prototype.template(button_template);
        login.prototype.label_template = login.prototype.template(label_template);
        login.prototype.location_wrapper_template = login.prototype.template(location_wrapper_template);
        login.prototype.input_template = login.prototype.template(input_template);
        login.prototype.select_template = login.prototype.template(select_template);

        login.prototype.dataMap = {
            "LOGIN": ''
        };

        login.prototype.templateMap = {
            "LOGIN": login.prototype.login_template
        };

        login.prototype.configHandlerMap = {
            "LOGIN": login.prototype.prepareConfig
        };
        login.prototype.configHandlerContextMap = {};
        login.prototype.dataHandlerMap = {
            "LOGIN": ''
        };
        login.prototype.dataHandlerContextMap = {
            "LOGIN": null
        };

        return new login();

    }
);