define('description_core', [],
    function() {

        var description_core = function() {
        };

        description_core.prototype = {

            __class_name: "description_core",

            showDescription: function (button_description, event) {
                var _this = this, description = button_description;
                switch (event.type) {
                    case 'mousedown':case 'touchstart':
                    _this.checkReorderClientX = event.clientX;
                    if (event.type === 'touchstart' ) {
                        _this.checkReorderClientX = event.changedTouches[0].clientX;
                    }
                    _this.reorderMouseDown = true;
                    event.preventDefault();
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
                                var element;
                                if (event.type === 'touchmove' && event.changedTouches) {
                                    description.innerHTML = event.changedTouches[0].target.dataset.description;
                                    element = event.changedTouches[0].target;

                                } else {
                                    description.innerHTML = event.target.dataset.description;
                                    element = event.target;
                                }

                                var result = _this.getOffset(element);
                                description.style.left = result.offsetLeft  + "px";
                                description.style.top = result.offsetTop + "px";
                                description.classList.remove("opacity-0");

                                var difference, offsetLeftElementEnd, offsetTopElementEnd;
                                offsetLeftElementEnd = description.offsetWidth + description.offsetLeft;
                                offsetTopElementEnd = description.offsetHeight + description.offsetTop;

                                if (description.offsetWidth > document.body.offsetWidth) {
                                    difference = description.offsetWidth - document.body.offsetWidth;
                                    if (difference <= description.offsetLeft) {
                                        description.style.left = "0px";
                                    }
                                }
                                if (offsetLeftElementEnd > document.body.offsetWidth){
                                    difference = offsetLeftElementEnd - document.body.offsetWidth;
                                    if (difference <= description.offsetLeft) {
                                        description.style.left = description.offsetLeft - difference  + "px";
                                    } else{
                                        description.style.left = "0px";
                                    }
                                }

                                if(offsetTopElementEnd > document.documentElement.clientHeight) {
                                    difference = offsetTopElementEnd - document.documentElement.clientHeight;
                                    if (difference <= description.offsetTop) {
                                        description.style.top = description.offsetTop - difference + "px";
                                    } else {
                                        description.style.top = "0px";
                                    }
                                }

                                if (description.offsetTop < 0 ) {
                                    description.style.top = "0px";
                                }
                            }
                        }
                    }
                    break;
                    case 'mouseup':case 'touchend':
                        _this.reorderMouseDown = false;
                        if (_this.descriptionShow) {
                            description.innerHTML = "";
                            description.style.left = "0px";
                            description.style.top = "0px";
                            description.classList.add("opacity-0");

                        }
                    break;
                }
            }
        };

        return new description_core();
    });
