import React from 'react'

import localization from '../js/localization'
import chats_bus from '../js/chats_bus'
import extend_core from '../js/extend_core'
import dom_core from '../js/dom_core'
import event_bus from '../js/event_bus'
import users_bus from '../js/users_bus'
import webrtc from '../js/webrtc'

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
    event_bus.on('changeConnectionList', this.forceUpdate, this);
  },

  componentWillUnmount() {
    event_bus.off('changeUsersConnections', this.getContacts, this);
    event_bus.off('changeMyUsers', this.getContacts, this);
    event_bus.off('changeConnectionList', this.forceUpdate, this);
  },

  componentWillReceiveProps(nextProps){
    if (nextProps.data.user_ids !== this.initialUsers_ids) {
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

  getConnections(){
    this.setState({connections: webrtc.getChatConnections(webrtc.connections, this.props.data.chat_id)});
  },

  renderItems() {
    let items = [], self = this,
      users = users_bus.filterUsersByTypeDisplay(self.state.users, this.props.data.contactList_FilterOptions.typeDisplayContacts);
    if (this.props.data.contactList_PaginationOptions.show) {
      users = self.props.onLimitationQuantityRecords(users, self.props.data, self.props.data.bodyOptions.mode);
    }
    users.forEach(function(_user) {
      let deleted_contact = self.props.data.deleted_user_ids.indexOf(_user.user_id) !== -1,
        blocked_contact = self.props.data.blocked_user_ids.indexOf(_user.user_id) !== -1;
      items.push(
        <div key={_user.user_id} className="flex-sp-start margin-t-b" data-role="contactWrapper"
             data-user_id={_user.user_id}>
          <div className="width-40px flex-just-center">
            <img src={_user.avatar_data} width="35px" height="35px" className="border-radius-5"></img>
          </div>
          <div className="message flex-item-1-auto flex-dir-col flex-sp-between">
            <div className="text-bold">
              {_user.userName}</div>
            <div>{_user.is_deleted ? <span className="color-red">{localization.getLocText(156)}</span> :
              deleted_contact ? <span className="color-red">{localization.getLocText(148)}</span> :
              blocked_contact ? <span className="color-red"> {localization.getLocText(147)}</span> : null}
            </div>
            <div>
              {webrtc.getConnectionByUserId(_user.user_id) ? 
                <span className="color-green">{localization.getLocText(150)}</span> :
                <span className="color-blue">{localization.getLocText(149)}</span>}
            </div>
            <div className="flex-just-center">
              {self.renderUserButtons(_user, deleted_contact, blocked_contact, self.props.events.onClick)}
            </div>
          </div>
        </div>
      );
    });
    return items;
  },

  renderUserButtons(_user, deleted_contact, blocked_contact, onClick){
    const add_user_button = <div className="flex-just-center">
        <button data-action="makeFriends" onClick={onClick}>
          {localization.getLocText(66)}
        </button>
      </div>,
      add_contact_button = <button data-action="restoreUserInChat" onClick={onClick}>
        {localization.getLocText(143)}
      </button>,
      block_contact_button = <button data-action="blockUserInChat" onClick={onClick}>
        {localization.getLocText(144)}
      </button>,
      unblock_contact_button = <button data-action="unblockUserInChat" onClick={onClick}>
        {localization.getLocText(145)}
      </button>,
      delete_button = <button data-action="removeContact" onClick={onClick}>
        {localization.getLocText(142)}
      </button>;
    if (_user.userName === '-//-//-//-' || _user.is_deleted) {
      return add_user_button;
    }
    if (users_bus.isOwner(this.props.data.createdByUserId)) {
      if (deleted_contact) {
        return add_contact_button;
      }
      if (blocked_contact) {
        return <div>{unblock_contact_button}{delete_button}</div>;
      } else {
        return <div>{block_contact_button}{delete_button}</div>;
      }
    }
    return null;
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