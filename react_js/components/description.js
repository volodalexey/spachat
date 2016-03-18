import React from 'react'

import extend_core from '../js/extend_core.js'
import dom_core from '../js/dom_core.js'

const Description = React.createClass({
  getInitialState: function() {
    return {
      left: '0px',
      top: '0px',
      show: false,
      content: ''
    }
  },

  componentDidMount: function() {
    this.descriptionContainer = document.querySelector('[data-role="description"]');
  },

  componentWillUnmount: function() {
    this.descriptionContainer = null;
  },

  showDescription: function(event) {
    let description = this.descriptionContainer, element, target;
    switch (event.type) {
      case 'mousedown':
      case 'touchstart':
        if (event.type === 'touchstart' && event.changedTouches) {
          element = this.getDataParameter(event.changedTouches[0].target, 'description');
        } else {
          element = this.getDataParameter(event.target, 'description');
        }
        if (element && element.dataset.description) {
          this.curDescriptionElement = element;
          this.checkReorderClientX = event.clientX;
          this.checkReorderClientY = event.clientY;
          if (event.type === 'touchstart') {
            this.checkReorderClientX = event.changedTouches[0].clientX;
            this.checkReorderClientY = event.changedTouches[0].clientY;
          }
        }
        break;
      case 'mousemove':
      case 'touchmove':
        if (this.curDescriptionElement) {
          element = this.curDescriptionElement;
          let clientX = event.clientX,
            clientY = event.clientY;
          if (event.type === 'touchmove' && event.changedTouches) {
            clientX = event.changedTouches[0].clientX;
            clientY = event.changedTouches[0].clientY;
          }
          let radius = 5,
            deltaX = Math.abs(this.checkReorderClientX - clientX),
            deltaY = Math.abs(this.checkReorderClientY - clientY),
            current_radius = Math.sqrt(Math.pow(deltaX, 2) + Math.pow(deltaY, 2));
          if (current_radius > radius && !this.descriptionShow) {
            event.stopPropagation();
            event.preventDefault();
            this.descriptionShow = true;
            description.innerHTML = element.dataset.description;
            let result = this.getOffset(element),
              positionFound = false, checkLeft, checkTop,
              futureTop = result.offsetTop - description.offsetHeight,
              futureLeft = result.offsetLeft + element.offsetWidth / 2 - description.offsetWidth / 2,
              futureRight = result.offsetLeft + element.offsetWidth / 2 + description.offsetWidth / 2,
              documentHeight = document.documentElement.clientHeight,
              documentWidth = document.body.offsetWidth,
              documentTop = document.body.offsetTop,
              documentLeft = document.body.offsetLeft;

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
            this.setState({
              left: futureLeft + "px",
              top: futureTop + "px",
              show: true,
              content: description.innerHTML
            });
          }
        }
        break;
      case 'click':
        if (event.target !== description) {
          this.releaseDescription(event, description, true);
        }
        this.curDescriptionElement = null;
        break;
      case 'touchend':
        target = document.elementFromPoint(event.changedTouches[0].clientX, event.changedTouches[0].clientY);
        if (target !== description) {
          this.releaseDescription(event, description, true);
        }
        this.curDescriptionElement = null;
        break;
      case 'mouseup':
        target = document.elementFromPoint(event.clientX, event.clientY);
        if (target !== description) {
          this.releaseDescription(event, description, true);
        }
        this.curDescriptionElement = null;
        break;
    }
  },

  releaseDescription: function(event, description, prevent) {
    if (this.descriptionShow) {
      if (prevent) {
        if (event.cancelable) {
          event.preventDefault();
        }
        event.stopPropagation();
      }
      this.descriptionShow = false;
      this.setState({
        left: "0px",
        top: "0px",
        show: false,
        content: ""
      });

    }
  },

  render: function() {
    let className = this.state.opacity_0 ? "description opacity-0" : "description";
    return (
      <div data-role="description" className={className}
           style={{left: this.state.left, top: this.state.top}}>{this.state.content}</div>
    )
  }
});
extend_core.prototype.inherit(Description, dom_core);

export default Description;