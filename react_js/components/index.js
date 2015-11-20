import React from 'react'
import { render } from 'react-dom'
import { createHistory, useBasename } from 'history'
import { Router, Route, Link, History, Redirect } from 'react-router'

const history = useBasename(createHistory)({
  basename: '/index.html'
});

import Less from '../less/total.less'

import Login from '../components/login'
import Register from '../components/register'
import Triple_Element from '../components/triple_element'

import Localization from '../js/localization.js'

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

const Index = React.createClass({
  getDefaultProps(){
    return {
      leftBtnConfig: {
        "element": "button",
        "icon": "notepad_icon",
        "data": {
          "action": "togglePanel",
          "role": "mainButtonLeftPanel",
          "description": 46
        },
        "class": "panel-button left-panel-button"
      },
      rightBtnConfig: {
        "element": "button",
        "icon": "folder_icon",
        "data": {
          "action": "togglePanel",
          "role": "mainButtonRightPanel",
          "description": 47
        },
        "class": "panel-button right-panel-button"
      }
    }
  },

  componentDidMount(){
    Localization.setMainComponent(this);
  },

  render(){
    return (
      <div>
        <section data-role="left_panel_outer_container" className="p-fx panel left-panel animate hide c-100">
          <div className="p-rel h-100p flex-dir-col">
            <Triple_Element config={this.props.leftBtnConfig}/>
            <div data-role="left_panel_inner_container"
                 className="min-width-350 flex-item-1-auto clear flex-dir-col h-100p">
              <header data-role="left_panel_toolbar" className="w-100p flex-dir-col flex-item-auto c-200"></header>
              <div data-role="left_extra_toolbar_container" className="flex-sp-around flex-item-auto c-200"></div>
              <div data-role="left_filter_container" className="flex wrap flex-item-auto c-200"></div>
              <div data-role="panel_body" className="overflow-a flex-item-1-auto"></div>
              <footer className="flex-item-auto">
                <div data-role="left_go_to_container" className="c-200"></div>
                <div data-role="left_pagination_container" className="flex filter_container justContent c-200"></div>
              </footer>
            </div>
          </div>
        </section>

        <section data-role="right_panel_outer_container" className="p-fx panel right-panel animate hide c-100">
          <div className="p-rel h-100p flex-dir-col">
            <Triple_Element config={this.props.rightBtnConfig}/>
            <div data-role="right_panel_inner_container"
                 className="min-width-350 flex-item-1-auto clear flex-dir-col h-100p">
              <header data-role="right_panel_toolbar" className="w-100p flex-dir-col c-200"></header>
              <div data-role="right_extra_toolbar_container" className="flex-sp-around flex-item-auto c-200"></div>
              <div data-role="right_filter_container" className="flex wrap flex-item-auto c-200"></div>
              <div data-role="panel_body" className=" overflow-a flex-item-1-auto"></div>
              <footer className="flex-item-auto">
                <div data-role="right_go_to_container" className="c-200"></div>
                <div data-role="right_pagination_container" className="flex filter_container justContent c-200"></div>
              </footer>
            </div>
          </div>
        </section>

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

        <div data-role="popap_outer_container" className="flex-outer-container p-fx popap hidden-popap">
          <div data-role="popap_inner_container" className="c-50 border-radius-05em min-width-350"></div>
        </div>
        <div data-role="description" className="description opacity-0"></div>
        <div data-role="chat_resize_container" className="clear chat-resize-container">
          <div className="line" data-role="resize_line"></div>
        </div>
      </div>
    )
  }
});

export  default Index;