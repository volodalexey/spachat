define('connection',[
        'websocket',
        'event_bus'
    ],
function(
    websocket,
    event_bus
) {
    /**
     * WebRTC peer to peer connection
     * connection can store multiple chats/users
     * communication with device is handling in terms of chat/user
     */
    var Connection = function(options) {
        this.chats = [];
        this.users = [];
        this.ws_device_id = options.ws_device_id;
        this.active = {
            readyState: options.active && options.active.readyState ? options.active.readyState : this.readyStates.WAITING,
            remoteAnswerDescription: options.active && options.active.remoteAnswerDescription ? options.active.remoteAnswerDescription : null
        };
        this.passive = {
            readyState: options.passive && options.passive.readyState ? options.passive.readyState : this.readyStates.WAITING,
            remoteOfferDescription: options.passive && options.passive.remoteOfferDescription ? options.passive.remoteOfferDescription : null
        }
    };

    Connection.prototype = {

        readyStates: {
            WAITING: 'WAITING',
            CREATING_OFFER: 'CREATING_OFFER',
            WILL_CREATE_OFFER: 'WILL_CREATE_OFFER',
            CREATING_ANSWER: 'CREATING_ANSWER',
            WILL_CREATE_ANSWER: 'WILL_CREATE_ANSWER',
            ACCEPTING_ANSWER: 'ACCEPTING_ANSWER',
            WILL_ACCEPT_ANSWER: 'WILL_ACCEPT_ANSWER'
        },

        set_ws_device_id: function(ws_device_id) {
            this.ws_device_id = ws_device_id;
        },

        get_ws_device_id: function() {
            return this.ws_device_id;
        },

        canApplyNextState: function() {
            if (this.dataChannel && this.dataChannel.readyState === "open") {
                // connection with this device is already established
                return false;
            } else if (this.active && this.active.readyState === Connection.prototype.readyStates.ACCEPTING_ANSWER) {
                // connection with this device is establishing through p2p
                return false;
            }
            return true;
        },

        getUser: function(messageDescription) {
            var user;
            this.users.every(function(_user) {
                if (_user.userId === messageDescription.userId) {
                    user = _user;
                }
                return !user;
            });
            return user;
        },

        storeUser: function(userDescription) {
            var user = this.getUser(userDescription);
            if (!user) {
                this.users.push(userDescription);
            }
            return user;
        },

        getChat: function(chatDescription) {
            var chat;
            this.chats.every(function(_chat) {
                if (_chat.chat_id === chatDescription.chat_id) {
                    chat = _chat;
                }
                return !chat;
            });
            return chat;
        },

        storeChat: function(chatDescription) {
            var chat = this.getChat(chatDescription);
            if (!chat) {
                this.chats.push(chatDescription);
            }
            return chat;
        },

        removeChatById: function(chat_id) {
            var chat = this.getChat({ chat_id: chat_id });
            if (chat) {
                var index = this.chats.indexOf(chat);
                if (index > -1) {
                    this.chats.splice(index, 1);
                }
            }
            if (!this.handleAnyContexts()) {
                this.destroy();
            }
        },

        storeInstance: function(instance) {
            if (instance.chat_id) {
                this.storeChat(instance);
            } else if (instance.userId) {
                // TODO use user model ?
                this.storeUser(instance);
            }
        },

        log: function(type, messageObject) {
            console.log(type, messageObject.message);
        },

        sendToWebSocket: function(messageData) {
            var _this = this;
            if (messageData.type === 'chat_offer' ||
                messageData.type === 'chat_accept' ||
                messageData.type === 'chat_answer') {
                messageData.chat_description = _this.chats[0].valueOfChat();
            }
            websocket.sendMessage(messageData);
        },

        handleAnyContexts: function() {
            return this.chats.length || this.users.length;
        },

        destroy: function() {
            this.chats = [];
            this.users = [];
            event_bus.trigger('connectionDestroyed', this);
        }
    };

    return Connection;
}
);