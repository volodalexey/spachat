import React from 'react'

import indexeddb from '../js/indexeddb.js'
import overlay_core from '../js/overlay_core.js'
import extend_core from '../js/extend_core.js'
import dom_core from '../js/dom_core.js'
import event_bus from '../js/event_bus.js'
import chats_bus from '../js/chats_bus.js'
import users_bus from '../js/users_bus.js'
import switcher_core from '../js/switcher_core.js'
import websocket from '../js/websocket.js'
import webrtc from '../js/webrtc.js'
import utils from '../js/utils'

import Triple_Element from '../components/triple_element'
import ExtraToolbar from '../components/extra_toolbar'
import Filter from '../components/filter'
import PanelToolbar from '../components/panel_toolbar'
import Body from '../components/body'
import Pagination from '../components/pagination'
import GoTo from '../components/go_to'
import DialogConfirm from './dialogConfirm'
import DialogError from './dialogError'
import DialogSuccess from './dialogSuccess'

var z_index = 80;

const MODE = {
  CREATE_CHAT: 'CREATE_CHAT',
  JOIN_CHAT: 'JOIN_CHAT',
  CHATS: 'CHATS',
  USERS: 'USERS',
  JOIN_USER: 'JOIN_USER',

  USER_INFO_EDIT: 'USER_INFO_EDIT',
  USER_INFO_SHOW: 'USER_INFO_SHOW',
  DETAIL_VIEW: 'DETAIL_VIEW',

  CONNECTIONS: 'CONNECTIONS',
  SETTINGS_GLOBAL: 'SETTINGS_GLOBAL',

  CREATE_BLOG: 'CREATE_BLOG',
  JOIN_BLOG: 'JOIN_BLOG',
  BLOGS: 'BLOGS',

  PAGINATION: "PAGINATION",
  GO_TO: "GO_TO",
  FILTER: 'FILTER'
};

