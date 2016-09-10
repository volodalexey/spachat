import React from 'react'

import extend_core from '../js/extend_core.js'
import switcher_core from '../js/switcher_core.js'

import Location_Wrapper from './location_wrapper'

const GoTo = React.createClass({
  
  getDefaultProps() {
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

  prepareConfig(config, mode) {
    config = config.filter(function(obj) {
      if (!obj.redraw_mode) {
        return obj;
      } else {
        return obj.redraw_mode === mode;
      }
    });
    return config;
  },

  changeRTE(element, currentOptions) {
    let gto = currentOptions.goToOptions;
    if (element.checked) {
      gto.mode_change = "rte";
      gto.rteChoicePage = true;
      currentOptions.paginationOptions.currentPage = gto.page;
      return currentOptions;
    } else {
      gto.mode_change = "nrte";
      gto.rteChoicePage = false;
      return currentOptions;
    }
  },

  render() {
    let currentOptions = this.optionsDefinition(this.props.data, this.props.mode),
      gto = currentOptions.goToOptions;
    if (gto && gto.show && currentOptions.paginationOptions && currentOptions.paginationOptions.show) {
      let configs = this.prepareConfig(this.props.configs, gto.mode_change),
        data = {
          mode_change: gto.mode_change,
          rteChoicePage: gto.rteChoicePage,
          page: gto.pageShow
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