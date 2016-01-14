import React from 'react'
import { render } from 'react-dom'
import localization from '../js/localization.js'
import overlay_core from '../js/overlay_core.js'
import extend_core from '../js/extend_core.js'
import dom_core from '../js/dom_core.js'
import users_bus from '../js/users_bus.js'
import event_bus from '../js/event_bus.js'
import chats_bus from '../js/chats_bus.js'

import Triple_Element from '../components/triple_element'
import Popup from '../components/popup'
import Decription from '../components/description'
import ChatResize from '../components/chat_resize'
import ExtraToolbar from '../components/extra_toolbar'
import Filter from '../components/filter'
import PanelToolbar from '../components/panel_toolbar'
import Body from '../components/body'
import Pagination from '../components/pagination'
import GoTo from '../components/go_to'

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
        "class": "flex-inner-container"
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
      }
    }
  },

  getInitialState(){
    if (this.props.location === 'left') {
      return {
        openChatsInfoArray: [],
        closingChatsInfoArray: [],
        chat_ids: [],
        openChats: [],
        openedState: false,
        left: '-700px',
        toggleElemHide: false,
        toggleToolbarElemHide: true,
        bodyMode: "CREATE_CHAT",

        popupOptions: {
          messagePopupShow: false,
          type: '',
          options: {},
          onDataActionClick: null
        },

        chats_GoToOptions: {
          show: false,
          rteChoicePage: true,
          mode_change: "rte",
          "chat": null
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
          show: false
        },
        users_GoToOptions: {
          text: "users",
          show: false,
          rteChoicePage: true,
          mode_change: "rte",
          "user": null
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
          perPageValueNull: false,
          rtePerPage: true,
          disableBack: false,
          disableFirst: false,
          disableLast: false,
          disableForward: false
        },
        users_ListOptions: {
          text: "users",
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
          show: false,
          rteChoicePage: true,
          mode_change: "rte"
        },
        joinUser_ListOptions: {
          readyForRequest: false
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
          show: false,
          rteChoicePage: true,
          mode_change: "rte"
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
          show: false,
          rteChoicePage: true,
          mode_change: "rte"
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
          show: false,
          rteChoicePage: true,
          mode_change: "rte"
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
          show: false,
          rteChoicePage: true,
          mode_change: "rte"
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
          show: false,
          rteChoicePage: true,
          mode_change: "rte"
        },
        blogs_ListOptions: {
          text: "blogs",
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
        openChats: [],
        openedState: false,
        right: '-700px',
        toggleElemHide: false,
        toggleToolbarElemHide: true,
        bodyMode: "USER_INFO_SHOW",

        popupOptions: {
          messagePopupShow: false,
          type: '',
          options: {},
          onDataActionClick: null
        },

        connections_ExtraToolbarOptions: {
          show: false
        },
        connections_FilterOptions: {
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
          text: "connections",
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

  componentWillMount(){
    if(this.props.userInfo[this.props.location]){
      this.setState(this.props.userInfo[this.props.location]);
      if(this.props.location === "left"){
        this.setState({'left': '-700px', 'openedState': false});
        return;
      }
      if(this.props.location === "right"){
        this.setState({'right': '-700px', 'openedState': false});
      }
    }
  },

  componentDidMount(){
    document.addEventListener('load', this.handleLoad, true);
    document.addEventListener('resize', this.handleResize, false);
    document.addEventListener('resize', this.handleResize, false);
    event_bus.on('getPanelDescription', this.getPanelDescription);
    event_bus.on('AddedNewChat', this.toggleListOptions);
    event_bus.on('chatDestroyed', this.onChatDestroyed);
    event_bus.on('changeOpenChats', this.getInfoForBody);

    if (this.props.location === "left") {
      this.outerContainer = document.querySelector('[data-role="left_panel_outer_container"]');
      this.inner_container = document.querySelector('[data-role="left_panel_inner_container"]');
      this.outerContainer.style.right = '100vw';
    }
    if (this.props.location === "right") {
      this.outerContainer = document.querySelector('[data-role="right_panel_outer_container"]');
      this.inner_container = document.querySelector('[data-role="right_panel_inner_container"]');
      this.outerContainer.style.left = '100vw';
    }
    this.togglePanelElement = this.outerContainer.querySelector('[data-action="togglePanel"]');
    this.togglePanelElementToolbar = this.outerContainer.querySelector('[data-role="togglePanelToolbar"]');
    this.panelBody = this.outerContainer.querySelector('[data-role="panel_body"]');

    this.outerContainer.classList.remove("hide");
    this.outerContainer.style.maxWidth = window.innerWidth + 'px';
    this.outerContainer.style.zIndex = z_index;

    this.outerContainer.addEventListener('transitionend', this.handleTransitionEnd);
  },

  componentWillUnmount: function() {
    window.removeEventListener('load', this.handleLoad);
    document.removeEventListener('resize', this.handleResize);
    event_bus.off('getPanelDescription', this.getPanelDescription);
    event_bus.off('AddedNewChat', this.toggleListOptions);
    event_bus.off('chatDestroyed', this.getInfoForBody);
    event_bus.off('changeOpenChats', this.getInfoForBody);

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

  componentDidUpdate(){
    this.resizePanel();
    if (this.state.bodyMode === MODE.USER_INFO_EDIT) {
      this.userName = this.panelBody.querySelector('[data-main="user_name_input"]');
      this.oldPassword = this.panelBody.querySelector('[data-role="passwordOld"]');
      this.newPassword = this.panelBody.querySelector('[data-role="passwordNew"]');
      this.confirmPassword = this.panelBody.querySelector('[data-role="passwordConfirm"]');
    }
    if(!this.state.userInfo){
      this.setState({userInfo: this.props.userInfo});
    }
  },

  handleClick(event){
    var element = this.getDataParameter(event.currentTarget, 'action'), newState;
    if (element) {
      switch (element.dataset.action) {
        case 'togglePanel':
          this.togglePanel();
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
          newState = Filter.prototype.changeRTE(element, this.state, this.state.bodyMode);
          this.setState(newState);
          break;
        case 'showPerPage':
          newState = Filter.prototype.showPerPage(element, this.state, this.state.bodyMode);
          this.setState(newState);
          break;
        case 'changeRTE_goTo':
          newState = GoTo.prototype.changeRTE(element, this.state, this.state.bodyMode);
          this.setState(newState);
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
        case 'showChat':
          event_bus.trigger('showChat', element);
          break;
        case 'addNewChatAuto':
          event_bus.trigger('addNewChatAuto', event);
          break;
        case 'closeChat':
            this.closeChat(element);
          break;
      }
    }
  },

  handleLoad: function(event) {
    if (!this.togglePanelElement) return;
    if (this.props.location === "left" && event.target.dataset.onload) {
      this.togglePanelElement_clientWidth = this.togglePanelElement.clientWidth;
    }
    if (this.props.location === "right" && event.target.dataset.onload) {
      this.togglePanelElement_clientWidth = this.togglePanelElement.clientWidth;
    }
    this.resizePanel();
  },

  onInput(){
  },

  handleChange(event){
    switch (event.target.dataset.role) {
      case 'selectLanguage':
        this.onChangeLanguage(event);
        break;
      case 'userName':
        this.state.userInfo.userName = event.target.value;
        this.setState({userName: this.state.userInfo});
        break;
    }
    var element = this.getDataParameter(event.currentTarget, 'action');
    if (element){
      switch (element.dataset.action) {
        case 'changePerPage':
          var newState = Filter.prototype.changePerPage(element, this.state, this.state.bodyMode);
          this.setState(newState);
          break;
      }
    }
  },

  handleTransitionEnd(event){
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

  closeChat(element){
    let saveStates;
    if (this.props.location === "left") {
      let parentElement = this.traverseUpToDataset(element, 'role', 'chatWrapper');
      let chatId = parentElement.dataset.chat_id;
      event_bus.trigger('toCloseChat', element.dataset.role, chatId);
    }
  },

  logout(){
    var newState, self = this;
    event_bus.trigger('changeStatePopup', {
      show: true,
      type: 'confirm',
      message: 106,
      onDataActionClick: function(action) {
        switch (action) {
          case 'confirmOk':
            newState = Popup.prototype.handleClose(this.state);
            this.setState(newState);
            users_bus.setUserId(null);
            event_bus.trigger("chatsDestroy");
            break;
          case 'confirmCancel':
            newState = Popup.prototype.handleClose(this.state);
            this.setState(newState);
            break;
        }
      }
    });
  },

  togglePanel(forceClose){
    this.openOrClosePanel(this.outerContainer.clientWidth + this.togglePanelElement.clientWidth >
      document.body.clientWidth, forceClose);
  },

  openOrClosePanel(bigMode, forceClose) {
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
        this.getInfoForBody(this.state.bodyMode);
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

  switchPanelMode: function(element) {
    var self = this;
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
      this.getInfoForBody(element.dataset.mode_to);
  },

  getInfoForBody(mode){
    var self = this;
    if(mode === MODE.USERS) {
      users_bus.getMyInfo(null, function(error, options, userInfo) {
        self.setState({userInfo: userInfo});
      });
    }
    if((mode === MODE.CHATS)){
      chats_bus.getAllChats(null, function(error, chatsArray) {
        if (error) {
          console.error(error);
          return;
        }
        event_bus.trigger("getOpenChats", function(openChats){
          self.setState({chat_ids: chatsArray, "openChats": openChats});
        });
      });
    }
  },

  setUserInfo(userInfo){
    this.setState({userInfo: userInfo});
  },

  calcMaxWidth: function() {
    return document.body.offsetWidth + 'px';
  },

  showMoreInfo(element){
    var chatIdValue = element.dataset.chat_id;
    var detailView = element.querySelector('[data-role="detail_view_container"]');
    var pointer = element.querySelector('[data-role="pointer"]');
    var resultClosing = this.state.closingChatsInfoArray.indexOf(chatIdValue);
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

  changeMode(element){
    if (!element || !element.dataset) return;
    var chat_part = element.dataset.chat_part;
    var newMode = element.dataset.mode_to;
    var newState;
    switch (chat_part) {
      case "filter":
        switch (newMode) {
          case "CHATS_FILTER":
            var bool_Value = this.state.chats_FilterOptions.show.toString() !== "true";
            this.setState({chats_FilterOptions: {show: bool_Value}});
            break;
          case "USERS_FILTER":
            var bool_Value = this.state.users_FilterOptions.show.toString() !== "true";
            this.setState({users_FilterOptions: {show: bool_Value}});
            break;
        }
        break;
      case "pagination":
        switch (newMode) {
          case "PAGINATION":
            switch (this.state.bodyMode) {
              case "CHATS":
                this.state.chats_PaginationOptions.show = element.checked;
                this.state.chats_PaginationOptions.showEnablePagination = element.checked;
                this.setState({chats_PaginationOptions: this.state.chats_PaginationOptions});
                if (!element.checked) {
                  //ListOptions param = null or 0
                }
                break;
              case "USERS":
                this.state.users_PaginationOptions.show = element.checked;
                this.state.users_PaginationOptions.showEnablePagination = element.checked;
                this.setState({users_PaginationOptions: this.state.users_PaginationOptions});
                if (!element.checked) {
                  //ListOptions param = null or 0
                }
                break;
            }
            break;

        }
        break;
    }
  },

  changeUserInfo(){
    this.setState({bodyMode: MODE.USER_INFO_EDIT});
    this.previous_UserInfo_Mode = MODE.USER_INFO_EDIT;
  },

  cancelChangeUserInfo(){
    this.setState({bodyMode: MODE.USER_INFO_SHOW});
    this.previous_UserInfo_Mode = MODE.USER_INFO_SHOW;
  },

  saveChangeUserInfo(){
    var self = this, newState;
    if (this.userName.value && this.oldPassword.value && this.newPassword.value &&
      this.confirmPassword.value) {
      if (this.oldPassword.value === this.state.userInfo.userPassword) {
        if (this.newPassword.value === this.confirmPassword.value) {
          this.updateUserInfo(function() {
            event_bus.trigger('changeStatePopup', {
              show: true,
              type: 'success',
              message: 105,
              onDataActionClick: function(action) {
                switch (action) {
                  case 'confirmCancel':
                    newState = Popup.prototype.handleClose(this.state);
                    this.setState(newState);
                    self.setState({bodyMode: MODE.USER_INFO_SHOW});
                    self.previous_UserInfo_Mode = MODE.USER_INFO_SHOW;
                    self.user = null;
                    break;
                }
              }
            });
          })
        } else {
          event_bus.trigger('changeStatePopup', {
            show: true,
            type: 'error',
            message: 94,
            onDataActionClick: function(action) {
              switch (action) {
                case 'confirmCancel':
                  newState = Popup.prototype.handleClose(this.state);
                  this.setState(newState);
                  self.newPassword.value = '';
                  self.confirmPassword.value = '';
                  break;
              }
            }
          });
        }
      } else {
        event_bus.trigger('changeStatePopup', {
          show: true,
          type: 'error',
          message: 95,
          onDataActionClick: function(action) {
            switch (action) {
              case 'confirmCancel':
                newState = Popup.prototype.handleClose(this.state);
                this.setState(newState);
                self.oldPassword.value = '';
                self.newPassword.value = '';
                self.confirmPassword.value = '';
                break;
            }
          }
        });
      }
    } else {
      event_bus.trigger('changeStatePopup', {
        show: true,
        type: 'error',
        message: 88,
        onDataActionClick: function(action) {
          switch (action) {
            case 'confirmCancel':
              newState = Popup.prototype.handleClose(this.state);
              this.setState(newState);
              break;
          }
        }
      });
    }
  },

  updateUserInfo(callback) {
    var self = this;
    users_bus.getMyInfo(null, function(err, options, userInfo) {
      userInfo.userPassword = self.newPassword.value;
      userInfo.userName = self.userName.value;
      users_bus.saveMyInfo(userInfo, callback);
    });
  },

  getPanelDescription: function(callback) {
    if (callback) {
      this.setState({"chat_ids": [], "openChats": []});
      callback(this.state, this.props.location);
    }
  },

  onChatDestroyed(chatId){
    if(this.state.openChats){
      delete this.state.openChats[chatId];
    }
    this.setState({openChats: this.state.openChats});
  },

  resizePanel(flag) {
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

  onChangeLanguage(event){
    this.changeLanguage(event);
  },

  changeLanguage: function(event) {
    var current_localization = localization.lang;
    localization.changeLanguage(event.target.value);

    var language = localStorage.getItem('language');
    if (!language || language !== event.target.value) {
      localStorage.setItem('language', event.target.value);
    }
  },

  toggleListOptions(chatsLength){
    if(this.props.location === "left"){
      this.state.chats_ListOptions.final = chatsLength;
      this.setState({chats_ListOptions: this.state.chats_ListOptions});
    }
  },

  renderHandlers(events){
    var handlers = {};
    if (events) {
      for (var dataKey in events) {
        handlers[dataKey] = events[dataKey];
      }
    }
    return handlers;
  },

  render() {
    let onEvent = {
      onClick: this.handleClick,
      onChange: this.handleChange,
      onInput: this.onInput,
      onTransitionEnd: this.handleTransitionEnd
    };

    let location = this.props.location;
    let btnConfig = (location === 'left') ? this.props.leftBtnConfig : this.props.rightBtnConfig;
    let panel_toolbar_class = (location === 'left') ? 'w-100p flex-dir-col flex-item-auto c-200' : 'w-100p flex-dir-col c-200';
    var style = {[location]: this.state[location]};
    return (
      <section style={style} data-role={location + '_panel_outer_container'}
               className={location + '-panel hide p-fx panel animate c-100'}>
        <div className="p-rel h-100p flex-dir-col">
          <Triple_Element events={onEvent} config={btnConfig} hide={this.state.toggleElemHide}/>
          <div data-role={location + '_panel_inner_container'}
               className="min-width-350 flex-item-1-auto clear flex-dir-col h-100p">
            <header id={location} data-role={location + '_panel_toolbar'} className={panel_toolbar_class}>
              <PanelToolbar location={location} mode={this.state.bodyMode} events={onEvent}
                            hide={this.state.toggleToolbarElemHide}
              />
            </header>
            <div data-role={location + '_extra_toolbar_container'}
                 className="flex-sp-around flex-item-auto c-200">
              <ExtraToolbar mode={this.state.bodyMode} data={this.state} events={onEvent}/>
            </div>
            <div data-role={location + '_filter_container'} className="flex wrap flex-item-auto c-200">
              <Filter mode={this.state.bodyMode} data={this.state} events={onEvent}/>
            </div>
            <div data-role="panel_body" className="overflow-a flex-item-1-auto" onTransitionend={this.transitionEnd}>
              <Body mode={this.state.bodyMode} data={this.state} options={this.props.data} events={onEvent}
                    userInfo={this.state.userInfo? this.state.userInfo : this.props.userInfo}/>
            </div>
            <footer className="flex-item-auto">
              <div data-role={location + '_go_to_container'} className="c-200">
                <GoTo mode={this.state.bodyMode} data={this.state} events={onEvent}/>
              </div>
              <div data-role={location + '_pagination_containe'}
                   className="flex filter_container justContent c-200">
                <Pagination mode={this.state.bodyMode} data={this.state} events={onEvent}/>
              </div>
            </footer>
          </div>
        </div>
      </section>
    )
  }
});
extend_core.prototype.inherit(Panel, overlay_core);
extend_core.prototype.inherit(Panel, dom_core);
extend_core.prototype.inherit(Panel, extend_core);

export default Panel;