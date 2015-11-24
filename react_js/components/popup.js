import React from 'react'

const Popup = React.createClass({
  render(){
    return (
      <div data-role="popap_outer_container" className="flex-outer-container p-fx popap hidden-popap">
        <div data-role="popap_inner_container" className="c-50 border-radius-05em min-width-350"></div>
      </div>
    )
  }
});

export default Popup;