define('chat', [
        'header',
        'editor',
        'pagination',
        'async_core',
        'ajax_core',
        'text!../html/chat_template.html',
        'text!../html/outer_container_template.html'
    ],
    function(header,
             editor,
             pagination,
             async_core,
             ajax_core,
             chat_template,
             outer_container_template) {
        var chat = function() {
        };

        chat.prototype = {

            initialize: function(newChat, mainContainer) {
                var _this = this;
                _this.newHeader = new header();
                _this.newEditor = new editor();
                _this.addEventListeners();
                _this.chat_template = _.template(chat_template);
                _this.outer_container_template = _.template(outer_container_template);
                _this.newChat = newChat;
                _this.newChat.className = "modal";
                mainContainer.appendChild(_this.newChat);
                _this.newChat.innerHTML = _this.chat_template();
                _this.newHeader.initialize(_this.newChat)
                _this.body_outer_container = _this.newChat.querySelector('[data-role="body_outer_container"]');
                _this.body_outer_container.innerHTML = _this.outer_container_template();
                _this.newEditor.initialize(_this.newChat);
                _this.messages_container = _this.newChat.querySelector('[data-role="messages_container"]');
                _this.messageElem = _this.newChat.querySelector('[data-role="message_container"]');
                _this.fillListMessage();
                return _this;
            },

            addEventListeners: function() {
                var _this = this;
                _this.removeEventListeners();
                _this.newEditor.on('sendMessage', _this.sendMessage.bind(_this), _this);
                _this.newEditor.on('calcMessagesContainerHeight', _this.calcMessagesContainerHeight.bind(_this), _this);
                _this.newHeader.on('resizeMessagesContainer', _this.resizeMessagesContainer.bind(_this), _this);
                _this.newHeader.on('renderMassagesEditor', _this.renderMassagesEditor.bind(_this), _this);
                pagination.on('resizeMessagesContainer', _this.resizeMessagesContainer.bind(_this), _this);
            },

            removeEventListeners: function() {
                var _this = this;
                _this.newEditor.off('sendMessage');
                _this.newEditor.off('calcMessagesContainerHeight');
                _this.newHeader.off('resizeMessagesContainer');
                _this.newHeader.off('renderMassagesEditor');
                pagination.off('resizeMessagesContainer');
            },

            renderMassagesEditor: function(){
                var _this = this;
                _this.body_outer_container = _this.newChat.querySelector('[data-role="body_outer_container"]');
                _this.body_outer_container.innerHTML = _this.outer_container_template();
                _this.newEditor.initialize(_this.newChat);
                _this.messages_container = _this.newChat.querySelector('[data-role="messages_container"]');
                _this.messageElem = _this.newChat.querySelector('[data-role="message_container"]');
                _this.fillListMessage();
                _this.resizeMessagesContainer();
            },

            fillListMessage: function() {
                var _this = this;
                if (_this.messages_container) {
                    for (var i = 0; i < localStorage.length; i++) {
                        var newMessage = document.createElement('div');
                        var key = localStorage.key(i);
                        newMessage.innerHTML = localStorage.getItem(key);
                        _this.messages_container.appendChild(newMessage);
                    }
                }
            },

            resizeMessagesContainer: function() {
                var _this = this;
                _this.calcMessagesContainerHeight();
                _this.messages_container.scrollTop = 9999;
            },

            calcMessagesContainerHeight: function() {
                var _this = this;
                _this.btnEditPanel = _this.newChat.querySelector('[data-action="btnEditPanel"]');
                _this.header_container = _this.newChat.querySelector('[data-role="header_container"]');
                _this.controls_container = _this.newChat.querySelector('[data-role="controls_container"]');
                _this.paginationContainer = _this.newChat.querySelector('[data-role="pagination_container"]');
                var turnScrol = _this.btnEditPanel.querySelector('input[name="ControlScrollMessage"]');
                if (!turnScrol || turnScrol && !turnScrol.checked) {
                    var height = window.innerHeight - _this.header_container.clientHeight - _this.paginationContainer.clientHeight - _this.controls_container.clientHeight - _this.messageElem.clientHeight;
                    var paddingMessages = parseInt(window.getComputedStyle(_this.messages_container, null).getPropertyValue('padding-top')) + parseInt(window.getComputedStyle(_this.messages_container, null).getPropertyValue('padding-bottom'));
                    var marginControls = parseInt(window.getComputedStyle(_this.messages_container, null).getPropertyValue('padding-top'));
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
            }

        };
        extend(chat, ajax_core);

        return chat;
    });

