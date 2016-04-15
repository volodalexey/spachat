define('extra_toolbar', [
    'switcher_core',
    'overlay_core',
    'render_layout_core',
    'throw_event_core',
    'extend_core',
    //
    'text!../templates/element/triple_element_template.ejs',
    'text!../templates/element/button_template.ejs',
    'text!../templates/element/label_template.ejs',
    'text!../templates/element/input_template.ejs',
    'text!../templates/panel_extra_toolbar_template.ejs',
    'text!../templates/messages_extra_toolbar_template.ejs',
    'text!../templates/contact_list_extra_toolbar_template.ejs',
    //
    'text!../configs/panel_chats_extra_toolbar_config.json',
    'text!../configs/panel_users_extra_toolbar_config.json',
    'text!../configs/messages_extra_toolbar_config.json',
    'text!../configs/contact_list_extra_toolbar_config.json',
    'text!../configs/logger_extra_toolbar_config.json'
  ],
  function(switcher_core,
           overlay_core,
           render_layout_core,
           throw_event_core,
           extend_core,
           //
           triple_element_template,
           button_template,
           label_template,
           input_template,
           panel_extra_toolbar_template,
           messages_extra_toolbar_template,
           contact_list_extra_toolbar_template,
           //
           panel_chats_extra_toolbar_config,
           panel_users_extra_toolbar_config,
           messages_extra_toolbar_config,
           contact_list_extra_toolbar_config,
           logger_extra_toolbar_config) {

    var extra_toolbar = function() {
      this.bindContext();
    };

    extra_toolbar.prototype = {

      panel_chats_extra_toolbar_config: JSON.parse(panel_chats_extra_toolbar_config),
      panel_users_extra_toolbar_config: JSON.parse(panel_users_extra_toolbar_config),
      messages_extra_toolbar_config: JSON.parse(messages_extra_toolbar_config),
      contact_list_extra_toolbar_config: JSON.parse(contact_list_extra_toolbar_config),
      logger_extra_toolbar_config: JSON.parse(logger_extra_toolbar_config),

      MODE: {
        BLOGS_EXTRA_TOOLBAR: 'BLOGS_EXTRA_TOOLBAR',
        CHATS_EXTRA_TOOLBAR: 'CHATS_EXTRA_TOOLBAR',
        USERS_EXTRA_TOOLBAR: ' USERS_EXTRA_TOOLBAR',
        MESSAGES_EXTRA_TOOLBAR: 'MESSAGES_EXTRA_TOOLBAR',
        CONTACT_LIST_EXTRA_TOOLBAR: 'CONTACT_LIST_EXTRA_TOOLBAR',
        LOGGER_EXTRA_TOOLBAR: 'LOGGER_EXTRA_TOOLBAR',
        CONNECTIONS_EXTRA_TOOLBAR: 'CONNECTIONS_EXTRA_TOOLBAR'
      },

      bindContext: function() {
        var _this = this;
        _this.bindedThrowEventRouter = _this.throwEventRouter.bind(_this);
      },

      addEventListeners: function() {
        var _this = this;
        _this.removeEventListeners();
        _this.addRemoveListener('add', _this._module.extra_toolbar_container, 'click', _this.bindedThrowEventRouter, false);
        _this.addRemoveListener('add', _this._module.extra_toolbar_container, 'click', _this._module.bindedDataActionRouter, false);
      },

      removeEventListeners: function() {
        var _this = this;
        _this.addRemoveListener('remove', _this._module.extra_toolbar_container, 'click', _this.bindedThrowEventRouter, false);
        _this.addRemoveListener('remove', _this._module.extra_toolbar_container, 'click', _this._module.bindedDataActionRouter, false);
      },

      renderExtraToolbar: function(_module, _mode, _callback) {
        var _this = this;
        _this._module = _module;
        _this.elementMap = {
          BLOGS_EXTRA_TOOLBAR: _module.extra_toolbar_container,
          CHATS_EXTRA_TOOLBAR: _module.extra_toolbar_container,
          USERS_EXTRA_TOOLBAR: _module.extra_toolbar_container,
          MESSAGES_EXTRA_TOOLBAR: _module.extra_toolbar_container,
          CONTACT_LIST_EXTRA_TOOLBAR: _module.extra_toolbar_container,
          LOGGER_EXTRA_TOOLBAR: _module.extra_toolbar_container,
          CONNECTIONS_EXTRA_TOOLBAR: _module.extra_toolbar_container
        };
        if (_mode === _module.body.MODE.DETAIL_VIEW) {
          _this.optionsDefinition(_module, _this.MODE.CHATS);
        } else {
          _this.optionsDefinition(_module, _mode);
        }

        if (_this._module.current_Extra_Toolbar_Options.show) {
          if (_this.previousExtraToolbar !== _mode &&
            _mode !== _module.body.MODE.DETAIL_VIEW) {
            _this.showHorizontalSpinner(_module.extra_toolbar_container);
            _this.body_mode = _mode + "_EXTRA_TOOLBAR";
            _this.previousExtraToolbar = _mode;
            _this.renderLayout(null, function() {
              _module.cashExtraToolbarElement();
              _this.addEventListeners();
              _callback();
            });
          } else {
            _callback();
          }
        } else {
          _this.previousExtraToolbar = _mode;
          _module.extra_toolbar_container.innerHTML = "";
          _callback();
        }
      },

      throwEvent: function(name, data) {
        this._module && this._module.trigger('throw', name, data);
      },

      destroy: function() {
        var _this = this;
        _this.removeEventListeners();
      }

    };
    extend_core.prototype.inherit(extra_toolbar, switcher_core);
    extend_core.prototype.inherit(extra_toolbar, overlay_core);
    extend_core.prototype.inherit(extra_toolbar, render_layout_core);
    extend_core.prototype.inherit(extra_toolbar, throw_event_core);

    extra_toolbar.prototype.triple_element_template = extra_toolbar.prototype.template(triple_element_template);
    extra_toolbar.prototype.button_template = extra_toolbar.prototype.template(button_template);
    extra_toolbar.prototype.label_template = extra_toolbar.prototype.template(label_template);
    extra_toolbar.prototype.input_template = extra_toolbar.prototype.template(input_template);

    extra_toolbar.prototype.panel_extra_toolbar_template = extra_toolbar.prototype.template(panel_extra_toolbar_template);
    extra_toolbar.prototype.messages_extra_toolbar_template = extra_toolbar.prototype.template(messages_extra_toolbar_template);
    extra_toolbar.prototype.contact_list_extra_toolbar_template = extra_toolbar.prototype.template(contact_list_extra_toolbar_template);

    extra_toolbar.prototype.configMap = {
      BLOGS_EXTRA_TOOLBAR: '',
      CHATS_EXTRA_TOOLBAR: extra_toolbar.prototype.panel_chats_extra_toolbar_config,
      USERS_EXTRA_TOOLBAR: extra_toolbar.prototype.panel_users_extra_toolbar_config,
      MESSAGES_EXTRA_TOOLBAR: extra_toolbar.prototype.messages_extra_toolbar_config,
      CONTACT_LIST_EXTRA_TOOLBAR: extra_toolbar.prototype.contact_list_extra_toolbar_config,
      LOGGER_EXTRA_TOOLBAR: extra_toolbar.prototype.logger_extra_toolbar_config,
      CONNECTIONS_EXTRA_TOOLBAR: ''
    },

      extra_toolbar.prototype.templateMap = {
        BLOGS_EXTRA_TOOLBAR: '',
        CHATS_EXTRA_TOOLBAR: extra_toolbar.prototype.panel_extra_toolbar_template,
        USERS_EXTRA_TOOLBAR: extra_toolbar.prototype.panel_extra_toolbar_template,
        MESSAGES_EXTRA_TOOLBAR: extra_toolbar.prototype.messages_extra_toolbar_template,
        CONTACT_LIST_EXTRA_TOOLBAR: extra_toolbar.prototype.contact_list_extra_toolbar_template,
        LOGGER_EXTRA_TOOLBAR: extra_toolbar.prototype.messages_extra_toolbar_template,
        CONNECTIONS_EXTRA_TOOLBAR: ''
      };

    extra_toolbar.prototype.configHandlerMap = {};
    extra_toolbar.prototype.configHandlerContextMap = {};
    extra_toolbar.prototype.dataHandlerMap = {};
    extra_toolbar.prototype.dataMap = {};

    return extra_toolbar;
  }
);