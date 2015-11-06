var localization_config = require('json!../configs/localization_config.json');

class Localization {

  constructor(lang){
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

};


export default new Localization("en")