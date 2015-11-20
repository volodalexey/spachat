var localization_config = require('json!../configs/localization_config.json');
import Index from '../components/index'
import React from 'react'

class Localization {

  changeLanguage(lang) {
    this.lang = lang;
    this.mainComponent.forceUpdate();
  }

  constructor(lang) {
    this.lang = lang;
  }

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

  setMainComponent(mainComponent) {
    this.mainComponent = mainComponent;
  }

}

export default new Localization("en");