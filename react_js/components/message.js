import React from 'react'

import html_message from '../js/html_message'
import messages from '../js/messages'
import extend_core from '../js/extend_core'
import switcher_core from '../js/switcher_core'
import users_bus from '../js/users_bus'
import event_bus from '../js/event_bus'

import Body from '../components/body'

const Messages = React.createClass({
  avatar_url: '',

  getInitialState: function() {
    return {
      messages: [],
      userInfo: [],
      previousStart: 0,
      previousFinal: 0
    }
  },

  componentDidMount() {
    if (!this.props.data.userInfo) return;
    let user = this.renderAvatarUrl([this.props.data.userInfo])[0];
    this.setState({amICreator: user});
    event_bus.on('changeMyUserInfo', this.changeMyUserInfo, this);
  },

  componentWillUnmount() {
    event_bus.off('changeMyUserInfo', this.changeMyUserInfo, this);
  },

  componentDidUpdate: function(prevProps) {
    if (prevProps.data.userInfo !== this.props.data.userInfo) {
      if (!this.props.data.userInfo) return;
      let user = this.renderAvatarUrl([this.props.data.userInfo])[0];
      this.setState({amICreator: user});
    }
  },

  changeMyUserInfo(userId, chatId){
    if (chatId === this.props.data.chat_id) {
      let self = this;
      users_bus.getContactsInfo(null, [userId], function(_err, userInfo) {
        if (_err) return console.error(_err);
        self.state.userInfo.forEach(function(_user) {
          if (_user.user_id === userInfo.user_id) {
            _user.avatar_data = userInfo.avatar_data;
            _user = self.renderAvatarUrl([_user])[0];

          }
        });
        self.setState({userInfo: self.state.userInfo});
      });
    }
  },

  getMessages() {
    let self = this;
    messages.prototype.getAllMessages(this.props.data.chat_id, this.props.data.bodyOptions.mode, function(err, messages) {
      let currentOptions = self.optionsDefinition(self.props.data, self.props.data.bodyOptions.mode),
        po = currentOptions.paginationOptions,
        lo = currentOptions.listOptions;
      if (po.showEnablePagination) {
        messages = Body.prototype.limitationQuantityRecords(messages, self.props.data, self.props.data.bodyOptions.mode);
        if (lo.start !== self.state.previousStart || lo.final !== self.state.previousFinal) {
          self.setState({messages: messages, previousStart: lo.start, previousFinal: lo.final});
          self.getDataUsers(messages);
        }
      } else {
        if (messages && messages.length !== self.state.messages.length) {
          self.getDataUsers(messages);
          self.setState({messages: messages, previousStart: 0, previousFinal: 0});
        }
      }
    });
  },

  b64toBlob(b64Data, contentType, sliceSize) {
    contentType = contentType || '';
    sliceSize = sliceSize || 512;
    let byteCharacters = window.atob(b64Data), byteArrays = [];
    for (var offset = 0; offset < byteCharacters.length; offset += sliceSize) {
      let slice = byteCharacters.slice(offset, offset + sliceSize),
        byteNumbers = new Array(slice.length);
      for (var i = 0; i < slice.length; i++) {
        byteNumbers[i] = slice.charCodeAt(i);
      }
      let byteArray = new Uint8Array(byteNumbers);
      byteArrays.push(byteArray);
    }

    return new Blob(byteArrays, {type: contentType});
  },

  base64MimeType(encoded) {
    let result = null;
    if (typeof encoded !== 'string') {
      return result;
    }
    let mime = encoded.match(/data:([a-zA-Z0-9]+\/[a-zA-Z0-9-.+]+).*,.*/);
    if (mime && mime.length) {
      result = mime[1];
    }

    return result;
  },

  getDataUsers(messages){
    let usersId = {}, self = this;
    usersId[users_bus.getUserId()] = true;
    messages.forEach(function(_message) {
      usersId[_message.createdByUserId] = true;
    });
    let ids = Object.keys(usersId);
    users_bus.getContactsInfo(null, Object.keys(usersId), function(_error, userInfo) {
      if (_error) return console.error(_error);

      userInfo = self.renderAvatarUrl(userInfo);
      self.setState({userInfo: userInfo});
    });
  },

  renderAvatarUrl(usersInfo){
    let URL = window.URL || window.webkitURL, self = this;
    usersInfo.forEach(function(_user) {
      if (URL && _user.avatar_data) {
        let contentType = self.base64MimeType(_user.avatar_data);
        if (!contentType) return;

        let b64Data = _user.avatar_data.split(',')[1],
          blob = self.b64toBlob(b64Data, contentType);
        _user.avatar_url = URL.createObjectURL(blob);
      }
    });

    return usersInfo;
  },

  getUserParam(_userId, attribut){
    let value;
    if (!this.state.userInfo.length) return;
    this.state.userInfo.every(function(_userInfo) {
      if (_userInfo.user_id === _userId) {
        value = _userInfo[attribut];
      }
      return !value;
    });

    return value;
  },

  renderItems: function() {
    let self = this, items = [];
    self.state.messages.forEach(function(_message) {
      items.push(self.renderItem(_message));
    });
    return items;
  },

  renderItem: function(message) {
    let self = this;
    if (message.createdDatetime) {
      var timeCreated = new Date(message.createdDatetime);
      timeCreated = timeCreated.toISOString()
    }
    if (html_message.prototype.amICreator(message)) {
      return (
        <div className="flex-sp-start margin-t-b" key={message.messageId}>
          <div className="message myMessage flex-item-1-auto flex-dir-col flex-sp-between">
            <div className="message-container" dangerouslySetInnerHTML={{__html: message.innerHTML}}></div>
            <div className="date-format">
              {timeCreated}
            </div>
          </div>
          <div className="width-40px flex-just-center flex-dir-col">
            <img src={this.state.amICreator.avatar_url} width="35px" height="35px"
                 className="border-radius-5 flex-item-auto"/>
            <div className="user-info flex-item-1-auto c-01">{this.state.amICreator.userName}</div>
          </div>
        </div>
      )
    } else {
      if (message.receivedDatetime) {
        var timeReceived = new Date(message.receivedDatetime);
        timeReceived = timeReceived.toISOString()
      }
      return (
        <div className="flex-sp-start margin-t-b" key={message.messageId}>
          <div className="width-40px flex-just-center flex-dir-col">
            <img src={this.getUserParam(message.createdByUserId, 'avatar_url')} width="35px" height="35px"
                 className="border-radius-5 flex-item-auto"/>
            <div className="user-info c-50">{this.getUserParam(message.createdByUserId, 'userName')}</div>
          </div>
          <div className="message flex-item-1-auto flex-dir-col flex-sp-between">
            <div className="message-container" dangerouslySetInnerHTML={{__html: message.innerHTML}}></div>
            <div className="date-format">{timeCreated}</div>
            <div className="date-format">{timeReceived}</div>
          </div>
        </div>
      )
    }
  },

  render: function() {
    this.getMessages();
    return <div>{this.renderItems(this.state.messages)}</div>
  }
});

extend_core.prototype.inherit(Messages, switcher_core);

export default Messages;