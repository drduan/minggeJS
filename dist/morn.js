/*! morn-js - v0.0.1 - 2014-10-25 */
'use strict';

/**
 * the first module tobe loaded.
 * load the other module by dependencies order.
 */
var define = (function(){
	var namespaces = {},
		pending = {},
		uid = 0;

    /**
     * load module
     * @param {string} ns name of the module.
     * @param {Array} dependsOn modules' name array than depends on.
     * @param {Function} func module content.
     * @returns {boolean} true if a module is successfully loaded.
     * @private
     * @example
     * _load('lexer',['core'], func);
     *
     */
	function _load(ns, dependsOn, func){
		if (namespaces[ns] !== undefined && namespaces[ns].load === true) {
			return true;
		}
		var loadNow = true;
        for (var i = 0, len = dependsOn.length; i < len; i++) {
            if (namespaces[dependsOn[i]] === undefined) {
                loadNow = false;
            } else {
                if (namespaces[dependsOn[i]].load === false) {
                    if (!_load(dependsOn[i], namespaces[dependsOn[i]].depends, namespaces[dependsOn[i]].func)) {
                        loadNow = false;
                    }
                }
            }
        }
		if (loadNow) {
			var n;
			func(morn);
			namespaces[ns].load = true;
			delete pending[ns];
			for (n in pending) {
				_load(n, namespaces[n].depends, namespaces[n].func);
			}
			return true;
		} else {
			pending[ns] = true;
			return false;
		}
	}

    /**
     * generate unique id;
     * @returns {number}
     */
	function guid() {
		return uid++;
	}

    /**
     * @example
     * morn.define(itself_name, ['dependencies'], function(){}); //
     * morn.define(['dependencies'], function(){});  // anonymous function and has dependencies
     * morn.define(itself_name, function(){}); // no dependencies
     * morn.define(function(){});  // no dependencies and anonymous
     */
	return function() {
		if (arguments.length === 1) {
			arguments[0](morn);
		} else if (arguments.length === 2){
			var ns;
			if (typeof arguments[0] === 'string') {
				ns = arguments[0];
				namespaces[ns] = {
					load: false,
					depends: [],
					func: arguments[1]
				};
				_load(ns, [], arguments[1]);
			} else {
				ns = guid();
				namespaces[ns] = {
					load: false,
					depends: arguments[0],
					func: arguments[1]
				};
				_load(ns, arguments[0], arguments[1]);
			}
		} else if (arguments.length === 3){
			var ns = arguments[0];
			namespaces[ns] = {
				load: false,
				depends: arguments[1],
				func: arguments[2]
			};
			_load(ns, arguments[1], arguments[2]);
		}

	};
}());
'use strict';

define('ajax', ['core', 'promise'], function($){
	function processData(data) {
		var result = [];
		for (var key in data) {
			result.push(key + '=' + data[key]);
		}
		return result.join('&');
	}

	$.get = function(url, success, failed) {
		var promise = $.promise(),
			ajax = new XMLHttpRequest();

		ajax.onload = function() {
			if (ajax.status === 200) {
				success(ajax.response);
				promise.resolve(ajax.response);
			} else {
				if (failed) {
					failed(ajax.statusText);
				}
				promise.reject(ajax.statusText);
			}
		};

		ajax.open('GET', url, true);
		ajax.send();

		return promise;
	};

	$.post = function(url, data, success, failed) {
		var promise = $.promise(),
			ajax = new XMLHttpRequest(),
			params = processData(data);

		ajax.onload = function() {
			if (ajax.status === 200) {
				success(ajax.response);
				promise.resolve(ajax.response);
			} else {
				if (failed) {
					failed(ajax.statusText);
				}
				promise.reject(ajax.statusText);
			}
		};

		ajax.open('POST', url, true);
		
		ajax.setRequestHeader("Content-type", "application/x-www-form-urlencoded");

		ajax.send(params);

		return promise;
	};

});
'use strict';

define('animate', ['core', 'promise', 'dom'], function($) {
	var queque = [];

	$.tween = {
		// thanks for Tween.js
		// https://github.com/sole/tween.js/blob/master/src/Tween.js
		linear: function(k) {
			return k;
		},
		quadratic: {
			in: function ( k ) {
				return k * k;
			},
			out: function ( k ) {
				return k * ( 2 - k );
			},
			inOut: function ( k ) {
				if ( ( k *= 2 ) < 1 ) return 0.5 * k * k;
				return - 0.5 * ( --k * ( k - 2 ) - 1 );
			}
		},
		cubic: {
			in: function ( k ) {
				return k * k * k;
			},
			out: function ( k ) {
				return --k * k * k + 1;
			},
			inOut: function ( k ) {
				if ( ( k *= 2 ) < 1 ) return 0.5 * k * k * k;
				return 0.5 * ( ( k -= 2 ) * k * k + 2 );
			}
		},
		quartic: {
			in: function ( k ) {
				return k * k * k * k;
			},
			out: function ( k ) {
				return 1 - ( --k * k * k * k );
			},
			inOut: function ( k ) {
				if ( ( k *= 2 ) < 1) return 0.5 * k * k * k * k;
				return - 0.5 * ( ( k -= 2 ) * k * k * k - 2 );
			}
		},
		quintic: {
			in: function ( k ) {
				return k * k * k * k * k;
			},
			out: function ( k ) {
				return --k * k * k * k * k + 1;
			},
			inOut: function ( k ) {
				if ( ( k *= 2 ) < 1 ) return 0.5 * k * k * k * k * k;
				return 0.5 * ( ( k -= 2 ) * k * k * k * k + 2 );
			}
		},
		sinusoidal: {
			in: function ( k ) {
				return 1 - Math.cos( k * Math.PI / 2 );
			},
			out: function ( k ) {
				return Math.sin( k * Math.PI / 2 );
			},
			inOut: function ( k ) {
				return 0.5 * ( 1 - Math.cos( Math.PI * k ) );
			}
		},
		exponential: {
			in: function ( k ) {
				return k === 0 ? 0 : Math.pow( 1024, k - 1 );
			},
			out: function ( k ) {
				return k === 1 ? 1 : 1 - Math.pow( 2, - 10 * k );
			},
			inOut: function ( k ) {
				if ( k === 0 ) return 0;
				if ( k === 1 ) return 1;
				if ( ( k *= 2 ) < 1 ) return 0.5 * Math.pow( 1024, k - 1 );
				return 0.5 * ( - Math.pow( 2, - 10 * ( k - 1 ) ) + 2 );
			}
		},
		circular: {
			in: function ( k ) {
				return 1 - Math.sqrt( 1 - k * k );
			},
			out: function ( k ) {
				return Math.sqrt( 1 - ( --k * k ) );
			},
			inOut: function ( k ) {
				if ( ( k *= 2 ) < 1) return - 0.5 * ( Math.sqrt( 1 - k * k) - 1);
				return 0.5 * ( Math.sqrt( 1 - ( k -= 2) * k) + 1);
			}
		},
		elastic: {
			in: function ( k ) {
				var s, a = 0.1, p = 0.4;
				if ( k === 0 ) return 0;
				if ( k === 1 ) return 1;
				if ( !a || a < 1 ) { a = 1; s = p / 4; }
				else s = p * Math.asin( 1 / a ) / ( 2 * Math.PI );
				return - ( a * Math.pow( 2, 10 * ( k -= 1 ) ) * Math.sin( ( k - s ) * ( 2 * Math.PI ) / p ) );
			},
			out: function ( k ) {
				var s, a = 0.1, p = 0.4;
				if ( k === 0 ) return 0;
				if ( k === 1 ) return 1;
				if ( !a || a < 1 ) { a = 1; s = p / 4; }
				else s = p * Math.asin( 1 / a ) / ( 2 * Math.PI );
				return ( a * Math.pow( 2, - 10 * k) * Math.sin( ( k - s ) * ( 2 * Math.PI ) / p ) + 1 );
			},
			inOut: function ( k ) {
				var s, a = 0.1, p = 0.4;
				if ( k === 0 ) return 0;
				if ( k === 1 ) return 1;
				if ( !a || a < 1 ) { a = 1; s = p / 4; }
				else s = p * Math.asin( 1 / a ) / ( 2 * Math.PI );
				if ( ( k *= 2 ) < 1 ) return - 0.5 * ( a * Math.pow( 2, 10 * ( k -= 1 ) ) * Math.sin( ( k - s ) * ( 2 * Math.PI ) / p ) );
				return a * Math.pow( 2, -10 * ( k -= 1 ) ) * Math.sin( ( k - s ) * ( 2 * Math.PI ) / p ) * 0.5 + 1;
			}
		},
		back: {
			in: function ( k ) {
				var s = 1.70158;
				return k * k * ( ( s + 1 ) * k - s );
			},
			out: function ( k ) {
				var s = 1.70158;
				return --k * k * ( ( s + 1 ) * k + s ) + 1;
			},
			inOut: function ( k ) {
				var s = 1.70158 * 1.525;
				if ( ( k *= 2 ) < 1 ) return 0.5 * ( k * k * ( ( s + 1 ) * k - s ) );
				return 0.5 * ( ( k -= 2 ) * k * ( ( s + 1 ) * k + s ) + 2 );
			}
		}
	};

	$.prototype.addAnimate = function(attri, value, time, easing) {
		var promise = $.promise(),
			origin = $.getComputedStyle(this.dom[0], attri),
			element = this.dom[0],
			eclapse = 0,
			startTime = Date.now(),
			startValue = parseFloat(origin),
			endValue = parseFloat(value);
	
		easing = easing || $.tween.linear;

		var timer = setInterval(function(){
				eclapse = Date.now() - startTime;
				if (eclapse >= time) {
					element.style[attri] = value;
					promise.resolve();
					clearInterval(timer);
				} else {
					element.style[attri] = startValue + easing(eclapse / time) * (endValue - startValue) + 'px';
				}
			}, 17);
		return promise;
	};
});
'use strict';
/** 
 * This page of code is from the page: http://stackoverflow.com/questions/5916900/detect-version-of-browser
 * To get browser and version
 */

