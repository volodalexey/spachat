define('description_core', [
        'dom_core',
        'extend_core'],
    function(dom_core,
             extend_core) {

        var description_core = function() {
        };

        description_core.prototype = {

            __class_name: "description_core",

            showDescription: function(button_description, event) {
                var _this = this, description = button_description;
                switch (event.type) {
                    case 'mousedown':
                    case 'touchstart':
                        _this.checkReorderClientX = event.clientX;
                        if (event.type === 'touchstart') {
                            _this.checkReorderClientX = event.changedTouches[0].clientX;
                        }
                        _this.reorderMouseDown = true;

                        break;
                    case 'mousemove':
                    case 'touchmove':
                        if (_this.reorderMouseDown) {
                            //event.preventDefault();
                            var clientX = event.clientX;
                            if (event.type === 'touchmove' && event.changedTouches) {
                                clientX = event.changedTouches[0].clientX;
                            }
                            if (Math.abs(_this.checkReorderClientX - clientX) > 5 && !_this.descriptionShow) {
                                _this.descriptionShow = true;
                                var element;
                                if (event.type === 'touchmove' && event.changedTouches) {
                                    element = _this.getDataParameter(event.changedTouches[0].target, 'description');
                                } else {
                                    element = _this.getDataParameter(event.target, 'description');
                                }
                                if (element && element.dataset.description) {
                                    description.innerHTML = element.dataset.description;
                                    var result = _this.getOffset(element);
                                    var positionFound = false, checkLeft, checkTop;
                                    var futureTop = result.offsetTop - description.offsetHeight;
                                    var futureLeft = result.offsetLeft + element.offsetWidth / 2 - description.offsetWidth / 2;
                                    var futureRight = result.offsetLeft + element.offsetWidth / 2 + description.offsetWidth / 2;
                                    var documentHeight = document.documentElement.clientHeight;
                                    var documentWidth = document.body.offsetWidth;
                                    var documentTop = document.body.offsetTop;
                                    var documentLeft = document.body.offsetLeft;

                                    // if we have enough place on top of current target
                                    if (documentTop < futureTop) {
                                        checkLeft = futureLeft;
                                        if (documentLeft < checkLeft) {
                                            if (checkLeft + description.offsetWidth < documentWidth) {
                                                futureLeft = checkLeft;
                                                positionFound = true;
                                            } else {
                                                // not found
                                            }
                                        }

                                        if (result.offsetLeft + element.offsetWidth / 2 > documentWidth / 2) {
                                            if (!positionFound) {
                                                checkLeft = documentWidth - 5 - element.offsetWidth;
                                                if (documentLeft < checkLeft) {
                                                    if (checkLeft + description.offsetWidth < documentWidth) {
                                                        futureLeft = checkLeft;
                                                        positionFound = true;
                                                    } else {
                                                        // not found
                                                    }
                                                }
                                            }

                                            if (!positionFound) {
                                                checkLeft = documentLeft + 5;
                                                if (checkLeft + description.offsetWidth < documentWidth) {
                                                    if (documentLeft < checkLeft) {
                                                        futureLeft = checkLeft;
                                                        positionFound = true;
                                                    } else {
                                                        // not found
                                                    }
                                                }
                                            }
                                        } else {
                                            if (!positionFound) {
                                                checkLeft = documentLeft + 5;
                                                if (checkLeft + description.offsetWidth < documentWidth) {
                                                    if (documentLeft < checkLeft) {
                                                        futureLeft = checkLeft;
                                                        positionFound = true;
                                                    } else {
                                                        // not found
                                                    }
                                                }
                                            }

                                            if (!positionFound) {
                                                checkLeft = documentWidth - 5 - description.offsetHeight;
                                                if (documentLeft < checkLeft) {
                                                    if (checkLeft + description.offsetWidth < documentWidth) {
                                                        futureLeft = checkLeft;
                                                        positionFound = true;
                                                    } else {
                                                        // not found
                                                    }
                                                }
                                            }
                                        }
                                    }

                                    // if we have enough place on the left of current target
                                    if (!positionFound) {
                                        futureLeft = result.offsetLeft - description.offsetWidth;
                                        futureTop = result.offsetTop + element.offsetHeight / 2 - description.offsetHeight / 2;
                                        if (documentLeft < futureLeft) {
                                            checkTop = futureTop;
                                            if (documentTop < checkTop) {
                                                if (checkTop + description.offsetHeight < documentHeight) {
                                                    futureTop = checkTop;
                                                    positionFound = true;
                                                } else {
                                                    // not found
                                                }
                                            }

                                            if (!positionFound) {
                                                checkTop = documentTop + 5;
                                                if (checkTop + description.offsetHeight < documentHeight) {
                                                    if (documentTop < checkTop) {
                                                        futureTop = checkTop;
                                                        positionFound = true;
                                                    } else {
                                                        // not found
                                                    }
                                                }
                                            }

                                            if (!positionFound) {
                                                checkTop = documentHeight - 5 - description.offsetHeight;
                                                if (documentTop < checkTop) {
                                                    if (checkTop + description.offsetHeight < documentHeight) {
                                                        futureTop = checkTop;
                                                        positionFound = true;
                                                    } else {
                                                        // not found
                                                    }
                                                }
                                            }
                                        }
                                    }

                                    // if we have enough place on the right of current target
                                    if (!positionFound) {
                                        futureRight = result.offsetLeft + element.offsetWidth + description.offsetWidth;
                                        futureLeft = result.offsetLeft + element.offsetWidth;
                                        futureTop = result.offsetTop + element.offsetHeight / 2 - description.offsetHeight / 2;
                                        if (documentWidth > futureRight) {
                                            checkTop = futureTop;
                                            if (documentTop < checkTop) {
                                                if (checkTop + description.offsetHeight < documentHeight) {
                                                    futureTop = checkTop;
                                                    positionFound = true;
                                                } else {
                                                    // not found
                                                }
                                            }

                                            if (!positionFound) {
                                                checkTop = result.offsetTop + 5;
                                                if (checkTop + description.offsetHeight < documentHeight) {
                                                    if (documentTop < checkTop) {
                                                        futureTop = checkTop;
                                                        positionFound = true;
                                                    } else {
                                                        // not found
                                                    }
                                                }
                                            }
                                        }
                                    }

                                    // if we have enough place on bottom of current target
                                    if (documentTop > result.offsetTop - description.offsetHeight) {
                                        if (!positionFound) {
                                            checkTop = result.offsetTop + element.offsetHeight;
                                            if (documentHeight > checkTop + description.offsetHeight) {
                                                futureTop = checkTop;
                                                if (documentWidth < result.offsetLeft + description.offsetWidth) {
                                                    futureLeft = 0;
                                                    positionFound = true;
                                                } else {
                                                    // not found
                                                    futureLeft = result.offsetLeft + element.offsetWidth / 2 - description.offsetWidth / 2;
                                                }
                                            }
                                        }
                                    }

                                    if (!positionFound) {
                                        futureLeft = 0;
                                        futureTop = result.offsetTop - description.offsetHeight;
                                    }
                                    description.style.left = futureLeft + "px";
                                    description.style.top = futureTop + "px";
                                    description.classList.remove("opacity-0");
                                }
                            }
                        }
                        break;
                    case 'mouseup':
                    case 'touchend':
                        _this.reorderMouseDown = false;
                        if (_this.descriptionShow) {
                            _this.descriptionShow = false;
                            description.innerHTML = "";
                            description.style.left = "0px";
                            description.style.top = "0px";
                            description.classList.add("opacity-0");

                        }
                        break;
                }
            },

            destroy: function() {
                var _this = this;
            }
        };
        extend_core.prototype.inherit(description_core, dom_core);

        return new description_core();
    });
