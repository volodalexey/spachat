import React from 'react'
import Localization from '../js/localization.js'
import chats_bus from '../js/chats_bus.js'
import extend_core from '../js/extend_core.js'
import dom_core from '../js/dom_core.js'
import event_bus from '../js/event_bus.js'

import Body from '../components/body'
import Location_Wrapper from './location_wrapper'

const ContactList = React.createClass({

  getInitialState: function() {
    return {
      users: []
    }
  },

  componentWillMount: function() {
    this.getContacts();
  },

  componentDidMount: function() {
    event_bus.on('changeUsersConnections', this.getContacts, this);
    event_bus.on('changeMyUsers', this.getContacts, this);
  },

  componentWillUnmount: function() {
    event_bus.off('changeUsersConnections', this.getContacts, this);
    event_bus.off('changeMyUsers', this.getContacts, this);
  },

  getContacts(){
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

  handleClick: function(event) {
    let element = this.getDataParameter(event.currentTarget, 'action');
    if (element) {
      switch (element.dataset.action) {
        case 'makeFriends':
          this.makeFriends(element);
          break;
      }
    }
  },

  makeFriends(element){
    let userId = element.dataset.key;
    if (userId) {
      event_bus.trigger('makeFriends', userId, element);
    } else {
      console.error('Unable to get UserId');
    }
  },

  renderItems: function(configs) {
    let items = [], self = this, control_btn;
    this.state.users.forEach(function(_user) {
      items.push(
        <div key={_user.user_id} className="flex-sp-start margin-t-b">
          <div className="width-40px flex-just-center">
          </div>
          <div className="message flex-item-1-auto flex-dir-col flex-sp-between">
            <div className="text-bold">{_user.userName}</div>
            <div>{_user.user_id}</div>
            {(() => {
              if (_user.userName === '-//-//-//-') {
                return (
                  <div className="flex-just-center">
                    <button data-key={_user.user_id} data-action="makeFriends" onClick={self.handleClick}>
                      {Localization.getLocText(66)}
                    </button>
                  </div>
                )
              }
            })()}
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
extend_core.prototype.inherit(ContactList, dom_core);

export default ContactList;