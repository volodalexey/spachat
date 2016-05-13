var localization_config = require('../configs/localization_config.json');
import React from 'react'

var Localization = function(lang) {
  this.lang = lang;
};

Localization.prototype = {

  changeLanguage(lang, component) {
    this.lang = lang;
    let language = localStorage.getItem('language');
    if (!language || language !== lang) {
      localStorage.setItem('language', lang);
    }
    component.forceUpdate();
  },
  
  setLanguage(lang){
    this.lang = lang;
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
  }
};

export default new Localization("en");