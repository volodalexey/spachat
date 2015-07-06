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
            }
        };

        return dom_core;
    }
);