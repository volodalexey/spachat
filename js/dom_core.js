import React from 'react'

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
  
  getUserIdByParentElement(element){
    let parentElement = this.traverseUpToDataset(element, 'role', 'contactWrapper');
    if (!parentElement || parentElement && !parentElement.dataset.user_id) {
      console.error(new Error('User wrapper does not have user id!'));
    } else {
      return parentElement.dataset.user_id;
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
  },

  getOffset: function(element) {
    var offsetLeft = 0, offsetTop = 0;
    do {
      offsetLeft += element.offsetLeft;
      offsetTop += element.offsetTop;
    } while (element = element.offsetParent);
    return {offsetLeft: offsetLeft, offsetTop: offsetTop};
  }

};

export default Dom_core;