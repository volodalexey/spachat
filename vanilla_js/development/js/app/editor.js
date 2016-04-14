define('editor', [
    'throw_event_core',
    'async_core',
    'ajax_core',
    'template_core',
    'indexeddb',
    'render_layout_core',
    'overlay_core',
    'extend_core',
    //
    'text!../templates/editor_template.ejs',
    'text!../templates/editor_format_template.ejs',
    'text!../templates/element/triple_element_template.ejs',
    'text!../templates/element/button_template.ejs',
    'text!../templates/element/label_template.ejs',
    'text!../templates/element/input_template.ejs',
    'text!../templates/element/location_wrapper_template.ejs',
    //
    'text!../configs/editor_navbar_config.json',
    'text!../configs/edit_navbar_config.json'
  ],
  function(throw_event_core,
           async_core,
           ajax_core,
           template_core,
           indexeddb,
           render_layout_core,
           overlay_core,
           extend_core,
           //
           editor_template,
           format_template,
           triple_element_template,
           button_template,
           label_template,
           input_template,
           location_wrapper_template,
           //
           editor_navbar_config,
           edit_navbar_config) {

    var editor = function(options) {
      this.chatElem = options.chat.chatElem;
      this.bindMainContexts();
    };

    editor.prototype = {

      editor_navbar_config: JSON.parse(editor_navbar_config),
      edit_navbar_config: JSON.parse(edit_navbar_config),

      MODE: {
        "MAIN_PANEL": 'MAIN_PANEL',
        "FORMAT_PANEL": 'FORMAT_PANEL'
      },

      bindMainContexts: function() {
        var _this = this;
        _this.bindedThrowEventRouter = _this.throwEventRouter.bind(_this);
        _this.bindedDataActionRouter = _this.dataActionRouter.bind(_this);
        _this.bindedSendEnter = _this.sendEnter.bind(_this);
      },
      //override extended throwEvent to use trigger on chat
      throwEvent: function(name, data) {
        this.chat && this.chat.trigger('throw', name, data);
      },

      addMainEventListener: function() {
        var _this = this;
        _this.removeMainEventListeners();
        _this.addRemoveListener('add', _this.controls_container, 'click', _this.bindedThrowEventRouter, false);
        _this.addRemoveListener('add', _this.controls_container, 'click', _this.bindedDataActionRouter, false);
        _this.addRemoveListener('add', _this.btnEditPanel, 'click', _this.bindedThrowEventRouter, false);
        _this.addRemoveListener('add', _this.btnEditPanel, 'click', _this.bindedDataActionRouter, false);
        _this.addRemoveListener('add', _this.message_inner_container, 'keypress', _this.bindedSendEnter, false);
      },

      removeMainEventListeners: function() {
        var _this = this;
        _this.addRemoveListener('remove', _this.controls_container, 'click', _this.bindedThrowEventRouter, false);
        _this.addRemoveListener('remove', _this.controls_container, 'click', _this.bindedDataActionRouter, false);
        _this.addRemoveListener('remove', _this.controls_container, 'click', _this.bindedThrowEventRouter, false);
        _this.addRemoveListener('remove', _this.btnEditPanel, 'click', _this.bindedDataActionRouter, false);
        _this.addRemoveListener('remove', _this.btnEditPanel, 'click', _this.bindedDataActionRouter, false);
        _this.addRemoveListener('remove', _this.message_inner_container, 'keypress', _this.bindedSendEnter, false);
      },

      cashElements: function() {
        var _this = this;
        _this.controls_container = _this.editor_container.querySelector('[data-role="controls_container"]');
        _this.message_inner_container = _this.editor_container.querySelector('[data-role="message_inner_container"]');
        _this.btnEditPanel = _this.editor_container.querySelector('[data-role="btnEditPanel"]');
        _this.buttonFormat = _this.editor_container.querySelector('[data-toggle]');
      },

      unCashElements: function() {
        var _this = this;
        _this.controls_container = null;
        _this.message_inner_container = null;
        _this.btnEditPanel = null;
        _this.buttonFormat = null;
        _this.editor_container = null;
      },

      render: function(options, chat) {
        var _this = this;
        _this.chat = chat;
        _this.editor_container = _this.chat.chat_element.querySelector('[data-role="editor_container"]');
        if (_this.chat.editorOptions.show) {
          if (!_this.previousEditorShow) {
            _this.showSpinner(_this.editor_container);
            _this.previousEditorShow = true;
            _this.body_mode = _this.MODE.MAIN_PANEL;
            _this.elementMap = {
              MAIN_PANEL: _this.editor_container
            };
            var data = {
              "restore": _this.chat.messages_ListOptions.restore,
              "innerHTML": _this.chat.messages_ListOptions.innerHTML
            };
            _this.renderLayout(data, function() {
              if (_this.chat.messages_ListOptions.restore) {
                _this.chat.messages_ListOptions.restore = false;
                _this.chat.messages_ListOptions.innerHTML = "";
              }
              _this.cashElements();
              _this.addMainEventListener();
              _this.renderFormatPanel();
            });
          } else {
            _this.renderFormatPanel();
          }
          return;

        }
        _this.previousEditorShow = false;
        _this.editor_container.innerHTML = "";
      },

      renderFormatPanel: function() {
        var _this = this;
        if (_this.chat.formatOptions.show) {
          if (!_this.previous_Show) {
            _this.previous_Show = true;
            _this.showHorizontalSpinner(_this.btnEditPanel);
            _this.buttonFormat.dataset.toggle = false;
            _this.body_mode = _this.MODE.FORMAT_PANEL;
            _this.elementMap = {
              FORMAT_PANEL: _this.btnEditPanel
            };
            var data = {
              "offScroll": _this.chat.formatOptions.offScroll,
              "iSender": _this.chat.formatOptions.iSender
            };
            _this.renderLayout(data, null);
          }
        } else {
          _this.btnEditPanel.innerHTML = "";
          _this.previous_Show = false;
        }
      },

      addEdit: function(element) {
        var _this = this;
        var command = element.dataset.name;
        var param = element.dataset.param;
        _this.message_inner_container.focus();
        if (param) {
          document.execCommand(command, null, "red");
        } else {
          document.execCommand(command, null, null);
        }
      },

      changeSendEnter: function(element) {
        var _this = this;
        if (element.checked) {
          _this.chat.formatOptions.sendEnter = true;
        } else {
          _this.chat.formatOptions.sendEnter = false;
        }
      },

      sendEnter: function(event) {
        var _this = this;
        if (event.keyCode === 13) {
          if (_this.chat.formatOptions.sendEnter) {
            _this.sendMessage();
          }
        }
      },

      changeEdit: function() {
        var _this = this;
        if (_this.message_inner_container.classList.contains("onScroll")) {
          _this.message_inner_container.classList.remove("onScroll");
          _this.chat.formatOptions.offScroll = false;
        } else {
          _this.message_inner_container.classList.add("onScroll");
          _this.chat.formatOptions.offScroll = true;
        }
      },

      // TODO move to editor ?
      sendMessage: function() {
        var _this = this;
        if (!_this.message_inner_container) {
          return;
        }

        // TODO replace with data-role
        var messageInnerHTML = _this.message_inner_container.innerHTML;
        var pattern = /[^\s{0,}$|^$]/; // empty message or \n only
        if (pattern.test(messageInnerHTML)) {
          _this.chat.messages.addMessage(_this.chat, _this.chat.body.MODE.MESSAGES,
            {scrollTop: true, messageInnerHTML: messageInnerHTML},
            function(error, message) {
              if (error) {
                console.error(error);
                return;
              }

              _this.chat.messages.renderMessage({scrollTop: true}, message);
              // do something with message ?
            }
          );
          _this.message_inner_container.innerHTML = "";
        }
      },

      destroy: function() {
        var _this = this;
        _this.removeMainEventListeners();
        _this.unCashElements();
      }
    };

    extend_core.prototype.inherit(editor, throw_event_core);
    extend_core.prototype.inherit(editor, async_core);
    extend_core.prototype.inherit(editor, ajax_core);
    extend_core.prototype.inherit(editor, template_core);
    extend_core.prototype.inherit(editor, render_layout_core);
    extend_core.prototype.inherit(editor, overlay_core);

    editor.prototype.editor_template = editor.prototype.template(editor_template);
    editor.prototype.format_template = editor.prototype.template(format_template);
    editor.prototype.triple_element_template = editor.prototype.template(triple_element_template);
    editor.prototype.button_template = editor.prototype.template(button_template);
    editor.prototype.label_template = editor.prototype.template(label_template);
    editor.prototype.input_template = editor.prototype.template(input_template);
    editor.prototype.location_wrapper_template = editor.prototype.template(location_wrapper_template);

    editor.prototype.configMap = {
      "MAIN_PANEL": editor.prototype.editor_navbar_config,
      "FORMAT_PANEL": editor.prototype.edit_navbar_config
    };

    editor.prototype.configHandlerMap = {
      "FORMAT_PANEL": editor.prototype.prepareConfig
    };

    editor.prototype.configHandlerContextMap = {};

    editor.prototype.dataMap = {
      "MAIN_PANEL": "",
      "FORMAT_PANEL": ""
    };

    editor.prototype.templateMap = {
      "MAIN_PANEL": editor.prototype.editor_template,
      "FORMAT_PANEL": editor.prototype.format_template
    };

    return editor;
  });
