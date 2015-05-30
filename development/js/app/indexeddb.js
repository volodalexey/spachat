define('indexeddb',
    ['async_core', 'event_core'],
    function (async_core, event_core) {

        var indexeddb = function() {
            this.defaultKeyPath = 'id';
            this.defaultVersion = 1;
            this.STATES = {
                READY: 1
            };
            this.state = this.STATES.READY;
            this.openDatabases =  {};
        };

        indexeddb.prototype = {

            getKeyPath: function(options) {
                return options.keyPath ? options.keyPath : this.defaultKeyPath;
            },

            getVersion: function(options) {
                return options.db_version ? options.db_version : this.defaultVersion;
            },

            open: function(options, callback) {
                var _this = this;

                if (_this.state !== _this.STATES.READY) {
                    callback(new Error('ErrorState'));
                    return;
                }

                var keyPath = _this.getKeyPath(options);
                var version = _this.getVersion(options);
                var upgraded = false;

                var onSuccess = function(event) {
                    if (!_this.openDatabases[options.id]) {
                        _this.openDatabases[options.id] = {};
                    }
                    if (event && event.target) {
                        _this.openDatabases[options.id].db = event.target.result;
                    }
                    _this.openDatabases[options.id].options = options;
                    callback(null, upgraded);
                };

                if (_this.openDatabases[options.id] &&
                    _this.openDatabases[options.id].db) {
                    onSuccess();
                    return;
                }
                var openRequest = indexedDB.open(options.db_name, version);

                openRequest.onsuccess = onSuccess;

                openRequest.onerror = function(e) {
                    callback(e.currentTarget.error);
                };

                openRequest.onupgradeneeded = function(event) {
                    upgraded = true;
                    var db = event.target.result;

                    db.onerror = function(e) {
                        callback(e.currentTarget.error);
                    };

                    if(db.objectStoreNames.contains(options.table_name)) {
                        db.deleteObjectStore(options.table_name);
                    }
                    db.createObjectStore(options.table_name, { keyPath : keyPath });
                };

                openRequest.onblocked = function () {
                    callback(new Error('BlockedState'));
                };
            },

            addOrUpdateAll: function(options, addOrUpdateData, callback) {
                var _this = this;

                if (_this.state !== _this.STATES.READY) {
                    callback(new Error('ErrorState'));
                    return;
                }

                var executeAddOrUpdateAll = function() {
                    var trans, store, keyPath = _this.getKeyPath(options);
                    try {
                        trans = _this.openDatabases[options.id].db.transaction([options.db_name], "readwrite");
                        store = trans.objectStore(options.table_name);
                    } catch (error) {
                        callback(error);
                        return;
                    }

                    _this.async_eachSeries(addOrUpdateData, function(addOrPut, _callback) {
                        var addOrUpdateCursor;
                        try {
                            addOrUpdateCursor = store.openCursor(IDBKeyRange.only(addOrPut[keyPath]));
                        } catch (error) {
                            callback(error);
                            return;
                        }
                        addOrUpdateCursor.onsuccess = function(event) {
                            if(event.target.result) {
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
                            callback(err);
                        } else {
                            callback(null);
                        }
                    });
                };

                if (_this.openDatabases[options.id]) {
                    executeAddOrUpdateAll();
                } else {
                    _this.open(options, function(err, upgraded) {
                        if (err) {
                            callback(err, upgraded);
                        } else {
                            executeAddOrUpdateAll();
                        }
                    })
                }
            },

            getAll: function(options, callback) {
                var returnData = [], _this = this;

                if (_this.state !== _this.STATES.READY) {
                    callback(new Error('ErrorState'));
                    return;
                }

                var executeGetAll = function() {
                    var trans, store, openRequest;
                    try {
                        trans = _this.openDatabases[options.id].db.transaction([options.db_name], "readonly");
                        store = trans.objectStore(options.table_name);
                        openRequest = store.openCursor();
                    } catch (error) {
                        callback(error);
                        return;
                    }

                    openRequest.onsuccess = function(e) {
                        var result = e.target.result;
                        if(!!result === false) {
                            callback(null, returnData);
                            return;
                        }
                        returnData.push(result.value);

                        result.continue();
                    };

                    openRequest.onerror = function(e) {
                        callback(e.currentTarget.error);
                    };
                };

                if (_this.openDatabases[options.id]) {
                    executeGetAll();
                } else {
                    _this.open(options, function(err, upgraded) {
                        if (err) {
                            callback(err, upgraded);
                        } else {
                            executeGetAll();
                        }
                    });
                }
            }
        };
        extend(indexeddb, async_core);
        extend(indexeddb, event_core);

        return new indexeddb();
    }
);