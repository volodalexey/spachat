import React from 'react'
import { render } from 'react-dom'
import { createHistory, useBasename } from 'history'
import { Router, Route, Link, History, Redirect } from 'react-router'

import Less from '../less/total.less'

import Login from '../components/login'
import Register from '../components/register'

const history = useBasename(createHistory)({
    basename: '/index.html'
});

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

const Register2 = React.createClass({
    mixins: [History],

    render() {
        return (
            <div>
                <Link to="/chat">
                    <button>Login</button>
                    <h1></h1>
                </Link>
                <form>
                    <label>Name</label><input/><br />
                    <label>Password</label><input/><br />
                    <label>New password</label><input/><br />
                    <Link to="/chat">
                        <button>Register!</button>
                    </Link>
                </form>
            </div>
        )
    }
});

render((
<div data-role="main_container" className="w-100p h-100p p-abs">
  <div className="flex-outer-container p-fx">
  <Router history={history}>
    <Redirect from="/" to="/login"/>
    <Route path="/">
      <Route path="chat" component={Chat}/>
      <Route path="register" component={Register}/>
      <Route path="login" component={Login}/>
    </Route>
  </Router>
    </div>
</div>
), document.getElementById('app'));