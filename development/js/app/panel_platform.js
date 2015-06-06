define('panel_platform', [
        'panel',
        'overlay_core',
        'event_core',
        'ping_core'
    ],
    function(panel,
             overlay_core,
             event_core,
             ping_core) {

        var panel_platform = function() {
            var _this = this;
            _this.left_panel_outer_container = document.querySelector('[data-role="left_panel_outer_container"]');
            _this.right_panel_outer_container = document.querySelector('[data-role="right_panel_outer_container"]');
            _this.left_panel_inner_container = document.querySelector('[data-role="left_panel_inner_container"]');
            _this.right_panel_inner_container = document.querySelector('[data-role="right_panel_inner_container"]');
            this.panelsDescriptions = [
                {
                    type: this.PANEL_TYPES.LEFT,
                    outer_container: _this.left_panel_outer_container,
                    inner_container: _this.left_panel_inner_container,
                    panel_platform: this,
                    body_mode: panel.prototype.MODE.CREATE_CHAT
                },
                {
                    type: this.PANEL_TYPES.RIGHT,
                    outer_container: _this.right_panel_outer_container,
                    inner_container: _this.right_panel_inner_container,
                    panel_platform: this,
                    body_mode: panel.prototype.MODE.USER_INFO_SHOW
                }
            ];
            this.panelsDescriptions.forEach(function(panelDescription) {
                var _panel = new panel(panelDescription);
                panel.prototype.panelArray.push(_panel);
            });
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

            renderPanels: function(options) {
                options.panel_platform = this;
                panel.prototype.panelArray.forEach(function(_panel) {
                    _panel.render(options);
                });
                this.addEventListeners();
            },

            disposePanels: function() {
                var _this = this;
                _this.removeEventListeners();
                panel.prototype.panelArray.forEach(function(_panel) {
                    _panel.dispose();
                });
            },

            addEventListeners: function() {
                var _this = this;
                _this.removeEventListeners();
                _this.on('resize', _this.bindedResizePanel, _this);
                panel.prototype.panelArray.forEach(function(_panel) {
                    _panel.on('throw', _this.throwEvent.bind(_this), _this);
                });
            },

            removeEventListeners: function() {
                var _this = this;
                _this.off('resize');
                panel.prototype.panelArray.forEach(function(_panel) {
                    _panel.off('throw');
                });
            },

            resizePanels: function(){
                var _this = this;
                panel.prototype.panelArray.forEach(function(_panel) {
                    _panel.resizePanel();
                });
            }
        };
        extend(panel_platform, overlay_core);
        extend(panel_platform, event_core);
        extend(panel_platform, ping_core);

        return new panel_platform();
    });