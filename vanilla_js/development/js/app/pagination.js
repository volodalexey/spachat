define('pagination', [
    'throw_event_core',
    'ajax_core',
    'template_core',
    'render_layout_core',
    'indexeddb',
    "switcher_core",
    'overlay_core',
    'extend_core',
    'users_bus',
    'chats_bus',
    //
    'text!../templates/pagination_template.ejs',
    'text!../templates/choice_per_page_template.ejs',
    'text!../templates/element/triple_element_template.ejs',
    'text!../templates/element/location_wrapper_template.ejs',
    'text!../templates/element/button_template.ejs',
    'text!../templates/element/label_template.ejs',
    'text!../templates/element/input_template.ejs',
    //
    'text!../configs/pagination_navbar_config.json',
    'text!../configs/choice_per_page_config.json'
  ],
  function(throw_event_core,
           ajax_core,
           template_core,
           render_layout_core,
           indexeddb,
           switcher_core,
           overlay_core,
           extend_core,
           users_bus,
           chats_bus,
           //
           pagination_template,
           choice_per_page_template,
           triple_element_template,
           location_wrapper_template,
           button_template,
           label_template,
           input_template,
           //
           pagination_navbar_config,
           choice_per_page_config) {

    var pagination = function() {
      this.bindMainContexts();
    };

    pagination.prototype = {

      pagination_navbar_config: JSON.parse(pagination_navbar_config),
      choice_per_page_config: JSON.parse(choice_per_page_config),

      MODE: {
        "PAGINATION": 'PAGINATION',
        "GO_TO": 'GO_TO'
      },

      bindMainContexts: function() {
        var _this = this;
        _this.bindedThrowEventRouter = _this.throwEventRouter.bind(_this);
        _this.bindedDataActionRouter = _this.dataActionRouter.bind(_this);
      },

      //override extended throwEvent to use trigger on chat
      throwEvent: function(name, data) {
        this.module && this.module.trigger('throw', name, data);
      },

      cashMainElements: function() {
        var _this = this;
        _this.buttons_show_choice = Array.prototype.slice.call(_this.module.pagination_container.querySelectorAll('[data-role="choice"]'));
      },

      addMainEventListener: function() {
        var _this = this;
        _this.removeMainEventListeners();
        _this.addRemoveListener('add', _this.module.pagination_container, 'click', _this.bindedThrowEventRouter, false);
        _this.addRemoveListener('add', _this.module.pagination_container, 'click', _this.bindedDataActionRouter, false);
      },

      removeMainEventListeners: function() {
        var _this = this;
        _this.addRemoveListener('remove', _this.module.pagination_container, 'click', _this.bindedThrowEventRouter, false);
        _this.addRemoveListener('remove', _this.module.pagination_container, 'click', _this.bindedDataActionRouter, false);
      },

      addContextEventListener: function() {
        var _this = this;
        _this.removeContextEventListeners();
        _this.addRemoveListener('add', _this.module.go_to_container, 'input', _this.bindedDataActionRouter, false);
        _this.addRemoveListener('add', _this.module.go_to_container, 'click', _this.bindedDataActionRouter, false);
      },

      removeContextEventListeners: function() {
        var _this = this;
        _this.addRemoveListener('remove', _this.module.go_to_container, 'input', _this.bindedDataActionRouter, false);
        _this.addRemoveListener('remove', _this.module.go_to_container, 'click', _this.bindedDataActionRouter, false);
      },

      unCashElements: function() {
        var _this = this;
        _this.buttons_show_choice = null;
      },

      render: function(options, _module, mode) {
        var _this = this;
        _this.module = _module;
        _this.bodyOptionsMode = mode;
        if (_this.module.MODE && _this.module.bodyOptions.mode === _this.module.MODE.DETAIL_VIEW) {
          _this.bodyOptionsMode = _this.module.MODE.CHATS;
        }
        _this.optionsDefinition(_this.module, _this.bodyOptionsMode);
        if (_this.module.currentPaginationOptions.show) {
          if (!_this.previousShow_Pagination || _this.previous_Pagination_mode !== _this.bodyOptionsMode) {
            _this.showHorizontalSpinner(_this.module.pagination_container);
            _this.previousShow_Pagination = true;
            _this.previous_Pagination_mode = _this.bodyOptionsMode;
            _this.countQuantityPages(function() {
              _this.disableButtonsPagination();
              _this.body_mode = _this.MODE.PAGINATION;
              _this.elementMap = {
                PAGINATION: _this.module.pagination_container
              };
              var data = {
                firstPage: _this.module.currentPaginationOptions.firstPage,
                currentPage: _this.module.currentPaginationOptions.currentPage,
                lastPage: _this.module.currentPaginationOptions.lastPage,
                disableBack: _this.module.currentPaginationOptions.disableBack,
                disableFirst: _this.module.currentPaginationOptions.disableFirst,
                disableLast: _this.module.currentPaginationOptions.disableLast,
                disableForward: _this.module.currentPaginationOptions.disableForward
              };
              _this.renderLayout(data, function() {
                _this.addMainEventListener();
                _this.cashMainElements();
                _this.renderGoTo();
                if (_this.buttons_show_choice && _this.module.currentGoToOptions.show) {
                  _this.buttons_show_choice.forEach(function(btn) {
                    btn.dataset.toggle = false;
                  });
                }
              });
            });
          } else {
            _this.renderGoTo();
          }

        } else {
          _this.module.pagination_container.innerHTML = "";
          _this.module.go_to_container.innerHTML = "";
          if (_this.buttons_show_choice) {
            _this.buttons_show_choice.forEach(function(btn) {
              btn.dataset.toggle = true;
            });
          }
          _this.previousShow = false;
          _this.previousShow_Pagination = false;
        }
      },

      renderGoTo: function() {
        var _this = this;
        if (_this.module.currentGoToOptions.show) {
          if (!_this.previousShow || _this.previous_GoTo_mode !== _this.bodyOptionsMode) {
            _this.showHorizontalSpinner(_this.module.go_to_container);
            _this.previousShow = true;
            _this.previous_GoTo_mode = _this.bodyOptionsMode;
            _this.buttons_show_choice.forEach(function(btn) {
              btn.dataset.toggle = false;
            });
            _this.elementMap = {
              GO_TO: _this.module.go_to_container
            };
            var data = {
              mode_change: _this.module.currentGoToOptions.mode_change,
              rteChoicePage: _this.module.currentGoToOptions.rteChoicePage,
              page: _this.module.currentGoToOptions.page
            };
            _this.body_mode = _this.MODE.GO_TO;
            _this.renderLayout(data, function() {
              _this.addContextEventListener();
            });
          }
        } else {
          _this.previousShow = false;
          _this.module.go_to_container.innerHTML = "";
          if (_this.buttons_show_choice) {
            _this.buttons_show_choice.forEach(function(btn) {
              btn.dataset.toggle = true;
            });
          }
        }
      },

      countQuantityPages: function(callback) {
        var _this = this;
        _this.optionsDefinition(_this.module, _this.bodyOptionsMode);
        if (_this.module.currentListOptions.data_download) {
          indexeddb.getAll(_this.module.collectionDescription,
            _this.tableDefinition(_this.module, _this.module.bodyOptions.mode),
            function(getAllErr, messages) {
              if (getAllErr) {
                console.error(getAllErr);
                return;
              }
              _this.handleCountPagination(messages, callback);
            });
        } else {
          switch (_this.module.bodyOptions.mode) {
            case _this.module.body.MODE.CONTACT_LIST:
              chats_bus.getChatContacts(_this.module.chat_id, function(error, contactsInfo) {
                if (error) {
                  console.error(error);
                  return;
                }
                _this.handleCountPagination(contactsInfo, callback);
              });
              break;
            case _this.module.body.MODE.CHATS:
              users_bus.getMyInfo(null, function(error, options, userInfo) {
                chats_bus.getChats(error, options, userInfo.chat_ids, function(error, options, chatsInfo) {
                  if (error) {
                    _this.module.body_container.innerHTML = error;
                    return;
                  }
                  _this.handleCountPagination(chatsInfo, callback);
                });
              });
              break;
            case _this.module.body.MODE.USERS:
              users_bus.getMyInfo(null, function(error, options, userInfo) {
                users_bus.getContactsInfo(error, userInfo.user_ids, function(_error, contactsInfo) {
                  if (_error) {
                    _this.module.body_container.innerHTML = _error;
                    return;
                  }
                  _this.handleCountPagination(contactsInfo, callback);
                });
              });
              break;
          }
        }
      },

      handleCountPagination: function(data, callback) {
        var _this = this, quantityPages, quantityData;
        if (data) {
          quantityData = data.length;
        } else {
          quantityData = 0;
        }
        if (quantityData !== 0) {
          quantityPages = Math.ceil(quantityData / _this.module.currentPaginationOptions.perPageValue);
        } else {
          quantityPages = 1;
        }
        if (_this.module.currentPaginationOptions.currentPage === null) {
          _this.module.currentListOptions.start = quantityPages * _this.module.currentPaginationOptions.perPageValue - _this.module.currentPaginationOptions.perPageValue;
          _this.module.currentListOptions.final = quantityPages * _this.module.currentPaginationOptions.perPageValue;
          _this.module.currentPaginationOptions.currentPage = quantityPages;
        } else {
          _this.module.currentListOptions.start = (_this.module.currentPaginationOptions.currentPage - 1) * _this.module.currentPaginationOptions.perPageValue;
          _this.module.currentListOptions.final = (_this.module.currentPaginationOptions.currentPage - 1) * _this.module.currentPaginationOptions.perPageValue + _this.module.currentPaginationOptions.perPageValue;
        }
        _this.module.currentPaginationOptions.lastPage = quantityPages;
        if (callback) {
          callback();
        }
      },

      changePage: function(element) {
        var _this = this, value = parseInt(element.value);
        if (element.value === "" || element.value === "0") {
          _this.module.currentGoToOptions.page = null;
          return;
        }

        if (!_this.module.currentGoToOptions.rteChoicePage) {
          _this.module.currentPaginationOptions.currentPage = value;
          _this.module.currentGoToOptions.page = value;
          return;
        }
        _this.previousShow_Pagination = false;
        _this.module.currentPaginationOptions.currentPage = value;
        _this.module.currentGoToOptions.page = value;
        _this.module.render(null, null);
      },

      switchPage: function(element) {
        var _this = this;

        if (_this.module.MODE && _this.module.bodyOptions.mode === _this.module.MODE.DETAIL_VIEW) {
          _this.module.bodyOptions.mode = _this.module.MODE.CHATS;
        }
        if (element.dataset.role === "first" || element.dataset.role === "last") {
          _this.module.currentPaginationOptions.currentPage = parseInt(element.dataset.value);
        }
        if (element.dataset.role === "back") {
          _this.module.currentPaginationOptions.currentPage = parseInt(_this.module.currentPaginationOptions.currentPage) - 1;
        }
        if (element.dataset.role === "forward") {
          _this.module.currentPaginationOptions.currentPage = parseInt(_this.module.currentPaginationOptions.currentPage) + 1;
        }

        if (!_this.module.currentGoToOptions.rteChoicePage && element.dataset.role === "go_to_page") {
          _this.previousShow = false;
        }
        _this.previousShow_Pagination = false;
        _this.module.render(null, null);
      },

      disableButtonsPagination: function() {
        var _this = this;
        if (_this.module.currentPaginationOptions.currentPage === _this.module.currentPaginationOptions.firstPage) {
          _this.module.currentPaginationOptions.disableBack = true;
          _this.module.currentPaginationOptions.disableFirst = true;
        } else {
          _this.module.currentPaginationOptions.disableBack = false;
          _this.module.currentPaginationOptions.disableFirst = false;
        }
        if (_this.module.currentPaginationOptions.currentPage === _this.module.currentPaginationOptions.lastPage) {
          _this.module.currentPaginationOptions.disableForward = true;
          _this.module.currentPaginationOptions.disableLast = true;
        } else {
          _this.module.currentPaginationOptions.disableForward = false;
          _this.module.currentPaginationOptions.disableLast = false;
        }
      },

      changeRTE: function(element) {
        var _this = this;

        if (_this.module.MODE && _this.module.bodyOptions.mode === _this.module.MODE.DETAIL_VIEW) {
          _this.module.bodyOptions.mode = _this.module.MODE.CHATS;
        }
        _this.optionsDefinition(_this.module, _this.module.bodyOptions.mode);
        _this.module.previous_Filter_Options = false;

        if (element.checked) {
          _this.module.currentGoToOptions.mode_change = "rte";
          _this.module.currentGoToOptions.rteChoicePage = true;
        } else {
          _this.module.currentGoToOptions.mode_change = "nrte";
          _this.module.currentGoToOptions.rteChoicePage = false;
        }
        _this.previousShow = false;
        _this.module.render(null, null);
      },

      destroy: function() {
        var _this = this;
        _this.removeMainEventListeners();
        _this.removeContextEventListeners();
        _this.unCashElements();
      }
    };
    extend_core.prototype.inherit(pagination, throw_event_core);
    extend_core.prototype.inherit(pagination, ajax_core);
    extend_core.prototype.inherit(pagination, template_core);
    extend_core.prototype.inherit(pagination, render_layout_core);
    extend_core.prototype.inherit(pagination, switcher_core);
    extend_core.prototype.inherit(pagination, overlay_core);

    pagination.prototype.pagination_template = pagination.prototype.template(pagination_template);
    pagination.prototype.choice_per_page_template = pagination.prototype.template(choice_per_page_template);
    pagination.prototype.location_wrapper_template = pagination.prototype.template(location_wrapper_template);
    pagination.prototype.triple_element_template = pagination.prototype.template(triple_element_template);
    pagination.prototype.button_template = pagination.prototype.template(button_template);
    pagination.prototype.label_template = pagination.prototype.template(label_template);
    pagination.prototype.input_template = pagination.prototype.template(input_template);

    pagination.prototype.configMap = {
      "PAGINATION": pagination.prototype.pagination_navbar_config,
      "GO_TO": pagination.prototype.choice_per_page_config
    };

    pagination.prototype.dataMap = {
      "PAGINATION": "",
      "GO_TO": ""
    };

    pagination.prototype.templateMap = {
      "PAGINATION": pagination.prototype.pagination_template,
      "GO_TO": pagination.prototype.choice_per_page_template
    };

    pagination.prototype.configHandlerMap = {
      GO_TO: pagination.prototype.prepareConfig
    };
    pagination.prototype.configHandlerContextMap = {};

    return pagination;
  })
;
