import React from 'react'
import ReactDOM from 'react-dom'

import event_bus from '../js/event_bus.js'
import extend_core from '../js/extend_core.js'
import dom_core from '../js/dom_core.js'

const ChatResize = React.createClass({
  getDefaultProps: function() {
    return {
      min_chats_width: 350,
      min_move: 5
    }
  },

  getInitialState: function() {
    return {
      visible_resize_container: false,
      left_position_line_resize: 0,
      resizeMouseDown: false,
      positionSplitterItem: '',
      splitterWidth: null,
      offsetLeft_splitter_left: null,
      offsetLeft_splitter_right: null,
      chatResizeWidth: null,
      chatResize: null
    };
  },
  componentDidMount: function() {
    this.chat_resize_container = ReactDOM.findDOMNode(this);
    this.line_resize = this.chat_resize_container.querySelector('[data-role="resize_line"]');
    event_bus.on('transformToResizeState', this.transformToResizeState, this);
    event_bus.on('redirectResize', this.handleResize, this);
    this.chat_resize_container.addEventListener('mouseup', this.handleResize);
    this.chat_resize_container.addEventListener('touchend', this.handleResize);
    this.chat_resize_container.addEventListener('mousemove', this.handleResize);
    this.chat_resize_container.addEventListener('touchmove', this.handleResize);
  },

  componentWillUnmount: function() {
    event_bus.off('transformToResizeState', this.transformToResizeState);
    event_bus.off('redirectResize', this.handleResize);
    this.chat_resize_container.removeEventListener('mouseup', this.handleResize);
    this.chat_resize_container.removeEventListener('touchend', this.handleResize);
    this.chat_resize_container.removeEventListener('mousemove', this.handleResize);
    this.chat_resize_container.removeEventListener('touchmove', this.handleResize);
  },

  transformToResizeState: function(event, _chat) {
    let left_line_resize;
    if (event.type === 'touchstart' && event.changedTouches) {
      left_line_resize = event.changedTouches[0].clientX + 'px';
    } else {
      left_line_resize = event.clientX + 'px';
    }
    this.setState({
      visible_resize_container: true,
      resizeMouseDown: true,
      left_position_line_resize: left_line_resize,
      positionSplitterItem: event.currentTarget.dataset.splitteritem,
      splitterWidth: _chat.splitter_left.clientWidth,
      offsetLeft_splitter_left: this.getOffset(_chat.splitter_left).offsetLeft,
      offsetLeft_splitter_right: this.getOffset(_chat.splitter_right).offsetLeft,
      chatResizeWidth: _chat.chat.clientWidth,
      chatResize: _chat
    });
  },

  handleResize: function(event) {
    switch (event.type) {
      case 'mousemove':
      case 'touchmove':
        if (this.state.resizeMouseDown) {
          let clientX = event.clientX, left_line_resize;
          if (event.type === 'touchmove' && event.changedTouches) {
            clientX = event.changedTouches[0].clientX;
          }
          if (!this.resizeClientX_absolue) {
            this.resizeClientX_absolue = clientX;
          }
          if (!this.resizeClientX) {
            this.resizeClientX = clientX;
          } else {
            var deltaX = clientX - this.resizeClientX;
            this.absoluteDeltaX = this.resizeClientX_absolue - clientX;
            this.redraw_chat = false;
            if (Math.abs(this.absoluteDeltaX - deltaX) > this.props.min_move) {
              this.redraw_chat = true;
              if (this.state.positionSplitterItem === 'left' &&
                this.state.offsetLeft_splitter_right - clientX + this.state.splitterWidth > this.props.min_chats_width ||
                this.state.positionSplitterItem === 'right' &&
                clientX - this.state.offsetLeft_splitter_left > this.props.min_chats_width
              ) {
                left_line_resize = (this.line_resize.offsetLeft + deltaX) + 'px';
                this.resizeClientX = clientX;
              } else {
                if (this.state.positionSplitterItem === 'left') {
                  left_line_resize = this.state.offsetLeft_splitter_right -
                    this.props.min_chats_width + this.state.splitterWidth + 'px';
                }
                if (this.state.positionSplitterItem === 'right') {
                  left_line_resize = this.state.offsetLeft_splitter_left + this.props.min_chats_width + 'px';
                }
                this.resizeClientX = clientX;
              }
              this.setState({left_position_line_resize: left_line_resize});
            }
          }
        }
        break;
      case 'mouseup':
      case 'touchend':
        if (this.redraw_chat) {
          if (this.state.positionSplitterItem === 'left') {
            if (this.state.chatResizeWidth + this.absoluteDeltaX >= this.props.min_chats_width) {
              this.state.chatResize.state.settings_ListOptions.size_current = this.state.chatResizeWidth + this.absoluteDeltaX + 'px';
            } else {
              this.state.chatResize.state.settings_ListOptions.size_current = this.props.min_chats_width + 'px';
            }
          }
          if (this.state.positionSplitterItem === 'right') {
            if (this.state.chatResizeWidth - this.absoluteDeltaX >= this.props.min_chats_width) {
              this.state.chatResize.state.settings_ListOptions.size_current = this.state.chatResizeWidth - this.absoluteDeltaX + 'px';
            } else {
              this.state.chatResize.state.settings_ListOptions.size_current = this.props.min_chats_width + 'px';
            }
          }
          this.state.chatResize.state.settings_ListOptions.size_custom_value =
            this.state.chatResize.state.settings_ListOptions.size_current;
          this.state.chatResize.changeState({
            settings_ListOptions: this.state.chatResize.state.settings_ListOptions
          });
        }

        this.setState({
          resizeMouseDown: false,
          visible_resize_container: false,
          left_position_line_resize: 0,
          positionSplitterItem: '',
          splitterWidth: null,
          offsetLeft_splitter_left: null,
          offsetLeft_splitter_right: null,
          chatResizeWidth: null,
          chatResize: null
        });

        delete this.resizeClientX;
        delete this.resizeClientX_absolue;
        delete this.redraw_chat;
    }
  },

  defineClass: function(className) {
    if (this.state.visible_resize_container) {
      className = className + " draggable";
    }

    return className;
  },

  render: function() {
    return (
      <div data-role="chat_resize_container"
           className={this.defineClass("clear chat-resize-container ")}>
        <div className="line" style={{left: this.state.left_position_line_resize}}
             data-role="resize_line"></div>
      </div>
    )
  }
});
extend_core.prototype.inherit(ChatResize, dom_core);

export default ChatResize;