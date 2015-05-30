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
            this.PANEL_TYPES = {
                LEFT: "LEFT",
                RIGHT: "RIGHT"
            };
            this.panelsOptions = [
                {
                    type: this.PANEL_TYPES.LEFT
                },
                {
                    type: this.PANEL_TYPES.RIGHT
                }
            ];
            this.panelsOptions.forEach(function(panelDescription) {
                var _panel = new panel({
                    panelDescription: panelDescription,
                    PANEL_TYPES: _this.PANEL_TYPES
                });
                panel.prototype.panelArray.push(_panel);
            });
            _this.bindContexts();
        };

        panel_platform.prototype = {

            bindContexts: function() {
                var _this = this;
                _this.bindedResizePanel = _this.throttle(_this.resizePanels.bind(_this), 300, _this);
            },

            renderPanels: function(navigator) {
                var _this = this;
                panel.prototype.panelArray.forEach(function(_panel) {
                    _panel.render(navigator);
                    _panel.on('clearStory', _this.throwEvent.bind(_this, 'clearStory'), _this);
                    _panel.on('addNewRoom', _this.throwEvent.bind(_this, 'addNewRoom'), _this);
                });
            },

            disposePanels: function() {
                var _this = this;
                _this.removeEventListeners();
            },

            addEventListeners: function() {
                var _this = this;
                _this.removeEventListeners();
                _this.on('resize', _this.bindedResizePanel, _this);
                panel.prototype.panelArray.forEach(function(_panel) {
                    _panel.on('clearStory', _this.throwEvent.bind(_this, 'clearStory'), _this);
                    _panel.on('addNewRoom', _this.throwEvent.bind(_this, 'addNewRoom'), _this);
                });
            },

            removeEventListeners: function() {
                var _this = this;
                _this.off('resize');
                panel.prototype.panelArray.forEach(function(_panel) {
                    _panel.off('clearStory');
                    _panel.off('addNewRoom');
                });
            },

            throwEvent: function(name) {
                var _this = this;
                _this.trigger(name);
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