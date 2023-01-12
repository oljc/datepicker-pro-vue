/*!
 * datepicker-pro-vue v1.0.2
 * (c) 2022-2023 LIjiAngChen8
 * Released under the MIT License.
 */
var top = 'top';
var bottom = 'bottom';
var right = 'right';
var left = 'left';
var auto = 'auto';
var basePlacements = [top, bottom, right, left];
var start = 'start';
var end = 'end';
var clippingParents = 'clippingParents';
var viewport = 'viewport';
var popper = 'popper';
var reference = 'reference';
var variationPlacements = /*#__PURE__*/basePlacements.reduce(function (acc, placement) {
  return acc.concat([placement + "-" + start, placement + "-" + end]);
}, []);
var placements = /*#__PURE__*/[].concat(basePlacements, [auto]).reduce(function (acc, placement) {
  return acc.concat([placement, placement + "-" + start, placement + "-" + end]);
}, []); // modifiers that need to read the DOM

var beforeRead = 'beforeRead';
var read = 'read';
var afterRead = 'afterRead'; // pure-logic modifiers

var beforeMain = 'beforeMain';
var main = 'main';
var afterMain = 'afterMain'; // modifier with the purpose to write to the DOM (or write into a framework state)

var beforeWrite = 'beforeWrite';
var write = 'write';
var afterWrite = 'afterWrite';
var modifierPhases = [beforeRead, read, afterRead, beforeMain, main, afterMain, beforeWrite, write, afterWrite];

function getNodeName(element) {
  return element ? (element.nodeName || '').toLowerCase() : null;
}

function getWindow(node) {
  if (node == null) {
    return window;
  }

  if (node.toString() !== '[object Window]') {
    var ownerDocument = node.ownerDocument;
    return ownerDocument ? ownerDocument.defaultView || window : window;
  }

  return node;
}

function isElement(node) {
  var OwnElement = getWindow(node).Element;
  return node instanceof OwnElement || node instanceof Element;
}

function isHTMLElement(node) {
  var OwnElement = getWindow(node).HTMLElement;
  return node instanceof OwnElement || node instanceof HTMLElement;
}

function isShadowRoot(node) {
  // IE 11 has no ShadowRoot
  if (typeof ShadowRoot === 'undefined') {
    return false;
  }

  var OwnElement = getWindow(node).ShadowRoot;
  return node instanceof OwnElement || node instanceof ShadowRoot;
}

// and applies them to the HTMLElements such as popper and arrow

function applyStyles(_ref) {
  var state = _ref.state;
  Object.keys(state.elements).forEach(function (name) {
    var style = state.styles[name] || {};
    var attributes = state.attributes[name] || {};
    var element = state.elements[name]; // arrow is optional + virtual elements

    if (!isHTMLElement(element) || !getNodeName(element)) {
      return;
    } // Flow doesn't support to extend this property, but it's the most
    // effective way to apply styles to an HTMLElement
    // $FlowFixMe[cannot-write]


    Object.assign(element.style, style);
    Object.keys(attributes).forEach(function (name) {
      var value = attributes[name];

      if (value === false) {
        element.removeAttribute(name);
      } else {
        element.setAttribute(name, value === true ? '' : value);
      }
    });
  });
}

function effect$2(_ref2) {
  var state = _ref2.state;
  var initialStyles = {
    popper: {
      position: state.options.strategy,
      left: '0',
      top: '0',
      margin: '0'
    },
    arrow: {
      position: 'absolute'
    },
    reference: {}
  };
  Object.assign(state.elements.popper.style, initialStyles.popper);
  state.styles = initialStyles;

  if (state.elements.arrow) {
    Object.assign(state.elements.arrow.style, initialStyles.arrow);
  }

  return function () {
    Object.keys(state.elements).forEach(function (name) {
      var element = state.elements[name];
      var attributes = state.attributes[name] || {};
      var styleProperties = Object.keys(state.styles.hasOwnProperty(name) ? state.styles[name] : initialStyles[name]); // Set all values to an empty string to unset them

      var style = styleProperties.reduce(function (style, property) {
        style[property] = '';
        return style;
      }, {}); // arrow is optional + virtual elements

      if (!isHTMLElement(element) || !getNodeName(element)) {
        return;
      }

      Object.assign(element.style, style);
      Object.keys(attributes).forEach(function (attribute) {
        element.removeAttribute(attribute);
      });
    });
  };
} // eslint-disable-next-line import/no-unused-modules


var applyStyles$1 = {
  name: 'applyStyles',
  enabled: true,
  phase: 'write',
  fn: applyStyles,
  effect: effect$2,
  requires: ['computeStyles']
};

var global$1 = (typeof global !== "undefined" ? global :
  typeof self !== "undefined" ? self :
  typeof window !== "undefined" ? window : {});

// shim for using process in browser
// based off https://github.com/defunctzombie/node-process/blob/master/browser.js

function defaultSetTimout() {
    throw new Error('setTimeout has not been defined');
}
function defaultClearTimeout () {
    throw new Error('clearTimeout has not been defined');
}
var cachedSetTimeout = defaultSetTimout;
var cachedClearTimeout = defaultClearTimeout;
if (typeof global$1.setTimeout === 'function') {
    cachedSetTimeout = setTimeout;
}
if (typeof global$1.clearTimeout === 'function') {
    cachedClearTimeout = clearTimeout;
}

function runTimeout(fun) {
    if (cachedSetTimeout === setTimeout) {
        //normal enviroments in sane situations
        return setTimeout(fun, 0);
    }
    // if setTimeout wasn't available but was latter defined
    if ((cachedSetTimeout === defaultSetTimout || !cachedSetTimeout) && setTimeout) {
        cachedSetTimeout = setTimeout;
        return setTimeout(fun, 0);
    }
    try {
        // when when somebody has screwed with setTimeout but no I.E. maddness
        return cachedSetTimeout(fun, 0);
    } catch(e){
        try {
            // When we are in I.E. but the script has been evaled so I.E. doesn't trust the global object when called normally
            return cachedSetTimeout.call(null, fun, 0);
        } catch(e){
            // same as above but when it's a version of I.E. that must have the global object for 'this', hopfully our context correct otherwise it will throw a global error
            return cachedSetTimeout.call(this, fun, 0);
        }
    }


}
function runClearTimeout(marker) {
    if (cachedClearTimeout === clearTimeout) {
        //normal enviroments in sane situations
        return clearTimeout(marker);
    }
    // if clearTimeout wasn't available but was latter defined
    if ((cachedClearTimeout === defaultClearTimeout || !cachedClearTimeout) && clearTimeout) {
        cachedClearTimeout = clearTimeout;
        return clearTimeout(marker);
    }
    try {
        // when when somebody has screwed with setTimeout but no I.E. maddness
        return cachedClearTimeout(marker);
    } catch (e){
        try {
            // When we are in I.E. but the script has been evaled so I.E. doesn't  trust the global object when called normally
            return cachedClearTimeout.call(null, marker);
        } catch (e){
            // same as above but when it's a version of I.E. that must have the global object for 'this', hopfully our context correct otherwise it will throw a global error.
            // Some versions of I.E. have different rules for clearTimeout vs setTimeout
            return cachedClearTimeout.call(this, marker);
        }
    }



}
var queue = [];
var draining = false;
var currentQueue;
var queueIndex = -1;

function cleanUpNextTick() {
    if (!draining || !currentQueue) {
        return;
    }
    draining = false;
    if (currentQueue.length) {
        queue = currentQueue.concat(queue);
    } else {
        queueIndex = -1;
    }
    if (queue.length) {
        drainQueue();
    }
}

function drainQueue() {
    if (draining) {
        return;
    }
    var timeout = runTimeout(cleanUpNextTick);
    draining = true;

    var len = queue.length;
    while(len) {
        currentQueue = queue;
        queue = [];
        while (++queueIndex < len) {
            if (currentQueue) {
                currentQueue[queueIndex].run();
            }
        }
        queueIndex = -1;
        len = queue.length;
    }
    currentQueue = null;
    draining = false;
    runClearTimeout(timeout);
}
function nextTick(fun) {
    var args = new Array(arguments.length - 1);
    if (arguments.length > 1) {
        for (var i = 1; i < arguments.length; i++) {
            args[i - 1] = arguments[i];
        }
    }
    queue.push(new Item(fun, args));
    if (queue.length === 1 && !draining) {
        runTimeout(drainQueue);
    }
}
// v8 likes predictible objects
function Item(fun, array) {
    this.fun = fun;
    this.array = array;
}
Item.prototype.run = function () {
    this.fun.apply(null, this.array);
};
var title = 'browser';
var platform = 'browser';
var browser = true;
var env = {};
var argv = [];
var version = ''; // empty string to avoid regexp issues
var versions = {};
var release = {};
var config = {};

function noop() {}

var on$1 = noop;
var addListener = noop;
var once = noop;
var off$1 = noop;
var removeListener = noop;
var removeAllListeners = noop;
var emit = noop;

function binding(name) {
    throw new Error('process.binding is not supported');
}

function cwd () { return '/' }
function chdir (dir) {
    throw new Error('process.chdir is not supported');
}function umask() { return 0; }

// from https://github.com/kumavis/browser-process-hrtime/blob/master/index.js
var performance = global$1.performance || {};
var performanceNow =
  performance.now        ||
  performance.mozNow     ||
  performance.msNow      ||
  performance.oNow       ||
  performance.webkitNow  ||
  function(){ return (new Date()).getTime() };

// generate timestamp or delta
// see http://nodejs.org/api/process.html#process_process_hrtime
function hrtime(previousTimestamp){
  var clocktime = performanceNow.call(performance)*1e-3;
  var seconds = Math.floor(clocktime);
  var nanoseconds = Math.floor((clocktime%1)*1e9);
  if (previousTimestamp) {
    seconds = seconds - previousTimestamp[0];
    nanoseconds = nanoseconds - previousTimestamp[1];
    if (nanoseconds<0) {
      seconds--;
      nanoseconds += 1e9;
    }
  }
  return [seconds,nanoseconds]
}

var startTime = new Date();
function uptime() {
  var currentTime = new Date();
  var dif = currentTime - startTime;
  return dif / 1000;
}

var browser$1 = {
  nextTick: nextTick,
  title: title,
  browser: browser,
  env: env,
  argv: argv,
  version: version,
  versions: versions,
  on: on$1,
  addListener: addListener,
  once: once,
  off: off$1,
  removeListener: removeListener,
  removeAllListeners: removeAllListeners,
  emit: emit,
  binding: binding,
  cwd: cwd,
  chdir: chdir,
  umask: umask,
  hrtime: hrtime,
  platform: platform,
  release: release,
  config: config,
  uptime: uptime
};

function getBasePlacement(placement) {
  return placement.split('-')[0];
}

var max = Math.max;
var min = Math.min;
var round = Math.round;

function getUAString() {
  var uaData = navigator.userAgentData;

  if (uaData != null && uaData.brands) {
    return uaData.brands.map(function (item) {
      return item.brand + "/" + item.version;
    }).join(' ');
  }

  return navigator.userAgent;
}

function isLayoutViewport() {
  return !/^((?!chrome|android).)*safari/i.test(getUAString());
}

function getBoundingClientRect(element, includeScale, isFixedStrategy) {
  if (includeScale === void 0) {
    includeScale = false;
  }

  if (isFixedStrategy === void 0) {
    isFixedStrategy = false;
  }

  var clientRect = element.getBoundingClientRect();
  var scaleX = 1;
  var scaleY = 1;

  if (includeScale && isHTMLElement(element)) {
    scaleX = element.offsetWidth > 0 ? round(clientRect.width) / element.offsetWidth || 1 : 1;
    scaleY = element.offsetHeight > 0 ? round(clientRect.height) / element.offsetHeight || 1 : 1;
  }

  var _ref = isElement(element) ? getWindow(element) : window,
      visualViewport = _ref.visualViewport;

  var addVisualOffsets = !isLayoutViewport() && isFixedStrategy;
  var x = (clientRect.left + (addVisualOffsets && visualViewport ? visualViewport.offsetLeft : 0)) / scaleX;
  var y = (clientRect.top + (addVisualOffsets && visualViewport ? visualViewport.offsetTop : 0)) / scaleY;
  var width = clientRect.width / scaleX;
  var height = clientRect.height / scaleY;
  return {
    width: width,
    height: height,
    top: y,
    right: x + width,
    bottom: y + height,
    left: x,
    x: x,
    y: y
  };
}

// means it doesn't take into account transforms.

function getLayoutRect(element) {
  var clientRect = getBoundingClientRect(element); // Use the clientRect sizes if it's not been transformed.
  // Fixes https://github.com/popperjs/popper-core/issues/1223

  var width = element.offsetWidth;
  var height = element.offsetHeight;

  if (Math.abs(clientRect.width - width) <= 1) {
    width = clientRect.width;
  }

  if (Math.abs(clientRect.height - height) <= 1) {
    height = clientRect.height;
  }

  return {
    x: element.offsetLeft,
    y: element.offsetTop,
    width: width,
    height: height
  };
}

function contains(parent, child) {
  var rootNode = child.getRootNode && child.getRootNode(); // First, attempt with faster native method

  if (parent.contains(child)) {
    return true;
  } // then fallback to custom implementation with Shadow DOM support
  else if (rootNode && isShadowRoot(rootNode)) {
      var next = child;

      do {
        if (next && parent.isSameNode(next)) {
          return true;
        } // $FlowFixMe[prop-missing]: need a better way to handle this...


        next = next.parentNode || next.host;
      } while (next);
    } // Give up, the result is false


  return false;
}

function getComputedStyle(element) {
  return getWindow(element).getComputedStyle(element);
}

function isTableElement(element) {
  return ['table', 'td', 'th'].indexOf(getNodeName(element)) >= 0;
}

function getDocumentElement(element) {
  // $FlowFixMe[incompatible-return]: assume body is always available
  return ((isElement(element) ? element.ownerDocument : // $FlowFixMe[prop-missing]
  element.document) || window.document).documentElement;
}

function getParentNode(element) {
  if (getNodeName(element) === 'html') {
    return element;
  }

  return (// this is a quicker (but less type safe) way to save quite some bytes from the bundle
    // $FlowFixMe[incompatible-return]
    // $FlowFixMe[prop-missing]
    element.assignedSlot || // step into the shadow DOM of the parent of a slotted node
    element.parentNode || ( // DOM Element detected
    isShadowRoot(element) ? element.host : null) || // ShadowRoot detected
    // $FlowFixMe[incompatible-call]: HTMLElement is a Node
    getDocumentElement(element) // fallback

  );
}

function getTrueOffsetParent(element) {
  if (!isHTMLElement(element) || // https://github.com/popperjs/popper-core/issues/837
  getComputedStyle(element).position === 'fixed') {
    return null;
  }

  return element.offsetParent;
} // `.offsetParent` reports `null` for fixed elements, while absolute elements
// return the containing block


function getContainingBlock(element) {
  var isFirefox = /firefox/i.test(getUAString());
  var isIE = /Trident/i.test(getUAString());

  if (isIE && isHTMLElement(element)) {
    // In IE 9, 10 and 11 fixed elements containing block is always established by the viewport
    var elementCss = getComputedStyle(element);

    if (elementCss.position === 'fixed') {
      return null;
    }
  }

  var currentNode = getParentNode(element);

  if (isShadowRoot(currentNode)) {
    currentNode = currentNode.host;
  }

  while (isHTMLElement(currentNode) && ['html', 'body'].indexOf(getNodeName(currentNode)) < 0) {
    var css = getComputedStyle(currentNode); // This is non-exhaustive but covers the most common CSS properties that
    // create a containing block.
    // https://developer.mozilla.org/en-US/docs/Web/CSS/Containing_block#identifying_the_containing_block

    if (css.transform !== 'none' || css.perspective !== 'none' || css.contain === 'paint' || ['transform', 'perspective'].indexOf(css.willChange) !== -1 || isFirefox && css.willChange === 'filter' || isFirefox && css.filter && css.filter !== 'none') {
      return currentNode;
    } else {
      currentNode = currentNode.parentNode;
    }
  }

  return null;
} // Gets the closest ancestor positioned element. Handles some edge cases,
// such as table ancestors and cross browser bugs.


function getOffsetParent(element) {
  var window = getWindow(element);
  var offsetParent = getTrueOffsetParent(element);

  while (offsetParent && isTableElement(offsetParent) && getComputedStyle(offsetParent).position === 'static') {
    offsetParent = getTrueOffsetParent(offsetParent);
  }

  if (offsetParent && (getNodeName(offsetParent) === 'html' || getNodeName(offsetParent) === 'body' && getComputedStyle(offsetParent).position === 'static')) {
    return window;
  }

  return offsetParent || getContainingBlock(element) || window;
}

