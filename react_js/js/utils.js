var Utils = function() {};

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
  }
};

export default new Utils();