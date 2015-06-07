define('chat', [
        'header',
        'editor',
        'pagination',
        'settings',
        'contact_list',
        'messages',
        'webrtc',
        'websocket',

        'ajax_core',
        'template_core',
        'id_core',
        'extend_core',

        'text!../html/chat_template.html',
        'text!../html/outer_container_template.html',
        'text!../html/waiter_template.html',
        'text!../html/console_log_template.html'
    ],
    function(Header,
             Editor,
             Pagination,
             Settings,
             Contact_list,
             Messages,
             Webrtc,
             websocket,

             ajax_core,
             template_core,
             id_core,
             extend_core,

             chat_template,
             outer_container_template,
             waiter_template,
             console_log_template
    ) {

        var defaultOptions = {
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

        var chat = function(options) {
            this.extend(this, defaultOptions);
            this.extend(this, options);

            this.header = new Header({chat: this});
            this.editor = new Editor({chat: this});
            this.pagination = new Pagination({chat: this});
            this.settings = new Settings({chat: this});
            this.contact_list = new Contact_list({chat: this});
            this.messages = new Messages({chat: this});
            this.webrtc = new Webrtc({chat: this});
        };

        chat.prototype = {

            toStringKeys: ['chatId', 'userId'],

            valueOf: function() {
                var toStringObject = {};
                var _this = this;
                _this.toStringKeys.forEach(function(key) {
                    toStringObject[key] = _this[key];
                });
                return toStringObject;
            },

            chatsArray: [],

            MODE: {
                SETTING: 'SETTING',
                MESSAGES: 'MESSAGES',
                CONTACT_LIST: 'CONTACT_LIST',
                MESSAGES_DISCONNECTED: 'MESSAGES_DISCONNECTED',
                CREATED_AUTO: 'CREATED_AUTO',
                JOINED_AUTO_OFFER: 'JOINED_AUTO_OFFER',
                JOINED_AUTO_ANSWER: 'JOINED_AUTO_ANSWER',
                JOINED_AUTO_ACCEPT: 'JOINED_AUTO_ACCEPT'
            },

            cashElements: function() {
                var _this = this;
                _this.chat_element = _this.chat_wrapper.querySelector('section');
                _this.header_outer_container = _this.chat_element.querySelector('[data-role="header_outer_container"]');
                _this.body_outer_container = _this.chat_element.querySelector('[data-role="body_outer_container"]');
            },

            console: {
                log: function(event) {
                    var _this = this;
                    var txt = _this.console_log_template(event);
                    var div = document.createElement('div');
                    div.innerHTML = txt;
                    var nodeArray = [];
                    nodeArray.push.apply(nodeArray, div.childNodes);
                    Array.prototype.forEach.call(nodeArray, function(node) {
                        _this.body_outer_container.appendChild(node);
                    });
                }
            },

            render: function(options) {
                var _this = this;

                _this.chat_wrapper = options && options.chat_wrapper ? options.chat_wrapper : _this.chat_wrapper;
                _this.chat_wrapper.innerHTML = _this.chat_template();
                _this.cashElements();
                _this.header_outer_container.innerHTML = _this.waiter_template();

                _this.addEventListeners();
                _this.webrtc.render(options, this);
                _this.header.render(options, this);

                switch (_this.mode) {
                    case "MESSAGES":
                        _this.body_outer_container.innerHTML = _this.outer_container_template();
                        _this.editor.renderEditorPanel(function() {
                            _this.header.renderByMode({chat: _this});
                            _this.messages.initialize({start: 0, chat: _this});
                            _this.messages_container = _this.chat_element.querySelector('[data-role="messages_container"]');
                            _this.messageElem = _this.chat_element.querySelector('[data-role="message_container"]');
                        });
                        break;
                }
            },

            addEventListeners: function() {
                var _this = this;
                _this.removeEventListeners();

                _this.editor.on('calcMessagesContainerHeight', _this.calcMessagesContainerHeight.bind(_this), _this);

                _this.header.on('resizeMessagesContainer', _this.resizeMessagesContainer.bind(_this), _this);
                _this.header.on('renderSettings', _this.renderSettings.bind(_this), _this);
                _this.header.on('renderContactList', _this.renderContactList.bind(_this), _this);
                _this.header.on('changePerPage', _this.renderPerPageMessages.bind(_this), _this);
                _this.header.on('calcOuterContainerHeight', _this.calcOuterContainerHeight.bind(_this), _this);
                _this.header.on('renderMassagesEditor', _this.renderMassagesEditor.bind(_this), _this);
                _this.header.on('renderPagination', _this.renderPagination.bind(_this), _this);

                _this.settings.on('calcOuterContainerHeight', _this.calcOuterContainerHeight.bind(_this), _this);
                _this.settings.on('renderMassagesEditor', _this.renderMassagesEditor.bind(_this), _this);
                _this.settings.on('renderPagination', _this.renderPagination.bind(_this), _this);

                _this.contact_list.on('calcOuterContainerHeight', _this.calcOuterContainerHeight.bind(_this), _this);
                _this.contact_list.on('renderMassagesEditor', _this.renderMassagesEditor.bind(_this), _this);
                _this.contact_list.on('renderPagination', _this.renderPagination.bind(_this), _this);

                _this.pagination.on('fillListMessage', function(obj) {
                    _this.fillMessages(obj);
                }, _this);
                _this.pagination.on('calcMessagesContainerHeight', _this.calcMessagesContainerHeight.bind(_this), _this);

                _this.messages.on('resizeMessagesContainer', _this.resizeMessagesContainer.bind(_this), _this);
                _this.webrtc.on('log', _this.console.log, _this);
                _this.webrtc.on('sendToWebSocket', _this.sendToWebSocket, _this);
            },

            removeEventListeners: function() {
                var _this = this;
                _this.editor.off('calcMessagesContainerHeight');

                _this.header.off('changePerPage');
                _this.header.off('renderSettings');
                _this.header.off('calcOuterContainerHeight');
                _this.header.off('renderContactList');
                _this.header.off('resizeMessagesContainer');
                _this.header.off('renderMassagesEditor');
                _this.header.off('renderPagination');

                _this.settings.off('renderMassagesEditor');
                _this.settings.off('renderPagination');
                _this.settings.off('calcOuterContainerHeight');

                _this.contact_list.off('calcOuterContainerHeight');
                _this.contact_list.off('renderMassagesEditor');
                _this.contact_list.off('renderPagination');

                _this.pagination.off('fillListMessage');
                _this.webrtc.off('log');
                _this.webrtc.off('sendToWebSocket');
            },

            renderPagination: function() {
                var _this = this;
                _this.pagination.initialize({chat: _this});
            },

            fillMessages: function(obj) {
                var _this = this;
                _this.messages.fillListMessage(obj);
            },

            renderMassagesEditor: function(callback) {
                var _this = this;
                _this.body_outer_container = _this.chat_element.querySelector('[data-role="body_outer_container"]');
                _this.body_outer_container.innerHTML = _this.outer_container_template();
                _this.editor.renderEditorPanel(function() {
                    _this.messages_container = _this.chat_element.querySelector('[data-role="messages_container"]');
                    _this.messageElem = _this.chat_element.querySelector('[data-role="message_container"]');
                    _this.pagination.initialize({chat: _this}, callback);
                    //_this.resizeMessagesContainer();
                    //if (callback) {
                    //    callback();
                    //}
                });
            },

            renderPerPageMessages: function() {
                var _this = this;
                _this.pagination.renderPagination();
            },

            renderSettings: function() {
                var _this = this;
                _this.settings.renderSettings({chat: _this});
            },

            renderContactList: function() {
                var _this = this;
                _this.contact_list.renderContactList({chat: _this});
            },

            resizeMessagesContainer: function() {
                var _this = this;
                _this.calcMessagesContainerHeight();
                _this.messages_container.scrollTop = 9999;
            },

            calcMessagesContainerHeight: function() {
                var _this = this;
                _this.btnEditPanel = _this.chat_element.querySelector('[data-action="btnEditPanel"]');
                if (_this.btnEditPanel) {
                    var turnScrol = _this.btnEditPanel.querySelector('input[name="ControlScrollMessage"]');
                }
                _this.header_container = _this.chat_element.querySelector('[data-role="header_container"]');
                _this.controls_container = _this.chat_element.querySelector('[data-role="controls_container"]');
                _this.pagination_container = _this.chat_element.querySelector('[data-role="pagination_container"]');
                _this.choice_per_page_container = _this.chat_element.querySelector('[data-role="per_page_container"]');
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
            },

            sendToWebSocket: function(sendData) {
                sendData.chat_description = this.valueOf();
                websocket.sendMessage(sendData);
            },

            /**
             * server stored local offer for current chat
             * need to join this offer of wait for connections if current user is creator
             */
            serverStoredOffer: function(event) {
                var _this = this;
                if (event.chat_description.offer.userId === _this.userId) {
                    _this.console.log.call(_this, { message: 'waiting for connection' });
                    _this.mode = _this.MODE.MESSAGES_DISCONNECTED;
                    _this.render();
                } else {
                    _this.mode = _this.MODE.JOINED_AUTO_ANSWER;
                    _this.render({
                        remoteOfferDescription: event.chat_description.offer.localOfferDescription
                    });
                }
            },

            serverStoredAnswer: function(event) {
                var _this = this;
                if (event.chat_description.answer.userId === _this.userId) {
                    _this.mode = _this.MODE.JOINED_AUTO_ACCEPT;
                    _this.render({
                        remoteAnswerDescription: event.chat_description.answer.localAnswerDescription
                    });
                } else {
                    _this.console.log.call(_this, { message: 'waiting for connection' });
                    _this.mode = _this.MODE.MESSAGES_DISCONNECTED;
                    _this.render();
                }
            }
        };
        extend(chat, ajax_core);
        extend(chat, template_core);
        extend(chat, id_core);
        extend(chat, extend_core);

        chat.prototype.chat_template = chat.prototype.template(chat_template);
        chat.prototype.outer_container_template = chat.prototype.template(outer_container_template);
        chat.prototype.waiter_template = chat.prototype.template(waiter_template);
        chat.prototype.console_log_template = chat.prototype.template(console_log_template);

        return chat;
    });

