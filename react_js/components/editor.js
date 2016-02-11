import React from 'react'
import ReactDOM from 'react-dom'

import extend_core from '../js/extend_core.js'
import dom_core from '../js/dom_core.js'
import event_bus from '../js/event_bus.js'
import messages from '../js/messages.js'

import Location_Wrapper from './location_wrapper'
import FormatPanel from './format_panel'
import Pagination from './pagination'

const Editor = React.createClass({
  MODE: {
    "MAIN_PANEL": 'MAIN_PANEL',
    "FORMAT_PANEL": 'FORMAT_PANEL'
  },

  getDefaultProps: function() {
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

  componentWillMount: function() {
    this.__keyInnerHtml = Date.now();
  },

  componentDidMount: function() {
    this.editorContainer = ReactDOM.findDOMNode(this);
    if (this.editorContainer) {
      this.messageInnerContainer = this.editorContainer.querySelector('[data-role="message_inner_container"]');
    }
  },

  componentWillUnmount: function() {
    this.messageInnerContainer = null;
  },

  handleClick: function(event) {
    let element = this.getDataParameter(event.currentTarget, 'action');
    if (element) {
      switch (element.dataset.action) {
        case 'addEdit':
          this.addEdit(element);
          break;
        case 'changeEdit':
          this.changeEdit();
          break;
        case 'changeMode':
          event_bus.trigger('changeMode', element);
          break;
        case 'sendMessage':
          this.sendMessage();
          break;
      }
    }
  },

  componentDidUpdate: function() {
    this.editorContainer = ReactDOM.findDOMNode(this);
    if (this.editorContainer) {
      this.messageInnerContainer = this.editorContainer.querySelector('[data-role="message_inner_container"]');
      this.messageInnerContainer.addEventListener('keypress', this.sendEnter);
    }
  },

  workflowInnerHtml: function(save) {
    this.__keyInnerHtml = Date.now();
    (save && this.messageInnerContainer) ? this.__innerHtml = this.messageInnerContainer.innerHTML : this.__innerHtml = "";
  },

  handleChange(){
  },

  sendEnter: function(event) {
    if (event.keyCode === 13) {
      if (this.props.data.formatOptions.sendEnter) {
        this.sendMessage();
      }
    }
  },

  sendMessage: function() {
    let self = this, newState = this.props.data;
    if (!this.messageInnerContainer) {
      return;
    }

    let pattern = /[^\s{0,}$|^$]/, // empty message or \n only
      message = this.messageInnerContainer.innerHTML;
    if (pattern.test(message)) {
      messages.prototype.addMessage(this.props.data.bodyOptions.mode, message, this.props.data.chat_id,
        function(err) {
          if (err) {
            console.error(err);
            return;
          }

          self.workflowInnerHtml();
          if (newState.messages_PaginationOptions.showEnablePagination) {
            newState.messages_PaginationOptions.currentPage = null;
            Pagination.prototype.countPagination(null, newState, newState.bodyOptions.mode,
              {"chat_id": newState.chat_id}, function(_newState) {
                self.props.handleEvent.changeState(_newState);
              });
          } else {
            self.props.handleEvent.changeState({messages_PaginationOptions: newState.messages_PaginationOptions});
          }
        });
    }
  },

  addEdit: function(element) {
    let self = this,
      command = element.dataset.name,
      param = element.dataset.param;
    self.messageInnerContainer.focus();
    if (param) {
      document.execCommand(command, false, "red");
    } else {
      document.execCommand(command, false, null);
    }
  },

  changeEdit: function() {
    let newState = this.props.data;
    if (this.messageInnerContainer.classList.contains("onScroll")) {
      this.messageInnerContainer.classList.remove("onScroll");
      newState.formatOptions.offScroll = false;
      this.props.handleEvent.changeState({formatOptions: newState.formatOptions});
    } else {
      this.messageInnerContainer.classList.add("onScroll");
      newState.formatOptions.offScroll = true;
      this.props.handleEvent.changeState({formatOptions: newState.formatOptions});
    }
  },

  render: function() {
    let onEvent = {
      onClick: this.handleClick,
      onChange: this.handleChange
    };
    if (this.props.data.editorOptions.show) {
      let classMesContainer = this.props.data.formatOptions.offScroll ? 'container onScroll' : 'container';
      return (
        <div data-role="editor_container" className="c-200">
          <div className="flex">
            <div data-role="message_container" className="modal-controls message_container">
              <div data-role="message_inner_container" className={classMesContainer} contentEditable="true"
                   dangerouslySetInnerHTML={{__html: this.__innerHtml}} key={this.__keyInnerHtml}>
              </div>
            </div>
            <div className="flex-wrap width-40px align-c" data-role="controls_container">
              <Location_Wrapper events={this.props.events} mainContainer={this.props.mainContainer}
                                configs={this.props.configs} events={onEvent}/>
            </div>
          </div>
          <FormatPanel data={this.props.data} events={onEvent}/>
        </div>
      )
    } else {
      this.workflowInnerHtml(true);
      return null;
    }
  }
});

extend_core.prototype.inherit(Editor, dom_core);

export default Editor;