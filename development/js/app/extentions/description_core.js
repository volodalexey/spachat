define('description_core', [],
    function() {

        var description_core = function() {
        };

        description_core.prototype = {

            __class_name: "description_core",

            showDescription: function (event) {
                var _this = this;
                switch (event.type) {
                    case 'mousedown':case 'touchstart':
                    _this.checkReorderClientX = event.clientX;
                    if (event.type === 'touchstart' ) {
                        _this.checkReorderClientX = event.changedTouches[0].clientX;
                    }
                    _this.reorderMouseDown = true;
                    break;
                    case 'mousemove':case 'touchmove':
                    if (_this.reorderMouseDown) {

                        var clientX = event.clientX;
                        if (event.type === 'touchmove' && event.changedTouches) {
                            clientX = event.changedTouches[0].clientX;
                        }
                        if (Math.abs(_this.checkReorderClientX - clientX) > 5) {
                            _this.descriptionShow = true;
                            if (event.target.dataset.description ||
                                ( event.changedTouches && event.changedTouches[0].target.dataset.description) ){
                                var offsetLeft = 0, offsetTop = 0, element;
                                if (event.type === 'touchmove' && event.changedTouches) {
                                    _this.chat.button_description.innerHTML = event.changedTouches[0].target.dataset.description;
                                    element = event.changedTouches[0].target;

                                } else {
                                    _this.chat.button_description.innerHTML = event.target.dataset.description;
                                    element = event.target;
                                }
                                do {
                                    offsetLeft += element.offsetLeft;
                                    offsetTop  += element.offsetTop;
                                } while (element = element.offsetParent);



                                this.chat.button_description.style.left = offsetLeft  + "px";
                                this.chat.button_description.style.top = offsetTop + "px";
                                this.chat.button_description.classList.remove("opacity-0");

                                var difference, offsetLeftElementEnd, offsetTopElementEnd;
                                offsetLeftElementEnd = this.chat.button_description.offsetWidth + this.chat.button_description.offsetLeft;
                                offsetTopElementEnd = this.chat.button_description.offsetHeight + this.chat.button_description.offsetTop;

                                if (this.chat.button_description.offsetWidth > document.body.offsetWidth) {
                                    difference = this.chat.button_description.offsetWidth - document.body.offsetWidth;
                                    if (difference <= this.chat.button_description.offsetLeft) {
                                        this.chat.button_description.style.left = "0px";
                                    }
                                }
                                if (offsetLeftElementEnd > document.body.offsetWidth){
                                    difference = offsetLeftElementEnd - document.body.offsetWidth;
                                    if (difference <= this.chat.button_description.offsetLeft) {
                                        this.chat.button_description.style.left = this.chat.button_description.offsetLeft - difference  + "px";
                                    } else{
                                        this.chat.button_description.style.left = "0px";
                                    }
                                }

                                if(offsetTopElementEnd > document.documentElement.clientHeight) {
                                    difference = offsetTopElementEnd - document.documentElement.clientHeight;
                                    if (difference <= this.chat.button_description.offsetTop) {
                                        this.chat.button_description.style.top = offsetTop - difference + "px";
                                    } else {
                                        this.chat.button_description.style.top = "0px";
                                    }
                                }

                                if (this.chat.button_description.offsetTop < 0 ) {
                                    this.chat.button_description.style.top = "0px";
                                }
                            }
                        }
                    }
                    break;
                    case 'mouseup':case 'touchend':
                        _this.reorderMouseDown = false;
                        if (_this.descriptionShow) {
                            _this.chat.button_description.innerHTML = "";
                            this.chat.button_description.style.left = "0px";
                            this.chat.button_description.style.top = "0px";
                            this.chat.button_description.classList.add("opacity-0");

                        }
                    break;
                }
            }
        };
        return description_core;
    });
