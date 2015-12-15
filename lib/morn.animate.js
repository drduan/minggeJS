'use strict';

define('animate', ['core', 'promise', 'dom'], function($) {
	var queque = [];

	$.tween = {
		// thanks for Tween.js
		// https://github.com/sole/tween.js/blob/master/src/Tween.js
		linear: function(k) {
			return k;
		},
		quadratic: {
			in: function ( k ) {
				return k * k;
			},
			out: function ( k ) {
				return k * ( 2 - k );
			},
			inOut: function ( k ) {
				if ( ( k *= 2 ) < 1 ) return 0.5 * k * k;
				return - 0.5 * ( --k * ( k - 2 ) - 1 );
			}
		},
		cubic: {
			in: function ( k ) {
				return k * k * k;
			},
			out: function ( k ) {
				return --k * k * k + 1;
			},
			inOut: function ( k ) {
				if ( ( k *= 2 ) < 1 ) return 0.5 * k * k * k;
				return 0.5 * ( ( k -= 2 ) * k * k + 2 );
			}
		},
		quartic: {
			in: function ( k ) {
				return k * k * k * k;
			},
			out: function ( k ) {
				return 1 - ( --k * k * k * k );
			},
			inOut: function ( k ) {
				if ( ( k *= 2 ) < 1) return 0.5 * k * k * k * k;
				return - 0.5 * ( ( k -= 2 ) * k * k * k - 2 );
			}
		},
		quintic: {
			in: function ( k ) {
				return k * k * k * k * k;
			},
			out: function ( k ) {
				return --k * k * k * k * k + 1;
			},
			inOut: function ( k ) {
				if ( ( k *= 2 ) < 1 ) return 0.5 * k * k * k * k * k;
				return 0.5 * ( ( k -= 2 ) * k * k * k * k + 2 );
			}
		},
		sinusoidal: {
			in: function ( k ) {
				return 1 - Math.cos( k * Math.PI / 2 );
			},
			out: function ( k ) {
				return Math.sin( k * Math.PI / 2 );
			},
			inOut: function ( k ) {
				return 0.5 * ( 1 - Math.cos( Math.PI * k ) );
			}
		},
		exponential: {
			in: function ( k ) {
				return k === 0 ? 0 : Math.pow( 1024, k - 1 );
			},
			out: function ( k ) {
				return k === 1 ? 1 : 1 - Math.pow( 2, - 10 * k );
			},
			inOut: function ( k ) {
				if ( k === 0 ) return 0;
				if ( k === 1 ) return 1;
				if ( ( k *= 2 ) < 1 ) return 0.5 * Math.pow( 1024, k - 1 );
				return 0.5 * ( - Math.pow( 2, - 10 * ( k - 1 ) ) + 2 );
			}
		},
		circular: {
			in: function ( k ) {
				return 1 - Math.sqrt( 1 - k * k );
			},
			out: function ( k ) {
				return Math.sqrt( 1 - ( --k * k ) );
			},
			inOut: function ( k ) {
				if ( ( k *= 2 ) < 1) return - 0.5 * ( Math.sqrt( 1 - k * k) - 1);
				return 0.5 * ( Math.sqrt( 1 - ( k -= 2) * k) + 1);
			}
		},
		elastic: {
			in: function ( k ) {
				var s, a = 0.1, p = 0.4;
				if ( k === 0 ) return 0;
				if ( k === 1 ) return 1;
				if ( !a || a < 1 ) { a = 1; s = p / 4; }
				else s = p * Math.asin( 1 / a ) / ( 2 * Math.PI );
				return - ( a * Math.pow( 2, 10 * ( k -= 1 ) ) * Math.sin( ( k - s ) * ( 2 * Math.PI ) / p ) );
			},
			out: function ( k ) {
				var s, a = 0.1, p = 0.4;
				if ( k === 0 ) return 0;
				if ( k === 1 ) return 1;
				if ( !a || a < 1 ) { a = 1; s = p / 4; }
				else s = p * Math.asin( 1 / a ) / ( 2 * Math.PI );
				return ( a * Math.pow( 2, - 10 * k) * Math.sin( ( k - s ) * ( 2 * Math.PI ) / p ) + 1 );
			},
			inOut: function ( k ) {
				var s, a = 0.1, p = 0.4;
				if ( k === 0 ) return 0;
				if ( k === 1 ) return 1;
				if ( !a || a < 1 ) { a = 1; s = p / 4; }
				else s = p * Math.asin( 1 / a ) / ( 2 * Math.PI );
				if ( ( k *= 2 ) < 1 ) return - 0.5 * ( a * Math.pow( 2, 10 * ( k -= 1 ) ) * Math.sin( ( k - s ) * ( 2 * Math.PI ) / p ) );
				return a * Math.pow( 2, -10 * ( k -= 1 ) ) * Math.sin( ( k - s ) * ( 2 * Math.PI ) / p ) * 0.5 + 1;
			}
		},
		back: {
			in: function ( k ) {
				var s = 1.70158;
				return k * k * ( ( s + 1 ) * k - s );
			},
			out: function ( k ) {
				var s = 1.70158;
				return --k * k * ( ( s + 1 ) * k + s ) + 1;
			},
			inOut: function ( k ) {
				var s = 1.70158 * 1.525;
				if ( ( k *= 2 ) < 1 ) return 0.5 * ( k * k * ( ( s + 1 ) * k - s ) );
				return 0.5 * ( ( k -= 2 ) * k * ( ( s + 1 ) * k + s ) + 2 );
			}
		}
	};

	$.prototype.addAnimate = function(attri, value, time, easing) {
		var promise = $.promise(),
			origin = $.getComputedStyle(this.dom[0], attri),
			element = this.dom[0],
			eclapse = 0,
			startTime = Date.now(),
			startValue = parseFloat(origin),
			endValue = parseFloat(value);
	
		easing = easing || $.tween.linear;

		var timer = setInterval(function(){
				eclapse = Date.now() - startTime;
				if (eclapse >= time) {
					element.style[attri] = value;
					promise.resolve();
					clearInterval(timer);
				} else {
					element.style[attri] = startValue + easing(eclapse / time) * (endValue - startValue) + 'px';
				}
			}, 17);
		return promise;
	};
});