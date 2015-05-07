define('editor', [
        'async_core',
        'text!../html/edit_btn_template.html'
    ],
    function(
        async_core,
        edit_btn_template
    ) {
        var editor_modal = function() {
        };

        editor_modal.prototype = {

            initialize: function(newChat) {
                var _this = this;
                _this.newChat = newChat;

                _this.edit_btn_template = _.template(edit_btn_template);


                var submit = newChat.querySelector('[data-role="submit"]');
                _this.messageElem = newChat.querySelector('[data-role="message_container"]');
                _this.container = _this.messageElem.querySelector(".container");
                if (submit) {

                    _this.messages_container = newChat.querySelector('[data-role="messages_container"]');
                    submit.addEventListener('click', _this.sendMessage.bind(_this), false);
                }
                var format = _this.newChat.querySelector('[data-role="format"]');
                if (format) {
                    _this.btnEditPanel = _this.newChat.querySelector('[data-action="btnEditPanel"]');
                    format.addEventListener('click', _this.renderEditPanel.bind(_this), false);
                }
                _this.header_container = _this.newChat.querySelector('[data-role="header_container"]');
                              _this.controls_container = newChat.querySelector('[data-role="controls_container"]');
                _this.calcMessagesContainerHeight();

                _this.messages_container.scrollTop = 9999;

                _this.loadEditNavbarConfig(function(err) {
                    if (err) {
                        console.log(err);
                        return;
                    }
                    _this.edit_navbar_config_Filter = _.filter(_this.edit_navbar_config, function(btn) {
                        return btn.icon
                    })
                    _this.edit_btn_icon = _this.edit_navbar_config_Filter.map(function(btn) {
                        return btn.icon;
                    });
                    _this.edit_btn_icon_config = _this.loadEditNavbarIcon(function(err) {
                        if (err) {
                            console.log(err);
                            return;
                        }
                    });
                });

                return _this;
            },

            addRemoveClassElements: function(arElem, className){
                _.each(arElem, function(elem){
                    if (elem.classList.contains(className)) {
                        elem.classList.remove(className);
                    } else {
                        elem.classList.add(className);
                    }
                })
            },

            calcMessagesContainerHeight: function() {
                var _this = this;
                var turnScrol = _this.btnEditPanel.querySelector('input[name="ControlScrollMessage"]');
                if (!turnScrol || turnScrol && !turnScrol.checked) {
                    var height = window.innerHeight - _this.header_container.clientHeight - _this.controls_container.clientHeight - _this.messageElem.clientHeight;
                    var paddingMessages = parseInt(window.getComputedStyle(_this.messages_container, null).getPropertyValue('padding-top')) + parseInt(window.getComputedStyle(_this.messages_container, null).getPropertyValue('padding-bottom'));
                    var marginControls = parseInt(window.getComputedStyle(_this.messages_container, null).getPropertyValue('padding-top'))
                    var marginEditPanel = parseInt(window.getComputedStyle(_this.btnEditPanel, null).getPropertyValue('margin-bottom'));
                    _this.messages_container.style.maxHeight = height - paddingMessages - marginControls -  marginEditPanel + "px";
                    //return height;
                }
            },

            sendMessage: function() {
                var _this = this;
                if (_this.messages_container) {
                    if (_this.messageElem) {
                        _this.message = _this.messageElem.firstElementChild;
                        var pattern = /[^\s]/;
                        var res = pattern.test(_this.message.innerText);
                        if (_this.message.innerText !== "" && res) {
                            var message = _this.message.cloneNode(true);
                            var newMessage = document.createElement('div');
                            newMessage.innerHTML = message.innerHTML;
                            _this.messages_container.appendChild(newMessage);
                            localStorage.setItem((new Date()).getTime(), message.innerHTML);
                        }
                        _this.message.innerText = "";
                        _this.messages_container.scrollTop = 9999;
                    }
                }
            },

            addEdit: function(btn) {
                var _this = this;
                return function() {
                    var command = btn.getAttribute("name");
                    var param = btn.hasAttribute("param");
                    _this.container.focus();
                    if (param) {
                        document.execCommand(command, null, "red");
                    } else {
                        document.execCommand(command, null, null);
                    }
                }
            },

            changeEdit: function() {
                var _this = this;
                return function() {
                    _this.addRemoveClassElements([_this.container], "onScroll");
                }
            },

            renderEditPanel: function() {
                var _this = this;
                if (_this.btnEditPanel) {
                    if (_this.btnEditPanel.innerHTML !== "") {
                        _this.btnEditPanel.innerHTML = "";
                    } else {
                        _this.btnEditPanel.innerHTML = _this.edit_btn_template({
                            config: _this.edit_navbar_config,
                            icons: _this.edit_btn_icon_config
                        });
                        var btnPanel = _this.newChat.querySelectorAll('[data-role="btnEdit"]');
                        for (var i = 0, l = btnPanel.length; i < l; i++) {
                            if (btnPanel[i].localName === "button") {
                                btnPanel[i].addEventListener('click', _this.addEdit(btnPanel[i]), false);
                            }
                            if (btnPanel[i].localName === "input") {
                                btnPanel[i].addEventListener('change', _this.changeEdit(), false);
                            }
                        }
                    }
                    _this.messages_container = _this.newChat.querySelector('[data-role="messages_container"]');
                    if (_this.messages_container) {
                        _this.messages_container.scrollTop = 9999;
                    }
                    _this.calcMessagesContainerHeight();
                }
            },

            loadEditNavbarConfig: function(callback) {
                var _this = this;
                var name = '/mock/edit_navbar_config.json';
                _this.sendRequest(name, function(err, res) {
                    if (err) {
                        callback(err);
                    } else {
                        _this.edit_navbar_config = JSON.parse(res);
                        callback();
                    }
                })
            },

            loadEditNavbarIcon: function(callback) {
                var _this = this;
                var arrIcon = [];
                var index;
                for (index = 0; index < _this.edit_btn_icon.length; ++index) {
                    var name = '/html/icon/' + _this.edit_btn_icon[index] + '.html';
                    arrIcon.push({"icon": _this.edit_btn_icon[index], "name": name});
                }
                async_core.ceach(arrIcon,
                    function(obj, _callback) {
                        _this.sendRequest(obj.name, function(err, res) {
                            if (err) {
                                _callback(err);
                            } else {
                                obj.svg = res;
                                _callback();
                            }
                        })
                    },
                    function(allError) {
                        if (allError) {
                            callback(allError);
                        } else {
                            _this.edit_btn_icon_config = arrIcon;
                            callback();
                        }
                    }
                );
            },

            sendRequest: function(name, callback) {
                var xhr = new XMLHttpRequest();
                xhr.open('GET', name, true);

                xhr.onreadystatechange = function() {
                    if (xhr.readyState == 4) {
                        if (xhr.status != 200) {
                            callback('Error ' + xhr.status + ': ' + xhr.statusText);
                        } else {
                            callback(null, xhr.responseText);
                        }
                    }
                };
                xhr.send();
            }
        };

        return editor_modal;
    });