function getMainAxisFromPlacement(placement) {
  return ['top', 'bottom'].indexOf(placement) >= 0 ? 'x' : 'y';
}

function within(min$1, value, max$1) {
  return max(min$1, min(value, max$1));
}
function withinMaxClamp(min, value, max) {
  var v = within(min, value, max);
  return v > max ? max : v;
}

function getFreshSideObject() {
  return {
    top: 0,
    right: 0,
    bottom: 0,
    left: 0
  };
}

function mergePaddingObject(paddingObject) {
  return Object.assign({}, getFreshSideObject(), paddingObject);
}

function expandToHashMap(value, keys) {
  return keys.reduce(function (hashMap, key) {
    hashMap[key] = value;
    return hashMap;
  }, {});
}

var toPaddingObject = function toPaddingObject(padding, state) {
  padding = typeof padding === 'function' ? padding(Object.assign({}, state.rects, {
    placement: state.placement
  })) : padding;
  return mergePaddingObject(typeof padding !== 'number' ? padding : expandToHashMap(padding, basePlacements));
};

function arrow(_ref) {
  var _state$modifiersData$;

  var state = _ref.state,
      name = _ref.name,
      options = _ref.options;
  var arrowElement = state.elements.arrow;
  var popperOffsets = state.modifiersData.popperOffsets;
  var basePlacement = getBasePlacement(state.placement);
  var axis = getMainAxisFromPlacement(basePlacement);
  var isVertical = [left, right].indexOf(basePlacement) >= 0;
  var len = isVertical ? 'height' : 'width';

  if (!arrowElement || !popperOffsets) {
    return;
  }

  var paddingObject = toPaddingObject(options.padding, state);
  var arrowRect = getLayoutRect(arrowElement);
  var minProp = axis === 'y' ? top : left;
  var maxProp = axis === 'y' ? bottom : right;
  var endDiff = state.rects.reference[len] + state.rects.reference[axis] - popperOffsets[axis] - state.rects.popper[len];
  var startDiff = popperOffsets[axis] - state.rects.reference[axis];
  var arrowOffsetParent = getOffsetParent(arrowElement);
  var clientSize = arrowOffsetParent ? axis === 'y' ? arrowOffsetParent.clientHeight || 0 : arrowOffsetParent.clientWidth || 0 : 0;
  var centerToReference = endDiff / 2 - startDiff / 2; // Make sure the arrow doesn't overflow the popper if the center point is
  // outside of the popper bounds

  var min = paddingObject[minProp];
  var max = clientSize - arrowRect[len] - paddingObject[maxProp];
  var center = clientSize / 2 - arrowRect[len] / 2 + centerToReference;
  var offset = within(min, center, max); // Prevents breaking syntax highlighting...

  var axisProp = axis;
  state.modifiersData[name] = (_state$modifiersData$ = {}, _state$modifiersData$[axisProp] = offset, _state$modifiersData$.centerOffset = offset - center, _state$modifiersData$);
}

function effect$1(_ref2) {
  var state = _ref2.state,
      options = _ref2.options;
  var _options$element = options.element,
      arrowElement = _options$element === void 0 ? '[data-popper-arrow]' : _options$element;

  if (arrowElement == null) {
    return;
  } // CSS selector


  if (typeof arrowElement === 'string') {
    arrowElement = state.elements.popper.querySelector(arrowElement);

    if (!arrowElement) {
      return;
    }
  }

  if (browser$1.env.NODE_ENV !== "production") {
    if (!isHTMLElement(arrowElement)) ;
  }

  if (!contains(state.elements.popper, arrowElement)) {

    return;
  }

  state.elements.arrow = arrowElement;
} // eslint-disable-next-line import/no-unused-modules


var arrow$1 = {
  name: 'arrow',
  enabled: true,
  phase: 'main',
  fn: arrow,
  effect: effect$1,
  requires: ['popperOffsets'],
  requiresIfExists: ['preventOverflow']
};

function getVariation(placement) {
  return placement.split('-')[1];
}

var unsetSides = {
  top: 'auto',
  right: 'auto',
  bottom: 'auto',
  left: 'auto'
}; // Round the offsets to the nearest suitable subpixel based on the DPR.
// Zooming can change the DPR, but it seems to report a value that will
// cleanly divide the values into the appropriate subpixels.

function roundOffsetsByDPR(_ref) {
  var x = _ref.x,
      y = _ref.y;
  var win = window;
  var dpr = win.devicePixelRatio || 1;
  return {
    x: round(x * dpr) / dpr || 0,
    y: round(y * dpr) / dpr || 0
  };
}

function mapToStyles(_ref2) {
  var _Object$assign2;

  var popper = _ref2.popper,
      popperRect = _ref2.popperRect,
      placement = _ref2.placement,
      variation = _ref2.variation,
      offsets = _ref2.offsets,
      position = _ref2.position,
      gpuAcceleration = _ref2.gpuAcceleration,
      adaptive = _ref2.adaptive,
      roundOffsets = _ref2.roundOffsets,
      isFixed = _ref2.isFixed;
  var _offsets$x = offsets.x,
      x = _offsets$x === void 0 ? 0 : _offsets$x,
      _offsets$y = offsets.y,
      y = _offsets$y === void 0 ? 0 : _offsets$y;

  var _ref3 = typeof roundOffsets === 'function' ? roundOffsets({
    x: x,
    y: y
  }) : {
    x: x,
    y: y
  };

  x = _ref3.x;
  y = _ref3.y;
  var hasX = offsets.hasOwnProperty('x');
  var hasY = offsets.hasOwnProperty('y');
  var sideX = left;
  var sideY = top;
  var win = window;

  if (adaptive) {
    var offsetParent = getOffsetParent(popper);
    var heightProp = 'clientHeight';
    var widthProp = 'clientWidth';

    if (offsetParent === getWindow(popper)) {
      offsetParent = getDocumentElement(popper);

      if (getComputedStyle(offsetParent).position !== 'static' && position === 'absolute') {
        heightProp = 'scrollHeight';
        widthProp = 'scrollWidth';
      }
    } // $FlowFixMe[incompatible-cast]: force type refinement, we compare offsetParent with window above, but Flow doesn't detect it


    offsetParent = offsetParent;

    if (placement === top || (placement === left || placement === right) && variation === end) {
      sideY = bottom;
      var offsetY = isFixed && offsetParent === win && win.visualViewport ? win.visualViewport.height : // $FlowFixMe[prop-missing]
      offsetParent[heightProp];
      y -= offsetY - popperRect.height;
      y *= gpuAcceleration ? 1 : -1;
    }

    if (placement === left || (placement === top || placement === bottom) && variation === end) {
      sideX = right;
      var offsetX = isFixed && offsetParent === win && win.visualViewport ? win.visualViewport.width : // $FlowFixMe[prop-missing]
      offsetParent[widthProp];
      x -= offsetX - popperRect.width;
      x *= gpuAcceleration ? 1 : -1;
    }
  }

  var commonStyles = Object.assign({
    position: position
  }, adaptive && unsetSides);

  var _ref4 = roundOffsets === true ? roundOffsetsByDPR({
    x: x,
    y: y
  }) : {
    x: x,
    y: y
  };

  x = _ref4.x;
  y = _ref4.y;

  if (gpuAcceleration) {
    var _Object$assign;

    return Object.assign({}, commonStyles, (_Object$assign = {}, _Object$assign[sideY] = hasY ? '0' : '', _Object$assign[sideX] = hasX ? '0' : '', _Object$assign.transform = (win.devicePixelRatio || 1) <= 1 ? "translate(" + x + "px, " + y + "px)" : "translate3d(" + x + "px, " + y + "px, 0)", _Object$assign));
  }

  return Object.assign({}, commonStyles, (_Object$assign2 = {}, _Object$assign2[sideY] = hasY ? y + "px" : '', _Object$assign2[sideX] = hasX ? x + "px" : '', _Object$assign2.transform = '', _Object$assign2));
}

function computeStyles(_ref5) {
  var state = _ref5.state,
      options = _ref5.options;
  var _options$gpuAccelerat = options.gpuAcceleration,
      gpuAcceleration = _options$gpuAccelerat === void 0 ? true : _options$gpuAccelerat,
      _options$adaptive = options.adaptive,
      adaptive = _options$adaptive === void 0 ? true : _options$adaptive,
      _options$roundOffsets = options.roundOffsets,
      roundOffsets = _options$roundOffsets === void 0 ? true : _options$roundOffsets;

  if (browser$1.env.NODE_ENV !== "production") {
    var transitionProperty = getComputedStyle(state.elements.popper).transitionProperty || '';

    if (adaptive && ['transform', 'top', 'right', 'bottom', 'left'].some(function (property) {
      return transitionProperty.indexOf(property) >= 0;
    })) ;
  }

  var commonStyles = {
    placement: getBasePlacement(state.placement),
    variation: getVariation(state.placement),
    popper: state.elements.popper,
    popperRect: state.rects.popper,
    gpuAcceleration: gpuAcceleration,
    isFixed: state.options.strategy === 'fixed'
  };

  if (state.modifiersData.popperOffsets != null) {
    state.styles.popper = Object.assign({}, state.styles.popper, mapToStyles(Object.assign({}, commonStyles, {
      offsets: state.modifiersData.popperOffsets,
      position: state.options.strategy,
      adaptive: adaptive,
      roundOffsets: roundOffsets
    })));
  }

  if (state.modifiersData.arrow != null) {
    state.styles.arrow = Object.assign({}, state.styles.arrow, mapToStyles(Object.assign({}, commonStyles, {
      offsets: state.modifiersData.arrow,
      position: 'absolute',
      adaptive: false,
      roundOffsets: roundOffsets
    })));
  }

  state.attributes.popper = Object.assign({}, state.attributes.popper, {
    'data-popper-placement': state.placement
  });
} // eslint-disable-next-line import/no-unused-modules


var computeStyles$1 = {
  name: 'computeStyles',
  enabled: true,
  phase: 'beforeWrite',
  fn: computeStyles,
  data: {}
};

var passive = {
  passive: true
};

function effect(_ref) {
  var state = _ref.state,
      instance = _ref.instance,
      options = _ref.options;
  var _options$scroll = options.scroll,
      scroll = _options$scroll === void 0 ? true : _options$scroll,
      _options$resize = options.resize,
      resize = _options$resize === void 0 ? true : _options$resize;
  var window = getWindow(state.elements.popper);
  var scrollParents = [].concat(state.scrollParents.reference, state.scrollParents.popper);

  if (scroll) {
    scrollParents.forEach(function (scrollParent) {
      scrollParent.addEventListener('scroll', instance.update, passive);
    });
  }

  if (resize) {
    window.addEventListener('resize', instance.update, passive);
  }

  return function () {
    if (scroll) {
      scrollParents.forEach(function (scrollParent) {
        scrollParent.removeEventListener('scroll', instance.update, passive);
      });
    }

    if (resize) {
      window.removeEventListener('resize', instance.update, passive);
    }
  };
} // eslint-disable-next-line import/no-unused-modules


var eventListeners = {
  name: 'eventListeners',
  enabled: true,
  phase: 'write',
  fn: function fn() {},
  effect: effect,
  data: {}
};

var hash$1 = {
  left: 'right',
  right: 'left',
  bottom: 'top',
  top: 'bottom'
};
function getOppositePlacement(placement) {
  return placement.replace(/left|right|bottom|top/g, function (matched) {
    return hash$1[matched];
  });
}

var hash = {
  start: 'end',
  end: 'start'
};
function getOppositeVariationPlacement(placement) {
  return placement.replace(/start|end/g, function (matched) {
    return hash[matched];
  });
}

function getWindowScroll(node) {
  var win = getWindow(node);
  var scrollLeft = win.pageXOffset;
  var scrollTop = win.pageYOffset;
  return {
    scrollLeft: scrollLeft,
    scrollTop: scrollTop
  };
}

function getWindowScrollBarX(element) {
  // If <html> has a CSS width greater than the viewport, then this will be
  // incorrect for RTL.
  // Popper 1 is broken in this case and never had a bug report so let's assume
  // it's not an issue. I don't think anyone ever specifies width on <html>
  // anyway.
  // Browsers where the left scrollbar doesn't cause an issue report `0` for
  // this (e.g. Edge 2019, IE11, Safari)
  return getBoundingClientRect(getDocumentElement(element)).left + getWindowScroll(element).scrollLeft;
}

function getViewportRect(element, strategy) {
  var win = getWindow(element);
  var html = getDocumentElement(element);
  var visualViewport = win.visualViewport;
  var width = html.clientWidth;
  var height = html.clientHeight;
  var x = 0;
  var y = 0;

  if (visualViewport) {
    width = visualViewport.width;
    height = visualViewport.height;
    var layoutViewport = isLayoutViewport();

    if (layoutViewport || !layoutViewport && strategy === 'fixed') {
      x = visualViewport.offsetLeft;
      y = visualViewport.offsetTop;
    }
  }

  return {
    width: width,
    height: height,
    x: x + getWindowScrollBarX(element),
    y: y
  };
}

// of the `<html>` and `<body>` rect bounds if horizontally scrollable

function getDocumentRect(element) {
  var _element$ownerDocumen;

  var html = getDocumentElement(element);
  var winScroll = getWindowScroll(element);
  var body = (_element$ownerDocumen = element.ownerDocument) == null ? void 0 : _element$ownerDocumen.body;
  var width = max(html.scrollWidth, html.clientWidth, body ? body.scrollWidth : 0, body ? body.clientWidth : 0);
  var height = max(html.scrollHeight, html.clientHeight, body ? body.scrollHeight : 0, body ? body.clientHeight : 0);
  var x = -winScroll.scrollLeft + getWindowScrollBarX(element);
  var y = -winScroll.scrollTop;

  if (getComputedStyle(body || html).direction === 'rtl') {
    x += max(html.clientWidth, body ? body.clientWidth : 0) - width;
  }

  return {
    width: width,
    height: height,
    x: x,
    y: y
  };
}

function isScrollParent(element) {
  // Firefox wants us to check `-x` and `-y` variations as well
  var _getComputedStyle = getComputedStyle(element),
      overflow = _getComputedStyle.overflow,
      overflowX = _getComputedStyle.overflowX,
      overflowY = _getComputedStyle.overflowY;

  return /auto|scroll|overlay|hidden/.test(overflow + overflowY + overflowX);
}

function getScrollParent(node) {
  if (['html', 'body', '#document'].indexOf(getNodeName(node)) >= 0) {
    // $FlowFixMe[incompatible-return]: assume body is always available
    return node.ownerDocument.body;
  }

  if (isHTMLElement(node) && isScrollParent(node)) {
    return node;
  }

  return getScrollParent(getParentNode(node));
}

/*
given a DOM element, return the list of all scroll parents, up the list of ancesors
until we get to the top window object. This list is what we attach scroll listeners
to, because if any of these parent elements scroll, we'll need to re-calculate the
reference element's position.
*/

function listScrollParents(element, list) {
  var _element$ownerDocumen;

  if (list === void 0) {
    list = [];
  }

  var scrollParent = getScrollParent(element);
  var isBody = scrollParent === ((_element$ownerDocumen = element.ownerDocument) == null ? void 0 : _element$ownerDocumen.body);
  var win = getWindow(scrollParent);
  var target = isBody ? [win].concat(win.visualViewport || [], isScrollParent(scrollParent) ? scrollParent : []) : scrollParent;
  var updatedList = list.concat(target);
  return isBody ? updatedList : // $FlowFixMe[incompatible-call]: isBody tells us target will be an HTMLElement here
  updatedList.concat(listScrollParents(getParentNode(target)));
}

function rectToClientRect(rect) {
  return Object.assign({}, rect, {
    left: rect.x,
    top: rect.y,
    right: rect.x + rect.width,
    bottom: rect.y + rect.height
  });
}

function getInnerBoundingClientRect(element, strategy) {
  var rect = getBoundingClientRect(element, false, strategy === 'fixed');
  rect.top = rect.top + element.clientTop;
  rect.left = rect.left + element.clientLeft;
  rect.bottom = rect.top + element.clientHeight;
  rect.right = rect.left + element.clientWidth;
  rect.width = element.clientWidth;
  rect.height = element.clientHeight;
  rect.x = rect.left;
  rect.y = rect.top;
  return rect;
}

