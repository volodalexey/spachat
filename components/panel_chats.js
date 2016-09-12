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

  calcDisplay(el_config, el_data) {
    let data = this.props.data;
    if (data && data.openChats && el_config.data) {
      if (data.openChats[el_data.chat_id]) {
        if (el_config.data.action === 'showChat') {
          return false;
        }
      } else {
        if (el_config.data.action === 'closeChat') {
          return false;
        }
      }
    }
    return true;
  },

  renderItems() {
    let items = [], usersList;
    this.props.data.chat_ids.forEach(chat => {
      let
        state = this.state,
        props = this.props,
        configs = props.configs,
        events = props.events,
        usersInfo = state.usersInfo,
        chat_id = chat.chat_id,
        indexOpening = props.data.openChatsInfoArray.indexOf(chat_id),
        indexClosing = props.data.closingChatsInfoArray.indexOf(chat_id),
        usersNameList = [], newUserName = [];
      chat['pointerRotate'] = indexOpening;
      if (indexOpening !== -1) {
        chat.user_ids.forEach((user, index, array) => {
          if (usersInfo[user]) {
            usersNameList.push(usersInfo[user]);
            if (index !== array.length - 1) {
              usersNameList.push(', ');
            }
          } else {
            newUserName.push(user);
          }
        });
        if (newUserName.length) {
          users_bus.getContactsInfo(null, newUserName, (_error, _usersInfo) => {
            if (_error) {
              console.error(_error);
              return;
            }
            _usersInfo.forEach(_user => {
              if (!usersInfo[_user.user_id]) {
                usersInfo[_user.user_id] = _user.userName;
                this.setState({usersInfo: usersInfo});
              }
            });
          });
        }
      }

      usersList = <div>{usersNameList}</div>;
      items.push(
        <div data-action="show_more_info" data-role="chatWrapper"
             data-chat_id={chat_id} key={chat_id} className="margin-b-em">
          <Location_Wrapper key={1} data={chat} events={events}
                            configs={configs.chats_info_config}/>
          <label>{localization.getLocText(125)} {chat.user_ids.length}</label>
          {(() => {
            if (indexClosing !== -1) {
              return (<div data-role="detail_view_container"
                           className="tr-transform"
                           data-state="expanded"
                           data-chat_id={chat_id}>
                {usersList}
                <Location_Wrapper key={chat_id} data={chat} events={events}
                                  configs={configs.detail_view_config}
                                  calcDisplay={this.calcDisplay}/>
              </div>)
            } else {
              if (indexOpening !== -1) {
                return (<div data-role="detail_view_container"
                             className="tr-transform opened"
                             data-state="expanded"
                             data-chat_id={chat_id}>
                  {usersList}
                  <Location_Wrapper key={chat_id} data={chat} events={events}
                                    configs={configs.detail_view_config}
                                    calcDisplay={this.calcDisplay}/>
                </div>)
              } else {
                return <div data-role="detail_view_container"
                            className="tr-transform"
                            data-chat_id={chat_id}></div>
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