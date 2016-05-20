import React from 'react'

import localization from '../js/localization'

import Dialog from './dialog'

const DialogError = React.createClass({

  processingTitle(){
    let title;
    if (this.props.title) {
      title = this.props.title;
      if (!title.textContent) {
        title.textContent = 84;
      }
      if (title.addClass) {
        title.addClass = ' error ' + title.addClass;
      } else {
        title.addClass = ' error ';
      }
    } else {
      title = {textContent: 84, addClass: ' error'};
    }

    return title;
  },

  processingBody(){
    let body;
    if (this.props.body) {
      body = this.props.body;
      if (!body.textContent) {
        body.textContent = this.props.message;
      }
    } else {
      body = {textContent: this.props.message};
    }

    return body;
  },

  processingFooter(){
    let footer, _class = 'flex-sp-around p-05em border-popup-footer ';
    if (this.props.footer) {
      footer = this.props.footer;
      if (footer.content) {
        return footer.content;
      }
      if (footer.className) {
        _class = footer.className;
      } else {
        _class = footer.addClass ? _class + footer.addClass : _class;
      }
    }

    return <footer className={_class}>
      <button className="border-radius-04em p-tb-03em-lr-1em" data-action="confirmCancel">
        {this.props.close ? localization.transferText(this.props.close) : localization.getLocText(20)}
      </button>
    </footer>;
  },

  render() {
    if (this.props.show) {
      let title = this.processingTitle(),
        body = this.processingBody(),
        footer = this.processingFooter();

      return (
        <Dialog show={this.props.show} title={title} body={body} footer={footer}
                handleClick={this.props.handleClick}/>
      )
    } else {
      return (<Dialog show={this.props.show} />)
    }
  }
});

export default DialogError;