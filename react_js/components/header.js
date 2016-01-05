import React from 'react'
import { Router, Route, Link, History, Redirect } from 'react-router'

const Header = React.createClass({
  render() {
    return (
      <header data-role="header_container" className="modal-header">
        <h1>Header</h1>
        <div data-role="waiter_container"></div>
      </header>
    )
  }
});

export default Header;