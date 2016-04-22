/**
 * Jdenticon 1.3.2
 * http://jdenticon.com
 *
 * Built: 2015-10-10T11:55:57.451Z
 *
 * Copyright (c) 2014-2015 Daniel Mester Pirttijärvi
 *
 * This software is provided 'as-is', without any express or implied
 * warranty.  In no event will the authors be held liable for any damages
 * arising from the use of this software.
 *
 * Permission is granted to anyone to use this software for any purpose,
 * including commercial applications, and to alter it and redistribute it
 * freely, subject to the following restrictions:
 *
 * 1. The origin of this software must not be misrepresented; you must not
 *    claim that you wrote the original software. If you use this software
 *    in a product, an acknowledgment in the product documentation would be
 *    appreciated but is not required.
 *
 * 2. Altered source versions must be plainly marked as such, and must not be
 *    misrepresented as being the original software.
 *
 * 3. This notice may not be removed or altered from any source distribution.
 *
 */

var Jdenticon = function() {};

Jdenticon.prototype = {
  Point: function(x, y) {
    this.x = x;
    this.y = y;
  },

  decToHex: function(v) {
    v |= 0; // Ensure integer value
    return v < 0 ? "00" :
      v < 16 ? "0" + v.toString(16) :
        v < 256 ? v.toString(16) :
          "ff";
  },

  hueToRgb: function(m1, m2, h) {
    h = h < 0 ? h + 6 : h > 6 ? h - 6 : h;
    return this.decToHex(255 * (
        h < 1 ? m1 + (m2 - m1) * h :
          h < 3 ? m2 :
            h < 4 ? m1 + (m2 - m1) * (4 - h) :
              m1));
  },

  /**
   * Gets a set of identicon color candidates for a specified hue and config.
   */
  colorTheme: function(hue, config) {
    return [
      // Dark gray
      color.hsl(0, 0, config.grayscaleLightness(0)),
      // Mid color
      color.correctedHsl(hue, config.saturation, config.colorLightness(0.5)),
      // Light gray
      color.hsl(0, 0, config.grayscaleLightness(1)),
      // Light color
      color.correctedHsl(hue, config.saturation, config.colorLightness(1)),
      // Dark color
      color.correctedHsl(hue, config.saturation, config.colorLightness(0))
    ];
  },

  /**
   * Draws an identicon to a specified renderer.
   */
  iconGenerator: function(renderer, hash, x, y, size, padding, config, callback) {
    var undefined;

    // Calculate padding
    padding = (size * (padding === undefined ? 0.08 : padding)) | 0;
    size -= padding * 2;

    // Sizes smaller than 30 px are not supported. If really needed, apply a scaling transformation
    // to the context before passing it to this function.
    if (size < 30) {
      throw new Error("Jdenticon cannot render identicons smaller than 30 pixels.");
    }
    if (!/^[0-9a-f,-]{11,}$/i.test(hash)) {
      throw new Error("Invalid hash passed to Jdenticon.");
    }

    var graphics = new Graphics(renderer);

    // Calculate cell size and ensure it is an integer
    var cell = 0 | (size / 4);

    // Since the cell size is integer based, the actual icon will be slightly smaller than specified => center icon
    x += 0 | (padding + size / 2 - cell * 2);
    y += 0 | (padding + size / 2 - cell * 2);

    function renderShape(colorIndex, shapes, index, rotationIndex, positions) {
      var r = rotationIndex ? parseInt(hash.charAt(rotationIndex), 16) : 0,
        shape = shapes[parseInt(hash.charAt(index), 16) % shapes.length],
        i;

      renderer.beginShape(availableColors[selectedColorIndexes[colorIndex]]);

      for (i = 0; i < positions.length; i++) {
        graphics._transform = new Transform(x + positions[i][0] * cell, y + positions[i][1] * cell, cell, r++ % 4);
        shape(graphics, cell, i);
      }

      renderer.endShape();
    }

    // AVAILABLE COLORS
    var hue = parseInt(hash.substr(-4) + hash.substr(-8, 3), 16) / 0xfffffff,

    // Available colors for this icon
      availableColors = this.colorTheme(hue, config),

    // The index of the selected colors
      selectedColorIndexes = [],
      index;

    function isDuplicate(values) {
      if (values.indexOf(index) >= 0) {
        for (var i = 0; i < values.length; i++) {
          if (selectedColorIndexes.indexOf(values[i]) >= 0) {
            return true;
          }
        }
      }
    }

    for (var i = 0; i < 3; i++) {
      index = parseInt(hash.charAt(55 + i), 16) % availableColors.length;
      if (isDuplicate([0, 4]) || // Disallow dark gray and dark color combo
        isDuplicate([2, 3])) { // Disallow light gray and light color combo
        index = 1;
      }
      selectedColorIndexes.push(index);
    }

    // ACTUAL RENDERING
    // Sides
    renderShape(0, shapes.outer, 57, 3, [[1, 0], [2, 0], [2, 3], [1, 3], [0, 1], [3, 1], [3, 2], [0, 2]]);
    // Corners
    renderShape(1, shapes.outer, 58, 5, [[0, 0], [3, 0], [3, 3], [0, 3]]);
    // Center
    renderShape(2, shapes.center, 56, null, [[1, 1], [2, 1], [2, 2], [1, 2]]);
    var data_avatar = renderer._ctx.canvas.toDataURL();
    if (callback){
      callback (data_avatar);
    }
  },

  /**
   * Gets the normalized current Jdenticon color configuration. Missing fields have default values.
   */
  getCurrentConfig: function() {
    var configObject = this.jdenticon["config"] || global["jdenticon_config"] || {},
      lightnessConfig = configObject["lightness"] || {},
      saturation = configObject["saturation"];

    /**
     * Creates a lightness range.
     */
    function lightness(configName, defaultMin, defaultMax) {
      var range = lightnessConfig[configName] instanceof Array ? lightnessConfig[configName] : [defaultMin, defaultMax];

      /**
       * Gets a lightness relative the specified value in the specified lightness range.
       */
      return function(value) {
        value = range[0] + value * (range[1] - range[0]);
        return value < 0 ? 0 : value > 1 ? 1 : value;
      };
    }

    return {
      saturation: typeof saturation == "number" ? saturation : 0.5,
      colorLightness: lightness("color", 0.4, 0.8),
      grayscaleLightness: lightness("grayscale", 0.3, 0.9)
    }
  },

  /**
   * Updates the identicon in the specified canvas elements.
   * @param {string=} hash Optional hash to be rendered. If not specified, the hash specified by the data-jdenticon-hash is used.
   * @param {number=} padding Optional padding in percents. Extra padding might be added to center the rendered identicon.
   */
  update: function(el, hash, callback, padding) {
    if (typeof(el) === "string") {
      var element = document.createElement('canvas');
      element.setAttribute('width', canvas_element_width);
      element.setAttribute('height', canvas_element_height);
      this.update(element, hash, callback, padding);
      return;
    }
    if (!el || !el["tagName"]) {
      // No element found
      return;
    }
    hash = hash || el.getAttribute(HASH_ATTRIBUTE);
    if (!hash) {
      // No hash specified
      return;
    }

    var isCanvas = el["tagName"].toLowerCase() == "canvas";

    // Ensure we have a supported element
    if (!(isCanvas && "getContext" in el)) {
      return;
    }

    var width = Number(el.getAttribute("width")) || el.clientWidth || 0,
      height = Number(el.getAttribute("height")) || el.clientHeight || 0,
      renderer = new CanvasRenderer(el.getContext("2d"), width, height),
      size = Math.min(width, height);

    // Draw icon
     this.iconGenerator(renderer, hash, 0, 0, size, padding, this.getCurrentConfig(), callback);
  },

  jdenticon: function(hash, callback) {
    if (supportsQuerySelectorAll) {
      this.update("canvas[" + HASH_ATTRIBUTE + "]", hash, function(avatar_data) {
        if (callback){
          callback (avatar_data);
        }
      });
    }
  }
};

