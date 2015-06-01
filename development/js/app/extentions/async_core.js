define('async_core', ['Underscore'],
    function () {

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