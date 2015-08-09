define('connection',[
        'websocket'
    ],
function(
    websocket
) {
    /**
     * WebRTC peer to peer connection
     * connection can store multiple chats/users
     * communication with device is handling in terms of chat/user
     */
    var Connection = function(options) {
        this.chats = [];
        this.users = [];
        this.deviceId = options.deviceId;
        this.tempDeviceId = options.tempDeviceId;
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

        isEqualAnyDeviceId: function(options) {
            return (options.deviceId && this.deviceId === options.deviceId) ||
                (options.tempDeviceId && this.tempDeviceId === options.tempDeviceId);
        },

        getAnyDeviceId: function() {
            return this.deviceId || this.tempDeviceId;
        },

        getDeviceId: function() {
            return this.deviceId;
        },

        setDeviceId: function(deviceId) {
            this.deviceId = deviceId;
            if (this.tempDeviceId) {
                this.tempDeviceId = undefined;
            }
        },

        getDeviceDescription: function() {
            return {
                deviceId: this.deviceId,
                tempDeviceId: this.tempDeviceId
            }
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
                if (_chat.chatId === chatDescription.chatId) {
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

        removeChatById: function(chatId) {
            var chat = this.getChat({ chatId: chatId });
            if (chat) {
                var index = this.chats.indexOf(chat);
                if (index > -1) {
                    this.chats.splice(index, 1);
                }
            }
        },

        storeInstance: function(instance) {
            if (instance.chatId) {
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
        }
    };

    return Connection;
}
);