define ('editor',[
        'event',
        'async_core',
        'text!../html/editor_template.html',
        'text!../html/edit_btn_template.html'
    ],
    function(
        event,
        async_core,
        editor_template,
        edit_btn_template
    ) {

        var editor = function() {
        };

        editor.prototype = {

            initialize: function(newChat){
                var _this = this;
                _this.newChat = newChat;
                _this.editor_template = _.template(editor_template);
                _this.edit_btn_template = _.template(edit_btn_template);
                _this.editor_container = _this.newChat.querySelector('[data-role="editor_container"]');
                _this.editor_container.innerHTML += _this.editor_template();
                var submit = _this.newChat.querySelector('[data-role="submit"]');
                if (submit) {
                    submit.addEventListener('click', _this.sendMessages.bind(_this), false);
                }
                var format = _this.newChat.querySelector('[data-role="format"]');
                if (format) {
                    _this.btnEditPanel = _this.newChat.querySelector('[data-action="btnEditPanel"]');
                    format.addEventListener('click', _this.renderEditPanel.bind(_this), false);
                }
                _this.trigger('sendRequestEditNavbarConfig', {'name': '/mock/edit_navbar_config.json'});
                _this.messageElem = _this.newChat.querySelector('[data-role="message_container"]');
                return _this;
            },

            sendMessages:function(){
                var _this = this;
                _this.trigger('sendMessage');
            },

            renderEditPanel:function(){
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

            addEdit: function(btn) {
                var _this = this;
                return function() {
                    var command = btn.getAttribute("name");
                    var param = btn.hasAttribute("param");
                    _this.container = _this.messageElem.querySelector(".container");
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

            loadEditNavbarIcon: function(res, callback) {
                var _this = this;
                _this.edit_navbar_config = res;
                _this.edit_navbar_config_Filter = _.filter(_this.edit_navbar_config, function(btn) {
                    return btn.icon;
                })
                _this.edit_btn_icon = _this.edit_navbar_config_Filter.map(function(btn) {
                    return btn.icon;
                });
                var arrIcon = [];
                var index;
                for (index = 0; index < _this.edit_btn_icon.length; ++index) {
                    var name = '/html/icon/' + _this.edit_btn_icon[index] + '.html';
                    arrIcon.push({"icon": _this.edit_btn_icon[index], "name": name});
                }
                async_core.ceach(arrIcon,
                    function(obj, _callback) {
                        _this.trigger('sendRequestEditNavbarIcon', {'name': obj.name});

                        _callback();
                        //_this.sendRequest(obj.name, function(err, res) {
                        //    if (err) {
                        //        _callback(err);
                        //    } else {
                        //        obj.svg = res;
                        //        _callback();
                        //    }
                        //})
                    },
                    function(allError) {
                        if (allError) {
                            callback(allError);
                        } else {
                            _this.edit_btn_icon_config = arrIcon;
                            //console.log(_this.edit_btn_icon_config)
                            callback();
                        }
                    }
                );
            }
        }

        extend(editor, event);

        return editor;
    });