define('browser', ['core'], function ($) {
	$.browser = (function(){
		var ua = navigator.userAgent,tem,M=ua.match(/(opera|chrome|safari|firefox|msie|trident(?=\/))\/?\s*(\d+)/i) || [];
		if(/trident/i.test(M[1])){
			tem = /\brv[ :]+(\d+)/g.exec(ua) || [];
			return 'IE ' + (tem[1] || '');
		}
		if(M[1] === 'Chrome'){
			tem=ua.match(/\bOPR\/(\d+)/);
			if(tem !== null) {
				return 'Opera '+tem[1];
			}
		}
		M = M[2]? [M[1], M[2]]: [navigator.appName, navigator.appVersion, '-?'];
		if((tem = ua.match(/version\/(\d+)/i)) !== null) {M.splice(1,1,tem[1]);}
		return {
			browser:M[0], version: parseInt(M[1])
		};
	}());
});
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
'use strict';

define('data', ['core'], function($) {
	var cacheData = {

	};

	var guid = 0,
		cache = 'morn-js';

	$.prototype.data = (function(){
		if (document.documentElement.dataset) {
			return function(key, value){
				if (value === undefined) {
					return this.dom[0].dataset[key];
				} else {
					for (var i = 0, len = this.dom.length; i < len; i++) {
						this.dom[i].dataset[key] = value;
					}
				}
			};
		} else return function(key, value) {

			if (value === undefined) {
				if (this.dom[0][cache] === undefined){
					return undefined;
				} else {
					var tmp = cacheData[this.dom[0][cache]];
					if (tmp !== undefined) {
						return tmp[key];
					} else {
						return undefined;
					}
				}
			} else {
				for (var i = 0, len = this.dom.length; i < len; i++) {
					if (this.dom[i][cache] === undefined){
						cacheData[guid] = {};
						cacheData[guid][key] = value;
						this.dom[i][cache] = guid++;
					} else {
						cacheData[this.dom[i][cache]][key] = value;
					}
				}
				return this;
			}
		};
	}());


	$.prototype.removeData = (function() {
		if (document.documentElement.dataset) {
			return function(key) {
                var i, len, d;
				if (key !== undefined) {
					for (i = 0, len = this.dom.length; i < len; i++) {
						delete this.dom[i].dataset[key];
					}
				} else {
					for (i = 0, len = this.dom.length; i < len; i++) {
						for (d in this.dom[i].dataset) {
							delete this.dom[i].dataset[d];
						}
					}
				}
			};
		} else try {
			delete cacheData[''];
			return function(key) {
				var i, len;
				if (key === undefined) {
					for (i = 0, len = this.dom.length; i < len; i++) {
						if (this.dom[i][cache] !== undefined){
							delete cacheData[this.dom[i][cache]];
						}
					}
				} else {
					var tmp;
					for (i = 0, len = this.dom.length; i < len; i++) {
						if (this.dom[i][cache] !== undefined){
							tmp = cacheData[this.dom[i][cache]];
							if (tmp !== undefined) {
								delete cacheData[this.dom[i][cache]];
							}
							delete this.dom[i][cache];
						}
					}
				}

			};
		} catch(e) {
			return function(key) {
				var i, len;
				if (key === undefined) {
					for (i = 0, len = this.dom.length; i < len; i++) {
						if (this.dom[i][cache] !== undefined){
							cacheData.removeAttribute(this.dom[i][cache]);
						}
					}
				} else {
					var tmp;
					for (i = 0, len = this.dom.length; i < len; i++) {
						if (this.dom[i][cache] !== undefined){
							tmp = cacheData[this.dom[i][cache]];
							if (tmp !== undefined) {
								cacheData.removeAttribute(this.dom[i][cache]);
							}
							this.dom[i].removeAttribute(cache);
						}
					}
				}
			};
		}
	}());
});
'use strict';

/**
 * dom module.
 * used to deal with document elements.
 */
