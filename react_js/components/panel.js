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

var z_index = 80;


const Panel = React.createClass({
  getDefaultProps() {
    return {
      mainContainer: {
        "element": "div",
        "class": "flex-inner-container"
      },
      dateParent: {
        context: "",
        parent: "panel"
      },
      MODE: {
        LEFT: 'LEFT',
        RIGHT: "RIGHT"
      },
      leftBtnConfig: {
        "element": "button",
        "icon": "notepad_icon",
        "data": {
          "action": "togglePanel",
          "role": "mainButtonLeftPanel",
          "description": 46
        },
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
        "class": "panel-button right-panel-button "
      }
    }
  },

  getInitialState(){
    if (this.props.location === 'left') {
      return {
        activeTab: "CHATS",
        openedState: false,
        left: '-700px',
        toggleElemHide: false,
        toggleToolbarElemHide: true
      }
    }
    if (this.props.location === 'right') {
      return {
        activeTab: "",
        openedState: false,
        right: '-700px',
        toggleElemHide: false,
        toggleToolbarElemHide: true
      }
    }
  },

  componentDidMount(){
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
    this.togglePanelElement_clientWidth = this.togglePanelElement.clientWidth;
    this.resizePanel();
  },

  componentDidUpdate(){
    if(this.togglePanelElement.clientWidth !== 0){
      this.togglePanelElement_clientWidth = this.togglePanelElement.clientWidth;
    }
    this.resizePanel();
  },

  componentWillUnmount(){
    this.outer_container = null;
    this.togglePanelElement = null;
  },

  onClick(event){
    switch (event.currentTarget.dataset.action){
      case 'togglePanel':
        this.togglePanel();
        break;
      case 'togglePanel2':

        break;
    }
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

  calcMaxWidth: function() {
    return document.body.offsetWidth + 'px';
  },

  resizePanel: function(flag) {
    if (this.state.openedState) {
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
    let dateParent = this.props.dateParent;
    dateParent['context'] = location;

    let extra_toolbar_mode = location === 'left' ? this.state.activeTab : this.state.activeTab;

    let btnConfig = (location === 'left') ? this.props.leftBtnConfig : this.props.rightBtnConfig;
    let panel_toolbar_class = (location === 'left') ? 'w-100p flex-dir-col flex-item-auto c-200' : 'w-100p flex-dir-col c-200';

    var style = {[location] : this.state[location]} ;
    return (
      <section style={style} data-role={location + '_panel_outer_container'} className={location + '-panel hide p-fx panel animate c-100'}>
        <div className="p-rel h-100p flex-dir-col">
          <Triple_Element dateParent={dateParent} events={onEvent} config={btnConfig} hide={this.state.toggleElemHide}/>
          <div data-role={location + '_panel_inner_container'}
               className="min-width-350 flex-item-1-auto clear flex-dir-col h-100p">
            <header id={location} data-role={location + '_panel_toolbar'} className={panel_toolbar_class}>
            <PanelToolbar location={location} events={onEvent} hide={this.state.toggleToolbarElemHide} />
            </header>
            <div data-role={location + '_extra_toolbar_container'}
                 className="flex-sp-around flex-item-auto c-200">
              <PanelExtraToolbar mode={extra_toolbar_mode} events={onEvent} />
            </div>
            <div data-role={location + '_filter_container'} className="flex wrap flex-item-auto c-200">
            </div>
            <div data-role="panel_body" className="overflow-a flex-item-1-auto"></div>
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