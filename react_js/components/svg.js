import React from 'react'
import { Router, Route, Link, History, Redirect } from 'react-router'

const Svg = React.createClass({
  render() {
    var className = 'transition-all ';
    if(this.props.data && this.props.data.pointerRotate !== -1) {
      className = className + 'rotate-90';
    }
    return <img src={"components/icon/" + this.props.config.icon} className={className}
                data-role="pointer" />;
  }
});

export default Svg;