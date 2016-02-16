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
      case "CREATE_CHAT":
        currentOptions['paginationOptions'] = state.createChat_PaginationOptions;
        currentOptions['goToOptions'] = state.createChat_GoToOptions;
        currentOptions['filterOptions'] = state.createChat_FilterOptions;
        break;
      case "JOIN_CHAT":
        currentOptions['paginationOptions'] = state.joinChat_PaginationOptions;
        currentOptions['goToOptions'] = state.joinChat_GoToOptions;
        currentOptions['filterOptions'] = state.joinChat_FilterOptions;
        break;
      case "BLOGS":
        currentOptions['paginationOptions'] = state.blogs_PaginationOptions;
        currentOptions['goToOptions'] = state.blogs_GoToOptions;
        currentOptions['filterOptions'] = state.blogs_FilterOptions;
        currentOptions['listOptions'] = state.blogs_ListOptions;
        break;
      case "CREATE_BLOG":
        currentOptions['paginationOptions'] = state.createBlog_PaginationOptions;
        currentOptions['goToOptions'] = state.createBlog_GoToOptions;
        currentOptions['filterOptions'] = state.createBlog_FilterOptions;
        break;
      case "JOIN_BLOG":
        currentOptions['paginationOptions'] = state.joinBlog_PaginationOptions;
        currentOptions['goToOptions'] = state.joinBlog_GoToOptions;
        currentOptions['filterOptions'] = state.joinBlog_FilterOptions;
        break;
      case "USERS":
        currentOptions['paginationOptions'] = state.users_PaginationOptions;
        currentOptions['goToOptions'] = state.users_GoToOptions;
        currentOptions['filterOptions'] = state.users_FilterOptions;
        currentOptions['listOptions'] = state.users_ListOptions;
        break;
      case "JOIN_USER":
        currentOptions['paginationOptions'] = state.joinUser_PaginationOptions;
        currentOptions['goToOptions'] = state.joinUser_GoToOptions;
        currentOptions['filterOptions'] = state.joinUser_FilterOptions;
        currentOptions['listOptions'] = state.joinUser_ListOptions;
        break;
      case "USER_INFO_EDIT":
        currentOptions['paginationOptions'] = state.userInfoEdit_PaginationOptions;
        currentOptions['goToOptions'] = state.userInfoEdit_GoToOptions;
        currentOptions['filterOptions'] = state.userInfoEdit_FilterOptions;
        break;
      case "USER_INFO_SHOW":
        currentOptions['paginationOptions'] = state.userInfoShow_PaginationOptions;
        currentOptions['goToOptions'] = state.userInfoShow_GoToOptions;
        currentOptions['filterOptions'] = state.userInfoShow_FilterOptions;
        break;
      case "CONNECTIONS":
        currentOptions['paginationOptions'] = state.connections_PaginationOptions;
        currentOptions['goToOptions'] = state.connections_GoToOptions;
        currentOptions['filterOptions'] = state.connections_GoToOptions;
        currentOptions['listOptions'] = state.connections_ListOptions;
        break;
      case "MESSAGES":
        currentOptions['paginationOptions'] = state.messages_PaginationOptions;
        currentOptions['goToOptions'] = state.messages_GoToOptions;
        currentOptions['filterOptions'] = state.messages_FilterOptions;
        currentOptions['listOptions'] = state.messages_ListOptions;
        break;
      case "CONTACT_LIST":
        currentOptions['paginationOptions'] = state.contactList_PaginationOptions;
        currentOptions['goToOptions'] = state.contactList_GoToOptions;
        currentOptions['filterOptions'] = state.contactList_FilterOptions;
        currentOptions['listOptions'] = state.contactList_ListOptions;
        break;
      case "LOGGER":
        currentOptions['paginationOptions'] = state.logger_PaginationOptions;
        currentOptions['goToOptions'] = state.logger_GoToOptions;
        currentOptions['filterOptions'] = state.logger_PaginationOptions;
        currentOptions['listOptions'] = state.logger_ListOptions;
        break;
      case "SETTINGS":
        currentOptions['paginationOptions'] = state.settings_PaginationOptions;
        currentOptions['goToOptions'] = state.settings_GoToOptions;
        currentOptions['filterOptions'] = state.settings_FilterOptions;
        currentOptions['listOptions'] = state.settings_ListOptions;
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