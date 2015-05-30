define('template_core', [],
    function() {

        var template_core = function() {
        };

        template_core.prototype = {

            __class_name: "template_core",

            template: function(text, settings, oldSettings) {

                var templateSettings = {
                    "evaluate": /<%([\s\S]+?)%>/g,
                    "interpolate": /<%=([\s\S]+?)%>/g,
                    "escape": /<%-([\s\S]+?)%>/g
                };

                var noMatch = /(.)^/;

                var escapes = {
                    "'": "'",
                    '\\': '\\',
                    '\r': 'r',
                    '\n': 'n',
                    '\u2028': 'u2028',
                    '\u2029': 'u2029'
                };

                var escaper = /\\|'|\r|\n|\u2028|\u2029/g;

                var escapeChar = function(match) {
                    return '\\' + escapes[match];
                };

                if (!settings && oldSettings) settings = oldSettings;
                settings = _.defaults({}, settings, templateSettings);

                // Combine delimiters into one regular expression via alternation.
                var matcher = RegExp([
                        (settings.escape || noMatch).source,
                        (settings.interpolate || noMatch).source,
                        (settings.evaluate || noMatch).source
                    ].join('|') + '|$', 'g');

                // Compile the template source, escaping string literals appropriately.
                var index = 0;
                var source = "__p+='";
                text.replace(matcher, function(match, escape, interpolate, evaluate, offset) {
                    source += text.slice(index, offset).replace(escaper, escapeChar);
                    index = offset + match.length;

                    if (escape) {
                        source += "'+\n((__t=(" + escape + "))==null?'':_.escape(__t))+\n'";
                    } else if (interpolate) {
                        source += "'+\n((__t=(" + interpolate + "))==null?'':__t)+\n'";
                    } else if (evaluate) {
                        source += "';\n" + evaluate + "\n__p+='";
                    }

                    // Adobe VMs need the match returned to produce the correct offest.
                    return match;
                });
                source += "';\n";

                // If a variable is not specified, place data values in local scope.
                if (!settings.variable) source = 'with(obj||{}){\n' + source + '}\n';

                source = "var __t,__p='',__j=Array.prototype.join," +
                    "print=function(){__p+=__j.call(arguments,'');};\n" +
                    source + 'return __p;\n';

                try {
                    var render = new Function(settings.variable || 'obj', '_', source);
                } catch (e) {
                    e.source = source;
                    throw e;
                }

                var template = function(data) {
                    return render.call(this, data, _);
                };

                // Provide the compiled source as a convenience for precompilation.
                var argument = settings.variable || 'obj';
                template.source = 'function(' + argument + '){\n' + source + '}';

                return template;
            }};

            return template_core;
    });