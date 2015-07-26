define('indexeddb',
    ['async_core', 'throw_event_core'],
    function (async_core, throw_event_core) {

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
                    if (!_this.openDatabases[options.db_name]) {
                        _this.openDatabases[options.db_name] = {};
                    }
                    if (event && event.target) {
                        _this.openDatabases[options.db_name].db = event.target.result;
                    }
                    _this.openDatabases[options.db_name].options = options;
                    callback(null, upgraded);
                };

                if (_this.openDatabases[options.db_name] &&
                    _this.openDatabases[options.db_name].db) {
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

                    options.table_names.forEach(function(_table_name, ind){
                        if(db.objectStoreNames.contains(_table_name)) {
                            db.deleteObjectStore(_table_name);
                        }
                        if (options.table_options && options.table_options[ind]) {
                            db.createObjectStore(_table_name, options.table_options[ind]);
                        } else {
                            db.createObjectStore(_table_name, { keyPath : keyPath });
                        }
                    });
                };

                openRequest.onblocked = function () {
                    callback(new Error('BlockedState'));
                };
            },

            addOrUpdateAll: function(options, tables, addOrUpdateData, callback) {
                var _this = this, table_name;

                if (_this.state !== _this.STATES.READY) {
                    callback(new Error('ErrorState'));
                    return;
                }

                if (!tables) {
                    table_name = options.table_names[0];
                }

                var executeAddOrUpdateAll = function() {
                    var trans, store, keyPath = _this.getKeyPath(options);
                    try {
                        trans = _this.openDatabases[options.db_name].db.transaction([table_name], "readwrite");
                        store = trans.objectStore(table_name);
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

                if (_this.openDatabases[options.db_name]) {
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

            getAll: function(options, tables, callback) {
                var returnData = [], _this = this, table_name;

                if (_this.state !== _this.STATES.READY) {
                    callback(new Error('ErrorState'));
                    return;
                }
                if (!tables) {
                    table_name = options.table_names[0];
                }

                var executeGetAll = function() {
                    var trans, store, openRequest;
                    try {
                        trans = _this.openDatabases[options.db_name].db.transaction([table_name], "readonly");
                        store = trans.objectStore(table_name);
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

                if (_this.openDatabases[options.db_name]) {
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
            },

            /**
             * open indexedDB table and search through for requested key path
             */
            getByKeyPath: function(options, getValue, callback) {
                var _this = this, table_name;

                if (_this.state !== _this.STATES.READY) {
                    callback(new Error('ErrorState'));
                    return;
                }

                //if (!tables) {
                    table_name = options.table_names[0];
                //}

                var executeGet = function() {
                    var trans, store, result;
                    try {
                        trans = _this.openDatabases[options.db_name].db.transaction([table_name], "readonly");
                        store = trans.objectStore(table_name);
                    } catch (error) {
                        callback(error);
                        return;
                    }

                    var getCursor;
                    try {
                        getCursor = store.openCursor(IDBKeyRange.only(getValue));
                    } catch (error) {
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
                        callback(e.currentTarget.error);
                    };
                };

                if (_this.openDatabases[options.db_name]) {
                    executeGet();
                } else {
                    _this.open(options, function(err, upgraded) {
                        if (err) {
                            callback(err, upgraded);
                        } else {
                            executeGet();
                        }
                    })
                }
            },

            addAll: function(options, tables, toAdd, callback) {
                var _this = this, table_name;

                if (_this.state !== _this.STATES.READY) {
                    callback(new Error('ErrorState'));
                    return;
                }

                if (!tables) {
                    table_name = options.table_names[0];
                }

                if (_this.openDatabases[options.db_name]) {
                    _this._executeAddAll(options, table_name, toAdd, callback);
                } else {
                    _this.open(options, function(err, upgraded) {
                        if (err) {
                            callback(err, upgraded);
                        } else {
                            _this._executeAddAll(options, table_name, toAdd, callback);
                        }
                    })
                }
            },

            _executeAddAll: function(options, table_name, toAdd, callback) {
                var _this = this, trans, store, keyPath = _this.getKeyPath(options);
                try {
                    trans = _this.openDatabases[options.db_name].db.transaction([table_name], "readwrite");
                    store = trans.objectStore(table_name);
                } catch (error) {
                    callback(error);
                    return;
                }

                _this.async_eachSeries(toAdd, function(curAdd, _callback) {
                    var putRequest = store.put(curAdd);
                    putRequest.onerror = function(e) {
                        _callback(e.currentTarget.error);
                    };
                    putRequest.onsuccess = function() {
                        _callback();
                    };
                }, function(err) {
                    if (err) {
                        callback(err);
                    } else {
                        callback(null);
                    }
                });
            }
        };
        extend(indexeddb, async_core);
        extend(indexeddb, throw_event_core);

        return new indexeddb();
    }
);