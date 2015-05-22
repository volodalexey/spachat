define('panel_platform', [
        'panel',
        'overlay_core',
        'event_core'

    ],
    function(panel,
             overlay_core,
             event_core) {

        var panel_platform = function() {
        };

        panel_platform.prototype = {

            initialize: function() {
                var _this = this;
                _this.bindContexts();
                _this.addEventListeners();
                //_this.addNewPanel();
                return _this;
            },

            addNewPanel: function() {
                var _this = this;
                _this.newPanel = new panel();
                panel.prototype.panelArray.push(_this.newPanel);
                _this.newPanel.initialize();
                _this.newPanel.on('clearStory', _this.throwEvent.bind(_this, 'clearStory'), _this);
                _this.newPanel.on('addNewChat', _this.throwEvent.bind(_this, 'addNewChat'), _this);
                _this.toggleWaiter(true);

            },

            bindContexts: function() {
                var _this = this;
            },

            addEventListeners: function() {
                var _this = this;
                _this.removeEventListeners();

                //navigator.on('addNewChat', _this.addNewPanel.bind(_this) , _this);
            },

            removeEventListeners: function() {
                var _this = this;

            },

            throwEvent: function(name) {
                var _this = this;
                _this.trigger(name);
            },

            resizePanels: function(){
                var _this = this;
                _.each(panel.prototype.panelArray, function(_panel) {
                    _panel.resizePanel();
                })
            }


        };
        extend(panel_platform, overlay_core);
        extend(panel_platform, event_core);

        return new panel_platform().initialize();
    });