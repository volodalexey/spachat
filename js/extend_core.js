var extend_core = function() {
};

extend_core.prototype = {

  __class_name: "extend_core",

  extend: function(child, parent) {
    var _this = this;
    var keys = Object.keys(parent);
    keys.forEach(function(key) {
      if (typeof parent[key] === 'object' && !Array.isArray(parent[key]) && parent[key] !== null) {
        child[key] = {};
        _this.extend(child[key], parent[key]);
      } else {
        child[key] = parent[key];
      }
    });
  },

  inherit: function(Child, Parent) {
    var F = function() {
    };
    F.prototype = Parent.prototype;
    var f = new F();

    for (var prop in Child.prototype) {
      f[prop] = Child.prototype[prop]
    }
    Child.prototype = f;
    Child.prototype[Parent.prototype.__class_name] = Parent.prototype;
  }
};

export default extend_core;