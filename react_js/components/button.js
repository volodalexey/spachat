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

        if (this.props.config.disable === true) {
            params["disabled"] = 'true';
        }

        if (this.props.config.data && this.props.config.data.key_disable && this.props.data[this.props.config.data.key_disable]) {
            params['disabled'] = this.props.data[this.props.config.data.key_disabled];
            var flag = true;
            var src = "templates/icon/" + this.props.config.icon + ".svg";
        }

        var display;
        if (this.props.calcDisplay) {
            display = this.props.calcDisplay(this.props.config);
        }
        if (display !== undefined && display !== true) {
            params['style'] = "display: none;"
        }

        if (this.props.config.type) {
            params['type'] = this.props.config.type;
        }
        if (this.props.config.data && this.props.config.data.key) {
            params['data-value'] = this.props.config.data[this.props.config.data.key]
        }

        return params
    },

    render_icon() {

    },

    render() {
        return (
            <button
                className={this.props.config.class ? this.props.config.class : ''}
                {...this.render_att()}
            >
                {(() => {
                    if (this.props.config.icon) {
                        if (this.flag) {
                            return
                            <div>
                                <div className="opacity-05 cursor-not-allowed">
                                    <img src={this.src} />
                                </div>
                            </div>
                        } else {
                            return <img src={this.src} />
                        }

                        }
                    if (this.props.config.text) {
                       return typeof this.props.config.text === "number" ? Localization.getLocText(this.props.config.text) : this.props.config.text
                    } else {
                        return ''
                    }

                    if (this.props.config.data && this.props.config.data.key) {
                        return this.props.data[this.props.config.data.key]
                    }

                    if (this.props.config.data && this.props.config.data.description) {
                        return <img src="templates/icon/description_icon.svg" className="description_icon-position" />
                    }
                        })()}

            </button>
        )
    }
});

export default Button