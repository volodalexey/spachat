import React from 'react'
import { render } from 'react-dom'
import { createHistory, useBasename } from 'history'
import { Router, Route, Link, History, Redirect } from 'react-router'

const history = useBasename(createHistory)({
  basename: '/index.html'
});

//import Less from '../less/total.less'

import Login from '../components/login'
import Chat_App from '../components/chat_app'
import Register from '../components/register'
import Localization from '../js/localization.js'


const Index = React.createClass({
  componentDidMount(){
    Localization.setMainComponent(this);
    var language = localStorage.getItem('language');
    if(language && Localization.lang !== language){
      Localization.changeLanguage(language);
    }
  },

  componentWillMount(){
  },

  render(){
    return (
      <Router history={history}>
        <Redirect from="/" to="/login"/>
        <Route path="/">
          <Route path="chat" component={Chat_App}/>
          <Route path="register" component={Register}/>
          <Route path="login" component={Login}/>
        </Route>
      </Router>
    )
  }
});

export  default Index;