define ('panel', [],
    function() {

        var panel = function() {
        };

        panel.prototype = {

            initialize: function(){
                var _this = this;
                _this.leftPanel = document.querySelector('[data-action="leftPanel"]');
                _this.btnLeftPanel = _this.leftPanel.querySelector('[data-action="btnLeftPanel"]');
                _this.bodyLeftPanel = _this.leftPanel.querySelector('[data-role="body_left_panel"]');
                _this.btnLeftPanel.addEventListener('click', _this.workLeftPanel.bind(_this),  false);
                _this.leftPanel.style.left = - _this.leftPanel.offsetWidth + 'px';
                _this.leftPanel.style.maxWidth = window.innerWidth + 'px';
                _this.btnLeftPanel.style.left = _this.leftPanel.offsetWidth + 'px';


                _this.rightPanel = document.querySelector('[data-action="rightPanel"]');
                _this.btnRightPanel = _this.rightPanel.querySelector('[data-action="btnRightPanel"]');
                _this.bodyRightPanel = _this.rightPanel.querySelector('[data-role="body_right_panel"]');
                _this.rightPanel.style.right = - _this.rightPanel.offsetWidth + 'px';
                _this.rightPanel.style.maxWidth = window.innerWidth + 'px';
                _this.btnRightPanel.style.right = _this.rightPanel.offsetWidth + 'px';
                _this.btnRightPanel.addEventListener('click', _this.workRightPanel.bind(_this),  false);

                _this.leftPanel.classList.add("animate");
                _this.rightPanel.classList.add("animate");
                _this.bodyLeftPanel.classList.remove("hidden");
                _this.bodyRightPanel.classList.remove("hidden");

            },

            workLeftPanel: function (){
                var _this = this;
                if(_this.leftPanel.clientWidth +  _this.btnLeftPanel.clientWidth > document.body.clientWidth ){
                    if(_this.leftPanel.style.left !== '0px'){
                        _this.leftPanel.style.left = 0 + 'px';
                        _this.resizePanel();
                    } else {
                        _this.leftPanel.style.left = - _this.leftPanel.offsetWidth + 'px';
                        _this.btnLeftPanel.style.left = _this.leftPanel.offsetWidth + 'px';
                        _this.btnLeftPanel.classList.add("btnPanel");
                    }
                } else {
                    if(_this.leftPanel.style.left !== '0px'){
                        _this.leftPanel.style.left = 0 + 'px';
                    } else {
                        _this.leftPanel.style.left = - _this.leftPanel.offsetWidth + 'px';
                    }
                }

            },

            workRightPanel: function (){
                var _this = this;
/*                if(_this.rightPanel.style.right !== '0px'){
                    //_this.bodyRightPanel.classList.remove("hidden");
                    _this.rightPanel.style.right = 0 + 'px';
                } else {
                    _this.rightPanel.style.right = - _this.rightPanel.offsetWidth + 'px';
                }*/

                if(_this.rightPanel.clientWidth +  _this.btnRightPanel.clientWidth > document.body.clientWidth ){
                    if(_this.rightPanel.style.right !== '0px'){
                        _this.rightPanel.style.right = 0 + 'px';
                        _this.resizePanel();
                    } else {
                        _this.rightPanel.style.right = - _this.rightPanel.offsetWidth + 'px';
                        _this.btnRightPanel.style.right = _this.rightPanel.offsetWidth + 'px';
                        _this.btnRightPanel.classList.add("btnPanel");
                    }
                } else {
                    if(_this.rightPanel.style.right !== '0px'){
                        _this.rightPanel.style.right = 0 + 'px';
                    } else {
                        _this.rightPanel.style.right = - _this.rightPanel.offsetWidth + 'px';
                    }
                }

            },

            resizePanel:function(){
                var _this = this;
                if(_this.leftPanel.style.left === '0px' ){
                    var widthPanel = _this.leftPanel.clientWidth +  _this.btnLeftPanel.clientWidth ;
                    if(widthPanel > document.body.clientWidth ){
                        _this.btnLeftPanel.style.left = parseInt(_this.btnLeftPanel.style.left) -  _this.btnLeftPanel.clientWidth + 'px';
                        _this.btnLeftPanel.style.left = 0 + "px";
                        _this.btnLeftPanel.classList.remove("btnPanel");
                    }
                    else{
                        _this.btnLeftPanel.style.left = _this.leftPanel.offsetWidth + 'px';
                        _this.btnLeftPanel.classList.add("btnPanel");
                    }
                }


                if(_this.rightPanel.style.right === '0px' ){
                    var widthPanel = _this.rightPanel.clientWidth +  _this.btnRightPanel.clientWidth ;
                    if(widthPanel > document.body.clientWidth){
                        _this.btnRightPanel.style.right = _this.rightPanel.clientWidth -  _this.btnRightPanel.clientWidth + 'px';
                        _this.btnRightPanel.classList.remove("btnPanel");
                        _this.btnRightPanel.classList.add("floatR");
                    }
                    else{
                        _this.btnRightPanel.style.right = _this.rightPanel.offsetWidth + 'px';
                        _this.btnRightPanel.classList.add("btnPanel");
                    }
                }
            }
        }
return new panel();
});
