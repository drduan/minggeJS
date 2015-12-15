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