define('dom', ['core'], function($) {

    /**
     * apply a class to the nodes.
     * @return {morn.init}
     */
	$.prototype.addClass = (function () {
		if (document.documentElement.classList) {
			return function (classStyle) {
				for (var i = this.dom.length - 1; i >= 0; i--) {
					this.dom[i].classList.add(classStyle);
				}
				return this;
			};
		}else{
			return function (classStyle) {
				for (var i = this.dom.length - 1; i >= 0; i--) {
					var c = ' ' + this.dom.className + ' ';
					if (c.indexOf(' ' + classStyle + ' ') == -1) {
						this.dom.className += ' ' + classStyle;
					}
				}
				return this;
			};
		}
	}());


    $.addClass = (function () {
        if (document.documentElement.classList) {
            return function (el, classStyle) {
                if (el.length) {
                    for (var i = el.length - 1; i >= 0; i--) {
                        el[i].classList.add(classStyle);
                    }
                } else {
                    el.classList.add(classStyle);
                }
            };
        }else{
            return function (el, classStyle) {
                if (el.length) {
                    for (var i = el.length - 1; i >= 0; i--) {
                        var c = ' ' + el.className + ' ';
                        if (c.indexOf(' ' + classStyle + ' ') == -1) {
                            el.className += ' ' + classStyle;
                        }
                    }
                } else {
                    var c = ' ' + el.className + ' ';
                    if (c.indexOf(' ' + classStyle + ' ') == -1) {
                        el.className += ' ' + classStyle;
                    }
                }
            };
        }
    }());

    /**
     * return whether a class in the node.
     * @return {morn.init}
     */
	$.prototype.hasClass = (function () {
		if (document.documentElement.classList) {
			return function (classStyle) {
				if (this.dom.length > 0) {
					return this.dom[0].classList.contains(classStyle);
				}
				return false;
			};
		}else{
			return function (classStyle) {
				if (this.dom.length > 0) {
					var c = ' ' + this.dom[0].className + ' ';
					return (c.indexOf(' ' + classStyle + ' ') !== -1);
				}
				return false;
			};
		}
	}());

	$.hasClass = (function () {
		if (document.documentElement.classList) {
			return function (ele, classStyle) {
				if ($.isNode(ele)) {
					return ele.classList.contains(classStyle);
				}
				return false;
			};
		}else{
			return function (ele, classStyle) {
				if ($.isNode(ele)) {
					var c = ' ' + ele.className + ' ';
					return (c.indexOf(' ' + classStyle + ' ') !== -1);
				}
				return false;
			};
		}
	}());

    /**
     * remove a class in node
     * @return {morn.init}
     */
	$.prototype.removeClass = (function () {
		if (document.documentElement.classList) {
			return function (classStyle) {
				for (var i = this.dom.length - 1; i >= 0; i--) {
					this.dom[i].classList.remove(classStyle);
				}
				return this;
			};
		}else{
			return function (classStyle) {
				for (var i = this.dom.length - 1; i >= 0; i--) {
					this.dom[i].className = this.dom.className.replace(new RegExp('\\b' + classStyle + '\\b','g'), '');
				}
				return this;
			};
		}
	}());

	$.removeClass = (function () {
		if (document.documentElement.classList) {
			return function (el, classStyle) {
				if (el.length) {
					for (var i = el.length - 1; i >= 0; i--) {
						el[i].classList.remove(classStyle);
					}
				} else {
					el.classList.remove(classStyle);
				}
			};
		}else{
			return function (el, classStyle) {
				if (el.length) {
					for (var i = el.length - 1; i >= 0; i--) {
						el[i].el.className = el.className.replace(new RegExp('\\b' + classStyle + '\\b','g'), '');
					}
				} else {
					el.className = el.className.replace(new RegExp('\\b' + classStyle + '\\b','g'), '');
				}
			};
		}
	}());

	/**
	 * test if the node is in a specific set.
	 * @param  {node}  dom
	 * @param  {token array|selector}  selector
	 * @return {Boolean}
	 */
	$.is = function(dom, selector){
		var s,
			i,
			len,
			currentElement = dom;

		if (typeof(selector) === 'string') {
			var match = (el.matches || el.matchesSelector || el.msMatchesSelector || el.mozMatchesSelector || el.webkitMatchesSelector || el.oMatchesSelector);
			if (match) {
				return match.call(this.dom[0], selector);
			}
			s = $.parse(selector);
		} else {
			s = selector;
		}

		for (i = s.length - 1; i >= 0; i--) {
			switch(s[i].type) {
				case $.Token.CLASS:
					if (! $.hasClass(currentElement, s[i].text)) {
						return false;
					}
					break;

				case $.Token.TAG:
					if (currentElement.tagName.toLowerCase() !== s[i].text) {
						return false;
					}
					break;

				case $.Token.ID:
					if (currentElement.id !== s[i].text) {
						return false;
					}
					break;

				case $.Token.WHITE:
					var parent = currentElement,
						flag = false;
					if (i !== 0) {
						i--;
					} else {
						return true;
					}
					while (parent = parent.parentElement){
						switch(s[i].type) {
							case $.Token.CLASS:
								if ($.hasClass(parent, s[i].text)) {
									flag = true;
								}
								break;
							case $.Token.TAG:
								if (parent.tagName.toLowerCase() === s[i].text) {
									flag = true;
								}
								break;
							case $.Token.ID:
								if (parent.id === s[i].text) {
									flag = true;
								}
								break;
							default:
								break;
						}
						if (flag) {
							break;
						}
					}

					if (! parent) {
						return false;
					} else {
						currentElement = parent;
					}
					break;

				default:
					break;
			}
		}

		return true;
	}

	$.prototype.is = function(selector){
		if (typeof(selector) === 'string') {
			var match = (el.matches || el.matchesSelector || el.msMatchesSelector || el.mozMatchesSelector || el.webkitMatchesSelector || el.oMatchesSelector);
			if (match) {
				return match.call(this.dom[0], selector);
			} else {
				return $.is(this.dom[0], selector);
			}
		}

	};

    /**
     * return an element style.
     * if name is specific, return the value of name in style.
     * IE may return some value not expressed by pixel.
     * @param {string|null}name
     * @returns {Object|value}
     */
	$.prototype.getComputedStyle = function(name) {
		if (this.dom.length > 0) {
			if (this.dom[0].style[name] && name !== undefined) {
				return this.dom[0].style[name];
			} else if (this.dom[0].currentStyle) {
				return this.dom[0].currentStyle[name];
			} else if (document.defaultView && document.defaultView.getComputedStyle) {
				var s = document.defaultView.getComputedStyle(this.dom[0]);
				if (name !== undefined) {
					name = name.replace(/([A-Z])/g,'-$1');
					name = name.toLowerCase();
					return s.getPropertyValue(name);
				} else {
					return s;
				}
			} else {
				return null;
			}
		}
	};

    /**
     * return an element style.
     * if name is specific, return the value of name in style.
     * IE may return some value not expressed by pixel.
     * @param {node} elem
     * @param {string|null}name
     * @returns {Object|value}
     */
	$.getComputedStyle = function( elem, name ) {
		if (elem.style[name] && name !== undefined) {
			return elem.style[name];
		} else if (elem.currentStyle) {
			return elem.currentStyle[name];
		} else if (document.defaultView && document.defaultView.getComputedStyle) {
			var s = document.defaultView.getComputedStyle(elem);
			if (name !== undefined) {
				name = name.replace(/([A-Z])/g,'-$1');
				name = name.toLowerCase();
				return s.getPropertyValue(name);
			} else {
				return s;
			}
		} else {
			return null;
		}
	};

    /**
     * get/set element's width
     * @param {string|null} width
     * @returns {string|morn.init}
     */
	$.prototype.width = function(width) {
		if (width === undefined) {
			var rect;
			if (this.dom.length > 0) {
				rect = this.dom[0].getBoundingClientRect();
				return rect.right - rect.left;
			}
		} else {
            if (this.dom.length > 0) {
                this.dom[0].style.width = width;
                return this;
            }
        }
	};

    /**
     * get/set element's height
     * @param {string|null} height
     * @returns {string|morn.init}
     */
	$.prototype.height = function(height) {
		if (height === undefined) {
			var rect;
			if (this.dom.length !== 0) {
				rect = this.dom[0].getBoundingClientRect();
				return rect.bottom - rect.top;
			}
		} else {
            if (this.dom.length > 0) {
                this.dom[0].style.height = height;
                return this;
            }
        }
	};

    /**
     * get rect of node
     * @returns {ClientRect}
     */
	$.prototype.rect = function() {
        var rect;
        if (this.dom.length !== 0) {
            rect = this.dom[0].getBoundingClientRect();
            return rect;
        }
	};

    /**
     * create node using string
     * @param {string} str
     * @returns {Array}
     */
	$.createDom = function(str){
		var tmpNodes = [],
			tmp = document.createElement('div');
		tmp.innerHTML = str;
		for (var i = 0, len = tmp.children.length; i < len; i++) {
			tmpNodes.push(tmp.children[i]);
		}
		return tmpNodes;
	};

    /**
     * append element to this.dom
     * @param {nodeList|HTMLCollection|morn.init} children
     * @returns {morn.init}
     */
	$.prototype.append = function(children) {
		var dom,
			i,
			len;
		if (this.dom.length > 0) {
			dom = this.dom[0];
		} else {
			return this;
		}

		if (typeof(children) === 'string') {
			var _children = $($.createDom(children));
			for (i = 0, len = _children.length; i < len; i++) {
				dom.appendChild(_children[0]);
			}		
		} else if (children.constructor === NodeList) {
			for (i = 0, len = children.length; i < len; i++) {
				dom.appendChild(children[0]);
			}
		} else if (children.constructor === HTMLCollection) {
			for (i = 0, len = children.length; i < len; i++) {
				dom.appendChild(children[0]);
			}
		} else if (children.constructor === $){
			for (i = 0, len = children.length; i < len; i++) {
				dom.appendChild(children[i]);
			}
		} else {
			for (i = 0, len = children.length; i < len; i++) {
				dom.appendChild(children[i]);
			}
		}
		return this;
	};

    /**
     * prepend element to this.dom
     * @param {nodeList|HTMLCollection|morn.init} children
     * @returns {morn.init}
     */
	$.prototype.prepend = function(children) {
		var dom,
            i,
            len;
		if (this.dom.length > 0) {
			dom = this.dom[0];
		} else {
			return this;
		}

		if (typeof(children) === 'string') {
			var _children = $($.createDom(children));
			for (i = 0, len = _children.length; i < len; i++) {
				dom.insertBefore(_children[0], dom.firstChild);
			}		
		} else if (children.constructor === NodeList) {
            for (i = 0, len = children.length; i < len; i++) {
                dom.insertBefore(children[0], dom.firstChild);
            }
        } else if (children.constructor === HTMLCollection) {
            for (i = 0, len = children.length; i < len; i++) {
                dom.insertBefore(children[0], dom.firstChild);
            }
        } else if (children.constructor === $){
            for (i = 0, len = children.dom.length; i < len; i++) {
                dom.appendChild(children.dom[i]);
            }
        } else if (!children.length){
            dom.insertBefore(children, dom.firstChild);
        } else {
            for (i = 0, len = children.length; i < len; i++) {
                dom.insertBefore(children[i], dom.firstChild);
            }
        }
		return this;
	};

    /**
     * hide element
     * @returns {morn.init}
     */
	$.prototype.hide = function() {
		for (var i = 0; i < this.dom.length; i++) {
			this.dom[i].style.display = 'none';
		}
		return this;
	};

    /**
     * show element
     * @returns {morn.init}
     */
	$.prototype.show = function() {
		for (var i = 0; i < this.dom.length; i++) {
			this.dom[i].style.display = '';
		}
		return this;
	};

    /**
     * return next element;
     * @returns {morn.init}
     */
	$.prototype.next = function() {
		var dom = [],
			next,
            len,
            i;
		if (document.documentElement.previousSibling !== undefined) {
			for (len = this.dom.length, i = 0; i < len; i++) {
				if (next = this.dom[i].nextElementSibling) {
					dom.push(this.dom[i].nextElementSibling);
				}
			}
		} else {
			for (len = this.dom.length, i = 0; i < len; i++) {
				next = this.dom[i].nextSibling;
				while(next && next.nodeType !== 1) {
					next = next.nextSibling;
				}
				if (next && next.nodeType !== 1) {
					dom.push(next);
				}
			}
		}

		this.dom = dom;
		return this;
	};

    /**
     * return previous element
     * @returns {morn.init}
     */
	$.prototype.prev = function() {
		var dom = [],
			prev;
		if (document.documentElement.previousSibling !== undefined) {
			for (var len = this.dom.length, i = 0; i < len; i++) {
				if (prev = this.dom[i].previousElementSibling) {
					dom.push(this.dom[i].previousElementSibling);
				}
			}
		} else {
			for (var len = this.dom.length, i = 0; i < len; i++) {
				prev = this.dom[i].nextSibling;
				while(prev && prev.nodeType !== 1) {
					prev = prev.previousSibling;
				}
				if (prev && prev.nodeType !== 1) {
					dom.push(prev);
				}
			}
		}
		this.dom = dom;
		return this;
	};

    /**
     * remove element.
     */
	$.prototype.remove = function() {
		for (var i = 0; i < this.dom.length; i++) {
			this.dom[i].parentElement.removeChild(this.dom[i]);
		}
		// prevent memory leaking for ie
		this.dom.length = 0;
	};

    /**
     * return the number of elements
     * @returns {Number}
     */
	$.prototype.count = function() {
		return this.dom.length;
	};

    /**
     * return element's children.
     * if typeof i == number, return the element on the position i;
     * if typeof i == string, parse the string name ,and select it from the children;
     * @param {Number|string} i
     * @returns {morn.init}
     */
	$.prototype.children = function(i) {
		if (i !== undefined) {
			if (typeof i === 'string') {
				return $.analyse($.parse(i).slice(1), this.dom[0]);
			} else {
				return $(this.get(i));
			}
		} else {
			if (this.dom[0] !== undefined) {
				return $(this.dom[0].children);
			} else {
				return undefined;
			}
		}
	};

    /**
     * get element on the position index.
     * @param {Number} index
     * @returns {node}
     */
	$.prototype.get = function(index) {
		return this.dom[index];
	};

    /**
     * get element on the position index and returns a morn.init object.
     * @param {Number} index
     * @returns {morn.init}
     */
	$.prototype.el = function(index) {
		return $(this.dom[index]);
	};

    /**
     * apply function on the nodes.
     * @param {Function} func
     */
	$.prototype.forEach = function(func) {
		for (var i = 0, len = this.dom.length; i < len; i++) {
			func.call(this.dom[i], this.dom[i], i);
		}
	};

    /**
     * return parent;
     * @returns {morn.init}
     */
	$.prototype.parent = function() {
		return $(this.dom[0].parentElement);
	};

	/**
	 * empty splice function
	 */
	$.prototype.splice = function() {
		//empty function
		//browser's duck typing will take this object as an array
	};
});
'use strict';

