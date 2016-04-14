define('popap_manager', [
    'throw_event_core',
    'extend_core',
    'template_core',
    'render_layout_core',
    'dom_core',
    //
    'text!../templates/element/triple_element_template.ejs',
    'text!../templates/popap_template.ejs',
    'text!../templates/element/location_wrapper_template.ejs',
    'text!../templates/element/button_template.ejs',
    'text!../templates/element/label_template.ejs',
    'text!../templates/element/input_template.ejs',
    //
    'text!../configs/popap/confirm_config.json',
    'text!../configs/popap/error_config.json',
    'text!../configs/popap/succes_config.json'

  ],
  function(throw_event_core,
           extend_core,
           template_core,
           render_layout_core,
           dom_core,
           //
           triple_element_template,
           popap_template,
           location_wrapper_template,
           button_template,
           label_template,
           input_template,
           //
           confirm_config,
           error_config,
           succes_config) {

    var popap_manager = function() {
      this.bindMainContexts();
    };

    popap_manager.prototype = {

      MODE: {
        POPAP: 'POPAP'
      },

      confirm_config: JSON.parse(confirm_config),
      error_config: JSON.parse(error_config),
      succes_config: JSON.parse(succes_config),

      bindMainContexts: function() {
        var _this = this;
        _this.bindedOnDataActionClick = _this.onDataActionClick.bind(_this);
      },

      cashElements: function() {
        var _this = this;
        _this.popapOuterContainer = document.querySelector('[data-role="popap_outer_container"]');
        _this.popapContainer = document.querySelector('[data-role="popap_inner_container"]');
      },

      unCashElements: function() {
        var _this = this;
        _this.popapOuterContainer = null;
        _this.popapContainer = null;
      },

      render: function(options) {
        var _this = this;
        _this.body_mode = _this.MODE.POPAP;
        _this.elementMap = {
          "POPAP": _this.popapContainer
        };
        _this.config = _this.prepareConfig(options.config);
        _this.fillBody(null, {"type": options.type}, options, function() {
          _this.popapOuterContainer.classList.remove('hidden-popap');
          _this.popapOuterContainer.classList.add('in');
        });
      },

      renderPopap: function(type, options, onDataActionClick) {
        var _this = this, config;
        _this.onDataActionClick = onDataActionClick;
        switch (type) {
          case 'confirm':
            config = _this.confirm_config;
            break;
          case 'error':
            config = _this.error_config;
            console.warn(options);
            break;
          case 'success':
            config = _this.succes_config;
            break;
        }
        this.render({
          "body_text": typeof options.message === "number" ? window.getLocText(options.message) : options.message,
          "config": config,
          "type": type
        });
      },

      onDataActionClick: function(event) {
        var _this = this;
        if (_this.onDataActionClick) {
          var element = _this.getDataParameter(event.target, 'action');
          if (element) {
            _this.onDataActionClick(element.dataset.action);
          }
        }
      },

      onClose: function() {
        var _this = this;
        _this.popapOuterContainer.classList.remove('in');
        _this.popapOuterContainer.classList.add('hidden-popap');
        _this.popapContainer.innerHTML = null;
        _this.onDataActionClick = null;
      },

      onHandlers: function() {
        var _this = this;
        _this.offHandlers();
        _this.addRemoveListener('add', _this.popapContainer, 'click', _this.bindedOnDataActionClick, false);
      },

      offHandlers: function() {
        var _this = this;
        _this.addRemoveListener('remove', _this.popapContainer, 'click', _this.bindedOnDataActionClick, false);
      },

      destroy: function() {
        var _this = this;
      }
    };

    extend_core.prototype.inherit(popap_manager, throw_event_core);
    extend_core.prototype.inherit(popap_manager, template_core);
    extend_core.prototype.inherit(popap_manager, render_layout_core);
    extend_core.prototype.inherit(popap_manager, dom_core);

    popap_manager.prototype.triple_element_template = popap_manager.prototype.template(triple_element_template);
    popap_manager.prototype.location_wrapper_template = popap_manager.prototype.template(location_wrapper_template);
    popap_manager.prototype.button_template = popap_manager.prototype.template(button_template);
    popap_manager.prototype.label_template = popap_manager.prototype.template(label_template);
    popap_manager.prototype.input_template = popap_manager.prototype.template(input_template);
    popap_manager.prototype.popap_template = popap_manager.prototype.template(popap_template);

    popap_manager.prototype.templateMap = {
      "POPAP": popap_manager.prototype.popap_template
    };

    return new popap_manager();
  });
