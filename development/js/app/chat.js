define('chat', [
        'header',
        'editor',
        'pagination',
        'settings',
        'contact_list',
        'messages',
        'indexeddb',
        'webrtc',

        'ajax_core',
        'template_core',
        'id_core',

        'text!../html/chat_template.html',
        'text!../html/outer_container_template.html'
    ],
    function(header,
             editor,
             pagination,
             settings,
             contact_list,
             messages,
             indexeddb,
             webrtc,

             ajax_core,
             template_core,
             id_core,

             chat_template,
             outer_container_template) {
        var chat = function(userId) {
            this.userId = userId;
            this.chatId = this.generateId();
        };

        chat.prototype = {

            toString: function() {
                //Object.defineProperties()
                // TODO define enumerable properties for iterating and serializing into string
            },

            chatsArray: [],

            MODE: {
                SETTING: 'SETTING',
                MESSAGES: 'MESSAGES',
                CONTACT_LIST: 'CONTACT_LIST',
                WEBRTC: 'WEBRTC'
            },

            initialize: function(chatElem, mainContainer) {
                var _this = this;

                _this.data = {
                    mode: _this.MODE.MESSAGES, //webrtc
                    body_mode: _this.MODE.MESSAGES,
                    redraw_mode: "rte",
                    redraw_choice_page_mode: "rte",
                    curPage: null,
                    firstPage: 1,
                    lastPage: null,
                    padding: {
                        bottom: 5
                    },
                    per_page_value: 2,
                    valueEnablePagination: false,
                    showChoicePerPage: false
                };
                // TODO replace with template
                _this.chatElem = chatElem;
                _this.chatElem.className = "modal";
                mainContainer.appendChild(_this.chatElem);
                _this.chatElem.innerHTML = _this.chat_template();
                _this.body_outer_container = _this.chatElem.querySelector('[data-role="body_outer_container"]');

                _this.newHeader = new header({chat: _this});
                _this.newEditor = new editor().initialize({chat: _this});
                _this.newPagination = new pagination();
                _this.newSettings = new settings({chat: _this});
                _this.newContact_list = new contact_list({chat: _this});
                _this.newMessages = new messages();
                _this.indexeddb = indexeddb;
                _this.webrtc = new webrtc().initialize({chat: _this});
                _this.addEventListeners();

                _this.renderByMode();
                return _this;
            },

            renderByMode: function() {
                var _this = this;
                switch (_this.data.mode) {
                    case "WEBRTC":
                        _this.newHeader.renderByMode({chat: _this});
                        _this.webrtc.renderHanshake();
                        break;
                    case "MESSAGES":
                        _this.body_outer_container.innerHTML = _this.outer_container_template();
                        _this.newEditor.renderEditorPanel(function() {
                            _this.newHeader.renderByMode({chat: _this});
                            _this.newMessages.initialize({start: 0, chat: _this});
                            _this.messages_container = _this.chatElem.querySelector('[data-role="messages_container"]');
                            _this.messageElem = _this.chatElem.querySelector('[data-role="message_container"]');
                        });
                        break;
                }
            },

            addEventListeners: function() {
                var _this = this;
                _this.removeEventListeners();

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

                //_this.newPagination.on('resizeMessagesContainer', _this.resizeMessagesContainer.bind(_this), _this);
                _this.newPagination.on('fillListMessage', function(obj) {
                    _this.fillMessages(obj);
                }, _this);
                _this.newPagination.on('calcMessagesContainerHeight', _this.calcMessagesContainerHeight.bind(_this), _this);

                _this.newMessages.on('resizeMessagesContainer', _this.resizeMessagesContainer.bind(_this), _this);
            },

            removeEventListeners: function() {
                var _this = this;
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

                //_this.newPagination.off('resizeMessagesContainer');
                _this.newPagination.off('fillListMessage');
            },

            renderPagination: function() {
                var _this = this;
                _this.newPagination.initialize({chat: _this});
            },

            fillMessages: function(obj) {
                var _this = this;
                _this.newMessages.fillListMessage(obj);
            },

            renderMassagesEditor: function(callback) {
                var _this = this;
                _this.body_outer_container = _this.chatElem.querySelector('[data-role="body_outer_container"]');
                _this.body_outer_container.innerHTML = _this.outer_container_template();
                _this.newEditor.renderEditorPanel(function() {
                    _this.messages_container = _this.chatElem.querySelector('[data-role="messages_container"]');
                    _this.messageElem = _this.chatElem.querySelector('[data-role="message_container"]');
                    _this.newPagination.initialize({chat: _this}, callback);
                    //_this.resizeMessagesContainer();
                    //if (callback) {
                    //    callback();
                    //}
                });
            },

            renderPerPageMessages: function() {
                var _this = this;
                _this.newPagination.renderPagination();
            },

            renderSettings: function() {
                var _this = this;
                _this.newSettings.renderSettings({chat: _this});
            },

            renderContactList: function() {
                var _this = this;
                _this.newContact_list.renderContactList({chat: _this});
            },

            resizeMessagesContainer: function() {
                var _this = this;
                _this.calcMessagesContainerHeight();
                _this.messages_container.scrollTop = 9999;
            },

            calcMessagesContainerHeight: function() {
                var _this = this;
                _this.btnEditPanel = _this.chatElem.querySelector('[data-action="btnEditPanel"]');
                if(_this.btnEditPanel){
                    var turnScrol = _this.btnEditPanel.querySelector('input[name="ControlScrollMessage"]');
                }
                _this.header_container = _this.chatElem.querySelector('[data-role="header_container"]');
                _this.controls_container = _this.chatElem.querySelector('[data-role="controls_container"]');
                _this.pagination_container = _this.chatElem.querySelector('[data-role="pagination_container"]');
                _this.choice_per_page_container = _this.chatElem.querySelector('[data-role="per_page_container"]');
                _this.message = _this.messageElem.firstElementChild;
                if (!turnScrol || turnScrol && !turnScrol.checked) {
                    var param = _this.body_outer_container.getAttribute('param-content');
                    var height = window.innerHeight - _this.header_container.clientHeight - _this.choice_per_page_container.clientHeight - _this.pagination_container.clientHeight - _this.controls_container.clientHeight - _this.messageElem.clientHeight - _this.data.padding.bottom;
                    var paddingMessages = parseInt(window.getComputedStyle(_this.messages_container, null).getPropertyValue('padding-top')) + parseInt(window.getComputedStyle(_this.messages_container, null).getPropertyValue('padding-bottom'));
                    var marginMessages = parseInt(window.getComputedStyle(_this.messages_container, null).getPropertyValue('padding-top'));
                    var borderEditor = parseInt(window.getComputedStyle(_this.message, null).getPropertyValue('border-top-width')) + parseInt(window.getComputedStyle(_this.message, null).getPropertyValue('border-bottom-width'));
                    _this.messages_container.style.maxHeight = height - paddingMessages - borderEditor - marginMessages + "px";
                }
            },

            calcOuterContainerHeight: function() {
                var _this = this;
                var height = window.innerHeight - _this.header_container.clientHeight;
                var marginHeader = parseInt(window.getComputedStyle(_this.header_container, null).getPropertyValue('margin-top'));
                _this.body_outer_container.style.height = height - marginHeader + "px";
            }

        };
        extend(chat, ajax_core);
        extend(chat, template_core);
        extend(chat, id_core);

        chat.prototype.chat_template = chat.prototype.template(chat_template);
        chat.prototype.outer_container_template = chat.prototype.template(outer_container_template);

        return chat;
    });

