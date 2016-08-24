import React from 'react'
import Localization from '../js/localization'
import users_bus from '../js/users_bus.js'

const PanelUsers = React.createClass({
  
  renderItems(){
    let items = [], self = this; 
      // users = users_bus.filterUsersByTypeDisplay(this.props.data, this.props.type);
    const delete_button = <div className="flex-just-center">
        <button className="button-inset-square" data-action="removeUser"
                onClick={self.props.events.onClick}>
          {Localization.getLocText(131)}
        </button>
      </div>;
    this.props.data.forEach(function(user) {
      let add_user_button = <div className="flex-just-center">
        <button data-key={user.user_id} data-action="makeFriends" onClick={self.props.events.onClick}>
          {Localization.getLocText(66)}
        </button>
      </div>;
      items.push(
        <div className="flex-sp-start margin-t-b" key={user.user_id} data-user_id={user.user_id}
             data-role="userWrapper">
          <div className="width-40px flex-just-center">
            <img src={user.avatar_data} width="35px" height="35px" className="border-radius-5"/>
          </div>
          <div className="message flex-item-1-auto flex-dir-col flex-sp-between">
            <div>
              {user.is_deleted ? <span className="color-red"> ! </span> : null}
              User name: {user.userName}</div>
            <div>User id: {user.user_id}</div>
            {user.is_deleted ? add_user_button : delete_button}
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