var Transform = function(x, y, size, rotation) {
  this._x = x;
  this._y = y;
  this._size = size;
  this._rotation = rotation;
};
Transform.prototype = {
  /**
   * Transforms the specified point based on the translation and rotation specification for this Transform.
   * @param {number} x x-coordinate
   * @param {number} y y-coordinate
   * @param {number=} w The width of the transformed rectangle. If greater than 0, this will ensure the returned point is of the upper left corner of the transformed rectangle.
   * @param {number=} h The height of the transformed rectangle. If greater than 0, this will ensure the returned point is of the upper left corner of the transformed rectangle.
   */
  transformPoint: function(x, y, w, h) {
    var right = this._x + this._size,
      bottom = this._y + this._size;
    return this._rotation === 1 ? new Jdenticon.prototype.Point(right - y - (h || 0), this._y + x) :
      this._rotation === 2 ? new Jdenticon.prototype.Point(right - x - (w || 0), bottom - y - (h || 0)) :
        this._rotation === 3 ? new Jdenticon.prototype.Point(this._x + y, bottom - x - (w || 0)) :
          new Jdenticon.prototype.Point(this._x + x, this._y + y);
  }
};
Transform.noTransform = new Transform(0, 0, 0, 0);

var Graphics = function(renderer) {
  this._renderer = renderer;
  this._transform = Transform.noTransform;
};
Graphics.prototype = {
  /**
   * Adds a polygon to the underlying renderer.
   * @param {Array} points The points of the polygon clockwise on the format [ x0, y0, x1, y1, ..., xn, yn ]
   * @param {boolean=} invert Specifies if the polygon will be inverted.
   */
  addPolygon: function(points, invert) {
    var di = invert ? -2 : 2,
      transform = this._transform,
      transformedPoints = [],
      i;

    for (i = invert ? points.length - 2 : 0; i < points.length && i >= 0; i += di) {
      transformedPoints.push(transform.transformPoint(points[i], points[i + 1]));
    }

    this._renderer.addPolygon(transformedPoints);
  },

  /**
   * Adds a polygon to the underlying renderer.
   * Source: http://stackoverflow.com/a/2173084
   * @param {number} x The x-coordinate of the upper left corner of the rectangle holding the entire ellipse.
   * @param {number} y The y-coordinate of the upper left corner of the rectangle holding the entire ellipse.
   * @param {number} size The size of the ellipse.
   * @param {boolean=} invert Specifies if the ellipse will be inverted.
   */
  addCircle: function(x, y, size, invert) {
    var p = this._transform.transformPoint(x, y, size, size);
    this._renderer.addCircle(p, size, invert);
  },

  /**
   * Adds a rectangle to the underlying renderer.
   * @param {number} x The x-coordinate of the upper left corner of the rectangle.
   * @param {number} y The y-coordinate of the upper left corner of the rectangle.
   * @param {number} w The width of the rectangle.
   * @param {number} h The height of the rectangle.
   * @param {boolean=} invert Specifies if the rectangle will be inverted.
   */
  addRectangle: function(x, y, w, h, invert) {
    this.addPolygon([
      x, y,
      x + w, y,
      x + w, y + h,
      x, y + h
    ], invert);
  },

  /**
   * Adds a right triangle to the underlying renderer.
   * @param {number} x The x-coordinate of the upper left corner of the rectangle holding the triangle.
   * @param {number} y The y-coordinate of the upper left corner of the rectangle holding the triangle.
   * @param {number} w The width of the triangle.
   * @param {number} h The height of the triangle.
   * @param {number} r The rotation of the triangle (clockwise). 0 = right corner of the triangle in the lower left corner of the bounding rectangle.
   * @param {boolean=} invert Specifies if the triangle will be inverted.
   */
  addTriangle: function(x, y, w, h, r, invert) {
    var points = [
      x + w, y,
      x + w, y + h,
      x, y + h,
      x, y
    ];
    points.splice(((r || 0) % 4) * 2, 2);
    this.addPolygon(points, invert);
  },

  /**
   * Adds a rhombus to the underlying renderer.
   * @param {number} x The x-coordinate of the upper left corner of the rectangle holding the rhombus.
   * @param {number} y The y-coordinate of the upper left corner of the rectangle holding the rhombus.
   * @param {number} w The width of the rhombus.
   * @param {number} h The height of the rhombus.
   * @param {boolean=} invert Specifies if the rhombus will be inverted.
   */
  addRhombus: function(x, y, w, h, invert) {
    this.addPolygon([
      x + w / 2, y,
      x + w, y + h / 2,
      x + w / 2, y + h,
      x, y + h / 2
    ], invert);
  }
};

