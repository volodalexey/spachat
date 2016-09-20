import localization from '../js/localization'

const Element = function() {
};

Element.prototype = {

  /**
   * prepare data attribute for each provided data object key
   */
  renderDataAttributes(data_config, result) {
    if (!result) {
      result = {};
    }
    if (data_config.data) {
      Object.keys(data_config.data).forEach((key) => {
        if (key === 'description' && typeof  data_config.data[key] === 'number') {
          result['data-' + key] = localization.getLocText(data_config.data[key]);
        } else {
          result['data-' + key] = data_config.data[key];
        }
      });
    }
    return result;
  },

  /**
   * prepare attributes object fro react
   */
  renderAttributes(props, options) {
    let params = {}, config = props.config, display;
    if (config.role) {
      params['role'] = config.role;
    }
    if (config.autoComplete) {
      params["autoComplete"] = config.autoComplete;
    }
    if (config.name) {
      params["name"] = config.name;
    }
    if (config.type) {
      params['type'] = config.type;
    }
    if (config.class || config.classList) {
      params['className'] = this.renderClassName(config.class ? config.class : config.classList, props, options);
    }

    if (config.for) {
      params["for"] = config.for;
    }
    if (props.id) {
      params['id'] = config.id;
    }
    if (props.calcDisplay) {
      display = props.calcDisplay(config, props.data);
      if (display !== undefined && display !== true) {
        params['style'] = {display: 'none'};
      }
    }
    if (config.disabled === true) {
      params['disabled'] = 'true';
    }
    if (config.readonly === true) {
      params['readOnly'] = true;
    }

    if (config.type === "checkbox" || config.type === "radio") {
      if (config.data.key) {
        if (props.data[props.config.data.key]) {
          params['checked'] = 'true';
        }
      }
    }

    if (props.data && config.data && config.data.key) {
      params['data-value'] = props.data[config.data.key];
    }

    this.renderDataAttributes(config, params);
    if (options) {
      this.renderOptionsAttributes(options, params);
    }
    return params;
  },

  renderOptionsAttributes(options_config, result) {
    if (!result) {
      result = {};
    }
    Object.keys(options_config).forEach((key) => {
      if (key === 'classList') {
        result['className'] = result.className + options_config[key];
      } else {
        result[key] = options_config[key];
      }
    });
    return result;
  },

  renderHandlers(props) {
    let handlers = {};
    if (props.events) {
      Object.keys(props.events).forEach((key) => {
        if (key === 'onKeyPress') {
          if (props.config[key]) {
            handlers[key] = props.events[key];
          }
        } else {
          handlers[key] = props.events[key];
        }
      });
    }

    return handlers;
  },

  renderClassName(classList, props) {
    let _class = '';
    _class = classList ? classList : '';
    if (props.hide) {
      _class = _class + ' hide ';
    }
    return _class;
  }
};

export const element = new Element();
export default Element;