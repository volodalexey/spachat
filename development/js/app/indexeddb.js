define('indexeddb',
    ['async_core', 'throw_event_core', 'extend_core'],
    function (async_core, throw_event_core, extend_core) {

        var indexeddb = function() {
            this.defaultVersion = 1;
            this.STATES = {
                READY: 1
            };
            this.state = this.STATES.READY;
            this.openDatabases =  {};
        };

        indexeddb.prototype = {

            isTableInTables: function(db_name, table_name) {
                var has = false;
                if (this.openDatabases[db_name] && this.openDatabases[db_name].db) {
                    has = this.openDatabases[db_name].db.objectStoreNames.contains(table_name);
                }
                return has;
            },

            getVersion: function(options) {
                return options.db_version ? options.db_version : this.defaultVersion;
            },

            open: function(options, force, callback) {
                var _this = this;

                if (_this.canNotProceed(callback)) { return; }

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
                    if (force) {
                        version = ++_this.openDatabases[options.db_name].db.version;
                        _this.openDatabases[options.db_name].db.close();
                        _this.openDatabases[options.db_name] = null;
                        // store new version in credentials
                    } else {
                        onSuccess();
                    }
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
                    // only for provided tables !
                    options.table_descriptions.forEach(function(table_description){
                        if(db.objectStoreNames.contains(table_description.table_name)) {
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
                };

                openRequest.onblocked = function () {
                    callback(new Error('BlockedState'));
                };
            },

            addOrUpdateAll: function(options, table_name, addOrUpdateData, callback) {
                var _this = this, cur_table_description;

                if (_this.canNotProceed(callback)) { return; }

                cur_table_description = _this.getCurrentTableDescription(options, table_name);

                var executeAddOrUpdateAll = function() {
                    var trans, store;
                    try {
                        trans = _this.openDatabases[options.db_name].db.transaction([cur_table_description.table_name], "readwrite");
                        store = trans.objectStore(cur_table_description.table_name);
                    } catch (error) {
                        callback(error);
                        return;
                    }

                    _this.async_eachSeries(addOrUpdateData, function(addOrPut, _callback) {
                        var addOrUpdateCursor;
                        try {
                            addOrUpdateCursor = store.openCursor(IDBKeyRange.only(addOrPut[cur_table_description.table_parameter.keyPath]));
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

                if (_this.openDatabases[options.db_name] && _this.isTableInTables(options.db_name, cur_table_description.table_name)) {
                    executeAddOrUpdateAll();
                } else {
                    _this.open(
                        options,
                        !_this.isTableInTables(options.db_name, cur_table_description.table_name),
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

                if (_this.canNotProceed(callback)) { return; }

                cur_table_description = _this.getCurrentTableDescription(options, table_name);

                if (_this.openDatabases[options.db_name] && _this.isTableInTables(options.db_name, cur_table_description.table_name)) {
                    _this._executeGetAll(options, cur_table_description.table_name, callback);
                } else {
                    _this.open(
                        options,
                        !_this.isTableInTables(options.db_name, cur_table_description.table_name),
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
            getByKeyPath: function(options, table_name, getValue, callback) {
                var _this = this, cur_table_description;

                if (_this.canNotProceed(callback)) { return; }

                cur_table_description = _this.getCurrentTableDescription(options, table_name);

                var executeGet = function() {
                    var trans, store, result;
                    try {
                        trans = _this.openDatabases[options.db_name].db.transaction([cur_table_description.table_name], "readonly");
                        store = trans.objectStore(cur_table_description.table_name);
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

                if (_this.openDatabases[options.db_name] && _this.isTableInTables(options.db_name, cur_table_description.table_name)) {
                    executeGet();
                } else {
                    _this.open(
                        options,
                        !_this.isTableInTables(options.db_name, cur_table_description.table_name),
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

                if (_this.canNotProceed(callback)) { return; }

                cur_table_description = _this.getCurrentTableDescription(options, table_name);

                var executeGet = function() {
                    var trans, store, result;
                    try {
                        trans = _this.openDatabases[options.db_name].db.transaction([cur_table_description.table_name], "readonly");
                        store = trans.objectStore(cur_table_description.table_name);
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
                };

                if (_this.openDatabases[options.db_name] && _this.isTableInTables(options.db_name, cur_table_description.table_name)) {
                    executeGet();
                } else {
                    _this.open(
                        options,
                        !_this.isTableInTables(options.db_name, cur_table_description.table_name),
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

                if (_this.canNotProceed(callback)) { return; }

                cur_table_description = _this.getCurrentTableDescription(options, table_name);

                if (_this.openDatabases[options.db_name] && _this.isTableInTables(options.db_name, cur_table_description.table_name)) {
                    _this._executeAddAll(options, cur_table_description.table_name, toAdd, callback);
                } else {
                    _this.open(
                        options,
                        !_this.isTableInTables(options.db_name, cur_table_description.table_name),
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
            }
        };
        extend_core.prototype.inherit(indexeddb, async_core);
        extend_core.prototype.inherit(indexeddb, throw_event_core);

        return new indexeddb();
    }
);