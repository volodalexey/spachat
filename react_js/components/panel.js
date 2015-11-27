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

  getInitialState(){
    return {
      left_activeTab: "CHATS",
      right_activeTab: ""
    }
  },

  onClick(){
    console.log('click panel');

  },

  onInput(){

  },

  onTransitionEnd(){

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

    let extra_toolbar_mode = location === 'left' ? this.state.left_activeTab : this.state.right_activeTab;

    let btnConfig = (location === 'left') ? this.props.leftBtnConfig : this.props.rightBtnConfig;
    let panel_toolbar_class = (location === 'left') ? 'w-100p flex-dir-col flex-item-auto c-200' : 'w-100p flex-dir-col c-200';
    return (
      <section data-role={location + '_panel_outer_container'} className={location + '-panel p-fx panel animate c-100'}>
        <div className="p-rel h-100p flex-dir-col">
          <Triple_Element dateParent={dateParent} events={onEvent} config={btnConfig}/>
          <div data-role={location + '_panel_inner_container'}
               className="min-width-350 flex-item-1-auto clear flex-dir-col h-100p">
            <header id={location} data-role={location + '_panel_toolbar'} className={panel_toolbar_class}>
            <PanelToolbar location={location} events={onEvent} />
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