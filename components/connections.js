import React from 'react'

import webrtc from '../js/webrtc.js'
import users_bus from '../js/users_bus.js'
import event_bus from '../js/event_bus.js'

const Connections = React.createClass({

  getInitialState() {
    return {
      connections: [],
      contactsInfo: []
    }
  },

  componentWillMount() {
    this.getConnections();
  },

  componentDidMount() {
    event_bus.on('changeConnectionList', this.getConnections, this);
    event_bus.on('changeMyUsers', this.getConnections, this);
  },

  componentWillUnmount() {
    event_bus.off('changeConnectionList', this.getConnections, this);
    event_bus.off('changeMyUsers', this.getConnections, this);
  },

  shouldComponentUpdate(nextProps){
    if (!this.props.data.openedState && !nextProps.data.openedState){
      return false;
    } else {
      return true;
    }
  },

  getConnections() {
    let connections = webrtc.getAllConnections(), self = this, user_ids = [];
    connections.forEach(function(_connection) {
      if (_connection.users_ids.length) {
        _connection.users_ids.forEach(function(_user_id) {
          user_ids.push(_user_id);
        });
      }
    });
    if (user_ids.length) {
      users_bus.getContactsInfo(null, user_ids, function(_error, contactsInfo) {
        if (_error) {
          console.error(_error);
          return;
        }
        self.setState({connections: connections, contactsInfo: contactsInfo});
      })
    } else {
      this.setState({connections: connections});
    }
  },

  renderItems() {
    let items = [], self = this;

    this.state.connections.forEach(function(_connection) {
      let user_ids = [];
      _connection.users_ids.forEach(function(_user_id) {
        user_ids.push(
          <ol style={{'listStyleType': 'circle'}} key={_user_id}>
            <li>
              <div>
                {users_bus.getUserName(_user_id, self.state.contactsInfo)}
              </div>
              <div>
                {_user_id}
              </div>
            </li>
          </ol>
        );
      });

      items.push(
        <div key={_connection.ws_device_id}>
          <ol style={{'listStyleType': 'square'}}>
            <li>{_connection.ws_device_id}</li>
            {user_ids}
          </ol>
        </div>
      )
    });
    return items;
  },

  render() {
    let items = this.renderItems();
    return (
      <div>
        {items}
      </div>
    )
  }
});

export default Connections;