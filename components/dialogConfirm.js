import React from 'react'

import localization from '../js/localization'

import Dialog from './dialog'

const DialogConfirm = React.createClass({

  processingTitle(){
    let title;
    if (this.props.title) {
      title = this.props.title;
      if (!title.textContent) {
        title.textContent = 80;
      }
      if (title.addClass) {
        title.addClass = ' confirm ' + title.addClass;
      } else {
        title.addClass = ' confirm ';
      }
    } else {
      title = {textContent: 80, addClass: ' confirm'};
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
        {this.props.no ? localization.transferText(this.props.no) : localization.getLocText(42)}
      </button>
      <button className="border-radius-04em p-tb-03em-lr-1em" data-action="confirmOk">
        {this.props.yes ? localization.transferText(this.props.yes) : localization.getLocText(97)}
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

export default DialogConfirm;