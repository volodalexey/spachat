import indexeddb from '../js/indexeddb'
import users_bus from '../js/users_bus'
import chats_bus from '../js/chats_bus'
import event_bus from '../js/event_bus'
import webrtc from '../js/webrtc'

var Sync_core = function() {
};

Sync_core.prototype = {

  requestChatData(messageData) {
    let self = this, from_user_id = messageData.from_user_id;
    indexeddb.getByKeyPath(chats_bus.collectionDescription, null, messageData.chat_description.chat_id,
      function(getError, chat_description) {
        if (getError) return console.error(getError);

        if (!chat_description) return;

        if (chat_description.user_ids.indexOf(from_user_id) !== -1 &&
          chat_description.deleted_user_ids.indexOf(from_user_id) === -1) {
          self.sendSyncChatDescription(chat_description, from_user_id);
        }
      }
    );
  },

  responseChatData(messageData) {
    let updateDescription = messageData.updateDescription;
    indexeddb.getByKeyPath(
      chats_bus.collectionDescription,
      null,
      messageData.chat_description.chat_id,
      function(getError, chat_description) {
        if (getError) return console.error(getError);

        if (!chat_description) return;

        if (!chat_description.lastChangedDatetime ||
          chat_description.lastChangedDatetime <= updateDescription.lastChangedDatetime) {

          chat_description.lastChangedDatetime = updateDescription.lastChangedDatetime ? 
            updateDescription.lastChangedDatetime : chat_description.lastChangedDatetime;
          chat_description.user_ids = updateDescription.user_ids ? 
            updateDescription.user_ids : chat_description.user_ids;
          chat_description.deleted_user_ids = updateDescription.deleted_user_ids ? 
            updateDescription.deleted_user_ids : chat_description.deleted_user_ids;
          chat_description.blocked_user_ids = updateDescription.blocked_user_ids ?
            updateDescription.blocked_user_ids : chat_description.blocked_user_ids;
          chat_description.addNewUserWhenInviting = updateDescription.addNewUserWhenInviting ?
            updateDescription.addNewUserWhenInviting : chat_description.addNewUserWhenInviting;
          chat_description.is_deleted = updateDescription.is_deleted ?
            updateDescription.is_deleted : chat_description.is_deleted;
          chat_description.left_chat_user_ids = updateDescription.left_chat_user_ids ?
            updateDescription.left_chat_user_ids : chat_description.left_chat_user_ids;

          chats_bus.putChatToIndexedDB(chat_description, function(_err, chat_description) {
            if (_err) return console.error(_err);

            event_bus.trigger("updateChatDescription", chat_description);
          });
        }
      }
    );
  },
  
  sendSyncChatDescription(chat_description, from_user_id){
    let _messageData = {
      type: 'syncResponseChatData',
      owner_request: from_user_id,
      from_user_id: users_bus.getUserId(),
      chat_description: {
        chat_id: chat_description.chat_id
      },
      updateDescription: {
        lastChangedDatetime: chat_description.lastChangedDatetime,
        user_ids: chat_description.user_ids,
        deleted_user_ids: chat_description.deleted_user_ids,
        blocked_user_ids: chat_description.blocked_user_ids,
        addNewUserWhenInviting: chat_description.addNewUserWhenInviting,
        is_deleted: chat_description.is_deleted,
        left_chat_user_ids: chat_description.left_chat_user_ids
      }
    };
    webrtc.broadcastChatMessage(chat_description.chat_id, JSON.stringify(_messageData));
  },

  needSyncChatDescription(messageData, chat_description){
    if (!chat_description.lastChangedDatetime ||
      chat_description.lastChangedDatetime < messageData.chat_description.lastChangedDatetime) {
      var _messageData = {
        type: 'syncRequestChatData',
        from_user_id: users_bus.getUserId(),
        chat_description: {
          chat_id: chat_description.chat_id
        }
      };
      let active_owner_connection = webrtc.getConnectionByUserId(chat_description.createdByUserId);
      if(active_owner_connection){
        webrtc.broadcastMessage([active_owner_connection], JSON.stringify(_messageData));
      } else {
        webrtc.broadcastChatMessage(chat_description.chat_id, JSON.stringify(_messageData));
      }
    }
  },

  requestUserData(messageData){
    let self = this;
    users_bus.getMyInfo(messageData, function(_err, _messageData, userInfo) {
      if (userInfo.user_ids.indexOf(_messageData.owner_request) !== -1) {
        users_bus.getContactsInfo(_messageData, [_messageData.owner_request],
          function(err, contactsInfo, _messageData) {
            if (err) return console.error(err);

            var messageData = {
              type: 'syncResponseUserData',
              from_user_id: userInfo.user_id,
              owner_request: _messageData.userId,
              is_deleted_owner_request: contactsInfo[0],
              is_deleted: contactsInfo[0].is_deleted,
              updateInfo: {
                avatar_data: userInfo.avatar_data,
                lastModifyDatetime: userInfo.lastModifyDatetime
              }
            };
            let stringifyMessageData = JSON.stringify(messageData);
            if (stringifyMessageData.length > 66500) {
              throw new Error('Data length is too big! Browser does not work');
            }
            webrtc.broadcastChatMessage(_messageData.chat_description.chat_id, stringifyMessageData);
          })
      }
    })
  },

  responseUserData(messageData, userInfo){
    let _messageData = messageData;
    userInfo.lastModifyDatetime = messageData.updateInfo.lastModifyDatetime;
    userInfo.avatar_data = messageData.updateInfo.avatar_data;
    if (messageData.is_deleted_owner_request && messageData.is_deleted) {
      userInfo.is_deleted = messageData.is_deleted;
    }
    users_bus.addNewUserToIndexedDB(userInfo, function(_err, user_description) {
      if (_err) return console.error(_err);
      event_bus.trigger('changeMyUsers', _messageData.from_user_id);
    });
  },

  needSyncUserData(messageData, userInfo){
    if (userInfo.userName === '-//-//-//-') return;
    if (!userInfo.lastModifyDatetime || userInfo.lastModifyDatetime < messageData.lastModifyDatetime) {
      let _messageData = {
        type: 'syncRequestUserData',
        userId: userInfo.user_id,
        from_user_id: users_bus.getUserId(),
        chat_description: {
          chat_id: messageData.chat_description.chat_id
        }
      };
      webrtc.broadcastChatMessage(messageData.chat_description.chat_id, JSON.stringify(_messageData));
    }
  }
};

export default new Sync_core();

