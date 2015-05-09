define ('header',[
        'event',
        "pagination",
        'text!../html/contact_list_template.html',
        'text!../html/setting_template.html',
        'text!../html/filter_template.html',
        'text!../html/header_template.html',
    ],
    function(
        event,
        pagination,
        contact_list_template,
        setting_template,
        filter_template,
        header_template
    ) {

        var header = function() {
        };

        header.prototype = {

            initialize: function (newChat){
                var _this = this;
                _this.newChat = newChat;
                _this.header_template = _.template(header_template);
                _this.trigger('sendRequestHeader_navbar_config', {"name": "/mock/header_navbar_config.json"});
            },

            render: function(res){
                var _this = this;
                _this.header_navbar_config = res;
                _this.header_container = _this.newChat.querySelector('[data-role="header_container"]');
                _this.header_container.innerHTML += _this.header_template({
                    header_btn: _this.header_navbar_config
                });
            },


            initialize2: function(newChat, chat_template){
                var _this = this;
                _this.newChat = newChat;
                _this.chat_template = chat_template;
                _this.contact_list_template = _.template(contact_list_template);
                _this.setting_template = _.template(setting_template);
                _this.filter_template = _.template(filter_template);
                _this.header_container = _this.newChat.querySelector('[data-role="header_container"]');
                _this.filter_container = _this.newChat.querySelector('[data-role="filter_container"]');
                var btnSettingHeader = _this.header_container.querySelector('[name="Setting"]');
                if(btnSettingHeader){
                    btnSettingHeader.addEventListener('click', _this.renderSettings.bind(_this), false);
                }
                var btnListContactHeader = _this.header_container.querySelector('[name="ContactList"]');
                if(btnListContactHeader){
                    btnListContactHeader.addEventListener('click', _this.renderContactList.bind(_this), false);
                }
                var btnFilterHeader = _this.header_container.querySelector('[name="Filter"]');
                if(btnFilterHeader){
                    btnFilterHeader.addEventListener('click', _this.renderFilter.bind(_this), false);
                }
                _this.outer_container = _this.newChat.querySelector('[data-role="outer_container"]');
                _this.filter_container = _this.newChat.querySelector('[data-role="filter_container"]');

                _this.valueEnablePagination = false;


                return _this;
            },

            renderFilter: function (){
                var _this = this;
                if(_this.filter_container.classList.contains('hide')){
                    _this.filter_container.innerHTML = _this.filter_template();
                    _this.filter_container.classList.remove('hide');
                    _this.fromEditorResize();
                    //var newPagination = new pagination();
                    pagination.initialize(_this.newChat, _this.valueEnablePagination);
                    _this.enable_pagination = _this.newChat.querySelector('[data-role="enable_pagination"]');
                    _this.valueEnablePagination = _this.enable_pagination.checked;
                    _this.valueEnablePagination = pagination.showPagination();
                } else {
                    _this.valueEnablePagination = _this.newChat.querySelector('[data-role="enable_pagination"]').checked;

                    _this.filter_container.innerHTML = "";
                    _this.filter_container.classList.add('hide');
                    _this.fromEditorResize();
                }
            },

            calcOuterContainerHeight: function(){
                var _this = this;
                var height = window.innerHeight - _this.header_container.clientHeight ;
                //var padding = parseInt(window.getComputedStyle(element, null).getPropertyValue('border-top')) + parseInt(window.getComputedStyle(element, null).getPropertyValue('border-bottom'));
                var marginHeader = parseInt(window.getComputedStyle(_this.header_container, null).getPropertyValue('margin-top'));
                _this.outer_container.style.height = height -  marginHeader + "px";
            },

            renderSettings: function(){
                var _this = this;
                _this.outer_container.innerHTML = _this.setting_template();
                _this.calcOuterContainerHeight();
                var param = _this.outer_container.getAttribute('param-content');
                if(param === "setting"){
                    _this.outer_container.innerHTML = "";
                    _this.outer_container.innerHTML = _this.chat_template();

                    _this.fromEditorMes();
                    _this.fromEditorResize();
                    var newChat = new chat();
                    newChat.initialize(_this.newChat);

                    _this.outer_container.setAttribute("param-content", "message");
                } else {
                    _this.outer_container.innerHTML = _this.setting_template();
                    _this.outer_container.setAttribute("param-content", "setting");
                }
            },

            renderContactList: function(){
                var _this = this;
                _this.outer_container.innerHTML = _this.contact_list_template();
                _this.calcOuterContainerHeight();
                var param = _this.outer_container.getAttribute('param-content');
                var newEditor = new editor();
                if(param === "contact_list"){
                    _this.outer_container.innerHTML = "";
                    _this.outer_container.innerHTML = _this.chat_template();

                    _this.fromEditorMes();
                    _this.fromEditorResize();
                    newEditor.initialize(_this.newChat);
                    _this.outer_container.setAttribute("param-content", "message");
                } else {
                    _this.outer_container.innerHTML = _this.contact_list_template();
                    _this.outer_container.setAttribute("param-content", "contact_list");
                    newEditor.sendRequest('/mock/contact_list_config.json', function(err, res) {
                        if (err) {
                            console.log("Error");
                        } else {
                            _this.contact_body = _this.outer_container.querySelector('[data-role="contact_body"]');
                            _this.contact_body.innerHTML = res;
                        }
                    });
                }

/*
                _this.contact_list_container.innerHTML = _this.contact_list_template();
                if(_this.setting_container.classList.contains("hide")){
                    _this.addRemoveClassElements([_this.messages_container, _this.messageElem, _this.controls_container] , "hide");
                } else {
                    _this.setting_container.classList.add("hide");
                }
                _this.addRemoveClassElements([_this.contact_list_container], "hide");
                _this.calcMoreConteinerHeight(_this.contact_list_container);
                _this.sendRequest('/mock/contact_list_config.json', function(err, res) {
                    if (err) {
                        console.log("Error");
                    } else {
                        _this.contact_body = _this.contact_list_container.querySelector('[data-role="contact_body"]');
                        _this.contact_body.innerHTML = res;
                    }
                });*/
            },

            fromEditorMes: function() {
                var _this = this;

                _this.messages_container = _this.newChat.querySelector('[data-role="messages_container"]');

                if (_this.messages_container) {
                    for (var i = 0; i < localStorage.length; i++) {
                        var newMessage = document.createElement('div');
                        var key = localStorage.key(i);
                        newMessage.innerHTML = localStorage.getItem(key);
                        _this.messages_container.appendChild(newMessage);
                    }
                }
            },

            fromEditorResize: function (){
                var _this = this;
                _this.messages_container = _this.newChat.querySelector('[data-role="messages_container"]');

                _this.btnEditPanel = _this.newChat.querySelector('[data-action="btnEditPanel"]');
                _this.controls_container = _this.newChat.querySelector('[data-role="controls_container"]');
                _this.messageElem =  _this.newChat.querySelector('[data-role="message_container"]');
                var turnScrol = _this.btnEditPanel.querySelector('input[name="ControlScrollMessage"]');
                if (!turnScrol || turnScrol && !turnScrol.checked) {
                    var height = window.innerHeight - _this.header_container.clientHeight - _this.controls_container.clientHeight - _this.messageElem.clientHeight;
                    var paddingMessages = parseInt(window.getComputedStyle(_this.messages_container, null).getPropertyValue('padding-top')) + parseInt(window.getComputedStyle(_this.messages_container, null).getPropertyValue('padding-bottom'));
                    var marginControls = parseInt(window.getComputedStyle(_this.messages_container, null).getPropertyValue('padding-top'))
                    var marginEditPanel = parseInt(window.getComputedStyle(_this.btnEditPanel, null).getPropertyValue('margin-bottom'));
                    _this.messages_container.style.maxHeight = height - paddingMessages - marginControls -  marginEditPanel + "px";
                }
            }

        }

        extend(header, event);

        return header;
    });
