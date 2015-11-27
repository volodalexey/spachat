import React from 'react'

class Storage {

  defaultState() {
    return {
      panel: {
        left: {
          chats_GoToOptions: {
            show: false,
            rteChoicePage: true,
            mode_change: "rte",
            "chat": null
          },
          chats_PaginationOptions: {
            text: "chats",
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
            text: "chats",
            start: 0,
            last: null,
            previousStart: 0,
            previousFinal: 0,
            restore: false,
            data_download: false
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
          },

          listOptions: {
            start: 0,
            last: null,
            previousStart: 0,
            previousFinal: 0
          },
          bodyOptions: {
            show: true,
            mode: null
          }
        },
        right: {
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
          },

          listOptions: {
            start: 0,
            last: null,
            previousStart: 0,
            previousFinal: 0
          },
          bodyOptions: {
            show: true,
            mode: null
          }
        }
      }
    }
  }

  defineAction(dataset, dateParent) {
    console.log("defineAction", dataset, dateParent);
  }

}

export default new Storage();