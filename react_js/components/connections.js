import React from 'react'

import webrtc from '../js/webrtc.js'
import users_bus from '../js/users_bus.js'
import event_bus from '../js/event_bus.js'

import Location_Wrapper from './location_wrapper'

const Connections = React.createClass({

  getInitialState: function() {
    return {
      connections: [],
      contactsInfo: []
    }
  },

  componentWillMount: function() {
    let self = this;
    this.getConnections();

  },

  componentDidMount: function() {
    event_bus.on('createConnection', this.getConnections, this);
  },

  componentWillUnmount: function() {
    event_bus.off('createConnection', this.getConnections, this);
  },

  getConnections: function() {
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

  getUserName: function(_user_id) {
    let user_name;
    this.state.contactsInfo.every(function(_contactInfo) {
      if (_contactInfo.user_id === _user_id) {
        user_name = _contactInfo.userName;
      }
      return !user_name;
    });

    return user_name;
  },

  renderItems: function(configs) {
    let items = [], self = this;

    this.state.connections.forEach(function(_connection) {
      let user_ids = [];
      _connection.users_ids.forEach(function(_user_id) {
        user_ids.push(
          <ol style={{'listStyleType': 'circle'}} key={_user_id}>
            <li>
              <div>
                {self.getUserName(_user_id)}
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

  render: function() {
    let items = this.renderItems();
    return (
      <div>
        {items}
      </div>
    )
  }
});

export default Connections;