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