import React from 'react'
import {Link} from 'react-router'
import {element} from './element'
import localization from '../js/localization'

const Button = React.createClass({

  renderExtraAttributes(){
    let options = {}, config = this.props.config;
    if (config.data && config.data.mode_to &&
      config.data.mode_to === this.props.mode) {
      options.classList = ' activeTollbar ';
    }

    return options;
  },

  renderContent() {
    let content = [], flag, config = this.props.config, data = this.props.config.data;
    if (config.icon) {
      if (this.props.data && data && this.props.data[data.key_disable]) {
        flag = true;
      }
      if (flag) {
        content.push(
          (<div key={config.icon} className="opacity-05 cursor-not-allowed ">
              <img src={"/__build__/svg/" + config.icon + ".svg"}/>
            </div>
          ))
      } else {
        content.push(<img key={config.icon} data-onload={config.onload ? 'true' : ''}
                          data-role={config.data.role} className=""
                          src={"/__build__/svg/" + config.icon + ".svg"}/>);
      }
    }
    if (config.text) {
      content.push(typeof config.text === "number" ? localization.getLocText(config.text) : config.text);
    } else {
      content.push("");
    }
    if (data && data.key) {
      content.push(this.props.data[data.key]);
    }
    if (data && data.description) {
      content.push(<img key={"description"} src="/__build__/svg/description_icon.svg"
                        className="description_icon-position"/>);
    }
    return content;
  },

  render() {
    let pureButton = (
      <button {...element.renderAttributes(this.props, this.renderExtraAttributes())} {...element.renderHandlers(this.props)} >
        {this.renderContent(this.props)}
      </button>
    );
    return (
    this.props.config.link ?
      <Link to={this.props.config.link}>
        {pureButton}
      </Link>
      : pureButton
    )
  }
});

export default Button;