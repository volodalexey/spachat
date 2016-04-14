define([
    'users_bus'
  ],
  function(users_bus) {

    // inspired by https://ru.js.cx/article/cookie/cookie.js
    var cookie_core = function() {
    };

    cookie_core.prototype = {

      __class_name: "cookie_core",

      getCookie: function(name) {
        var matches = document.cookie.match(new RegExp(
          "(?:^|; )" + name.replace(/([\.$?*|{}\(\)\[\]\\\/\+^])/g, '\\$1') + "=([^;]*)"
        ));
        return matches ? decodeURIComponent(matches[1]) : undefined;
      },

      setCookie: function(name, value, options) {
        options = options || {};

        var expires = options.expires;

        if (typeof expires === "number" && expires) {
          var d = new Date();
          d.setTime(d.getTime() + expires * 1000);
          expires = options.expires = d;
        }
        if (expires && expires.toUTCString) {
          options.expires = expires.toUTCString();
        }

        value = encodeURIComponent(value);

        var updatedCookie = name + "=" + value;

        for (var propName in options) {
          updatedCookie += "; " + propName;
          var propValue = options[propName];
          if (propValue !== true) {
            updatedCookie += "=" + propValue;
          }
        }

        document.cookie = updatedCookie;
      },

      deleteCookie: function(name) {
        cookie_core.prototype.setCookie(name, "", {
          expires: -1
        })
      }
    };

    return cookie_core;
  }
);