define('dom.ready', ['core'], function($){
	var documentReady = false,
		startup = [];
	
	var onDomReady = function(){
		if (documentReady === false) {
			try {
			    document.documentElement.doScroll('left');
			} catch( error ) {
			    setTimeout( arguments.callee, 50);
			    return ;
			}
			for (var i = 0, len = startup.length; i < len; i++) {
				startup[i]();
			}
		}
		documentReady = true;
	};

	/**
	 * document ready listerner
	 * @param  {Function} func
	 */
	$.ready = (function() {
		if ($.browser.browser === 'MSIE' && $.browser.version < 9){
			$.addEventHandler(document, 'readystatechange',function() {
				if (document.readyState == 'complete') {
					document.onreadystatechange = null;
					onDomReady();
				}
			});
			return function (func) {
				startup.push(func);
			};
		} else {
			return function (func) {
				$.addEventHandler(document, 'DOMContentLoaded', func);
			};
		}
	}());

});
'use strict';

define('event', ['core', 'browser'], function($) {

	/**
	 * return a event proxy object
	 * @return {Object} event proxy
	 */
	$.proxy = function() {
		if (!(this instanceof $.proxy)) {
			return new $.proxy();
		}
		this._callbacks = {};
	};

	/**
	 * add event proxy
	 * @param  {String} event   event name
	 * @param  {Function} handler handler that will be fired
	 */
	$.proxy.prototype.on = function(event, handler) {
		this._callbacks[event] = this._callbacks[event] || [];
		this._callbacks[event].push(handler);
	};

	/**
	 * alias for add event proxy
	 */
	$.proxy.prototype.bind = $.proxy.prototype.on;

	/**
	 * alias for add event proxy
	 */
	$.proxy.prototype.addEventHandler = $.proxy.prototype.on;

	/**
	 * alias for add event proxy
	 */
	$.proxy.prototype.addListener = $.proxy.prototype.on;

	/**
	 * remove event listener from event
	 * @param  {String} event   event name
	 * @param  {Function} handler the function to be removed
	 */
	$.proxy.prototype.off = function(event, handler) {
		var handlers = this._callbacks[event];
		if (handlers) {
			for (var i = this._callbacks.length - 1; i >= 0; i--) {
				if (handlers[i] === handler) {
					this._callbacks.splice(i, 1);
				}
			};
		}
	};

	/**
	 * alias for remove event proxy
	 */
	$.proxy.prototype.removeListener = $.proxy.prototype.off;

	/**
	 * alias for remove event proxy
	 */
	$.proxy.prototype.unbind = $.proxy.prototype.off;

	/**
	 * alias for remove event proxy
	 */
	$.proxy.prototype.removeEventListener = $.proxy.prototype.off;

	/**
	 * invoke the events
	 * @param  {String } event event name
	 * @param  {Array} datas in pattern of trigger(event, param1, param2, param3)
	 */
	$.proxy.prototype.trigger = function(event, datas) {
		var args = Array.prototype.slice.call(arguments, 1),
			len, i,
			handlers = this._callbacks[event];
		if (handlers) {
			for (i = 0, len = handlers.length; i < len; i++) {
				handlers[i].apply(this, args);
			}
		}
	};

	/**
	 * alias for invoke event
	 */
	$.proxy.prototype.fire = $.proxy.prototype.trigger;
	
	$.event = function(e) {
		return $.event.prototype.init(e || window.event);
	};

	$.event.prototype.init = function(e) {
		this.e = e;
		return this;
	};

	$.event.prototype.init.prototype = $.event.prototype;

	$.event.prototype.preventDefault = function () {
		if (this.e.preventDefault) {
			this.e.preventDefault();
		}
		this.e.returnValue = false;
	};

	$.event.prototype.stopPropagation = function () {
		if (this.e.stopPropagation) {
			this.e.stopPropagation();
		}
		this.e.cancelBubble = true;
	};

	$.event.prototype.target = function () {
		return this.e.target || this.e.srcElement || document;
	};

	$.event.prototype.postion = function() {
		var pos = [0, 0];
		if (this.e.pageX || this.e.pageY) {
			pos[0] = this.e.pageX;
			pos[1] = this.e.pageY;
		} else if (this.e.clientX || this.e.clientY) {
			pos[0] = this.e.clientX + document.body.scrollLeft + document.documentElement.scrollLeft;
			pos[1] = this.e.clientY + document.body.scrollTop + document.documentElement.scrollTop;
		}
		return pos;
	};

	$.event.prototype.relatedTarget = function() {
		return this.e.relatedTarget || this.e.fromElement || this.e.toElement;
	};

	/**
	 * return which mouse button is clicked
	 * @return {[type]} [description]
	 */
	$.event.prototype.which = function() {
		if (this.e.which !== undefined) {
			return this.e.which;
		} else if (this.e.button !== undefined) {
			if (this.e.button & 1) return 0;      // Left
			else if (this.e.button & 4) return 1; // Middle
			else if (this.e.button & 2) return 2; // Right
			else return -1;
		} else {
			return -1;
		}
	};

	$.prototype.delegate = function (event, selector, func) {
		var tokens = $.parse(selector);
		this.addEventHandler(event, function(e){
			if ($.is($.event(e).target(), tokens)) {
				func.call(this);
			}
		});
	};

	$.prototype.click = function(func) {
		this.addEventHandler('click', func);
		return this;
	};

	$.prototype.contextmenu = function(func) {
		this.addEventHandler('contextmenu', func);
		return this;
	};

	$.prototype.mousemove = function(func) {
		this.addEventHandler('mousemove', func);
		return this;
	};

	$.prototype.mousedown = function(func) {
		this.addEventHandler('mousedown', func);
		return this;
	};

	$.prototype.mouseup = function(func) {
		this.addEventHandler('mouseup', func);
		return this;
	};

	$.prototype.mouseover = function(func) {
		this.addEventHandler('mouseover', func);
		return this;
	};

	$.prototype.mouseout = function(func) {
		this.addEventHandler('mouseout', func);
		return this;
	};

	$.prototype.mousewheel = function(func) {
		this.addEventHandler('mousewheel', func);
		return this;
	};

	$.prototype.dblclick = function(func) {
		this.addEventHandler('dblclick', func);
		return this;
	};

	$.prototype.load = function(func) {
		this.addEventHandler('load', func);
		return this;
	};

	$.prototype.error = function(func) {
		this.addEventHandler('error', func);
		return this;
	};

	$.prototype.unload = function(func) {
		this.addEventHandler('unload', func);
		return this;
	};

	$.prototype.resize = function(func) {
		this.addEventHandler('resize', func);
		return this;
	};

	$.prototype.keydown = function(func) {
		this.addEventHandler('keydown', func);
		return this;
	};

	$.prototype.keyup = function(func) {
		this.addEventHandler('keyup', func);
		return this;
	};

	$.prototype.keypress = function(func) {
		this.addEventHandler('keypress', func);
		return this;
	};

	$.prototype.submit = function(func) {
		this.addEventHandler('submit', func);
		return this;
	};

	$.prototype.blur = function(func) {
		this.addEventHandler('blur', func);
		return this;
	};

	$.prototype.select = function(func) {
		this.addEventHandler('select', func);
		return this;
	};

	$.prototype.change = function(func) {
		this.addEventHandler('change', func);
		return this;
	};

	$.prototype.focus = function(func) {
		this.addEventHandler('focus', func);
		return this;
	};

	$.prototype.dragstart = function(func) {
		this.addEventHandler('dragstart', func);
		return this;
	};

	$.prototype.drag = function(func) {
		this.addEventHandler('drag', func);
		return this;
	};

	$.prototype.dragend = function(func) {
		this.addEventHandler('dragend', func);
		return this;
	};

	/**
	 * hash change event Listener
	 * @param  {Function} func event to be add
	 */
	$.hashchange = function(func) {
		if ($.browser.browser === 'IE' && $.browser.version < 9) {
			if ($(document).data('hashEvent') !== null) {
				throw new Error("IE8/7/6 only can only bind one callback.");
			} else {
				$(document).data('hashEvent', true);
				var preHash = window.location.hash;
				setInterval(function(){
					if (prehash !== window.location.hash) {
						func();
						preHash = window.location.hash;
					}
				}, 150);
			}
		} else {
			$.addEventHandler(window, 'focus', func);
		}
		return this;
	};

});
'use strict';

