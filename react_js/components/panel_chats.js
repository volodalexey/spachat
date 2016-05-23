import React from 'react'
import localization from '../js/localization'
import users_bus from '../js/users_bus'

import Location_Wrapper from './location_wrapper'

const PanelChats = React.createClass({

  getInitialState(){
    return {
      usersInfo: {}
    }
  },

  componentDidMount(){
    this.state.usersInfo[this.props.data.myId] = this.props.data.myName;
    this.setState({usersInfo: this.state.usersInfo});
  },

  renderItems() {
    let items = [], self = this, usersList;
    this.props.data.chat_ids.forEach(function(chat) {
      var result = this.props.data.openChatsInfoArray.indexOf(chat.chat_id);
      chat['pointerRotate'] = result;
      var calcDisplay = function(config) {
        if (self.props.data && self.props.data.openChats && config.data) {
          if (self.props.data.openChats[chat.chat_id]) {
            if (config.data.action === 'showChat') {
              return false;
            }
          } else {
            if (config.data.action === 'closeChat') {
              return false;
            }
          }
        }
        return true;
      };
      let usersNameList = [], newUserName = [];
      if (result !== -1) {
        chat.user_ids.forEach(function(user, index, array) {
          if (self.state.usersInfo[user]) {
            usersNameList.push(self.state.usersInfo[user]);
            if (index !== array.length - 1) {
              usersNameList.push(', ');
            }
          } else {
            newUserName.push(user);
          }
        });
        if (newUserName.length) {
          users_bus.getContactsInfo(null, newUserName, function(_error, usersInfo) {
            if (_error) {
              console.error(_error);
              return;
            }
            usersInfo.forEach(function(_user) {
              if (!self.state.usersInfo[_user.user_id]) {
                self.state.usersInfo[_user.user_id] = _user.userName;
                self.setState({usersInfo: self.state.usersInfo});
              }
            });
          });
        }
      }

      usersList = <div>{usersNameList}</div>;
      items.push(
        <div data-action="show_more_info" data-role="chatWrapper"
             data-chat_id={chat.chat_id} key={chat.chat_id} className="margin-b-em">
          <Location_Wrapper key={1} data={chat} events={this.props.events}
                            configs={this.props.configs.chats_info_config}/>
          <label>{localization.getLocText(125)} {chat.user_ids.length}</label>
          {(() => {
            let resultClosing = this.props.data.closingChatsInfoArray.indexOf(chat.chat_id);
            if (resultClosing !== -1) {
              return (<div data-role="detail_view_container" style={{maxHeight: '0em'}}
                           className="max-height-0" data-state="expanded" data-chat_id={chat.chat_id}>{usersList}
                <Location_Wrapper key={chat.chat_id} data={chat} events={this.props.events}
                                  configs={this.props.configs.detail_view_config}
                                  calcDisplay={calcDisplay}/>
              </div>)
            } else {
              if (result !== -1) {
                return (<div data-role="detail_view_container" style={{maxHeight: '15em'}}
                             className="max-height-auto max-height-0"
                             data-state="expanded" data-chat_id={chat.chat_id}>{usersList}
                  <Location_Wrapper key={chat.chat_id} data={chat} events={this.props.events}
                                    configs={this.props.configs.detail_view_config}
                                    calcDisplay={calcDisplay}/>
                </div>)
              } else {
                return <div data-role="detail_view_container" style={{maxHeight: '0em'}} className="max-height-0"
                            data-chat_id={chat.chat_id}></div>
              }
            }
          })()}
        </div>
      );
    }, this);
    return items;
  },

  render() {
    if (this.props.data && this.props.data.chat_ids) {
      return <div>{this.renderItems()}</div>
    } else {
      return <div></div>
    }
  }
});

export default PanelChats;