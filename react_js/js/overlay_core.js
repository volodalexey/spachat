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

  //showSpinner: function(element) {
  //  var self = this;
  //  element.innerHTML = self.spinner_template();
  //},
  //
  //showHorizontalSpinner: function(element) {
  //  var self = this;
  //  element.innerHTML = self.horizontal_spinner_template();
  //}
};

//overlay_core.prototype.spinner_template = overlay_core.prototype.template(spinner_template);
//overlay_core.prototype.horizontal_spinner_template = overlay_core.prototype.template(horizontal_spinner_template);

export default overlay_core;