/**
 * lexer module.
 * used for parsing selector string and select node from document.
 * relies on core, selector, dom.
 */
define('lexer', ['core', 'selector', 'dom'], function($) {
    /**
     * Stream Class to contain selector text.
     * @param {string} text selector string
     * @returns {object}
     */
    function Stream(text) {
        this.number = 0;
        this.pos = 0;
        this.seletor = text;
    }

    Stream.EOL = -1;

    /**
     * get one char in selector and move forward the position.
     * if it is the end of selector, return Stream.EOL.
     * @returns {string}
     */
    Stream.prototype.read = function() {
        if (this.pos < this.seletor.length) {
            return this.seletor.charAt(this.pos++);
        } else {
        	this.pos++;
            return Stream.EOL;
        }
    };

    /**
     * set current postion backward a char.
     */
    Stream.prototype.putBack = function() {
        if (this.pos !== 0) {
            this.pos--;
        }
    };

    /**
     * get one char in selector but the postion will not move.
     * if it is the end of selector, return Stream.EOL.
     * @returns {string}
     */
    Stream.prototype.pick = function() {
		if (this.pos < this.seletor.length) {
			return this.seletor.charAt(this.pos);
		} else {
			return Stream.EOL;
		}
	};

    /**
     * test whether a string matches selector from current position.
     * @param {string} matchString
     * @returns {boolean}
     */
	Stream.prototype.match = function(matchString) {
		return this.seletor.indexOf(matchString, this.pos) === this.pos;
	};

    /**
     * skip white space from current position till the end or other char.
     */
	Stream.prototype.eatWhite = function() {
		while (this.pick() === ' ') {
			this.read();
		}
	};

	var type = {};

    /**
     * test whether a char is in a ascii range.
     * @param num
     * @param min
     * @param max
     * @returns {boolean}
     */
	type.inRange = function (num, min, max) {
		return (num >= min && num <= max);
	};

    /**
     * check number
     * @param c
     * @returns {boolean}
     */
	type.isNum = function(c) {
		return (type.inRange(c, '0', '9'));
	};

    /**
     * check letter
     * @param c
     * @returns {boolean}
     */
	type.isAlpha = function(c) {
		return (type.inRange(c, 'a', 'z') || type.inRange(c, 'A', 'Z'));
	};

    /**
     * check if a char is '\t' or whitespace
     * @param c
     * @returns {boolean}
     */
	type.isWhite = function(c) {
		return (c === '\t' || c === ' ');
	};

    /**
     * token types
     * @type {{WHITE: number, ID: number, CLASS: number, TAG: number, ALL: number, FAKE: number, SLIBING: number, CHILDREN: number, UNKNOWN: number}}
     */
	var Token = {
		WHITE         : 0,
		ID            : 1,
		CLASS         : 2,
		TAG           : 3,
		ALL           : 4,
		FAKE          : 5,
        SLIBING       : 6,
        CHILDREN      : 7,
        ATTRIBUTE     : 8,
        ATTRIBUTEVALUE: 9,
		UNKNOWN       : 10
	};

	$.Token = Token;

    /**
     * indicates current state when parsing selector.
     * @type {{START: number, INWHITE: number, INID: number, INCLASS: number, INTAG: number, INFAKECLASS: number, DONE: number}}
     */
	var State = {
		START: 0,
		INWHITE: 1,
		INID:    2,
		INCLASS: 3,
		INTAG:   4,
		INFAKECLASS: 5,
		INATTRIBUTE: 6,
		INATTRIBUTEVALUE: 7,
		DONE:    16
	};

    /**
     * state stack
     * @param {State} startup
     */
	function States(startup) {
		this.states = [startup];
	}

    /**
     * push a state to the top.
     * @param {State} state
     */
	States.prototype.push = function(state) {
		this.states.push(state);
	};

    /**
     * change the top state
     * @param {State} state
     */
	States.prototype.change = function(state) {
		this.states.pop();
		this.states.push(state);
	};

    /**
     * remove the top state and return it.
     * @returns {*}
     */
	States.prototype.pop = function() {
		return this.states.pop();
	};

    /**
     * return the top of state stack.
     * @returns {State}
     */
	States.prototype.top = function() {
		return this.states[this.states.length - 1];
	};

    /**
     * a parser to parse selector
     * @param {string} selector
     * @returns {object[]} tokens
     * @example
     * var tokens = $.parse('tag .class #id');
     * console.log(tokens); // {{text:'tag',type:3},{text:'', type:0},{text:'class',type:2},{text:'', type:0},{text:'id',type:1}}
     */
	$.parse = function (selector) {
		var currentToken = null,
			tokens       = [],
			c            = '',
			buffer       = '',
			state        = new States(State.START),
			save         = true,
			_saveToken   = false,
			stream       = new Stream(selector);

        /**
         * add token to tokens[], reset the _saveToken
         * @param {string} buffer
         * @param {token} token
         */
		function addToken (buffer, token) {
			tokens.push({text: buffer, type: token});
			_saveToken = false;
		}

        /**
         * set currentToken. token will be saved at the loop circle end by addToken().
         * @param {token} token
         */
		function saveToken(token) {
			currentToken = token;
			_saveToken = true;
		}

        /**
         * backword position in stream.
         */
		function putBack(){
			stream.putBack();
			save = false;
		}

        // loop to get tokens array.
		while (state.top() !== State.DONE) {

			c = stream.read();
			save = true;
			switch (state.top()) {

				case State.START:
					if (type.isAlpha(c)) {
						state.push(State.INTAG);
					} else if (c === '.') {
						save = false;
						state.push(State.INCLASS);
					} else if (c === '#') {
						save = false;
						state.push(State.INID);
					} else if (c === '*') {
						saveToken(Token.ALL);
					} else if (type.isWhite(c)) {
						state.push(State.INWHITE);
                    } else if (c === '>') {
						save = false;
						stream.eatWhite();
                        saveToken(Token.CHILDREN);
                    } else if (c === '~') {
						save = false;
						stream.eatWhite();
                        saveToken(Token.SLIBING);
                    } else if (c === Stream.EOL) {
						state.change(State.DONE);
					} else if (c === '[') {
						save = false;
						state.push(State.INATTRIBUTE);
					} else if (c === ':') {
						save = false;
						stream.eatWhite();
						state.push(State.INFAKECLASS);
					}
					break;

				case State.INTAG:
					if (!type.isAlpha(c) && !type.isNum(c) && c !== '-') {
						putBack();
						saveToken(Token.TAG);
						state.pop();
					}
					break;

				case State.INCLASS:
					if (!type.isAlpha(c) && !type.isNum(c) && c !== '-') {
						putBack();
						saveToken(Token.CLASS);
						state.pop();
					}
					break;

				case State.INID:
					if (!type.isAlpha(c) && !type.isNum(c) && c !== '-') {
						putBack();
						saveToken(Token.ID);
						state.pop();
					}
					break;

				case State.INWHITE:
					if (!type.isWhite(c)) {
						putBack();
						saveToken(Token.WHITE);
						state.pop();
					}
					save = false;
					break;

				case State.INATTRIBUTE:
					if (c === ']' || c === Stream.EOL) {
						save = false;
						saveToken(Token.ATTRIBUTE);
						state.pop();
					} else if (c === '=') {
						save = false;
						saveToken(Token.ATTRIBUTE);
						state.change(State.INATTRIBUTEVALUE);
					} else if (type.isWhite(c)) {
						save = false;
					}
					break;

				case State.INATTRIBUTEVALUE:
					if (c === ']' || c === Stream.EOL) {
						save = false;
						saveToken(Token.ATTRIBUTEVALUE);
						state.pop();
					} else if (type.isWhite(c)) {
						save = false;
					}
					break;

				case State.INFAKECLASS:
					if (!type.isAlpha(c)) {
						putBack();
						saveToken(Token.FAKE);
						state.pop();
					}
                    break;
				default:
                    break;
					//never reaches here;
			}

			if (save === true) {
				buffer += c;
                if (buffer.length > 100) {
                    return tokens;
                }
			}

			if (_saveToken) {
				addToken(buffer, currentToken);
				if (tokens.length > 100) {
					return $.analyse(tokens);
				}
				buffer = '';
			}
		}

		return tokens;
	};

    /**
     * parse selector to tokens and get doms.
     * @param {string} selector
     * @param {nodeList} scope
     * @returns {morn.init}
     */
	$.parseSelector = function (selector, scope) {
		return $.analyse($.parse(selector), scope);
	};

    /**
     * select nodes in document.
     * @param {tokens[]} tokens
     * @param {nodeList} scope
     * @returns {morn.init}
     */
    $.analyse = function(tokens, scope) {
        var tmp,
            result = null,
			lastResult = scope || null,
			doWithCurrent = false,
			iter,
			resultlen;

        /**
         * when meets Token.ID, Token.CLASS, Token.TAG,
         * if doWithCurrent == true, select nodes from lastResult,
         * else select nodes from document in scope of lastResult.
         * when meets Token.FAKE, Token.CHILDREN, Token.SILIBING
         * select nodes from lastResult.
         */
		for (var len = tokens.length, i = 0; i < len; i++) {
			switch(tokens[i].type) {
				case Token.WHITE:
					doWithCurrent = false;
					break;

				case Token.ID:
					if (doWithCurrent === true) {
						for (iter = 0, resultlen = lastResult.length; iter < resultlen; iter++) {
							if (lastResult[iter].id === tokens[i].text) {
								result = [lastResult[iter]];
								break;
							}
						}
					} else {
						result = $.id(tokens[i].text, scope);
						if (result === null) {
							result = [];
						}
					}
					doWithCurrent = true;
					break;

				case Token.CLASS:
					if (lastResult !== null) {
						result = [];
						if (doWithCurrent === true) {
							for (iter = 0, resultlen = lastResult.length; iter < resultlen; iter++) {
								if ($.hasClass(lastResult[iter], tokens[i - 1].text)) {
									result.push(lastResult[iter]);
								}
							}
						} else {
							for (iter = 0, resultlen = lastResult.length; iter < resultlen; iter++) {
                                tmp = $['class'](tokens[i].text, lastResult[iter]);
								for (var index = 0, l = tmp.length; index < l; index++) {
									result.push(tmp[index]);
								}
							}
						}
					} else {
						result = $['class'](tokens[i].text);
					}
					doWithCurrent = true;
					break;

				case Token.TAG:
					if (lastResult !== null) {
						result = [];
						if (doWithCurrent === true) {
							for (iter = 0, resultlen = lastResult.length; iter < resultlen; iter++) {
								if (lastResult[iter].tagName.toLowerCase() === tokens[i].text) {
									result.push(lastResult[iter]);
								}
							}
						} else {
							for (iter = 0, resultlen = lastResult.length; iter < resultlen; iter++) {
								tmp = $.tag(tokens[i].text, lastResult[iter]);
								for (var index = 0, l = tmp.length; index < l; index++) {
									result.push(tmp[index]);
								}
							}
						}

					} else {
						result = $.tag(tokens[i].text);
					}
					doWithCurrent = true;
					break;

                case Token.SLIBING:
                    if (lastResult !== null) {
                        var existNode = [],
                            node,
                            nodeIndex,
                            existNodeLen,
                            slibings = [];

                        for (iter = 0, resultlen = lastResult.length; iter < resultlen; iter++) {
                            if (! existIn(lastResult[iter].parentElement, existNode)) {
                                existNode.push(lastResult[iter].parentElement);
                                slibings = slibings.concat(Array.prototype.slice.call(lastResult[iter].parentElement.children, 0));
                            }
                        }
                        result = slibings;
                        doWithCurrent = true;
                    } else {
                        result = [];
                    }
                    break;

                case Token.CHILDREN:
                    if (lastResult !== null) {
                        result = [];

                        for (iter = 0, resultlen = lastResult.length; iter < resultlen; iter++) {
                            result = result.concat(Array.prototype.slice.call(lastResult[iter].children, 0));
                        }

                        doWithCurrent = true;
                    } else {
                        result = [];
                    }
                    break;

                case Token.ATTRIBUTE:
                	if (lastResult !== null) {
                		result = [];
                		if (tokens[i + 1] && tokens[i + 1].type === Token.ATTRIBUTEVALUE) {

                			var attributeValue = tokens[i + 1].text;
	                        for (iter = 0, resultlen = lastResult.length; iter < resultlen; iter++) {
	                        	if (lastResult[iter].getAttribute(tokens[i].text) === attributeValue) {
	                        		result.push(lastResult[iter]);
	                        	}
	                        }
	                        i++;

                		} else {

                        	for (iter = 0, resultlen = lastResult.length; iter < resultlen; iter++) {
	                        	if (lastResult[iter].getAttribute(tokens[i].text) !== null) {
	                        		result.push(lastResult[iter]);
	                        	}
	                        }
	                        
                		}
	
                	} else {
                		result = [];
                	}

				case Token.FAKE:
					if (lastResult !== null) {
						var fake = tokens[i].text;

						if (fake === 'odd') {

							result = [];
							for (iter = 0, resultlen = lastResult.length; iter < resultlen; iter++) {
								if (iter % 2 === 0) {
									result.push(lastResult[iter]);
								}
							}

						} else if (fake === 'even') {
							result = [];
							for (iter = 0, resultlen = lastResult.length; iter < resultlen; iter++) {
								if (iter % 2 === 1) {
									result.push(lastResult[iter]);
								}
							}

						} else if (fake === 'first-child') {
								result = [lastResult[0]];

						} else if (fake === 'last-child') {
								result = [lastResult[lastResult.length - 1]];
						}

					} else {
						result = [];
					}
					break;
				default:
			}

            if (result.length === 0 && lastResult !== null) {
                return result;
            }

			lastResult = result;
		}

		return result;
	};

    /**
     * check whether if a node in nodeList
     * @param {node} node
     * @param {nodeList} nodelist
     * @returns {boolean}
     */
    function existIn(node, nodelist) {
        for (var nodeIndex = 0, existNodeLen = nodelist.length; nodeIndex < existNodeLen; nodeIndex++) {
            if (nodelist[nodeIndex] === node) {
                return true;
            }
        }
        return false;
    }
});
'use strict';
/**
 * promise module.
 * a realization for a promise.
 */
