import React from 'react'
import { render } from 'react-dom'
import Localization from '../js/localization.js'

import Location_Wrapper from './location_wrapper'
import Triple_Element from '../components/triple_element'
import Popup from '../components/popup'
import Decription from '../components/description'
import ChatResize from '../components/chat_resize'
import PanelExtraToolbar from '../components/panel_extra_toolbar'
import PanelToolbar from '../components/panel_toolbar'
import Body from '../components/body'

var z_index = 80;

const MODE = {
  CREATE_CHAT: 'CREATE_CHAT',
  JOIN_CHAT: 'JOIN_CHAT',
  CHATS: 'CHATS',
  USERS: 'USERS',
  JOIN_USER: 'JOIN_USER',

  USER_INFO_EDIT: 'USER_INFO_EDIT',
  USER_INFO_SHOW: 'USER_INFO_SHOW',
  DETAIL_VIEW: 'DETAIL_VIEW',

  CONNECTIONS: 'CONNECTIONS',

  CREATE_BLOG: 'CREATE_BLOG',
  JOIN_BLOG: 'JOIN_BLOG',
  BLOGS: 'BLOGS',

  PAGINATION: "PAGINATION",
  GO_TO: "GO_TO",
  FILTER: 'FILTER'
};


const Panel = React.createClass({
  getDefaultProps() {
    return {
      mainContainer: {
        "element": "div",
        "class": "flex-inner-container"
      },
      leftBtnConfig: {
        "element": "button",
        "icon": "notepad_icon",
        "data": {
          "action": "togglePanel",
          "role": "mainButtonLeftPanel",
          "description": 46
        },
        onload: true,
        "class": "panel-button left-panel-button "
      },
      rightBtnConfig: {
        "element": "button",
        "icon": "folder_icon",
        "data": {
          "action": "togglePanel",
          "role": "mainButtonRightPanel",
          "description": 47
        },
        onload: true,
        "class": "panel-button right-panel-button "
      }
    }
  },

  getInitialState(){
    if (this.props.location === 'left') {
      return {
        //activeTab: "CHATS",
        openedState: false,
        left: '-700px',
        toggleElemHide: false,
        toggleToolbarElemHide: true,
        bodyMode: "CHATS"
      }
    }
    if (this.props.location === 'right') {
      return {
        //activeTab: "",
        openedState: false,
        right: '-700px',
        toggleElemHide: false,
        toggleToolbarElemHide: true,
        bodyMode: "USER_INFO_SHOW"
      }
    }
  },

  componentDidMount(){
    document.addEventListener('load', this.onLoad, true);
    document.addEventListener('resize', this.handleResize);

    if(this.props.location === "left"){
      this.outer_container = document.querySelector('[data-role="left_panel_outer_container"]');
      this.inner_container = document.querySelector('[data-role="left_panel_inner_container"]');
      this.outer_container.style.right = '100vw';
    }
    if(this.props.location === "right"){
      this.outer_container = document.querySelector('[data-role="right_panel_outer_container"]');
      this.inner_container = document.querySelector('[data-role="right_panel_inner_container"]');
      this.outer_container.style.left = '100vw';
    }
    this.togglePanelElement = this.outer_container.querySelector('[data-action="togglePanel"]');
    this.togglePanelElementToolbar = this.outer_container.querySelector('[data-role="togglePanelToolbar"]');

    this.outer_container.classList.remove("hide");
    this.outer_container.style.maxWidth = window.innerWidth + 'px';
    this.outer_container.style.zIndex = z_index;
  },

  componentWillUnmount: function() {
    window.removeEventListener('load', this.onLoad);
    document.removeEventListener('resize', this.handleResize);
    this.outer_container = null;
    this.inner_container = null;
    this.togglePanelElement = null;
    this.togglePanelElementToolbar = null;
  },

  componentDidUpdate(){
    this.resizePanel();
  },

  onClick(event){
    switch (event.currentTarget.dataset.action){
      case 'togglePanel':
        this.togglePanel();
        break;
      case 'switchPanelMode':
        this.switchPanelMode(event.currentTarget);
        break;
    }
  },

  onLoad: function(event) {
    if(!this.togglePanelElement) return;
    if(this.props.location === "left" && event.target.dataset.onload){
      this.togglePanelElement_clientWidth = this.togglePanelElement.clientWidth;
    }
    if(this.props.location === "right" && event.target.dataset.onload){
      this.togglePanelElement_clientWidth = this.togglePanelElement.clientWidth;
    }
    this.resizePanel();
  },

  onInput(){

  },

  onTransitionEnd(){

  },

  togglePanel(forceClose){
    this.openOrClosePanel(this.outer_container.clientWidth + this.togglePanelElement.clientWidth >
      document.body.clientWidth, forceClose);
  },

  openOrClosePanel(bigMode, forceClose) {
    if(this.props.location === 'left' && this.outer_container.style.right === '100vw'){
      this.outer_container.style.right = '';
    }
    if(this.props.location === 'right' && this.outer_container.style.left === '100vw'){
      this.outer_container.style.left = '';
    }

    if (!forceClose && !this.state.openedState) {
      this.previous_z_index = this.outer_container.style.zIndex;
      this.outer_container.style.zIndex = ++z_index;
      this.inner_container.style.maxWidth = this.calcMaxWidth();
      this.setState({
        openedState: true,
        [this.props.location]: '0px'
      });
    } else{
      z_index--;
      this.setState({
        openedState: false,
        [this.props.location]: (-this.outer_container.offsetWidth) + 'px'
      });
      this.outer_container.style.zIndex = this.previous_z_index;
      if (bigMode === true) {
        this.setState({
          toggleElemHide: false,
          toggleToolbarElemHide: true
        });
      } else {
        this.setState({
          toggleElemHide: false
        });
      }
    }
  },

  switchPanelMode: function(element) {
    if (element.dataset.mode_to === MODE.USER_INFO_SHOW && this.previous_UserInfo_Mode) {
      this.setState({bodyMode: this.previous_UserInfo_Mode});
    } else {
      this.setState({bodyMode: element.dataset.mode_to});
    }
    this.previous_Filter_Options = false;

      if (this.previous_BodyMode && this.previous_BodyMode !== this.state.bodyMode) {
        //this.showSpinner(this.body_container);
      }
      this.previous_BodyMode = this.state.bodyMode;

    if (this.state.bodyMode === MODE.USER_INFO_SHOW) {
      this.previous_UserInfo_Mode = MODE.USER_INFO_SHOW;
    }
  },

  calcMaxWidth: function() {
    return document.body.offsetWidth + 'px';
  },

  resizePanel: function(flag) {
    if (this.state.openedState && this.outer_container) {
      if (this.outer_container.clientWidth + this.togglePanelElement_clientWidth > document.body.clientWidth) {
        this.inner_container.style.maxWidth = this.calcMaxWidth();

        if (!this.state.toggleElemHide){
          this.setState({
            toggleElemHide: true
          });
        }
        if (this.togglePanelElementToolbar) {
          if(this.state.toggleToolbarElemHide){
            this.setState({
              toggleToolbarElemHide: false
            });
          }
        }
      }
      else {
        if (this.state.toggleElemHide){
          this.setState({
            toggleElemHide: false
          });
        }
        if (this.togglePanelElementToolbar) {
          if(!this.state.toggleToolbarElemHide){
            this.setState({
              toggleToolbarElemHide: true
            });
          }
        }
      }
    } else {
      if (this.state.toggleElemHide){
        this.setState({
          toggleElemHide: false
        });
      }
    }
  },

  render() {
    let onEvent = {
      onClick: this.onClick,
      onInput: this.onInput,
      onTransitionEnd: this.onTransitionEnd
    };

    let location = this.props.location;


    let btnConfig = (location === 'left') ? this.props.leftBtnConfig : this.props.rightBtnConfig;
    let panel_toolbar_class = (location === 'left') ? 'w-100p flex-dir-col flex-item-auto c-200' : 'w-100p flex-dir-col c-200';

    var style = {[location] : this.state[location]} ;
    return (
      <section style={style} data-role={location + '_panel_outer_container'} className={location + '-panel hide p-fx panel animate c-100'}>
        <div className="p-rel h-100p flex-dir-col">
          <Triple_Element events={onEvent} config={btnConfig} hide={this.state.toggleElemHide}/>
          <div data-role={location + '_panel_inner_container'}
               className="min-width-350 flex-item-1-auto clear flex-dir-col h-100p">
            <header id={location} data-role={location + '_panel_toolbar'} className={panel_toolbar_class}>
            <PanelToolbar location={location} mode={this.state.bodyMode} events={onEvent} hide={this.state.toggleToolbarElemHide} />
            </header>
            <div data-role={location + '_extra_toolbar_container'}
                 className="flex-sp-around flex-item-auto c-200">
              <PanelExtraToolbar mode={this.state.bodyMode} events={onEvent} />
            </div>
            <div data-role={location + '_filter_container'} className="flex wrap flex-item-auto c-200">
            </div>
            <div data-role="panel_body" className="overflow-a flex-item-1-auto">
              <Body mode={this.state.bodyMode} events={onEvent} />
            </div>
            <footer className="flex-item-auto">
              <div data-role={location + '_go_to_container'} className="c-200"></div>
              <div data-role={location + '_pagination_containe'}
                   className="flex filter_container justContent c-200"></div>
            </footer>
          </div>
        </div>
      </section>
    )
  }
});




export default Panel;