function getClientRectFromMixedType(element, clippingParent, strategy) {
  return clippingParent === viewport ? rectToClientRect(getViewportRect(element, strategy)) : isElement(clippingParent) ? getInnerBoundingClientRect(clippingParent, strategy) : rectToClientRect(getDocumentRect(getDocumentElement(element)));
} // A "clipping parent" is an overflowable container with the characteristic of
// clipping (or hiding) overflowing elements with a position different from
// `initial`


function getClippingParents(element) {
  var clippingParents = listScrollParents(getParentNode(element));
  var canEscapeClipping = ['absolute', 'fixed'].indexOf(getComputedStyle(element).position) >= 0;
  var clipperElement = canEscapeClipping && isHTMLElement(element) ? getOffsetParent(element) : element;

  if (!isElement(clipperElement)) {
    return [];
  } // $FlowFixMe[incompatible-return]: https://github.com/facebook/flow/issues/1414


  return clippingParents.filter(function (clippingParent) {
    return isElement(clippingParent) && contains(clippingParent, clipperElement) && getNodeName(clippingParent) !== 'body';
  });
} // Gets the maximum area that the element is visible in due to any number of
// clipping parents


function getClippingRect(element, boundary, rootBoundary, strategy) {
  var mainClippingParents = boundary === 'clippingParents' ? getClippingParents(element) : [].concat(boundary);
  var clippingParents = [].concat(mainClippingParents, [rootBoundary]);
  var firstClippingParent = clippingParents[0];
  var clippingRect = clippingParents.reduce(function (accRect, clippingParent) {
    var rect = getClientRectFromMixedType(element, clippingParent, strategy);
    accRect.top = max(rect.top, accRect.top);
    accRect.right = min(rect.right, accRect.right);
    accRect.bottom = min(rect.bottom, accRect.bottom);
    accRect.left = max(rect.left, accRect.left);
    return accRect;
  }, getClientRectFromMixedType(element, firstClippingParent, strategy));
  clippingRect.width = clippingRect.right - clippingRect.left;
  clippingRect.height = clippingRect.bottom - clippingRect.top;
  clippingRect.x = clippingRect.left;
  clippingRect.y = clippingRect.top;
  return clippingRect;
}

function computeOffsets(_ref) {
  var reference = _ref.reference,
      element = _ref.element,
      placement = _ref.placement;
  var basePlacement = placement ? getBasePlacement(placement) : null;
  var variation = placement ? getVariation(placement) : null;
  var commonX = reference.x + reference.width / 2 - element.width / 2;
  var commonY = reference.y + reference.height / 2 - element.height / 2;
  var offsets;

  switch (basePlacement) {
    case top:
      offsets = {
        x: commonX,
        y: reference.y - element.height
      };
      break;

    case bottom:
      offsets = {
        x: commonX,
        y: reference.y + reference.height
      };
      break;

    case right:
      offsets = {
        x: reference.x + reference.width,
        y: commonY
      };
      break;

    case left:
      offsets = {
        x: reference.x - element.width,
        y: commonY
      };
      break;

    default:
      offsets = {
        x: reference.x,
        y: reference.y
      };
  }

  var mainAxis = basePlacement ? getMainAxisFromPlacement(basePlacement) : null;

  if (mainAxis != null) {
    var len = mainAxis === 'y' ? 'height' : 'width';

    switch (variation) {
      case start:
        offsets[mainAxis] = offsets[mainAxis] - (reference[len] / 2 - element[len] / 2);
        break;

      case end:
        offsets[mainAxis] = offsets[mainAxis] + (reference[len] / 2 - element[len] / 2);
        break;
    }
  }

  return offsets;
}

function detectOverflow(state, options) {
  if (options === void 0) {
    options = {};
  }

  var _options = options,
      _options$placement = _options.placement,
      placement = _options$placement === void 0 ? state.placement : _options$placement,
      _options$strategy = _options.strategy,
      strategy = _options$strategy === void 0 ? state.strategy : _options$strategy,
      _options$boundary = _options.boundary,
      boundary = _options$boundary === void 0 ? clippingParents : _options$boundary,
      _options$rootBoundary = _options.rootBoundary,
      rootBoundary = _options$rootBoundary === void 0 ? viewport : _options$rootBoundary,
      _options$elementConte = _options.elementContext,
      elementContext = _options$elementConte === void 0 ? popper : _options$elementConte,
      _options$altBoundary = _options.altBoundary,
      altBoundary = _options$altBoundary === void 0 ? false : _options$altBoundary,
      _options$padding = _options.padding,
      padding = _options$padding === void 0 ? 0 : _options$padding;
  var paddingObject = mergePaddingObject(typeof padding !== 'number' ? padding : expandToHashMap(padding, basePlacements));
  var altContext = elementContext === popper ? reference : popper;
  var popperRect = state.rects.popper;
  var element = state.elements[altBoundary ? altContext : elementContext];
  var clippingClientRect = getClippingRect(isElement(element) ? element : element.contextElement || getDocumentElement(state.elements.popper), boundary, rootBoundary, strategy);
  var referenceClientRect = getBoundingClientRect(state.elements.reference);
  var popperOffsets = computeOffsets({
    reference: referenceClientRect,
    element: popperRect,
    strategy: 'absolute',
    placement: placement
  });
  var popperClientRect = rectToClientRect(Object.assign({}, popperRect, popperOffsets));
  var elementClientRect = elementContext === popper ? popperClientRect : referenceClientRect; // positive = overflowing the clipping rect
  // 0 or negative = within the clipping rect

  var overflowOffsets = {
    top: clippingClientRect.top - elementClientRect.top + paddingObject.top,
    bottom: elementClientRect.bottom - clippingClientRect.bottom + paddingObject.bottom,
    left: clippingClientRect.left - elementClientRect.left + paddingObject.left,
    right: elementClientRect.right - clippingClientRect.right + paddingObject.right
  };
  var offsetData = state.modifiersData.offset; // Offsets can be applied only to the popper element

  if (elementContext === popper && offsetData) {
    var offset = offsetData[placement];
    Object.keys(overflowOffsets).forEach(function (key) {
      var multiply = [right, bottom].indexOf(key) >= 0 ? 1 : -1;
      var axis = [top, bottom].indexOf(key) >= 0 ? 'y' : 'x';
      overflowOffsets[key] += offset[axis] * multiply;
    });
  }

  return overflowOffsets;
}

function computeAutoPlacement(state, options) {
  if (options === void 0) {
    options = {};
  }

  var _options = options,
      placement = _options.placement,
      boundary = _options.boundary,
      rootBoundary = _options.rootBoundary,
      padding = _options.padding,
      flipVariations = _options.flipVariations,
      _options$allowedAutoP = _options.allowedAutoPlacements,
      allowedAutoPlacements = _options$allowedAutoP === void 0 ? placements : _options$allowedAutoP;
  var variation = getVariation(placement);
  var placements$1 = variation ? flipVariations ? variationPlacements : variationPlacements.filter(function (placement) {
    return getVariation(placement) === variation;
  }) : basePlacements;
  var allowedPlacements = placements$1.filter(function (placement) {
    return allowedAutoPlacements.indexOf(placement) >= 0;
  });

  if (allowedPlacements.length === 0) {
    allowedPlacements = placements$1;
  } // $FlowFixMe[incompatible-type]: Flow seems to have problems with two array unions...


  var overflows = allowedPlacements.reduce(function (acc, placement) {
    acc[placement] = detectOverflow(state, {
      placement: placement,
      boundary: boundary,
      rootBoundary: rootBoundary,
      padding: padding
    })[getBasePlacement(placement)];
    return acc;
  }, {});
  return Object.keys(overflows).sort(function (a, b) {
    return overflows[a] - overflows[b];
  });
}

function getExpandedFallbackPlacements(placement) {
  if (getBasePlacement(placement) === auto) {
    return [];
  }

  var oppositePlacement = getOppositePlacement(placement);
  return [getOppositeVariationPlacement(placement), oppositePlacement, getOppositeVariationPlacement(oppositePlacement)];
}

function flip(_ref) {
  var state = _ref.state,
      options = _ref.options,
      name = _ref.name;

  if (state.modifiersData[name]._skip) {
    return;
  }

  var _options$mainAxis = options.mainAxis,
      checkMainAxis = _options$mainAxis === void 0 ? true : _options$mainAxis,
      _options$altAxis = options.altAxis,
      checkAltAxis = _options$altAxis === void 0 ? true : _options$altAxis,
      specifiedFallbackPlacements = options.fallbackPlacements,
      padding = options.padding,
      boundary = options.boundary,
      rootBoundary = options.rootBoundary,
      altBoundary = options.altBoundary,
      _options$flipVariatio = options.flipVariations,
      flipVariations = _options$flipVariatio === void 0 ? true : _options$flipVariatio,
      allowedAutoPlacements = options.allowedAutoPlacements;
  var preferredPlacement = state.options.placement;
  var basePlacement = getBasePlacement(preferredPlacement);
  var isBasePlacement = basePlacement === preferredPlacement;
  var fallbackPlacements = specifiedFallbackPlacements || (isBasePlacement || !flipVariations ? [getOppositePlacement(preferredPlacement)] : getExpandedFallbackPlacements(preferredPlacement));
  var placements = [preferredPlacement].concat(fallbackPlacements).reduce(function (acc, placement) {
    return acc.concat(getBasePlacement(placement) === auto ? computeAutoPlacement(state, {
      placement: placement,
      boundary: boundary,
      rootBoundary: rootBoundary,
      padding: padding,
      flipVariations: flipVariations,
      allowedAutoPlacements: allowedAutoPlacements
    }) : placement);
  }, []);
  var referenceRect = state.rects.reference;
  var popperRect = state.rects.popper;
  var checksMap = new Map();
  var makeFallbackChecks = true;
  var firstFittingPlacement = placements[0];

  for (var i = 0; i < placements.length; i++) {
    var placement = placements[i];

    var _basePlacement = getBasePlacement(placement);

    var isStartVariation = getVariation(placement) === start;
    var isVertical = [top, bottom].indexOf(_basePlacement) >= 0;
    var len = isVertical ? 'width' : 'height';
    var overflow = detectOverflow(state, {
      placement: placement,
      boundary: boundary,
      rootBoundary: rootBoundary,
      altBoundary: altBoundary,
      padding: padding
    });
    var mainVariationSide = isVertical ? isStartVariation ? right : left : isStartVariation ? bottom : top;

    if (referenceRect[len] > popperRect[len]) {
      mainVariationSide = getOppositePlacement(mainVariationSide);
    }

    var altVariationSide = getOppositePlacement(mainVariationSide);
    var checks = [];

    if (checkMainAxis) {
      checks.push(overflow[_basePlacement] <= 0);
    }

    if (checkAltAxis) {
      checks.push(overflow[mainVariationSide] <= 0, overflow[altVariationSide] <= 0);
    }

    if (checks.every(function (check) {
      return check;
    })) {
      firstFittingPlacement = placement;
      makeFallbackChecks = false;
      break;
    }

    checksMap.set(placement, checks);
  }

  if (makeFallbackChecks) {
    // `2` may be desired in some cases – research later
    var numberOfChecks = flipVariations ? 3 : 1;

    var _loop = function _loop(_i) {
      var fittingPlacement = placements.find(function (placement) {
        var checks = checksMap.get(placement);

        if (checks) {
          return checks.slice(0, _i).every(function (check) {
            return check;
          });
        }
      });

      if (fittingPlacement) {
        firstFittingPlacement = fittingPlacement;
        return "break";
      }
    };

    for (var _i = numberOfChecks; _i > 0; _i--) {
      var _ret = _loop(_i);

      if (_ret === "break") break;
    }
  }

  if (state.placement !== firstFittingPlacement) {
    state.modifiersData[name]._skip = true;
    state.placement = firstFittingPlacement;
    state.reset = true;
  }
} // eslint-disable-next-line import/no-unused-modules


var flip$1 = {
  name: 'flip',
  enabled: true,
  phase: 'main',
  fn: flip,
  requiresIfExists: ['offset'],
  data: {
    _skip: false
  }
};

function getSideOffsets(overflow, rect, preventedOffsets) {
  if (preventedOffsets === void 0) {
    preventedOffsets = {
      x: 0,
      y: 0
    };
  }

  return {
    top: overflow.top - rect.height - preventedOffsets.y,
    right: overflow.right - rect.width + preventedOffsets.x,
    bottom: overflow.bottom - rect.height + preventedOffsets.y,
    left: overflow.left - rect.width - preventedOffsets.x
  };
}

function isAnySideFullyClipped(overflow) {
  return [top, right, bottom, left].some(function (side) {
    return overflow[side] >= 0;
  });
}

function hide(_ref) {
  var state = _ref.state,
      name = _ref.name;
  var referenceRect = state.rects.reference;
  var popperRect = state.rects.popper;
  var preventedOffsets = state.modifiersData.preventOverflow;
  var referenceOverflow = detectOverflow(state, {
    elementContext: 'reference'
  });
  var popperAltOverflow = detectOverflow(state, {
    altBoundary: true
  });
  var referenceClippingOffsets = getSideOffsets(referenceOverflow, referenceRect);
  var popperEscapeOffsets = getSideOffsets(popperAltOverflow, popperRect, preventedOffsets);
  var isReferenceHidden = isAnySideFullyClipped(referenceClippingOffsets);
  var hasPopperEscaped = isAnySideFullyClipped(popperEscapeOffsets);
  state.modifiersData[name] = {
    referenceClippingOffsets: referenceClippingOffsets,
    popperEscapeOffsets: popperEscapeOffsets,
    isReferenceHidden: isReferenceHidden,
    hasPopperEscaped: hasPopperEscaped
  };
  state.attributes.popper = Object.assign({}, state.attributes.popper, {
    'data-popper-reference-hidden': isReferenceHidden,
    'data-popper-escaped': hasPopperEscaped
  });
} // eslint-disable-next-line import/no-unused-modules


var hide$1 = {
  name: 'hide',
  enabled: true,
  phase: 'main',
  requiresIfExists: ['preventOverflow'],
  fn: hide
};

function distanceAndSkiddingToXY(placement, rects, offset) {
  var basePlacement = getBasePlacement(placement);
  var invertDistance = [left, top].indexOf(basePlacement) >= 0 ? -1 : 1;

  var _ref = typeof offset === 'function' ? offset(Object.assign({}, rects, {
    placement: placement
  })) : offset,
      skidding = _ref[0],
      distance = _ref[1];

  skidding = skidding || 0;
  distance = (distance || 0) * invertDistance;
  return [left, right].indexOf(basePlacement) >= 0 ? {
    x: distance,
    y: skidding
  } : {
    x: skidding,
    y: distance
  };
}

function offset(_ref2) {
  var state = _ref2.state,
      options = _ref2.options,
      name = _ref2.name;
  var _options$offset = options.offset,
      offset = _options$offset === void 0 ? [0, 0] : _options$offset;
  var data = placements.reduce(function (acc, placement) {
    acc[placement] = distanceAndSkiddingToXY(placement, state.rects, offset);
    return acc;
  }, {});
  var _data$state$placement = data[state.placement],
      x = _data$state$placement.x,
      y = _data$state$placement.y;

  if (state.modifiersData.popperOffsets != null) {
    state.modifiersData.popperOffsets.x += x;
    state.modifiersData.popperOffsets.y += y;
  }

  state.modifiersData[name] = data;
} // eslint-disable-next-line import/no-unused-modules


var offset$1 = {
  name: 'offset',
  enabled: true,
  phase: 'main',
  requires: ['popperOffsets'],
  fn: offset
};

function popperOffsets(_ref) {
  var state = _ref.state,
      name = _ref.name;
  // Offsets are the actual position the popper needs to have to be
  // properly positioned near its reference element
  // This is the most basic placement, and will be adjusted by
  // the modifiers in the next step
  state.modifiersData[name] = computeOffsets({
    reference: state.rects.reference,
    element: state.rects.popper,
    strategy: 'absolute',
    placement: state.placement
  });
} // eslint-disable-next-line import/no-unused-modules


var popperOffsets$1 = {
  name: 'popperOffsets',
  enabled: true,
  phase: 'read',
  fn: popperOffsets,
  data: {}
};

function getAltAxis(axis) {
  return axis === 'x' ? 'y' : 'x';
}

