var localization_config = require('../configs/localization_config.json');
import React from 'react'

var Localization = function(lang) {
  this.lang = lang;
};

Localization.prototype = {

  changeLanguage(lang) {
    this.lang = lang;
    this.mainComponent.forceUpdate();
  },

  getLocText(id) {
    var text;
    localization_config.every(
      (_config) => {
        if (_config.id === id) {
          text = _config[this.lang];
        }
        return !text;
      }
    );
    return text;
  },

  setMainComponent(mainComponent) {
    this.mainComponent = mainComponent;
  }
};

export default new Localization("en");