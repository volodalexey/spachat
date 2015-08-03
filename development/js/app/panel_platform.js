define('panel_platform', [
        'panel',
        'overlay_core',
        'throw_event_core',
        'extend_core',
        'ping_core'
    ],
    function(panel,
             overlay_core,
             throw_event_core,
             extend_core,
             ping_core) {

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
                this.panelsDescriptions = [
                    {
                        type: this.PANEL_TYPES.LEFT,
                        outer_container: _this.left_panel_outer_container,
                        inner_container: _this.left_panel_inner_container,
                        panel_platform: this,
                        body_mode: panel.prototype.MODE.CREATE_CHAT,
                        filter_container: _this.left_filter_container,
                        go_to_container: _this.left_go_to_container,
                        pagination_container: _this.left_pagination_container,
                        extra_toolbar_container: _this.left_extra_toolbar_container,
                        panel_toolbar: _this.left_panel_toolbar
                    },
                    {
                        type: this.PANEL_TYPES.RIGHT,
                        outer_container: _this.right_panel_outer_container,
                        inner_container: _this.right_panel_inner_container,
                        panel_platform: this,
                        body_mode: panel.prototype.MODE.USER_INFO_SHOW,
                        filter_container: _this.right_filter_container,
                        go_to_container: _this.right_go_to_container,
                        panel_toolbar: _this.right_panel_toolbar,
                        pagination_container: _this.right_pagination_container,
                        extra_toolbar_container: _this.right_extra_toolbar_container
                    }
                ];
                this.panelsDescriptions.forEach(function(panelDescription) {
                    var _panel = new panel(panelDescription);
                    panel.prototype.panelArray.push(_panel);
                });


                options.panel_platform = this;
                panel.prototype.panelArray.forEach(function(_panel) {
                    _panel.initialization(options);
                });
                this.addEventListeners();
            },

            disposePanels: function() {
                var _this = this;
                _this.removeEventListeners();
                panel.prototype.panelArray.forEach(function(_panel) {
                    _panel.dispose();
                });
                panel.prototype.panelArray = [];
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
                var _this = this;
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

        return new panel_platform();
    });