var shapes = {
  center: [
    /** @param {Graphics} g */
      function(g, cell, index) {
      var k = cell * 0.42;
      g.addPolygon([
        0, 0,
        cell, 0,
        cell, cell - k * 2,
        cell - k, cell,
        0, cell
      ]);
    },
    /** @param {Graphics} g */
      function(g, cell, index) {
      var w = 0 | (cell * 0.5),
        h = 0 | (cell * 0.8);
      g.addTriangle(cell - w, 0, w, h, 2);
    },
    /** @param {Graphics} g */
      function(g, cell, index) {
      var s = 0 | (cell / 3);
      g.addRectangle(s, s, cell - s, cell - s);
    },
    /** @param {Graphics} g */
      function(g, cell, index) {
      var inner = 0 | (cell * 0.1),
        outer = 0 | (cell * 0.25);
      g.addRectangle(outer, outer, cell - inner - outer, cell - inner - outer);
    },
    /** @param {Graphics} g */
      function(g, cell, index) {
      var m = 0 | (cell * 0.15),
        s = 0 | (cell * 0.5);
      g.addCircle(cell - s - m, cell - s - m, s);
    },
    /** @param {Graphics} g */
      function(g, cell, index) {
      var inner = cell * 0.1,
        outer = inner * 4;

      g.addRectangle(0, 0, cell, cell);
      g.addPolygon([
        outer, outer,
        cell - inner, outer,
        outer + (cell - outer - inner) / 2, cell - inner
      ], true);
    },
    /** @param {Graphics} g */
      function(g, cell, index) {
      g.addPolygon([
        0, 0,
        cell, 0,
        cell, cell * 0.7,
        cell * 0.4, cell * 0.4,
        cell * 0.7, cell,
        0, cell
      ]);
    },
    /** @param {Graphics} g */
      function(g, cell, index) {
      g.addTriangle(cell / 2, cell / 2, cell / 2, cell / 2, 3);
    },
    /** @param {Graphics} g */
      function(g, cell, index) {
      g.addRectangle(0, 0, cell, cell / 2);
      g.addRectangle(0, cell / 2, cell / 2, cell / 2);
      g.addTriangle(cell / 2, cell / 2, cell / 2, cell / 2, 1);
    },
    /** @param {Graphics} g */
      function(g, cell, index) {
      var inner = 0 | (cell * 0.14),
        outer = 0 | (cell * 0.35);
      g.addRectangle(0, 0, cell, cell);
      g.addRectangle(outer, outer, cell - outer - inner, cell - outer - inner, true);
    },
    /** @param {Graphics} g */
      function(g, cell, index) {
      var inner = cell * 0.12,
        outer = inner * 3;

      g.addRectangle(0, 0, cell, cell);
      g.addCircle(outer, outer, cell - inner - outer, true);
    },
    /** @param {Graphics} g */
      function(g, cell, index) {
      g.addTriangle(cell / 2, cell / 2, cell / 2, cell / 2, 3);
    },
    /** @param {Graphics} g */
      function(g, cell, index) {
      var m = cell * 0.25;
      g.addRectangle(0, 0, cell, cell);
      g.addRhombus(m, m, cell - m, cell - m, true);
    },
    /** @param {Graphics} g */
      function(g, cell, index) {
      var m = cell * 0.4, s = cell * 1.2;
      if (!index) {
        g.addCircle(m, m, s);
      }
    }
  ],

  outer: [
    /** @param {Graphics} g */
      function(g, cell, index) {
      g.addTriangle(0, 0, cell, cell, 0);
    },
    /** @param {Graphics} g */
      function(g, cell, index) {
      g.addTriangle(0, cell / 2, cell, cell / 2, 0);
    },
    /** @param {Graphics} g */
      function(g, cell, index) {
      g.addRhombus(0, 0, cell, cell);
    },
    /** @param {Graphics} g */
      function(g, cell, index) {
      var m = cell / 6;
      g.addCircle(m, m, cell - 2 * m);
    }
  ]
};

