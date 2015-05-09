define('chat', [
        'header',
        'editor',
        'async_core',
        'text!../html/edit_btn_template.html',
        'text!../html/header_template.html',
        'text!../html/chat_template.html'
    ],
    function(header,
             editor,
             async_core,
             edit_btn_template,
             header_template,
             chat_template) {
        var chat = function() {
        };

        chat.prototype = {

            initialize: function(newChat, mainConteiner) {
                var _this = this, newHeader = new header(), newEditor = new editor();
                _this.chat_template = _.template(chat_template);
                _this.newChat = newChat;
                _this.newChat.className = "modal";
                newHeader.off('sendRequestHeader_navbar_config');
                newHeader.off('sendMessage');
                newHeader.off('sendRequestEditNavbarConfig');
                newHeader.off('sendRequestEditNavbarIcon');

                newHeader.on('sendRequestHeader_navbar_config', function(obj) {
                    _this.sendRequest(obj.name, function(err, res) {
                        if (err) {
                            console.log("Error");
                        } else {
                            newHeader.render(JSON.parse(res));
                        }
                    })
                });
                newEditor.on('sendMessage', _this.sendMessage.bind(_this), _this);
                newEditor.on('sendRequestEditNavbarConfig', function(obj) {
                    _this.sendRequest(obj.name, function(err, res) {
                        if (err) {
                            console.log("Error");
                        } else {
                            newEditor.loadEditNavbarIcon (JSON.parse(res), function(err) {
                                if (err) {
                                    console.log(err);
                                    return;
                                }
                            });
                            ;
                        }
                    })
                });
                newEditor.on('sendRequestEditNavbarIcon', function(obj){
                    _this.sendRequest(obj.name, function(err, res) {
                        if (err) {
                            console.log("Error");
                        } else {
                            obj.svg = res;
                            //console.log("obj.svg", obj);
                        }
                    })
                }) ;

                _this.newChat.innerHTML = _this.chat_template({});
                mainConteiner.appendChild(_this.newChat);
                newHeader.initialize(_this.newChat);
                newEditor.initialize(_this.newChat);
                _this.messages_container = _this.newChat.querySelector('[data-role="messages_container"]');
                _this.messageElem = _this.newChat.querySelector('[data-role="message_container"]');
                _this.fillListMessage();
                /*

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
                 });*/
                return _this;
            },

            fillListMessage: function(){
                var _this = this;
                if(_this.messages_container){
                    for (var i = 0; i < localStorage.length; i++) {
                        var newMessage = document.createElement('div');
                        var key = localStorage.key(i);
                        newMessage.innerHTML = localStorage.getItem(key);
                        _this.messages_container.appendChild(newMessage);
                    }
                }
            },

            resizeChat:function(){
                var _this = this;
                _this.newChat.calcMessagesContainerHeight();
            },

            addRemoveClassElements: function(arElem, className) {
                _.each(arElem, function(elem) {
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
                    _this.messages_container.style.maxHeight = height - paddingMessages - marginControls - marginEditPanel + "px";
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

          /*  addEdit: function(btn) {
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
            },*/



            sendRequest: function(name, callback) {
                //console.log(name);
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

        return chat;
    });

