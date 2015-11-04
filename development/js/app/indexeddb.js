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
            callback(102);
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