function preventOverflow(_ref) {
  var state = _ref.state,
      options = _ref.options,
      name = _ref.name;
  var _options$mainAxis = options.mainAxis,
      checkMainAxis = _options$mainAxis === void 0 ? true : _options$mainAxis,
      _options$altAxis = options.altAxis,
      checkAltAxis = _options$altAxis === void 0 ? false : _options$altAxis,
      boundary = options.boundary,
      rootBoundary = options.rootBoundary,
      altBoundary = options.altBoundary,
      padding = options.padding,
      _options$tether = options.tether,
      tether = _options$tether === void 0 ? true : _options$tether,
      _options$tetherOffset = options.tetherOffset,
      tetherOffset = _options$tetherOffset === void 0 ? 0 : _options$tetherOffset;
  var overflow = detectOverflow(state, {
    boundary: boundary,
    rootBoundary: rootBoundary,
    padding: padding,
    altBoundary: altBoundary
  });
  var basePlacement = getBasePlacement(state.placement);
  var variation = getVariation(state.placement);
  var isBasePlacement = !variation;
  var mainAxis = getMainAxisFromPlacement(basePlacement);
  var altAxis = getAltAxis(mainAxis);
  var popperOffsets = state.modifiersData.popperOffsets;
  var referenceRect = state.rects.reference;
  var popperRect = state.rects.popper;
  var tetherOffsetValue = typeof tetherOffset === 'function' ? tetherOffset(Object.assign({}, state.rects, {
    placement: state.placement
  })) : tetherOffset;
  var normalizedTetherOffsetValue = typeof tetherOffsetValue === 'number' ? {
    mainAxis: tetherOffsetValue,
    altAxis: tetherOffsetValue
  } : Object.assign({
    mainAxis: 0,
    altAxis: 0
  }, tetherOffsetValue);
  var offsetModifierState = state.modifiersData.offset ? state.modifiersData.offset[state.placement] : null;
  var data = {
    x: 0,
    y: 0
  };

  if (!popperOffsets) {
    return;
  }

  if (checkMainAxis) {
    var _offsetModifierState$;

    var mainSide = mainAxis === 'y' ? top : left;
    var altSide = mainAxis === 'y' ? bottom : right;
    var len = mainAxis === 'y' ? 'height' : 'width';
    var offset = popperOffsets[mainAxis];
    var min$1 = offset + overflow[mainSide];
    var max$1 = offset - overflow[altSide];
    var additive = tether ? -popperRect[len] / 2 : 0;
    var minLen = variation === start ? referenceRect[len] : popperRect[len];
    var maxLen = variation === start ? -popperRect[len] : -referenceRect[len]; // We need to include the arrow in the calculation so the arrow doesn't go
    // outside the reference bounds

    var arrowElement = state.elements.arrow;
    var arrowRect = tether && arrowElement ? getLayoutRect(arrowElement) : {
      width: 0,
      height: 0
    };
    var arrowPaddingObject = state.modifiersData['arrow#persistent'] ? state.modifiersData['arrow#persistent'].padding : getFreshSideObject();
    var arrowPaddingMin = arrowPaddingObject[mainSide];
    var arrowPaddingMax = arrowPaddingObject[altSide]; // If the reference length is smaller than the arrow length, we don't want
    // to include its full size in the calculation. If the reference is small
    // and near the edge of a boundary, the popper can overflow even if the
    // reference is not overflowing as well (e.g. virtual elements with no
    // width or height)

    var arrowLen = within(0, referenceRect[len], arrowRect[len]);
    var minOffset = isBasePlacement ? referenceRect[len] / 2 - additive - arrowLen - arrowPaddingMin - normalizedTetherOffsetValue.mainAxis : minLen - arrowLen - arrowPaddingMin - normalizedTetherOffsetValue.mainAxis;
    var maxOffset = isBasePlacement ? -referenceRect[len] / 2 + additive + arrowLen + arrowPaddingMax + normalizedTetherOffsetValue.mainAxis : maxLen + arrowLen + arrowPaddingMax + normalizedTetherOffsetValue.mainAxis;
    var arrowOffsetParent = state.elements.arrow && getOffsetParent(state.elements.arrow);
    var clientOffset = arrowOffsetParent ? mainAxis === 'y' ? arrowOffsetParent.clientTop || 0 : arrowOffsetParent.clientLeft || 0 : 0;
    var offsetModifierValue = (_offsetModifierState$ = offsetModifierState == null ? void 0 : offsetModifierState[mainAxis]) != null ? _offsetModifierState$ : 0;
    var tetherMin = offset + minOffset - offsetModifierValue - clientOffset;
    var tetherMax = offset + maxOffset - offsetModifierValue;
    var preventedOffset = within(tether ? min(min$1, tetherMin) : min$1, offset, tether ? max(max$1, tetherMax) : max$1);
    popperOffsets[mainAxis] = preventedOffset;
    data[mainAxis] = preventedOffset - offset;
  }

  if (checkAltAxis) {
    var _offsetModifierState$2;

    var _mainSide = mainAxis === 'x' ? top : left;

    var _altSide = mainAxis === 'x' ? bottom : right;

    var _offset = popperOffsets[altAxis];

    var _len = altAxis === 'y' ? 'height' : 'width';

    var _min = _offset + overflow[_mainSide];

    var _max = _offset - overflow[_altSide];

    var isOriginSide = [top, left].indexOf(basePlacement) !== -1;

    var _offsetModifierValue = (_offsetModifierState$2 = offsetModifierState == null ? void 0 : offsetModifierState[altAxis]) != null ? _offsetModifierState$2 : 0;

    var _tetherMin = isOriginSide ? _min : _offset - referenceRect[_len] - popperRect[_len] - _offsetModifierValue + normalizedTetherOffsetValue.altAxis;

    var _tetherMax = isOriginSide ? _offset + referenceRect[_len] + popperRect[_len] - _offsetModifierValue - normalizedTetherOffsetValue.altAxis : _max;

    var _preventedOffset = tether && isOriginSide ? withinMaxClamp(_tetherMin, _offset, _tetherMax) : within(tether ? _tetherMin : _min, _offset, tether ? _tetherMax : _max);

    popperOffsets[altAxis] = _preventedOffset;
    data[altAxis] = _preventedOffset - _offset;
  }

  state.modifiersData[name] = data;
} // eslint-disable-next-line import/no-unused-modules


var preventOverflow$1 = {
  name: 'preventOverflow',
  enabled: true,
  phase: 'main',
  fn: preventOverflow,
  requiresIfExists: ['offset']
};

function getHTMLElementScroll(element) {
  return {
    scrollLeft: element.scrollLeft,
    scrollTop: element.scrollTop
  };
}

function getNodeScroll(node) {
  if (node === getWindow(node) || !isHTMLElement(node)) {
    return getWindowScroll(node);
  } else {
    return getHTMLElementScroll(node);
  }
}

function isElementScaled(element) {
  var rect = element.getBoundingClientRect();
  var scaleX = round(rect.width) / element.offsetWidth || 1;
  var scaleY = round(rect.height) / element.offsetHeight || 1;
  return scaleX !== 1 || scaleY !== 1;
} // Returns the composite rect of an element relative to its offsetParent.
// Composite means it takes into account transforms as well as layout.


function getCompositeRect(elementOrVirtualElement, offsetParent, isFixed) {
  if (isFixed === void 0) {
    isFixed = false;
  }

  var isOffsetParentAnElement = isHTMLElement(offsetParent);
  var offsetParentIsScaled = isHTMLElement(offsetParent) && isElementScaled(offsetParent);
  var documentElement = getDocumentElement(offsetParent);
  var rect = getBoundingClientRect(elementOrVirtualElement, offsetParentIsScaled, isFixed);
  var scroll = {
    scrollLeft: 0,
    scrollTop: 0
  };
  var offsets = {
    x: 0,
    y: 0
  };

  if (isOffsetParentAnElement || !isOffsetParentAnElement && !isFixed) {
    if (getNodeName(offsetParent) !== 'body' || // https://github.com/popperjs/popper-core/issues/1078
    isScrollParent(documentElement)) {
      scroll = getNodeScroll(offsetParent);
    }

    if (isHTMLElement(offsetParent)) {
      offsets = getBoundingClientRect(offsetParent, true);
      offsets.x += offsetParent.clientLeft;
      offsets.y += offsetParent.clientTop;
    } else if (documentElement) {
      offsets.x = getWindowScrollBarX(documentElement);
    }
  }

  return {
    x: rect.left + scroll.scrollLeft - offsets.x,
    y: rect.top + scroll.scrollTop - offsets.y,
    width: rect.width,
    height: rect.height
  };
}

function order(modifiers) {
  var map = new Map();
  var visited = new Set();
  var result = [];
  modifiers.forEach(function (modifier) {
    map.set(modifier.name, modifier);
  }); // On visiting object, check for its dependencies and visit them recursively

  function sort(modifier) {
    visited.add(modifier.name);
    var requires = [].concat(modifier.requires || [], modifier.requiresIfExists || []);
    requires.forEach(function (dep) {
      if (!visited.has(dep)) {
        var depModifier = map.get(dep);

        if (depModifier) {
          sort(depModifier);
        }
      }
    });
    result.push(modifier);
  }

  modifiers.forEach(function (modifier) {
    if (!visited.has(modifier.name)) {
      // check for visited object
      sort(modifier);
    }
  });
  return result;
}

function orderModifiers(modifiers) {
  // order based on dependencies
  var orderedModifiers = order(modifiers); // order based on phase

  return modifierPhases.reduce(function (acc, phase) {
    return acc.concat(orderedModifiers.filter(function (modifier) {
      return modifier.phase === phase;
    }));
  }, []);
}

function debounce(fn) {
  var pending;
  return function () {
    if (!pending) {
      pending = new Promise(function (resolve) {
        Promise.resolve().then(function () {
          pending = undefined;
          resolve(fn());
        });
      });
    }

    return pending;
  };
}

var VALID_PROPERTIES = ['name', 'enabled', 'phase', 'fn', 'effect', 'requires', 'options'];
function validateModifiers(modifiers) {
  modifiers.forEach(function (modifier) {
    [].concat(Object.keys(modifier), VALID_PROPERTIES) // IE11-compatible replacement for `new Set(iterable)`
    .filter(function (value, index, self) {
      return self.indexOf(value) === index;
    }).forEach(function (key) {
      switch (key) {
        case 'name':
          if (typeof modifier.name !== 'string') ;

          break;

        case 'enabled':
          if (typeof modifier.enabled !== 'boolean') ;

          break;

        case 'phase':
          if (modifierPhases.indexOf(modifier.phase) < 0) ;

          break;

        case 'fn':
          if (typeof modifier.fn !== 'function') ;

          break;

        case 'effect':
          if (modifier.effect != null && typeof modifier.effect !== 'function') ;

          break;

        case 'requires':
          if (modifier.requires != null && !Array.isArray(modifier.requires)) ;

          break;

        case 'requiresIfExists':
          if (!Array.isArray(modifier.requiresIfExists)) ;

          break;
      }

      modifier.requires && modifier.requires.forEach(function (requirement) {
        if (modifiers.find(function (mod) {
          return mod.name === requirement;
        }) == null) ;
      });
    });
  });
}

function uniqueBy(arr, fn) {
  var identifiers = new Set();
  return arr.filter(function (item) {
    var identifier = fn(item);

    if (!identifiers.has(identifier)) {
      identifiers.add(identifier);
      return true;
    }
  });
}

function mergeByName(modifiers) {
  var merged = modifiers.reduce(function (merged, current) {
    var existing = merged[current.name];
    merged[current.name] = existing ? Object.assign({}, existing, current, {
      options: Object.assign({}, existing.options, current.options),
      data: Object.assign({}, existing.data, current.data)
    }) : current;
    return merged;
  }, {}); // IE11 does not support Object.values

  return Object.keys(merged).map(function (key) {
    return merged[key];
  });
}

var DEFAULT_OPTIONS = {
  placement: 'bottom',
  modifiers: [],
  strategy: 'absolute'
};

function areValidElements() {
  for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
    args[_key] = arguments[_key];
  }

  return !args.some(function (element) {
    return !(element && typeof element.getBoundingClientRect === 'function');
  });
}

function popperGenerator(generatorOptions) {
  if (generatorOptions === void 0) {
    generatorOptions = {};
  }

  var _generatorOptions = generatorOptions,
      _generatorOptions$def = _generatorOptions.defaultModifiers,
      defaultModifiers = _generatorOptions$def === void 0 ? [] : _generatorOptions$def,
      _generatorOptions$def2 = _generatorOptions.defaultOptions,
      defaultOptions = _generatorOptions$def2 === void 0 ? DEFAULT_OPTIONS : _generatorOptions$def2;
  return function createPopper(reference, popper, options) {
    if (options === void 0) {
      options = defaultOptions;
    }

    var state = {
      placement: 'bottom',
      orderedModifiers: [],
      options: Object.assign({}, DEFAULT_OPTIONS, defaultOptions),
      modifiersData: {},
      elements: {
        reference: reference,
        popper: popper
      },
      attributes: {},
      styles: {}
    };
    var effectCleanupFns = [];
    var isDestroyed = false;
    var instance = {
      state: state,
      setOptions: function setOptions(setOptionsAction) {
        var options = typeof setOptionsAction === 'function' ? setOptionsAction(state.options) : setOptionsAction;
        cleanupModifierEffects();
        state.options = Object.assign({}, defaultOptions, state.options, options);
        state.scrollParents = {
          reference: isElement(reference) ? listScrollParents(reference) : reference.contextElement ? listScrollParents(reference.contextElement) : [],
          popper: listScrollParents(popper)
        }; // Orders the modifiers based on their dependencies and `phase`
        // properties

        var orderedModifiers = orderModifiers(mergeByName([].concat(defaultModifiers, state.options.modifiers))); // Strip out disabled modifiers

        state.orderedModifiers = orderedModifiers.filter(function (m) {
          return m.enabled;
        }); // Validate the provided modifiers so that the consumer will get warned
        // if one of the modifiers is invalid for any reason

        if (browser$1.env.NODE_ENV !== "production") {
          var modifiers = uniqueBy([].concat(orderedModifiers, state.options.modifiers), function (_ref) {
            var name = _ref.name;
            return name;
          });
          validateModifiers(modifiers);

          if (getBasePlacement(state.options.placement) === auto) {
            state.orderedModifiers.find(function (_ref2) {
              var name = _ref2.name;
              return name === 'flip';
            });
          }

          var _getComputedStyle = getComputedStyle(popper);
              _getComputedStyle.marginTop;
              _getComputedStyle.marginRight;
              _getComputedStyle.marginBottom;
              _getComputedStyle.marginLeft; // We no longer take into account `margins` on the popper, and it can
        }

        runModifierEffects();
        return instance.update();
      },
      // Sync update – it will always be executed, even if not necessary. This
      // is useful for low frequency updates where sync behavior simplifies the
      // logic.
      // For high frequency updates (e.g. `resize` and `scroll` events), always
      // prefer the async Popper#update method
      forceUpdate: function forceUpdate() {
        if (isDestroyed) {
          return;
        }

        var _state$elements = state.elements,
            reference = _state$elements.reference,
            popper = _state$elements.popper; // Don't proceed if `reference` or `popper` are not valid elements
        // anymore

        if (!areValidElements(reference, popper)) {

          return;
        } // Store the reference and popper rects to be read by modifiers


        state.rects = {
          reference: getCompositeRect(reference, getOffsetParent(popper), state.options.strategy === 'fixed'),
          popper: getLayoutRect(popper)
        }; // Modifiers have the ability to reset the current update cycle. The
        // most common use case for this is the `flip` modifier changing the
        // placement, which then needs to re-run all the modifiers, because the
        // logic was previously ran for the previous placement and is therefore
        // stale/incorrect

        state.reset = false;
        state.placement = state.options.placement; // On each update cycle, the `modifiersData` property for each modifier
        // is filled with the initial data specified by the modifier. This means
        // it doesn't persist and is fresh on each update.
        // To ensure persistent data, use `${name}#persistent`

        state.orderedModifiers.forEach(function (modifier) {
          return state.modifiersData[modifier.name] = Object.assign({}, modifier.data);
        });
        var __debug_loops__ = 0;

        for (var index = 0; index < state.orderedModifiers.length; index++) {
          if (browser$1.env.NODE_ENV !== "production") {
            __debug_loops__ += 1;

            if (__debug_loops__ > 100) {
              break;
            }
          }

          if (state.reset === true) {
            state.reset = false;
            index = -1;
            continue;
          }

          var _state$orderedModifie = state.orderedModifiers[index],
              fn = _state$orderedModifie.fn,
              _state$orderedModifie2 = _state$orderedModifie.options,
              _options = _state$orderedModifie2 === void 0 ? {} : _state$orderedModifie2,
              name = _state$orderedModifie.name;

          if (typeof fn === 'function') {
            state = fn({
              state: state,
              options: _options,
              name: name,
              instance: instance
            }) || state;
          }
        }
      },
      // Async and optimistically optimized update – it will not be executed if
      // not necessary (debounced to run at most once-per-tick)
      update: debounce(function () {
        return new Promise(function (resolve) {
          instance.forceUpdate();
          resolve(state);
        });
      }),
      destroy: function destroy() {
        cleanupModifierEffects();
        isDestroyed = true;
      }
    };

    if (!areValidElements(reference, popper)) {
      if (browser$1.env.NODE_ENV !== "production") ;

      return instance;
    }

    instance.setOptions(options).then(function (state) {
      if (!isDestroyed && options.onFirstUpdate) {
        options.onFirstUpdate(state);
      }
    }); // Modifiers have the ability to execute arbitrary code before the first
    // update cycle runs. They will be executed in the same order as the update
    // cycle. This is useful when a modifier adds some persistent data that
    // other modifiers need to use, but the modifier is run after the dependent
    // one.

    function runModifierEffects() {
      state.orderedModifiers.forEach(function (_ref3) {
        var name = _ref3.name,
            _ref3$options = _ref3.options,
            options = _ref3$options === void 0 ? {} : _ref3$options,
            effect = _ref3.effect;

        if (typeof effect === 'function') {
          var cleanupFn = effect({
            state: state,
            name: name,
            instance: instance,
            options: options
          });

          var noopFn = function noopFn() {};

          effectCleanupFns.push(cleanupFn || noopFn);
        }
      });
    }

    function cleanupModifierEffects() {
      effectCleanupFns.forEach(function (fn) {
        return fn();
      });
      effectCleanupFns = [];
    }

    return instance;
  };
}

