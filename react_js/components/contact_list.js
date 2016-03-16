import React from 'react'

import chats_bus from '../js/chats_bus.js'

import Body from '../components/body'

import Location_Wrapper from './location_wrapper'

const ContactList = React.createClass({

  getInitialState: function() {
    return {
      users: []
    }
  },

  componentWillMount: function() {
    let self = this;
    chats_bus.getChatContacts(this.props.data.chat_id, function(error, contactsInfo) {
      if (error) {
        console.error(error);
        return;
      }

      if (contactsInfo) {
        if (self.props.data.contactList_PaginationOptions.show) {
          contactsInfo = Body.prototype.limitationQuantityRecords(contactsInfo, self.props.data, self.props.data.bodyOptions.mode);
          self.setState({users: contactsInfo});
        }
        self.setState({users: contactsInfo});
      }
    });
  },

  renderItems: function(configs) {
    let items = [];
    this.state.users.forEach(function(_user) {
      items.push(
        <div key={_user.user_id} className="flex-sp-start margin-t-b">
          <div className="width-40px flex-just-center">
            <img src="img\app\3.ico" width="35px" height="35px" className="border-radius-5"></img>
          </div>
          <div className="message flex-item-1-auto flex-dir-col flex-sp-between">
            <div>{_user.userName}</div>
            <div>{_user.user_id}</div>
          </div>
        </div>
      );
    });
    return items;
  },

  render: function() {
    if (this.state.users.length) {
      let items = this.renderItems();
      return (
        <div>
          {items}
        </div>
      )
    } else {
      return <div></div>
    }
  }
});

export default ContactList;