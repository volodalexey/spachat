define('template_core', [],
  function() {

    var template_core = function() {
    };

    template_core.prototype = {

      __class_name: "template_core",

      defaultSettings: {
        noMatch: /(.)^/,
        inputVariable: '_in',
        outputVariable: '_out',
        evaluate: /<%([\s\S]+?)%>/g,
        interpolate: /<%=([\s\S]+?)%>/g,
        escape: /<%-([\s\S]+?)%>/g,
        escapes: {
          "'": "'",
          '\\': '\\',
          '\r': 'r',
          '\n': 'n',
          '\u2028': 'u2028',
          '\u2029': 'u2029'
        },
        escaper: /\\|'|\r|\n|\u2028|\u2029/g
      },

      template: function(text) {
        var settings = this.defaultSettings;
        var escapes = settings.escapes;
        var escaper = settings.escaper;
        var noMatch = settings.noMatch;

        var escapeChar = function(match) {
          return '\\' + escapes[match];
        };

        // Combine delimiters into one regular expression via alternation.
        var matcher = RegExp([
            (settings.escape || noMatch).source,
            (settings.interpolate || noMatch).source,
            (settings.evaluate || noMatch).source
          ].join('|') + '|$', 'g');

        // Compile the template source, escaping string literals appropriately.
        var index = 0;
        var out_s_open = "\n" + settings.outputVariable + ".push('", out_s_close = "');\n";
        var out_v_open = "\n" + settings.outputVariable + ".push(", out_v_close = ");\n";
        var source = '';
        text.replace(matcher, function(match, escape, interpolate, evaluate, offset) {
          source += out_s_open + text.slice(index, offset).replace(escaper, escapeChar) + out_s_close;
          index = offset + match.length;

          if (escape) {
            source += out_s_open + escape + out_s_close;
          } else if (interpolate) {
            source += out_v_open + interpolate + out_v_close;
          } else if (evaluate) {
            source += evaluate;
          }

          // Adobe VMs need the match returned to produce the correct offest.
          return match;
        });
        source += 'return ' + settings.outputVariable + ';\n';

        try {
          var render = new Function(settings.inputVariable, settings.outputVariable, source);
        } catch (e) {
          e.source = source;
          throw e;
        }

        return function(data) {
          return render.call(this, data, []).join('');
        };
      }
    };

    return template_core;
  });
