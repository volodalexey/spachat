var Utils = function() {};
import Localization from '../js/localization'

Utils.prototype = {

  /**
   * prepare url by input object
   */
  objectToUrl(objectData, initial_url) {
    let url = initial_url;
    Object.keys(objectData).forEach((key) => {
      let str_key = '{' + key + '}';
      if (url.indexOf(str_key) >= 0) {
        url = url.replace(str_key, objectData[key]);
      }
    });
    return url;
  },

  deviceIsMobile(){
    let mobile = window.navigator.userAgent.search( /mobile/i );
    if (mobile === -1){
      return false;
    } else {
      return true;
    }
  },

  transformationData(_data, _transform_value){
    let transform_value = Localization.getLocText(_transform_value);
    transform_value = this.objectToUrl(_data, transform_value);
    return transform_value;
  }
};

export default new Utils();