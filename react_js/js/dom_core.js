import React from 'react'
//import extend_core from '../js/extend_core.js'

var Dom_core = function() {
};

Dom_core.prototype = {

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

  getDataParameter(element, param, _n) {
    if (!element) {
      return null;
    }
    if (element.disabled && param !== "description") {
      return null;
    }
    var n = !( _n === undefined || _n === null ) ? _n : 5;
    if (n > 0) {
      if (!element.dataset || !element.dataset[param]) {
        return this.getDataParameter(element.parentNode, param, n - 1);
      } else if (element.dataset[param]) {
        return element;
      }
    }
    return null;
  }
};

export default Dom_core;