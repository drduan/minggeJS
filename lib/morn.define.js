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