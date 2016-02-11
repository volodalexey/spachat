import React from 'react'

import extend_core from '../js/extend_core.js'
import switcher_core from '../js/switcher_core.js'

import Location_Wrapper from './location_wrapper'

const GoTo = React.createClass({
  getDefaultProps: function() {
    return {
      configs: [
        {
          "role": "locationWrapper",
          "classList": "flex-align-c",
          "location": "choice_page"
        },
        {
          "element": "input",
          "type": "checkbox",
          "class": "check-box-size",
          "location": "choice_page",
          "data": {
            "role": "rte_choice_per_page",
            "action": "changeRTE_goTo",
            "key": "rteChoicePage"
          },
          "sort": 3,
          "redraw_mode": "nrte"
        },
        {
          "element": "button",
          "text": 11,
          "class": "w-50px button-inset-white",
          "location": "choice_page",
          "data": {
            "role": "go_to_page",
            "action": "switchPage"
          },
          "htmlFor": "per_page",
          "sort": 1,
          "redraw_mode": "nrte"
        },
        {
          "element": "input",
          "type": "number",
          "class": "w-50px",
          "location": "choice_page",
          "data": {
            "role": "choice_per_page",
            "action": "changePage",
            "key": "page"
          },
          "name": "",
          "id": "per_page",
          "sort": 2,
          "redraw_mode": "nrte"
        },

        {
          "element": "input",
          "type": "checkbox",
          "class": "check-box-size",
          "location": "choice_page",
          "data": {
            "role": "rte_choice_per_page",
            "action": "changeRTE_goTo",
            "key": "rteChoicePage"
          },
          "sort": 3,
          "redraw_mode": "rte"
        },
        {
          "element": "label",
          "text": 11,
          "location": "choice_page",
          "data": {
            "role": "go_to_page"
          },
          "name": "",
          "htmlFor": "per_page",
          "sort": 1,
          "redraw_mode": "rte"
        },
        {
          "element": "input",
          "type": "number",
          "location": "choice_page",
          "data": {
            "role": "choice_per_page",
            "action": "changePage",
            "key": "page"
          },
          "id": "per_page",
          "sort": 2,
          "redraw_mode": "rte"
        }
      ]
    }
  },

  prepareConfig: function(config, mode) {
    config = config.filter(function(obj) {
      if (!obj.redraw_mode) {
        return obj;
      } else {
        return obj.redraw_mode === mode;
      }
    });
    return config;
  },

/*  defineOptions: function(mode) {
    let options = {};
    switch (mode) {
      case 'CREATE_CHAT':
        options['goToOptions'] = this.props.data.createChat_GoToOptions;
        break;
      case 'CHATS':
        options['goToOptions'] = this.props.data.chats_GoToOptions;
        break;
      case 'USERS':
        options['goToOptions'] = this.props.data.users_GoToOptions;
        break;
      default:
        options = null;
        break;
    }
    return options;
  },*/

  changeRTE: function(element, state) {
    switch (state.bodyMode) {
      case "CHATS":
        if (element.checked) {
          state.chats_GoToOptions.mode_change = "rte";
          state.chats_GoToOptions.rteChoicePage = true;
          return {chats_GoToOptions: state.chats_GoToOptions};
        } else {
          state.chats_GoToOptions.mode_change = "nrte";
          state.chats_GoToOptions.rteChoicePage = false;
          return {chats_GoToOptions: state.chats_GoToOptions};
        }
        break;
      case "USERS":
        if (element.checked) {
          this.state.users_GoToOptions.mode_change = "rte";
          this.state.users_GoToOptions.rteChoicePage = true;
          this.setState({users_GoToOptions: this.state.users_GoToOptions});
        } else {
          this.state.users_GoToOptions.mode_change = "nrte";
          this.state.users_GoToOptions.rteChoicePage = false;
          this.setState({users_GoToOptions: this.state.users_GoToOptions});
        }
        break;
    }
  },

  render: function() {
    let currentOptions = this.optionsDefinition(this.props.data, this.props.mode),
      gto = currentOptions.goToOptions;
    if (gto && gto.show) {
      let configs = this.prepareConfig(this.props.configs, gto.mode_change),
        data = {
        mode_change: gto.mode_change,
        rteChoicePage: gto.rteChoicePage,
        page: gto.page
      };
      return <div>
        {
          <Location_Wrapper events={this.props.events} data={data} configs={configs}/>
        }
      </div>
    } else {
      return <div></div>
    }

  }
});

extend_core.prototype.inherit(GoTo, switcher_core);

export default GoTo;