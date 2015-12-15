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