define('promise', ['core'], function($) {
    /**
     * there are three possibly states in promise objects;
     * @type {number}
     */
	var RESOLVED = 0,
		REJECTED = 1,
		PENDING  = 2;

	function emptyFunc() { }

    /**
     * return a new promise object
     * @returns {morn.promise.init}
     */
	$.promise = function() {
		return new $.promise.prototype.init();
	};

    /**
     * constructor for a promise object.
     */
	$.promise.prototype.init = function() {
		this.status = PENDING;
		this.error = undefined;
		this.callbacks = [];
		this.catchs = [];
		this.result = undefined;
	};

	$.promise.prototype.init.prototype = $.promise.prototype;

    /**
     * add callback function to callbacks,
     * @param {Function} success
     * @param {Function} failed
     * @returns {morn.promise}
     */
	$.promise.prototype.then = function(success, failed) {
		this.callbacks.push(function (value) {
			if (this.status === PENDING) {
				try {
					return success(value);
				} catch (e) {
					this.error = e;
					this.status = REJECTED;
					if (failed) {
						failed(e);
					}
					for (var j = 0, len = this.catchs.length; j < len; j++) {
						this.catchs[j].call(this, e);
					}
					return;
				}
			} else if (this.status === REJECTED) {
				if (failed) {
					failed(this.error);
				}
			}
		});

		if (this.status === RESOLVED) {
			success(this.result);
		} else if (this.status === REJECTED) {
			if (failed) {
				failed(this.error);
			}
		}
		return this;
	};

    /**
     * invoke success callbacks of promise
     * @param result
     * @returns {morn.promise}
     */
	$.promise.prototype.resolve = function(result) {
		this.result = result;
		this._complete(result);
		return this;
	};

    /**
     * invoke fail callbacks of promise. once a fail function runs,
     * the callbacks remains wont't be invoked.
     * @param err
     * @returns {morn.promise}
     */
	$.promise.prototype.reject = function(err) {
		this.status = REJECTED;
		this.error = err;
		this._complete(null);
		return this;
	};

    /**
     * add catch to promise.once error occurs, this function will always run.
     * @param {Function} func
     */
	$.promise.prototype['catch'] = function(func) {
		if (this.status === REJECTED) {
			func.call(this, this.error);
		} else {
			this.catchs.push(func);
		}
	};

    /**
     * invoke callbacks in order.
     * @param result
     * @private
     */
	$.promise.prototype._complete = function(result) {
		var i = 0, func, p;
		while (func = this.callbacks[i++]) {
			if (this.status === PENDING) {
				p = func.call(this, result);
				if (p !== undefined && p.constructor === $.promise) {
					p.callbacks = this.callbacks.slice(i);
					p.result = this.result;
					this.callbacks.length = 0;
				}
			}
		}
		this.catchs.length = 0;
		this.status = RESOLVED;
	};
});
'use strict';

