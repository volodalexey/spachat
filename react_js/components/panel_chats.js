import React from 'react'
import { Router, Route, Link, History, Redirect } from 'react-router'

import Location_Wrapper from './location_wrapper'

const PanelChats = React.createClass({

  componentDidMount(){
  },

  componentWillMount(){
  },

  renderItems(){
    var items = [], self = this;
    this.props.data.chat_ids.forEach(function(chat) {
      var result = this.props.data.openChatsInfoArray.indexOf(chat.chat_id);
      chat['pointerRotate'] = result;
      items.push(
        <div data-action="show_more_info" data-role="chatWrapper"
             data-chat_id={chat.chat_id} key={chat.chat_id}>
          <Location_Wrapper key={1} data={chat} events={this.props.events}
                            configs={this.props.configs.chats_info_config}/>

          {(() => {
            var resultClosing = self.props.data.closingChatsInfoArray.indexOf(chat.chat_id);
            if(resultClosing !== -1){
              return (<div data-role="detail_view_container" style={{maxHeight: '0em'}}
                           className="max-height-0" data-state="expanded" data-chat_id={chat.chat_id}>
                <Location_Wrapper key={1} data={chat} events={this.props.events}
                                  configs={this.props.configs.detail_view_config}/>
              </div>)
            } else {
              if (result !== -1) {
                return (<div data-role="detail_view_container" style={{maxHeight: '15em'}}
                             className="max-height-auto max-height-0"
                             data-state="expanded" data-chat_id={chat.chat_id}>
                  <Location_Wrapper key={1} data={chat} events={this.props.events}
                                    configs={this.props.configs.detail_view_config}/>
                </div>)
              } else {
                return <div data-role="detail_view_container" style={{maxHeight: '0em'}} className="max-height-0"
                            data-chat_id={chat.chat_id}></div>
              }
            }
          })()}
        </div>
      );
    }, this);
    return items;
  },

  render() {
    var items = [];
    if (this.props.data && this.props.data.chat_ids) {
      return <div>{this.renderItems()}</div>
    } else {
      return <div></div>
    }
  }
});

export default PanelChats;