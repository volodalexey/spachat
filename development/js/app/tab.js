define('tab', [
        'event_core'
    ],
    function(
        event_core
    ) {

        var tab = function() {};

        tab.prototype = {
            initialize: function() {
                var _this = this;
                _this.data = {
                    _localStorage: {
                        key: {
                            tabId: 'tabId'
                        },
                        initial: {
                            tabId: '0'
                        }
                    }
                };

                _this.data.tabId = _this.getTabId();

                return _this;
            },

            getTabId: function () {
                var _this = this;
                var lastId = localStorage.getItem(_this.data._localStorage.key.tabId) || _this.data._localStorage.initial.tabId;
                var tabId = (parseInt(lastId, 10) + 1).toString();
                localStorage.setItem(_this.data._localStorage.key.tabId, tabId);
                return tabId;
            }
        };
        extend(tab, event_core);

        return new tab();
    }
);