/**
 * Functions for converting colors to hex-rgb representations.
 * @private
 */
var color = {
  /**
   * @param {number} r Red channel [0, 255]
   * @param {number} g Green channel [0, 255]
   * @param {number} b Blue channel [0, 255]
   */
  rgb: function(r, g, b) {
    return "#" + this.decToHex(r) + this.decToHex(g) + this.decToHex(b);
  },
  /**
   * @param h Hue [0, 1]
   * @param s Saturation [0, 1]
   * @param l Lightness [0, 1]
   */
  hsl: function(h, s, l) {
    // Based on http://www.w3.org/TR/2011/REC-css3-color-20110607/#hsl-color
    if (s == 0) {
      var partialHex = Jdenticon.prototype.decToHex(l * 255);
      return "#" + partialHex + partialHex + partialHex;
    }
    else {
      var m2 = l <= 0.5 ? l * (s + 1) : l + s - l * s,
        m1 = l * 2 - m2;
      return "#" +
        Jdenticon.prototype.hueToRgb(m1, m2, h * 6 + 2) +
        Jdenticon.prototype.hueToRgb(m1, m2, h * 6) +
        Jdenticon.prototype.hueToRgb(m1, m2, h * 6 - 2);
    }
  },
  // This function will correct the lightness for the "dark" hues
  correctedHsl: function(h, s, l) {
    // The corrector specifies the perceived middle lightnesses for each hue
    var correctors = [0.55, 0.5, 0.5, 0.46, 0.6, 0.55, 0.55],
      corrector = correctors[(h * 6 + 0.5) | 0];

    // Adjust the input lightness relative to the corrector
    l = l < 0.5 ? l * corrector * 2 : corrector + (l - 0.5) * (1 - corrector) * 2;

    return color.hsl(h, s, l);
  }
};

