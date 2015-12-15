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