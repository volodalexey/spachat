import React from 'react'
import Localization from '../js/localization.js'

const Button = React.createClass({
    render_att() {
        var params = {};
        if (this.props.config.data) {
            for (var dataKey in this.props.config.data) {
                if (this.props.config.data[dataKey] !== "" && dataKey !== "description") {
                    params['data-' + dataKey] = '\"' + this.props.config.data[dataKey] + '\"';
                }
                if (dataKey === "description" && typeof this.props.config.data[dataKey] === 'number') {
                    params['data-' + dataKey] = '\"' + Localization.getLocText(this.props.config.data[dataKey]) + '\"';
                }
            }
        }
        return params
    },

    render() {
        return (
            <button
                className={this.props.config.class ? this.props.config.class : ''}
                {...this.render_att()}
            >
                {Localization.getLocText(this.props.config.text)}
            </button>
        )
    }
});

export default Button