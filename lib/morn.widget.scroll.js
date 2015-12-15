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