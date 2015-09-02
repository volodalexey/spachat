define('indexeddb', [
        'async_core',
        'throw_event_core',
        'extend_core',
        //
        'text!../configs/indexeddb/global_users.json'
    ],
    function(async_core,
             throw_event_core,
             extend_core,
             //
             global_users) {

        var indexeddb = function() {
            this.defaultVersion = 1;
            this.STATES = {
                READY: 1
            };
            this.state = this.STATES.READY;
            this.openDatabases = {};
        };

        indexeddb.prototype = {
            // database for credentials for each user
            globalUsersDatabaseDescription: JSON.parse(global_users),

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

                if (_this.canNotProceed(callback)) {
                    return;
                }

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
                        return;
                    }
                }
                var openRequest = indexedDB.open(options.db_name, version);

                openRequest.onsuccess = onSuccess;

                openRequest.onerror = function(e) {
                    e.currentTarget.error.options = options;
                    callback(e.currentTarget.error);
                };

                openRequest.onupgradeneeded = function(event) {
                    upgraded = true;
                    var db = event.target.result;

                    db.onerror = function(e) {
                        callback(e.currentTarget.error);
                    };
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
                };

                openRequest.onblocked = function(e) {
                    e.currentTarget.error.options = options;
                    callback(e);
                };
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

            getUserCredentials: function(userName, userPassword, callback) {
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

            storeNewUser: function(user_id, userName, userPassword, callback) {
                var _this = this;
                _this.getUserCredentials(userName, null, function(getAllErr, userCredentials) {
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
                        userPassword: userPassword
                    };

                    indexeddb.addOrUpdateAll(
                        _this.globalUsersDatabaseDescription,
                        null,
                        [
                            accountCredentials
                        ],
                        function(error) {
                            if (error) {
                                callback(error);
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

                            _this.userDatabaseDescription.db_name = user_id; // temp to store user
                            indexeddb.addOrUpdateAll(
                                _this.userDatabaseDescription,
                                'information',
                                [
                                    userInfo
                                ],
                                function(err) {
                                    _this.userDatabaseDescription.db_name = null; // roll back temp
                                    if (err) {
                                        callback(err);
                                        return;
                                    }
                                    callback(null, userInfo);
                                }
                            );
                        }
                    );
                });
            }
        };
        extend_core.prototype.inherit(indexeddb, async_core);
        extend_core.prototype.inherit(indexeddb, throw_event_core);

        return new indexeddb();
    }
);