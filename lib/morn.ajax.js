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