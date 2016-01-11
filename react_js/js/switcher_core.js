var Switcher_core = function() {
};

Switcher_core.prototype = {

  __class_name: "switcher_core",

  optionsDefinition(state, mode){
    var currentOptions = {};
    switch (mode) {
      case "CHATS":
        currentOptions['paginationOptions'] = state.chats_PaginationOptions;
        break;
      case "USERS":
        currentOptions['paginationOptions'] = state.users_PaginationOptions;
        break;
      case "MESSAGES":
        currentOptions['paginationOptions'] = state.messages_PaginationOptions;
        currentOptions['filterOptions'] = state.messages_FilterOptions;
        break;
      case "CONTACT_LIST":
        currentOptions['paginationOptions'] = state.contactList_PaginationOptions;
        currentOptions['filterOptions'] = state.contactList_FilterOptions;
        break;
      case "LOGGER":
        currentOptions['paginationOptions'] = state.logger_PaginationOptions;
        currentOptions['filterOptions'] = state.logger_PaginationOptions;
        break;
    }
    return currentOptions;
  }
};

export default Switcher_core;