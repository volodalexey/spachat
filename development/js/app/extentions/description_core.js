define('description_core', [],
    function() {

        var description_core = function() {
        };

        description_core.prototype = {

            __class_name: "description_core",

            showDescription: function (event) {
                var _this = this;
                console.log(event.type);

                switch (event.type) {
                    case 'mousedown':case 'touchstart':
                    _this.checkReorderClientX = event.clientX;
                    if (event.type === 'touchstart' && event.originalEvent.changedTouches) {
                        _this.checkReorderClientX = event.originalEvent.changedTouches[0].clientX;
                    }
                    _this.reorderMouseDown = true;
                    break;
                    case 'mousemove':case 'touchmove':
                    if (_this.reorderMouseDown) {

                        var clientX = event.clientX;
                        if (event.type === 'touchmove' && event.originalEvent.changedTouches) {
                            clientX = event.originalEvent.changedTouches[0].clientX;
                        }
                        if (Math.abs(_this.checkReorderClientX - clientX) > 5) {
                            _this.descriptionShow = true;
                            _this.chat.buttom_description.innerHTML = "1111111111111111111111111111111111111111111111111111111111111111111";
                            this.chat.buttom_description.style.left = "500px";
                            this.chat.buttom_description.style.top = "500px";

                            if (!_this.reorderClientX) {
                                _this.reorderClientX = clientX;

                            } else {
                                var deltaX = clientX - _this.reorderClientX;
                                //this.reorderCloneElement.style.left = (this.reorderCloneElement.offsetLeft + deltaX) + 'px';
                                _this.reorderClientX = clientX;
                            }
                        }
                    }
                    break;
                    case 'mouseup':case 'touchend':
                    if (_this.reorderMouseDown) {
                        console.log('SWOH DESCRIPTION');
                        //_this.chat.buttom_description.innerHTML = "22222222222222222222222222222222222222222222222222222222222222222";
                        if (_this.descriptionShow = true) {
                            _this.chat.buttom_description.innerHTML = "";

                        }
                    }
                    break;
                }
            }
        };
        return description_core;
    });