/**
 * selector module.
 * wraps element getting api.
 * find() relies on lexer module.
 */
define('selector', ['core'], function($){

    /**
     * select by id
     * @param {string} id
     * @param {node} scope
     * @returns {HTMLElement}
     */
	$.id = function(id, scope) {
		if (scope) {
			return scope.getElementById(id);
		} else {
			return document.getElementById(id);
		}
	};

    /**
     * select by tag name
     * @param {string} tag
     * @param {node} scope
     * @returns {NodeList}
     */
	$.tag = function(tag, scope) {
		if (scope) {
			return scope.getElementsByTagName(tag);
		} else {
			return document.getElementsByTagName(tag);
		}
	};

    /**
     * select by class name.
     */
	$['class'] = (function() {
		if (document.getElementsByClassName) {
			return function(classStyle, scope) {
				var dom = scope || document;
				return dom.getElementsByClassName(classStyle);
			};
		} else if (document.querySelector) {
			return function(classStyle, scope) {
				var dom = scope || document;
				return dom.querySelectorAll('.' + classStyle);
			};
		} else return function(classStyle, scope) {
			var result = [],
				dom = scope || document,
				elements = dom.getElementsByTagName('*');
			for (var i = 0, len = elements.length; i < len; i++) {
				if ((' ' + elements[i].className + ' ').indexOf(classStyle) !== -1) {
					result.push(elements[i]);
				}
			}
			return result;
		};
	}());

    /**
     * select nodes under the scope of current node.
     * @param selector
     * @returns {morn.init}
     */
	$.prototype.find = function(selector) {
		if (selector) {
			return new $.prototype.init($.parseSelector(selector), this.dom);
		}
	};

});
'use strict';

define('transform', ['core'], function($){
	var transform = function(element, matrix) {
		this.element = element;
		this.matrix = matrix;
	};

	transform.prototype.rotate = function(degree){
		var degree = 3.1415926 * degree / 180,
			sin = Math.sin(degree),
			cos = Math.cos(degree),
			tMatrix = [
						cos, -sin, 0,
						sin, cos , 0,
						0 , 0, 1
					];
		this.matrix = multiplyBy(this.matrix, tMatrix);
		return this;
	};

	transform.prototype.scale = function(ratio){
		var tMatrix = [
				ratio, 0, 0,
				0, ratio, 0,
				0 , 0, 1
			];
		this.matrix = multiplyBy(this.matrix, tMatrix);
		return this;
	};

	transform.prototype.scaleX = function(ratio){
		var tMatrix = [
				ratio, 0, 0,
				0, 1, 0,
				0 , 0, 1
			];
		this.matrix = multiplyBy(this.matrix, tMatrix);
		return this;
	};

	transform.prototype.scaleY = function(ratio){
		var tMatrix = [
				1, 0, 0,
				0, ratio, 0,
				0 , 0, 1
			];
		this.matrix = multiplyBy(this.matrix, tMatrix);
		return this;
	};

	transform.prototype.translate = function(x ,y){
		var tMatrix = [
				1, 0, x,
				0, 1, y,
				0 , 0, 1
			];
		this.matrix = multiplyBy(this.matrix, tMatrix);
		return this;
	};

	transform.prototype.translateX = function(x){
		var tMatrix = [
				1, 0, x,
				0, 1, 0,
				0 , 0, 1
			];
		this.matrix = multiplyBy(this.matrix, tMatrix);
		return this;
	};

	transform.prototype.translateY = function(y){
		var tMatrix = [
				1, 0, 0,
				0, 1, y,
				0 , 0, 1
			];
		this.matrix = multiplyBy(this.matrix, tMatrix);
		return this;
	};

	transform.prototype.end = function() {
		this.element.dom[0].style.transform = 'matrix(' + this.matrix[0].toFixed(9) + ',' + this.matrix[3].toFixed(9) + ',' + this.matrix[1].toFixed(9) + ',' + this.matrix[4].toFixed(9) + ',' + this.matrix[2].toFixed(9) + ',' + this.matrix[5].toFixed(9) + ')';
		return this.element;
	};

	function multiplyBy(origin, matrix) {
		var i, j, result = new Array(9);
		for (i = 0; i < 3; i++) {
			for (j = 0; j< 3; j++) {
				result[3 * i + j] = origin[3 * i + 0] * matrix[j + 0] +
									origin[3 * i + 1] * matrix[j + 3] +
									origin[3 * i + 2] * matrix[j + 6];
			}
		}
		return result;
	}

	$.prototype.matrix = function() {
		var m = this.getComputedStyle().transform,
			matrix;
		if (m === null || m === 'none') {
			matrix = [
						1, 0, 0,
						0, 1, 0,
						0, 0, 1
					];
		} else {
			var reg = /[-+]?[0-9]*\.?[0-9]+/g,
				result,
				mx = [];
			while ((result = reg.exec(m)) !== null) {
				mx.push(parseFloat(result[0]));
			}
			matrix = [mx[0], mx[2], mx[4], mx[1], mx[3], mx[5], 0, 0, 1];
		}
		return new transform(this, matrix);
	};

});
'use strict';
define('type', ['core'], function($){

	$.isNode = function(o){
		return (
			typeof Node === "object" ? o instanceof Node :
			o && typeof o === "object" && typeof o.nodeType === "number" && typeof o.nodeName==="string"
		);
	};

	$.isElement = function(o){
		return (
			typeof HTMLElement === "object" ? o instanceof HTMLElement : //DOM2
			o && typeof o === "object" && o !== null && o.nodeType === 1 && typeof o.nodeName==="string"
		);
	};

	$.isHtmlList = function(o) {
		return (o && (o.constructor === HTMLCollection || o.constructor === NodeList));
	};

	$.toArray = function(o) {
		return Array.prototype.slice.call(o, 0);
	};
});
'use strict';

