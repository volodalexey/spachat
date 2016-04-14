import React from 'react'
import {Router, Route, browserHistory} from 'react-router'

import Login from '../components/login'
import Chat_App from '../components/chat_app'
import Register from '../components/register'
import Localization from '../js/localization.js'

const requireAuth = function(nextState, replace) {
    if (!true) { // TODO authentication.isLoggedIn()
      redirectToLogin(nextState, replace);
    }
  },
  noMatchRedirect = function(nextState, replace) {
    if (true) { // TODO authentication.isLoggedIn()
      replace('/chat');
    } else {
      replace('/login');
    }
  },
  redirectToLogin = function(nextState, replace) {
    // nextState.location.pathname; TODO save and use after login
    replace('/login');
  },
  Index = React.createClass({
    componentDidMount: function() {
      Localization.setMainComponent(this);
      var language = localStorage.getItem('language');
      if (language && Localization.lang !== language) {
        Localization.changeLanguage(language);
      }
    },

    render: function() {
      return (
        <Router history={browserHistory}>
          <Route path="/" onEnter={noMatchRedirect}/>
          <Route path="/">
            <Route path="login" component={Login}/>
            <Route path="register" component={Register}/>
            <Route path="chat" component={Chat_App} onEnter={requireAuth}/>
          </Route>
          <Route path="*" onEnter={noMatchRedirect}/>
        </Router>
      )
    }
  });

export default Index;