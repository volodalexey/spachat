var id_core = function() {
};

id_core.prototype = {

  __class_name: "id_core",

  _s4: function() {
    return Math.floor((1 + Math.random()) * 0x10000).toString(16).substring(1);
  },

  _get5Digits: function(digitsArray) {
    var _5d = [];
    var digit = digitsArray.pop();
    while (_5d.length < 4) {
      if (digit) {
        _5d.unshift(digit);
      } else {
        _5d.unshift(0);
      }
      if (_5d.length < 4 && digit) {
        digit = digitsArray.pop();
      }
    }
    if (digitsArray.length) {
      return [_5d.join('')].concat(this._get5Digits(digitsArray));
    } else {
      return [_5d.join('')];
    }
  },

  _s4Date: function() {
    var D = Date.now();
    return this._get5Digits(D.toString().split('')).reverse();
  },

  generateId: function() {
    return (this._s4Date().concat([this._s4(), this._s4(), this._s4(), this._s4(), this._s4(), this._s4(), this._s4(), this._s4()])).join('-');
  }
};

export default id_core;