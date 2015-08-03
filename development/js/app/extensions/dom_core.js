define('dom_core',[
    'ajax_core', 'extend_core'],
    function (ajax_core, extend_core) {

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

            getDataParameter: function(element, param, _n) {
                if (element.disabled && param !== "description") {
                    return null;
                }
                var n = !( _n === undefined || _n === null ) ? _n : 4 ;
                if (n > 0) {
                    if (!element.dataset || !element.dataset[param]) {
                        return this.getDataParameter(element.parentNode, param, n-1);
                    } else if (element.dataset[param]) {
                        return element;
                    }
                }
                return null;
            },

            getDescriptionIcon: function(dataErr, options, data, callback){
                var _this = this;
                _this.sendRequest("/templates/icon/description_icon.html", function(err, res) {
                    if (err) {
                        console.error(err);
                        return;
                    }
                    callback(res, dataErr, options, data);
                });
            }
        };

        extend_core.prototype.inherit(dom_core, ajax_core);

        return dom_core;
    }
);