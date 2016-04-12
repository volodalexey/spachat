import React from 'react'

import Localization from '../js/localization'
import dom_core from '../js/dom_core'
import extend_core from '../js/extend_core'
import utils from '../js/utils'

import Location_Wrapper from './location_wrapper'

const Popup = React.createClass({
  getDefaultProps: function() {
    return {
      confirmConfig: {
        header: [
          {
            "role": "locationWrapper",
            "classList": "p-r-l-04em color-blue title-popup",
            "location": "header"
          },
          {
            "element": "label",
            "text": 80,
            "class": "c-50 p-r-l-04em",
            "location": "header",
            "data": {
              "role": ""
            }
          }],
        content: [
          {
            "role": "locationWrapper",
            "classList": "w-100p p-t-b flex-sp-between",
            "location": "body"
          },
          {
            "element": "label",
            "text": "",
            "class": "p-b-1em p-r-l-1em",
            "location": "body",
            "data": {
              "role": "",
              "key": "body_text"
            }
          },

          {
            "role": "locationWrapper",
            "classList": "flex-sp-around p-05em border-popap-footer",
            "location": "footer"
          },
          {
            "element": "button",
            "location": "footer",
            "class": "border-radius-04em p-tb-03em-lr-1em",
            "text": 42,
            "data": {
              "action": "confirmCancel",
              "description": 98
            }
          },
          {
            "element": "button",
            "location": "footer",
            "class": "border-radius-04em p-tb-03em-lr-1em",
            "text": 97,
            "data": {
              "action": "confirmOk",
              "description": 99
            }
          }
        ]
      },
      errorConfig: {
        header: [
          {
            "role": "locationWrapper",
            "classList": "p-r-l-04em color-red title-popup",
            "location": "header"
          },
          {
            "element": "label",
            "text": 84,
            "class": "c-50 p-r-l-04em",
            "location": "header",
            "data": {
              "role": ""
            }
          }
        ],

        content: [
          {
            "role": "locationWrapper",
            "classList": "w-100p p-t-b flex-sp-between",
            "location": "body"
          },
          {
            "element": "label",
            "text": "",
            "class": "p-b-1em p-r-l-1em",
            "location": "body",
            "data": {
              "role": "",
              "key": "body_text"
            }
          },

          {
            "role": "locationWrapper",
            "classList": "flex-sp-around p-05em border-popup-footer",
            "location": "footer"
          },
          {
            "element": "button",
            "location": "footer",
            "class": "border-radius-04em p-tb-03em-lr-1em",
            "text": 20,
            "data": {
              "action": "confirmCancel",
              "description": 21
            }
          }]
      },
      successConfig: {
        header: [
          {
            "role": "locationWrapper",
            "classList": "p-r-l-04em color-green title-popup",
            "location": "header"
          },
          {
            "element": "label",
            "text": 85,
            "class": "c-50 p-r-l-04em",
            "location": "header",
            "data": {
              "role": ""
            }
          }],
        content: [
          {
            "role": "locationWrapper",
            "classList": "w-100p p-t-b flex-sp-between",
            "location": "body"
          },
          {
            "element": "label",
            "text": "",
            "class": "p-b-1em p-r-l-1em",
            "location": "body",
            "data": {
              "role": "",
              "key": "body_text"
            }
          },

          {
            "role": "locationWrapper",
            "classList": "flex-sp-around p-05em border-popup-footer",
            "location": "footer"
          },
          {
            "element": "button",
            "location": "footer",
            "class": "border-radius-04em p-tb-03em-lr-1em",
            "text": 20,
            "data": {
              "action": "confirmCancel",
              "description": 21
            }
          }
        ]
      },
      mainContainer: {
        "element": "div",
        "class": "c-50 border-radius-05em min-width-350"
      }
    }
  },

  handleClick: function(event) {
    if (this.onDataActionClick) {
      var element = this.getDataParameter(event.target, 'action');
      if (element) {
        this.onDataActionClick(element.dataset.action);
      }
    }
  },

  handleClose: function(state) {
    state.popupOptions.messagePopupShow = false;
    state.popupOptions.type = '';
    state.popupOptions.options = {};
    state.popupOptions.onDataActionClick = null;
    return {popupOptions: state.popupOptions};
  },

  handleChangeState: function(state, show, type, message, onDataActionClick, data) {
    state.popupOptions.messagePopupShow = show;
    state.popupOptions.type = type;
    state.popupOptions.options = {message: message};
    state.popupOptions.onDataActionClick = onDataActionClick;
    if(data){
      state.popupOptions.data = data;
    }
    return {popupOptions: state.popupOptions};
  },

  defineParams: function(params) {
    let config, text;
    this.onDataActionClick = params.onDataActionClick;
    switch (params.type) {
      case 'confirm':
        config = this.props.confirmConfig;
        break;
      case 'error':
        config = this.props.errorConfig;
        console.warn(params.options);
        break;
      case 'success':
        config = this.props.successConfig;
        break;
    }
    text = typeof params.options.message === "number" ? Localization.getLocText(params.options.message) : params.options.message;
    if(params.data){
      text = utils.objectToUrl(params.data, text);
    }
    return {
      "body_text": text,
      "configs": config,
      "type": params.type
    }
  },

  defineClass: function() {
    let className;
    if (this.props.show) {
      className = "flex-outer-container p-fx popup in"
    } else {
      className = "flex-outer-container p-fx popup hidden-popup";
    }
    return className;
  },

  render: function() {
    var className = this.defineClass();
    if (this.props.show && this.props.options) {
      var params = this.defineParams(this.props.options);
      return (
        <div data-role="popup_outer_container" className={className}>
          <div data-role="popup_inner_container" className="c-50 border-radius-05em min-width-350"
               onClick={this.handleClick}>
            <div className={'text-line-center flex-just-center ' + this.props.options.type}>
              <Location_Wrapper configs={params.configs.header} data={params}/>
            </div>
            <Location_Wrapper configs={params.configs.content} data={params}/>
          </div>
        </div>
      )
    } else {
      return (
        <div data-role="popup_outer_container" className={className}>
          <div data-role="popup_inner_container" className="c-50 border-radius-05em min-width-350"
               onClick={this.handleClick}>
            <div className={'text-line-center flex-just-center ' + this.props.options.type}>
            </div>
          </div>
        </div>
      )
    }
  }
});

extend_core.prototype.inherit(Popup, dom_core);

export default Popup;