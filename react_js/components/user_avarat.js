import React from 'react'
import ReactDOM from 'react-dom'
import event_bus from '../js/event_bus'
import extend_core from '../js/extend_core'
import dom_core from '../js/dom_core'
import users_bus from '../js/users_bus'
import Localization from '../js/localization'

import Popup from '../components/popup'

var size_file = 2000000,
  mode = {
    SHOW: "SHOW",
    EDIT: "EDIT"
  };
const UserAvatar = React.createClass({

  getInitialState(){
    return {
      mode: mode.SHOW
    }
  },

  componentWillMount(){
    let self = this;
    this.img = new Image();
    users_bus.getMyInfo(null, function(err, options, userInfo) {
      if (err) return console.error(err);
      if (userInfo.avatar_data) {
        self.img.src = userInfo.avatar_data;
        self.updateAvatar();
      }
    });
  },

  componentDidMount: function() {
    this.avatarContainer = ReactDOM.findDOMNode(this);
    this.form = this.avatarContainer.querySelector('form');
    this.input_file_elem = this.avatarContainer.querySelector('[name="avatar"]');
    this.canvas_elem = this.avatarContainer.querySelector('[data-role="preview_avatar"]');
    this.canvas_elem_ctx = this.canvas_elem.getContext('2d');

    this.input_file_elem.addEventListener('change', this.previewFile);
  },

  componentWillUnmount: function() {
    this.input_file_elem.removeEventListener('change', this.previewFile);
  },

  previewFile(){
    let self = this, reader = new FileReader();
    reader.onloadend = function(event) {
      self.img.src = reader.result;
      self.canvas_elem_ctx.drawImage(self.img, 0, 0, 300, 225);
      self._change_avatar = true;
    };

    if (this.input_file_elem.files[0]) {
      if (this.input_file_elem.files[0].size <= size_file) {
        reader.readAsDataURL(this.input_file_elem.files[0]);
      } else {
        this.form.reset();
        let newState;
        event_bus.trigger('changeStatePopup', {
          show: true,
          type: 'error',
          message: 116,
          onDataActionClick: function(action) {
            switch (action) {
              case 'confirmCancel':
                newState = Popup.prototype.handleClose(this.state);
                this.setState(newState);
                break;
            }
          }
        });
      }
    } else {
      this.form.reset();
      this.img.src = '';
      this.canvas_elem.width = this.canvas_elem.width;
    }
  },

  handleClick(event){
    let element = this.getDataParameter(event.currentTarget, 'action');
    if (element) {
      switch (element.dataset.action) {
        case 'saveAvatar':
          this.saveAvatar(element);
          break;
        case 'changeAvatar':
          this.changeAvatar(element);
          break;
        case 'closeChangeAvatar':
          this.closeChangeAvatar(element);
          break;
      }
    }
  },

  updateAvatar(){
    if (!this.canvas_elem_ctx) return;
    if (this.img.src && this.img.src !== '') {
      this.canvas_elem_ctx.drawImage(this.img, 0, 0, 300, 225);
    }
  },

  saveAvatar(){
    let self = this, newState;
    if (this._change_avatar){
      if (this.img.src !== '') {
        users_bus.getMyInfo(null, function(err, options, userInfo) {
          if (err) return console.error(err);

          userInfo.avatar_data = self.img.src;
          users_bus.saveMyInfo(userInfo, function() {
            event_bus.trigger('changeStatePopup', {
              show: true,
              type: 'success',
              message: 105,
              onDataActionClick: function(action) {
                switch (action) {
                  case 'confirmCancel':
                    newState = Popup.prototype.handleClose(this.state);
                    this.setState(newState);
                    self.setState({mode: mode.SHOW});
                    self._change_avatar = false;
                    self.form.reset();
                    break;
                }
              }
            });
          });
        });
      }
    } else {
      event_bus.trigger('changeStatePopup', {
        show: true,
        type: 'success',
        message: 118,
        onDataActionClick: function(action) {
          switch (action) {
            case 'confirmCancel':
              newState = Popup.prototype.handleClose(this.state);
              this.setState(newState);
              self.setState({mode: mode.SHOW});
              self._change_avatar = false;
              break;
          }
        }
      });
    }
  },

  changeAvatar(){
    this.setState({mode: mode.EDIT});
    this._change_avatar = false;
    this.previous_src = this.img.src;
  },

  closeChangeAvatar(){
    if (this._change_avatar) {
      this.img.src = this.previous_src;
      this.canvas_elem_ctx.drawImage(this.img, 0, 0, 300, 225);
    }
    this.form.reset();
    this.setState({mode: mode.SHOW});
  },

  render() {
    let self = this;
    return (
      <div className="textbox">
        <div className="title c-100">
          <div className="flex-item flex-wrap flex-align-c flex-item-auto">
            <label>{Localization.getLocText(117)}</label>
          </div>
        </div>
        <div className="flex-item flex-wrap flex-align-c flex-item-auto flex-dir-col">
          <canvas data-role="preview_avatar" width="300" height="225" className="margin-b-em"></canvas>
          <form enctype="multipart/form-data" method="post" className={(self.state.mode === mode.SHOW) ? 'hide' : ''}>
            <p><input type="file" name="avatar" accept="image/jpeg,image/png"/></p>
          </form>
          {(() => {
            if (self.state.mode === mode.SHOW) {
              return (
                <div className="w-100p p-t-b flex-sp-around c-200">

                <button data-action="changeAvatar" className="button-convex" onClick={this.handleClick}>
                  {Localization.getLocText(37)}
                </button>
                  </div>
              )
            } else if (self.state.mode === mode.EDIT) {
              return (
                <div className="w-100p p-t-b flex-sp-around c-200">
                  <button data-action="closeChangeAvatar" className="button-convex" onClick={this.handleClick} >
                    {Localization.getLocText(42)}
                  </button>
                  <button data-action="saveAvatar" className="button-convex" onClick={this.handleClick}>
                    {Localization.getLocText(43)}
                  </button>
                </div>
              )
            }
          }
          )()}
        </div>
      </div>
    )
  }
});

extend_core.prototype.inherit(UserAvatar, dom_core);

export default UserAvatar;