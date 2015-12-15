'use strict';

define('transform', ['core'], function($){
	var transform = function(element, matrix) {
		this.element = element;
		this.matrix = matrix;
	};

	transform.prototype.rotate = function(degree){
		var degree = 3.1415926 * degree / 180,
			sin = Math.sin(degree),
			cos = Math.cos(degree),
			tMatrix = [
						cos, -sin, 0,
						sin, cos , 0,
						0 , 0, 1
					];
		this.matrix = multiplyBy(this.matrix, tMatrix);
		return this;
	};

	transform.prototype.scale = function(ratio){
		var tMatrix = [
				ratio, 0, 0,
				0, ratio, 0,
				0 , 0, 1
			];
		this.matrix = multiplyBy(this.matrix, tMatrix);
		return this;
	};

	transform.prototype.scaleX = function(ratio){
		var tMatrix = [
				ratio, 0, 0,
				0, 1, 0,
				0 , 0, 1
			];
		this.matrix = multiplyBy(this.matrix, tMatrix);
		return this;
	};

	transform.prototype.scaleY = function(ratio){
		var tMatrix = [
				1, 0, 0,
				0, ratio, 0,
				0 , 0, 1
			];
		this.matrix = multiplyBy(this.matrix, tMatrix);
		return this;
	};

	transform.prototype.translate = function(x ,y){
		var tMatrix = [
				1, 0, x,
				0, 1, y,
				0 , 0, 1
			];
		this.matrix = multiplyBy(this.matrix, tMatrix);
		return this;
	};

	transform.prototype.translateX = function(x){
		var tMatrix = [
				1, 0, x,
				0, 1, 0,
				0 , 0, 1
			];
		this.matrix = multiplyBy(this.matrix, tMatrix);
		return this;
	};

	transform.prototype.translateY = function(y){
		var tMatrix = [
				1, 0, 0,
				0, 1, y,
				0 , 0, 1
			];
		this.matrix = multiplyBy(this.matrix, tMatrix);
		return this;
	};

	transform.prototype.end = function() {
		this.element.dom[0].style.transform = 'matrix(' + this.matrix[0].toFixed(9) + ',' + this.matrix[3].toFixed(9) + ',' + this.matrix[1].toFixed(9) + ',' + this.matrix[4].toFixed(9) + ',' + this.matrix[2].toFixed(9) + ',' + this.matrix[5].toFixed(9) + ')';
		return this.element;
	};

	function multiplyBy(origin, matrix) {
		var i, j, result = new Array(9);
		for (i = 0; i < 3; i++) {
			for (j = 0; j< 3; j++) {
				result[3 * i + j] = origin[3 * i + 0] * matrix[j + 0] +
									origin[3 * i + 1] * matrix[j + 3] +
									origin[3 * i + 2] * matrix[j + 6];
			}
		}
		return result;
	}

	$.prototype.matrix = function() {
		var m = this.getComputedStyle().transform,
			matrix;
		if (m === null || m === 'none') {
			matrix = [
						1, 0, 0,
						0, 1, 0,
						0, 0, 1
					];
		} else {
			var reg = /[-+]?[0-9]*\.?[0-9]+/g,
				result,
				mx = [];
			while ((result = reg.exec(m)) !== null) {
				mx.push(parseFloat(result[0]));
			}
			matrix = [mx[0], mx[2], mx[4], mx[1], mx[3], mx[5], 0, 0, 1];
		}
		return new transform(this, matrix);
	};

});