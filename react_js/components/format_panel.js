import React from 'react'

import users_bus from '../js/users_bus.js'

import Location_Wrapper from './location_wrapper'

const FormatPanel = React.createClass({
  getDefaultProps() {
    return {
      mainContainer: {
        "element": "div",
        "class": "btnEditPanel flex-align-c ",
        "data": {
          "role": 'btnEditPanel'
        }
      },
      configs: [
        {
          "role": "locationWrapper",
          "classList": "w-100p",
          "location": "btn_format"
        },
        {
          "element": "button",
          "icon": "aling_left_icon",
          "text": "",
          "class": "button-margin",
          "location": "btn_format",
          "data": {
            "role": "btnEdit",
            "action": "addEdit",
            "name": "JustifyLeft"
          }
        },
        {
          "element": "button",
          "icon": "aling_center_icon",
          "text": "",
          "class": "button-margin",
          "location": "btn_format",
          "data": {
            "role": "btnEdit",
            "action": "addEdit",
            "name": "JustifyCenter"
          }
        },

        {
          "element": "button",
          "icon": "aling_right_icon",
          "text": "",
          "class": "button-margin",
          "location": "btn_format",
          "data": {
            "role": "btnEdit",
            "action": "addEdit",
            "name": "JustifyRight"
          }
        },
        {
          "element": "button",
          "icon": "bold_icon",
          "text": "",
          "class": "button-margin",
          "location": "btn_format",
          "data": {
            "role": "btnEdit",
            "action": "addEdit",
            "name": "Bold"
          }
        },
        {
          "element": "button",
          "icon": "italic_icon",
          "text": "",
          "class": "button-margin",
          "location": "btn_format",
          "data": {
            "role": "btnEdit",
            "action": "addEdit",
            "name": "Italic"
          }
        },
        {
          "element": "button",
          "icon": "color_text_icon",
          "text": "",
          "class": "button-margin",
          "location": "btn_format",
          "data": {
            "role": "btnEdit",
            "name": "ForeColor",
            "action": "addEdit",
            "param": true
          }
        },
        {
          "role": "locationWrapper",
          "classList": "w-100p flex-item flex-align-c flex-item-auto",
          "location": "toggle_scroll"
        },
        {
          "element": "input",
          "type": "checkbox",
          "text": 12,
          "class": "check-box-size",
          "location": "toggle_scroll",
          "data": {
            "key": "offScroll",
            "role": "btnEdit",
            "action": "changeEdit",
            "name": "ControlScrollMessage"
          }
        }
      ]
    }
  },

  render(){
    if (this.props.data.formatOptions.show) {
      return (
        <Location_Wrapper events={this.props.events} mainContainer={this.props.mainContainer}
                          data={this.props.data.formatOptions} configs={this.props.configs}/>
      )
    } else {
      return <div data-role="btnEditPanel" className="btnEditPanel flex-align-c"></div>
    }
  }
});

export default FormatPanel;