var defaultModifiers = [eventListeners, popperOffsets$1, computeStyles$1, applyStyles$1, offset$1, flip$1, preventOverflow$1, arrow$1, hide$1];
var createPopper = /*#__PURE__*/popperGenerator({
  defaultModifiers: defaultModifiers
}); // eslint-disable-next-line import/no-unused-modules

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
    // 弹出框是否可见
    popupVisible: {
      type: Boolean,
      default: undefined,
    },
    popupTag: {
      type: String,
      default: 'div',
    },
    // 触发方式
    trigger: {
      type: String,
      default: 'hover',
      validator: (value) =>
        ['clickToOpen', 'click', 'hover', 'focus'].indexOf(value) > -1,
    },
    // 弹窗位置
    position: {
      type: String,
      default: 'bottom',
    },
    // 弹出框是否显示箭头
    showArrow: {
      type: Boolean,
      default: false,
    },
    // 偏移
    offset: {
      type: [String, Number],
      default: 0,
    },
    // mouseenter事件延时触发的时间（毫秒）
    mouseEnterDelay: {
      type: Number,
      default: 100,
    },
    // mouseleave事件延时触发的时间（毫秒）
    mouseLeaveDelay: {
      type: Number,
      default: 100,
    },
    // 禁用
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
    // 动画
    animationName: {
      type: String,
      default: 'fade-in',
    },
    enterActiveClass: String,
    leaveActiveClass: String,
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
    // GPU渲染-低端机可能无法开启
    gpuAcceleration: {
      type: Boolean,
      default: true,
    },
  },

  data() {
    return {
      prefixCls: getPrefixCls('trigger') || 'ljc-trigger',
      referenceElm: null,
      popperJS: null,
      showPopper: false,
    };
  },

  watch: {
    showPopper(value) {
      if (value) {
        this.$emit('show', this);
        this.updatePopper();
      } else {
        this.unmountOnClose && this.doDestroy();
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

      if (this.renderToBody) {
        document.body.removeChild(this.popper);
      }
    },

    createPopper() {
      if (this.renderToBody) {
        document.body.appendChild(this.popper);
      }

      if (this.popperJS && this.popperJS.destroy) {
        this.popperJS.destroy();
      }
      this.popperJS = createPopper(this.referenceElm, this.popper, {
        placement: this.position,
        modifiers: [
          {
            name: 'offset',
            options: {
              offset: [0, this.offset],
            },
          },
        ],
        computeStyle: {
          gpuAcceleration: this.gpuAcceleration,
        },
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
      this.popperJS ? this.popperJS.update() : this.createPopper();
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
var __vue_render__$i = function () {var _vm=this;var _h=_vm.$createElement;var _c=_vm._self._c||_h;return _c(_vm.popupTag,{tag:"component"},[_vm._t("default"),_vm._v(" "),_c('div',{ref:"content",class:[(_vm.prefixCls + "-popup"), (_vm.prefixCls + "-position-" + _vm.position)],on:{"after-leave":_vm.doDestroy}},[_c('transition',{attrs:{"name":_vm.animationName,"enter-active-class":_vm.enterActiveClass,"leave-active-class":_vm.leaveActiveClass}},[_c('div',{directives:[{name:"show",rawName:"v-show",value:(!_vm.disabled && _vm.showPopper),expression:"!disabled && showPopper"}],class:(_vm.prefixCls + "-popup-wrapper")},[_c('div',{class:[(_vm.prefixCls + "-content")]},[_vm._t("content")],2),_vm._v(" "),(_vm.showArrow)?_c('div',{ref:"arrowRef",class:[(_vm.prefixCls + "-arrow")]}):_vm._e()])])],1)],2)};
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
  props: ['use'],
  data() {
    return {
      prefixCls: getPrefixCls('icon'),
      icon: {
        calendar: `<path d="M7 22h34M14 5v8m20-8v8M8 41h32a1 1 0 0 0 1-1V10a1 1 0 0 0-1-1H8a1 1 0 0 0-1 1v30a1 1 0 0 0 1 1Z"></path>`,
        circle: `<path d="M24 14v10h9.5m8.5 0c0 9.941-8.059 18-18 18S6 33.941 6 24 14.059 6 24 6s18 8.059 18 18Z"></path>`,
        close: `<path d="M9.857 9.858 24 24m0 0 14.142 14.142M24 24 38.142 9.858M24 24 9.857 38.142"></path>`,
        clockCircle: `<path d="M24 14v10h9.5m8.5 0c0 9.941-8.059 18-18 18S6 33.941 6 24 14.059 6 24 6s18 8.059 18 18Z"></path>`,
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
  methods: {
    scrollToTop(easing = false) {
      if (!this.$refs.refWrapper || isUndefined(this.value) || !this.visible) {
        return;
      }
      const refSelected = this.$refs[this.value][0];
      if (refSelected) {
        scrollTo(
          this.$refs.refWrapper,
          refSelected.offsetTop,
          easing ? 100 : 0
        );
      }
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
return _c('li',{key:item.value,ref:item.value,refInFor:true,class:[
        (_vm.prefixCls + "-cell"),
        ( _obj = {}, _obj[(_vm.prefixCls + "-cell-disabled")] = item.disabled, _obj[(_vm.prefixCls + "-cell-selected")] = item.selected, _obj ) ],on:{"click":function($event){return _vm.onItemClick(item)}}},[_c('div',{class:(_vm.prefixCls + "-cell-inner")},[_vm._v(_vm._s(item.label))])])}),0)])};
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
  components: { Popper: __vue_component__$j, DateInput: __vue_component__$g, IconCommon: __vue_component__$i, PickerPanel: __vue_component__$1 },
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
var __vue_render__ = function () {var _vm=this;var _h=_vm.$createElement;var _c=_vm._self._c||_h;return (!_vm.hideTrigger)?_c('Popper',{attrs:{"animation":"slide-dynamic-origin","offset":4,"trigger":_vm.trigger,"position":_vm.position,"disabled":_vm.mergedDisabled || _vm.readonly,"popup-visible":_vm.panelVisible,"unmount-on-close":_vm.unmountOnClose,"popup-container":_vm.popupContainer},on:{"popupVisibleChange":_vm.onPanelVisibleChange}},[_c('DateInput',_vm._b({ref:"refInput",attrs:{"size":_vm.size,"focused":_vm.panelVisible,"visible":_vm.panelVisible,"error":_vm.error,"disabled":_vm.mergedDisabled,"readonly":!_vm.inputEditable,"allow-clear":_vm.allowClear && !_vm.readonly,"placeholder":_vm.computedPlaceholder,"input-value":_vm.inputValue,"value":_vm.needConfirm ? _vm.panelValue : _vm.selectedValue,"format":_vm.inputFormat},on:{"clear":_vm.onInputClear,"change":_vm.onInputChange,"pressEnter":_vm.onInputPressEnter}},'DateInput',_vm.$attrs,false),[_c('template',{slot:"suffix-icon"},[_vm._t("suffix-icon",function(){return [_c('IconCommon',{attrs:{"use":"calendar"}})]})],2)],2),_vm._v(" "),_c('template',{slot:"content"},[_c('PickerPanel',_vm._g(_vm._b({on:{"click":_vm.onPanelClick}},'PickerPanel',_vm.panelProps,false),_vm.panelOn))],1)],2):_vm._e()};
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

var css_248z$6 = ".ljc-input-wrapper{background-color:#f2f3f5;border:1px solid transparent;border-radius:2px;-webkit-box-sizing:border-box;box-sizing:border-box;color:#1d2129;cursor:text;display:-webkit-inline-box;display:-webkit-inline-flex;display:-ms-inline-flexbox;display:inline-flex;font-size:14px;padding-left:12px;padding-right:12px;-webkit-transition:color .1s linear,border-color .1s linear,background-color .1s linear;transition:color .1s linear,border-color .1s linear,background-color .1s linear;width:100%}.ljc-input-wrapper:hover{background-color:#e5e6eb;border-color:transparent}.ljc-input-wrapper.ljc-input-focus,.ljc-input-wrapper:focus-within{background-color:#fff;border-color:#165dff;-webkit-box-shadow:0 0 0 0 #bedaff;box-shadow:0 0 0 0 #bedaff}.ljc-input-wrapper.ljc-input-disabled{cursor:not-allowed}.ljc-input-wrapper.ljc-input-disabled,.ljc-input-wrapper.ljc-input-disabled:hover{background-color:#f2f3f5;border-color:transparent;color:#c9cdd4}.ljc-input-wrapper.ljc-input-disabled .ljc-input-prefix,.ljc-input-wrapper.ljc-input-disabled .ljc-input-suffix{color:inherit}.ljc-input-wrapper.ljc-input-error{background-color:#ffece8;border-color:transparent}.ljc-input-wrapper.ljc-input-error:hover{background-color:#fdcdc5;border-color:transparent}.ljc-input-wrapper.ljc-input-error.ljc-input-wrapper-focus,.ljc-input-wrapper.ljc-input-error:focus-within{background-color:#fff;border-color:#f53f3f;-webkit-box-shadow:0 0 0 0 #fdcdc5;box-shadow:0 0 0 0 #fdcdc5}.ljc-input-wrapper .ljc-input-prefix,.ljc-input-wrapper .ljc-input-suffix{-ms-flex-negative:0;-webkit-box-align:center;-ms-flex-align:center;-webkit-align-items:center;align-items:center;display:-webkit-inline-box;display:-webkit-inline-flex;display:-ms-inline-flexbox;display:inline-flex;-webkit-flex-shrink:0;flex-shrink:0;-webkit-user-select:none;-moz-user-select:none;-ms-user-select:none;user-select:none;white-space:nowrap}.ljc-input-wrapper .ljc-input-prefix>svg,.ljc-input-wrapper .ljc-input-suffix>svg{font-size:14px}.ljc-input-wrapper .ljc-input-prefix{color:#4e5969;padding-right:12px}.ljc-input-wrapper .ljc-input-suffix{color:#4e5969;padding-left:12px}.ljc-input-wrapper .ljc-input-suffix .ljc-feedback-icon{display:-webkit-inline-box;display:-webkit-inline-flex;display:-ms-inline-flexbox;display:inline-flex}.ljc-input-wrapper .ljc-input-suffix .ljc-feedback-icon-status-validating{color:#165dff}.ljc-input-wrapper .ljc-input-suffix .ljc-feedback-icon-status-success{color:#00b42a}.ljc-input-wrapper .ljc-input-suffix .ljc-feedback-icon-status-warning{color:#ff7d00}.ljc-input-wrapper .ljc-input-suffix .ljc-feedback-icon-status-error{color:#f53f3f}.ljc-input-wrapper .ljc-input-clear-btn{-ms-flex-item-align:center;-webkit-align-self:center;align-self:center;color:#4e5969;cursor:pointer;font-size:12px;visibility:hidden}.ljc-input-wrapper .ljc-input-clear-btn>svg{position:relative;-webkit-transition:color .1s linear;transition:color .1s linear}.ljc-input-wrapper:hover .ljc-input-clear-btn{visibility:visible}.ljc-input-wrapper:not(.ljc-input-focus) .ljc-input-icon-hover:hover:before{background-color:#c9cdd4}.ljc-input-wrapper .ljc-input{-webkit-tap-highlight-color:rgba(0,0,0,0);-webkit-appearance:none;background:none;border:none;border-radius:0;color:inherit;cursor:inherit;line-height:1.5715;outline:none;padding-left:0;padding-right:0;width:100%}.ljc-input-wrapper .ljc-input::-webkit-input-placeholder{color:#86909c}.ljc-input-wrapper .ljc-input::-moz-placeholder{color:#86909c}.ljc-input-wrapper .ljc-input::-ms-input-placeholder{color:#86909c}.ljc-input-wrapper .ljc-input::placeholder{color:#86909c}.ljc-input-wrapper .ljc-input[disabled]::-webkit-input-placeholder{color:#c9cdd4}.ljc-input-wrapper .ljc-input[disabled]::-moz-placeholder{color:#c9cdd4}.ljc-input-wrapper .ljc-input[disabled]::-ms-input-placeholder{color:#c9cdd4}.ljc-input-wrapper .ljc-input[disabled]::placeholder{color:#c9cdd4}.ljc-input-wrapper .ljc-input[disabled]{-webkit-text-fill-color:#c9cdd4}.ljc-input-wrapper .ljc-input.ljc-input-size-mini{font-size:12px;line-height:1.667;padding-bottom:1px;padding-top:1px}.ljc-input-wrapper .ljc-input.ljc-input-size-small{font-size:14px;line-height:1.5715;padding-bottom:2px;padding-top:2px}.ljc-input-wrapper .ljc-input.ljc-input-size-medium{font-size:14px;line-height:1.5715;padding-bottom:4px;padding-top:4px}.ljc-input-wrapper .ljc-input.ljc-input-size-large{font-size:14px;line-height:1.5715;padding-bottom:6px;padding-top:6px}.ljc-input-wrapper .ljc-input-word-limit{color:#86909c;font-size:12px}.ljc-input-outer{display:-webkit-inline-box;display:-webkit-inline-flex;display:-ms-inline-flexbox;display:inline-flex;width:100%}.ljc-input-outer>.ljc-input-wrapper{border-radius:0}.ljc-input-outer>:first-child{border-bottom-left-radius:2px;border-top-left-radius:2px}.ljc-input-outer>:last-child{border-bottom-right-radius:2px;border-top-right-radius:2px}.ljc-input-outer.ljc-input-outer-size-mini .ljc-input-append,.ljc-input-outer.ljc-input-outer-size-mini .ljc-input-append>svg,.ljc-input-outer.ljc-input-outer-size-mini .ljc-input-outer,.ljc-input-outer.ljc-input-outer-size-mini .ljc-input-prepend,.ljc-input-outer.ljc-input-outer-size-mini .ljc-input-prepend>svg,.ljc-input-outer.ljc-input-outer-size-mini .ljc-input-wrapper .ljc-input-prefix,.ljc-input-outer.ljc-input-outer-size-mini .ljc-input-wrapper .ljc-input-prefix>svg,.ljc-input-outer.ljc-input-outer-size-mini .ljc-input-wrapper .ljc-input-suffix,.ljc-input-outer.ljc-input-outer-size-mini .ljc-input-wrapper .ljc-input-suffix>svg{font-size:12px}.ljc-input-outer.ljc-input-outer-size-mini .ljc-input-prepend .ljc-input{border-bottom-left-radius:0;border-color:transparent;border-top-left-radius:0;height:100%;margin:-1px -13px -1px -12px;width:auto}.ljc-input-outer.ljc-input-outer-size-mini .ljc-input-prepend .ljc-select{height:100%;margin:-1px -13px -1px -12px;width:auto}.ljc-input-outer.ljc-input-outer-size-mini .ljc-input-prepend .ljc-select .ljc-select-view{background-color:inherit;border-color:transparent;border-radius:0}.ljc-input-outer.ljc-input-outer-size-mini .ljc-input-prepend .ljc-select.ljc-select-single .ljc-select-view{height:100%}.ljc-input-outer.ljc-input-outer-size-mini .ljc-input-append .ljc-input{border-bottom-right-radius:0;border-color:transparent;border-top-right-radius:0;height:100%;margin:-1px -12px -1px -13px;width:auto}.ljc-input-outer.ljc-input-outer-size-mini .ljc-input-append .ljc-select{height:100%;margin:-1px -12px -1px -13px;width:auto}.ljc-input-outer.ljc-input-outer-size-mini .ljc-input-append .ljc-select .ljc-select-view{background-color:inherit;border-color:transparent;border-radius:0}.ljc-input-outer.ljc-input-outer-size-mini .ljc-input-append .ljc-select.ljc-select-single .ljc-select-view{height:100%}.ljc-input-outer.ljc-input-outer-size-small .ljc-input-append,.ljc-input-outer.ljc-input-outer-size-small .ljc-input-append>svg,.ljc-input-outer.ljc-input-outer-size-small .ljc-input-outer,.ljc-input-outer.ljc-input-outer-size-small .ljc-input-prepend,.ljc-input-outer.ljc-input-outer-size-small .ljc-input-prepend>svg,.ljc-input-outer.ljc-input-outer-size-small .ljc-input-wrapper .ljc-input-prefix,.ljc-input-outer.ljc-input-outer-size-small .ljc-input-wrapper .ljc-input-prefix>svg,.ljc-input-outer.ljc-input-outer-size-small .ljc-input-wrapper .ljc-input-suffix,.ljc-input-outer.ljc-input-outer-size-small .ljc-input-wrapper .ljc-input-suffix>svg{font-size:14px}.ljc-input-outer.ljc-input-outer-size-small .ljc-input-prepend .ljc-input{border-bottom-left-radius:0;border-color:transparent;border-top-left-radius:0;height:100%;margin:-1px -13px -1px -12px;width:auto}.ljc-input-outer.ljc-input-outer-size-small .ljc-input-prepend .ljc-select{height:100%;margin:-1px -13px -1px -12px;width:auto}.ljc-input-outer.ljc-input-outer-size-small .ljc-input-prepend .ljc-select .ljc-select-view{background-color:inherit;border-color:transparent;border-radius:0}.ljc-input-outer.ljc-input-outer-size-small .ljc-input-prepend .ljc-select.ljc-select-single .ljc-select-view{height:100%}.ljc-input-outer.ljc-input-outer-size-small .ljc-input-append .ljc-input{border-bottom-right-radius:0;border-color:transparent;border-top-right-radius:0;height:100%;margin:-1px -12px -1px -13px;width:auto}.ljc-input-outer.ljc-input-outer-size-small .ljc-input-append .ljc-select{height:100%;margin:-1px -12px -1px -13px;width:auto}.ljc-input-outer.ljc-input-outer-size-small .ljc-input-append .ljc-select .ljc-select-view{background-color:inherit;border-color:transparent;border-radius:0}.ljc-input-outer.ljc-input-outer-size-small .ljc-input-append .ljc-select.ljc-select-single .ljc-select-view{height:100%}.ljc-input-outer.ljc-input-outer-size-large .ljc-input-append,.ljc-input-outer.ljc-input-outer-size-large .ljc-input-append>svg,.ljc-input-outer.ljc-input-outer-size-large .ljc-input-outer,.ljc-input-outer.ljc-input-outer-size-large .ljc-input-prepend,.ljc-input-outer.ljc-input-outer-size-large .ljc-input-prepend>svg,.ljc-input-outer.ljc-input-outer-size-large .ljc-input-wrapper .ljc-input-prefix,.ljc-input-outer.ljc-input-outer-size-large .ljc-input-wrapper .ljc-input-prefix>svg,.ljc-input-outer.ljc-input-outer-size-large .ljc-input-wrapper .ljc-input-suffix,.ljc-input-outer.ljc-input-outer-size-large .ljc-input-wrapper .ljc-input-suffix>svg{font-size:14px}.ljc-input-outer.ljc-input-outer-size-large .ljc-input-prepend .ljc-input{border-bottom-left-radius:0;border-color:transparent;border-top-left-radius:0;height:100%;margin:-1px -13px -1px -12px;width:auto}.ljc-input-outer.ljc-input-outer-size-large .ljc-input-prepend .ljc-select{height:100%;margin:-1px -13px -1px -12px;width:auto}.ljc-input-outer.ljc-input-outer-size-large .ljc-input-prepend .ljc-select .ljc-select-view{background-color:inherit;border-color:transparent;border-radius:0}.ljc-input-outer.ljc-input-outer-size-large .ljc-input-prepend .ljc-select.ljc-select-single .ljc-select-view{height:100%}.ljc-input-outer.ljc-input-outer-size-large .ljc-input-append .ljc-input{border-bottom-right-radius:0;border-color:transparent;border-top-right-radius:0;height:100%;margin:-1px -12px -1px -13px;width:auto}.ljc-input-outer.ljc-input-outer-size-large .ljc-input-append .ljc-select{height:100%;margin:-1px -12px -1px -13px;width:auto}.ljc-input-outer.ljc-input-outer-size-large .ljc-input-append .ljc-select .ljc-select-view{background-color:inherit;border-color:transparent;border-radius:0}.ljc-input-outer.ljc-input-outer-size-large .ljc-input-append .ljc-select.ljc-select-single .ljc-select-view{height:100%}.ljc-input-outer-disabled{cursor:not-allowed}.ljc-input-append,.ljc-input-prepend{-ms-flex-negative:0;-webkit-box-align:center;-ms-flex-align:center;-webkit-align-items:center;align-items:center;background-color:#f2f3f5;border:1px solid transparent;-webkit-box-sizing:border-box;box-sizing:border-box;color:#1d2129;display:-webkit-inline-box;display:-webkit-inline-flex;display:-ms-inline-flexbox;display:inline-flex;-webkit-flex-shrink:0;flex-shrink:0;padding:0 12px;white-space:nowrap}.ljc-input-append>svg,.ljc-input-prepend>svg{font-size:14px}.ljc-input-prepend{border-right:1px solid #e5e6eb}.ljc-input-prepend .ljc-input{border-bottom-right-radius:0;border-color:transparent;border-top-right-radius:0}.ljc-input-prepend .ljc-input,.ljc-input-prepend .ljc-select{height:100%;margin:-1px -12px -1px -13px;width:auto}.ljc-input-prepend .ljc-select .ljc-select-view{background-color:inherit;border-color:transparent;border-radius:0}.ljc-input-prepend .ljc-select.ljc-select-single .ljc-select-view{height:100%}.ljc-input-append{border-left:1px solid #e5e6eb}.ljc-input-append .ljc-input{border-bottom-left-radius:0;border-color:transparent;border-top-left-radius:0}.ljc-input-append .ljc-input,.ljc-input-append .ljc-select{height:100%;margin:-1px -13px -1px -12px;width:auto}.ljc-input-append .ljc-select .ljc-select-view{background-color:inherit;border-color:transparent;border-radius:0}.ljc-input-append .ljc-select.ljc-select-single .ljc-select-view{height:100%}.ljc-input-group{-webkit-box-align:center;-ms-flex-align:center;-webkit-align-items:center;align-items:center;display:-webkit-inline-box;display:-webkit-inline-flex;display:-ms-inline-flexbox;display:inline-flex}.ljc-input-group>*,.ljc-input-group>.ljc-input-outer>:first-child,.ljc-input-group>.ljc-input-outer>:last-child{border-radius:0}.ljc-input-group>:not(:last-child){-webkit-box-sizing:border-box;box-sizing:border-box;position:relative}.ljc-input-group>:first-child,.ljc-input-group>:first-child .ljc-input-group>:first-child,.ljc-input-group>:first-child .ljc-input-group>:first-child .ljc-select-view,.ljc-input-group>:first-child .ljc-select-view{border-bottom-left-radius:2px;border-top-left-radius:2px}.ljc-input-group>:last-child,.ljc-input-group>:last-child .ljc-input-outer>:last-child,.ljc-input-group>:last-child .ljc-input-outer>:last-child .ljc-select-view,.ljc-input-group>:last-child .ljc-select-view{border-bottom-right-radius:2px;border-top-right-radius:2px}.ljc-input-group>.ljc-input-outer:not(:last-child),.ljc-input-group>.ljc-input-tag:not(:last-child),.ljc-input-group>.ljc-input-wrapper:not(:last-child),.ljc-input-group>.ljc-select-view:not(:last-child){border-right:1px solid #e5e6eb}.ljc-input-group>.ljc-input-outer:not(:last-child):focus-within,.ljc-input-group>.ljc-input-tag:not(:last-child):focus-within,.ljc-input-group>.ljc-input-wrapper:not(:last-child):focus-within,.ljc-input-group>.ljc-select-view:not(:last-child):focus-within{border-right-color:#165dff}.size-height-size-mini{font-size:12px;line-height:1.667;padding-bottom:1px;padding-top:1px}.size-height-size-small{font-size:14px;padding-bottom:2px;padding-top:2px}.size-height-size-large{font-size:14px;padding-bottom:6px;padding-top:6px}";
styleInject(css_248z$6);

var css_248z$5 = ".ljc-timepicker{-webkit-box-sizing:border-box;box-sizing:border-box;display:-webkit-box;display:-webkit-flex;display:-ms-flexbox;display:flex;padding:0;position:relative}.ljc-timepicker-container{background-color:#fff;border:1px solid #f7f8fa;border-radius:4px;-webkit-box-shadow:0 2px 5px rgba(0,0,0,.1);box-shadow:0 2px 5px rgba(0,0,0,.1);overflow:hidden}.ljc-timepicker-column{-webkit-box-sizing:border-box;box-sizing:border-box;height:224px;overflow:hidden;width:64px}.ljc-timepicker-column:not(:last-child){border-right:1px solid #f7f8fa}.ljc-timepicker-column:hover{overflow-y:auto}.ljc-timepicker-column ul{-webkit-box-sizing:border-box;box-sizing:border-box;list-style:none;margin:0;padding:0}.ljc-timepicker-column ul:after{content:\"\";display:block;height:192px;width:100%}.ljc-timepicker-cell{color:#1d2129;cursor:pointer;font-weight:500;padding:4px 0}.ljc-timepicker-cell-inner{font-size:14px;height:24px;line-height:24px;padding-left:24px}.ljc-timepicker-cell:not(.ljc-timepicker-cell-selected):not(.ljc-timepicker-cell-disabled):hover .ljc-timepicker-cell-inner{background-color:#f2f3f5}.ljc-timepicker-cell-selected .ljc-timepicker-cell-inner{background-color:#f2f3f5;font-weight:500}.ljc-timepicker-cell-disabled{color:#c9cdd4;cursor:not-allowed}.ljc-timepicker-footer-extra-wrapper{border-top:1px solid #f7f8fa;color:#1d2129;font-size:12px;padding:8px}.ljc-timepicker-footer-btn-wrapper{-webkit-box-pack:justify;-ms-flex-pack:justify;border-top:1px solid #f7f8fa;display:-webkit-box;display:-webkit-flex;display:-ms-flexbox;display:flex;-webkit-justify-content:space-between;justify-content:space-between;padding:8px}.ljc-timepicker-footer-btn-wrapper :only-child{margin-left:auto}";
styleInject(css_248z$5);

var css_248z$4 = ".ljc-icon{stroke:currentColor;color:inherit;display:inline-block;font-style:normal;height:1em;outline:none;vertical-align:-2px;width:1em}.ljc-icon-hover{cursor:pointer;display:inline-block;line-height:12px}.ljc-icon-hover,.ljc-icon-hover .ljc-icon{position:relative}.ljc-icon-hover:before{background-color:transparent;border-radius:50%;-webkit-box-sizing:border-box;box-sizing:border-box;content:\"\";display:block;position:absolute;-webkit-transition:background-color .1s linear;transition:background-color .1s linear}.ljc-icon-hover:hover:before{background-color:#f2f3f5}.ljc-icon-hover.ljc-icon-hover-disabled:before{opacity:0}.ljc-icon-hover:before{height:20px;left:50%;top:50%;-webkit-transform:translate(-50%,-50%);transform:translate(-50%,-50%);width:20px}.ljc-icon-hover-size-mini{line-height:12px}.ljc-icon-hover-size-mini:before{height:20px;left:50%;top:50%;-webkit-transform:translate(-50%,-50%);transform:translate(-50%,-50%);width:20px}.ljc-icon-hover-size-small{line-height:12px}.ljc-icon-hover-size-small:before{height:20px;left:50%;top:50%;-webkit-transform:translate(-50%,-50%);transform:translate(-50%,-50%);width:20px}.ljc-icon-hover-size-large{line-height:12px}.ljc-icon-hover-size-large:before{height:24px;left:50%;top:50%;-webkit-transform:translate(-50%,-50%);transform:translate(-50%,-50%);width:24px}.ljc-icon-hover-size-huge{line-height:12px}.ljc-icon-hover-size-huge:before{height:24px;left:50%;top:50%;-webkit-transform:translate(-50%,-50%);transform:translate(-50%,-50%);width:24px}";
styleInject(css_248z$4);

var css_248z$3 = ".ljc-btn{-webkit-box-align:center;-ms-flex-align:center;-webkit-box-pack:center;-ms-flex-pack:center;-webkit-align-items:center;align-items:center;-webkit-appearance:none;-moz-appearance:none;appearance:none;-webkit-box-sizing:border-box;box-sizing:border-box;cursor:pointer;display:-webkit-inline-box;display:-webkit-inline-flex;display:-ms-inline-flexbox;display:inline-flex;font-weight:400;-webkit-justify-content:center;justify-content:center;line-height:1.5715;outline:none;position:relative;-webkit-transition:all .1s linear;transition:all .1s linear;-webkit-user-select:none;-moz-user-select:none;-ms-user-select:none;user-select:none;white-space:nowrap}.ljc-btn>a:only-child{color:currentColor}.ljc-btn:active{-webkit-transition:none;transition:none}.ljc-btn-primary,.ljc-btn-primary[type=button],.ljc-btn-primary[type=submit]{background-color:#165dff;border:1px solid transparent;color:#fff}.ljc-btn-primary:hover,.ljc-btn-primary[type=button]:hover,.ljc-btn-primary[type=submit]:hover{background-color:#4080ff;border-color:transparent;color:#fff}.ljc-btn-primary:focus-visible,.ljc-btn-primary[type=button]:focus-visible,.ljc-btn-primary[type=submit]:focus-visible{-webkit-box-shadow:0 0 0 .25em #94bfff;box-shadow:0 0 0 .25em #94bfff}.ljc-btn-primary:active,.ljc-btn-primary[type=button]:active,.ljc-btn-primary[type=submit]:active{background-color:#0e42d2;border-color:transparent;color:#fff}.ljc-btn-primary.ljc-btn-disabled,.ljc-btn-primary[type=button].ljc-btn-disabled,.ljc-btn-primary[type=submit].ljc-btn-disabled{background-color:#94bfff;border:1px solid transparent;color:#fff;cursor:not-allowed}.ljc-btn-primary.ljc-btn-status-warning{background-color:#ff7d00;border-color:transparent;color:#fff}.ljc-btn-primary.ljc-btn-status-warning:hover{background-color:#ff9a2e;border-color:transparent;color:#fff}.ljc-btn-primary.ljc-btn-status-warning:focus-visible{-webkit-box-shadow:0 0 0 .25em #ffcf8b;box-shadow:0 0 0 .25em #ffcf8b}.ljc-btn-primary.ljc-btn-status-warning:active{background-color:#d25f00;border-color:transparent;color:#fff}.ljc-btn-primary.ljc-btn-status-warning.ljc-btn-disabled{background-color:#ffcf8b;border:1px solid transparent;color:#fff}.ljc-btn-primary.ljc-btn-status-danger{background-color:#f53f3f;border-color:transparent;color:#fff}.ljc-btn-primary.ljc-btn-status-danger:hover{background-color:#f76560;border-color:transparent;color:#fff}.ljc-btn-primary.ljc-btn-status-danger:focus-visible{-webkit-box-shadow:0 0 0 .25em #fbaca3;box-shadow:0 0 0 .25em #fbaca3}.ljc-btn-primary.ljc-btn-status-danger:active{background-color:#cb272d;border-color:transparent;color:#fff}.ljc-btn-primary.ljc-btn-status-danger.ljc-btn-disabled{background-color:#fbaca3;border:1px solid transparent;color:#fff}.ljc-btn-primary.ljc-btn-status-success{background-color:#00b42a;border-color:transparent;color:#fff}.ljc-btn-primary.ljc-btn-status-success:hover{background-color:#23c343;border-color:transparent;color:#fff}.ljc-btn-primary.ljc-btn-status-success:focus-visible{-webkit-box-shadow:0 0 0 .25em #7be188;box-shadow:0 0 0 .25em #7be188}.ljc-btn-primary.ljc-btn-status-success:active{background-color:#009a29;border-color:transparent;color:#fff}.ljc-btn-primary.ljc-btn-status-success.ljc-btn-disabled{background-color:#7be188;border:1px solid transparent;color:#fff}.ljc-btn-secondary,.ljc-btn-secondary[type=button],.ljc-btn-secondary[type=submit]{background-color:#f2f3f5;border:1px solid transparent;color:#4e5969}.ljc-btn-secondary:hover,.ljc-btn-secondary[type=button]:hover,.ljc-btn-secondary[type=submit]:hover{background-color:#e5e6eb;border-color:transparent;color:#4e5969}.ljc-btn-secondary:focus-visible,.ljc-btn-secondary[type=button]:focus-visible,.ljc-btn-secondary[type=submit]:focus-visible{-webkit-box-shadow:0 0 0 .25em #c9cdd4;box-shadow:0 0 0 .25em #c9cdd4}.ljc-btn-secondary:active,.ljc-btn-secondary[type=button]:active,.ljc-btn-secondary[type=submit]:active{background-color:#c9cdd4;border-color:transparent;color:#4e5969}.ljc-btn-secondary.ljc-btn-disabled,.ljc-btn-secondary[type=button].ljc-btn-disabled,.ljc-btn-secondary[type=submit].ljc-btn-disabled{background-color:#f7f8fa;border:1px solid transparent;color:#c9cdd4;cursor:not-allowed}.ljc-btn-secondary.ljc-btn-status-warning{background-color:#fff7e8;border-color:transparent;color:#ff7d00}.ljc-btn-secondary.ljc-btn-status-warning:hover{background-color:#ffe4ba;border-color:transparent;color:#ff7d00}.ljc-btn-secondary.ljc-btn-status-warning:focus-visible{-webkit-box-shadow:0 0 0 .25em #ffcf8b;box-shadow:0 0 0 .25em #ffcf8b}.ljc-btn-secondary.ljc-btn-status-warning:active{background-color:#ffcf8b;border-color:transparent;color:#ff7d00}.ljc-btn-secondary.ljc-btn-status-warning.ljc-btn-disabled{background-color:#fff7e8;border:1px solid transparent;color:#ffcf8b}.ljc-btn-secondary.ljc-btn-status-danger{background-color:#ffece8;border-color:transparent;color:#f53f3f}.ljc-btn-secondary.ljc-btn-status-danger:hover{background-color:#fdcdc5;border-color:transparent;color:#f53f3f}.ljc-btn-secondary.ljc-btn-status-danger:focus-visible{-webkit-box-shadow:0 0 0 .25em #fbaca3;box-shadow:0 0 0 .25em #fbaca3}.ljc-btn-secondary.ljc-btn-status-danger:active{background-color:#fbaca3;border-color:transparent;color:#f53f3f}.ljc-btn-secondary.ljc-btn-status-danger.ljc-btn-disabled{background-color:#ffece8;border:1px solid transparent;color:#fbaca3}.ljc-btn-secondary.ljc-btn-status-success{background-color:#e8ffea;border-color:transparent;color:#00b42a}.ljc-btn-secondary.ljc-btn-status-success:hover{background-color:#aff0b5;border-color:transparent;color:#00b42a}.ljc-btn-secondary.ljc-btn-status-success:focus-visible{-webkit-box-shadow:0 0 0 .25em #7be188;box-shadow:0 0 0 .25em #7be188}.ljc-btn-secondary.ljc-btn-status-success:active{background-color:#7be188;border-color:transparent;color:#00b42a}.ljc-btn-secondary.ljc-btn-status-success.ljc-btn-disabled{background-color:#e8ffea;border:1px solid transparent;color:#7be188}.ljc-btn-size-mini{border-radius:2px;font-size:12px;height:24px;padding:0 11px}.ljc-btn-size-small{height:28px}.ljc-btn-size-medium,.ljc-btn-size-small{border-radius:2px;font-size:14px;padding:0 15px}.ljc-btn-size-medium{height:32px}.ljc-btn-size-large{border-radius:2px;font-size:14px;height:36px;padding:0 19px}.ljc-btn-group{-webkit-box-align:center;-ms-flex-align:center;-webkit-align-items:center;align-items:center;display:-webkit-inline-box;display:-webkit-inline-flex;display:-ms-inline-flexbox;display:inline-flex}.ljc-btn-group .ljc-btn-dashed:not(:first-child),.ljc-btn-group .ljc-btn-outline:not(:first-child){margin-left:-1px}.ljc-btn-group .ljc-btn-primary:not(:last-child){border-right:1px solid #4080ff}.ljc-btn-group .ljc-btn-secondary:not(:last-child){border-right:1px solid #e5e6eb}.ljc-btn-group .ljc-btn-status-warning:not(:last-child){border-right:1px solid #ff9a2e}.ljc-btn-group .ljc-btn-status-danger:not(:last-child){border-right:1px solid #f76560}.ljc-btn-group .ljc-btn-status-success:not(:last-child){border-right:1px solid #23c343}.ljc-btn-group .ljc-btn-dashed:active,.ljc-btn-group .ljc-btn-dashed:hover,.ljc-btn-group .ljc-btn-outline:active,.ljc-btn-group .ljc-btn-outline:hover{z-index:2}.ljc-btn-group .ljc-btn:first-child{border-bottom-right-radius:0;border-top-right-radius:0}.ljc-btn-group .ljc-btn:last-child{border-bottom-left-radius:0;border-top-left-radius:0}.ljc-btn-group .ljc-btn:not(:first-child):not(:last-child){border-radius:0}";
styleInject(css_248z$3);

var css_248z$2 = ".ljc-picker-link{-webkit-box-align:center;-ms-flex-align:center;-webkit-box-pack:center;-ms-flex-pack:center;-webkit-align-items:center;align-items:center;background-color:transparent;border-radius:2px;color:#165dff;cursor:pointer;display:-webkit-inline-box;display:-webkit-inline-flex;display:-ms-inline-flexbox;display:inline-flex;font-size:14px;-webkit-justify-content:center;justify-content:center;line-height:1.5715;padding:1px 2px;text-decoration:none;-webkit-transition:all .1s linear;transition:all .1s linear}.ljc-picker-link:hover{background-color:#f2f3f5;color:#165dff}.ljc-picker-link:active{background-color:#e5e6eb;color:#165dff;-webkit-transition:none;transition:none}.ljc-picker-link.ljc-picker-link-disabled{background:none;color:#94bfff;cursor:not-allowed}";
styleInject(css_248z$2);

var css_248z$1 = ".ljc-picker{-webkit-box-align:center;-ms-flex-align:center;-webkit-align-items:center;align-items:center;background-color:#f2f3f5;border:1px solid transparent;border-radius:2px;-webkit-box-sizing:border-box;box-sizing:border-box;line-height:1.5715;padding:4px 11px 4px 4px;position:relative;-webkit-transition:all .1s linear;transition:all .1s linear}.ljc-picker,.ljc-picker-input{display:-webkit-inline-box;display:-webkit-inline-flex;display:-ms-inline-flexbox;display:inline-flex}.ljc-picker-input{-webkit-box-flex:1;-webkit-flex:1;-ms-flex:1;flex:1}.ljc-picker input{background-color:transparent;border:none;color:#4e5969;line-height:1.5715;outline:none;padding:0 0 0 8px;text-align:left;-webkit-transition:all .1s linear;transition:all .1s linear;width:100%}.ljc-picker input::-webkit-input-placeholder{color:#86909c}.ljc-picker input::-moz-placeholder{color:#86909c}.ljc-picker input::-ms-input-placeholder{color:#86909c}.ljc-picker input::placeholder{color:#86909c}.ljc-picker input[disabled]{-webkit-text-fill-color:#c9cdd4}.ljc-picker-suffix{-webkit-box-align:center;-ms-flex-align:center;-webkit-align-items:center;align-items:center;display:-webkit-inline-box;display:-webkit-inline-flex;display:-ms-inline-flexbox;display:inline-flex;margin-left:4px;width:1em}.ljc-picker-suffix-icon{color:#4e5969}.ljc-picker .ljc-picker-clear-icon{color:#4e5969;display:none;font-size:12px}.ljc-picker:hover{background-color:#e5e6eb;border-color:transparent}.ljc-picker:not(.ljc-picker-disabled):hover .ljc-picker-clear-icon{display:inline-block}.ljc-picker:not(.ljc-picker-disabled):hover .ljc-picker-suffix .ljc-picker-clear-icon+span{display:none}.ljc-picker input[disabled]{color:#c9cdd4;cursor:not-allowed}.ljc-picker input[disabled]::-webkit-input-placeholder{color:#c9cdd4}.ljc-picker input[disabled]::-moz-placeholder{color:#c9cdd4}.ljc-picker input[disabled]::-ms-input-placeholder{color:#c9cdd4}.ljc-picker input[disabled]::placeholder{color:#c9cdd4}.ljc-picker-error,.ljc-picker-error:hover{background-color:#fdcdc5;border-color:transparent}.ljc-picker-focused{-webkit-box-shadow:0 0 0 0 #e8f3ff;box-shadow:0 0 0 0 #e8f3ff}.ljc-picker-focused,.ljc-picker-focused:hover{background-color:#fff;border-color:#165dff}.ljc-picker-focused.ljc-picker-error{border-color:#f53f3f;-webkit-box-shadow:0 0 0 0 #fdcdc5;box-shadow:0 0 0 0 #fdcdc5}.ljc-picker-focused .ljc-picker-input-active input,.ljc-picker-focused:hover .ljc-picker-input-active input{background:#f2f3f5}.ljc-picker-disabled,.ljc-picker-disabled:hover{background-color:#f2f3f5;border-color:transparent;color:#c9cdd4;cursor:not-allowed}.ljc-picker-disabled input[disabled],.ljc-picker-disabled:hover input[disabled]{color:#c9cdd4;cursor:not-allowed}.ljc-picker-disabled input[disabled]::-webkit-input-placeholder,.ljc-picker-disabled:hover input[disabled]::-webkit-input-placeholder{color:#c9cdd4}.ljc-picker-disabled input[disabled]::-moz-placeholder,.ljc-picker-disabled:hover input[disabled]::-moz-placeholder{color:#c9cdd4}.ljc-picker-disabled input[disabled]::-ms-input-placeholder,.ljc-picker-disabled:hover input[disabled]::-ms-input-placeholder{color:#c9cdd4}.ljc-picker-disabled input[disabled]::placeholder,.ljc-picker-disabled:hover input[disabled]::placeholder{color:#c9cdd4}.ljc-picker-separator{color:#86909c;min-width:10px;padding:0 8px}.ljc-picker-disabled .ljc-picker-separator,.ljc-picker-disabled .ljc-picker-suffix-icon{color:#c9cdd4}.ljc-picker-size-mini{height:24px}.ljc-picker-size-mini input{font-size:12px}.ljc-picker-size-small{height:28px}.ljc-picker-size-small input{font-size:14px}.ljc-picker-size-medium{height:32px}.ljc-picker-size-medium input{font-size:14px}.ljc-picker-size-large{height:36px}.ljc-picker-size-large input{font-size:14px}";
styleInject(css_248z$1);

var css_248z = ".ljc-picker-container,.ljc-picker-range-container{background-color:#fff;border:1px solid #e5e6eb;border-radius:4px;-webkit-box-shadow:0 2px 5px rgba(0,0,0,.1);box-shadow:0 2px 5px rgba(0,0,0,.1);-webkit-box-sizing:border-box;box-sizing:border-box;min-height:60px;overflow:hidden;-webkit-user-select:none;-moz-user-select:none;-ms-user-select:none;user-select:none}.ljc-picker-container-shortcuts-placement-left,.ljc-picker-container-shortcuts-placement-right,.ljc-picker-range-container-shortcuts-placement-left,.ljc-picker-range-container-shortcuts-placement-right{-webkit-box-align:start;-ms-flex-align:start;-webkit-align-items:flex-start;align-items:flex-start;display:-webkit-box;display:-webkit-flex;display:-ms-flexbox;display:flex}.ljc-picker-container-shortcuts-placement-left>.ljc-picker-shortcuts,.ljc-picker-container-shortcuts-placement-right>.ljc-picker-shortcuts,.ljc-picker-range-container-shortcuts-placement-left>.ljc-picker-shortcuts,.ljc-picker-range-container-shortcuts-placement-right>.ljc-picker-shortcuts{-webkit-box-orient:vertical;-webkit-box-direction:normal;-webkit-box-sizing:border-box;box-sizing:border-box;display:-webkit-box;display:-webkit-flex;display:-ms-flexbox;display:flex;-webkit-flex-direction:column;-ms-flex-direction:column;flex-direction:column;overflow-x:hidden;overflow-y:auto;padding:5px 8px}.ljc-picker-container-shortcuts-placement-left>.ljc-picker-shortcuts>*,.ljc-picker-container-shortcuts-placement-right>.ljc-picker-shortcuts>*,.ljc-picker-range-container-shortcuts-placement-left>.ljc-picker-shortcuts>*,.ljc-picker-range-container-shortcuts-placement-right>.ljc-picker-shortcuts>*{margin:5px 0}.ljc-picker-container-shortcuts-placement-left .ljc-picker-panel-wrapper,.ljc-picker-container-shortcuts-placement-left .ljc-picker-range-panel-wrapper,.ljc-picker-range-container-shortcuts-placement-left .ljc-picker-panel-wrapper,.ljc-picker-range-container-shortcuts-placement-left .ljc-picker-range-panel-wrapper{border-left:1px solid #e5e6eb}.ljc-picker-container-shortcuts-placement-right .ljc-picker-panel-wrapper,.ljc-picker-container-shortcuts-placement-right .ljc-picker-range-panel-wrapper,.ljc-picker-range-container-shortcuts-placement-right .ljc-picker-panel-wrapper,.ljc-picker-range-container-shortcuts-placement-right .ljc-picker-range-panel-wrapper{border-right:1px solid #e5e6eb}.ljc-picker-panel-only,.ljc-picker-range-panel-only{-webkit-box-shadow:none;box-shadow:none}.ljc-picker-panel-only .ljc-panel-date-inner,.ljc-picker-range-panel-only .ljc-panel-date,.ljc-picker-range-panel-only .ljc-panel-date-inner{width:100%}.ljc-picker-header{border-bottom:1px solid #e5e6eb;display:-webkit-box;display:-webkit-flex;display:-ms-flexbox;display:flex;padding:8px 16px}.ljc-picker-header-title{-webkit-box-flex:1;color:#1d2129;cursor:pointer;-webkit-flex:1;-ms-flex:1;flex:1;font-size:14px;line-height:24px;text-align:center}.ljc-picker-header-icon{background-color:#fff;border-radius:50%;color:#4e5969;font-size:12px;height:24px;line-height:24px;margin-left:2px;margin-right:2px;text-align:center;-webkit-transition:all .1s linear;transition:all .1s linear;-webkit-user-select:none;-moz-user-select:none;-ms-user-select:none;user-select:none;width:24px}.ljc-picker-header-icon:not(.ljc-picker-header-icon-hidden){cursor:pointer}.ljc-picker-header-icon:not(.ljc-picker-header-icon-hidden):hover{background-color:#e5e6eb}.ljc-picker-header-label{border-radius:2px;cursor:pointer;padding:2px;-webkit-transition:all .1s;transition:all .1s}.ljc-picker-header-label:hover{background-color:#e5e6eb}.ljc-picker-body{padding:9px 16px}.ljc-picker-week-list{-webkit-box-sizing:border-box;box-sizing:border-box;display:-webkit-box;display:-webkit-flex;display:-ms-flexbox;display:flex;font-size:14px;padding:9px 16px 0;width:100%}.ljc-picker-week-list-item{-webkit-box-flex:1;color:#7d7d7f;-webkit-flex:1;-ms-flex:1;flex:1;font-weight:400;height:32px;line-height:32px;padding:0;text-align:center}.ljc-picker-row{display:-webkit-box;display:-webkit-flex;display:-ms-flexbox;display:flex;padding:2px 0}.ljc-picker-cell{-webkit-box-flex:1;-webkit-flex:1;-ms-flex:1;flex:1}.ljc-picker-cell .ljc-picker-date{-webkit-box-orient:vertical;-webkit-box-direction:normal;-webkit-box-align:center;-ms-flex-align:center;-webkit-box-pack:center;-ms-flex-pack:center;-webkit-align-items:center;align-items:center;-webkit-box-sizing:border-box;box-sizing:border-box;cursor:pointer;display:-webkit-box;display:-webkit-flex;display:-ms-flexbox;display:flex;-webkit-flex-direction:column;-ms-flex-direction:column;flex-direction:column;height:100%;-webkit-justify-content:center;justify-content:center;padding:4px 0;width:100%}.ljc-picker-date-value{border-radius:50%;color:#c9cdd4;cursor:pointer;font-size:14px;height:24px;line-height:24px;min-width:24px;text-align:center}.ljc-picker-date-lunar{color:#c9cdd4;font-size:12px;margin-top:-5px;-webkit-transform:scale(.8);transform:scale(.8);white-space:nowrap}.ljc-picker-cell-in-view .ljc-picker-date-value{color:#1d2129;font-weight:500}.ljc-picker-cell-in-view .ljc-picker-date-lunar{color:#86909c}.ljc-picker-cell-selected:not(.ljc-picker-cell-lunar) .ljc-picker-date-value{background-color:#165dff;color:#fff;-webkit-transition:background-color .1s linear;transition:background-color .1s linear}.ljc-picker-cell-lunar .ljc-picker-date{padding:0}.ljc-picker-cell-lunar:is(.ljc-picker-cell-selected) .ljc-picker-date{background-color:#165dff;border-radius:4px;-webkit-transition:background-color .1s linear;transition:background-color .1s linear}.ljc-picker-cell-lunar:is(.ljc-picker-cell-selected) .ljc-picker-date-lunar,.ljc-picker-cell-lunar:is(.ljc-picker-cell-selected) .ljc-picker-date-value{color:#fff}.ljc-picker-cell-in-view:not(.ljc-picker-cell-selected):not(.ljc-picker-cell-range-start):not(.ljc-picker-cell-range-end):not(.ljc-picker-cell-disabled):not(.ljc-picker-cell-week):not(.ljc-picker-cell-lunar) .ljc-picker-date-value:hover{background-color:#e5e6eb;color:#1d2129}.ljc-picker-cell-in-view:not(.ljc-picker-cell-selected):not(.ljc-picker-cell-range-start):not(.ljc-picker-cell-range-end):not(.ljc-picker-cell-disabled):not(.ljc-picker-cell-week):is(.ljc-picker-cell-lunar) .ljc-picker-date:hover{background-color:#e5e6eb;border-radius:4px;color:#1d2129}.ljc-picker-cell-today{position:relative}.ljc-picker-cell-today:after{background-color:#165dff;border-radius:50%;bottom:-2px;content:\"\";display:block;height:4px;left:50%;margin-left:-2px;position:absolute;width:4px}.ljc-picker-cell-in-range .ljc-picker-date{background-color:#e8f3ff}.ljc-picker-cell-range-start .ljc-picker-date{border-bottom-left-radius:24px;border-top-left-radius:24px}.ljc-picker-cell-range-end .ljc-picker-date{border-bottom-right-radius:24px;border-top-right-radius:24px}.ljc-picker-cell-in-range-near-hover .ljc-picker-date{border-radius:0}.ljc-picker-cell-range-end .ljc-picker-date-value,.ljc-picker-cell-range-start .ljc-picker-date-value{background-color:#165dff;border-radius:50%;color:#fff}.ljc-picker-cell-hover-in-range .ljc-picker-date{background-color:#e8f3ff}.ljc-picker-cell-hover-range-start .ljc-picker-date{border-radius:24px 0 0 24px}.ljc-picker-cell-hover-range-end .ljc-picker-date{border-radius:0 24px 24px 0}.ljc-picker-cell-hover-range-end .ljc-picker-date-value,.ljc-picker-cell-hover-range-start .ljc-picker-date-value{background-color:#bedaff;border-radius:50%;color:#1d2129}.ljc-picker-cell-disabled .ljc-picker-date{background-color:#f7f8fa;cursor:not-allowed}.ljc-picker-cell-disabled .ljc-picker-date-value{background-color:transparent;color:#c9cdd4;cursor:not-allowed}.ljc-picker-footer{min-width:100%;width:-webkit-min-content;width:-moz-min-content;width:min-content}.ljc-picker-footer-btn-wrapper{-webkit-box-align:center;-ms-flex-align:center;-webkit-box-pack:justify;-ms-flex-pack:justify;-webkit-align-items:center;align-items:center;border-top:1px solid #e5e6eb;-webkit-box-sizing:border-box;box-sizing:border-box;display:-webkit-box;display:-webkit-flex;display:-ms-flexbox;display:flex;-webkit-justify-content:space-between;justify-content:space-between;padding:3px 8px}.ljc-picker-footer-btn-wrapper :only-child{margin-left:auto}.ljc-picker-footer-extra-wrapper{color:#1d2129;font-size:12px;padding:8px 24px}.ljc-picker-footer-extra-wrapper,.ljc-picker-footer-now-wrapper{border-top:1px solid #e5e6eb;-webkit-box-sizing:border-box;box-sizing:border-box}.ljc-picker-footer-now-wrapper{height:36px;line-height:36px;text-align:center}.ljc-picker-btn-confirm{margin:5px 0}.ljc-picker-shortcuts{-webkit-box-flex:1;-webkit-flex:1;-ms-flex:1;flex:1}.ljc-picker-shortcuts>*{margin:5px 10px 5px 0}.slide-dynamic-origin-appear-from,.slide-dynamic-origin-enter-from{opacity:0;-webkit-transform:scaleY(.9);transform:scaleY(.9);-webkit-transform-origin:0 0;transform-origin:0 0}.slide-dynamic-origin-appear-to,.slide-dynamic-origin-enter-to{opacity:1;-webkit-transform:scaleY(1);transform:scaleY(1);-webkit-transform-origin:0 0;transform-origin:0 0}.slide-dynamic-origin-appear-active,.slide-dynamic-origin-enter-active{-webkit-transition:opacity .2s cubic-bezier(.34,.69,.1,1),-webkit-transform .2s cubic-bezier(.34,.69,.1,1);transition:opacity .2s cubic-bezier(.34,.69,.1,1),-webkit-transform .2s cubic-bezier(.34,.69,.1,1);transition:transform .2s cubic-bezier(.34,.69,.1,1),opacity .2s cubic-bezier(.34,.69,.1,1);transition:transform .2s cubic-bezier(.34,.69,.1,1),opacity .2s cubic-bezier(.34,.69,.1,1),-webkit-transform .2s cubic-bezier(.34,.69,.1,1)}.slide-dynamic-origin-leave-from{opacity:1;-webkit-transform:scaleY(1);transform:scaleY(1);-webkit-transform-origin:0 0;transform-origin:0 0}.slide-dynamic-origin-leave-to{opacity:0;-webkit-transform:scaleY(.9);transform:scaleY(.9);-webkit-transform-origin:0 0;transform-origin:0 0}.slide-dynamic-origin-leave-active{-webkit-transition:opacity .2s cubic-bezier(.34,.69,.1,1),-webkit-transform .2s cubic-bezier(.34,.69,.1,1);transition:opacity .2s cubic-bezier(.34,.69,.1,1),-webkit-transform .2s cubic-bezier(.34,.69,.1,1);transition:transform .2s cubic-bezier(.34,.69,.1,1),opacity .2s cubic-bezier(.34,.69,.1,1);transition:transform .2s cubic-bezier(.34,.69,.1,1),opacity .2s cubic-bezier(.34,.69,.1,1),-webkit-transform .2s cubic-bezier(.34,.69,.1,1)}.ljc-panel-date{-webkit-box-sizing:border-box;box-sizing:border-box;display:-webkit-box;display:-webkit-flex;display:-ms-flexbox;display:flex}.ljc-panel-date-inner{width:265px}.ljc-panel-date-inner .ljc-picker-body{padding-top:0}.ljc-panel-date-timepicker{-webkit-box-orient:vertical;-webkit-box-direction:normal;border-left:1px solid #e5e6eb;display:-webkit-box;display:-webkit-flex;display:-ms-flexbox;display:flex;-webkit-flex-direction:column;-ms-flex-direction:column;flex-direction:column}.ljc-panel-date-timepicker-title{border-bottom:1px solid #e5e6eb;color:#1d2129;font-size:14px;font-weight:400;height:40px;line-height:40px;text-align:center;width:100%}.ljc-panel-date-timepicker .ljc-timepicker{height:276px;overflow:hidden;padding:0 6px}.ljc-panel-date-timepicker .ljc-timepicker-column{-webkit-box-sizing:border-box;box-sizing:border-box;height:100%;padding:0 4px;width:auto}.ljc-panel-date-timepicker .ljc-timepicker-column::-webkit-scrollbar{width:0}.ljc-panel-date-timepicker .ljc-timepicker-column:not(:last-child){border-right:0}.ljc-panel-date-timepicker .ljc-timepicker ul:after{height:244px}.ljc-panel-date-timepicker .ljc-timepicker-cell{width:36px}.ljc-panel-date-timepicker .ljc-timepicker-cell-inner{padding-left:10px}.ljc-panel-date-footer{border-right:1px solid #e5e6eb}.ljc-panel-date-with-view-tabs{-webkit-box-orient:vertical;-webkit-box-direction:normal;-webkit-flex-direction:column;-ms-flex-direction:column;flex-direction:column;min-width:265px}.ljc-panel-date-with-view-tabs .ljc-panel-date-timepicker .ljc-timepicker-column{-webkit-box-flex:1;-webkit-flex:1;-ms-flex:1;flex:1}.ljc-panel-date-with-view-tabs .ljc-panel-date-timepicker .ljc-timepicker-column::-webkit-scrollbar{width:0}.ljc-panel-date-with-view-tabs .ljc-panel-date-timepicker .ljc-timepicker-cell{text-align:center;width:100%}.ljc-panel-date-with-view-tabs .ljc-panel-date-timepicker .ljc-timepicker-cell-inner{padding-left:0}.ljc-panel-date-view-tabs{border-top:1px solid #e5e6eb;display:-webkit-box;display:-webkit-flex;display:-ms-flexbox;display:flex}.ljc-panel-date-view-tab-pane{-webkit-box-flex:1;border-right:1px solid #e5e6eb;color:#c9cdd4;cursor:pointer;-webkit-flex:1;-ms-flex:1;flex:1;font-size:14px;height:50px;line-height:50px;text-align:center}.ljc-panel-date-view-tab-pane:last-child{border-right:none}.ljc-panel-date-view-tab-pane-text{margin-left:8px}.ljc-panel-date-view-tab-pane-active{color:#1d2129}.ljc-panel-month,.ljc-panel-quarter,.ljc-panel-year{-webkit-box-sizing:border-box;box-sizing:border-box;width:265px}.ljc-panel-month .ljc-picker-date,.ljc-panel-quarter .ljc-picker-date,.ljc-panel-year .ljc-picker-date{padding:4px}.ljc-panel-month .ljc-picker-date-value,.ljc-panel-quarter .ljc-picker-date-value,.ljc-panel-year .ljc-picker-date-value{border-radius:24px;width:100%}.ljc-panel-month .ljc-picker-cell:not(.ljc-picker-cell-selected):not(.ljc-picker-cell-range-start):not(.ljc-picker-cell-range-end):not(.ljc-picker-cell-disabled):not(.ljc-picker-cell-week) .ljc-picker-date-value:hover,.ljc-panel-quarter .ljc-picker-cell:not(.ljc-picker-cell-selected):not(.ljc-picker-cell-range-start):not(.ljc-picker-cell-range-end):not(.ljc-picker-cell-disabled):not(.ljc-picker-cell-week) .ljc-picker-date-value:hover,.ljc-panel-year .ljc-picker-cell:not(.ljc-picker-cell-selected):not(.ljc-picker-cell-range-start):not(.ljc-picker-cell-range-end):not(.ljc-picker-cell-disabled):not(.ljc-picker-cell-week) .ljc-picker-date-value:hover{border-radius:24px}.ljc-panel-year{width:265px}.ljc-panel-week,.ljc-panel-year{-webkit-box-sizing:border-box;box-sizing:border-box}.ljc-panel-week-wrapper{display:-webkit-box;display:-webkit-flex;display:-ms-flexbox;display:flex}.ljc-panel-week-inner{width:298px}.ljc-panel-week-inner .ljc-picker-body{padding-top:0}.ljc-panel-week .ljc-picker-row-week{cursor:pointer}.ljc-panel-week .ljc-picker-row-week .ljc-picker-date-value{border-radius:0;width:100%}.ljc-panel-week .ljc-picker-cell .ljc-picker-date{border-radius:0}.ljc-panel-week .ljc-picker-cell:nth-child(2) .ljc-picker-date{border-bottom-left-radius:24px;border-top-left-radius:24px;padding-left:4px}.ljc-panel-week .ljc-picker-cell:nth-child(2) .ljc-picker-date .ljc-picker-date-value{border-bottom-left-radius:24px;border-top-left-radius:24px}.ljc-panel-week .ljc-picker-cell:nth-child(8) .ljc-picker-date{border-bottom-right-radius:24px;border-top-right-radius:24px;padding-right:4px}.ljc-panel-week .ljc-picker-cell:nth-child(8) .ljc-picker-date .ljc-picker-date-value{border-bottom-right-radius:24px;border-top-right-radius:24px}.ljc-panel-week .ljc-picker-row-week:hover .ljc-picker-cell:not(.ljc-picker-cell-week):not(.ljc-picker-cell-selected):not(.ljc-picker-cell-range-start):not(.ljc-picker-cell-range-end) .ljc-picker-date-value{background-color:#e5e6eb}.ljc-panel-quarter{-webkit-box-sizing:border-box;box-sizing:border-box;width:265px}.ljc-picker-range-wrapper{display:-webkit-box;display:-webkit-flex;display:-ms-flexbox;display:flex}.ljc-datepicker-shortcuts-wrapper{-webkit-box-sizing:border-box;box-sizing:border-box;height:100%;list-style:none;margin:10px 0 0;max-height:300px;overflow-y:auto;padding:0;width:106px}.ljc-datepicker-shortcuts-wrapper>li{-webkit-box-sizing:border-box;box-sizing:border-box;cursor:pointer;padding:6px 16px;width:100%}.ljc-datepicker-shortcuts-wrapper>li:hover{color:#165dff}.ljc-trigger-wrapper{display:inline-block}.ljc-trigger-popup{position:absolute;z-index:5200}.ljc-trigger-arrow{background-color:#fff;-webkit-box-sizing:border-box;box-sizing:border-box;content:\"\";display:block;height:8px;position:absolute;width:8px;z-index:-1}.ljc-trigger-popup[x-placement=tl] .ljc-trigger-arrow,.ljc-trigger-popup[x-placement=top] .ljc-trigger-arrow,.ljc-trigger-popup[x-placement=tr] .ljc-trigger-arrow{border-bottom-right-radius:2px;border-left:none;border-top:none}.ljc-trigger-popup[x-placement=bl] .ljc-trigger-arrow,.ljc-trigger-popup[x-placement=bottom] .ljc-trigger-arrow,.ljc-trigger-popup[x-placement=br] .ljc-trigger-arrow{border-bottom:none;border-right:none;border-top-left-radius:2px}.ljc-trigger-popup[x-placement=lb] .ljc-trigger-arrow,.ljc-trigger-popup[x-placement=left] .ljc-trigger-arrow,.ljc-trigger-popup[x-placement=lt] .ljc-trigger-arrow{border-bottom:none;border-left:none;border-top-right-radius:2px}.ljc-trigger-popup[x-placement=rb] .ljc-trigger-arrow,.ljc-trigger-popup[x-placement=right] .ljc-trigger-arrow,.ljc-trigger-popup[x-placement=rt] .ljc-trigger-arrow{border-bottom-left-radius:2px;border-right:none;border-top:none}";
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

export { __vue_component__ as DatePickerPro, index as default, install };
