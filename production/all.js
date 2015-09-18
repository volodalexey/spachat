
/**
 * @license almond 0.3.1 Copyright (c) 2011-2014, The Dojo Foundation All Rights Reserved.
 * Available via the MIT or new BSD license.
 * see: http://github.com/jrburke/almond for details
 */
//Going sloppy to avoid 'use strict' string cost, but strict practices should
//be followed.
/*jslint sloppy: true */
/*global setTimeout: false */

var requirejs, require, define;
(function (undef) {
    var main, req, makeMap, handlers,
        defined = {},
        waiting = {},
        config = {},
        defining = {},
        hasOwn = Object.prototype.hasOwnProperty,
        aps = [].slice,
        jsSuffixRegExp = /\.js$/;

    function hasProp(obj, prop) {
        return hasOwn.call(obj, prop);
    }

    /**
     * Given a relative module name, like ./something, normalize it to
     * a real name that can be mapped to a path.
     * @param {String} name the relative name
     * @param {String} baseName a real name that the name arg is relative
     * to.
     * @returns {String} normalized name
     */
    function normalize(name, baseName) {
        var nameParts, nameSegment, mapValue, foundMap, lastIndex,
            foundI, foundStarMap, starI, i, j, part,
            baseParts = baseName && baseName.split("/"),
            map = config.map,
            starMap = (map && map['*']) || {};

        //Adjust any relative paths.
        if (name && name.charAt(0) === ".") {
            //If have a base name, try to normalize against it,
            //otherwise, assume it is a top-level require that will
            //be relative to baseUrl in the end.
            if (baseName) {
                name = name.split('/');
                lastIndex = name.length - 1;

                // Node .js allowance:
                if (config.nodeIdCompat && jsSuffixRegExp.test(name[lastIndex])) {
                    name[lastIndex] = name[lastIndex].replace(jsSuffixRegExp, '');
                }

                //Lop off the last part of baseParts, so that . matches the
                //"directory" and not name of the baseName's module. For instance,
                //baseName of "one/two/three", maps to "one/two/three.js", but we
                //want the directory, "one/two" for this normalization.
                name = baseParts.slice(0, baseParts.length - 1).concat(name);

                //start trimDots
                for (i = 0; i < name.length; i += 1) {
                    part = name[i];
                    if (part === ".") {
                        name.splice(i, 1);
                        i -= 1;
                    } else if (part === "..") {
                        if (i === 1 && (name[2] === '..' || name[0] === '..')) {
                            //End of the line. Keep at least one non-dot
                            //path segment at the front so it can be mapped
                            //correctly to disk. Otherwise, there is likely
                            //no path mapping for a path starting with '..'.
                            //This can still fail, but catches the most reasonable
                            //uses of ..
                            break;
                        } else if (i > 0) {
                            name.splice(i - 1, 2);
                            i -= 2;
                        }
                    }
                }
                //end trimDots

                name = name.join("/");
            } else if (name.indexOf('./') === 0) {
                // No baseName, so this is ID is resolved relative
                // to baseUrl, pull off the leading dot.
                name = name.substring(2);
            }
        }

        //Apply map config if available.
        if ((baseParts || starMap) && map) {
            nameParts = name.split('/');

            for (i = nameParts.length; i > 0; i -= 1) {
                nameSegment = nameParts.slice(0, i).join("/");

                if (baseParts) {
                    //Find the longest baseName segment match in the config.
                    //So, do joins on the biggest to smallest lengths of baseParts.
                    for (j = baseParts.length; j > 0; j -= 1) {
                        mapValue = map[baseParts.slice(0, j).join('/')];

                        //baseName segment has  config, find if it has one for
                        //this name.
                        if (mapValue) {
                            mapValue = mapValue[nameSegment];
                            if (mapValue) {
                                //Match, update name to the new value.
                                foundMap = mapValue;
                                foundI = i;
                                break;
                            }
                        }
                    }
                }

                if (foundMap) {
                    break;
                }

                //Check for a star map match, but just hold on to it,
                //if there is a shorter segment match later in a matching
                //config, then favor over this star map.
                if (!foundStarMap && starMap && starMap[nameSegment]) {
                    foundStarMap = starMap[nameSegment];
                    starI = i;
                }
            }

            if (!foundMap && foundStarMap) {
                foundMap = foundStarMap;
                foundI = starI;
            }

            if (foundMap) {
                nameParts.splice(0, foundI, foundMap);
                name = nameParts.join('/');
            }
        }

        return name;
    }

    function makeRequire(relName, forceSync) {
        return function () {
            //A version of a require function that passes a moduleName
            //value for items that may need to
            //look up paths relative to the moduleName
            var args = aps.call(arguments, 0);

            //If first arg is not require('string'), and there is only
            //one arg, it is the array form without a callback. Insert
            //a null so that the following concat is correct.
            if (typeof args[0] !== 'string' && args.length === 1) {
                args.push(null);
            }
            return req.apply(undef, args.concat([relName, forceSync]));
        };
    }

    function makeNormalize(relName) {
        return function (name) {
            return normalize(name, relName);
        };
    }

    function makeLoad(depName) {
        return function (value) {
            defined[depName] = value;
        };
    }

    function callDep(name) {
        if (hasProp(waiting, name)) {
            var args = waiting[name];
            delete waiting[name];
            defining[name] = true;
            main.apply(undef, args);
        }

        if (!hasProp(defined, name) && !hasProp(defining, name)) {
            throw new Error('No ' + name);
        }
        return defined[name];
    }

    //Turns a plugin!resource to [plugin, resource]
    //with the plugin being undefined if the name
    //did not have a plugin prefix.
    function splitPrefix(name) {
        var prefix,
            index = name ? name.indexOf('!') : -1;
        if (index > -1) {
            prefix = name.substring(0, index);
            name = name.substring(index + 1, name.length);
        }
        return [prefix, name];
    }

    /**
     * Makes a name map, normalizing the name, and using a plugin
     * for normalization if necessary. Grabs a ref to plugin
     * too, as an optimization.
     */
    makeMap = function (name, relName) {
        var plugin,
            parts = splitPrefix(name),
            prefix = parts[0];

        name = parts[1];

        if (prefix) {
            prefix = normalize(prefix, relName);
            plugin = callDep(prefix);
        }

        //Normalize according
        if (prefix) {
            if (plugin && plugin.normalize) {
                name = plugin.normalize(name, makeNormalize(relName));
            } else {
                name = normalize(name, relName);
            }
        } else {
            name = normalize(name, relName);
            parts = splitPrefix(name);
            prefix = parts[0];
            name = parts[1];
            if (prefix) {
                plugin = callDep(prefix);
            }
        }

        //Using ridiculous property names for space reasons
        return {
            f: prefix ? prefix + '!' + name : name, //fullName
            n: name,
            pr: prefix,
            p: plugin
        };
    };

    function makeConfig(name) {
        return function () {
            return (config && config.config && config.config[name]) || {};
        };
    }

    handlers = {
        require: function (name) {
            return makeRequire(name);
        },
        exports: function (name) {
            var e = defined[name];
            if (typeof e !== 'undefined') {
                return e;
            } else {
                return (defined[name] = {});
            }
        },
        module: function (name) {
            return {
                id: name,
                uri: '',
                exports: defined[name],
                config: makeConfig(name)
            };
        }
    };

    main = function (name, deps, callback, relName) {
        var cjsModule, depName, ret, map, i,
            args = [],
            callbackType = typeof callback,
            usingExports;

        //Use name if no relName
        relName = relName || name;

        //Call the callback to define the module, if necessary.
        if (callbackType === 'undefined' || callbackType === 'function') {
            //Pull out the defined dependencies and pass the ordered
            //values to the callback.
            //Default to [require, exports, module] if no deps
            deps = !deps.length && callback.length ? ['require', 'exports', 'module'] : deps;
            for (i = 0; i < deps.length; i += 1) {
                map = makeMap(deps[i], relName);
                depName = map.f;

                //Fast path CommonJS standard dependencies.
                if (depName === "require") {
                    args[i] = handlers.require(name);
                } else if (depName === "exports") {
                    //CommonJS module spec 1.1
                    args[i] = handlers.exports(name);
                    usingExports = true;
                } else if (depName === "module") {
                    //CommonJS module spec 1.1
                    cjsModule = args[i] = handlers.module(name);
                } else if (hasProp(defined, depName) ||
                           hasProp(waiting, depName) ||
                           hasProp(defining, depName)) {
                    args[i] = callDep(depName);
                } else if (map.p) {
                    map.p.load(map.n, makeRequire(relName, true), makeLoad(depName), {});
                    args[i] = defined[depName];
                } else {
                    throw new Error(name + ' missing ' + depName);
                }
            }

            ret = callback ? callback.apply(defined[name], args) : undefined;

            if (name) {
                //If setting exports via "module" is in play,
                //favor that over return value and exports. After that,
                //favor a non-undefined return value over exports use.
                if (cjsModule && cjsModule.exports !== undef &&
                        cjsModule.exports !== defined[name]) {
                    defined[name] = cjsModule.exports;
                } else if (ret !== undef || !usingExports) {
                    //Use the return value from the function.
                    defined[name] = ret;
                }
            }
        } else if (name) {
            //May just be an object definition for the module. Only
            //worry about defining if have a module name.
            defined[name] = callback;
        }
    };

    requirejs = require = req = function (deps, callback, relName, forceSync, alt) {
        if (typeof deps === "string") {
            if (handlers[deps]) {
                //callback in this case is really relName
                return handlers[deps](callback);
            }
            //Just return the module wanted. In this scenario, the
            //deps arg is the module name, and second arg (if passed)
            //is just the relName.
            //Normalize module name, if it contains . or ..
            return callDep(makeMap(deps, callback).f);
        } else if (!deps.splice) {
            //deps is a config object, not an array.
            config = deps;
            if (config.deps) {
                req(config.deps, config.callback);
            }
            if (!callback) {
                return;
            }

            if (callback.splice) {
                //callback is an array, which means it is a dependency list.
                //Adjust args if there are dependencies
                deps = callback;
                callback = relName;
                relName = null;
            } else {
                deps = undef;
            }
        }

        //Support require(['a'])
        callback = callback || function () {};

        //If relName is a function, it is an errback handler,
        //so remove it.
        if (typeof relName === 'function') {
            relName = forceSync;
            forceSync = alt;
        }

        //Simulate async callback;
        if (forceSync) {
            main(undef, deps, callback, relName);
        } else {
            //Using a non-zero value because of concern for what old browsers
            //do, and latest browsers "upgrade" to 4 if lower value is used:
            //http://www.whatwg.org/specs/web-apps/current-work/multipage/timers.html#dom-windowtimers-settimeout:
            //If want a value immediately, use require('id') instead -- something
            //that works in almond on the global level, but not guaranteed and
            //unlikely to work in other AMD implementations.
            setTimeout(function () {
                main(undef, deps, callback, relName);
            }, 4);
        }

        return req;
    };

    /**
     * Just drops the config on the floor, but returns req in case
     * the config return value is used.
     */
    req.config = function (cfg) {
        return req(cfg);
    };

    /**
     * Expose module registry for debugging and tooling
     */
    requirejs._defined = defined;

    define = function (name, deps, callback) {
        if (typeof name !== 'string') {
            throw new Error('See almond README: incorrect module build, no module name');
        }

        //This module may not have dependencies
        if (!deps.splice) {
            //deps is not an array, so probably means
            //an object literal or factory function for
            //the value. Adjust args.
            callback = deps;
            deps = [];
        }

        if (!hasProp(defined, name) && !hasProp(waiting, name)) {
            waiting[name] = [name, deps, callback];
        }
    };

    define.amd = {
        jQuery: true
    };
}());

define("lib/almond.js", function(){});

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
                source += 'return ' + settings.outputVariable +';\n';

                try {
                    var render = new Function(settings.inputVariable, settings.outputVariable, source);
                } catch (e) {
                    e.source = source;
                    throw e;
                }

                return function(data) {
                    return render.call(this, data, []).join('');
                };
            }};

            return template_core;
    });

define('ajax_core', [],
    function() {

        var ajax_core = function() {
        };

        ajax_core.prototype = {

            __class_name: "ajax_core",

            objectToFormData: function(objectData) {
                var formData = new FormData();
                for ( var key in objectData ) {
                    formData.append(key, objectData[key]);
                }
                return formData;
            },

            sendRequest: function(type, url, data, callback) {
                var xhr = new XMLHttpRequest();
                xhr.open(type, url, true);

                xhr.onreadystatechange = function() {
                    if (xhr.readyState == 4) {
                        if ((xhr.status >= 200 || xhr.status < 300) || xhr.status === 304) {
                            callback(null, xhr.responseText);
                        } else {
                            callback('Error (' + xhr.status + ') : ' + xhr.statusText + ' : ' + xhr.responseText);
                        }
                    }
                };
                xhr.send(data);
            },

            get_JSON_res: function(url, callback) {
                ajax_core.prototype.sendRequest('GET', url, null, function(err, res) {
                    if (err) {
                        callback(err);
                    } else {
                        try {
                            var parsed = JSON.parse(res);
                        } catch (e) {
                            callback(e);
                        }

                        callback(null, parsed);
                    }
                });
            },

            getRequest: function(url, callback) {
                ajax_core.prototype.sendRequest('GET', url, null, callback);
            },

            postRequest: function(url, objectData, callback) {
                var formData = ajax_core.prototype.objectToFormData(objectData);
                ajax_core.prototype.sendRequest('POST', url, formData, callback);
            },

            putRequest: function(url, objectData, callback) {
                var formData = ajax_core.prototype.objectToFormData(objectData);
                ajax_core.prototype.sendRequest('PUT', url, formData, callback);
            },

            deleteRequest: function(url, callback) {
                ajax_core.prototype.sendRequest('DELETE', url, null, callback);
            }
        };

        return ajax_core;
    });
define('event_core',
    [],function () {

        var event_core = function() {};

        event_core.prototype = {

            __class_name: "event_core",

            initializeListeners: function() {
                if (!this.listeners) {
                    this.listeners = {};
                }
            },

            on: function(event, handler, context) {
                this.initializeListeners();

                if (this.listeners[event] === undefined) {
                    this.listeners[event] = [];
                }

                if (this.listeners[event].indexOf(handler) === -1) {
                    this.listeners[event].push({
                        handler : handler,
                        context : context || this
                    });
                }
                return this;
            },

            off: function(event, handler) {
                this.initializeListeners();
                var idx;
                if (!event) {
                    this.listeners = {};
                    return this;
                }
                if (!this.listeners[event]) { return this; }

                if (!handler) {
                    delete this.listeners[event];
                } else {
                    idx = this.listeners[event].map(function(listener) { return listener.handler }).indexOf(handler);
                    if (idx !== -1) {
                        this.listeners[event].splice(idx, 1);
                    }
                }
                return this;
            },

            trigger: function(name) {
                this.initializeListeners();
                var args = Array.prototype.slice.call(arguments, 1);
                (this.listeners[name] || []).forEach(function(listener){
                    listener.handler.apply(listener.context, args);
                });
                return this;
            }
        };

        return event_core;
    }
);
define('extend_core', [],
    function() {

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
        return extend_core;
    });
define('event_bus', [
        'event_core',
        'extend_core'
    ],
    function(
         event_core,
         extend_core
    ) {

        var Event_bus = function() {
        };

        Event_bus.prototype = {

            set_ws_device_id: function(ws_device_id) {
                this.ws_device_id = ws_device_id;
            },

            get_ws_device_id: function() {
                return this.ws_device_id;
            }
        };

        extend_core.prototype.inherit(Event_bus, event_core);

        return new Event_bus();
    })
;
define('dom_core',[
    'ajax_core', 'extend_core'],
    function (ajax_core, extend_core) {

        var dom_core = function() {};

        dom_core.prototype = {

            __class_name: "dom_core",

            /**
             * find parent node with predefined dataset
             */
            traverseUpToDataset: function(startElement, datasetKey, datasetValue) {
                var parentNode = startElement.parentNode;
                if (parentNode) {
                    if (parentNode.dataset && parentNode.dataset[datasetKey] === datasetValue) {
                        return parentNode;
                    } else {
                        return this.traverseUpToDataset(parentNode, datasetKey, datasetValue);
                    }
                } else {
                    return null;
                }
            },

            getOffset: function(element) {
                var offsetLeft = 0, offsetTop = 0;
                do {
                    offsetLeft += element.offsetLeft;
                    offsetTop  += element.offsetTop;
                } while (element = element.offsetParent);
                return {offsetLeft: offsetLeft, offsetTop:offsetTop};
            },

            getDataParameter: function(element, param, _n) {
                if (!element) {
                    return null;
                }
                if (element.disabled && param !== "description") {
                    return null;
                }
                var n = !( _n === undefined || _n === null ) ? _n : 5 ;
                if (n > 0) {
                    if (!element.dataset || !element.dataset[param]) {
                        return this.getDataParameter(element.parentNode, param, n-1);
                    } else if (element.dataset[param]) {
                        return element;
                    }
                }
                return null;
            }
        };

        extend_core.prototype.inherit(dom_core, ajax_core);

        return dom_core;
    }
);
define('throw_event_core', [
        'event_core',
        'event_bus',
        'dom_core',
        'extend_core'
    ],
    function (
        event_core,
        event_bus,
        dom_core,
        extend_core
) {

        var throw_event_core = function() {};

        throw_event_core.prototype = {

            __class_name: "throw_event_core",

            /**
             * Adds or removes event listener
             * defines from which place this function was called
             * @param element
             * @param eventName
             * @param listener
             * @param phase
             */
            addRemoveListener: function(action, element, eventName, listener, phase) {
                if (!element || !listener || !eventName) {
                    return;
                }
                if (action === 'add') {
                    element.addEventListener(eventName, listener, phase);
                } else if (action === 'remove') {
                    element.removeEventListener(eventName, listener, phase);
                }
            },

            dataActionRouter: function(event) {
                var _this = this, element = _this.getDataParameter(event.target, 'action');
                if (element) {
                    if (_this[element.dataset.action]) {
                        _this[element.dataset.action](element);
                    }
                }
            },

            throwEventRouter: function(event) {
                var _this = this, element = _this.getDataParameter(event.target, 'action');
                if (element) {
                    if (element.dataset.action && element.dataset.throw) {
                        _this.throwEvent(element.dataset.action, element);
                    }
                }
            },

            throwEvent: function(name, data) {
                event_bus.trigger('throw', name, data);
            },

            triggerRouter: function(event) {
                var action = event.target.dataset.action;
                if (action) {
                    this.trigger(action);
                }
            }
        };

        extend_core.prototype.inherit(throw_event_core, event_core);
        extend_core.prototype.inherit(throw_event_core, dom_core);

        return throw_event_core;
    }
);
define('async_core',
    [],function () {

        var async_core = function() {};

        async_core.prototype = {

            __class_name: "async_core",

            only_once: function(root, fn) {
                var called = false;
                return function() {
                    if (called) throw new Error("Callback was already called.");
                    called = true;
                    fn.apply(root, arguments);
                }
            },

            async_each: function (arr, iterator, callback) {
                var _this = this;
                callback = callback || function () {};
                if (!arr.length) {
                    return callback();
                }
                var completed = 0;
                arr.forEach(function (x) {
                    iterator(x, _this.only_once(_this, done) );
                });
                function done(err) {
                    if (err) {
                        callback(err);
                        callback = function () {};
                    } else {
                        completed += 1;
                        if (completed >= arr.length) {
                            callback();
                        }
                    }
                }
            },

            async_eachSeries: function (arr, iterator, callback) {
                callback = callback || function () {};
                if (!arr.length) {
                    return callback();
                }
                var completed = 0;
                var detailData = [];
                var iterate = function () {
                    iterator(arr[completed], function (err, detail) {
                        if (err) {
                            callback(err, detail);
                            callback = function () {};
                            detailData = [];
                        } else {
                            completed += 1;
                            if (detail) {
                                detailData.push(detail);
                            }
                            if (completed >= arr.length) {
                                callback(null, detailData);
                            } else {
                                iterate();
                            }
                        }
                    });
                };
                iterate();
            }
        };

        return async_core;
    }
);
/**
 * @license RequireJS text 2.0.12 Copyright (c) 2010-2014, The Dojo Foundation All Rights Reserved.
 * Available via the MIT or new BSD license.
 * see: http://github.com/requirejs/text for details
 */
/*jslint regexp: true */
/*global require, XMLHttpRequest, ActiveXObject,
  define, window, process, Packages,
  java, location, Components, FileUtils */

define('text',['module'], function (module) {
    

    var text, fs, Cc, Ci, xpcIsWindows,
        progIds = ['Msxml2.XMLHTTP', 'Microsoft.XMLHTTP', 'Msxml2.XMLHTTP.4.0'],
        xmlRegExp = /^\s*<\?xml(\s)+version=[\'\"](\d)*.(\d)*[\'\"](\s)*\?>/im,
        bodyRegExp = /<body[^>]*>\s*([\s\S]+)\s*<\/body>/im,
        hasLocation = typeof location !== 'undefined' && location.href,
        defaultProtocol = hasLocation && location.protocol && location.protocol.replace(/\:/, ''),
        defaultHostName = hasLocation && location.hostname,
        defaultPort = hasLocation && (location.port || undefined),
        buildMap = {},
        masterConfig = (module.config && module.config()) || {};

    text = {
        version: '2.0.12',

        strip: function (content) {
            //Strips <?xml ...?> declarations so that external SVG and XML
            //documents can be added to a document without worry. Also, if the string
            //is an HTML document, only the part inside the body tag is returned.
            if (content) {
                content = content.replace(xmlRegExp, "");
                var matches = content.match(bodyRegExp);
                if (matches) {
                    content = matches[1];
                }
            } else {
                content = "";
            }
            return content;
        },

        jsEscape: function (content) {
            return content.replace(/(['\\])/g, '\\$1')
                .replace(/[\f]/g, "\\f")
                .replace(/[\b]/g, "\\b")
                .replace(/[\n]/g, "\\n")
                .replace(/[\t]/g, "\\t")
                .replace(/[\r]/g, "\\r")
                .replace(/[\u2028]/g, "\\u2028")
                .replace(/[\u2029]/g, "\\u2029");
        },

        createXhr: masterConfig.createXhr || function () {
            //Would love to dump the ActiveX crap in here. Need IE 6 to die first.
            var xhr, i, progId;
            if (typeof XMLHttpRequest !== "undefined") {
                return new XMLHttpRequest();
            } else if (typeof ActiveXObject !== "undefined") {
                for (i = 0; i < 3; i += 1) {
                    progId = progIds[i];
                    try {
                        xhr = new ActiveXObject(progId);
                    } catch (e) {}

                    if (xhr) {
                        progIds = [progId];  // so faster next time
                        break;
                    }
                }
            }

            return xhr;
        },

        /**
         * Parses a resource name into its component parts. Resource names
         * look like: module/name.ext!strip, where the !strip part is
         * optional.
         * @param {String} name the resource name
         * @returns {Object} with properties "moduleName", "ext" and "strip"
         * where strip is a boolean.
         */
        parseName: function (name) {
            var modName, ext, temp,
                strip = false,
                index = name.indexOf("."),
                isRelative = name.indexOf('./') === 0 ||
                             name.indexOf('../') === 0;

            if (index !== -1 && (!isRelative || index > 1)) {
                modName = name.substring(0, index);
                ext = name.substring(index + 1, name.length);
            } else {
                modName = name;
            }

            temp = ext || modName;
            index = temp.indexOf("!");
            if (index !== -1) {
                //Pull off the strip arg.
                strip = temp.substring(index + 1) === "strip";
                temp = temp.substring(0, index);
                if (ext) {
                    ext = temp;
                } else {
                    modName = temp;
                }
            }

            return {
                moduleName: modName,
                ext: ext,
                strip: strip
            };
        },

        xdRegExp: /^((\w+)\:)?\/\/([^\/\\]+)/,

        /**
         * Is an URL on another domain. Only works for browser use, returns
         * false in non-browser environments. Only used to know if an
         * optimized .js version of a text resource should be loaded
         * instead.
         * @param {String} url
         * @returns Boolean
         */
        useXhr: function (url, protocol, hostname, port) {
            var uProtocol, uHostName, uPort,
                match = text.xdRegExp.exec(url);
            if (!match) {
                return true;
            }
            uProtocol = match[2];
            uHostName = match[3];

            uHostName = uHostName.split(':');
            uPort = uHostName[1];
            uHostName = uHostName[0];

            return (!uProtocol || uProtocol === protocol) &&
                   (!uHostName || uHostName.toLowerCase() === hostname.toLowerCase()) &&
                   ((!uPort && !uHostName) || uPort === port);
        },

        finishLoad: function (name, strip, content, onLoad) {
            content = strip ? text.strip(content) : content;
            if (masterConfig.isBuild) {
                buildMap[name] = content;
            }
            onLoad(content);
        },

        load: function (name, req, onLoad, config) {
            //Name has format: some.module.filext!strip
            //The strip part is optional.
            //if strip is present, then that means only get the string contents
            //inside a body tag in an HTML string. For XML/SVG content it means
            //removing the <?xml ...?> declarations so the content can be inserted
            //into the current doc without problems.

            // Do not bother with the work if a build and text will
            // not be inlined.
            if (config && config.isBuild && !config.inlineText) {
                onLoad();
                return;
            }

            masterConfig.isBuild = config && config.isBuild;

            var parsed = text.parseName(name),
                nonStripName = parsed.moduleName +
                    (parsed.ext ? '.' + parsed.ext : ''),
                url = req.toUrl(nonStripName),
                useXhr = (masterConfig.useXhr) ||
                         text.useXhr;

            // Do not load if it is an empty: url
            if (url.indexOf('empty:') === 0) {
                onLoad();
                return;
            }

            //Load the text. Use XHR if possible and in a browser.
            if (!hasLocation || useXhr(url, defaultProtocol, defaultHostName, defaultPort)) {
                text.get(url, function (content) {
                    text.finishLoad(name, parsed.strip, content, onLoad);
                }, function (err) {
                    if (onLoad.error) {
                        onLoad.error(err);
                    }
                });
            } else {
                //Need to fetch the resource across domains. Assume
                //the resource has been optimized into a JS module. Fetch
                //by the module name + extension, but do not include the
                //!strip part to avoid file system issues.
                req([nonStripName], function (content) {
                    text.finishLoad(parsed.moduleName + '.' + parsed.ext,
                                    parsed.strip, content, onLoad);
                });
            }
        },

        write: function (pluginName, moduleName, write, config) {
            if (buildMap.hasOwnProperty(moduleName)) {
                var content = text.jsEscape(buildMap[moduleName]);
                write.asModule(pluginName + "!" + moduleName,
                               "define(function () { return '" +
                                   content +
                               "';});\n");
            }
        },

        writeFile: function (pluginName, moduleName, req, write, config) {
            var parsed = text.parseName(moduleName),
                extPart = parsed.ext ? '.' + parsed.ext : '',
                nonStripName = parsed.moduleName + extPart,
                //Use a '.js' file name so that it indicates it is a
                //script that can be loaded across domains.
                fileName = req.toUrl(parsed.moduleName + extPart) + '.js';

            //Leverage own load() method to load plugin value, but only
            //write out values that do not have the strip argument,
            //to avoid any potential issues with ! in file names.
            text.load(nonStripName, req, function (value) {
                //Use own write() method to construct full module value.
                //But need to create shell that translates writeFile's
                //write() to the right interface.
                var textWrite = function (contents) {
                    return write(fileName, contents);
                };
                textWrite.asModule = function (moduleName, contents) {
                    return write.asModule(moduleName, fileName, contents);
                };

                text.write(pluginName, nonStripName, textWrite, config);
            }, config);
        }
    };

    if (masterConfig.env === 'node' || (!masterConfig.env &&
            typeof process !== "undefined" &&
            process.versions &&
            !!process.versions.node &&
            !process.versions['node-webkit'])) {
        //Using special require.nodeRequire, something added by r.js.
        fs = require.nodeRequire('fs');

        text.get = function (url, callback, errback) {
            try {
                var file = fs.readFileSync(url, 'utf8');
                //Remove BOM (Byte Mark Order) from utf8 files if it is there.
                if (file.indexOf('\uFEFF') === 0) {
                    file = file.substring(1);
                }
                callback(file);
            } catch (e) {
                if (errback) {
                    errback(e);
                }
            }
        };
    } else if (masterConfig.env === 'xhr' || (!masterConfig.env &&
            text.createXhr())) {
        text.get = function (url, callback, errback, headers) {
            var xhr = text.createXhr(), header;
            xhr.open('GET', url, true);

            //Allow plugins direct access to xhr headers
            if (headers) {
                for (header in headers) {
                    if (headers.hasOwnProperty(header)) {
                        xhr.setRequestHeader(header.toLowerCase(), headers[header]);
                    }
                }
            }

            //Allow overrides specified in config
            if (masterConfig.onXhr) {
                masterConfig.onXhr(xhr, url);
            }

            xhr.onreadystatechange = function (evt) {
                var status, err;
                //Do not explicitly handle errors, those should be
                //visible via console output in the browser.
                if (xhr.readyState === 4) {
                    status = xhr.status || 0;
                    if (status > 399 && status < 600) {
                        //An http 4xx or 5xx error. Signal an error.
                        err = new Error(url + ' HTTP status: ' + status);
                        err.xhr = xhr;
                        if (errback) {
                            errback(err);
                        }
                    } else {
                        callback(xhr.responseText);
                    }

                    if (masterConfig.onXhrComplete) {
                        masterConfig.onXhrComplete(xhr, url);
                    }
                }
            };
            xhr.send(null);
        };
    } else if (masterConfig.env === 'rhino' || (!masterConfig.env &&
            typeof Packages !== 'undefined' && typeof java !== 'undefined')) {
        //Why Java, why is this so awkward?
        text.get = function (url, callback) {
            var stringBuffer, line,
                encoding = "utf-8",
                file = new java.io.File(url),
                lineSeparator = java.lang.System.getProperty("line.separator"),
                input = new java.io.BufferedReader(new java.io.InputStreamReader(new java.io.FileInputStream(file), encoding)),
                content = '';
            try {
                stringBuffer = new java.lang.StringBuffer();
                line = input.readLine();

                // Byte Order Mark (BOM) - The Unicode Standard, version 3.0, page 324
                // http://www.unicode.org/faq/utf_bom.html

                // Note that when we use utf-8, the BOM should appear as "EF BB BF", but it doesn't due to this bug in the JDK:
                // http://bugs.sun.com/bugdatabase/view_bug.do?bug_id=4508058
                if (line && line.length() && line.charAt(0) === 0xfeff) {
                    // Eat the BOM, since we've already found the encoding on this file,
                    // and we plan to concatenating this buffer with others; the BOM should
                    // only appear at the top of a file.
                    line = line.substring(1);
                }

                if (line !== null) {
                    stringBuffer.append(line);
                }

                while ((line = input.readLine()) !== null) {
                    stringBuffer.append(lineSeparator);
                    stringBuffer.append(line);
                }
                //Make sure we return a JavaScript string and not a Java string.
                content = String(stringBuffer.toString()); //String
            } finally {
                input.close();
            }
            callback(content);
        };
    } else if (masterConfig.env === 'xpconnect' || (!masterConfig.env &&
            typeof Components !== 'undefined' && Components.classes &&
            Components.interfaces)) {
        //Avert your gaze!
        Cc = Components.classes;
        Ci = Components.interfaces;
        Components.utils['import']('resource://gre/modules/FileUtils.jsm');
        xpcIsWindows = ('@mozilla.org/windows-registry-key;1' in Cc);

        text.get = function (url, callback) {
            var inStream, convertStream, fileObj,
                readData = {};

            if (xpcIsWindows) {
                url = url.replace(/\//g, '\\');
            }

            fileObj = new FileUtils.File(url);

            //XPCOM, you so crazy
            try {
                inStream = Cc['@mozilla.org/network/file-input-stream;1']
                           .createInstance(Ci.nsIFileInputStream);
                inStream.init(fileObj, 1, 0, false);

                convertStream = Cc['@mozilla.org/intl/converter-input-stream;1']
                                .createInstance(Ci.nsIConverterInputStream);
                convertStream.init(inStream, "utf-8", inStream.available(),
                Ci.nsIConverterInputStream.DEFAULT_REPLACEMENT_CHARACTER);

                convertStream.readString(inStream.available(), readData);
                convertStream.close();
                inStream.close();
                callback(readData.value);
            } catch (e) {
                throw new Error((fileObj && fileObj.path || '') + ': ' + e);
            }
        };
    }
    return text;
});

define('text!../configs/indexeddb/global_users.json',[],function () { return '{\n  "db_name": "global_users",\n  "table_descriptions": [{\n    "table_name": "global_users",\n    "table_parameter": {"keyPath": "user_id"}\n  }]\n}';});

define('indexeddb', [
        'async_core',
        'throw_event_core',
        'extend_core',
        //
        'event_bus',
        //
        'text!../configs/indexeddb/global_users.json'
    ],
    function(async_core,
             throw_event_core,
             extend_core,
             //
             event_bus,
             //
             global_users) {

        var indexeddb = function() {
            this.defaultVersion = 1;
            this.STATES = {
                READY: 1
            };
            this.state = this.STATES.READY;
            this.openDatabases = {};
            this.addEventListeners();
        };

        indexeddb.prototype = {

            onSetUserId: function(user_id) {
                this.user_id = user_id;
            },

            addEventListeners: function() {
                var _this = this;
                _this.removeEventListeners();
                event_bus.on('setUserId', _this.onSetUserId, _this);
            },

            removeEventListeners: function() {
                var _this = this;
                event_bus.off('setUserId', _this.onSetUserId);
            },
            // database for credentials for each user
            globalUsersDatabaseDescription: JSON.parse(global_users),

            isTableInTables: function(db_name, table_name) {
                var has = false;
                if (this.openDatabases[db_name] && this.openDatabases[db_name].db) {
                    has = this.openDatabases[db_name].db.objectStoreNames.contains(table_name);
                }
                return has;
            },

            onOpenSuccess: function(options, callback, event) {
                if (!this.openDatabases[options.db_name]) {
                    this.openDatabases[options.db_name] = {};
                }
                if (event && event.target) {
                    this.openDatabases[options.db_name].db = event.target.result;
                }
                this.openDatabases[options.db_name].options = options;
                callback(null);
            },

            onOpenError: function(options, callback, event) {
                event.currentTarget.error.options = options;
                callback(event.currentTarget.error);
            },

            onOpenUpgrade: function(options, callback, event) {
                var db = event.target.result;

                // only for provided tables !
                options.table_descriptions.forEach(function(table_description) {
                    if (db.objectStoreNames.contains(table_description.table_name)) {
                        db.deleteObjectStore(table_description.table_name);
                    }
                    var objectStore = db.createObjectStore(table_description.table_name, table_description.table_parameter);
                    if (table_description.table_indexes) {
                        table_description.table_indexes.forEach(function(table_index) {
                            objectStore.createIndex(
                                table_index.indexName, table_index.indexKeyPath, table_index.indexParameter
                            );
                        });
                    }
                });
            },

            onOpenBlocked: function(options, callback, event) {
                event.currentTarget.error.options = options;
                callback(event.currentTarget.error);
            },

            _proceedOpen: function(options, version, callback) {
                var _this = this;
                var openRequest = indexedDB.open(options.db_name, version);
                openRequest.onsuccess = _this.onOpenSuccess.bind(_this, options, callback);
                openRequest.onerror = _this.onOpenError.bind(_this, options, callback);
                openRequest.onupgradeneeded = _this.onOpenUpgrade.bind(_this, options, callback);
                openRequest.onblocked = _this.onOpenBlocked.bind(_this, options, callback);
            },

            open: function(options, force, callback) {
                var _this = this;

                if (_this.canNotProceed(callback)) {
                    return;
                }

                if (options.db_name !== _this.globalUsersDatabaseDescription.db_name) {
                    _this.getGlobalUser(_this.user_id, function(err, globalUserInfo) {
                        if (err) {
                            callback(err);
                            return;
                        }
                        var version = globalUserInfo.db_versions[options.db_name] ?
                            globalUserInfo.db_versions[options.db_name] : _this.defaultVersion;

                        if (_this.openDatabases[options.db_name] &&
                            _this.openDatabases[options.db_name].db) {
                            if (force) {
                                version = ++_this.openDatabases[options.db_name].db.version;
                                _this.openDatabases[options.db_name].db.close();
                                _this.openDatabases[options.db_name] = null;
                                // store new version in user credentials
                                _this.putGlobalUserDBVersion(
                                    _this.user_id,
                                    options.db_name,
                                    version,
                                    function(err) {
                                        if (err) {
                                            console.error(err);
                                            return;
                                        }
                                    }
                                )
                            } else {
                                _this.onOpenSuccess(options, callback);
                                return;
                            }
                        }
                        _this._proceedOpen(options, version, callback);
                    });
                } else {
                    _this._proceedOpen(options, _this.defaultVersion, callback);
                }
            },

            addOrUpdateAll: function(options, table_name, addOrUpdateData, callback) {
                var _this = this, cur_table_description;

                if (_this.canNotProceed(callback)) {
                    return;
                }

                cur_table_description = _this.getCurrentTableDescription(options, table_name);

                var executeAddOrUpdateAll = function() {
                    var trans, store;
                    try {
                        trans = _this.openDatabases[options.db_name].db.transaction([cur_table_description.table_name], "readwrite");
                        store = trans.objectStore(cur_table_description.table_name);
                    } catch (error) {
                        error.options = options;
                        error.cur_table_description = cur_table_description;
                        callback(error);
                        return;
                    }

                    _this.async_eachSeries(addOrUpdateData, function(addOrPut, _callback) {
                        var addOrUpdateCursor;
                        try {
                            addOrUpdateCursor = store.openCursor(IDBKeyRange.only(addOrPut[cur_table_description.table_parameter.keyPath]));
                        } catch (error) {
                            error.options = options;
                            error.cur_table_description = cur_table_description;
                            callback(error);
                            return;
                        }
                        addOrUpdateCursor.onsuccess = function(event) {
                            if (event.target.result) {
                                // Update
                                var updateRequest = event.target.result.update(addOrPut);
                                updateRequest.onsuccess = function() {
                                    _callback();
                                };
                                updateRequest.onerror = function(e) {
                                    _callback(e.currentTarget.error);
                                };
                            } else {
                                // Add
                                var addRequest = store.add(addOrPut);
                                addRequest.onsuccess = function() {
                                    _callback();
                                };
                                addRequest.onerror = function(e) {
                                    _callback(e.currentTarget.error);
                                };
                            }
                        };
                        addOrUpdateCursor.onerror = function(e) {
                            _callback(e.currentTarget.error);
                        };
                    }, function(err) {
                        if (err) {
                            err.options = options;
                            err.cur_table_description = cur_table_description;
                            callback(err);
                        } else {
                            callback(null);
                        }
                    });
                };

                var _isTableInTables = _this.isTableInTables(options.db_name, cur_table_description.table_name);
                if (_this.openDatabases[options.db_name] && _isTableInTables) {
                    executeAddOrUpdateAll();
                } else {
                    _this.open(
                        options,
                        !_isTableInTables,
                        function(err, upgraded) {
                            if (err) {
                                callback(err, upgraded);
                            } else {
                                executeAddOrUpdateAll();
                            }
                        }
                    );
                }
            },

            getAll: function(options, table_name, callback) {
                var _this = this, cur_table_description;

                if (_this.canNotProceed(callback)) {
                    return;
                }

                cur_table_description = _this.getCurrentTableDescription(options, table_name);

                var _isTableInTables = _this.isTableInTables(options.db_name, cur_table_description.table_name);
                if (_this.openDatabases[options.db_name] && _isTableInTables) {
                    _this._executeGetAll(options, cur_table_description.table_name, callback);
                } else {
                    _this.open(
                        options,
                        !_isTableInTables,
                        function(err, upgraded) {
                            if (err) {
                                callback(err, upgraded);
                            } else {
                                _this._executeGetAll(options, cur_table_description.table_name, callback);
                            }
                        }
                    );
                }
            },

            _executeGetAll: function(options, table_name, callback) {
                var _this = this, trans, store, openRequest, returnData = [];
                try {
                    trans = _this.openDatabases[options.db_name].db.transaction([table_name], "readonly");
                    store = trans.objectStore(table_name);
                    openRequest = store.openCursor();
                } catch (error) {
                    error.options = options;
                    error.table_name = table_name;
                    callback(error);
                    return;
                }

                openRequest.onsuccess = function(e) {
                    var result = e.target.result;
                    if (!!result === false) {
                        callback(null, returnData);
                        return;
                    }
                    returnData.push(result.value);

                    result.continue();
                };

                openRequest.onerror = function(e) {
                    var err = e.currentTarget.error;
                    err.options = options;
                    err.cur_table_description = cur_table_description;
                    callback(err);
                };
            },

            /**
             * open indexedDB table and search through for requested key path
             */
            getByKeyPath: function(options, table_name, getValue, callback) {
                var _this = this, cur_table_description;

                if (_this.canNotProceed(callback)) {
                    return;
                }

                cur_table_description = _this.getCurrentTableDescription(options, table_name);

                var executeGet = function() {
                    var trans, store, result;
                    try {
                        trans = _this.openDatabases[options.db_name].db.transaction([cur_table_description.table_name], "readonly");
                        store = trans.objectStore(cur_table_description.table_name);
                    } catch (error) {
                        error.options = options;
                        error.cur_table_description = cur_table_description;
                        callback(error);
                        return;
                    }

                    var getCursor;
                    try {
                        getCursor = store.openCursor(IDBKeyRange.only(getValue));
                    } catch (error) {
                        error.options = options;
                        error.cur_table_description = cur_table_description;
                        callback(error);
                        return;
                    }
                    getCursor.onsuccess = function(event) {
                        if (event.target.result) {
                            result = event.target.result.value;
                        }
                        callback(null, result);
                    };
                    getCursor.onerror = function(e) {
                        var err = e.currentTarget.error;
                        err.options = options;
                        err.cur_table_description = cur_table_description;
                        callback(err);
                    };
                };

                var _isTableInTables = _this.isTableInTables(options.db_name, cur_table_description.table_name);
                if (_this.openDatabases[options.db_name] && _isTableInTables) {
                    executeGet();
                } else {
                    _this.open(
                        options,
                        !_isTableInTables,
                        function(err, upgraded) {
                            if (err) {
                                callback(err, upgraded);
                            } else {
                                executeGet();
                            }
                        }
                    );
                }
            },

            getByKeysPath: function(options, table_name, getValues, nullWrapper, callback) {
                var _this = this, cur_table_description;

                if (_this.canNotProceed(callback)) {
                    return;
                }

                cur_table_description = _this.getCurrentTableDescription(options, table_name);

                var executeGet = function() {
                    var trans, store;
                    try {
                        trans = _this.openDatabases[options.db_name].db.transaction([cur_table_description.table_name], "readonly");
                        store = trans.objectStore(cur_table_description.table_name);
                    } catch (error) {
                        error.options = options;
                        error.cur_table_description = cur_table_description;
                        callback(error);
                        return;
                    }

                    var getCursor;
                    var _array = [];
                    trans.oncomplete = function() {
                        callback(null, _array);
                    };
                    getValues.forEach(function(getValue) {
                        try {
                            getCursor = store.openCursor(IDBKeyRange.only(getValue));
                        } catch (error) {
                            callback(error);
                            return;
                        }
                        getCursor.onsuccess = function(event) {
                            var cursor = event.target.result;
                            if (!cursor) {
                                if (nullWrapper) {
                                    _array.push(nullWrapper(getValue));
                                }
                                return;
                            }
                            _array.push(cursor.value);
                        };
                        getCursor.onerror = function(e) {
                            var err = e.currentTarget.error;
                            err.options = options;
                            err.cur_table_description = cur_table_description;
                            callback(err);
                        };
                    });
                };

                var _isTableInTables = _this.isTableInTables(options.db_name, cur_table_description.table_name);
                if (_this.openDatabases[options.db_name] && _isTableInTables) {
                    executeGet();
                } else {
                    _this.open(
                        options,
                        !_isTableInTables,
                        function(err, upgraded) {
                            if (err) {
                                callback(err, upgraded);
                            } else {
                                executeGet();
                            }
                        }
                    );
                }
            },

            addAll: function(options, table_name, toAdd, callback) {
                var _this = this, cur_table_description;

                if (_this.canNotProceed(callback)) {
                    return;
                }

                cur_table_description = _this.getCurrentTableDescription(options, table_name);

                var _isTableInTables = _this.isTableInTables(options.db_name, cur_table_description.table_name);
                if (_this.openDatabases[options.db_name] && _isTableInTables) {
                    _this._executeAddAll(options, cur_table_description.table_name, toAdd, callback);
                } else {
                    _this.open(
                        options,
                        !_isTableInTables,
                        function(err, upgraded) {
                            if (err) {
                                callback(err, upgraded);
                            } else {
                                _this._executeAddAll(options, cur_table_description.table_name, toAdd, callback);
                            }
                        }
                    );
                }
            },

            _executeAddAll: function(options, table_name, toAdd, callback) {
                var _this = this, trans, store;
                if (_this.canNotProceed(callback)) {
                    return;
                }

                try {
                    trans = _this.openDatabases[options.db_name].db.transaction([table_name], "readwrite");
                    store = trans.objectStore(table_name);
                } catch (error) {
                    error.options = options;
                    error.table_name = table_name;
                    callback(error);
                    return;
                }

                _this.async_eachSeries(toAdd, function(curAdd, _callback) {
                    if (_this.canNotProceed(callback)) {
                        return;
                    }
                    var putRequest = store.put(curAdd);
                    putRequest.onerror = function(e) {
                        _callback(e.currentTarget.error);
                    };
                    putRequest.onsuccess = function() {
                        if (_this.canNotProceed(callback)) {
                            return;
                        }
                        _callback();
                    };
                }, function(err) {
                    if (err) {
                        err.options = options;
                        err.table_name = table_name;
                        callback(err);
                    } else {
                        if (_this.canNotProceed(callback)) {
                            return;
                        }
                        callback(null);
                    }
                });
            },

            getCurrentTableDescription: function(options, table_name) {
                var found_table_description;
                if (table_name) {
                    options.table_descriptions.every(function(table_description) {
                        if (table_description.table_name === table_name) {
                            found_table_description = table_description;
                        }
                        return !found_table_description;
                    });
                }
                return found_table_description ? found_table_description : options.table_descriptions[0];
            },

            canNotProceed: function(callback) {
                var _this = this;
                if (_this.state !== _this.STATES.READY) {
                    callback(new Error('ErrorState'));
                    return true;
                }
                return false;
            },

            getGlobalUserCredentials: function(userName, userPassword, callback) {
                var _this = this;
                _this.getAll(_this.globalUsersDatabaseDescription, null, function(getAllErr, allUsers) {
                    if (getAllErr) {
                        callback(getAllErr);
                        return;
                    }

                    var userCredentials;
                    allUsers.every(function(_user) {
                        if (_user.userName === userName) {
                            if (userPassword && _user.userPassword === userPassword) {
                                userCredentials = _user;
                            } else {
                                userCredentials = _user;
                            }
                        }
                        return !userCredentials;
                    });

                    callback(null, userCredentials);
                });
            },

            addGlobalUser: function(user_id, userName, userPassword, callback) {
                var _this = this;
                _this.getGlobalUserCredentials(userName, null, function(getAllErr, userCredentials) {
                    if (getAllErr) {
                        callback(getAllErr);
                        return;
                    }

                    if (userCredentials) {
                        callback(new Error('User with such username is already exist!'));
                        return;
                    }

                    var accountCredentials = {
                        user_id: user_id,
                        userName: userName,
                        userPassword: userPassword,
                        db_versions: {}
                    };
                    
                    _this.saveGlobalUser(accountCredentials, callback);
                });
            },

            putGlobalUserDBVersion: function(user_id, db_name, db_version, callback) {
                var _this = this;
                _this.getGlobalUser(user_id, function(err, globalUserInfo) {
                    if (err) {
                        callback(err);
                        return;
                    }

                    globalUserInfo.db_versions[db_name] = db_version;
                    _this.saveGlobalUser(globalUserInfo, callback);
                });
            },

            getGlobalUser: function(user_id, callback) {
                var _this = this;
                _this.getByKeyPath(
                    _this.globalUsersDatabaseDescription,
                    null,
                    user_id,
                    function(getError, globalUserInfo) {
                        if (getError) {
                            callback(getError);
                            return;
                        }

                        callback(null, globalUserInfo);
                    }
                );
            },
            
            saveGlobalUser: function(globalUserInfo, callback) {
                var _this = this;
                _this.addOrUpdateAll(
                    _this.globalUsersDatabaseDescription,
                    null,
                    [
                        globalUserInfo
                    ],
                    function(error) {
                        if (error) {
                            callback(error);
                            return;
                        }

                        callback(null);
                    }
                );
            }
        };
        extend_core.prototype.inherit(indexeddb, async_core);
        extend_core.prototype.inherit(indexeddb, throw_event_core);

        return new indexeddb();
    }
);
define('render_layout_core', [
        'indexeddb',
        'async_core',
        'dom_core',
        'extend_core'
    ],
    function(indexeddb,
             async_core,
             dom_core,
             extend_core) {

        var render_layout_core = function() {
        };
        render_layout_core.prototype = {

            __class_name: "render_layout_core",

            renderLayout: function(options, callback) {
                var _this = this;
                _this.iconsArray = [];
                _this.loadBodyConfig(null, options, function(confErr) {
                    _this.loadBodyData(confErr, options, function(dataErr, options, data) {
                        _this.fillBody(dataErr, options, data, function(templErr) {
                            if (templErr) {
                                console.error(templErr);
                                return;
                            }

                            // success
                            if (callback) {
                                callback();
                            }
                        });
                    });

                });
            },

            loadBodyConfig: function(_err, options, callback) {
                var _this = this;
                if (_err) {
                    callback(_err);
                    return;
                }

                if (_this.configMap[_this.body_mode] || _this.configIconMap && _this.configIconMap[_this.body_mode]) {

                    if (!_this.configMap[_this.body_mode]) {
                        _this.loadBodyIconConfig(callback);
                        return;
                    }

                    _this.get_JSON_res(_this.configMap[_this.body_mode], function(err, res) {
                        if (err) {
                            callback(err);
                            return;
                        }
                        if (_this.configHandlerMap[_this.body_mode]) {
                            var context = _this.configHandlerContextMap[_this.body_mode] ? _this.configHandlerContextMap[_this.body_mode] : _this;
                            _this.config = _this.configHandlerMap[_this.body_mode].call(context, res);
                        } else {
                            _this.config = res;
                        }
                        if (_this.MODE && _this.body_mode === _this.MODE.USER_INFO_SHOW ||
                            _this.MODE && _this.body_mode === _this.MODE.USER_INFO_EDIT) {
                            _this.module.config = _this.config;
                        }
                        callback();
                    });
                } else {
                    callback();
                }
            },

            loadBodyData: function(_err, options, callback) {
                var _this = this;
                if (_err) {
                    callback(_err);
                    return;
                }

                if (_this.dataMap[_this.body_mode]) {
                    var collectionDescription = _this.dataMap[_this.body_mode];

                    if (_this.module.user) {
                        callback(null, _this.module.user);
                        return;
                    }

                    indexeddb.getAll(collectionDescription, null, function(getAllErr, data) {
                        if (getAllErr) {
                            callback(getAllErr);
                        } else {
                            if (_this.dataHandlerMap[_this.body_mode]) {
                                var context = _this.dataHandlerContextMap[_this.body_mode] ? _this.dataHandlerContextMap[_this.body_mode] : _this;
                                callback(null, options, _this.dataHandlerMap[_this.body_mode].call(context, options, data));
                            } else {
                                callback(null, options, data);
                            }
                        }
                    });
                } else {
                    callback(null, null, options);
                }
            },

            fillBody: function(_err, options, data, callback) {
                var _this = this;
                if (_err) {
                    callback(_err);
                    return;
                }

                var currentTemplate = _this.templateMap[_this.body_mode];
                if (currentTemplate) {
                    _this.elementMap[_this.body_mode].innerHTML = currentTemplate({
                        config: _this.config,
                        mode: _this.body_mode,
                        data: data,
                        options: options,
                        description: _this.description,
                        triple_element_template: _this.triple_element_template,
                        join_locations_template: _this.join_locations_template,
                        location_wrapper_template: _this.location_wrapper_template,
                        button_template: _this.button_template,
                        input_template: _this.input_template,
                        label_template: _this.label_template,
                        textarea_template: _this.textarea_template,
                        select_template: _this.select_template
                    });
                    if (_this.cashBodyElement) {
                        _this.cashBodyElement();
                    }
                }
                if (callback) {
                    callback();
                }
            },


            prepareConfig: function(rawConfig) {
                var byDataLocation = {};
                rawConfig.forEach(function(_config) {
                    if (!_config.location) {
                        return;
                    }
                    if (!byDataLocation[_config.location]) {
                        byDataLocation[_config.location] = {
                            configs: []
                        };
                    }
                    if (!_config.role) {
                        byDataLocation[_config.location].configs.push(_config);
                    } else if (_config.role === 'locationWrapper') {
                        byDataLocation[_config.location].wrapperConfig = _config;
                    }
                });

                rawConfig.byDataLocation = byDataLocation;
                return rawConfig;
            }
        };
        extend_core.prototype.inherit(render_layout_core, async_core);
        extend_core.prototype.inherit(render_layout_core, dom_core);

        return render_layout_core;
    }
);
define('switcher_core',
    [],function() {

        var switcher_core = function() {
        };

        switcher_core.prototype = {

            __class_name: "switcher_core",

            optionsDefinition: function(_module, mode) {
                var _this = this;

                switch (mode) {
                    case _module.body.MODE.SETTINGS:
                        _this.previousModeSwitcher = _module.body.MODE.MESSAGES;
                        _module.currentPaginationOptions = _module.settings_PaginationOptions;
                        _module.currentGoToOptions = _module.settings_GoToOptions;
                        _module.current_Extra_Toolbar_Options = _module.settings_ExtraToolbarOptions;
                        _module.currnetFilterOptions = _module.settings_FilterOptions;
                        _module.currentListOptions = _module.settings_ListOptions;
                        break;
                    case _module.body.MODE.MESSAGES:
                        _this.previousModeSwitcher = _module.body.MODE.MESSAGES;
                        _module.currentPaginationOptions = _module.messages_PaginationOptions;
                        _module.currentGoToOptions = _module.messages_GoToOptions;
                        _module.current_Extra_Toolbar_Options = _module.messages_ExtraToolbarOptions;
                        _module.currnetFilterOptions = _module.messages_FilterOptions;
                        _module.currentListOptions = _module.messages_ListOptions;
                        break;
                    case _module.body.MODE.CONTACT_LIST:
                        _this.previousModeSwitcher = _module.body.MODE.MESSAGES;
                        _module.currentPaginationOptions = _module.contactList_PaginationOptions;
                        _module.currentGoToOptions = _module.contactList_GoToOptions;
                        _module.current_Extra_Toolbar_Options = _module.contactList_ExtraToolbarOptions;
                        _module.currnetFilterOptions = _module.contactList_FilterOptions;
                        _module.currentListOptions = _module.contactList_ListOptions;
                        break;
                    case _module.body.MODE.LOGGER:
                        _this.previousModeSwitcher = _module.body.MODE.LOGGER;
                        _module.currentPaginationOptions = _module.logger_PaginationOptions;
                        _module.currentGoToOptions = _module.logger_GoToOptions;
                        _module.current_Extra_Toolbar_Options = _module.logger_ExtraToolbarOptions;
                        _module.currnetFilterOptions = _module.logger_FilterOptions;
                        _module.currentListOptions = _module.logger_ListOptions;
                        break;
                    case _module.MODE.CHATS:
                        _this.previousModeSwitcher = _module.MODE.CHATS;
                        _module.currentPaginationOptions = _module.chats_PaginationOptions;
                        _module.currentGoToOptions = _module.chats_GoToOptions;
                        _module.current_Extra_Toolbar_Options = _module.chats_ExtraToolbarOptions;
                        _module.currnetFilterOptions = _module.chats_FilterOptions;
                        _module.currentListOptions = _module.chats_ListOptions;
                        break;
                    case _module.MODE.CREATE_CHAT:
                        _module.current_Extra_Toolbar_Options = _module.createChat_ExtraToolbarOptions;
                        _module.currnetFilterOptions = _module.createChat_FilterOptions;
                        _module.currentPaginationOptions = _module.createChat_PaginationOptions;
                        _module.currentGoToOptions = _module.createChat_GoToOptions;
                        break;
                    case _module.MODE.JOIN_CHAT:
                        _module.current_Extra_Toolbar_Options = _module.joinChat_ExtraToolbarOptions;
                        _module.currnetFilterOptions = _module.joinChat_FilterOptions;
                        _module.currentPaginationOptions = _module.joinChat_PaginationOptions;
                        _module.currentGoToOptions = _module.joinChat_GoToOptions;
                        break;
                    case _module.MODE.BLOGS:
                        _this.previousModeSwitcher = _module.MODE.BLOGS;
                        _module.currentPaginationOptions = _module.blogs_PaginationOptions;
                        _module.currentGoToOptions = _module.blogs_GoToOptions;
                        _module.current_Extra_Toolbar_Options = _module.blogs_ExtraToolbarOptions;
                        _module.currnetFilterOptions = _module.blogs_FilterOptions;
                        _module.currentListOptions = _module.blogs_ListOptions;
                        break;
                    case _module.MODE.CREATE_BLOG:
                        _module.current_Extra_Toolbar_Options = _module.createBlog_ExtraToolbarOptions;
                        _module.currnetFilterOptions = _module.createBlog_FilterOptions;
                        _module.currentPaginationOptions = _module.createBlog_PaginationOptions;
                        _module.currentGoToOptions = _module.createBlog_GoToOptions;
                        break;
                    case _module.MODE.JOIN_BLOG:
                        _module.current_Extra_Toolbar_Options = _module.joinBlog_ExtraToolbarOptions;
                        _module.currnetFilterOptions = _module.joinBlog_FilterOptions;
                        _module.currentPaginationOptions = _module.joinBlog_PaginationOptions;
                        _module.currentGoToOptions = _module.joinBlog_GoToOptions;
                        break;
                    case _module.MODE.USERS:
                        _module.current_Extra_Toolbar_Options = _module.users_ExtraToolbarOptions;
                        _module.currnetFilterOptions = _module.users_FilterOptions;
                        _module.currentPaginationOptions = _module.users_PaginationOptions;
                        _module.currentGoToOptions = _module.users_GoToOptions;
                        _module.currentListOptions = _module.users_ListOptions;
                        break;
                    case _module.MODE.JOIN_USER:
                        _module.current_Extra_Toolbar_Options = _module.joinUser_ExtraToolbarOptions;
                        _module.currnetFilterOptions = _module.joinUser_FilterOptions;
                        _module.currentPaginationOptions = _module.joinUser_PaginationOptions;
                        _module.currentGoToOptions = _module.joinUser_GoToOptions;
                        _module.currentListOptions = _module.joinUser_ListOptions;
                        break;
                    case _module.MODE.USER_INFO_EDIT:
                        _module.current_Extra_Toolbar_Options = _module.userInfoEdit_ExtraToolbarOptions;
                        _module.currnetFilterOptions = _module.userInfoEdit_FilterOptions;
                        _module.currentPaginationOptions = _module.userInfoEdit_PaginationOptions;
                        _module.currentGoToOptions = _module.userInfoEdit_GoToOptions;
                        break;
                    case _module.MODE.USER_INFO_SHOW:
                        _module.current_Extra_Toolbar_Options = _module.userInfoShow_ExtraToolbarOptions;
                        _module.currnetFilterOptions = _module.userInfoShow_FilterOptions;
                        _module.currentPaginationOptions = _module.userInfoShow_PaginationOptions;
                        _module.currentGoToOptions = _module.userInfoShow_GoToOptions;
                        break;
                    case _module.MODE.CONNECTIONS:
                        _module.current_Extra_Toolbar_Options = _module.connections_ExtraToolbarOptions;
                        _module.currnetFilterOptions = _module.connections_FilterOptions;
                        _module.currentPaginationOptions = _module.connections_PaginationOptions;
                        _module.currentGoToOptions = _module.connections_GoToOptions;
                        _module.currentListOptions = _module.connections_ListOptions;
                        break;
                }
            },

            toggleShowState: function(_options, toggleObject, _obj) {
                if (_obj.target && _obj.target.dataset.role === "enablePagination") {
                    toggleObject[_options.key] = _obj.target.checked;
                    return;
                }

                if (_obj.target && _obj.target.dataset.role === 'choice') {
                    toggleObject[_options.key] = _obj.target.dataset.toggle === "true";
                    return;
                }

                if (!toggleObject.previousSave) {
                    if (_options.save && _options.save === true) {
                        toggleObject.previousSave = true;
                        toggleObject.previousShow = toggleObject[_options.key];
                    }
                }
                if (_options.restore) {
                    if (toggleObject.previousSave) {
                        toggleObject[_options.key] = toggleObject.previousShow;
                    } else {
                        toggleObject[_options.key] = toggleObject.show;
                    }
                    toggleObject.previousSave = false;
                    return;
                }

                toggleObject[_options.key] = _options.toggle;
            },

            toggleText: function(_options, toggleObject, element) {
                if (!toggleObject.previousSave) {
                    if (_options.save && _options.save === true) {
                        toggleObject.previousSave = true;
                        toggleObject[_options.key] = element.innerHTML;
                    }
                }
                if (_options.restore) {
                    if (toggleObject.previousSave) {
                       toggleObject.restore = true;
                    }
                    toggleObject.previousSave = false;
                }
            },

            tableDefinition: function(_module, mode){
                var _this = this, table_name;

                switch (mode) {
                    case _module.body.MODE.MESSAGES:
                        table_name = ['messages'];
                        break;
                    case _module.body.MODE.LOGGER:
                        table_name = ['log_messages'];
                        break;
                }
                return table_name;
            },

            toggleActiveButton: function(btnsArray, mode) {
                btnsArray.forEach(function(_button){
                    if (_button.dataset.mode_to === mode) {
                        _button.classList.add('activeTollbar');
                    } else {
                        _button.classList.remove('activeTollbar');
                    }
                })
            },

            toggleShowSplitterItems: function(show, splitter_items) {
                if(splitter_items){
                    if(show){
                        splitter_items.classList.remove("hidden");
                        splitter_items.classList.add("visible");
                    } else {
                        splitter_items.classList.add("hidden");
                        splitter_items.classList.remove("visible");
                    }
                }
            }
        };

        return switcher_core;
    }
);
define('text!../templates/spinner_template.ejs',[],function () { return '<div class="flex-just-center">\n    <svg width="150" height="150">\n        <path fill="none" stroke="#FF00FF" stroke-width="3" stroke-dasharray=\'100\' stroke-dashoffset=\'200\' d="M10,122.5 Q107.4,103.8 75,10" >\n            <animate  attributeName="stroke-dashoffset" from="200" to="0" dur="2s" repeatCount="indefinite"/>\n        </path>\n        <path fill="none" stroke="#00FF00" stroke-width="3" stroke-dasharray=\'100\' stroke-dashoffset=\'200\' d="M140,122.5 Q42.5,103.8 75,10" >\n            <animate  attributeName="stroke-dashoffset" from="0" to="200" dur="2s" repeatCount="indefinite"/>\n        </path>\n        <path fill="none" stroke="#FFFF00" stroke-width="3" stroke-dasharray=\'100\' stroke-dashoffset=\'200\' d="M140,122.5 Q75.4,47.5 10,122.5" >\n            <animate  attributeName="stroke-dashoffset" from="200" to="0" dur="2s" repeatCount="indefinite"/>\n        </path>\n    </svg>\n</div>\n\n';});

define('text!../templates/horizontal_spinner_template.ejs',[],function () { return '    <svg width="100%" height="30">\n        <circle r="10" cx="25" cy="20" fill="#0000ff" >\n            <animate attributeName="cx" from="0" to="350" dur="2s" repeatCount="indefinite"/>\n            <animate attributeName="fill" values="00FF00;0000FF;FF00FF;0000FF;00FF00;" dur="2s" repeatCount="indefinite" />\n        </circle>\n        <circle r="9" cx="-10" cy="20" fill="red" >\n            <animate attributeName="cx" from="0" to="350" dur="2s"  begin="0.15s" repeatCount="indefinite"/>\n            <animate attributeName="fill" values="0000FF;00FF00;FFFF00;00FF00;0000FF;" dur="2s" repeatCount="indefinite" />\n            <animate attributeName="opacity" values="0.7" dur="2s" repeatCount="indefinite"></animate>\n        </circle>\n        <circle r="8" cx="-10" cy="20" fill="red" >\n            <animate attributeName="cx" from="0" to="350" dur="2s"  begin="0.3s" repeatCount="indefinite"/>\n            <animate attributeName="fill" values="FF0000;FFFF00;0080FF;FFFF00;FF0000;" dur="2s" repeatCount="indefinite" />\n            <animate attributeName="opacity" values="0.5" dur="2s" repeatCount="indefinite"></animate>\n        </circle>\n    </svg>';});

define('overlay_core', [
        'template_core',
        'extend_core',
        //
        'text!../templates/spinner_template.ejs',
        'text!../templates/horizontal_spinner_template.ejs'
    ],
    function(
        template_core,
        extend_core,
        //
        spinner_template,
        horizontal_spinner_template) {

        var overlay_core = function() {};

        overlay_core.prototype = {

            __class_name: "overlay_core",

            toggleWaiter: function(show) {
                var _this = this;

                _this.waiter_outer_container = document.querySelector('[data-role="waiter_outer_container"]');
                _this.waiter_outer_container.classList[(show === true ? 'remove' : 'add')]('hide');
            },

            showSpinner: function(element){
                var _this = this;
                element.innerHTML = _this.spinner_template();
            },

            showHorizontalSpinner: function(element){
                var _this = this;
                element.innerHTML = _this.horizontal_spinner_template();
            }
        };

        extend_core.prototype.inherit(overlay_core, template_core);

        overlay_core.prototype.spinner_template = overlay_core.prototype.template(spinner_template);
        overlay_core.prototype.horizontal_spinner_template = overlay_core.prototype.template(horizontal_spinner_template);

        return overlay_core;
    }
);
define('users_bus', [
        'indexeddb',
        'event_bus'
    ],
    function(indexeddb,
             event_bus) {

        var users_bus = function() {
            this.user_id = null;
            // database for all user content
            // db_name - depends from user id
            this.userDatabaseDescription = {
                "table_descriptions": [{
                    "table_name": 'users',
                    "table_indexes": [{
                        "indexName": 'user_ids',
                        "indexKeyPath": 'user_ids',
                        "indexParameter": {multiEntry: true}
                    }, {
                        "indexName": 'chat_ids',
                        "indexKeyPath": 'chat_ids',
                        "indexParameter": {multiEntry: true}
                    }],
                    "table_parameter": {"keyPath": "user_id"}
                }, {
                    "table_name": 'information',
                    "table_indexes": [{
                        "indexName": 'user_ids',
                        "indexKeyPath": 'user_ids',
                        "indexParameter": {multiEntry: true}
                    }, {
                        "indexName": 'chat_ids',
                        "indexKeyPath": 'chat_ids',
                        "indexParameter": {multiEntry: true}
                    }],
                    "table_parameter": {"keyPath": "user_id"}
                }]
            }
        };

        users_bus.prototype = {

            setUserId: function(user_id) {
                this.user_id = user_id;
                this.userDatabaseDescription.db_name = user_id;
                event_bus.trigger('setUserId', user_id);
            },

            getUserId: function() {
                return this.user_id;
            },

            excludeUser: function(options, user_ids) {
                var _this = this;
                var index = user_ids.indexOf(_this.getUserId());
                if (index !== -1) {
                    user_ids.splice(index, 1);
                }
                return user_ids;
            },

            getContactsInfo: function(options, user_ids, _callback) {
                if (user_ids.length) {
                    indexeddb.getByKeysPath(
                        this.userDatabaseDescription,
                        'users',
                        user_ids,
                        function(user_id) {
                            return {
                                user_id: user_id,
                                userName: '-//-//-//-'
                            }
                        },
                        function(getError, contactsInfo) {
                            if (getError) {
                                if (_callback) {
                                    _callback(getError);
                                } else {
                                    console.error(getError);
                                }
                                return;
                            }

                            if (_callback) {
                                _callback(null, contactsInfo);
                            }
                        }
                    );
                } else {
                    _callback(null, null);
                }
            },

            getMyInfo: function(options, _callback) {
                var _this = this;
                indexeddb.getByKeyPath(
                    _this.userDatabaseDescription,
                    'information',
                    _this.user_id,
                    function(getError, userInfo) {
                        if (getError) {
                            if (_callback) {
                                _callback(getError);
                            } else {
                                console.error(getError);
                            }
                            return;
                        }

                        if (_callback) {
                            _callback(null, options, userInfo);
                        }
                    }
                );
            },

            getUserDescription: function(options, callback) {
                this.getMyInfo(options, function(error, _options, userInfo) {
                    if (error) {
                        if (callback) {
                            callback(error);
                        } else {
                            console.error(error);
                        }
                        return;
                    }

                    if (callback) {
                        callback(null, {
                            user_id: userInfo.user_id,
                            userName: userInfo.userName
                        });
                    }
                });
            },

            hasInArray: function(_array, item) {
                var found;
                _array.every(function(_item) {
                    if (_item === item) {
                        found = _item;
                    }
                    return !found;
                });
                return found;
            },

            putItemIntoArray: function(arrayName, item, callback) {
                var _this = this;
                _this.getMyInfo({}, function(error, _options, userInfo) {
                    if (error) {
                        callback && callback(error);
                        return;
                    }

                    if (!_this.hasInArray(userInfo[arrayName], item)) {
                        userInfo[arrayName].push(item);
                        _this.saveMyInfo(userInfo, function(err) {
                            callback && callback(err, userInfo);
                        });
                    } else {
                        callback && callback(null, userInfo);
                    }
                });
            },

            putUserIdAndSave: function(user_id, callback) {
                this.putItemIntoArray('user_ids', user_id, callback);
            },

            putChatIdAndSave: function(chat_id, callback) {
                this.putItemIntoArray('chat_ids', chat_id, callback);
            },

            saveMyInfo: function(userInfo, _callback) {
                indexeddb.addOrUpdateAll(
                    this.userDatabaseDescription,
                    'information',
                    [userInfo],
                    _callback
                )
            },

            addNewUserToIndexedDB: function(user_description, callback) {
                indexeddb.addOrUpdateAll(
                    this.userDatabaseDescription,
                    'users',
                    [
                        user_description
                    ],
                    function(error) {
                        if (error) {
                            callback(error);
                            return;
                        }

                        callback(null, user_description);
                    }
                );
            },

            storeNewUser: function(user_id, userName, userPassword, callback) {
                var _this = this;
                indexeddb.addGlobalUser(user_id, userName, userPassword, function(err) {
                    if (err) {
                        callback(err);
                        return;
                    }

                    // TODO use user model
                    var userInfo = {
                        user_id: user_id,
                        userName: userName,
                        userPassword: userPassword,
                        user_ids: [],
                        chat_ids: []
                    };

                    _this.setUserId(user_id); // temp to store user
                    indexeddb.addOrUpdateAll(
                        _this.userDatabaseDescription,
                        'information',
                        [
                            userInfo
                        ],
                        function(err) {
                            _this.setUserId(null); // roll back temp
                            if (err) {
                                callback(err);
                                return;
                            }
                            callback(null, userInfo);
                        }
                    );
                });
            }
        };

        return new users_bus();
    })
;
define('chats_bus', [
        'indexeddb',
        'users_bus',
        'event_bus'
    ],
    function(
        indexeddb,
        users_bus,
        event_bus
    ) {

        var chats_bus = function() {
            // db_name - depends from user id
            this.collectionDescription = {
                "table_descriptions": [{
                    "table_name": 'chats',
                    "table_parameter": {"keyPath": "chat_id"}
                }]
            };
            this.addEventListeners();
        };

        chats_bus.prototype = {

            onSetUserId: function(user_id) {
                this.collectionDescription.db_name = user_id;
            },

            addEventListeners: function() {
                var _this = this;
                _this.removeEventListeners();
                event_bus.on('setUserId', _this.onSetUserId, _this);
            },

            removeEventListeners: function() {
                var _this = this;
                event_bus.off('setUserId', _this.onSetUserId);
            },

            getChats: function(getError, options, chat_ids, _callback) {
                if (chat_ids && chat_ids.length) {
                    indexeddb.getByKeysPath(
                        this.collectionDescription,
                        null,
                        chat_ids,
                        null,
                        function(getError, chatsInfo) {
                            if (getError) {
                                if (_callback){
                                    _callback(getError);
                                } else {
                                    console.error(getError);
                                }
                                return;
                            }

                            if (_callback){
                                _callback(null, options, chatsInfo);
                            }
                        }
                    );
                } else {
                    _callback(null, options, null);
                }
            },

            getChatContacts: function(chat_id, callback) {
                var _this = this;
                indexeddb.getByKeyPath(
                    _this.collectionDescription,
                    null,
                    chat_id,
                    function(getError, chat_description) {
                        if (getError) {
                            console.error(getError);
                            return;
                        }

                        if (chat_description) {
                            chat_description.user_ids = users_bus.excludeUser(null, chat_description.user_ids);
                            users_bus.getContactsInfo(null, chat_description.user_ids, callback);
                        }
                    }
                );
            },

            putChatToIndexedDB: function(chat_description, callback) {
                indexeddb.addOrUpdateAll(
                    this.collectionDescription,
                    null,
                    [
                        chat_description
                    ],
                    function(error) {
                        if (error) {
                            callback(error);
                            return;
                        }

                        callback(null, chat_description);
                    }
                );
            }

        };


        return new chats_bus();
    })
;
define('text!../templates/pagination_template.ejs',[],function () { return '<% _in.config.forEach(function (_config) { %>\n\n    <%= _in.triple_element_template({\n        config: _config,\n        button_template: _in.button_template,\n        input_template: _in.input_template,\n        label_template: _in.label_template,\n        data: _in.data\n    }) %>\n\n<% }) %>';});

define('text!../templates/choice_per_page_template.ejs',[],function () { return '<% _in.config.byDataLocation.choice_page.configs =\n_in.config.byDataLocation.choice_page.configs.filter( function(obj){\nreturn obj.redraw_mode === _in.data.mode_change } ); %>\n\n<% if (_in.config && _in.config.byDataLocation) {\n        for (var locationKey in _in.config.byDataLocation) { %>\n<%= _in.location_wrapper_template({\n    config: _in.config.byDataLocation[locationKey],\n    data: _in.data ? _in.data : {},\n    triple_element_template: _in.triple_element_template,\n    button_template: _in.button_template,\n    input_template: _in.input_template,\n    label_template: _in.label_template\n}) %>\n<% }\n} %>';});

define('text!../templates/element/triple_element_template.ejs',[],function () { return '<% if(_in.config.element === "button") { %>\n<%= _in.button_template(_in) %>\n<% } %>\n\n<% if(_in.config.element === "label") { %>\n<%= _in.label_template(_in) %>\n<% } %>\n\n<% if(_in.config.element === "input") { %>\n<%= _in.input_template(_in) %>\n<% } %>\n\n<% if(_in.config.element === "textarea") { %>\n<%= _in.textarea_template(_in) %>\n<% } %>\n\n<% if(_in.config.element === "select") { %>\n<%= _in.select_template(_in) %>\n<% } %>\n\n<% if(_in.config.element === "svg") { %>\n    <img src="templates/icon/<%= _in.config.icon %>" class="transition-all" data-role="pointer">\n<% } %>\n\n';});

define('text!../templates/element/location_wrapper_template.ejs',[],function () { return '<div class="<%= _in.config.wrapperConfig.classList %>"\n     <% if (_in.config.wrapperConfig.data) { %>  role="<%= _in.config.wrapperConfig.data.role %>" <% } %>>\n    <% _in.config.configs.forEach(function (config) { %>\n    <%= _in.triple_element_template({\n        config: config,\n        data: _in.data,\n        button_template: _in.button_template,\n        input_template: _in.input_template,\n        label_template: _in.label_template,\n        select_template: _in.select_template,\n        textarea_template: _in.textarea_template,\n        description: _in.description,\n        options: _in.options,\n        calcDisplay: _in.calcDisplay,\n        index: _in.index\n    }) %>\n    <% }); %>\n</div>';});

define('text!../templates/element/button_template.ejs',[],function () { return '<% var classList = _in.config.class ? _in.config.class : \'\';%>\n\n<button class="<%= classList %>"\n<% if(_in.config.data) {\n    for (var dataKey in _in.config.data) {\n        if (_in.config.data[dataKey] !== "" && dataKey !== "description") { %>\n                <%= \'data-\' + dataKey + \'=\\"\' + _in.config.data[dataKey] + \'\\"\' %>\n        <% }\n         if (dataKey === "description" && typeof _in.config.data[dataKey] === \'number\') { %>\n        <%= \'data-\' + dataKey + \'=\\"\' + window.getLocText(_in.config.data[dataKey]) + \'\\"\' %>\n         <%}\n    }\n} %>\n<% if (_in.config.disable === true){ %> disabled <%}%>\n\n<% if (_in.config.data && _in.config.data.key_disable && _in.data[_in.config.data.key_disable]) { %>\ndisabled ="<%= _in.data[_in.config.data.key_disabled]%>"\n<% var flag = true;%>\n<% } %>\n\n        <% var display;\n        if (_in.calcDisplay) {\n            display = _in.calcDisplay(_in.config);\n        }\n        if (display !== undefined && display !== true) {%>\n            style="display: none;"\n       <% }%>\n\n    <% if(_in.config.type){ %> type="<%= _in.config.type%>" <%}%>\n    <% if(_in.config.data && _in.config.data.key){ %> data-value="<%= _in.data[_in.config.data.key]%>" <%}%>\n><% if (_in.config.icon) { %>\n  <%  if (flag)  { %>\n    <div class="opacity-05 cursor-not-allowed">   <img src="templates/icon/<%= _in.config.icon %>.svg"></div>\n    <% } else { %>\n    <img src="templates/icon/<%= _in.config.icon %>.svg">\n    <%}%>\n\n<%} %>\n\n    <%if (_in.config.text) {%>\n    <%= typeof _in.config.text === "number" ? window.getLocText(_in.config.text) : _in.config.text %>\n    <%} else {%>\n        <%= \'\'%>\n    <% }%>\n<% if (_in.config.data && _in.config.data.key) { %>\n<%= _in.data[_in.config.data.key] %>\n<%} %>\n\n    <%if (_in.config.data && _in.config.data.description) {%>\n    <img src="templates/icon/description_icon.svg" class="description_icon-position">\n    <%}%>\n\n</button>';});

define('text!../templates/element/label_template.ejs',[],function () { return '<label\n<% if (_in.config.class) { %> class="<%= _in.config.class %>" <% } %>\n<% if (_in.config.name) { %> name="<%= _in.config.name%>" <% } %>\n<% if (_in.config.for) { %> for="<%= _in.config.for%>" <%}%>\n    <% if(_in.config.data) {\n         for (var configDataKey in _in.config.data) {\n            if (_in.config.data[configDataKey] !== "") { %>\n             <%= \'data-\' + configDataKey + \'=\\"\' + _in.config.data[configDataKey] + \'\\"\' %>\n             <%\n            }\n         }\n    } %>\n<% if (_in.config.data && _in.config.data.key) { %>\ndata-<%= _in.config.data.key %> = "<%= _in.data[_in.config.data.key] %>"\n<% } %>\n        ><%if (_in.config.text) {%>\n    <%= typeof _in.config.text === "number" ? window.getLocText(_in.config.text) : _in.config.text %>\n    <%} else {%>\n    <%= \'\'%>\n    <% }%>\n\n    <% if (_in.description && typeof _in.description === \'number\' ) { %>\n    <%= window.getLocText(_in.description)%>\n    <% } else {%>\n    <%= _in.description %>\n    <%}%>\n<% if(_in.config.data && _in.config.data.key) { %>\n<%= _in.data[_in.config.data.key] %><%} %></label>\n';});

define('text!../templates/element/input_template.ejs',[],function () { return '<input type="<%= _in.config.type%>"\n<% if(_in.config.class){ %> class="<%= _in.config.class%>" <%}%>\n        <% if(_in.config.data) {\n            for (var dataKey in _in.config.data) {\n                if (_in.config.data[dataKey] !== "") { %>\n                    <%= \'data-\' + dataKey + \'=\\"\' + _in.config.data[dataKey] + \'\\"\' %>\n                <% }\n            }\n        } %>\n\n\n<% if(_in.config.id){ %> id="<%= _in.config.id%>" <%}%>\n<% if(_in.config.disabled === true){ %> disabled <%}%>\n<% if(_in.config.onkeypress){ %> onkeypress="<%= _in.config.onkeypress %>" <%}%>\n\n<% if (_in.config.type === "checkbox" || _in.config.type === "radio") { %>\n    <% if (_in.config.data.key) { %>\n      <% if(_in.data[_in.config.data.key]) { %>\n      checked\n      <%} %>\n    <% } %>\n<% } %>\n\n\n\n<% if(_in.config.data && _in.config.data.key === "page") { %>\nvalue= "<%= _in.data[_in.config.data.key] %>"\n<%} %>\n\n        <% if(_in.config.name) {\n            if (_in.config.type === "radio" && _in.index !== undefined) { %>\n            name= "<%= _in.config.name + \'_\' +_in.index %>"\n        <% } else { %>\n       name= "<%= _in.config.name %>"\n        <%} } %>\n\n\n<% if (_in.config.type === "text") { %>\n<% if(_in.config.data.key) { %> value= "<%= _in.data[_in.config.data.key] %>" <%} %>\n<% } %>\n >\n<%if (_in.config.text) {%>\n<span><%= typeof _in.config.text === "number" ? window.getLocText(_in.config.text) : _in.config.text %></span>\n<%} else {%>\n<%= \'\'%>\n<% }%>\n</input>\n';});

define('pagination', [
        'throw_event_core',
        'ajax_core',
        'template_core',
        'render_layout_core',
        'indexeddb',
        "switcher_core",
        'overlay_core',
        'extend_core',
        'users_bus',
        'chats_bus',
        //
        'text!../templates/pagination_template.ejs',
        'text!../templates/choice_per_page_template.ejs',
        'text!../templates/element/triple_element_template.ejs',
        'text!../templates/element/location_wrapper_template.ejs',
        'text!../templates/element/button_template.ejs',
        'text!../templates/element/label_template.ejs',
        'text!../templates/element/input_template.ejs'
    ],
    function(throw_event_core,
             ajax_core,
             template_core,
             render_layout_core,
             indexeddb,
             switcher_core,
             overlay_core,
             extend_core,
             users_bus,
             chats_bus,
             //
             pagination_template,
             choice_per_page_template,
             triple_element_template,
             location_wrapper_template,
             button_template,
             label_template,
             input_template) {

        var pagination = function() {
            this.bindMainContexts();
        };

        pagination.prototype = {

            MODE: {
                "PAGINATION": 'PAGINATION',
                "GO_TO": 'GO_TO'
            },

            configMap: {
                "PAGINATION": '/configs/pagination_navbar_config.json',
                "GO_TO": '/configs/choice_per_page_config.json'
            },

            bindMainContexts: function() {
                var _this = this;
                _this.bindedThrowEventRouter = _this.throwEventRouter.bind(_this);
                _this.bindedDataActionRouter = _this.dataActionRouter.bind(_this);
            },

            //override extended throwEvent to use trigger on chat
            throwEvent: function(name, data) {
                this.module && this.module.trigger('throw', name, data);
            },

            cashMainElements: function() {
                var _this = this;
                _this.buttons_show_choice = Array.prototype.slice.call(_this.module.pagination_container.querySelectorAll('[data-role="choice"]'));
            },

            addMainEventListener: function() {
                var _this = this;
                _this.removeMainEventListeners();
                _this.addRemoveListener('add', _this.module.pagination_container, 'click', _this.bindedThrowEventRouter, false);
                _this.addRemoveListener('add', _this.module.pagination_container, 'click', _this.bindedDataActionRouter, false);
            },

            removeMainEventListeners: function() {
                var _this = this;
                _this.addRemoveListener('remove', _this.module.pagination_container, 'click', _this.bindedThrowEventRouter, false);
                _this.addRemoveListener('remove', _this.module.pagination_container, 'click', _this.bindedDataActionRouter, false);
            },

            addContextEventListener: function() {
                var _this = this;
                _this.removeContextEventListeners();
                _this.addRemoveListener('add', _this.module.go_to_container, 'input', _this.bindedDataActionRouter, false);
                _this.addRemoveListener('add', _this.module.go_to_container, 'click', _this.bindedDataActionRouter, false);
            },

            removeContextEventListeners: function() {
                var _this = this;
                _this.addRemoveListener('remove', _this.module.go_to_container, 'input', _this.bindedDataActionRouter, false);
                _this.addRemoveListener('remove', _this.module.go_to_container, 'click', _this.bindedDataActionRouter, false);
            },

            unCashElements: function() {
                var _this = this;
                _this.buttons_show_choice = null;
            },

            render: function(options, _module, mode) {
                var _this = this;
                _this.module = _module;
                _this.bodyOptionsMode = mode;
                if (_this.module.MODE && _this.module.bodyOptions.mode === _this.module.MODE.DETAIL_VIEW) {
                    _this.bodyOptionsMode = _this.module.MODE.CHATS;
                }
                _this.optionsDefinition(_this.module, _this.bodyOptionsMode);
                if (_this.module.currentPaginationOptions.show) {
                    if(!_this.previousShow_Pagination || _this.previous_Pagination_mode !== _this.bodyOptionsMode){
                        _this.showHorizontalSpinner(_this.module.pagination_container);
                        _this.previousShow_Pagination = true;
                        _this.previous_Pagination_mode = _this.bodyOptionsMode;
                        _this.countQuantityPages(function(){
                            _this.disableButtonsPagination();
                            _this.body_mode = _this.MODE.PAGINATION;
                            _this.elementMap = {
                                PAGINATION: _this.module.pagination_container
                            };
                            var data = {
                                firstPage: _this.module.currentPaginationOptions.firstPage,
                                currentPage: _this.module.currentPaginationOptions.currentPage,
                                lastPage:  _this.module.currentPaginationOptions.lastPage,
                                disableBack: _this.module.currentPaginationOptions.disableBack,
                                disableFirst: _this.module.currentPaginationOptions.disableFirst,
                                disableLast: _this.module.currentPaginationOptions.disableLast,
                                disableForward: _this.module.currentPaginationOptions.disableForward
                            };
                            _this.renderLayout(data, function(){
                                _this.addMainEventListener();
                                _this.cashMainElements();
                                _this.renderGoTo();
                                if (_this.buttons_show_choice && _this.module.currentGoToOptions.show) {
                                    _this.buttons_show_choice.forEach(function(btn){
                                        btn.dataset.toggle = false;
                                    });
                                }
                            });
                        });
                    } else {
                        _this.renderGoTo();
                    }

                } else {
                    _this.module.pagination_container.innerHTML = "";
                    _this.module.go_to_container.innerHTML = "";
                    if (_this.buttons_show_choice) {
                        _this.buttons_show_choice.forEach(function(btn){
                            btn.dataset.toggle = true;
                        });
                    }
                    _this.previousShow = false;
                    _this.previousShow_Pagination = false;
                }
            },

            renderGoTo: function() {
                var _this = this;
                if (_this.module.currentGoToOptions.show){
                    if (!_this.previousShow || _this.previous_GoTo_mode !== _this.bodyOptionsMode) {
                        _this.showHorizontalSpinner(_this.module.go_to_container);
                        _this.previousShow = true;
                        _this.previous_GoTo_mode = _this.bodyOptionsMode;
                        _this.buttons_show_choice.forEach(function(btn){
                            btn.dataset.toggle = false;
                        });
                        _this.elementMap = {
                            GO_TO: _this.module.go_to_container
                        };
                        var data = {
                            mode_change: _this.module.currentGoToOptions.mode_change,
                            rteChoicePage: _this.module.currentGoToOptions.rteChoicePage,
                            page: _this.module.currentGoToOptions.page
                        };
                        _this.body_mode = _this.MODE.GO_TO;
                        _this.renderLayout(data, function(){
                            _this.addContextEventListener();
                        });
                    }
                } else {
                    _this.previousShow = false;
                    _this.module.go_to_container.innerHTML = "";
                    if (_this.buttons_show_choice) {
                        _this.buttons_show_choice.forEach(function(btn){
                            btn.dataset.toggle = true;
                        });
                    }
                }
            },

            countQuantityPages: function(callback) {
                var _this = this;
                _this.optionsDefinition(_this.module, _this.bodyOptionsMode);
                if (_this.module.currentListOptions.data_download) {
                    indexeddb.getAll(_this.module.collectionDescription,
                        _this.tableDefinition(_this.module, _this.module.bodyOptions.mode),
                        function(getAllErr, messages) {
                        if (getAllErr) {
                            console.error(getAllErr);
                            return;
                        }
                        _this.handleCountPagination(messages, callback);
                    });
                } else {
                    switch (_this.module.bodyOptions.mode){
                        case _this.module.body.MODE.CONTACT_LIST:
                            chats_bus.getChatContacts(_this.module.chat_id, function(error, contactsInfo) {
                                if (error) {
                                    console.error(error);
                                    return;
                                }
                                _this.handleCountPagination(contactsInfo, callback);
                            });
                            break;
                        case _this.module.body.MODE.CHATS:
                            users_bus.getMyInfo(null, function(error, options, userInfo) {
                                chats_bus.getChats(error, options, userInfo.chat_ids, function(error, options, chatsInfo) {
                                    if (error) {
                                        _this.module.body_container.innerHTML = error;
                                        return;
                                    }
                                    _this.handleCountPagination(chatsInfo, callback);
                                });
                            });
                            break;
                        case _this.module.body.MODE.USERS:
                            users_bus.getMyInfo(null, function(error, options, userInfo) {
                                users_bus.getContactsInfo(error, userInfo.user_ids, function(_error, contactsInfo) {
                                    if (_error) {
                                        _this.module.body_container.innerHTML = _error;
                                        return;
                                    }
                                    _this.handleCountPagination(contactsInfo, callback);
                                });
                            });
                            break;
                    }
                }
            },

            handleCountPagination: function(data, callback) {
                var _this = this, quantityPages, quantityData;
                if (data){
                    quantityData = data.length;
                } else {
                    quantityData = 0;
                }
                if (quantityData !== 0) {
                    quantityPages = Math.ceil(quantityData / _this.module.currentPaginationOptions.perPageValue);
                } else {
                    quantityPages = 1;
                }
                if (_this.module.currentPaginationOptions.currentPage === null) {
                    _this.module.currentListOptions.start = quantityPages * _this.module.currentPaginationOptions.perPageValue - _this.module.currentPaginationOptions.perPageValue;
                    _this.module.currentListOptions.final = quantityPages * _this.module.currentPaginationOptions.perPageValue;
                    _this.module.currentPaginationOptions.currentPage = quantityPages;
                } else {
                    _this.module.currentListOptions.start = (_this.module.currentPaginationOptions.currentPage - 1) * _this.module.currentPaginationOptions.perPageValue;
                    _this.module.currentListOptions.final = (_this.module.currentPaginationOptions.currentPage - 1) * _this.module.currentPaginationOptions.perPageValue + _this.module.currentPaginationOptions.perPageValue;
                }
                _this.module.currentPaginationOptions.lastPage = quantityPages;
                if (callback) {
                    callback();
                }
            },

            changePage: function(element) {
                var _this = this, value = parseInt(element.value);
                if (element.value === "" || element.value === "0"){
                    _this.module.currentGoToOptions.page = null;
                    return;
                }

                if (!_this.module.currentGoToOptions.rteChoicePage) {
                        _this.module.currentPaginationOptions.currentPage = value;
                        _this.module.currentGoToOptions.page = value;
                    return;
                }
                _this.previousShow_Pagination = false;
                _this.module.currentPaginationOptions.currentPage = value;
                _this.module.currentGoToOptions.page = value;
                _this.module.render(null, null);
            },

            switchPage: function(element) {
                var _this = this;

                if (_this.module.MODE && _this.module.bodyOptions.mode === _this.module.MODE.DETAIL_VIEW) {
                    _this.module.bodyOptions.mode = _this.module.MODE.CHATS;
                }
                if (element.dataset.role === "first" || element.dataset.role === "last") {
                    _this.module.currentPaginationOptions.currentPage = parseInt(element.dataset.value);
                }
                if (element.dataset.role === "back") {
                    _this.module.currentPaginationOptions.currentPage = parseInt(_this.module.currentPaginationOptions.currentPage) - 1;
                }
                if (element.dataset.role === "forward") {
                    _this.module.currentPaginationOptions.currentPage = parseInt(_this.module.currentPaginationOptions.currentPage) + 1;
                }

                if (!_this.module.currentGoToOptions.rteChoicePage && element.dataset.role === "go_to_page") {
                    _this.previousShow = false;
                }
                _this.previousShow_Pagination = false;
                _this.module.render(null, null);
            },

            disableButtonsPagination: function() {
                var _this = this;
                if (_this.module.currentPaginationOptions.currentPage === _this.module.currentPaginationOptions.firstPage) {
                    _this.module.currentPaginationOptions.disableBack = true;
                    _this.module.currentPaginationOptions.disableFirst = true;
                } else {
                    _this.module.currentPaginationOptions.disableBack = false;
                    _this.module.currentPaginationOptions.disableFirst = false;
                }
                if (_this.module.currentPaginationOptions.currentPage === _this.module.currentPaginationOptions.lastPage){
                    _this.module.currentPaginationOptions.disableForward = true;
                    _this.module.currentPaginationOptions.disableLast = true;
                } else {
                    _this.module.currentPaginationOptions.disableForward = false;
                    _this.module.currentPaginationOptions.disableLast = false;
                }
            },

            changeRTE: function(element) {
                var _this = this;

                if (_this.module.MODE && _this.module.bodyOptions.mode === _this.module.MODE.DETAIL_VIEW) {
                    _this.module.bodyOptions.mode = _this.module.MODE.CHATS;
                }
                _this.optionsDefinition(_this.module, _this.module.bodyOptions.mode);
                _this.module.previous_Filter_Options = false;

                if (element.checked) {
                    _this.module.currentGoToOptions.mode_change = "rte";
                    _this.module.currentGoToOptions.rteChoicePage = true;
                } else {
                    _this.module.currentGoToOptions.mode_change = "nrte";
                    _this.module.currentGoToOptions.rteChoicePage = false;
                }
                _this.previousShow = false;
                _this.module.render(null, null);
            },

            destroy: function() {
                var _this = this;
                _this.removeMainEventListeners();
                _this.removeContextEventListeners();
                _this.unCashElements();
            }
        };
        extend_core.prototype.inherit(pagination, throw_event_core);
        extend_core.prototype.inherit(pagination, ajax_core);
        extend_core.prototype.inherit(pagination, template_core);
        extend_core.prototype.inherit(pagination, render_layout_core);
        extend_core.prototype.inherit(pagination, switcher_core);
        extend_core.prototype.inherit(pagination, overlay_core);

        pagination.prototype.pagination_template = pagination.prototype.template(pagination_template);
        pagination.prototype.choice_per_page_template = pagination.prototype.template(choice_per_page_template);
        pagination.prototype.location_wrapper_template = pagination.prototype.template(location_wrapper_template);
        pagination.prototype.triple_element_template = pagination.prototype.template(triple_element_template);
        pagination.prototype.button_template = pagination.prototype.template(button_template);
        pagination.prototype.label_template = pagination.prototype.template(label_template);
        pagination.prototype.input_template = pagination.prototype.template(input_template);

        pagination.prototype.dataMap = {
            "PAGINATION": "",
            "GO_TO": ""
        };

        pagination.prototype.templateMap = {
            "PAGINATION": pagination.prototype.pagination_template,
            "GO_TO": pagination.prototype.choice_per_page_template
        };

        pagination.prototype.configHandlerMap = {
            GO_TO: pagination.prototype.prepareConfig
        };
        pagination.prototype.configHandlerContextMap = {};

        return pagination;
    })
;

define('text!../templates/filter_template.ejs',[],function () { return '<% _in.config.byDataLocation.per_page.configs = _in.config.byDataLocation.per_page.configs.filter( function(obj){\n    return obj.redraw_mode === _in.data.mode_change } ); %>\n\n<% if (_in.config && _in.config.byDataLocation) {\n        for (var locationKey in _in.config.byDataLocation) { %>\n<%= _in.location_wrapper_template({\n    config: _in.config.byDataLocation[locationKey],\n    data: _in.data ? _in.data : {},\n    triple_element_template: _in.triple_element_template,\n    button_template: _in.button_template,\n    input_template: _in.input_template,\n    label_template: _in.label_template\n}) %>\n<% }\n} %>';});

define('text!../templates/header_template.ejs',[],function () { return '<div data-role="webrtc_container"></div>\n<div data-role="waiter_container"></div>\n<div data-role="tabs_container">\n    <% if (_in.config && _in.config.byDataLocation) {\n            for (var locationKey in _in.config.byDataLocation) { %>\n    <%= _in.location_wrapper_template({\n        config: _in.config.byDataLocation[locationKey],\n        data: _in.data ? _in.data : {},\n        triple_element_template: _in.triple_element_template,\n        button_template: _in.button_template,\n        input_template: _in.input_template,\n        label_template: _in.label_template,\n        description: _in.description\n    }) %>\n    <% }\n    } %>\n    <div data-role="filter_container" class="background flex wrap"></div>\n</div>';});

define('header', [
        'throw_event_core',
        'ajax_core',
        'async_core',
        'template_core',
        'indexeddb',
        'render_layout_core',
        "switcher_core",
        'overlay_core',
        'extend_core',
        'event_bus',

        'pagination',

        'text!../templates/filter_template.ejs',
        'text!../templates/header_template.ejs',
        'text!../templates/element/triple_element_template.ejs',
        'text!../templates/element/location_wrapper_template.ejs',
        'text!../templates/element/button_template.ejs',
        'text!../templates/element/label_template.ejs',
        'text!../templates/element/input_template.ejs'
    ],
    function(throw_event_core,
             ajax_core,
             async_core,
             template_core,
             indexeddb,
             render_layout_core,
             switcher_core,
             overlay_core,
             extend_core,
             event_bus,
             //
             pagination,
             filter_template,
             header_template,
             triple_element_template,
             location_wrapper_template,
             button_template,
             label_template,
             input_template) {

        var header = function() {
            this.bindToolbarContext();
        };

        header.prototype = {

            configMap: {
                WEBRTC: '',
                TAB: '/configs/header_navbar_config.json',
                FILTER: '',
                WAITER: ''
            },

            MODE_DESCRIPTION: {
                WEBRTC: 60,
                TAB: 59,
                WAITER: ''
            },

            MODE: {
                FILTER: 'FILTER',
                WEBRTC: 'WEBRTC',
                WAITER: 'WAITER',
                TAB: 'TAB'
            },

            bindToolbarContext: function() {
                var _this = this;
                _this.bindedThrowEventRouter = _this.throwEventRouter.bind(_this);
                _this.bindedRenderFilter = _this.renderFilter.bind(_this);
                _this.bindedDataActionRouter = _this.dataActionRouter.bind(_this);
            },

            //override extended throwEvent to use trigger on chat
            throwEvent: function(name, data) {
                var _this = this;
                if (data.dataset.target) {
                    event_bus.trigger('throw', data.dataset.action, _this.chat);
                } else {
                    this.chat && this.chat.trigger('throw', name, data);
                }
            },

            addToolbarEventListener: function() {
                var _this = this;
                _this.removeToolbarEventListeners();
                _this.addRemoveListener('add', _this.chat.header_container, 'click', _this.bindedThrowEventRouter, false);
                _this.addRemoveListener('add', _this.chat.header_container, 'click', _this.bindedDataActionRouter, false);
                _this.addRemoveListener('add', _this.chat.header_container, 'change', _this.bindedDataActionRouter, false);
                _this.addRemoveListener('add', _this.chat.header_container, 'input', _this.bindedDataActionRouter, false);
            },

            removeToolbarEventListeners: function() {
                var _this = this;
                _this.addRemoveListener('remove', _this.chat.header_container, 'click', _this.bindedThrowEventRouter, false);
                _this.addRemoveListener('remove', _this.chat.header_container, 'click', _this.bindedDataActionRouter, false);
                _this.addRemoveListener('remove', _this.chat.header_container, 'change', _this.bindedDataActionRouter, false);
                _this.addRemoveListener('remove', _this.chat.header_container, 'input', _this.bindedDataActionRouter, false);
            },

            cashToolbarElement: function() {
                var _this = this;
                _this.filter_container = _this.chat.header_container.querySelector('[data-role="filter_container"]');
                _this.btns_header = Array.prototype.slice.call(_this.chat.header_container.querySelectorAll('[data-role="btnHeader"]'));
            },

            cashBodyElement: function() {
                var _this = this;
                if (_this.body_mode === _this.MODE.FILTER) {
                    _this.enablePagination = _this.filter_container.querySelector('[data-role="enablePagination"]');
                    _this.perPageValue = _this.filter_container.querySelector('[data-role="perPageValue"]');
                    _this.rteShowPerPage = _this.filter_container.querySelector('[data-role="rteShowPerPage"]');
                }
            },

            unCashElements: function() {
                var _this = this;
                _this.filter_container = null;
                _this.enablePagination = null;
                _this.perPageValue = null;
                _this.rteShowPerPage = null;
            },

            render: function(options, _array, chat) {
                var _this = this;
                _this.chat = chat;
                if (_this.chat.headerOptions.show) {
                    switch (_this.chat.headerOptions.mode) {
                        case _this.MODE.TAB:
                            if (!_this.previousMode || _this.previousMode !== _this.chat.headerOptions.mode) {
                                _this.showSpinner(_this.chat.header_container);
                                _this.previousMode = _this.MODE.TAB;
                                _this.body_mode = _this.MODE.TAB;
                                _this.description = _this.MODE_DESCRIPTION[_this.body_mode];
                                _this.elementMap = {
                                    TAB: _this.chat.header_container
                                };
                                _this.renderLayout(null, function() {
                                    _this.cashToolbarElement();
                                    _this.addToolbarEventListener();
                                    _this.renderFilter();
                                    _this.toggleActiveButton(_this.btns_header, _this.chat.bodyOptions.mode);
                                });
                            } else {
                                _this.previousMode = _this.MODE.TAB;
                                _this.renderFilter();
                                _this.toggleActiveButton(_this.btns_header, _this.chat.bodyOptions.mode);
                            }
                            break;
                        case _this.MODE.WEBRTC:
                            _this.showSpinner(_this.chat.header_container.querySelector('[data-role="webrtc_container"]'));
                            _this.body_mode = _this.MODE.WEBRTC;
                            _this.previousMode = _this.MODE.WEBRTC;
                            _this.description = _this.MODE_DESCRIPTION[_this.body_mode];
                            _this.elementMap = {
                                WEBRTC: _this.chat.header_container.querySelector('[data-role="webrtc_container"]')
                            };
                            _this.fillBody(null, null, function() {
                                _this.renderFilter();
                            });
                            break;
                        case _this.MODE.WAITER:
                            _this.body_mode = _this.MODE.WAITER;
                            _this.previousMode = this.MODE.WAITER;
                            break;
                    }
                }
            },

            renderFilter: function() {
                var _this = this;
                _this.optionsDefinition(_this.chat, _this.chat.bodyOptions.mode);
                if (_this.chat.filterOptions.show) {
                    if (_this.currentPaginationOptions.perPageValueNull) {
                        _this.previousFilterShow = false;
                    }
                    if (!_this.previousFilterShow) {
                        _this.showHorizontalSpinner(_this.filter_container);
                        _this.previousFilterShow = true;
                        _this.body_mode = _this.MODE.FILTER;
                        _this.elementMap = {
                            FILTER: _this.filter_container
                        };
                        _this.body_mode = _this.MODE.FILTER;
                        var data = {
                            "perPageValue": _this.currentPaginationOptions.perPageValue,
                            "showEnablePagination": _this.currentPaginationOptions.showEnablePagination,
                            "rtePerPage": _this.currentPaginationOptions.rtePerPage,
                            "mode_change": _this.currentPaginationOptions.mode_change
                        };
                        _this.renderLayout(data, null);
                    }
                }
                else {
                    _this.filter_container.innerHTML = "";
                    _this.chat.filterOptions.show = false;
                    _this.previousFilterShow = false;
                }
            },

            destroy: function() {
                var _this = this;
                _this.removeToolbarEventListeners();
                _this.unCashElements();
            }

        };
        extend_core.prototype.inherit(header, throw_event_core);
        extend_core.prototype.inherit(header, async_core);
        extend_core.prototype.inherit(header, ajax_core);
        extend_core.prototype.inherit(header, template_core);
        extend_core.prototype.inherit(header, render_layout_core);
        extend_core.prototype.inherit(header, switcher_core);
        extend_core.prototype.inherit(header, overlay_core);

        header.prototype.header_template = header.prototype.template(header_template);
        header.prototype.filter_template = header.prototype.template(filter_template);
        header.prototype.triple_element_template = header.prototype.template(triple_element_template);
        header.prototype.location_wrapper_template = header.prototype.template(location_wrapper_template);
        header.prototype.button_template = header.prototype.template(button_template);
        header.prototype.label_template = header.prototype.template(label_template);
        header.prototype.input_template = header.prototype.template(input_template);

        header.prototype.configHandlerMap = {
            TAB: header.prototype.prepareConfig
        };
        header.prototype.configHandlerContextMap = {};

        header.prototype.dataMap = {
            WEBRTC: '',
            TAB: '',
            FILTER: '',
            WAITER: ''
        };

        header.prototype.templateMap = {
            WEBRTC: header.prototype.header_template,
            TAB: header.prototype.header_template,
            FILTER: header.prototype.filter_template,
            WAITER: ''
        };

        return header;
    });

define('text!../templates/editor_template.ejs',[],function () { return '<div class="flex">\n    <div data-role="message_container" class="modal-controls message_conteiner">\n        <div data-role="message_inner_container" class="container" contenteditable="true">\n            <% if (_in.data && _in.data.restore) { %>\n            <%= _in.data.innerHTML %>\n            <% } %>\n        </div>\n    </div>\n    <div class="flex-wrap width-40px align-c" data-role="controls_container">\n        <div class="modal-main-btn">\n            <% _in.config.forEach(function (_config) { %>\n            <%= _in.triple_element_template({\n                config: _config,\n                button_template: _in.button_template,\n                input_template: _in.input_template,\n                label_template: _in.label_template,\n                data: _in.data\n            }) %>\n            <% }) %>\n        </div>\n    </div>\n\n</div>\n\n<div data-role="btnEditPanel" class="btnEditPanel flex-align-c"></div>\n\n';});

define('text!../templates/editor_format_template.ejs',[],function () { return '<% if (_in.config && _in.config.byDataLocation) {\nfor (var locationKey in _in.config.byDataLocation) { %>\n<%= _in.location_wrapper_template({\n    config: _in.config.byDataLocation[locationKey],\n    data: _in.data ? _in.data : {},\n    triple_element_template: _in.triple_element_template,\n    button_template: _in.button_template,\n    input_template: _in.input_template,\n    label_template: _in.label_template\n}) %>\n<% }\n} %>';});

define('editor', [
        'throw_event_core',
        'async_core',
        'ajax_core',
        'template_core',
        'indexeddb',
        'render_layout_core',
        'overlay_core',
        'extend_core',
        //
        'text!../templates/editor_template.ejs',
        'text!../templates/editor_format_template.ejs',
        'text!../templates/element/triple_element_template.ejs',
        'text!../templates/element/button_template.ejs',
        'text!../templates/element/label_template.ejs',
        'text!../templates/element/input_template.ejs',
        'text!../templates/element/location_wrapper_template.ejs'
    ],
    function(throw_event_core,
             async_core,
             ajax_core,
             template_core,
             indexeddb,
             render_layout_core,
             overlay_core,
             extend_core,
             //
             editor_template,
             format_template,
             triple_element_template,
             button_template,
             label_template,
             input_template,
             location_wrapper_template) {

        var editor = function(options) {
            this.chatElem = options.chat.chatElem;
            this.bindMainContexts();
        };

        editor.prototype = {

            MODE: {
                "MAIN_PANEL": 'MAIN_PANEL',
                "FORMAT_PANEL": 'FORMAT_PANEL'
            },

            configMap: {
                "MAIN_PANEL": '/configs/editor_navbar_config.json',
                "FORMAT_PANEL": '/configs/edit_navbar_config.json'
            },

            bindMainContexts: function() {
                var _this = this;
                _this.bindedThrowEventRouter = _this.throwEventRouter.bind(_this);
                _this.bindedDataActionRouter = _this.dataActionRouter.bind(_this);
                _this.bindedSendEnter = _this.sendEnter.bind(_this);
            },
            //override extended throwEvent to use trigger on chat
            throwEvent: function(name, data) {
                this.chat && this.chat.trigger('throw', name, data);
            },

            addMainEventListener: function() {
                var _this = this;
                _this.removeMainEventListeners();
                _this.addRemoveListener('add', _this.controls_container, 'click', _this.bindedThrowEventRouter, false);
                _this.addRemoveListener('add', _this.controls_container, 'click', _this.bindedDataActionRouter, false);
                _this.addRemoveListener('add', _this.btnEditPanel, 'click', _this.bindedThrowEventRouter, false);
                _this.addRemoveListener('add', _this.btnEditPanel, 'click', _this.bindedDataActionRouter, false);
                _this.addRemoveListener('add', _this.message_inner_container, 'keypress', _this.bindedSendEnter, false);
            },

            removeMainEventListeners: function() {
                var _this = this;
                _this.addRemoveListener('remove', _this.controls_container, 'click', _this.bindedThrowEventRouter, false);
                _this.addRemoveListener('remove', _this.controls_container, 'click', _this.bindedDataActionRouter, false);
                _this.addRemoveListener('remove', _this.controls_container, 'click', _this.bindedThrowEventRouter, false);
                _this.addRemoveListener('remove', _this.btnEditPanel, 'click', _this.bindedDataActionRouter, false);
                _this.addRemoveListener('remove', _this.btnEditPanel, 'click', _this.bindedDataActionRouter, false);
                _this.addRemoveListener('remove', _this.message_inner_container, 'keypress', _this.bindedSendEnter, false);
            },

            cashElements: function() {
                var _this = this;
                _this.controls_container = _this.editor_container.querySelector('[data-role="controls_container"]');
                _this.message_inner_container = _this.editor_container.querySelector('[data-role="message_inner_container"]');
                _this.btnEditPanel = _this.editor_container.querySelector('[data-role="btnEditPanel"]');
                _this.buttonFormat = _this.editor_container.querySelector('[data-toggle]');
            },

            unCashElements: function() {
                var _this = this;
                _this.controls_container = null;
                _this.message_inner_container = null;
                _this.btnEditPanel = null;
                _this.buttonFormat = null;
                _this.editor_container = null;
            },

            render: function(options, chat) {
                var _this = this;
                _this.chat = chat;
                _this.editor_container = _this.chat.chat_element.querySelector('[data-role="editor_container"]');
                if (_this.chat.editorOptions.show) {
                    if (!_this.previousEditorShow) {
                        _this.showSpinner(_this.editor_container);
                        _this.previousEditorShow = true;
                        _this.body_mode = _this.MODE.MAIN_PANEL;
                        _this.elementMap = {
                            MAIN_PANEL: _this.editor_container
                        };
                        var data = {
                            "restore": _this.chat.messages_ListOptions.restore,
                            "innerHTML": _this.chat.messages_ListOptions.innerHTML
                        };
                        _this.renderLayout(data, function() {
                            if (_this.chat.messages_ListOptions.restore) {
                                _this.chat.messages_ListOptions.restore = false;
                                _this.chat.messages_ListOptions.innerHTML = "";
                            }
                            _this.cashElements();
                            _this.addMainEventListener();
                            _this.renderFormatPanel();
                        });
                    } else {
                        _this.renderFormatPanel();
                    }
                    return;

                }
                _this.previousEditorShow = false;
                _this.editor_container.innerHTML = "";
            },

            renderFormatPanel: function() {
                var _this = this;
                if (_this.chat.formatOptions.show) {
                    if(!_this.previous_Show) {
                        _this.previous_Show = true;
                        _this.showHorizontalSpinner(_this.btnEditPanel);
                        _this.buttonFormat.dataset.toggle = false;
                        _this.body_mode = _this.MODE.FORMAT_PANEL;
                        _this.elementMap = {
                            FORMAT_PANEL: _this.btnEditPanel
                        };
                        var data = {
                            "offScroll": _this.chat.formatOptions.offScroll,
                            "iSender": _this.chat.formatOptions.iSender
                        };
                        _this.renderLayout(data, null);
                    }
                } else {
                    _this.btnEditPanel.innerHTML = "";
                    _this.previous_Show = false;
                }
            },

            addEdit: function(element) {
                var _this = this;
                var command = element.dataset.name;
                var param = element.dataset.param;
                _this.message_inner_container.focus();
                if (param) {
                    document.execCommand(command, null, "red");
                } else {
                    document.execCommand(command, null, null);
                }
            },

            changeSendEnter: function(element) {
                var _this = this;
                if (element.checked) {
                    _this.chat.formatOptions.sendEnter = true;
                } else {
                    _this.chat.formatOptions.sendEnter = false;
                }
            },

            sendEnter: function(event){
                var _this = this;
                if (event.keyCode === 13) {
                    if (_this.chat.formatOptions.sendEnter) {
                        _this.sendMessage();
                    }
                }
            },

            changeEdit: function() {
                var _this = this;
                if (_this.message_inner_container.classList.contains("onScroll")) {
                    _this.message_inner_container.classList.remove("onScroll");
                    _this.chat.formatOptions.offScroll = false;
                } else {
                    _this.message_inner_container.classList.add("onScroll");
                    _this.chat.formatOptions.offScroll = true;
                }
            },

            // TODO move to editor ?
            sendMessage: function() {
                var _this = this;
                if (!_this.message_inner_container) {
                    return;
                }

                // TODO replace with data-role
                var messageInnerHTML = _this.message_inner_container.innerHTML;
                var pattern = /[^\s{0,}$|^$]/; // empty message or \n only
                if (pattern.test(messageInnerHTML)) {
                    _this.chat.messages.addMessage(_this.chat, _this.chat.body.MODE.MESSAGES,
                        {scrollTop: true, messageInnerHTML: messageInnerHTML},
                        function(error, message) {
                            if (error) {
                                console.error(error);
                                return;
                            }

                            _this.chat.messages.renderMessage({ scrollTop : true }, message);
                            // do something with message ?
                        }
                    );
                    _this.message_inner_container.innerHTML = "";
                }
            },

            destroy: function() {
                var _this = this;
                _this.removeMainEventListeners();
                _this.unCashElements();
            }
        };

        extend_core.prototype.inherit(editor, throw_event_core);
        extend_core.prototype.inherit(editor, async_core);
        extend_core.prototype.inherit(editor, ajax_core);
        extend_core.prototype.inherit(editor, template_core);
        extend_core.prototype.inherit(editor, render_layout_core);
        extend_core.prototype.inherit(editor, overlay_core);

        editor.prototype.editor_template = editor.prototype.template(editor_template);
        editor.prototype.format_template = editor.prototype.template(format_template);
        editor.prototype.triple_element_template = editor.prototype.template(triple_element_template);
        editor.prototype.button_template = editor.prototype.template(button_template);
        editor.prototype.label_template = editor.prototype.template(label_template);
        editor.prototype.input_template = editor.prototype.template(input_template);
        editor.prototype.location_wrapper_template = editor.prototype.template(location_wrapper_template);

        editor.prototype.configHandlerMap = {
            "FORMAT_PANEL": editor.prototype.prepareConfig
        };

        editor.prototype.configHandlerContextMap = {};

        editor.prototype.dataMap = {
            "MAIN_PANEL": "",
            "FORMAT_PANEL": ""
        };

        editor.prototype.templateMap = {
            "MAIN_PANEL": editor.prototype.editor_template,
            "FORMAT_PANEL": editor.prototype.format_template
        };

        return editor;
    });

define('id_core', [
    ],
    function() {

        /**
         * generate "unique" id
         */
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

        return id_core;
    }
);
define('websocket', [
        'throw_event_core',
        'extend_core',
        'id_core'
    ],
    function(
        throw_event_core,
        extend_core,
        id_core
    ) {

        var websocket = function() {
            this.bindContexts();
            this.responseCallbacks = [];
        };

        websocket.prototype = {

            href: '/websocket',

            bindContexts: function() {
                var _this = this;
                _this.bindedOnOpen = _this.onOpen.bind(_this);
                _this.bindedOnClose = _this.onClose.bind(_this);
                _this.bindedOnMessage = _this.onMessage.bind(_this);
                _this.bindedOnError = _this.onError.bind(_this);
            },

            createAndListen: function() {
                this.create();
                this.addSocketListeners();
            },

            create: function() {
                this.socket = new WebSocket('ws://' + window.location.host + this.href);
            },

            dispose: function() {
                this.removeSocketListeners();
                if (this.socket) {
                    this.socket.close();
                    this.socket = null;
                }
            },

            addSocketListeners: function() {
                if (!this.socket) {
                    return;
                }
                var _this = this;
                _this.removeSocketListeners();
                _this.socket.onopen = _this.bindedOnOpen;
                _this.socket.onclose  = _this.bindedOnClose;
                _this.socket.onmessage  = _this.bindedOnMessage;
                _this.socket.onerror  = _this.bindedOnError;
            },

            removeSocketListeners: function() {
                if (!this.socket) {
                    return;
                }
                var _this = this;
                _this.socket.onopen = null;
                _this.socket.onclose  = null;
                _this.socket.onmessage  = null;
                _this.socket.onerror  = null;
            },

            onOpen: function(event) {
                console.log('WebSocket connection established');
            },

            onClose: function(event) {
                if (event.wasClean) {
                    console.warn('WebSocket connection closed');
                } else {
                    console.error(new Error('WebSocket connection abort'));
                }
                console.log('Code: ' + event.code + ' reason: ' + event.reason);
            },

            onMessage: function(event) {
                if (event.data) {
                    try {
                        var parsedMessageData = JSON.parse(event.data);
                    } catch (e) {
                        console.error(e);
                        return;
                    }
                }
                console.info('WebSocket received message data', parsedMessageData);
                if (parsedMessageData.response_id) {
                    var depleted = [], nowDatetime = Date.now();
                    this.responseCallbacks.forEach(function(callbDescr) {
                        if (callbDescr.request_id === parsedMessageData.response_id) {
                            callbDescr.responseCallback(null, parsedMessageData);
                            depleted.push(callbDescr);
                        } else if (nowDatetime - callbDescr.datetime > 50000) {
                            callbDescr.responseCallback(new Error('Timeout fro request'));
                            depleted.push(callbDescr);
                        }
                    });
                    while (depleted.length) {
                        var toRemoveCallbDescr = depleted.shift();
                        var removeIndex = this.responseCallbacks.indexOf(toRemoveCallbDescr);
                        if (removeIndex !== -1) {
                            this.responseCallbacks.splice(removeIndex, 1);
                        }
                    }
                } else {
                    this.trigger('message', parsedMessageData);
                }
            },

            onError: function(error) {
                console.error(error);
            },

            sendMessage: function(data) {
                var senddata = data;
                if (typeof data !== "string") {
                    try {
                        senddata = JSON.stringify(data);
                    } catch (e) {
                        console.error(e);
                        return;
                    }
                }
                this.socket.send(senddata);
            },

            wsRequest: function(requestData, responseCallback) {
                requestData.request_id = this.generateId();
                this.responseCallbacks.push({
                    datetime: Date.now(),
                    request_id: requestData.request_id,
                    responseCallback: responseCallback
                });
                this.sendMessage(requestData);
            }
        };
        extend_core.prototype.inherit(websocket, throw_event_core);
        extend_core.prototype.inherit(websocket, id_core);

        return new websocket();
    }
);

define('text!../templates/setting_template.ejs',[],function () { return '<% _in.config._byDataLocation = {};\n_in.config._byDataLocation.logger_massage = _in.config.byDataLocation.logger_massage;\n_in.config._byDataLocation.send_enter = _in.config.byDataLocation.send_enter;\n_in.config._byDataLocation.chat_users_apply = _in.config.byDataLocation.chat_users_apply;\n%>\n\n<% if (_in.config && _in.config._byDataLocation) {\n    for (var locationKey in _in.config._byDataLocation) { %>\n<%= _in.location_wrapper_template({\n    config: _in.config._byDataLocation[locationKey],\n    data: _in.data ? _in.data : {},\n    triple_element_template: _in.triple_element_template,\n    button_template: _in.button_template,\n    input_template: _in.input_template,\n    label_template: _in.label_template,\n    description: _in.description\n}) %>\n<% }\n} %>\n\n<div class="textbox">\n        <div class="title c-100">\n            <% if (_in.config && _in.config.byDataLocation) {%>\n            <%= _in.location_wrapper_template({\n                config: _in.config.byDataLocation.size_container,\n                data: _in.data ? _in.data : {},\n                triple_element_template: _in.triple_element_template,\n                button_template: _in.button_template,\n                input_template: _in.input_template,\n                label_template: _in.label_template,\n                description: _in.description\n            }) %>\n            <%  } %>\n        </div>\n        <% if (_in.config && _in.config.byDataLocation) {%>\n        <%= _in.location_wrapper_template({\n            config: _in.config.byDataLocation.size,\n            data: _in.data ? _in.data : {},\n            triple_element_template: _in.triple_element_template,\n            button_template: _in.button_template,\n            input_template: _in.input_template,\n            label_template: _in.label_template,\n            description: _in.description,\n            index: _in.data.index\n        }) %>\n        <%  } %>\n</div>\n\n\n\n';});

define('settings', [
        'chat',
        'throw_event_core',
        'ajax_core',
        'template_core',
        'indexeddb',
        'render_layout_core',
        'overlay_core',
        'extend_core',
        'switcher_core',
        //
        'websocket',
        'users_bus',
        //
        'text!../templates/setting_template.ejs',
        'text!../templates/element/triple_element_template.ejs',
        'text!../templates/element/location_wrapper_template.ejs',
        'text!../templates/element/button_template.ejs',
        'text!../templates/element/label_template.ejs',
        'text!../templates/element/input_template.ejs'
    ],
    function(
        chat,
        throw_event_core,
        ajax_core,
        template_core,
        indexeddb,
        render_layout_core,
        overlay_core,
        extend_core,
        switcher_core,
        //
        websocket,
        users_bus,
        //
        setting_template,
        triple_element_template,
        location_wrapper_template,
        button_template,
        label_template,
        input_template
    ) {

        var settings = function() {
            this.bindMainContexts();
        };

        settings.prototype = {

            configMap: {
                SETTINGS: '/configs/settings_config.json'
            },

            bindMainContexts: function() {
                var _this = this;
                _this.bindedThrowEventRouter = _this.throwEventRouter.bind(_this);
                _this.bindedDataActionRouter = _this.dataActionRouter.bind(_this);
            },

            addEventListener: function() {
                var _this = this;
                _this.removeEventListeners();
                _this.addRemoveListener('add', _this.body_container, 'click', _this.bindedThrowEventRouter, false);
                _this.addRemoveListener('add', _this.body_container, 'click', _this.bindedDataActionRouter, false);
            },

            removeEventListeners: function() {
                var _this = this;
                _this.addRemoveListener('remove', _this.body_container, 'click', _this.bindedThrowEventRouter, false);
                _this.addRemoveListener('remove', _this.body_container, 'click', _this.bindedDataActionRouter, false);
            },

            cashElements: function() {
                var _this = this;
                _this.sizeButtonsArray = Array.prototype.slice.call(_this.chat.body_container.querySelectorAll('[data-role="sizeChatButton"]'));
                _this.save_custom_width = _this.chat.body_container.querySelector('[data-role="saveAsCustomWidth"]');
                _this.adjust_width = _this.chat.body_container.querySelector('[data-role="adjust_width"]');
                _this.adjust_width_label = _this.chat.body_container.querySelector('[data-role="adjust_width_label"]');
            },

            //override extended throwEvent to use trigger on chat
            throwEvent: function(name, data) {
                this.chat && this.chat.trigger('throw', name, data);
            },

            renderSettings: function(options, chat) {
                var _this = this;
                _this.chat = chat;
                if (!_this.chat.body.previousMode || _this.chat.body.previousMode !== _this.chat.bodyOptions.mode) {
                    _this.body_container = _this.chat.body_container;
                    _this.showSpinner(_this.body_container);
                    _this.body_mode = _this.chat.bodyOptions.mode;
                    _this.elementMap = {
                        "SETTINGS": _this.body_container
                    };
                    var data = {
                        "sendEnter": _this.chat.formatOptions.sendEnter,
                        "size_350": _this.chat.settings_ListOptions.size_350,
                        "size_700": _this.chat.settings_ListOptions.size_700,
                        "size_1050": _this.chat.settings_ListOptions.size_1050,
                        "adjust_width": _this.chat.settings_ListOptions.adjust_width,
                        "size_custom": _this.chat.settings_ListOptions.size_custom,
                        "index": _this.chat.index
                    };
                    _this.renderLayout(data, function(){
                        _this.addEventListener();
                        _this.cashElements();
                        _this.showSizeElement();
                        _this.showSplitterItems();
                    });
                }
            },

            changeSendEnter: function(element) {
                var _this = this;
                if (element.checked) {
                    _this.chat.formatOptions.sendEnter = true;
                } else {
                    _this.chat.formatOptions.sendEnter = false;
                }
            },

            toggleChatUsersFriendship: function(element) {
                var _this = this;
                //_this.joinUser_ListOptions.readyForRequest = element.checked;
                //_this.disableButton('toggleChatUsersFriendship', element);

                websocket.sendMessage({
                    type: "chat_toggle_ready",
                    chat_description: {
                        chat_id: _this.chat.chat_id
                    },
                    from_user_id: users_bus.getUserId(),
                    ready_state: element.checked
                });
            },

            saveAsCustomWidth: function() {
                var _this = this;
                _this.sizeButtonsArray.forEach(function(_input) {
                    if (_input.dataset.value) {
                        if (_this.chat.settings_ListOptions[_input.dataset.key]) {
                            _this.chat.settings_ListOptions.size_custom_value = _input.dataset.value + 'px';
                            _this.chat.settings_ListOptions.size_current = _input.dataset.value + 'px';
                        }
                        _this.chat.settings_ListOptions[_input.dataset.key] = false;
                    } else {
                        _this.chat.settings_ListOptions.size_custom = true;
                    }
                });
                _this.chat.body.previousMode = null;
                _this.renderSettings(null, _this.chat);
            },

            changeAdjustWidth: function(element) {
                var _this = this;
                if (element.checked) {
                    _this.chat.settings_ListOptions.adjust_width = true;
                } else {
                    _this.chat.settings_ListOptions.adjust_width = false;
                }
                _this.showSplitterItems();
            },

            changeChatSize: function(element) {
                var _this = this;
                if (element.dataset.value && _this.chat.chat_element) {
                    _this.chat.chat_element.style.width = element.dataset.value + 'px';
                    _this.chat.settings_ListOptions.size_current = element.dataset.value + 'px';
                }
                if (element.dataset.key){
                    _this.sizeButtonsArray.forEach(function(_input) {
                        if (_input.dataset.key === element.dataset.key) {
                            _this.chat.settings_ListOptions[_input.dataset.key] = true;
                            if (_input.dataset.key === 'size_custom') {
                                _this.chat.chat_element.style.width = _this.chat.settings_ListOptions.size_custom_value;
                                _this.chat.settings_ListOptions.size_current = _this.chat.settings_ListOptions.size_custom_value;
                            }
                        } else {
                            _this.chat.settings_ListOptions[_input.dataset.key] = false;
                        }
                    });
                }
                _this.showSizeElement();
                _this.showSplitterItems();
            },

            showSizeElement: function() {
                var _this = this;
                if (_this.chat.settings_ListOptions.size_custom) {
                    _this.adjust_width.classList.remove('hide');
                    _this.adjust_width_label.classList.remove('hide');
                    _this.save_custom_width.classList.add('hide');
                } else {
                    _this.save_custom_width.classList.remove('hide');
                    _this.adjust_width.classList.add('hide');
                    _this.adjust_width_label.classList.add('hide');
                }
            },

            showSplitterItems: function(chat) {
                var _this = this;
                if (!_this.chat){
                    _this.chat = chat;
                }
                if (_this.chat.settings_ListOptions.size_custom && _this.chat.settings_ListOptions.adjust_width) {
                    _this.toggleShowSplitterItems(true, _this.chat.splitter_left);
                    _this.toggleShowSplitterItems(true, _this.chat.splitter_right);
                } else {
                    _this.toggleShowSplitterItems(false, _this.chat.splitter_left);
                    _this.toggleShowSplitterItems(false, _this.chat.splitter_right);
                }
            },

            destroy: function() {
                var _this = this;
                _this.removeEventListeners();
            }

        };

        extend_core.prototype.inherit(settings, throw_event_core);
        extend_core.prototype.inherit(settings, ajax_core);
        extend_core.prototype.inherit(settings, template_core);
        extend_core.prototype.inherit(settings, render_layout_core);
        extend_core.prototype.inherit(settings, overlay_core);
        extend_core.prototype.inherit(settings, switcher_core);

        settings.prototype.setting_template = settings.prototype.template(setting_template);
        settings.prototype.triple_element_template = settings.prototype.template(triple_element_template);
        settings.prototype.location_wrapper_template = settings.prototype.template(location_wrapper_template);
        settings.prototype.button_template = settings.prototype.template(button_template);
        settings.prototype.label_template = settings.prototype.template(label_template);
        settings.prototype.input_template = settings.prototype.template(input_template);

        settings.prototype.configHandlerMap = {
            SETTINGS: settings.prototype.prepareConfig
        };
        settings.prototype.configHandlerContextMap = {};

        settings.prototype.dataMap = {
            "SETTINGS": ""
        };

        settings.prototype.templateMap = {
            "SETTINGS": settings.prototype.setting_template
        };

        return settings;
    });

define('text!../templates/contact_list_template.ejs',[],function () { return '<%if (_in.data.length) { %>\n    <% _in.data.forEach(function (_user) { %>\n\n    <div class="flex-sp-start margin-t-b">\n        <div class="width-40px flex-just-center"><img src="img\\app\\3.ico" width="35px" height="35px" class="border-radius-5"></div>\n        <div class="message flex-item-1-auto flex-dir-col flex-sp-between">\n            <div>User name: <%= _user.userName %></div>\n            <div>User id: <%= _user.user_id %></div>\n        </div>\n    </div>\n\n    <% }) %>\n<% }%>\n\n\n';});

define('contact_list', [
        'throw_event_core',
        'ajax_core',
        'template_core',
        'render_layout_core',
        'extend_core',
        //
        'indexeddb',
        'users_bus',
        'chats_bus',
        //
        'text!../templates/contact_list_template.ejs',
        'text!../templates/element/triple_element_template.ejs',
        'text!../templates/element/button_template.ejs',
        'text!../templates/element/label_template.ejs',
        'text!../templates/element/input_template.ejs'
    ],
    function(throw_event_core,
             ajax_core,
             template_core,
             render_layout_core,
             extend_core,
             //
             indexeddb,
             users_bus,
             chats_bus,
             //
             contact_list_template,
             triple_element_template,
             button_template,
             label_template,
             input_template) {

        var contact_list = function(options) {
        };

        contact_list.prototype = {

            configMap: {
                CONTACT_LIST: '/configs/contact_list_config.json'
            },

            renderContactList: function(options, chat) {
                var _this = this;
                _this.chat = chat;
                var changeMode = _this.chat.body.previousMode !== _this.chat.bodyOptions.mode;
                chats_bus.getChatContacts(_this.chat.chat_id, function(error, contactsInfo) {
                    if (error) {
                        console.error(error);
                        return;
                    }

                    contactsInfo = _this.chat.body.limitationQuantityRecords(contactsInfo, changeMode);
                    if (!contactsInfo.data || !contactsInfo.data.length) {
                        _this.chat.body_container.innerHTML = "";
                        return;
                    }
                    if (contactsInfo.needRender) {
                        _this.body_mode = _this.chat.bodyOptions.mode;
                        _this.elementMap = {
                            "CONTACT_LIST": _this.chat.body_container
                        };
                        _this.renderLayout(contactsInfo.data, null);
                    }

                });
            },

            destroy: function() {
                var _this = this;
            }
        };

        extend_core.prototype.inherit(contact_list, throw_event_core);
        extend_core.prototype.inherit(contact_list, ajax_core);
        extend_core.prototype.inherit(contact_list, template_core);
        extend_core.prototype.inherit(contact_list, render_layout_core);

        contact_list.prototype.contact_list_template = contact_list.prototype.template(contact_list_template);
        contact_list.prototype.triple_element_template = contact_list.prototype.template(triple_element_template);
        contact_list.prototype.button_template = contact_list.prototype.template(button_template);
        contact_list.prototype.label_template = contact_list.prototype.template(label_template);
        contact_list.prototype.input_template = contact_list.prototype.template(input_template);

        contact_list.prototype.dataMap = {
            "CONTACT_LIST": ""
        };

        contact_list.prototype.templateMap = {
            "CONTACT_LIST": contact_list.prototype.contact_list_template
        };

        contact_list.prototype.configHandlerMap = {
        };
        contact_list.prototype.configHandlerContextMap = {};

        return contact_list;
    });

define('model_core',[
        'users_bus'
    ],
    function (
        users_bus
    ) {

        var model_core = function() {
        };

        model_core.prototype = {

            __class_name: "model_core",

            setCreator: function(_instance) {
                var instance = _instance ? _instance : this;
                if (!instance.createdByUserId) {
                    instance.createdByUserId = users_bus.getUserId();
                    instance.createdDatetime = Date.now();
                } else {
                    instance.receivedDatetime = Date.now();
                }
            },

            isInUsers: function(_instance, user_id) {
                var instance = _instance ? _instance : this;
                var check_user_id = user_id ? user_id : users_bus.getUserId();
                var inUsers;
                if (instance.user_ids) {
                    instance.user_ids.every(function(_user_id) {
                        if (_user_id === check_user_id) {
                            inUsers = _user_id;
                        }
                        return !inUsers;
                    });
                }

                return inUsers;
            },

            addMyUserId: function(_instance) {
                var instance = _instance ? _instance : this;
                if (!instance.user_ids) {
                    instance.user_ids = [];
                }
                if (!model_core.prototype.isInUsers(instance)) {
                    instance.user_ids.push(users_bus.getUserId());
                }
            },

            amICreator: function(_instance) {
                var instance = _instance ? _instance : this;
                return instance.createdByUserId === users_bus.getUserId();
            }
        };

        return model_core;
    }
);
define('html_message', [
        'id_core',
        'extend_core',
        'model_core',
        'users_bus',
        'event_bus'
    ],
    function(
        id_core,
        extend_core,
        model_core,
        users_bus,
        event_bus
    ) {
        var defaultOptions = {
            innerHTML : ""
        };
        /**
         * HTML_message model
         * @param options - options to override basic parameters
         */
        var HTML_message = function(options) {
            if (!options.messageId) {
                this.messageId = this.generateId();
            }
            this.extend(this, defaultOptions);
            this.extend(this, options);

            this.setCreator();
            this.addMyUserId();
        };

        HTML_message.prototype = {

            toJSON: function() {
                return {
                    createdDatetime: this.createdDatetime,
                    createdByUserId: this.createdByUserId,
                    receivedDatetime: this.receivedDatetime,
                    messageId: this.messageId,
                    user_ids: this.user_ids,
                    innerHTML: this.innerHTML
                }
            }

        };

        extend_core.prototype.inherit(HTML_message, id_core);
        extend_core.prototype.inherit(HTML_message, extend_core);
        extend_core.prototype.inherit(HTML_message, model_core);

        return HTML_message;
    });

define('html_log_message', [
        'extend_core'
    ],
    function(
        extend_core
    ) {
        var defaultOptions = {
            innerHTML : ""
        };
        /**
         * HTML_log_message model
         * @param options - options to override basic parameters
         */
        var HTML_log_message = function(options) {
            if (!options.id) {
                this.id = Date.now();
            }
            this.extend(this, defaultOptions);
            this.extend(this, options);
        };

        HTML_log_message.prototype = {

            toJSON: function() {
                return {
                    id: this.id,
                    innerHTML: this.innerHTML
                }
            }

        };

        extend_core.prototype.inherit(HTML_log_message, extend_core);

        return HTML_log_message;
    });

define('connection',[
        'websocket',
        'event_bus'
    ],
function(
    websocket,
    event_bus
) {
    /**
     * WebRTC peer to peer connection
     * connection can store multiple chats/users
     * communication with device is handling in terms of chat/user
     */
    var Connection = function(options) {
        this.chats_ids = [];
        this.users_ids = [];
        this.ws_device_id = options.ws_device_id;
        this.setDefaultActive();
        this.setDefaultPassive();
    };

    Connection.prototype = {

        setDefaultActive: function() {
            this.active = {
                readyState: this.readyStates.WAITING
            };
        },

        setDefaultPassive: function() {
            this.passive = {
                readyState: this.readyStates.WAITING
            }
        },

        readyStates: {
            WAITING: 'WAITING',
            CREATING_OFFER: 'CREATING_OFFER',
            WILL_CREATE_OFFER: 'WILL_CREATE_OFFER',
            CREATING_ANSWER: 'CREATING_ANSWER',
            WILL_CREATE_ANSWER: 'WILL_CREATE_ANSWER',
            ACCEPTING_ANSWER: 'ACCEPTING_ANSWER',
            WILL_ACCEPT_ANSWER: 'WILL_ACCEPT_ANSWER'
        },

        setWSDeviceId: function(ws_device_id) {
            this.ws_device_id = ws_device_id;
        },

        getWSDeviceId: function() {
            return this.ws_device_id;
        },

        canApplyNextState: function() {
            if (this.dataChannel && this.dataChannel.readyState === "open") {
                // connection with this device is already established
                return false;
            } else if (this.active && this.active.readyState === Connection.prototype.readyStates.ACCEPTING_ANSWER) {
                // connection with this device is establishing through p2p
                return false;
            }
            return true;
        },

        removeChatId: function(chat_id) {
            if (this.hasChatId(chat_id)) {
                var index = this.chats_ids.indexOf(chat_id);
                if (index > -1) {
                    this.chats_ids.splice(index, 1);
                }
            }
            if (!this.handleAnyContexts()) {
                this.destroy();
            }
        },

        hasUserId: function(user_id) {
            var foundUserId = false;
            this.users_ids.every(function(_user_id) {
                if (_user_id === user_id) {
                    foundUserId = _user_id;
                }
                return !foundUserId;
            });
            return foundUserId;
        },

        hasChatId: function(chat_id) {
            var foundChatId = false;
            this.chats_ids.every(function(_chat_id) {
                if (_chat_id === chat_id) {
                    foundChatId = _chat_id;
                }
                return !foundChatId;
            });
            return foundChatId;
        },

        putUserId: function(user_id) {
            if (this.hasUserId(user_id) === false) {
                this.users_ids.push(user_id);
            }
        },

        putChatId: function(chat_id) {
            if (this.hasChatId(chat_id) === false) {
                this.chats_ids.push(chat_id);
            }
        },

        storeContext: function(ws_descr) {
            if (ws_descr.chat_id) {
                this.putChatId(ws_descr.chat_id);
            } else if (ws_descr.user_id || ws_descr.from_user_id) {
                this.putUserId(ws_descr.user_id || ws_descr.from_user_id);
            }
        },

        getContextDescription: function() {
            return {
                chats_ids: chats_ids,
                users_ids: users_ids
            }
        },

        log: function(type, messageObject) {
            if (console[type]) {
                console[type](messageObject.message);
            } else {
                console.log(type, messageObject.message);
            }
        },

        sendToWebSocket: function(messageData) {
            //messageData.context_description = this.getContextDescription();
            websocket.sendMessage(messageData);
        },

        handleAnyContexts: function() {
            return this.chats_ids.length || this.users_ids.length;
        },

        destroy: function() {
            this.chats_ids = [];
            this.users_ids = [];
            event_bus.trigger('connectionDestroyed', this);
        },

        isActive: function() {
            return this.dataChannel && this.dataChannel.readyState === "open";
        }
    };

    return Connection;
}
);
define('text!../templates/webrtc_template.ejs',[],function () { return '<% if (_in.data.mode === \'start\') { %>\n    <h3>Choose your action</h3>\n    <button data-action="clickCreateLocalOffer ������">Create offer</button>\n    <button data-action="clickAnswerRemoteOffer">Join offer</button>\n<% } else if (_in.data.mode === \'offer\') { %>\n    <h3>Copy local offer here</h3>\n    <textarea readonly class="w100p" data-role="localOfferDescription" rows="10" ><%= JSON.stringify(_in.data.peerConnection.localDescription) %></textarea>\n    <h3>Past remote answer here</h3>\n    <textarea class="w100p" data-role="remoteAnswerDescription" rows="10" ></textarea>\n    <button data-action="clickSubmitRemoteAnswer">Submit remote answer</button>\n<% } else if (_in.data.mode === \'remoteOffer\') { %>\n    <h3>Past remote offer here</h3>\n    <textarea class="w100p" data-role="remoteOfferDescription" rows="10" ></textarea>\n    <button data-action="clickSubmitRemoteOffer">Submit join offer</button>\n<% } else if (_in.data.mode === \'answer\') { %>\n    <h3>Remote offer</h3>\n    <textarea readonly class="w100p" data-role="remoteOfferDescription" rows="10" ><%= JSON.stringify(_in.data.peerConnection.remoteDescription) %></textarea>\n    <h3>Copy answer here</h3>\n    <textarea readonly class="w100p" data-role="localAnswerDescription" rows="10" ><%= JSON.stringify(_in.data.peerConnection.localDescription) %></textarea>\n<% } %>';});

define('text!../templates/waiter_template.ejs',[],function () { return '<svg width="150" height="150">\n    <g id="Group"  fill="none">\n        <path class="path" d="M10,122.5 Q107.4,103.8 75,10"></path>\n        <path class="path" d="M140,122.5 Q42.5,103.8 75,10"></path>\n        <path class="path" d="M140,122.5 Q75.4,47.5 10,122.5"></path>\n        <circle r="10" style=" fill: #0000ff;">\n            <animateMotion path="M10,122.5 Q107.4,103.8 75,10 M75,10 Q42.5,103.8 140,122.5 M140,122.5 Q75.4,47.5 10,122.5" begin="0s" dur="3s" repeatCount="indefinite" ></animateMotion>\n            <animate attributeName="fill" values="00FF00;0000FF;FF00FF;0000FF;00FF00;" dur="10s" repeatCount="indefinite" />\n        </circle>\n        <circle cx="-10" cy="-10" r="9" style=" fill: #0000ff;">\n            <animateMotion path="M20,132.5 Q117.4,113.8 85,20 M85,20 Q52.5,113.8 150,132.5 M150,132.5 Q85.4,57.5 20,132.5" begin="0.15s" dur="3s" repeatCount="indefinite" ></animateMotion>\n            <animate attributeName="fill" values="00FF00;0000FF;FF00FF;0000FF;00FF00;" dur="10s" repeatCount="indefinite" />\n            <animate attributeName="opacity" values="0.5" dur="3s" repeatCount="indefinite"/>\n        </circle>\n        <circle cx="-10" cy="-10" r="8" style=" fill: #0000ff;">\n            <animateMotion path="M20,132.5 Q117.4,113.8 85,20 M85,20 Q52.5,113.8 150,132.5 M150,132.5 Q85.4,57.5 20,132.5" begin="0.3s" dur="3s" repeatCount="indefinite" ></animateMotion>\n            <animate attributeName="fill" values="00FF00;0000FF;FF00FF;0000FF;00FF00;" dur="10s" repeatCount="indefinite" />\n            <animate attributeName="opacity" values="0.3" dur="3s" repeatCount="indefinite"/>\n        </circle>\n        <circle cx="-10" cy="-10" r="7" style=" fill: #0000ff;">\n            <animateMotion path="M20,132.5 Q117.4,113.8 85,20 M85,20 Q52.5,113.8 150,132.5 M150,132.5 Q85.4,57.5 20,132.5" begin="0.45s" dur="3s" repeatCount="indefinite" ></animateMotion>\n            <animate attributeName="fill" values="00FF00;0000FF;FF00FF;0000FF;00FF00;" dur="10s" repeatCount="indefinite" />\n            <animate attributeName="opacity" values="0.12" dur="3s" repeatCount="indefinite"/>\n        </circle>\n\n        <circle r="10" style=" fill: #0000ff;">\n            <animateMotion path="M75,10 Q42.5,103.8 140,122.5 M140,122.5 Q75.4,47.5 10,122.5 M10,122.5 Q107.4,103.8 75,10" begin="0s" dur="3s" repeatCount="indefinite" ></animateMotion>\n            <animate attributeName="fill" values="0000FF;00FF00;FFFF00;00FF00;0000FF;" dur="10s" repeatCount="indefinite"></animate>\n        </circle>\n        <circle cx="-10" cy="-10" r="9" style=" fill: #0000ff;">\n            <animateMotion path="M85,20 Q52.5,113.8 150,132.5 M150,132.5 Q85.4,57.5 20,132.5 M20,132.5 Q117.4,113.8 85,20" begin="0.15s" dur="3s" repeatCount="indefinite" ></animateMotion>\n            <animate attributeName="fill" values="0000FF;00FF00;FFFF00;00FF00;0000FF;" dur="10s" repeatCount="indefinite"></animate>\n            <animate attributeName="opacity" values="0.5" dur="3s" repeatCount="indefinite"/>\n        </circle>\n        <circle cx="-10" cy="-10" r="8" style=" fill: #0000ff;">\n            <animateMotion path="M85,20 Q52.5,113.8 150,132.5 M150,132.5 Q85.4,57.5 20,132.5 M20,132.5 Q117.4,113.8 85,20" begin="0.3s" dur="3s" repeatCount="indefinite" ></animateMotion>\n            <animate attributeName="fill" values="0000FF;00FF00;FFFF00;00FF00;0000FF;" dur="10s" repeatCount="indefinite"></animate>\n            <animate attributeName="opacity" values="0.3" dur="3s" repeatCount="indefinite"></animate>\n        </circle>\n        <circle cx="-10" cy="-10" r="7" style=" fill: #0000ff;">\n            <animateMotion path="M85,20 Q52.5,113.8 150,132.5 M150,132.5 Q85.4,57.5 20,132.5 M20,132.5 Q117.4,113.8 85,20" begin="0.45s" dur="3s" repeatCount="indefinite" ></animateMotion>\n            <animate attributeName="fill" values="0000FF;00FF00;FFFF00;00FF00;0000FF;" dur="10s" repeatCount="indefinite"></animate>\n            <animate attributeName="opacity" values="0.12" dur="3s" repeatCount="indefinite"/>\n        </circle>\n\n        <circle r="10" style=" fill: #0000ff;">\n            <animateMotion path="M140,122.5 Q75.4,47.5 10,122.5 M10,122.5 Q107.4,103.8 75,10 M75,10 Q42.5,103.8 140,122.5" begin="0s" dur="3s" repeatCount="indefinite" ></animateMotion>\n            <animate attributeName="fill" values="FF0000;FFFF00;0080FF;FFFF00;FF0000;" dur="10s" repeatCount="indefinite"></animate>\n        </circle>\n        <circle cx="-10" cy="-10" r="9" style=" fill: #0000ff;">\n            <animateMotion path="M150,132.5 Q85.4,57.5 20,132.5 M20,132.5 Q117.4,113.8 85,20 M85,20 Q52.5,113.8 150,132.5" begin="0.15s" dur="3s" repeatCount="indefinite" ></animateMotion>\n            <animate attributeName="fill" values="FF0000;FFFF00;0080FF;FFFF00;FF0000;" dur="10s" repeatCount="indefinite"></animate>\n            <animate attributeName="opacity" values="0.5" dur="3s" repeatCount="indefinite"/>\n        </circle>\n        <circle cx="-10" cy="-10" r="8" style=" fill: #0000ff;">\n            <animateMotion path="M150,132.5 Q85.4,57.5 20,132.5 M20,132.5 Q117.4,113.8 85,20 M85,20 Q52.5,113.8 150,132.5" begin="0.3s" dur="3s" repeatCount="indefinite" ></animateMotion>\n            <animate attributeName="fill" values="FF0000;FFFF00;0080FF;FFFF00;FF0000;" dur="10s" repeatCount="indefinite"></animate>\n            <animate attributeName="opacity" values="0.3" dur="3s" repeatCount="indefinite"/>\n        </circle>\n        <circle cx="-10" cy="-10" r="7" style=" fill: #0000ff;">\n            <animateMotion path="M150,132.5 Q85.4,57.5 20,132.5 M20,132.5 Q117.4,113.8 85,20 M85,20 Q52.5,113.8 150,132.5" begin="0.45s" dur="3s" repeatCount="indefinite" ></animateMotion>\n            <animate attributeName="fill" values="FF0000;FFFF00;0080FF;FFFF00;FF0000;" dur="10s" repeatCount="indefinite"></animate>\n            <animate attributeName="opacity" values="0.12" dur="3s" repeatCount="indefinite"/>\n        </circle>\n    </g>\n</svg>\n';});

define('webrtc', [
        'throw_event_core',
        'template_core',
        'extend_core',
        'event_core',
        //
        'event_bus',
        'users_bus',
        'connection',
        'websocket',
        //
        'text!../templates/webrtc_template.ejs',
        'text!../templates/waiter_template.ejs'
    ],
    function(throw_event_core,
             template_core,
             extend_core,
             event_core,
             //
             event_bus,
             users_bus,
             Connection,
             websocket,
            //
             webrtc_template,
             waiter_template) {

        var WebRTC = function() {
            var _this = this;
            _this.configuration = {
                RTC: {
                    "iceServers": [
                        {"url": "stun:23.21.150.121"}
                    ]
                },
                constraints: {
                    "optional": [
                        {"DtlsSrtpKeyAgreement": true}
                    ]
                }
            };
            _this.connections = [];
            _this.addEventListeners();
        };

        WebRTC.prototype = {

            addEventListeners: function() {
                var _this = this;
                _this.removeEventListeners();
                event_bus.on('chatDestroyed', _this.destroyConnectionChat, _this);
                event_bus.on('connectionDestroyed', _this.onConnectionDestroyed, _this);
                websocket.on('message', _this.onWebSocketMessage, _this);
            },

            removeEventListeners: function() {
                var _this = this;
                event_bus.off('chatDestroyed', _this.destroyConnectionChat);
                event_bus.off('connectionDestroyed', _this.onConnectionDestroyed);
                websocket.off('message', _this.onWebSocketMessage);
            },

            createConnection: function(options) {
                var connection = new Connection(options);
                this.connections.push(connection);
                return connection;
            },

            getConnection: function(ws_device_id) {
                var connection;
                this.connections.every(function(_connection) {
                    if (_connection.ws_device_id === ws_device_id) {
                        connection = _connection;
                    }
                    return !connection;
                });

                return connection;
            },

            /**
             * this function is invoked when chat was created or joined
             */
            handleConnectedDevices: function(wscs_descrs) {
                var _this = this;
                if (!wscs_descrs && !Array.isArray(wscs_descrs)) {
                    return;
                }
                wscs_descrs.forEach(function(ws_descr) {
                    _this.handleDeviceActive(ws_descr);
                });
            },

            handleDeviceActive: function(ws_descr) {
                var _this = this;
                if (event_bus.ws_device_id === ws_descr.ws_device_id) {
                    console.warn('the information about myself');
                    return;
                }

                var connection = _this.getConnection(ws_descr.ws_device_id);
                if (connection && connection.canApplyNextState() === false) {
                    connection.storeContext(ws_descr);
                    _this.trigger('webrtc_connection_established', connection);
                    return;
                }
                if (!connection) {
                    // if connection with such ws_device_id not found create offer for this connection
                    connection = _this.createConnection({
                        ws_device_id : ws_descr.ws_device_id
                    });
                }
                // change readyState for existing connection
                connection.active.readyState = Connection.prototype.readyStates.WILL_CREATE_OFFER;
                connection.storeContext(ws_descr);
                _this.onActiveChangeState(connection);
            },

            /**
             * server stored local offer for current chat
             * need to join this offer of wait for connections if current user is creator
             */
            handleDevicePassive: function(messageData) {
                var _this = this;
                if (event_bus.get_ws_device_id() === messageData.from_ws_device_id) {
                    console.warn('the information about myself');
                    return;
                }
                var connection = _this.getConnection(messageData.from_ws_device_id);
                if (connection && connection.canApplyNextState() === false) {
                    connection.storeContext(messageData);
                    return;
                }
                
                if (!connection) {
                    // if connection with such ws_device_id not found create answer for offer
                    connection = _this.createConnection({
                        ws_device_id : messageData.from_ws_device_id
                    });
                }
                // change readyState for existing connection
                connection.passive.readyState = Connection.prototype.readyStates.WILL_CREATE_ANSWER;
                connection.passive.remoteOfferDescription = messageData.offerDescription;
                connection.storeContext(messageData);
                _this.onPassiveChangeState(connection);
            },

            handleDeviceAnswer: function(messageData) {
                var _this = this;
                // I am NOT the creator of server stored answer
                if (event_bus.get_ws_device_id() === messageData.from_ws_device_id) {
                    console.warn('the information about myself');
                    return;
                }

                var connection = _this.getConnection(messageData.from_ws_device_id);
                if (connection && connection.canApplyNextState() === false) {
                    connection.storeContext(messageData);
                    return;
                } else if (!connection) {
                    console.error(new Error('Answer for connection thet is not exist!'));
                }

                if (event_bus.get_ws_device_id() === messageData.to_ws_device_id) {
                    // Accept answer if I am the offer creator
                    connection.active.readyState = Connection.prototype.readyStates.WILL_ACCEPT_ANSWER;
                    connection.active.remoteAnswerDescription = messageData.answerDescription;
                    connection.storeContext(messageData);
                    _this.onActiveChangeState(connection);
                }
            },

            extractSDPDeviceId: function(RTCSessionDescription) {
                return RTCSessionDescription.sdp.match(/a=fingerprint:sha-256\s*(.+)/)[1];
            },

            onActiveICECandidate: function(curConnection, result) {
                var _this = this;
                if (!curConnection.active) {
                    curConnection.log('error', { message: "Aborted create offer! Connection doesn't have active " });
                    return;
                }

                curConnection.active.readyState = Connection.prototype.readyStates.WAITING;
                curConnection.sendToWebSocket({
                    type: 'webrtc_offer',
                    from_user_id: users_bus.getUserId(),
                    from_ws_device_id: event_bus.get_ws_device_id(),
                    to_ws_device_id: curConnection.getWSDeviceId(),
                    offerDescription: result.peerConnection.localDescription
                });
            },

            onLocalOfferCreated: function(curConnection, createError, result) {
                if (createError) {
                    curConnection.log('error', { message: createError });
                    return;
                }
                if (!curConnection.active) {
                    curConnection.log('error', { message: "Aborted create offer! Connection doesn't have active " });
                    return;
                }

                curConnection.active.peerConnection = result.peerConnection;
                curConnection.active.dataChannel = result.dataChannel;
                curConnection.log('log', { message: 'done: createLocalOfferAuto' });
            },
            
            onAcceptedRemoteAnswer: function(curConnection, createError) {
                if (createError) {
                    curConnection.log('error', { message: createError });
                    return;
                }
                if (!curConnection.active) {
                    curConnection.log('error', { message: "Aborted accept answer! Connection doesn't have active " });
                    return;
                }

                curConnection.sendToWebSocket({
                    type: 'webrtc_accept',
                    from_user_id: users_bus.getUserId(),
                    from_ws_device_id: event_bus.get_ws_device_id(),
                    to_ws_device_id: curConnection.getWSDeviceId()
                });
            },

            onActiveChangeState: function(curConnection) {
                var _this = this;
                switch (curConnection.active.readyState) {
                    case Connection.prototype.readyStates.WILL_CREATE_OFFER:
                        curConnection.active.readyState = Connection.prototype.readyStates.CREATING_OFFER;
                        _this.createLocalOfferAuto(
                            curConnection,
                            _this.onActiveICECandidate.bind(_this, curConnection),
                            _this.onLocalOfferCreated.bind(_this, curConnection)
                        );
                        break;
                    case Connection.prototype.readyStates.WILL_ACCEPT_ANSWER:
                        curConnection.active.readyState = Connection.prototype.readyStates.ACCEPTING_ANSWER;
                        _this.acceptRemoteAnswerAuto(
                            curConnection,
                            _this.onAcceptedRemoteAnswer.bind(_this, curConnection)
                        );
                        break;
                }
            },

            onPassiveICECandidate: function(curConnection, result) {
                var _this = this;
                if (!curConnection.passive) {
                    curConnection.log('error', { message: "Aborted create offer! Connection doesn't have passive " });
                    return;
                }

                //curConnection.passive.peerConnection.ondatachannel = _this.onReceivedDataChannel.bind(_this, curConnection);
                curConnection.passive.readyState = Connection.prototype.readyStates.WAITING;
                curConnection.sendToWebSocket({
                    type: 'webrtc_answer',
                    from_user_id: users_bus.getUserId(),
                    from_ws_device_id: event_bus.get_ws_device_id(),
                    to_ws_device_id: curConnection.getWSDeviceId(),
                    answerDescription: result.peerConnection.localDescription
                });
            },

            onLocalAnswerCreated: function(curConnection, createError, result) {
                if (createError) {
                    curConnection.log('error', { message: createError });
                    return;
                }
                if (!curConnection.passive) {
                    curConnection.log('error', { message: "Aborted create offer! Connection doesn't have passive " });
                    return;
                }

                curConnection.passive.peerConnection = result.peerConnection;
                curConnection.log('log', { message: 'done: createLocalAnswerAuto' });
            },

            onPassiveChangeState: function(curConnection) {
                var _this = this;
                switch (curConnection.passive.readyState) {
                    case Connection.prototype.readyStates.WILL_CREATE_ANSWER:
                        curConnection.passive.readyState = Connection.prototype.readyStates.CREATING_ANSWER;
                        _this.createLocalAnswerAuto(
                            curConnection,
                            _this.onPassiveICECandidate.bind(_this, curConnection),
                            _this.onLocalAnswerCreated.bind(_this, curConnection)
                        );
                        break;
                }
            },

            /**
             * create offer session description protocol (sdp)
             * when internet connection will be established
             * sdp will be sent to the server
             */
            createLocalOfferAuto: function(curConnection, onICECandidate, callback) {
                var _this = this;
                _this.createRTCPeerConnection(
                    curConnection,
                    onICECandidate,
                    function(createError, peerConnection) {
                        if (createError) {
                            callback(createError);
                            return;
                        }

                        _this.createLocalOffer(curConnection, peerConnection, callback);
                    }
                );
            },

            /**
             * create answer session description protocol
             * when internet connection will be established
             * sdp will be sent to the server
             */
            createLocalAnswerAuto: function(curConnection, onICECandidate, callback) {
                var _this = this;
                _this.createRTCPeerConnection(
                    curConnection,
                    onICECandidate,
                    function(createError, peerConnection) {
                        if (createError) {
                            callback(createError);
                            return;
                        }

                        _this.createLocalAnswer(curConnection, peerConnection, callback);
                    }
                );
            },

            acceptRemoteAnswerAuto: function(curConnection, callback) {
                var _this = this;
                curConnection.log('log', { message: 'try: acceptRemoteAnswerAuto:setRemoteDescription' });
                try {
                    var remoteAnswerDescription = new RTCSessionDescription(curConnection.active.remoteAnswerDescription);
                    curConnection.active.peerConnection.setRemoteDescription(remoteAnswerDescription);
                } catch (error) {
                    if (callback) {
                        callback(error);
                    }
                    return;
                }

                curConnection.log('log', { message: 'done: acceptRemoteAnswerAuto:setRemoteDescription' });
                if (callback) {
                    callback(null);
                }
            },

            /**
             * each time client tries to define its address
             */
            _onICECandidate: function(curConnection, peerConnection, onICECandidate, event) {
                if (event.candidate == null) {
                    curConnection.log('log', { message: 'done: ICE candidate' });
                    if (onICECandidate) {
                        onICECandidate({
                            peerConnection: peerConnection
                        });
                    }
                } else {
                    curConnection.log('log', { message: 'next: ICE candidate' });
                }
            },

            _onReceivedDataChannel: function(curConnection, event) {
                curConnection.log('log', { message: 'Data Channel received' });
                if (!curConnection.passive) {
                    this._removeDataChannelListeners(event.channel);
                    return;
                }
                curConnection.passive.dataChannel = event.channel;
                this._addDataChannelListeners(curConnection.passive.dataChannel, curConnection, 'passive');
            },

            _onICEConnectionStateChange: function(curConnection, event) {
                if (event.target.iceConnectionState === 'disconnected') {
                    console.warn('Peer connection was disconnected', event);
                    curConnection.destroy();
                } else {
                    console.log('oniceconnectionstatechange', event.target.iceConnectionState);
                }
            },

            _addPeerConnectionListeners: function(peerConnection, curConnection, onICECandidate) {
                if (!peerConnection) {
                    return;
                }
                var _this = this;
                _this._removePeerConnectionListeners(peerConnection);

                peerConnection.ondatachannel = _this._onReceivedDataChannel.bind(_this, curConnection);
                peerConnection.onicecandidate = _this._onICECandidate.bind(_this, curConnection, peerConnection, onICECandidate);
                peerConnection.oniceconnectionstatechange = _this._onICEConnectionStateChange.bind(_this, curConnection);
                //peerConnection.onnegotiationneeded = function(ev) { console.log('onnegotiationneeded', ev); };
                peerConnection.onsignalingstatechange = function(ev) { console.log('onsignalingstatechange', ev.target.signalingState); };
            },

            _removePeerConnectionListeners: function(peerConnection) {
                if (!peerConnection) {
                    return;
                }
                var _this = this;

                peerConnection.ondatachannel = null;
                peerConnection.onicecandidate = null;
                peerConnection.oniceconnectionstatechange = null;
                //peerConnection.onnegotiationneeded = null;
                peerConnection.onsignalingstatechange = null;
            },

            /**
             * create peer connection and pass it to the device id state
             */
            createRTCPeerConnection: function(curConnection, onICECandidate, callback) {
                var _this = this;
                curConnection.log('log', { message: 'try: createRTCPeerConnection' });
                try {
                    var peerConnection = new webkitRTCPeerConnection(_this.configuration.RTC, _this.configuration.constraints);
                } catch (error) {
                    if (callback) {
                        callback(error);
                    }
                    return;
                }

                _this._addPeerConnectionListeners(peerConnection, curConnection, onICECandidate);

                curConnection.log('log', { message: 'done: createRTCPeerConnection' });
                if (callback) {
                    callback(null, peerConnection);
                }
            },

            notMode: function(mode) {
                if (mode === 'active') {
                    return 'passive';
                } else if (mode === 'passive') {
                    return 'active';
                }
            },

            onDataChannelOpen: function(curConnection, activeOrPassive) {
                if (curConnection[activeOrPassive]) {
                    curConnection.log('log', { message: 'Data channel connection opened!' });
                    curConnection.dataChannel = curConnection[activeOrPassive].dataChannel;
                    curConnection.peerConnection = curConnection[activeOrPassive].peerConnection;
                    var notMode = this.notMode(activeOrPassive);
                    this._removePeerConnectionListeners(curConnection[notMode].peerConnection);
                    this._removeDataChannelListeners(curConnection[notMode].dataChannel);
                    curConnection.setDefaultActive();
                    curConnection.setDefaultPassive();
                    this.trigger('webrtc_connection_established', curConnection);
                } else {
                    curConnection.log('log', { message: 'fail to set data channel for ' + activeOrPassive });
                }
            },

            onDataChannelMessage: function(curConnection, event) {
                try {
                    var messageData = JSON.parse(event.data);
                } catch (e) {
                    console.error(e);
                    return;
                }

                if (messageData.type === 'notifyChat') {
                    event_bus.trigger('notifyChat', messageData);
                } else if (messageData.type === 'notifyUser') {
                    event_bus.trigger('notifyUser', messageData);
                } else if (messageData.type === 'chatJoinApproved') {
                    event_bus.trigger('chatJoinApproved', messageData);
                }
            },

            onDataChannelClose: function(curConnection, event) {
                this._removeDataChannelListeners(curConnection.dataChannel);
                console.warn('Data channel was closed', event);
            },

            onDataChannelError: function(curConnection, event) {
                console.error('Data channel error', event);
            },

            _addDataChannelListeners: function(dataChannel, curConnection, activeOrPassive) {
                var _this = this;
                if (!dataChannel) {
                    console.error(new Error('Data channel is not provided!'));
                    return;
                }
                _this._removeDataChannelListeners(dataChannel);

                dataChannel.onopen = _this.onDataChannelOpen.bind(_this, curConnection, activeOrPassive);
                dataChannel.onmessage = _this.onDataChannelMessage.bind(_this, curConnection);
                dataChannel.onclose = _this.onDataChannelClose.bind(_this, curConnection);
                dataChannel.onerror = _this.onDataChannelError.bind(_this, curConnection);
            },

            _removeDataChannelListeners: function(dataChannel) {
                if (!dataChannel) {
                    return;
                }

                dataChannel.onopen = null;
                dataChannel.onmessage = null;
                dataChannel.onclose = null;
                dataChannel.onerror = null;
            },

            /**
             * create data channel with channel id equal to chat id
             */
            _createDataChannel: function(curConnection, peerConnection, onDataChannelCreated, callback) {
                var _this = this;

                try {
                    var dataChannel = peerConnection.createDataChannel(curConnection.getWSDeviceId(), {reliable: true});
                } catch (error) {
                    if (onDataChannelCreated) {
                        onDataChannelCreated(error , null, null, null, callback);
                    }
                    return;
                }

                _this._addDataChannelListeners(dataChannel, curConnection, 'active');
                if (onDataChannelCreated) {
                    onDataChannelCreated(null, curConnection, peerConnection, dataChannel, callback);
                }
            },

            _onCreateOfferSuccess: function(curConnection, peerConnection, dataChannel, callback, localDescription) {
                curConnection.log('log', { message: 'done: createLocalOffer:createOffer' });
                curConnection.log('log', { message: 'try: createLocalOffer:setLocalDescription' });
                peerConnection.setLocalDescription(
                    localDescription,
                    function() {
                        curConnection.log('log', { message: 'done: createLocalOffer:setLocalDescription' });
                        if (callback) {
                            callback(null, {
                                peerConnection: peerConnection,
                                dataChannel: dataChannel
                            });
                        }
                    },
                    function(error) {
                        if (callback) {
                            callback(error);
                        }
                    }
                );
            },

            _onCreateOfferError: function(curConnection, callback, error) {
                if (callback) {
                    callback(error);
                }
            },

            _onDataChannelCreated: function(createError, curConnection, peerConnection, dataChannel, callback) {
                var _this = this;
                if (createError) {
                    if (callback) {
                        callback(createError);
                    }
                    return;
                }
                curConnection.log('log', { message: 'done: createLocalOffer:setupDataChannel' });
                curConnection.log('log', { message: 'try: createLocalOffer:createOffer' });

                peerConnection.createOffer(
                    _this._onCreateOfferSuccess.bind(_this, curConnection, peerConnection, dataChannel, callback),
                    _this._onCreateOfferError.bind(_this, curConnection, callback)
                    //,{ mandatory: { OfferToReceiveVideo: true, OfferToReceiveAudio: true }}
                );
            },

            createLocalOffer: function(curConnection, peerConnection, callback) {
                var _this = this;
                curConnection.log('log', { message: 'try: createLocalOffer' });
                if (!peerConnection) {
                    var err = new Error('No peer connection');
                    if (callback) {
                        callback(err);
                    } else {
                        console.error(err);
                    }
                    return;
                }

                curConnection.log('log', { message: 'try: createLocalOffer:setupDataChannel' });
                _this._createDataChannel(
                    curConnection,
                    peerConnection,
                    _this._onDataChannelCreated.bind(_this),
                    callback
                );
            },

            _onCreateAnswerSuccess: function(curConnection, peerConnection, callback, localDescription) {
                curConnection.log('log', { message: 'done: createLocalAnswer:createAnswer' });
                curConnection.log('log', { message: 'try: createLocalAnswer:setLocalDescription' });
                peerConnection.setLocalDescription(
                    localDescription,
                    function() {
                        curConnection.log('log', { message: 'done: createLocalAnswer:setLocalDescription' });
                        if (callback) {
                            callback(null, {
                                peerConnection: peerConnection
                            });
                        }
                    },
                    function(error) {
                        if (callback) {
                            callback(error);
                        }
                    }
                );
            },

            _onCreateAnswerError: function(curConnection, callback, error) {
                if (callback) {
                    callback(error);
                }
            },

            createLocalAnswer: function(curConnection, peerConnection, callback) {
                var _this = this;
                curConnection.log('log', { message: 'try: createLocalAnswer' });
                if (!peerConnection) {
                    var err = new Error('No peer connection');
                    if (callback) {
                        callback(err);
                    } else {
                        console.error(err);
                    }
                    return;
                }

                curConnection.log('log', { message: 'try: createLocalAnswer:setRemoteDescription' });
                try {
                    var remoteOfferDescription = new RTCSessionDescription(curConnection.passive.remoteOfferDescription);
                    peerConnection.setRemoteDescription(remoteOfferDescription);
                } catch (error) {
                    if (callback) {
                        callback(error);
                    }
                    return;
                }
                curConnection.log('log', { message: 'done: createLocalAnswer:setRemoteDescription' });
                curConnection.log('log', { message: 'try: createLocalAnswer:createAnswer' });

                peerConnection.createAnswer(
                    _this._onCreateAnswerSuccess.bind(_this, curConnection, peerConnection, callback),
                    _this._onCreateAnswerError.bind(_this, curConnection, callback)
                    //,{ mandatory: { OfferToReceiveVideo: true, OfferToReceiveAudio: true }}
                );
            },

            destroy: function() {
                var _this = this;
                _this.connections.forEach(function(connection) {
                    connection.destroy();
                });
                _this.connections = [];
            },

            /**
             * broadcast for all connections data channels
             */
            broadcastMessage: function(connections, broadcastData) {
                var _this = this, unused = [];
                connections.forEach(function(_connection) {
                    if (_connection.isActive()) {
                        _connection.dataChannel.send(broadcastData);
                    } else if (_connection.dataChannel) {
                        unused.push(_connection);
                    }
                });
                while (unused.length) {
                    var toRemoveConnection = unused.shift();
                    var removeIndex = connections.indexOf(toRemoveConnection);
                    if (removeIndex === -1) {
                        console.log('removed old client connection',
                            'ws_device_id => ', connections[removeIndex].ws_device_id);
                        connections.splice(removeIndex, 1);
                    }
                }
            },

            getChatConnections: function(connections, chat_id, active) {
                var webrtc_chat_connections = [];
                connections.forEach(function(webrtc_connection) {
                    if (!active || webrtc_connection.isActive()) {
                        if (webrtc_connection.hasChatId(chat_id)) {
                            webrtc_chat_connections.push(webrtc_connection);
                        }
                    }
                });
                return webrtc_chat_connections;
            },

            broadcastChatMessage: function(chat_id, broadcastData) {
                this.broadcastMessage(this.getChatConnections(this.connections, chat_id), broadcastData);
            },

            destroyConnectionChat: function(chat_id) {
                var _this = this;
                _this.connections.forEach(function(connetion) {
                    connetion.removeChatId(chat_id);
                });
            },

            onConnectionDestroyed: function(connection) {
                var _this = this;
                _this._removeDataChannelListeners(connection.dataChannel);
                _this._removePeerConnectionListeners(connection.peerConnection);
                _this.connections.splice(_this.connections.indexOf(connection), 1);
            },

            onWebSocketMessage: function(messageData) {
                var _this = this;

                switch (messageData.type) {
                    case 'notify_webrtc':
                        if (_this[messageData.notify_data]) {
                            _this[messageData.notify_data](messageData);
                        }
                        break;
                }
            }
        };
        extend_core.prototype.inherit(WebRTC, throw_event_core);
        extend_core.prototype.inherit(WebRTC, template_core);
        extend_core.prototype.inherit(WebRTC, event_core);

        WebRTC.prototype.webrtc_template = WebRTC.prototype.template(webrtc_template);
        WebRTC.prototype.waiter_template = WebRTC.prototype.template(waiter_template);

        return new WebRTC();
    }
);

define('text!../templates/body/message_template.ejs',[],function () { return '<div class="flex-sp-start margin-t-b">\n    <%if (_in.messageConstructor.amICreator(_in.message)) {%>\n        <div class="message myMessage flex-item-1-auto flex-dir-col flex-sp-between">\n            <div class="message-container"><%= _in.message.innerHTML %></div>\n            <div class="date-format">\n                <%if (_in.message.createdDatetime) { %>\n                <% var time = new Date(_in.message.createdDatetime);%>\n                <%= time.toISOString()%>\n                <%}%>\n            </div>\n        </div>\n    <div class="width-40px flex-just-center flex-dir-col">\n        <img src="img\\app\\6.ico" width="35px" height="35px" class="border-radius-5 flex-item-auto">\n        <div class="user-info flex-item-1-auto c-01"><%= _in.message.createdByUserId %></div>\n    </div>\n    <%} else {%>\n        <div class="width-40px flex-just-center flex-dir-col">\n            <img src="img\\app\\3.ico" width="35px" height="35px" class="border-radius-5 flex-item-auto">\n            <div class="user-info c-50"><%= _in.message.createdByUserId %></div>\n        </div>\n        <div class="message flex-item-1-auto flex-dir-col flex-sp-between">\n            <div class="message-container"><%= _in.message.innerHTML %></div>\n            <div class="date-format">\n                <%if (_in.message.createdDatetime) { %>\n                <% var time = new Date(_in.message.createdDatetime);%>\n                <%= time.toISOString()%>\n                <%}%>\n            </div>\n            <div class="date-format">\n                <%if (_in.message.receivedDatetime) { %>\n                <% var time = new Date(_in.message.receivedDatetime);%>\n                <%= time.toISOString()%>\n                <%}%>\n            </div>\n        </div>\n    <%}%>\n</div>\n';});

define('text!../templates/body/log_message_template.ejs',[],function () { return '<div class="flex-sp-start p-rel margin-t-b">\n    <div class="message flex-item-1-auto">\n        <%= _in.message.innerHTML %>\n        <div class="date-format">\n            <%if (_in.message.id) { %>\n            <% var time = new Date(_in.message.id);%>\n            <%= time.toISOString()%>\n            <%}%>\n        </div>\n    </div>\n\n</div>';});

define('messages', [
        'throw_event_core',
        'template_core',
        'id_core',
        'overlay_core',
        'switcher_core',
        'extend_core',
        //
        'indexeddb',
        'html_message',
        'html_log_message',
        'webrtc',
        'event_bus',
        //
        'text!../templates/body/message_template.ejs',
        'text!../templates/body/log_message_template.ejs'
    ],
    function(throw_event_core,
             template_core,
             id_core,
             overlay_core,
             switcher_core,
             extend_core,
             //
             indexeddb,
             HTML_message,
             HTML_log_message,
             webrtc,
             event_bus,
             //
             message_template,
             log_message_template) {

        var messages = function(options) {
            this.chat = options.chat;
        };

        messages.prototype = {

            render: function(options, _module) {
                var _this = this;
                _this._module = _module;
                _this.fillListMessage(options);
            },

            getMessageConstructor: function(mode) {
                var _this = this, Constructor;

                switch (mode) {
                    case _this.chat.body.MODE.MESSAGES:
                        Constructor = HTML_message;
                        break;
                    case _this.chat.body.MODE.LOGGER:
                        Constructor = HTML_log_message;
                        break;
                }
                return Constructor;
            },

            scrollTo: function(options) {
                var _this = this;
                if (options.scrollTop) {
                    if (typeof options.scrollTop == 'number') {
                        _this.chat.body_container.scrollTop = options.scrollTop;
                    } else {
                        _this.chat.body_container.scrollTop = _this.chat.body_container.scrollHeight;
                    }
                }
            },

            fillListMessage: function(options) {
                var _this = this;
                if (!_this._module.body_container) {
                    return;
                }
                var changeMode = _this._module.body.previousMode !== _this._module.bodyOptions.mode;
                indexeddb.getAll(
                    _this._module.collectionDescription,
                    _this.tableDefinition(_this._module, _this._module.bodyOptions.mode),
                    function(getAllErr, messages) {
                        if (getAllErr) {
                            _this._module.body_container.innerHTML = getAllErr.message || getAllErr;
                            return;
                        }

                        if (messages.length === 0) {
                            _this._module.body_container.innerHTML = "";
                        }

                        if (_this._module.currentListOptions.final > messages.length || !_this._module.currentListOptions.final) {
                            _this._module.currentListOptions.final = messages.length;
                        }
                        if (_this._module.currentListOptions.previousStart !== _this._module.currentListOptions.start ||
                            _this._module.currentListOptions.previousFinal !== _this._module.currentListOptions.final ||
                            changeMode) {
                            _this.showSpinner(_this._module.body_container);
                            _this._module.currentListOptions.previousStart = _this._module.currentListOptions.start;
                            _this._module.currentListOptions.previousFinal = _this._module.currentListOptions.final;

                            var generatedMessages = [];
                            var currentTemplate;
                            switch (_this._module.bodyOptions.mode) {
                                case _this._module.body.MODE.LOGGER:
                                    currentTemplate = _this.log_message_template;
                                    break;
                                case _this._module.body.MODE.MESSAGES:
                                    currentTemplate = _this.message_template;
                                    break;
                            }

                            for (var i = _this._module.currentListOptions.start; i < _this._module.currentListOptions.final; i++) {
                                generatedMessages.push(currentTemplate({
                                    message: messages[i],
                                    ws_device_id: event_bus.get_ws_device_id(),
                                    messageConstructor: HTML_message.prototype
                                }));
                            }
                            _this._module.body_container.innerHTML = generatedMessages.join('');
                            //_this.scrollTo(options);
                        } else {
                            if (options.callback) {
                                options.callback();
                            }
                        }
                    }
                );
            },

            /**
             * add message to the database
             */
            addMessage: function(_module, mode, options, callback) {
                var _this = this;
                var Message = _this.getMessageConstructor(mode);
                var message = (new Message({innerHTML: options.messageInnerHTML})).toJSON();

                indexeddb.addAll(
                    _this.chat.collectionDescription,
                    _this.tableDefinition(_module, mode),
                    [
                        message
                    ],
                    function(error) {
                        if (error) {
                            if (callback) {
                                callback(error);
                            } else {
                                console.error(error);
                            }
                            return;
                        }

                        if (_this.chat.bodyOptions.mode === _this.chat.body.MODE.MESSAGES &&
                            mode === _this.chat.body.MODE.MESSAGES) {
                            var messageData = {
                                type: "notifyChat",
                                chat_type: "chat_message",
                                message: message,
                                chat_description: {
                                    chat_id: _this.chat.chat_id
                                }
                            };
                            webrtc.broadcastChatMessage(_this.chat.chat_id, JSON.stringify(messageData));
                        }

                        callback && callback(error, message);
                    }
                );
            },

            /**
             * show message in chat body if possible
             * @param message
             */
            renderMessage: function(options, message) {
                var _this = this;
                // TODO check which page is current
                _this.chat.body_container.innerHTML += _this.message_template({
                    message: message,
                    ws_device_id: event_bus.get_ws_device_id(),
                    messageConstructor: HTML_message.prototype
                });
                //_this._module.currentListOptions.final += 1;
                _this.chat.messages_PaginationOptions.currentPage = null;
                _this.chat.render(null, null);
                _this.scrollTo(options);
            },

            addRemoteMessage: function(remoteMessage, callback) {
                var _this = this;
                var message = (new HTML_message(remoteMessage.message)).toJSON();

                indexeddb.addAll(
                    _this.chat.collectionDescription,
                    _this.tableDefinition(_this._module, _this.chat.body.MODE.MESSAGES),
                    [
                        message
                    ],
                    function(error) {
                        if (error) {
                            if (callback) {
                                callback(error);
                            } else {
                                console.error(error);
                            }
                            return;
                        }

                        if (_this.chat.bodyOptions.mode === _this.chat.body.MODE.MESSAGES) {
                            _this.renderMessage({ scrollTop : true }, message);
                        }
                    }
                );
            },

            destroy: function() {
                var _this = this;
            }
        };
        extend_core.prototype.inherit(messages, throw_event_core);
        extend_core.prototype.inherit(messages, template_core);
        extend_core.prototype.inherit(messages, id_core);
        extend_core.prototype.inherit(messages, overlay_core);
        extend_core.prototype.inherit(messages, switcher_core);

        messages.prototype.message_template = messages.prototype.template(message_template);
        messages.prototype.log_message_template = messages.prototype.template(log_message_template);

        return messages;
    });

define('text!../templates/element/textarea_template.ejs',[],function () { return '<textarea class="<%=_in.config.class%>"\n\n        <% if(_in.config.data) {\n                for (var dataKey in _in.config.data) {\n        if (_in.config.data[dataKey] !== "") { %>\n        <%= \'data-\' + dataKey + \'=\\"\' + _in.config.data[dataKey] + \'\\"\' %>\n        <% }\n        }\n        } %>\n\n<% if(_in.config.rows){ %> rows="<%= _in.config.rows%>" <%}%>\n<% if(_in.config.value !== ""){ %> value="<%=_in.config.value%>" <%}%>\n\n><%=_in.config.text%></textarea>\n';});

define('text!../templates/detail_view_container_template.ejs',[],function () { return '<% _in.config.byDataLocation_ = {};\n_in.config.byDataLocation_.user_id = _in.config.byDataLocation.user_id;\n_in.config.byDataLocation_.navbar = _in.config.byDataLocation.navbar;\n\nvar calcDisplay = function(config) {\n    if (_in.options && _in.options.openChats && config.data){\n        if (_in.options.openChats[_in.data.chat_id]) {\n            if (config.data.action === \'showChat\') {\n                return false;\n            }\n        } else {\n            if (config.data.action === \'closeChat\') {\n                return false;\n            }\n        }\n    }\n    return true;\n};%>\n<% if (_in.config && _in.config.byDataLocation_) {\n        for (var locationKey in _in.config.byDataLocation_) { %>\n\n<%= _in.location_wrapper_template({\n    config: _in.config.byDataLocation_[locationKey],\n    data: _in.data ? _in.data : {},\n    triple_element_template: _in.triple_element_template,\n    button_template: _in.button_template,\n    input_template: _in.input_template,\n    label_template: _in.label_template,\n    options: _in.options,\n    calcDisplay: calcDisplay\n}) %>\n<% }\n} %>\n';});

define('text!../templates/chat_info_template.ejs',[],function () { return '<% _in.config._byDataLocation = {};\nif (_in.mode !== \'CHATS\') {\n    if (_in.mode === \'CREATE_CHAT\') {\n        _in.config._byDataLocation.chatAuto = _in.config.byDataLocation.chatAuto;\n        _in.config._byDataLocation.chatManual = _in.config.byDataLocation.chatManual;\n    }\n    if (_in.mode === \'JOIN_CHAT\') {\n        _in.config._byDataLocation.chat_id_input = _in.config.byDataLocation.chat_id_input;\n        _in.config._byDataLocation.chat_message_input = _in.config.byDataLocation.chat_message_input;\n        _in.config._byDataLocation.chat_id_btn = _in.config.byDataLocation.chat_id_btn;\n        _in.config._byDataLocation.remote_offer_label = _in.config.byDataLocation.remote_offer_label;\n        _in.config._byDataLocation.remote_offer = _in.config.byDataLocation.remote_offer;\n        _in.config._byDataLocation.remote_offer_btn = _in.config.byDataLocation.remote_offer_btn;\n    }\n\nif (_in.config && _in.config._byDataLocation) {\n        for (var locationKey in _in.config._byDataLocation) { %>\n\n<%= _in.location_wrapper_template({\n    config: _in.config._byDataLocation[locationKey],\n    data: _in.data ? _in.data : {},\n    triple_element_template: _in.triple_element_template,\n    button_template: _in.button_template,\n    input_template: _in.input_template,\n    label_template: _in.label_template,\n    options: _in.options,\n    textarea_template: _in.textarea_template\n})%>\n<% }\n}\n\n} else {\n    if (_in.mode === \'CHATS\') {\n        _in.config._byDataLocation.chats = _in.config.byDataLocation.chats;\n    }%>\n\n    <% if (_in.data && _in.data.data) {\n            _in.data.data.forEach(function (chat) { %>\n    <% var result = _in.data.openChatsInfoArray.indexOf(chat.chat_id);%>\n    <div data-action="show_more_info" data-role="chatWrapper"\n         data-chat_id="<%= chat.chat_id %>">\n        <% if (_in.config._byDataLocation.chats) { %>\n            <%_in.config._byDataLocation.chats.configs.forEach(function (config) { %>\n            <%  var element = _in.triple_element_template({\n                config: config,\n                button_template: _in.button_template,\n                input_template: _in.input_template,\n                label_template: _in.label_template,\n                data: chat\n            }) %>\n\n            <% if ((result !== -1) && config.element === "svg") { %>\n            <% var div = document.createElement(\'div\');\n                div.innerHTML = element;\n                var pointer = div.querySelector(\'[data-role="pointer"]\');\n                if (pointer) {\n                    pointer.classList.add("rotate-90");\n                }\n            %>\n            <%= div.innerHTML %>\n            <% } else { %>\n            <%= element %>\n            <% } %>\n            <% }) %>\n\n       <% }%>\n\n        <% if (result !== -1) { %>\n        <div data-role="detail_view_container" style="max-height: 15em;" class="max-height-auto max-height-0"\n             data-state="expanded">\n            <%= _in.data.detail_view_template({\n                config: _in.config,\n                data: chat,\n                triple_element_template: _in.triple_element_template,\n                location_wrapper_template: _in.location_wrapper_template,\n                button_template: _in.button_template,\n                input_template: _in.input_template,\n                label_template: _in.label_template,\n                options: _in.data\n            }) %>\n\n        </div>\n        <% } else { %>\n        <div data-role="detail_view_container" style="max-height: 0;" class="max-height-0"></div>\n        <% } %>\n\n    </div>\n    <% })\n    }\n}%>\n\n\n\n\n\n\n\n\n\n';});

define('text!../templates/panel_users_template.ejs',[],function () { return '<% if (_in.data && _in.data.length) {\n     _in.data.forEach(function (_user) { %>\n\n    <div class="flex-sp-start margin-t-b">\n        <div class="width-40px flex-just-center"><img src="img\\app\\3.ico" width="35px" height="35px" class="border-radius-5"></div>\n        <div class="message flex-item-1-auto flex-dir-col flex-sp-between">\n            <div>User name: <%= _user.userName %></div>\n            <div>User id: <%= _user.user_id %></div>\n        </div>\n    </div>\n\n    <% })\n}%>\n';});

define('text!../templates/user_info_template.ejs',[],function () { return '<% if (_in.config && _in.config.byDataLocation) {\n    for (var locationKey in _in.config.byDataLocation) { %>\n        <%= _in.location_wrapper_template({\n            config: _in.config.byDataLocation[locationKey],\n            data: _in.data ? _in.data : {},\n            triple_element_template: _in.triple_element_template,\n            button_template: _in.button_template,\n            input_template: _in.input_template,\n            label_template: _in.label_template,\n            select_template: _in.select_template\n        }) %>\n    <% }\n} %>\n';});

define('text!../templates/join_locations_template.ejs',[],function () { return '<% if (_in.config && _in.config.byDataLocation) {\nfor (var locationKey in _in.config.byDataLocation) { %>\n<%= _in.location_wrapper_template({\n    config: _in.config.byDataLocation[locationKey],\n    data: _in.data ? _in.data : {},\n    triple_element_template: _in.triple_element_template,\n    button_template: _in.button_template,\n    input_template: _in.input_template,\n    label_template: _in.label_template\n}) %>\n<% }\n} %>';});

define('text!../templates/connections_template.ejs',[],function () { return '<% var array = arguments[0]; %>\n<% array.config.forEach(function (_config) { %>\n<%= array.triple_element_template({\n    config: _config,\n    data: array.data,\n    button_template: array.button_template,\n    input_template: array.input_template,\n    label_template: array.label_template\n}) %>\n<% }) %>';});

define('text!../templates/element/select_template.ejs',[],function () { return '<select <% if (_in.config.class) { %> class="<%= _in.config.class %>" <% } %>\n        <% if (_in.config.name) { %> name="<%= _in.config.name%>" <% } %>\n        <% if (_in.config.for) { %> for="<%= _in.config.for%>" <%}%>\n        <% if(_in.config.data) {\n                for (var configDataKey in _in.config.data) {\n        if (_in.config.data[configDataKey] !== "") { %>\n        <%= \'data-\' + configDataKey + \'=\\"\' + _in.config.data[configDataKey] + \'\\"\' %>\n        <%\n        }\n        }\n        } %>>\n    <%if (_in.config.select_options) {\n\n    for (var i = 0; i<_in.config.select_options.length; i++ ) {%>\n    <option value="<%= _in.config.select_options[i].value %>"\n            <% console.log(_in.data.language,_in.config.select_options[i].value);\n            if (window.localization === _in.config.select_options[i].value){%>\n               selected="selected"\n            <%}%>> <%= _in.config.select_options[i].text %> </option>\n    <% } %>\n\n\n\n  <%  }%>\n</select>';});

define('body', [
        'throw_event_core',
        'template_core',
        'render_layout_core',
        'ajax_core',
        'overlay_core',
        'extend_core',
        //
        'users_bus',
        'chats_bus',
        //
        'text!../templates/element/triple_element_template.ejs',
        'text!../templates/element/button_template.ejs',
        'text!../templates/element/label_template.ejs',
        'text!../templates/element/input_template.ejs',
        'text!../templates/element/textarea_template.ejs',
        'text!../templates/detail_view_container_template.ejs',
        'text!../templates/chat_info_template.ejs',
        'text!../templates/panel_users_template.ejs',
        'text!../templates/user_info_template.ejs',
        'text!../templates/join_locations_template.ejs',
        'text!../templates/element/location_wrapper_template.ejs',
        'text!../templates/connections_template.ejs',
        'text!../templates/element/select_template.ejs'
    ],
    function(
        throw_event_core,
        template_core,
        render_layout_core,
        ajax_core,
        overlay_core,
        extend_core,
        //
        users_bus,
        chats_bus,
        //
        triple_element_template,
        button_template,
        label_template,
        input_template,
        textarea_template,
        detail_view_container_template,
        chat_info_template,
        panel_users_template,
        user_info_template,
        join_locations_template,
        location_wrapper_template,
        connections_template,
        select_template
    ) {

        var body = function(options) {
        };

        body.prototype = {

            configMap: {
                "USER_INFO_EDIT": '/configs/user_info_edit_config.json',
                "USER_INFO_SHOW": '/configs/user_info_show_config.json',
                "CREATE_CHAT": '/configs/chats_info_config.json',
                "JOIN_CHAT": '/configs/chats_info_config.json',
                "CHATS": '/configs/chats_info_config.json',
                "USERS": '/configs/users_info_config.json',
                "JOIN_USER": '/configs/users_info_config.json',
                "DETAIL_VIEW": '/configs/chats_info_config.json',
                "CREATE_BLOG": '',
                "JOIN_BLOG": '',
                "BLOGS": '',
                "CONNECTIONS": '/configs/connections_config.json'
            },

            MODE: {
                SETTINGS: 'SETTINGS',
                MESSAGES: 'MESSAGES',
                CONTACT_LIST: 'CONTACT_LIST',
                LOGGER: 'LOGGER',

                CREATE_CHAT: 'CREATE_CHAT',
                JOIN_CHAT: 'JOIN_CHAT',
                CHATS: 'CHATS',
                USERS: 'USERS',
                JOIN_USER: 'JOIN_USER',

                CREATE_BLOG: 'CREATE_BLOG',
                JOIN_BLOG: 'JOIN_BLOG',
                BLOGS: 'BLOGS',

                DETAIL_VIEW: 'DETAIL_VIEW',
                USER_INFO_EDIT: 'USER_INFO_EDIT',
                USER_INFO_SHOW: 'USER_INFO_SHOW',
                CONNECTIONS: 'CONNECTIONS'
            },

            render: function(options, _module, callback) {
                var _this = this;
                _this.module = _module;
                if (_this.module.bodyOptions.show) {
                    switch (_this.module.bodyOptions.mode) {
                        case _this.MODE.SETTINGS:
                            _this.module.settings.renderSettings(options, _module);
                            break;
                        case _this.MODE.CONTACT_LIST:
                            _this.module.contact_list.renderContactList(options, _module);
                            break;
                        case _this.MODE.MESSAGES:
                        case _this.MODE.LOGGER:
                            _this.module.messages.render(options, _module);
                            break;
                        case _this.MODE.USER_INFO_SHOW:
                            users_bus.getMyInfo(options, function(error, options, userInfo) {
                                if (error) {
                                    _this.module.body_container.innerHTML = error;
                                    return;
                                }
                                _this.elementMap = {
                                    "USER_INFO_SHOW": _this.module.body_container
                                };
                                _this.body_mode = _this.MODE.USER_INFO_SHOW;
                                _this.module.user = userInfo;
                                _this.renderLayout(userInfo, null);
                            });
                            break;
                        case _this.MODE.USER_INFO_EDIT:
                                _this.elementMap = {
                                    "USER_INFO_EDIT": _this.module.body_container
                                };
                                _this.body_mode = _this.MODE.USER_INFO_EDIT;
                                if (!_this.module.user){
                                    users_bus.getMyInfo(options, function(error, options, userInfo) {
                                        if (error) {
                                            _this.module.body_container.innerHTML = error;
                                            return;
                                        }
                                        _this.module.user = userInfo;
                                        _this.renderLayout(userInfo, null);
                                    });
                                } else {
                                    _this.renderLayout( _this.module.user, function() {
                                        _this.module.cashBodyElement();
                                    });
                                }
                            break;
                        case _this.MODE.CREATE_CHAT:
                            _this.elementMap = {
                                "CREATE_CHAT": _this.module.body_container
                            };
                            _this.body_mode = _this.MODE.CREATE_CHAT;
                            _this.renderLayout(null, null);
                            break;
                        case _this.MODE.JOIN_CHAT:
                            _this.elementMap = {
                                "JOIN_CHAT": _this.module.body_container
                            };
                            _this.body_mode = _this.MODE.JOIN_CHAT;
                            _this.renderLayout(null, null);
                            break;
                        case _this.MODE.CHATS:
                            users_bus.getMyInfo(options, function(error, options, userInfo) {
                                chats_bus.getChats(error, options, userInfo.chat_ids, function(error, options, chatsInfo) {
                                    if (error) {
                                        _this.module.body_container.innerHTML = error;
                                        return;
                                    }

                                    chatsInfo = _this.limitationQuantityRecords(chatsInfo);
                                    _this.elementMap = {
                                        "CHATS": _this.module.body_container
                                    };
                                    _this.body_mode = _this.MODE.CHATS;
                                    _this.renderLayout(
                                        {
                                        "data": chatsInfo.data,
                                        "detail_view_template": _this.detail_view_container_template,
                                        "openChatsInfoArray": _this.module.openChatsInfoArray,
                                        "openChats": options.openChats
                                        }, callback);
                                });
                            });
                            break;
                        case _this.MODE.USERS:
                            users_bus.getMyInfo(options, function(error, options, userInfo) {
                                    users_bus.getContactsInfo(error, userInfo.user_ids, function(_error, contactsInfo) {
                                        if (_error) {
                                            _this.module.body_container.innerHTML = _error;
                                            return;
                                        }
                                        contactsInfo = _this.limitationQuantityRecords(contactsInfo);
                                        _this.elementMap = {
                                            "USERS": _this.module.body_container
                                        };
                                        _this.body_mode = _this.MODE.USERS;
                                        _this.renderLayout(contactsInfo.data, null);
                                    });
                            });
                            break;
                        case _this.MODE.DETAIL_VIEW:
                            _this.elementMap = {
                                "DETAIL_VIEW": options.detail_view
                            };
                            _this.dataMap = {
                                "DETAIL_VIEW": chats_bus.collectionDescription
                            };
                            _this.body_mode = _this.MODE.DETAIL_VIEW;
                            _this.renderLayout(options, function() {
                                _this.module.rotatePointer(options);
                                _this.module.resizePanel();
                            });
                            break;
                        case  _this.MODE.JOIN_USER:
                            _this.elementMap = {
                                "JOIN_USER": _this.module.body_container
                            };
                            _this.body_mode = _this.MODE.JOIN_USER;
                            _this.renderLayout({readyForFriendRequest: _this.module.joinUser_ListOptions.readyForRequest}, null);
                            break;
                        case  _this.MODE.CREATE_BLOG:
                            _this.module.body_container.innerHTML = "";
                            break;
                        case  _this.MODE.JOIN_BLOG:
                            _this.module.body_container.innerHTML = "";
                            break;
                        case  _this.MODE.BLOGS:
                            _this.module.body_container.innerHTML = "";
                            break;
                        case  _this.MODE.CONNECTIONS:
                            _this.elementMap = {
                                "CONNECTIONS": _this.module.body_container
                            };
                            _this.body_mode = _this.MODE.CONNECTIONS;
                            _this.renderLayout(null, function() {
                                callback();
                            });
                            break;
                    }
                    _this.previousMode = _this.module.bodyOptions.mode;
                }
            },

            limitationQuantityRecords: function(data, forceChangeMode) {
                var _this = this;
                if (data && data.length) {
                    if (_this.module.currentListOptions.final > data.length || !_this.module.currentListOptions.final) {
                        _this.module.currentListOptions.final = data.length;
                    }
                    if (_this.module.currentListOptions.previousStart !== _this.module.currentListOptions.start ||
                        _this.module.currentListOptions.previousFinal !== _this.module.currentListOptions.final ||
                        forceChangeMode) {
                        var needRender = true;
                        _this.showSpinner(_this.module.body_container);
                        _this.module.body_container.innerHTML = "";
                        _this.module.currentListOptions.previousStart = _this.module.currentListOptions.start;
                        _this.module.currentListOptions.previousFinal = _this.module.currentListOptions.final;
                    }
                    data = data.slice(_this.module.currentListOptions.start, _this.module.currentListOptions.final);
                }

                return {data: data, needRender:needRender};
            },

            chatsFilter: function(options, chats) {
                var chat_info;
                chats.every(function(_chat) {
                    if (_chat.chat_id === options.chat_id_value) {
                        chat_info = _chat;
                    }
                    return !chat_info;
                });
                return chat_info;
            },

            destroy: function() {
                var _this = this;
            }
        };

        extend_core.prototype.inherit(body, throw_event_core);
        extend_core.prototype.inherit(body, throw_event_core);
        extend_core.prototype.inherit(body, template_core);
        extend_core.prototype.inherit(body, render_layout_core);
        extend_core.prototype.inherit(body, ajax_core);
        extend_core.prototype.inherit(body, overlay_core);

        body.prototype.chat_info_template = body.prototype.template(chat_info_template);
        body.prototype.user_info_template = body.prototype.template(user_info_template);
        body.prototype.triple_element_template = body.prototype.template(triple_element_template);
        body.prototype.button_template = body.prototype.template(button_template);
        body.prototype.label_template = body.prototype.template(label_template);
        body.prototype.input_template = body.prototype.template(input_template);
        body.prototype.textarea_template = body.prototype.template(textarea_template);
        body.prototype.panel_users_template = body.prototype.template(panel_users_template);
        body.prototype.detail_view_container_template = body.prototype.template(detail_view_container_template);
        body.prototype.join_locations_template = body.prototype.template(join_locations_template);
        body.prototype.location_wrapper_template = body.prototype.template(location_wrapper_template);
        body.prototype.connections_template = body.prototype.template(connections_template);
        body.prototype.select_template = body.prototype.template(select_template);

        body.prototype.dataMap = {
            "USER_INFO_EDIT": '',
            "USER_INFO_SHOW": '',
            "CREATE_CHAT": '',
            'JOIN_CHAT': '',
            "CHATS": '',
            "USERS": '',
            "DETAIL_VIEW": '',
            "FILTER_MY_CHATS": '',
            "CREATE_BLOG": '',
            "JOIN_BLOG": '',
            "BLOGS": '',
            "CONNECTIONS": ''
        };

        body.prototype.templateMap = {
            "USER_INFO_EDIT": body.prototype.user_info_template,
            "USER_INFO_SHOW": body.prototype.user_info_template,
            "CREATE_CHAT": body.prototype.chat_info_template,
            "JOIN_CHAT": body.prototype.chat_info_template,
            "CHATS": body.prototype.chat_info_template,
            "USERS": body.prototype.panel_users_template,
            "JOIN_USER": body.prototype.join_locations_template,
            "DETAIL_VIEW": body.prototype.detail_view_container_template,
            "FILTER_MY_CHATS": body.prototype.filter_my_chats_template,
            "CREATE_BLOG": '',
            "JOIN_BLOG": '',
            "BLOGS": '',
            "CONNECTIONS": body.prototype.connections_template
        };

        body.prototype.configHandlerMap = {
            "JOIN_USER": body.prototype.prepareConfig,
            "USER_INFO_EDIT": body.prototype.prepareConfig,
            "USER_INFO_SHOW": body.prototype.prepareConfig,
            "DETAIL_VIEW": body.prototype.prepareConfig,
            "CHATS": body.prototype.prepareConfig,
            "CREATE_CHAT": body.prototype.prepareConfig,
            "JOIN_CHAT": body.prototype.prepareConfig
        };
        body.prototype.configHandlerContextMap = {};

        body.prototype.dataHandlerMap = {
            "USER_INFO_EDIT": null,
            "USER_INFO_SHOW": null,
            "CREATE_CHAT": null,
            "JOIN_CHAT": null,
            "CHATS": null,
            "USERS": '',
            "DETAIL_VIEW": body.prototype.chatsFilter,
            "FILTER_CHATS": '',
            "CREATE_BLOG": '',
            "JOIN_BLOG": '',
            "BLOGS": '',
            "CONNECTIONS": ''
        };

        body.prototype.dataHandlerContextMap = {
            "USER_INFO_EDIT": null,
            "USER_INFO_SHOW": null,
            "CREATE_CHAT": null,
            "JOIN_CHAT": null,
            "CHATS": null,
            "USERS": users_bus,
            "DETAIL_VIEW": null,
            "FILTER_CHATS": null,
            "CREATE_BLOG": null,
            "JOIN_BLOG": null,
            "BLOGS": null,
            "CONNECTIONS": null
        };

        return body;
    });

define('text!../templates/panel_extra_toolbar_template.ejs',[],function () { return '<% _in.config.forEach(function (_config) { %>\n<%= _in.triple_element_template({\n    config: _config,\n    data: _in.data,\n    button_template: _in.button_template,\n    input_template: _in.input_template,\n    label_template: _in.label_template\n}) %>\n<% }) %>';});

define('text!../templates/messages_extra_toolbar_template.ejs',[],function () { return '<% _in.config.forEach(function (_config) { %>\n<%= _in.triple_element_template({\n    config: _config,\n    data: _in.data,\n    button_template: _in.button_template,\n    input_template: _in.input_template,\n    label_template: _in.label_template\n}) %>\n<% }) %>';});

define('text!../templates/contact_list_extra_toolbar_template.ejs',[],function () { return '<% _in.config.forEach(function (_config) { %>\n<%= _in.triple_element_template({\n    config: _config,\n    data: _in.data,\n    button_template: _in.button_template,\n    input_template: _in.input_template,\n    label_template: _in.label_template\n}) %>\n<% }) %>';});

define('extra_toolbar', [
        'switcher_core',
        'overlay_core',
        'render_layout_core',
        'throw_event_core',
        'extend_core',
        //
        'text!../templates/element/triple_element_template.ejs',
        'text!../templates/element/button_template.ejs',
        'text!../templates/element/label_template.ejs',
        'text!../templates/element/input_template.ejs',
        'text!../templates/panel_extra_toolbar_template.ejs',
        'text!../templates/messages_extra_toolbar_template.ejs',
        'text!../templates/contact_list_extra_toolbar_template.ejs'
    ],
    function(switcher_core,
             overlay_core,
             render_layout_core,
             throw_event_core,
             extend_core,
             //
             triple_element_template,
             button_template,
             label_template,
             input_template,
             panel_extra_toolbar_template,
             messages_extra_toolbar_template,
             contact_list_extra_toolbar_template) {

        var extra_toolbar = function() {
            this.bindContext();
        };

        extra_toolbar.prototype = {

            configMap: {
                BLOGS_EXTRA_TOOLBAR: '',
                CHATS_EXTRA_TOOLBAR: '/configs/panel_chats_extra_toolbar_config.json',
                USERS_EXTRA_TOOLBAR: '/configs/panel_users_extra_toolbar_config.json',
                MESSAGES_EXTRA_TOOLBAR: '/configs/messages_extra_toolbar_config.json',
                CONTACT_LIST_EXTRA_TOOLBAR: '/configs/contact_list_extra_toolbar_config.json',
                LOGGER_EXTRA_TOOLBAR: '/configs/logger_extra_toolbar_config.json',
                CONNECTIONS_EXTRA_TOOLBAR: ''
            },

            MODE: {
                BLOGS_EXTRA_TOOLBAR: 'BLOGS_EXTRA_TOOLBAR',
                CHATS_EXTRA_TOOLBAR: 'CHATS_EXTRA_TOOLBAR',
                USERS_EXTRA_TOOLBAR: ' USERS_EXTRA_TOOLBAR',
                MESSAGES_EXTRA_TOOLBAR: 'MESSAGES_EXTRA_TOOLBAR',
                CONTACT_LIST_EXTRA_TOOLBAR: 'CONTACT_LIST_EXTRA_TOOLBAR',
                LOGGER_EXTRA_TOOLBAR: 'LOGGER_EXTRA_TOOLBAR',
                CONNECTIONS_EXTRA_TOOLBAR: 'CONNECTIONS_EXTRA_TOOLBAR'
            },

            bindContext: function() {
                var _this = this;
                _this.bindedThrowEventRouter = _this.throwEventRouter.bind(_this);
            },

            addEventListeners: function() {
                var _this = this;
                _this.removeEventListeners();
                _this.addRemoveListener('add',  _this._module.extra_toolbar_container, 'click', _this.bindedThrowEventRouter, false);
                _this.addRemoveListener('add',  _this._module.extra_toolbar_container, 'click', _this._module.bindedDataActionRouter, false);
            },

            removeEventListeners: function() {
                var _this = this;
                _this.addRemoveListener('remove',  _this._module.extra_toolbar_container, 'click', _this.bindedThrowEventRouter, false);
                _this.addRemoveListener('remove',  _this._module.extra_toolbar_container, 'click', _this._module.bindedDataActionRouter, false);
            },

            renderExtraToolbar: function(_module, _mode, _callback) {
                var _this = this;
                _this._module = _module;
                _this.elementMap = {
                    BLOGS_EXTRA_TOOLBAR: _module.extra_toolbar_container,
                    CHATS_EXTRA_TOOLBAR: _module.extra_toolbar_container,
                    USERS_EXTRA_TOOLBAR: _module.extra_toolbar_container,
                    MESSAGES_EXTRA_TOOLBAR: _module.extra_toolbar_container,
                    CONTACT_LIST_EXTRA_TOOLBAR: _module.extra_toolbar_container,
                    LOGGER_EXTRA_TOOLBAR: _module.extra_toolbar_container,
                    CONNECTIONS_EXTRA_TOOLBAR: _module.extra_toolbar_container
                };
                if (_mode === _module.body.MODE.DETAIL_VIEW) {
                    _this.optionsDefinition(_module, _this.MODE.CHATS);
                } else {
                    _this.optionsDefinition(_module, _mode);
                }

                if (_this._module.current_Extra_Toolbar_Options.show) {
                    if (_this.previousExtraToolbar !== _mode &&
                        _mode !== _module.body.MODE.DETAIL_VIEW) {
                        _this.showHorizontalSpinner(_module.extra_toolbar_container);
                        _this.body_mode = _mode + "_EXTRA_TOOLBAR";
                        _this.previousExtraToolbar = _mode;
                        _this.renderLayout(null, function() {
                            _module.cashExtraToolbarElement();
                            _this.addEventListeners();
                            _callback();
                        });
                    } else {
                        _callback();
                    }
                } else {
                    _this.previousExtraToolbar = _mode;
                    _module.extra_toolbar_container.innerHTML = "";
                    _callback();
                }
            },

            throwEvent: function(name, data) {
                this._module && this._module.trigger('throw', name, data);
            },

            destroy: function() {
                var _this = this;
                _this.removeEventListeners();
            }

        };
        extend_core.prototype.inherit(extra_toolbar, switcher_core);
        extend_core.prototype.inherit(extra_toolbar, overlay_core);
        extend_core.prototype.inherit(extra_toolbar, render_layout_core);
        extend_core.prototype.inherit(extra_toolbar, throw_event_core);

        extra_toolbar.prototype.triple_element_template = extra_toolbar.prototype.template(triple_element_template);
        extra_toolbar.prototype.button_template = extra_toolbar.prototype.template(button_template);
        extra_toolbar.prototype.label_template = extra_toolbar.prototype.template(label_template);
        extra_toolbar.prototype.input_template = extra_toolbar.prototype.template(input_template);

        extra_toolbar.prototype.panel_extra_toolbar_template = extra_toolbar.prototype.template(panel_extra_toolbar_template);
        extra_toolbar.prototype.messages_extra_toolbar_template = extra_toolbar.prototype.template(messages_extra_toolbar_template);
        extra_toolbar.prototype.contact_list_extra_toolbar_template = extra_toolbar.prototype.template(contact_list_extra_toolbar_template);

        extra_toolbar.prototype.templateMap = {
            BLOGS_EXTRA_TOOLBAR: '',
            CHATS_EXTRA_TOOLBAR: extra_toolbar.prototype.panel_extra_toolbar_template,
            USERS_EXTRA_TOOLBAR: extra_toolbar.prototype.panel_extra_toolbar_template,
            MESSAGES_EXTRA_TOOLBAR: extra_toolbar.prototype.messages_extra_toolbar_template,
            CONTACT_LIST_EXTRA_TOOLBAR: extra_toolbar.prototype.contact_list_extra_toolbar_template,
            LOGGER_EXTRA_TOOLBAR: extra_toolbar.prototype.messages_extra_toolbar_template,
            CONNECTIONS_EXTRA_TOOLBAR: ''
        };

        extra_toolbar.prototype.configHandlerMap = {};
        extra_toolbar.prototype.configHandlerContextMap = {};
        extra_toolbar.prototype.dataHandlerMap = {};
        extra_toolbar.prototype.dataMap = {};

        return extra_toolbar;
    }
);
define('text!../templates/filter_my_chats_template.ejs',[],function () { return '<% _in.config.byDataLocation.per_page.configs = _in.config.byDataLocation.per_page.configs.filter( function(obj){\n    return obj.redraw_mode === _in.data.mode_change } ); %>\n\n\n<div class="flex-item flex-wrap">\n    <% if (_in.config && _in.config.byDataLocation) {\n            for (var locationKey in _in.config.byDataLocation) { %>\n    <%= _in.location_wrapper_template({\n        config: _in.config.byDataLocation[locationKey],\n        data: _in.data ? _in.data : {},\n        triple_element_template: _in.triple_element_template,\n        button_template: _in.button_template,\n        input_template: _in.input_template,\n        label_template: _in.label_template\n    }) %>\n    <% }\n    } %>\n</div>';});

define('filter', [
        'switcher_core',
        'overlay_core',
        'render_layout_core',
        'throw_event_core',
        'extend_core',
        //
        'text!../templates/element/triple_element_template.ejs',
        'text!../templates/element/location_wrapper_template.ejs',
        'text!../templates/element/button_template.ejs',
        'text!../templates/element/label_template.ejs',
        'text!../templates/element/input_template.ejs',
        'text!../templates/filter_my_chats_template.ejs',
        'text!../templates/filter_template.ejs'
    ],
    function(switcher_core,
             overlay_core,
             render_layout_core,
             throw_event_core,
             extend_core,
             //
             triple_element_template,
             location_wrapper_template,
             button_template,
             label_template,
             input_template,
             filter_my_chats_template,
             filter_template) {

        var filter = function() {
            this.bindContext();
        };

        filter.prototype = {

            configMap: {
                BLOGS_FILTER: '',
                CHATS_FILTER: '/configs/panel_chats_filter_config.json',
                USERS_FILTER: '/configs/panel_users_filter_config.json',
                MESSAGES_FILTER: '/configs/messages_filter_config.json',
                CONTACT_LIST_FILTER: '/configs/panel_chats_filter_config.json',
                LOGGER_FILTER: '/configs/messages_filter_config.json',
                CONNECTIONS_FILTER: ''
            },

            MODE: {
                BLOGS_FILTER: 'BLOGS_FILTER',
                CHATS_FILTER: 'CHATS_FILTER',
                USERS_FILTER: 'USERS_FILTER',
                MESSAGES_FILTER: 'MESSAGES_FILTER',
                CONTACT_LIST_FILTER: 'CONTACT_LIST_FILTER',
                LOGGER_FILTER: 'LOGGER',
                CONNECTIONS_FILTER: 'CONNECTIONS_FILTER'
            },

            bindContext: function() {
                var _this = this;
                _this.bindedThrowEventRouter = _this.throwEventRouter.bind(_this);
                _this.bindedDataActionRouter = _this.dataActionRouter.bind(_this);
            },

            addEventListeners: function() {
                var _this = this;
                _this.removeEventListeners();
                _this.addRemoveListener('add',  _this._module.filter_container, 'click', _this.bindedThrowEventRouter, false);
                _this.addRemoveListener('add',  _this._module.filter_container, 'click', _this.bindedDataActionRouter, false);
                _this.addRemoveListener('add',  _this._module.filter_container, 'input', _this.bindedDataActionRouter, false);
            },

            removeEventListeners: function() {
                var _this = this;
                _this.addRemoveListener('remove',  _this._module.filter_container, 'click', _this.bindedThrowEventRouter, false);
                _this.addRemoveListener('remove',  _this._module.filter_container, 'click', _this.bindedDataActionRouter, false);
                _this.addRemoveListener('remove',  _this._module.filter_container, 'input', _this.bindedDataActionRouter, false);
            },

            renderFilter: function(_module, _mode, _callback) {
                var _this = this;
                _this._module = _module;
                _this.elementMap = {
                    BLOGS_FILTER: _module.filter_container,
                    CHATS_FILTER: _module.filter_container,
                    USERS_FILTER: _module.filter_container,
                    MESSAGES_FILTER: _module.filter_container,
                    CONTACT_LIST_FILTER: _module.filter_container,
                    LOGGER_FILTER: _module.filter_container,
                    CONNECTIONS_FILTER: _module.filter_container
                };
                if (_mode === _module.body.MODE.DETAIL_VIEW) {
                    _this.optionsDefinition(_module, _this.MODE.CHATS);
                } else {
                    _this.optionsDefinition(_module, _mode);
                }

                if (_this._module.currnetFilterOptions.show) {
                    if (_module.btn_Filter) {
                        _module.btn_Filter.dataset.toggle = false;
                    }
                    if (_module.currentPaginationOptions.perPageValueNull) {
                        _this.previous_Filter_Options = false;
                    }
                    if (_mode !== _module.body.MODE.DETAIL_VIEW &&
                        (!_this.previous_Filter_Options || _this.previous_Filter_mode !== _mode)) {
                        _this.showHorizontalSpinner(_module.filter_container);
                        _this.previous_Filter_Options = true;
                        _this.body_mode = _mode + "_FILTER";
                        _this.previous_Filter_mode = _mode;
                        var data = {
                            "perPageValue": _module.currentPaginationOptions.perPageValue,
                            "showEnablePagination": _module.currentPaginationOptions.showEnablePagination,
                            "rtePerPage": _module.currentPaginationOptions.rtePerPage,
                            "mode_change": _module.currentPaginationOptions.mode_change
                        };
                        _this.renderLayout(data, function() {
                            _this.addEventListeners();
                            _callback();
                        });
                    } else {
                        _callback();
                    }
                } else {
                    _module.filter_container.innerHTML = "";
                    _this.previous_Filter_Options = false;
                    _callback();
                }
            },

            throwEvent: function(name, data) {
                this._module && this._module.trigger('throw', name, data);
            },

            changePerPage: function(element) {
                var _this = this, value = parseInt(element.value);
                if (element.value === "" || element.value === "0") {
                    _this._module.currentPaginationOptions.perPageValueNull = true;
                    _this._module.currentPaginationOptions.currentPage = null;
                    return;
                } else {
                    _this._module.currentPaginationOptions.perPageValueNull = false;
                }

                if (!_this._module.currentPaginationOptions.rtePerPage) {
                    _this._module.currentPaginationOptions.currentPage = null;
                    _this._module.currentPaginationOptions.perPageValue = value;
                    return;
                }
                if (_this.previous_perPageValue !== value) {
                    _this._module.currentPaginationOptions.perPageValue = value;
                    _this._module.currentPaginationOptions.currentPage = null;
                    _this.previous_perPageValue = value;
                    if (_this._module.currentPaginationOptions.showEnablePagination) {
                        _this.previous_perPageValue = value;
                        _this._module.pagination.previousShow_Pagination = false;
                        _this._module.pagination.countQuantityPages(function() {
                            _this._module.render(null, null);
                        });
                    }
                }
            },

            changeRTE: function(element) {
                var _this = this;
                _this.previous_Filter_Options = false;
                if (element.checked) {
                    _this._module.currentPaginationOptions.mode_change = "rte";
                    _this._module.currentPaginationOptions.rtePerPage = true;
                    _this._module.pagination.previousShow_Pagination = false;
                } else {
                    _this._module.currentPaginationOptions.mode_change = "nrte";
                    _this._module.currentPaginationOptions.rtePerPage = false;
                }
                _this._module.render(null, null);
            },

            showPerPage: function() {
                var _this = this;
                _this._module.currentPaginationOptions.currentPage = null;
                _this._module.pagination.previousShow_Pagination = false;

                if (_this._module.currentPaginationOptions.showEnablePagination) {
                    _this._module.pagination.countQuantityPages(function() {
                        _this._module.render(null, null);
                    });
                }
            },

            destroy: function() {
                var _this = this;
                _this.removeEventListeners();
            }

        };

        extend_core.prototype.inherit(filter, switcher_core);
        extend_core.prototype.inherit(filter, overlay_core);
        extend_core.prototype.inherit(filter, render_layout_core);
        extend_core.prototype.inherit(filter, throw_event_core);

        filter.prototype.triple_element_template = filter.prototype.template(triple_element_template);
        filter.prototype.location_wrapper_template = filter.prototype.template(location_wrapper_template);
        filter.prototype.button_template = filter.prototype.template(button_template);
        filter.prototype.label_template = filter.prototype.template(label_template);
        filter.prototype.input_template = filter.prototype.template(input_template);

        filter.prototype.filter_my_chats_template = filter.prototype.template(filter_my_chats_template);
        filter.prototype.filter_template = filter.prototype.template(filter_template);

        filter.prototype.templateMap = {
            BLOGS_FILTER: '',
            CHATS_FILTER: filter.prototype.filter_my_chats_template,
            USERS_FILTER: filter.prototype.filter_my_chats_template,
            MESSAGES_FILTER: filter.prototype.filter_template,
            CONTACT_LIST_FILTER: filter.prototype.filter_my_chats_template,
            LOGGER_FILTER: filter.prototype.filter_template,
            CONNECTIONS_FILTER: ''
        };

        filter.prototype.configHandlerMap = {
            MESSAGES_FILTER: filter.prototype.prepareConfig,
            LOGGER_FILTER: filter.prototype.prepareConfig,
            CHATS_FILTER: filter.prototype.prepareConfig,
            USERS_FILTER: filter.prototype.prepareConfig,
            CONTACT_LIST_FILTER: filter.prototype.prepareConfig
        };
        filter.prototype.configHandlerContextMap = {};
        filter.prototype.dataHandlerMap = {};
        filter.prototype.dataMap = {};

        return filter;
    }
);
define('text!../templates/popap_template.ejs',[],function () { return '<% _in.config._byDataLocation = {};\n_in.config._byDataLocation.body = _in.config.byDataLocation.body;\n_in.config._byDataLocation.footer = _in.config.byDataLocation.footer;\n%>\n<div class="tetx-line-center <%= _in.options.type%> flex-just-center">\n    <% if (_in.config && _in.config.byDataLocation) {%>\n    <%= _in.location_wrapper_template({\n        config: _in.config.byDataLocation.header,\n        data: _in.data ? _in.data : {},\n        triple_element_template: _in.triple_element_template,\n        button_template: _in.button_template,\n        input_template: _in.input_template,\n        label_template: _in.label_template,\n        description: _in.description\n    }) %>\n    <%  } %>\n</div>\n\n<% if (_in.config && _in.config._byDataLocation) {\n        for (var locationKey in _in.config._byDataLocation) { %>\n<%= _in.location_wrapper_template({\n    config: _in.config._byDataLocation[locationKey],\n    data: _in.data ? _in.data : {},\n    triple_element_template: _in.triple_element_template,\n    button_template: _in.button_template,\n    input_template: _in.input_template,\n    label_template: _in.label_template,\n    description: _in.description\n}) %>\n<% }\n} %>';});

define('text!../configs/popap/confirm_config.json',[],function () { return '[\n  {\n    "role": "locationWrapper",\n    "classList": "p-r-l-04em color-blue title-popap",\n    "location": "header"\n  },\n  {\n    "element": "label",\n    "text": 80,\n    "class": "c-50 p-r-l-04em",\n    "location": "header",\n    "data": {\n      "role": ""\n    }\n  },\n\n  {\n    "role": "locationWrapper",\n    "classList": "w-100p p-t-b flex-sp-between",\n    "location": "body"\n  },\n  {\n    "element": "label",\n    "text": "",\n    "class": "p-b-1em p-r-l-1em",\n    "location": "body",\n    "data": {\n      "role": "",\n      "key": "body_text"\n    }\n  },\n\n  {\n    "role": "locationWrapper",\n    "classList": "flex-sp-around p-05em border-popap-footer",\n    "location": "footer"\n  },\n  {\n    "element": "button",\n    "location": "footer",\n    "class": "border-radius-04em p-tb-03em-lr-1em",\n    "text": 42,\n    "data": {\n      "action": "confirmCancel",\n      "description": 98\n    }\n  },\n  {\n    "element": "button",\n    "location": "footer",\n    "class": "border-radius-04em p-tb-03em-lr-1em",\n    "text": 97,\n    "data": {\n      "action": "confirmOk",\n      "description": 99\n    }\n  }\n]';});

define('text!../configs/popap/error_config.json',[],function () { return '[\n  {\n    "role": "locationWrapper",\n    "classList": "p-r-l-04em color-red title-popap",\n    "location": "header"\n  },\n  {\n    "element": "label",\n    "text": 84,\n    "class": "c-50 p-r-l-04em",\n    "location": "header",\n    "data": {\n      "role": ""\n    }\n  },\n\n  {\n    "role": "locationWrapper",\n    "classList": "w-100p p-t-b flex-sp-between",\n    "location": "body"\n  },\n  {\n    "element": "label",\n    "text": "",\n    "class": "p-b-1em p-r-l-1em",\n    "location": "body",\n    "data": {\n      "role": "",\n      "key": "body_text"\n    }\n  },\n\n  {\n    "role": "locationWrapper",\n    "classList": "flex-sp-around p-05em border-popap-footer",\n    "location": "footer"\n  },\n  {\n    "element": "button",\n    "location": "footer",\n    "class": "border-radius-04em p-tb-03em-lr-1em",\n    "text": 20,\n    "data": {\n      "action": "confirmCancel",\n      "description": 21\n    }\n  }\n]';});

define('text!../configs/popap/succes_config.json',[],function () { return '[\n  {\n    "role": "locationWrapper",\n    "classList": "p-r-l-04em color-green title-popap",\n    "location": "header"\n  },\n  {\n    "element": "label",\n    "text": 85,\n    "class": "c-50 p-r-l-04em",\n    "location": "header",\n    "data": {\n      "role": ""\n    }\n  },\n\n  {\n    "role": "locationWrapper",\n    "classList": "w-100p p-t-b flex-sp-between",\n    "location": "body"\n  },\n  {\n    "element": "label",\n    "text": "",\n    "class": "p-b-1em p-r-l-1em",\n    "location": "body",\n    "data": {\n      "role": "",\n      "key": "body_text"\n    }\n  },\n\n  {\n    "role": "locationWrapper",\n    "classList": "flex-sp-around p-05em border-popap-footer",\n    "location": "footer"\n  },\n  {\n    "element": "button",\n    "location": "footer",\n    "class": "border-radius-04em p-tb-03em-lr-1em",\n    "text": 20,\n    "data": {\n      "action": "confirmCancel",\n      "description": 21\n    }\n  }\n]';});

define('popap_manager', [
        'throw_event_core',
        'extend_core',
        'template_core',
        'render_layout_core',
        'dom_core',
        //
        'text!../templates/element/triple_element_template.ejs',
        'text!../templates/popap_template.ejs',
        'text!../templates/element/location_wrapper_template.ejs',
        'text!../templates/element/button_template.ejs',
        'text!../templates/element/label_template.ejs',
        'text!../templates/element/input_template.ejs',
        //
        'text!../configs/popap/confirm_config.json',
        'text!../configs/popap/error_config.json',
        'text!../configs/popap/succes_config.json'

    ],
    function(throw_event_core,
             extend_core,
             template_core,
             render_layout_core,
             dom_core,
             //
             triple_element_template,
             popap_template,
             location_wrapper_template,
             button_template,
             label_template,
             input_template,
             //
             confirm_config,
             error_config,
             succes_config) {

        var popap_manager = function() {
            this.bindMainContexts();
        };

        popap_manager.prototype = {

            MODE: {
                POPAP: 'POPAP'
            },

            confirm_config: JSON.parse(confirm_config),
            error_config: JSON.parse(error_config),
            succes_config: JSON.parse(succes_config),

            bindMainContexts: function() {
                var _this = this;
                _this.bindedOnDataActionClick = _this.onDataActionClick.bind(_this);
            },

            cashElements: function() {
                var _this = this;
                _this.popapOuterContainer = document.querySelector('[data-role="popap_outer_container"]');
                _this.popapContainer = document.querySelector('[data-role="popap_inner_container"]');
            },

            render: function(options) {
                var _this = this;
                _this.body_mode = _this.MODE.POPAP;
                _this.elementMap = {
                    "POPAP": _this.popapContainer
                };
                _this.config = _this.prepareConfig(options.config);
                _this.fillBody(null, {"type": options.type}, options, function(){
                    _this.popapOuterContainer.classList.remove('hidden-popap');
                    _this.popapOuterContainer.classList.add('in');
                });
            },

            renderPopap: function(type, options, onDataActionClick) {
                var _this = this, config;
                _this.onDataActionClick = onDataActionClick;
                switch (type) {
                    case 'confirm':
                        config = _this.confirm_config;
                        break;
                    case 'error':
                        config = _this.error_config;
                        console.error(options);
                        break;
                    case 'success':
                        config = _this.succes_config;
                        break;
                }
                this.render({
                    "body_text": typeof options.message === "number" ? window.getLocText(options.message) : options.message,
                    "config": config,
                    "type": type
                });
            },

            onDataActionClick: function(event) {
                var _this = this;
                if (_this.onDataActionClick) {
                    var element = _this.getDataParameter(event.target, 'action');
                    if (element) {
                        _this.onDataActionClick(element.dataset.action);
                    }
                }
            },

            onClose: function() {
                var _this = this;
                _this.popapOuterContainer.classList.remove('in');
                _this.popapOuterContainer.classList.add('hidden-popap');
                _this.popapContainer.innerHTML = null;
                _this.onDataActionClick = null;
            },

            onHandlers: function() {
                var _this = this;
                _this.offHandlers();
                _this.addRemoveListener('add', _this.popapContainer, 'click', _this.bindedOnDataActionClick, false);
            },

            offHandlers: function() {
                var _this = this;
                _this.addRemoveListener('remove', _this.popapContainer, 'click', _this.bindedOnDataActionClick, false);
            },

            destroy: function() {
                var _this = this;
            }
        };

        extend_core.prototype.inherit(popap_manager, throw_event_core);
        extend_core.prototype.inherit(popap_manager, template_core);
        extend_core.prototype.inherit(popap_manager, render_layout_core);
        extend_core.prototype.inherit(popap_manager, dom_core);

        popap_manager.prototype.triple_element_template = popap_manager.prototype.template(triple_element_template);
        popap_manager.prototype.location_wrapper_template = popap_manager.prototype.template(location_wrapper_template);
        popap_manager.prototype.button_template = popap_manager.prototype.template(button_template);
        popap_manager.prototype.label_template = popap_manager.prototype.template(label_template);
        popap_manager.prototype.input_template = popap_manager.prototype.template(input_template);
        popap_manager.prototype.popap_template = popap_manager.prototype.template(popap_template);

        popap_manager.prototype.templateMap = {
            "POPAP": popap_manager.prototype.popap_template
        };

        return new popap_manager();
    });

define('text!../templates/chat_template.ejs',[],function () { return '<section class="modal" data-chat_id="<%= _in.chat.chat_id %>">\n    <div class="chat-splitter-item hidden" data-role="splitter_item" data-splitteritem="left">\n    </div>\n    <div class="chat-splitter-item right hidden" data-role="splitter_item" data-splitteritem="right">\n    </div>\n    <header data-role="header_container" class="modal-header">\n        <div data-role="waiter_container"></div>\n    </header>\n    <div data-role="extra_toolbar_container" class="flex-sp-around flex-shrink-0 p-t c-200">extra_toolbar_container</div>\n    <div data-role="filter_container" class="flex wrap background-pink flex-shrink-0 c-200">filter_container</div>\n    <div data-role="body_container" class="modal-body" param-content="message"><!---->\n        <!--<div data-role="messages_container" class="modal-body"></div>-->\n    </div>\n    <footer class="flex-item-auto">\n        <div data-role="editor_container" class="c-200"></div>\n        <div data-role="go_to_container" class="c-100"></div>\n        <div data-role="pagination_container" class="flex filter_container justContent c-200"></div>\n    </footer>\n\n</section>\n';});

define('text!../templates/console_log_template.ejs',[],function () { return '<div><%= _in.message %></div>';});

define('chat', [
        'header',
        'editor',
        'pagination',
        'settings',
        'contact_list',
        'messages',
        'webrtc',
        'websocket',
        'body',
        'event_bus',
        'indexeddb',
        'users_bus',
        'extra_toolbar',
        'filter',
        'chats_bus',
        'popap_manager',
        //
        'ajax_core',
        'template_core',
        'id_core',
        'extend_core',
        'throw_event_core',
        "switcher_core",
        'model_core',
        'overlay_core',
        'render_layout_core',
        //
        'text!../templates/chat_template.ejs',
        'text!../templates/waiter_template.ejs',
        'text!../templates/console_log_template.ejs',
        'text!../templates/element/triple_element_template.ejs',
        'text!../templates/element/button_template.ejs',
        'text!../templates/element/label_template.ejs',
        'text!../templates/element/input_template.ejs',
        'text!../templates/filter_template.ejs'

    ],
    function(Header,
             Editor,
             Pagination,
             Settings,
             Contact_list,
             Messages,
             webrtc,
             websocket,
             Body,
             event_bus,
             indexeddb,
             users_bus,
             Extra_toolbar,
             Filter,
             chats_bus,
             popap_manager,
             //
             ajax_core,
             template_core,
             id_core,
             extend_core,
             throw_event_core,
             switcher_core,
             model_core,
             overlay_core,
             render_layout_core,
             //
             chat_template,
             waiter_template,
             console_log_template,
             triple_element_template,
             button_template,
             label_template,
             input_template,
             filter_template) {

        var defaultOptions = {
            padding: {
                bottom: 5
            },
            headerOptions: {
                show: true,
                mode: Header.prototype.MODE.TAB
            },
            filterOptions: {
                show: false
            },
            bodyOptions: {
                show: true,
                mode: Body.prototype.MODE.MESSAGES
            },
            editorOptions: {
                show: true,
                mode: Editor.prototype.MODE.MAIN_PANEL
            },
            formatOptions: {
                show: false,
                offScroll: false,
                sendEnter: false,
                iSender: true
            },
            messages_GoToOptions: {
                text: "mes",
                show: false,
                rteChoicePage: true,
                mode_change: "rte"
            },
            messages_PaginationOptions: {
                text: "mes",
                show: false,
                mode_change: "rte",
                currentPage: null,
                firstPage: 1,
                lastPage: null,
                showEnablePagination: false,
                showChoicePerPage: false,
                perPageValue: 1,
                perPageValueNull: false,
                rtePerPage: true,
                disableBack: false,
                disableFirst: false,
                disableLast: false,
                disableForward: false
            },
            messages_FilterOptions: {
                show: false
            },
            messages_ExtraToolbarOptions: {
                show: true
            },
            messages_ListOptions: {
                text: "mes",
                start: 0,
                last: null,
                previousStart: 0,
                previousFinal: 0,
                restore: false,
                innerHTML: "",
                data_download: true
            },

            logger_GoToOptions: {
                show: false,
                rteChoicePage: true,
                mode_change: "rte"
            },
            logger_PaginationOptions: {
                text: "log",
                show: false,
                mode_change: "rte",
                currentPage: null,
                firstPage: 1,
                lastPage: null,
                showEnablePagination: false,
                showChoicePerPage: false,
                perPageValue: 25,
                perPageValueNull: false,
                rtePerPage: true,
                disableBack: false,
                disableFirst: false,
                disableLast: false,
                disableForward: false
            },
            logger_FilterOptions: {
                show: false
            },
            logger_ExtraToolbarOptions: {
                show: true
            },
            logger_ListOptions: {
                text: "log",
                start: 0,
                last: null,
                previousStart: 0,
                previousFinal: 0,
                restore: false,
                data_download: true
            },

            contactList_FilterOptions: {
                show: false
            },
            contactList_ExtraToolbarOptions: {
                show: true
            },
            contactList_PaginationOptions: {
                text: "contact",
                show: false,
                mode_change: "rte",
                currentPage: null,
                firstPage: 1,
                lastPage: null,
                showEnablePagination: false,
                showChoicePerPage: false,
                perPageValue: 50,
                perPageValueNull: false,
                rtePerPage: true,
                disableBack: false,
                disableFirst: false,
                disableLast: false,
                disableForward: false
            },
            contactList_GoToOptions: {
                text: "contact",
                show: false,
                rteChoicePage: true,
                mode_change: "rte"
            },
            contactList_ListOptions: {
                text: "contact",
                start: 0,
                last: null,
                previousStart: 0,
                previousFinal: 0,
                restore: false,
                data_download: false
            },

            settings_ExtraToolbarOptions: {
                show: false
            },
            settings_FilterOptions: {
                show: false
            },
            settings_PaginationOptions: {
                show: false
            },
            settings_GoToOptions: {
                show: false
            },
            settings_ListOptions: {
                size_350: true,
                size_700: false,
                size_1050: false,
                size_custom: false,
                adjust_width: false,
                size_custom_value: '350px',
                size_current: '350px'
            }
        };

        var chat = function(options, restore_chat_state) {
            this.extend(this, defaultOptions);
            if (options) {
                this.extend(this, options);
            }
            this.setCollectionDescription();
            this.body = new Body({chat: this});
            this.header = new Header({chat: this});
            this.editor = new Editor({chat: this});
            this.pagination = new Pagination({chat: this});
            this.settings = new Settings({chat: this});
            this.contact_list = new Contact_list({chat: this});
            this.messages = new Messages({chat: this});
            this.extra_toolbar = new Extra_toolbar({chat: this});
            this.filter = new Filter({chat: this});

            this.bindContexts();
            this.setCreator();
            this.addMyUserId();
        };

        chat.prototype = {

            setCollectionDescription: function() {
                if (!this.collectionDescription) {
                    this.collectionDescription = {
                        "db_name": users_bus.getUserId(),
                        "table_descriptions": [{
                            "table_name": this.chat_id + '_messages',
                            "table_indexes": [{
                                "indexName": 'user_ids',
                                "indexKeyPath": 'user_ids',
                                "indexParameter": { multiEntry: true }
                            }],
                            "table_parameter": { autoIncrement: true, keyPath: "id" }
                        }, {
                            "table_name": this.chat_id + '_log_messages',
                            "table_parameter": { keyPath: "id" }
                        }]
                    };
                }
            },

            valueOfKeys: ['chat_id', 'createdByUserId', 'createdDatetime', 'user_ids'],

            bindContexts: function() {
                var _this = this;
                _this.bindedOnChatMessage = _this.onChatMessage.bind(_this);
                _this.bindedStartResizer = _this.startResizer.bind(_this);
                _this.bindedOnChatToggledReady = _this.onChatToggledReady.bind(_this);
                _this.bindedOnChatJoinRequest = _this.onChatJoinRequest.bind(_this);
            },

            unbindContext: function() {
                var _this = this;
                _this.bindedOnChatMessage = null;
                _this.bindedStartResizer = null;
                _this.bindedOnChatToggledReady = null;
                _this.bindedOnChatJoinRequest = null;
            },

            valueOfChat: function() {
                var toStringObject = {};
                var _this = this;
                _this.valueOfKeys.forEach(function(key) {
                    toStringObject[key] = _this[key];
                });
                return toStringObject;
            },

            chatsArray: [],

            cashElements: function() {
                var _this = this;
                _this.chat_element = _this.chat_wrapper.querySelector('section[data-chat_id="' + _this.chat_id + '"]');
                _this.header_container = _this.chat_element.querySelector('[data-role="header_container"]');
                _this.header_waiter_container = _this.chat_element.querySelector('[data-role="waiter_container"]');
                _this.extra_toolbar_container = _this.chat_element.querySelector('[data-role="extra_toolbar_container"]');
                _this.filter_container = _this.chat_element.querySelector('[data-role="filter_container"]');
                _this.body_container = _this.chat_element.querySelector('[data-role="body_container"]');
                _this.pagination_container = _this.chat_element.querySelector('[data-role="pagination_container"]');
                _this.go_to_container = _this.chat_element.querySelector('[data-role="go_to_container"]');
                _this.splitter_left = _this.chat_element.querySelector('[data-splitteritem="left"]');
                _this.splitter_right = _this.chat_element.querySelector('[data-splitteritem="right"]');
            },

            cashExtraToolbarElement: function() {
                var _this = this;
                _this.btn_Filter = _this.extra_toolbar_container.querySelector('[data-role="btn_Filter"]');
            },

            unCashElements: function() {
                var _this = this;
                _this.chat_element = null;
                _this.header_container = null;
                _this.header_waiter_container = null;
                _this.body_container = null;
                _this.btn_Filter = null;
                _this.extra_toolbar_container = null;
                _this.filter_container = null;
                _this.pagination_container = null;
                _this.go_to_container = null;
                _this.splitter_left = null;
                _this.splitter_right = null;
            },

            console: {
                log: function(event) {
                    var _this = this;
                    var txt = _this.console_log_template(event);
                    _this.messages.addMessage(_this, _this.body.MODE.LOGGER,
                        {scrollTop: true, messageInnerHTML: txt}, null);
                }
            },

            initialize: function(options) {
                var _this = this;
                _this.chat_wrapper = options && options.chat_wrapper ? options.chat_wrapper : _this.chat_wrapper;
                _this.chat_wrapper.insertAdjacentHTML('beforeend', _this.chat_template({chat: this}));
                _this.cashElements();
                _this.chat_element.style.width = _this.settings_ListOptions.size_current;
                _this.header_waiter_container.innerHTML = _this.waiter_template();
                _this.settings.showSplitterItems(this);
                _this.addEventListeners();
            },

            render: function(options, _array) {
                var _this = this;
                _this.editor.render(options, _this);
                _this.header.render(options, _array, _this);
                _this.extra_toolbar.renderExtraToolbar(_this, _this.bodyOptions.mode, function(){
                    _this.filter.renderFilter(_this, _this.bodyOptions.mode, function() {
                        _this.pagination.render(options, _this, _this.bodyOptions.mode);
                        _this.body.render({scrollTop: true}, _this);
                    });
                });
            },

            /**
             * prepare change mode from UI event
             */
            changeMode: function(element) {
                var _this = this;
                _this.switchModes([
                    {
                        chat_part: element.dataset.chat_part,
                        newMode: element.dataset.mode_to,
                        target: element
                    }
                ]);
            },

            /**
             * switch mode of all dependencies in the chat followed by array of descriptions
             * @param _array - array of descriptions
             */
            switchModes: function(_array, options) {
                var _this = this;
                _array.forEach(function(_obj) {
                    switch (_obj.chat_part) {
                        case "body":
                            switch (_obj.newMode) {
                                case _this.body.MODE.SETTINGS:
                                    _this.bodyOptions.mode = _this.body.MODE.SETTINGS;
                                    _this.messages_ListOptions.final = null;
                                    _this.logger_ListOptions.final = null;
                                    _this.editorOptions.show = false;
                                    _this.toggleShowState({
                                        key: 'show',
                                        save: true,
                                        toggle: false
                                    }, _this.formatOptions, _obj);
                                    _this.toggleShowState({
                                        key: 'show',
                                        save: true,
                                        toggle: false
                                    }, _this.messages_PaginationOptions, _obj);
                                    _this.toggleShowState({
                                        key: 'show',
                                        save: true,
                                        toggle: false
                                    }, _this.messages_GoToOptions, _obj);
                                    _this.toggleShowState({
                                        key: 'show',
                                        save: true,
                                        toggle: false
                                    }, _this.messages_FilterOptions, _obj);
                                    _this.toggleShowState({
                                        key: 'show',
                                        save: true,
                                        toggle: false
                                    }, _this.logger_PaginationOptions, _obj);
                                    _this.toggleShowState({
                                        key: 'show',
                                        save: true,
                                        toggle: false
                                    }, _this.logger_GoToOptions, _obj);
                                    _this.toggleShowState({
                                        key: 'show',
                                        save: true,
                                        toggle: false
                                    }, _this.logger_FilterOptions, _obj);
                                    _this.toggleShowState({
                                        key: 'show',
                                        save: true,
                                        toggle: false
                                    }, _this.contactList_FilterOptions, _obj);
                                    _this.toggleShowState({
                                        key: 'show',
                                        save: true,
                                        toggle: false
                                    }, _this.contactList_PaginationOptions, _obj);
                                    _this.toggleShowState({
                                        key: 'show',
                                        save: true,
                                        toggle: false
                                    }, _this.contactList_GoToOptions, _obj);
                                    _this.toggleText({
                                        key: 'innerHTML',
                                        save: true
                                    }, _this.messages_ListOptions, _this.editor.message_inner_container);
                                    break;
                                case _this.body.MODE.CONTACT_LIST:
                                    _this.bodyOptions.mode = _this.body.MODE.CONTACT_LIST;
                                    _this.editorOptions.show = false;
                                    _this.messages_ListOptions.final = null;
                                    _this.logger_ListOptions.final = null;
                                    _this.toggleShowState({
                                        key: 'show',
                                        save: true,
                                        toggle: false
                                    }, _this.formatOptions, _obj);
                                    _this.toggleShowState({
                                        key: 'show',
                                        save: true,
                                        toggle: false
                                    }, _this.messages_PaginationOptions, _obj);
                                    _this.toggleShowState({
                                        key: 'show',
                                        save: true,
                                        toggle: false
                                    }, _this.messages_GoToOptions, _obj);
                                    _this.toggleShowState({
                                        key: 'show',
                                        save: true,
                                        toggle: false
                                    }, _this.messages_FilterOptions, _obj);
                                    _this.toggleShowState({
                                        key: 'show',
                                        save: true,
                                        toggle: false
                                    }, _this.logger_PaginationOptions, _obj);
                                    _this.toggleShowState({
                                        key: 'show',
                                        save: true,
                                        toggle: false
                                    }, _this.logger_GoToOptions, _obj);
                                    _this.toggleShowState({
                                        key: 'show',
                                        save: true,
                                        toggle: false
                                    }, _this.logger_FilterOptions, _obj);
                                    _this.toggleShowState({
                                        key: 'show',
                                        restore: true,
                                        toggle: true
                                    }, _this.contactList_FilterOptions, _obj);
                                    _this.toggleShowState({
                                        key: 'show',
                                        restore: true,
                                        toggle: true
                                    }, _this.contactList_PaginationOptions, _obj);
                                    _this.toggleShowState({
                                        key: 'show',
                                        restore: true,
                                        toggle: true
                                    }, _this.contactList_GoToOptions, _obj);
                                    _this.toggleText({
                                        key: 'innerHTML',
                                        save: true
                                    }, _this.messages_ListOptions, _this.editor.message_inner_container);
                                    break;
                                case _this.body.MODE.MESSAGES:
                                    _this.bodyOptions.mode = _this.body.MODE.MESSAGES;
                                    _this.editorOptions.show = true;
                                    _this.toggleShowState({
                                        key: 'show',
                                        restore: true,
                                        toggle: true
                                    }, _this.formatOptions, _obj);
                                    _this.toggleShowState({
                                        key: 'show',
                                        restore: true,
                                        toggle: true
                                    }, _this.messages_PaginationOptions, _obj);
                                    _this.toggleShowState({
                                        key: 'show',
                                        restore: true,
                                        toggle: true
                                    }, _this.messages_GoToOptions, _obj);
                                    _this.toggleShowState({
                                        key: 'show',
                                        restore: true,
                                        toggle: true
                                    }, _this.messages_FilterOptions, _obj);
                                    _this.toggleShowState({
                                        key: 'show',
                                        save: true,
                                        toggle: false
                                    }, _this.logger_PaginationOptions, _obj);
                                    _this.toggleShowState({
                                        key: 'show',
                                        save: true,
                                        toggle: false
                                    }, _this.logger_GoToOptions, _obj);
                                    _this.toggleShowState({
                                        key: 'show',
                                        save: true,
                                        toggle: false
                                    }, _this.logger_FilterOptions, _obj);
                                    _this.toggleShowState({
                                        key: 'show',
                                        save: true,
                                        toggle: false
                                    }, _this.contactList_FilterOptions, _obj);
                                    _this.toggleShowState({
                                        key: 'show',
                                        save: true,
                                        toggle: false
                                    }, _this.contactList_PaginationOptions, _obj);
                                    _this.toggleShowState({
                                        key: 'show',
                                        save: true,
                                        toggle: false
                                    }, _this.contactList_GoToOptions, _obj);
                                    _this.toggleText({
                                        key: 'innerHTML',
                                        restore: true
                                    }, _this.messages_ListOptions, _this.editor.message_inner_container);
                                    break;
                                case _this.body.MODE.LOGGER:
                                    _this.bodyOptions.mode = _this.body.MODE.LOGGER;
                                    _this.editorOptions.show = false;
                                    _this.messages_ListOptions.final = null;
                                    _this.logger_ListOptions.final = null;
                                    _this.toggleShowState({
                                        key: 'show',
                                        save: true,
                                        toggle: false
                                    }, _this.messages_PaginationOptions, _obj);
                                    _this.toggleShowState({
                                        key: 'show',
                                        save: true,
                                        toggle: false
                                    }, _this.messages_GoToOptions, _obj);
                                    _this.toggleShowState({
                                        key: 'show',
                                        save: true,
                                        toggle: false
                                    }, _this.messages_FilterOptions, _obj);
                                    _this.toggleShowState({
                                        key: 'show',
                                        restore: true,
                                        toggle: true
                                    }, _this.logger_PaginationOptions, _obj);
                                    _this.toggleShowState({
                                        key: 'show',
                                        restore: true,
                                        toggle: true
                                    }, _this.logger_GoToOptions, _obj);
                                    _this.toggleShowState({
                                        key: 'show',
                                        restore: true,
                                        toggle: true
                                    }, _this.logger_FilterOptions, _obj);
                                    _this.toggleShowState({
                                        key: 'show',
                                        save: true,
                                        toggle: false
                                    }, _this.contactList_FilterOptions, _obj);
                                    _this.toggleShowState({
                                        key: 'show',
                                        save: true,
                                        toggle: false
                                    }, _this.contactList_PaginationOptions, _obj);
                                    _this.toggleShowState({
                                        key: 'show',
                                        save: true,
                                        toggle: false
                                    }, _this.contactList_GoToOptions, _obj);
                                    break;
                            }
                            break;
                        case "editor":
                            switch (_obj.newMode) {
                                case _this.editor.MODE.MAIN_PANEL:
                                    _this.editorOptions.show = true;
                                    break;
                                case _this.editor.MODE.FORMAT_PANEL:
                                    if (_obj.target) {
                                        var bool_Value = _obj.target.dataset.toggle === "true";
                                        _this.formatOptions.show = bool_Value;
                                        _obj.target.dataset.toggle = !bool_Value;
                                    }
                                    break;
                            }
                            break;
                        case "pagination":
                            switch (_obj.newMode) {
                                case _this.pagination.MODE.PAGINATION:
                                    if (_obj.target) {
                                        _this.optionsDefinition(_this, _this.bodyOptions.mode);
                                        _this.currentPaginationOptions.show = _obj.target.checked;
                                        _this.currentPaginationOptions.showEnablePagination = _obj.target.checked;
                                        if (!_obj.target.checked && _this.currentListOptions) {
                                            _this.currentListOptions.previousStart = 0;
                                            _this.currentListOptions.previousFinal = null;
                                            _this.currentListOptions.start = 0;
                                            _this.currentListOptions.final = null;
                                        }
                                    }
                                    _this.toggleShowState({
                                        key: 'show',
                                        toggle: false
                                    }, _this.currentPaginationOptions, _obj);
                                    break;
                                case _this.pagination.MODE.GO_TO:
                                    _this.optionsDefinition(_this, _this.bodyOptions.mode);
                                    if (_obj.target) {
                                        var bool_Value = _obj.target.dataset.toggle === "true";
                                        _this.currentGoToOptions.show = bool_Value;
                                    }
                                    break;
                            }
                            break;
                        case "filter":
                            switch (_obj.newMode) {
                                case _this.filter.MODE.MESSAGES_FILTER: case _this.filter.MODE.CONTACT_LIST_FILTER:
                                    if (_obj.target) {
                                        var bool_Value = _obj.target.dataset.toggle === "true";
                                        _this.optionsDefinition(_this, _this.bodyOptions.mode);
                                        _this.currnetFilterOptions.show = bool_Value;
                                        _obj.target.dataset.toggle = !bool_Value;
                                    }
                                    break;
                            }
                            break;
                    }
                });
                _this.render(options, _array);
            },

            addEventListeners: function() {
                var _this = this;
                _this.removeEventListeners();
                _this.on('throw', _this.throwRouter, _this);
                _this.on('log', _this.console.log, _this);
                _this.on('chat_message', _this.bindedOnChatMessage, _this);
                _this.on('chat_toggled_ready', _this.bindedOnChatToggledReady, _this);
                _this.on('srv_chat_join_request', _this.bindedOnChatJoinRequest, _this);
                _this.addRemoveListener('add', _this.splitter_left, 'mousedown', _this.bindedStartResizer, false);
                _this.addRemoveListener('add', _this.splitter_right, 'mousedown', _this.bindedStartResizer, false);
                _this.addRemoveListener('add', _this.splitter_left, 'touchstart', _this.bindedStartResizer, false);
                _this.addRemoveListener('add', _this.splitter_right, 'touchstart', _this.bindedStartResizer, false);
                _this.addRemoveListener('add', _this.splitter_right, 'touchmove', _this.bindedStartResizer, false);
                _this.addRemoveListener('add', _this.splitter_left, 'touchmove', _this.bindedStartResizer, false);
                _this.addRemoveListener('add', _this.splitter_right, 'touchend', _this.bindedStartResizer, false);
                _this.addRemoveListener('add', _this.splitter_left, 'touchend', _this.bindedStartResizer, false);
            },

            removeEventListeners: function() {
                var _this = this;
                _this.off('throw', _this.throwRouter);
                _this.off('log');
                _this.off('chat_message', _this.bindedOnChatMessage);
                _this.off('chat_toggled_ready', _this.bindedOnChatToggledReady);
                _this.off('srv_chat_join_request', _this.bindedOnChatJoinRequest);
                _this.addRemoveListener('remove', _this.splitter_left, 'mousedown', _this.bindedStartResizer, false);
                _this.addRemoveListener('remove', _this.splitter_left, 'touchstart', _this.bindedStartResizer, false);
                _this.addRemoveListener('remove', _this.splitter_right, 'mousedown', _this.bindedStartResizer, false);
                _this.addRemoveListener('remove', _this.splitter_right, 'touchstart', _this.bindedStartResizer, false);
                _this.addRemoveListener('remove', _this.splitter_right, 'touchmove', _this.bindedStartResizer, false);
                _this.addRemoveListener('remove', _this.splitter_left, 'touchmove', _this.bindedStartResizer, false);
                _this.addRemoveListener('remove', _this.splitter_right, 'touchend', _this.bindedStartResizer, false);
                _this.addRemoveListener('remove', _this.splitter_left, 'touchend', _this.bindedStartResizer, false);
            },

            throwRouter: function(action, event) {
                if (this[action]) {
                    this[action](event);
                }
            },

            startResizer: function(event) {
                var _this = this;
                event.stopPropagation();
                event.preventDefault();
                switch (event.type) {
                    case 'mousedown':case 'touchstart':
                    event_bus.trigger('transformToResizeState', event, _this);
                    break;
                    case 'touchmove': case 'touchend':
                    event_bus.trigger('redirectResize', event, _this);
                    break;
                }
            },

            destroyChat: function() {
                var _this = this;
                _this.removeEventListeners();
                this.header.destroy();
                this.header = null;
                this.editor.destroy();
                this.editor = null;
                this.pagination.destroy();
                this.pagination = null;
                this.settings.destroy();
                this.settings = null;
                this.contact_list.destroy();
                this.contact_list = null;
                this.messages.destroy();
                this.messages = null;
                this.extra_toolbar.destroy();
                this.extra_toolbar = null;
                this.filter.destroy();
                this.filter = null;
                this.body.destroy();
                this.body = null;
                _this.chat_element.remove();
                _this.unCashElements();
                _this.unbindContext();
                _this._notListenWebRTCConnection();
            },

            toChatDescription: function() {
                var _this = this;
                return {
                    chat_id: _this.chat_id,
                    user_ids: _this.user_ids,
                    createdDatetime: _this.createdDatetime,
                    createdByUserId: _this.createdByUserId,
                    receivedDatetime: _this.receivedDatetime,
                    collectionDescription: _this.collectionDescription,
                    padding: _this.padding,
                    headerOptions: _this.headerOptions,
                    filterOptions: _this.filterOptions,
                    bodyOptions: _this.bodyOptions,
                    editorOptions: _this.editorOptions,
                    formatOptions: _this.formatOptions,
                    messages_GoToOptions: _this.messages_GoToOptions,
                    messages_PaginationOptions: _this.messages_PaginationOptions,
                    messages_FilterOptions: _this.messages_FilterOptions,
                    messages_ExtraToolbarOptions: _this.messages_ExtraToolbarOptions,
                    messages_ListOptions: _this.messages_ListOptions,
                    logger_GoToOptions: _this.logger_GoToOptions,
                    logger_PaginationOptions: _this.logger_PaginationOptions,
                    logger_FilterOptions: _this.logger_FilterOptions,
                    logger_ExtraToolbarOptions: _this.logger_ExtraToolbarOptions,
                    logger_ListOptions: _this.logger_ListOptions,
                    contactList_FilterOptions: _this.contactList_FilterOptions,
                    contactList_ExtraToolbarOptions: _this.contactList_ExtraToolbarOptions,
                    contactList_PaginationOptions: _this.contactList_PaginationOptions,
                    contactList_GoToOptions: _this.contactList_GoToOptions,
                    settings_ExtraToolbarOptions: _this.settings_ExtraToolbarOptions,
                    settings_FilterOptions: _this.settings_FilterOptions,
                    settings_PaginationOptions: _this.settings_PaginationOptions,
                    settings_GoToOptions: _this.settings_GoToOptions,
                    settings_ListOptions: _this.settings_ListOptions
                };
            },

            renderPagination: function() {
                var _this = this;
                _this.pagination.initialize({chat: _this});
            },

            fillMessages: function(obj) {
                var _this = this;
                _this.messages.fillListMessage(obj);
            },

            onChatMessage: function(eventData) {
                this.messages.addRemoteMessage(eventData);
            },

            onChatToggledReady: function(eventData) {
                this.chat_ready_state = eventData.ready_state;
            },

            onChatJoinRequest: function(eventData) {
                var _this = this;
                event_bus.set_ws_device_id(eventData.target_ws_device_id);
                if (_this.chat_ready_state &&
                    _this.amICreator() &&
                    confirm(eventData.request_body.message)) {
                    if (!_this.isInUsers(_this, eventData.from_user_id)) {
                        // add user and save chat with this user TODO update only user_ids in chat description
                        _this.user_ids.push(eventData.from_user_id);
                        chats_bus.putChatToIndexedDB(_this.toChatDescription(), function(err) {
                            if (err) {
                                popap_manager.renderPopap(
                                    'error',
                                    {message: err},
                                    function(action) {
                                        switch (action) {
                                            case 'confirmCancel':
                                                popap_manager.onClose();
                                                break;
                                        }
                                    }
                                );
                                return;
                            }

                            _this._listenWebRTCConnection();
                            webrtc.handleConnectedDevices(eventData.user_wscs_descrs);
                        });
                    } else {
                        _this._listenWebRTCConnection();
                        webrtc.handleConnectedDevices(eventData.user_wscs_descrs);
                    }
                }
            },

            _webRTCConnectionReady: function(eventConnection) {
                var _this = this;
                if (eventConnection.hasChatId(_this.chat_id)) {
                    // if connection for chat join request
                    var messageData = {
                        type: "chatJoinApproved",
                        from_user_id: users_bus.getUserId(),
                        chat_description: _this.valueOfChat()
                    };
                    if (eventConnection.isActive()) {
                        eventConnection.dataChannel.send(JSON.stringify(messageData));
                        _this._notListenWebRTCConnection();
                    } else {
                        console.warn('No friendship data channel!');
                    }
                }
            },

            _notListenWebRTCConnection: function() {
                webrtc.off('webrtc_connection_established', this._webRTCConnectionReady);
            },

            _listenWebRTCConnection: function() {
                this._notListenWebRTCConnection();
                webrtc.on('webrtc_connection_established', this._webRTCConnectionReady, this);
            }
        };
        extend_core.prototype.inherit(chat, ajax_core);
        extend_core.prototype.inherit(chat, template_core);
        extend_core.prototype.inherit(chat, id_core);
        extend_core.prototype.inherit(chat, extend_core);
        extend_core.prototype.inherit(chat, throw_event_core);
        extend_core.prototype.inherit(chat, switcher_core);
        extend_core.prototype.inherit(chat, model_core);
        extend_core.prototype.inherit(chat, render_layout_core);
        extend_core.prototype.inherit(chat, overlay_core);

        chat.prototype.chat_template = chat.prototype.template(chat_template);
        chat.prototype.waiter_template = chat.prototype.template(waiter_template);
        chat.prototype.console_log_template = chat.prototype.template(console_log_template);
        chat.prototype.triple_element_template = chat.prototype.template(triple_element_template);
        chat.prototype.button_template = chat.prototype.template(button_template);
        chat.prototype.label_template = chat.prototype.template(label_template);
        chat.prototype.input_template = chat.prototype.template(input_template);
        chat.prototype.filter_template = chat.prototype.template(filter_template);

        return chat;
    });


define('disable_display_core',
    [],function () {

        var disable_display_core = function() {};

        disable_display_core.prototype = {

            __class_name: "disable_display_core",

            toggleButtonDisplay: function(toggle, buttonElement) {
                var styleDisplay = buttonElement.dataset.styleDisplay;
                if (typeof toggle !== 'boolean') {
                    toggle = buttonElement.style.display === 'none';
                }

                if (toggle) {
                    if (!styleDisplay) {
                        styleDisplay = 'inherit';
                    }
                    buttonElement.style.display = styleDisplay;
                } else {
                    styleDisplay = window.getComputedStyle(buttonElement).display;
                    buttonElement.style.display = 'none';
                    buttonElement.dataset.styleDisplay = styleDisplay;
                }
            },

            hideUIButton: function(id, buttonsElement) {
                var _this = this;
                if (!_this.UIElements) {
                    throw new Error('Elements container is not implemented!');
                }

                if (!_this.UIElements[id]) {
                    _this.UIElements[id] = {};
                    _this.UIElements[id].hideButtons = [];
                }
                buttonsElement.forEach(function(buttonElement) {
                    _this.UIElements[id].hideButtons.push(buttonElement);
                    _this.toggleButtonDisplay(null, buttonElement);
                });
            },

            unHideUIButton: function(id) {
                var _this = this;
                if (!_this.UIElements) {
                    throw new Error('Elements container is not implemented!');
                }

                if (_this.UIElements[id] && Array.isArray(_this.UIElements[id].hideButtons)) {
                    _this.UIElements[id].hideButtons.forEach(function(buttonElement) {
                        _this.toggleButtonDisplay(null, buttonElement);
                    });
                }
                _this.UIElements[id].hideButtons = [];
            },

            toggleButtonDisable: function(toggle, buttonElement) {
                if (toggle) {
                    buttonElement.disabled = true;
                } else {
                    buttonElement.disabled = false;
                }
            },

            disableButton: function(id, buttonElement) {
                var _this = this;
                if (!_this.UIElements) {
                    throw new Error('Elements container is not implemented!');
                }

                if (!_this.UIElements[id]) {
                    _this.UIElements[id] = {};
                    _this.UIElements[id].disableButtons = [];
                }
                _this.UIElements[id].disableButtons.push(buttonElement);
                _this.toggleButtonDisable(true, buttonElement);
            },

            enableButton: function(id) {
                var _this = this;
                if (!_this.UIElements) {
                    throw new Error('Elements container is not implemented!');
                }

                _this.UIElements[id].disableButtons.forEach(function(buttonElement) {
                    _this.toggleButtonDisable(false, buttonElement);
                });

                _this.UIElements[id].disableButtons = [];
            }
        };

        return disable_display_core;
    }
);
define('text!../templates/chat_platform_template.ejs',[],function () { return '<div class="flex-outer-container" data-role="chat_wrapper"></div>';});

define('chat_platform', [
        'chat',
        'websocket',
        'webrtc',
        'event_bus',
        'indexeddb',
        'users_bus',
        'chats_bus',
        'popap_manager',
        //
        'overlay_core',
        'throw_event_core',
        'template_core',
        'dom_core',
        'extend_core',
        'disable_display_core',
        //
        'text!../templates/chat_platform_template.ejs'
    ],
    function(Chat,
             websocket,
             webrtc,
             event_bus,
             indexeddb,
             users_bus,
             chats_bus,
             popap_manager,
             //
             overlay_core,
             throw_event_core,
             template_core,
             dom_core,
             extend_core,
             disable_display_core,
             //
             chat_platform_template) {

        var chat_platform = function() {
            this.link = /chat/;
            this.withPanels = true;
            this.bindContexts();
            this.UIElements = {}; // for disable core
        };

        chat_platform.prototype = {

            min_chats_width: 350,
            min_move: 5,

            bindContexts: function() {
                var _this = this;
                _this.bindedOnThrowEvent = _this.onThrowEvent.bind(_this);
                _this.bindedHandleResizer = _this.handleResizer.bind(_this);
                _this.bindedOnVisibilityChange = _this.onVisibilityChange.bind(_this);
            },

            render: function
                (options) {
                if (!options || !options.navigator) {
                    console.error(new Error('Invalid input options for render'));
                    return;
                }
                var _this = this;
                _this.cashMainElements();
                _this.navigator = options.navigator;
                if (!_this.mainConteiner) {
                    return;
                }
                _this.mainConteiner.innerHTML = _this.chat_platform_template({});
                _this.cashElements();
                _this.addEventListeners();
                _this.toggleWaiter();
            },

            dispose: function() {
                var _this = this;
                _this.removeEventListeners();
            },

            cashMainElements: function() {
                var _this = this;
                _this.mainConteiner = document.querySelector('[data-role="main_container"]');
                _this.chat_resize_container = document.querySelector('[data-role="chat_resize_container"]');
                _this.line_resize = _this.chat_resize_container.querySelector('[data-role="resize_line"]');
            },

            cashElements: function() {
                var _this = this;
                _this.chat_wrapper = _this.mainConteiner.querySelector('[data-role="chat_wrapper"]');
            },

            unCashElements: function() {
                var _this = this;
                _this.mainConteiner = null;
                _this.chat_wrapper = null;
                _this.chat_resize_container = null;
                _this.line_resize = null;
            },

            addEventListeners: function() {
                var _this = this;
                _this.removeEventListeners();
                event_bus.on('throw', _this.bindedOnThrowEvent, false);
                event_bus.on('addNewChatAuto', _this.addNewChatAuto, _this);
                event_bus.on('getOpenChats', _this.getOpenChats, _this);
                event_bus.on('chatsDestroy', _this.destroyChats, _this);
                event_bus.on('toCloseChat', _this.toCloseChat, _this);
                event_bus.on('notifyChat', _this.onChatMessageRouter, _this);
                event_bus.on('chatJoinApproved', _this.chatCreateApproved, _this);
                event_bus.on('transformToResizeState', _this.transformToResizeState, _this);
                event_bus.on('redirectResize', _this.handleResizer, _this);
                websocket.on('message', _this.onChatMessageRouter, _this);
                _this.on('showChat', _this.showChat, _this);
                _this.addRemoveListener('add', _this.chat_resize_container, 'mouseup', _this.bindedHandleResizer, false);
                _this.addRemoveListener('add', _this.chat_resize_container, 'touchend', _this.bindedHandleResizer, false);
                _this.addRemoveListener('add', _this.chat_resize_container, 'mousemove', _this.bindedHandleResizer, false);
                _this.addRemoveListener('add', _this.chat_resize_container, 'touchmove', _this.bindedHandleResizer, false);
                _this.addRemoveListener('add', document, 'visibilitychange', _this.bindedOnVisibilityChange, false);
            },

            removeEventListeners: function() {
                var _this = this;
                event_bus.off('throw', _this.bindedOnThrowEvent);
                event_bus.off('addNewChatAuto', _this.addNewChatAuto);
                event_bus.off('getOpenChats', _this.getOpenChats);
                event_bus.off('chatsDestroy', _this.destroyChats);
                event_bus.off('toCloseChat', _this.toCloseChat);
                event_bus.off('notifyChat', _this.onChatMessageRouter);
                event_bus.off('chatJoinApproved', _this.chatCreateApproved);
                event_bus.off('transformToResizeState', _this.transformToResizeState);
                event_bus.off('redirectResize', _this.handleResizer, _this);
                websocket.off('message', _this.onChatMessageRouter);
                _this.off('showChat');
                _this.addRemoveListener('remove', _this.chat_resize_container, 'mouseup', _this.bindedHandleResizer, false);
                _this.addRemoveListener('remove', _this.chat_resize_container, 'touchend', _this.bindedHandleResizer, false);
                _this.addRemoveListener('remove', _this.chat_resize_container, 'mousemove', _this.bindedHandleResizer, false);
                _this.addRemoveListener('remove', _this.chat_resize_container, 'touchmove', _this.bindedHandleResizer, false);
                _this.addRemoveListener('remove', document, 'visibilitychange', _this.bindedOnVisibilityChange, false);
            },

            getOpenChats: function(callback) {
                var openChats = {};
                Chat.prototype.chatsArray.forEach(function(chat) {
                    openChats[chat.chat_id] = true;
                });
                callback(openChats);
            },

            transformToResizeState: function(event, _chat) {
                var _this = this;
                _this.chat_resize_container.classList.add('draggable');
                if (event.type === 'touchstart' && event.changedTouches) {
                    _this.line_resize.style.left = event.changedTouches[0].clientX + 'px';
                } else {
                    _this.line_resize.style.left = event.clientX + 'px';
                }
                _this.resizeMouseDown = true;
                _this.positionrSplitterItem = event.currentTarget.dataset.splitteritem;
                _this.chatResize = _chat;
                _this.splitterWidth = _chat.splitter_left.clientWidth;
                _this.offsetLeft_splitter_left = _this.getOffset(_chat.splitter_left).offsetLeft;
                _this.offsetLeft_splitter_right = _this.getOffset(_chat.splitter_right).offsetLeft;
                _this.chatResizeWidth = _chat.chat_element.clientWidth;
            },

            handleResizer: function(event) {
                var _this = this;
                switch (event.type) {
                    case 'mousemove':
                    case 'touchmove':
                        if (_this.resizeMouseDown) {
                            var clientX = event.clientX;
                            if (event.type === 'touchmove' && event.changedTouches) {
                                clientX = event.changedTouches[0].clientX;
                            }
                            if (!_this.resizeClientX_absolue) {
                                _this.resizeClientX_absolue = clientX;
                                _this.deltaX_absolute = clientX;
                            }
                            if (!_this.resizeClientX) {
                                _this.resizeClientX = clientX;
                            } else {
                                var deltaX = clientX - _this.resizeClientX;
                                _this.absoluteDeltaX = _this.resizeClientX_absolue - clientX;
                                _this.redraw_chat = false;
                                if (Math.abs(_this.absoluteDeltaX - deltaX) > _this.min_move) {
                                    _this.redraw_chat = true;
                                    if (_this.positionrSplitterItem === 'left' &&
                                        _this.offsetLeft_splitter_right - clientX + _this.splitterWidth > _this.min_chats_width ||
                                        _this.positionrSplitterItem === 'right' &&
                                        clientX - _this.offsetLeft_splitter_left > _this.min_chats_width
                                    ) {
                                        _this.line_resize.style.left = (_this.line_resize.offsetLeft + deltaX) + 'px';
                                        _this.resizeClientX = clientX;
                                    } else {
                                        if (_this.positionrSplitterItem === 'left') {
                                            _this.line_resize.style.left = _this.offsetLeft_splitter_right - _this.min_chats_width + _this.splitterWidth + 'px';
                                        }
                                        if (_this.positionrSplitterItem === 'right') {
                                            _this.line_resize.style.left = _this.offsetLeft_splitter_left + _this.min_chats_width + 'px';
                                        }
                                        _this.resizeClientX = clientX;
                                    }
                                }
                            }
                        }
                        break;
                    case 'mouseup':
                    case 'touchend':
                        if (_this.redraw_chat) {
                            if (_this.positionrSplitterItem === 'left') {
                                if (_this.chatResizeWidth + _this.absoluteDeltaX >= _this.min_chats_width) {
                                    _this.chatResize.chat_element.style.width = _this.chatResizeWidth + _this.absoluteDeltaX + 'px';
                                } else {
                                    _this.chatResize.chat_element.style.width = _this.min_chats_width + 'px';
                                }
                            }
                            if (_this.positionrSplitterItem === 'right') {
                                if (_this.chatResizeWidth - _this.absoluteDeltaX >= _this.min_chats_width) {
                                    _this.chatResize.chat_element.style.width = _this.chatResizeWidth - _this.absoluteDeltaX + 'px';
                                } else {
                                    _this.chatResize.chat_element.style.width = _this.min_chats_width + 'px';
                                }
                            }
                            _this.chatResize.settings_ListOptions.size_current = _this.chatResize.chat_element.style.width;
                            _this.chatResize.settings_ListOptions.size_custom_value = _this.chatResize.chat_element.style.width;
                        }
                        _this.resizeMouseDown = false;
                        _this.chat_resize_container.classList.remove('draggable');
                        _this.line_resize.style.left = 0;
                        delete _this.positionrSplitterItem;
                        delete _this.splitterWidth;
                        delete _this.offsetLeft_splitter_left;
                        delete _this.offsetLeft_splitter_right;
                        delete _this.chatResizeWidth;
                        delete _this.resizeClientX;
                        delete _this.resizeClientX_absolue;
                        delete _this.deltaX_absolute;
                        delete _this.chatResize;
                        delete _this.redraw_chat;
                }
            },

            onThrowEvent: function(eventName, eventData) {
                if (!eventName) {
                    return;
                }

                if (this[eventName]) {
                    this[eventName](eventData);
                }
            },

            /**
             * handle message from web-socket (if it is connected with chats some how)
             */
            onChatMessageRouter: function(messageData) {
                var _this = this;

                switch (messageData.type) {
                    case 'chat_created':
                        _this.chatCreateApproved(messageData);
                        break;
                    case 'chat_joined':
                        _this.chatJoinApproved(messageData);
                        break;
                    case 'notifyChat':
                        Chat.prototype.chatsArray.forEach(function(_chat) {
                            if (messageData.chat_description.chat_id === _chat.chat_id) {
                                _chat.trigger(messageData.chat_type, messageData);
                            }
                        });
                        break;
                }
            },

            /**
             * sends future chat description to the server to check if such chat is already exists on the server
             * @param event - click event
             */
            addNewChatAuto: function(event) {
                var _this = this;
                if (!_this.mainConteiner || !websocket) {
                    return;
                }

                websocket.sendMessage({
                    type: "chat_create",
                    from_user_id: users_bus.getUserId()
                });
            },

            /**
             * received confirmation from server or from webrtc connection
             * save into indexedDB
             */
            chatCreateApproved: function(event) {
                var _this = this;
                if (event.from_ws_device_id) {
                    event_bus.set_ws_device_id(event.from_ws_device_id);
                }

                _this.addNewChatToIndexedDB(event.chat_description, function(err, chat) {
                    if (err) {
                        console.error(err);
                        return;
                    }

                    users_bus.putChatIdAndSave(chat.chat_id, function(err, userInfo) {
                        if (err) {
                            console.error(err);
                            return;
                        }

                        event_bus.trigger('AddedNewChat', userInfo.chat_ids.length);
                        //_this.chatWorkflow(event);
                        websocket.sendMessage({
                            type: "chat_join",
                            from_user_id: users_bus.getUserId(),
                            chat_description: {
                                chat_id: chat.chat_id
                            }
                        });
                    });
                });
            },

            addNewChatToIndexedDB: function(chat_description, callback) {
                var chat = new Chat(chat_description);
                chats_bus.putChatToIndexedDB(chat.toChatDescription(), callback);
            },

            chatWorkflow: function(event) {
                this.createChatLayout(
                    event,
                    {
                        chat_wrapper: this.chat_wrapper
                    }
                );
            },

            /**
             * create chat layout
             * create tables in indexeddb for chat
             */
            createChatLayout: function(messageData, renderOptions) {
                var _this = this;
                if (messageData.type === "chat_joined") {
                    indexeddb.getByKeyPath(
                        chats_bus.collectionDescription,
                        null,
                        messageData.chat_description.chat_id,
                        function(getError, localChatDescription) {
                            if (getError) {
                                console.error(getError);
                                return;
                            }

                            if (localChatDescription && messageData.restore_chat_state) {
                                messageData.chat_description = localChatDescription;
                            }
                            _this.handleChat(messageData, renderOptions, false);
                        }
                    );
                } else {
                    _this.handleChat(messageData, renderOptions, true);
                }
            },

            handleChat: function(messageData, renderOptions, new_chat) {
                var newChat = new Chat(messageData.chat_description);
                Chat.prototype.chatsArray.push(newChat);
                newChat.index = Chat.prototype.chatsArray.indexOf(newChat);

                indexeddb.open(
                    newChat.collectionDescription,
                    false,
                    function(err) {
                        if (err) {
                            console.log(err);
                        }
                        newChat.initialize(renderOptions);
                        if (messageData.restore_chat_state &&
                            messageData.chat_description.bodyOptions &&
                            messageData.chat_description.bodyOptions.mode) {
                            newChat.switchModes([{
                                'chat_part': 'body',
                                'newMode': messageData.chat_description.bodyOptions.mode
                            }], renderOptions);
                        } else {
                            newChat.switchModes([{
                                'chat_part': 'body',
                                'newMode': newChat.body.MODE.MESSAGES
                            }], renderOptions);
                        }

                        if (messageData.chat_wscs_descrs) {
                            webrtc.handleConnectedDevices(messageData.chat_wscs_descrs);
                        } else {
                            websocket.wsRequest({
                                chat_id: newChat.chat_id,
                                url: "/api/chat/websocketconnections"
                            }, function(err, response) {
                                if (err) {
                                    console.error(err);
                                    return;
                                }
                                webrtc.handleConnectedDevices(response.chat_wscs_descrs);
                            });
                        }
                    }
                );
            },

            /**
             * join request for this chat was approved by the server
             * make offer for each device for this chat
             */
            chatJoinApproved: function(event) {
                var _this = this;
                event_bus.set_ws_device_id(event.target_ws_device_id);

                indexeddb.getByKeyPath(
                    chats_bus.collectionDescription,
                    null,
                    event.chat_description.chat_id,
                    function(getError, chat_description) {
                        if (getError) {
                            console.error(getError);
                            return;
                        }

                        if (!chat_description) {
                            popap_manager.renderPopap(
                                'error',
                                {message: 86},
                                function(action) {
                                    switch (action) {
                                        case 'confirmCancel':
                                            popap_manager.onClose();
                                            break;
                                    }
                                }
                            );
                            return;
                        }

                        users_bus.putChatIdAndSave(event.chat_description.chat_id, function(err, userInfo) {
                            if (err) {
                                console.error(err);
                                return;
                            }

                            event_bus.trigger('AddedNewChat', userInfo.chat_ids.length);

                            if (!_this.isChatOpened(chat_description.chat_id)) {
                                // force to open chat
                                _this.chatWorkflow(event);
                            } else if (_this.isChatOpened(chat_description.chat_id) && event.chat_wscs_descrs) {
                                webrtc.handleConnectedDevices(event.chat_wscs_descrs);
                            }
                        });
                    }
                );
            },

            /**
             * find chat in the database and send chat id to the server
             * to receive approved join message
             */
            showChat: function(element) {
                var _this = this;
                var parentElement = _this.traverseUpToDataset(element, 'role', 'chatWrapper');
                var control_buttons = Array.prototype.slice.call(parentElement.querySelectorAll('button[data-mode="DETAIL_VIEW"]'));
                var restore_options = element.dataset.restore_chat_state;
                if (!parentElement) {
                    console.error(new Error('Parent element not found!'));
                    return;
                }

                if (!parentElement.dataset.chat_id) {
                    console.error(new Error('Chat wrapper does not have chat id!'));
                    return;
                }

                var chat_id = parentElement.dataset.chat_id;
                if (_this.isChatOpened(chat_id)) {
                    popap_manager.renderPopap(
                        'error',
                        {message: 93},
                        function(action) {
                            switch (action) {
                                case 'confirmCancel':
                                    popap_manager.onClose();
                                    break;
                            }
                        }
                    );
                    return;
                }
                _this.hideUIButton(chat_id, control_buttons);
                indexeddb.getByKeyPath(
                    chats_bus.collectionDescription,
                    null,
                    chat_id,
                    function(getError, chatDescription) {
                        if (getError) {
                            console.error(getError);
                            _this.unHideUIButton(chat_id);
                            return;
                        }

                        if (chatDescription) {
                            websocket.sendMessage({
                                type: "chat_join",
                                from_user_id: users_bus.getUserId(),
                                chat_description: {
                                    chat_id: chatDescription.chat_id
                                },
                                restore_chat_state: restore_options
                            });
                        } else {
                            console.error(new Error('Chat with such id not found in the database!'));
                            _this.unHideUIButton(chat_id);
                        }
                    }
                );
            },

            destroy: function() {
                var _this = this;
                _this.removeEventListeners();
                _this.unCashElements();
                _this.UIElements = {};
            },

            saveStatesChats: function(chat_description, callback) {
                chats_bus.putChatToIndexedDB(chat_description, callback);
            },

            saveStatesChat: function(chat) {
                var _this = this;
                popap_manager.renderPopap(
                    'confirm',
                    {message: 81},
                    function(action) {
                        switch (action) {
                            case 'confirmOk':
                                var chatDescription = chat.toChatDescription();
                                _this.saveStatesChats(chatDescription, function() {
                                    
                                });
                                popap_manager.onClose();
                                break;
                            case 'confirmCancel':
                                popap_manager.onClose();
                                break;
                        }
                    }
                );
            },

            saveAndCloseChat: function(chatToDestroy) {
                var _this = this;
                popap_manager.renderPopap(
                    'confirm',
                    {message: 82},
                    function(action) {
                        switch (action) {
                            case 'confirmOk':
                                var chatDescription = chatToDestroy.toChatDescription();
                                _this.saveStatesChats(chatDescription, function() {
                                    _this.destroyChat(chatToDestroy);
                                });
                                popap_manager.onClose();
                                break;
                            case 'confirmCancel':
                                popap_manager.onClose();
                                break;
                        }
                    }
                );
            },

            toCloseChat: function(chatToDestroyId, saveStates) {
                var _this = this, chatToDestroy;
                Chat.prototype.chatsArray.every(function(_chat) {
                    if (_chat.chat_id === chatToDestroyId) {
                        chatToDestroy = _chat;
                    }
                    return !chatToDestroy;
                });
                switch (saveStates) {
                    case 'close':
                        _this.closeChat(chatToDestroy);
                        break;
                    case 'save':
                        _this.saveStatesChat(chatToDestroy);
                        break;
                    case 'save_close':
                        _this.saveAndCloseChat(chatToDestroy);
                        break;
                }
            },

            closeChat: function(chatToDestroy) {
                var _this = this;
                popap_manager.renderPopap(
                    'confirm',
                    {message: 83},
                    function(action) {
                        switch (action) {
                            case 'confirmOk':
                                _this.destroyChat(chatToDestroy);
                                popap_manager.onClose();
                                break;
                            case 'confirmCancel':
                                popap_manager.onClose();
                                break;
                        }
                    }
                );
            },

            destroyChat: function(chatToDestroy) {
                Chat.prototype.chatsArray.splice(Chat.prototype.chatsArray.indexOf(chatToDestroy), 1);
                chatToDestroy.destroyChat();
                event_bus.trigger('chatDestroyed', chatToDestroy.chat_id);
                // TODO close indexeddb connections
            },

            destroyChats: function() {
                Chat.prototype.chatsArray.forEach(function(chatToDestroy) {
                    console.log(Chat.prototype.chatsArray, chatToDestroy.chat_id);
                    chatToDestroy.destroyChat();
                });
                Chat.prototype.chatsArray = [];
            },

            /**
             * chat whether requested chat by its id is opened or not
             */
            isChatOpened: function(chat_id) {
                var openedChat;
                Chat.prototype.chatsArray.every(function(_chat) {
                    if (_chat.chat_id === chat_id) {
                        openedChat = _chat;
                    }
                    return !openedChat;
                });

                return openedChat;
            },

            onVisibilityChange: function(event) {
                if (event.target.hidden === false) {
                    Chat.prototype.chatsArray.every(function(chat) {
                        websocket.wsRequest({
                            chat_id: chat.chat_id,
                            url: "/api/chat/websocketconnections"
                        }, function(err, response) {
                            if (err) {
                                console.error(err);
                                return;
                            }
                            webrtc.handleConnectedDevices(response.chat_wscs_descrs);
                        });
                    });
                }
            }
        };
        extend_core.prototype.inherit(chat_platform, overlay_core);
        extend_core.prototype.inherit(chat_platform, throw_event_core);
        extend_core.prototype.inherit(chat_platform, template_core);
        extend_core.prototype.inherit(chat_platform, dom_core);
        extend_core.prototype.inherit(chat_platform, disable_display_core);

        chat_platform.prototype.chat_platform_template = chat_platform.prototype.template(chat_platform_template);

        return new chat_platform();
    })
;
define('text!../templates/panel_left_template.ejs',[],function () { return '<% if (_in.config && _in.config.byDataLocation) {\n        for (var locationKey in _in.config.byDataLocation) { %>\n<%= _in.location_wrapper_template({\n    config: _in.config.byDataLocation[locationKey],\n    data: _in.data ? _in.data : {},\n    triple_element_template: _in.triple_element_template,\n    button_template: _in.button_template,\n    input_template: _in.input_template,\n    label_template: _in.label_template\n}) %>\n<% }\n} %>\n';});

define('text!../templates/panel_right_template.ejs',[],function () { return '<% if (_in.config && _in.config.byDataLocation) {\n        for (var locationKey in _in.config.byDataLocation) { %>\n<%= _in.location_wrapper_template({\n    config: _in.config.byDataLocation[locationKey],\n    data: _in.data ? _in.data : {},\n    triple_element_template: _in.triple_element_template,\n    button_template: _in.button_template,\n    input_template: _in.input_template,\n    label_template: _in.label_template\n}) %>\n<% }\n} %>\n';});

define('panel', [
        'throw_event_core',
        'ajax_core',
        'template_core',
        'render_layout_core',
        'extend_core',
        'switcher_core',
        'overlay_core',
        'dom_core',
        'disable_display_core',
        //
        'chats_bus',
        'users_bus',
        'event_bus',
        'extra_toolbar',
        'filter',
        'pagination',
        'body',
        'indexeddb',
        'websocket',
        'webrtc',
        'popap_manager',
        //
        'text!../templates/panel_left_template.ejs',
        'text!../templates/panel_right_template.ejs',
        'text!../templates/element/triple_element_template.ejs',
        'text!../templates/element/location_wrapper_template.ejs',
        'text!../templates/element/button_template.ejs',
        'text!../templates/element/label_template.ejs',
        'text!../templates/element/input_template.ejs',
        'text!../templates/element/select_template.ejs',
        'text!../templates/element/textarea_template.ejs'
    ],
    function(throw_event_core,
             ajax_core,
             template_core,
             render_layout_core,
             extend_core,
             switcher_core,
             overlay_core,
             dom_core,
             disable_display_core,
             //
             chats_bus,
             users_bus,
             event_bus,
             Extra_toolbar,
             Filter,
             Pagination,
             Body,
             indexeddb,
             websocket,
             webrtc,
             popap_manager,
             //
             panel_left_template,
             panel_right_template,
             triple_element_template,
             location_wrapper_template,
             button_template,
             label_template,
             input_template,
             select_template,
             textarea_template) {

        var defaultOptions = {

            chats_GoToOptions: {
                show: false,
                rteChoicePage: true,
                mode_change: "rte",
                "chat": null
            },
            chats_PaginationOptions: {
                text: "chats",
                show: false,
                mode_change: "rte",
                currentPage: null,
                firstPage: 1,
                lastPage: null,
                showEnablePagination: false,
                showChoicePerPage: false,
                perPageValue: 1,
                perPageValueNull: false,
                rtePerPage: true,
                disableBack: false,
                disableFirst: false,
                disableLast: false,
                disableForward: false
            },
            chats_ExtraToolbarOptions: {
                show: true
            },
            chats_FilterOptions: {
                show: false
            },
            chats_ListOptions: {
                text: "chats",
                start: 0,
                last: null,
                previousStart: 0,
                previousFinal: 0,
                restore: false,
                data_download: false
            },

            users_ExtraToolbarOptions: {
                show: true
            },
            users_FilterOptions: {
                show: false
            },
            users_GoToOptions: {
                text: "users",
                show: false,
                rteChoicePage: true,
                mode_change: "rte",
                "user": null
            },
            users_PaginationOptions: {
                show: false,
                mode_change: "rte",
                currentPage: null,
                firstPage: 1,
                lastPage: null,
                showEnablePagination: false,
                showChoicePerPage: false,
                perPageValue: 15,
                perPageValueNull: false,
                rtePerPage: true,
                disableBack: false,
                disableFirst: false,
                disableLast: false,
                disableForward: false
            },
            users_ListOptions: {
                text: "users",
                start: 0,
                last: null,
                previousStart: 0,
                previousFinal: 0,
                restore: false,
                data_download: false
            },

            joinUser_ExtraToolbarOptions: {
                show: false
            },
            joinUser_FilterOptions: {
                show: false
            },
            joinUser_PaginationOptions: {
                show: false
            },
            joinUser_GoToOptions: {
                show: false,
                rteChoicePage: true,
                mode_change: "rte"
            },
            joinUser_ListOptions: {
                readyForRequest: false
            },

            createChat_ExtraToolbarOptions: {
                show: false
            },
            createChat_FilterOptions: {
                show: false
            },
            createChat_PaginationOptions: {
                show: false
            },
            createChat_GoToOptions: {
                show: false,
                rteChoicePage: true,
                mode_change: "rte"
            },

            joinChat_ExtraToolbarOptions: {
                show: false
            },
            joinChat_FilterOptions: {
                show: false
            },
            joinChat_PaginationOptions: {
                show: false
            },
            joinChat_GoToOptions: {
                show: false,
                rteChoicePage: true,
                mode_change: "rte"
            },

            createBlog_ExtraToolbarOptions: {
                show: false
            },
            createBlog_FilterOptions: {
                show: false
            },
            createBlog_PaginationOptions: {
                show: false
            },
            createBlog_GoToOptions: {
                show: false,
                rteChoicePage: true,
                mode_change: "rte"
            },

            joinBlog_ExtraToolbarOptions: {
                show: false
            },
            joinBlog_FilterOptions: {
                show: false
            },
            joinBlog_PaginationOptions: {
                show: false
            },
            joinBlog_GoToOptions: {
                show: false,
                rteChoicePage: true,
                mode_change: "rte"
            },

            blogs_ExtraToolbarOptions: {
                show: false
            },
            blogs_FilterOptions: {
                show: false
            },
            blogs_PaginationOptions: {
                show: false
            },
            blogs_GoToOptions: {
                show: false,
                rteChoicePage: true,
                mode_change: "rte"
            },
            blogs_ListOptions: {
                text: "blogs",
                start: 0,
                last: null,
                previousStart: 0,
                previousFinal: 0,
                restore: false,
                data_download: false
            },

            connections_ExtraToolbarOptions: {
                show: false
            },
            connections_FilterOptions: {
                show: false
            },
            connections_PaginationOptions: {
                show: false
            },
            connections_GoToOptions: {
                show: false,
                rteChoicePage: true,
                mode_change: "rte"
            },
            connections_ListOptions: {
                text: "connections",
                start: 0,
                last: null,
                previousStart: 0,
                previousFinal: 0,
                restore: false,
                data_download: false
            },

            userInfoEdit_ExtraToolbarOptions: {
                show: false
            },
            userInfoEdit_FilterOptions: {
                show: false
            },
            userInfoEdit_PaginationOptions: {
                show: false
            },
            userInfoEdit_GoToOptions: {
                show: false,
                rteChoicePage: true,
                mode_change: "rte"
            },

            userInfoShow_ExtraToolbarOptions: {
                show: false
            },
            userInfoShow_FilterOptions: {
                show: false
            },
            userInfoShow_PaginationOptions: {
                show: false
            },
            userInfoShow_GoToOptions: {
                show: false,
                rteChoicePage: true,
                mode_change: "rte"
            },

            listOptions: {
                start: 0,
                last: null,
                previousStart: 0,
                previousFinal: 0
            },
            bodyOptions: {
                show: true,
                mode: null
            }
        };

        var panel = function(description) {
            if (description.options) {
                this.extend(this, description.options);
                this.body_mode = description.options.bodyOptions.mode;
            } else {
                this.extend(this, defaultOptions);
                this.body_mode = description.body_mode;
                this.bodyOptions.mode = description.body_mode;
            }

            this.UIElements = {};
            this.bindMainContexts();

            this.type = description.type;
            this.outer_container = description.outer_container;
            this.inner_container = description.inner_container;
            this.filter_container = description.filter_container;
            this.go_to_container = description.go_to_container;
            this.panel_toolbar = description.panel_toolbar;
            this.pagination_container = description.pagination_container;
            this.extra_toolbar_container = description.extra_toolbar_container;

            this.pagination = new Pagination();
            this.body = new Body();

            this.extraToolbar = new Extra_toolbar({panel: this});
            this.filter = new Filter({panel: this});
        };

        panel.prototype = {

            panelArray: [],

            openChatsInfoArray: [],

            MODE: {
                CREATE_CHAT: 'CREATE_CHAT',
                JOIN_CHAT: 'JOIN_CHAT',
                CHATS: 'CHATS',
                USERS: 'USERS',
                JOIN_USER: 'JOIN_USER',

                USER_INFO_EDIT: 'USER_INFO_EDIT',
                USER_INFO_SHOW: 'USER_INFO_SHOW',
                DETAIL_VIEW: 'DETAIL_VIEW',

                CONNECTIONS: 'CONNECTIONS',

                CREATE_BLOG: 'CREATE_BLOG',
                JOIN_BLOG: 'JOIN_BLOG',
                BLOGS: 'BLOGS',

                PAGINATION: "PAGINATION",
                GO_TO: "GO_TO",
                FILTER: 'FILTER'
            },

            z_index: 80,

            initialization: function(options) {
                if (!options || !options.panel_platform) {
                    popap_manager.renderPopap(
                        'error',
                        {message: 92},
                        function(action) {
                            switch (action) {
                                case 'confirmCancel':
                                    popap_manager.onClose();
                                    break;
                            }
                        }
                    );
                    return;
                }
                var _this = this;
                _this.optionsDefinition(_this, _this.bodyOptions.mode);
                _this.cashElements();
                _this.elementMap = {};
                _this.addMainEventListener();
                _this.outer_container.classList.remove("hide");
                _this.outer_container.style.maxWidth = window.innerWidth + 'px';
                _this.outer_container.style[_this.type] = (-_this.outer_container.offsetWidth) + 'px';
                _this.outer_container.style.zIndex = panel.prototype.z_index;
                _this.togglePanelElement_clientWidth = _this.togglePanelElement.clientWidth;
            },

            dispose: function() {
                var _this = this;
                if (!_this.togglePanelElement) {
                    return;
                }
                _this.UIElements = {};
                _this.removeMainEventListeners();
                _this.togglePanel(true);
                _this.hidePanel();
            },

            hidePanel: function() {
                var _this = this;
                _this.outer_container.classList.add("hide");
            },

            cashElements: function() {
                var _this = this;
                _this.togglePanelElement = _this.outer_container.querySelector('[data-action="togglePanel"]');
                _this.body_container = _this.outer_container.querySelector('[data-role="panel_body"]');
            },

            cashBodyElement: function() {
                var _this = this;
                if (_this.bodyOptions.mode === _this.MODE.USER_INFO_EDIT) {
                    _this.user_name = _this.body_container.querySelector('[data-main="user_name_input"]');
                    _this.old_password = _this.body_container.querySelector('[data-role="passwordOld"]');
                    _this.new_password = _this.body_container.querySelector('[data-role="passwordNew"]');
                    _this.confirm_password = _this.body_container.querySelector('[data-role="passwordConfirm"]');
                }
            },

            cashExtraToolbarElement: function() {
                var _this = this;
                _this.btn_Filter = _this.extra_toolbar_container.querySelector('[data-role="btn_Filter"]');
            },

            cashToolbarElement: function() {
                var _this = this;
                _this.btns_toolbar = Array.prototype.slice.call(_this.panel_toolbar.querySelectorAll('[data-role="btnToolbar"]'));
                _this.togglePanelElementToolbar = _this.panel_toolbar.querySelector('[data-role="togglePanelToolbar"]');
            },

            unCashElements: function() {
                var _this = this;
                _this.btn_Filter = null;
                _this.user_name = null;
                _this.old_password = null;
                _this.new_password = null;
                _this.confirm_password = null;
                _this.btns_toolbar = null;
                _this.togglePanelElement = null;
                _this.body_container = null;
                _this.togglePanelElementToolbar = null;
            },

            bindMainContexts: function() {
                var _this = this;
                // bind all panel handlers because each panel has the same handlers
                _this.bindedTogglePanelWorkflow = _this.togglePanelWorkflow.bind(_this);
                _this.bindedInputUserInfo = _this.inputUserInfo.bind(_this);
                _this.bindedDataActionRouter = _this.dataActionRouter.bind(_this);
                _this.bindedThrowEventRouter = _this.throwEventRouter.bind(_this);
                _this.bindedTransitionEnd = _this.transitionEnd.bind(_this);
                _this.bindedOnChatDestroyed = _this.onChatDestroyed.bind(_this);
                _this.bindedToggleListOptions = _this.toggleListOptions.bind(_this);
                _this.bindedCloseChat = _this.closeChat.bind(_this);
                _this.bindedOnPanelMessageRouter = _this.onPanelMessageRouter.bind(_this);
            },

            unbindMainContexts: function() {
                var _this = this;
                _this.bindedTogglePanelWorkflow = null;
                _this.bindedInputUserInfo = null;
                _this.bindedDataActionRouter = null;
                _this.bindedThrowEventRouter = null;
                _this.bindedTransitionEnd = null;
                _this.bindedOnChatDestroyed = null;
                _this.bindedToggleListOptions = null;
                _this.bindedCloseChat = null;
                _this.bindedOnPanelMessageRouter = null;
            },

            addMainEventListener: function() {
                var _this = this;
                _this.removeMainEventListeners();
                _this.addRemoveListener('add', _this.togglePanelElement, 'click', _this.bindedTogglePanelWorkflow, false);
                _this.addRemoveListener('add', _this.body_container, 'input', _this.bindedInputUserInfo, false);
                _this.addRemoveListener('add', _this.panel_toolbar, 'click', _this.bindedDataActionRouter, false);
                _this.addRemoveListener('add', _this.body_container, 'click', _this.bindedThrowEventRouter, false);
                _this.addRemoveListener('add', _this.body_container, 'click', _this.bindedDataActionRouter, false);
                _this.addRemoveListener('add', _this.body_container, 'transitionend', _this.bindedTransitionEnd, false);
                _this.on('throw', _this.throwRouter, _this);
                event_bus.on('chatDestroyed', _this.bindedOnChatDestroyed);
                event_bus.on('AddedNewChat', _this.bindedToggleListOptions);
                websocket.on('message', _this.bindedOnPanelMessageRouter);
            },

            removeMainEventListeners: function() {
                var _this = this;
                _this.addRemoveListener('remove', _this.togglePanelElement, 'click', _this.bindedTogglePanelWorkflow, false);
                _this.addRemoveListener('remove', _this.body_container, 'input', _this.bindedInputUserInfo, false);
                _this.addRemoveListener('remove', _this.panel_toolbar, 'click', _this.bindedDataActionRouter, false);
                _this.addRemoveListener('remove', _this.body_container, 'click', _this.bindedThrowEventRouter, false);
                _this.addRemoveListener('remove', _this.body_container, 'click', _this.bindedDataActionRouter, false);
                _this.addRemoveListener('remove', _this.body_container, 'transitionend', _this.bindedTransitionEnd, false);
                _this.off('throw', _this.throwRouter);
                event_bus.off('chatDestroyed', _this.bindedOnChatDestroyed);
                event_bus.off('AddedNewChat', _this.bindedToggleListOptions);
                websocket.off('message', _this.bindedOnPanelMessageRouter);
            },

            throwRouter: function(action, event) {
                if (this[action]) {
                    this[action](event);
                }
            },

            onChatDestroyed: function(chat_id) {
                var _this = this;
                if (_this.type === "left" &&
                    (_this.bodyOptions.mode === this.MODE.CHATS || _this.bodyOptions.mode === this.MODE.DETAIL_VIEW)) {
                    var chat_info_container = _this.body_container.querySelector('[data-chat_id="' + chat_id + '"]');
                    if (chat_info_container) {
                        var detail_view = chat_info_container.querySelector('[data-role="detail_view_container"]');
                        if (detail_view.dataset.state) {
                            _this.bodyOptions.mode = _this.MODE.DETAIL_VIEW;
                            var pointer = chat_info_container.querySelector('[data-role="pointer"]');
                            _this.render({
                                "detail_view": detail_view,
                                "pointer": pointer,
                                "chat_id_value": chat_id
                            });
                        }
                    }
                }
            },

            addToolbarEventListener: function() {
                var _this = this;
            },

            removeToolbarEventListeners: function() {
                var _this = this;
            },

            openOrClosePanel: function(bigMode, forceClose) {
                var _this = this;
                _this.showSpinner(_this.body_container);
                if (!forceClose && _this.outer_container.style[_this.type] !== '0px') {
                    _this.previous_z_index = _this.outer_container.style.zIndex;
                    _this.outer_container.style.zIndex = ++panel.prototype.z_index;
                    _this.outer_container.style[_this.type] = "0px";
                    _this.inner_container.style.maxWidth = _this.calcMaxWidth();
                    _this.fillPanelToolbar();
                    _this.render();
                } else {
                    panel.prototype.z_index--;
                    if (_this.bodyOptions.mode === _this.MODE.DETAIL_VIEW) {
                        _this.bodyOptions.mode = _this.MODE.CHATS;
                    }
                    _this.outer_container.style.zIndex = _this.previous_z_index;
                    _this.body_container.innerHTML = "";
                    _this.outer_container.style[_this.type] = (-_this.outer_container.offsetWidth) + 'px';
                    if (bigMode === true) {
                        _this.togglePanelElement.classList.add('hide');
                        _this.togglePanelElementToolbar.classList.remove('hide');
                    } else {
                        _this.togglePanelElement.classList.remove('hide');
                    }
                }
            },

            switchPanelMode: function(element) {
                var _this = this;
                if (element.dataset.mode_to === _this.MODE.USER_INFO_SHOW && _this.previous_UserInfo_Mode) {
                    _this.bodyOptions.mode = _this.previous_UserInfo_Mode;
                } else {
                    _this.bodyOptions.mode = element.dataset.mode_to;
                }
                _this.previous_Filter_Options = false;
                _this.pagination.previousShow = false;
                _this.toggleActiveButton(_this.btns_toolbar, element.dataset.mode_to);
                if (!_this.bodyOptions.mode || _this.bodyOptions.mode === "") {
                    _this.body_container.innerHTML = "";
                    _this.filter_container.innerHTML = "";
                    _this.extra_toolbar_container.innerHTML = "";
                    _this.pagination_container.innerHTML = "";
                    _this.go_to_container.innerHTML = "";
                } else {
                    if (_this.previous_BodyMode && _this.previous_BodyMode  !== _this.bodyOptions.mode) {
                        _this.showSpinner(_this.body_container);
                    }
                    _this.previous_BodyMode = _this.bodyOptions.mode;
                    _this.render();
                }
                if (_this.bodyOptions.mode === _this.MODE.USER_INFO_SHOW) {
                    _this.previous_UserInfo_Mode = _this.MODE.USER_INFO_SHOW;
                }
            },

            render: function(options) {
                var _this = this;
                if (!options) {
                    options = {};
                }
                if (_this.bodyOptions.mode === _this.MODE.CHATS || _this.bodyOptions.mode === _this.MODE.DETAIL_VIEW) {
                    event_bus.trigger('getOpenChats', function(openChats) {
                        options.openChats = openChats;
                        _this.proceed(options);
                    });
                } else {
                    _this.proceed(options);
                }
                _this.resizePanel();
            },

            proceed: function(options) {
                var _this = this;
                _this.extraToolbar.renderExtraToolbar(_this, _this.bodyOptions.mode, function() {
                    _this.filter.renderFilter(_this, _this.bodyOptions.mode, function() {
                        _this.pagination.render(options, _this, _this.bodyOptions.mode);
                        _this.body.render(options, _this, function() {
                            _this.resizePanel();
                        });
                    });
                });
            },

            changeMode: function(element) {
                var _this = this;
                if (_this.bodyOptions.mode === _this.MODE.DETAIL_VIEW) {
                    _this.bodyOptions.mode = _this.MODE.CHATS;
                }
                _this.switch_Panel_Body_Mode({
                    chat_part: element.dataset.chat_part,
                    newMode: element.dataset.mode_to,
                    target: element
                })
            },

            switch_Panel_Body_Mode: function(obj) {
                var _this = this;
                switch (obj.chat_part) {
                    case "filter":
                        if (obj.target) {
                            var bool_Value = obj.target.dataset.toggle === "true";
                            _this.optionsDefinition(_this, _this.bodyOptions.mode);
                            _this.currnetFilterOptions.show = bool_Value;
                            obj.target.dataset.toggle = !bool_Value;
                        }
                        break;
                    case "pagination":
                        switch (obj.newMode) {
                            case _this.MODE.PAGINATION:
                                if (obj.target) {
                                    _this.optionsDefinition(_this, _this.bodyOptions.mode);
                                    _this.currentPaginationOptions.show = obj.target.checked;
                                    _this.currentPaginationOptions.showEnablePagination = obj.target.checked;
                                    if (!obj.target.checked) {
                                        _this.currentListOptions.previousStart = 0;
                                        _this.currentListOptions.previousFinal = null;
                                        _this.currentListOptions.start = 0;
                                        _this.currentListOptions.final = null;
                                    }
                                }
                                _this.toggleShowState({
                                    key: 'show',
                                    toggle: false
                                }, _this.currentPaginationOptions, obj);
                                break;
                            case  _this.MODE.GO_TO:
                                _this.optionsDefinition(_this, _this.bodyOptions.mode);
                                if (obj.target) {
                                    var bool_Value = obj.target.dataset.toggle === "true";
                                    _this.currentGoToOptions.show = bool_Value;
                                }
                                break;
                        }
                        break;
                }
                _this.render();
            },

            togglePanel: function(forceClose) {
                var _this = this;
                _this.openOrClosePanel(_this.outer_container.clientWidth + _this.togglePanelElement.clientWidth > document.body.clientWidth, forceClose);
            },

            togglePanelWorkflow: function() {
                var _this = this;
                if (_this.panel_config) {
                    _this.togglePanel();
                } else {
                    _this.get_JSON_res("/configs/panel_" + _this.type + "_toolbar_config.json", function(err, res) {
                        if (err) {
                            console.error(err);
                            return;
                        }

                        _this.panel_config = res;
                        _this.togglePanel();
                    });
                }
            },

            fillPanelToolbar: function() {
                var _this = this;
                _this.showHorizontalSpinner(_this.panel_toolbar);
                _this.panel_config = _this.prepareConfig(_this.panel_config);
                _this.panel_toolbar.innerHTML = _this['panel_' + _this.type + '_template']({
                    config: _this.panel_config,
                    triple_element_template: _this.triple_element_template,
                    location_wrapper_template: _this.location_wrapper_template,
                    button_template: _this.button_template,
                    input_template: _this.input_template,
                    label_template: _this.label_template,
                    select_template: _this.select_template
                });
                _this.addToolbarEventListener();
                _this.cashToolbarElement();
                _this.toggleActiveButton(_this.btns_toolbar, _this.bodyOptions.mode);
                _this.resizePanel();
            },

            inputUserInfo: function(event) {
                var _this = this;
                if (event.target.dataset.input) {
                    if (_this.config) {
                        var param = event.target.dataset.role;
                        _this.user[param] = event.target.value;
                    }
                }
            },

            cancelChangeUserInfo: function() {
                var _this = this;
                _this.bodyOptions.mode = _this.MODE.USER_INFO_SHOW;
                _this.previous_UserInfo_Mode = _this.MODE.USER_INFO_SHOW;
                _this.user = null;
                _this.render();
            },

            saveChangeUserInfo: function() {
                var _this = this;
                if (_this.user_name.value && _this.old_password.value && _this.new_password.value && _this.confirm_password.value) {
                    if (_this.old_password.value === _this.user.userPassword) {
                        if (_this.new_password.value === _this.confirm_password.value) {
                            _this.updateUserInfo(function() {
                                _this.bodyOptions.mode = _this.MODE.USER_INFO_SHOW;
                                _this.previous_UserInfo_Mode = _this.MODE.USER_INFO_SHOW;
                                _this.user = null;
                                _this.render();
                            })
                        } else {
                            popap_manager.renderPopap(
                                'error',
                                {message: 94},
                                function(action) {
                                    switch (action) {
                                        case 'confirmCancel':
                                            popap_manager.onClose();
                                            _this.new_password.value = "";
                                            _this.confirm_password.value = "";
                                            break;
                                    }
                                }
                            );
                        }
                    } else {
                        popap_manager.renderPopap(
                            'error',
                            {message: 95},
                            function(action) {
                                switch (action) {
                                    case 'confirmCancel':
                                        popap_manager.onClose();
                                        _this.old_password.value = "";
                                        _this.new_password.value = "";
                                        _this.confirm_password.value = "";
                                        break;
                                }
                            }
                        );
                    }
                } else {
                    popap_manager.renderPopap(
                        'error',
                        {message: 88},
                        function(action) {
                            switch (action) {
                                case 'confirmCancel':
                                    popap_manager.onClose();
                                    break;
                            }
                        }
                    );
                }
            },

            updateUserInfo: function(callback) {
                var _this = this;
                users_bus.getMyInfo(null, function(err, options, userInfo){
                    userInfo.userPassword = _this.new_password.value;
                    userInfo.userName = _this.user_name.value;
                    users_bus.saveMyInfo(userInfo, callback);
                });
            },

            changeUserInfo: function() {
                var _this = this;
                _this.bodyOptions.mode = _this.MODE.USER_INFO_EDIT;
                _this.previous_UserInfo_Mode = _this.MODE.USER_INFO_EDIT;
                _this.render();
            },

            destroy: function() {
                var _this = this;
                _this.removeMainEventListeners();
                _this.removeToolbarEventListeners();
                _this.unCashElements();
                //_this.unbindMainContexts();
            },

            show_more_info: function(element) {
                var _this = this, chat_id_value;
                chat_id_value = element.dataset.chat_id;
                var detail_view = element.querySelector('[data-role="detail_view_container"]');
                var pointer = element.querySelector('[data-role="pointer"]');
                if (detail_view.dataset.state) {
                    _this.openChatsInfoArray.splice(_this.openChatsInfoArray.indexOf(chat_id_value), 1);
                    detail_view.classList.remove("max-height-auto");
                    pointer.classList.remove("rotate-90");
                    detail_view.style.maxHeight = '0em';
                    return;
                }

                if (element) {
                    _this.bodyOptions.mode = _this.MODE.DETAIL_VIEW;
                    _this.elementMap.DETAIL_VIEW = detail_view;
                    _this.render({
                        "detail_view": detail_view,
                        "pointer": pointer,
                        "chat_id_value": chat_id_value
                    });
                }
            },

            closeChat: function(element) {
                var _this = this, saveStates;
                if (_this.type === "left" ){
                    var parentElement = _this.traverseUpToDataset(element, 'role', 'chatWrapper');
                    var chat_id = parentElement.dataset.chat_id;

                    if (element.dataset.role === "closeChat") {
                        saveStates = 'close';
                    }
                    if (element.dataset.role === "saveStatesChat") {
                        saveStates = 'save';
                    }
                    if (element.dataset.role === "saveAndCloseChat") {
                        saveStates = 'save_close';
                    }
                    event_bus.trigger('toCloseChat', chat_id, saveStates);
                }
            },

            rotatePointer: function(options) {
                var _this = this;
                options.detail_view.dataset.state = "expanded";
                options.detail_view.classList.add("max-height-auto");
                options.detail_view.style.maxHeight = '15em';
                options.pointer.classList.add("rotate-90");
                _this.openChatsInfoArray.push(options.chat_id_value);
            },

            transitionEnd: function(event) {
                var _this = this;
                if (event.target.dataset) {
                    var action = event.target.dataset.role;
                    if (action === 'detail_view_container') {
                        if (event.target.style.maxHeight === '0em') {
                            delete event.target.dataset.state;
                            event.target.innerHTML = "";
                            _this.resizePanel();
                        }
                    }
                }
            },

            resizePanel: function() {
                var _this = this;
                if (_this.outer_container.style[_this.type] === '0px') {
                    _this.inner_container.style.maxWidth = _this.calcMaxWidth();
                    if (_this.outer_container.clientWidth + _this.togglePanelElement_clientWidth > document.body.clientWidth) {
                        _this.togglePanelElement.classList.add('hide');
                        if (_this.togglePanelElementToolbar) {
                            _this.togglePanelElementToolbar.classList.remove('hide');
                        }
                    }
                    else {
                        _this.togglePanelElement.classList.remove('hide');
                        if (_this.togglePanelElementToolbar) {
                            _this.togglePanelElementToolbar.classList.add('hide');
                        }
                    }
                }
            },

            toggleListOptions: function(chatsLength) {
              var _this = this;
                if (_this.type === "left" ){
                    _this.chats_ListOptions.final = chatsLength;
                }
            },

            calcMaxWidth: function() {
                return document.body.offsetWidth + 'px';
            },

            requestFriendByUserId: function() {
                var _this = this;
                var user_id_input = _this.body_container.querySelector('[data-role="user_id_input"]');
                var user_message_input = _this.body_container.querySelector('[data-role="user_message_input"]');
                var requestButton = _this.body_container.querySelector('[data-action="requestFriendByUserId"]');

                if (requestButton && user_id_input && user_id_input.value && user_message_input && user_message_input.value) {
                    _this.disableButton('requestFriendByUserId', requestButton);
                    websocket.sendMessage({
                        type: "user_add",
                        from_user_id: users_bus.getUserId(),
                        to_user_id: user_id_input.value,
                        request_body: {
                            message: user_message_input.value
                        }
                    });
                } else {
                    popap_manager.renderPopap(
                        'error',
                        {message: 89},
                        function(action) {
                            switch (action) {
                                case 'confirmCancel':
                                    popap_manager.onClose();
                                    break;
                            }
                        }
                    );
                }
            },

            /**
             * request connection to chat by its id
             * chat creator should be online to accept request and share chat
             */
            requestChatByChatId: function() {
                var _this = this;
                var chat_id_input = _this.body_container.querySelector('[data-role="chat_id_input"]');
                var chat_message_input = _this.body_container.querySelector('[data-role="chat_message_input"]');
                var requestButton = _this.body_container.querySelector('[data-action="requestChatByChatId"]');

                if (requestButton && chat_id_input && chat_id_input.value && chat_message_input && chat_message_input.value) {
                    //_this.disableButton('requestChatByChatId', requestButton);

                    websocket.sendMessage({
                        type: "chat_join_request",
                        from_user_id: users_bus.getUserId(),
                        to_chat_id: chat_id_input.value,
                        request_body: {
                            message: chat_message_input.value
                        }
                    });
                } else {
                    popap_manager.renderPopap(
                        'error',
                        {message: 90},
                        function(action) {
                            switch (action) {
                                case 'confirmCancel':
                                    popap_manager.onClose();
                                    break;
                            }
                        }
                    );
                }
            },

            readyForFriendRequest: function(element) {
                var _this = this;
                _this.joinUser_ListOptions.readyForRequest = element.checked;
                _this.disableButton('readyForFriendRequest', element);

                websocket.sendMessage({
                    type: "user_toggle_ready",
                    from_user_id: users_bus.getUserId(),
                    ready_state: element.checked
                });
            },

            /**
             * handle message from web-socket (if it is connected with chats some how)
             */
            onPanelMessageRouter: function(messageData) {
                var _this = this;
                if (_this.type !== "left" ){
                    return;
                }

                switch (messageData.type) {
                    case 'user_add':
                        if (_this.bodyOptions.mode === _this.MODE.JOIN_USER) {
                            _this.userAddApproved(messageData);
                        }
                        break;
                    case 'user_add_sent':
                        if (_this.bodyOptions.mode === _this.MODE.JOIN_USER) {
                            _this.enableButton('requestFriendByUserId');
                            event_bus.set_ws_device_id(messageData.from_ws_device_id);
                            _this.listenNotifyUser(messageData.to_user_id);
                        }
                        break;
                    case 'friendship_confirmed':
                        if (messageData.user_wscs_descrs) {
                            _this.listenWebRTCConnection(messageData.to_user_id);
                            webrtc.handleConnectedDevices(messageData.user_wscs_descrs);
                        }
                        break;
                    case 'device_toggled_ready':
                        _this.enableButton('readyForFriendRequest');
                        event_bus.set_ws_device_id(messageData.from_ws_device_id);
                        break;
                }
            },

            onNotifyUser: function(user_id, messageData) {
                var _this = this;
                users_bus.addNewUserToIndexedDB(messageData.user_description, function(error, user_description) {
                    if (error) {
                        console.error(error);
                        return;
                    }

                    users_bus.putUserIdAndSave(user_id);
                    _this.notListenNotifyUser();
                });
            },

            webRTCConnectionReady: function(user_id, triggerConnection) {
                var _this = this;
                if (triggerConnection.hasUserId(user_id)) {
                    // if connection for user friendship
                    _this.notListenWebRTCConnection();
                    users_bus.getUserDescription({}, function(error, user_description) {
                        if (error) {
                            console.error(error);
                            return;
                        }

                        var messageData = {
                            type: "notifyUser",
                            user_description: user_description
                        };
                        if (triggerConnection.isActive()) {
                            triggerConnection.dataChannel.send(JSON.stringify(messageData));
                        } else {
                            console.warn('No friendship data channel!');
                        }
                    });
                }
            },

            notListenWebRTCConnection: function() {
                if (this.bindedWebRTCConnectionReady) {
                    webrtc.off('webrtc_connection_established', this.bindedWebRTCConnectionReady);
                }
            },

            listenWebRTCConnection: function(user_id) {
                this.notListenWebRTCConnection();
                this.bindedWebRTCConnectionReady = this.webRTCConnectionReady.bind(this, user_id);
                webrtc.on('webrtc_connection_established', this.bindedWebRTCConnectionReady);
            },

            notListenNotifyUser: function() {
                if (this.bindedOnNotifyUser) {
                    event_bus.off('notifyUser', this.bindedOnNotifyUser);
                }
            },

            listenNotifyUser: function(user_id) {
                this.notListenNotifyUser();
                this.bindedOnNotifyUser = this.onNotifyUser.bind(this, user_id);
                event_bus.on('notifyUser', this.bindedOnNotifyUser);
            },

            userAddApproved: function(messageData) {
                var _this = this;
                event_bus.set_ws_device_id(messageData.target_ws_device_id);
                if (messageData.user_wscs_descrs && confirm(messageData.request_body.message)) {
                    _this.listenWebRTCConnection(messageData.from_user_id);
                    _this.listenNotifyUser(messageData.from_user_id);
                    websocket.sendMessage({
                        type: "friendship_confirmed",
                        from_user_id: users_bus.getUserId(),
                        to_user_id: messageData.from_user_id,
                        request_body: messageData.request_body
                    });
                    webrtc.handleConnectedDevices(messageData.user_wscs_descrs);
                }
            },

            toPanelDescription: function() {
                var _this = this;
                if (_this.bodyOptions.mode === _this.MODE.DETAIL_VIEW) {
                    _this.bodyOptions.mode = _this.MODE.CHATS;
                }
                return {
                    chats_GoToOptions: _this.chats_GoToOptions,
                    chats_PaginationOptions: _this.chats_PaginationOptions,
                    chats_ExtraToolbarOptions: _this.chats_ExtraToolbarOptions,
                    chats_FilterOptions: _this.chats_FilterOptions,
                    chats_ListOptions: _this.chats_ListOptions,
                    users_ExtraToolbarOptions: _this.users_ExtraToolbarOptions,
                    users_FilterOptions: _this.users_FilterOptions,
                    users_GoToOptions: _this.users_GoToOptions,
                    users_PaginationOptions: _this.users_PaginationOptions,
                    users_ListOptions: _this.users_ListOptions,
                    joinUser_ExtraToolbarOptions: _this.joinUser_ExtraToolbarOptions,
                    joinUser_FilterOptions: _this.joinUser_FilterOptions,
                    joinUser_PaginationOptions: _this.joinUser_PaginationOptions,
                    joinUser_GoToOptions: _this.joinUser_GoToOptions,
                    createChat_ExtraToolbarOptions: _this.createChat_ExtraToolbarOptions,
                    createChat_FilterOptions: _this.createChat_FilterOptions,
                    createChat_PaginationOptions: _this.createChat_PaginationOptions,
                    createChat_GoToOptions: _this.createChat_GoToOptions,
                    joinChat_ExtraToolbarOptions: _this.joinChat_ExtraToolbarOptions,
                    joinChat_FilterOptions: _this.joinChat_FilterOptions,
                    joinChat_PaginationOptions: _this.joinChat_PaginationOptions,
                    joinChat_GoToOptions: _this.joinChat_GoToOptions,
                    createBlog_ExtraToolbarOptions: _this.createBlog_ExtraToolbarOptions,
                    createBlog_FilterOptions: _this.createBlog_FilterOptions,
                    createBlog_PaginationOptions: _this.createBlog_PaginationOptions,
                    createBlog_GoToOptions: _this.createBlog_GoToOptions,
                    joinBlog_ExtraToolbarOptions: _this.joinBlog_ExtraToolbarOptions,
                    joinBlog_FilterOptions: _this.joinBlog_FilterOptions,
                    joinBlog_PaginationOptions: _this.joinBlog_PaginationOptions,
                    joinBlog_GoToOptions: _this.joinBlog_GoToOptions,
                    blogs_ExtraToolbarOptions: _this.blogs_ExtraToolbarOptions,
                    blogs_FilterOptions: _this.blogs_FilterOptions,
                    blogs_PaginationOptions: _this.blogs_PaginationOptions,
                    blogs_GoToOptions: _this.blogs_GoToOptions,
                    blogs_ListOptions: _this.blogs_ListOptions,
                    connections_ExtraToolbarOptions: _this.connections_ExtraToolbarOptions,
                    connections_FilterOptions: _this.connections_FilterOptions,
                    connections_PaginationOptions: _this.connections_PaginationOptions,
                    connections_GoToOptions: _this.connections_GoToOptions,
                    connections_ListOptions: _this.connections_ListOptions,
                    userInfoEdit_ExtraToolbarOptions: _this.userInfoEdit_ExtraToolbarOptions,
                    userInfoEdit_FilterOptions: _this.userInfoEdit_FilterOptions,
                    userInfoEdit_PaginationOptions: _this.userInfoEdit_PaginationOptions,
                    userInfoEdit_GoToOptions: _this.userInfoEdit_GoToOptions,
                    userInfoShow_ExtraToolbarOptions: _this.userInfoShow_ExtraToolbarOptions,
                    userInfoShow_FilterOptions: _this.userInfoShow_FilterOptions,
                    userInfoShow_PaginationOptions: _this.userInfoShow_PaginationOptions,
                    userInfoShow_GoToOptions: _this.userInfoShow_GoToOptions,
                    filterOptions: _this.filterOptions,
                    bodyOptions: _this.bodyOptions,
                    collectionDescription: _this.collectionDescription,
                    previous_UserInfo_Mode: _this.previous_UserInfo_Mode,
                    joinUser_ListOptions: _this.joinUser_ListOptions
                };
            }

        };
        extend_core.prototype.inherit(panel, throw_event_core);
        extend_core.prototype.inherit(panel, ajax_core);
        extend_core.prototype.inherit(panel, template_core);
        extend_core.prototype.inherit(panel, render_layout_core);
        extend_core.prototype.inherit(panel, extend_core);
        extend_core.prototype.inherit(panel, switcher_core);
        extend_core.prototype.inherit(panel, overlay_core);
        extend_core.prototype.inherit(panel, dom_core);
        extend_core.prototype.inherit(panel, disable_display_core);

        panel.prototype.panel_left_template = panel.prototype.template(panel_left_template);
        panel.prototype.panel_right_template = panel.prototype.template(panel_right_template);
        panel.prototype.triple_element_template = panel.prototype.template(triple_element_template);
        panel.prototype.location_wrapper_template = panel.prototype.template(location_wrapper_template);
        panel.prototype.button_template = panel.prototype.template(button_template);
        panel.prototype.label_template = panel.prototype.template(label_template);
        panel.prototype.input_template = panel.prototype.template(input_template);
        panel.prototype.textarea_template = panel.prototype.template(textarea_template);
        panel.prototype.select_template = panel.prototype.template(select_template);

        panel.prototype.templateMap = {};
        panel.prototype.configHandlerMap = {};
        panel.prototype.configHandlerContextMap = {};
        panel.prototype.dataHandlerMap = {};
        panel.prototype.dataMap = {};

        return panel;
    });

define('ping_core', [],
    function() {

        var ping_core = function() {
        };
        ping_core.prototype = {

            __class_name: "ping_core",

            throttle: function(func, wait, options) {
                var context, args, result;
                var timeout = null;
                var previous = 0;
                if (!options) options = {};
                var later = function() {
                    previous = options.leading === false ? 0 : Date.now();
                    timeout = null;
                    result = func.apply(context, args);
                    if (!timeout) context = args = null;
                };
                return function() {
                    var now = Date.now();
                    if (!previous && options.leading === false) previous = now;
                    var remaining = wait - (now - previous);
                    context = this;
                    args = arguments;
                    if (remaining <= 0 || remaining > wait) {
                        if (timeout) {
                            clearTimeout(timeout);
                            timeout = null;
                        }
                        previous = now;
                        result = func.apply(context, args);
                        if (!timeout) context = args = null;
                    } else if (!timeout && options.trailing !== false) {
                        timeout = setTimeout(later, remaining);
                    }
                    return result;
                };
            }
        };

        return ping_core;
    }
);

define('panel_platform', [
        'panel',
        'overlay_core',
        'throw_event_core',
        'extend_core',
        'ping_core',
        'indexeddb',
        'users_bus',
        'popap_manager',
        'websocket',
        'webrtc',
        'event_bus'
    ],
    function(panel,
             overlay_core,
             throw_event_core,
             extend_core,
             ping_core,
             indexeddb,
             users_bus,
             popap_manager,
             websocket,
             webrtc,
             event_bus) {

        var panel_platform = function() {
            var _this = this;


            _this.bindContexts();
        };

        panel_platform.prototype = {

            PANEL_TYPES: {
                LEFT: "left",
                RIGHT: "right"
            },

            bindContexts: function() {
                var _this = this;
                _this.bindedResizePanel = _this.throttle(_this.resizePanels.bind(_this), 300);
            },

            cashElements: function() {
                var _this = this;
                _this.left_panel_outer_container = document.querySelector('[data-role="left_panel_outer_container"]');
                _this.left_panel_inner_container = document.querySelector('[data-role="left_panel_inner_container"]');
                _this.left_filter_container = _this.left_panel_inner_container.querySelector('[data-role="left_filter_container"]');
                _this.left_go_to_container = _this.left_panel_inner_container.querySelector('[data-role="left_go_to_container"]');
                _this.left_panel_toolbar = _this.left_panel_inner_container.querySelector('[data-role="left_panel_toolbar"]');
                _this.left_pagination_container = _this.left_panel_inner_container.querySelector('[data-role="left_pagination_container"]');
                _this.left_extra_toolbar_container = _this.left_panel_inner_container.querySelector('[data-role="left_extra_toolbar_container"]');

                _this.right_panel_outer_container = document.querySelector('[data-role="right_panel_outer_container"]');
                _this.right_panel_inner_container = document.querySelector('[data-role="right_panel_inner_container"]');
                _this.right_filter_container = _this.right_panel_inner_container.querySelector('[data-role="right_filter_container"]');
                _this.right_go_to_container = _this.right_panel_inner_container.querySelector('[data-role="right_go_to_container"]');
                _this.right_panel_toolbar = _this.right_panel_inner_container.querySelector('[data-role="right_panel_toolbar"]');
                _this.right_pagination_container = _this.right_panel_inner_container.querySelector('[data-role="right_pagination_container"]');
                _this.right_extra_toolbar_container = _this.right_panel_inner_container.querySelector('[data-role="right_extra_toolbar_container"]');
            },

            unCashElements: function() {
                var _this = this;
                _this.left_panel_outer_container = null;
                _this.left_panel_inner_container = null;
                _this.left_filter_container = null;
                _this.left_go_to_container = null;
                _this.left_panel_toolbar = null;
                _this.left_pagination_container = null;
                _this.left_extra_toolbar_container = null;

                _this.right_panel_outer_container = null;
                _this.right_panel_inner_container = null;
                _this.right_filter_container = null;
                _this.right_go_to_container = null;
                _this.right_panel_toolbar = null;
                _this.right_pagination_container = null;
                _this.right_extra_toolbar_container = null;
            },

            renderPanels: function(options) {
                var _this = this;
                _this.navigator = options.navigator;
                _this.cashElements();
                users_bus.getMyInfo(null, function(error, _options, userInfo){
                    if (error) {
                        popap_manager.renderPopap(
                            'error',
                            error,
                            function(action) {
                                switch (action) {
                                    case 'confirmCancel':
                                        popap_manager.onClose();
                                        break;
                                }
                            }
                        );
                        return;
                    }

                    _this.panelsDescriptions = [
                        {
                            type: _this.PANEL_TYPES.LEFT,
                            outer_container: _this.left_panel_outer_container,
                            inner_container: _this.left_panel_inner_container,
                            body_mode: panel.prototype.MODE.CREATE_CHAT,
                            filter_container: _this.left_filter_container,
                            go_to_container: _this.left_go_to_container,
                            pagination_container: _this.left_pagination_container,
                            extra_toolbar_container: _this.left_extra_toolbar_container,
                            panel_toolbar: _this.left_panel_toolbar,
                            options: userInfo[_this.PANEL_TYPES.LEFT]
                        },
                        {
                            type: _this.PANEL_TYPES.RIGHT,
                            outer_container: _this.right_panel_outer_container,
                            inner_container: _this.right_panel_inner_container,
                            body_mode: panel.prototype.MODE.USER_INFO_SHOW,
                            filter_container: _this.right_filter_container,
                            go_to_container: _this.right_go_to_container,
                            panel_toolbar: _this.right_panel_toolbar,
                            pagination_container: _this.right_pagination_container,
                            extra_toolbar_container: _this.right_extra_toolbar_container,
                            options: userInfo[_this.PANEL_TYPES.RIGHT]
                        }
                    ];
                    _this.panelsDescriptions.forEach(function(panelDescription) {
                        var _panel = new panel(panelDescription);
                        panel.prototype.panelArray.push(_panel);
                    });


                    options.panel_platform = _this;
                    panel.prototype.panelArray.forEach(function(_panel) {
                        _panel.initialization(options);
                    });
                    _this.addEventListeners();
                });
            },

            disposePanels: function() {
                var _this = this;
                _this.removeEventListeners();
                panel.prototype.panelArray.forEach(function(_panel) {
                    _panel.dispose();
                });
                panel.prototype.panelArray = [];
            },

            getPanelDescription: function() {
                var panelDescription = {};
                panel.prototype.panelArray.forEach(function(_panel) {
                    panelDescription[_panel.type] = _panel.toPanelDescription();
                });
                return panelDescription;
            },

            savePanelStates: function(panelDescription, callback) {
                var _this = this;

                users_bus.getMyInfo(null, function(error, options, userInfo){
                    if (error) {
                        callback(error);
                        return;
                    }

                    _this.extend(userInfo, panelDescription);
                    users_bus.saveMyInfo(userInfo, function(err) {
                        if (err) {
                            callback(err);
                            return;
                        }

                        callback(null);
                    });
                });
            },

            addEventListeners: function() {
                var _this = this;
                _this.removeEventListeners();
                _this.on('resize', _this.bindedResizePanel, _this);
                event_bus.on('throw', _this.onThrowEvent, _this);
                event_bus.on('panelsDestroy', _this.disposePanels, _this);
            },

            removeEventListeners: function() {
                var _this = this;
                _this.off('resize');
                event_bus.off('throw', _this.onThrowEvent);
                event_bus.off('panelsDestroy', _this.disposePanels);
            },

            resizePanels: function(){
                panel.prototype.panelArray.forEach(function(_panel) {
                    _panel.resizePanel();
                });
            },

            destroy: function() {
                var _this = this;
                _this.removeEventListeners();
                _this.unCashMainElements();
            },

            logout: function() {
                var _this = this;
                _this.toggleWaiter(true);
                _this.savePanelStates(_this.getPanelDescription(), function(err) {
                    _this.toggleWaiter();
                    if (err) {
                        popap_manager.renderPopap(
                            'error',
                            {message: err},
                            function(action) {
                                switch (action) {
                                    case 'confirmCancel':
                                        popap_manager.onClose();
                                        break;
                                }
                            }
                        );
                        return;
                    }

                    _this.disposePanels();
                    event_bus.trigger("chatsDestroy");
                    websocket.dispose();
                    webrtc.destroy();
                    history.pushState(null, null, 'login');
                    _this.navigator.navigate();
                });
            },

            onThrowEvent: function(eventName, eventData) {
                if (!eventName) {
                    return;
                }

                if (this[eventName]) {
                    this[eventName](eventData);
                }

            }

        };
        extend_core.prototype.inherit(panel_platform, overlay_core);
        extend_core.prototype.inherit(panel_platform, throw_event_core);
        extend_core.prototype.inherit(panel_platform, ping_core);
        extend_core.prototype.inherit(panel_platform, extend_core);

        return new panel_platform();
    });
define('text!../templates/login_template.ejs',[],function () { return '<div class="flex-outer-container p-fx">\n    <form class="flex-inner-container form-small" data-role="loginForm" >\n            <% if (_in.config && _in.config.byDataLocation) {\n                    for (var locationKey in _in.config.byDataLocation) { %>\n            <%= _in.location_wrapper_template({\n                config: _in.config.byDataLocation[locationKey],\n                data: _in.data ? _in.data : {},\n                triple_element_template: _in.triple_element_template,\n                button_template: _in.button_template,\n                input_template: _in.input_template,\n                label_template: _in.label_template,\n                select_template: _in.select_template\n            }) %>\n            <% }\n            } %>\n    </form>\n</div>';});

define('login', [
        'overlay_core',
        'render_layout_core',
        'throw_event_core',
        'extend_core',
        //
        'users_bus',
        'indexeddb',
        'popap_manager',
        'websocket',
        //
        'text!../templates/login_template.ejs',
        'text!../templates/element/triple_element_template.ejs',
        'text!../templates/element/button_template.ejs',
        'text!../templates/element/label_template.ejs',
        'text!../templates/element/location_wrapper_template.ejs',
        'text!../templates/element/input_template.ejs',
        'text!../templates/element/select_template.ejs'
    ],
    function(
        overlay_core,
        render_layout_core,
        throw_event_core,
        extend_core,
        //
        users_bus,
        indexeddb,
        popap_manager,
        websocket,
        //
        login_template,
        triple_element_template,
        button_template,
        label_template,
        location_wrapper_template,
        input_template,
        select_template
    ) {

        /**
         * login constructor
         * login layout is always visible, if it is hidden it has absolute 1px x 1px size for browser auto add user name and user password
         * if it is visible => cash all elements in initialization
         */
        var login = function() {
            this.link = /login/; // is used for navigator

            this.bindContexts();
        };

        login.prototype = {

            configMap: {
                "LOGIN": '/configs/login_config.json'
            },

            MODE: {
                LOGIN: 'LOGIN'
            },

            cashElements: function() {
                var _this = this;
                _this.loginForm = _this.navigator.main_container.querySelector('[data-role="loginForm"]');
                _this.redirectToRegisterElement = _this.loginForm.querySelector('[data-action="clickRedirectToRegister"]');
            },

            unCashElements: function() {
                var _this = this;
                _this.login_outer_container = null;
                _this.loginForm = null;
                _this.redirectToRegisterElement = null;
            },

            render: function(options) {
                if (!options || !options.navigator) {
                    console.error(new Error('Invalid input options for render'));
                    return;
                }
                var _this = this;
                _this.navigator = options.navigator;
                _this.elementMap = {
                    "LOGIN": _this.navigator.main_container
                };
                _this.body_mode = _this.MODE.LOGIN;
                var language  = localStorage.getItem('language');
                if (language && window.localization !== language) {
                    window.localization = language;
                }
                _this.renderLayout(null, function() {
                    _this.cashElements();
                    _this.addEventListeners();
                    _this.toggleWaiter();
                });
            },

            dispose: function() {
                var _this = this;
                _this.removeEventListeners();
            },

            bindContexts: function() {
                var _this = this;
                _this.bindedOnSubmit = _this.onSubmit.bind(_this);
                _this.bindedRedirectToRegister = _this.redirectToRegister.bind(_this);
            },

            addEventListeners: function() {
                var _this = this;
                _this.removeEventListeners();
                _this.addRemoveListener('add', _this.loginForm, 'submit', _this.bindedOnSubmit, false);
                _this.addRemoveListener('add', _this.redirectToRegisterElement, 'click', _this.bindedRedirectToRegister, false);
            },

            removeEventListeners: function() {
                var _this = this;
                _this.addRemoveListener('remove', _this.loginForm, 'submit', _this.bindedOnSubmit, false);
                _this.addRemoveListener('remove', _this.redirectToRegisterElement, 'click', _this.bindedRedirectToRegister, false);
            },

            onSubmit: function(event) {
                var _this = this;
                event.preventDefault();
                var userName = _this.loginForm.elements.userName.value;
                var userPassword = _this.loginForm.elements.userPassword.value;
                if (userName && userPassword) {
                    _this.toggleWaiter(true);
                    indexeddb.getGlobalUserCredentials(userName, userPassword, function(err, userCredentials) {
                        _this.toggleWaiter();
                        if (err) {
                            popap_manager.renderPopap(
                                'error',
                                {message: err},
                                function(action) {
                                    switch (action) {
                                        case 'confirmCancel':
                                            popap_manager.onClose();
                                            break;
                                    }
                                }
                            );
                            return;
                        }

                        if (userCredentials) {
                            users_bus.setUserId(userCredentials.user_id);
                            websocket.createAndListen();
                            history.pushState(null, null, 'chat');
                            _this.navigator.navigate();
                        } else {
                            users_bus.setUserId(null);
                            //_this.loginForm.reset();
                            popap_manager.renderPopap(
                                'error',
                                {message: 87},
                                function(action) {
                                    switch (action) {
                                        case 'confirmCancel':
                                            popap_manager.onClose();
                                            break;
                                    }
                                }
                            );
                        }
                    });
                } else {
                    popap_manager.renderPopap(
                        'error',
                        {message: 88},
                        function(action) {
                            switch (action) {
                                case 'confirmCancel':
                                    popap_manager.onClose();
                                    break;
                            }
                        }
                    );
                }
            },

            redirectToRegister: function() {
                var _this = this;
                history.pushState(null, null, 'register');
                _this.navigator.navigate();
            },

            destroy: function() {
                var _this = this;
                _this.removeEventListeners();
                _this.unCashElements();
            }
        };

        extend_core.prototype.inherit(login, overlay_core);
        extend_core.prototype.inherit(login, throw_event_core);
        extend_core.prototype.inherit(login, render_layout_core);

        login.prototype.login_template = login.prototype.template(login_template);
        login.prototype.triple_element_template = login.prototype.template(triple_element_template);
        login.prototype.button_template = login.prototype.template(button_template);
        login.prototype.label_template = login.prototype.template(label_template);
        login.prototype.location_wrapper_template = login.prototype.template(location_wrapper_template);
        login.prototype.input_template = login.prototype.template(input_template);
        login.prototype.select_template = login.prototype.template(select_template);

        login.prototype.dataMap = {
            "LOGIN": ''
        };

        login.prototype.templateMap = {
            "LOGIN": login.prototype.login_template
        };

        login.prototype.configHandlerMap = {
            "LOGIN": login.prototype.prepareConfig
        };
        login.prototype.configHandlerContextMap = {};
        login.prototype.dataHandlerMap = {
            "LOGIN": ''
        };
        login.prototype.dataHandlerContextMap = {
            "LOGIN": null
        };

        return new login();

    }
);
define('text!../templates/register_template.ejs',[],function () { return '<div class="flex-outer-container p-fx">\n    <form class="flex-inner-container form-small" data-role="registerForm">\n        <% if (_in.config && _in.config.byDataLocation) {\n                for (var locationKey in _in.config.byDataLocation) { %>\n        <%= _in.location_wrapper_template({\n            config: _in.config.byDataLocation[locationKey],\n            data: _in.data ? _in.data : {},\n            triple_element_template: _in.triple_element_template,\n            button_template: _in.button_template,\n            input_template: _in.input_template,\n            label_template: _in.label_template,\n            select_template: _in.select_template\n        }) %>\n        <% }\n        } %>\n    </form>\n</div>';});

define('register', [
        'overlay_core',
        'throw_event_core',
        'template_core',
        'ajax_core',
        'extend_core',
        'render_layout_core',
        //
        'id_core',
        'users_bus',
        'websocket',
        'indexeddb',
        'popap_manager',
        //
        'text!../templates/register_template.ejs',
        'text!../templates/element/triple_element_template.ejs',
        'text!../templates/element/button_template.ejs',
        'text!../templates/element/label_template.ejs',
        'text!../templates/element/location_wrapper_template.ejs',
        'text!../templates/element/input_template.ejs',
        'text!../templates/element/select_template.ejs'
    ],
    function(overlay_core,
             throw_event_core,
             template_core,
             ajax_core,
             extend_core,
             render_layout_core,
            //
             id_core,
             users_bus,
             websocket,
             indexeddb,
             popap_manager,
            //
             register_template,
             triple_element_template,
             button_template,
             label_template,
             location_wrapper_template,
             input_template,
             select_template) {

        /**
         * register constructor
         */
        var register = function() {
            this.link = /register/; // is used for navigator
            this.bindContexts();
        };

        register.prototype = {

            configMap: {
                "REGISTER": '/configs/register_config.json'
            },

            MODE: {
                REGISTER: 'REGISTER'
            },

            cashMainElements: function() {
                var _this = this;
                _this.registerForm = _this.navigator.main_container.querySelector('[data-role="registerForm"]');
                _this.redirectToLogin = _this.registerForm.querySelector('[data-action="redirectToLogin"]');
            },

            unCashMainElements: function() {
                var _this = this;
                _this.registerForm = null;
                _this.redirectToLogin = null;
            },

            render: function(options) {
                if (!options || !options.navigator || !options.navigator.main_container) {
                    popap_manager.renderPopap(
                        'error',
                        {message: 92},
                        function(action) {
                            switch (action) {
                                case 'confirmCancel':
                                    popap_manager.onClose();
                                    break;
                            }
                        }
                    );
                    return;
                }
                var _this = this;
                _this.navigator = options.navigator;
                var language  = localStorage.getItem('language');
                if (language && window.localization !== language) {
                    window.localization = language;
                }
                _this.elementMap = {
                    "REGISTER": _this.navigator.main_container
                };
                _this.body_mode = _this.MODE.REGISTER;
                _this.renderLayout(null, function() {
                    _this.cashMainElements();
                    _this.addEventListeners();
                    _this.toggleWaiter();
                });
            },

            dispose: function() {
                var _this = this;
                _this.removeEventListeners();
            },

            bindContexts: function() {
                var _this = this;
                _this.bindedRegisterWorkflow = _this.registerWorkflow.bind(_this);
            },

            addEventListeners: function() {
                var _this = this;
                _this.removeEventListeners();
                _this.addRemoveListener('add', _this.registerForm, 'submit', _this.bindedRegisterWorkflow, false);
                _this.addRemoveListener('add', _this.redirectToLogin, 'click', _this.navigator.bindedRedirectToLogin, false);
            },

            removeEventListeners: function() {
                var _this = this;
                _this.addRemoveListener('remove', _this.registerForm, 'submit', _this.bindedRegisterWorkflow, false);
                _this.addRemoveListener('remove', _this.redirectToLogin, 'click', _this.navigator.bindedRedirectToLogin, false);
            },

            registerWorkflow: function(event) {
                var _this = this;
                event.preventDefault();
                var userName = _this.registerForm.elements.userName.value;
                var userPassword = _this.registerForm.elements.userPassword.value;
                var userPasswordConfirm = _this.registerForm.elements.userPasswordConfirm.value;
                if (userName && userPassword && userPasswordConfirm) {
                    if (userPassword === userPasswordConfirm) {
                        _this.toggleWaiter(true);
                        _this.registerNewUser(
                            {
                                userName: userName,
                                userPassword: userPassword
                            },
                            function(regErr, account) {
                                _this.toggleWaiter();
                                if (regErr) {
                                    popap_manager.renderPopap(
                                        'error',
                                        {message: regErr},
                                        function(action) {
                                            switch (action) {
                                                case 'confirmCancel':
                                                    popap_manager.onClose();
                                                    break;
                                            }
                                        }
                                    );
                                    return;
                                }

                                popap_manager.renderPopap(
                                    'success',
                                    {message: 96},
                                    function(action) {
                                        switch (action) {
                                            case 'confirmCancel':
                                                popap_manager.onClose();
                                                _this.navigator.bindedRedirectToLogin();
                                                break;
                                        }
                                    }
                                );
                            }
                        );
                    } else {
                        users_bus.setUserId(null);
                        _this.registerForm.reset();
                        popap_manager.renderPopap(
                            'error',
                            {message: 91},
                            function(action) {
                                switch (action) {
                                    case 'confirmCancel':
                                        popap_manager.onClose();
                                        break;
                                }
                            }
                        );
                    }
                } else {
                    popap_manager.renderPopap(
                        'error',
                        {message: 88},
                        function(action) {
                            switch (action) {
                                case 'confirmCancel':
                                    popap_manager.onClose();
                                    break;
                            }
                        }
                    );
                }
            },

            registerNewUser: function(options, callback) {
                var _this = this;
                _this.get_JSON_res('/api/uuid', function(err, res) {
                    if (err) {
                        callback(err);
                        return;
                    }

                    users_bus.storeNewUser(
                        res.uuid,
                        options.userName,
                        options.userPassword,
                        function(err, account) {
                            if (err) {
                                callback(err);
                                return;
                            }

                            // successful register
                            callback(null, account);
                        }
                    );
                });
            },

            destroy: function() {
                var _this = this;
                _this.removeEventListeners();
                _this.unCashMainElements();
            }
        };

        extend_core.prototype.inherit(register, overlay_core);
        extend_core.prototype.inherit(register, throw_event_core);
        extend_core.prototype.inherit(register, template_core);
        extend_core.prototype.inherit(register, id_core);
        extend_core.prototype.inherit(register, ajax_core);
        extend_core.prototype.inherit(register, render_layout_core);

        register.prototype.register_template = register.prototype.template(register_template);
        register.prototype.triple_element_template = register.prototype.template(triple_element_template);
        register.prototype.button_template = register.prototype.template(button_template);
        register.prototype.label_template = register.prototype.template(label_template);
        register.prototype.location_wrapper_template = register.prototype.template(location_wrapper_template);
        register.prototype.input_template = register.prototype.template(input_template);
        register.prototype.select_template = register.prototype.template(select_template);

        register.prototype.dataMap = {
            "REGISTER": ''
        };

        register.prototype.templateMap = {
            "REGISTER": register.prototype.register_template
        };

        register.prototype.configHandlerMap = {
            "REGISTER": register.prototype.prepareConfig
        };
        register.prototype.configHandlerContextMap = {};
        register.prototype.dataHandlerMap = {
            "REGISTER": ''
        };
        register.prototype.dataHandlerContextMap = {
            "REGISTER": null
        };


        return new register();

    }
);
define('navigator',
    [
        'chat_platform',
        'panel_platform',
        'login',
        'register',
        'users_bus',
        'event_bus',
        'popap_manager',
        //
        'throw_event_core',
        'dom_core',
        'extend_core'
    ],
    function (
        chat_platform,
        panel_platform,
        login,
        register,
        users_bus,
        event_bus,
        popap_manager,
        //
        throw_event_core,
        dom_core,
        extend_core
    ) {

        var navigator = function() {
            this.pages = [chat_platform, login, register];
            this.currentPage = null;
        };

        navigator.prototype = {

            cashElements: function() {
                var _this = this;
                _this.login_outer_container = document.querySelector('[data-role="login_outer_container"]');
                _this.main_container = document.querySelector('[data-role="main_container"]');
            },

            unCashElements: function() {
                var _this = this;
                _this.login_outer_container = null;
                _this.main_container = null;
            },

            bindContexts: function() {
                var _this = this;
                _this.bindedNavigate = _this.navigate.bind(_this);
                _this.bindedRedirectToLogin = _this.redirectToLogin.bind(_this);
                _this.bindedNotifyCurrentPage = _this.notifyCurrentPage.bind(_this);
                _this.bindedOnChangeLanguage = _this.onChangeLanguage.bind(_this);
            },

            addEventListeners: function() {
                var _this = this;
                _this.removeEventListeners();
                window.addEventListener('popstate', _this.bindedNavigate, false);
                window.addEventListener('resize', _this.bindedNotifyCurrentPage, false);
                window.addEventListener('change', _this.bindedOnChangeLanguage, false);
                panel_platform.on('throw', _this.bindedNotifyCurrentPage, false);
            },

            removeEventListeners: function() {
                var _this = this;
                window.removeEventListener('popstate', _this.bindedNavigate, false);
                window.removeEventListener('resize', _this.bindedNotifyCurrentPage, false);
                window.removeEventListener('change', _this.bindedOnChangeLanguage, false);
                panel_platform.off('addNewPanel');
            },

            onChangeLanguage: function(event) {
                var _this = this;
                if (event.target.dataset.role === 'selectLanguage') {

                    if (event.target.dataset.warn) {
                        popap_manager.renderPopap(
                            'confirm',
                            {message: 101},
                            function(action) {
                                switch (action) {
                                    case 'confirmOk':
                                        _this.changeLanguage(event);
                                        popap_manager.onClose();
                                        break;
                                    case 'confirmCancel':
                                        event.target.value = window.localization;
                                        popap_manager.onClose();
                                        break;
                                }
                            }
                        );
                    } else{
                        _this.changeLanguage(event);
                    }
                }
            },

            changeLanguage: function(event) {
                var _this = this;
                    if (_this.currentPage && _this.currentPage.withPanels) {
                        event_bus.trigger("chatsDestroy");
                        event_bus.trigger("panelsDestroy");
                    }
                    var language = localStorage.getItem('language');
                    if (!language || language !== event.target.value) {
                        localStorage.setItem('language', event.target.value);
                    }
                    if (window.localization !== event.target.value) {
                        window.localization = event.target.value;
                        this.navigate();
                    }
            },

            getCurrentPage: function(href) {
                var _this = this;
                _this.currentPage = null;
                _this.pages.every(function(page) {
                    if (page.link instanceof RegExp && page.link.test(href)) {
                        _this.currentPage = page;
                    }
                    return !_this.currentPage;
                });
            },
            
            redirectToLogin: function() {
                history.pushState(null, null, 'login');
                this.navigate();
            },

            navigate: function() {
                var _this = this;
                var href = window.location.href;
                var oldCurrentPage = _this.currentPage;
                _this.getCurrentPage(href);
                if (oldCurrentPage && oldCurrentPage !== _this.currentPage) {
                    oldCurrentPage.dispose();
                    if (oldCurrentPage.withPanels && (_this.currentPage && !_this.currentPage.withPanels)) {
                        panel_platform.disposePanels();
                    }
                }
                if(!(_this.currentPage === login || _this.currentPage === register) && !users_bus.getUserId() ) {
                    _this.redirectToLogin();
                } else if (_this.currentPage) {
                    _this.main_container.innerHTML = '';
                    if (_this.currentPage.withPanels) {
                        panel_platform.renderPanels({ navigator: _this });
                    }
                    _this.currentPage.render && _this.currentPage.render({ navigator: _this });
                } else {
                    _this.redirectToLogin();
                }
            },

            notifyCurrentPage: function(eventName, eventData) {
                if (!eventName) {
                    return;
                }

                var eventName = eventName;
                if (typeof eventName === 'object') {
                    eventName = eventName.type;
                }
                this.currentPage.trigger(eventName, eventData);
                if (this.currentPage.withPanels) {
                    panel_platform.trigger(eventName, eventData);
                }
            },

            destroy: function() {
                var _this = this;
                _this.removeEventListeners();
                _this.unCashElements();
            }
        };
        extend_core.prototype.inherit(navigator, throw_event_core);
        extend_core.prototype.inherit(navigator, dom_core);


        return new navigator();
    }
);
define('description_manager', [
        'dom_core',
        'extend_core',
        'throw_event_core'
    ],
    function(dom_core,
             extend_core,
             throw_event_core) {

        var Description_manager = function() {
            this.bindContexts();
        };

        Description_manager.prototype = {

            cashElements: function() {
                var _this = this;
                _this.button_description = document.querySelector('[data-role="description"]');
            },

            unCashElements: function() {
                var _this = this;
                _this.button_description = null;
            },

            bindContexts: function() {
                var _this = this;
                _this.bindedShowDescription = _this.showDescription.bind(_this);
            },

            unbindContexts: function() {
                var _this = this;
                _this.bindedShowDescription = null;
            },

            addEventListeners: function() {
                var _this = this;
                _this.removeEventListeners();
                _this.addRemoveListener('add', document.body, 'mousedown', _this.bindedShowDescription, false);
                _this.addRemoveListener('add', document.body, 'mousemove', _this.bindedShowDescription, false);
                _this.addRemoveListener('add', document.body, 'touchend', _this.bindedShowDescription, true);
                _this.addRemoveListener('add', document.body, 'touchmove', _this.bindedShowDescription, false);
                _this.addRemoveListener('add', document.body, 'touchstart', _this.bindedShowDescription, false);
                _this.addRemoveListener('add', document.body, 'click', _this.bindedShowDescription, true);
                _this.addRemoveListener('add', document.body, 'mouseup', _this.bindedShowDescription, true);
            },

            removeEventListeners: function() {
                var _this = this;
                _this.addRemoveListener('remove', document.body, 'mousedown', _this.bindedShowDescription, false);
                _this.addRemoveListener('remove', document.body, 'mousemove', _this.bindedShowDescription, false);
                _this.addRemoveListener('remove', document.body, 'touchend', _this.bindedShowDescription, true);
                _this.addRemoveListener('remove', document.body, 'touchmove', _this.bindedShowDescription, false);
                _this.addRemoveListener('remove', document.body, 'touchstart', _this.bindedShowDescription, false);
                _this.addRemoveListener('remove', document.body, 'click', _this.bindedShowDescription, true);
                _this.addRemoveListener('remove', document.body, 'mouseup', _this.bindedShowDescription, true);
            },

            showDescription: function(event) {
                var _this = this, description = _this.button_description, element;
                switch (event.type) {
                    case 'mousedown':
                    case 'touchstart':
                        //var element;
                        if (event.type === 'touchstart' && event.changedTouches) {
                            element = _this.getDataParameter(event.changedTouches[0].target, 'description');
                        } else {
                            element = _this.getDataParameter(event.target, 'description');
                        }
                        if (element && element.dataset.description) {
                            _this.curDescriptionElement = element;
                            _this.checkReorderClientX = event.clientX;
                            _this.checkReorderClientY = event.clientY;
                            if (event.type === 'touchstart') {
                                _this.checkReorderClientX = event.changedTouches[0].clientX;
                                _this.checkReorderClientY = event.changedTouches[0].clientY;
                            }
                        }
                        break;
                    case 'mousemove':
                    case 'touchmove':
                        if (_this.curDescriptionElement) {
                            element = _this.curDescriptionElement;
                            var clientX = event.clientX;
                            var clientY = event.clientY;
                            if (event.type === 'touchmove' && event.changedTouches) {
                                clientX = event.changedTouches[0].clientX;
                                clientY = event.changedTouches[0].clientY;
                            }
                            var radius = 5;
                            var deltaX = Math.abs(_this.checkReorderClientX - clientX);
                            var deltaY = Math.abs(_this.checkReorderClientY - clientY);
                            var current_radius = Math.sqrt(Math.pow(deltaX, 2) + Math.pow(deltaY, 2));
                            if (current_radius > radius && !_this.descriptionShow) {
                                _this.descriptionShow = true;
                                description.innerHTML = element.dataset.description;
                                var result = _this.getOffset(element);
                                var positionFound = false, checkLeft, checkTop;
                                var futureTop = result.offsetTop - description.offsetHeight;
                                var futureLeft = result.offsetLeft + element.offsetWidth / 2 - description.offsetWidth / 2;
                                var futureRight = result.offsetLeft + element.offsetWidth / 2 + description.offsetWidth / 2;
                                var documentHeight = document.documentElement.clientHeight;
                                var documentWidth = document.body.offsetWidth;
                                var documentTop = document.body.offsetTop;
                                var documentLeft = document.body.offsetLeft;

                                // if we have enough place on top of current target
                                if (documentTop < futureTop) {
                                    checkLeft = futureLeft;
                                    if (documentLeft < checkLeft) {
                                        if (checkLeft + description.offsetWidth < documentWidth) {
                                            futureLeft = checkLeft;
                                            positionFound = true;
                                        } else {
                                            // not found
                                        }
                                    }

                                    if (result.offsetLeft + element.offsetWidth / 2 > documentWidth / 2) {
                                        if (!positionFound) {
                                            checkLeft = documentWidth - 5 - element.offsetWidth;
                                            if (documentLeft < checkLeft) {
                                                if (checkLeft + description.offsetWidth < documentWidth) {
                                                    futureLeft = checkLeft;
                                                    positionFound = true;
                                                } else {
                                                    // not found
                                                }
                                            }
                                        }

                                        if (!positionFound) {
                                            checkLeft = result.offsetLeft - description.offsetWidth;
                                            if (checkLeft + description.offsetWidth < documentWidth) {
                                                if (documentLeft < checkLeft) {
                                                    futureLeft = checkLeft;
                                                    positionFound = true;
                                                } else {
                                                    // not found
                                                }
                                            }
                                        }

                                        if (!positionFound) {
                                            checkLeft = documentLeft + 5;
                                            if (checkLeft + description.offsetWidth < documentWidth) {
                                                if (documentLeft < checkLeft) {
                                                    futureLeft = checkLeft;
                                                    positionFound = true;
                                                } else {
                                                    // not found
                                                }
                                            }
                                        }
                                    } else {
                                        if (!positionFound) {
                                            checkLeft = documentLeft + 5;
                                            if (checkLeft + description.offsetWidth < documentWidth) {
                                                if (documentLeft < checkLeft) {
                                                    futureLeft = checkLeft;
                                                    positionFound = true;
                                                } else {
                                                    // not found
                                                }
                                            }
                                        }

                                        if (!positionFound) {
                                            checkLeft = documentWidth - 5 - description.offsetHeight;
                                            if (documentLeft < checkLeft) {
                                                if (checkLeft + description.offsetWidth < documentWidth) {
                                                    futureLeft = checkLeft;
                                                    positionFound = true;
                                                } else {
                                                    // not found
                                                }
                                            }
                                        }
                                    }
                                }

                                // if we have enough place on the left of current target
                                if (!positionFound) {
                                    futureLeft = result.offsetLeft - description.offsetWidth;
                                    futureTop = result.offsetTop + element.offsetHeight / 2 - description.offsetHeight / 2;
                                    if (documentLeft < futureLeft) {
                                        checkTop = futureTop;
                                        if (documentTop < checkTop) {
                                            if (checkTop + description.offsetHeight < documentHeight) {
                                                futureTop = checkTop;
                                                positionFound = true;
                                            } else {
                                                // not found
                                            }
                                        }

                                        if (!positionFound) {
                                            checkTop = documentTop + 5;
                                            if (checkTop + description.offsetHeight < documentHeight) {
                                                if (documentTop < checkTop) {
                                                    futureTop = checkTop;
                                                    positionFound = true;
                                                } else {
                                                    // not found
                                                }
                                            }
                                        }

                                        if (!positionFound) {
                                            checkTop = documentHeight - 5 - description.offsetHeight;
                                            if (documentTop < checkTop) {
                                                if (checkTop + description.offsetHeight < documentHeight) {
                                                    futureTop = checkTop;
                                                    positionFound = true;
                                                } else {
                                                    // not found
                                                }
                                            }
                                        }
                                    }
                                }

                                // if we have enough place on the right of current target
                                if (!positionFound) {
                                    futureRight = result.offsetLeft + element.offsetWidth + description.offsetWidth;
                                    futureLeft = result.offsetLeft + element.offsetWidth;
                                    futureTop = result.offsetTop + element.offsetHeight / 2 - description.offsetHeight / 2;
                                    if (documentWidth > futureRight) {
                                        checkTop = futureTop;
                                        if (documentTop < checkTop) {
                                            if (checkTop + description.offsetHeight < documentHeight) {
                                                futureTop = checkTop;
                                                positionFound = true;
                                            } else {
                                                // not found
                                            }
                                        }

                                        if (!positionFound) {
                                            checkTop = result.offsetTop + 5;
                                            if (checkTop + description.offsetHeight < documentHeight) {
                                                if (documentTop < checkTop) {
                                                    futureTop = checkTop;
                                                    positionFound = true;
                                                } else {
                                                    // not found
                                                }
                                            }
                                        }
                                    }
                                }

                                // if we have enough place on bottom of current target
                                if (documentTop > result.offsetTop - description.offsetHeight) {
                                    if (!positionFound) {
                                        checkTop = result.offsetTop + element.offsetHeight;
                                        if (documentHeight > checkTop + description.offsetHeight) {
                                            futureTop = checkTop;
                                            if (documentWidth > result.offsetLeft + description.offsetWidth) {
                                                futureLeft = result.offsetLeft;
                                                positionFound = true;
                                            } else {
                                                if (documentWidth > description.offsetWidth) {
                                                    futureLeft = 0;
                                                    positionFound = true;
                                                } else {
                                                    // not found
                                                    futureLeft = result.offsetLeft + element.offsetWidth / 2 - description.offsetWidth / 2;
                                                }
                                            }
                                        }
                                    }
                                }

                                if (!positionFound) {
                                    futureLeft = 0;
                                    futureTop = result.offsetTop - description.offsetHeight;
                                }
                                description.style.left = futureLeft + "px";
                                description.style.top = futureTop + "px";
                                description.classList.remove("opacity-0");
                            }
                        }
                        break;
                    case 'click':
                        if (event.target !== description) {
                            _this.releaseDescription(event, description, true);
                        }
                        _this.curDescriptionElement = null;
                        break;
                    case 'touchend':
                        var target = document.elementFromPoint(event.changedTouches[0].clientX, event.changedTouches[0].clientY);
                        if (target !== description) {
                            _this.releaseDescription(event, description, true);
                        }
                        _this.curDescriptionElement = null;
                        break;
                    case 'mouseup':
                        if (_this.curDescriptionElement &&
                            _this.curDescriptionElement !== event.target &&
                            description !== event.target) {
                            _this.releaseDescription(event, description);
                        }
                        _this.curDescriptionElement = null;
                        break;
                }
            },

            releaseDescription: function(event, description, prevent) {
                var _this = this;
                if (_this.descriptionShow) {
                    if (prevent) {
                        if (event.cancelable) {
                            event.preventDefault();
                        }
                        event.stopPropagation();
                    }
                    _this.descriptionShow = false;
                    description.innerHTML = "";
                    description.style.left = "0px";
                    description.style.top = "0px";
                    description.classList.add("opacity-0");
                }

            },

            destroy: function() {
                var _this = this;
                _this.curDescriptionElement = null;
                _this.removeEventListeners();
                _this.unCashElements();
                _this.unbindContexts();
            }
        };
        extend_core.prototype.inherit(Description_manager, dom_core);
        extend_core.prototype.inherit(Description_manager, throw_event_core);

        return new Description_manager();
    });

define('text!../templates/index_template.ejs',[],function () { return '<% var mainButtonLeftPanel = _in.config.filter( function(obj){ return obj.data.role === "mainButtonLeftPanel" } ) %>\n<% var mainButtonRightPanel = _in.config.filter( function(obj){ return obj.data.role === "mainButtonRightPanel" } ) %>\n<% var registerNewUser = _in.config.filter( function(obj){ return obj.data.role === "registerNewUser" } ) %>\n<% var labelUserName = _in.config.filter( function(obj){ return obj.data.role === "labelUserName" } ) %>\n<% var labelUserPassword = _in.config.filter( function(obj){ return obj.data.role === "labelUserPassword" } ) %>\n<% var loginButton = _in.config.filter( function(obj){ return obj.data.role === "loginButton" } ) %>\n\n<section data-role="left_panel_outer_container" class="p-fx panel left-panel animate hide c-100">\n    <div class="p-rel h-100p flex-dir-col">\n        <%= _in.triple_element_template({\n            config: mainButtonLeftPanel[0],\n            button_template: _in.button_template,\n            label_template: _in.label_template\n        }) %>\n        <div data-role="left_panel_inner_container" class="min-width-350 flex-item-1-auto clear flex-dir-col h-100p">\n            <header data-role="left_panel_toolbar" class="w-100p flex-dir-col flex-item-auto c-200"></header>\n            <div data-role="left_extra_toolbar_container" class="flex-sp-around flex-item-auto c-200"></div>\n            <div data-role="left_filter_container" class="flex wrap flex-item-auto c-200"></div>\n            <div data-role="panel_body" class="overflow-a flex-item-1-auto"></div>\n            <footer class="flex-item-auto">\n                <div data-role="left_go_to_container" class="c-200"></div>\n                <div data-role="left_pagination_container" class="flex filter_container justContent c-200"></div>\n            </footer>\n        </div>\n    </div>\n</section>\n\n<section data-role="right_panel_outer_container" class="p-fx panel right-panel animate hide c-100">\n    <div class="p-rel h-100p flex-dir-col">\n        <%= _in.triple_element_template({\n            config: mainButtonRightPanel[0],\n            button_template: _in.button_template,\n            label_template: _in.label_template\n        }) %>\n        <div data-role="right_panel_inner_container" class="min-width-350 flex-item-1-auto clear flex-dir-col h-100p">\n            <header data-role="right_panel_toolbar" class="w-100p flex-dir-col c-200"></header>\n            <div data-role="right_extra_toolbar_container" class="flex-sp-around flex-item-auto c-200"></div>\n            <div data-role="right_filter_container" class="flex wrap flex-item-auto c-200"></div>\n            <div data-role="panel_body" class=" overflow-a flex-item-1-auto"></div>\n            <footer class="flex-item-auto">\n                <div data-role="right_go_to_container" class="c-200"></div>\n                <div data-role="right_pagination_container" class="flex filter_container justContent c-200"></div>\n            </footer>\n        </div>\n    </div>\n</section>\n\n<div data-role="main_container" class="w-100p h-100p p-abs"></div>\n\n<div data-role="login_outer_container" class="flex-outer-container p-fx login-outer-container hidden"></div>\n\n<div data-role="popap_outer_container" class="flex-outer-container p-fx popap hidden-popap">\n    <div data-role="popap_inner_container" class="c-50 border-radius-05em min-width-350"></div>\n</div>\n<div data-role="description" class="description opacity-0"></div>\n<div data-role="chat_resize_container" class="clear chat-resize-container">\n    <div class="line" data-role="resize_line"></div>\n</div>\n';});

define('main_layout', [
        'template_core',
        'ajax_core',
        'navigator',
        'dom_core',
        'extend_core',
        'popap_manager',
        'description_manager',
        //
        'text!../templates/index_template.ejs',
        'text!../templates/element/triple_element_template.ejs',
        'text!../templates/element/button_template.ejs',
        'text!../templates/element/label_template.ejs',
        'text!../templates/element/select_template.ejs'
    ],
    function(template_core,
             ajax_core,
             navigator,
             dom_core,
             extend_core,
             popap_manager,
             description_manager,
             //
             index_template,
             triple_element_template,
             button_template,
             label_template,
             select_template) {

        var Main_layout = function() {
        };

        Main_layout.prototype = {

            render: function() {
                var _this = this;

                _this.get_JSON_res('/configs/indexed_config.json', function(err, config) {
                    if (err) {
                        document.body.innerHTML = err;
                        return;
                    }

                    document.body.innerHTML += _this.index_template({
                        config: config,
                        triple_element_template: _this.triple_element_template,
                        button_template: _this.button_template,
                        select_template: _this.select_template,
                        label_template: _this.label_template
                    });

                    navigator.cashElements();
                    navigator.bindContexts();
                    navigator.addEventListeners();
                    navigator.navigate();
                    popap_manager.cashElements();
                    popap_manager.onHandlers();
                    description_manager.cashElements();
                    description_manager.addEventListeners();
                });
            }
        };
        extend_core.prototype.inherit(Main_layout, ajax_core);
        extend_core.prototype.inherit(Main_layout, template_core);
        extend_core.prototype.inherit(Main_layout, dom_core);
        Main_layout.prototype.index_template = Main_layout.prototype.template(index_template);
        Main_layout.prototype.triple_element_template = Main_layout.prototype.template(triple_element_template);
        Main_layout.prototype.button_template = Main_layout.prototype.template(button_template);
        Main_layout.prototype.label_template = Main_layout.prototype.template(label_template);
        Main_layout.prototype.select_template = Main_layout.prototype.template(select_template);

        return new Main_layout();

    }
);



define('localization', [
        'ajax_core',
        'extend_core'
    ],
    function(ajax_core, extend_core) {

        var localization = function() {
        };

        localization.prototype = {

            __class_name: "localization",

            getLocConfig: function(callback) {
                this.get_JSON_res('/configs/localization_config.json', function(err, res) {
                    if (err) {
                        callback(err);
                        return;
                    }
                    window.localization_config = res;
                    window.localization = "en";
                    callback();
                });
            }
        };

        window.getLocText = function(id) {
            var text;
            window.localization_config.every(function(_config) {
                if (_config.id === id) {
                    text = _config[window.localization];
                }
                return !text;
            });
            return text;
        };

        extend_core.prototype.inherit(localization, ajax_core);

        return new localization();
    }
);
require.config({
    "baseUrl": "js",
    "waitSeconds": 10,
    "paths": {
        // requireJS plugins
        "text": "lib/text",
        // models
        "html_message": "app/model/html_message",
        "html_log_message": "app/model/html_log_message",
        "connection": "app/model/connection",
        // inheritable
        "async_core": "app/extensions/async_core",
        "ajax_core": "app/extensions/ajax_core",
        "overlay_core": "app/extensions/overlay_core",
        "event_core": "app/extensions/event_core",
        "throw_event_core": "app/extensions/throw_event_core",
        "template_core": "app/extensions/template_core",
        "ping_core": "app/extensions/ping_core",
        "id_core": "app/extensions/id_core",
        "render_layout_core": "app/extensions/render_layout_core",
        "extend_core": "app/extensions/extend_core",
        "message_core": "app/extensions/message_core",
        "dom_core": "app/extensions/dom_core",
        "description_manager": "app/description_manager",
        "switcher_core": "app/extensions/switcher_core",
        "model_core": "app/extensions/model_core",
        "disable_display_core": "app/extensions/disable_display_core",
        // instantiable
        "body": "app/body",
        "chat": "app/chat",
        "chat_platform": "app/chat_platform",
        "panel_platform": "app/panel_platform",
        "panel": "app/panel",
        "header": "app/header",
        "pagination": "app/pagination",
        "messages": "app/messages",
        "editor": "app/editor",
        "settings": "app/settings",
        "contact_list": "app/contact_list",
        "indexeddb": "app/indexeddb",
        "tab": "app/tab",
        "webrtc": "app/webrtc",
        "login": "app/login",
        "register": "app/register",
        "navigator": "app/navigator",
        "websocket": "app/websocket",
        "event_bus": "app/event_bus",
        "users_bus": "app/users_bus",
        "chats_bus": "app/chats_bus",
        "localization": "app/localization",
        "main_layout": "app/main_layout",
        "extra_toolbar": "app/extra_toolbar",
        "filter": "app/filter",
        "popap_manager": "app/popap_manager"
    }
});

require(['main_layout', 'localization'
], function(main_layout, localization) {
    //OK
    localization.getLocConfig(function(err) {
        if (err) {
            document.body.innerHTML = err;
            return;
        }
        main_layout.render();
    });

});
define("app/main", function(){});
