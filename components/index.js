import React from 'react'
import {Router, Route, browserHistory} from 'react-router'

import localization from '../js/localization.js'
import users_bus from '../js/users_bus.js'

import Login from '../components/login'
import Chat_App from '../components/chat_app'

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
      replace('/account');
    }
  },
  redirectToLogin = function(nextState, replace) {
    if(nextState.location.search){
      browserHistory.desired_path = nextState.location.pathname;
      browserHistory.desired_search = nextState.location.search;
    }
      replace('/account');
  },
  Index = React.createClass({
    
    componentWillMount(){
      var language = localStorage.getItem('language');
      if (language && localization.lang !== language) {
        localization.setLanguage(language);
      }
    },

    render() {
      return (
        <Router history={browserHistory}>
          <Route path="/" onEnter={noMatchRedirect}/>
          <Route path="/">
            <Route path="account" component={Login}/>
            <Route path="chat" component={Chat_App} onEnter={requireAuth}/>
          </Route>
          <Route path="*" onEnter={noMatchRedirect}/>
        </Router>
      )
    }
  });

export default Index;