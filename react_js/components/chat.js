import React from 'react'
import { Router, Route, Link, History, Redirect } from 'react-router'


const Chat = React.createClass({
  render() {
    return (
      <div>
        <h1>Welcome to chat!</h1>
        <Link to="/login">
          <button>Log out</button>
        </Link>
      </div>
    )
  }
});

export default Chat;