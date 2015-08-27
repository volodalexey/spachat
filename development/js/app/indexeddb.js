define('indexeddb',
    ['async_core', 'throw_event_core', 'extend_core'],
    function (async_core, throw_event_core, extend_core) {

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

                if (_this.canNotProceed(callback)) { return; }

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
                        var objectStore;
                        if (options.table_options && options.table_options[ind]) {
                            objectStore = db.createObjectStore(_table_name, options.table_options[ind]);
                        } else {
                            objectStore = db.createObjectStore(_table_name, { keyPath : keyPath });
                        }
                        if(objectStore && options.table_indexes && options.table_indexes[ind]) {
                            var indexDescription = options.table_indexes[ind];
                            objectStore.createIndex(indexDescription[0], indexDescription[1], indexDescription[2]);
                        }
                    });
                };

                openRequest.onblocked = function () {
                    callback(new Error('BlockedState'));
                };
            },

            addOrUpdateAll: function(options, tables, addOrUpdateData, callback) {
                var _this = this, table_name;

                if (_this.canNotProceed(callback)) { return; }

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

            getAll: function(options, table_name, callback) {
                var _this = this, cur_table_name;

                if (_this.canNotProceed(callback)) { return; }

                cur_table_name = _this.defineCurrentTable(options, table_name);

                if (_this.openDatabases[options.db_name]) {
                    _this._executeGetAll(options, cur_table_name, callback);
                } else {
                    _this.open(options, function(err, upgraded) {
                        if (err) {
                            callback(err, upgraded);
                        } else {
                            _this._executeGetAll(options, cur_table_name, callback);
                        }
                    });
                }
            },

            _executeGetAll: function(options, table_name, callback) {
                var _this = this, trans, store, openRequest, returnData = [];
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
            },

            /**
             * open indexedDB table and search through for requested key path
             */
            getByKeyPath: function(options, getValue, callback) {
                var _this = this, cur_table_name;

                if (_this.canNotProceed(callback)) { return; }

                cur_table_name = _this.defineCurrentTable(options);

                var executeGet = function() {
                    var trans, store, result;
                    try {
                        trans = _this.openDatabases[options.db_name].db.transaction([cur_table_name], "readonly");
                        store = trans.objectStore(cur_table_name);
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

            getByKeysPath: function(options, getValues, nullWrapper, callback) {
                var _this = this, cur_table_name;

                if (_this.canNotProceed(callback)) { return; }

                cur_table_name = _this.defineCurrentTable(options);

                var executeGet = function() {
                    var trans, store, result;
                    try {
                        trans = _this.openDatabases[options.db_name].db.transaction([cur_table_name], "readonly");
                        store = trans.objectStore(cur_table_name);
                    } catch (error) {
                        callback(error);
                        return;
                    }

                    var getCursor;
                    var _array = [];
                    trans.oncomplete = function() {
                        callback(null, _array);
                    };
                    getValues.forEach(function(getValue){
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
                            callback(e.currentTarget.error);
                        };
                    });
                    //_this.async_eachSeries(getValues, function(getValue, _callback) {
                    //    try {
                    //        getCursor = store.openCursor(IDBKeyRange.only(getValue));
                    //    } catch (error) {
                    //        _callback(error);
                    //        return;
                    //    }
                    //    getCursor.onsuccess = function(event) {
                    //        var cursor = event.target.result;
                    //        if (!cursor) {
                    //            if (nullWrapper) {
                    //                //_array.push(nullWrapper(getValue));
                    //                _callback(null, nullWrapper(getValue));
                    //            } else {
                    //                _callback(null);
                    //            }
                    //        } else {
                    //            _callback(null, cursor.value);
                    //        }
                    //    };
                    //    getCursor.onerror = function(e) {
                    //        _callback(e.currentTarget.error);
                    //    };
                    //}, function(err, values) {
                    //    if (err) {
                    //        callback(err);
                    //    } else {
                    //        callback(null, values);
                    //    }
                    //});
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

            addAll: function(options, table_name, toAdd, callback) {
                var _this = this, cur_table_name;

                if (_this.canNotProceed(callback)) { return; }

                cur_table_name = _this.defineCurrentTable(options, table_name);

                if (_this.openDatabases[options.db_name]) {
                    _this._executeAddAll(options, cur_table_name, toAdd, callback);
                } else {
                    _this.open(options, function(err, upgraded) {
                        if (err) {
                            callback(err, upgraded);
                        } else {
                            _this._executeAddAll(options, cur_table_name, toAdd, callback);
                        }
                    })
                }
            },

            _executeAddAll: function(options, table_name, toAdd, callback) {
                var _this = this, trans, store, keyPath = _this.getKeyPath(options);
                if (_this.canNotProceed(callback)) { return; }

                try {
                    trans = _this.openDatabases[options.db_name].db.transaction([table_name], "readwrite");
                    store = trans.objectStore(table_name);
                } catch (error) {
                    callback(error);
                    return;
                }

                _this.async_eachSeries(toAdd, function(curAdd, _callback) {
                    if (_this.canNotProceed(callback)) { return; }
                    var putRequest = store.put(curAdd);
                    putRequest.onerror = function(e) {
                        _callback(e.currentTarget.error);
                    };
                    putRequest.onsuccess = function() {
                        if (_this.canNotProceed(callback)) { return; }
                        _callback();
                    };
                }, function(err) {
                    if (err) {
                        callback(err);
                    } else {
                        if (_this.canNotProceed(callback)) { return; }
                        callback(null);
                    }
                });
            },

            defineCurrentTable: function(options, table_name) {
                if (table_name) {
                    return table_name;
                }
                return options.table_names[0];
            },

            canNotProceed: function(callback) {
                var _this = this;
                if (_this.state !== _this.STATES.READY) {
                    callback(new Error('ErrorState'));
                    return true;
                }
                return false;
            }
        };
        extend_core.prototype.inherit(indexeddb, async_core);
        extend_core.prototype.inherit(indexeddb, throw_event_core);

        return new indexeddb();
    }
);