define ('navigate', [
        'chat',
        'panel',
        'overlay',
        'header'
    ],
    function(
        chat,
        panel,
        overlay,
        header
    ){

    var navigate = function() {};

    navigate.prototype = {


        initialize: function(){
            var _this = this;
            _this.renderWaiter();


            panel.initialize();
            _this.toggleWaiter(true);
            window.onresize = function(){
                panel.resizePanel();
                //chat.resizeChat();
            };
            panel.on('clearStory', _this.clearStory.bind(_this), _this);
            _this.messages_container_Array = document.querySelectorAll('[data-role="messages_container"]');
            /*
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

            overlay.toggleWaiter(true);*/
            return _this;
        },

        addNewChat: function(){
            var _this = this, newChat = new chat(), newHeader = new header();

            _this.mainConteiner = document.querySelector('[data-role="main_container"]');
            if(! _this.mainConteiner){
               return;
            }
            newChat.sendRequest('/mock/header_navbar_config.json', function(err, res) {
                if (err) {

                    console.log("Error");
                } else {
                    _this.header_navbar_config = JSON.parse(res);

                    var newChatElem = document.createElement('div');
                    newChatElem.className = "modal";
                    newChatElem.innerHTML = _this.header_template({
                        header_btn: _this.header_navbar_config
                    });
                    newChatElem.innerHTML += _this.chat_template({

                    });
                    _this.mainConteiner.appendChild(newChatElem);



                    _this.fillListMessage();
                    newChat.initialize(newChatElem);
                    newHeader.initialize(newChatElem,  _this.chat_template);

                    _this.arrayChats.push(newChatElem);
                }
            });
        },



        clearStory: function(){
            var _this = this;
            localStorage.clear();
            _.each(_this.messages_container_Array , function(messages_container){
                messages_container.innerHTML = "";
            })
        }



    }
        extend(navigate, overlay);

    return new navigate().initialize();
});