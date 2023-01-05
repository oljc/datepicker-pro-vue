/*!
 * datepicker-pro-vue v1.0.0
 * (c) 2014-2023 LIjiAngChen8
 * Released under the MIT License.
 */
(function (global, factory) {
  typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports) :
  typeof define === 'function' && define.amd ? define(['exports'], factory) :
  (global = typeof globalThis !== 'undefined' ? globalThis : global || self, factory(global["datepicker-pro-vue"] = {}));
})(this, (function (exports) { 'use strict';

  var global$1 = (typeof global !== "undefined" ? global :
    typeof self !== "undefined" ? self :
    typeof window !== "undefined" ? window : {});

  /**!
   * @fileOverview Kickass library to create and place poppers near their reference elements.
   * @version 1.16.1
   * @license
   * Copyright (c) 2016 Federico Zivolo and contributors
   *
   * Permission is hereby granted, free of charge, to any person obtaining a copy
   * of this software and associated documentation files (the "Software"), to deal
   * in the Software without restriction, including without limitation the rights
   * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
   * copies of the Software, and to permit persons to whom the Software is
   * furnished to do so, subject to the following conditions:
   *
   * The above copyright notice and this permission notice shall be included in all
   * copies or substantial portions of the Software.
   *
   * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
   * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
   * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
   * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
   * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
   * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
   * SOFTWARE.
   */
  var isBrowser = typeof window !== 'undefined' && typeof document !== 'undefined' && typeof navigator !== 'undefined';

  var timeoutDuration = function () {
    var longerTimeoutBrowsers = ['Edge', 'Trident', 'Firefox'];
    for (var i = 0; i < longerTimeoutBrowsers.length; i += 1) {
      if (isBrowser && navigator.userAgent.indexOf(longerTimeoutBrowsers[i]) >= 0) {
        return 1;
      }
    }
    return 0;
  }();

  function microtaskDebounce(fn) {
    var called = false;
    return function () {
      if (called) {
        return;
      }
      called = true;
      window.Promise.resolve().then(function () {
        called = false;
        fn();
      });
    };
  }

  function taskDebounce(fn) {
    var scheduled = false;
    return function () {
      if (!scheduled) {
        scheduled = true;
        setTimeout(function () {
          scheduled = false;
          fn();
        }, timeoutDuration);
      }
    };
  }

  var supportsMicroTasks = isBrowser && window.Promise;

  /**
  * Create a debounced version of a method, that's asynchronously deferred
  * but called in the minimum time possible.
  *
  * @method
  * @memberof Popper.Utils
  * @argument {Function} fn
  * @returns {Function}
  */
  var debounce = supportsMicroTasks ? microtaskDebounce : taskDebounce;

  /**
   * Check if the given variable is a function
   * @method
   * @memberof Popper.Utils
   * @argument {Any} functionToCheck - variable to check
   * @returns {Boolean} answer to: is a function?
   */
  function isFunction$1(functionToCheck) {
    var getType = {};
    return functionToCheck && getType.toString.call(functionToCheck) === '[object Function]';
  }

  /**
   * Get CSS computed property of the given element
   * @method
   * @memberof Popper.Utils
   * @argument {Eement} element
   * @argument {String} property
   */
  function getStyleComputedProperty(element, property) {
    if (element.nodeType !== 1) {
      return [];
    }
    // NOTE: 1 DOM access here
    var window = element.ownerDocument.defaultView;
    var css = window.getComputedStyle(element, null);
    return property ? css[property] : css;
  }

  /**
   * Returns the parentNode or the host of the element
   * @method
   * @memberof Popper.Utils
   * @argument {Element} element
   * @returns {Element} parent
   */
  function getParentNode(element) {
    if (element.nodeName === 'HTML') {
      return element;
    }
    return element.parentNode || element.host;
  }

  /**
   * Returns the scrolling parent of the given element
   * @method
   * @memberof Popper.Utils
   * @argument {Element} element
   * @returns {Element} scroll parent
   */
  function getScrollParent(element) {
    // Return body, `getScroll` will take care to get the correct `scrollTop` from it
    if (!element) {
      return document.body;
    }

    switch (element.nodeName) {
      case 'HTML':
      case 'BODY':
        return element.ownerDocument.body;
      case '#document':
        return element.body;
    }

    // Firefox want us to check `-x` and `-y` variations as well

    var _getStyleComputedProp = getStyleComputedProperty(element),
        overflow = _getStyleComputedProp.overflow,
        overflowX = _getStyleComputedProp.overflowX,
        overflowY = _getStyleComputedProp.overflowY;

    if (/(auto|scroll|overlay)/.test(overflow + overflowY + overflowX)) {
      return element;
    }

    return getScrollParent(getParentNode(element));
  }

  /**
   * Returns the reference node of the reference object, or the reference object itself.
   * @method
   * @memberof Popper.Utils
   * @param {Element|Object} reference - the reference element (the popper will be relative to this)
   * @returns {Element} parent
   */
  function getReferenceNode(reference) {
    return reference && reference.referenceNode ? reference.referenceNode : reference;
  }

  var isIE11 = isBrowser && !!(window.MSInputMethodContext && document.documentMode);
  var isIE10 = isBrowser && /MSIE 10/.test(navigator.userAgent);

  /**
   * Determines if the browser is Internet Explorer
   * @method
   * @memberof Popper.Utils
   * @param {Number} version to check
   * @returns {Boolean} isIE
   */
  function isIE(version) {
    if (version === 11) {
      return isIE11;
    }
    if (version === 10) {
      return isIE10;
    }
    return isIE11 || isIE10;
  }

  /**
   * Returns the offset parent of the given element
   * @method
   * @memberof Popper.Utils
   * @argument {Element} element
   * @returns {Element} offset parent
   */
  function getOffsetParent(element) {
    if (!element) {
      return document.documentElement;
    }

    var noOffsetParent = isIE(10) ? document.body : null;

    // NOTE: 1 DOM access here
    var offsetParent = element.offsetParent || null;
    // Skip hidden elements which don't have an offsetParent
    while (offsetParent === noOffsetParent && element.nextElementSibling) {
      offsetParent = (element = element.nextElementSibling).offsetParent;
    }

    var nodeName = offsetParent && offsetParent.nodeName;

    if (!nodeName || nodeName === 'BODY' || nodeName === 'HTML') {
      return element ? element.ownerDocument.documentElement : document.documentElement;
    }

    // .offsetParent will return the closest TH, TD or TABLE in case
    // no offsetParent is present, I hate this job...
    if (['TH', 'TD', 'TABLE'].indexOf(offsetParent.nodeName) !== -1 && getStyleComputedProperty(offsetParent, 'position') === 'static') {
      return getOffsetParent(offsetParent);
    }

    return offsetParent;
  }

  function isOffsetContainer(element) {
    var nodeName = element.nodeName;

    if (nodeName === 'BODY') {
      return false;
    }
    return nodeName === 'HTML' || getOffsetParent(element.firstElementChild) === element;
  }

  /**
   * Finds the root node (document, shadowDOM root) of the given element
   * @method
   * @memberof Popper.Utils
   * @argument {Element} node
   * @returns {Element} root node
   */
  function getRoot(node) {
    if (node.parentNode !== null) {
      return getRoot(node.parentNode);
    }

    return node;
  }

  /**
   * Finds the offset parent common to the two provided nodes
   * @method
   * @memberof Popper.Utils
   * @argument {Element} element1
   * @argument {Element} element2
   * @returns {Element} common offset parent
   */
  function findCommonOffsetParent(element1, element2) {
    // This check is needed to avoid errors in case one of the elements isn't defined for any reason
    if (!element1 || !element1.nodeType || !element2 || !element2.nodeType) {
      return document.documentElement;
    }

    // Here we make sure to give as "start" the element that comes first in the DOM
    var order = element1.compareDocumentPosition(element2) & Node.DOCUMENT_POSITION_FOLLOWING;
    var start = order ? element1 : element2;
    var end = order ? element2 : element1;

    // Get common ancestor container
    var range = document.createRange();
    range.setStart(start, 0);
    range.setEnd(end, 0);
    var commonAncestorContainer = range.commonAncestorContainer;

    // Both nodes are inside #document

    if (element1 !== commonAncestorContainer && element2 !== commonAncestorContainer || start.contains(end)) {
      if (isOffsetContainer(commonAncestorContainer)) {
        return commonAncestorContainer;
      }

      return getOffsetParent(commonAncestorContainer);
    }

    // one of the nodes is inside shadowDOM, find which one
    var element1root = getRoot(element1);
    if (element1root.host) {
      return findCommonOffsetParent(element1root.host, element2);
    } else {
      return findCommonOffsetParent(element1, getRoot(element2).host);
    }
  }

  /**
   * Gets the scroll value of the given element in the given side (top and left)
   * @method
   * @memberof Popper.Utils
   * @argument {Element} element
   * @argument {String} side `top` or `left`
   * @returns {number} amount of scrolled pixels
   */
  function getScroll(element) {
    var side = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 'top';

    var upperSide = side === 'top' ? 'scrollTop' : 'scrollLeft';
    var nodeName = element.nodeName;

    if (nodeName === 'BODY' || nodeName === 'HTML') {
      var html = element.ownerDocument.documentElement;
      var scrollingElement = element.ownerDocument.scrollingElement || html;
      return scrollingElement[upperSide];
    }

    return element[upperSide];
  }

  /*
   * Sum or subtract the element scroll values (left and top) from a given rect object
   * @method
   * @memberof Popper.Utils
   * @param {Object} rect - Rect object you want to change
   * @param {HTMLElement} element - The element from the function reads the scroll values
   * @param {Boolean} subtract - set to true if you want to subtract the scroll values
   * @return {Object} rect - The modifier rect object
   */
  function includeScroll(rect, element) {
    var subtract = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : false;

    var scrollTop = getScroll(element, 'top');
    var scrollLeft = getScroll(element, 'left');
    var modifier = subtract ? -1 : 1;
    rect.top += scrollTop * modifier;
    rect.bottom += scrollTop * modifier;
    rect.left += scrollLeft * modifier;
    rect.right += scrollLeft * modifier;
    return rect;
  }

  /*
   * Helper to detect borders of a given element
   * @method
   * @memberof Popper.Utils
   * @param {CSSStyleDeclaration} styles
   * Result of `getStyleComputedProperty` on the given element
   * @param {String} axis - `x` or `y`
   * @return {number} borders - The borders size of the given axis
   */

  function getBordersSize(styles, axis) {
    var sideA = axis === 'x' ? 'Left' : 'Top';
    var sideB = sideA === 'Left' ? 'Right' : 'Bottom';

    return parseFloat(styles['border' + sideA + 'Width']) + parseFloat(styles['border' + sideB + 'Width']);
  }

  function getSize(axis, body, html, computedStyle) {
    return Math.max(body['offset' + axis], body['scroll' + axis], html['client' + axis], html['offset' + axis], html['scroll' + axis], isIE(10) ? parseInt(html['offset' + axis]) + parseInt(computedStyle['margin' + (axis === 'Height' ? 'Top' : 'Left')]) + parseInt(computedStyle['margin' + (axis === 'Height' ? 'Bottom' : 'Right')]) : 0);
  }

  function getWindowSizes(document) {
    var body = document.body;
    var html = document.documentElement;
    var computedStyle = isIE(10) && getComputedStyle(html);

    return {
      height: getSize('Height', body, html, computedStyle),
      width: getSize('Width', body, html, computedStyle)
    };
  }

  var classCallCheck = function (instance, Constructor) {
    if (!(instance instanceof Constructor)) {
      throw new TypeError("Cannot call a class as a function");
    }
  };

  var createClass = function () {
    function defineProperties(target, props) {
      for (var i = 0; i < props.length; i++) {
        var descriptor = props[i];
        descriptor.enumerable = descriptor.enumerable || false;
        descriptor.configurable = true;
        if ("value" in descriptor) descriptor.writable = true;
        Object.defineProperty(target, descriptor.key, descriptor);
      }
    }

    return function (Constructor, protoProps, staticProps) {
      if (protoProps) defineProperties(Constructor.prototype, protoProps);
      if (staticProps) defineProperties(Constructor, staticProps);
      return Constructor;
    };
  }();





  var defineProperty = function (obj, key, value) {
    if (key in obj) {
      Object.defineProperty(obj, key, {
        value: value,
        enumerable: true,
        configurable: true,
        writable: true
      });
    } else {
      obj[key] = value;
    }

    return obj;
  };

  var _extends = Object.assign || function (target) {
    for (var i = 1; i < arguments.length; i++) {
      var source = arguments[i];

      for (var key in source) {
        if (Object.prototype.hasOwnProperty.call(source, key)) {
          target[key] = source[key];
        }
      }
    }

    return target;
  };

  /**
   * Given element offsets, generate an output similar to getBoundingClientRect
   * @method
   * @memberof Popper.Utils
   * @argument {Object} offsets
   * @returns {Object} ClientRect like output
   */
  function getClientRect(offsets) {
    return _extends({}, offsets, {
      right: offsets.left + offsets.width,
      bottom: offsets.top + offsets.height
    });
  }

  /**
   * Get bounding client rect of given element
   * @method
   * @memberof Popper.Utils
   * @param {HTMLElement} element
   * @return {Object} client rect
   */
  function getBoundingClientRect(element) {
    var rect = {};

    // IE10 10 FIX: Please, don't ask, the element isn't
    // considered in DOM in some circumstances...
    // This isn't reproducible in IE10 compatibility mode of IE11
    try {
      if (isIE(10)) {
        rect = element.getBoundingClientRect();
        var scrollTop = getScroll(element, 'top');
        var scrollLeft = getScroll(element, 'left');
        rect.top += scrollTop;
        rect.left += scrollLeft;
        rect.bottom += scrollTop;
        rect.right += scrollLeft;
      } else {
        rect = element.getBoundingClientRect();
      }
    } catch (e) {}

    var result = {
      left: rect.left,
      top: rect.top,
      width: rect.right - rect.left,
      height: rect.bottom - rect.top
    };

    // subtract scrollbar size from sizes
    var sizes = element.nodeName === 'HTML' ? getWindowSizes(element.ownerDocument) : {};
    var width = sizes.width || element.clientWidth || result.width;
    var height = sizes.height || element.clientHeight || result.height;

    var horizScrollbar = element.offsetWidth - width;
    var vertScrollbar = element.offsetHeight - height;

    // if an hypothetical scrollbar is detected, we must be sure it's not a `border`
    // we make this check conditional for performance reasons
    if (horizScrollbar || vertScrollbar) {
      var styles = getStyleComputedProperty(element);
      horizScrollbar -= getBordersSize(styles, 'x');
      vertScrollbar -= getBordersSize(styles, 'y');

      result.width -= horizScrollbar;
      result.height -= vertScrollbar;
    }

    return getClientRect(result);
  }

  function getOffsetRectRelativeToArbitraryNode(children, parent) {
    var fixedPosition = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : false;

    var isIE10 = isIE(10);
    var isHTML = parent.nodeName === 'HTML';
    var childrenRect = getBoundingClientRect(children);
    var parentRect = getBoundingClientRect(parent);
    var scrollParent = getScrollParent(children);

    var styles = getStyleComputedProperty(parent);
    var borderTopWidth = parseFloat(styles.borderTopWidth);
    var borderLeftWidth = parseFloat(styles.borderLeftWidth);

    // In cases where the parent is fixed, we must ignore negative scroll in offset calc
    if (fixedPosition && isHTML) {
      parentRect.top = Math.max(parentRect.top, 0);
      parentRect.left = Math.max(parentRect.left, 0);
    }
    var offsets = getClientRect({
      top: childrenRect.top - parentRect.top - borderTopWidth,
      left: childrenRect.left - parentRect.left - borderLeftWidth,
      width: childrenRect.width,
      height: childrenRect.height
    });
    offsets.marginTop = 0;
    offsets.marginLeft = 0;

    // Subtract margins of documentElement in case it's being used as parent
    // we do this only on HTML because it's the only element that behaves
    // differently when margins are applied to it. The margins are included in
    // the box of the documentElement, in the other cases not.
    if (!isIE10 && isHTML) {
      var marginTop = parseFloat(styles.marginTop);
      var marginLeft = parseFloat(styles.marginLeft);

      offsets.top -= borderTopWidth - marginTop;
      offsets.bottom -= borderTopWidth - marginTop;
      offsets.left -= borderLeftWidth - marginLeft;
      offsets.right -= borderLeftWidth - marginLeft;

      // Attach marginTop and marginLeft because in some circumstances we may need them
      offsets.marginTop = marginTop;
      offsets.marginLeft = marginLeft;
    }

    if (isIE10 && !fixedPosition ? parent.contains(scrollParent) : parent === scrollParent && scrollParent.nodeName !== 'BODY') {
      offsets = includeScroll(offsets, parent);
    }

    return offsets;
  }

  function getViewportOffsetRectRelativeToArtbitraryNode(element) {
    var excludeScroll = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : false;

    var html = element.ownerDocument.documentElement;
    var relativeOffset = getOffsetRectRelativeToArbitraryNode(element, html);
    var width = Math.max(html.clientWidth, window.innerWidth || 0);
    var height = Math.max(html.clientHeight, window.innerHeight || 0);

    var scrollTop = !excludeScroll ? getScroll(html) : 0;
    var scrollLeft = !excludeScroll ? getScroll(html, 'left') : 0;

    var offset = {
      top: scrollTop - relativeOffset.top + relativeOffset.marginTop,
      left: scrollLeft - relativeOffset.left + relativeOffset.marginLeft,
      width: width,
      height: height
    };

    return getClientRect(offset);
  }

  /**
   * Check if the given element is fixed or is inside a fixed parent
   * @method
   * @memberof Popper.Utils
   * @argument {Element} element
   * @argument {Element} customContainer
   * @returns {Boolean} answer to "isFixed?"
   */
  function isFixed(element) {
    var nodeName = element.nodeName;
    if (nodeName === 'BODY' || nodeName === 'HTML') {
      return false;
    }
    if (getStyleComputedProperty(element, 'position') === 'fixed') {
      return true;
    }
    var parentNode = getParentNode(element);
    if (!parentNode) {
      return false;
    }
    return isFixed(parentNode);
  }

  /**
   * Finds the first parent of an element that has a transformed property defined
   * @method
   * @memberof Popper.Utils
   * @argument {Element} element
   * @returns {Element} first transformed parent or documentElement
   */

  function getFixedPositionOffsetParent(element) {
    // This check is needed to avoid errors in case one of the elements isn't defined for any reason
    if (!element || !element.parentElement || isIE()) {
      return document.documentElement;
    }
    var el = element.parentElement;
    while (el && getStyleComputedProperty(el, 'transform') === 'none') {
      el = el.parentElement;
    }
    return el || document.documentElement;
  }

  /**
   * Computed the boundaries limits and return them
   * @method
   * @memberof Popper.Utils
   * @param {HTMLElement} popper
   * @param {HTMLElement} reference
   * @param {number} padding
   * @param {HTMLElement} boundariesElement - Element used to define the boundaries
   * @param {Boolean} fixedPosition - Is in fixed position mode
   * @returns {Object} Coordinates of the boundaries
   */
  function getBoundaries(popper, reference, padding, boundariesElement) {
    var fixedPosition = arguments.length > 4 && arguments[4] !== undefined ? arguments[4] : false;

    // NOTE: 1 DOM access here

    var boundaries = { top: 0, left: 0 };
    var offsetParent = fixedPosition ? getFixedPositionOffsetParent(popper) : findCommonOffsetParent(popper, getReferenceNode(reference));

    // Handle viewport case
    if (boundariesElement === 'viewport') {
      boundaries = getViewportOffsetRectRelativeToArtbitraryNode(offsetParent, fixedPosition);
    } else {
      // Handle other cases based on DOM element used as boundaries
      var boundariesNode = void 0;
      if (boundariesElement === 'scrollParent') {
        boundariesNode = getScrollParent(getParentNode(reference));
        if (boundariesNode.nodeName === 'BODY') {
          boundariesNode = popper.ownerDocument.documentElement;
        }
      } else if (boundariesElement === 'window') {
        boundariesNode = popper.ownerDocument.documentElement;
      } else {
        boundariesNode = boundariesElement;
      }

      var offsets = getOffsetRectRelativeToArbitraryNode(boundariesNode, offsetParent, fixedPosition);

      // In case of HTML, we need a different computation
      if (boundariesNode.nodeName === 'HTML' && !isFixed(offsetParent)) {
        var _getWindowSizes = getWindowSizes(popper.ownerDocument),
            height = _getWindowSizes.height,
            width = _getWindowSizes.width;

        boundaries.top += offsets.top - offsets.marginTop;
        boundaries.bottom = height + offsets.top;
        boundaries.left += offsets.left - offsets.marginLeft;
        boundaries.right = width + offsets.left;
      } else {
        // for all the other DOM elements, this one is good
        boundaries = offsets;
      }
    }

    // Add paddings
    padding = padding || 0;
    var isPaddingNumber = typeof padding === 'number';
    boundaries.left += isPaddingNumber ? padding : padding.left || 0;
    boundaries.top += isPaddingNumber ? padding : padding.top || 0;
    boundaries.right -= isPaddingNumber ? padding : padding.right || 0;
    boundaries.bottom -= isPaddingNumber ? padding : padding.bottom || 0;

    return boundaries;
  }

  function getArea(_ref) {
    var width = _ref.width,
        height = _ref.height;

    return width * height;
  }

  /**
   * Utility used to transform the `auto` placement to the placement with more
   * available space.
   * @method
   * @memberof Popper.Utils
   * @argument {Object} data - The data object generated by update method
   * @argument {Object} options - Modifiers configuration and options
   * @returns {Object} The data object, properly modified
   */
  function computeAutoPlacement(placement, refRect, popper, reference, boundariesElement) {
    var padding = arguments.length > 5 && arguments[5] !== undefined ? arguments[5] : 0;

    if (placement.indexOf('auto') === -1) {
      return placement;
    }

    var boundaries = getBoundaries(popper, reference, padding, boundariesElement);

    var rects = {
      top: {
        width: boundaries.width,
        height: refRect.top - boundaries.top
      },
      right: {
        width: boundaries.right - refRect.right,
        height: boundaries.height
      },
      bottom: {
        width: boundaries.width,
        height: boundaries.bottom - refRect.bottom
      },
      left: {
        width: refRect.left - boundaries.left,
        height: boundaries.height
      }
    };

    var sortedAreas = Object.keys(rects).map(function (key) {
      return _extends({
        key: key
      }, rects[key], {
        area: getArea(rects[key])
      });
    }).sort(function (a, b) {
      return b.area - a.area;
    });

    var filteredAreas = sortedAreas.filter(function (_ref2) {
      var width = _ref2.width,
          height = _ref2.height;
      return width >= popper.clientWidth && height >= popper.clientHeight;
    });

    var computedPlacement = filteredAreas.length > 0 ? filteredAreas[0].key : sortedAreas[0].key;

    var variation = placement.split('-')[1];

    return computedPlacement + (variation ? '-' + variation : '');
  }

  /**
   * Get offsets to the reference element
   * @method
   * @memberof Popper.Utils
   * @param {Object} state
   * @param {Element} popper - the popper element
   * @param {Element} reference - the reference element (the popper will be relative to this)
   * @param {Element} fixedPosition - is in fixed position mode
   * @returns {Object} An object containing the offsets which will be applied to the popper
   */
  function getReferenceOffsets(state, popper, reference) {
    var fixedPosition = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : null;

    var commonOffsetParent = fixedPosition ? getFixedPositionOffsetParent(popper) : findCommonOffsetParent(popper, getReferenceNode(reference));
    return getOffsetRectRelativeToArbitraryNode(reference, commonOffsetParent, fixedPosition);
  }

  /**
   * Get the outer sizes of the given element (offset size + margins)
   * @method
   * @memberof Popper.Utils
   * @argument {Element} element
   * @returns {Object} object containing width and height properties
   */
  function getOuterSizes(element) {
    var window = element.ownerDocument.defaultView;
    var styles = window.getComputedStyle(element);
    var x = parseFloat(styles.marginTop || 0) + parseFloat(styles.marginBottom || 0);
    var y = parseFloat(styles.marginLeft || 0) + parseFloat(styles.marginRight || 0);
    var result = {
      width: element.offsetWidth + y,
      height: element.offsetHeight + x
    };
    return result;
  }

  /**
   * Get the opposite placement of the given one
   * @method
   * @memberof Popper.Utils
   * @argument {String} placement
   * @returns {String} flipped placement
   */
  function getOppositePlacement(placement) {
    var hash = { left: 'right', right: 'left', bottom: 'top', top: 'bottom' };
    return placement.replace(/left|right|bottom|top/g, function (matched) {
      return hash[matched];
    });
  }

  /**
   * Get offsets to the popper
   * @method
   * @memberof Popper.Utils
   * @param {Object} position - CSS position the Popper will get applied
   * @param {HTMLElement} popper - the popper element
   * @param {Object} referenceOffsets - the reference offsets (the popper will be relative to this)
   * @param {String} placement - one of the valid placement options
   * @returns {Object} popperOffsets - An object containing the offsets which will be applied to the popper
   */
  function getPopperOffsets(popper, referenceOffsets, placement) {
    placement = placement.split('-')[0];

    // Get popper node sizes
    var popperRect = getOuterSizes(popper);

    // Add position, width and height to our offsets object
    var popperOffsets = {
      width: popperRect.width,
      height: popperRect.height
    };

    // depending by the popper placement we have to compute its offsets slightly differently
    var isHoriz = ['right', 'left'].indexOf(placement) !== -1;
    var mainSide = isHoriz ? 'top' : 'left';
    var secondarySide = isHoriz ? 'left' : 'top';
    var measurement = isHoriz ? 'height' : 'width';
    var secondaryMeasurement = !isHoriz ? 'height' : 'width';

    popperOffsets[mainSide] = referenceOffsets[mainSide] + referenceOffsets[measurement] / 2 - popperRect[measurement] / 2;
    if (placement === secondarySide) {
      popperOffsets[secondarySide] = referenceOffsets[secondarySide] - popperRect[secondaryMeasurement];
    } else {
      popperOffsets[secondarySide] = referenceOffsets[getOppositePlacement(secondarySide)];
    }

    return popperOffsets;
  }

  /**
   * Mimics the `find` method of Array
   * @method
   * @memberof Popper.Utils
   * @argument {Array} arr
   * @argument prop
   * @argument value
   * @returns index or -1
   */
  function find(arr, check) {
    // use native find if supported
    if (Array.prototype.find) {
      return arr.find(check);
    }

    // use `filter` to obtain the same behavior of `find`
    return arr.filter(check)[0];
  }

  /**
   * Return the index of the matching object
   * @method
   * @memberof Popper.Utils
   * @argument {Array} arr
   * @argument prop
   * @argument value
   * @returns index or -1
   */
  function findIndex(arr, prop, value) {
    // use native findIndex if supported
    if (Array.prototype.findIndex) {
      return arr.findIndex(function (cur) {
        return cur[prop] === value;
      });
    }

    // use `find` + `indexOf` if `findIndex` isn't supported
    var match = find(arr, function (obj) {
      return obj[prop] === value;
    });
    return arr.indexOf(match);
  }

  /**
   * Loop trough the list of modifiers and run them in order,
   * each of them will then edit the data object.
   * @method
   * @memberof Popper.Utils
   * @param {dataObject} data
   * @param {Array} modifiers
   * @param {String} ends - Optional modifier name used as stopper
   * @returns {dataObject}
   */
  function runModifiers(modifiers, data, ends) {
    var modifiersToRun = ends === undefined ? modifiers : modifiers.slice(0, findIndex(modifiers, 'name', ends));

    modifiersToRun.forEach(function (modifier) {
      if (modifier['function']) ;
      var fn = modifier['function'] || modifier.fn; // eslint-disable-line dot-notation
      if (modifier.enabled && isFunction$1(fn)) {
        // Add properties to offsets to make them a complete clientRect object
        // we do this before each modifier to make sure the previous one doesn't
        // mess with these values
        data.offsets.popper = getClientRect(data.offsets.popper);
        data.offsets.reference = getClientRect(data.offsets.reference);

        data = fn(data, modifier);
      }
    });

    return data;
  }

  /**
   * Updates the position of the popper, computing the new offsets and applying
   * the new style.<br />
   * Prefer `scheduleUpdate` over `update` because of performance reasons.
   * @method
   * @memberof Popper
   */
  function update() {
    // if popper is destroyed, don't perform any further update
    if (this.state.isDestroyed) {
      return;
    }

    var data = {
      instance: this,
      styles: {},
      arrowStyles: {},
      attributes: {},
      flipped: false,
      offsets: {}
    };

    // compute reference element offsets
    data.offsets.reference = getReferenceOffsets(this.state, this.popper, this.reference, this.options.positionFixed);

    // compute auto placement, store placement inside the data object,
    // modifiers will be able to edit `placement` if needed
    // and refer to originalPlacement to know the original value
    data.placement = computeAutoPlacement(this.options.placement, data.offsets.reference, this.popper, this.reference, this.options.modifiers.flip.boundariesElement, this.options.modifiers.flip.padding);

    // store the computed placement inside `originalPlacement`
    data.originalPlacement = data.placement;

    data.positionFixed = this.options.positionFixed;

    // compute the popper offsets
    data.offsets.popper = getPopperOffsets(this.popper, data.offsets.reference, data.placement);

    data.offsets.popper.position = this.options.positionFixed ? 'fixed' : 'absolute';

    // run the modifiers
    data = runModifiers(this.modifiers, data);

    // the first `update` will call `onCreate` callback
    // the other ones will call `onUpdate` callback
    if (!this.state.isCreated) {
      this.state.isCreated = true;
      this.options.onCreate(data);
    } else {
      this.options.onUpdate(data);
    }
  }

  /**
   * Helper used to know if the given modifier is enabled.
   * @method
   * @memberof Popper.Utils
   * @returns {Boolean}
   */
  function isModifierEnabled(modifiers, modifierName) {
    return modifiers.some(function (_ref) {
      var name = _ref.name,
          enabled = _ref.enabled;
      return enabled && name === modifierName;
    });
  }

  /**
   * Get the prefixed supported property name
   * @method
   * @memberof Popper.Utils
   * @argument {String} property (camelCase)
   * @returns {String} prefixed property (camelCase or PascalCase, depending on the vendor prefix)
   */
  function getSupportedPropertyName(property) {
    var prefixes = [false, 'ms', 'Webkit', 'Moz', 'O'];
    var upperProp = property.charAt(0).toUpperCase() + property.slice(1);

    for (var i = 0; i < prefixes.length; i++) {
      var prefix = prefixes[i];
      var toCheck = prefix ? '' + prefix + upperProp : property;
      if (typeof document.body.style[toCheck] !== 'undefined') {
        return toCheck;
      }
    }
    return null;
  }

  /**
   * Destroys the popper.
   * @method
   * @memberof Popper
   */
  function destroy() {
    this.state.isDestroyed = true;

    // touch DOM only if `applyStyle` modifier is enabled
    if (isModifierEnabled(this.modifiers, 'applyStyle')) {
      this.popper.removeAttribute('x-placement');
      this.popper.style.position = '';
      this.popper.style.top = '';
      this.popper.style.left = '';
      this.popper.style.right = '';
      this.popper.style.bottom = '';
      this.popper.style.willChange = '';
      this.popper.style[getSupportedPropertyName('transform')] = '';
    }

    this.disableEventListeners();

    // remove the popper if user explicitly asked for the deletion on destroy
    // do not use `remove` because IE11 doesn't support it
    if (this.options.removeOnDestroy) {
      this.popper.parentNode.removeChild(this.popper);
    }
    return this;
  }

  /**
   * Get the window associated with the element
   * @argument {Element} element
   * @returns {Window}
   */
  function getWindow(element) {
    var ownerDocument = element.ownerDocument;
    return ownerDocument ? ownerDocument.defaultView : window;
  }

  function attachToScrollParents(scrollParent, event, callback, scrollParents) {
    var isBody = scrollParent.nodeName === 'BODY';
    var target = isBody ? scrollParent.ownerDocument.defaultView : scrollParent;
    target.addEventListener(event, callback, { passive: true });

    if (!isBody) {
      attachToScrollParents(getScrollParent(target.parentNode), event, callback, scrollParents);
    }
    scrollParents.push(target);
  }

  /**
   * Setup needed event listeners used to update the popper position
   * @method
   * @memberof Popper.Utils
   * @private
   */
  function setupEventListeners(reference, options, state, updateBound) {
    // Resize event listener on window
    state.updateBound = updateBound;
    getWindow(reference).addEventListener('resize', state.updateBound, { passive: true });

    // Scroll event listener on scroll parents
    var scrollElement = getScrollParent(reference);
    attachToScrollParents(scrollElement, 'scroll', state.updateBound, state.scrollParents);
    state.scrollElement = scrollElement;
    state.eventsEnabled = true;

    return state;
  }

  /**
   * It will add resize/scroll events and start recalculating
   * position of the popper element when they are triggered.
   * @method
   * @memberof Popper
   */
  function enableEventListeners() {
    if (!this.state.eventsEnabled) {
      this.state = setupEventListeners(this.reference, this.options, this.state, this.scheduleUpdate);
    }
  }

  /**
   * Remove event listeners used to update the popper position
   * @method
   * @memberof Popper.Utils
   * @private
   */
  function removeEventListeners(reference, state) {
    // Remove resize event listener on window
    getWindow(reference).removeEventListener('resize', state.updateBound);

    // Remove scroll event listener on scroll parents
    state.scrollParents.forEach(function (target) {
      target.removeEventListener('scroll', state.updateBound);
    });

    // Reset state
    state.updateBound = null;
    state.scrollParents = [];
    state.scrollElement = null;
    state.eventsEnabled = false;
    return state;
  }

  /**
   * It will remove resize/scroll events and won't recalculate popper position
   * when they are triggered. It also won't trigger `onUpdate` callback anymore,
   * unless you call `update` method manually.
   * @method
   * @memberof Popper
   */
  function disableEventListeners() {
    if (this.state.eventsEnabled) {
      cancelAnimationFrame(this.scheduleUpdate);
      this.state = removeEventListeners(this.reference, this.state);
    }
  }

  /**
   * Tells if a given input is a number
   * @method
   * @memberof Popper.Utils
   * @param {*} input to check
   * @return {Boolean}
   */
  function isNumeric(n) {
    return n !== '' && !isNaN(parseFloat(n)) && isFinite(n);
  }

  /**
   * Set the style to the given popper
   * @method
   * @memberof Popper.Utils
   * @argument {Element} element - Element to apply the style to
   * @argument {Object} styles
   * Object with a list of properties and values which will be applied to the element
   */
  function setStyles(element, styles) {
    Object.keys(styles).forEach(function (prop) {
      var unit = '';
      // add unit if the value is numeric and is one of the following
      if (['width', 'height', 'top', 'right', 'bottom', 'left'].indexOf(prop) !== -1 && isNumeric(styles[prop])) {
        unit = 'px';
      }
      element.style[prop] = styles[prop] + unit;
    });
  }

  /**
   * Set the attributes to the given popper
   * @method
   * @memberof Popper.Utils
   * @argument {Element} element - Element to apply the attributes to
   * @argument {Object} styles
   * Object with a list of properties and values which will be applied to the element
   */
  function setAttributes(element, attributes) {
    Object.keys(attributes).forEach(function (prop) {
      var value = attributes[prop];
      if (value !== false) {
        element.setAttribute(prop, attributes[prop]);
      } else {
        element.removeAttribute(prop);
      }
    });
  }

  /**
   * @function
   * @memberof Modifiers
   * @argument {Object} data - The data object generated by `update` method
   * @argument {Object} data.styles - List of style properties - values to apply to popper element
   * @argument {Object} data.attributes - List of attribute properties - values to apply to popper element
   * @argument {Object} options - Modifiers configuration and options
   * @returns {Object} The same data object
   */
  function applyStyle(data) {
    // any property present in `data.styles` will be applied to the popper,
    // in this way we can make the 3rd party modifiers add custom styles to it
    // Be aware, modifiers could override the properties defined in the previous
    // lines of this modifier!
    setStyles(data.instance.popper, data.styles);

    // any property present in `data.attributes` will be applied to the popper,
    // they will be set as HTML attributes of the element
    setAttributes(data.instance.popper, data.attributes);

    // if arrowElement is defined and arrowStyles has some properties
    if (data.arrowElement && Object.keys(data.arrowStyles).length) {
      setStyles(data.arrowElement, data.arrowStyles);
    }

    return data;
  }

  /**
   * Set the x-placement attribute before everything else because it could be used
   * to add margins to the popper margins needs to be calculated to get the
   * correct popper offsets.
   * @method
   * @memberof Popper.modifiers
   * @param {HTMLElement} reference - The reference element used to position the popper
   * @param {HTMLElement} popper - The HTML element used as popper
   * @param {Object} options - Popper.js options
   */
  function applyStyleOnLoad(reference, popper, options, modifierOptions, state) {
    // compute reference element offsets
    var referenceOffsets = getReferenceOffsets(state, popper, reference, options.positionFixed);

    // compute auto placement, store placement inside the data object,
    // modifiers will be able to edit `placement` if needed
    // and refer to originalPlacement to know the original value
    var placement = computeAutoPlacement(options.placement, referenceOffsets, popper, reference, options.modifiers.flip.boundariesElement, options.modifiers.flip.padding);

    popper.setAttribute('x-placement', placement);

    // Apply `position` to popper before anything else because
    // without the position applied we can't guarantee correct computations
    setStyles(popper, { position: options.positionFixed ? 'fixed' : 'absolute' });

    return options;
  }

  /**
   * @function
   * @memberof Popper.Utils
   * @argument {Object} data - The data object generated by `update` method
   * @argument {Boolean} shouldRound - If the offsets should be rounded at all
   * @returns {Object} The popper's position offsets rounded
   *
   * The tale of pixel-perfect positioning. It's still not 100% perfect, but as
   * good as it can be within reason.
   * Discussion here: https://github.com/FezVrasta/popper.js/pull/715
   *
   * Low DPI screens cause a popper to be blurry if not using full pixels (Safari
   * as well on High DPI screens).
   *
   * Firefox prefers no rounding for positioning and does not have blurriness on
   * high DPI screens.
   *
   * Only horizontal placement and left/right values need to be considered.
   */
  function getRoundedOffsets(data, shouldRound) {
    var _data$offsets = data.offsets,
        popper = _data$offsets.popper,
        reference = _data$offsets.reference;
    var round = Math.round,
        floor = Math.floor;

    var noRound = function noRound(v) {
      return v;
    };

    var referenceWidth = round(reference.width);
    var popperWidth = round(popper.width);

    var isVertical = ['left', 'right'].indexOf(data.placement) !== -1;
    var isVariation = data.placement.indexOf('-') !== -1;
    var sameWidthParity = referenceWidth % 2 === popperWidth % 2;
    var bothOddWidth = referenceWidth % 2 === 1 && popperWidth % 2 === 1;

    var horizontalToInteger = !shouldRound ? noRound : isVertical || isVariation || sameWidthParity ? round : floor;
    var verticalToInteger = !shouldRound ? noRound : round;

    return {
      left: horizontalToInteger(bothOddWidth && !isVariation && shouldRound ? popper.left - 1 : popper.left),
      top: verticalToInteger(popper.top),
      bottom: verticalToInteger(popper.bottom),
      right: horizontalToInteger(popper.right)
    };
  }

  var isFirefox = isBrowser && /Firefox/i.test(navigator.userAgent);

  /**
   * @function
   * @memberof Modifiers
   * @argument {Object} data - The data object generated by `update` method
   * @argument {Object} options - Modifiers configuration and options
   * @returns {Object} The data object, properly modified
   */
  function computeStyle(data, options) {
    var x = options.x,
        y = options.y;
    var popper = data.offsets.popper;

    // Remove this legacy support in Popper.js v2

    var legacyGpuAccelerationOption = find(data.instance.modifiers, function (modifier) {
      return modifier.name === 'applyStyle';
    }).gpuAcceleration;
    var gpuAcceleration = legacyGpuAccelerationOption !== undefined ? legacyGpuAccelerationOption : options.gpuAcceleration;

    var offsetParent = getOffsetParent(data.instance.popper);
    var offsetParentRect = getBoundingClientRect(offsetParent);

    // Styles
    var styles = {
      position: popper.position
    };

    var offsets = getRoundedOffsets(data, window.devicePixelRatio < 2 || !isFirefox);

    var sideA = x === 'bottom' ? 'top' : 'bottom';
    var sideB = y === 'right' ? 'left' : 'right';

    // if gpuAcceleration is set to `true` and transform is supported,
    //  we use `translate3d` to apply the position to the popper we
    // automatically use the supported prefixed version if needed
    var prefixedProperty = getSupportedPropertyName('transform');

    // now, let's make a step back and look at this code closely (wtf?)
    // If the content of the popper grows once it's been positioned, it
    // may happen that the popper gets misplaced because of the new content
    // overflowing its reference element
    // To avoid this problem, we provide two options (x and y), which allow
    // the consumer to define the offset origin.
    // If we position a popper on top of a reference element, we can set
    // `x` to `top` to make the popper grow towards its top instead of
    // its bottom.
    var left = void 0,
        top = void 0;
    if (sideA === 'bottom') {
      // when offsetParent is <html> the positioning is relative to the bottom of the screen (excluding the scrollbar)
      // and not the bottom of the html element
      if (offsetParent.nodeName === 'HTML') {
        top = -offsetParent.clientHeight + offsets.bottom;
      } else {
        top = -offsetParentRect.height + offsets.bottom;
      }
    } else {
      top = offsets.top;
    }
    if (sideB === 'right') {
      if (offsetParent.nodeName === 'HTML') {
        left = -offsetParent.clientWidth + offsets.right;
      } else {
        left = -offsetParentRect.width + offsets.right;
      }
    } else {
      left = offsets.left;
    }
    if (gpuAcceleration && prefixedProperty) {
      styles[prefixedProperty] = 'translate3d(' + left + 'px, ' + top + 'px, 0)';
      styles[sideA] = 0;
      styles[sideB] = 0;
      styles.willChange = 'transform';
    } else {
      // othwerise, we use the standard `top`, `left`, `bottom` and `right` properties
      var invertTop = sideA === 'bottom' ? -1 : 1;
      var invertLeft = sideB === 'right' ? -1 : 1;
      styles[sideA] = top * invertTop;
      styles[sideB] = left * invertLeft;
      styles.willChange = sideA + ', ' + sideB;
    }

    // Attributes
    var attributes = {
      'x-placement': data.placement
    };

    // Update `data` attributes, styles and arrowStyles
    data.attributes = _extends({}, attributes, data.attributes);
    data.styles = _extends({}, styles, data.styles);
    data.arrowStyles = _extends({}, data.offsets.arrow, data.arrowStyles);

    return data;
  }

  /**
   * Helper used to know if the given modifier depends from another one.<br />
   * It checks if the needed modifier is listed and enabled.
   * @method
   * @memberof Popper.Utils
   * @param {Array} modifiers - list of modifiers
   * @param {String} requestingName - name of requesting modifier
   * @param {String} requestedName - name of requested modifier
   * @returns {Boolean}
   */
  function isModifierRequired(modifiers, requestingName, requestedName) {
    var requesting = find(modifiers, function (_ref) {
      var name = _ref.name;
      return name === requestingName;
    });

    var isRequired = !!requesting && modifiers.some(function (modifier) {
      return modifier.name === requestedName && modifier.enabled && modifier.order < requesting.order;
    });
    return isRequired;
  }

  /**
   * @function
   * @memberof Modifiers
   * @argument {Object} data - The data object generated by update method
   * @argument {Object} options - Modifiers configuration and options
   * @returns {Object} The data object, properly modified
   */
  function arrow(data, options) {
    var _data$offsets$arrow;

    // arrow depends on keepTogether in order to work
    if (!isModifierRequired(data.instance.modifiers, 'arrow', 'keepTogether')) {
      return data;
    }

    var arrowElement = options.element;

    // if arrowElement is a string, suppose it's a CSS selector
    if (typeof arrowElement === 'string') {
      arrowElement = data.instance.popper.querySelector(arrowElement);

      // if arrowElement is not found, don't run the modifier
      if (!arrowElement) {
        return data;
      }
    } else {
      // if the arrowElement isn't a query selector we must check that the
      // provided DOM node is child of its popper node
      if (!data.instance.popper.contains(arrowElement)) {
        return data;
      }
    }

    var placement = data.placement.split('-')[0];
    var _data$offsets = data.offsets,
        popper = _data$offsets.popper,
        reference = _data$offsets.reference;

    var isVertical = ['left', 'right'].indexOf(placement) !== -1;

    var len = isVertical ? 'height' : 'width';
    var sideCapitalized = isVertical ? 'Top' : 'Left';
    var side = sideCapitalized.toLowerCase();
    var altSide = isVertical ? 'left' : 'top';
    var opSide = isVertical ? 'bottom' : 'right';
    var arrowElementSize = getOuterSizes(arrowElement)[len];

    //
    // extends keepTogether behavior making sure the popper and its
    // reference have enough pixels in conjunction
    //

    // top/left side
    if (reference[opSide] - arrowElementSize < popper[side]) {
      data.offsets.popper[side] -= popper[side] - (reference[opSide] - arrowElementSize);
    }
    // bottom/right side
    if (reference[side] + arrowElementSize > popper[opSide]) {
      data.offsets.popper[side] += reference[side] + arrowElementSize - popper[opSide];
    }
    data.offsets.popper = getClientRect(data.offsets.popper);

    // compute center of the popper
    var center = reference[side] + reference[len] / 2 - arrowElementSize / 2;

    // Compute the sideValue using the updated popper offsets
    // take popper margin in account because we don't have this info available
    var css = getStyleComputedProperty(data.instance.popper);
    var popperMarginSide = parseFloat(css['margin' + sideCapitalized]);
    var popperBorderSide = parseFloat(css['border' + sideCapitalized + 'Width']);
    var sideValue = center - data.offsets.popper[side] - popperMarginSide - popperBorderSide;

    // prevent arrowElement from being placed not contiguously to its popper
    sideValue = Math.max(Math.min(popper[len] - arrowElementSize, sideValue), 0);

    data.arrowElement = arrowElement;
    data.offsets.arrow = (_data$offsets$arrow = {}, defineProperty(_data$offsets$arrow, side, Math.round(sideValue)), defineProperty(_data$offsets$arrow, altSide, ''), _data$offsets$arrow);

    return data;
  }

  /**
   * Get the opposite placement variation of the given one
   * @method
   * @memberof Popper.Utils
   * @argument {String} placement variation
   * @returns {String} flipped placement variation
   */
  function getOppositeVariation(variation) {
    if (variation === 'end') {
      return 'start';
    } else if (variation === 'start') {
      return 'end';
    }
    return variation;
  }

  /**
   * List of accepted placements to use as values of the `placement` option.<br />
   * Valid placements are:
   * - `auto`
   * - `top`
   * - `right`
   * - `bottom`
   * - `left`
   *
   * Each placement can have a variation from this list:
   * - `-start`
   * - `-end`
   *
   * Variations are interpreted easily if you think of them as the left to right
   * written languages. Horizontally (`top` and `bottom`), `start` is left and `end`
   * is right.<br />
   * Vertically (`left` and `right`), `start` is top and `end` is bottom.
   *
   * Some valid examples are:
   * - `top-end` (on top of reference, right aligned)
   * - `right-start` (on right of reference, top aligned)
   * - `bottom` (on bottom, centered)
   * - `auto-end` (on the side with more space available, alignment depends by placement)
   *
   * @static
   * @type {Array}
   * @enum {String}
   * @readonly
   * @method placements
   * @memberof Popper
   */
  var placements = ['auto-start', 'auto', 'auto-end', 'top-start', 'top', 'top-end', 'right-start', 'right', 'right-end', 'bottom-end', 'bottom', 'bottom-start', 'left-end', 'left', 'left-start'];

  // Get rid of `auto` `auto-start` and `auto-end`
  var validPlacements = placements.slice(3);

  /**
   * Given an initial placement, returns all the subsequent placements
   * clockwise (or counter-clockwise).
   *
   * @method
   * @memberof Popper.Utils
   * @argument {String} placement - A valid placement (it accepts variations)
   * @argument {Boolean} counter - Set to true to walk the placements counterclockwise
   * @returns {Array} placements including their variations
   */
  function clockwise(placement) {
    var counter = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : false;

    var index = validPlacements.indexOf(placement);
    var arr = validPlacements.slice(index + 1).concat(validPlacements.slice(0, index));
    return counter ? arr.reverse() : arr;
  }

  var BEHAVIORS = {
    FLIP: 'flip',
    CLOCKWISE: 'clockwise',
    COUNTERCLOCKWISE: 'counterclockwise'
  };

  /**
   * @function
   * @memberof Modifiers
   * @argument {Object} data - The data object generated by update method
   * @argument {Object} options - Modifiers configuration and options
   * @returns {Object} The data object, properly modified
   */
  function flip(data, options) {
    // if `inner` modifier is enabled, we can't use the `flip` modifier
    if (isModifierEnabled(data.instance.modifiers, 'inner')) {
      return data;
    }

    if (data.flipped && data.placement === data.originalPlacement) {
      // seems like flip is trying to loop, probably there's not enough space on any of the flippable sides
      return data;
    }

    var boundaries = getBoundaries(data.instance.popper, data.instance.reference, options.padding, options.boundariesElement, data.positionFixed);

    var placement = data.placement.split('-')[0];
    var placementOpposite = getOppositePlacement(placement);
    var variation = data.placement.split('-')[1] || '';

    var flipOrder = [];

    switch (options.behavior) {
      case BEHAVIORS.FLIP:
        flipOrder = [placement, placementOpposite];
        break;
      case BEHAVIORS.CLOCKWISE:
        flipOrder = clockwise(placement);
        break;
      case BEHAVIORS.COUNTERCLOCKWISE:
        flipOrder = clockwise(placement, true);
        break;
      default:
        flipOrder = options.behavior;
    }

    flipOrder.forEach(function (step, index) {
      if (placement !== step || flipOrder.length === index + 1) {
        return data;
      }

      placement = data.placement.split('-')[0];
      placementOpposite = getOppositePlacement(placement);

      var popperOffsets = data.offsets.popper;
      var refOffsets = data.offsets.reference;

      // using floor because the reference offsets may contain decimals we are not going to consider here
      var floor = Math.floor;
      var overlapsRef = placement === 'left' && floor(popperOffsets.right) > floor(refOffsets.left) || placement === 'right' && floor(popperOffsets.left) < floor(refOffsets.right) || placement === 'top' && floor(popperOffsets.bottom) > floor(refOffsets.top) || placement === 'bottom' && floor(popperOffsets.top) < floor(refOffsets.bottom);

      var overflowsLeft = floor(popperOffsets.left) < floor(boundaries.left);
      var overflowsRight = floor(popperOffsets.right) > floor(boundaries.right);
      var overflowsTop = floor(popperOffsets.top) < floor(boundaries.top);
      var overflowsBottom = floor(popperOffsets.bottom) > floor(boundaries.bottom);

      var overflowsBoundaries = placement === 'left' && overflowsLeft || placement === 'right' && overflowsRight || placement === 'top' && overflowsTop || placement === 'bottom' && overflowsBottom;

      // flip the variation if required
      var isVertical = ['top', 'bottom'].indexOf(placement) !== -1;

      // flips variation if reference element overflows boundaries
      var flippedVariationByRef = !!options.flipVariations && (isVertical && variation === 'start' && overflowsLeft || isVertical && variation === 'end' && overflowsRight || !isVertical && variation === 'start' && overflowsTop || !isVertical && variation === 'end' && overflowsBottom);

      // flips variation if popper content overflows boundaries
      var flippedVariationByContent = !!options.flipVariationsByContent && (isVertical && variation === 'start' && overflowsRight || isVertical && variation === 'end' && overflowsLeft || !isVertical && variation === 'start' && overflowsBottom || !isVertical && variation === 'end' && overflowsTop);

      var flippedVariation = flippedVariationByRef || flippedVariationByContent;

      if (overlapsRef || overflowsBoundaries || flippedVariation) {
        // this boolean to detect any flip loop
        data.flipped = true;

        if (overlapsRef || overflowsBoundaries) {
          placement = flipOrder[index + 1];
        }

        if (flippedVariation) {
          variation = getOppositeVariation(variation);
        }

        data.placement = placement + (variation ? '-' + variation : '');

        // this object contains `position`, we want to preserve it along with
        // any additional property we may add in the future
        data.offsets.popper = _extends({}, data.offsets.popper, getPopperOffsets(data.instance.popper, data.offsets.reference, data.placement));

        data = runModifiers(data.instance.modifiers, data, 'flip');
      }
    });
    return data;
  }

  /**
   * @function
   * @memberof Modifiers
   * @argument {Object} data - The data object generated by update method
   * @argument {Object} options - Modifiers configuration and options
   * @returns {Object} The data object, properly modified
   */
  function keepTogether(data) {
    var _data$offsets = data.offsets,
        popper = _data$offsets.popper,
        reference = _data$offsets.reference;

    var placement = data.placement.split('-')[0];
    var floor = Math.floor;
    var isVertical = ['top', 'bottom'].indexOf(placement) !== -1;
    var side = isVertical ? 'right' : 'bottom';
    var opSide = isVertical ? 'left' : 'top';
    var measurement = isVertical ? 'width' : 'height';

    if (popper[side] < floor(reference[opSide])) {
      data.offsets.popper[opSide] = floor(reference[opSide]) - popper[measurement];
    }
    if (popper[opSide] > floor(reference[side])) {
      data.offsets.popper[opSide] = floor(reference[side]);
    }

    return data;
  }

  /**
   * Converts a string containing value + unit into a px value number
   * @function
   * @memberof {modifiers~offset}
   * @private
   * @argument {String} str - Value + unit string
   * @argument {String} measurement - `height` or `width`
   * @argument {Object} popperOffsets
   * @argument {Object} referenceOffsets
   * @returns {Number|String}
   * Value in pixels, or original string if no values were extracted
   */
  function toValue(str, measurement, popperOffsets, referenceOffsets) {
    // separate value from unit
    var split = str.match(/((?:\-|\+)?\d*\.?\d*)(.*)/);
    var value = +split[1];
    var unit = split[2];

    // If it's not a number it's an operator, I guess
    if (!value) {
      return str;
    }

    if (unit.indexOf('%') === 0) {
      var element = void 0;
      switch (unit) {
        case '%p':
          element = popperOffsets;
          break;
        case '%':
        case '%r':
        default:
          element = referenceOffsets;
      }

      var rect = getClientRect(element);
      return rect[measurement] / 100 * value;
    } else if (unit === 'vh' || unit === 'vw') {
      // if is a vh or vw, we calculate the size based on the viewport
      var size = void 0;
      if (unit === 'vh') {
        size = Math.max(document.documentElement.clientHeight, window.innerHeight || 0);
      } else {
        size = Math.max(document.documentElement.clientWidth, window.innerWidth || 0);
      }
      return size / 100 * value;
    } else {
      // if is an explicit pixel unit, we get rid of the unit and keep the value
      // if is an implicit unit, it's px, and we return just the value
      return value;
    }
  }

  /**
   * Parse an `offset` string to extrapolate `x` and `y` numeric offsets.
   * @function
   * @memberof {modifiers~offset}
   * @private
   * @argument {String} offset
   * @argument {Object} popperOffsets
   * @argument {Object} referenceOffsets
   * @argument {String} basePlacement
   * @returns {Array} a two cells array with x and y offsets in numbers
   */
  function parseOffset(offset, popperOffsets, referenceOffsets, basePlacement) {
    var offsets = [0, 0];

    // Use height if placement is left or right and index is 0 otherwise use width
    // in this way the first offset will use an axis and the second one
    // will use the other one
    var useHeight = ['right', 'left'].indexOf(basePlacement) !== -1;

    // Split the offset string to obtain a list of values and operands
    // The regex addresses values with the plus or minus sign in front (+10, -20, etc)
    var fragments = offset.split(/(\+|\-)/).map(function (frag) {
      return frag.trim();
    });

    // Detect if the offset string contains a pair of values or a single one
    // they could be separated by comma or space
    var divider = fragments.indexOf(find(fragments, function (frag) {
      return frag.search(/,|\s/) !== -1;
    }));

    if (fragments[divider] && fragments[divider].indexOf(',') === -1) ;

    // If divider is found, we divide the list of values and operands to divide
    // them by ofset X and Y.
    var splitRegex = /\s*,\s*|\s+/;
    var ops = divider !== -1 ? [fragments.slice(0, divider).concat([fragments[divider].split(splitRegex)[0]]), [fragments[divider].split(splitRegex)[1]].concat(fragments.slice(divider + 1))] : [fragments];

    // Convert the values with units to absolute pixels to allow our computations
    ops = ops.map(function (op, index) {
      // Most of the units rely on the orientation of the popper
      var measurement = (index === 1 ? !useHeight : useHeight) ? 'height' : 'width';
      var mergeWithPrevious = false;
      return op
      // This aggregates any `+` or `-` sign that aren't considered operators
      // e.g.: 10 + +5 => [10, +, +5]
      .reduce(function (a, b) {
        if (a[a.length - 1] === '' && ['+', '-'].indexOf(b) !== -1) {
          a[a.length - 1] = b;
          mergeWithPrevious = true;
          return a;
        } else if (mergeWithPrevious) {
          a[a.length - 1] += b;
          mergeWithPrevious = false;
          return a;
        } else {
          return a.concat(b);
        }
      }, [])
      // Here we convert the string values into number values (in px)
      .map(function (str) {
        return toValue(str, measurement, popperOffsets, referenceOffsets);
      });
    });

    // Loop trough the offsets arrays and execute the operations
    ops.forEach(function (op, index) {
      op.forEach(function (frag, index2) {
        if (isNumeric(frag)) {
          offsets[index] += frag * (op[index2 - 1] === '-' ? -1 : 1);
        }
      });
    });
    return offsets;
  }

  /**
   * @function
   * @memberof Modifiers
   * @argument {Object} data - The data object generated by update method
   * @argument {Object} options - Modifiers configuration and options
   * @argument {Number|String} options.offset=0
   * The offset value as described in the modifier description
   * @returns {Object} The data object, properly modified
   */
  function offset(data, _ref) {
    var offset = _ref.offset;
    var placement = data.placement,
        _data$offsets = data.offsets,
        popper = _data$offsets.popper,
        reference = _data$offsets.reference;

    var basePlacement = placement.split('-')[0];

    var offsets = void 0;
    if (isNumeric(+offset)) {
      offsets = [+offset, 0];
    } else {
      offsets = parseOffset(offset, popper, reference, basePlacement);
    }

    if (basePlacement === 'left') {
      popper.top += offsets[0];
      popper.left -= offsets[1];
    } else if (basePlacement === 'right') {
      popper.top += offsets[0];
      popper.left += offsets[1];
    } else if (basePlacement === 'top') {
      popper.left += offsets[0];
      popper.top -= offsets[1];
    } else if (basePlacement === 'bottom') {
      popper.left += offsets[0];
      popper.top += offsets[1];
    }

    data.popper = popper;
    return data;
  }

  /**
   * @function
   * @memberof Modifiers
   * @argument {Object} data - The data object generated by `update` method
   * @argument {Object} options - Modifiers configuration and options
   * @returns {Object} The data object, properly modified
   */
  function preventOverflow(data, options) {
    var boundariesElement = options.boundariesElement || getOffsetParent(data.instance.popper);

    // If offsetParent is the reference element, we really want to
    // go one step up and use the next offsetParent as reference to
    // avoid to make this modifier completely useless and look like broken
    if (data.instance.reference === boundariesElement) {
      boundariesElement = getOffsetParent(boundariesElement);
    }

    // NOTE: DOM access here
    // resets the popper's position so that the document size can be calculated excluding
    // the size of the popper element itself
    var transformProp = getSupportedPropertyName('transform');
    var popperStyles = data.instance.popper.style; // assignment to help minification
    var top = popperStyles.top,
        left = popperStyles.left,
        transform = popperStyles[transformProp];

    popperStyles.top = '';
    popperStyles.left = '';
    popperStyles[transformProp] = '';

    var boundaries = getBoundaries(data.instance.popper, data.instance.reference, options.padding, boundariesElement, data.positionFixed);

    // NOTE: DOM access here
    // restores the original style properties after the offsets have been computed
    popperStyles.top = top;
    popperStyles.left = left;
    popperStyles[transformProp] = transform;

    options.boundaries = boundaries;

    var order = options.priority;
    var popper = data.offsets.popper;

    var check = {
      primary: function primary(placement) {
        var value = popper[placement];
        if (popper[placement] < boundaries[placement] && !options.escapeWithReference) {
          value = Math.max(popper[placement], boundaries[placement]);
        }
        return defineProperty({}, placement, value);
      },
      secondary: function secondary(placement) {
        var mainSide = placement === 'right' ? 'left' : 'top';
        var value = popper[mainSide];
        if (popper[placement] > boundaries[placement] && !options.escapeWithReference) {
          value = Math.min(popper[mainSide], boundaries[placement] - (placement === 'right' ? popper.width : popper.height));
        }
        return defineProperty({}, mainSide, value);
      }
    };

    order.forEach(function (placement) {
      var side = ['left', 'top'].indexOf(placement) !== -1 ? 'primary' : 'secondary';
      popper = _extends({}, popper, check[side](placement));
    });

    data.offsets.popper = popper;

    return data;
  }

  /**
   * @function
   * @memberof Modifiers
   * @argument {Object} data - The data object generated by `update` method
   * @argument {Object} options - Modifiers configuration and options
   * @returns {Object} The data object, properly modified
   */
  function shift(data) {
    var placement = data.placement;
    var basePlacement = placement.split('-')[0];
    var shiftvariation = placement.split('-')[1];

    // if shift shiftvariation is specified, run the modifier
    if (shiftvariation) {
      var _data$offsets = data.offsets,
          reference = _data$offsets.reference,
          popper = _data$offsets.popper;

      var isVertical = ['bottom', 'top'].indexOf(basePlacement) !== -1;
      var side = isVertical ? 'left' : 'top';
      var measurement = isVertical ? 'width' : 'height';

      var shiftOffsets = {
        start: defineProperty({}, side, reference[side]),
        end: defineProperty({}, side, reference[side] + reference[measurement] - popper[measurement])
      };

      data.offsets.popper = _extends({}, popper, shiftOffsets[shiftvariation]);
    }

    return data;
  }

  /**
   * @function
   * @memberof Modifiers
   * @argument {Object} data - The data object generated by update method
   * @argument {Object} options - Modifiers configuration and options
   * @returns {Object} The data object, properly modified
   */
  function hide(data) {
    if (!isModifierRequired(data.instance.modifiers, 'hide', 'preventOverflow')) {
      return data;
    }

    var refRect = data.offsets.reference;
    var bound = find(data.instance.modifiers, function (modifier) {
      return modifier.name === 'preventOverflow';
    }).boundaries;

    if (refRect.bottom < bound.top || refRect.left > bound.right || refRect.top > bound.bottom || refRect.right < bound.left) {
      // Avoid unnecessary DOM access if visibility hasn't changed
      if (data.hide === true) {
        return data;
      }

      data.hide = true;
      data.attributes['x-out-of-boundaries'] = '';
    } else {
      // Avoid unnecessary DOM access if visibility hasn't changed
      if (data.hide === false) {
        return data;
      }

      data.hide = false;
      data.attributes['x-out-of-boundaries'] = false;
    }

    return data;
  }

  /**
   * @function
   * @memberof Modifiers
   * @argument {Object} data - The data object generated by `update` method
   * @argument {Object} options - Modifiers configuration and options
   * @returns {Object} The data object, properly modified
   */
  function inner(data) {
    var placement = data.placement;
    var basePlacement = placement.split('-')[0];
    var _data$offsets = data.offsets,
        popper = _data$offsets.popper,
        reference = _data$offsets.reference;

    var isHoriz = ['left', 'right'].indexOf(basePlacement) !== -1;

    var subtractLength = ['top', 'left'].indexOf(basePlacement) === -1;

    popper[isHoriz ? 'left' : 'top'] = reference[basePlacement] - (subtractLength ? popper[isHoriz ? 'width' : 'height'] : 0);

    data.placement = getOppositePlacement(placement);
    data.offsets.popper = getClientRect(popper);

    return data;
  }

  /**
   * Modifier function, each modifier can have a function of this type assigned
   * to its `fn` property.<br />
   * These functions will be called on each update, this means that you must
   * make sure they are performant enough to avoid performance bottlenecks.
   *
   * @function ModifierFn
   * @argument {dataObject} data - The data object generated by `update` method
   * @argument {Object} options - Modifiers configuration and options
   * @returns {dataObject} The data object, properly modified
   */

  /**
   * Modifiers are plugins used to alter the behavior of your poppers.<br />
   * Popper.js uses a set of 9 modifiers to provide all the basic functionalities
   * needed by the library.
   *
   * Usually you don't want to override the `order`, `fn` and `onLoad` props.
   * All the other properties are configurations that could be tweaked.
   * @namespace modifiers
   */
  var modifiers = {
    /**
     * Modifier used to shift the popper on the start or end of its reference
     * element.<br />
     * It will read the variation of the `placement` property.<br />
     * It can be one either `-end` or `-start`.
     * @memberof modifiers
     * @inner
     */
    shift: {
      /** @prop {number} order=100 - Index used to define the order of execution */
      order: 100,
      /** @prop {Boolean} enabled=true - Whether the modifier is enabled or not */
      enabled: true,
      /** @prop {ModifierFn} */
      fn: shift
    },

    /**
     * The `offset` modifier can shift your popper on both its axis.
     *
     * It accepts the following units:
     * - `px` or unit-less, interpreted as pixels
     * - `%` or `%r`, percentage relative to the length of the reference element
     * - `%p`, percentage relative to the length of the popper element
     * - `vw`, CSS viewport width unit
     * - `vh`, CSS viewport height unit
     *
     * For length is intended the main axis relative to the placement of the popper.<br />
     * This means that if the placement is `top` or `bottom`, the length will be the
     * `width`. In case of `left` or `right`, it will be the `height`.
     *
     * You can provide a single value (as `Number` or `String`), or a pair of values
     * as `String` divided by a comma or one (or more) white spaces.<br />
     * The latter is a deprecated method because it leads to confusion and will be
     * removed in v2.<br />
     * Additionally, it accepts additions and subtractions between different units.
     * Note that multiplications and divisions aren't supported.
     *
     * Valid examples are:
     * ```
     * 10
     * '10%'
     * '10, 10'
     * '10%, 10'
     * '10 + 10%'
     * '10 - 5vh + 3%'
     * '-10px + 5vh, 5px - 6%'
     * ```
     * > **NB**: If you desire to apply offsets to your poppers in a way that may make them overlap
     * > with their reference element, unfortunately, you will have to disable the `flip` modifier.
     * > You can read more on this at this [issue](https://github.com/FezVrasta/popper.js/issues/373).
     *
     * @memberof modifiers
     * @inner
     */
    offset: {
      /** @prop {number} order=200 - Index used to define the order of execution */
      order: 200,
      /** @prop {Boolean} enabled=true - Whether the modifier is enabled or not */
      enabled: true,
      /** @prop {ModifierFn} */
      fn: offset,
      /** @prop {Number|String} offset=0
       * The offset value as described in the modifier description
       */
      offset: 0
    },

    /**
     * Modifier used to prevent the popper from being positioned outside the boundary.
     *
     * A scenario exists where the reference itself is not within the boundaries.<br />
     * We can say it has "escaped the boundaries" — or just "escaped".<br />
     * In this case we need to decide whether the popper should either:
     *
     * - detach from the reference and remain "trapped" in the boundaries, or
     * - if it should ignore the boundary and "escape with its reference"
     *
     * When `escapeWithReference` is set to`true` and reference is completely
     * outside its boundaries, the popper will overflow (or completely leave)
     * the boundaries in order to remain attached to the edge of the reference.
     *
     * @memberof modifiers
     * @inner
     */
    preventOverflow: {
      /** @prop {number} order=300 - Index used to define the order of execution */
      order: 300,
      /** @prop {Boolean} enabled=true - Whether the modifier is enabled or not */
      enabled: true,
      /** @prop {ModifierFn} */
      fn: preventOverflow,
      /**
       * @prop {Array} [priority=['left','right','top','bottom']]
       * Popper will try to prevent overflow following these priorities by default,
       * then, it could overflow on the left and on top of the `boundariesElement`
       */
      priority: ['left', 'right', 'top', 'bottom'],
      /**
       * @prop {number} padding=5
       * Amount of pixel used to define a minimum distance between the boundaries
       * and the popper. This makes sure the popper always has a little padding
       * between the edges of its container
       */
      padding: 5,
      /**
       * @prop {String|HTMLElement} boundariesElement='scrollParent'
       * Boundaries used by the modifier. Can be `scrollParent`, `window`,
       * `viewport` or any DOM element.
       */
      boundariesElement: 'scrollParent'
    },

    /**
     * Modifier used to make sure the reference and its popper stay near each other
     * without leaving any gap between the two. Especially useful when the arrow is
     * enabled and you want to ensure that it points to its reference element.
     * It cares only about the first axis. You can still have poppers with margin
     * between the popper and its reference element.
     * @memberof modifiers
     * @inner
     */
    keepTogether: {
      /** @prop {number} order=400 - Index used to define the order of execution */
      order: 400,
      /** @prop {Boolean} enabled=true - Whether the modifier is enabled or not */
      enabled: true,
      /** @prop {ModifierFn} */
      fn: keepTogether
    },

    /**
     * This modifier is used to move the `arrowElement` of the popper to make
     * sure it is positioned between the reference element and its popper element.
     * It will read the outer size of the `arrowElement` node to detect how many
     * pixels of conjunction are needed.
     *
     * It has no effect if no `arrowElement` is provided.
     * @memberof modifiers
     * @inner
     */
    arrow: {
      /** @prop {number} order=500 - Index used to define the order of execution */
      order: 500,
      /** @prop {Boolean} enabled=true - Whether the modifier is enabled or not */
      enabled: true,
      /** @prop {ModifierFn} */
      fn: arrow,
      /** @prop {String|HTMLElement} element='[x-arrow]' - Selector or node used as arrow */
      element: '[x-arrow]'
    },

    /**
     * Modifier used to flip the popper's placement when it starts to overlap its
     * reference element.
     *
     * Requires the `preventOverflow` modifier before it in order to work.
     *
     * **NOTE:** this modifier will interrupt the current update cycle and will
     * restart it if it detects the need to flip the placement.
     * @memberof modifiers
     * @inner
     */
    flip: {
      /** @prop {number} order=600 - Index used to define the order of execution */
      order: 600,
      /** @prop {Boolean} enabled=true - Whether the modifier is enabled or not */
      enabled: true,
      /** @prop {ModifierFn} */
      fn: flip,
      /**
       * @prop {String|Array} behavior='flip'
       * The behavior used to change the popper's placement. It can be one of
       * `flip`, `clockwise`, `counterclockwise` or an array with a list of valid
       * placements (with optional variations)
       */
      behavior: 'flip',
      /**
       * @prop {number} padding=5
       * The popper will flip if it hits the edges of the `boundariesElement`
       */
      padding: 5,
      /**
       * @prop {String|HTMLElement} boundariesElement='viewport'
       * The element which will define the boundaries of the popper position.
       * The popper will never be placed outside of the defined boundaries
       * (except if `keepTogether` is enabled)
       */
      boundariesElement: 'viewport',
      /**
       * @prop {Boolean} flipVariations=false
       * The popper will switch placement variation between `-start` and `-end` when
       * the reference element overlaps its boundaries.
       *
       * The original placement should have a set variation.
       */
      flipVariations: false,
      /**
       * @prop {Boolean} flipVariationsByContent=false
       * The popper will switch placement variation between `-start` and `-end` when
       * the popper element overlaps its reference boundaries.
       *
       * The original placement should have a set variation.
       */
      flipVariationsByContent: false
    },

    /**
     * Modifier used to make the popper flow toward the inner of the reference element.
     * By default, when this modifier is disabled, the popper will be placed outside
     * the reference element.
     * @memberof modifiers
     * @inner
     */
    inner: {
      /** @prop {number} order=700 - Index used to define the order of execution */
      order: 700,
      /** @prop {Boolean} enabled=false - Whether the modifier is enabled or not */
      enabled: false,
      /** @prop {ModifierFn} */
      fn: inner
    },

    /**
     * Modifier used to hide the popper when its reference element is outside of the
     * popper boundaries. It will set a `x-out-of-boundaries` attribute which can
     * be used to hide with a CSS selector the popper when its reference is
     * out of boundaries.
     *
     * Requires the `preventOverflow` modifier before it in order to work.
     * @memberof modifiers
     * @inner
     */
    hide: {
      /** @prop {number} order=800 - Index used to define the order of execution */
      order: 800,
      /** @prop {Boolean} enabled=true - Whether the modifier is enabled or not */
      enabled: true,
      /** @prop {ModifierFn} */
      fn: hide
    },

    /**
     * Computes the style that will be applied to the popper element to gets
     * properly positioned.
     *
     * Note that this modifier will not touch the DOM, it just prepares the styles
     * so that `applyStyle` modifier can apply it. This separation is useful
     * in case you need to replace `applyStyle` with a custom implementation.
     *
     * This modifier has `850` as `order` value to maintain backward compatibility
     * with previous versions of Popper.js. Expect the modifiers ordering method
     * to change in future major versions of the library.
     *
     * @memberof modifiers
     * @inner
     */
    computeStyle: {
      /** @prop {number} order=850 - Index used to define the order of execution */
      order: 850,
      /** @prop {Boolean} enabled=true - Whether the modifier is enabled or not */
      enabled: true,
      /** @prop {ModifierFn} */
      fn: computeStyle,
      /**
       * @prop {Boolean} gpuAcceleration=true
       * If true, it uses the CSS 3D transformation to position the popper.
       * Otherwise, it will use the `top` and `left` properties
       */
      gpuAcceleration: true,
      /**
       * @prop {string} [x='bottom']
       * Where to anchor the X axis (`bottom` or `top`). AKA X offset origin.
       * Change this if your popper should grow in a direction different from `bottom`
       */
      x: 'bottom',
      /**
       * @prop {string} [x='left']
       * Where to anchor the Y axis (`left` or `right`). AKA Y offset origin.
       * Change this if your popper should grow in a direction different from `right`
       */
      y: 'right'
    },

    /**
     * Applies the computed styles to the popper element.
     *
     * All the DOM manipulations are limited to this modifier. This is useful in case
     * you want to integrate Popper.js inside a framework or view library and you
     * want to delegate all the DOM manipulations to it.
     *
     * Note that if you disable this modifier, you must make sure the popper element
     * has its position set to `absolute` before Popper.js can do its work!
     *
     * Just disable this modifier and define your own to achieve the desired effect.
     *
     * @memberof modifiers
     * @inner
     */
    applyStyle: {
      /** @prop {number} order=900 - Index used to define the order of execution */
      order: 900,
      /** @prop {Boolean} enabled=true - Whether the modifier is enabled or not */
      enabled: true,
      /** @prop {ModifierFn} */
      fn: applyStyle,
      /** @prop {Function} */
      onLoad: applyStyleOnLoad,
      /**
       * @deprecated since version 1.10.0, the property moved to `computeStyle` modifier
       * @prop {Boolean} gpuAcceleration=true
       * If true, it uses the CSS 3D transformation to position the popper.
       * Otherwise, it will use the `top` and `left` properties
       */
      gpuAcceleration: undefined
    }
  };

  /**
   * The `dataObject` is an object containing all the information used by Popper.js.
   * This object is passed to modifiers and to the `onCreate` and `onUpdate` callbacks.
   * @name dataObject
   * @property {Object} data.instance The Popper.js instance
   * @property {String} data.placement Placement applied to popper
   * @property {String} data.originalPlacement Placement originally defined on init
   * @property {Boolean} data.flipped True if popper has been flipped by flip modifier
   * @property {Boolean} data.hide True if the reference element is out of boundaries, useful to know when to hide the popper
   * @property {HTMLElement} data.arrowElement Node used as arrow by arrow modifier
   * @property {Object} data.styles Any CSS property defined here will be applied to the popper. It expects the JavaScript nomenclature (eg. `marginBottom`)
   * @property {Object} data.arrowStyles Any CSS property defined here will be applied to the popper arrow. It expects the JavaScript nomenclature (eg. `marginBottom`)
   * @property {Object} data.boundaries Offsets of the popper boundaries
   * @property {Object} data.offsets The measurements of popper, reference and arrow elements
   * @property {Object} data.offsets.popper `top`, `left`, `width`, `height` values
   * @property {Object} data.offsets.reference `top`, `left`, `width`, `height` values
   * @property {Object} data.offsets.arrow] `top` and `left` offsets, only one of them will be different from 0
   */

  /**
   * Default options provided to Popper.js constructor.<br />
   * These can be overridden using the `options` argument of Popper.js.<br />
   * To override an option, simply pass an object with the same
   * structure of the `options` object, as the 3rd argument. For example:
   * ```
   * new Popper(ref, pop, {
   *   modifiers: {
   *     preventOverflow: { enabled: false }
   *   }
   * })
   * ```
   * @type {Object}
   * @static
   * @memberof Popper
   */
  var Defaults = {
    /**
     * Popper's placement.
     * @prop {Popper.placements} placement='bottom'
     */
    placement: 'bottom',

    /**
     * Set this to true if you want popper to position it self in 'fixed' mode
     * @prop {Boolean} positionFixed=false
     */
    positionFixed: false,

    /**
     * Whether events (resize, scroll) are initially enabled.
     * @prop {Boolean} eventsEnabled=true
     */
    eventsEnabled: true,

    /**
     * Set to true if you want to automatically remove the popper when
     * you call the `destroy` method.
     * @prop {Boolean} removeOnDestroy=false
     */
    removeOnDestroy: false,

    /**
     * Callback called when the popper is created.<br />
     * By default, it is set to no-op.<br />
     * Access Popper.js instance with `data.instance`.
     * @prop {onCreate}
     */
    onCreate: function onCreate() {},

    /**
     * Callback called when the popper is updated. This callback is not called
     * on the initialization/creation of the popper, but only on subsequent
     * updates.<br />
     * By default, it is set to no-op.<br />
     * Access Popper.js instance with `data.instance`.
     * @prop {onUpdate}
     */
    onUpdate: function onUpdate() {},

    /**
     * List of modifiers used to modify the offsets before they are applied to the popper.
     * They provide most of the functionalities of Popper.js.
     * @prop {modifiers}
     */
    modifiers: modifiers
  };

  /**
   * @callback onCreate
   * @param {dataObject} data
   */

  /**
   * @callback onUpdate
   * @param {dataObject} data
   */

  // Utils
  // Methods
  var Popper = function () {
    /**
     * Creates a new Popper.js instance.
     * @class Popper
     * @param {Element|referenceObject} reference - The reference element used to position the popper
     * @param {Element} popper - The HTML / XML element used as the popper
     * @param {Object} options - Your custom options to override the ones defined in [Defaults](#defaults)
     * @return {Object} instance - The generated Popper.js instance
     */
    function Popper(reference, popper) {
      var _this = this;

      var options = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {};
      classCallCheck(this, Popper);

      this.scheduleUpdate = function () {
        return requestAnimationFrame(_this.update);
      };

      // make update() debounced, so that it only runs at most once-per-tick
      this.update = debounce(this.update.bind(this));

      // with {} we create a new object with the options inside it
      this.options = _extends({}, Popper.Defaults, options);

      // init state
      this.state = {
        isDestroyed: false,
        isCreated: false,
        scrollParents: []
      };

      // get reference and popper elements (allow jQuery wrappers)
      this.reference = reference && reference.jquery ? reference[0] : reference;
      this.popper = popper && popper.jquery ? popper[0] : popper;

      // Deep merge modifiers options
      this.options.modifiers = {};
      Object.keys(_extends({}, Popper.Defaults.modifiers, options.modifiers)).forEach(function (name) {
        _this.options.modifiers[name] = _extends({}, Popper.Defaults.modifiers[name] || {}, options.modifiers ? options.modifiers[name] : {});
      });

      // Refactoring modifiers' list (Object => Array)
      this.modifiers = Object.keys(this.options.modifiers).map(function (name) {
        return _extends({
          name: name
        }, _this.options.modifiers[name]);
      })
      // sort the modifiers by order
      .sort(function (a, b) {
        return a.order - b.order;
      });

      // modifiers have the ability to execute arbitrary code when Popper.js get inited
      // such code is executed in the same order of its modifier
      // they could add new properties to their options configuration
      // BE AWARE: don't add options to `options.modifiers.name` but to `modifierOptions`!
      this.modifiers.forEach(function (modifierOptions) {
        if (modifierOptions.enabled && isFunction$1(modifierOptions.onLoad)) {
          modifierOptions.onLoad(_this.reference, _this.popper, _this.options, modifierOptions, _this.state);
        }
      });

      // fire the first update to position the popper in the right place
      this.update();

      var eventsEnabled = this.options.eventsEnabled;
      if (eventsEnabled) {
        // setup event listeners, they will take care of update the position in specific situations
        this.enableEventListeners();
      }

      this.state.eventsEnabled = eventsEnabled;
    }

    // We can't use class properties because they don't get listed in the
    // class prototype and break stuff like Sinon stubs


    createClass(Popper, [{
      key: 'update',
      value: function update$$1() {
        return update.call(this);
      }
    }, {
      key: 'destroy',
      value: function destroy$$1() {
        return destroy.call(this);
      }
    }, {
      key: 'enableEventListeners',
      value: function enableEventListeners$$1() {
        return enableEventListeners.call(this);
      }
    }, {
      key: 'disableEventListeners',
      value: function disableEventListeners$$1() {
        return disableEventListeners.call(this);
      }

      /**
       * Schedules an update. It will run on the next UI update available.
       * @method scheduleUpdate
       * @memberof Popper
       */


      /**
       * Collection of utilities useful when writing custom modifiers.
       * Starting from version 1.7, this method is available only if you
       * include `popper-utils.js` before `popper.js`.
       *
       * **DEPRECATION**: This way to access PopperUtils is deprecated
       * and will be removed in v2! Use the PopperUtils module directly instead.
       * Due to the high instability of the methods contained in Utils, we can't
       * guarantee them to follow semver. Use them at your own risk!
       * @static
       * @private
       * @type {Object}
       * @deprecated since version 1.8
       * @member Utils
       * @memberof Popper
       */

    }]);
    return Popper;
  }();

  /**
   * The `referenceObject` is an object that provides an interface compatible with Popper.js
   * and lets you use it as replacement of a real DOM node.<br />
   * You can use this method to position a popper relatively to a set of coordinates
   * in case you don't have a DOM node to use as reference.
   *
   * ```
   * new Popper(referenceObject, popperNode);
   * ```
   *
   * NB: This feature isn't supported in Internet Explorer 10.
   * @name referenceObject
   * @property {Function} data.getBoundingClientRect
   * A function that returns a set of coordinates compatible with the native `getBoundingClientRect` method.
   * @property {number} data.clientWidth
   * An ES6 getter that will return the width of the virtual reference element.
   * @property {number} data.clientHeight
   * An ES6 getter that will return the height of the virtual reference element.
   */


  Popper.Utils = (typeof window !== 'undefined' ? window : global$1).PopperUtils;
  Popper.placements = placements;
  Popper.Defaults = Defaults;

  var Popper$1 = Popper;

  /**
   * 统一前缀
   * @param {*} componentName 组件名
   * @return 带前缀的class
   */
  function getPrefixCls(componentName) {
    var prefix = 'ljc';
    if (componentName) {
      return "".concat(prefix, "-").concat(componentName);
    }
    return prefix;
  }

  //

  function on(element, event, handler, capture = false) {
    if (element && event && handler) {
      document.addEventListener
        ? element.addEventListener(event, handler, capture)
        : element.attachEvent(`on${event}`, handler);
    }
  }

  function off(element, event, handler) {
    if (element && event) {
      document.removeEventListener
        ? element.removeEventListener(event, handler, false)
        : element.detachEvent(`on${event}`, handler);
    }
  }

  var script$j = {
    props: {
      tag: {
        type: String,
        default: 'div',
      },
      popupVisible: {
        type: Boolean,
        default: false,
      },
      trigger: {
        type: String,
        default: 'hover',
        validator: (value) =>
          ['clickToOpen', 'click', 'hover', 'focus'].indexOf(value) > -1,
      },
      position: {
        type: String,
        default: 'bottom',
      },
      showArrow: {
        type: Boolean,
        default: false,
      },
      offset: {
        type: [String, Number],
        default: 0,
      },
      mouseEnterDelay: {
        type: Number,
        default: 100,
      },
      mouseLeaveDelay: {
        type: Number,
        default: 100,
      },
      disabled: {
        type: Boolean,
        default: false,
      },
      // 持续展示
      forceShow: {
        type: Boolean,
        default: false,
      },
      // 是否挂载在body下
      renderToBody: {
        type: Boolean,
        default: true,
      },
      // 是否卸载节点
      unmountOnClose: {
        type: Boolean,
        default: true,
      },
      transition: {
        type: String,
        default: '',
      },
      enterActiveClass: String,
      leaveActiveClass: String,
      boundariesSelector: String,
      // 弹出挂载容器
      popupContainer: {
        type: [String, Object],
      },
      stopPropagation: {
        type: Boolean,
        default: false,
      },
      preventDefault: {
        type: Boolean,
        default: false,
      },
      options: {
        type: Object,
        default() {
          return {};
        },
      },
      rootClass: {
        type: String,
        default: '',
      },
    },

    data() {
      return {
        prefixCls: getPrefixCls('trigger') || 'ljc',
        referenceElm: null,
        popperJS: null,
        showPopper: false,
        currentPlacement: '',
        popperOptions: {
          placement: this.position,
          modifiers: { offset: { offset: `0,${this.offset}px` } },
          computeStyle: {
            gpuAcceleration: false,
          },
        },
      };
    },

    watch: {
      showPopper(value) {
        if (value) {
          this.$emit('show', this);
          // eslint-disable-next-line no-unused-expressions
          this.popperJS ? this.popperJS.enableEventListeners() : null;
          this.updatePopper();
        } else {
          // eslint-disable-next-line no-unused-expressions
          this.popperJS ? this.popperJS.disableEventListeners() : null;
          // eslint-disable-next-line no-unused-expressions
          this.unmountOnClose ? this.doDestroy() : null;
          this.$emit('hide', this);
        }
        this.$emit('update:popupVisible', value);
        this.$emit('popupVisibleChange', value);
      },
      // 独立外部-统一由内部处理
      popupVisible(val) {
        this.showPopper = val;
      },

      forceShow: {
        handler(value) {
          this[value ? 'doShow' : 'doClose']();
        },
        immediate: true,
      },

      disabled(value) {
        this.showPopper = !value;
      },
    },

    created() {
      this.appendedArrow = false;
      this.appendedToBody = false;
      this.popperOptions = Object.assign(this.popperOptions, this.options);
    },

    mounted() {
      this.referenceElm = this.$slots.default[0].elm;
      this.popper =
        this.popupContainer || this.$refs.content || this.$slots.content[0].elm;
      switch (this.trigger) {
        case 'clickToOpen':
          on(this.referenceElm, 'click', this.doShow);
          on(document, 'click', this.handleDocumentClick, true);
          on(document, 'touchstart', this.handleDocumentClick);
          break;
        case 'click':
          on(this.referenceElm, 'click', this.doToggle);
          on(document, 'click', this.handleDocumentClick, true);
          on(document, 'touchstart', this.handleDocumentClick);
          break;
        case 'hover':
          on(this.referenceElm, 'mouseover', this.onMouseOver);
          on(this.popper, 'mouseover', this.onMouseOver);
          on(this.referenceElm, 'mouseout', this.onMouseOut);
          on(this.popper, 'mouseout', this.onMouseOut);
          break;
        case 'focus':
          on(this.referenceElm, 'focus', this.onMouseOver);
          on(this.popper, 'focus', this.onMouseOver);
          on(this.referenceElm, 'blur', this.onMouseOut);
          on(this.popper, 'blur', this.onMouseOut);
          break;
      }
    },

    methods: {
      doToggle(event) {
        this.stopPropagation && event.stopPropagation();
        this.preventDefault && event.preventDefault();
        if (!this.forceShow) {
          this.showPopper = !this.showPopper;
        }
      },

      doShow() {
        this.showPopper = true;
      },

      doClose() {
        this.showPopper = false;
      },

      doDestroy() {
        if (this.showPopper) {
          return;
        }

        if (this.popperJS) {
          this.popperJS.destroy();
          this.popperJS = null;
        }

        if (this.appendedToBody) {
          this.appendedToBody = false;
          document.body.removeChild(this.popper);
        }
      },

      createPopper() {
        this.$nextTick(() => {
          if (this.renderToBody && !this.appendedToBody) {
            this.appendedToBody = true;
            document.body.appendChild(this.popper);
          }

          if (this.popperJS && this.popperJS.destroy) {
            this.popperJS.destroy();
          }

          if (this.boundariesSelector) {
            const boundariesElement = document.querySelector(
              this.boundariesSelector
            );

            if (boundariesElement) {
              // eslint-disable-next-line prefer-object-spread
              this.popperOptions.modifiers = Object.assign(
                {},
                this.popperOptions.modifiers
              );
              // eslint-disable-next-line prefer-object-spread
              this.popperOptions.modifiers.preventOverflow = Object.assign(
                {},
                this.popperOptions.modifiers.preventOverflow
              );
              this.popperOptions.modifiers.preventOverflow.boundariesElement =
                boundariesElement;
            }
          }

          this.popperOptions.onCreate = () => {
            this.$emit('created', this);
            this.$nextTick(this.updatePopper);
          };

          this.popperJS = new Popper$1(
            this.referenceElm,
            this.popper,
            this.popperOptions
          );
        });
      },

      destroyPopper() {
        off(this.referenceElm, 'click', this.doToggle);
        off(this.referenceElm, 'mouseup', this.doClose);
        off(this.referenceElm, 'mousedown', this.doShow);
        off(this.referenceElm, 'focus', this.doShow);
        off(this.referenceElm, 'blur', this.doClose);
        off(this.referenceElm, 'mouseout', this.onMouseOut);
        off(this.referenceElm, 'mouseover', this.onMouseOver);
        off(document, 'click', this.handleDocumentClick);
        this.showPopper = false;
        this.doDestroy();
      },

      updatePopper() {
        this.popperJS ? this.popperJS.scheduleUpdate() : this.createPopper();
      },

      onMouseOver() {
        clearTimeout(this._timer);
        this._timer = setTimeout(() => {
          this.showPopper = true;
        }, this.mouseEnterDelay);
      },

      onMouseOut() {
        clearTimeout(this._timer);
        this._timer = setTimeout(() => {
          this.showPopper = false;
        }, this.mouseLeaveDelay);
      },

      handleDocumentClick(e) {
        if (
          !this.$el ||
          !this.referenceElm ||
          this.elementContains(this.$el, e.target) ||
          this.elementContains(this.referenceElm, e.target) ||
          !this.popper ||
          this.elementContains(this.popper, e.target)
        ) {
          return;
        }

        this.$emit('documentClick', this);

        if (this.forceShow) {
          return;
        }
        this.showPopper = false;
      },

      elementContains(elm, otherElm) {
        if (typeof elm.contains === 'function') {
          return elm.contains(otherElm);
        }

        return false;
      },
    },

    destroyed() {
      this.destroyPopper();
    },
  };

  function normalizeComponent(template, style, script, scopeId, isFunctionalTemplate, moduleIdentifier /* server only */, shadowMode, createInjector, createInjectorSSR, createInjectorShadow) {
      if (typeof shadowMode !== 'boolean') {
          createInjectorSSR = createInjector;
          createInjector = shadowMode;
          shadowMode = false;
      }
      // Vue.extend constructor export interop.
      const options = typeof script === 'function' ? script.options : script;
      // render functions
      if (template && template.render) {
          options.render = template.render;
          options.staticRenderFns = template.staticRenderFns;
          options._compiled = true;
          // functional template
          if (isFunctionalTemplate) {
              options.functional = true;
          }
      }
      // scopedId
      if (scopeId) {
          options._scopeId = scopeId;
      }
      let hook;
      if (moduleIdentifier) {
          // server build
          hook = function (context) {
              // 2.3 injection
              context =
                  context || // cached call
                      (this.$vnode && this.$vnode.ssrContext) || // stateful
                      (this.parent && this.parent.$vnode && this.parent.$vnode.ssrContext); // functional
              // 2.2 with runInNewContext: true
              if (!context && typeof __VUE_SSR_CONTEXT__ !== 'undefined') {
                  context = __VUE_SSR_CONTEXT__;
              }
              // inject component styles
              if (style) {
                  style.call(this, createInjectorSSR(context));
              }
              // register component module identifier for async chunk inference
              if (context && context._registeredComponents) {
                  context._registeredComponents.add(moduleIdentifier);
              }
          };
          // used by ssr in case component is cached and beforeCreate
          // never gets called
          options._ssrRegister = hook;
      }
      else if (style) {
          hook = shadowMode
              ? function (context) {
                  style.call(this, createInjectorShadow(context, this.$root.$options.shadowRoot));
              }
              : function (context) {
                  style.call(this, createInjector(context));
              };
      }
      if (hook) {
          if (options.functional) {
              // register for functional component in vue file
              const originalRender = options.render;
              options.render = function renderWithStyleInjection(h, context) {
                  hook.call(context);
                  return originalRender(h, context);
              };
          }
          else {
              // inject component registration as beforeCreate hook
              const existing = options.beforeCreate;
              options.beforeCreate = existing ? [].concat(existing, hook) : [hook];
          }
      }
      return script;
  }

  /* script */
  const __vue_script__$j = script$j;

  /* template */
  var __vue_render__$i = function () {var _vm=this;var _h=_vm.$createElement;var _c=_vm._self._c||_h;return _c(_vm.tag,{tag:"component"},[_vm._t("default"),_vm._v(" "),_c('div',{ref:"content",class:[(_vm.prefixCls + "-popup"), (_vm.prefixCls + "-position-" + _vm.position)],on:{"after-leave":_vm.doDestroy}},[_c('transition',{attrs:{"name":_vm.transition,"enter-active-class":_vm.enterActiveClass,"leave-active-class":_vm.leaveActiveClass}},[_c('div',{directives:[{name:"show",rawName:"v-show",value:(!_vm.disabled && _vm.showPopper),expression:"!disabled && showPopper"}],class:(_vm.prefixCls + "-popup-wrapper")},[_c('div',{class:[(_vm.prefixCls + "-content")]},[_vm._t("content")],2),_vm._v(" "),(_vm.showArrow)?_c('div',{ref:"arrowRef",class:[(_vm.prefixCls + "-arrow")]}):_vm._e()])])],1)],2)};
  var __vue_staticRenderFns__$i = [];

    /* style */
    const __vue_inject_styles__$j = undefined;
    /* scoped */
    const __vue_scope_id__$j = undefined;
    /* module identifier */
    const __vue_module_identifier__$j = undefined;
    /* functional template */
    const __vue_is_functional_template__$j = false;
    /* style inject */
    
    /* style inject SSR */
    
    /* style inject shadow dom */
    

    
    const __vue_component__$j = /*#__PURE__*/normalizeComponent(
      { render: __vue_render__$i, staticRenderFns: __vue_staticRenderFns__$i },
      __vue_inject_styles__$j,
      __vue_script__$j,
      __vue_scope_id__$j,
      __vue_is_functional_template__$j,
      __vue_module_identifier__$j,
      false,
      undefined,
      undefined,
      undefined
    );

  //

  var script$i = {
    name: 'IconCommon',
    props: {
      use: {
        type: String,
        default: 'calendar',
      },
    },
    data() {
      return {
        prefixCls: getPrefixCls('icon'),
        icon: {
          calendar: `<path d="M7 22h34M14 5v8m20-8v8M8 41h32a1 1 0 0 0 1-1V10a1 1 0 0 0-1-1H8a1 1 0 0 0-1 1v30a1 1 0 0 0 1 1Z"></path>`,
          circle: `<path d="M24 14v10h9.5m8.5 0c0 9.941-8.059 18-18 18S6 33.941 6 24 14.059 6 24 6s18 8.059 18 18Z"></path>`,
          close: `<path d="M9.857 9.858 24 24m0 0 14.142 14.142M24 24 38.142 9.858M24 24 9.857 38.142"></path>`,
          clockCirecle: `<path d="M24 14v10h9.5m8.5 0c0 9.941-8.059 18-18 18S6 33.941 6 24 14.059 6 24 6s18 8.059 18 18Z"></path>`,
          doubleLeft: `<path d="M36.857 9.9 22.715 24.042l14.142 14.142M25.544 9.9 11.402 24.042l14.142 14.142"></path>`,
          doubleRight: `<path d="m11.143 38.1 14.142-14.142L11.143 9.816M22.456 38.1l14.142-14.142L22.456 9.816"></path>`,
          left: `<path d="M32 8.4 16.444 23.956 32 39.513"></path>`,
          right: `<path d="m16 39.513 15.556-15.557L16 8.4"></path>`,
        },
      };
    },
  };

  /* script */
  const __vue_script__$i = script$i;

  /* template */
  var __vue_render__$h = function () {var _vm=this;var _h=_vm.$createElement;var _c=_vm._self._c||_h;return _c('svg',{class:_vm.prefixCls,attrs:{"viewBox":"0 0 48 48","fill":"none","xmlns":"http://www.w3.org/2000/svg","stroke":"currentColor","stroke-width":4,"stroke-linecap":"butt","stroke-linejoin":"miter"},domProps:{"innerHTML":_vm._s(_vm.icon[_vm.use])}})};
  var __vue_staticRenderFns__$h = [];

    /* style */
    const __vue_inject_styles__$i = undefined;
    /* scoped */
    const __vue_scope_id__$i = undefined;
    /* module identifier */
    const __vue_module_identifier__$i = undefined;
    /* functional template */
    const __vue_is_functional_template__$i = false;
    /* style inject */
    
    /* style inject SSR */
    
    /* style inject shadow dom */
    

    
    const __vue_component__$i = /*#__PURE__*/normalizeComponent(
      { render: __vue_render__$h, staticRenderFns: __vue_staticRenderFns__$h },
      __vue_inject_styles__$i,
      __vue_script__$i,
      __vue_scope_id__$i,
      __vue_is_functional_template__$i,
      __vue_module_identifier__$i,
      false,
      undefined,
      undefined,
      undefined
    );

  //

  var script$h = {
    name: 'IconHover',
    props: {
      prefix: {
        type: String,
      },
      size: {
        type: String,
        default: 'medium',
      },
      disabled: {
        type: Boolean,
        default: false,
      },
    },
    data() {
      return {
        prefixCls: getPrefixCls('icon-hover'),
      };
    },
  };

  /* script */
  const __vue_script__$h = script$h;

  /* template */
  var __vue_render__$g = function () {
  var _obj;
  var _vm=this;var _h=_vm.$createElement;var _c=_vm._self._c||_h;return _c('span',{class:[
      _vm.prefixCls,
      ( _obj = {}, _obj[(_vm.prefix + "-icon-hover")] = _vm.prefix, _obj[(_vm.prefixCls + "-size-" + _vm.size)] = _vm.size !== 'medium', _obj[(_vm.prefixCls + "-disabled")] = _vm.disabled, _obj ) ]},[_vm._t("default")],2)};
  var __vue_staticRenderFns__$g = [];

    /* style */
    const __vue_inject_styles__$h = undefined;
    /* scoped */
    const __vue_scope_id__$h = undefined;
    /* module identifier */
    const __vue_module_identifier__$h = undefined;
    /* functional template */
    const __vue_is_functional_template__$h = false;
    /* style inject */
    
    /* style inject SSR */
    
    /* style inject shadow dom */
    

    
    const __vue_component__$h = /*#__PURE__*/normalizeComponent(
      { render: __vue_render__$g, staticRenderFns: __vue_staticRenderFns__$g },
      __vue_inject_styles__$h,
      __vue_script__$h,
      __vue_scope_id__$h,
      __vue_is_functional_template__$h,
      __vue_module_identifier__$h,
      false,
      undefined,
      undefined,
      undefined
    );

  /**
   * 判断工具
   * @author LIjiANgChen8 李江辰
   * @vervison v0.1.0
   * @date 2022/12/05
   */

  var opt = Object.prototype.toString;

  /**
   * 判断是否函数
   * @param obj 任意对象
   * @return {boolean} 布尔结果
   */
  function isFunction(obj) {
    return typeof obj === 'function';
  }
  function isBoolean(obj) {
    return opt.call(obj) === '[object Boolean]';
  }
  function isObject(obj) {
    return opt.call(obj) === '[object Object]';
  }
  function isArray(obj) {
    return opt.call(obj) === '[object Array]';
  }
  function isUndefined(obj) {
    return obj === undefined;
  }
  function isDayjs(time) {
    return isObject(time) && '$y' in time && '$M' in time && '$D' in time && '$d' in time && '$H' in time && '$m' in time && '$s' in time;
  }

  //

  var script$g = {
    name: 'DateInput',
    components: {
      IconHover: __vue_component__$h,
      IconCommon: __vue_component__$i,
    },
    props: {
      size: {
        type: String,
        validator: (value) => {
          return ['mini', 'small', 'medium', 'large'].includes(value);
        },
      },
      focused: {
        type: Boolean,
      },
      disabled: {
        type: Boolean,
      },
      readonly: {
        type: Boolean,
      },
      error: {
        type: Boolean,
      },
      allowClear: {
        type: Boolean,
      },
      placeholder: {
        type: String,
      },
      inputValue: {
        type: String,
      },
      value: {
        type: Object,
      },
      format: {
        type: [String, Function],
        required: true,
      },
    },
    data() {
      return {
        prefixCls: getPrefixCls('picker'),
      };
    },
    computed: {
      classNames() {
        return [
          this.prefixCls,
          `${this.prefixCls}-size-${this.size}`,
          {
            [`${this.prefixCls}-focused`]: this.focused,
            [`${this.prefixCls}-disabled`]: this.disabled,
            [`${this.prefixCls}-error`]: this.error,
          },
        ];
      },
      displayValue() {
        if (this.inputValue) return this.inputValue;
        if (this.value && isDayjs(this.value)) {
          return isFunction(this.format)
            ? this.format(this.value)
            : this.value.format(this.format);
        }
        return undefined;
      },
    },
    methods: {
      onPressEnter() {
        this.$emit('pressEnter');
      },
      onChange(e) {
        this.$emit('change', e);
      },
      onClear(e) {
        this.$emit('clear', e);
      },
      focus() {
        this.$refs.refInput &&
          this.$refs.refInput.focus &&
          this.$refs.refInput.focus();
      },
      blur() {
        this.$refs.refInput &&
          this.$refs.refInput.blur &&
          this.$refs.refInput.blur();
      },
    },
  };

  /* script */
  const __vue_script__$g = script$g;

  /* template */
  var __vue_render__$f = function () {var _vm=this;var _h=_vm.$createElement;var _c=_vm._self._c||_h;return _c('div',{class:_vm.classNames},[_c('div',{class:(_vm.prefixCls + "-input")},[_c('input',_vm._b({ref:"refInput",class:(_vm.prefixCls + "-start-time"),attrs:{"disabled":_vm.disabled,"placeholder":_vm.placeholder},domProps:{"value":_vm.displayValue},on:{"keydown":function($event){if(!$event.type.indexOf('key')&&_vm._k($event.keyCode,"enter",13,$event.key,"Enter")){ return null; }return _vm.onPressEnter.apply(null, arguments)},"input":_vm.onChange}},'input',_vm.readonly ? { readonly: true } : {},false))]),_vm._v(" "),_c('div',{class:(_vm.prefixCls + "-suffix")},[(_vm.allowClear && !_vm.disabled && _vm.displayValue)?_c('IconHover',{class:(_vm.prefixCls + "-clear-icon"),attrs:{"prefix":_vm.prefixCls},nativeOn:{"click":function($event){return _vm.onClear.apply(null, arguments)}}},[_c('IconCommon',{attrs:{"use":"close"}})],1):_vm._e(),_vm._v(" "),_c('span',{class:(_vm.prefixCls + "-suffix-icon")},[_vm._t("suffix-icon")],2)],1)])};
  var __vue_staticRenderFns__$f = [];

    /* style */
    const __vue_inject_styles__$g = undefined;
    /* scoped */
    const __vue_scope_id__$g = undefined;
    /* module identifier */
    const __vue_module_identifier__$g = undefined;
    /* functional template */
    const __vue_is_functional_template__$g = false;
    /* style inject */
    
    /* style inject SSR */
    
    /* style inject shadow dom */
    

    
    const __vue_component__$g = /*#__PURE__*/normalizeComponent(
      { render: __vue_render__$f, staticRenderFns: __vue_staticRenderFns__$f },
      __vue_inject_styles__$g,
      __vue_script__$g,
      __vue_scope_id__$g,
      __vue_is_functional_template__$g,
      __vue_module_identifier__$g,
      false,
      undefined,
      undefined,
      undefined
    );

  //

  var script$f = {
    name: 'Button',
    props: {
      type: {
        type: String,
      },
      shape: {
        type: String,
      },
      status: {
        type: String,
      },
      size: {
        type: String,
      },
      long: {
        type: Boolean,
        default: false,
      },
      loading: {
        type: Boolean,
        default: false,
      },
      disabled: {
        type: Boolean,
      },
      htmlType: {
        type: String,
        default: 'button',
      },
    },
    data() {
      return {
        prefixCls: getPrefixCls('btn'),
      };
    },
    computed: {
      cls() {
        return [
          this.prefixCls,
          `${this.prefixCls}-${this.type ?? 'secondary'}`,
          `${this.prefixCls}-shape-${this.shape ?? 'square'}`,
          `${this.prefixCls}-size-${this.size}`,
          `${this.prefixCls}-status-${this.status ?? 'normal'}`,
          {
            [`${this.prefixCls}-long`]: this.long,
            [`${this.prefixCls}-loading`]: this.loading,
            [`${this.prefixCls}-disabled`]: this.disabled,
          },
        ];
      },
    },
    methods: {
      handleClick(ev) {
        if (this.disabled || this.loading) {
          ev.preventDefault();
          return;
        }
        this.$emit('click', ev);
      },
    },
  };

  /* script */
  const __vue_script__$f = script$f;

  /* template */
  var __vue_render__$e = function () {
  var _obj;
  var _vm=this;var _h=_vm.$createElement;var _c=_vm._self._c||_h;return _c('button',{class:[
      _vm.cls,
      ( _obj = {}, _obj[(_vm.prefixCls + "-only-icon")] = _vm.$slots.icon && !_vm.$slots.default, _obj ) ],attrs:{"type":_vm.htmlType},on:{"click":_vm.handleClick}},[(_vm.loading || _vm.$slots.icon)?_c('span',{class:(_vm.prefixCls + "-icon")},[(_vm.loading)?_c('icon-loading',{attrs:{"spin":true}}):_vm._t("icon")],2):_vm._e(),_vm._v(" "),_vm._t("default")],2)};
  var __vue_staticRenderFns__$e = [];

    /* style */
    const __vue_inject_styles__$f = undefined;
    /* scoped */
    const __vue_scope_id__$f = undefined;
    /* module identifier */
    const __vue_module_identifier__$f = undefined;
    /* functional template */
    const __vue_is_functional_template__$f = false;
    /* style inject */
    
    /* style inject SSR */
    
    /* style inject shadow dom */
    

    
    const __vue_component__$f = /*#__PURE__*/normalizeComponent(
      { render: __vue_render__$e, staticRenderFns: __vue_staticRenderFns__$e },
      __vue_inject_styles__$f,
      __vue_script__$f,
      __vue_scope_id__$f,
      __vue_is_functional_template__$f,
      __vue_module_identifier__$f,
      false,
      undefined,
      undefined,
      undefined
    );

  var script$e = {
    props: {
      renderFunc: {
        type: Function,
        required: true,
      },
    },
    render() {
      return this.renderFunc(this.$attrs);
    },
  };

  /* script */
  const __vue_script__$e = script$e;

  /* template */

    /* style */
    const __vue_inject_styles__$e = undefined;
    /* scoped */
    const __vue_scope_id__$e = undefined;
    /* module identifier */
    const __vue_module_identifier__$e = undefined;
    /* functional template */
    const __vue_is_functional_template__$e = undefined;
    /* style inject */
    
    /* style inject SSR */
    
    /* style inject shadow dom */
    

    
    const __vue_component__$e = /*#__PURE__*/normalizeComponent(
      {},
      __vue_inject_styles__$e,
      __vue_script__$e,
      __vue_scope_id__$e,
      __vue_is_functional_template__$e,
      __vue_module_identifier__$e,
      false,
      undefined,
      undefined,
      undefined
    );

  //

  var script$d = {
    name: 'PanelShortcuts',
    components: {
      Button: __vue_component__$f,
      RenderFunction: __vue_component__$e,
    },
    props: {
      prefixCls: {
        type: String,
        required: true,
      },
      shortcuts: {
        type: Array,
        default: () => [],
      },
      showNowBtn: {
        type: Boolean,
      },
    },
    methods: {
      isFunction(obj) {
        return typeof obj === 'function';
      },
      onItemClick(item) {
        this.$emit('itemClick', item);
      },
      onItemMouseEnter(item) {
        this.$emit('itemMouseEnter', item);
      },
      onItemMouseLeave(item) {
        this.$emit('itemMouseLeave', item);
      },
      onNowClick() {
        this.$emit('nowClick');
      },
    },
  };

  /* script */
  const __vue_script__$d = script$d;

  /* template */
  var __vue_render__$d = function () {var _vm=this;var _h=_vm.$createElement;var _c=_vm._self._c||_h;return _c('div',{class:(_vm.prefixCls + "-shortcuts")},[(_vm.showNowBtn)?_c('Button',{attrs:{"size":"mini"},on:{"click":function () { return _vm.onNowClick(); }}},[_vm._v("此刻")]):_vm._e(),_vm._v(" "),_vm._l((_vm.shortcuts),function(item,index){return _c('Button',{key:index,attrs:{"size":"mini"},on:{"click":function () { return _vm.onItemClick(item); }},nativeOn:{"mouseenter":function($event){return (function () { return _vm.onItemMouseEnter(item); }).apply(null, arguments)},"mouseleave":function($event){return (function () { return _vm.onItemMouseLeave(item); }).apply(null, arguments)}}},[(_vm.isFunction(item.label))?_c('RenderFunction',{attrs:{"render-func":item.label}}):[_vm._v("\n      "+_vm._s(item.label)+"\n    ")]],2)})],2)};
  var __vue_staticRenderFns__$d = [];

    /* style */
    const __vue_inject_styles__$d = undefined;
    /* scoped */
    const __vue_scope_id__$d = undefined;
    /* module identifier */
    const __vue_module_identifier__$d = undefined;
    /* functional template */
    const __vue_is_functional_template__$d = false;
    /* style inject */
    
    /* style inject SSR */
    
    /* style inject shadow dom */
    

    
    const __vue_component__$d = /*#__PURE__*/normalizeComponent(
      { render: __vue_render__$d, staticRenderFns: __vue_staticRenderFns__$d },
      __vue_inject_styles__$d,
      __vue_script__$d,
      __vue_scope_id__$d,
      __vue_is_functional_template__$d,
      __vue_module_identifier__$d,
      false,
      undefined,
      undefined,
      undefined
    );

  function ownKeys(object, enumerableOnly) {
    var keys = Object.keys(object);
    if (Object.getOwnPropertySymbols) {
      var symbols = Object.getOwnPropertySymbols(object);
      enumerableOnly && (symbols = symbols.filter(function (sym) {
        return Object.getOwnPropertyDescriptor(object, sym).enumerable;
      })), keys.push.apply(keys, symbols);
    }
    return keys;
  }
  function _objectSpread2(target) {
    for (var i = 1; i < arguments.length; i++) {
      var source = null != arguments[i] ? arguments[i] : {};
      i % 2 ? ownKeys(Object(source), !0).forEach(function (key) {
        _defineProperty(target, key, source[key]);
      }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)) : ownKeys(Object(source)).forEach(function (key) {
        Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key));
      });
    }
    return target;
  }
  function _typeof(obj) {
    "@babel/helpers - typeof";

    return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (obj) {
      return typeof obj;
    } : function (obj) {
      return obj && "function" == typeof Symbol && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj;
    }, _typeof(obj);
  }
  function _defineProperty(obj, key, value) {
    key = _toPropertyKey(key);
    if (key in obj) {
      Object.defineProperty(obj, key, {
        value: value,
        enumerable: true,
        configurable: true,
        writable: true
      });
    } else {
      obj[key] = value;
    }
    return obj;
  }
  function _toConsumableArray(arr) {
    return _arrayWithoutHoles(arr) || _iterableToArray(arr) || _unsupportedIterableToArray(arr) || _nonIterableSpread();
  }
  function _arrayWithoutHoles(arr) {
    if (Array.isArray(arr)) return _arrayLikeToArray(arr);
  }
  function _iterableToArray(iter) {
    if (typeof Symbol !== "undefined" && iter[Symbol.iterator] != null || iter["@@iterator"] != null) return Array.from(iter);
  }
  function _unsupportedIterableToArray(o, minLen) {
    if (!o) return;
    if (typeof o === "string") return _arrayLikeToArray(o, minLen);
    var n = Object.prototype.toString.call(o).slice(8, -1);
    if (n === "Object" && o.constructor) n = o.constructor.name;
    if (n === "Map" || n === "Set") return Array.from(o);
    if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen);
  }
  function _arrayLikeToArray(arr, len) {
    if (len == null || len > arr.length) len = arr.length;
    for (var i = 0, arr2 = new Array(len); i < len; i++) arr2[i] = arr[i];
    return arr2;
  }
  function _nonIterableSpread() {
    throw new TypeError("Invalid attempt to spread non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.");
  }
  function _createForOfIteratorHelper(o, allowArrayLike) {
    var it = typeof Symbol !== "undefined" && o[Symbol.iterator] || o["@@iterator"];
    if (!it) {
      if (Array.isArray(o) || (it = _unsupportedIterableToArray(o)) || allowArrayLike && o && typeof o.length === "number") {
        if (it) o = it;
        var i = 0;
        var F = function () {};
        return {
          s: F,
          n: function () {
            if (i >= o.length) return {
              done: true
            };
            return {
              done: false,
              value: o[i++]
            };
          },
          e: function (e) {
            throw e;
          },
          f: F
        };
      }
      throw new TypeError("Invalid attempt to iterate non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.");
    }
    var normalCompletion = true,
      didErr = false,
      err;
    return {
      s: function () {
        it = it.call(o);
      },
      n: function () {
        var step = it.next();
        normalCompletion = step.done;
        return step;
      },
      e: function (e) {
        didErr = true;
        err = e;
      },
      f: function () {
        try {
          if (!normalCompletion && it.return != null) it.return();
        } finally {
          if (didErr) throw err;
        }
      }
    };
  }
  function _toPrimitive(input, hint) {
    if (typeof input !== "object" || input === null) return input;
    var prim = input[Symbol.toPrimitive];
    if (prim !== undefined) {
      var res = prim.call(input, hint || "default");
      if (typeof res !== "object") return res;
      throw new TypeError("@@toPrimitive must return a primitive value.");
    }
    return (hint === "string" ? String : Number)(input);
  }
  function _toPropertyKey(arg) {
    var key = _toPrimitive(arg, "string");
    return typeof key === "symbol" ? key : String(key);
  }

  var commonjsGlobal = typeof globalThis !== 'undefined' ? globalThis : typeof window !== 'undefined' ? window : typeof global !== 'undefined' ? global : typeof self !== 'undefined' ? self : {};

  var dayjs_minExports = {};
  var dayjs_min = {
    get exports(){ return dayjs_minExports; },
    set exports(v){ dayjs_minExports = v; },
  };

  (function (module, exports) {
  	!function(t,e){module.exports=e();}(commonjsGlobal,(function(){var t=1e3,e=6e4,n=36e5,r="millisecond",i="second",s="minute",u="hour",a="day",o="week",f="month",h="quarter",c="year",d="date",l="Invalid Date",$=/^(\d{4})[-/]?(\d{1,2})?[-/]?(\d{0,2})[Tt\s]*(\d{1,2})?:?(\d{1,2})?:?(\d{1,2})?[.:]?(\d+)?$/,y=/\[([^\]]+)]|Y{1,4}|M{1,4}|D{1,2}|d{1,4}|H{1,2}|h{1,2}|a|A|m{1,2}|s{1,2}|Z{1,2}|SSS/g,M={name:"en",weekdays:"Sunday_Monday_Tuesday_Wednesday_Thursday_Friday_Saturday".split("_"),months:"January_February_March_April_May_June_July_August_September_October_November_December".split("_"),ordinal:function(t){var e=["th","st","nd","rd"],n=t%100;return "["+t+(e[(n-20)%10]||e[n]||e[0])+"]"}},m=function(t,e,n){var r=String(t);return !r||r.length>=e?t:""+Array(e+1-r.length).join(n)+t},v={s:m,z:function(t){var e=-t.utcOffset(),n=Math.abs(e),r=Math.floor(n/60),i=n%60;return (e<=0?"+":"-")+m(r,2,"0")+":"+m(i,2,"0")},m:function t(e,n){if(e.date()<n.date())return -t(n,e);var r=12*(n.year()-e.year())+(n.month()-e.month()),i=e.clone().add(r,f),s=n-i<0,u=e.clone().add(r+(s?-1:1),f);return +(-(r+(n-i)/(s?i-u:u-i))||0)},a:function(t){return t<0?Math.ceil(t)||0:Math.floor(t)},p:function(t){return {M:f,y:c,w:o,d:a,D:d,h:u,m:s,s:i,ms:r,Q:h}[t]||String(t||"").toLowerCase().replace(/s$/,"")},u:function(t){return void 0===t}},g="en",D={};D[g]=M;var p=function(t){return t instanceof _},S=function t(e,n,r){var i;if(!e)return g;if("string"==typeof e){var s=e.toLowerCase();D[s]&&(i=s),n&&(D[s]=n,i=s);var u=e.split("-");if(!i&&u.length>1)return t(u[0])}else {var a=e.name;D[a]=e,i=a;}return !r&&i&&(g=i),i||!r&&g},w=function(t,e){if(p(t))return t.clone();var n="object"==typeof e?e:{};return n.date=t,n.args=arguments,new _(n)},O=v;O.l=S,O.i=p,O.w=function(t,e){return w(t,{locale:e.$L,utc:e.$u,x:e.$x,$offset:e.$offset})};var _=function(){function M(t){this.$L=S(t.locale,null,!0),this.parse(t);}var m=M.prototype;return m.parse=function(t){this.$d=function(t){var e=t.date,n=t.utc;if(null===e)return new Date(NaN);if(O.u(e))return new Date;if(e instanceof Date)return new Date(e);if("string"==typeof e&&!/Z$/i.test(e)){var r=e.match($);if(r){var i=r[2]-1||0,s=(r[7]||"0").substring(0,3);return n?new Date(Date.UTC(r[1],i,r[3]||1,r[4]||0,r[5]||0,r[6]||0,s)):new Date(r[1],i,r[3]||1,r[4]||0,r[5]||0,r[6]||0,s)}}return new Date(e)}(t),this.$x=t.x||{},this.init();},m.init=function(){var t=this.$d;this.$y=t.getFullYear(),this.$M=t.getMonth(),this.$D=t.getDate(),this.$W=t.getDay(),this.$H=t.getHours(),this.$m=t.getMinutes(),this.$s=t.getSeconds(),this.$ms=t.getMilliseconds();},m.$utils=function(){return O},m.isValid=function(){return !(this.$d.toString()===l)},m.isSame=function(t,e){var n=w(t);return this.startOf(e)<=n&&n<=this.endOf(e)},m.isAfter=function(t,e){return w(t)<this.startOf(e)},m.isBefore=function(t,e){return this.endOf(e)<w(t)},m.$g=function(t,e,n){return O.u(t)?this[e]:this.set(n,t)},m.unix=function(){return Math.floor(this.valueOf()/1e3)},m.valueOf=function(){return this.$d.getTime()},m.startOf=function(t,e){var n=this,r=!!O.u(e)||e,h=O.p(t),l=function(t,e){var i=O.w(n.$u?Date.UTC(n.$y,e,t):new Date(n.$y,e,t),n);return r?i:i.endOf(a)},$=function(t,e){return O.w(n.toDate()[t].apply(n.toDate("s"),(r?[0,0,0,0]:[23,59,59,999]).slice(e)),n)},y=this.$W,M=this.$M,m=this.$D,v="set"+(this.$u?"UTC":"");switch(h){case c:return r?l(1,0):l(31,11);case f:return r?l(1,M):l(0,M+1);case o:var g=this.$locale().weekStart||0,D=(y<g?y+7:y)-g;return l(r?m-D:m+(6-D),M);case a:case d:return $(v+"Hours",0);case u:return $(v+"Minutes",1);case s:return $(v+"Seconds",2);case i:return $(v+"Milliseconds",3);default:return this.clone()}},m.endOf=function(t){return this.startOf(t,!1)},m.$set=function(t,e){var n,o=O.p(t),h="set"+(this.$u?"UTC":""),l=(n={},n[a]=h+"Date",n[d]=h+"Date",n[f]=h+"Month",n[c]=h+"FullYear",n[u]=h+"Hours",n[s]=h+"Minutes",n[i]=h+"Seconds",n[r]=h+"Milliseconds",n)[o],$=o===a?this.$D+(e-this.$W):e;if(o===f||o===c){var y=this.clone().set(d,1);y.$d[l]($),y.init(),this.$d=y.set(d,Math.min(this.$D,y.daysInMonth())).$d;}else l&&this.$d[l]($);return this.init(),this},m.set=function(t,e){return this.clone().$set(t,e)},m.get=function(t){return this[O.p(t)]()},m.add=function(r,h){var d,l=this;r=Number(r);var $=O.p(h),y=function(t){var e=w(l);return O.w(e.date(e.date()+Math.round(t*r)),l)};if($===f)return this.set(f,this.$M+r);if($===c)return this.set(c,this.$y+r);if($===a)return y(1);if($===o)return y(7);var M=(d={},d[s]=e,d[u]=n,d[i]=t,d)[$]||1,m=this.$d.getTime()+r*M;return O.w(m,this)},m.subtract=function(t,e){return this.add(-1*t,e)},m.format=function(t){var e=this,n=this.$locale();if(!this.isValid())return n.invalidDate||l;var r=t||"YYYY-MM-DDTHH:mm:ssZ",i=O.z(this),s=this.$H,u=this.$m,a=this.$M,o=n.weekdays,f=n.months,h=function(t,n,i,s){return t&&(t[n]||t(e,r))||i[n].slice(0,s)},c=function(t){return O.s(s%12||12,t,"0")},d=n.meridiem||function(t,e,n){var r=t<12?"AM":"PM";return n?r.toLowerCase():r},$={YY:String(this.$y).slice(-2),YYYY:this.$y,M:a+1,MM:O.s(a+1,2,"0"),MMM:h(n.monthsShort,a,f,3),MMMM:h(f,a),D:this.$D,DD:O.s(this.$D,2,"0"),d:String(this.$W),dd:h(n.weekdaysMin,this.$W,o,2),ddd:h(n.weekdaysShort,this.$W,o,3),dddd:o[this.$W],H:String(s),HH:O.s(s,2,"0"),h:c(1),hh:c(2),a:d(s,u,!0),A:d(s,u,!1),m:String(u),mm:O.s(u,2,"0"),s:String(this.$s),ss:O.s(this.$s,2,"0"),SSS:O.s(this.$ms,3,"0"),Z:i};return r.replace(y,(function(t,e){return e||$[t]||i.replace(":","")}))},m.utcOffset=function(){return 15*-Math.round(this.$d.getTimezoneOffset()/15)},m.diff=function(r,d,l){var $,y=O.p(d),M=w(r),m=(M.utcOffset()-this.utcOffset())*e,v=this-M,g=O.m(this,M);return g=($={},$[c]=g/12,$[f]=g,$[h]=g/3,$[o]=(v-m)/6048e5,$[a]=(v-m)/864e5,$[u]=v/n,$[s]=v/e,$[i]=v/t,$)[y]||v,l?g:O.a(g)},m.daysInMonth=function(){return this.endOf(f).$D},m.$locale=function(){return D[this.$L]},m.locale=function(t,e){if(!t)return this.$L;var n=this.clone(),r=S(t,e,!0);return r&&(n.$L=r),n},m.clone=function(){return O.w(this.$d,this)},m.toDate=function(){return new Date(this.valueOf())},m.toJSON=function(){return this.isValid()?this.toISOString():null},m.toISOString=function(){return this.$d.toISOString()},m.toString=function(){return this.$d.toUTCString()},M}(),T=_.prototype;return w.prototype=T,[["$ms",r],["$s",i],["$m",s],["$H",u],["$W",a],["$M",f],["$y",c],["$D",d]].forEach((function(t){T[t[1]]=function(e){return this.$g(e,t[0],t[1])};})),w.extend=function(t,e){return t.$i||(t(e,_,w),t.$i=!0),w},w.locale=S,w.isDayjs=p,w.unix=function(t){return w(1e3*t)},w.en=D[g],w.Ls=D,w.p={},w}));
  } (dayjs_min));

  var originDayjs = dayjs_minExports;

  var customParseFormatExports = {};
  var customParseFormat$1 = {
    get exports(){ return customParseFormatExports; },
    set exports(v){ customParseFormatExports = v; },
  };

  (function (module, exports) {
  	!function(e,t){module.exports=t();}(commonjsGlobal,(function(){var e={LTS:"h:mm:ss A",LT:"h:mm A",L:"MM/DD/YYYY",LL:"MMMM D, YYYY",LLL:"MMMM D, YYYY h:mm A",LLLL:"dddd, MMMM D, YYYY h:mm A"},t=/(\[[^[]*\])|([-_:/.,()\s]+)|(A|a|YYYY|YY?|MM?M?M?|Do|DD?|hh?|HH?|mm?|ss?|S{1,3}|z|ZZ?)/g,n=/\d\d/,r=/\d\d?/,i=/\d*[^-_:/,()\s\d]+/,o={},s=function(e){return (e=+e)+(e>68?1900:2e3)};var a=function(e){return function(t){this[e]=+t;}},f=[/[+-]\d\d:?(\d\d)?|Z/,function(e){(this.zone||(this.zone={})).offset=function(e){if(!e)return 0;if("Z"===e)return 0;var t=e.match(/([+-]|\d\d)/g),n=60*t[1]+(+t[2]||0);return 0===n?0:"+"===t[0]?-n:n}(e);}],h=function(e){var t=o[e];return t&&(t.indexOf?t:t.s.concat(t.f))},u=function(e,t){var n,r=o.meridiem;if(r){for(var i=1;i<=24;i+=1)if(e.indexOf(r(i,0,t))>-1){n=i>12;break}}else n=e===(t?"pm":"PM");return n},d={A:[i,function(e){this.afternoon=u(e,!1);}],a:[i,function(e){this.afternoon=u(e,!0);}],S:[/\d/,function(e){this.milliseconds=100*+e;}],SS:[n,function(e){this.milliseconds=10*+e;}],SSS:[/\d{3}/,function(e){this.milliseconds=+e;}],s:[r,a("seconds")],ss:[r,a("seconds")],m:[r,a("minutes")],mm:[r,a("minutes")],H:[r,a("hours")],h:[r,a("hours")],HH:[r,a("hours")],hh:[r,a("hours")],D:[r,a("day")],DD:[n,a("day")],Do:[i,function(e){var t=o.ordinal,n=e.match(/\d+/);if(this.day=n[0],t)for(var r=1;r<=31;r+=1)t(r).replace(/\[|\]/g,"")===e&&(this.day=r);}],M:[r,a("month")],MM:[n,a("month")],MMM:[i,function(e){var t=h("months"),n=(h("monthsShort")||t.map((function(e){return e.slice(0,3)}))).indexOf(e)+1;if(n<1)throw new Error;this.month=n%12||n;}],MMMM:[i,function(e){var t=h("months").indexOf(e)+1;if(t<1)throw new Error;this.month=t%12||t;}],Y:[/[+-]?\d+/,a("year")],YY:[n,function(e){this.year=s(e);}],YYYY:[/\d{4}/,a("year")],Z:f,ZZ:f};function c(n){var r,i;r=n,i=o&&o.formats;for(var s=(n=r.replace(/(\[[^\]]+])|(LTS?|l{1,4}|L{1,4})/g,(function(t,n,r){var o=r&&r.toUpperCase();return n||i[r]||e[r]||i[o].replace(/(\[[^\]]+])|(MMMM|MM|DD|dddd)/g,(function(e,t,n){return t||n.slice(1)}))}))).match(t),a=s.length,f=0;f<a;f+=1){var h=s[f],u=d[h],c=u&&u[0],l=u&&u[1];s[f]=l?{regex:c,parser:l}:h.replace(/^\[|\]$/g,"");}return function(e){for(var t={},n=0,r=0;n<a;n+=1){var i=s[n];if("string"==typeof i)r+=i.length;else {var o=i.regex,f=i.parser,h=e.slice(r),u=o.exec(h)[0];f.call(t,u),e=e.replace(u,"");}}return function(e){var t=e.afternoon;if(void 0!==t){var n=e.hours;t?n<12&&(e.hours+=12):12===n&&(e.hours=0),delete e.afternoon;}}(t),t}}return function(e,t,n){n.p.customParseFormat=!0,e&&e.parseTwoDigitYear&&(s=e.parseTwoDigitYear);var r=t.prototype,i=r.parse;r.parse=function(e){var t=e.date,r=e.utc,s=e.args;this.$u=r;var a=s[1];if("string"==typeof a){var f=!0===s[2],h=!0===s[3],u=f||h,d=s[2];h&&(d=s[2]),o=this.$locale(),!f&&d&&(o=n.Ls[d]),this.$d=function(e,t,n){try{if(["x","X"].indexOf(t)>-1)return new Date(("X"===t?1e3:1)*e);var r=c(t)(e),i=r.year,o=r.month,s=r.day,a=r.hours,f=r.minutes,h=r.seconds,u=r.milliseconds,d=r.zone,l=new Date,m=s||(i||o?1:l.getDate()),M=i||l.getFullYear(),Y=0;i&&!o||(Y=o>0?o-1:l.getMonth());var p=a||0,v=f||0,D=h||0,g=u||0;return d?new Date(Date.UTC(M,Y,m,p,v,D,g+60*d.offset*1e3)):n?new Date(Date.UTC(M,Y,m,p,v,D,g)):new Date(M,Y,m,p,v,D,g)}catch(e){return new Date("")}}(t,a,r),this.init(),d&&!0!==d&&(this.$L=this.locale(d).$L),u&&t!=this.format(a)&&(this.$d=new Date("")),o={};}else if(a instanceof Array)for(var l=a.length,m=1;m<=l;m+=1){s[1]=a[m-1];var M=n.apply(this,s);if(M.isValid()){this.$d=M.$d,this.$L=M.$L,this.init();break}m===l&&(this.$d=new Date(""));}else i.call(this,e);};}}));
  } (customParseFormat$1));

  var customParseFormat = customParseFormatExports;

  var isBetweenExports = {};
  var isBetween$1 = {
    get exports(){ return isBetweenExports; },
    set exports(v){ isBetweenExports = v; },
  };

  (function (module, exports) {
  	!function(e,i){module.exports=i();}(commonjsGlobal,(function(){return function(e,i,t){i.prototype.isBetween=function(e,i,s,f){var n=t(e),o=t(i),r="("===(f=f||"()")[0],u=")"===f[1];return (r?this.isAfter(n,s):!this.isBefore(n,s))&&(u?this.isBefore(o,s):!this.isAfter(o,s))||(r?this.isBefore(n,s):!this.isAfter(n,s))&&(u?this.isAfter(o,s):!this.isBefore(o,s))};}}));
  } (isBetween$1));

  var isBetween = isBetweenExports;

  var weekOfYearExports = {};
  var weekOfYear$1 = {
    get exports(){ return weekOfYearExports; },
    set exports(v){ weekOfYearExports = v; },
  };

  (function (module, exports) {
  	!function(e,t){module.exports=t();}(commonjsGlobal,(function(){var e="week",t="year";return function(i,n,r){var f=n.prototype;f.week=function(i){if(void 0===i&&(i=null),null!==i)return this.add(7*(i-this.week()),"day");var n=this.$locale().yearStart||1;if(11===this.month()&&this.date()>25){var f=r(this).startOf(t).add(1,t).date(n),s=r(this).endOf(e);if(f.isBefore(s))return 1}var a=r(this).startOf(t).date(n).startOf(e).subtract(1,"millisecond"),o=this.diff(a,e,!0);return o<0?r(this).startOf("week").week():Math.ceil(o)},f.weeks=function(e){return void 0===e&&(e=null),this.week(e)};}}));
  } (weekOfYear$1));

  var weekOfYear = weekOfYearExports;

  var advancedFormatExports = {};
  var advancedFormat = {
    get exports(){ return advancedFormatExports; },
    set exports(v){ advancedFormatExports = v; },
  };

  (function (module, exports) {
  	!function(e,t){module.exports=t();}(commonjsGlobal,(function(){return function(e,t){var r=t.prototype,n=r.format;r.format=function(e){var t=this,r=this.$locale();if(!this.isValid())return n.bind(this)(e);var s=this.$utils(),a=(e||"YYYY-MM-DDTHH:mm:ssZ").replace(/\[([^\]]+)]|Q|wo|ww|w|WW|W|zzz|z|gggg|GGGG|Do|X|x|k{1,2}|S/g,(function(e){switch(e){case"Q":return Math.ceil((t.$M+1)/3);case"Do":return r.ordinal(t.$D);case"gggg":return t.weekYear();case"GGGG":return t.isoWeekYear();case"wo":return r.ordinal(t.week(),"W");case"w":case"ww":return s.s(t.week(),"w"===e?1:2,"0");case"W":case"WW":return s.s(t.isoWeek(),"W"===e?1:2,"0");case"k":case"kk":return s.s(String(0===t.$H?24:t.$H),"k"===e?1:2,"0");case"X":return Math.floor(t.$d.getTime()/1e3);case"x":return t.$d.getTime();case"z":return "["+t.offsetName()+"]";case"zzz":return "["+t.offsetName("long")+"]";default:return e}}));return n.bind(this)(a)};}}));
  } (advancedFormat));

  var AdvancedFormat = advancedFormatExports;

  var weekYearExports = {};
  var weekYear$1 = {
    get exports(){ return weekYearExports; },
    set exports(v){ weekYearExports = v; },
  };

  (function (module, exports) {
  	!function(e,t){module.exports=t();}(commonjsGlobal,(function(){return function(e,t){t.prototype.weekYear=function(){var e=this.month(),t=this.week(),n=this.year();return 1===t&&11===e?n+1:0===e&&t>=52?n-1:n};}}));
  } (weekYear$1));

  var weekYear = weekYearExports;

  var quarterOfYearExports = {};
  var quarterOfYear = {
    get exports(){ return quarterOfYearExports; },
    set exports(v){ quarterOfYearExports = v; },
  };

  (function (module, exports) {
  	!function(t,n){module.exports=n();}(commonjsGlobal,(function(){var t="month",n="quarter";return function(e,i){var r=i.prototype;r.quarter=function(t){return this.$utils().u(t)?Math.ceil((this.month()+1)/3):this.month(this.month()%3+3*(t-1))};var s=r.add;r.add=function(e,i){return e=Number(e),this.$utils().p(i)===n?this.add(3*e,t):s.bind(this)(e,i)};var u=r.startOf;r.startOf=function(e,i){var r=this.$utils(),s=!!r.u(i)||i;if(r.p(e)===n){var o=this.quarter()-1;return s?this.month(3*o).startOf(t).startOf("day"):this.month(3*o+2).endOf(t).endOf("day")}return u.bind(this)(e,i)};}}));
  } (quarterOfYear));

  var QuarterOfYear = quarterOfYearExports;

  var zhCnExports = {};
  var zhCn = {
    get exports(){ return zhCnExports; },
    set exports(v){ zhCnExports = v; },
  };

  (function (module, exports) {
  	!function(e,_){module.exports=_(dayjs_minExports);}(commonjsGlobal,(function(e){function _(e){return e&&"object"==typeof e&&"default"in e?e:{default:e}}var t=_(e),d={name:"zh-cn",weekdays:"星期日_星期一_星期二_星期三_星期四_星期五_星期六".split("_"),weekdaysShort:"周日_周一_周二_周三_周四_周五_周六".split("_"),weekdaysMin:"日_一_二_三_四_五_六".split("_"),months:"一月_二月_三月_四月_五月_六月_七月_八月_九月_十月_十一月_十二月".split("_"),monthsShort:"1月_2月_3月_4月_5月_6月_7月_8月_9月_10月_11月_12月".split("_"),ordinal:function(e,_){return "W"===_?e+"周":e+"日"},weekStart:1,yearStart:4,formats:{LT:"HH:mm",LTS:"HH:mm:ss",L:"YYYY/MM/DD",LL:"YYYY年M月D日",LLL:"YYYY年M月D日Ah点mm分",LLLL:"YYYY年M月D日ddddAh点mm分",l:"YYYY/M/D",ll:"YYYY年M月D日",lll:"YYYY年M月D日 HH:mm",llll:"YYYY年M月D日dddd HH:mm"},relativeTime:{future:"%s内",past:"%s前",s:"几秒",m:"1 分钟",mm:"%d 分钟",h:"1 小时",hh:"%d 小时",d:"1 天",dd:"%d 天",M:"1 个月",MM:"%d 个月",y:"1 年",yy:"%d 年"},meridiem:function(e,_){var t=100*e+_;return t<600?"凌晨":t<900?"早上":t<1100?"上午":t<1300?"中午":t<1800?"下午":"晚上"}};return t.default.locale(d,null,!0),d}));
  } (zhCn));

  var _arguments = typeof arguments === "undefined" ? void 0 : arguments;
  var overwriteIsDayjs = function overwriteIsDayjs(_, Dayjs, dayjs) {
    dayjs = function dayjs(date, c) {
      if (isDayjs(date)) {
        return date.clone();
      }
      var cfg = _typeof(c) === 'object' ? c : {};
      cfg.date = date;
      // eslint-disable-next-line no-undef
      cfg.args = _arguments;
      return new Dayjs(cfg);
    };
    var proto = Dayjs.prototype;
    var old$Utils = proto.$utils;
    proto.$utils = function () {
      var newUtils = old$Utils();
      newUtils.i = isDayjs;
      return newUtils;
    };
    dayjs.isDayjs = isDayjs;
  };
  originDayjs.extend(overwriteIsDayjs);
  originDayjs.extend(customParseFormat);
  originDayjs.extend(isBetween);
  originDayjs.extend(weekOfYear);
  originDayjs.extend(AdvancedFormat);
  originDayjs.extend(weekYear);
  originDayjs.extend(QuarterOfYear);
  var dayjs = originDayjs;
  var methods = {
    add: function add(time, value, unit) {
      return time.add(value, unit);
    },
    subtract: function subtract(time, value, unit) {
      return time.subtract(value, unit);
    },
    startOf: function startOf(time, unit) {
      return time.startOf(unit);
    },
    endOf: function endOf(time, unit) {
      return time.endOf(unit);
    },
    set: function set(time, unit, value) {
      return time.set(unit, value);
    },
    isSameWeek: function isSameWeek(date1, date2, weekStart, localeName) {
      return date1.locale(_objectSpread2(_objectSpread2({}, dayjs.Ls[localeName.toLocaleLowerCase()]), {}, {
        weekStart: weekStart
      })).isSame(date2, 'week');
    }
  };
  function getNow() {
    return dayjs();
  }
  function getSortedDayjsArray(values) {
    return _toConsumableArray(values).sort(function (a, b) {
      return a.valueOf() - b.valueOf();
    });
  }
  function isValueChange(prevValue, currentValue) {
    var isDifference = function isDifference(value1, value2) {
      if (value1 === undefined && value2 === undefined) {
        return false;
      }
      if (value1 && !value2 || !value1 && value2) {
        return true;
      }
      return (value1 === null || value1 === void 0 ? void 0 : value1.valueOf()) !== (value2 === null || value2 === void 0 ? void 0 : value2.valueOf());
    };
    if (currentValue === undefined && prevValue === undefined) {
      return false;
    }
    if (isArray(currentValue) && isArray(prevValue)) {
      return isDifference(currentValue[0], prevValue[0]) || isDifference(currentValue[1], prevValue[1]);
    }
    if (!isArray(currentValue) && !isArray(prevValue)) {
      return isDifference(currentValue, prevValue);
    }
    return true;
  }
  function getDayjsValue(time, format) {
    var formatValue = function formatValue(value) {
      if (!value) return undefined;
      if (typeof value === 'string') {
        return dayjs(value, format);
      }
      return dayjs(value);
    };
    if (isArray(time)) {
      return time.map(formatValue);
    }
    return formatValue(time);
  }
  function getDateValue(value) {
    var formatValue = function formatValue(t) {
      return t ? t.toDate() : undefined;
    };
    if (isArray(value)) {
      return value.map(formatValue);
    }
    return formatValue(value);
  }
  function initializeDateLocale(localeName, weekStart) {
    dayjs.locale(_objectSpread2(_objectSpread2({}, dayjs.Ls[localeName.toLocaleLowerCase()]), {}, {
      weekStart: weekStart
    }));
  }
  function padStart(string, length) {
    var char = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : ' ';
    var s = String(string);
    if (!length) {
      return s;
    }
    var newString = s.length < length ? "".concat(char).concat(s) : s;
    return newString.length < length ? padStart(newString, length, char) : newString;
  }
  function getFormattedValue(time, format) {
    var formatValue = function formatValue(time) {
      if (isArray(time)) {
        return time.map(function (t) {
          return formatValue(t);
        });
      }
      if (isUndefined(time)) return undefined;
      return time.format(format);
    };
    return formatValue(time);
  }
  function isValidInputValue(time, format) {
    if (!time) return false;
    return typeof time === 'string' && dayjs(time, format).format(format) === time;
  }

  //

  var script$c = {
    name: 'PanelHeader',
    components: {
      IconCommon: __vue_component__$i,
    },
    props: {
      prefixCls: {
        type: String,
        required: true,
      },
      title: {
        type: String,
        required: true,
      },
      mode: {
        type: String,
        default: 'date',
      },
      value: {
        type: Object,
      },
      onPrev: {
        type: Function,
      },
      onSuperPrev: {
        type: Function,
      },
      onNext: {
        type: Function,
      },
      onSuperNext: {
        type: Function,
      },
      onLabelClick: {
        type: Function,
      },
    },
    computed: {
      showPrev() {
        return isFunction(this.onPrev);
      },
      showSuperPrev() {
        return isFunction(this.onSuperPrev);
      },
      showNext() {
        return isFunction(this.onNext);
      },
      showSuperNext() {
        return isFunction(this.onSuperNext);
      },
      year() {
        return ['date', 'quarter', 'month', 'week'].includes(this.mode) &&
          this.value
          ? this.value.format('YYYY')
          : '';
      },
      month() {
        return ['date', 'week'].includes(this.mode) && this.value
          ? this.value.format('MM')
          : '';
      },
    },
    methods: {
      getIconClassName(show) {
        return [
          `${this.prefixCls}-header-icon`,
          {
            [`${this.prefixCls}-header-icon-hidden`]: !show,
          },
        ];
      },
    },
  };

  /* script */
  const __vue_script__$c = script$c;

  /* template */
  var __vue_render__$c = function () {var _vm=this;var _h=_vm.$createElement;var _c=_vm._self._c||_h;return _c('div',{class:(_vm.prefixCls + "-header")},[_c('div',{class:_vm.getIconClassName(_vm.showSuperPrev),on:{"click":_vm.onSuperPrev}},[(_vm.showSuperPrev)?[_c('IconCommon',{attrs:{"use":"doubleLeft"}})]:_vm._e()],2),_vm._v(" "),_c('div',{class:_vm.getIconClassName(_vm.showPrev),on:{"click":function () { return _vm.onPrev && _vm.onPrev(); }}},[(_vm.showPrev)?[_c('IconCommon',{attrs:{"use":"left"}})]:_vm._e()],2),_vm._v(" "),_c('div',{class:(_vm.prefixCls + "-header-title")},[(_vm.onLabelClick && (_vm.year || _vm.month))?[(_vm.year)?_c('span',{class:(_vm.prefixCls + "-header-label"),on:{"click":function () { return _vm.onLabelClick && _vm.onLabelClick('year'); }}},[_vm._v(_vm._s(_vm.year))]):_vm._e(),_vm._v(" "),(_vm.year && _vm.month)?_c('span',[_vm._v("-")]):_vm._e(),_vm._v(" "),(_vm.month)?_c('span',{class:(_vm.prefixCls + "-header-label"),on:{"click":function () { return _vm.onLabelClick && _vm.onLabelClick('month'); }}},[_vm._v(_vm._s(_vm.month))]):_vm._e()]:[_vm._v(_vm._s(_vm.title))]],2),_vm._v(" "),_c('div',{class:_vm.getIconClassName(_vm.showNext),on:{"click":function () { return _vm.onNext && _vm.onNext(); }}},[(_vm.showNext)?[_c('IconCommon',{attrs:{"use":"right"}})]:_vm._e()],2),_vm._v(" "),_c('div',{class:_vm.getIconClassName(_vm.showSuperNext),on:{"click":_vm.onSuperNext}},[(_vm.showSuperNext)?[_c('IconCommon',{attrs:{"use":"doubleRight"}})]:_vm._e()],2)])};
  var __vue_staticRenderFns__$c = [];

    /* style */
    const __vue_inject_styles__$c = undefined;
    /* scoped */
    const __vue_scope_id__$c = undefined;
    /* module identifier */
    const __vue_module_identifier__$c = undefined;
    /* functional template */
    const __vue_is_functional_template__$c = false;
    /* style inject */
    
    /* style inject SSR */
    
    /* style inject shadow dom */
    

    
    const __vue_component__$c = /*#__PURE__*/normalizeComponent(
      { render: __vue_render__$c, staticRenderFns: __vue_staticRenderFns__$c },
      __vue_inject_styles__$c,
      __vue_script__$c,
      __vue_scope_id__$c,
      __vue_is_functional_template__$c,
      __vue_module_identifier__$c,
      false,
      undefined,
      undefined,
      undefined
    );

  var extend = function extend(o, c) {
    if (o && c && _typeof(c) === 'object') {
      // eslint-disable-next-line guard-for-in
      for (var p in c) {
        o[p] = c[p];
      }
    }
    return o;
  };
  var creatLenArr = function creatLenArr(year, month, len, start) {
    var arr = [];
    start = start || 0;
    if (len < 1) return arr;
    var k = start;
    for (var i = 0; i < len; i++) {
      arr.push({
        year: year,
        month: month,
        day: k
      });
      k++;
    }
    return arr;
  };

  // 错误码列表
  var errorCode = {
    100: '输入的年份超过了可查询范围，仅支持1891至2100年',
    101: '参数输入错误，请查阅文档'
  };

  // 某年相同计算进行cache，以加速计算速度
  var cache = null;
  // cache管理工具

  var cacheUtil = {
    current: '',
    setCurrent: function setCurrent(year) {
      if (this.current !== year) {
        this.current = year;
        this.clear();
      }
    },
    set: function set(key, value) {
      if (!cache) cache = {};
      cache[key] = value;
      return cache[key];
    },
    get: function get(key) {
      if (!cache) cache = {};
      return cache[key];
    },
    clear: function clear() {
      cache = null;
    }
  };
  var formatDayD4 = function formatDayD4(month, day) {
    month += 1;
    month = month < 10 ? "0".concat(month) : month;
    day = day < 10 ? "0".concat(day) : day;
    return "d".concat(month).concat(day);
  };
  var minYear = 1890; // 最小年限
  var maxYear = 2100; // 最大年限

  var DATA = {
    heavenlyStems: ['甲', '乙', '丙', '丁', '戊', '己', '庚', '辛', '壬', '癸'],
    // 天干
    earthlyBranches: ['子', '丑', '寅', '卯', '辰', '巳', '午', '未', '申', '酉', '戌', '亥'],
    // 地支
    zodiac: ['鼠', '牛', '虎', '兔', '龙', '蛇', '马', '羊', '猴', '鸡', '狗', '猪'],
    // 对应地支十二生肖
    solarTerm: ['小寒', '大寒', '立春', '雨水', '惊蛰', '春分', '清明', '谷雨', '立夏', '小满', '芒种', '夏至', '小暑', '大暑', '立秋', '处暑', '白露', '秋分', '寒露', '霜降', '立冬', '小雪', '大雪', '冬至'],
    // 二十四节气
    monthCn: ['正', '二', '三', '四', '五', '六', '七', '八', '九', '十', '冬', '腊'],
    dateCn: ['初一', '初二', '初三', '初四', '初五', '初六', '初七', '初八', '初九', '初十', '十一', '十二', '十三', '十四', '十五', '十六', '十七', '十八', '十九', '二十', '廿一', '廿二', '廿三', '廿四', '廿五', '廿六', '廿七', '廿八', '廿九', '三十', '卅一']
  };

  // 中国节日放假安排，外部设置，0无特殊安排，1工作，2放假
  var worktime = {};

  // 公历节日
  var solarFestival = {
    d0101: '元旦节',
    d0202: '世界湿地日',
    d0210: '国际气象节',
    d0214: '情人节',
    d0301: '国际海豹日',
    d0303: '全国爱耳日',
    d0305: '学雷锋纪念日',
    d0308: '妇女节',
    d0312: '植树节 孙中山逝世纪念日',
    d0314: '国际警察日',
    d0315: '消费者权益日',
    d0317: '中国国医节 国际航海日',
    d0321: '世界森林日 消除种族歧视国际日 世界儿歌日',
    d0322: '世界水日',
    d0323: '世界气象日',
    d0324: '世界防治结核病日',
    d0325: '全国中小学生安全教育日',
    d0330: '巴勒斯坦国土日',
    d0401: '愚人节 全国爱国卫生运动月(四月) 税收宣传月(四月)',
    d0407: '世界卫生日',
    d0422: '世界地球日',
    d0423: '世界图书和版权日',
    d0424: '亚非新闻工作者日',
    d0501: '劳动节',
    d0504: '青年节',
    d0505: '碘缺乏病防治日',
    d0508: '世界红十字日',
    d0512: '国际护士节',
    d0515: '国际家庭日',
    d0517: '世界电信日',
    d0518: '国际博物馆日',
    d0520: '全国学生营养日',
    d0522: '国际生物多样性日',
    d0523: '国际牛奶日',
    d0531: '世界无烟日',
    d0601: '国际儿童节',
    d0605: '世界环境日',
    d0606: '全国爱眼日',
    d0617: '防治荒漠化和干旱日',
    d0623: '国际奥林匹克日',
    d0625: '全国土地日',
    d0626: '国际禁毒日',
    d0701: '香港回归纪念日 中共诞辰 世界建筑日',
    d0702: '国际体育记者日',
    d0707: '抗日战争纪念日',
    d0711: '世界人口日',
    d0730: '非洲妇女日',
    d0801: '建军节',
    d0808: '中国男子节(爸爸节)',
    d0815: '抗日战争胜利纪念',
    d0908: '国际扫盲日 国际新闻工作者日',
    d0909: '毛泽东逝世纪念',
    d0910: '中国教师节',
    d0914: '世界清洁地球日',
    d0916: '国际臭氧层保护日',
    d0918: '九一八事变纪念日',
    d0920: '国际爱牙日',
    d0927: '世界旅游日',
    d0928: '孔子诞辰',
    d1001: '国庆节 世界音乐日 国际老人节',
    d1002: '国际和平与民主自由斗争日',
    d1004: '世界动物日',
    d1006: '老人节',
    d1008: '全国高血压日 世界视觉日',
    d1009: '世界邮政日 万国邮联日',
    d1010: '辛亥革命纪念日 世界精神卫生日',
    d1013: '世界保健日 国际教师节',
    d1014: '世界标准日',
    d1015: '国际盲人节(白手杖节)',
    d1016: '世界粮食日',
    d1017: '世界消除贫困日',
    d1022: '世界传统医药日',
    d1024: '联合国日 世界发展信息日',
    d1031: '世界勤俭日',
    d1107: '十月社会主义革命纪念日',
    d1108: '中国记者日',
    d1109: '全国消防安全宣传教育日',
    d1110: '世界青年节',
    d1111: '国际科学与和平周(本日所属的一周)',
    d1112: '孙中山诞辰纪念日',
    d1114: '世界糖尿病日',
    d1117: '国际大学生节 世界学生节',
    d1121: '世界问候日 世界电视日',
    d1129: '国际声援巴勒斯坦人民国际日',
    d1201: '世界艾滋病日',
    d1203: '世界残疾人日',
    d1205: '国际经济和社会发展志愿人员日',
    d1208: '国际儿童电视日',
    d1209: '世界足球日',
    d1210: '世界人权日',
    d1212: '西安事变纪念日',
    d1213: '南京大屠杀(1937年)纪念日！紧记血泪史！',
    d1220: '澳门回归纪念',
    d1221: '国际篮球日',
    d1224: '平安夜',
    d1225: '圣诞节',
    d1226: '毛泽东诞辰纪念'
  };

  // 农历节日
  var lunarFestival = {
    d0101: '春节',
    d0115: '元宵节',
    d0202: '龙抬头',
    d0323: '妈祖生辰',
    d0505: '端午节',
    d0707: '七夕',
    d0715: '中元节',
    d0815: '中秋节',
    d0909: '重阳节',
    d1015: '下元节',
    d1208: '腊八节',
    d1223: '小年',
    d0100: '除夕'
  };

  /**
   * 1890 - 2100 年的农历数据
   * 数据格式：[0,2,9,21936]
   * [闰月所在月，0为没有闰月; *正月初一对应公历月; *正月初一对应公历日; *农历每月的天数的数组（需转换为二进制,得到每月大小，0=小月(29日),1=大月(30日)）;]
   */
  var lunarInfo = [[2, 1, 21, 22184], [0, 2, 9, 21936], [6, 1, 30, 9656], [0, 2, 17, 9584], [0, 2, 6, 21168], [5, 1, 26, 43344], [0, 2, 13, 59728], [0, 2, 2, 27296], [3, 1, 22, 44368], [0, 2, 10, 43856], [8, 1, 30, 19304], [0, 2, 19, 19168], [0, 2, 8, 42352], [5, 1, 29, 21096], [0, 2, 16, 53856], [0, 2, 4, 55632], [4, 1, 25, 27304], [0, 2, 13, 22176], [0, 2, 2, 39632], [2, 1, 22, 19176], [0, 2, 10, 19168], [6, 1, 30, 42200], [0, 2, 18, 42192], [0, 2, 6, 53840], [5, 1, 26, 54568], [0, 2, 14, 46400], [0, 2, 3, 54944], [2, 1, 23, 38608], [0, 2, 11, 38320], [7, 2, 1, 18872], [0, 2, 20, 18800], [0, 2, 8, 42160], [5, 1, 28, 45656], [0, 2, 16, 27216], [0, 2, 5, 27968], [4, 1, 24, 44456], [0, 2, 13, 11104], [0, 2, 2, 38256], [2, 1, 23, 18808], [0, 2, 10, 18800], [6, 1, 30, 25776], [0, 2, 17, 54432], [0, 2, 6, 59984], [5, 1, 26, 27976], [0, 2, 14, 23248], [0, 2, 4, 11104], [3, 1, 24, 37744], [0, 2, 11, 37600], [7, 1, 31, 51560], [0, 2, 19, 51536], [0, 2, 8, 54432], [6, 1, 27, 55888], [0, 2, 15, 46416], [0, 2, 5, 22176], [4, 1, 25, 43736], [0, 2, 13, 9680], [0, 2, 2, 37584], [2, 1, 22, 51544], [0, 2, 10, 43344], [7, 1, 29, 46248], [0, 2, 17, 27808], [0, 2, 6, 46416], [5, 1, 27, 21928], [0, 2, 14, 19872], [0, 2, 3, 42416], [3, 1, 24, 21176], [0, 2, 12, 21168], [8, 1, 31, 43344], [0, 2, 18, 59728], [0, 2, 8, 27296], [6, 1, 28, 44368], [0, 2, 15, 43856], [0, 2, 5, 19296], [4, 1, 25, 42352], [0, 2, 13, 42352], [0, 2, 2, 21088], [3, 1, 21, 59696], [0, 2, 9, 55632], [7, 1, 30, 23208], [0, 2, 17, 22176], [0, 2, 6, 38608], [5, 1, 27, 19176], [0, 2, 15, 19152], [0, 2, 3, 42192], [4, 1, 23, 53864], [0, 2, 11, 53840], [8, 1, 31, 54568], [0, 2, 18, 46400], [0, 2, 7, 46752], [6, 1, 28, 38608], [0, 2, 16, 38320], [0, 2, 5, 18864], [4, 1, 25, 42168], [0, 2, 13, 42160], [10, 2, 2, 45656], [0, 2, 20, 27216], [0, 2, 9, 27968], [6, 1, 29, 44448], [0, 2, 17, 43872], [0, 2, 6, 38256], [5, 1, 27, 18808], [0, 2, 15, 18800], [0, 2, 4, 25776], [3, 1, 23, 27216], [0, 2, 10, 59984], [8, 1, 31, 27432], [0, 2, 19, 23232], [0, 2, 7, 43872], [5, 1, 28, 37736], [0, 2, 16, 37600], [0, 2, 5, 51552], [4, 1, 24, 54440], [0, 2, 12, 54432], [0, 2, 1, 55888], [2, 1, 22, 23208], [0, 2, 9, 22176], [7, 1, 29, 43736], [0, 2, 18, 9680], [0, 2, 7, 37584], [5, 1, 26, 51544], [0, 2, 14, 43344], [0, 2, 3, 46240], [4, 1, 23, 46416], [0, 2, 10, 44368], [9, 1, 31, 21928], [0, 2, 19, 19360], [0, 2, 8, 42416], [6, 1, 28, 21176], [0, 2, 16, 21168], [0, 2, 5, 43312], [4, 1, 25, 29864], [0, 2, 12, 27296], [0, 2, 1, 44368], [2, 1, 22, 19880], [0, 2, 10, 19296], [6, 1, 29, 42352], [0, 2, 17, 42208], [0, 2, 6, 53856], [5, 1, 26, 59696], [0, 2, 13, 54576], [0, 2, 3, 23200], [3, 1, 23, 27472], [0, 2, 11, 38608], [11, 1, 31, 19176], [0, 2, 19, 19152], [0, 2, 8, 42192], [6, 1, 28, 53848], [0, 2, 15, 53840], [0, 2, 4, 54560], [5, 1, 24, 55968], [0, 2, 12, 46496], [0, 2, 1, 22224], [2, 1, 22, 19160], [0, 2, 10, 18864], [7, 1, 30, 42168], [0, 2, 17, 42160], [0, 2, 6, 43600], [5, 1, 26, 46376], [0, 2, 14, 27936], [0, 2, 2, 44448], [3, 1, 23, 21936], [0, 2, 11, 37744], [8, 2, 1, 18808], [0, 2, 19, 18800], [0, 2, 8, 25776], [6, 1, 28, 27216], [0, 2, 15, 59984], [0, 2, 4, 27424], [4, 1, 24, 43872], [0, 2, 12, 43744], [0, 2, 2, 37600], [3, 1, 21, 51568], [0, 2, 9, 51552], [7, 1, 29, 54440], [0, 2, 17, 54432], [0, 2, 5, 55888], [5, 1, 26, 23208], [0, 2, 14, 22176], [0, 2, 3, 42704], [4, 1, 23, 21224], [0, 2, 11, 21200], [8, 1, 31, 43352], [0, 2, 19, 43344], [0, 2, 7, 46240], [6, 1, 27, 46416], [0, 2, 15, 44368], [0, 2, 5, 21920], [4, 1, 24, 42448], [0, 2, 12, 42416], [0, 2, 2, 21168], [3, 1, 22, 43320], [0, 2, 9, 26928], [7, 1, 29, 29336], [0, 2, 17, 27296], [0, 2, 6, 44368], [5, 1, 26, 19880], [0, 2, 14, 19296], [0, 2, 3, 42352], [4, 1, 24, 21104], [0, 2, 10, 53856], [8, 1, 30, 59696], [0, 2, 18, 54560], [0, 2, 7, 55968], [6, 1, 27, 27472], [0, 2, 15, 22224], [0, 2, 5, 19168], [4, 1, 25, 42216], [0, 2, 12, 42192], [0, 2, 1, 53584], [2, 1, 21, 55592], [0, 2, 9, 54560]];

  /**
   * 二十四节气数据，节气点时间（单位是分钟）
   * 从0小寒起算
   */
  var termInfo = [0, 21208, 42467, 63836, 85337, 107014, 128867, 150921, 173149, 195551, 218072, 240693, 263343, 285989, 308563, 331033, 353350, 375494, 397447, 419210, 440795, 462224, 483532, 504758];

  /**
   * 判断农历年闰月数
   * @param {Number} year 农历年
   * return 闰月数 （月份从1开始）
   */
  function getLunarLeapYear(year) {
    var yearData = lunarInfo[year - minYear];
    return yearData[0];
  }

  /**
   * 获取农历年份一年的每月的天数及一年的总天数
   * @param {Number} year 农历年
   */
  function getLunarYearDays(year) {
    var yearData = lunarInfo[year - minYear];
    var leapMonth = yearData[0]; // 闰月
    var monthData = yearData[3].toString(2);
    var monthDataArr = monthData.split('').map(function (item) {
      return parseInt(item, 10);
    });

    // 还原数据至16位,少于16位的在前面插入0（二进制存储时前面的0被忽略）
    for (var i = 0; i < 16 - monthDataArr.length; i++) {
      monthDataArr.unshift(0);
    }
    var len = leapMonth ? 13 : 12; // 该年有几个月
    var yearDays = 0;
    var monthDays = [];
    for (var _i = 0; _i < len; _i++) {
      if (monthDataArr[_i] === 0) {
        yearDays += 29;
        monthDays.push(29);
      } else {
        yearDays += 30;
        monthDays.push(30);
      }
    }
    return {
      yearDays: yearDays,
      monthDays: monthDays
    };
  }

  /**
   * 通过间隔天数查找农历日期
   * @param {Number} year,between 农历年，间隔天数
   * @param between
   */
  function getLunarDateByBetween(year, between) {
    var lunarYearDays = getLunarYearDays(year);
    var end = between > 0 ? between : lunarYearDays.yearDays - Math.abs(between);
    var monthDays = lunarYearDays.monthDays;
    var tempDays = 0;
    var month = 0;
    for (var i = 0; i < monthDays.length; i++) {
      tempDays += monthDays[i];
      if (tempDays > end) {
        month = i;
        tempDays -= monthDays[i];
        break;
      }
    }
    return [year, month, end - tempDays + 1];
  }

  /**
   * 根据距离正月初一的天数计算农历日期
   * @param {Number} year 公历年，月，日
   * @param month
   * @param day
   */
  function getLunarByBetween(year, month, day) {
    var yearData = lunarInfo[year - minYear];
    var zenMonth = yearData[1];
    var zenDay = yearData[2];
    var between = getDaysBetweenSolar(year, zenMonth - 1, zenDay, year, month, day);
    if (between === 0) {
      // 正月初一
      return [year, 0, 1];
    }
    var lunarYear = between > 0 ? year : year - 1;
    return getLunarDateByBetween(lunarYear, between);
  }

  /**
   * 两个公历日期之间的天数
   */
  function getDaysBetweenSolar(year, month, day, year1, month1, day1) {
    var date = new Date(year, month, day).getTime();
    var date1 = new Date(year1, month1, day1).getTime();
    return (date1 - date) / 86400000;
  }

  /**
   * 计算农历日期离正月初一有多少天
   * @param {Number} year,month,day 农年，月(0-12，有闰月)，日
   * @param month
   * @param day
   */
  function getDaysBetweenZheng(year, month, day) {
    var lunarYearDays = getLunarYearDays(year);
    var monthDays = lunarYearDays.monthDays;
    var days = 0;
    for (var i = 0; i < monthDays.length; i++) {
      if (i < month) {
        days += monthDays[i];
      } else {
        break;
      }
    }
    return days + day - 1;
  }

  /**
   * 某年的第n个节气为几日
   * 31556925974.7为地球公转周期，是毫秒
   * 1890年的正小寒点：01-05 16:02:31，1890年为基准点
   * @param {Number} y 公历年
   * @param {Number} n 第几个节气，从0小寒起算
   * 由于农历24节气交节时刻采用近似算法，可能存在少量误差(30分钟内)
   */
  function getTerm(y, n) {
    var offDate = new Date(31556925974.7 * (y - 1890) + termInfo[n] * 60000 + Date.UTC(1890, 0, 5, 16, 2, 31));
    return offDate.getUTCDate();
  }

  /**
   * 获取公历年一年的二十四节气
   * 返回key:日期，value:节气中文名
   */
  function getYearTerm(year) {
    var res = {};
    var month = 0;
    for (var i = 0; i < 24; i++) {
      var day = getTerm(year, i);
      if (i % 2 === 0) month++;
      res[formatDayD4(month - 1, day)] = DATA.solarTerm[i];
    }
    return res;
  }

  /**
   * 获取生肖
   * @param {Number} year 干支所在年（默认以立春前的公历年作为基数）
   */
  function getYearZodiac(year) {
    var num = year - 1890 + 25; // 参考干支纪年的计算，生肖对应地支
    return DATA.zodiac[num % 12];
  }

  /**
   * 计算天干地支
   * @param {Number} num 60进制中的位置(把60个天干地支，当成一个60进制的数)
   */
  function cyclical(num) {
    return DATA.heavenlyStems[num % 10] + DATA.earthlyBranches[num % 12];
  }

  /**
   * 获取干支纪年
   * @param {Number} year 干支所在年
   * @param {Number} offset 偏移量，默认为0，便于查询一个年跨两个干支纪年（以立春为分界线）
   */
  function getLunarYearName(year, offset) {
    offset = offset || 0;
    // 1890年1月小寒（小寒一般是1月5或6日）以前为己丑年，在60进制中排25
    return cyclical(year - 1890 + 25 + offset);
  }

  /**
   * 获取干支纪月
   * @param {Number} year,month 公历年，干支所在月
   * @param month
   * @param {Number} offset 偏移量，默认为0，便于查询一个月跨两个干支纪月（有立春的2月）
   */
  function getLunarMonthName(year, month, offset) {
    offset = offset || 0;
    // 1890年1月小寒以前为丙子月，在60进制中排12
    return cyclical((year - 1890) * 12 + month + 12 + offset);
  }

  /**
   * 获取干支纪日
   * @param {Number} year,month,day 公历年，月，日
   * @param month
   * @param day
   */
  function getLunarDayName(year, month, day) {
    // 当日与1890/1/1 相差天数
    // 1890/1/1与 1970/1/1 相差29219日, 1890/1/1 日柱为壬午日(60进制18)
    var dayCyclical = Date.UTC(year, month, day) / 86400000 + 29219 + 18;
    return cyclical(dayCyclical);
  }

  /**
   * 获取公历月份的天数
   * @param {Number} year 公历年
   * @param {Number} month 公历月
   */
  function getSolarMonthDays(year, month) {
    var monthDays = [31, isLeapYear(year) ? 29 : 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
    return monthDays[month];
  }

  /**
   * 判断公历年是否是闰年
   * @param {Number} year 公历年
   */
  function isLeapYear(year) {
    return year % 4 === 0 && year % 100 !== 0 || year % 400 === 0;
  }

  /*
   * 统一日期输入参数（输入月份从1开始，内部月份统一从0开始）
   */
  function formatDate(year, month, day, _minYear) {
    var argsLen = arguments.length;
    var now = getNow();
    year = argsLen ? parseInt(year, 10) : now.getFullYear();
    month = argsLen ? parseInt(month - 1, 10) : now.getMonth();
    day = argsLen ? parseInt(day, 10) || now.getDate() : now.getDate();
    if (year < (_minYear || minYear + 1) || year > maxYear) return {
      error: 100,
      msg: errorCode[100]
    };
    return {
      year: year,
      month: month,
      day: day
    };
  }

  /**
   * 将农历转换为公历
   * @param {Number} _year,_month,_day 农历年，月(1-13，有闰月)，日
   * @param _month
   * @param _day
   */
  function lunarToSolar(_year, _month, _day) {
    var inputDate = formatDate(_year, _month, _day);
    if (inputDate.error) return inputDate;
    var year = inputDate.year;
    var month = inputDate.month;
    var day = inputDate.day;
    var between = getDaysBetweenZheng(year, month, day); // 离正月初一的天数
    var yearData = lunarInfo[year - minYear];
    var zenMonth = yearData[1];
    var zenDay = yearData[2];
    var offDate = new Date(year, zenMonth - 1, zenDay).getTime() + between * 86400000;
    offDate = new Date(offDate);
    return {
      year: offDate.getFullYear(),
      month: offDate.getMonth() + 1,
      day: offDate.getDate()
    };
  }

  /**
   * 将公历转换为农历
   * @param {Number} _year,_month,_day 公历年，月，日
   * @param _month
   * @param _day
   */
  function solarToLunar(_year, _month, _day) {
    var inputDate = formatDate(_year, _month, _day, minYear);
    if (inputDate.error) return inputDate;
    var year = inputDate.year;
    var month = inputDate.month;
    var day = inputDate.day;
    cacheUtil.setCurrent(year);
    // 立春日期
    var term2 = cacheUtil.get('term2') ? cacheUtil.get('term2') : cacheUtil.set('term2', getTerm(year, 2));
    // 二十四节气
    var termList = cacheUtil.get('termList') ? cacheUtil.get('termList') : cacheUtil.set('termList', getYearTerm(year));
    var firstTerm = getTerm(year, month * 2); // 某月第一个节气开始日期
    var GanZhiYear = month > 1 || month === 1 && day >= term2 ? year + 1 : year; // 干支所在年份
    var GanZhiMonth = day >= firstTerm ? month + 1 : month; // 干支所在月份（以节气为界）

    var lunarDate = getLunarByBetween(year, month, day);
    var lunarLeapMonth = getLunarLeapYear(lunarDate[0]);
    var lunarMonthName;
    if (lunarLeapMonth > 0 && lunarLeapMonth === lunarDate[1]) {
      lunarMonthName = "\u95F0".concat(DATA.monthCn[lunarDate[1] - 1], "\u6708");
    } else if (lunarLeapMonth > 0 && lunarDate[1] > lunarLeapMonth) {
      lunarMonthName = "".concat(DATA.monthCn[lunarDate[1] - 1], "\u6708");
    } else {
      lunarMonthName = "".concat(DATA.monthCn[lunarDate[1]], "\u6708");
    }

    // 农历节日判断
    var lunarFtv;
    var lunarMonthDays = getLunarYearDays(lunarDate[0]).monthDays;
    // 除夕
    if (lunarDate[1] === lunarMonthDays.length - 1 && lunarDate[2] === lunarMonthDays[lunarMonthDays.length - 1]) {
      lunarFtv = lunarFestival.d0100;
    } else if (lunarLeapMonth > 0 && lunarDate[1] > lunarLeapMonth) {
      lunarFtv = lunarFestival[formatDayD4(lunarDate[1] - 1, lunarDate[2])];
    } else {
      lunarFtv = lunarFestival[formatDayD4(lunarDate[1], lunarDate[2])];
    }
    return {
      zodiac: getYearZodiac(GanZhiYear),
      GanZhiYear: getLunarYearName(GanZhiYear),
      GanZhiMonth: getLunarMonthName(year, GanZhiMonth),
      GanZhiDay: getLunarDayName(year, month, day),
      // 放假安排：0无特殊安排，1工作，2放假
      worktime: worktime["y".concat(year)] && worktime["y".concat(year)][formatDayD4(month, day)] ? worktime["y".concat(year)][formatDayD4(month, day)] : 0,
      term: termList[formatDayD4(month, day)],
      lunarYear: lunarDate[0],
      lunarMonth: lunarDate[1] + 1,
      lunarDay: lunarDate[2],
      lunarMonthName: lunarMonthName,
      lunarDayName: DATA.dateCn[lunarDate[2] - 1],
      lunarLeapMonth: lunarLeapMonth,
      solarFestival: solarFestival[formatDayD4(month, day)],
      lunarFestival: lunarFtv,
      // 是否是大月
      isBigMonth: lunarMonthDays[lunarDate[1]] === 30
    };
  }

  /**
   * 获取指定公历月份的农历数据
   * return res{Object}
   * @param {Number} _year,month 公历年，月
   * @param _month
   * @param {Boolean} fill 是否用上下月数据补齐首尾空缺，首例数据从周日开始
   */
  function calendar(_year, _month, fill) {
    var inputDate = formatDate(_year, _month);
    if (inputDate.error) return inputDate;
    var year = inputDate.year;
    var month = inputDate.month;
    var calendarData = solarCalendar(year, month + 1, fill);
    for (var i = 0; i < calendarData.monthData.length; i++) {
      var cData = calendarData.monthData[i];
      var lunarData = solarToLunar(cData.year, cData.month, cData.day);
      extend(calendarData.monthData[i], lunarData);
    }
    return calendarData;
  }

  /**
   * 公历某月日历
   * return res{Object}
   * @param {Number} _year,month 公历年，月
   * @param _month
   * @param {Boolean} fill 是否用上下月数据补齐首尾空缺，首例数据从周日开始 (7*6阵列)
   */
  function solarCalendar(_year, _month, fill) {
    var inputDate = formatDate(_year, _month);
    if (inputDate.error) return inputDate;
    var year = inputDate.year;
    var month = inputDate.month;
    var firstDate = new Date(year, month, 1);
    var preMonthDays;
    var preMonthData;
    var nextMonthData;
    var res = {
      firstDay: firstDate.getDay(),
      // 该月1号星期几
      monthDays: getSolarMonthDays(year, month),
      // 该月天数
      monthData: []
    };
    res.monthData = creatLenArr(year, month + 1, res.monthDays, 1);
    if (fill) {
      if (res.firstDay > 0) {
        // 前补
        var preYear = month - 1 < 0 ? year - 1 : year;
        var preMonth = month - 1 < 0 ? 11 : month - 1;
        preMonthDays = getSolarMonthDays(preYear, preMonth);
        preMonthData = creatLenArr(preYear, preMonth + 1, res.firstDay, preMonthDays - res.firstDay + 1);
        res.monthData = preMonthData.concat(res.monthData);
      }
      if (7 * 6 - res.monthData.length !== 0) {
        // 后补
        var nextYear = month + 1 > 11 ? year + 1 : year;
        var nextMonth = month + 1 > 11 ? 0 : month + 1;
        var fillLen = 7 * 6 - res.monthData.length;
        nextMonthData = creatLenArr(nextYear, nextMonth + 1, fillLen, 1);
        res.monthData = res.monthData.concat(nextMonthData);
      }
    }
    return res;
  }

  /**
   * 设置放假安排【对外暴露接口】
   * @param {Object} workData
   */
  function setWorktime(workData) {
    extend(worktime, workData);
  }
  var LunarCalendar = {
    solarToLunar: solarToLunar,
    lunarToSolar: lunarToSolar,
    calendar: calendar,
    solarCalendar: solarCalendar,
    setWorktime: setWorktime,
    getSolarMonthDays: getSolarMonthDays,
    getLunarYearName: getLunarYearName
  };

  //

  var script$b = {
    name: 'PanelBody',
    components: {
      RenderFunction: __vue_component__$e,
    },
    props: {
      prefixCls: {
        type: String,
        required: true,
      },
      rows: {
        type: Array,
        default: () => [],
      },
      value: {
        type: Object,
      },
      disabledDate: {
        type: Function,
      },
      isSameTime: {
        type: Function,
        required: true,
      },
      mode: {
        type: String,
      },
      rangeValues: {
        type: Array,
      },
      dateRender: {
        type: Function,
      },
      showLunar: {
        type: Boolean,
      },
    },
    computed: {
      isWeek() {
        return this.mode === 'week';
      },
      sortedRangeValues() {
        return this.rangeValues && this.rangeValues.every(isDayjs)
          ? getSortedDayjsArray(this.rangeValues)
          : this.rangeValues;
      },
      rangeStart() {
        return this.sortedRangeValues?.[0];
      },
      rangeEnd() {
        return this.sortedRangeValues?.[1];
      },
    },
    methods: {
      getLunar(date) {
        if (!this.showLunar) return '';
        const year = date.format('YYYY');
        const month = date.format('MM');
        const day = date.format('DD');
        const lunarCalendar = LunarCalendar.solarToLunar(year, month, day);
        if (this.mode === 'date' || this.mode === 'week') {
          return lunarCalendar?.lunarFestival || lunarCalendar?.lunarDayName;
        }
        if (this.mode === 'year') {
          return lunarCalendar?.GanZhiYear;
        }
        if (this.mode === 'month') {
          return lunarCalendar?.GanZhiMonth || lunarCalendar?.lunarMonthName;
        }
        return '';
      },
      isCellDisabled(cellData) {
        if (typeof this.disabledDate === 'function' && this.disabledDate) {
          return this.disabledDate(getDateValue(cellData.value));
        }
        return false;
      },
      getCellClassName(cellData) {
        const disabled = this.isCellDisabled(cellData);
        return this.useCellClassName(cellData, disabled);
      },
      useCellClassName(cellData, disabled) {
        const isInView = !cellData.isPrev && !cellData.isNext;
        const isToday = this.isSameTime(cellData.value, getNow());
        const isSelected =
          this.value && this.isSameTime(cellData.value, this.value);
        const isRangeStart =
          isInView &&
          this.rangeStart &&
          this.isSameTime(cellData.value, this.rangeStart);
        const isRangeEnd =
          isInView &&
          this.rangeEnd &&
          this.isSameTime(cellData.value, this.rangeEnd);
        const isInRange =
          isInView &&
          this.rangeStart &&
          this.rangeEnd &&
          (isRangeStart ||
            isRangeEnd ||
            cellData.value.isBetween(this.rangeStart, this.rangeEnd, null, '[]'));
        return [
          `${this.prefixCls}-cell`,
          {
            [`${this.prefixCls}-cell-in-view`]: isInView,
            [`${this.prefixCls}-cell-today`]: isToday,
            [`${this.prefixCls}-cell-selected`]: isSelected,
            [`${this.prefixCls}-cell-range-start`]: isRangeStart,
            [`${this.prefixCls}-cell-range-end`]: isRangeEnd,
            [`${this.prefixCls}-cell-in-range`]: isInRange,
            [`${this.prefixCls}-cell-lunar`]: this.showLunar,
            [`${this.prefixCls}-cell-disabled`]: disabled,
          },
          cellData.classNames,
        ];
      },
      onCellClick(cellData) {
        const disabled = this.isCellDisabled(cellData);
        if (disabled) return;
        this.$emit('cellClick', cellData);
      },
      onCellMouseEnter(cellData) {
        const disabled = this.isCellDisabled(cellData);
        if (disabled) return;
        this.$emit('cellMouseEnter', cellData);
      },
      onCellMouseLeave(cellData) {
        const disabled = this.isCellDisabled(cellData);
        if (disabled) return;
        this.$emit('cellMouseEnter', cellData);
      },
    },
  };

  /* script */
  const __vue_script__$b = script$b;

  /* template */
  var __vue_render__$b = function () {var _vm=this;var _h=_vm.$createElement;var _c=_vm._self._c||_h;return _c('div',{class:(_vm.prefixCls + "-body")},_vm._l((_vm.rows),function(row,rowIndex){
  var _obj;
  return _c('div',{key:rowIndex,class:[
        (_vm.prefixCls + "-row"),
        ( _obj = {}, _obj[(_vm.prefixCls + "-row-week")] = _vm.isWeek, _obj ) ]},[_vm._l((row),function(cell,colIndex){return [(_vm.isWeek && colIndex === 0)?[_c('div',{key:colIndex,class:[(_vm.prefixCls + "-cell"), (_vm.prefixCls + "-cell-week")]},[_c('div',{class:(_vm.prefixCls + "-date")},[_c('div',{class:(_vm.prefixCls + "-date-value")},[_vm._v(_vm._s(cell.label))])])])]:[_c('div',{key:colIndex,class:_vm.getCellClassName(cell),on:{"mouseenter":function () {
                _vm.onCellMouseEnter(cell);
              },"mouseleave":function () {
                _vm.onCellMouseLeave(cell);
              },"click":function () {
                _vm.onCellClick(cell);
              }}},[(_vm.dateRender)?_c('RenderFunction',{attrs:{"render-func":_vm.dateRender,"date":_vm.getDateValue(cell.value)}}):_c('div',{class:(_vm.prefixCls + "-date")},[_c('div',{class:(_vm.prefixCls + "-date-value")},[_vm._v("\n              "+_vm._s(cell.label)+"\n            ")]),_vm._v(" "),(_vm.showLunar)?_c('div',{class:(_vm.prefixCls + "-date-lunar")},[_vm._v(_vm._s(_vm.getLunar(cell.value)))]):_vm._e()])],1)]]})],2)}),0)};
  var __vue_staticRenderFns__$b = [];

    /* style */
    const __vue_inject_styles__$b = undefined;
    /* scoped */
    const __vue_scope_id__$b = undefined;
    /* module identifier */
    const __vue_module_identifier__$b = undefined;
    /* functional template */
    const __vue_is_functional_template__$b = false;
    /* style inject */
    
    /* style inject SSR */
    
    /* style inject shadow dom */
    

    
    const __vue_component__$b = /*#__PURE__*/normalizeComponent(
      { render: __vue_render__$b, staticRenderFns: __vue_staticRenderFns__$b },
      __vue_inject_styles__$b,
      __vue_script__$b,
      __vue_scope_id__$b,
      __vue_is_functional_template__$b,
      __vue_module_identifier__$b,
      false,
      undefined,
      undefined,
      undefined
    );

  //
  //
  //
  //
  //
  //
  //
  //
  //
  //
  //

  var script$a = {
    name: 'PanelWeekList',
    props: {
      prefixCls: {
        type: String,
        required: true,
      },
      weekList: {
        type: Array,
        required: true,
      },
    },
    data: () => ({
      labelList: ['日', '一', '二', '三', '四', '五', '六'],
    }),
  };

  /* script */
  const __vue_script__$a = script$a;

  /* template */
  var __vue_render__$a = function () {var _vm=this;var _h=_vm.$createElement;var _c=_vm._self._c||_h;return _c('div',{class:(_vm.prefixCls + "-week-list")},_vm._l((_vm.weekList),function(key){return _c('div',{key:key,class:(_vm.prefixCls + "-week-list-item")},[_vm._v(_vm._s(_vm.labelList[key] || ''))])}),0)};
  var __vue_staticRenderFns__$a = [];

    /* style */
    const __vue_inject_styles__$a = undefined;
    /* scoped */
    const __vue_scope_id__$a = undefined;
    /* module identifier */
    const __vue_module_identifier__$a = undefined;
    /* functional template */
    const __vue_is_functional_template__$a = false;
    /* style inject */
    
    /* style inject SSR */
    
    /* style inject shadow dom */
    

    
    const __vue_component__$a = /*#__PURE__*/normalizeComponent(
      { render: __vue_render__$a, staticRenderFns: __vue_staticRenderFns__$a },
      __vue_inject_styles__$a,
      __vue_script__$a,
      __vue_scope_id__$a,
      __vue_is_functional_template__$a,
      __vue_module_identifier__$a,
      false,
      undefined,
      undefined,
      undefined
    );

  // https://github.com/LiikeJS/Liike/blob/master/src/ease.js
  var easeInBy = function (power) { return function (t) { return Math.pow(t, power); }; };
  var easeOutBy = function (power) { return function (t) { return 1 - Math.abs(Math.pow(t - 1, power)); }; };
  var easeInOutBy = function (power) { return function (t) { return t < 0.5 ? easeInBy(power)(t * 2) / 2 : easeOutBy(power)(t * 2 - 1) / 2 + 0.5; }; };

  var linear = function (t) { return t; };
  var quadIn = easeInBy(2);
  var quadOut = easeOutBy(2);
  var quadInOut = easeInOutBy(2);
  var cubicIn = easeInBy(3);
  var cubicOut = easeOutBy(3);
  var cubicInOut = easeInOutBy(3);
  var quartIn = easeInBy(4);
  var quartOut = easeOutBy(4);
  var quartInOut = easeInOutBy(4);
  var quintIn = easeInBy(5);
  var quintOut = easeOutBy(5);
  var quintInOut = easeInOutBy(5);
  var sineIn = function (t) { return 1 + Math.sin(Math.PI / 2 * t - Math.PI / 2); };
  var sineOut = function (t) { return Math.sin(Math.PI / 2 * t); };
  var sineInOut = function (t) { return (1 + Math.sin(Math.PI * t - Math.PI / 2)) / 2; };
  var bounceOut = function (t) {
    var s = 7.5625;
    var p = 2.75;

    if (t < 1 / p) {
      return s * t * t;
    }
    if (t < 2 / p) {
      t -= 1.5 / p;
      return s * t * t + 0.75;
    }
    if (t < 2.5 / p) {
      t -= 2.25 / p;
      return s * t * t + 0.9375;
    }
    t -= 2.625 / p;
    return s * t * t + 0.984375;
  };
  var bounceIn = function (t) { return 1 - bounceOut(1 - t); };
  var bounceInOut = function (t) { return t < 0.5 ? bounceIn(t * 2) * 0.5 : bounceOut(t * 2 - 1) * 0.5 + 0.5; };

  var easing = /*#__PURE__*/Object.freeze({
    linear: linear,
    quadIn: quadIn,
    quadOut: quadOut,
    quadInOut: quadInOut,
    cubicIn: cubicIn,
    cubicOut: cubicOut,
    cubicInOut: cubicInOut,
    quartIn: quartIn,
    quartOut: quartOut,
    quartInOut: quartInOut,
    quintIn: quintIn,
    quintOut: quintOut,
    quintInOut: quintInOut,
    sineIn: sineIn,
    sineOut: sineOut,
    sineInOut: sineInOut,
    bounceOut: bounceOut,
    bounceIn: bounceIn,
    bounceInOut: bounceInOut
  });

  var Tween = function Tween(settings) {
    var from = settings.from;
    var to = settings.to;
    var duration = settings.duration;
    var delay = settings.delay;
    var easing = settings.easing;
    var onStart = settings.onStart;
    var onUpdate = settings.onUpdate;
    var onFinish = settings.onFinish;

    for (var key in from) {
      if (to[key] === undefined) {
        to[key] = from[key];
      }
    }
    for (var key$1 in to) {
      if (from[key$1] === undefined) {
        from[key$1] = to[key$1];
      }
    }

    this.from = from;
    this.to = to;
    this.duration = duration || 500;
    this.delay = delay || 0;
    this.easing = easing || 'linear';
    this.onStart = onStart;
    this.onUpdate = onUpdate || function () { };
    this.onFinish = onFinish;
    this.startTime = Date.now() + this.delay;
    this.started = false;
    this.finished = false;
    this.timer = null;
    this.keys = {};
  };

  Tween.prototype.update = function update () {
    this.time = Date.now();
    // delay some time
    if (this.time < this.startTime) {
      return;
    }
    if (this.finished) {
      return;
    }
    // finish animation
    if (this.elapsed === this.duration) {
      if (!this.finished) {
        this.finished = true;
        this.onFinish && this.onFinish(this.keys);
      }
      return;
    }
    this.elapsed = this.time - this.startTime;
    this.elapsed = this.elapsed > this.duration ? this.duration : this.elapsed;
    for (var key in this.to) {
      this.keys[key] = this.from[key] + (this.to[key] - this.from[key]) * easing[this.easing](this.elapsed / this.duration);
    }
    if (!this.started) {
      this.onStart && this.onStart(this.keys);
      this.started = true;
    }
    this.onUpdate(this.keys);
  };

  Tween.prototype.start = function start () {
      var this$1$1 = this;

    this.startTime = Date.now() + this.delay;
    var tick = function () {
      this$1$1.update();
      this$1$1.timer = requestAnimationFrame(tick);
      if (this$1$1.finished) {
        cancelAnimationFrame(this$1$1.timer);
        this$1$1.timer = null;
      }
    };
    tick();
  };

  Tween.prototype.stop = function stop () {
    cancelAnimationFrame(this.timer);
    this.timer = null;
  };

  function getColumnsFromFormat(format) {
    var units = ['H', 'h', 'm', 's', 'a', 'A'];
    var list = [];
    var use12Hours = false;
    units.forEach(function (unit) {
      if (format.indexOf(unit) !== -1) {
        list.push(unit);
        if (unit === 'a' || unit === 'A') {
          use12Hours = true;
        }
      }
    });
    return {
      list: list,
      use12Hours: use12Hours
    };
  }
  function isDisabledTime(value, _ref) {
    var disabledHours = _ref.disabledHours,
      disabledMinutes = _ref.disabledMinutes,
      disabledSeconds = _ref.disabledSeconds;
    if (!value) return false;
    var hour = value.hour();
    var minute = value.minute();
    var second = value.second();
    var disabledHourList = (disabledHours === null || disabledHours === void 0 ? void 0 : disabledHours()) || [];
    var disabledMinuteList = (disabledMinutes === null || disabledMinutes === void 0 ? void 0 : disabledMinutes(hour)) || [];
    var disabledSecondList = (disabledSeconds === null || disabledSeconds === void 0 ? void 0 : disabledSeconds(hour, minute)) || [];
    var isDisabledItem = function isDisabledItem(num, disabledList) {
      return !isUndefined(num) && disabledList.includes(num);
    };
    return isDisabledItem(hour, disabledHourList) || isDisabledItem(minute, disabledMinuteList) || isDisabledItem(second, disabledSecondList);
  }
  var scrollIds = new Map();
  function scrollTo(element, to, duration) {
    var scrollId = scrollIds.get(element);
    if (!isUndefined(scrollId)) {
      cancelAnimationFrame(scrollId);
    }
    if (duration <= 0) {
      element.scrollTop = to;
    }
    scrollIds.set(element, requestAnimationFrame(function () {
      var tween = new Tween({
        from: {
          scrollTop: element.scrollTop
        },
        to: {
          scrollTop: to
        },
        duration: duration,
        onUpdate: function onUpdate(keys) {
          element.scrollTop = keys.scrollTop;
        }
      });
      tween.start();
    }));
  }
  function omit(object, path) {
    var result = _objectSpread2({}, object);
    var _iterator = _createForOfIteratorHelper(path),
      _step;
    try {
      for (_iterator.s(); !(_step = _iterator.n()).done;) {
        var item = _step.value;
        if (item in result) {
          delete result[item];
        }
      }
    } catch (err) {
      _iterator.e(err);
    } finally {
      _iterator.f();
    }
    return result;
  }
  function mergeValueWithTime(defaultValue, dateValue, timeValue) {
    var dateVal = dateValue || defaultValue;
    var timeVal = timeValue || defaultValue;
    return timeVal.set('year', dateVal.year()).set('month', dateVal.month()).set('date', dateVal.date());
  }
  function pick(obj, keys) {
    var clone = {};
    keys.forEach(function (key) {
      var k = key;
      if (key in obj) {
        clone[k] = obj[k];
      }
    });
    return clone;
  }

  //

  var script$9 = {
    name: 'TimePickerColumn',
    props: {
      prefixCls: {
        type: String,
        required: true,
      },
      list: {
        type: Array,
        required: true,
      },
      value: {
        type: [Number, String],
      },
      visible: {
        type: Boolean,
      },
    },
    data() {
      return {
        refMap: new Map(),
      };
    },
    methods: {
      scrollToTop(easing = false) {
        if (!this.$refs.refWrapper || isUndefined(this.value) || !this.visible) {
          return;
        }
        const refSelected = this.refMap.get(this.value);
        if (refSelected) {
          scrollTo(
            this.$refs.refWrapper,
            refSelected.offsetTop,
            easing ? 100 : 0
          );
        }
      },
      onItemRef(el, item) {
        this.refMap.set(item.value, el);
      },
      onItemClick(item) {
        if (!item.disabled) {
          this.$emit('select', item.value);
        }
      },
    },
    watch: {
      value() {
        this.scrollToTop(true);
      },
      visible() {
        this.$nextTick(() => {
          this.scrollToTop();
        });
      },
    },
    mounted() {
      this.scrollToTop();
    },
  };

  /* script */
  const __vue_script__$9 = script$9;

  /* template */
  var __vue_render__$9 = function () {var _vm=this;var _h=_vm.$createElement;var _c=_vm._self._c||_h;return _c('div',{ref:"refWrapper",class:(_vm.prefixCls + "-column")},[_c('ul',_vm._l((_vm.list),function(item){
  var _obj;
  return _c('li',{key:item.value,ref:function (el) {
            _vm.onItemRef(el, item);
          },refInFor:true,class:[
          (_vm.prefixCls + "-cell"),
          ( _obj = {}, _obj[(_vm.prefixCls + "-cell-disabled")] = item.disabled, _obj[(_vm.prefixCls + "-cell-selected")] = item.selected, _obj ) ],on:{"click":function () {
            _vm.onItemClick(item);
          }}},[_c('div',{class:(_vm.prefixCls + "-cell-inner")},[_vm._v(_vm._s(item.label))])])}),0)])};
  var __vue_staticRenderFns__$9 = [];

    /* style */
    const __vue_inject_styles__$9 = undefined;
    /* scoped */
    const __vue_scope_id__$9 = undefined;
    /* module identifier */
    const __vue_module_identifier__$9 = undefined;
    /* functional template */
    const __vue_is_functional_template__$9 = false;
    /* style inject */
    
    /* style inject SSR */
    
    /* style inject shadow dom */
    

    
    const __vue_component__$9 = /*#__PURE__*/normalizeComponent(
      { render: __vue_render__$9, staticRenderFns: __vue_staticRenderFns__$9 },
      __vue_inject_styles__$9,
      __vue_script__$9,
      __vue_scope_id__$9,
      __vue_is_functional_template__$9,
      __vue_module_identifier__$9,
      false,
      undefined,
      undefined,
      undefined
    );

  //

  var script$8 = {
    name: 'TimePickerPanel',
    components: {
      TimeColumn: __vue_component__$9,
      Button: __vue_component__$f,
    },
    props: {
      value: {
        type: Object,
      },
      visible: {
        type: Boolean,
      },
      format: {
        type: String,
        default: 'HH:mm:ss',
      },
      use12Hours: {
        type: Boolean,
      },
      step: {
        type: Object,
      },
      disabledHours: {
        type: Function,
      },
      disabledMinutes: {
        type: Function,
      },
      disabledSeconds: {
        type: Function,
      },
      hideDisabledOptions: {
        type: Boolean,
      },
      hideFooter: {
        type: Boolean,
      },
      isRange: {
        type: Boolean,
      },
      disabled: {
        type: Boolean,
      },
    },
    data() {
      return {
        prefixCls: getPrefixCls('timepicker'),
        columns: [],
        computedUse12Hours: false,
        computedFormat: undefined,
        selectedValue: this.value,
      };
    },
    watch: {
      visible(newVal) {
        if (!newVal) return;
        this.selectedValue = this.value;
      },
      value(newVal) {
        this.selectedValue = newVal;
      },
    },
    computed: {
      selectedHour() {
        const _hour = this.selectedValue?.hour();
        if (isUndefined(_hour) || !this.computedUse12Hours) return _hour;
        // 12小时制
        if (_hour > 12) return _hour - 12;
        if (_hour === 0) return 12;
        return _hour;
      },
      selectedMinute() {
        return this.selectedValue?.minute();
      },
      selectedSecond() {
        return this.selectedValue?.second();
      },
      selectedAmpm() {
        const _hour = this.selectedValue?.hour();
        return !isUndefined(_hour) && _hour >= 12 ? 'pm' : 'am';
      },
      // 小时
      hours() {
        const { hour: hourStep = 1 } = this.step || {};
        const disabledList = (this.disabledHours && this.disabledHours()) || [];
        let list = [];
        for (let i = 0; i < (this.computedUse12Hours ? 12 : 24); i += hourStep) {
          list.push(i);
        }
        if (this.computedUse12Hours) {
          list[0] = 12;
        }
        if (this.hideDisabledOptions && disabledList.length) {
          list = list.filter((h) => disabledList.indexOf(h) < 0);
        }
        return list.map((h) => ({
          label: padStart(h, 2, '0'),
          value: h,
          selected: this.selectedHour === h,
          disabled: this.disabled || disabledList.includes(h),
        }));
      },
      // 分钟
      minutes() {
        const { minute: minuteStep = 1 } = this.step || {};
        const disabledList =
          (this.disabledMinutes && this.disabledMinutes(this.selectedHour)) || [];
        let list = [];
        for (let i = 0; i < 60; i += minuteStep) {
          list.push(i);
        }
        if (this.hideDisabledOptions && disabledList.length) {
          list = list.filter((m) => disabledList.indexOf(m) < 0);
        }
        return list.map((m) => ({
          label: padStart(m, 2, '0'),
          value: m,
          selected: this.selectedMinute === m,
          disabled: this.disabled || disabledList.includes(m),
        }));
      },
      // 秒
      seconds() {
        const { second: secondStep = 1 } = this.step || {};
        const disabledList =
          (this.disabledSeconds &&
            this.disabledSeconds(this.selectedHour, this.selectedMinute)) ||
          [];
        let list = [];
        for (let i = 0; i < 60; i += secondStep) {
          list.push(i);
        }
        if (this.hideDisabledOptions && disabledList.length) {
          list = list.filter((s) => disabledList.indexOf(s) < 0);
        }
        return list.map((s) => ({
          label: padStart(s, 2, '0'),
          value: s,
          selected: this.selectedSecond === s,
          disabled: this.disabled || disabledList.includes(s),
        }));
      },
      ampmList() {
        const AMPM = ['am', 'pm'];
        const isUpperCase = getColumnsFromFormat(
          this.computedFormat
        ).list.includes('A');
        return AMPM.map((a) => ({
          label: isUpperCase ? a.toUpperCase() : a,
          value: a,
          selected: this.selectedAmpm === a,
          disabled: this.disabled,
        }));
      },
      confirmBtnDisabled() {
        const value = this.selectedValue;
        return isArray(value)
          ? value.some((i) => this.isDisabled(i))
          : this.isDisabled(value);
      },
    },
    created() {
      const configFromFormat = getColumnsFromFormat(this.useformat());
      this.columns = configFromFormat.list;
      this.computedUse12Hours = !!(
        this.use12Hours || configFromFormat.use12Hours
      );
      this.computedFormat = this.useformat();
    },
    methods: {
      useformat() {
        let res = this.format || undefined;
        if (!res || !getColumnsFromFormat(res).list.length) {
          res = this.use12Hours ? 'hh:mm:ss a' : 'HH:mm:ss';
        }
        return res;
      },
      isDisabled(value) {
        return isDisabledTime(value, {
          disabledHours: this.disabledHours,
          disabledMinutes: this.disabledMinutes,
          disabledSeconds: this.disabledSeconds,
        });
      },
      emitConfirm(value) {
        if (isUndefined(value)) return;
        this.emit('confirm', value);
      },
      emitSelect(value) {
        this.selectedValue = value;
        this.$emit('select', value);
      },
      // 选中谁就更新谁
      onSelect(value, type = 'hour') {
        let newValue;
        const hour = this.selectedHour || '00';
        const minute = this.selectedMinute || '00';
        const second = this.selectedSecond || '00';
        const ampm = this.selectedAmpm || 'am';

        switch (type) {
          case 'hour':
            newValue = `${value}:${minute}:${second}`;
            break;
          case 'minute':
            newValue = `${hour}:${value}:${second}`;
            break;
          case 'second':
            newValue = `${hour}:${minute}:${value}`;
            break;
          case 'ampm':
            newValue = `${hour}:${minute}:${second} ${value}`;
            break;
          default:
            newValue = '00:00:00';
        }

        let valueFormat = 'HH:mm:ss';
        if (this.computedUse12Hours) {
          valueFormat = 'HH:mm:ss a';
          if (type !== 'ampm') {
            newValue = `${newValue} ${ampm}`;
          }
        }
        newValue = dayjs(newValue, valueFormat);
        this.emitSelect(newValue);
      },
      onSelectNow() {
        const newValue = dayjs(new Date());
        this.emitSelect(newValue);
      },
      onConfirm() {
        this.emitConfirm(this.selectedValue);
      },
    },
  };

  /* script */
  const __vue_script__$8 = script$8;

  /* template */
  var __vue_render__$8 = function () {var _vm=this;var _h=_vm.$createElement;var _c=_vm._self._c||_h;return _c('div',[_c('div',{class:_vm.prefixCls},[(_vm.columns.includes('H') || _vm.columns.includes('h'))?_c('TimeColumn',{attrs:{"value":_vm.selectedHour,"list":_vm.hours,"prefix-cls":_vm.prefixCls,"visible":_vm.visible},on:{"select":function (value) {
            _vm.onSelect(value, 'hour');
          }}}):_vm._e(),_vm._v(" "),(_vm.columns.includes('m'))?_c('TimeColumn',{attrs:{"value":_vm.selectedMinute,"list":_vm.minutes,"prefix-cls":_vm.prefixCls,"visible":_vm.visible},on:{"select":function (value) {
            _vm.onSelect(value, 'minute');
          }}}):_vm._e(),_vm._v(" "),(_vm.columns.includes('s'))?_c('TimeColumn',{attrs:{"value":_vm.selectedSecond,"list":_vm.seconds,"prefix-cls":_vm.prefixCls,"visible":_vm.visible},on:{"select":function (value) {
            _vm.onSelect(value, 'second');
          }}}):_vm._e(),_vm._v(" "),(_vm.computedUse12Hours)?_c('TimeColumn',{attrs:{"value":_vm.selectedAmpm,"list":_vm.ampmList,"prefix-cls":_vm.prefixCls,"visible":_vm.visible},on:{"select":function (value) {
            _vm.onSelect(value, 'ampm');
          }}}):_vm._e()],1),_vm._v(" "),(_vm.$slots['extra-footer'])?_c('div',{class:(_vm.prefixCls + "-footer-extra-wrapper")},[_vm._t("extra-footer")],2):_vm._e(),_vm._v(" "),(!_vm.hideFooter)?_c('div',{class:(_vm.prefixCls + "-footer-btn-wrapper")},[(!_vm.isRange)?_c('Button',{attrs:{"size":"mini"},on:{"click":_vm.onSelectNow}},[_vm._v("此刻")]):_vm._e(),_vm._v(" "),_c('Button',{attrs:{"type":"primary","size":"mini","disabled":_vm.confirmBtnDisabled || !_vm.selectedValue},on:{"click":_vm.onConfirm}},[_vm._v("确定")])],1):_vm._e()])};
  var __vue_staticRenderFns__$8 = [];

    /* style */
    const __vue_inject_styles__$8 = undefined;
    /* scoped */
    const __vue_scope_id__$8 = undefined;
    /* module identifier */
    const __vue_module_identifier__$8 = undefined;
    /* functional template */
    const __vue_is_functional_template__$8 = false;
    /* style inject */
    
    /* style inject SSR */
    
    /* style inject shadow dom */
    

    
    const __vue_component__$8 = /*#__PURE__*/normalizeComponent(
      { render: __vue_render__$8, staticRenderFns: __vue_staticRenderFns__$8 },
      __vue_inject_styles__$8,
      __vue_script__$8,
      __vue_scope_id__$8,
      __vue_is_functional_template__$8,
      __vue_module_identifier__$8,
      false,
      undefined,
      undefined,
      undefined
    );

  //

  const ROW_COUNT$2 = 6;
  const COL_COUNT$2 = 7;
  const CELL_COUNT$2 = ROW_COUNT$2 * COL_COUNT$2;

  function getCellData(time) {
    return {
      label: time.date(),
      value: time,
    };
  }
  var script$7 = {
    name: 'DatePanel',
    components: {
      PanelHeader: __vue_component__$c,
      PanelBody: __vue_component__$b,
      PanelWeekList: __vue_component__$a,
      TimePanel: __vue_component__$8,
      IconCommon: __vue_component__$i,
    },
    props: {
      isRange: {
        type: Boolean,
      },
      value: {
        type: Object,
      },
      rangeValues: {
        type: Array,
      },
      headerValue: {
        type: Object,
        required: true,
      },
      footerValue: {
        type: Object,
      },
      timePickerValue: {
        type: Object,
      },
      headerOperations: {
        type: Object,
        default: () => ({}),
      },
      dayStartOfWeek: {
        type: Number,
        default: 0,
      },
      disabledDate: {
        type: Function,
      },
      disabledTime: {
        type: Function,
      },
      isSameTime: {
        type: Function,
      },
      mode: {
        type: String,
        default: 'date',
      },
      showTime: {
        type: Boolean,
      },
      showLunar: {
        type: Boolean,
      },
      timePickerProps: {
        type: Object,
      },
      currentView: {
        type: String,
      },
      dateRender: {
        type: Function,
      },
      disabled: {
        type: Boolean,
      },
      onHeaderLabelClick: {
        type: Function,
      },
    },
    data() {
      return {
        pickerPrefixCls: getPrefixCls('picker'),
        localCurrentView: !isUndefined(this.currentView)
          ? this.currentView
          : 'date',
      };
    },
    watch: {
      currentView(newVal) {
        if (isUndefined(newVal)) {
          this.localValue = undefined;
        }
      },
    },
    computed: {
      isWeek() {
        return this.mode === 'week';
      },
      prefixCls() {
        return getPrefixCls(this.mode === 'week' ? 'panel-week' : 'panel-date');
      },
      showViewTabs() {
        return this.showTime && this.isRange;
      },
      showDateView() {
        return (
          !this.showTime || !this.showViewTabs || this.localCurrentView === 'date'
        );
      },
      showTimeView() {
        return (
          this.showTime &&
          (!this.showViewTabs || this.localCurrentView === 'time')
        );
      },
      classNames() {
        return [
          this.prefixCls,
          {
            [`${this.prefixCls}-with-view-tabs`]: this.showViewTabs,
          },
        ];
      },
      headerTitle() {
        return this.headerValue.format('YYYY-MM');
      },
      disabledTimeProps() {
        return (
          (this.showTime &&
            this.disabledTime &&
            this.disabledTime(getDateValue(this.footerValue || getNow()))) ||
          {}
        );
      },
      weekList1() {
        const list = [0, 1, 2, 3, 4, 5, 6];
        const index = Math.max(this.dayStartOfWeek % 7, 0);
        return [...list.slice(index), ...list.slice(0, index)];
      },
      weekList() {
        return this.isWeek ? [-1, ...this.weekList1] : this.weekList1;
      },
      rows() {
        const startDate = methods.startOf(this.headerValue, 'month');
        const startDay = startDate.day();
        const days = startDate.daysInMonth();
        const startIndex = this.weekList1.indexOf(startDay);
        const flatData = this.newArray(CELL_COUNT$2);

        for (let i = 0; i < flatData.length; i++) {
          const cellData = getCellData(
            methods.add(startDate, i - startIndex, 'day')
          );
          flatData[i] = {
            ...cellData,
            isPrev: i < startIndex,
            isNext: i > startIndex + days - 1,
          };
        }

        const rows = this.newArray(ROW_COUNT$2).map((_, index) => {
          const row = flatData.slice(index * COL_COUNT$2, (index + 1) * COL_COUNT$2);
          if (this.isWeek) {
            // 取第一个作为周 cell 的值
            const valueOfWeek = row[0].value;
            row.unshift({
              label: valueOfWeek.week(),
              value: valueOfWeek,
            });
          }
          return row;
        });
        return rows;
      },
      mergedIsSameTime() {
        return (
          this.isSameTime ||
          ((current, target) => {
            return current.isSame(target, 'day');
          })
        );
      },
    },
    methods: {
      newArray(length) {
        return [...Array(length)];
      },
      onCellClick(cellData) {
        this.$emit('select', cellData.value);
      },
      onTimePanelSelect(time) {
        this.$emit('timePickerSelect', time);
      },
      onCellMouseEnter(cellData) {
        this.$emit('cellMouseEnter', cellData.value);
      },
      changeViewTo(newView) {
        this.$emit('currentViewChange', newView);
        this.$emit('update:currentView', newView);
        this.localCurrentView = newView;
      },
    },
  };

  /* script */
  const __vue_script__$7 = script$7;

  /* template */
  var __vue_render__$7 = function () {
  var _obj, _obj$1;
  var _vm=this;var _h=_vm.$createElement;var _c=_vm._self._c||_h;return _c('div',{class:_vm.classNames},[(_vm.showDateView)?_c('div',{class:(_vm.prefixCls + "-inner")},[_c('PanelHeader',_vm._b({attrs:{"prefix-cls":_vm.pickerPrefixCls,"title":_vm.headerTitle,"mode":_vm.mode,"value":_vm.headerValue,"on-label-click":_vm.onHeaderLabelClick}},'PanelHeader',Object.assign({}, _vm.headerOperations),false)),_vm._v(" "),_c('PanelWeekList',{attrs:{"prefix-cls":_vm.pickerPrefixCls,"week-list":_vm.weekList}}),_vm._v(" "),_c('PanelBody',{attrs:{"mode":_vm.mode,"prefix-cls":_vm.pickerPrefixCls,"rows":_vm.rows,"value":_vm.isRange ? undefined : _vm.value,"range-values":_vm.rangeValues,"disabled-date":_vm.disabledDate,"show-lunar":_vm.showLunar,"is-same-time":_vm.mergedIsSameTime,"date-render":_vm.dateRender},on:{"cellClick":_vm.onCellClick,"cellMouseEnter":_vm.onCellMouseEnter}})],1):_vm._e(),_vm._v(" "),(_vm.showTimeView)?_c('div',{class:(_vm.prefixCls + "-timepicker")},[_c('header',{class:(_vm.prefixCls + "-timepicker-title")},[_vm._v("选择时间")]),_vm._v(" "),_c('TimePanel',_vm._b({attrs:{"hide-footer":"","value":_vm.value || _vm.isRange ? _vm.timePickerValue : undefined,"disabled":_vm.disabled},on:{"select":_vm.onTimePanelSelect}},'TimePanel',Object.assign({}, _vm.timePickerProps,
          _vm.disabledTimeProps),false))],1):_vm._e(),_vm._v(" "),(_vm.showViewTabs)?_c('div',{class:(_vm.prefixCls + "-footer")},[_c('div',{class:(_vm.prefixCls + "-view-tabs")},[_c('div',{class:[
            (_vm.prefixCls + "-view-tab-pane"),
            ( _obj = {}, _obj[(_vm.prefixCls + "-view-tab-pane-active")] = _vm.showDateView, _obj ) ],on:{"click":function () { return _vm.changeViewTo('date'); }}},[_c('IconCommon',{attrs:{"use":"calendar"}}),_vm._v(" "),_c('span',{class:(_vm.prefixCls + "-view-tab-pane-text")},[_vm._v("\n          "+_vm._s(_vm.footerValue && _vm.footerValue.format('YYYY-MM-DD'))+"\n        ")])],1),_vm._v(" "),_c('div',{class:[
            (_vm.prefixCls + "-view-tab-pane"),
            ( _obj$1 = {}, _obj$1[(_vm.prefixCls + "-view-tab-pane-active")] = _vm.showTimeView, _obj$1 ) ],on:{"click":function () { return _vm.changeViewTo('time'); }}},[_c('IconCommon',{attrs:{"use":"clockCircle"}}),_vm._v(" "),_c('span',{class:(_vm.prefixCls + "-view-tab-pane-text")},[_vm._v("\n          "+_vm._s(_vm.timePickerValue && _vm.timePickerValue.format('HH:mm:ss'))+"\n        ")])],1)])]):_vm._e()])};
  var __vue_staticRenderFns__$7 = [];

    /* style */
    const __vue_inject_styles__$7 = undefined;
    /* scoped */
    const __vue_scope_id__$7 = undefined;
    /* module identifier */
    const __vue_module_identifier__$7 = undefined;
    /* functional template */
    const __vue_is_functional_template__$7 = false;
    /* style inject */
    
    /* style inject SSR */
    
    /* style inject shadow dom */
    

    
    const __vue_component__$7 = /*#__PURE__*/normalizeComponent(
      { render: __vue_render__$7, staticRenderFns: __vue_staticRenderFns__$7 },
      __vue_inject_styles__$7,
      __vue_script__$7,
      __vue_scope_id__$7,
      __vue_is_functional_template__$7,
      __vue_module_identifier__$7,
      false,
      undefined,
      undefined,
      undefined
    );

  //

  var script$6 = {
    name: 'WeekPanel',
    components: {
      DatePanel: __vue_component__$7,
    },
    props: {
      dayStartOfWeek: {
        type: Number,
        default: 0,
      },
      showLunar: {
        type: Boolean,
      },
    },
    methods: {
      isSameTime(current, target) {
        return methods.isSameWeek(current, target, this.dayStartOfWeek, 'zh-CN');
      },

      onSelect(value) {
        const startDateOfWeek = methods.startOf(value, 'week');
        this.$emit('select', startDateOfWeek);
      },
      onCellMouseEnter(value) {
        const startDateOfWeek = methods.startOf(value, 'week');
        this.$emit('cellCouseEnter', startDateOfWeek);
      },
    },
  };

  /* script */
  const __vue_script__$6 = script$6;

  /* template */
  var __vue_render__$6 = function () {var _vm=this;var _h=_vm.$createElement;var _c=_vm._self._c||_h;return _c('DatePanel',_vm._b({attrs:{"mode":"week","is-week":"","show-lunar":_vm.showLunar,"day-start-of-week":_vm.dayStartOfWeek,"is-same-time":_vm.isSameTime},on:{"select":_vm.onSelect,"cellMouseEnter":_vm.onCellMouseEnter}},'DatePanel',_vm.$attrs,false))};
  var __vue_staticRenderFns__$6 = [];

    /* style */
    const __vue_inject_styles__$6 = undefined;
    /* scoped */
    const __vue_scope_id__$6 = undefined;
    /* module identifier */
    const __vue_module_identifier__$6 = undefined;
    /* functional template */
    const __vue_is_functional_template__$6 = false;
    /* style inject */
    
    /* style inject SSR */
    
    /* style inject shadow dom */
    

    
    const __vue_component__$6 = /*#__PURE__*/normalizeComponent(
      { render: __vue_render__$6, staticRenderFns: __vue_staticRenderFns__$6 },
      __vue_inject_styles__$6,
      __vue_script__$6,
      __vue_scope_id__$6,
      __vue_is_functional_template__$6,
      __vue_module_identifier__$6,
      false,
      undefined,
      undefined,
      undefined
    );

  //

  const CELL_COUNT$1 = 12;
  const ROW_COUNT$1 = 4;
  const COL_COUNT$1 = 3;
  const MONTH_LIST = [
    '一月',
    '二月',
    '三月',
    '四月',
    '五月',
    '六月',
    '七月',
    '八月',
    '九月',
    '十月',
    '十一月',
    '十二月',
  ];

  var script$5 = {
    name: 'MonthPanel',
    components: {
      PanelHeader: __vue_component__$c,
      PanelBody: __vue_component__$b,
    },
    props: {
      headerValue: {
        type: Object,
        required: true,
      },
      headerOperations: {
        type: Object,
        default: () => ({}),
      },
      value: {
        type: Object,
      },
      disabledDate: {
        type: Function,
      },
      rangeValues: {
        type: Array,
      },
      dateRender: {
        type: Function,
      },
      onHeaderLabelClick: {
        type: Function,
      },
      showLunar: {
        type: Boolean,
      },
    },
    data() {
      return {
        pickerPrefixCls: getPrefixCls('picker'),
      };
    },
    computed: {
      prefixCls() {
        return getPrefixCls('panel-month');
      },
      headerTitle() {
        return this.headerValue.format('YYYY');
      },
      rows() {
        const year = this.headerValue.year();
        const flatData = this.newArray(CELL_COUNT$1).map((_, index) => ({
          label: MONTH_LIST[index],
          value: dayjs(`${year}-${index + 1}`, 'YYYY-M'),
        }));

        const rows = this.newArray(ROW_COUNT$1).map((_, index) =>
          flatData.slice(index * COL_COUNT$1, (index + 1) * COL_COUNT$1)
        );
        return rows;
      },
    },
    methods: {
      newArray(length) {
        return [...Array(length)];
      },
      onCellClick(cellData) {
        this.$emit('select', cellData.value);
      },
      onCellMouseEnter(cellData) {
        this.$emit('cellMouseEnter', cellData.value);
      },
      isSameTime(current, target) {
        return current.isSame(target, 'month');
      },
    },
  };

  /* script */
  const __vue_script__$5 = script$5;

  /* template */
  var __vue_render__$5 = function () {var _vm=this;var _h=_vm.$createElement;var _c=_vm._self._c||_h;return _c('div',{class:_vm.prefixCls},[_c('div',{class:(_vm.prefixCls + "-inner")},[_c('PanelHeader',_vm._b({attrs:{"prefix-cls":_vm.pickerPrefixCls,"title":_vm.headerTitle,"mode":"month","value":_vm.headerValue,"onLabelClick":_vm.onHeaderLabelClick}},'PanelHeader',Object.assign({}, _vm.headerOperations),false)),_vm._v(" "),_c('PanelBody',{attrs:{"mode":"month","prefix-cls":_vm.pickerPrefixCls,"rows":_vm.rows,"value":_vm.value,"show-lunar":_vm.showLunar,"range-values":_vm.rangeValues,"disabled-date":_vm.disabledDate,"is-same-time":_vm.isSameTime,"date-render":_vm.dateRender},on:{"cellClick":_vm.onCellClick,"cellMouseEnter":_vm.onCellMouseEnter}})],1)])};
  var __vue_staticRenderFns__$5 = [];

    /* style */
    const __vue_inject_styles__$5 = undefined;
    /* scoped */
    const __vue_scope_id__$5 = undefined;
    /* module identifier */
    const __vue_module_identifier__$5 = undefined;
    /* functional template */
    const __vue_is_functional_template__$5 = false;
    /* style inject */
    
    /* style inject SSR */
    
    /* style inject shadow dom */
    

    
    const __vue_component__$5 = /*#__PURE__*/normalizeComponent(
      { render: __vue_render__$5, staticRenderFns: __vue_staticRenderFns__$5 },
      __vue_inject_styles__$5,
      __vue_script__$5,
      __vue_scope_id__$5,
      __vue_is_functional_template__$5,
      __vue_module_identifier__$5,
      false,
      undefined,
      undefined,
      undefined
    );

  //

  const ROW_COUNT = 4;
  const COL_COUNT = 3;
  const CELL_COUNT = ROW_COUNT * COL_COUNT;
  const SPAN = 10;

  var script$4 = {
    name: 'YearPanel',
    components: {
      PanelHeader: __vue_component__$c,
      PanelBody: __vue_component__$b,
    },
    props: {
      headerValue: {
        type: Object,
        required: true,
      },
      headerOperations: {
        type: Object,
        default: () => ({}),
      },
      value: {
        type: Object,
      },
      disabledDate: {
        type: Function,
      },
      rangeValues: {
        type: Array,
      },
      dateRender: {
        type: Function,
      },
      onHeaderLabelClick: {
        type: Function,
      },
      showLunar: {
        type: Boolean,
      },
    },
    data() {
      return {
        pickerPrefixCls: getPrefixCls('picker'),
        isSameTime: (current, target) => current.isSame(target, 'year'),
      };
    },
    computed: {
      prefixCls() {
        return getPrefixCls('panel-year');
      },
      rows() {
        const startYear = Math.floor(this.headerValue.year() / SPAN) * SPAN - 1;
        const flatData = this.newArray(CELL_COUNT).map((_, index) => ({
          label: startYear + index,
          value: dayjs(`${startYear + index}`, 'YYYY'),
          isPrev: index < 1,
          isNext: index > SPAN,
        }));
        const rows = this.newArray(ROW_COUNT).map((_, index) =>
          flatData.slice(index * COL_COUNT, (index + 1) * COL_COUNT)
        );
        return rows;
      },
      headerTitle() {
        return `${this.rows[0][1].label}-${
        this.rows[ROW_COUNT - 1][COL_COUNT - 1].label
      }`;
      },
    },
    methods: {
      newArray(length) {
        return [...Array(length)];
      },
      onCellClick(cellData) {
        this.$emit('select', cellData.value);
      },
      onCellMouseEnter(cellData) {
        this.$emit('cellMouseEnter', cellData.value);
      },
    },
  };

  /* script */
  const __vue_script__$4 = script$4;

  /* template */
  var __vue_render__$4 = function () {var _vm=this;var _h=_vm.$createElement;var _c=_vm._self._c||_h;return _c('div',{class:_vm.prefixCls},[_c('div',{class:(_vm.prefixCls + "-inner")},[_c('PanelHeader',_vm._b({attrs:{"prefix-cls":_vm.pickerPrefixCls,"title":_vm.headerTitle}},'PanelHeader',Object.assign({}, _vm.headerOperations),false)),_vm._v(" "),_c('PanelBody',{attrs:{"mode":"year","prefix-cls":_vm.pickerPrefixCls,"rows":_vm.rows,"value":_vm.value,"range-values":_vm.rangeValues,"disabled-date":_vm.disabledDate,"show-lunar":_vm.showLunar,"is-same-time":_vm.isSameTime,"date-render":_vm.dateRender},on:{"cellClick":_vm.onCellClick,"cellMouseEnter":_vm.onCellMouseEnter}})],1)])};
  var __vue_staticRenderFns__$4 = [];

    /* style */
    const __vue_inject_styles__$4 = undefined;
    /* scoped */
    const __vue_scope_id__$4 = undefined;
    /* module identifier */
    const __vue_module_identifier__$4 = undefined;
    /* functional template */
    const __vue_is_functional_template__$4 = false;
    /* style inject */
    
    /* style inject SSR */
    
    /* style inject shadow dom */
    

    
    const __vue_component__$4 = /*#__PURE__*/normalizeComponent(
      { render: __vue_render__$4, staticRenderFns: __vue_staticRenderFns__$4 },
      __vue_inject_styles__$4,
      __vue_script__$4,
      __vue_scope_id__$4,
      __vue_is_functional_template__$4,
      __vue_module_identifier__$4,
      false,
      undefined,
      undefined,
      undefined
    );

  //

  var script$3 = {
    name: 'QuarterPanel',
    components: {
      PanelHeader: __vue_component__$c,
      PanelBody: __vue_component__$b,
    },
    props: {
      headerValue: {
        type: Object,
        required: true,
      },
      headerOperations: {
        type: Object,
        default: () => ({}),
      },
      value: {
        type: Object,
      },
      disabledDate: {
        type: Function,
      },
      rangeValues: {
        type: Array,
      },
      dateRender: {
        type: Function,
      },
      onHeaderLabelClick: {
        type: Function,
      },
    },
    data() {
      return {
        pickerPrefixCls: getPrefixCls('picker'),
      };
    },
    computed: {
      prefixCls() {
        return getPrefixCls('panel-quarter');
      },
      headerTitle() {
        return this.headerValue.format('YYYY');
      },
      rows() {
        const year = this.headerValue.year();
        return [
          [1, 2, 3, 4].map((q) => ({
            label: `Q${q}`,
            value: dayjs(`${year}-${padStart((q - 1) * 3 + 1, 2, '0')}-01`),
          })),
        ];
      },
    },
    methods: {
      isSameTime(current, target) {
        return (
          current.isSame(target, 'month') ||
          (current.isSame(target, 'year') &&
            Math.floor(current.month() / 3) === Math.floor(target.month() / 3))
        );
      },
      onCellClick(cellData) {
        this.$emit('select', cellData.value);
      },
      onCellMouseEnter(cellData) {
        this.$emit('cellMouseEnter', cellData.value);
      },
    },
  };

  /* script */
  const __vue_script__$3 = script$3;

  /* template */
  var __vue_render__$3 = function () {var _vm=this;var _h=_vm.$createElement;var _c=_vm._self._c||_h;return _c('div',{class:_vm.prefixCls},[_c('div',{class:(_vm.prefixCls + "-inner")},[_c('PanelHeader',_vm._b({attrs:{"mode":"quarter","prefix-cls":_vm.pickerPrefixCls,"title":_vm.headerTitle,"value":_vm.headerValue,"onLabelClick":_vm.onHeaderLabelClick}},'PanelHeader',Object.assign({}, _vm.headerOperations),false)),_vm._v(" "),_c('PanelBody',{attrs:{"mode":"quarter","prefix-cls":_vm.pickerPrefixCls,"rows":_vm.rows,"value":_vm.value,"range-values":_vm.rangeValues,"disabled-date":_vm.disabledDate,"is-same-time":_vm.isSameTime,"date-render":_vm.dateRender},on:{"cellClick":_vm.onCellClick,"cellMouseEnter":_vm.onCellMouseEnter}})],1)])};
  var __vue_staticRenderFns__$3 = [];

    /* style */
    const __vue_inject_styles__$3 = undefined;
    /* scoped */
    const __vue_scope_id__$3 = undefined;
    /* module identifier */
    const __vue_module_identifier__$3 = undefined;
    /* functional template */
    const __vue_is_functional_template__$3 = false;
    /* style inject */
    
    /* style inject SSR */
    
    /* style inject shadow dom */
    

    
    const __vue_component__$3 = /*#__PURE__*/normalizeComponent(
      { render: __vue_render__$3, staticRenderFns: __vue_staticRenderFns__$3 },
      __vue_inject_styles__$3,
      __vue_script__$3,
      __vue_scope_id__$3,
      __vue_is_functional_template__$3,
      __vue_module_identifier__$3,
      false,
      undefined,
      undefined,
      undefined
    );

  //

  var script$2 = {
    name: 'PanelFooter',
    components: {
      Button: __vue_component__$f,
    },
    props: {
      prefixCls: {
        type: String,
        required: true,
      },
      showTodayBtn: {
        type: Boolean,
      },
      showConfirmBtn: {
        type: Boolean,
      },
      confirmBtnDisabled: {
        type: Boolean,
      },
    },
    methods: {
      onTodayClick() {
        this.$emit('todayBtnClick');
      },
      onConfirmBtnClick() {
        this.$emit('confirmBtnClick');
      },
    },
  };

  /* script */
  const __vue_script__$2 = script$2;

  /* template */
  var __vue_render__$2 = function () {var _vm=this;var _h=_vm.$createElement;var _c=_vm._self._c||_h;return _c('div',{class:(_vm.prefixCls + "-footer")},[(_vm.$slots.extra)?_c('div',{class:(_vm.prefixCls + "-footer-extra-wrapper")},[_vm._t("extra")],2):_vm._e(),_vm._v(" "),(_vm.showTodayBtn)?_c('div',{class:(_vm.prefixCls + "-footer-now-wrapper")},[_c('a',{class:(_vm.prefixCls + "-link"),on:{"click":_vm.onTodayClick}},[_vm._v("今天")])]):_vm._e(),_vm._v(" "),(_vm.$slots.btn || _vm.showConfirmBtn)?_c('div',{class:(_vm.prefixCls + "-footer-btn-wrapper")},[_vm._t("btn"),_vm._v(" "),(_vm.showConfirmBtn)?_c('Button',{class:(_vm.prefixCls + "-btn-confirm"),attrs:{"type":"primary","size":"mini","disabled":_vm.confirmBtnDisabled},on:{"click":_vm.onConfirmBtnClick}},[_vm._v("\n      确定\n    ")]):_vm._e()],2):_vm._e()])};
  var __vue_staticRenderFns__$2 = [];

    /* style */
    const __vue_inject_styles__$2 = undefined;
    /* scoped */
    const __vue_scope_id__$2 = undefined;
    /* module identifier */
    const __vue_module_identifier__$2 = undefined;
    /* functional template */
    const __vue_is_functional_template__$2 = false;
    /* style inject */
    
    /* style inject SSR */
    
    /* style inject shadow dom */
    

    
    const __vue_component__$2 = /*#__PURE__*/normalizeComponent(
      { render: __vue_render__$2, staticRenderFns: __vue_staticRenderFns__$2 },
      __vue_inject_styles__$2,
      __vue_script__$2,
      __vue_scope_id__$2,
      __vue_is_functional_template__$2,
      __vue_module_identifier__$2,
      false,
      undefined,
      undefined,
      undefined
    );

  //

  var script$1 = {
    name: 'DatePikerPanel',
    components: {
      DatePanel: __vue_component__$7,
      PanelShortcuts: __vue_component__$d,
      PanelFooter: __vue_component__$2,
      WeekPanel: __vue_component__$6,
      MonthPanel: __vue_component__$5,
      YearPanel: __vue_component__$4,
      QuarterPanel: __vue_component__$3,
      RenderFunction: __vue_component__$e,
    },
    props: {
      mode: {
        type: String,
      },
      headerMode: {
        type: String,
      },
      prefixCls: {
        type: String,
        required: true,
      },
      value: {
        type: Object,
      },
      headerValue: {
        type: Object,
        required: true,
      },
      timePickerValue: {
        type: Object,
      },
      showTime: {
        type: Boolean,
      },
      showConfirmBtn: {
        type: Boolean,
      },
      shortcuts: {
        type: Array,
        default: () => [],
      },
      shortcutsPosition: {
        type: String,
        default: 'bottom',
      },
      format: {
        type: String,
        required: true,
      },
      dayStartOfWeek: {
        type: Number,
        default: 0,
      },
      disabledDate: {
        type: Function,
      },
      disabledTime: {
        type: Function,
      },
      timePickerProps: {
        type: Object,
      },
      extra: {
        type: [Object, Function],
      },
      dateRender: {
        type: Function,
      },
      hideTrigger: {
        type: Boolean,
      },
      confirmBtnDisabled: {
        type: Boolean,
      },
      showNowBtn: {
        type: Boolean,
      },
      showLunar: {
        type: Boolean,
      },
      headerOperations: {
        type: Object,
      },
    },
    data() {
      return {
        localValue: getNow(),
      };
    },
    watch: {
      headerValue(val) {
        this.setHeaderPanelHeaderValue(val);
      },
    },
    computed: {
      shortcutsProps() {
        return {
          prefixCls: this.prefixCls,
          shortcuts: this.shortcuts,
          showNowBtn: this.showShortcutsNowBtn,
        };
      },
      commonPanelProps() {
        return {
          value: this.value,
          headerValue: this.headerValue,
          headerOperations: this.headerOperations,
          disabledDate: this.disabledDate,
          dateRender: this.dateRender,
          showLunar: this.showLunar,
          onHeaderLabelClick: this.onPanelHeaderLabelClick,
        };
      },
      showShortcutsNowBtn() {
        return (
          this.showNowBtn &&
          this.showConfirmBtn &&
          !(this.shortcuts && this.shortcuts.length)
        );
      },
      showShortcuts() {
        return (
          this.showShortcutsNowBtn || (this.shortcuts && this.shortcuts.length)
        );
      },
      showShortcutsInLeft() {
        return this.showShortcuts && this.shortcutsPosition === 'left';
      },
      showShortcutsInRight() {
        return this.showShortcuts && this.shortcutsPosition === 'right';
      },
      showShortcutsInBottom() {
        return this.showShortcuts && this.shortcutsPosition === 'bottom';
      },
      classNames() {
        return [
          `${this.prefixCls}-container`,
          {
            [`${this.prefixCls}-container-panel-only`]: this.hideTrigger,
            [`${this.prefixCls}-container-shortcuts-placement-left`]:
              this.showShortcutsInLeft,
            [`${this.prefixCls}-container-shortcuts-placement-right`]:
              this.showShortcutsInRight,
          },
        ];
      },
      footerValue() {
        return this.value || getNow();
      },

      computedMode() {
        return this.headerMode || 'date';
      },
      // 单个面板显示多少月份 | 单箭头跨越多少月份
      span() {
        return { date: 1, week: 1, year: 10 * 12, quarter: 12, month: 12 }[
          this.computedMode
        ];
      },
      // 双箭头跨越多少个月份
      superSpan() {
        return ['year'].includes(this.computedMode) ? 10 * 12 : 12;
      },
      showSingleBtn() {
        return this.span !== this.superSpan;
      },
      headerPanelHeaderOperations() {
        return {
          onSuperPrev: () => {
            this.setHeaderPanelHeaderValue(
              methods.subtract(this.localValue, this.superSpan, 'M')
            );
          },
          onPrev: this.showSingleBtn
            ? () => {
                this.setHeaderPanelHeaderValue(
                  methods.subtract(this.localValue, this.span, 'M')
                );
              }
            : undefined,
          onNext: this.showSingleBtn
            ? () => {
                this.setHeaderPanelHeaderValue(
                  methods.add(this.localValue, this.span, 'M')
                );
              }
            : undefined,
          onSuperNext: () => {
            this.setHeaderPanelHeaderValue(
              methods.add(this.localValue, this.superSpan, 'M')
            );
          },
        };
      },
    },
    methods: {
      isSame(current, target) {
        const unit =
          this.computedMode === 'date' || this.computedMode === 'week'
            ? 'M'
            : 'y';
        return current.isSame(target, unit);
      },
      setHeaderPanelHeaderValue(newVal, emitChange = true) {
        if (!newVal) return;
        if (emitChange && !this.isSame(this.localValue, newVal)) {
          this.onChange && this.onChange(newVal);
        }
        this.localValue = newVal;
      },

      getShortcutValue(shortcut) {
        const { value } = shortcut;
        return getDayjsValue(
          isFunction(value) ? value() : value,
          shortcut.format || this.format
        );
      },
      onShortcutClick(shortcut) {
        this.$emit('onShortcutClick', this.getShortcutValue(shortcut), shortcut);
      },
      onShortcutMouseEnter(shortcut) {
        this.$emit('onShortcutMouseEnter', this.getShortcutValue(shortcut));
      },
      onShortcutMouseLeave(shortcut) {
        this.$emit('onShortcutMouseLeave', this.getShortcutValue(shortcut));
      },

      onPanelSelect(date) {
        this.$emit('onCellClick', date);
      },
      onTimePickerSelect(time) {
        this.$emit('onTimePickerSelect', time);
      },

      onTodayBtnClick() {
        this.$emit('onTodayBtnClick', getNow());
      },

      onConfirmBtnClick() {
        this.$emit('onConfirm');
      },

      onPanelHeaderLabelClick(type) {
        this.$emit('onHeaderLabelClick', type);
      },

      onHeaderPanelSelect(date) {
        this.$emit('onHeaderSelect', date);
      },

      onMonthHeaderLabelClick() {
        this.$emit('onMonthHeaderClick');
      },
    },
  };

  /* script */
  const __vue_script__$1 = script$1;

  /* template */
  var __vue_render__$1 = function () {var _vm=this;var _h=_vm.$createElement;var _c=_vm._self._c||_h;return _c('div',{class:_vm.classNames},[(_vm.showShortcutsInLeft)?_c('PanelShortcuts',_vm._b({on:{"itemClick":_vm.onShortcutClick,"itemMouseEnter":_vm.onShortcutMouseEnter,"itemMouseLeave":_vm.onShortcutMouseLeave,"nowClick":_vm.onTodayBtnClick}},'PanelShortcuts',_vm.shortcutsProps,false)):_vm._e(),_vm._v(" "),_c('div',{class:(_vm.prefixCls + "-panel-wrapper")},[(_vm.headerMode)?[(_vm.headerMode === 'year')?_c('YearPanel',{attrs:{"header-value":_vm.localValue,"show-lunar":_vm.showLunar,"header-operations":_vm.headerPanelHeaderOperations},on:{"select":_vm.onHeaderPanelSelect}}):(_vm.headerMode === 'month')?_c('MonthPanel',{attrs:{"header-value":_vm.localValue,"show-lunar":_vm.showLunar,"header-operations":_vm.headerPanelHeaderOperations,"onHeaderLabelClick":_vm.onMonthHeaderLabelClick},on:{"select":_vm.onHeaderPanelSelect}}):_vm._e()]:[(_vm.mode === 'week')?_c('WeekPanel',_vm._b({attrs:{"day-start-of-week":_vm.dayStartOfWeek},on:{"select":_vm.onPanelSelect}},'WeekPanel',_vm.commonPanelProps,false)):(_vm.mode === 'month')?_c('MonthPanel',_vm._b({on:{"select":_vm.onPanelSelect}},'MonthPanel',_vm.commonPanelProps,false)):(_vm.mode === 'year')?_c('YearPanel',_vm._b({on:{"select":_vm.onPanelSelect}},'YearPanel',_vm.commonPanelProps,false)):(_vm.mode === 'quarter')?_c('QuarterPanel',_vm._b({on:{"select":_vm.onPanelSelect}},'QuarterPanel',_vm.commonPanelProps,false)):_c('DatePanel',_vm._b({attrs:{"mode":"date","show-time":_vm.showTime,"time-picker-props":_vm.timePickerProps,"day-start-of-week":_vm.dayStartOfWeek,"footer-value":_vm.footerValue,"time-picker-value":_vm.timePickerValue,"disabled-time":_vm.disabledTime},on:{"select":_vm.onPanelSelect,"timePickerSelect":_vm.onTimePickerSelect}},'DatePanel',_vm.commonPanelProps,false)),_vm._v(" "),_c('PanelFooter',{attrs:{"prefix-cls":_vm.prefixCls,"show-today-btn":_vm.showNowBtn && !(_vm.showConfirmBtn || _vm.showShortcutsInBottom),"show-confirm-btn":_vm.showConfirmBtn,"confirm-btn-disabled":_vm.confirmBtnDisabled},on:{"todayBtnClick":_vm.onTodayBtnClick,"confirmBtnClick":_vm.onConfirmBtnClick},scopedSlots:_vm._u([(_vm.extra)?{key:"extra",fn:function(){return [(_vm.extra)?_c('RenderFunction',{attrs:{"render-func":_vm.extra}}):_vm._e()]},proxy:true}:null,(_vm.showShortcutsInBottom)?{key:"btn",fn:function(){return [_c('PanelShortcuts',_vm._b({on:{"itemClick":_vm.onShortcutClick,"itemMouseEnter":_vm.onShortcutMouseEnter,"itemMouseLeave":_vm.onShortcutMouseLeave,"nowClick":_vm.onTodayBtnClick}},'PanelShortcuts',_vm.shortcutsProps,false))]},proxy:true}:null],null,true)})]],2),_vm._v(" "),(_vm.showShortcutsInRight)?_c('PanelShortcuts',_vm._b({on:{"itemClick":_vm.onShortcutClick,"itemMouseEnter":_vm.onShortcutMouseEnter,"itemMouseLeave":_vm.onShortcutMouseLeave,"nowClick":_vm.onTodayBtnClick}},'PanelShortcuts',_vm.shortcutsProps,false)):_vm._e()],1)};
  var __vue_staticRenderFns__$1 = [];

    /* style */
    const __vue_inject_styles__$1 = undefined;
    /* scoped */
    const __vue_scope_id__$1 = undefined;
    /* module identifier */
    const __vue_module_identifier__$1 = undefined;
    /* functional template */
    const __vue_is_functional_template__$1 = false;
    /* style inject */
    
    /* style inject SSR */
    
    /* style inject shadow dom */
    

    
    const __vue_component__$1 = /*#__PURE__*/normalizeComponent(
      { render: __vue_render__$1, staticRenderFns: __vue_staticRenderFns__$1 },
      __vue_inject_styles__$1,
      __vue_script__$1,
      __vue_scope_id__$1,
      __vue_is_functional_template__$1,
      __vue_module_identifier__$1,
      false,
      undefined,
      undefined,
      undefined
    );

  var placeholder = {
    date: '请选择日期',
    year: '选择年',
    month: '选择月',
    week: '选择周',
    quarter: '选择季度'
  };

  //

  var script = {
    name: 'DatePickerPro',
    components: { Popper: __vue_component__$j, DateInput: __vue_component__$g, IconCalendar: __vue_component__$i, PickerPanel: __vue_component__$1 },
    data() {
      return {
        panelVisible: false,
        prefixCls: getPrefixCls('picker'),
        inputValue: undefined, // input 操作使用的值
        processValue: undefined, // 操作过程中的选中值
        previewValue: undefined, // 预览用的值：悬浮
        headerMode: undefined,
        localValue: this.computedDefaultValue || getNow(),
        timePickerValue: this.getDefaultValue(),
        clearPreviewTimer: null,
        setSelectedValue: !isUndefined(this.computedModelValue)
          ? this.computedModelValue
          : !isUndefined(this.computedDefaultValue)
          ? this.computedDefaultValue
          : undefined,
      };
    },
    props: {
      toBody: {
        type: Boolean,
        default: true,
      },
      popuperOptions: {
        type: Object,
        default: () => ({}),
      },
      trigger: {
        type: String,
        default: 'click',
      },
      // 没有触发元素，只显示选择面板
      hideTrigger: {
        type: Boolean,
      },
      // 是否允许清除
      allowClear: {
        type: Boolean,
        default: true,
      },
      // 是否为只读
      readonly: {
        type: Boolean,
      },
      // 是否为错误状态
      error: {
        type: Boolean,
      },
      // 日期选择器的尺寸
      size: {
        type: String,
        default: 'medium',
      },
      // 预设时间范围快捷选择
      shortcuts: {
        type: Array,
        default: () => [],
      },
      // 预设范围在面板上的位置，默认放在下方，侧边一般用于大量预设时间的场景
      shortcutsPosition: {
        type: String,
        default: 'bottom',
      },
      // 弹出的框的位置
      position: {
        type: String,
        default: 'bottom',
      },
      // 控制弹出框的打开或者关闭状态
      popupVisible: {
        type: Boolean,
        default: undefined,
      },
      // 默认弹出框是打开或者关闭
      defaultPopupVisible: {
        type: Boolean,
        default: false,
      },
      // 是否在隐藏的时候销毁DOM结构
      unmountOnClose: {
        type: Boolean,
      },
      // 提示文案
      placeholder: {
        type: String,
      },
      // 是否禁用
      disabled: {
        type: Boolean,
      },
      // 不可选取的日期
      disabledDate: {
        type: Function,
      },
      // 不可选取的时间
      disabledTime: {
        type: Function,
      },
      // 面板显示的日期
      pickerValue: {
        type: [Object, String, Number],
      },
      // 面板默认显示的日期
      defaultPickerValue: {
        type: [Object, String, Number],
      },
      showLunar: {
        type: Boolean,
      },
      // 弹出框的挂载容器
      popupContainer: {
        type: [String, Object],
      },
      mode: {
        type: String,
        default: 'date',
        validator(value) {
          return ['date', 'year', 'quarter', 'month', 'week'].includes(value);
        },
      },
      format: {
        type: [String, Function],
      },
      // 值的格式，对 `value` `defaultValue` `pickerValue` `defaultPickerValue` 以及事件中的返回值生效，支持设置为时间戳，Date 和字符串（参考[字符串解析格式](#字符串解析格式)）。如果没有指定，将格式化为字符串，格式同 `format`。
      valueFormat: {
        type: String,
      },
      // 是否要预览快捷选择的结果
      previewShortcut: {
        type: Boolean,
        default: true,
      },
      // 是否显示确认按钮，`showTime = true` 的时候始终显示。
      showConfirmBtn: {
        type: Boolean,
      },
      showTime: {
        type: Boolean,
      },
      timePickerProps: {
        type: Object,
      },
      showNowBtn: {
        type: Boolean,
        default: true,
      },
      dayStartOfWeek: {
        type: Number,
        default: 0,
      },
      value: {
        type: [Object, String, Number],
      },
      modelValue: {
        type: [Object, String, Number],
      },
      defaultValue: {
        type: [Object, String, Number],
      },
    },
    created() {
      initializeDateLocale('zh-cn', this.dayStartOfWeek);
    },
    beforeDestroy() {
      clearTimeout(this.clearPreviewTimer);
    },
    watch: {
      panelValue(newVal) {
        if (newVal) {
          this.timePickerValue = newVal;
        }
        this.setHeaderValue(newVal);
      },
      panelVisible(newVisible) {
        this.processValue = undefined;
        this.previewValue = undefined;
        this.headerMode = undefined;
        // open
        if (newVisible) {
          this.resetHeaderValue();
          this.timePickerValue = this.getDefaultValue();
        }
        // close
        if (!newVisible) {
          this.inputValue = undefined;
        }
      },
      computedModelValue(val) {
        if (isUndefined(val)) {
          this.setSelectedValue = undefined;
        }
      },
    },
    computed: {
      computedPlaceholder() {
        return this.placeholder || placeholder[this.mode] || placeholder.date;
      },
      computedFormat() {
        const defaultFormat = this.getDefaultFormat(this.mode, this.showTime);
        return (!isFunction(this.format) && this.format) || defaultFormat;
      },
      returnValueFormat() {
        return (
          this.valueFormat ||
          (this.mode === 'week'
            ? 'YYYY-MM-DD'
            : this.mode === 'quarter'
            ? 'YYYY-MM'
            : this.computedFormat)
        );
      },
      parseValueFormat() {
        return ['timestamp', 'Date'].includes(this.returnValueFormat)
          ? this.computedFormat
          : this.returnValueFormat;
      },
      inputFormat() {
        const defaultFormat = this.computedFormat;
        return this.format && isFunction(this.format)
          ? (value) => this.format(getDateValue(value))
          : defaultFormat;
      },
      mergedDisabled() {
        return this.disabled;
      },
      inputEditable() {
        return !this.readonly && !isFunction(this.inputFormat);
      },
      // 是否需要确认
      needConfirm() {
        return this.showTime || this.showConfirmBtn;
      },
      confirmBtnDisabled() {
        return (
          this.needConfirm &&
          (!this.forSelectedValue || this.isDisabledDate(this.forSelectedValue))
        );
      },
      // panel 展示用的值
      panelValue() {
        return this.previewValue ?? this.processValue ?? this.selectedValue;
      },
      // 待确认的值
      forSelectedValue() {
        return this.processValue ?? this.selectedValue;
      },
      computedModelValue() {
        return getDayjsValue(
          this.value || this.modelValue,
          this.parseValueFormat
        );
      },
      computedTimePickerProps() {
        return {
          format: this.computedFormat,
          ...omit(this.timePickerProps || {}, ['defaultValue']),
          visible: this.panelVisible,
        };
      },
      computedMode() {
        return this.mode || 'date';
      },
      // 单个面板显示多少月份 | 单箭头跨越多少月份
      span() {
        return { date: 1, week: 1, year: 10 * 12, quarter: 12, month: 12 }[
          this.computedMode
        ];
      },
      // 双箭头跨越多少个月份
      superSpan() {
        return ['year'].includes(this.computedMode) ? 10 * 12 : 12;
      },
      computedValue() {
        return getDayjsValue(this.pickerValue, this.parseValueFormat);
      },
      computedDefaultValue() {
        return getDayjsValue(this.defaultValue, this.parseValueFormat);
      },
      selectedValue() {
        return this.computedModelValue || this.setSelectedValue;
      },
      headerValue() {
        return this.computedValue || this.localValue;
      },
      showSingleBtn() {
        return this.span !== this.superSpan;
      },
      headerOperations() {
        return {
          onSuperPrev: () => {
            this.setHeaderValue(
              methods.subtract(this.headerValue, this.superSpan, 'M')
            );
          },
          onPrev: this.showSingleBtn
            ? () => {
                this.setHeaderValue(
                  methods.subtract(this.headerValue, this.span, 'M')
                );
              }
            : undefined,
          onNext: this.showSingleBtn
            ? () => {
                this.setHeaderValue(
                  methods.add(this.headerValue, this.span, 'M')
                );
              }
            : undefined,
          onSuperNext: () => {
            this.setHeaderValue(
              methods.add(this.headerValue, this.superSpan, 'M')
            );
          },
        };
      },
      defaultTimePickerValue() {
        let format = this.timePickerProps?.format || undefined;
        if (!format || !getColumnsFromFormat(format).list.length) {
          format = this.timePickerProps?.use12Hours ? 'hh:mm:ss a' : 'HH:mm:ss';
        }
        return getDayjsValue(this.timePickerProps?.defaultValue, format);
      },
      /**
       * 面板属性
       */
      panelProps() {
        return {
          ...pick(this.$props, [
            'mode',
            'shortcuts',
            'shortcutsPosition',
            'dayStartOfWeek',
            'disabledDate',
            'disabledTime',
            'showTime',
            'hideTrigger',
          ]),
          showNowBtn: this.showNowBtn && this.mode === 'date',
          prefixCls: this.prefixCls,
          format: this.parseValueFormat,
          value: this.panelValue,
          visible: this.panelVisible,
          showConfirmBtn: this.needConfirm,
          confirmBtnDisabled: this.confirmBtnDisabled,
          timePickerProps: this.computedTimePickerProps,
          extra: this.$slots?.extra?.[0],
          dateRender: this.$slots.cell,
          headerValue: this.headerValue,
          headerOperations: this.headerOperations,
          timePickerValue: this.timePickerValue,
          headerMode: this.headerMode,
          showLunar: this.showLunar,
        };
      },
      /**
       * 面板事件
       */
      panelOn() {
        return {
          onCellClick: this.onPanelCellClick,
          onTimePickerSelect: this.onTimePickerSelect,
          onConfirm: this.onPanelConfirm,
          onShortcutClick: this.onPanelShortcutClick,
          onShortcutMouseEnter: this.previewShortcut
            ? this.onPanelShortcutMouseEnter
            : undefined,
          onShortcutMouseLeave: this.previewShortcut
            ? this.onPanelShortcutMouseLeave
            : undefined,
          onTodayBtnClick: this.onPanelSelect,
          onHeaderLabelClick: this.onPanelHeaderLabelClick,
          onHeaderSelect: this.onPanelHeaderSelect,
          onMonthHeaderClick: this.onMonthHeaderClick,
          onYearHeaderClick: this.onYearHeaderClick,
        };
      },
    },
    methods: {
      getDefaultFormat(mode = 'date', showTime = false) {
        switch (mode) {
          case 'date':
            return showTime ? 'YYYY-MM-DD HH:mm:ss' : 'YYYY-MM-DD';
          case 'month':
            return 'YYYY-MM';
          case 'year':
            return 'YYYY';
          case 'week':
            return 'gggg-wo';
          case 'quarter':
            return 'YYYY-[Q]Q';
          default:
            return 'YYYY-MM-DD';
        }
      },
      getReturnValue(date) {
        if (this.returnValueFormat === 'timestamp') {
          return date.toDate().getTime();
        }
        if (this.returnValueFormat === 'Date') {
          return date.toDate();
        }
        return date.format(this.returnValueFormat);
      },
      /**
       * 选择面板是否可见
       */
      setPanelVisible(newVisible) {
        if (this.panelVisible !== newVisible) {
          this.panelVisible = newVisible;
          this.$emit('popup-visible-change', newVisible);
          this.$emit('update:popupVisible', newVisible);
        }
      },
      /**
       * 输入框值发生改变
       */
      onInputChange(e) {
        this.setPanelVisible(true);
        const targetValue = e.target.value;
        this.inputValue = targetValue;
        if (!isValidInputValue(targetValue, this.computedFormat)) return;
        const newValue = dayjs(targetValue, this.computedFormat);
        if (this.isDisabledDate(newValue)) return;
        if (this.needConfirm) {
          this.select(newValue);
        } else {
          this.confirm(newValue, true);
        }
      },
      /**
       * 点击清除
       */
      onInputClear(e) {
        e.stopPropagation();
        this.confirm(undefined);
        this.$emit('clear');
      },
      /**
       * 按回车
       */
      onInputPressEnter() {
        this.confirm(this.panelValue, false);
      },
      onPanelClick() {
        this.$refs.refInput && this.$refs.refInput.focus();
      },
      isDisabledDate(value, type) {
        const needCheckTime = this.mode === 'date' && this.showTime;
        const isDDate = (current) => {
          if (!this.disabledDate) return false;
          const dateValue = getDateValue(current);
          return this.disabledDate(dateValue);
        };
        const isDisabledItem = (num, getDisabledList) => {
          const list = getDisabledList ? getDisabledList() : [];
          return list.includes(num);
        };
        const isDTime = (current) => {
          if (!needCheckTime) return false;
          if (!this.disabledTime) return false;
          const dateValue = getDateValue(current);
          const disabledTimeProps = this.disabledTime(dateValue);

          return (
            isDisabledItem(current.hour(), disabledTimeProps.disabledHours) ||
            isDisabledItem(current.minute(), disabledTimeProps.disabledMinutes) ||
            isDisabledItem(current.second(), disabledTimeProps.disabledSeconds)
          );
        };
        return (
          value &&
          (isDDate(value) || isDTime(value))
        );
      },

      //------
      onPanelConfirm() {
        this.confirm(this.panelValue, false, true);
      },
      onPanelSelect(value) {
        if (this.needConfirm) {
          this.select(value, true);
        } else {
          this.confirm(value, false);
        }
      },
      onPanelShortcutClick(value, shortcut) {
        this.$emit('select-shortcut', shortcut);
        this.confirm(value, false);
      },
      onPanelShortcutMouseEnter(value) {
        clearTimeout(this.clearPreviewTimer);
        this.previewValue = value;
        this.inputValue = undefined;
      },
      onPanelShortcutMouseLeave() {
        clearTimeout(this.clearPreviewTimer);
        this.clearPreviewTimer = setTimeout(() => {
          this.previewValue = undefined;
        }, 100);
      },
      onPanelHeaderLabelClick(type) {
        this.headerMode = type;
      },
      onMonthHeaderClick() {
        this.headerMode = 'year';
      },
      onYearHeaderClick() {
        this.headerMode = 'date';
      },
      onPanelVisibleChange(visible) {
        if (this.mergedDisabled) return;
        this.setPanelVisible(visible);
      },
      onPanelHeaderSelect(date) {
        let newValue = this.headerValue;
        newValue = newValue.set('year', date.year());
        if (this.headerMode === 'month') {
          newValue = newValue.set('month', date.month());
        }
        this.setHeaderValue(newValue);
        if (this.mode === 'quarter' || this.mode === 'month') {
          // 季度选择器特殊处理，月份选完后关闭headerMode
          this.headerMode = undefined;
          return;
        }
        this.headerMode = this.headerMode === 'year' ? 'month' : undefined; // 年选择完后选择月
      },
      /**
       * 合并时间
       * @param {Date | string | number | undefined} date 日期
       * @param {Date | string | number | undefined} time 时间
       */
      getMergedOpValue(date, time) {
        if (
          !(this.mode === 'date' && this.showTime) &&
          !this.timePickerProps?.value
        )
          return date;
        return mergeValueWithTime(getNow(), date, time);
      },
      onPanelCellClick(value) {
        const newValue = this.getMergedOpValue(value, this.timePickerValue);
        this.onPanelSelect(newValue);
      },
      onTimePickerSelect(time) {
        const newValue = this.getMergedOpValue(this.panelValue || getNow(), time);
        this.onPanelSelect(newValue);
      },
      isSame(current, target) {
        const unit =
          this.computedMode === 'date' || this.computedMode === 'week'
            ? 'M'
            : 'y';
        return current.isSame(target, unit);
      },
      setLocalValue(newVal) {
        if (!newVal) return;
        this.localValue = newVal;
      },
      setHeaderValue(newVal, emitChange = true) {
        if (!newVal) return;
        if (emitChange && !this.isSame(this.headerValue, newVal)) {
          const returnValue = this.getReturnValue(newVal);
          const formattedValue = getFormattedValue(newVal, this.parseValueFormat);
          const dateValue = getDateValue(newVal);
          this.$emit(
            'picker-value-change',
            returnValue,
            dateValue,
            formattedValue
          );
          this.$emit('update:pickerValue', returnValue);
        }
        this.setLocalValue(newVal);
      },
      getDefaultLocalValue() {
        return this.panelValue || this.computedDefaultValue || getNow();
      },
      resetHeaderValue(emitChange = true) {
        const defaultLocalValue = this.getDefaultLocalValue();
        if (emitChange) {
          this.setHeaderValue(defaultLocalValue);
        } else {
          this.setLocalValue(defaultLocalValue);
        }
      },
      getDefaultValue() {
        return this.panelValue || this.defaultTimePickerValue || getNow();
      },
      /**
       * 组件值发生改变
       * @param {Date | string | number | undefined} value 时间
       * @param {Boolean} emitOk 是否完成选择
       */
      emitChange(value, emitOk) {
        const returnValue = value ? this.getReturnValue(value) : undefined;
        const formattedValue = getFormattedValue(value, this.parseValueFormat);
        const dateValue = getDateValue(value);
        if (isValueChange(value, this.selectedValue)) {
          this.$emit('input', returnValue);
          this.$emit('update:modelValue', returnValue);
          this.$emit('change', returnValue, dateValue, formattedValue);
          // eventHandlers.onChange()
        }

        if (emitOk) {
          this.$emit('ok', returnValue, dateValue, formattedValue);
        }
      },
      /**
       * 完成时间的选择
       * @param {Date | string | number | undefined} value 时间
       * @param {Boolean} showPanel 是否显示面板
       * @param {Boolean} emitOk 是否完成
       */
      confirm(value, showPanel, emitOk) {
        if (this.isDisabledDate(value)) {
          return;
        }
        this.emitChange(value, emitOk);
        this.setSelectedValue = value;
        this.processValue = undefined;
        this.previewValue = undefined;
        this.inputValue = undefined;
        this.headerMode = undefined;
        if (isBoolean(showPanel)) {
          this.panelVisible = showPanel;
        }
      },
      /**
       * 选择操作但是不改变外部值
       * @param {Date | string | number | undefined} value 时间
       * @param {Boolean} emitSelect 是否暴露事件
       */
      select(value, emitSelect) {
        this.processValue = value;
        this.previewValue = undefined;
        this.inputValue = undefined;
        this.headerMode = undefined;
        if (emitSelect) {
          const returnValue = value ? this.getReturnValue(value) : undefined;
          const formattedValue = getFormattedValue(value, this.parseValueFormat);
          const dateValue = getDateValue(value);
          this.$emit('select', returnValue, dateValue, formattedValue);
        }
      },
    },
  };

  /* script */
  const __vue_script__ = script;

  /* template */
  var __vue_render__ = function () {var _vm=this;var _h=_vm.$createElement;var _c=_vm._self._c||_h;return (!_vm.hideTrigger)?_c('Popper',{attrs:{"animation":"slide-dynamic-origin","offset":4,"trigger":_vm.trigger,"position":_vm.position,"disabled":_vm.mergedDisabled || _vm.readonly,"popup-visible":_vm.panelVisible,"unmount-on-close":_vm.unmountOnClose,"popup-container":_vm.popupContainer},on:{"popupVisibleChange":_vm.onPanelVisibleChange}},[_c('DateInput',_vm._b({ref:"refInput",attrs:{"size":_vm.size,"focused":_vm.panelVisible,"visible":_vm.panelVisible,"error":_vm.error,"disabled":_vm.mergedDisabled,"readonly":!_vm.inputEditable,"allow-clear":_vm.allowClear && !_vm.readonly,"placeholder":_vm.computedPlaceholder,"input-value":_vm.inputValue,"value":_vm.needConfirm ? _vm.panelValue : _vm.selectedValue,"format":_vm.inputFormat},on:{"clear":_vm.onInputClear,"change":_vm.onInputChange,"pressEnter":_vm.onInputPressEnter},scopedSlots:_vm._u([{key:"suffix-icon",fn:function(){return [_vm._t("suffix-icon",function(){return [_c('IconCalendar')]})]},proxy:true}],null,true)},'DateInput',_vm.$attrs,false)),_vm._v(" "),_c('template',{slot:"content"},[_c('PickerPanel',_vm._g(_vm._b({on:{"click":_vm.onPanelClick}},'PickerPanel',_vm.panelProps,false),_vm.panelOn))],1)],2):_vm._e()};
  var __vue_staticRenderFns__ = [];

    /* style */
    const __vue_inject_styles__ = undefined;
    /* scoped */
    const __vue_scope_id__ = undefined;
    /* module identifier */
    const __vue_module_identifier__ = undefined;
    /* functional template */
    const __vue_is_functional_template__ = false;
    /* style inject */
    
    /* style inject SSR */
    
    /* style inject shadow dom */
    

    
    const __vue_component__ = /*#__PURE__*/normalizeComponent(
      { render: __vue_render__, staticRenderFns: __vue_staticRenderFns__ },
      __vue_inject_styles__,
      __vue_script__,
      __vue_scope_id__,
      __vue_is_functional_template__,
      __vue_module_identifier__,
      false,
      undefined,
      undefined,
      undefined
    );

  // eslint-disable-next-line func-names
  __vue_component__.install = function (Vue) {
    Vue.component(__vue_component__.name, __vue_component__);
  };

  function styleInject(css, ref) {
    if ( ref === void 0 ) ref = {};
    var insertAt = ref.insertAt;

    if (!css || typeof document === 'undefined') { return; }

    var head = document.head || document.getElementsByTagName('head')[0];
    var style = document.createElement('style');
    style.type = 'text/css';

    if (insertAt === 'top') {
      if (head.firstChild) {
        head.insertBefore(style, head.firstChild);
      } else {
        head.appendChild(style);
      }
    } else {
      head.appendChild(style);
    }

    if (style.styleSheet) {
      style.styleSheet.cssText = css;
    } else {
      style.appendChild(document.createTextNode(css));
    }
  }

  var css_248z$6 = "/******** size *******/\n/******** text *******/\n/******** radius *******/\n/******** fontWeight ********/\n/******** Primary *******/\n/******** success *******/\n/******** warning *******/\n/******** danger *******/\n/******** fill *******/\n/******** borderSize *******/\n/******** 面板宽度 *******/\n/******** 高级配置项 end *******/\n.ljc-input-wrapper {\n  display: inline-flex;\n  box-sizing: border-box;\n  width: 100%;\n  padding-right: 12px;\n  padding-left: 12px;\n  color: #1d2129;\n  font-size: 14px;\n  background-color: #f2f3f5;\n  border: 1px solid transparent;\n  border-radius: 2px;\n  cursor: text;\n  transition: color 0.1s cubic-bezier(0, 0, 1, 1), border-color 0.1s cubic-bezier(0, 0, 1, 1), background-color 0.1s cubic-bezier(0, 0, 1, 1);\n}\n.ljc-input-wrapper:hover {\n  background-color: #e5e6eb;\n  border-color: transparent;\n}\n.ljc-input-wrapper:focus-within,\n.ljc-input-wrapper.ljc-input-focus {\n  background-color: #fff;\n  border-color: #165dff;\n  box-shadow: 0 0 0 0 #bedaff;\n}\n.ljc-input-wrapper.ljc-input-disabled {\n  color: #c9cdd4;\n  background-color: #f2f3f5;\n  border-color: transparent;\n  cursor: not-allowed;\n}\n.ljc-input-wrapper.ljc-input-disabled:hover {\n  color: #c9cdd4;\n  background-color: #f2f3f5;\n  border-color: transparent;\n}\n.ljc-input-wrapper.ljc-input-disabled .ljc-input-prefix,\n.ljc-input-wrapper.ljc-input-disabled .ljc-input-suffix {\n  color: inherit;\n}\n.ljc-input-wrapper.ljc-input-error {\n  background-color: #ffece8;\n  border-color: transparent;\n}\n.ljc-input-wrapper.ljc-input-error:hover {\n  background-color: #fdcdc5;\n  border-color: transparent;\n}\n.ljc-input-wrapper.ljc-input-error:focus-within,\n.ljc-input-wrapper.ljc-input-error.ljc-input-wrapper-focus {\n  background-color: #fff;\n  border-color: #f53f3f;\n  box-shadow: 0 0 0 0 #fdcdc5;\n}\n.ljc-input-wrapper .ljc-input-prefix,\n.ljc-input-wrapper .ljc-input-suffix {\n  display: inline-flex;\n  flex-shrink: 0;\n  align-items: center;\n  white-space: nowrap;\n  -webkit-user-select: none;\n  user-select: none;\n}\n.ljc-input-wrapper .ljc-input-prefix > svg,\n.ljc-input-wrapper .ljc-input-suffix > svg {\n  font-size: 14px;\n}\n.ljc-input-wrapper .ljc-input-prefix {\n  padding-right: 12px;\n  color: #4e5969;\n}\n.ljc-input-wrapper .ljc-input-suffix {\n  padding-left: 12px;\n  color: #4e5969;\n}\n.ljc-input-wrapper .ljc-input-suffix .ljc-feedback-icon {\n  display: inline-flex;\n}\n.ljc-input-wrapper .ljc-input-suffix .ljc-feedback-icon-status-validating {\n  color: #165dff;\n}\n.ljc-input-wrapper .ljc-input-suffix .ljc-feedback-icon-status-success {\n  color: #00b42a;\n}\n.ljc-input-wrapper .ljc-input-suffix .ljc-feedback-icon-status-warning {\n  color: #ff7d00;\n}\n.ljc-input-wrapper .ljc-input-suffix .ljc-feedback-icon-status-error {\n  color: #f53f3f;\n}\n.ljc-input-wrapper .ljc-input-clear-btn {\n  align-self: center;\n  color: #4e5969;\n  font-size: 12px;\n  visibility: hidden;\n  cursor: pointer;\n}\n.ljc-input-wrapper .ljc-input-clear-btn > svg {\n  position: relative;\n  transition: color 0.1s cubic-bezier(0, 0, 1, 1);\n}\n.ljc-input-wrapper:hover .ljc-input-clear-btn {\n  visibility: visible;\n}\n.ljc-input-wrapper:not(.ljc-input-focus) .ljc-input-icon-hover:hover::before {\n  background-color: #c9cdd4;\n}\n.ljc-input-wrapper .ljc-input {\n  width: 100%;\n  padding-right: 0;\n  padding-left: 0;\n  color: inherit;\n  line-height: 1.5715;\n  background: none;\n  border: none;\n  border-radius: 0;\n  outline: none;\n  cursor: inherit;\n  -webkit-appearance: none;\n  -webkit-tap-highlight-color: rgba(0, 0, 0, 0);\n}\n.ljc-input-wrapper .ljc-input::placeholder {\n  color: #86909c;\n}\n.ljc-input-wrapper .ljc-input[disabled]::placeholder {\n  color: #c9cdd4;\n}\n.ljc-input-wrapper .ljc-input[disabled] {\n  -webkit-text-fill-color: #c9cdd4;\n}\n.ljc-input-wrapper .ljc-input.ljc-input-size-mini {\n  /* prettier-ignore */\n  padding-top: 1px;\n  /* prettier-ignore */\n  padding-bottom: 1px;\n  font-size: 12px;\n  line-height: 1.667;\n}\n.ljc-input-wrapper .ljc-input.ljc-input-size-small {\n  /* prettier-ignore */\n  padding-top: 2px;\n  /* prettier-ignore */\n  padding-bottom: 2px;\n  font-size: 14px;\n  line-height: 1.5715;\n}\n.ljc-input-wrapper .ljc-input.ljc-input-size-medium {\n  /* prettier-ignore */\n  padding-top: 4px;\n  /* prettier-ignore */\n  padding-bottom: 4px;\n  font-size: 14px;\n  line-height: 1.5715;\n}\n.ljc-input-wrapper .ljc-input.ljc-input-size-large {\n  /* prettier-ignore */\n  padding-top: 6px;\n  /* prettier-ignore */\n  padding-bottom: 6px;\n  font-size: 14px;\n  line-height: 1.5715;\n}\n.ljc-input-wrapper .ljc-input-word-limit {\n  color: #86909c;\n  font-size: 12px;\n}\n.ljc-input-outer {\n  display: inline-flex;\n  width: 100%;\n}\n.ljc-input-outer > .ljc-input-wrapper {\n  border-radius: 0;\n}\n.ljc-input-outer > :first-child {\n  border-top-left-radius: 2px;\n  border-bottom-left-radius: 2px;\n}\n.ljc-input-outer > :last-child {\n  border-top-right-radius: 2px;\n  border-bottom-right-radius: 2px;\n}\n.ljc-input-outer.ljc-input-outer-size-mini .ljc-input-outer {\n  font-size: 12px;\n}\n.ljc-input-outer.ljc-input-outer-size-mini .ljc-input-wrapper .ljc-input-prefix,\n.ljc-input-outer.ljc-input-outer-size-mini .ljc-input-wrapper .ljc-input-suffix {\n  font-size: 12px;\n}\n.ljc-input-outer.ljc-input-outer-size-mini .ljc-input-wrapper .ljc-input-prefix > svg,\n.ljc-input-outer.ljc-input-outer-size-mini .ljc-input-wrapper .ljc-input-suffix > svg {\n  font-size: 12px;\n}\n.ljc-input-outer.ljc-input-outer-size-mini .ljc-input-prepend,\n.ljc-input-outer.ljc-input-outer-size-mini .ljc-input-append {\n  font-size: 12px;\n}\n.ljc-input-outer.ljc-input-outer-size-mini .ljc-input-prepend > svg,\n.ljc-input-outer.ljc-input-outer-size-mini .ljc-input-append > svg {\n  font-size: 12px;\n}\n.ljc-input-outer.ljc-input-outer-size-mini .ljc-input-prepend .ljc-input {\n  width: auto;\n  height: 100%;\n  margin-top: -1px;\n  margin-bottom: -1px;\n  margin-right: -13px;\n  margin-left: -12px;\n  border-color: transparent;\n  border-top-left-radius: 0;\n  border-bottom-left-radius: 0;\n}\n.ljc-input-outer.ljc-input-outer-size-mini .ljc-input-prepend .ljc-select {\n  width: auto;\n  height: 100%;\n  margin-top: -1px;\n  margin-bottom: -1px;\n  margin-right: -13px;\n  margin-left: -12px;\n}\n.ljc-input-outer.ljc-input-outer-size-mini .ljc-input-prepend .ljc-select .ljc-select-view {\n  background-color: inherit;\n  border-color: transparent;\n  border-radius: 0;\n}\n.ljc-input-outer.ljc-input-outer-size-mini .ljc-input-prepend .ljc-select.ljc-select-single .ljc-select-view {\n  height: 100%;\n}\n.ljc-input-outer.ljc-input-outer-size-mini .ljc-input-append .ljc-input {\n  width: auto;\n  height: 100%;\n  margin-top: -1px;\n  margin-bottom: -1px;\n  margin-right: -12px;\n  margin-left: -13px;\n  border-color: transparent;\n  border-top-right-radius: 0;\n  border-bottom-right-radius: 0;\n}\n.ljc-input-outer.ljc-input-outer-size-mini .ljc-input-append .ljc-select {\n  width: auto;\n  height: 100%;\n  margin-top: -1px;\n  margin-bottom: -1px;\n  margin-right: -12px;\n  margin-left: -13px;\n}\n.ljc-input-outer.ljc-input-outer-size-mini .ljc-input-append .ljc-select .ljc-select-view {\n  background-color: inherit;\n  border-color: transparent;\n  border-radius: 0;\n}\n.ljc-input-outer.ljc-input-outer-size-mini .ljc-input-append .ljc-select.ljc-select-single .ljc-select-view {\n  height: 100%;\n}\n.ljc-input-outer.ljc-input-outer-size-small .ljc-input-outer {\n  font-size: 14px;\n}\n.ljc-input-outer.ljc-input-outer-size-small .ljc-input-wrapper .ljc-input-prefix,\n.ljc-input-outer.ljc-input-outer-size-small .ljc-input-wrapper .ljc-input-suffix {\n  font-size: 14px;\n}\n.ljc-input-outer.ljc-input-outer-size-small .ljc-input-wrapper .ljc-input-prefix > svg,\n.ljc-input-outer.ljc-input-outer-size-small .ljc-input-wrapper .ljc-input-suffix > svg {\n  font-size: 14px;\n}\n.ljc-input-outer.ljc-input-outer-size-small .ljc-input-prepend,\n.ljc-input-outer.ljc-input-outer-size-small .ljc-input-append {\n  font-size: 14px;\n}\n.ljc-input-outer.ljc-input-outer-size-small .ljc-input-prepend > svg,\n.ljc-input-outer.ljc-input-outer-size-small .ljc-input-append > svg {\n  font-size: 14px;\n}\n.ljc-input-outer.ljc-input-outer-size-small .ljc-input-prepend .ljc-input {\n  width: auto;\n  height: 100%;\n  margin-top: -1px;\n  margin-bottom: -1px;\n  margin-right: -13px;\n  margin-left: -12px;\n  border-color: transparent;\n  border-top-left-radius: 0;\n  border-bottom-left-radius: 0;\n}\n.ljc-input-outer.ljc-input-outer-size-small .ljc-input-prepend .ljc-select {\n  width: auto;\n  height: 100%;\n  margin-top: -1px;\n  margin-bottom: -1px;\n  margin-right: -13px;\n  margin-left: -12px;\n}\n.ljc-input-outer.ljc-input-outer-size-small .ljc-input-prepend .ljc-select .ljc-select-view {\n  background-color: inherit;\n  border-color: transparent;\n  border-radius: 0;\n}\n.ljc-input-outer.ljc-input-outer-size-small .ljc-input-prepend .ljc-select.ljc-select-single .ljc-select-view {\n  height: 100%;\n}\n.ljc-input-outer.ljc-input-outer-size-small .ljc-input-append .ljc-input {\n  width: auto;\n  height: 100%;\n  margin-top: -1px;\n  margin-bottom: -1px;\n  margin-right: -12px;\n  margin-left: -13px;\n  border-color: transparent;\n  border-top-right-radius: 0;\n  border-bottom-right-radius: 0;\n}\n.ljc-input-outer.ljc-input-outer-size-small .ljc-input-append .ljc-select {\n  width: auto;\n  height: 100%;\n  margin-top: -1px;\n  margin-bottom: -1px;\n  margin-right: -12px;\n  margin-left: -13px;\n}\n.ljc-input-outer.ljc-input-outer-size-small .ljc-input-append .ljc-select .ljc-select-view {\n  background-color: inherit;\n  border-color: transparent;\n  border-radius: 0;\n}\n.ljc-input-outer.ljc-input-outer-size-small .ljc-input-append .ljc-select.ljc-select-single .ljc-select-view {\n  height: 100%;\n}\n.ljc-input-outer.ljc-input-outer-size-large .ljc-input-outer {\n  font-size: 14px;\n}\n.ljc-input-outer.ljc-input-outer-size-large .ljc-input-wrapper .ljc-input-prefix,\n.ljc-input-outer.ljc-input-outer-size-large .ljc-input-wrapper .ljc-input-suffix {\n  font-size: 14px;\n}\n.ljc-input-outer.ljc-input-outer-size-large .ljc-input-wrapper .ljc-input-prefix > svg,\n.ljc-input-outer.ljc-input-outer-size-large .ljc-input-wrapper .ljc-input-suffix > svg {\n  font-size: 14px;\n}\n.ljc-input-outer.ljc-input-outer-size-large .ljc-input-prepend,\n.ljc-input-outer.ljc-input-outer-size-large .ljc-input-append {\n  font-size: 14px;\n}\n.ljc-input-outer.ljc-input-outer-size-large .ljc-input-prepend > svg,\n.ljc-input-outer.ljc-input-outer-size-large .ljc-input-append > svg {\n  font-size: 14px;\n}\n.ljc-input-outer.ljc-input-outer-size-large .ljc-input-prepend .ljc-input {\n  width: auto;\n  height: 100%;\n  margin-top: -1px;\n  margin-bottom: -1px;\n  margin-right: -13px;\n  margin-left: -12px;\n  border-color: transparent;\n  border-top-left-radius: 0;\n  border-bottom-left-radius: 0;\n}\n.ljc-input-outer.ljc-input-outer-size-large .ljc-input-prepend .ljc-select {\n  width: auto;\n  height: 100%;\n  margin-top: -1px;\n  margin-bottom: -1px;\n  margin-right: -13px;\n  margin-left: -12px;\n}\n.ljc-input-outer.ljc-input-outer-size-large .ljc-input-prepend .ljc-select .ljc-select-view {\n  background-color: inherit;\n  border-color: transparent;\n  border-radius: 0;\n}\n.ljc-input-outer.ljc-input-outer-size-large .ljc-input-prepend .ljc-select.ljc-select-single .ljc-select-view {\n  height: 100%;\n}\n.ljc-input-outer.ljc-input-outer-size-large .ljc-input-append .ljc-input {\n  width: auto;\n  height: 100%;\n  margin-top: -1px;\n  margin-bottom: -1px;\n  margin-right: -12px;\n  margin-left: -13px;\n  border-color: transparent;\n  border-top-right-radius: 0;\n  border-bottom-right-radius: 0;\n}\n.ljc-input-outer.ljc-input-outer-size-large .ljc-input-append .ljc-select {\n  width: auto;\n  height: 100%;\n  margin-top: -1px;\n  margin-bottom: -1px;\n  margin-right: -12px;\n  margin-left: -13px;\n}\n.ljc-input-outer.ljc-input-outer-size-large .ljc-input-append .ljc-select .ljc-select-view {\n  background-color: inherit;\n  border-color: transparent;\n  border-radius: 0;\n}\n.ljc-input-outer.ljc-input-outer-size-large .ljc-input-append .ljc-select.ljc-select-single .ljc-select-view {\n  height: 100%;\n}\n.ljc-input-outer-disabled {\n  cursor: not-allowed;\n}\n.ljc-input-prepend,\n.ljc-input-append {\n  display: inline-flex;\n  flex-shrink: 0;\n  align-items: center;\n  box-sizing: border-box;\n  padding: 0 12px;\n  color: #1d2129;\n  white-space: nowrap;\n  background-color: #f2f3f5;\n  border: 1px solid transparent;\n}\n.ljc-input-prepend > svg,\n.ljc-input-append > svg {\n  font-size: 14px;\n}\n.ljc-input-prepend {\n  border-right: 1px solid #e5e6eb;\n}\n.ljc-input-prepend .ljc-input {\n  width: auto;\n  height: 100%;\n  margin-top: -1px;\n  margin-bottom: -1px;\n  margin-right: -12px;\n  margin-left: -13px;\n  border-color: transparent;\n  border-top-right-radius: 0;\n  border-bottom-right-radius: 0;\n}\n.ljc-input-prepend .ljc-select {\n  width: auto;\n  height: 100%;\n  margin-top: -1px;\n  margin-bottom: -1px;\n  margin-right: -12px;\n  margin-left: -13px;\n}\n.ljc-input-prepend .ljc-select .ljc-select-view {\n  background-color: inherit;\n  border-color: transparent;\n  border-radius: 0;\n}\n.ljc-input-prepend .ljc-select.ljc-select-single .ljc-select-view {\n  height: 100%;\n}\n.ljc-input-append {\n  border-left: 1px solid #e5e6eb;\n}\n.ljc-input-append .ljc-input {\n  width: auto;\n  height: 100%;\n  margin-top: -1px;\n  margin-bottom: -1px;\n  margin-right: -13px;\n  margin-left: -12px;\n  border-color: transparent;\n  border-top-left-radius: 0;\n  border-bottom-left-radius: 0;\n}\n.ljc-input-append .ljc-select {\n  width: auto;\n  height: 100%;\n  margin-top: -1px;\n  margin-bottom: -1px;\n  margin-right: -13px;\n  margin-left: -12px;\n}\n.ljc-input-append .ljc-select .ljc-select-view {\n  background-color: inherit;\n  border-color: transparent;\n  border-radius: 0;\n}\n.ljc-input-append .ljc-select.ljc-select-single .ljc-select-view {\n  height: 100%;\n}\n/***** group ******/\n.ljc-input-group {\n  display: inline-flex;\n  align-items: center;\n}\n.ljc-input-group > * {\n  border-radius: 0;\n}\n.ljc-input-group > *.ljc-input-outer > :last-child,\n.ljc-input-group > *.ljc-input-outer > :first-child {\n  border-radius: 0;\n}\n.ljc-input-group > *:not(:last-child) {\n  position: relative;\n  box-sizing: border-box;\n}\n.ljc-input-group > *:first-child,\n.ljc-input-group > *:first-child .ljc-input-group > *:first-child {\n  border-top-left-radius: 2px;\n  border-bottom-left-radius: 2px;\n}\n.ljc-input-group > *:first-child .ljc-select-view,\n.ljc-input-group > *:first-child .ljc-input-group > *:first-child .ljc-select-view {\n  border-top-left-radius: 2px;\n  border-bottom-left-radius: 2px;\n}\n.ljc-input-group > *:last-child,\n.ljc-input-group > *:last-child .ljc-input-outer > *:last-child {\n  border-top-right-radius: 2px;\n  border-bottom-right-radius: 2px;\n}\n.ljc-input-group > *:last-child .ljc-select-view,\n.ljc-input-group > *:last-child .ljc-input-outer > *:last-child .ljc-select-view {\n  border-top-right-radius: 2px;\n  border-bottom-right-radius: 2px;\n}\n.ljc-input-group > .ljc-input-wrapper:not(:last-child),\n.ljc-input-group > .ljc-input-outer:not(:last-child),\n.ljc-input-group > .ljc-input-tag:not(:last-child),\n.ljc-input-group > .ljc-select-view:not(:last-child) {\n  border-right: 1px solid #e5e6eb;\n}\n.ljc-input-group > .ljc-input-wrapper:not(:last-child):focus-within,\n.ljc-input-group > .ljc-input-outer:not(:last-child):focus-within,\n.ljc-input-group > .ljc-input-tag:not(:last-child):focus-within,\n.ljc-input-group > .ljc-select-view:not(:last-child):focus-within {\n  border-right-color: #165dff;\n}\n/******* size ********/\n.size-height-size-mini {\n  /* prettier-ignore */\n  padding-top: 1px;\n  /* prettier-ignore */\n  padding-bottom: 1px;\n  font-size: 12px;\n  line-height: 1.667;\n}\n.size-height-size-small {\n  /* prettier-ignore */\n  padding-top: 2px;\n  /* prettier-ignore */\n  padding-bottom: 2px;\n  font-size: 14px;\n}\n.size-height-size-large {\n  /* prettier-ignore */\n  padding-top: 6px;\n  /* prettier-ignore */\n  padding-bottom: 6px;\n  font-size: 14px;\n}\n";
  styleInject(css_248z$6);

  var css_248z$5 = "/******** size *******/\n/******** text *******/\n/******** radius *******/\n/******** fontWeight ********/\n/******** Primary *******/\n/******** success *******/\n/******** warning *******/\n/******** danger *******/\n/******** fill *******/\n/******** borderSize *******/\n/******** 面板宽度 *******/\n.ljc-timepicker {\n  position: relative;\n  display: flex;\n  box-sizing: border-box;\n  padding: 0;\n}\n.ljc-timepicker-container {\n  overflow: hidden;\n  background-color: #fff;\n  border: 1px solid #f7f8fa;\n  border-radius: 4px;\n  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);\n}\n.ljc-timepicker-column {\n  box-sizing: border-box;\n  width: 64px;\n  height: 224px;\n  overflow: hidden;\n}\n.ljc-timepicker-column:not(:last-child) {\n  border-right: 1px solid #f7f8fa;\n}\n.ljc-timepicker-column:hover {\n  overflow-y: auto;\n}\n.ljc-timepicker-column ul {\n  box-sizing: border-box;\n  margin: 0;\n  padding: 0;\n  list-style: none;\n}\n.ljc-timepicker-column ul::after {\n  display: block;\n  width: 100%;\n  height: 192px;\n  content: '';\n}\n.ljc-timepicker-cell {\n  padding: 4px 0;\n  color: #1d2129;\n  font-weight: 500;\n  cursor: pointer;\n}\n.ljc-timepicker-cell-inner {\n  height: 24px;\n  padding-left: 24px;\n  font-size: 14px;\n  line-height: 24px;\n}\n.ljc-timepicker-cell:not(.ljc-timepicker-cell-selected):not(.ljc-timepicker-cell-disabled):hover .ljc-timepicker-cell-inner {\n  background-color: #f2f3f5;\n}\n.ljc-timepicker-cell-selected .ljc-timepicker-cell-inner {\n  font-weight: 500;\n  background-color: #f2f3f5;\n}\n.ljc-timepicker-cell-disabled {\n  color: #c9cdd4;\n  cursor: not-allowed;\n}\n.ljc-timepicker-footer-extra-wrapper {\n  padding: 8px;\n  color: #1d2129;\n  font-size: 12px;\n  border-top: 1px solid #f7f8fa;\n}\n.ljc-timepicker-footer-btn-wrapper {\n  display: flex;\n  justify-content: space-between;\n  padding: 8px;\n  border-top: 1px solid #f7f8fa;\n}\n.ljc-timepicker-footer-btn-wrapper :only-child {\n  margin-left: auto;\n}\n";
  styleInject(css_248z$5);

  var css_248z$4 = "/******** size *******/\n/******** text *******/\n/******** radius *******/\n/******** fontWeight ********/\n/******** Primary *******/\n/******** success *******/\n/******** warning *******/\n/******** danger *******/\n/******** fill *******/\n/******** borderSize *******/\n/******** 面板宽度 *******/\n.ljc-icon {\n  display: inline-block;\n  width: 1em;\n  height: 1em;\n  color: inherit;\n  font-style: normal;\n  vertical-align: -2px;\n  outline: none;\n  stroke: currentColor;\n}\n.ljc-icon-hover {\n  position: relative;\n  display: inline-block;\n  cursor: pointer;\n  line-height: 12px;\n}\n.ljc-icon-hover .ljc-icon {\n  position: relative;\n}\n.ljc-icon-hover::before {\n  position: absolute;\n  display: block;\n  box-sizing: border-box;\n  background-color: transparent;\n  border-radius: 50%;\n  transition: background-color 0.1s cubic-bezier(0, 0, 1, 1);\n  content: '';\n}\n.ljc-icon-hover:hover::before {\n  background-color: #f2f3f5;\n}\n.ljc-icon-hover.ljc-icon-hover-disabled::before {\n  opacity: 0;\n}\n.ljc-icon-hover::before {\n  top: 50%;\n  left: 50%;\n  width: 20px;\n  height: 20px;\n  transform: translate(-50%, -50%);\n}\n.ljc-icon-hover-size-mini {\n  line-height: 12px;\n}\n.ljc-icon-hover-size-mini::before {\n  top: 50%;\n  left: 50%;\n  width: 20px;\n  height: 20px;\n  transform: translate(-50%, -50%);\n}\n.ljc-icon-hover-size-small {\n  line-height: 12px;\n}\n.ljc-icon-hover-size-small::before {\n  top: 50%;\n  left: 50%;\n  width: 20px;\n  height: 20px;\n  transform: translate(-50%, -50%);\n}\n.ljc-icon-hover-size-large {\n  line-height: 12px;\n}\n.ljc-icon-hover-size-large::before {\n  top: 50%;\n  left: 50%;\n  width: 24px;\n  height: 24px;\n  transform: translate(-50%, -50%);\n}\n.ljc-icon-hover-size-huge {\n  line-height: 12px;\n}\n.ljc-icon-hover-size-huge::before {\n  top: 50%;\n  left: 50%;\n  width: 24px;\n  height: 24px;\n  transform: translate(-50%, -50%);\n}\n";
  styleInject(css_248z$4);

  var css_248z$3 = "/******** size *******/\n/******** text *******/\n/******** radius *******/\n/******** fontWeight ********/\n/******** Primary *******/\n/******** success *******/\n/******** warning *******/\n/******** danger *******/\n/******** fill *******/\n/******** borderSize *******/\n/******** 面板宽度 *******/\n/***** Primary *****/\n/***** Secondary *****/\n/***** focus-visible *****/\n.ljc-btn {\n  position: relative;\n  display: inline-flex;\n  align-items: center;\n  justify-content: center;\n  box-sizing: border-box;\n  font-weight: 400;\n  line-height: 1.5715;\n  white-space: nowrap;\n  outline: none;\n  cursor: pointer;\n  transition: all 0.1s cubic-bezier(0, 0, 1, 1);\n  -webkit-appearance: none;\n  -moz-appearance: none;\n  /* Firefox */\n  appearance: none;\n  /* Other modern browsers */\n  -webkit-user-select: none;\n  user-select: none;\n}\n.ljc-btn > a:only-child {\n  color: currentColor;\n}\n.ljc-btn:active {\n  transition: none;\n}\n.ljc-btn-primary,\n.ljc-btn-primary[type='button'],\n.ljc-btn-primary[type='submit'] {\n  color: #fff;\n  background-color: #165dff;\n  border: 1px solid transparent;\n}\n.ljc-btn-primary:hover,\n.ljc-btn-primary[type='button']:hover,\n.ljc-btn-primary[type='submit']:hover {\n  color: #fff;\n  background-color: #4080ff;\n  border-color: transparent;\n}\n.ljc-btn-primary:focus-visible,\n.ljc-btn-primary[type='button']:focus-visible,\n.ljc-btn-primary[type='submit']:focus-visible {\n  box-shadow: 0 0 0 0.25em #94bfff;\n}\n.ljc-btn-primary:active,\n.ljc-btn-primary[type='button']:active,\n.ljc-btn-primary[type='submit']:active {\n  color: #fff;\n  background-color: #0e42d2;\n  border-color: transparent;\n}\n.ljc-btn-primary.ljc-btn-disabled,\n.ljc-btn-primary[type='button'].ljc-btn-disabled,\n.ljc-btn-primary[type='submit'].ljc-btn-disabled {\n  color: #fff;\n  background-color: #94bfff;\n  border: 1px solid transparent;\n  cursor: not-allowed;\n}\n.ljc-btn-primary.ljc-btn-status-warning {\n  color: #fff;\n  background-color: #ff7d00;\n  border-color: transparent;\n}\n.ljc-btn-primary.ljc-btn-status-warning:hover {\n  color: #fff;\n  background-color: #ff9a2e;\n  border-color: transparent;\n}\n.ljc-btn-primary.ljc-btn-status-warning:focus-visible {\n  box-shadow: 0 0 0 0.25em #ffcf8b;\n}\n.ljc-btn-primary.ljc-btn-status-warning:active {\n  color: #fff;\n  background-color: #d25f00;\n  border-color: transparent;\n}\n.ljc-btn-primary.ljc-btn-status-warning.ljc-btn-disabled {\n  color: #fff;\n  background-color: #ffcf8b;\n  border: 1px solid transparent;\n}\n.ljc-btn-primary.ljc-btn-status-danger {\n  color: #fff;\n  background-color: #f53f3f;\n  border-color: transparent;\n}\n.ljc-btn-primary.ljc-btn-status-danger:hover {\n  color: #fff;\n  background-color: #f76560;\n  border-color: transparent;\n}\n.ljc-btn-primary.ljc-btn-status-danger:focus-visible {\n  box-shadow: 0 0 0 0.25em #fbaca3;\n}\n.ljc-btn-primary.ljc-btn-status-danger:active {\n  color: #fff;\n  background-color: #cb272d;\n  border-color: transparent;\n}\n.ljc-btn-primary.ljc-btn-status-danger.ljc-btn-disabled {\n  color: #fff;\n  background-color: #fbaca3;\n  border: 1px solid transparent;\n}\n.ljc-btn-primary.ljc-btn-status-success {\n  color: #fff;\n  background-color: #00b42a;\n  border-color: transparent;\n}\n.ljc-btn-primary.ljc-btn-status-success:hover {\n  color: #fff;\n  background-color: #23c343;\n  border-color: transparent;\n}\n.ljc-btn-primary.ljc-btn-status-success:focus-visible {\n  box-shadow: 0 0 0 0.25em #7be188;\n}\n.ljc-btn-primary.ljc-btn-status-success:active {\n  color: #fff;\n  background-color: #009a29;\n  border-color: transparent;\n}\n.ljc-btn-primary.ljc-btn-status-success.ljc-btn-disabled {\n  color: #fff;\n  background-color: #7be188;\n  border: 1px solid transparent;\n}\n.ljc-btn-secondary,\n.ljc-btn-secondary[type='button'],\n.ljc-btn-secondary[type='submit'] {\n  color: #4e5969;\n  background-color: #f2f3f5;\n  border: 1px solid transparent;\n}\n.ljc-btn-secondary:hover,\n.ljc-btn-secondary[type='button']:hover,\n.ljc-btn-secondary[type='submit']:hover {\n  color: #4e5969;\n  background-color: #e5e6eb;\n  border-color: transparent;\n}\n.ljc-btn-secondary:focus-visible,\n.ljc-btn-secondary[type='button']:focus-visible,\n.ljc-btn-secondary[type='submit']:focus-visible {\n  box-shadow: 0 0 0 0.25em #c9cdd4;\n}\n.ljc-btn-secondary:active,\n.ljc-btn-secondary[type='button']:active,\n.ljc-btn-secondary[type='submit']:active {\n  color: #4e5969;\n  background-color: #c9cdd4;\n  border-color: transparent;\n}\n.ljc-btn-secondary.ljc-btn-disabled,\n.ljc-btn-secondary[type='button'].ljc-btn-disabled,\n.ljc-btn-secondary[type='submit'].ljc-btn-disabled {\n  color: #c9cdd4;\n  background-color: #f7f8fa;\n  border: 1px solid transparent;\n  cursor: not-allowed;\n}\n.ljc-btn-secondary.ljc-btn-status-warning {\n  color: #ff7d00;\n  background-color: #fff7e8;\n  border-color: transparent;\n}\n.ljc-btn-secondary.ljc-btn-status-warning:hover {\n  color: #ff7d00;\n  background-color: #ffe4ba;\n  border-color: transparent;\n}\n.ljc-btn-secondary.ljc-btn-status-warning:focus-visible {\n  box-shadow: 0 0 0 0.25em #ffcf8b;\n}\n.ljc-btn-secondary.ljc-btn-status-warning:active {\n  color: #ff7d00;\n  background-color: #ffcf8b;\n  border-color: transparent;\n}\n.ljc-btn-secondary.ljc-btn-status-warning.ljc-btn-disabled {\n  color: #ffcf8b;\n  background-color: #fff7e8;\n  border: 1px solid transparent;\n}\n.ljc-btn-secondary.ljc-btn-status-danger {\n  color: #f53f3f;\n  background-color: #ffece8;\n  border-color: transparent;\n}\n.ljc-btn-secondary.ljc-btn-status-danger:hover {\n  color: #f53f3f;\n  background-color: #fdcdc5;\n  border-color: transparent;\n}\n.ljc-btn-secondary.ljc-btn-status-danger:focus-visible {\n  box-shadow: 0 0 0 0.25em #fbaca3;\n}\n.ljc-btn-secondary.ljc-btn-status-danger:active {\n  color: #f53f3f;\n  background-color: #fbaca3;\n  border-color: transparent;\n}\n.ljc-btn-secondary.ljc-btn-status-danger.ljc-btn-disabled {\n  color: #fbaca3;\n  background-color: #ffece8;\n  border: 1px solid transparent;\n}\n.ljc-btn-secondary.ljc-btn-status-success {\n  color: #00b42a;\n  background-color: #e8ffea;\n  border-color: transparent;\n}\n.ljc-btn-secondary.ljc-btn-status-success:hover {\n  color: #00b42a;\n  background-color: #aff0b5;\n  border-color: transparent;\n}\n.ljc-btn-secondary.ljc-btn-status-success:focus-visible {\n  box-shadow: 0 0 0 0.25em #7be188;\n}\n.ljc-btn-secondary.ljc-btn-status-success:active {\n  color: #00b42a;\n  background-color: #7be188;\n  border-color: transparent;\n}\n.ljc-btn-secondary.ljc-btn-status-success.ljc-btn-disabled {\n  color: #7be188;\n  background-color: #e8ffea;\n  border: 1px solid transparent;\n}\n.ljc-btn-size-mini {\n  height: 24px;\n  padding: 0 11px;\n  font-size: 12px;\n  border-radius: 2px;\n}\n.ljc-btn-size-small {\n  height: 28px;\n  padding: 0 15px;\n  font-size: 14px;\n  border-radius: 2px;\n}\n.ljc-btn-size-medium {\n  height: 32px;\n  padding: 0 15px;\n  font-size: 14px;\n  border-radius: 2px;\n}\n.ljc-btn-size-large {\n  height: 36px;\n  padding: 0 19px;\n  font-size: 14px;\n  border-radius: 2px;\n}\n.ljc-btn-group {\n  display: inline-flex;\n  align-items: center;\n}\n.ljc-btn-group .ljc-btn-outline:not(:first-child),\n.ljc-btn-group .ljc-btn-dashed:not(:first-child) {\n  margin-left: -1px;\n}\n.ljc-btn-group .ljc-btn-primary:not(:last-child) {\n  border-right: 1px solid #4080ff;\n}\n.ljc-btn-group .ljc-btn-secondary:not(:last-child) {\n  border-right: 1px solid #e5e6eb;\n}\n.ljc-btn-group .ljc-btn-status-warning:not(:last-child) {\n  border-right: 1px solid #ff9a2e;\n}\n.ljc-btn-group .ljc-btn-status-danger:not(:last-child) {\n  border-right: 1px solid #f76560;\n}\n.ljc-btn-group .ljc-btn-status-success:not(:last-child) {\n  border-right: 1px solid #23c343;\n}\n.ljc-btn-group .ljc-btn-outline:hover,\n.ljc-btn-group .ljc-btn-dashed:hover,\n.ljc-btn-group .ljc-btn-outline:active,\n.ljc-btn-group .ljc-btn-dashed:active {\n  z-index: 2;\n}\n.ljc-btn-group .ljc-btn:first-child {\n  border-top-right-radius: 0;\n  border-bottom-right-radius: 0;\n}\n.ljc-btn-group .ljc-btn:last-child {\n  border-top-left-radius: 0;\n  border-bottom-left-radius: 0;\n}\n.ljc-btn-group .ljc-btn:not(:first-child):not(:last-child) {\n  border-radius: 0;\n}\n";
  styleInject(css_248z$3);

  var css_248z$2 = "/******** size *******/\n/******** text *******/\n/******** radius *******/\n/******** fontWeight ********/\n/******** Primary *******/\n/******** success *******/\n/******** warning *******/\n/******** danger *******/\n/******** fill *******/\n/******** borderSize *******/\n/******** 面板宽度 *******/\n.ljc-picker-link {\n  display: inline-flex;\n  align-items: center;\n  justify-content: center;\n  padding: 1px 2px;\n  color: #165dff;\n  font-size: 14px;\n  line-height: 1.5715;\n  text-decoration: none;\n  background-color: transparent;\n  border-radius: 2px;\n  cursor: pointer;\n  transition: all 0.1s cubic-bezier(0, 0, 1, 1);\n}\n.ljc-picker-link:hover {\n  color: #165dff;\n  background-color: #f2f3f5;\n}\n.ljc-picker-link:active {\n  color: #165dff;\n  background-color: #e5e6eb;\n  transition: none;\n}\n.ljc-picker-link.ljc-picker-link-disabled {\n  color: #94bfff;\n  background: none;\n  cursor: not-allowed;\n}\n";
  styleInject(css_248z$2);

  var css_248z$1 = "/******** size *******/\n/******** text *******/\n/******** radius *******/\n/******** fontWeight ********/\n/******** Primary *******/\n/******** success *******/\n/******** warning *******/\n/******** danger *******/\n/******** fill *******/\n/******** borderSize *******/\n/******** 面板宽度 *******/\n.ljc-picker {\n  position: relative;\n  display: inline-flex;\n  align-items: center;\n  box-sizing: border-box;\n  padding: 4px 11px 4px 4px;\n  line-height: 1.5715;\n  background-color: #f2f3f5;\n  border: 1px solid transparent;\n  border-radius: 2px;\n  transition: all 0.1s cubic-bezier(0, 0, 1, 1);\n}\n.ljc-picker-input {\n  display: inline-flex;\n  flex: 1;\n}\n.ljc-picker input {\n  width: 100%;\n  padding: 0;\n  padding-left: 8px;\n  color: #4e5969;\n  line-height: 1.5715;\n  text-align: left;\n  background-color: transparent;\n  border: none;\n  outline: none;\n  transition: all 0.1s cubic-bezier(0, 0, 1, 1);\n}\n.ljc-picker input::placeholder {\n  color: #86909c;\n}\n.ljc-picker input[disabled] {\n  -webkit-text-fill-color: #c9cdd4;\n}\n.ljc-picker-suffix {\n  display: inline-flex;\n  align-items: center;\n  width: 1em;\n  margin-left: 4px;\n}\n.ljc-picker-suffix-icon {\n  color: #4e5969;\n}\n.ljc-picker .ljc-picker-clear-icon {\n  display: none;\n  color: #4e5969;\n  font-size: 12px;\n}\n.ljc-picker:hover {\n  background-color: #e5e6eb;\n  border-color: transparent;\n}\n.ljc-picker:not(.ljc-picker-disabled):hover .ljc-picker-clear-icon {\n  display: inline-block;\n}\n.ljc-picker:not(.ljc-picker-disabled):hover .ljc-picker-suffix .ljc-picker-clear-icon + span {\n  display: none;\n}\n.ljc-picker input[disabled] {\n  color: #c9cdd4;\n  cursor: not-allowed;\n}\n.ljc-picker input[disabled]::placeholder {\n  color: #c9cdd4;\n}\n.ljc-picker-error {\n  background-color: #fdcdc5;\n  border-color: transparent;\n}\n.ljc-picker-error:hover {\n  background-color: #fdcdc5;\n  border-color: transparent;\n}\n.ljc-picker-focused {\n  box-shadow: 0 0 0 0 #e8f3ff;\n}\n.ljc-picker-focused,\n.ljc-picker-focused:hover {\n  background-color: #fff;\n  border-color: #165dff;\n}\n.ljc-picker-focused.ljc-picker-error {\n  border-color: #f53f3f;\n  box-shadow: 0 0 0 0 #fdcdc5;\n}\n.ljc-picker-focused .ljc-picker-input-active input,\n.ljc-picker-focused:hover .ljc-picker-input-active input {\n  background: #f2f3f5;\n}\n.ljc-picker-disabled,\n.ljc-picker-disabled:hover {\n  color: #c9cdd4;\n  background-color: #f2f3f5;\n  border-color: transparent;\n  cursor: not-allowed;\n}\n.ljc-picker-disabled input[disabled],\n.ljc-picker-disabled:hover input[disabled] {\n  color: #c9cdd4;\n  cursor: not-allowed;\n}\n.ljc-picker-disabled input[disabled]::placeholder,\n.ljc-picker-disabled:hover input[disabled]::placeholder {\n  color: #c9cdd4;\n}\n.ljc-picker-separator {\n  min-width: 10px;\n  padding: 0 8px;\n  color: #86909c;\n}\n.ljc-picker-disabled .ljc-picker-separator {\n  color: #c9cdd4;\n}\n.ljc-picker-disabled .ljc-picker-suffix-icon {\n  color: #c9cdd4;\n}\n.ljc-picker-size-mini {\n  height: 24px;\n}\n.ljc-picker-size-mini input {\n  font-size: 12px;\n}\n.ljc-picker-size-small {\n  height: 28px;\n}\n.ljc-picker-size-small input {\n  font-size: 14px;\n}\n.ljc-picker-size-medium {\n  height: 32px;\n}\n.ljc-picker-size-medium input {\n  font-size: 14px;\n}\n.ljc-picker-size-large {\n  height: 36px;\n}\n.ljc-picker-size-large input {\n  font-size: 14px;\n}\n";
  styleInject(css_248z$1);

  var css_248z = "/******** size *******/\n/******** text *******/\n/******** radius *******/\n/******** fontWeight ********/\n/******** Primary *******/\n/******** success *******/\n/******** warning *******/\n/******** danger *******/\n/******** fill *******/\n/******** borderSize *******/\n/******** 面板宽度 *******/\n.ljc-picker-container,\n.ljc-picker-range-container {\n  box-sizing: border-box;\n  min-height: 60px;\n  overflow: hidden;\n  background-color: #fff;\n  border: 1px solid #e5e6eb;\n  border-radius: 4px;\n  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);\n  -webkit-user-select: none;\n  -moz-user-select: none;\n  user-select: none;\n}\n.ljc-picker-container-shortcuts-placement-left,\n.ljc-picker-range-container-shortcuts-placement-left,\n.ljc-picker-container-shortcuts-placement-right,\n.ljc-picker-range-container-shortcuts-placement-right {\n  display: flex;\n  align-items: flex-start;\n}\n.ljc-picker-container-shortcuts-placement-left > .ljc-picker-shortcuts,\n.ljc-picker-range-container-shortcuts-placement-left > .ljc-picker-shortcuts,\n.ljc-picker-container-shortcuts-placement-right > .ljc-picker-shortcuts,\n.ljc-picker-range-container-shortcuts-placement-right > .ljc-picker-shortcuts {\n  display: flex;\n  flex-direction: column;\n  box-sizing: border-box;\n  padding: 5px 8px;\n  overflow-x: hidden;\n  overflow-y: auto;\n}\n.ljc-picker-container-shortcuts-placement-left > .ljc-picker-shortcuts > *,\n.ljc-picker-range-container-shortcuts-placement-left > .ljc-picker-shortcuts > *,\n.ljc-picker-container-shortcuts-placement-right > .ljc-picker-shortcuts > *,\n.ljc-picker-range-container-shortcuts-placement-right > .ljc-picker-shortcuts > * {\n  margin: 5px 0;\n}\n.ljc-picker-container-shortcuts-placement-left .ljc-picker-panel-wrapper,\n.ljc-picker-range-container-shortcuts-placement-left .ljc-picker-panel-wrapper,\n.ljc-picker-container-shortcuts-placement-left .ljc-picker-range-panel-wrapper,\n.ljc-picker-range-container-shortcuts-placement-left .ljc-picker-range-panel-wrapper {\n  border-left: 1px solid #e5e6eb;\n}\n.ljc-picker-container-shortcuts-placement-right .ljc-picker-panel-wrapper,\n.ljc-picker-range-container-shortcuts-placement-right .ljc-picker-panel-wrapper,\n.ljc-picker-container-shortcuts-placement-right .ljc-picker-range-panel-wrapper,\n.ljc-picker-range-container-shortcuts-placement-right .ljc-picker-range-panel-wrapper {\n  border-right: 1px solid #e5e6eb;\n}\n.ljc-picker-panel-only,\n.ljc-picker-range-panel-only {\n  box-shadow: none;\n}\n.ljc-picker-panel-only .ljc-panel-date-inner,\n.ljc-picker-range-panel-only .ljc-panel-date-inner {\n  width: 100%;\n}\n.ljc-picker-range-panel-only .ljc-panel-date {\n  width: 100%;\n}\n.ljc-picker-header {\n  display: flex;\n  padding: 8px 16px;\n  border-bottom: 1px solid #e5e6eb;\n}\n.ljc-picker-header-title {\n  flex: 1;\n  color: #1d2129;\n  font-size: 14px;\n  line-height: 24px;\n  text-align: center;\n  cursor: pointer;\n}\n.ljc-picker-header-icon {\n  width: 24px;\n  height: 24px;\n  margin-right: 2px;\n  margin-left: 2px;\n  color: #4e5969;\n  font-size: 12px;\n  line-height: 24px;\n  text-align: center;\n  background-color: #fff;\n  border-radius: 50%;\n  transition: all 0.1s cubic-bezier(0, 0, 1, 1);\n  -webkit-user-select: none;\n  user-select: none;\n}\n.ljc-picker-header-icon:not(.ljc-picker-header-icon-hidden) {\n  cursor: pointer;\n}\n.ljc-picker-header-icon:not(.ljc-picker-header-icon-hidden):hover {\n  background-color: #e5e6eb;\n}\n.ljc-picker-header-label {\n  padding: 2px;\n  border-radius: 2px;\n  cursor: pointer;\n  transition: all 0.1s;\n}\n.ljc-picker-header-label:hover {\n  background-color: #e5e6eb;\n}\n.ljc-picker-body {\n  padding: 9px 16px;\n}\n.ljc-picker-week-list {\n  display: flex;\n  box-sizing: border-box;\n  width: 100%;\n  padding: 9px 16px 0 16px;\n  font-size: 14px;\n}\n.ljc-picker-week-list-item {\n  flex: 1;\n  height: 32px;\n  padding: 0;\n  color: #7d7d7f;\n  font-weight: 400;\n  line-height: 32px;\n  text-align: center;\n}\n.ljc-picker-row {\n  display: flex;\n  padding: 2px 0;\n}\n.ljc-picker-cell {\n  flex: 1;\n}\n.ljc-picker-cell .ljc-picker-date {\n  display: flex;\n  flex-direction: column;\n  align-items: center;\n  justify-content: center;\n  box-sizing: border-box;\n  width: 100%;\n  height: 100%;\n  padding: 4px 0;\n  cursor: pointer;\n}\n.ljc-picker-date-value {\n  min-width: 24px;\n  height: 24px;\n  color: #c9cdd4;\n  font-size: 14px;\n  line-height: 24px;\n  text-align: center;\n  border-radius: 50%;\n  cursor: pointer;\n}\n.ljc-picker-date-lunar {\n  margin-top: -5px;\n  color: #c9cdd4;\n  font-size: 12px;\n  white-space: nowrap;\n  transform: scale(0.8);\n}\n.ljc-picker-cell-in-view .ljc-picker-date-value {\n  color: #1d2129;\n  font-weight: 500;\n}\n.ljc-picker-cell-in-view .ljc-picker-date-lunar {\n  color: #86909c;\n}\n.ljc-picker-cell-selected:not(.ljc-picker-cell-lunar) .ljc-picker-date-value {\n  color: #ffffff;\n  background-color: #165dff;\n  transition: background-color 0.1s cubic-bezier(0, 0, 1, 1);\n}\n.ljc-picker-cell-lunar .ljc-picker-date {\n  padding: 0;\n}\n.ljc-picker-cell-lunar:is(.ljc-picker-cell-selected) .ljc-picker-date {\n  background-color: #165dff;\n  border-radius: 4px;\n  transition: background-color 0.1s cubic-bezier(0, 0, 1, 1);\n}\n.ljc-picker-cell-lunar:is(.ljc-picker-cell-selected) .ljc-picker-date-lunar,\n.ljc-picker-cell-lunar:is(.ljc-picker-cell-selected) .ljc-picker-date-value {\n  color: #ffffff;\n}\n.ljc-picker-cell-in-view:not(.ljc-picker-cell-selected):not(.ljc-picker-cell-range-start):not( .ljc-picker-cell-range-end):not(.ljc-picker-cell-disabled):not(.ljc-picker-cell-week):not(.ljc-picker-cell-lunar) .ljc-picker-date-value:hover {\n  color: #1d2129;\n  background-color: #e5e6eb;\n}\n.ljc-picker-cell-in-view:not(.ljc-picker-cell-selected):not(.ljc-picker-cell-range-start):not( .ljc-picker-cell-range-end):not(.ljc-picker-cell-disabled):not(.ljc-picker-cell-week):is(.ljc-picker-cell-lunar) .ljc-picker-date:hover {\n  color: #1d2129;\n  background-color: #e5e6eb;\n  border-radius: 4px;\n}\n.ljc-picker-cell-today {\n  position: relative;\n}\n.ljc-picker-cell-today::after {\n  position: absolute;\n  bottom: -2px;\n  left: 50%;\n  display: block;\n  width: 4px;\n  height: 4px;\n  margin-left: -2px;\n  background-color: #165dff;\n  border-radius: 50%;\n  content: '';\n}\n.ljc-picker-cell-in-range .ljc-picker-date {\n  background-color: #e8f3ff;\n}\n.ljc-picker-cell-range-start .ljc-picker-date {\n  border-top-left-radius: 24px;\n  border-bottom-left-radius: 24px;\n}\n.ljc-picker-cell-range-end .ljc-picker-date {\n  border-top-right-radius: 24px;\n  border-bottom-right-radius: 24px;\n}\n.ljc-picker-cell-in-range-near-hover .ljc-picker-date {\n  border-radius: 0;\n}\n.ljc-picker-cell-range-start .ljc-picker-date-value,\n.ljc-picker-cell-range-end .ljc-picker-date-value {\n  color: #ffffff;\n  background-color: #165dff;\n  border-radius: 50%;\n}\n.ljc-picker-cell-hover-in-range .ljc-picker-date {\n  background-color: #e8f3ff;\n}\n.ljc-picker-cell-hover-range-start .ljc-picker-date {\n  border-radius: 24px 0 0 24px;\n}\n.ljc-picker-cell-hover-range-end .ljc-picker-date {\n  border-radius: 0 24px 24px 0;\n}\n.ljc-picker-cell-hover-range-start .ljc-picker-date-value,\n.ljc-picker-cell-hover-range-end .ljc-picker-date-value {\n  color: #1d2129;\n  background-color: #bedaff;\n  border-radius: 50%;\n}\n.ljc-picker-cell-disabled .ljc-picker-date {\n  background-color: #f7f8fa;\n  cursor: not-allowed;\n}\n.ljc-picker-cell-disabled .ljc-picker-date-value {\n  color: #c9cdd4;\n  background-color: transparent;\n  cursor: not-allowed;\n}\n.ljc-picker-footer {\n  width: min-content;\n  min-width: 100%;\n}\n.ljc-picker-footer-btn-wrapper {\n  display: flex;\n  align-items: center;\n  justify-content: space-between;\n  box-sizing: border-box;\n  padding: 3px 8px;\n  border-top: 1px solid #e5e6eb;\n}\n.ljc-picker-footer-btn-wrapper :only-child {\n  margin-left: auto;\n}\n.ljc-picker-footer-extra-wrapper {\n  box-sizing: border-box;\n  padding: 8px 24px;\n  color: #1d2129;\n  font-size: 12px;\n  border-top: 1px solid #e5e6eb;\n}\n.ljc-picker-footer-now-wrapper {\n  box-sizing: border-box;\n  height: 36px;\n  line-height: 36px;\n  text-align: center;\n  border-top: 1px solid #e5e6eb;\n}\n.ljc-picker-btn-confirm {\n  margin: 5px 0;\n}\n.ljc-picker-shortcuts {\n  flex: 1;\n}\n.ljc-picker-shortcuts > * {\n  margin: 5px 10px 5px 0;\n}\n.slide-dynamic-origin-enter-from,\n.slide-dynamic-origin-appear-from {\n  transform: scaleY(0.9);\n  transform-origin: 0 0;\n  opacity: 0;\n}\n.slide-dynamic-origin-enter-to,\n.slide-dynamic-origin-appear-to {\n  transform: scaleY(1);\n  transform-origin: 0 0;\n  opacity: 1;\n}\n.slide-dynamic-origin-enter-active,\n.slide-dynamic-origin-appear-active {\n  transition: transform 0.2s cubic-bezier(0.34, 0.69, 0.1, 1), opacity 0.2s cubic-bezier(0.34, 0.69, 0.1, 1);\n}\n.slide-dynamic-origin-leave-from {\n  transform: scaleY(1);\n  transform-origin: 0 0;\n  opacity: 1;\n}\n.slide-dynamic-origin-leave-to {\n  transform: scaleY(0.9);\n  transform-origin: 0 0;\n  opacity: 0;\n}\n.slide-dynamic-origin-leave-active {\n  transition: transform 0.2s cubic-bezier(0.34, 0.69, 0.1, 1), opacity 0.2s cubic-bezier(0.34, 0.69, 0.1, 1);\n}\n.ljc-panel-date {\n  display: flex;\n  box-sizing: border-box;\n}\n.ljc-panel-date-inner {\n  width: 265px;\n}\n.ljc-panel-date-inner .ljc-picker-body {\n  padding-top: 0;\n}\n.ljc-panel-date-timepicker {\n  display: flex;\n  flex-direction: column;\n  border-left: 1px solid #e5e6eb;\n}\n.ljc-panel-date-timepicker-title {\n  width: 100%;\n  height: 40px;\n  color: #1d2129;\n  font-weight: 400;\n  font-size: 14px;\n  line-height: 40px;\n  text-align: center;\n  border-bottom: 1px solid #e5e6eb;\n}\n.ljc-panel-date-timepicker .ljc-timepicker {\n  height: 276px;\n  padding: 0 6px;\n  overflow: hidden;\n}\n.ljc-panel-date-timepicker .ljc-timepicker-column {\n  box-sizing: border-box;\n  width: auto;\n  height: 100%;\n  padding: 0 4px;\n}\n.ljc-panel-date-timepicker .ljc-timepicker-column::-webkit-scrollbar {\n  width: 0;\n}\n.ljc-panel-date-timepicker .ljc-timepicker-column:not(:last-child) {\n  border-right: 0;\n}\n.ljc-panel-date-timepicker .ljc-timepicker ul::after {\n  height: 244px;\n}\n.ljc-panel-date-timepicker .ljc-timepicker-cell {\n  width: 36px;\n}\n.ljc-panel-date-timepicker .ljc-timepicker-cell-inner {\n  padding-left: 10px;\n}\n.ljc-panel-date-footer {\n  border-right: 1px solid #e5e6eb;\n}\n.ljc-panel-date-with-view-tabs {\n  flex-direction: column;\n  min-width: 265px;\n}\n.ljc-panel-date-with-view-tabs .ljc-panel-date-timepicker .ljc-timepicker-column {\n  flex: 1;\n}\n.ljc-panel-date-with-view-tabs .ljc-panel-date-timepicker .ljc-timepicker-column::-webkit-scrollbar {\n  width: 0;\n}\n.ljc-panel-date-with-view-tabs .ljc-panel-date-timepicker .ljc-timepicker-cell {\n  width: 100%;\n  text-align: center;\n}\n.ljc-panel-date-with-view-tabs .ljc-panel-date-timepicker .ljc-timepicker-cell-inner {\n  padding-left: 0;\n}\n.ljc-panel-date-view-tabs {\n  display: flex;\n  border-top: 1px solid #e5e6eb;\n}\n.ljc-panel-date-view-tab-pane {\n  flex: 1;\n  height: 50px;\n  color: #c9cdd4;\n  font-size: 14px;\n  line-height: 50px;\n  text-align: center;\n  border-right: 1px solid #e5e6eb;\n  cursor: pointer;\n}\n.ljc-panel-date-view-tab-pane:last-child {\n  border-right: none;\n}\n.ljc-panel-date-view-tab-pane-text {\n  margin-left: 8px;\n}\n.ljc-panel-date-view-tab-pane-active {\n  color: #1d2129;\n}\n.ljc-panel-month,\n.ljc-panel-quarter,\n.ljc-panel-year {\n  box-sizing: border-box;\n  width: 265px;\n}\n.ljc-panel-month .ljc-picker-date,\n.ljc-panel-quarter .ljc-picker-date,\n.ljc-panel-year .ljc-picker-date {\n  padding: 4px;\n}\n.ljc-panel-month .ljc-picker-date-value,\n.ljc-panel-quarter .ljc-picker-date-value,\n.ljc-panel-year .ljc-picker-date-value {\n  width: 100%;\n  border-radius: 24px;\n}\n.ljc-panel-month .ljc-picker-cell:not(.ljc-picker-cell-selected):not( .ljc-picker-cell-range-start):not(.ljc-picker-cell-range-end):not( .ljc-picker-cell-disabled):not(.ljc-picker-cell-week) .ljc-picker-date-value:hover,\n.ljc-panel-quarter .ljc-picker-cell:not(.ljc-picker-cell-selected):not( .ljc-picker-cell-range-start):not(.ljc-picker-cell-range-end):not( .ljc-picker-cell-disabled):not(.ljc-picker-cell-week) .ljc-picker-date-value:hover,\n.ljc-panel-year .ljc-picker-cell:not(.ljc-picker-cell-selected):not( .ljc-picker-cell-range-start):not(.ljc-picker-cell-range-end):not( .ljc-picker-cell-disabled):not(.ljc-picker-cell-week) .ljc-picker-date-value:hover {\n  border-radius: 24px;\n}\n.ljc-panel-year {\n  box-sizing: border-box;\n  width: 265px;\n}\n.ljc-panel-week {\n  box-sizing: border-box;\n}\n.ljc-panel-week-wrapper {\n  display: flex;\n}\n.ljc-panel-week-inner {\n  width: 298px;\n}\n.ljc-panel-week-inner .ljc-picker-body {\n  padding-top: 0;\n}\n.ljc-panel-week .ljc-picker-row-week {\n  cursor: pointer;\n}\n.ljc-panel-week .ljc-picker-row-week .ljc-picker-date-value {\n  width: 100%;\n  border-radius: 0;\n}\n.ljc-panel-week .ljc-picker-cell .ljc-picker-date {\n  border-radius: 0;\n}\n.ljc-panel-week .ljc-picker-cell:nth-child(2) .ljc-picker-date {\n  padding-left: 4px;\n  border-top-left-radius: 24px;\n  border-bottom-left-radius: 24px;\n}\n.ljc-panel-week .ljc-picker-cell:nth-child(2) .ljc-picker-date .ljc-picker-date-value {\n  border-top-left-radius: 24px;\n  border-bottom-left-radius: 24px;\n}\n.ljc-panel-week .ljc-picker-cell:nth-child(8) .ljc-picker-date {\n  padding-right: 4px;\n  border-top-right-radius: 24px;\n  border-bottom-right-radius: 24px;\n}\n.ljc-panel-week .ljc-picker-cell:nth-child(8) .ljc-picker-date .ljc-picker-date-value {\n  border-top-right-radius: 24px;\n  border-bottom-right-radius: 24px;\n}\n.ljc-panel-week .ljc-picker-row-week:hover .ljc-picker-cell:not(.ljc-picker-cell-week):not( .ljc-picker-cell-selected):not(.ljc-picker-cell-range-start):not( .ljc-picker-cell-range-end) .ljc-picker-date-value {\n  background-color: #e5e6eb;\n}\n.ljc-panel-quarter {\n  box-sizing: border-box;\n  width: 265px;\n}\n.ljc-picker-range-wrapper {\n  display: flex;\n}\n.ljc-datepicker-shortcuts-wrapper {\n  box-sizing: border-box;\n  width: 106px;\n  height: 100%;\n  max-height: 300px;\n  margin: 10px 0 0 0;\n  padding: 0;\n  overflow-y: auto;\n  list-style: none;\n}\n.ljc-datepicker-shortcuts-wrapper > li {\n  box-sizing: border-box;\n  width: 100%;\n  padding: 6px 16px;\n  cursor: pointer;\n}\n.ljc-datepicker-shortcuts-wrapper > li:hover {\n  color: #165dff;\n}\n.ljc-trigger-wrapper {\n  display: inline-block;\n}\n.ljc-trigger-popup {\n  position: absolute;\n  z-index: 1200;\n}\n.ljc-trigger-arrow {\n  position: absolute;\n  z-index: -1;\n  display: block;\n  box-sizing: border-box;\n  width: 8px;\n  height: 8px;\n  background-color: #fff;\n  content: '';\n}\n.ljc-trigger-popup[x-placement='top'] .ljc-trigger-arrow,\n.ljc-trigger-popup[x-placement='tl'] .ljc-trigger-arrow,\n.ljc-trigger-popup[x-placement='tr'] .ljc-trigger-arrow {\n  border-top: none;\n  border-left: none;\n  border-bottom-right-radius: 2px;\n}\n.ljc-trigger-popup[x-placement='bottom'] .ljc-trigger-arrow,\n.ljc-trigger-popup[x-placement='bl'] .ljc-trigger-arrow,\n.ljc-trigger-popup[x-placement='br'] .ljc-trigger-arrow {\n  border-right: none;\n  border-bottom: none;\n  border-top-left-radius: 2px;\n}\n.ljc-trigger-popup[x-placement='left'] .ljc-trigger-arrow,\n.ljc-trigger-popup[x-placement='lt'] .ljc-trigger-arrow,\n.ljc-trigger-popup[x-placement='lb'] .ljc-trigger-arrow {\n  border-bottom: none;\n  border-left: none;\n  border-top-right-radius: 2px;\n}\n.ljc-trigger-popup[x-placement='right'] .ljc-trigger-arrow,\n.ljc-trigger-popup[x-placement='rt'] .ljc-trigger-arrow,\n.ljc-trigger-popup[x-placement='rb'] .ljc-trigger-arrow {\n  border-top: none;\n  border-right: none;\n  border-bottom-left-radius: 2px;\n}\n";
  styleInject(css_248z);

  var components = [__vue_component__];

  // eslint-disable-next-line func-names
  var install = function install(Vue) {
    if (install.installed) return;
    components.map(function (component) {
      return Vue.component(component.name, component);
    });
  };

  // 判断是否是直接引入文件
  if (typeof window !== 'undefined' && window.Vue) {
    install(window.Vue);
  }
  var index = {
    install: install,
    DatePickerPro: __vue_component__
  };

  exports.DatePickerPro = __vue_component__;
  exports.default = index;
  exports.install = install;

  Object.defineProperty(exports, '__esModule', { value: true });

}));
