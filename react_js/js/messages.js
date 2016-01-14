import indexeddb from '../js/indexeddb.js'
import id_core from '../js/id_core.js'
import extend_core from '../js/extend_core.js'
import event_bus from '../js/event_bus.js'
import switcher_core from '../js/switcher_core.js'
import html_log_message from '../js/html_log_message.js'
import html_message from '../js/html_message.js'
import users_bus from '../js/users_bus.js'

var Messages = function() {
};

Messages.prototype = {
    //render(options, _module) {
    //var _this = this;
    //_this._module = _module;
    //_this.fillListMessage(options);
  //},

  setCollectionDescription(chatId){
    let collectionDescription = {
      "db_name": users_bus.getUserId(),
      "table_descriptions": [{
        "table_name": chatId + '_messages',
        "table_indexes": [{
          "indexName": 'user_ids',
          "indexKeyPath": 'user_ids',
          "indexParameter": {multiEntry: true}
        }],
        "table_parameter": {autoIncrement: true, keyPath: "id"}
      }, {
        "table_name": chatId + '_log_messages',
        "table_parameter": {keyPath: "id"}
      }]
    };
    return collectionDescription;
  },

  getMessageConstructor(mode) {
    var Constructor;

    switch (mode) {
      case "MESSAGES":
        Constructor = html_log_message;
        break;
      case "LOGGER":
        Constructor = html_message;
        break;
    }
    return Constructor;
  },

  //fillListMessage(options) {
  //  var _this = this;
  //  if (!_this._module.body_container) {
  //    return;
  //  }
  //  var changeMode = _this._module.body.previousMode !== _this._module.bodyOptions.mode;
  //  indexeddb.getAll(
  //    _this._module.collectionDescription,
  //    _this.tableDefinition(_this._module, _this._module.bodyOptions.mode),
  //    function(getAllErr, messages) {
  //      if (getAllErr) {
  //        _this._module.body_container.innerHTML = getAllErr.message || getAllErr;
  //        return;
  //      }
  //
  //      if (messages.length === 0) {
  //        _this._module.body_container.innerHTML = "";
  //      }
  //
  //      if (_this._module.currentListOptions.final > messages.length || !_this._module.currentListOptions.final) {
  //        _this._module.currentListOptions.final = messages.length;
  //      }
  //      if (_this._module.currentListOptions.previousStart !== _this._module.currentListOptions.start ||
  //        _this._module.currentListOptions.previousFinal !== _this._module.currentListOptions.final ||
  //        changeMode) {
  //        _this.showSpinner(_this._module.body_container);
  //        _this._module.currentListOptions.previousStart = _this._module.currentListOptions.start;
  //        _this._module.currentListOptions.previousFinal = _this._module.currentListOptions.final;
  //
  //        var generatedMessages = [];
  //        var currentTemplate;
  //        switch (_this._module.bodyOptions.mode) {
  //          case _this._module.body.MODE.LOGGER:
  //            currentTemplate = _this.log_message_template;
  //            break;
  //          case _this._module.body.MODE.MESSAGES:
  //            currentTemplate = _this.message_template;
  //            break;
  //        }
  //
  //        for (var i = _this._module.currentListOptions.start; i < _this._module.currentListOptions.final; i++) {
  //          generatedMessages.push(currentTemplate({
  //            message: messages[i],
  //            ws_device_id: event_bus.get_ws_device_id(),
  //            messageConstructor: HTML_message.prototype
  //          }));
  //        }
  //        _this._module.body_container.innerHTML = generatedMessages.join('');
  //        //_this.scrollTo(options);
  //      } else {
  //        if (options.callback) {
  //          options.callback();
  //        }
  //      }
  //    }
  //  );
  //},

  /**
   * add message to the database
   */
  addMessage(mode, message, chatId, callback) {
    let Message = this.getMessageConstructor(mode);
    let _message = (new Message({innerHTML: message})).toJSON();
    //let collectionDescription = setCollectionDescription(chatId);
    indexeddb.addAll(
      this.setCollectionDescription(chatId),
      this.tableDefinition(mode),
      [
        _message
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

        //if (_this.chat.bodyOptions.mode === _this.chat.body.MODE.MESSAGES &&
        //  mode === _this.chat.body.MODE.MESSAGES) {
        //  var messageData = {
        //    type: "notifyChat",
        //    chat_type: "chat_message",
        //    message: message,
        //    chat_description: {
        //      chat_id: _this.chat.chat_id
        //    }
        //  };
        //}

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
  }

  //addRemoteMessage: function(remoteMessage, callback) {
  //  var _this = this;
  //  var message = (new HTML_message(remoteMessage.message)).toJSON();
  //
  //  indexeddb.addAll(
  //    _this.chat.collectionDescription,
  //    _this.tableDefinition(_this._module, _this.chat.body.MODE.MESSAGES),
  //    [
  //      message
  //    ],
  //    function(error) {
  //      if (error) {
  //        if (callback) {
  //          callback(error);
  //        } else {
  //          console.error(error);
  //        }
  //        return;
  //      }
  //
  //      if (_this.chat.bodyOptions.mode === _this.chat.body.MODE.MESSAGES) {
  //        _this.renderMessage({scrollTop: true}, message);
  //      }
  //    }
  //  );
  //}
};

extend_core.prototype.inherit(Messages, id_core);
extend_core.prototype.inherit(Messages, switcher_core);

export default Messages;

