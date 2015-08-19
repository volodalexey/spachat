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
        this.chats_ids = [];
        this.users_ids = [];
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

        setWSDeviceId: function(ws_device_id) {
            this.ws_device_id = ws_device_id;
        },

        getWSDeviceId: function() {
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

        removeChatId: function(chat_id) {
            if (this.hasChatId(chat_id)) {
                var index = this.chats_ids.indexOf(chat_id);
                if (index > -1) {
                    this.chats_ids.splice(index, 1);
                }
            }
            if (!this.handleAnyContexts()) {
                this.destroy();
            }
        },

        hasUserId: function(user_id) {
            var foundUserId = false;
            this.users_ids.every(function(_user_id) {
                if (_user_id === user_id) {
                    foundUserId = _user_id;
                }
                return !foundUserId;
            });
            return foundUserId;
        },

        hasChatId: function(chat_id) {
            var foundChatId = false;
            this.chats_ids.every(function(_chat_id) {
                if (_chat_id === chat_id) {
                    foundChatId = _chat_id;
                }
                return !foundChatId;
            });
            return foundChatId;
        },

        putUserId: function(user_id) {
            if (this.hasUserId(user_id) === false) {
                this.users_ids.push(user_id);
            }
        },

        putChatId: function(chat_id) {
            if (this.hasChatId(chat_id) === false) {
                this.chats_ids.push(chat_id);
            }
        },

        storeContext: function(ws_descr) {
            if (ws_descr.chat_id) {
                this.putChatId(ws_descr.chat_id);
            } else if (ws_descr.user_id || ws_descr.from_user_id) {
                this.putUserId(ws_descr.user_id || ws_descr.from_user_id);
            }
        },

        getContextDescription: function() {
            return {
                chats_ids: chats_ids,
                users_ids: users_ids
            }
        },

        log: function(type, messageObject) {
            console.log(type, messageObject.message);
        },

        sendToWebSocket: function(messageData) {
            //messageData.context_description = this.getContextDescription();
            websocket.sendMessage(messageData);
        },

        handleAnyContexts: function() {
            return this.chats_ids.length || this.users_ids.length;
        },

        destroy: function() {
            this.chats_ids = [];
            this.users_ids = [];
            event_bus.trigger('connectionDestroyed', this);
        }
    };

    return Connection;
}
);