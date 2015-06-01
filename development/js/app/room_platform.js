define('room_platform', [
        'chat',

        'overlay_core',
        'event_core',
        'template_core',

        'text!../html/room_platform_template.html'
    ],
    function(chat,

             overlay_core,
             event_core,
             template_core,

             room_platform_template) {

        var room_platform = function() {
            this.link = /chat/;
            this.withPanels = true;
            this.mainConteiner = document.querySelector('[data-role="main_container"]');
        };

        room_platform.prototype = {

            collectionDescription: {
                "db_name": 'rooms',
                "table_name": 'rooms',
                "db_version": 1,
                "keyPath": "roomId"
            },

            render: function() {
                var _this = this;
                if (!_this.mainConteiner) {
                    return;
                }
                _this.mainConteiner.innerHTML = _this.room_platform_template({});
                _this.cashElements();
                _this.addEventListeners();
                _this.toggleWaiter();
            },

            dispose: function() {
                var _this = this;
                _this.removeEventListeners();
            },

            cashElements: function() {
                var _this = this;
                _this.room_wrapper = _this.mainConteiner.querySelector('[data-role="room_wrapper"]');
            },

            addEventListeners: function() {
                var _this = this;
                _this.removeEventListeners();
                _this.on('addNewRoom', _this.addNewRoom, _this);
                _this.on('resize', _this.resizeRooms, _this);
            },

            removeEventListeners: function() {
                var _this = this;
                _this.off('addNewRoom');
                _this.off('resize');
            },

            resizeRooms: function() {
                chat.prototype.chatsArray.forEach(function(_chat) {
                    _chat.calcMessagesContainerHeight();
                });
            },

            addNewRoom: function() {
                var _this = this;
                if (!_this.mainConteiner) {
                    return;
                }
                var newChat = new chat();
                var newChatElem = document.createElement('div');
                chat.prototype.chatsArray.push(newChat);
                newChat.initialize(newChatElem, _this.room_wrapper);
            }

        };
        extend(room_platform, overlay_core);
        extend(room_platform, event_core);
        extend(room_platform, template_core);

        room_platform.prototype.room_platform_template = room_platform.prototype.template(room_platform_template);

        return new room_platform();
    });