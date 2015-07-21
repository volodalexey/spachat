define('dom_core',
    function () {

        var dom_core = function() {};

        dom_core.prototype = {

            __class_name: "dom_core",

            /**
             * find parent node with predefined dataset
             */
            traverseUpToDataset: function(startElement, datasetKey, datasetValue) {
                var parentNode = startElement.parentNode;
                if (parentNode) {
                    if (parentNode.dataset && parentNode.dataset[datasetKey] === datasetValue) {
                        return parentNode;
                    } else {
                        return this.traverseUpToDataset(parentNode, datasetKey, datasetValue);
                    }
                } else {
                    return null;
                }
            },

            getOffset: function(element) {
                var offsetLeft = 0, offsetTop = 0;
                do {
                    offsetLeft += element.offsetLeft;
                    offsetTop  += element.offsetTop;
                } while (element = element.offsetParent);
                return {offsetLeft: offsetLeft, offsetTop:offsetTop};
            },

            getDataAction: function(element) {
                var action, n = 3, parent, options, _throw;
                var _getAction = function(element, n){
                    //action = element.getAttribute('data-action');
                    action = element.dataset.action;
                    _throw = element.dataset.throw;
                    if (element.disabled) {
                        action = null;
                        return;

                    }
                    if (!action && n > 0) {
                        parent = element.parentNode;
                        _getAction(parent, n-1);
                    }
                    options = {action: action, parent: parent, throw: _throw};

                };
                _getAction(element, n);

                return options;

            }
        };

        return dom_core;
    }
);