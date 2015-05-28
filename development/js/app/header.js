define('header', [
        'event_core',
        'ajax_core',
        'async_core',
        'pagination',

        'text!../html/filter_template.html',
        'text!../html/header_template.html',
        'text!../html/element/triple_element_template.html',
        'text!../html/element/button_template.html',
        'text!../html/element/label_template.html',
        'text!../html/element/input_template.html'
    ],
    function(event_core,
             ajax_core,
             async_core,
             pagination,
             filter_template,
             header_template,
             triple_element_template,
             button_template,
             label_template,
             input_template) {

        var header = function() {
        };

        header.prototype = {

            header_template: _.template(header_template),
            filter_template: _.template(filter_template),
            triple_element_template: _.template(triple_element_template),
            button_template: _.template(button_template),
            label_template: _.template(label_template),
            input_template: _.template(input_template),

            initialize: function(options) {
                var _this = this;

                _this.chat = options.chat;

                _this.header_container = _this.chat.chatElem.querySelector('[data-role="header_outer_container"]');
                _this.body_outer_container = _this.chat.chatElem.querySelector('[data-role="body_outer_container"]');
                _this.renderByMode();
            },

            renderByMode: function() {
                var _this = this;
                switch (_this.chat.data.mode) {
                    case "webrtc":
                        _this.header_container.innerHTML = _this.header_template({
                            description: 'Web RTC Initialization'
                        });
                        break;
                    case "messages":
                        _this.sendRequest("/mock/header_navbar_config.json", function(err, config) {
                            if (err) {
                                console.log(err);
                            } else {
                                _this.header_navbar_config = JSON.parse(config);
                                _this.header_container.innerHTML = _this.header_template({
                                    header_btn: _this.header_navbar_config,
                                    description: 'Chat Messages'
                                });
                                _this.trigger('resizeMessagesContainer');
                                var btnsHeader = _this.header_container.querySelectorAll('[data-role="btnHeader"]');
                                for (var i = 0, l = btnsHeader.length; i < l; i++) {
                                    var name = btnsHeader[i].getAttribute('data-action');
                                    btnsHeader[i].addEventListener('click', _this[name].bind(_this), false);
                                }
                                //_this.addToolbarListeners();
                            }
                        });
                        _this.filter_container = _this.chat.chatElem.querySelector('[data-role="filter_container"]');
                        break;
                }
            },

            addEventListeners: function() {
                var _this = this;
                _this.removeEventListeners();
            },

            removeEventListeners: function() {
                var _this = this;
                _this.labeltPerPage.removeEventListener('input', _this.changePerPage.bind(_this), false);
            },

            forceRenderMessages: function(callback) {
                var _this = this;
                if (_this.chat.data.body_mode !== "messages") {
                    _this.trigger('renderMassagesEditor', callback);
                    //_this.trigger('renderPagination');
                    _this.chat.data.body_mode = "messages";
                    _this.body_outer_container.setAttribute("param-content", "message");
                    _this.body_outer_container.classList.remove('background');
                } else {
                    callback();
                }
            },

            renderFilter: function() {
                var _this = this;
                _this.filter_container = _this.chat.chatElem.querySelector('[data-role="filter_container"]');
                _this.sendRequest("/mock/filter_navbar_config.json", function(err, res) {
                    if (err) {
                        console.log(err);
                    } else {
                        _this.filter_navbar_config = JSON.parse(res);

                        _this.forceRenderMessages(function() {
                            if (_this.filter_container.classList.contains('hide')) {
                                _this.filter_container.classList.remove('hide');
                                _this.filter_container.innerHTML = _this.filter_template({
                                    filter_navbar_config: _this.filter_navbar_config,
                                    triple_element_template: _this.triple_element_template,
                                    button_template: _this.button_template,
                                    input_template: _this.input_template,
                                    label_template: _this.label_template,
                                    mode: _this.chat.data.redraw_mode
                                });
                                _this.enablePagination = _this.filter_container.querySelector('input[data-role="enable_pagination"]');
                                if (_this.enablePagination) {
                                    _this.enablePagination.checked = _this.chat.data.valueEnablePagination;
                                    _this.enablePagination.addEventListener('change', _this.renderPagination.bind(_this), false);
                                }
                                _this.labeltPerPage = _this.filter_container.querySelector('input[data-role="per_page"]');
                                if (_this.labeltPerPage) {
                                    _this.labeltPerPage.addEventListener('input', _this.changePerPage.bind(_this), false);
                                    _this.labeltPerPage.value = _this.chat.data.per_page_value;
                                }
                                _this.btnPerPage = _this.filter_container.querySelector('button[data-role="per_page"]');
                                if (_this.btnPerPage) {
                                    _this.btnPerPage.addEventListener('click', _this.showPerPage.bind(_this), false);
                                }
                                _this.real_time_editing = _this.filter_container.querySelector('input[data-role="real_time_editing"]');
                                if (_this.real_time_editing) {
                                    _this.real_time_editing.addEventListener('change', _this.changeRealTimeEditing.bind(_this), false);
                                }
                                if(_this.chat.data.redraw_mode === "rte"){
                                    _this.real_time_editing.checked = true;
                                } else {
                                    _this.real_time_editing.checked = false;
                                }
                            } else {
                                _this.valueEnablePagination = _this.chat.chatElem.querySelector('[data-role="enable_pagination"]').checked;
                                _this.per_page = _this.chat.chatElem.querySelector('[data-role="per_page"]');
                                _this.per_page_value = parseInt(_this.per_page.value);
                                _this.filter_container.innerHTML = "";
                                _this.filter_container.classList.add('hide');
                            }
                            _this.trigger('resizeMessagesContainer');
                            _this.trigger('calcOuterContainerHeight');

                        });
                    }
                })
            },

            changeRealTimeEditing: function() {
                var _this = this;
                var array_per_page_nrte = _this.filter_navbar_config.filter(function(obj) {
                    return obj.service_id === "per_page" && obj.redraw_mode === "nrte"
                })
                var array_per_page_rte = _this.filter_navbar_config.filter(function(obj) {
                    return obj.service_id === "per_page" && obj.redraw_mode === "rte"
                })


                if (_this.real_time_editing.checked) {
                    _this.chat.data.redraw_mode = "rte";
                    _this.array_per_page = array_per_page_rte;
                } else {
                    _this.chat.data.redraw_mode = "nrte";
                    _this.array_per_page = array_per_page_nrte;
                }
                var parentDiv = _this.real_time_editing.parentNode;
                parentDiv.innerHTML = "";
               _this.array_per_page.forEach(function(obj) {
                   console.log(obj)
                   parentDiv.innerHTML +=  _this.triple_element_template({
                        element: obj,
                        button_template: _this.button_template,
                        input_template: _this.input_template,
                        label_template: _this.label_template
                    });
                });
                _this.labeltPerPage = _this.filter_container.querySelector('input[data-role="per_page"]');
                if (_this.labeltPerPage) {
                    _this.labeltPerPage.addEventListener('input', _this.changePerPage.bind(_this), false);
                    _this.labeltPerPage.value = _this.chat.data.per_page_value;
                }
                _this.btnPerPage = _this.filter_container.querySelector('button[data-role="per_page"]');
                if (_this.btnPerPage) {
                    _this.btnPerPage.addEventListener('click', _this.showPerPage.bind(_this), false);
                }
                _this.real_time_editing = _this.filter_container.querySelector('input[data-role="real_time_editing"]');
                if (_this.real_time_editing) {
                    _this.real_time_editing.addEventListener('change', _this.changeRealTimeEditing.bind(_this), false);
                }

            },

            renderContactList: function() {
                var _this = this;
                _this.trigger("renderContactList");
            },

            renderSettings: function() {
                var _this = this;
                _this.trigger("renderSettings");
            },

            renderPagination: function() {
                var _this = this;
                _this.trigger("renderPagination");
            },

            changePerPage: function() {
                var _this = this;
                _this.chat.data.per_page_value = parseInt(_this.labeltPerPage.value);

                if(_this.chat.data.redraw_mode === "rte"){
                    _this.chat.data.curPage = null;
                    if (_this.chat.data.valueEnablePagination) {
                        if (_this.labeltPerPage.value !== "") {
                            _this.trigger("changePerPage");
                        }
                    }
                }
            },

            showPerPage: function() {
                var _this = this;

                    _this.chat.data.per_page_value = parseInt(_this.labeltPerPage.value);
                    _this.chat.data.curPage = null;
                    if (_this.chat.data.valueEnablePagination) {
                        if (_this.labeltPerPage.value !== "") {
                            _this.trigger("changePerPage");
                        }
                    }
            }

            /* addToolbarListeners: function() {
             var _this = this;
             _this.removeToolbarListeners();
             if (!_this.header_container || !_this.header_navbar_config) {
             return;
             }
             _.each(_this.header_navbar_config, function(_configItem) {
             if (_configItem.element === _this.toolbarElement) {
             _this.header_container.addEventListener('click', _this.toolbarEventRouter.bind(_this), false);
             }
             });
             },

             removeToolbarListeners: function() {
             var _this = this;
             if (!_this.header_container || !_this.header_navbar_config) {
             return;
             }
             _.each(_this.header_navbar_config, function(_configItem) {
             if (_configItem.element === _this.toolbarElement) {
             _this.header_container.removeEventListener('click', _this.toolbarEventRouter.bind(_this), false);
             }
             });
             },

             toolbarEventRouter: function(event) {
             var _this = this;
             var action = event.target.getAttribute('data-action');
             _this[action](event);
             },*/

        }

        extend(header, event_core);
        extend(header, async_core);
        extend(header, ajax_core);
        return header;
    });
