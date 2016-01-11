import React from 'react'
import Localization from '../js/localization.js'

const Button = React.createClass({
  displayName: 'Button',
  renderAtt() {
    var params = {};
    if (this.props.config.data) {
      for (var dataKey in this.props.config.data) {
        if (this.props.config.data[dataKey] !== "" && dataKey !== "description") {
          params['data-' + dataKey] = this.props.config.data[dataKey];
        }
        if (dataKey === "description" && typeof this.props.config.data[dataKey] === 'number') {
          params['data-' + dataKey] = Localization.getLocText(this.props.config.data[dataKey]);
        }
      }
    }

    if (this.props.config.disable === true) {
      params["disabled"] = 'true';
    }

    if (this.props.config.data && this.props.config.data.key_disable && this.props.data[this.props.config.data.key_disable]) {
      params['disabled'] = this.props.data[this.props.config.data.key_disabled];
      var flag = true;
      var src = "components/icon/" + this.props.config.icon + ".svg";
    }

    var display;
    if (this.props.calcDisplay) {
      display = this.props.calcDisplay(this.props.config);
    }
    if (display !== undefined && display !== true) {
      params['style'] = {display: 'none'};
    }

    if (this.props.config.type) {
      params['type'] = this.props.config.type;
    }
    if (this.props.config.data && this.props.config.data.key) {
      params['data-value'] = this.props.config.data[this.props.config.data.key]
    }

    return params;
  },

  renderHandlers(){
    var handlers = {};
    if (this.props.events) {
      for (var dataKey in this.props.events) {
        handlers[dataKey] = this.props.events[dataKey];
      }
    }
    return handlers;
  },

  renderContent(){
    var content = [];
    if (this.props.config.icon) {
      if (this.flag) {
        content.push(
          (<div>
            <div className="opacity-05 cursor-not-allowed">
              <img src={this.src}/>
            </div>
          </div>))
      } else {
        content.push(<img key={this.props.config.icon} data-onload={this.props.config.onload ? 'true' : ''} src={"components/icon/" + this.props.config.icon + ".svg"}/>);
      }
    }
    if (this.props.config.text) {
      content.push(typeof this.props.config.text === "number" ? Localization.getLocText(this.props.config.text) : this.props.config.text) ;
    } else {
      content.push("");
    }
    if (this.props.config.data && this.props.config.data.key) {
      content.push(this.props.data[this.props.config.data.key]);
    }
    if (this.props.config.data && this.props.config.data.description) {
      content.push(<img key={"description"} src="components/icon/description_icon.svg" className="description_icon-position"/>);
    }

    return content;
  },

  renderClassName(){
    var className;
    if(this.props.hide) {
      className = this.props.config.class ? this.props.config.class + 'hide' : '';
    } else{
      className = this.props.config.class ? this.props.config.class : '';
    }

    if(this.props.config.data && this.props.config.data.mode_to && this.props.config.data.mode_to === this.props.mode){
      className = className + ' activeTollbar';
    }
    return className;
  },

  render() {
    var self = this;

    return (
      <button className={this.renderClassName()} {...this.renderAtt()}
        {...this.renderHandlers()} >
        {this.renderContent()}
      </button>
    )
  }
});

export default Button;