var CanvasRenderer = function(ctx, width, height) {
  this._ctx = ctx;
  ctx.clearRect(0, 0, width, height);
};
CanvasRenderer.prototype = {
  /**
   * Marks the beginning of a new shape of the specified color. Should be ended with a call to endShape.
   * @param {string} color Fill color on format #xxxxxx.
   */
  beginShape: function(color) {
    this._ctx.fillStyle = color;
    this._ctx.beginPath();
  },
  /**
   * Marks the end of the currently drawn shape. This causes the queued paths to be rendered on the canvas.
   */
  endShape: function() {
    this._ctx.fill();
  },
  /**
   * Adds a polygon to the rendering queue.
   * @param points An array of Point objects.
   */
  addPolygon: function(points) {
    var ctx = this._ctx, i;
    ctx.moveTo(points[0].x, points[0].y);
    for (i = 1; i < points.length; i++) {
      ctx.lineTo(points[i].x, points[i].y);
    }
    ctx.closePath();
  },
  /**
   * Adds a circle to the rendering queue.
   * @param {Point} point The upper left corner of the circle bounding box.
   * @param {number} diameter The diameter of the circle.
   * @param {boolean} counterClockwise True if the circle is drawn counter-clockwise (will result in a hole if rendered on a clockwise path).
   */
  addCircle: function(point, diameter, counterClockwise) {
    var ctx = this._ctx,
      radius = diameter / 2;
    ctx.arc(point.x + radius, point.y + radius, radius, 0, Math.PI * 2, counterClockwise);
    ctx.closePath();
  }
};

var /** @const */
  HASH_ATTRIBUTE = "data-jdenticon-hash",
  supportsQuerySelectorAll = "document" in global && "querySelectorAll" in document;

var canvas_element_width = '225'; 
var canvas_element_height = '225'; 
  
export default new Jdenticon();

