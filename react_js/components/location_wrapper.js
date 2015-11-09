import React from 'react'

import Triple_Element from './triple_element'


const Location_Wrapper = React.createClass({
    prepareConfig(){
        var rawConfig = this.props.configs;
        var byDataLocation = {};
        rawConfig.forEach(function(_config) {
            if (!_config.location) {
                return;
            }
            if (!byDataLocation[_config.location]) {
                byDataLocation[_config.location] = {
                    configs: []
                };
            }
            if (!_config.role) {
                byDataLocation[_config.location].configs.push(_config);
            } else if (_config.role === 'locationWrapper') {
                byDataLocation[_config.location].wrapperConfig = _config;
            }
        });

        rawConfig.byDataLocation = byDataLocation;
        console.log('1', rawConfig);

        return rawConfig;
    },

    render_att(config) {
        var params = {};
        if (config.classList) {
            params['className'] = config.classList;
        }
        if (config.data) {
            params['role'] = config.data.role;
        }
        return params;
    },

    render(){
        var rawConfig = this.prepareConfig();
        return (
            <div>
                {
                    rawConfig.map((locationValue, idx) => {
                        if (locationValue.role === "locationWrapper") {
                            return <div data-val="local_wrap" key={idx} {...this.render_att(locationValue)}>
                            </div>
                        } else {
                           return <Triple_Element key={idx} config={locationValue}/>
                        }
                    })
                }
            </div>
        )
    }
});

export default Location_Wrapper