define ('navigate', [
        'chat',
        'panel',
        'overlay_core'
    ],
    function(
        chat,
        panel,
        overlay_core
    ){

    var navigate = function() {};

    navigate.prototype = {

        initialize: function(){
            var _this = this;
            _this.addEventListeners();
            panel.initialize();
            _this.toggleWaiter(true);
            _this.chatsArray =[];
            _this.messages_container_Array = document.querySelectorAll('[data-role="messages_container"]');
            //_this.addNewChat();
            return _this;
        },

        addEventListeners: function(){
            var _this = this;
            _this.removeEventListeners();
            window.addEventListener('resize',  _this.onresizeWindow.bind(_this), false);
            panel.on('clearStory', _this.clearStory.bind(_this), _this);
            panel.on('addNewChat', _this.addNewChat.bind(_this), _this);
        },

        removeEventListeners: function(){
            var _this = this;
            window.removeEventListener('resize',  _this.onresizeWindow.bind(_this), false);
            panel.off('clearStory');
            panel.off('addNewChat');
        },

        onresizeWindow: function(){
            var _this = this;
            panel.resizePanel();
            _this.chatsArray.forEach(function(chat){
                //chat.calcMessagesContainerHeight();
            });
        },

        addNewChat: function(){
            var _this = this, newChat = new chat();
            _this.mainConteiner = document.querySelector('[data-role="main_container"]');
            if(! _this.mainConteiner){
                return;
            }
            var newChatElem = document.createElement('div');
            newChat.initialize(newChatElem, _this.mainConteiner);
            _this.chatsArray.push(newChatElem);
        },

        clearStory: function(){
            var _this = this;
            localStorage.clear();
            _.each(_this.chatsArray , function(chat){
               chat.querySelector('[data-role="messages_container"]').innerHTML = "";
            })
        }

    }
        extend(navigate, overlay_core);

    return new navigate().initialize();
});