var globalUsersDatabaseDescription = require('json!../configs/indexeddb/global_users.json');

import AsyncCore from '../js/async_core.js'
import EventBus from '../js/event_bus.js'

class indexeddb extends AsyncCore {

  constructor() {
    super();
    this.defaultVersion = 1;
    this.STATES = {
      READY: 1
    };
    this.stateInfo = this.STATES.READY;
    this.openDatabases = {};
    this.addEventListeners();
  }

  onSetUserId(user_id) {
    this.user_id = user_id;
  }

  addEventListeners() {
    var self = this;
    self.removeEventListeners();
    EventBus.on('setUserId', self.onSetUserId, self);
  }

  removeEventListeners() {
    var self = this;
    EventBus.off('setUserId', self.onSetUserId);
  }

  isTableInTables(db_name, table_name) {
    var has = false;
    if (this.openDatabases[db_name] && this.openDatabases[db_name].db) {
      has = this.openDatabases[db_name].db.objectStoreNames.contains(table_name);
    }
    return has;
  }

  onOpenSuccess(options, callback, event) {
    if (!this.openDatabases[options.db_name]) {
      this.openDatabases[options.db_name] = {};
    }
    if (event && event.target) {
      this.openDatabases[options.db_name].db = event.target.result;
    }
    this.openDatabases[options.db_name].options = options;
    callback(null);
  }

  onOpenError(options, callback, event) {
    event.currentTarget.error.options = options;
    callback(event.currentTarget.error);
  }

  onOpenUpgrade(options, callback, event) {
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
  }

  onOpenBlocked(options, callback, event) {
    event.currentTarget.error.options = options;
    callback(event.currentTarget.error);
  }

  _proceedOpen(options, version, callback) {
    var self = this;
    var openRequest = indexedDB.open(options.db_name, version);
    openRequest.onsuccess = self.onOpenSuccess.bind(self, options, callback);
    openRequest.onerror = self.onOpenError.bind(self, options, callback);
    openRequest.onupgradeneeded = self.onOpenUpgrade.bind(self, options, callback);
    openRequest.onblocked = self.onOpenBlocked.bind(self, options, callback);
  }

