import React from 'react'

import localization from '../js/localization'

const Dialog = React.createClass({

  renderTitle(){
    let title = this.props.title;
    if (title.content) {
      return title.content;
    } else {
      let wrapperClass;
      wrapperClass = title.className ? title.className :
        title.addClass ? 'text-line-center flex-just-center ' + title.addClass : 'text-line-center flex-just-center ';

      return <div className={wrapperClass}>
        <div className="p-r-l-04em color title-popup">
          <label className="c-50 p-r-l-04em">
            {localization.transferText(title.textContent)}
          </label>
        </div>
      </div>;
    }
  },

  renderBody(){
    let body = this.props.body;
    if (body.content) {
      return body.content;
    } else {
      let wrapperClass;
      wrapperClass = body.className ? body.className :
        body.addClass ? 'w-100p p-t-b flex-sp-between ' + body.addClass : 'w-100p p-t-b flex-sp-between ';

      return <content className={wrapperClass}>
        <label className="p-b-1em p-r-l-1em">
          {localization.transferText(body.textContent)}
        </label>
      </content>
    }
  },

  render() {
    return (
      this.props.show ?
        <div data-role="popup_outer_container" className="flex-outer-container p-fx popup in">
          <div data-role="popup_inner_container" className="c-50 border-radius-05em min-width-350"
               onClick={this.props.handleClick}>
            {this.renderTitle()}
            {this.renderBody()}
            {this.props.footer}
          </div>
        </div> :
        <div data-role="popup_outer_container" className="flex-outer-container p-fx popup hidden-popup">
        </div>
    )
  }
});

export default Dialog;