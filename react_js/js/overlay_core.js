import React from 'react'
//import extend_core from '../js/extend_core.js'


var overlay_core = function() {
};

overlay_core.prototype = {

  __class_name: "overlay_core",

  toggleWaiter: function(show) {
    var self = this;
    self.waiter_outer_container = document.querySelector('[data-role="waiter_outer_container"]');
    self.waiter_outer_container.classList[(show === true ? 'remove' : 'add')]('hide');
  }
};

export default overlay_core;