const Panel = React.createClass({

  getDefaultProps() {
    return {
      mainContainer: {
        "element": "div",
        "config": {
          "class": "flex-inner-container",
        }
      },
      leftBtnConfig: {
        "element": "button",
        "icon": "notepad_icon",
        "data": {
          "action": "togglePanel",
          "role": "mainButtonLeftPanel",
          "description": 46
        },
        onload: true,
        "class": "panel-button left-panel-button "
      },
      rightBtnConfig: {
        "element": "button",
        "icon": "folder_icon",
        "data": {
          "action": "togglePanel",
          "role": "mainButtonRightPanel",
          "description": 47
        },
        onload: true,
        "class": "panel-button right-panel-button "
      },
      z_index: 80
    }
  },

  getInitialState() {
    if (this.props.location === 'left') {
      return {
        openChatsInfoArray: [],
        closingChatsInfoArray: [],
        chat_ids: [],
        openChats: {},
        openedState: false,
        left: '-700px',
        toggleElemHide: false,
        toggleToolbarElemHide: true,
        bodyMode: "CREATE_CHAT",
        avatarMode: "SHOW",
        avatarData: '',
        avatarPrevious: '',

        errorMessage: null,
        confirmMessageShowRemoteFriendshipRequest: null,
        confirmDialog_messageData: null,
        confirmMessageRemoveContact: null,
        confirmDialog_userId: null,

        chats_GoToOptions: {
          text: "chats_GoToOptions",
          show: false,
          rteChoicePage: true,
          mode_change: "rte",
          page: null,
          pageShow: 1
        },
        chats_PaginationOptions: {
          text: "chats_PaginationOptions",
          show: false,
          mode_change: "rte",
          currentPage: null,
          firstPage: 1,
          lastPage: null,
          showEnablePagination: false,
          showChoicePerPage: false,
          perPageValue: 1,
          perPageValueShow: 1,
          perPageValueNull: false,
          rtePerPage: true,
          disableBack: false,
          disableFirst: false,
          disableLast: false,
          disableForward: false
        },
        chats_ExtraToolbarOptions: {
          show: true
        },
        chats_FilterOptions: {
          text: "chats_FilterOptions",
          show: false
        },
        chats_ListOptions: {
          text: "chats_ListOptions",
          start: 0,
          last: null,
          previousStart: 0,
          previousFinal: 0,
          restore: false,
          data_download: false,
          final: null
        },

        users_ExtraToolbarOptions: {
          show: true
        },
        users_FilterOptions: {
          text: "users_FilterOptions",
          typeDisplayContacts: 'all',
          show: false
        },
        users_GoToOptions: {
          text: "users_GoToOptions",
          show: false,
          rteChoicePage: true,
          mode_change: "rte",
          page: null,
          pageShow: 1
        },
        users_PaginationOptions: {
          text: "users_PaginationOptions",
          show: false,
          mode_change: "rte",
          currentPage: null,
          firstPage: 1,
          lastPage: null,
          showEnablePagination: false,
          showChoicePerPage: false,
          perPageValue: 15,
          perPageValueShow: 15,
          perPageValueNull: false,
          rtePerPage: true,
          disableBack: false,
          disableFirst: false,
          disableLast: false,
          disableForward: false
        },
        users_ListOptions: {
          text: "users_ListOptions",
          start: 0,
          last: null,
          previousStart: 0,
          previousFinal: 0,
          restore: false,
          data_download: false
        },

        joinUser_ExtraToolbarOptions: {
          show: false
        },
        joinUser_FilterOptions: {
          show: false
        },
        joinUser_PaginationOptions: {
          show: false
        },
        joinUser_GoToOptions: {
          text: "joinUser_GoToOptions",
          show: false,
          rteChoicePage: true,
          mode_change: "rte",
          page: null,
          pageShow: 1
        },
        joinUser_ListOptions: {
          text: "joinUser_ListOptions",
          readyForRequest: false,
          userId: null,
          messageRequest: null
        },

        createChat_ExtraToolbarOptions: {
          show: false
        },
        createChat_FilterOptions: {
          show: false
        },
        createChat_PaginationOptions: {
          show: false
        },
        createChat_GoToOptions: {
          text: "createChat_GoToOptions",
          show: false,
          rteChoicePage: true,
          mode_change: "rte",
          page: null,
          pageShow: 1
        },

        joinChat_ExtraToolbarOptions: {
          show: false
        },
        joinChat_FilterOptions: {
          show: false
        },
        joinChat_PaginationOptions: {
          show: false
        },
        joinChat_GoToOptions: {
          text: "joinChat_GoToOptions",
          show: false,
          rteChoicePage: true,
          mode_change: "rte",
          page: null,
          pageShow: 1
        },
        joinChat_ListOptions: {
          text: "joinChat_ListOptions",
          chatId: null,
          messageRequest: null
        },
        createBlog_ExtraToolbarOptions: {
          show: false
        },
        createBlog_FilterOptions: {
          show: false
        },
        createBlog_PaginationOptions: {
          show: false
        },
        createBlog_GoToOptions: {
          text: "createBlog_GoToOptions",
          show: false,
          rteChoicePage: true,
          mode_change: "rte",
          page: null,
          pageShow: 1
        },

        joinBlog_ExtraToolbarOptions: {
          show: false
        },
        joinBlog_FilterOptions: {
          show: false
        },
        joinBlog_PaginationOptions: {
          show: false
        },
        joinBlog_GoToOptions: {
          text: "joinBlog_GoToOptions",
          show: false,
          rteChoicePage: true,
          mode_change: "rte",
          page: null,
          pageShow: 1
        },

        blogs_ExtraToolbarOptions: {
          show: false
        },
        blogs_FilterOptions: {
          show: false
        },
        blogs_PaginationOptions: {
          show: false
        },
        blogs_GoToOptions: {
          text: "blogs_GoToOptions",
          show: false,
          rteChoicePage: true,
          mode_change: "rte",
          page: null,
          pageShow: 1
        },
        blogs_ListOptions: {
          text: "blogs_ListOptions",
          start: 0,
          last: null,
          previousStart: 0,
          previousFinal: 0,
          restore: false,
          data_download: false
        }
      }
    }
    if (this.props.location === 'right') {
      return {
        openChatsInfoArray: [],
        closingChatsInfoArray: [],
        chat_ids: [],
        openChats: {},
        openedState: false,
        right: '-700px',
        toggleElemHide: false,
        toggleToolbarElemHide: true,
        bodyMode: "USER_INFO_SHOW",
        avatarMode: "SHOW",
        scrollEachChat: true,
        notificationOfAccession: false,

        errorMessage: null,
        errorMessageWrongOldPassword: null,
        errorMessagePasswordsNotMatch: null,
        successMessageSaveChangeUserInfo: null,
        confirmMessageLogout: null,
        confirmDialog_messageData: null,

        connections_ExtraToolbarOptions: {
          show: false
        },
        connections_GoToOptions: {
          show: false
        },
        connections_PaginationOptions: {
          show: false
        },
        connections_GoToOptions: {
          show: false,
          rteChoicePage: true,
          mode_change: "rte"
        },
        connections_ListOptions: {
          text: "connections_ListOptions",
          start: 0,
          last: null,
          previousStart: 0,
          previousFinal: 0,
          restore: false,
          data_download: false
        },

        userInfoEdit_ExtraToolbarOptions: {
          show: false
        },
        userInfoEdit_FilterOptions: {
          show: false
        },
        userInfoEdit_PaginationOptions: {
          show: false
        },
        userInfoEdit_GoToOptions: {
          show: false,
          rteChoicePage: true,
          mode_change: "rte"
        },

        userInfoShow_ExtraToolbarOptions: {
          show: false
        },
        userInfoShow_FilterOptions: {
          show: false
        },
        userInfoShow_PaginationOptions: {
          show: false
        },
        userInfoShow_GoToOptions: {
          show: false,
          rteChoicePage: true,
          mode_change: "rte"
        }
      }
    }
  },

  componentWillMount() {
    if (this.props.userInfo[this.props.location]) {
      this.setState(this.props.userInfo[this.props.location]);
      if (this.props.location === "left") {
        this.setState({'left': '-700px', 'openedState': false});
        return;
      }
      if (this.props.location === "right") {
        this.setState({'right': '-700px', 'openedState': false});
      }
    } else {
      this.setState({userInfo: this.props.userInfo});
    }
  },

  componentDidMount() {
    document.addEventListener('load', this.handleLoad, true);
    window.addEventListener('resize', this.resizePanel, false);
    event_bus.on('getPanelDescription', this.getPanelDescription);
    if (this.props.location === "left") {
      event_bus.on('AddedNewChat', this.toggleListOptions);
      event_bus.on('changeOpenChats', this.getInfoForBody);
      event_bus.on('changeMyUsers', this.changeMyUsers);
      event_bus.on('web_socket_message', this.onPanelMessageRouter);
      event_bus.on('makeFriends', this.onForceMakeFriends, this);
      this.outerContainer = document.querySelector('[data-role="left_panel_outer_container"]');
      this.inner_container = document.querySelector('[data-role="left_panel_inner_container"]');
      this.outerContainer.style.right = '100vw';
    }
    if (this.props.location === "right") {
      event_bus.on('changeConnection', this.changeConnection, this);
      event_bus.on('changeUsersConnections', this.changeConnection, this);
      event_bus.on('updateUserAvatar', this.updateUserAvatar, this);
      this.outerContainer = document.querySelector('[data-role="right_panel_outer_container"]');
      this.inner_container = document.querySelector('[data-role="right_panel_inner_container"]');
      this.outerContainer.style.left = '100vw';
    }
    this.togglePanelElement = this.outerContainer.querySelector('[data-action="togglePanel"]');
    this.togglePanelElementToolbar = this.outerContainer.querySelector('[data-role="togglePanelToolbar"]');
    this.panelBody = this.outerContainer.querySelector('[data-role="panel_body"]');

    this.outerContainer.classList.remove("hide");
    this.outerContainer.style.maxWidth = window.innerWidth + 'px';
    this.outerContainer.style.zIndex = this.props.z_index;

    this.outerContainer.addEventListener('transitionend', this.handleTransitionEnd);
    if (this.props.location === "left" && this.props.locationQuery && this.props.locationQuery.join_chat_id) {
      let options = {
        chatId: this.props.locationQuery.join_chat_id,
        bodyMode: MODE.JOIN_CHAT,
        messageRequest: 113,
        force: true
      };
      this.togglePanel(null, options);
    }
  },

  componentWillUnmount() {
    document.removeEventListener('load', this.handleLoad);
    window.removeEventListener('resize', this.resizePanel);
    event_bus.off('getPanelDescription', this.getPanelDescription);
    if (this.props.location === "left") {
      event_bus.off('AddedNewChat', this.toggleListOptions);
      event_bus.off('changeOpenChats', this.getInfoForBody);
      event_bus.off('changeMyUsers', this.changeMyUsers);
      event_bus.off('web_socket_message', this.onPanelMessageRouter);
    } else if (this.props.location === "right") {
      event_bus.off('changeConnection', this.changeConnection, this);
      event_bus.off('changeUsersConnections', this.changeConnection, this);
      event_bus.off('updateUserAvatar', this.updateUserAvatar, this);
    }

    this.outerContainer = null;
    this.inner_container = null;
    this.togglePanelElement = null;
    this.togglePanelElementToolbar = null;
    this.panelBody = null;
    this.userName = null;
    this.oldPassword = null;
    this.newPassword = null;
    this.confirmPassword = null;
  },

  componentDidUpdate(prevProps, prevState) {
    this.resizePanel();
    if (this.state.bodyMode === MODE.USER_INFO_EDIT) {
      this.userName = this.panelBody.querySelector('[data-main="user_name_input"]');
      this.oldPassword = this.panelBody.querySelector('[data-role="passwordOld"]');
      this.newPassword = this.panelBody.querySelector('[data-role="passwordNew"]');
      this.confirmPassword = this.panelBody.querySelector('[data-role="passwordConfirm"]');
    }
    if (!this.state.userInfo) {
      this.setState({userInfo: this.props.userInfo});
    }
  },

  handleClick(event) {
    let element = this.getDataParameter(event.currentTarget, 'action'),
      currentOptions, gto, po,
      self = this;
    if (element) {
      switch (element.dataset.action) {
        case 'togglePanel':
          this.togglePanel(false);
          break;
        case 'show_more_info':
          this.showMoreInfo(element);
          break;
        case 'switchPanelMode':
          this.switchPanelMode(element);
          break;
        case 'changeMode':
          this.changeMode(element);
          break;
        case 'changeRTE':
          currentOptions = this.optionsDefinition(this.state, this.state.bodyMode);
          currentOptions = Filter.prototype.changeRTE(element, currentOptions);
          if (currentOptions.paginationOptions.rtePerPage) {
            Pagination.prototype.countPagination(currentOptions, null, this.state.bodyMode, null, function(_newState) {
              self.setState(_newState);
            });
          } else {
            this.setState(currentOptions);
          }
          break;
        case 'showPerPage':
          currentOptions = this.optionsDefinition(this.state, this.state.bodyMode);
          currentOptions.paginationOptions.currentPage = null;
          if (currentOptions.paginationOptions.showEnablePagination) {
            Pagination.prototype.countPagination(currentOptions, null, this.state.bodyMode, null, function(_newState) {
              self.setState(_newState);
            });
          }
          break;
        case 'changeRTE_goTo':
          currentOptions = this.optionsDefinition(this.state, this.state.bodyMode);
          currentOptions = GoTo.prototype.changeRTE(element, currentOptions);
          if (currentOptions.goToOptions.rteChoicePage) {
            Pagination.prototype.countPagination(currentOptions, null, this.state.bodyMode, null, function(_newState) {
              self.setState(_newState);
            });
          } else {
            this.setState(currentOptions);
          }
          break;
        case "switchPage":
          currentOptions = this.optionsDefinition(this.state, this.state.bodyMode);
          gto = currentOptions.goToOptions;
          po = currentOptions.paginationOptions;
          if (gto.page) {
            po.currentPage = gto.page;
          }
          Pagination.prototype.countPagination(currentOptions, null, this.state.bodyMode, null, function(_newState) {
            self.setState(_newState);
          });
          break;
        case 'changeUserInfo':
          this.changeUserInfo();
          break;
        case 'cancelChangeUserInfo':
          this.cancelChangeUserInfo();
          break;
        case 'saveChangeUserInfo':
          this.saveChangeUserInfo();
          break;
        case 'logout':
          this.logout();
          break;
        case 'requestChatByChatId':
          this.requestChatByChatId();
          break;
        case 'showChat':
          event_bus.trigger('showChat', element);
          if (utils.deviceIsMobile()) {
            this.togglePanel(true);
          }
          break;
        case 'addNewChatAuto':
          if (this.props.location !== "left") return;
          event_bus.trigger('addNewChatAuto', event);
          if (utils.deviceIsMobile()) {
            this.togglePanel(true);
          }
          break;
        case 'closeChat':
          if (this.props.location !== "left") return;
          this.closeChat(element);
          break;
        case 'requestFriendByUserId':
          if (this.props.location !== "left") return;
          this.requestFriendByUserId(element);
          break;
        case 'copyUserId':
          this.copyUserId();
          break;
        case 'removeUser':
          this.removeUser(element);
          break;
        case 'makeFriends':
          let userId = element.dataset.key;
          if (userId) {
            this.onForceMakeFriends(userId, element);
          } else {
            console.error('Unable to get UserId');
          }
          break;
      }
    }
  },

  handleLoad(event) {
    if (!this.togglePanelElement) return;
    if (this.props.location === "left" && event.target.dataset.onload && event.target.dataset.role === 'mainButtonLeftPanel') {
      this.togglePanelElement_clientWidth = this.togglePanelElement.clientWidth;
    }
    if (this.props.location === "right" && event.target.dataset.onload && event.target.dataset.role === 'mainButtonRightPanel') {
      this.togglePanelElement_clientWidth = this.togglePanelElement.clientWidth;
    }
    this.resizePanel();
  },

  changeMyUsers(){
    this.getInfoForBody();
  },

  copyUserId(){
    let input = this.inner_container.querySelector('[data-role="user_id"]');
    input.disabled = false;
    input.focus();
    input.select();
    try {
      let successful = document.execCommand('copy'),
        msg = successful ? 'successful' : 'unsuccessful';
      console.log('Copy userId was ' + msg);
    } catch (err) {
      console.log('Oops, unable to copy');
    }
    input.disabled = true;
  },

  onInput() {
  },

  handleChange(event) {
    let currentOptions, self = this;
    switch (event.target.dataset.role) {
      case 'selectLanguage':
        this.onChangeLanguage(event);
        break;
      case 'userName':
        this.state.userInfo.userName = event.target.value;
        this.setState({userName: this.state.userInfo});
        break;
    }
    let element = this.getDataParameter(event.currentTarget, 'action');
    if (element) {
      switch (element.dataset.action) {
        case 'changePerPage':
          currentOptions = this.optionsDefinition(this.state, this.state.bodyMode);
          currentOptions = Filter.prototype.changePerPage(element, currentOptions);
          if (currentOptions.paginationOptions.show && currentOptions.paginationOptions.rtePerPage) {
            Pagination.prototype.countPagination(currentOptions, null, this.state.bodyMode, null, function(_newState) {
              self.setState(_newState);
            });
          } else {
            self.setState({currentOptions});
          }
          break;
        case 'changePage':
          currentOptions = this.optionsDefinition(this.state, this.state.bodyMode);
          currentOptions = Pagination.prototype.changePage(element, currentOptions);
          Pagination.prototype.countPagination(currentOptions, null, this.state.bodyMode, null, function(_newState) {
            self.setState(_newState);
          });
          break;
        case 'scrollEachChat':
          if (this.props.location !== "right") return;
          event_bus.trigger('changeScrollEachChat', element);
          this.setState({scrollEachChat: element.checked});
          break;
        case 'readyForFriendRequest':
          if (this.props.location !== "left") return;
          this.readyForFriendRequest(element);
          break;
        case 'notificationOfAccession':
          if (this.props.location !== "left") return;
          // event_bus.trigger('changeScrollEachChat', element);
          this.setState({notificationOfAccession: element.checked});
          break;
        case 'changeDisplayContact':
          this.changeDisplayContact(event);
          break;
      }
    }
  },

  handleDialogError(){
    this.setState({errorMessage: null});
  },

  handleDialogWrongOldPassword(){
    this.oldPassword.value = '';
    this.newPassword.value = '';
    this.confirmPassword.value = '';
    this.setState({errorMessageWrongOldPassword: null});
  },

  handleDialogPasswordsNotMatch(){
    this.newPassword.value = '';
    this.confirmPassword.value = '';
    this.setState({errorMessagePasswordsNotMatch: null});
  },

  handleDialogSaveChangeUserInfo(){
    this.setState({bodyMode: MODE.USER_INFO_SHOW, successMessageSaveChangeUserInfo: null});
    this.previous_UserInfo_Mode = MODE.USER_INFO_SHOW;
    this.user = null;
  },

  handleDialogLogout(event){
    let element = this.getDataParameter(event.target, 'action');
    if (element) {
      switch (element.dataset.action) {
        case 'confirmCancel':
          break;
        case 'confirmOk':
          users_bus.setUserId(null);
          event_bus.trigger("chatsDestroy");
          break;
      }
      this.setState({confirmMessageLogout: null});
    }
  },

  handleDialogShowRemoteFriendshipRequest(event){
    let element = this.getDataParameter(event.target, 'action');
    if (element) {
      switch (element.dataset.action) {
        case 'confirmCancel':
          break;
        case 'confirmOk':
          let messageData = this.state.confirmDialog_messageData;
          this.confirmedFriendship(messageData);
          break;
      }
      this.setState({confirmMessageShowRemoteFriendshipRequest: null, confirmDialog_messageData: null});
    }
  },

  handleDialogRemoveContact(event){
    let element = this.getDataParameter(event.target, 'action'), self = this;
    if (element) {
      switch (element.dataset.action) {
        case 'confirmCancel':
          break;
        case 'confirmOk':
          self.state.contactsInfo.forEach(function(_contact) {
            if (_contact.user_id === self.state.confirmDialog_userId) {
              _contact.is_deleted = true;
            }
          });
          indexeddb.addOrPutAll(
            'put',
            users_bus.userDatabaseDescription,
            'users',
            self.state.contactsInfo,
            function(err) {
              if (err) return console.error(err);

            }
          );
          self.state.userInfo.lastModifyDatetime = Date.now();
          self.setState({
            "contactsInfo": self.state.contactsInfo,
            "userInfo": self.state.userInfo
          });
          event_bus.trigger('changeMyUsers');

          let _connection = webrtc.getConnectionByUserId(self.state.confirmDialog_userId);
          if (_connection) {
            let messageData = {
              type: 'syncResponseUserData',
              from_user_id: self.state.userInfo.user_id,
              is_deleted_owner_request: self.state.confirmDialog_userId,
              is_deleted: true,
              updateInfo: {
                avatar_data: self.state.userInfo.avatar_data,
                lastModifyDatetime: self.state.userInfo.lastModifyDatetime
              }
            };
            webrtc.broadcastMessage([_connection], JSON.stringify(messageData));
          }

          break;
      }
      this.setState({confirmMessageRemoveContact: null, confirmDialog_userId: null});
    }
  },

  confirmedFriendship(messageData){
    this.listenWebRTCConnection(messageData.from_user_id);
    this.listenNotifyUser(messageData.from_user_id);
    websocket.sendMessage({
      type: "friendship_confirmed",
      from_user_id: users_bus.getUserId(),
      to_user_id: messageData.from_user_id,
      request_body: messageData.request_body
    });
    console.log('handleConnectedDevices', messageData.user_wscs_descrs);
    webrtc.handleConnectedDevices(messageData.user_wscs_descrs);
  },

  handleTransitionEnd(event) {
    if (event.target.dataset && event.target.dataset.role === 'detail_view_container') {
      let chatIdValue = event.target.dataset.chat_id;
      var resultClosing = this.state.closingChatsInfoArray.indexOf(chatIdValue);
      if (resultClosing !== -1) {
        this.state.closingChatsInfoArray.splice(this.state.closingChatsInfoArray.indexOf(chatIdValue), 1);
        this.setState({
          closingChatsInfoArray: this.state.closingChatsInfoArray
        });
      }
    }
  },

  closeChat(element) {
    if (this.props.location === "left") {
      let parentElement = this.traverseUpToDataset(element, 'role', 'chatWrapper');
      let chatId = parentElement.dataset.chat_id;
      event_bus.trigger('toCloseChat', element.dataset.role, chatId);
    }
  },

  logout() {
    this.setState({confirmMessageLogout: 106});
  },

  requestChatByChatId() {
    let chat_id_input = this.inner_container.querySelector('[data-role="chat_id_input"]'),
      chat_message_input = this.inner_container.querySelector('[data-role="chat_message_input"]'),
      requestButton = this.inner_container.querySelector('[data-action="requestChatByChatId"]'), newState;

    if (requestButton && chat_id_input && chat_id_input.value && chat_message_input && chat_message_input.value) {
      event_bus.trigger('requestChatByChatId', chat_id_input.value, chat_message_input.value);
      if (utils.deviceIsMobile()) {
        this.togglePanel(true);
      }
    } else {
      this.setState({errorMessage: 90});
    }
  },

  togglePanel(forceClose, options) {
    this.openOrClosePanel(this.outerContainer.clientWidth + this.togglePanelElement.clientWidth >
      document.body.clientWidth, forceClose, options);
  },

  openOrClosePanel(bigMode, forceClose, options) {
    if (this.props.location === 'left' && this.outerContainer.style.right === '100vw') {
      this.outerContainer.style.right = '';
    }
    if (this.props.location === 'right' && this.outerContainer.style.left === '100vw') {
      this.outerContainer.style.left = '';
    }

    if (!forceClose && !this.state.openedState) {
      this.previous_z_index = this.outerContainer.style.zIndex;
      this.outerContainer.style.zIndex = ++z_index;
      this.inner_container.style.maxWidth = this.calcMaxWidth();
      this.setState({
        openedState: true,
        [this.props.location]: '0px'
      });
      this.getInfoForBody(this.state.bodyMode, options);
    } else {
      z_index--;
      this.setState({
        openedState: false,
        [this.props.location]: (-this.outerContainer.offsetWidth) + 'px'
      });
      this.outerContainer.style.zIndex = this.previous_z_index;
      if (bigMode === true) {
        this.setState({
          toggleElemHide: false,
          toggleToolbarElemHide: true
        });
      } else {
        this.setState({
          toggleElemHide: false
        });
      }
    }
  },

  switchPanelMode(element, options) {
    if (element.dataset.mode_to === MODE.USER_INFO_SHOW && this.previous_UserInfo_Mode) {
      this.setState({bodyMode: this.previous_UserInfo_Mode});
    } else {
      this.setState({bodyMode: element.dataset.mode_to});
    }
    this.previous_Filter_Options = false;
    this.previous_BodyMode = this.state.bodyMode;

    if (this.state.bodyMode === MODE.USER_INFO_SHOW) {
      this.previous_UserInfo_Mode = MODE.USER_INFO_SHOW;
    }
    this.getInfoForBody(element.dataset.mode_to, options);
  },

  getInfoForBody(mode, options) {
    let self = this, currentOptions;
    if (options && options.bodyMode) {
      mode = options.bodyMode;
    }
    if (!mode) {
      mode = this.state.bodyMode;
    }
    if (mode === MODE.USERS) {
      users_bus.getMyInfo(null, function(error, options, userInfo) {
        users_bus.getContactsInfo(error, userInfo.user_ids, function(_error, contactsInfo) {
          if (_error) {
            console.error(_error);
            return;
          }
          currentOptions = self.optionsDefinition(self.state, mode);

          if (currentOptions.paginationOptions.show && currentOptions.paginationOptions.rtePerPage) {
            Pagination.prototype.countPagination(currentOptions, null, mode, null, function(_newState) {
              self.setState({_newState, "userInfo": userInfo, "contactsInfo": contactsInfo});
            });
          } else {
            contactsInfo = users_bus.filterUsersByTypeDisplay(contactsInfo, currentOptions.filterOptions.typeDisplayContacts);
            self.setState({"userInfo": userInfo, "contactsInfo": contactsInfo});
          }
        });
      });
    }
    if ((mode === MODE.CHATS) && (this.props.location === 'left')) {
      chats_bus.getAllChats(null, function(error, chatsArray) {
        if (error) {
          console.error(error);
          return;
        }
        event_bus.trigger("getOpenChats", function(openChats) {
          currentOptions = self.optionsDefinition(self.state, mode);
          if (currentOptions.paginationOptions.show && currentOptions.paginationOptions.rtePerPage) {
            Pagination.prototype.countPagination(currentOptions, null, mode, null, function(_newState) {
              self.setState({_newState, "chat_ids": chatsArray, "openChats": openChats});
            });
          } else {
            self.setState({"chat_ids": chatsArray, "openChats": openChats});
          }
        });
      });
    }
    if ((mode === MODE.JOIN_USER) && (this.props.location === 'left')) {
      if (options && options.userId) {
        if (options.force) {
          this.state.joinUser_ListOptions.userId = options.userId;
          this.state.joinUser_ListOptions.messageRequest = options.messageRequest;
          this.setState({
            joinUser_ListOptions: this.state.joinUser_ListOptions,
            bodyMode: options.bodyMode
          });
        }
      } else {
        this.state.joinUser_ListOptions.userId = null;
        this.state.joinUser_ListOptions.messageRequest = null;
        this.setState({joinUser_ListOptions: this.state.joinUser_ListOptions});
      }
    }
    if ((mode === MODE.JOIN_CHAT) && (this.props.location === 'left')) {
      if (options && options.chatId) {
        if (options.force) {
          this.state.joinChat_ListOptions.chatId = options.chatId;
          this.state.joinChat_ListOptions.messageRequest = options.messageRequest;
          this.setState({
            joinChat_ListOptions: this.state.joinChat_ListOptions,
            bodyMode: options.bodyMode
          });
        }
      } else {
        this.state.joinChat_ListOptions.chatId = null;
        this.state.joinChat_ListOptions.messageRequest = null;
        this.setState({joinChat_ListOptions: this.state.joinChat_ListOptions});
      }
    }
  },

  setUserInfo(userInfo) {
    this.setState({userInfo: userInfo});
  },

  calcMaxWidth() {
    return document.body.offsetWidth + 'px';
  },

  showMoreInfo(element) {
    let chatIdValue = element.dataset.chat_id,
      detailView = element.querySelector('[data-role="detail_view_container"]'),
      pointer = element.querySelector('[data-role="pointer"]'),
      resultClosing = this.state.closingChatsInfoArray.indexOf(chatIdValue);
    if (resultClosing !== -1) return;
    if (detailView.dataset.state) {
      this.state.openChatsInfoArray.splice(this.state.openChatsInfoArray.indexOf(chatIdValue), 1);
      this.state.closingChatsInfoArray.push(chatIdValue);
      this.setState({
        closingChatsInfoArray: this.state.closingChatsInfoArray,
        openChatsInfoArray: this.state.openChatsInfoArray
      });
      return;
    }

    if (element) {
      this.state.openChatsInfoArray.push(chatIdValue);
      this.setState({
        openChatsInfoArray: this.state.openChatsInfoArray
      });
    }
  },

  changeMode(element) {
    if (!element || !element.dataset) return;
    let chat_part = element.dataset.chat_part,
      newMode = element.dataset.mode_to,
      currentOptions, po, fo,
      self = this;
    switch (chat_part) {
      case "filter":
        switch (newMode) {
          case "CHATS_FILTER":
          case "USERS_FILTER":
            currentOptions = this.optionsDefinition(this.state, this.state.bodyMode);
            fo = currentOptions.filterOptions;
            fo.show = fo.show.toString() !== "true";
            this.setState({[fo.text]: fo});
            break;
        }
        break;
      case "pagination":
        switch (newMode) {
          case "PAGINATION":
            switch (this.state.bodyMode) {
              case "CHATS":
              case "USERS":
                currentOptions = this.optionsDefinition(this.state, this.state.bodyMode);
                po = currentOptions.paginationOptions;
                po.show = element.checked;
                po.showEnablePagination = element.checked;
                if (!po.showEnablePagination) {
                  po.start = 0;
                  po.final = null;
                } else {
                  Pagination.prototype.countPagination(currentOptions, null, self.state.bodyMode,
                    {chat_id: self.state.chat_id}, function(_newState) {
                      self.setState(_newState);
                    });
                }
                this.setState({[po.text]: po});
                break;
            }
            break;
          case "GO_TO":
            break;
        }
        break;
    }
  },

  changeUserInfo() {
    this.setState({bodyMode: MODE.USER_INFO_EDIT});
    this.previous_UserInfo_Mode = MODE.USER_INFO_EDIT;
  },

  cancelChangeUserInfo() {
    this.setState({bodyMode: MODE.USER_INFO_SHOW});
    this.previous_UserInfo_Mode = MODE.USER_INFO_SHOW;
  },

  saveChangeUserInfo() {
    let self = this;
    if (this.userName.value && this.oldPassword.value && this.newPassword.value &&
      this.confirmPassword.value) {
      if (this.oldPassword.value === this.state.userInfo.userPassword) {
        if (this.newPassword.value === this.confirmPassword.value) {
          this.updateUserInfo(function() {
            self.setState({successMessageSaveChangeUserInfo: 105});
          })
        } else {
          this.setState({errorMessagePasswordsNotMatch: 94});
        }
      } else {

        this.setState({errorMessageWrongOldPassword: 95});
      }
    } else {
      this.setState({errorMessage: 88});
    }
  },

  updateUserInfo(callback) {
    let self = this;
    users_bus.getMyInfo(null, function(err, options, userInfo) {
      userInfo.userPassword = self.newPassword.value;
      userInfo.userName = self.userName.value;
      users_bus.saveMyInfo(userInfo, callback);
    });
  },

  updateUserAvatar(){
    let self = this;
    users_bus.getMyInfo(null, function(_err, options, userInfo) {
      self.setState({userInfo: userInfo});
    })
  },

  getPanelDescription(callback) {
    if (callback) {
      this.state.chat_ids = [];
      this.state.openChats = [];
      this.state.avatarMode = "SHOW";
      this.state.confirmMessageLogout = null;
      callback(this.state, this.props.location);
    }
  },

  changeConnection(){
    if (this.state.openedState) {
      event_bus.trigger('changeConnectionList');
    }
  },

  resizePanel() {
    if (this.state.openedState && this.outerContainer) {
      if (this.outerContainer.clientWidth + this.togglePanelElement_clientWidth > document.body.clientWidth) {
        this.inner_container.style.maxWidth = this.calcMaxWidth();

        if (!this.state.toggleElemHide) {
          this.setState({
            toggleElemHide: true
          });
        }
        if (this.togglePanelElementToolbar) {
          if (this.state.toggleToolbarElemHide) {
            this.setState({
              toggleToolbarElemHide: false
            });
          }
        }
      }
      else {
        if (this.state.toggleElemHide) {
          this.setState({
            toggleElemHide: false
          });
        }
        if (this.togglePanelElementToolbar) {
          if (!this.state.toggleToolbarElemHide) {
            this.setState({
              toggleToolbarElemHide: true
            });
          }
        }
      }
    } else {
      if (this.state.toggleElemHide) {
        this.setState({
          toggleElemHide: false
        });
      }
    }
  },

  onChangeLanguage(event) {
    this.props.handleEvent.changeLanguage(event.target.value);
  },

  toggleListOptions(chatsLength) {
    if (this.props.location === "left") {
      this.state.chats_ListOptions.final = chatsLength;
      this.setState({chats_ListOptions: this.state.chats_ListOptions});
    }
  },

  changeState(newState) {
    this.setState(newState);
  },

  renderHandlers(events) {
    let handlers = {};
    if (events) {
      for (var dataKey in events) {
        handlers[dataKey] = events[dataKey];
      }
    }
    return handlers;
  },

  onForceMakeFriends(userId, element){
    let options = {
      userId: userId,
      bodyMode: MODE.JOIN_USER,
      messageRequest: 110,
      force: true
    };
    if (this.state.openedState) {
      this.switchPanelMode(element, options);
    } else {
      this.togglePanel(null, options);
    }
  },

  requestFriendByUserId() {
    let user_id_input = this.inner_container.querySelector('[data-role="user_id_input"]'),
      user_message_input = this.inner_container.querySelector('[data-role="user_message_input"]'),
      requestButton = this.inner_container.querySelector('[data-action="requestFriendByUserId"]');

    if (requestButton && user_id_input && user_id_input.value && user_message_input && user_message_input.value) {
      websocket.sendMessage({
        type: "user_add",
        from_user_id: users_bus.getUserId(),
        avatar_data: this.state.userInfo.avatar_data,
        to_user_id: user_id_input.value,
        request_body: {
          message: user_message_input.value
        }
      });
    } else {
      this.setState({errorMessage: 89});
    }
  },

  readyForFriendRequest(element) {
    this.state.joinUser_ListOptions.readyForRequest = element.checked;
    this.setState({joinUser_ListOptions: this.state.joinUser_ListOptions});
    websocket.sendMessage({
      type: "user_toggle_ready",
      from_user_id: users_bus.getUserId(),
      ready_state: element.checked
    });
  },

  removeUser(element){
    let parentElement = this.traverseUpToDataset(element, 'role', 'userWrapper');
    if (!parentElement || parentElement && !parentElement.dataset.user_id) {
      return console.error(new Error('User wrapper does not have user id!'));
    }
    let user_id = parentElement.dataset.user_id;
    this.setState({confirmMessageRemoveContact: 139, confirmDialog_userId: user_id});
  },

  changeDisplayContact(event){
    let value = event.target.value, po = this.state.users_PaginationOptions, fo = this.state.users_FilterOptions;
    if (value && value !== fo.typeDisplayContacts) {
      po.currentPage = null;
      fo.typeDisplayContacts = value;
      this.setState({users_FilterOptions: fo, users_PaginationOptions: po});
      this.getInfoForBody();
    }
  },

  /**
   * handle message from web-socket (if it is connected with chats some how)
   */
  onPanelMessageRouter(messageData) {
    if (this.props.location !== "left") {
      return;
    }
    switch (messageData.type) {
      case 'user_add':
        this.showRemoteFriendshipRequest(messageData);
        break;
      case 'user_add_sent':
        event_bus.set_ws_device_id(messageData.from_ws_device_id);
        this.listenNotifyUser(messageData.to_user_id);
        break;
      case 'user_add_auto':
        this.confirmedFriendship(messageData);
        break;
      case 'user_add_auto_sent':
        event_bus.set_ws_device_id(messageData.from_ws_device_id);
        this.listenNotifyUser(messageData.to_user_id);
        break;
      case 'friendship_confirmed':
        if (messageData.user_wscs_descrs) {
          this.listenWebRTCConnection(messageData.from_user_id);
          console.log('handleConnectedDevices', messageData.user_wscs_descrs);
          webrtc.handleConnectedDevices(messageData.user_wscs_descrs);
        }
        break;
      case 'device_toggled_ready':
        event_bus.set_ws_device_id(messageData.from_ws_device_id);
        break;
      case 'error':
        switch (messageData.request_type) {
          case 'user_add_sent':
            this.setState({errorMessage: 115});
            break;
        }
        break;
    }
  },

  onNotifyUser(user_id, messageData) {
    var self = this;
    console.log('onNotifyUser', user_id);
    users_bus.addNewUserToIndexedDB(messageData.user_description, function(error, user_description) {
      if (error) {
        console.error(error);
        return;
      }

      users_bus.putUserIdAndSave(user_id, function(_err) {
        if (_err) {
          return console.error(_err);
        }

        event_bus.trigger('changeMyUsers');
        if (self.state.bodyMode === MODE.USERS) {
          self.getInfoForBody(self.state.bodyMode);
        }
      });
      console.log('putUserIdAndSave', user_id);
      self.notListenNotifyUser();
    });
  },

  webRTCConnectionReady(user_id, triggerConnection) {
    var _this = this;
    console.log('webRTCConnectionReady', triggerConnection.hasUserId(user_id), user_id);
    if (triggerConnection.hasUserId(user_id)) {
      // if connection for user friendship
      _this.notListenWebRTCConnection();
      users_bus.getUserDescription({}, function(error, user_description) {
        if (error) {
          console.error(error);
          return;
        }
        var messageData = {
          type: "notifyUser",
          user_description: user_description,
          from_user_id: user_description.user_id
        };
        if (triggerConnection.isActive()) {
          triggerConnection.dataChannel.send(JSON.stringify(messageData));
        } else {
          console.warn('No friendship data channel!');
        }
      });
    }
  },

  notListenWebRTCConnection() {
    if (this.bindedWebRTCConnectionReady) {
      webrtc.off('webrtc_connection_established', this.bindedWebRTCConnectionReady);
    }
  },

  listenWebRTCConnection(user_id) {
    this.notListenWebRTCConnection();
    this.bindedWebRTCConnectionReady = this.webRTCConnectionReady.bind(this, user_id);
    webrtc.on('webrtc_connection_established', this.bindedWebRTCConnectionReady);
  },

  notListenNotifyUser() {
    if (this.bindedOnNotifyUser) {
      event_bus.off('notifyUser', this.bindedOnNotifyUser);
    }
  },

  listenNotifyUser(user_id) {
    console.log('listenNotifyUser', user_id);
    this.notListenNotifyUser();
    this.bindedOnNotifyUser = this.onNotifyUser.bind(this, user_id);
    event_bus.on('notifyUser', this.bindedOnNotifyUser);
  },

  showRemoteFriendshipRequest(messageData) {
    event_bus.set_ws_device_id(messageData.target_ws_device_id);
    if (!messageData.user_wscs_descrs) {
      return;
    }

    this.setState({
      confirmMessageShowRemoteFriendshipRequest: messageData.request_body.message,
      confirmDialog_messageData: messageData
    });
  },

  render() {
    let handleEvent = {
      changeState: this.changeState
    };
    let onEvent = {
      onClick: this.handleClick,
      onChange: this.handleChange,
      onTransitionEnd: this.handleTransitionEnd
    };

    let location = this.props.location;
    let btnConfig = (location === 'left') ? this.props.leftBtnConfig : this.props.rightBtnConfig;
    let panel_toolbar_class = (location === 'left') ? 'w-100p flex-dir-col flex-item-auto c-200' : 'w-100p flex-dir-col c-200';
    var style = {[location]: this.state[location]};
    return (
      <div data-role={location + '_panel'}>
        <DialogError show={this.state.errorMessage} message={this.state.errorMessage}
                     handleClick={this.handleDialogError}/>
        <DialogError show={this.state.errorMessageWrongOldPassword}
                     message={this.state.errorMessageWrongOldPassword}
                     handleClick={this.handleDialogWrongOldPassword}/>
        <DialogError show={this.state.errorMessagePasswordsNotMatch}
                     message={this.state.errorMessagePasswordsNotMatch}
                     handleClick={this.handleDialogPasswordsNotMatch}/>
        <DialogSuccess show={this.state.successMessageSaveChangeUserInfo}
                       message={this.state.successMessageSaveChangeUserInfo}
                       handleClick={this.handleDialogSaveChangeUserInfo}/>
        <DialogConfirm show={this.state.confirmMessageLogout}
                       message={this.state.confirmMessageLogout}
                       handleClick={this.handleDialogLogout}/>
        <DialogConfirm show={this.state.confirmMessageShowRemoteFriendshipRequest}
                       message={this.state.confirmMessageShowRemoteFriendshipRequest}
                       handleClick={this.handleDialogShowRemoteFriendshipRequest}/>
        <DialogConfirm show={this.state.confirmMessageRemoveContact}
                       message={this.state.confirmMessageRemoveContact}
                       handleClick={this.handleDialogRemoveContact}/>
        <section style={style} data-role={location + '_panel_outer_container'}
                 className={location + '-panel hide p-fx panel animate c-100'}>
          <div className="p-rel h-100p flex-dir-col">
            <Triple_Element events={onEvent} config={btnConfig} hide={this.state.toggleElemHide}/>
            <div data-role={location + '_panel_inner_container'}
                 className="min-width-350 flex-item-1-auto clear flex-dir-col h-100p">
              <header id={location} data-role={location + '_panel_toolbar'} className={panel_toolbar_class}>
                <PanelToolbar location={location} mode={this.state.bodyMode} events={onEvent}
                              hide={this.state.toggleToolbarElemHide}/>
              </header>
              <div data-role={location + '_extra_toolbar_container'}
                   className="flex-sp-around flex-item-auto c-200">
                <ExtraToolbar mode={this.state.bodyMode} data={this.state} events={onEvent}/>
              </div>
              <div data-role={location + '_filter_container'} className="flex wrap flex-item-auto c-200">
                <Filter mode={this.state.bodyMode} data={this.state} events={onEvent}/>
              </div>
              <div data-role="panel_body" className="overflow-a flex-item-1-auto p-t"
                   onTransitionend={this.transitionEnd}>
                <Body mode={this.state.bodyMode} data={this.state} options={this.props.data} events={onEvent}
                      userInfo={this.state.userInfo? this.state.userInfo : this.props.userInfo}
                      handleEvent={handleEvent}/>
              </div>
              <footer className="flex-item-auto">
                <div data-role={location + '_go_to_container'} className="c-200">
                  <GoTo mode={this.state.bodyMode} data={this.state} events={onEvent}/>
                </div>
                <div data-role={location + '_pagination_containe'}
                     className="flex filter_container justContent c-200">
                  <Pagination mode={this.state.bodyMode} data={this.state} events={onEvent}
                              handleEvent={handleEvent}/>
                </div>
              </footer>
            </div>
          </div>
        </section>
      </div>
    )
  }
});

extend_core.prototype.inherit(Panel, overlay_core);
extend_core.prototype.inherit(Panel, dom_core);
extend_core.prototype.inherit(Panel, extend_core);
extend_core.prototype.inherit(Panel, switcher_core);

export default Panel;