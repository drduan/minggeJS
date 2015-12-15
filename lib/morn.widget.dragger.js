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