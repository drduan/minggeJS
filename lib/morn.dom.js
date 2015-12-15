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