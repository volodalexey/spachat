import React from 'react'
import ReactDOM from 'react-dom'

import event_bus from '../js/event_bus.js'
import extend_core from '../js/extend_core.js'
import dom_core from '../js/dom_core.js'

const ToggleVisibleChatPart = React.createClass({
  getDefaultProps: function() {
    return {
      min_move: 5,
      padding: 4
    }
  },

  getInitialState: function() {
    return {
      position_btn: 0,
      resizeMouseDown: false,
      btnWidth: null,
      left: '0px'
    };
  },
  componentDidMount: function() {
    this.toggle_container = ReactDOM.findDOMNode(this);
    this.toggleButton = this.toggle_container.querySelector('[data-role="toggleButton"]');
    event_bus.on('onMouseUp', this.handleResize, this);
  },

  componentWillUnmount: function() {
    event_bus.off('onMouseUp', this.handleResize, this);
  },

  startResize: function(event) {
    switch (event.type) {
      case 'mousedown':
      case 'touchstart':
        this.transformToResizeState(event);
        break;
      case 'touchmove':
      case 'touchend':
        this.handleResize(event);
        break;
    }
  },

  transformToResizeState: function(event) {
    let toggle_btn;
    if (event.type === 'touchstart' && event.changedTouches) {
      toggle_btn = event.changedTouches[0].clientX + 'px';
    } else {
      toggle_btn = event.clientX + 'px';
    }
    this.setState({
      resizeMouseDown: true,
      position_btn: toggle_btn,
      btnWidth: this.toggleButton.clientWidth
    });
  },

  handleResize: function(event) {
    switch (event.type) {
      case 'mousemove':
      case 'touchmove':
        if (this.state.resizeMouseDown) {
          let clientX = event.clientX, toggle_btn,
            size_container = parseInt(this.props.data.settings_ListOptions.size_current, 10);
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
            if (Math.abs(this.absoluteDeltaX - deltaX) > this.props.min_move) {
              this.redraw_toggle_btn = true;
              this.backlight = true;
              if ((deltaX < 0)
                && this.toggleButton.offsetLeft + deltaX >= 0
                || (deltaX > 0) &&
                this.toggleButton.offsetLeft + this.state.btnWidth + this.props.padding <
                size_container
              ) {
                this.resizeClientX = clientX;
                this.left = this.toggleButton.offsetLeft + deltaX + 'px';
              }
              if (parseInt(this.left) + this.state.btnWidth >=
                size_container) {
                this.left = size_container - this.state.btnWidth - this.props.padding + 'px';
              }
              this.setState({left: this.left});
            }
          }
        }
        break;
      case 'mouseup':
      case 'touchend':
        if (this.state.resizeMouseDown) {
          if (event.type === 'touchend') {
            this.redraw_toggle_btn = false;
          }

          this.setState({
            resizeMouseDown: false,
            position_btn: 0,
            positionSplitterItem: '',
            btnWidth: null,
            left: this.left
          });

          delete this.resizeClientX;
          delete this.resizeClientX_absolue;
          delete this.backlight;
          break;
        }
    }
  },

  handleClick(event){
    if (this.redraw_toggle_btn) {
      event.stopPropagation();
      event.preventDefault();
      this.redraw_toggle_btn = false;
    } else {
      this.props.events.onClick(event);
    }
  },

  render: function() {
    if (this.props.location === 'TOP') {
      return (
        <div className={this.backlight ? "p-abs w-100p toggle-visible" : "p-abs w-100p"}
             style={{'zIndex': 5}} data-role="toggleContainer"
             onMouseUp={this.handleResize} onMouseMove={this.handleResize}
             onTouchEnd={this.handleResize} onTouchMove={this.handleResize}>
          <button data-role="toggleButton" data-action="hideTopPart" style={{'left': this.state.left}}
                  onClick={this.handleClick}
                  onMouseDown={this.startResize}
                  onTouchEnd={this.startResize}
                  onTouchMove={this.startResize}
                  onTouchStart={this.startResize}>
            /\
          </button>
        </div>
      )
    } else if (this.props.location === 'BOTTOM') {
      if (this.props.data.bodyOptions.mode === "SETTINGS") {
        return <div></div>
      } else {
        return (
          <div className="p-abs w-100p"
               data-role="toggleContainer"
               onMouseUp={this.handleResize} onMouseMove={this.handleResize}
               onTouchEnd={this.handleResize} onTouchMove={this.handleResize}>
            <div className="p-abs"
                 className={this.backlight ? "p-abs w-100p toggle-visible" : "p-abs w-100p"}
                 style={{'bottom': 0}}>
              <button data-role="toggleButton" data-action="hideBottomPart" style={{'left': this.state.left}}
                      onClick={this.handleClick}
                      onMouseDown={this.startResize}
                      onTouchEnd={this.startResize}
                      onTouchMove={this.startResize}
                      onTouchStart={this.startResize}>\/
              </button>
            </div>
          </div>
        )
      }
    }
  }
});

extend_core.prototype.inherit(ToggleVisibleChatPart, dom_core);

export default ToggleVisibleChatPart;