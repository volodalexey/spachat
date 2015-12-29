import React from 'react'
import Location_Wrapper from './location_wrapper'
import Localization from '../js/localization.js'

const Popup = React.createClass({
  getDefaultProps(){
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

  handleClick(event){
    if (this.onDataActionClick) {
      var element = this.getDataParameter(event.target, 'action');
      if (element) {
        this.onDataActionClick(element.dataset.action);
      }
    }
  },

  handleClose(state){
    state.popupOptions.messagePopupShow = false;
    state.popupOptions.type = '';
    state.popupOptions.options = {};
    state.popupOptions.onDataActionClick = null;
    return {popupOptions: state.popupOptions};
  },

  handleChangeState(state, show, type, message, onDataActionClick){
    state.popupOptions.messagePopupShow = show;
    state.popupOptions.type = type;
    state.popupOptions.options = {message: message};
    state.popupOptions.onDataActionClick = onDataActionClick;
    return {popupOptions: state.popupOptions};
  },

  defineParams(params){
    var config;
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
    return {
      "body_text": typeof params.options.message === "number" ? Localization.getLocText(params.options.message) : params.options.message,
      "configs": config,
      "type": params.type
    }
  },

  defineClass(){
    var className;
    if (this.props.show) {
      className = "flex-outer-container p-fx popup in"
    } else {
      className = "flex-outer-container p-fx popup hidden-popup";
    }
    return className;
  },

  render(){
    if (this.props.show && this.props.options) {
      var params = this.defineParams(this.props.options);
      var className = this.defineClass();
      return (
        <div data-role="popup_outer_container" className={className} >
          <div data-role="popup_inner_container" className="c-50 border-radius-05em min-width-350" onClick={this.handleClick}>
            <div className={'text-line-center flex-just-center ' + this.props.options.type}>
              <Location_Wrapper configs={params.configs.header} data={params} />
            </div>
            <Location_Wrapper configs={params.configs.content} data={params} />
          </div>
        </div>
      )
    } else {
      return <div></div>
    }
  },

  getDataParameter(element, param, _n) {
    if (!element) {
      return null;
    }
    if (element.disabled && param !== "description") {
      return null;
    }
    var n = !( _n === undefined || _n === null ) ? _n : 5;
    if (n > 0) {
      if (!element.dataset || !element.dataset[param]) {
        return this.getDataParameter(element.parentNode, param, n - 1);
      } else if (element.dataset[param]) {
        return element;
      }
    }
    return null;
  }
});

export default Popup;