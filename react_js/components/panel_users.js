import React from 'react'
import { Router, Route, Link, History, Redirect } from 'react-router'


const PanelUsers = React.createClass({
  renderItems(){
    var items =[];
    this.props.data.forEach(function(user){
      items.push(
        <div className="flex-sp-start margin-t-b" key={user.user_id}>
          <div className="width-40px flex-just-center"><img src="img\app\3.ico" width="35px" height="35px" className="border-radius-5" /></div>
          <div className="message flex-item-1-auto flex-dir-col flex-sp-between">
            <div>User name: {user.userName}</div>
            <div>User id: {user.user_id}</div>
          </div>
        </div>
      )
    });
    return items;
  },

  render() {
    if (this.props.data && this.props.data.length){
      return <div>{this.renderItems()}</div>
    } else  {
      return <div></div>
    }
  }
});

export default PanelUsers;