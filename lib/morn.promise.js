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