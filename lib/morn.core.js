'use strict';

var morn;

/**
 * core module.
 * the root object is defined in this module.
 * wrap for addEventListener and removeEventListener
 */
define('core', function(){

	/**
	 * constuctor
	 * @param  {String|morn.init|HtmlNode} selector
	 */
	morn = function(selector) {
		if (selector !== undefined ) {
			if (typeof selector === 'string') {
				return new morn.prototype.init(morn.parseSelector(selector));
			} else if (morn.isNode(selector) || morn.isHtmlList(selector) || selector.constructor === Array) {
				return new morn.prototype.init(selector);
			} else if (selector.constructor === morn){
				return selector;
			}
        }

	};

	morn.prototype.init = morn.widget = function(dom) {
		if (dom.length === undefined || dom === window) {
			this.dom = [dom];
			this.length = 1;
			this[0] = dom;
		} else {
			this.length = dom.length;
			for (var i = dom.length - 1; i >= 0; i--) {
				this[i] = dom[i];
			}
			this.dom = dom;
		}
		return this;
	};

	morn.prototype.init.prototype = morn.prototype;

	morn.prototype.addEventHandler = (function () {
		if (window.addEventListener) {
			return function (ev, fn) {
				for (var i = this.dom.length - 1; i >= 0; i--) {
					this.dom[i].addEventListener(ev, fn, false);
				}
				return this;
            };
        } else if (window.attachEvent) {
            return function (ev, fn) {
				for (var i = this.dom.length - 1; i >= 0; i--) {
					this.dom[i].attachEvent('on' + ev, fn);
				}
				return this;
			};
        } else {
            return function (ev, fn) {
				for (var i = this.dom.length - 1; i >= 0; i--) {
					this.dom[i]['on' + ev] =  fn;
				}
				return this;
			};
		}
	}());

	/**
	 * alias for add event Listener
	 */
	morn.prototype.on = morn.prototype.addEventHandler;

	/**
	 * alias for add event Listener
	 */
	morn.prototype.bind = morn.prototype.addEventHandler;

	/**
	 * alias for add event Listener
	 */
	morn.prototype.addListener = morn.prototype.addEventHandler;

	morn.addEventHandler = (function () {
		if (window.addEventListener) {
			return function (el, ev, fn) {
				if (el.length) {
					for (var i = el.length - 1; i >= 0; i--) {
						el[i].addEventListener(ev, fn, false);
					}
				} else {
					el.addEventListener(ev, fn, false);
				}
            };
        } else if (window.attachEvent) {
            return function (el, ev, fn) {
            	if (el.length) {
					for (var i = el.length - 1; i >= 0; i--) {
						el[i].attachEvent('on' + ev, fn);
					}
				} else {
					el.attachEvent('on' + ev, fn);
				}
			};
        } else {
            return function (el, ev, fn) {
            	if (el.length) {
					for (var i = el.length - 1; i >= 0; i--) {
						el[i]['on' + ev] =  fn;
					}
            	} else {
					el['on' + ev] = fn;
            	}
			};
		}
	}());

	morn.prototype.removeEventHandler = (function () {
		if (window.removeEventListener) {
			return function (ev, fn) {
				for (var i = this.dom.length - 1; i >= 0; i--) {
					this.dom[i].removeEventListener(ev, fn);
				}
				return this;
            };
        } else if (window.detachEvent) {
            return function (ev, fn) {
				for (var i = this.dom.length - 1; i >= 0; i--) {
					this.dom[i].detachEvent('on' + ev, fn);
				}
				return this;
			};
        } else {
            return function (ev) {
				for (var i = this.dom.length - 1; i >= 0; i--) {
					this.dom[i]['on' + ev] = null;
				}
				return this;
			};
		}
	}());


	/**
	 * alias for remove event Listener
	 */
	morn.prototype.off = morn.prototype.removeEventHandler;

	/**
	 * alias for remove event Listener
	 */
	morn.prototype.unbind = morn.prototype.removeEventHandler;
	
	/**
	 * alias for remove event Listener
	 */
	morn.prototype.removeListener = morn.prototype.removeEventHandler;

	morn.removeEventHandler = (function () {
		if (window.removeEventListener) {
			return function (el, ev, fn) {
				el.removeEventListener(ev, fn);
            };
        } else if (window.detachEvent) {
            return function (el, ev, fn) {
				el.detachEvent('on' + ev, fn);
			};
        } else {
            return function (el, ev) {
            	if (el.length) {
					for (var i = el.length - 1; i >= 0; i--) {
						el[i]['on' + ev] = null;
					}
            	} else {
					el['on' + ev] = null;
            	}
			};
		}
	}());
});