define('panel_platform', [
        'panel',
        'overlay_core',
        'throw_event_core',
        'extend_core',
        'ping_core',
        'indexeddb',
        'users_bus',
        'popap_manager'
    ],
    function(panel,
             overlay_core,
             throw_event_core,
             extend_core,
             ping_core,
             indexeddb,
             users_bus,
             popap_manager) {

        var panel_platform = function() {
            var _this = this;


            _this.bindContexts();
        };

        panel_platform.prototype = {

            PANEL_TYPES: {
                LEFT: "left",
                RIGHT: "right"
            },

            bindContexts: function() {
                var _this = this;
                _this.bindedResizePanel = _this.throttle(_this.resizePanels.bind(_this), 300);
            },

            cashElements: function() {
                var _this = this;
                _this.left_panel_outer_container = document.querySelector('[data-role="left_panel_outer_container"]');
                _this.left_panel_inner_container = document.querySelector('[data-role="left_panel_inner_container"]');
                _this.left_filter_container = _this.left_panel_inner_container.querySelector('[data-role="left_filter_container"]');
                _this.left_go_to_container = _this.left_panel_inner_container.querySelector('[data-role="left_go_to_container"]');
                _this.left_panel_toolbar = _this.left_panel_inner_container.querySelector('[data-role="left_panel_toolbar"]');
                _this.left_pagination_container = _this.left_panel_inner_container.querySelector('[data-role="left_pagination_container"]');
                _this.left_extra_toolbar_container = _this.left_panel_inner_container.querySelector('[data-role="left_extra_toolbar_container"]');

                _this.right_panel_outer_container = document.querySelector('[data-role="right_panel_outer_container"]');
                _this.right_panel_inner_container = document.querySelector('[data-role="right_panel_inner_container"]');
                _this.right_filter_container = _this.right_panel_inner_container.querySelector('[data-role="right_filter_container"]');
                _this.right_go_to_container = _this.right_panel_inner_container.querySelector('[data-role="right_go_to_container"]');
                _this.right_panel_toolbar = _this.right_panel_inner_container.querySelector('[data-role="right_panel_toolbar"]');
                _this.right_pagination_container = _this.right_panel_inner_container.querySelector('[data-role="right_pagination_container"]');
                _this.right_extra_toolbar_container = _this.right_panel_inner_container.querySelector('[data-role="right_extra_toolbar_container"]');
            },

            unCashElements: function() {
                var _this = this;
                _this.left_panel_outer_container = null;
                _this.left_panel_inner_container = null;
                _this.left_filter_container = null;
                _this.left_go_to_container = null;
                _this.left_panel_toolbar = null;
                _this.left_pagination_container = null;
                _this.left_extra_toolbar_container = null;

                _this.right_panel_outer_container = null;
                _this.right_panel_inner_container = null;
                _this.right_filter_container = null;
                _this.right_go_to_container = null;
                _this.right_panel_toolbar = null;
                _this.right_pagination_container = null;
                _this.right_extra_toolbar_container = null;
            },

            renderPanels: function(options) {
                var _this = this;
                _this.cashElements();
                users_bus.getMyInfo(null, function(error, _options, userInfo){
                    if (error) {
                        popap_manager.renderPopap(
                            'error',
                            error,
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

                    _this.panelsDescriptions = [
                        {
                            type: _this.PANEL_TYPES.LEFT,
                            outer_container: _this.left_panel_outer_container,
                            inner_container: _this.left_panel_inner_container,
                            body_mode: panel.prototype.MODE.CREATE_CHAT,
                            filter_container: _this.left_filter_container,
                            go_to_container: _this.left_go_to_container,
                            pagination_container: _this.left_pagination_container,
                            extra_toolbar_container: _this.left_extra_toolbar_container,
                            panel_toolbar: _this.left_panel_toolbar,
                            options: userInfo[_this.PANEL_TYPES.LEFT]
                        },
                        {
                            type: _this.PANEL_TYPES.RIGHT,
                            outer_container: _this.right_panel_outer_container,
                            inner_container: _this.right_panel_inner_container,
                            body_mode: panel.prototype.MODE.USER_INFO_SHOW,
                            filter_container: _this.right_filter_container,
                            go_to_container: _this.right_go_to_container,
                            panel_toolbar: _this.right_panel_toolbar,
                            pagination_container: _this.right_pagination_container,
                            extra_toolbar_container: _this.right_extra_toolbar_container,
                            options: userInfo[_this.PANEL_TYPES.RIGHT]
                        }
                    ];
                    _this.panelsDescriptions.forEach(function(panelDescription) {
                        var _panel = new panel(panelDescription);
                        panel.prototype.panelArray.push(_panel);
                    });


                    options.panel_platform = _this;
                    panel.prototype.panelArray.forEach(function(_panel) {
                        _panel.initialization(options);
                    });
                    _this.addEventListeners();
                });
            },

            disposePanels: function() {
                var _this = this, panelDescription = {};
                _this.removeEventListeners();
                if (panel.prototype.panelArray.length){
                    panel.prototype.panelArray.forEach(function(_panel) {
                        panelDescription[_panel.type] = _panel.toPanelDescription();
                        _panel.dispose();
                    });
                    _this.savePanelStates(panelDescription);
                    panel.prototype.panelArray = [];
                }
                users_bus.setUserId(null);
            },

            savePanelStates: function(panelDescription) {
                var _this = this;

                users_bus.getMyInfo(null, function(error, options, userInfo){
                    if (error) {
                        console.error(error);
                        return;
                    }

                    _this.extend(userInfo, panelDescription);
                    users_bus.saveMyInfo(userInfo, function(err) {
                        if (err) {
                            console.error(err);
                            return;
                        }
                    });
                });
            },

            addEventListeners: function() {
                var _this = this;
                _this.removeEventListeners();
                _this.on('resize', _this.bindedResizePanel, _this);
            },

            removeEventListeners: function() {
                var _this = this;
                _this.off('resize');
            },

            resizePanels: function(){
                panel.prototype.panelArray.forEach(function(_panel) {
                    _panel.resizePanel();
                });
            },

            destroy: function() {
                var _this = this;
                _this.removeEventListeners();
                _this.unCashMainElements();
            }

        };
        extend_core.prototype.inherit(panel_platform, overlay_core);
        extend_core.prototype.inherit(panel_platform, throw_event_core);
        extend_core.prototype.inherit(panel_platform, ping_core);
        extend_core.prototype.inherit(panel_platform, extend_core);

        return new panel_platform();
    });