define('header', [
        'event_core',
        'ajax_core',
        'async_core',
        'template_core',
        'indexeddb',
        'render_layout_core',

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
             template_core,
             indexeddb,
             render_layout_core,
             pagination,

             filter_template,
             header_template,
             triple_element_template,
             button_template,
             label_template,
             input_template) {

        var header = function() {
            this.bindToolbarContext();
        };

        header.prototype = {

            configMap: {
                WEBRTC: '',
                TAB: '/mock/header_navbar_config.json',
                FILTER: '/mock/filter_navbar_config.json',
                WAITER: ''
            },

            MODE_DESCRIPTION: {
                WEBRTC: 'Web RTC Initialization',
                TAB: 'Chat Messages',
                WAITER: ''
            },

            MODE: {
                FILTER: 'FILTER',
                WEBRTC: 'WEBRTC',
                WAITER: 'WAITER',
                TAB: 'TAB'
            },

            bindToolbarContext: function() {
                var _this = this;
                //_this.bindedTriggerRouter = _this.triggerRouter.bind(_this);
                _this.bindedThrowEventRouter = _this.throwEventRouter.bind(_this);
                _this.bindedRenderFilter = _this.renderFilter.bind(_this);
                _this.bindedDataActionRouter = _this.dataActionRouter.bind(_this);
            },

            addToolbarEventListener: function() {
                var _this = this;
                _this.removeToolbarEventListeners();
                //_this.addRemoveListener('add', _this.chat.header_container, 'click', _this.bindedTriggerRouter, false);                _this.addRemoveListener('add', _this.chat.header_container, 'click', _this.bindedTriggerRouter, false);
                _this.addRemoveListener('add', _this.chat.header_container, 'click', _this.bindedThrowEventRouter, false);

                //_this.addRemoveListener('add', _this.chat.header_container, 'click', _this.bindedDataActionRouter, false);
                _this.addRemoveListener('add', _this.chat.header_container, 'checked', _this.bindedDataActionRouter, false);
                _this.addRemoveListener('add', _this.chat.header_container, 'input', _this.bindedDataActionRouter, false);
            },

            removeToolbarEventListeners: function() {
                var _this = this;
                //_this.addRemoveListener('remove', _this.chat.header_container, 'click', _this.bindedTriggerRouter, false);
                _this.addRemoveListener('remove', _this.chat.header_container, 'click', _this.bindedThrowEventRouter, false);

                _this.addRemoveListener('remove', _this.chat.header_container, 'click', _this.bindedDataActionRouter, false);
                _this.addRemoveListener('remove', _this.chat.header_container, 'checked', _this.bindedDataActionRouter, false);
                _this.addRemoveListener('remove', _this.chat.header_container, 'input', _this.bindedDataActionRouter, false);
            },

            cashBodyElement: function() {
                var _this = this;

                if (_this.body_mode === _this.MODE.FILTER) {
                    _this.enablePagination = _this.filter_container.querySelector('[data-role="enablePagination"]');
                    _this.perPageValue = _this.filter_container.querySelector('[data-role="perPageValue"]');
                    //_this.showPerPage = _this.filter_container.querySelector('[data-action="showPerPage"]');
                    _this.rteShowPerPage = _this.filter_container.querySelector('[data-role="rteShowPerPage"]');
                }
            },


            render: function(options, chat) {
                var _this = this;
                _this.chat = chat;
                if (_this.chat.headerOptions.show) {
                    _this.previousMode = _this.chat.headerOptions.mode;
                    switch (_this.chat.headerOptions.mode) {
                        case _this.MODE.TAB:
                            _this.body_mode = _this.MODE.TAB;
                            _this.description = _this.MODE_DESCRIPTION[_this.body_mode];
                            _this.elementMap = {
                                TAB: _this.chat.header_container
                            };
                            _this.renderLayout(null, function(){
                                _this.filter_container = _this.chat.header_container.querySelector('[data-role="filter_container"]');
                                _this.addToolbarEventListener();
                                _this.renderFilter(true);
                            });
                            break;
                        case _this.MODE.WEBRTC:
                            _this.body_mode = _this.MODE.WEBRTC;
                            _this.description = _this.MODE_DESCRIPTION[_this.body_mode];
                            _this.elementMap = {
                                WEBRTC: _this.chat.header_container.querySelector('[data-role="webrtc_container"]')
                            };
                            _this.fillBody(null, null, function(){
                                _this.renderFilter(true);
                            });
                            break;
                        case _this.MODE.WAITER:
                            _this.body_mode = _this.MODE.WAITER;
                            break;
                    }
                }
            },

            renderFilter: function(render) {
                var _this = this;
               var t = _this.previousShow;
               var f = _this.chat.filterOptions.show;
                if (!_this.previousShow ){
                    if (_this.chat.filterOptions.show) {
                        _this.previousShow = true;
                        _this.body_mode = _this.MODE.FILTER;
                        _this.filter_container.classList.remove('hide');
                        _this.elementMap = {
                            FILTER: _this.filter_container
                        };
                        _this.body_mode = _this.MODE.FILTER;
                        var data = {
                            "perPageValue": _this.chat.paginationOptions.perPageValue,
                            "showEnablePagination": _this.chat.paginationOptions.showEnablePagination,
                            "rtePerPage": _this.chat.paginationOptions.rtePerPage
                        };
                        _this.renderLayout(data, null);
                    }
                }
                else {
                    _this.filter_container.innerHTML = "";
                    _this.filter_container.classList.add('hide');
                    _this.previousShow = false;
                }
            },

/*
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
                                    mode: _this.chat.redraw_mode
                                });
                                _this.showEnablePagination = _this.filter_container.querySelector('input[data-role="enable_pagination"]');
                                if (_this.showEnablePagination) {
                                    _this.showEnablePagination.checked = _this.chat.data.showEnablePagination;
                                    _this.showEnablePagination.addEventListener('change', _this.renderPagination.bind(_this), false);
                                }
                                _this.labeltPerPage = _this.filter_container.querySelector('input[data-role="per_page"]');
                                if (_this.labeltPerPage) {
                                    _this.labeltPerPage.addEventListener('input', _this.changePerPage.bind(_this), false);
                                    _this.labeltPerPage.value = _this.chat.data.perPageValue;
                                }
                                _this.showPerPage = _this.filter_container.querySelector('button[data-role="per_page"]');
                                if (_this.showPerPage) {
                                    _this.showPerPage.addEventListener('click', _this.showPerPage.bind(_this), false);
                                }
                                _this.rteShowPerPage = _this.filter_container.querySelector('input[data-role="rteShowPerPage"]');
                                if (_this.rteShowPerPage) {
                                    _this.rteShowPerPage.addEventListener('change', _this.changeRealTimeEditing.bind(_this), false);
                                }
                                if (_this.chat.data.redraw_mode === "rte") {
                                    _this.rteShowPerPage.checked = true;
                                } else {
                                    _this.rteShowPerPage.checked = false;
                                }
                            } else {
                                _this.showshowEnablePagination = _this.chat.chat_element.querySelector('[data-role="enable_pagination"]').checked;
                                _this.per_page = _this.chat.chat_element.querySelector('[data-role="per_page"]');
                                _this.perPageValue = parseInt(_this.per_page.value);
                                _this.filter_container.innerHTML = "";
                                _this.filter_container.classList.add('hide');
                            }
                            _this.trigger('resizeMessagesContainer');
                            _this.trigger('calcOuterContainerHeight');

                        });
                    }
                })*/


            changeRealTimeEditing: function() {
                var _this = this;
                var array_per_page_nrte = _this.filter_navbar_config.filter(function(obj) {
                    return obj.service_id === "per_page" && obj.redraw_mode === "nrte"
                });
                var array_per_page_rte = _this.filter_navbar_config.filter(function(obj) {
                    return obj.service_id === "per_page" && obj.redraw_mode === "rte"
                });

                if (_this.rteShowPerPage.checked) {
                    _this.chat.data.redraw_mode = "rte";
                    _this.array_per_page = array_per_page_rte;
                } else {
                    _this.chat.data.redraw_mode = "nrte";
                    _this.array_per_page = array_per_page_nrte;
                }
                var parentDiv = _this.rteShowPerPage.parentNode;
                parentDiv.innerHTML = "";
                _this.array_per_page.forEach(function(obj) {
                    //console.log(obj);
                    parentDiv.innerHTML += _this.triple_element_template({
                        element: obj,
                        button_template: _this.button_template,
                        input_template: _this.input_template,
                        label_template: _this.label_template
                    });
                });
                _this.labeltPerPage = _this.filter_container.querySelector('input[data-role="per_page"]');
                if (_this.labeltPerPage) {
                    _this.labeltPerPage.addEventListener('input', _this.changePerPage.bind(_this), false);
                    _this.labeltPerPage.value = _this.chat.data.perPageValue;
                }
                _this.showPerPage = _this.filter_container.querySelector('button[data-role="per_page"]');
                if (_this.showPerPage) {
                    _this.showPerPage.addEventListener('click', _this.showPerPage.bind(_this), false);
                }
                _this.rteShowPerPage = _this.filter_container.querySelector('input[data-role="rteShowPerPage"]');
                if (_this.rteShowPerPage) {
                    _this.rteShowPerPage.addEventListener('change', _this.changeRealTimeEditing.bind(_this), false);
                }

            },

            showEnablePagination: function() {
                var _this = this;
                console.log("renderPagination");
                _this.trigger("renderPagination");
            },

            changePerPage: function() {
                var _this = this;
                _this.chat.data.perPageValue = parseInt(_this.labeltPerPage.value);

                if (_this.chat.data.redraw_mode === "rte") {
                    _this.chat.data.curPage = null;
                    if (_this.chat.data.showEnablePagination) {
                        if (_this.labeltPerPage.value !== "") {
                            _this.trigger("changePerPage");
                        }
                    }
                }
            },

            showPerPage: function() {
                var _this = this;

                _this.chat.data.perPageValue = parseInt(_this.labeltPerPage.value);
                _this.chat.data.curPage = null;
                if (_this.chat.data.showEnablePagination) {
                    if (_this.labeltPerPage.value !== "") {
                        _this.trigger("changePerPage");
                    }
                }
            }

        };
        extend(header, event_core);
        extend(header, async_core);
        extend(header, ajax_core);
        extend(header, template_core);
        extend(header, render_layout_core);

        header.prototype.header_template = header.prototype.template(header_template);
        header.prototype.filter_template = header.prototype.template(filter_template);
        header.prototype.triple_element_template = header.prototype.template(triple_element_template);
        header.prototype.button_template = header.prototype.template(button_template);
        header.prototype.label_template = header.prototype.template(label_template);
        header.prototype.input_template = header.prototype.template(input_template);

        header.prototype.dataMap = {
            WEBRTC: '',
            TAB: '',
            FILTER: '',
            WAITER: ''
        };

        header.prototype.templateMap = {
            WEBRTC: header.prototype.header_template,
            TAB: header.prototype.header_template,
            FILTER: header.prototype.filter_template,
            WAITER: ''
        };

        return header;
    });
