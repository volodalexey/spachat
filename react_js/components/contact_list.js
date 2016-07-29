import React from 'react'

import localization from '../js/localization.js'
import chats_bus from '../js/chats_bus.js'
import extend_core from '../js/extend_core.js'
import dom_core from '../js/dom_core.js'
import event_bus from '../js/event_bus.js'
import users_bus from '../js/users_bus.js'

import Body from '../components/body'

const ContactList = React.createClass({

  getInitialState() {
    return {
      users: []
    }
  },

  componentWillMount() {
    this.getContacts();
  },

  componentDidMount() {
    event_bus.on('changeUsersConnections', this.getContacts, this);
    event_bus.on('changeMyUsers', this.getContacts, this);
  },

  componentWillUnmount() {
    event_bus.off('changeUsersConnections', this.getContacts, this);
    event_bus.off('changeMyUsers', this.getContacts, this);
  },

  componentWillReceiveProps(nextProps){
    if(nextProps.data.user_ids !== this.initialUsers_ids){
      this.getContacts();
    }
  },

  getContacts(){
    let self = this;
    chats_bus.getChatContacts(this.props.data.chat_id, function(error, contactsInfo) {
      self.initialUsers_ids = self.props.data.user_ids;
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

  handleClick(event) {
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

  renderItems() {
    let items = [], self = this,
      users = users_bus.filterUsersByTypeDisplay(self.state.users, this.props.data.contactList_FilterOptions.typeDisplayContacts);
    if(this.props.data.contactList_PaginationOptions.show){
      users = self.props.onLimitationQuantityRecords(users, self.props.data, self.props.data.bodyOptions.mode);
    }
    users.forEach(function(_user) {
      const add_user_button = <div className="flex-just-center">
        <button data-key={_user.user_id} data-action="makeFriends" onClick={self.handleClick}>
          {localization.getLocText(66)}
        </button>
      </div>;
      items.push(
        <div key={_user.user_id} className="flex-sp-start margin-t-b">
          <div className="width-40px flex-just-center">
            <img src={_user.avatar_data} width="35px" height="35px" className="border-radius-5"></img>
          </div>
          <div className="message flex-item-1-auto flex-dir-col flex-sp-between">
            <div className="text-bold">
              {_user.is_deleted ? <span style={{color: 'red'}}> ! </span> : null}
              {_user.userName}</div>
            <div>{_user.user_id}</div>
            {_user.userName === '-//-//-//-' || _user.is_deleted ? add_user_button : null}
          </div>
        </div>
      );
    });
    return items;
  },

  render() {
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