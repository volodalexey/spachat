import Body from '../components/body.js'

var Switcher_core = function() {
};

Switcher_core.prototype = {

  __class_name: "switcher_core",

  optionsDefinition: function(_component, mode) {
    var self = this;

    switch (mode) {
      //case Body.prototype.MODE.SETTINGS:
      //
      //  break;
      //case  Body.prototype.MODE.MESSAGES:
      //  //self.previousModeSwitcher =  Body.prototype.MODE.MESSAGES;
      //  _component.currentPaginationOptions = _component.settings_PaginationOptions;
      //  _component.currentGoToOptions = _component.settings_GoToOptions;
      //  _component.current_Extra_Toolbar_Options = _component.settings_ExtraToolbarOptions;
      //  _component.currnetFilterOptions = _component.settings_FilterOptions;
      //  _component.currentListOptions = _component.settings_ListOptions;
      //  break;
      //case  Body.prototype.MODE.CONTACT_LIST:
      //  break;
      //case  Body.prototype.MODE.LOGGER:
      //  break;
     /* case _component.MODE.CHATS:
        break;
      case _component.MODE.CREATE_CHAT:
        break;
      case _component.MODE.JOIN_CHAT:
        break;
      case _component.MODE.BLOGS:
        break;
      case _component.MODE.CREATE_BLOG:
        break;
      case _component.MODE.JOIN_BLOG:
        break;
      case _component.MODE.USERS:
        break;
      case _component.MODE.JOIN_USER:
        break;
      case _component.MODE.USER_INFO_EDIT:
        break;
      case _component.MODE.USER_INFO_SHOW:
        break;
      case _component.MODE.CONNECTIONS:
        break;*/
    }
  }
};

export default Switcher_core;