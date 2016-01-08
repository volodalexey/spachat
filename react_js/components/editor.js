import React from 'react'
import ReactDOM from 'react-dom'

import extend_core from '../js/extend_core.js'
import dom_core from '../js/dom_core.js'

import Location_Wrapper from './location_wrapper'
import FormatPanel from './format_panel'

const Editor = React.createClass({
  getDefaultProps() {
    return {
      mainContainer: {
        "element": "div",
        "class": "modal-main-btn"
      },
      configs: [
        {
          "element": "button",
          "icon": "send_icon",
          "text": "",
          "class": "button-small-not-padding",
          "data": {
            "throw": "true",
            "action": "sendMessage",
            "mode_to": "",
            "chat_part": "",
            "description": 17
          },
          "name": "",
          "for": "",
          "service_id": "",
          "sort": 2,
          "redraw_mode": ""
        },
        {
          "element": "button",
          "icon": "change_message_icon",
          "text": "",
          "class": "button-small-not-padding",
          "data": {
            "throw": "true",
            "action": "changeMode",
            "mode_to": "FORMAT_PANEL",
            "chat_part": "editor",
            "toggle": true,
            "description": 15
          },
          "name": "",
          "for": "",
          "service_id": "",
          "sort": 1,
          "redraw_mode": ""
        }
      ]
    }
  },

  componentDidMount(){
    this.editorContainer = ReactDOM.findDOMNode(this);
    this.messageInnerContainer = this.editorContainer.querySelector('[data-role="message_container"]');
  },

  componentWillUnmount(){
    this.messageInnerContainer = null;
  },

  handleClick(event){
    var element = this.getDataParameter(event.currentTarget, 'action');
    if (element) {
      switch (element.dataset.action) {
        case 'addEdit':
          this.addEdit(element);
          break;
      }
    }
  },

  handleChange(event){

  },

  addEdit(element){
    var self = this;
    var command = element.dataset.name;
    var param = element.dataset.param;
    self.messageInnerContainer.focus();
    if (param) {
      document.execCommand(command, null, "red");
    } else {
      document.execCommand(command, null, null);
    }
  },

  render(){
    let onEvent = {
      onClick: this.handleClick,
      onChange: this.handleChange
    };
    if (this.props.data.editorOptions.show) {
      return (
        <div data-role="editor_container" className="c-200">
          <div className="flex">
            <div data-role="message_container" className="modal-controls message_container">
              <div data-role="message_inner_container" className="container" contentEditable="true">
              </div>
            </div>
            <div className="flex-wrap width-40px align-c" data-role="controls_container">
              <Location_Wrapper events={this.props.events} mainContainer={this.props.mainContainer}
                                configs={this.props.configs}/>
            </div>
          </div>
          <FormatPanel data={this.props.data} events={onEvent}/>
        </div>
      )
    } else {
      return <div data-role="editor_container" className="c-200"></div>
    }
  }
});

extend_core.prototype.inherit(Editor, dom_core);

export default Editor;