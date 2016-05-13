import React from 'react'
import {Router, Route, browserHistory} from 'react-router'

import Localization from '../js/localization.js'
import users_bus from '../js/users_bus.js'

import Login from '../components/login'
import Chat_App from '../components/chat_app'
import Register from '../components/register'


const requireAuth = function(nextState, replace) {
    users_bus.checkLoginState();
    if (!users_bus.getUserId()) {
      redirectToLogin(nextState, replace);
    }
  },
  noMatchRedirect = function(nextState, replace) {
    users_bus.checkLoginState();
    if (users_bus.getUserId()) {
      replace('/chat');
    } else {
      replace('/login');
    }
  },
  redirectToLogin = function(nextState, replace) {
    if(nextState.location.search){
      browserHistory.desired_path = nextState.location.pathname;
      browserHistory.desired_search = nextState.location.search;
    }
      replace('/login');
  },
  Index = React.createClass({
    componentWillMount(){
      var language = localStorage.getItem('language');
      if (language && Localization.lang !== language) {
        Localization.setLanguage(language);
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