define('chat', [
        'header',
        'editor',
        'pagination',
        'settings',
        'contact_list',
        'messages',
        'webrtc',
        'websocket',
        'body',

        'ajax_core',
        'template_core',
        'id_core',
        'extend_core',
        'message_core',
        'event_core',

        'text!../html/chat_template.html',
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
             Body,

             ajax_core,
             template_core,
             id_core,
             extend_core,
             message_core,
             event_core,

             chat_template,
             waiter_template,
             console_log_template
    ) {

        var defaultOptions = {
            padding: {
                bottom: 5
            },
            headerOptions: {
                show: true
            },
            filterOptions: {
                show: false
            },
            bodyOptions: {
                show: true
            },
            //footerOptions: {
            editorOptions: {
                show: false
            },
            formatOptions: {
                show: false,
                offScroll: false
            },
            goToOptions: {
                show: false
            },
            paginationOptions: {
                show: false,
                curPage: null,
                firstPage: 1,
                lastPage: null,
                showEnablePagination: false,
                showChoicePerPage: false,
                perPageValue: 2,
                rtePerPage: true,
                rteChoicePage: true
            }
        };

        var chat = function(options) {
            this.extend(this, defaultOptions);

            this.header = new Header({chat: this});
            this.headerOptions.mode = this.header.MODE.TAB;
            this.editor = new Editor({chat: this});
            this.editorOptions.mode = this.editor.MODE.MAIN_PANEL;
            this.pagination = new Pagination({chat: this});
            this.settings = new Settings({chat: this});
            this.contact_list = new Contact_list({chat: this});
            this.messages = new Messages({chat: this});
            this.webrtc = new Webrtc({chat: this});
            this.body = new Body({chat: this});
            this.bodyOptions.mode = this.body.MODE.MESSAGES;

            this.extend(this, options);
            this.bindContexts();
        };

        chat.prototype = {

            valueOfKeys: ['chatId', 'userId'],

            bindContexts: function() {
                var _this = this;
                //_this.bindedThrowRouter = _this.throwRouter.bind(_this);
            },

            valueOf: function() {
                var toStringObject = {};
                var _this = this;
                _this.valueOfKeys.forEach(function(key) {
                    toStringObject[key] = _this[key];
                });
                return toStringObject;
            },

            chatsArray: [],

            MODE: {
                SETTING: 'SETTING',
                //MESSAGES: 'MESSAGES',
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
                _this.header_container = _this.chat_element.querySelector('[data-role="header_container"]');
                _this.header_waiter_container = _this.chat_element.querySelector('[data-role="waiter_container"]');
                _this.body_container = _this.chat_element.querySelector('[data-role="body_container"]');
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
                        _this.body_container.appendChild(node);
                    });
                }
            },

            initialization: function(options) {
                var _this = this;
                _this.chat_wrapper = options && options.chat_wrapper ? options.chat_wrapper : _this.chat_wrapper;
                _this.chat_wrapper.innerHTML = _this.chat_template();
                _this.cashElements();
                _this.header_waiter_container.innerHTML = _this.waiter_template();
                _this.addEventListeners();
                _this.render(options);

            },

            render: function(options) {
                var _this = this;

                _this.editor.render(options, this);
                _this.header.render(null, this);
                _this.body.render({start: 0, scrollTop: true}, this);
                _this.pagination.render(null, this);
                _this.webrtc.render(options, this);


                //_this.messages.render({start: 0, scrollTop: true}, this);
                //_this.pagination.initialize(options, this);
            },

            changeMode: function(event){
                var _this = this;
                _this.switchModes([
                    {
                        chat_part: event.target.dataset.chat_part,
                        newMode: event.target.dataset.mode_to
                    }
                ]);
            },

            switchModes: function(obj) {
                var _this = this;
                obj.forEach(function (_obj){
                    switch (_obj.chat_part){
                        case "header":
                            switch  (_obj.newMode) {
                                case _this.header.MODE.FILTER:
                                    _this.filterOptions.show = true;
                                    _this.bodyOptions.mode = _this.body.MODE.MESSAGES;
                                    _this.editorOptions.show = true;
                                    if (_this.editor.previousFormatShow){
                                        _this.editor.previousFormatShow = false;
                                    }
                                    break;
                            }
                            break;
                        case "body":
                            switch (_obj.newMode) {
                                case _this.body.MODE.SETTING:
                                    _this.bodyOptions.mode = _this.body.MODE.SETTING;
                                    _this.filterOptions.show = false;
                                    _this.editorOptions.show = false;
                                    _this.goToOptions.show = false;
                                    break;
                                case _this.body.MODE.CONTACT_LIST:
                                    _this.bodyOptions.mode = _this.body.MODE.CONTACT_LIST;
                                    _this.filterOptions.show = false;
                                    _this.editorOptions.show = false;
                                    _this.goToOptions.show = false;
                                    break;
                                case _this.body.MODE.MESSAGES:
                                    _this.bodyOptions.mode = _this.body.MODE.MESSAGES;
                                    _this.editorOptions.show = true;
                                    _this.formatOptions.show = false;
                                    _this.goToOptions.show = false;
                                    break;
                            }
                            break;
                        case "editor":
                            switch  (_obj.newMode) {
                                case _this.editor.MODE.MAIN_PANEL:
                                    _this.editorOptions.show = true;
                                    break;
                                case _this.editor.MODE.FORMAT_PANEL:
                                    _this.editorOptions.show = true;
                                    _this.formatOptions.show = true;
                                    if (_this.header.previousShow){
                                        _this.header.previousShow = false;
                                    }
                                    break;
                            }
                            break;
                        case "pagination":
                            switch (_obj.newMode) {
                                case _this.pagination.MODE.PAGINATION:
                                    _this.paginationOptions.show = true;
                                    if (_this.header.previousShow){
                                        _this.header.previousShow = false;
                                    }
                                    if (_this.editor.previousFormatShow){
                                        _this.editor.previousFormatShow = false;
                                    }
                                    break;
                            }
                    }
                });
                _this.render(null);
            },

            addEventListeners: function() {
                var _this = this;
                _this.removeEventListeners();
                _this.header.on('throw', _this.throwRouter, _this);
                _this.editor.on('throw', _this.throwRouter, _this);



                //_this.editor.on('calcMessagesContainerHeight', _this.calcMessagesContainerHeight.bind(_this), _this);
                //_this.header.on('resizeMessagesContainer', _this.resizeMessagesContainer.bind(_this), _this);
                //_this.header.on('renderSettings', _this.changeMode.bind(_this), _this);
                //_this.header.on('renderContactList', _this.changeMode.bind(_this), _this);
/*                _this.header.on('changePerPage', _this.renderPerPageMessages.bind(_this), _this);
                _this.header.on('renderMassagesEditor', _this.renderMassagesEditor.bind(_this), _this);
                _this.header.on('renderPagination', _this.renderPagination.bind(_this), _this);*/

                //_this.settings.on('calcOuterContainerHeight', _this.calcOuterContainerHeight.bind(_this), _this);
                //_this.settings.on('renderMassagesEditor', _this.renderMassagesEditor.bind(_this), _this);
                //_this.settings.on('renderPagination', _this.renderPagination.bind(_this), _this);

                //_this.contact_list.on('calcOuterContainerHeight', _this.calcOuterContainerHeight.bind(_this), _this);
                //_this.contact_list.on('renderMassagesEditor', _this.renderMassagesEditor.bind(_this), _this);
                //_this.contact_list.on('renderPagination', _this.renderPagination.bind(_this), _this);

                _this.pagination.on('fillListMessage', function(obj) {
                    _this.fillMessages(obj);
                }, _this);
                _this.pagination.on('calcMessagesContainerHeight', _this.calcMessagesContainerHeight.bind(_this), _this);

                _this.messages.on('resizeMessagesContainer', _this.resizeMessagesContainer.bind(_this), _this);
                _this.webrtc.on('log', _this.console.log, _this);
                _this.webrtc.on('sendToWebSocket', _this.sendToWebSocket, _this);
                _this.on('notifyChat', _this.onMessageRouter, _this);
            },

            removeEventListeners: function() {
                var _this = this;
                _this.editor.off('calcMessagesContainerHeight');

                _this.header.off('changePerPage');
                _this.header.off('throw');
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
                _this.off('notifyChat');
            },

            throwRouter: function(action, event) {
                if (this[action]) {
                    this[action](event);
                }
            },

            renderPagination: function() {
                var _this = this;
                _this.pagination.initialize({chat: _this});
            },

            fillMessages: function(obj) {
                var _this = this;
                _this.messages.fillListMessage(obj);
            },

            renderPerPageMessages: function() {
                var _this = this;
                _this.pagination.renderPagination();
            },

            resizeMessagesContainer: function() {
                var _this = this;
                _this.calcMessagesContainerHeight();
                //_this.messages_container.scrollTop = 9999;
            },

            calcMessagesContainerHeight: function() {
                var _this = this;
               /* _this.btnEditPanel = _this.chat_element.querySelector('[data-action="btnEditPanel"]');
                if (_this.btnEditPanel) {
                    var turnScrol = _this.btnEditPanel.querySelector('input[name="ControlScrollMessage"]');
                }
                _this.header_container = _this.chat_element.querySelector('[data-role="header_container"]');
                _this.controls_container = _this.chat_element.querySelector('[data-role="controls_container"]');
                _this.pagination_container = _this.chat_element.querySelector('[data-role="pagination_container"]');
                _this.choice_per_page_container = _this.chat_element.querySelector('[data-role="go_to_container"]');
                _this.message = _this.messageElem.firstElementChild;
                if (!turnScrol || turnScrol && !turnScrol.checked) {
                    var param = _this.body_container.getAttribute('param-content');
                    var height = window.innerHeight - _this.header_container.clientHeight - _this.choice_per_page_container.clientHeight - _this.pagination_container.clientHeight - _this.controls_container.clientHeight - _this.messageElem.clientHeight - _this.data.padding.bottom;
                    var paddingMessages = parseInt(window.getComputedStyle(_this.messages_container, null).getPropertyValue('padding-top')) + parseInt(window.getComputedStyle(_this.messages_container, null).getPropertyValue('padding-bottom'));
                    var marginMessages = parseInt(window.getComputedStyle(_this.messages_container, null).getPropertyValue('padding-top'));
                    var borderEditor = parseInt(window.getComputedStyle(_this.message, null).getPropertyValue('border-top-width')) + parseInt(window.getComputedStyle(_this.message, null).getPropertyValue('border-bottom-width'));
                    _this.messages_container.style.maxHeight = height - paddingMessages - borderEditor - marginMessages + "px";
                }*/
            },

            calcOuterContainerHeight: function() {
                var _this = this;
                var height = window.innerHeight - _this.header_container.clientHeight;
                var marginHeader = parseInt(window.getComputedStyle(_this.header_container, null).getPropertyValue('margin-top'));
                _this.body_container.style.height = height - marginHeader + "px";
            },

            sendToWebSocket: function(sendData) {
                var _this = this;
                sendData.chat_description = this.valueOf();
                websocket.sendMessage(sendData);
                _this.proceedNextMessage();
            },

            /**
             * server stored local offer for current chat
             * need to join this offer of wait for connections if current user is creator
             */
            serverStoredOffer: function(event) {
                var _this = this;

                if (event.chat_description.offer.userId === _this.userId) {
                    // I am the creator of server stored offer
                    // Waiting for answer
                    _this.console.log.call(_this, { message: 'waiting for connection' });
                    _this.mode = _this.MODE.MESSAGES_DISCONNECTED;
                    _this.switchModes([
                        {
                            'chat_part':'header',
                            'newMode':_this.header.MODE.TAB
                        } ,
                        {
                            'chat_part':'body',
                            'newMode': _this.body.MODE.MESSAGES
                        },
                        {
                            'chat_part':'editor',
                            'newMode': _this.editor.MODE.MAIN_PANEL
                        }
                    ]);
                    //_this.render();
                } else {
                    // I am NOT the creator of server stored offer
                    // Somebody created offer while I was trying to create my offer
                    // Create answer
                    _this.mode = _this.MODE.JOINED_AUTO_ANSWER;
                    _this.render({
                        remoteOfferDescription: event.chat_description.offer.offerDescription
                    });
                }
            },

            serverStoredAnswer: function(event) {
                var _this = this;
                if (event.chat_description.answer.userId === _this.userId) {
                    // I am the creator of server stored answer
                    // Waiting for accept
                    _this.console.log.call(_this, { message: 'waiting for accept connection' });
                    _this.mode = _this.MODE.MESSAGES_DISCONNECTED;
                    _this.switchModes([
                        {
                            'chat_part':'header',
                            'newMode':_this.header.MODE.TAB
                        } ,
                        {
                            'chat_part':'body',
                            'newMode': _this.body.MODE.MESSAGES
                        },
                        {
                            'chat_part':'editor',
                            'newMode': _this.editor.MODE.MAIN_PANEL
                        }
                    ]);
                    //_this.render();
                } else {
                    // I am NOT the creator of server stored answer
                    // Accept answer if I am the offer creator
                    if (event.chat_description.offer.userId === _this.userId) {
                        _this.mode = _this.MODE.JOINED_AUTO_ACCEPT;
                        _this.render({
                            remoteAnswerDescription: event.chat_description.answer.answerDescription
                        });
                    } else {
                        console.error(new Error('Offer and Answer do not make sense!'));
                    }
                }
            },

            onMessageRouter: function(eventData) {
                var _this = this;
                _this.initializeMessagesStack();
                if (_this.messagesStack.length) {
                    _this.messagesStack.push(eventData);
                } else {
                    if (_this[eventData.notify_data]) {
                        _this[eventData.notify_data](eventData);
                    } else {
                        console.error(new Error('No message handler'));
                    }
                }
            }
        };
        extend(chat, ajax_core);
        extend(chat, template_core);
        extend(chat, id_core);
        extend(chat, extend_core);
        extend(chat, message_core);
        extend(chat, event_core);

        chat.prototype.chat_template = chat.prototype.template(chat_template);
        chat.prototype.waiter_template = chat.prototype.template(waiter_template);
        chat.prototype.console_log_template = chat.prototype.template(console_log_template);

        return chat;
    });

