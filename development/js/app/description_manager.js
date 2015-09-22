define('description_manager', [
        'dom_core',
        'extend_core',
        'throw_event_core'
    ],
    function(dom_core,
             extend_core,
             throw_event_core) {

        var Description_manager = function() {
            this.bindContexts();
        };

        Description_manager.prototype = {

            cashElements: function() {
                var _this = this;
                _this.button_description = document.querySelector('[data-role="description"]');
            },

            unCashElements: function() {
                var _this = this;
                _this.button_description = null;
            },

            bindContexts: function() {
                var _this = this;
                _this.bindedShowDescription = _this.showDescription.bind(_this);
            },

            unbindContexts: function() {
                var _this = this;
                _this.bindedShowDescription = null;
            },

            addEventListeners: function() {
                var _this = this;
                _this.removeEventListeners();
                _this.addRemoveListener('add', document.body, 'mousedown', _this.bindedShowDescription, false);
                _this.addRemoveListener('add', document.body, 'mousemove', _this.bindedShowDescription, false);
                _this.addRemoveListener('add', document.body, 'touchend', _this.bindedShowDescription, true);
                _this.addRemoveListener('add', document.body, 'touchmove', _this.bindedShowDescription, false);
                _this.addRemoveListener('add', document.body, 'touchstart', _this.bindedShowDescription, false);
                _this.addRemoveListener('add', document.body, 'click', _this.bindedShowDescription, true);
                _this.addRemoveListener('add', document.body, 'mouseup', _this.bindedShowDescription, true);
            },

            removeEventListeners: function() {
                var _this = this;
                _this.addRemoveListener('remove', document.body, 'mousedown', _this.bindedShowDescription, false);
                _this.addRemoveListener('remove', document.body, 'mousemove', _this.bindedShowDescription, false);
                _this.addRemoveListener('remove', document.body, 'touchend', _this.bindedShowDescription, true);
                _this.addRemoveListener('remove', document.body, 'touchmove', _this.bindedShowDescription, false);
                _this.addRemoveListener('remove', document.body, 'touchstart', _this.bindedShowDescription, false);
                _this.addRemoveListener('remove', document.body, 'click', _this.bindedShowDescription, true);
                _this.addRemoveListener('remove', document.body, 'mouseup', _this.bindedShowDescription, true);
            },

            showDescription: function(event) {
                var _this = this, description = _this.button_description, element;
                switch (event.type) {
                    case 'mousedown':
                    case 'touchstart':
                        if (event.type === 'touchstart' && event.changedTouches) {
                            element = _this.getDataParameter(event.changedTouches[0].target, 'description');
                        } else {
                            element = _this.getDataParameter(event.target, 'description');
                        }
                        if (element && element.dataset.description) {
                            _this.curDescriptionElement = element;
                            _this.checkReorderClientX = event.clientX;
                            _this.checkReorderClientY = event.clientY;
                            if (event.type === 'touchstart') {
                                _this.checkReorderClientX = event.changedTouches[0].clientX;
                                _this.checkReorderClientY = event.changedTouches[0].clientY;
                            }
                        }
                        break;
                    case 'mousemove':
                    case 'touchmove':
                        if (_this.curDescriptionElement) {
                            element = _this.curDescriptionElement;
                            var clientX = event.clientX;
                            var clientY = event.clientY;
                            if (event.type === 'touchmove' && event.changedTouches) {
                                clientX = event.changedTouches[0].clientX;
                                clientY = event.changedTouches[0].clientY;
                            }
                            var radius = 5;
                            var deltaX = Math.abs(_this.checkReorderClientX - clientX);
                            var deltaY = Math.abs(_this.checkReorderClientY - clientY);
                            var current_radius = Math.sqrt(Math.pow(deltaX, 2) + Math.pow(deltaY, 2));
                            if (current_radius > radius && !_this.descriptionShow) {
                                _this.descriptionShow = true;
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
                                            checkLeft = result.offsetLeft - description.offsetWidth;
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
                                            if (documentWidth > result.offsetLeft + description.offsetWidth) {
                                                futureLeft = result.offsetLeft;
                                                positionFound = true;
                                            } else {
                                                if (documentWidth > description.offsetWidth) {
                                                    futureLeft = 0;
                                                    positionFound = true;
                                                } else {
                                                    // not found
                                                    futureLeft = result.offsetLeft + element.offsetWidth / 2 - description.offsetWidth / 2;
                                                }
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
                        break;
                    case 'click':
                        if (event.target !== description) {
                            _this.releaseDescription(event, description, true);
                        }
                        _this.curDescriptionElement = null;
                        break;
                    case 'touchend':
                        var target = document.elementFromPoint(event.changedTouches[0].clientX, event.changedTouches[0].clientY);
                        if (target !== description) {
                            _this.releaseDescription(event, description, true);
                        }
                        _this.curDescriptionElement = null;
                        break;
                    case 'mouseup':
                        //if (_this.curDescriptionElement &&
                        //    _this.curDescriptionElement !== event.target &&
                        //    description !== event.target) {
                        //    _this.releaseDescription(event, description);
                        //}
                        //_this.curDescriptionElement = null;
                        var target = document.elementFromPoint(event.clientX, event.clientY);
                        if (target !== description) {
                            _this.releaseDescription(event, description, true);
                        }
                        _this.curDescriptionElement = null;
                        break;
                }
            },

            releaseDescription: function(event, description, prevent) {
                var _this = this;
                if (_this.descriptionShow) {
                    if (prevent) {
                        if (event.cancelable) {
                            event.preventDefault();
                        }
                        event.stopPropagation();
                    }
                    _this.descriptionShow = false;
                    description.innerHTML = "";
                    description.style.left = "0px";
                    description.style.top = "0px";
                    description.classList.add("opacity-0");
                }

            },

            destroy: function() {
                var _this = this;
                _this.curDescriptionElement = null;
                _this.removeEventListeners();
                _this.unCashElements();
                _this.unbindContexts();
            }
        };
        extend_core.prototype.inherit(Description_manager, dom_core);
        extend_core.prototype.inherit(Description_manager, throw_event_core);

        return new Description_manager();
    });
