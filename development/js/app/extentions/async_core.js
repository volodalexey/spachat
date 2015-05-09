define('async_core', ['Underscore'],
    function () {

        function only_once(root, fn) {
            var called = false;
            return function() {
                if (called) throw new Error("Callback was already called.");
                called = true;
                fn.apply(root, arguments);
            }
        }

        var core = _.extend({

            ceach: function (arr, iterator, callback) {
                var _this = this;
                callback = callback || function () {};
                if (!arr.length) {
                    return callback();
                }
                var completed = 0;
                _.each(arr, function (x) {
                    iterator(x, only_once(_this, done) );
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

            ceachSeries: function (arr, iterator, callback) {
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

        });

        return core;
    }
);