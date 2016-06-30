import React from 'react'
import Localization from '../js/localization'

const PanelUsers = React.createClass({

  prepareData(users, type){
    let display_users = [];
    switch (type) {
      case 'all':
        display_users = users;
        break;
      case 'current':
        users.forEach(function(_user) {
          if (!_user.is_deleted) {
            display_users.push(_user);
          }
        });
        break;
      case 'deleted':
        users.forEach(function(_user) {
          if (_user.is_deleted) {
            display_users.push(_user);
          }
        });
        break;
    }

    return display_users;
  },

  renderItems(){
    let items = [], self = this, users = this.prepareData(this.props.data, this.props.type);
    users.forEach(function(user) {
      items.push(
        <div className="flex-sp-start margin-t-b" key={user.user_id} data-user_id={user.user_id}
             data-role="userWrapper">
          <div className="width-40px flex-just-center">
            <img src={user.avatar_data} width="35px" height="35px" className="border-radius-5"/>
          </div>
          <div className="message flex-item-1-auto flex-dir-col flex-sp-between">
            <div>{
              (()=> {
                if (user.is_deleted) {
                  return <span style={{color: 'red'}}> ! </span>
                }
              })()
            }User name: {user.userName}</div>
            <div>User id: {user.user_id}</div>
            {(() => {
              if (!user.is_deleted) {
                return <div className="flex-just-center">
                  <button className="button-inset-square" data-action="removeContact"
                          onClick={self.props.events.onClick}>
                    {Localization.getLocText(131)}
                  </button>
                </div>
              }
            })()}
          </div>
        </div>
      )
    });
    return items;
  },

  render() {
    if (this.props.data && this.props.data.length) {
      return <div>{this.renderItems()}</div>
    } else {
      return <div></div>
    }
  }
});

export default PanelUsers;