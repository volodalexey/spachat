var Disable_display_core = function() {
};

Disable_display_core.prototype = {

  __class_name: "disable_display_core",

  toggleButtonDisplay: function(toggle, buttonElement) {
    var styleDisplay = buttonElement.dataset.styleDisplay;
    if (typeof toggle !== 'boolean') {
      toggle = buttonElement.style.display === 'none';
    }

    if (toggle) {
      if (!styleDisplay) {
        styleDisplay = 'inherit';
      }
      buttonElement.style.display = styleDisplay;
    } else {
      styleDisplay = window.getComputedStyle(buttonElement).display;
      buttonElement.style.display = 'none';
      buttonElement.dataset.styleDisplay = styleDisplay;
    }
  },

  hideUIButton: function(id, buttonsElement) {
    var self = this;
    if (!self.props.UIElements) {
      throw new Error('Elements container is not implemented!');
    }

    if (!self.props.UIElements[id]) {
      self.props.UIElements[id] = {};
      self.props.UIElements[id].hideButtons = [];
    }
    buttonsElement.forEach(function(buttonElement) {
      self.props.UIElements[id].hideButtons.push(buttonElement);
      self.toggleButtonDisplay(null, buttonElement);
    });
  },

  unHideUIButton: function(id) {
    var _this = this;
    if (!_this.UIElements) {
      throw new Error('Elements container is not implemented!');
    }

    if (_this.UIElements[id] && Array.isArray(_this.UIElements[id].hideButtons)) {
      _this.UIElements[id].hideButtons.forEach(function(buttonElement) {
        _this.toggleButtonDisplay(null, buttonElement);
      });
    }
    _this.UIElements[id].hideButtons = [];
  },

  toggleButtonDisable: function(toggle, buttonElement) {
    if (toggle) {
      buttonElement.disabled = true;
    } else {
      buttonElement.disabled = false;
    }
  },

  disableButton: function(id, buttonElement) {
    var _this = this;
    if (!_this.UIElements) {
      throw new Error('Elements container is not implemented!');
    }

    if (!_this.UIElements[id]) {
      _this.UIElements[id] = {};
      _this.UIElements[id].disableButtons = [];
    }
    _this.UIElements[id].disableButtons.push(buttonElement);
    _this.toggleButtonDisable(true, buttonElement);
  },

  enableButton: function(id) {
    var _this = this;
    if (!_this.UIElements) {
      throw new Error('Elements container is not implemented!');
    }

    _this.UIElements[id].disableButtons.forEach(function(buttonElement) {
      _this.toggleButtonDisable(false, buttonElement);
    });

    _this.UIElements[id].disableButtons = [];
  }
};

export default Disable_display_core;