define('widget.dragger', ['core', 'dom', 'lexer'], function($) {
	/*
		opt.maxHeight
		opt.minHeight
		opt.maxWidth
		opt.minWidth
		opt.border = [true, true, true, true]
		opt.corner = [true, true, true, true]
	*/
	$.widget.prototype.resize = function (opt) {
		var options       = opt || {};
		options.maxHeight = options.maxHeight || null;
		options.minHeight = options.minHeight || null;
		options.maxWidth  = options.maxWidth || null;
		options.minWidth  = options.minWidth || null;
		options.direction = options.direction || 'all';
		options.border    = options.border || [true, true, true, true];
		options.corner    = options.corner || [true, true, true, true];
		var element       = this.dom[0];

		$.addClass(element, 'morn-resizable');

		if (options.border[0]) {
			addResizeBorderN(element);
		}
		if (options.border[1]) {
			addResizeBorderS(element);
		}
		if (options.border[2]) {
			addResizeBorderW(element);
		}
		if (options.border[3]) {
			addResizeBorderE(element);
		}
	};

	function addCornerButton (element, controller) {
		$.addEventHandler(resizer, 'mousedown', function(e){
			var startX      = e.clientX,
				startY      = e.clientY,
				startWidth  = parseInt($(element).width(),10),
				startHeight = parseInt($(element).height(),10),
				drag        = function(e) {
					element.style.width  = (startWidth + e.clientX - startX) + 'px';
					element.style.height = (startHeight + e.clientY - startY) + 'px';
				},
				release     = function() {
					$(document.documentElement).removeEventHandler('mouseup', release).removeEventHandler('mousemove', drag);
				};

			$(document.documentElement).addEventHandler('mouseup', release).addEventHandler('mousemove', drag);
		});
	}

	function addResizeBorderN (element) {
		var controller = $.createDom('<div class=\'morn-resizable-border-n\'/>');
		$(element).prepend(controller);
		$.addEventHandler(controller, 'mousedown', function(e){
			var startY      = e.clientY,
				startTop    = Math.max(parseInt($(element).rect().top, 0), 10),
				startHeight = Math.max(parseInt($(element).height(), 0), 10),
				drag        = function(e) {
					element.style.top = (startTop + e.clientY - startY) + 'px';
					element.style.height = Math.max((startHeight - e.clientY + startY), 0) + 'px';
				},
				release     = function() {
					$(document.documentElement).removeEventHandler('mouseup', release).removeEventHandler('mousemove', drag);
					$(element).removeClass('morn-resizable-resizing');
				};
			$(element).addClass('morn-resizable-resizing');
			$(document.documentElement).addEventHandler('mouseup', release).addEventHandler('mousemove', drag);
		});
	}

	function addResizeBorderS (element) {
		var controller = $.createDom('<div class=\'morn-resizable-border-s\'/>');
		$(element).append(controller);
		$.addEventHandler(controller, 'mousedown', function(e){
			var startY      = e.clientY,
				startHeight = parseInt($(element).height(), 10),
				drag        = function(e) {
					element.style.height = Math.max((startHeight + e.clientY - startY), 0) + 'px';
				},
				release     = function() {
					$(document.documentElement).removeEventHandler('mouseup', release).removeEventHandler('mousemove', drag);
					$(element).removeClass('morn-resizable-resizing');
				};
			$(element).addClass('morn-resizable-resizing');
			$(document.documentElement).addEventHandler('mouseup', release).addEventHandler('mousemove', drag);
		});
	}

	function addResizeBorderE (element) {
		var controller = $.createDom('<div class=\'morn-resizable-border-e\'/>');
		$(element).append(controller);
		$.addEventHandler(controller, 'mousedown', function(e){
			var startX     = e.clientX,
				startWidth = parseInt($(element).width(), 10),
				drag       = function(e) {
					element.style.width = Math.max((startWidth + e.clientX - startX), 0) + 'px';
				},
				release    = function() {
					$(document.documentElement).removeEventHandler('mouseup', release).removeEventHandler('mousemove', drag);
					$(element).removeClass('morn-resizable-resizing');
				};
			$(element).addClass('morn-resizable-resizing');
			$(document.documentElement).addEventHandler('mouseup', release).addEventHandler('mousemove', drag);
		});
	}

	function addResizeBorderW (element) {
		var controller = $.createDom('<div class=\'morn-resizable-border-w\'/>');
		$(element).prepend(controller);
		$.addEventHandler(controller, 'mousedown', function(e){
			var startX     = e.clientX,
				startWidth = parseInt($(element).width(), 10),
				startLeft  = parseInt($(element).rect().left,10),
				drag       = function(e) {
					element.style.left  = (startLeft + e.clientX - startX) + 'px';
					element.style.width = Math.max(startWidth - (e.clientX - startX), 0) + 'px';
				},
				release = function() {
					$(document.documentElement).removeEventHandler('mouseup', release).removeEventHandler('mousemove', drag);
					$(element).removeClass('morn-resizable-resizing');
				};
			$(element).addClass('morn-resizable-resizing');
			$(document.documentElement).addEventHandler('mouseup', release).addEventHandler('mousemove', drag);
		});
	}

	$.widget.resizeController = function(element, controller, opt) {
		// body...
	};

});
'use strict';

define('widget.scroll', ['core', 'event', 'dom'], function($) {
	$.widget.prototype.scroll = function(opt) {
		var option = opt || {};
		return this.forEach(function(ele){
				var contentTop = 0,
					scrollbar = $.createDom('<div class="scroll-bar"><div class="track"></div><div class="thumb"></div></div><div class="inner"></div>');
				$(scrollbar[1]).append(ele.childNodes);
				var wrap = $(ele).append(scrollbar),
					inner = $['class']('inner', ele)[0],
					thumb = $['class']('thumb', ele)[0],
					track = $['class']('track', ele)[0],
					mouseStartY,
					_thumbTop = 0,
					thumbTop = 0,
					contentHeight = parseInt(window.getComputedStyle(inner).height),
					frameHeight = parseInt($(wrap).getComputedStyle().height),
					totalHeight = contentHeight - frameHeight,
					thumbHeight = frameHeight * frameHeight / totalHeight ,
					trackHeight = frameHeight - thumbHeight;
				
				function nil(e){
					var event = $.event(e);
					e.preventDefault();
				}
				
				function startDrag(e) {
					mouseStartY = e.screenY;
					$(document.documentElement).addEventHandler('dragstart', nil);
					$(document.documentElement).addEventHandler('selectstart', nil);
					$(document.documentElement).addEventHandler('mousemove', drag);
					$(document.documentElement).addEventHandler('mouseup', endDrag);
				}

				function drag(e) {
					var change = e.screenY - mouseStartY;
					_thumbTop = change + thumbTop;
					if (_thumbTop > trackHeight) {
						_thumbTop = trackHeight;
					} else if (_thumbTop < 0){
						_thumbTop = 0;   
					}
					contentTop = -(_thumbTop / trackHeight) * totalHeight;
					inner.style.top = contentTop + 'px';
					thumb.style.top = _thumbTop + 'px';
				}

				function endDrag() {
					$(document.documentElement).removeEventHandler('mousemove',drag);
					thumbTop = _thumbTop;
					$(document.documentElement).removeEventHandler('mouseup',endDrag);
					$(document.documentElement).removeEventHandler('dragstart', nil);
					$(document.documentElement).removeEventHandler('selectstart', nil);
				}
				
				function scrollTo(e) {
					thumbTop = e.layerY - thumbHeight / 2;
					if (thumbTop < 0) {
						thumbTop = 0;
					} else if (thumbTop > trackHeight) {
						thumbTop = trackHeight;
					}
					contentTop = -(thumbTop / frameHeight) * totalHeight;
					inner.style.top = contentTop.toFixed(0) + 'px';
					thumb.style.top = thumbTop + 'px';
				}

				function resize() {
					contentHeight = parseInt(window.getComputedStyle(inner).height);
					frameHeight = parseInt($(wrap).getComputedStyle().height);
					totalHeight = contentHeight - frameHeight;
					thumbHeight = frameHeight * frameHeight / totalHeight;
					trackHeight = frameHeight - thumbHeight;
				}
				
				$(track).addEventHandler('click', scrollTo);
				
				$(thumb).addEventHandler('mousedown', startDrag);

				$(wrap).addEventHandler('resize', resize);

				$(wrap).addEventHandler('mousewheel', function(e){
					contentTop += -e.deltaY;
					if (contentTop < -totalHeight) {
						contentTop = -totalHeight;
					} else if (contentTop > 0) {
						contentTop = 0;
					} else {
                        $.event(e).preventDefault();
					}
					inner.style.top = contentTop + 'px';
					thumbTop = - (contentTop / totalHeight) * trackHeight;
					thumb.style.top = thumbTop + 'px';
				});
				//console.log(change);
                setTimeout(function(){
                    resize();
                    thumb.style.height = thumbHeight;
                    contentTop = -(_thumbTop / trackHeight) * totalHeight;
                    inner.style.top = contentTop.toFixed(0) + 'px';
                    thumb.style.top = _thumbTop + 'px';
                }, 10);
			});
		};
});
'use strict';

define('widget.sticky', ['core'], function($) {
	$.widget.prototype.sticky = function(opt) {
		var option = opt || {};
			option.topOffset = option.scrollTop || 0;
		var element = this.dom[0],
			elementTop = $(element).rect().top,
			offset = option.topOffset + elementTop,
			isSticky = false,
			originalPostion = $(element).getComputedStyle('position');
		$(window).addEventHandler('scroll', function(){
			if (document.body.scrollTop > offset) {
				if (!isSticky) {
					element.style.position = 'fixed';
					element.style.top = option.topOffset + 'px';
					isSticky = true;
				}
			} else {
				if (isSticky) {
					element.style.top = elementTop;
					element.style.position = originalPostion;
					isSticky = false;
				}
			}
		});
	};
});