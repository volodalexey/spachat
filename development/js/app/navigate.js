define ('navigate', [
        'editor',
        'panel',
        'overlay',
        'header',
        'text!../html/chat_template.html',
        'text!../html/header_template.html'
    ],
    function(
        editor,
        panel,
        overlay,
        header,
        chat_template,
        header_template
    ){

    var navigate = function() {};

    navigate.prototype = {

        initialize: function(){
            var _this = this;
            overlay.initialize();
            var addChat = document.querySelector('button[data-action="addChat"]');
            if(addChat){
                addChat.addEventListener('click', _this.addNewChat.bind(_this), false);
            }

            var clearStory = document.querySelector('[data-action="btnClearListMessage"]');
            if(clearStory){
                clearStory.addEventListener('click', _this.clearStory.bind(_this), false);
            }
            _this.waiter_outer_container = document.querySelector('[data-role="waiter_outer_container"]');


            _this.chat_template = _.template(chat_template);
            _this.header_template = _.template(header_template);
            _this.arrayChats = [];
            window.onresize = function(){
                _this.resizeChat();
                panel.resizePanel();
            };
            _this.addNewChat();
            panel.initialize();


            overlay.toggleWaiter(true);
            return _this;
        },

        addNewChat: function(){
            var _this = this, newEditor = new editor(), newHeader = new header();

            _this.mainConteiner = document.querySelector('[data-role="main_container"]');
            if(! _this.mainConteiner){
               return;
            }
            newEditor.sendRequest('/mock/header_navbar_config.json', function(err, res) {
                if (err) {
                    console.log("Error");
                } else {
                    _this.header_navbar_config = JSON.parse(res);

                    var newChat = document.createElement('div');
                    newChat.className = "modal";
                    newChat.innerHTML = _this.header_template({
                        header_btn: _this.header_navbar_config
                    });
                    newChat.innerHTML += _this.chat_template({

                    });
                    _this.mainConteiner.appendChild(newChat);

                    _this.messages_container_Array = document.querySelectorAll('[data-role="messages_container"]');

                    _this.fillListMessage();
                    newEditor.initialize(newChat);
                    newHeader.initialize(newChat,  _this.chat_template);

                    _this.arrayChats.push(newEditor);
                }
            });
        },

        resizeChat:function(){
            var _this = this;
            _.each(_this.arrayChats, function(chat){
                chat.calcMessagesContainerHeight();
            })
        },

        clearStory: function(){
            var _this = this;
            localStorage.clear();
            _.each(_this.messages_container_Array , function(messages_container){
                messages_container.innerHTML = "";
            })
        },

        fillListMessage: function(){
            var _this = this;
            if(_this.messages_container_Array){
                for (var i = 0; i < localStorage.length; i++) {
                    var newMessage = document.createElement('div');
                    var key = localStorage.key(i);
                    newMessage.innerHTML = localStorage.getItem(key);
                    _.each(_this.messages_container_Array , function(messages_container){
                        messages_container.appendChild(newMessage);
                    })
                }
            }
        }

    }
    return new navigate().initialize();
});