  open(options, force, callback) {
    var self = this;

    if (self.canNotProceed(callback)) {
      return;
    }

    if (options.db_name !== globalUsersDatabaseDescription.db_name) {
      self.getGlobalUser(self.user_id, function(err, globalUserInfo) {
        if (err) {
          callback(err);
          return;
        }
        var version = globalUserInfo.db_versions[options.db_name] ?
          globalUserInfo.db_versions[options.db_name] : self.defaultVersion;

        if (self.openDatabases[options.db_name] &&
          self.openDatabases[options.db_name].db) {
          if (force) {
            version = self.openDatabases[options.db_name].db.version + 1;
            self.openDatabases[options.db_name].db.close();
            self.openDatabases[options.db_name] = null;
            // store new version in user credentials
            self.putGlobalUserDBVersion(
              self.user_id,
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
            self.onOpenSuccess(options, callback);
            return;
          }
        }
        self._proceedOpen(options, version, callback);
      });
    } else {
      self._proceedOpen(options, self.defaultVersion, callback);
    }
  }

  addOrUpdateAll(options, table_name, addOrUpdateData, callback) {
    var self = this, cur_table_description;

    if (self.canNotProceed(callback)) {
      return;
    }

    cur_table_description = self.getCurrentTableDescription(options, table_name);

    var executeAddOrUpdateAll = function() {
      var trans, store;
      try {
        trans = self.openDatabases[options.db_name].db.transaction([cur_table_description.table_name], "readwrite");
        store = trans.objectStore(cur_table_description.table_name);
      } catch (error) {
        error.options = options;
        error.cur_table_description = cur_table_description;
        callback(error);
        return;
      }

      self.async_eachSeries(addOrUpdateData, function(addOrPut, _callback) {
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
    }

    var _isTableInTables = self.isTableInTables(options.db_name, cur_table_description.table_name);
    if (self.openDatabases[options.db_name] && _isTableInTables) {
      executeAddOrUpdateAll();
    } else {
      self.open(
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
  }

  getAll(options, table_name, callback) {
    var self = this, cur_table_description;

    if (self.canNotProceed(callback)) {
      return;
    }

    cur_table_description = self.getCurrentTableDescription(options, table_name);

    var _isTableInTables = self.isTableInTables(options.db_name, cur_table_description.table_name);
    if (self.openDatabases[options.db_name] && _isTableInTables) {
      self._executeGetAll(options, cur_table_description.table_name, callback);
    } else {
      self.open(
        options,
        !_isTableInTables,
        function(err, upgraded) {
          if (err) {
            callback(err, upgraded);
          } else {
            self._executeGetAll(options, cur_table_description.table_name, callback);
          }
        }
      );
    }
  }

  _executeGetAll(options, table_name, callback) {
    var self = this, trans, store, openRequest, returnData = [];
    try {
      trans = self.openDatabases[options.db_name].db.transaction([table_name], "readonly");
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
  }

  /**
   * open indexedDB table and search through for requested key path
   */
  getByKeyPath(options, table_name, getValue, callback) {
    var self = this, cur_table_description;

    if (self.canNotProceed(callback)) {
      return;
    }

    cur_table_description = self.getCurrentTableDescription(options, table_name);

    var executeGet = function() {
      var trans, store, result;
      try {
        trans = self.openDatabases[options.db_name].db.transaction([cur_table_description.table_name], "readonly");
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
    }

    var _isTableInTables = self.isTableInTables(options.db_name, cur_table_description.table_name);
    if (self.openDatabases[options.db_name] && _isTableInTables) {
      executeGet();
    } else {
      self.open(
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
  }

  getByKeysPath(options, table_name, getValues, nullWrapper, callback) {
    var self = this, cur_table_description;

    if (self.canNotProceed(callback)) {
      return;
    }

    cur_table_description = self.getCurrentTableDescription(options, table_name);

    var executeGet = function() {
      var trans, store;
      try {
        trans = self.openDatabases[options.db_name].db.transaction([cur_table_description.table_name], "readonly");
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
    }

    var _isTableInTables = self.isTableInTables(options.db_name, cur_table_description.table_name);
    if (self.openDatabases[options.db_name] && _isTableInTables) {
      executeGet();
    } else {
      self.open(
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
  }

  addAll(options, table_name, toAdd, callback) {
    var self = this, cur_table_description;

    if (self.canNotProceed(callback)) {
      return;
    }

    cur_table_description = self.getCurrentTableDescription(options, table_name);

    var _isTableInTables = self.isTableInTables(options.db_name, cur_table_description.table_name);
    if (self.openDatabases[options.db_name] && _isTableInTables) {
      self._executeAddAll(options, cur_table_description.table_name, toAdd, callback);
    } else {
      self.open(
        options,
        !_isTableInTables,
        function(err, upgraded) {
          if (err) {
            callback(err, upgraded);
          } else {
            self._executeAddAll(options, cur_table_description.table_name, toAdd, callback);
          }
        }
      );
    }
  }

  _executeAddAll(options, table_name, toAdd, callback) {
    var self = this, trans, store;
    if (self.canNotProceed(callback)) {
      return;
    }

    try {
      trans = self.openDatabases[options.db_name].db.transaction([table_name], "readwrite");
      store = trans.objectStore(table_name);
    } catch (error) {
      error.options = options;
      error.table_name = table_name;
      callback(error);
      return;
    }

    self.async_eachSeries(toAdd, function(curAdd, _callback) {
      if (self.canNotProceed(callback)) {
        return;
      }
      var putRequest = store.put(curAdd);
      putRequest.onerror = function(e) {
        _callback(e.currentTarget.error);
      };
      putRequest.onsuccess = function() {
        if (self.canNotProceed(callback)) {
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
        if (self.canNotProceed(callback)) {
          return;
        }
        callback(null);
      }
    });
  }

  getCurrentTableDescription(options, table_name) {
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
  }

  canNotProceed(callback) {
    var self = this;
    if (self.stateInfo !== self.STATES.READY) {
      callback(new Error('ErrorState'));
      return true;
    }
    return false;
  }

  getGlobalUserCredentials(userName, userPassword, callback) {
    var self = this;
    self.getAll(globalUsersDatabaseDescription, null, function(getAllErr, allUsers) {
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
  }

  addGlobalUser(user_id, userName, userPassword, callback) {
    var self = this;
    self.getGlobalUserCredentials(userName, null, function(getAllErr, userCredentials) {
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

      self.saveGlobalUser(accountCredentials, callback);
    });
  }

  putGlobalUserDBVersion(user_id, db_name, db_version, callback) {
    var self = this;
    self.getGlobalUser(user_id, function(err, globalUserInfo) {
      if (err) {
        callback(err);
        return;
      }

      globalUserInfo.db_versions[db_name] = db_version;
      self.saveGlobalUser(globalUserInfo, callback);
    });
  }

  getGlobalUser(user_id, callback) {
    var self = this;
    self.getByKeyPath(
      globalUsersDatabaseDescription,
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
  }

  saveGlobalUser(globalUserInfo, callback) {
    var self = this;
    self.addOrUpdateAll(
      globalUsersDatabaseDescription,
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
  };
}

export default new indexeddb();
