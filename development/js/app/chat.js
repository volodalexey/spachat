define('chat', [
        'header',
        'editor',
        'pagination',
        'settings',
        'contact_list',
        'messages',
        'ajax_core',
        'indexeddb',

        'text!../html/chat_template.html',
        'text!../html/outer_container_template.html'
    ],
    function(header,
             editor,
             pagination,
             settings,
             contact_list,
             messages,
             ajax_core,
             indexeddb,

             chat_template,
             outer_container_template) {
        var chat = function() {
        };

        chat.prototype = {

            chatsArray: [],

            initialize: function(chatElem, mainContainer) {
                var _this = this;
                _this.newHeader = new header();
                _this.newEditor = new editor();
                _this.newPagination = new pagination();
                _this.newSettings = new settings();
                _this.newContact_list = new contact_list();
                _this.newMessages = new messages();
                _this.indexeddb = new indexeddb().initialize();
                _this.addEventListeners();
                _this.chat_template = _.template(chat_template);
                _this.outer_container_template = _.template(outer_container_template);
                _this.data = {
                    curPage: "",
                    firstPage: "",
                    lastPage: "",
                    padding: {
                        bottom: 5
                    }
                };
                _this.chatElem = chatElem;
                _this.chatElem.className = "modal";
                mainContainer.appendChild(_this.chatElem);
                _this.chatElem.innerHTML = _this.chat_template();
                _this.newHeader.initialize(_this.chatElem, _this.data);
                _this.body_outer_container = _this.chatElem.querySelector('[data-role="body_outer_container"]');
                _this.body_outer_container.innerHTML = _this.outer_container_template();
                _this.newEditor.initialize(_this.chatElem);
                _this.messages_container = _this.chatElem.querySelector('[data-role="messages_container"]');
                _this.messageElem = _this.chatElem.querySelector('[data-role="message_container"]');
                //_this.fillListMessage();
                _this.newMessages.initialize({start: 0, chat: _this});

                _this.data.valueEnablePagination = false;
                _this.data.per_page_value = 10;
                return _this;
            },

            addEventListeners: function() {
                var _this = this;
                _this.removeEventListeners();
                _this.newEditor.on('sendMessage', _this.sendMessage.bind(_this), _this);
                _this.newEditor.on('calcMessagesContainerHeight', _this.calcMessagesContainerHeight.bind(_this), _this);

                _this.newHeader.on('resizeMessagesContainer', _this.resizeMessagesContainer.bind(_this), _this);
                _this.newHeader.on('renderSettings', _this.renderSettings.bind(_this), _this);
                _this.newHeader.on('renderContactList', _this.renderContactList.bind(_this), _this);
                _this.newHeader.on('changePerPage', _this.renderPerPageMessages.bind(_this), _this);
                _this.newHeader.on('calcOuterContainerHeight', _this.calcOuterContainerHeight.bind(_this), _this);
                _this.newHeader.on('renderMassagesEditor', _this.renderMassagesEditor.bind(_this), _this);
                _this.newHeader.on('renderPagination', _this.renderPagination.bind(_this), _this);

                _this.newSettings.on('calcOuterContainerHeight', _this.calcOuterContainerHeight.bind(_this), _this);
                _this.newSettings.on('renderMassagesEditor', _this.renderMassagesEditor.bind(_this), _this);
                _this.newSettings.on('renderPagination', _this.renderPagination.bind(_this), _this);

                _this.newContact_list.on('calcOuterContainerHeight', _this.calcOuterContainerHeight.bind(_this), _this);
                _this.newContact_list.on('renderMassagesEditor', _this.renderMassagesEditor.bind(_this), _this);
                _this.newContact_list.on('renderPagination', _this.renderPagination.bind(_this), _this);

                _this.newPagination.on('resizeMessagesContainer', _this.resizeMessagesContainer.bind(_this), _this);
                _this.newPagination.on('fillListMessage', function(obj) {
                    _this.fillMessages(obj);
                }, _this);
                _this.newPagination.on('calcMessagesContainerHeight', _this.calcMessagesContainerHeight.bind(_this), _this);

            },

            removeEventListeners: function() {
                var _this = this;
                _this.newEditor.off('sendMessage');
                _this.newEditor.off('calcMessagesContainerHeight');

                _this.newHeader.off('changePerPage');
                _this.newHeader.off('renderSettings');
                _this.newHeader.off('calcOuterContainerHeight');
                _this.newHeader.off('renderContactList');
                _this.newHeader.off('resizeMessagesContainer');
                _this.newHeader.off('renderMassagesEditor');
                _this.newHeader.off('renderPagination');

                _this.newSettings.off('renderMassagesEditor');
                _this.newSettings.off('renderPagination');
                _this.newSettings.off('calcOuterContainerHeight');

                _this.newContact_list.off('calcOuterContainerHeight');
                _this.newContact_list.off('renderMassagesEditor');
                _this.newContact_list.off('renderPagination');

                _this.newPagination.off('resizeMessagesContainer');
                _this.newPagination.off('fillListMessage');
            },

            renderPagination: function() {
                var _this = this;
                _this.newPagination.initialize(_this.chatElem, _this.data);

            },

            fillMessages: function(obj) {
                var _this = this;
                _this.newMessages.fillListMessage(obj);
            },

            renderMassagesEditor: function() {
                var _this = this;
                _this.body_outer_container = _this.chatElem.querySelector('[data-role="body_outer_container"]');
                _this.body_outer_container.innerHTML = _this.outer_container_template();
                _this.newEditor.initialize(_this.chatElem);
                _this.messages_container = _this.chatElem.querySelector('[data-role="messages_container"]');
                _this.messageElem = _this.chatElem.querySelector('[data-role="message_container"]');
                //_this.newMessages.initialize(_this.chatElem, {start: 0 , final: localStorage.length});
                //_this.newPagination.countQuantityPages();
                _this.newPagination.initialize(_this.chatElem, _this.data);
                _this.resizeMessagesContainer();

            },

            renderPerPageMessages: function() {
                var _this = this;
                _this.newPagination.initialize(_this.chatElem, _this.data);
                //if (_this.data.per_page_value !== NaN) {
                _this.data.curPage = Math.ceil(localStorage.length / _this.data.per_page_value);
                _this.newPagination.countQuantityPages();
                _this.newPagination.fillFirstPage();
                _this.newPagination.fillLastPage();
                //}
            },

            renderSettings: function() {
                var _this = this;
                _this.newSettings.initialize(_this.chatElem, _this.data);
            },

            renderContactList: function() {
                var _this = this;
                _this.newContact_list.initialize(_this.chatElem);
            },

            resizeMessagesContainer: function() {
                var _this = this;
                _this.calcMessagesContainerHeight();
                _this.messages_container.scrollTop = 9999;
            },

            calcMessagesContainerHeight: function() {
                var _this = this;
                _this.btnEditPanel = _this.chatElem.querySelector('[data-action="btnEditPanel"]');
                _this.header_container = _this.chatElem.querySelector('[data-role="header_container"]');
                _this.controls_container = _this.chatElem.querySelector('[data-role="controls_container"]');
                _this.paginationContainer = _this.chatElem.querySelector('[data-role="pagination_container"]');
                _this.choice_per_page_container = _this.chatElem.querySelector('[data-role="per_page_container"]');
                _this.message = _this.messageElem.firstElementChild;
                var turnScrol = _this.btnEditPanel.querySelector('input[name="ControlScrollMessage"]');
                if (!turnScrol || turnScrol && !turnScrol.checked) {
                    var param = _this.body_outer_container.getAttribute('param-content');
                    var height = window.innerHeight - _this.header_container.clientHeight - _this.choice_per_page_container.clientHeight - _this.paginationContainer.clientHeight - _this.controls_container.clientHeight - _this.messageElem.clientHeight - _this.data.padding.bottom;
                    var paddingMessages = parseInt(window.getComputedStyle(_this.messages_container, null).getPropertyValue('padding-top')) + parseInt(window.getComputedStyle(_this.messages_container, null).getPropertyValue('padding-bottom'));
                    var marginMessages = parseInt(window.getComputedStyle(_this.messages_container, null).getPropertyValue('padding-top'));
                    var borderEditor = parseInt(window.getComputedStyle(_this.message, null).getPropertyValue('border-top-width')) + parseInt(window.getComputedStyle(_this.message, null).getPropertyValue('border-bottom-width'));
                    /*console.log(
                     "window.innerHeight =" , window.innerHeight,
                     "_this.header_container.clientHeight=" , _this.header_container.clientHeight,
                     "_this.paginationContainer.clientHeight=", _this.paginationContainer.clientHeight,
                     "_this.controls_container.clientHeight=", _this.controls_container.clientHeight,
                     "_this.messageElem.clientHeight=", _this.messageElem.clientHeight,
                     "paddingMessages=", paddingMessages,
                     "marginMessages=", marginMessages,
                     "borderEditor=", borderEditor,
                     //"marginEditPanel", marginEditPanel,
                     "maxHeight=", height - paddingMessages - borderEditor - marginMessages
                     );*/
                    _this.messages_container.style.maxHeight = height - paddingMessages - borderEditor - marginMessages + "px";
                }
            },

            calcOuterContainerHeight: function() {
                var _this = this;
                var height = window.innerHeight - _this.header_container.clientHeight;
                var marginHeader = parseInt(window.getComputedStyle(_this.header_container, null).getPropertyValue('margin-top'));
                _this.body_outer_container.style.height = height - marginHeader + "px";
            },

            // TODO move to editor ?
            sendMessage: function() {
                var _this = this;
                if (!_this.messageElem) {
                    return;
                }

                // TODO replace with data-role
                var newMessage = _this.messageElem.firstElementChild;
                var pattern = /[^\s{0,}$|^$]/;
                if (pattern.test(newMessage.innerText)) {
                    _this.newMessages.addMessage({}, newMessage.innerHTML);
                    newMessage.innerText = "";
                }
            }

        };
        extend(chat, ajax_core);

        return chat;
    });

