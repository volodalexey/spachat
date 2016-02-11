var Switcher_core = function() {
};

Switcher_core.prototype = {

  __class_name: "switcher_core",

  optionsDefinition(state, mode){
    var currentOptions = {};
    switch (mode) {
      case "CHATS":
        currentOptions['paginationOptions'] = state.chats_PaginationOptions;
        currentOptions['goToOptions'] = state.chats_GoToOptions;
        currentOptions['filterOptions'] = state.chats_FilterOptions;
        currentOptions['listOptions'] = state.chats_ListOptions;
        break;
      case "USERS":
        currentOptions['paginationOptions'] = state.users_PaginationOptions;
        currentOptions['goToOptions'] = state.users_GoToOptions;
        currentOptions['filterOptions'] = state.users_FilterOptions;
        currentOptions['listOptions'] = state.users_ListOptions;
        break;
      case "MESSAGES":
        currentOptions['paginationOptions'] = state.messages_PaginationOptions;
        currentOptions['goToOptions'] = state.contactList_GoToOptions;
        currentOptions['filterOptions'] = state.messages_FilterOptions;
        currentOptions['listOptions'] = state.messages_ListOptions;
        break;
      case "CONTACT_LIST":
        currentOptions['paginationOptions'] = state.contactList_PaginationOptions;
        currentOptions['goToOptions'] = state.contactList_PaginationOptions;
        currentOptions['filterOptions'] = state.contactList_FilterOptions;
        currentOptions['listOptions'] = state.contactList_ListOptions;
        break;
      case "LOGGER":
        currentOptions['paginationOptions'] = state.logger_PaginationOptions;
        currentOptions['goToOptions'] = state.logger_GoToOptions;
        currentOptions['filterOptions'] = state.logger_PaginationOptions;
        currentOptions['listOptions'] = state.logger_ListOptions;
        break;
    }
    return currentOptions;
  },

  tableDefinition: function(mode) {
    let table_name;
    switch (mode) {
      case "MESSAGES":
        table_name = ['messages'];
        break;
      case "LOGGER":
        table_name = ['log_messages'];
        break;
    }
    return table_name;
  }

};

export default Switcher_core;