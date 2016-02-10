import React from 'react'

const Svg = React.createClass({
  render: function() {
    var className = 'transition-all ';
    if (this.props.data && this.props.data.pointerRotate !== -1) {
      className = className + 'rotate-90';
    }
    return <img src={"components/icon/" + this.props.config.icon} className={className}
                data-role="pointer"/>;
  }
});

export default Svg;