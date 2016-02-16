/*  MingGeJs类库1.9.3完美正式版
 *  
 *  你会用JQUERY，那你也会用这个类库，因为语法都是一样的,那有开发文档吗？和JQUERY一样，要开发文档干嘛？
 *
 *  MingGeJs的运行绝对比JQUERY快，因为够精简，MingGejs是你的最佳选择，请多多支持，
 *
 *  作者：明哥先生-QQ399195513 QQ群：461550716 官网：www.shearphoto.com
 */
(function(window, varName, undefined) {
	var MingGeJs = "1.9.3",
		statech = "readystatechange",
		onStatech = "on" + statech,
		strObject = "[object Object]",
		strArray = "[object Array]",
		getById = "getElementById",
		getByTagName = "getElementsByTagName",
		getByClassName = "getElementsByClassName",
		querySelect = "querySelectorAll",
		DOCE = "documentElement",
		MGNotNode = "#MingGe#NotNode",
		MGAN = "MingGeAnimate",
		MGBD = "MingGeBind",
		AnimateList = "mingGeAnimateList",
		isAnimate = "isMingGeAnimate",
		DOC = document,
		ST = window.setTimeout,
		ENCODE = window.encodeURIComponent,
		virDiv = DOC.createElement("div"),
		isGetClassName = !!DOC[getByClassName],
		isQuery = !!DOC[querySelect],
		emptyFunc = function() {},
		MySlice = Array.prototype.slice,
		toString = Object.prototype.toString,
		rquickExpr = /^(?:#([\w\u00c0-\uFFFF\-]+)|(\w+)|\.([\w\u00c0-\uFFFF\-]+))$/,
		attrExpr = /^\[\s?([\w\u00c0-\uFFFF\-]+)\s?(?:=\s?[\"\'](.+?)[\"\']\s?)?\]$/,
		beanExpr = /[^\,]+/g,
		spaceExpr = /[^\s]+/g,
		AZExpr = /^[\w\u00c0-\uFFFF\-]+|\*/,
		trimExpr = /^(\s|\u00A0)+|(\s|\u00A0)+$/g,
		filterSpecialExpr = [/[\t\r\n\f\v]/g, /[\x00-\x1f\x7f-\x9f\u0000\u00ad\u0600-\u0604\u070f\u17b4\u17b5\u200c-\u200f\u2028-\u202f\u2060-\u206f\ufeff\ufff0-\uffff]/g, /\\([\}\]])/g],
		stripslashesExpr = /[\]\}\"\\\/]/g,
		attrMergeExpr = [/((?:\[[^\[\]]+\])+)([\w\u00c0-\uFFFF\-]+|\*)/g, /([\.#]?[\w\u00c0-\uFFFF\-]+|\*)<<<(.+?)>>>/g],
		wExpr = /^[\w\*]/,
		beanEndExpr = /,+$/,
		jsonpExpr = /([^\?&\\\/]+?)\s*=\s*\?+$/,
		matchSetAttrExpr = /[\w\u00c0-\uFFFF\-]+\s*=/g,
		equalEndExpr = /\=$/,
		JsonToExpr = /,([\}\]])/g,
		StringToExpr = [/^[\],:{}\s]*$/, /\\(?:["\\\/bfnrt]|u[0-9a-fA-F]{4})/g, /"[^"\\\n\r]*"|true|false|null|-?\d+(?:\.\d*)?(?:[eE][+\-]?\d+)?/g, /(?:^|:|,)(?:\s*\[)+/g],
		blankendExpr = /\s+/g,
		uppercaseAZExpr = /([A-Z])/g,
		convertuppercaseExpr = /-([a-z])/gi,
		specialSignExpr = /&+$/,
		hornSignExpr = /(<<<|>>>)/g,
		EvenLabelExpr = /(\[.+?\]|[\.#]?([\w\u00c0-\uFFFF\-]+))/g,
		createNodeExpr = /\<([\w]+)(.*?)\>(?:(.*)<\/\s*[\w]+\s*\>)?/,
		blockExpr = /^(div|ul|p|h1|h2|h3|h4|h5|h6|dd|dt|dl|ol|table|nav|form|hr)$/i,
		inlineExpr = /^(span|ul|b|a|em|strong|img|label)$/i,
		listItemExpr = /^li$/i,
		inlineBlockExpr = /^(input|button|textarea|select|option)$/i,
		opacitySignExpr = /opacity\s*=\s*([0-9]+)/,
		animateExpr = /^(linear|ease|ease-in|ease-out|ease-in-out|cubic-bezier\s*\(.+\))$/,
		getJSONExpr = /[\?&]+.+\s*=\s*\?/,
		selectorExpr = /^#([\w\u00c0-\uFFFF\-]+)$/,
		questionExpr = /\?/,
		setInpTypeExpr = /^\<\s*input/i,
		numEndExpr = /^[0-9]+$/,
		ralpha = /alpha\([^)]*\)/,
		myMatchExpr = [/\[[^\[\]]*(\s)[^\[\]]*\]/g, /\s/g, /<<@>>/g, /\[[^\[\]]*(\,)[^\[\]]*\]/g, /\,/g, /<<\uff0c>>/g],
		DOCSCROLL_LT, showFast = {
			fast: 200,
			slow: 600,
			normal: 400
		},
		trim = function(str) {
			try {
				return str.replace(trimExpr, "");
			} catch (e) {
				return str;
			}
		},
		repObject = function(arg0, arg1) {
			if (D.isObjArr(arg0) && D.isObjArr(arg1)) {
				D.each(arg1, function(i, str) {
					arg0[i] = str;
				});
			}
			return arg0;
		},
		transformReg = /^\s*(matrix3d|translate3d|translateX|translateY|translateZ|scale3d|scaleX|scaleY|scaleZ|rotate3d|rotateX|rotateY|rotateZ|perspective|matrix|translate|translateX|translateY|scale|scaleX|scaleY|rotate|skew|skewX|skewY)\s*$/i,
		uaMatch = function(ua) {
			ua = ua.toLowerCase();
			var match = /(webkit)[ \/]([\w.]+)/.exec(ua) || /(opera)(?:.*version)?[ \/]([\w.]+)/.exec(ua) || /(msie) ([\w.]+)/.exec(ua) || !/compatible/.test(ua) && /(mozilla)(?:.*? rv:([\w.]+))?/.exec(ua) || [];
			return {
				browser: match[1] || "",
				version: match[2] || "0"
			};
		},
		bubbling = function(eveName) {
			D.each.call(this.nodeList, function() {
				var arr = $data.getElem(this, MGBD + $data.key, [eveName]),
					arrI, CB;
				if (D.isArray(arr)) {
					for (var i = arr.length - 1; i > -1; i--) {
						arrI = arr[i];
						if (D.isObject(arrI) && D.isFunction(CB = arrI.callback)) {
							$data.removeEvent(this, eveName, {
								isOne: true,
								callback: CB
							});
							CB.call(this);
						}
					}
				}
			});
		},
		analyse = function(string) {
			var match = rquickExpr.exec(string),
				returnArray = false;
			if (match === null) {
				if (match = string.match(attrExpr)) {
					returnArray = [null, null, match, {
						Attr: true
					}];
				}
			} else if (match[1]) {
				returnArray = [getById, "id", match[1], {
					Id: true
				}];
			} else if (match[2]) {
				returnArray = [getByTagName, "tagName", match[2], {
					Tag: true
				}];
			} else {
				returnArray = [getByClassName, "className", match[3], {
					Class: true
				}];
			}
			return returnArray;
		},
		fSArrFunc = [function(un) {
			return {
				"\t": "\\t",
				"\r": "\\r",
				"\n": "\\n",
				"\f": "\\f",
				"\v": "\\v"
			}[un];
		}, function(un) {
			return "\\u" + ("000" + un.charCodeAt(0).toString(16)).slice(-4);
		}, function(all, b) {
			return b;
		}],
		filterSpecial = function(str) {
			return str.replace(filterSpecialExpr[0], fSArrFunc[0]).replace(filterSpecialExpr[1], fSArrFunc[1]).replace(filterSpecialExpr[2], fSArrFunc[2]);
		},
		stripslashesRep = function(str) {
			return "\\" + str;
		},
		stripslashes = function(str) {
			return str.replace(stripslashesExpr, stripslashesRep);
		},
		removing = function(array) {
			var i = 0,
				arr = [];
			if (array.item || D.isArray(array)) {
				for (; i < array.length; i++) {
					D.inArray(array[i], arr) == -1 && arr.push(array[i]);
				}
			}
			return arr;
		},
		myMatch = function(str, isSpace) {
			var is;
			if (isSpace) {
				var txt = " ",
					temp = "<<@>>",
					expr = spaceExpr,
					replExp = myMatchExpr[0],
					ArepExp = myMatchExpr[1],
					forExp = myMatchExpr[2];
			} else {
				txt = ",", temp = "<<，>>", expr = beanExpr, replExp = myMatchExpr[3], ArepExp = myMatchExpr[4],
					forExp = myMatchExpr[5];
			}
			str = str.replace(replExp, function(all, b) {
				is = true;
				return all.replace(ArepExp, temp);
			});
			var match = str.match(expr);
			if (match && is) {
				for (var i = 0; i < match.length; i++) {
					match[i] = match[i].replace(forExp, txt);
				}
			}
			return match;
		},
		attrMergeRep = function(all, b, c) {
			if (wExpr.test(b)) {
				if (b == "*") return c;
				if (c == "*") return b;
				return b.toLowerCase() == c.toLowerCase() ? b : MGNotNode;
			}
			return c + b;
		},
		attrMerge = function(str) {
			var is, str = str.replace(attrMergeExpr[0], function(all, b, c) {
				is = true;
				return "<<<" + c + ">>>" + b;
			});
			if (is) {
				str = str.replace(attrMergeExpr[1], attrMergeRep).replace(hornSignExpr, "");
				return attrMerge(str);
			}
			return str;
		},
		mergeFilter = function(strI, strII) {
			if (wExpr.test(strII)) {
				var m = myMatch(strI, true);
				if (m) {
					var end = m.length - 1,
						AZI = m[end].match(AZExpr);
					if (AZI) {
						var AZII = strII.match(AZExpr);
						if (AZI[0].toLowerCase() == AZII[0].toLowerCase() || AZII[0] == "*") {
							return strI + strII.replace(AZExpr, "");
						}
						if (AZI[0] == "*") {
							return attrMerge(strI.replace("*", "") + strII);
						}
					} else {
						m[end] = strII + m[end];
						return m.join(" ");
					}
				}
			} else return strI + strII;
			return MGNotNode;
		},
		mergeSelector = function(strOne, strTwo, txt) {
			var matchOne = myMatch(strOne),
				matchTwo = myMatch(strTwo);
			if (matchOne && matchTwo) {
				var merge = "",
					contxt, spanTrue = txt == " ";
				for (var i = 0; i < matchOne.length; i++) {
					contxt = matchOne[i] + txt;
					for (var ii = 0; ii < matchTwo.length; ii++) {
						merge += spanTrue ? contxt + matchTwo[ii] + "," : mergeFilter(contxt, matchTwo[ii]) + ",";
					}
				}
				return merge == "" ? MGNotNode : merge.replace(beanEndExpr, "");
			}
		},
		selectorId = function(getObj, newD, str, isFilter, space) {
			if (getObj.queryTwo === "000") return -1;
			if (D.isElem(getObj.queryOne)) {
				if (isFilter) return -1;
				var MingGeId = "#" + (getObj.queryOne.id || (remove = true, getObj.queryOne.id = "tempMingGeId2016")),
					remove, queryTwo = newD.queryTwo = D.isString(getObj.queryTwo) ? mergeSelector(getObj.queryTwo, str, space) : str,
					merge = mergeSelector(MingGeId, queryTwo, space);
				newD.nodeList = listToArray(getObj.queryOne[querySelect](merge));
				newD.queryOne = getObj.queryOne;
				remove && getObj.queryOne.removeAttribute("id");
				return newD;
			}
		},
		MyQuerySelector = function(str, getObj, findTrue, newD) {
			try {
				var merge, returns;
				str = attrMerge(str);
				if (findTrue) {
					if (D.isWindow(getObj.queryOne)) {
						return newD;
					}
					if (getObj.queryOne == DOC) {
						return findTrue.find ? D(str) : newD;
					}
					if (getObj.queryOne && str) {
						var isFilter = findTrue.filter,
							space = isFilter ? "" : " ";
						if (returns = selectorId(getObj, newD, str, isFilter, space)) {
							return returns;
						}
						merge = mergeSelector(getObj.queryOne, str, space);
					}
					newD.nodeList = listToArray(DOC[querySelect](merge));
					newD.queryOne = merge;
				} else {
					var match = selectorExpr.exec(str),
						getid;
					newD.nodeList = match ? (getid = DOC[getById](match[1])) ? [getid] : [] : listToArray(DOC[querySelect](str));
					newD.queryOne = str;
				}
			} catch (e) {
				console.log(e.message);
			}
			return newD;
		},
		canonicalStructure = function(str, getObj, findTrue) {
			var newD = new D(),
				Selector;
			if (D.isString(str)) {
				str = trim(str);
				if (isQuery && (Selector = MyQuerySelector(str, getObj, findTrue, newD)) != -1) return Selector;
				var match = str == "*" ? ["MingGeAllElem2016"] : myMatch(str),
					nodeList = [];
				if (match) {
					var length = match.length;
					if (length === 1) {
						newD = space(match[0], getObj, findTrue);
						newD.nodeList = removing(newD.nodeList);
					} else {
						for (var i = 0; i < length; i++) {
							nodeList = nodeList.concat(space(match[i], getObj, findTrue).nodeList);
						}
						newD.nodeList = removing(nodeList);
					}
				}
				return newD;
			}
			return findTrue ? newD : newD.init(str || 0, DOC);
		},
		space = function(str, getObj, findTrue) {
			var match = myMatch(str, true);
			if (match) {
				var leng = match.length;
				if (findTrue && findTrue.filter && leng > 1) {
					return new D();
				}
				for (var i = 0; i < leng; i++) {
					getObj = EvenLabel(match[i], i, getObj, findTrue);
				}
			}
			return getObj;
		},
		EvenLabel = function(str, num, obj, findTrue) {
			var match = str.match(EvenLabelExpr),
				find = protected.find,
				filter = protected.filter;
			if (match)
				for (var i = 0; i < match.length; i++) {
					if (num == 0) {
						obj = i == 0 ? findTrue ? findTrue.find ? find.call(obj, match[0]) : filter.call(obj, match[0]) : new D().init(match[0], DOC) : filter.call(obj, match[i]);
					} else {
						obj = i == 0 ? find.call(obj, match[0]) : filter.call(obj, match[i]);
					}
				}
			return obj;
		},
		commandNode = function(cmd, isAll, selector) {
			var array = [];
			this.each(function() {
				var elem = this;
				while (elem != null) {
					elem = elem[cmd];
					if (elem && elem.nodeType == 1) {
						array.push(elem);
						if (!isAll) break;
					}
				}
			});
			var newD = new D();
			newD.nodeList = removing(array);
			newD.queryOne = virDiv;
			newD.queryTwo = "000";
			return D.isUndefined(selector) ? newD : newD.filter(selector);
		},
		protected = {
			preventDefault: function(event) {
				return function() {
					event.returnValue = false;
				};
			},
			styleNameArrRep: [function(all, letter) {
				return "-" + letter;
			}, function(all, letter) {
				return letter.toUpperCase();
			}],
			isElemProperty: function(elem, str) {
				var strLow = str.toLowerCase();
				if (strLow == "class") return "className";
				if (strLow == "id") return "id";
				if ({
						value: 1,
						checked: 1,
						disabled: 1,
						selected: 1,
						type: 1,
						readonly: 1
					}.hasOwnProperty(strLow)) {
					var tagName = elem.tagName;
					if (tagName && strLow in DOC.createElement(tagName)) return strLow;
				}
			},
			setInpType: function(elem, type) {
				var tagName = elem.tagName;
				if (tagName && tagName.toLowerCase() == "input") {
					var outerHTML = elem.outerHTML;
					outerHTML = outerHTML.replace(setInpTypeExpr, '<input type="' + type + '" ');
					var div = DOC.createElement("DIV");
					div.innerHTML = "<div>" + outerHTML + "</div>";
					div = div.getElementsByTagName("input")[0];
					$(elem).stop().unbind();
					elem.parentNode.replaceChild(div, elem);
					return div;
				}
			},
			setAttr: function(elem, key, val) {
				var keyII = protected.isElemProperty(elem, key);
				if (keyII) {
					if (keyII == "type" && addEvent.att) {
						return protected.setInpType(elem, val);
					}
					elem[keyII] = val;
				} else elem.setAttribute && elem.setAttribute(key, val);
			},
			getAttr: function(elem, key) {
				var keyII = protected.isElemProperty(elem, key);
				if (keyII) {
					if (elem[keyII] === "") return null;
					return elem[keyII];
				}
				return elem.getAttribute && elem.getAttribute(key);
			},
			show: function(this_) {
				if (this_.style.display == "none") {
					this_.style.display = "";
					protected.original(this_, "display") == "none" && (this_.style.display = protected.getDisplay(this_.tagName));
				} else {
					this_.style.display = protected.getDisplay(this_.tagName);
				}
			},
			createKey: function(str) {
				D.isTxt(str) || (str = "");
				return str + Math.random().toString().slice(2);
			},
			attrSelect: function(mat, this_, nodeList) {
				var matchI = mat[1],
					matchII = mat[2],
					elem, i = 0,
					getattr;
				while (elem = nodeList[i++]) {
					getattr = protected.getAttr(elem, matchI);
					if (getattr !== null && getattr !== false && (matchII && String(getattr) == matchII || !matchII)) {
						this_.nodeList.push(elem);
					}
				}
			},
			bindHandle: function(eveName, callback, isOne, agent) {
				eveName = trim(eveName);
				var eventObject, elem, i = 0,
					this_, A = listToArray(arguments);
				while (elem = this.nodeList[i++]) {
					this_ = addEvent.add ? undefined : elem;
					if (this_ || !this_ && !eventObject) {
						eventObject = protected.getEventObject([this_].concat(A));
					}
					$data.writeEvent(elem, eveName, eventObject);
				}
			},
			getEventObject: function(A) {
				var bindFn = protected.fnFunc("bindFn", A);
				if (D.isObject(bindFn)) {
					var eveObj = bindFn;
				} else {
					eveObj = {};
					eveObj[A[1]] = protected.bindCallback.apply(undefined, A);
				}
				return {
					isOne: A[3],
					callback: A[2],
					event: eveObj
				};
			},
			bindCallback: function(this_, eveName, callback, isOne, agent, isMouse) {
				return function(eve) {
					eve = D.eventCompatible(eve, eveName);
					var this__ = this_ || this,
						tar = eve.target;
					protected.runEventApp(this__, eveName, callback, isOne, agent, eve, tar, isMouse && this__);
				};
			},
			mouseFn: function(arg) {
				var obj = {};
				obj[{
					mouseenter: "mouseover",
					mouseleave: "mouseout"
				}[arg.event]] = protected.bindCallback(arg.elem, arg.event, protected.mouse(arg.event, arg.callback, arg.isOne), false, arg.agent, true);
				return obj;
			},
			mouse: function(eveName, callback, isOne) {
				return function(event, this__) {
					var relate = event.relatedTarget;
					while (relate && relate != this) {
						try {
							relate = relate.parentNode;
						} catch (e) {
							break;
						}
					}
					if (relate == this || D.isWINDOC(this)) return;
					isOne && $data.removeEvent(this__, eveName, {
						isOne: true,
						callback: callback
					});
					callback.call(this, event);
				};
			},
			runEventApp: function(this_, eveName, callback, isOne, agent, eve, targ, this__) {
				var is = false;
				if (agent) {
					if (targ) {
						var allElem = agent[1].filter(agent[0]).nodeList.concat(agent[1].find(agent[0]).nodeList),
							elem, i = 0;
						while (elem = allElem[i++]) {
							try {
								if (elem == targ || D.inArray(targ, elem.getElementsByTagName(targ.tagName)) > -1) {
									callback.call(elem, eve, this__);
									is = true;
								}
							} catch (e) {
								console.log(e.message);
							}
						}
					}
				} else {
					callback.call(this_, eve, this__);
					is = true;
				}
				if (is && isOne) $data.removeEvent(this_, eveName, {
					isOne: true,
					callback: callback
				});
				return is;
			},
			tapFn: function(arg) {
				var fn = protected.tapFn;
				if (!(this instanceof fn)) {
					return new fn(arg);
				}
				this.XY = [];
				var this_ = this,
					touchEvent = function(event) {
						this_.touch(arg, D.eventCompatible(event), this);
					};
				var touchObj = {};
				touchObj[arg.event == "doubleTap" ? "dblclick" : "click"] = touchObj.touchstart = touchObj.touchend = touchEvent;
				return touchObj;
			},
			tapFnPrototype: {
				eveTime: 0,
				touch: function(arg, event, this_) {
					var elem = arg.elem,
						tapStr = arg.event,
						callback = arg.callback,
						isOne = arg.isOne,
						agent = arg.agent,
						touches = event.touches,
						isRun = true;
					elem || (elem = this_);
					if (touches) {
						if (touches = touches[0]) {
							event.preventDefault();
							this.XY[0] = touches.pageX;
							this.XY[1] = touches.pageY;
							return;
						}
						touches = event.changedTouches;
						if (touches) {
							touches = touches[0];
							if (tapStr == "doubleTap") {
								if (this.eveTime) {
									var time = Date.now() - this.eveTime;
									this.eveTime = 0;
								}
								if (!time || time > 800 || time < 0) {
									this.eveTime = Date.now();
									return;
								}
							}
							if (isRun = Math.abs(touches.pageX - this.XY[0]) < 30 || Math.abs(touches.pageY - this.XY[1]) < 30) {
								var target = touches.target;
							}
							this.XY = [];
						}
					} else {
						target = event.target;
					}
					isRun && protected.runEventApp(elem, tapStr, callback, isOne, agent, event, target);
				}
			},
			setScroll_LT: function(name, num) {
				if (DOCSCROLL_LT) {
					DOCSCROLL_LT[name] = num;
				} else {
					var DOCELEMENT = DOC[DOCE],
						DOCBODY = DOC.body;
					if (DOCELEMENT) {
						DOCELEMENT[name] = num;
						if (DOCELEMENT[name]) {
							DOCSCROLL_LT = DOCELEMENT;
						} else if (DOCBODY) {
							DOCBODY[name] = num;
							if (DOCBODY[name]) {
								DOCSCROLL_LT = DOCBODY;
							}
						}
					} else if (DOCBODY) {
						DOCSCROLL_LT = DOCBODY;
						DOCBODY[name] = num;
					}
				}
			},
			getScroll_LT: function(name) {
				if (DOCSCROLL_LT) {
					return DOCSCROLL_LT[name];
				}
				var DOCELEMENT = DOC[DOCE],
					DOCBODY = DOC.body;
				if (DOCELEMENT) {
					var val = DOCELEMENT[name];
					if (val) {
						DOCSCROLL_LT = DOCELEMENT;
						return val;
					}
					val = DOCBODY && DOCBODY[name];
					if (val) {
						DOCSCROLL_LT = DOCBODY;
						return val;
					}
					return 0;
				}
				if (DOCBODY) {
					DOCSCROLL_LT = DOCBODY;
					return DOCBODY[name];
				}
				return 0;
			},
			setS: function(name, num) {
				if (D.isUndefined(num)) {
					return protected.getCS.call(this, name, true);
				}
				num = parseFloat(num);
				if (D.isNumber(num)) {
					D.each.call(this.nodeList, function() {
						try {
							if (D.isWINDOC(this)) {
								protected.setScroll_LT(name, num);
							} else {
								this[name] = num;
							}
						} catch (e) {
							console.log(e.message);
						}
					});
				}
				return this;
			},
			winWH: function(WH) {
				var bo = DOC[DOCE] || DOC.body || false,
					sWH = "scroll" + WH,
					cWH = "client" + WH;
				return bo ? Math.max(bo[sWH], bo[cWH]) : 0;
			},
			getCS: function(name, is) {
				var node = this.nodeList[0];
				if (D.isWINDOC(node)) {
					return is ? protected.getScroll_LT(name) : (DOC[DOCE] || DOC.body || [])[name] || 0;
				}
				try {
					return node[name];
				} catch (e) {
					console.log(e.message);
					return;
				}
			},
			getFilter: function(elem) {
				var ori;
				if (ori = protected.original(elem, "filter")) {
					ori = opacitySignExpr.exec(ori);
					ori = ori ? parseInt(ori[1]) * .01 : 1;
				} else ori = 1;
				return ori;
			},
			getDisplay: function(tag) {
				if (blockExpr.test(tag)) {
					return "block";
				}
				if (inlineExpr.test(tag)) {
					return "inline";
				}
				if (listItemExpr.test(tag)) {
					return "list-item";
				}
				if (inlineBlockExpr.test(tag)) {
					return "inline-block";
				}
				if (tag == "TD") {
					return "table-cell";
				}
				if (tag == "TR") {
					return "table-row";
				}
				var create = DOC.createElement(tag),
					bodys = DOC.body,
					returns = false;
				if (bodys) {
					create.style.visibility = "hidden";
					bodys.appendChild(create);
					returns = protected.original(create, "display");
					bodys.removeChild(create);
				}
				return returns;
			},
			seachIndex: function(arr, elem) {
				return arr[0] in elem ? arr[0] : arr[1] in elem ? arr[1] : false;
			},
			isIndex: function(index, elem) {
				return index in elem;
			},
			jsonp: function(arg) {
				var url = trim(arg.url),
					jsonp = trim(arg.jsonp),
					jsonpCallback = trim(arg.jsonpCallback),
					success = arg.success,
					timeout = arg.timeout,
					erro = arg.error,
					data = arg.data,
					isReg, isTxt = D.isTxt(jsonp),
					funName, timer, callName = D.isString(jsonpCallback) ? ENCODE(funName = jsonpCallback) : funName = protected.createKey("MingGe");
				try {
					jsonp = isTxt ? ENCODE(jsonp) : "callback";
					url = url.replace(jsonpExpr, function(a, b) {
						isReg = true;
						return (isTxt ? jsonp : b) + "=" + callName;
					});
					if (!isReg) {
						url = D.urlRevise(url, jsonp + "=" + callName);
					}
					url = D.urlRevise(url, D.objToUrl(data));
					if (window[funName] == null) {
						D.isFunction(arg.complete) && arg.complete();
						var out = function() {
							script && script[0].removeChild(script[1]);
							D.delVar(window, funName);
						};
						window[funName] = function(data) {
							timer && (clearTimeout(timer), timer = undefined);
							D.isFunction(success) && success(protected.JsonString.StringToJson(data) || data, "success");
							out();
						};
						var script = D.createScript(url);
						timeout || (timeout = 3e4);
						timer = ST(function() {
							D.isFunction(erro) && erro(505);
							out();
						}, timeout);
						return true;
					}
				} catch (e) {
					D.isFunction(erro) && erro(500);
				}
				return false;
			},
			fnFunc: function(bindFn, arg) {
				var fn = arg[1] && D[bindFn][arg[1]];
				if (fn && D.isFunction(fn)) {
					return fn.call(D[bindFn], {
						elem: arg[0],
						event: arg[1],
						callback: arg[2],
						isOne: arg[3],
						agent: arg[4]
					});
				}
			},
			htmlVal: function(hv, str) {
				var node = this.nodeList;
				if (D.isUndefined(str)) return node[0] ? node[0][hv] : null;
				if (!D.isTxt(str)) {
					try {
						str = str.toString();
					} catch (e) {
						str = "";
					}
				}
				D.each.call(node, function() {
					protected.isIndex(hv, this) && (this[hv] = str);
				});
				return this;
			},
			original: function(elem, styleName) {
				var oStyle = elem.currentStyle || window.getComputedStyle(elem, null);
				return oStyle.getPropertyValue ? oStyle.getPropertyValue(D.styleName(styleName, true)) : oStyle.getAttribute(styleName);
			},
			find: function(Z) {
				var elem, i = 0,
					newD = new D(),
					R;
				if (R = optionColation(Z)) {
					while (elem = this.nodeList[i++]) {
						circulateNode.call(newD, elem, R);
					}
				}
				return newD;
			},
			filter: function(string) {
				if (string == "MingGeAllElem2016") {
					return this;
				}
				var newD = new D();
				newD.queryOne = this.queryOne;
				var analyseResult = analyse(string);
				if (!analyseResult) {
					return newD;
				}
				if (analyseResult[3].Attr) {
					protected.attrSelect(analyseResult[2], newD, this.nodeList);
					return newD;
				}
				var Reg = new RegExp("(^|\\s)" + analyseResult[2] + "(\\s|$)", analyseResult[3].Tag && "i"),
					elem, i = 0;
				while (elem = this.nodeList[i++]) {
					if (Reg.test(elem[analyseResult[1]])) {
						newD.nodeList.push(elem);
					}
				}
				return newD;
			},
			animate: function(params, speed, callback, model) {
				model = trim(model);
				model = D.isString(model) && animateExpr.test(model) ? model : "ease-out";
				var timingFunction = protected.transition + "TimingFunction",
					transitionArr = {},
					this_ = this,
					timer, eventEnd = function() {
						timer && (clearInterval(timer), timer = undefined);
						var a, b = 0,
							style;
						while (a = this_.nodeList[b++]) {
							try {
								if ($data.getAnimate(a, [isAnimate])) {
									style = a.style;
									style[protected.transition] = style[timingFunction] = null;
									callback.call(a);
								}
							} catch (e) {
								console.log(e.message);
							}
						}
					};
				transitionArr[protected.transition] = speed + "ms";
				transitionArr[timingFunction] = model;
				this.css(transitionArr);
				ST(function() {
					this_.css(params);
				}, 5);
				timer = setInterval(protected.timeCompute(Date.now(), speed - 1, eventEnd), 5);
				return this;
			},
			matchSetAttr: function(DOM, str) {
				if (!str) return;
				var div = DOC.createElement("div"),
					divAttr, typeDOM;
				div.innerHTML = "<div " + str + " ></div>";
				div = div.getElementsByTagName("div")[0];
				if (!div) return;
				var match = str.match(matchSetAttrExpr);
				if (match) {
					for (var i = 0; i < match.length; i++) {
						match[i] = match[i].replace(equalEndExpr, "");
						divAttr = protected.getAttr(div, match[i]);
						if (divAttr !== null) {
							typeDOM = protected.setAttr(DOM, match[i], divAttr);
							if (typeDOM) DOM = typeDOM;
						}
					}
				}
				return DOM;
			},
			cmdFun: function(cmd) {
				cmd = D.trim(cmd);
				var obj = {
					"外前": "beforeBegin",
					beforeBegin: "beforeBegin",
					"外后": "afterEnd",
					afterEnd: "afterEnd",
					"内前": "afterBegin",
					afterBegin: "afterBegin"
				};
				try {
					if (obj.hasOwnProperty(cmd) && (obj = obj[cmd])) return obj;
				} catch (e) {}
				return "beforeEnd";
			},
			insertHTML: function(str, cmd) {
				cmd = protected.cmdFun(cmd);
				str = trim(str);
				var bodys = DOC.body;
				D.isTxt(str) && this.each(function() {
					var this_ = D.isWINDOC(this) && bodys ? bodys : this;
					try {
						this_.insertAdjacentHTML(cmd, str);
					} catch (e) {
						console.log(e.message);
					}
				});
				return this;
			},
			createNode: function(name, cmd) {
				var newD = new D();
				if (D.isString(name)) {
					var Match = trim(name).match(createNodeExpr);
					if (Match && Match[1]) {
						var tag = Match[1],
							matchAttr = Match[2],
							html = Match[3],
							isMatch = true;
					}
					var cmd = protected.cmdFun(cmd),
						bodys = DOC.body;
					this.each(function() {
						var this_ = D.isWINDOC(this) && bodys ? bodys : this,
							parent = this_.parentNode;
						if (parent && this_.insertBefore && this_.appendChild) {
							var div = isMatch ? DOC.createElement(tag) : DOC.createTextNode(name);
							switch (cmd) {
								case "beforeBegin":
									parent.insertBefore(div, this_);
									break;

								case "afterBegin":
									this_.insertBefore(div, this_.firstChild);
									break;

								case "afterEnd":
									parent.insertBefore(div, this_.nextSibling);
									break;

								default:
									this_.appendChild(div);
							}
							var typeDOM = protected.matchSetAttr(div, matchAttr);
							if (typeDOM) div = typeDOM;
							html && protected.isIndex("innerHTML", div) && (div.innerHTML = html);
							newD.nodeList.push(div);
						}
					});
					newD.queryOne = virDiv;
					newD.queryTwo = "000";
				}
				return newD;
			},
			timeCompute: function(saveTime, timing, callblack) {
				return function() {
					var timeSubtract = Date.now() - saveTime;
					if (timeSubtract > timing || timeSubtract < 0) {
						callblack();
					}
				};
			},
			ajax: function() {
				this.erromsg = this.timeout = this.stop = this.xmlhttp = false;
				this.transit = true;
			},
			ajaxPrototype: {
				get: function(url, data, success) {
					return this.simplify(url, "get", true, data, success, 2e4, true);
				},
				post: function(url, data, success) {
					return this.simplify(url, "post", true, data, success, 2e4, false);
				},
				getJSON: function(url, data, success) {
					return this.simplify(url, "get", true, data, success, 2e4, true, getJSONExpr.test(url) ? "jsonp" : "json");
				},
				simplify: function(url, type, async, data, success, timeout, cache, json) {
					if (D.isFunction(data)) {
						var s = success;
						success = data;
						data = s || null;
					}
					this.ajax({
						url: url,
						type: type,
						dataType: json,
						timeout: timeout,
						async: async,
						lock: true,
						cache: cache,
						complete: false,
						data: data,
						success: success
					});
					return this;
				},
				Del: function(xmlhttp, State, arg) {
					if (this.stop === true) return;
					this.delAjaxEve(xmlhttp);
					this.delProgress(xmlhttp);
					this.timeout && (clearTimeout(this.timeout), this.timeout = false);
					this.erromsg = State;
					this.transit = true;
					D.isFunction(arg.error) && arg.error(State);
				},
				handle: function(xmlhttp, arg) {
					if (4 == xmlhttp.readyState) {
						if (this.stop === true) return;
						this.transit = true;
						this.timeout && (clearTimeout(this.timeout), this.timeout = false);
						if (200 == xmlhttp.status) {
							this.delProgress(xmlhttp);
							this.delAjaxEve(xmlhttp);
							var responseText = trim(xmlhttp.responseText);
							if (D.isFunction(arg.success)) {
								if (arg.dataType == "JSON") responseText = protected.JsonString.StringToJson(responseText) || responseText;
								arg.success(responseText, "success");
							}
						} else {
							this.Del(xmlhttp, "状态：" + xmlhttp.status, arg);
						}
					} else {
						0 == xmlhttp.readyState && this.Del(xmlhttp, 0, arg);
					}
				},
				delProgress: function(obj) {
					var P = "progressFunc",
						Func = obj[P];
					if (Func) {
						delEvent(obj.upload, "progress", Func);
						D.delVar(obj, P);
					}
				},
				delAjaxEve: function(obj) {
					D.delVar(obj, onStatech);
				},
				out: function(arg, xmlhttp) {
					this.delAjaxEve(xmlhttp);
					this.delProgress(xmlhttp);
					this.transit = true;
					this.erromsg = 504;
					this.stop = true;
					D.isFunction(arg.error) && arg.error(504);
				},
				ajax: function(arg) {
					if (!D.isString(arg.url)) {
						return;
					}
					this.stop = this.erromsg = false;
					arg = D.extend({
						type: "GET",
						timeout: 2e4,
						async: true
					}, arg);
					var floadTimeOut = parseFloat(trim(arg.timeout));
					arg.timeout = floadTimeOut == NaN ? 2e4 : floadTimeOut;
					if (D.isString(arg.dataType) && (arg.dataType = trim(arg.dataType.toUpperCase())) == "JSONP") {
						protected.jsonp(arg) || console.log('Operation failed, please check "jsonpCallback" settings');
						return;
					}
					if (arg.lock && !this.transit) return;
					arg.async = arg.async === true;
					this.transit = false;
					D.isString(arg.type) && (arg.type = arg.type.toUpperCase());
					var xmlhttp;
					if (window.XMLHttpRequest) {
						xmlhttp = new XMLHttpRequest();
					} else {
						xmlhttp = new ActiveXObject("Microsoft.XMLHTTP");
					}
					var isUrlencoded = true;
					arg.data = D.objToUrl(arg.data);
					if (D.isTxt(arg.data)) {
						arg.data = trim(arg.data);
						arg.data === "" && (arg.data = null);
					} else {
						if (toString.call(arg.data) == "[object FormData]") {
							if (D.isFunction(arg.progress)) {
								xmlhttp.progressFunc = arg.progress;
								addEvent(xmlhttp.upload, "progress", arg.progress);
							}
							isUrlencoded = false;
							arg.type = "POST";
						} else {
							arg.data = null;
						}
					}
					var SendArg = arg.data,
						self = this;
					D.isFunction(arg.complete) && arg.complete();
					if (arg.async) {
						xmlhttp[onStatech] = function() {
							self.handle(xmlhttp, arg);
						};
					}
					arg.timeout && arg.async && (this.timeout = ST(function() {
						self.timeout = false;
						self.out(arg, xmlhttp);
					}, arg.timeout));
					try {
						switch (arg.type) {
							case "POST":
								xmlhttp.open("POST", arg.url, arg.async);
								isUrlencoded && xmlhttp.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
								break;

							default:
								xmlhttp.open("GET", D.urlRevise(arg.url, SendArg), arg.async);
								SendArg = null;
								arg.cache === true || xmlhttp.setRequestHeader("If-Modified-Since", "0");
								break;
						}
						xmlhttp.send(SendArg);
					} catch (e2) {
						this.Del(xmlhttp, e2, arg);
						return;
					}!arg.async && self.handle(xmlhttp, arg);
				}
			},
			JsonString: {
				_json_: null,
				JsonToString: function(arr) {
					try {
						this._json_ = [];
						this._read_(arr, true);
						var JsonJoin = filterSpecial(this._json_.join("").replace(JsonToExpr, fSArrFunc[2]));
						this._json_ = null;
						return JsonJoin;
					} catch (e) {
						console.log("Format does not match, conversion fails");
						return false;
					}
				},
				StringToJson: function(arrtxt, T) {
					if (!D.isString(arrtxt)) return;
					try {
						if (T == null && StringToExpr[0].test(arrtxt.replace(StringToExpr[1], "@").replace(StringToExpr[2], "]").replace(StringToExpr[3], ""))) {
							return window.JSON && window.JSON.parse ? window.JSON.parse(arrtxt) : new Function("return (" + arrtxt + ")")();
						}
						if (T) {
							var array = new Function("return (" + arrtxt + ")")();
							if (D.isObjArr(array)) return array;
						}
					} catch (e) {
						console.log(e.message);
					}
					return false;
				},
				_addjson_: function(types, txt, txt2) {
					this._json_.push(types == strObject ? txt : txt2);
				},
				_addstring_: function(parameter) {
					var of = typeof parameter;
					if (of === "string") return '"' + stripslashes(parameter) + '"';
					if (of === "number" && parameter != NaN) return parameter;
					if (parameter == null) return "null";
					if (of === "boolean") return parameter.toString();
					if (D.isObjArr(parameter)) return false;
					return '""';
				},
				_read_: function(arr, bool) {
					var types = D.isObjArr(arr);
					if (bool && !types) {
						console.log("Your incoming is not an array or JSON");
						return this._json_ = null;
					}
					this._addjson_(types, "{", "[");
					for (var a in arr) {
						if (arr.hasOwnProperty(a)) {
							var ArrA = this._addstring_(arr[a]);
							if (ArrA === false) {
								this._addjson_(types, '"' + stripslashes(a) + '":', "");
								this._read_(arr[a]);
							} else {
								this._addjson_(types, '"' + stripslashes(a) + '":' + ArrA + ",", ArrA + ",");
							}
						}
					}
					bool = bool ? "" : ",";
					this._addjson_(types, "}" + bool, "]" + bool);
				}
			},
			style: function(objstyle, name, val) {
				val = D.isTxt(val) ? trim(val) : "";
				if (transformReg.test(name)) {
					var regexps = new RegExp("" + name + "\\s?\\((.*)\\)", "i"),
						transform = objstyle[protected.transform];
					val ? name += "(" + val + ")" : name = "";
					var arr = [protected.transform, transform ? regexps.test(transform) ? transform.replace(regexps, name) : transform + " " + name : name];
					return arr;
				}
				if (name == "opacity") {
					if (protected.opacity == "opacity") {
						var num = parseFloat(val, 10);
						arr = ["opacity", isNaN(num) ? null : num];
					} else {
						var filter = objstyle.filter,
							opacity = parseInt(val, 10) + "" === "NaN" ? "" : "alpha(opacity=" + val * 100 + ")";
						arr = ralpha.test(filter) ? ["filter", filter.replace(ralpha, opacity)] : ["filter", opacity];
					}
					return arr;
				}
				return [name, val];
			},
			readyComplete: function(callback, event, is) {
				addEvent(DOC, event, function() {
					if (is || "complete" == DOC.readyState) {
						delEvent(DOC, event, arguments.callee);
						callback.call(DOC);
					}
				});
			},
			ieReady: function(callback) {
				try {
					var winFe = window.frameElement;
					DOC[DOCE].doScroll("left");
					var correct = true;
				} catch (e) {}
				if (winFe) return protected.readyComplete(callback, statech);
				if (!correct && winFe == null) {
					var func = arguments.callee;
					return ST(function() {
						func(callback);
					}, 13);
				}
				callback.call(DOC);
			},
			ready: function(callback) {
				if (addEvent.add) return protected.readyComplete(callback, "DOMContentLoaded", true);
				protected.ieReady(callback);
			}
		},
		listToArray = function(listNode) {
			try {
				return MySlice.call(listNode);
			} catch (e) {
				var array = [];
				for (var i = 0; i < listNode.length; i++) {
					array[i] = listNode[i];
				}
				return array;
			}
		},
		circulateNode = function(parent, R) {
			if (R[1][3].Attr) {
				return protected.attrSelect(R[1][2], this, parent[getByTagName]("*"));
			}
			if (R[0] || R[1][3].Id && DOC === parent) {
				var elemName = R[1][2],
					nodeList = parent[R[1][0]](elemName == "MingGeAllElem2016" ? "*" : elemName);
				if (nodeList) {
					nodeList = R[1][3].Id ? [nodeList] : listToArray(nodeList);
					this.nodeList = this.nodeList.concat(nodeList);
				}
				return;
			}
			var ListNode = parent[getByTagName]("*"),
				elem, i = 0,
				Reg = new RegExp("(^|\\s)" + R[1][2] + "(\\s|$)"),
				node = this.nodeList;
			while (elem = ListNode[i++]) {
				if (Reg.test(elem[R[1][1]])) {
					node.push(elem);
				}
			}
		},
		optionColation = function(Z) {
			var analyseResult = analyse(Z);
			return analyseResult ? [analyseResult[3].Tag || isGetClassName && analyseResult[3].Class, analyseResult] : false;
		},
		D = window.MingGe = function(args) {
			if (!(this instanceof D)) {
				return canonicalStructure(args);
			}
			this.nodeList = [];
		};
	D.bindFn = {}, D.fn = D.prototype = {
		version: "你使用的版本是MingGejs" + MingGeJs,
		init: function(string, parent) {
			var R;
			if (D.isFunction(string)) {
				protected.ready(string);
				return this;
			}
			if (typeof string == "object") {
				this.queryOne = string;
				this.nodeList = [string];
			} else if (R = optionColation(string)) {
				circulateNode.call(this, parent, R);
			}
			return this;
		},
		queryOne: false,
		queryTwo: false,
		is: function(str) {
			str = trim(str);
			switch (str) {
				case ":animate":
					return !!$data.getAnimate(this.nodeList[0], [isAnimate]);

				case ":XXX":
					return;
			}
		},
		offset: function() {
			var nodeList = this.nodeList[0];
			return nodeList && nodeList.getBoundingClientRect ? nodeList.getBoundingClientRect() : [];
		},
		append: function(tag) {
			return protected.createNode.call(this, tag, "beforeEnd");
		},
		insertBefore: function(tag) {
			return protected.createNode.call(this, tag, "afterBegin");
		},
		createNode: protected.createNode,
		load: function(url, arg) {
			if (D.isFunction(url)) return this.bind("load", url);
			if (D.isString(url)) {
				var this_ = this;
				D[arg == null ? "get" : "post"](url, arg, function(HTML) {
					this_.each(function() {
						var seachIndex = protected.seachIndex(["value", "innerHTML"], this);
						seachIndex && (this[seachIndex] = HTML);
					});
				});
			} else if (arguments.length == 0) {
				bubbling.call(this, "load");
			}
			return this;
		},
		insertHTML: protected.insertHTML,
		stop: function() {
			protected.transition == null && (protected.transition = D.html5Attribute("transition"));
			if (!protected.transition) return this;
			return this.each(function() {
				if ($data.getAnimate(this, [isAnimate])) {
					$data.delAnimate(this);
					var timingFunction = protected.transition + "TimingFunction",
						style = this.style;
					style[protected.transition] = style[timingFunction] = null;
				}
			});
		},
		fadeToggle: function(time, callback) {
			return this.each(function() {
				if (protected.original(this, "display") == "none") {
					D(this).fadeIn(time, callback);
				} else {
					D(this).fadeOut(time, callback);
				}
			});
		},
		attr: function(name, val) {
			var nodeList = this.nodeList,
				elem = nodeList[0],
				isUndefined = D.isUndefined(val);
			if (elem) {
				if (D.isObject(name)) {
					D.each.call(nodeList, function(a) {
						var this_ = this;
						D.each(name, function(k, v) {
							if (D.isString(k) && (D.isTxt(v) || D.isBoolean(v))) {
								var typeDOM = protected.setAttr(this_, k, v);
								if (typeDOM) this_ = nodeList[a] = typeDOM;
							}
						});
					});
					return this;
				}
				if (isUndefined) {
					if (D.isString(name)) {
						return protected.getAttr(elem, name);
					}
					return null;
				}
				if (D.isString(name) && (D.isTxt(val) || D.isBoolean(val))) {
					D.each.call(nodeList, function(a) {
						var typeDOM = protected.setAttr(this, name, val);
						if (typeDOM) nodeList[a] = typeDOM;
					});
				}
				return this;
			}
			return isUndefined ? null : this;
		},
		fadeOut: function(time, callback) {
			var newD = new D();
			protected.transition == null && (protected.transition = D.html5Attribute("transition"));
			this.each(function() {
				this.nodeType == 1 && (protected.original(this, "display") == "none" || $data.getAnimate(this, [isAnimate]) || newD.nodeList.push(this));
			});
			if (protected.transition) {
				newD.animate({
					opacity: 0
				}, time, function() {
					D(this).css({
						display: "none",
						opacity: null
					});
					D.isFunction(callback) && callback.call(this);
				}, "ease");
			} else {
				newD.css("display", "none");
			}
			return this;
		},
		hide: function() {
			D.each.call(this.nodeList, function() {
				if (this.nodeType == 1 && protected.original(this, "display") != "none") {
					this.style.display = "none";
				}
			});
			return this;
		},
		getFormData: function(str, num) {
			if (D.isString(str)) {
				if (!D.isFunction(window.FormData)) return null;
				num = parseInt(num);
				var mydata = new FormData(),
					isNum = D.isNumber(num),
					nodeList = this.nodeList,
					i = 0,
					arr = [],
					elem, files, text, length;
				for (; i < nodeList.length; i++) {
					elem = nodeList[i];
					if (files = elem.files) {
						length = files.length;
						if (isNum && num < length) {
							length = num;
						}
						for (var ii = 0; ii < length; ii++) {
							arr.push(text = str + "_" + i + "_" + ii);
							mydata.append(text, files[ii]);
						}
					}
				}
				return {
					data: mydata,
					name: arr
				};
			}
		},
		show: function() {
			D.each.call(this.nodeList, function() {
				if (this.nodeType == 1 && protected.original(this, "display") == "none") {
					protected.show(this);
				}
			});
			return this;
		},
		fadeIn: function(time, callback) {
			protected.transition == null && (protected.transition = D.html5Attribute("transition"));
			var newD = new D();
			this.each(function() {
				if (this.nodeType == 1 && protected.original(this, "display") == "none") {
					if ($data.getAnimate(this, [isAnimate])) return;
					protected.transition && D(this).css("opacity", 0);
					newD.nodeList.push(this);
					protected.show(this);
				}
			});
			if (protected.transition) {
				ST(function() {
					newD.animate({
						opacity: 1
					}, time, function() {
						D(this).css("opacity", null);
						D.isFunction(callback) && callback.call(this);
					}, "ease");
				}, 5);
			}
			return this;
		},
		animate: function(params, speed, callback, model) {
			protected.transition == null && (protected.transition = D.html5Attribute("transition"));
			if (!protected.transition) {
				this.css(params);
				return this;
			}
			if (!D.isObject(params)) return this;
			var typeSpeed = typeof speed,
				newCallback;
			if (typeSpeed !== "number" || speed == NaN) {
				if (typeSpeed === "string") {
					speed = trim(speed);
					showFast[speed] ? speed = showFast[speed] : (speed = parseFloat(speed), D.isNumber(speed) || (speed = 500));
				} else {
					if (typeSpeed === "function") {
						callback = speed;
					}
					speed = 500;
				}
			}
			if (!D.isFunction(callback)) {
				var m = model;
				model = callback;
				callback = D.isFunction(m) ? m : emptyFunc;
			}
			newCallback = function() {
				var list = $data.getAnimate(this, [AnimateList]);
				if (D.isArray(list) && list.length > 0) {
					var newD = new D(),
						arg;
					newD.nodeList = [this];
					arg = list[0];
					list.splice(0, 1);
					protected.animate.apply(newD, arg);
				} else {
					$data.delAnimate(this);
				}
				callback.call(this);
			};
			var elem, b = 0,
				newD = new D(),
				arg = [params, speed, newCallback, model],
				lock;
			while (elem = this.nodeList[b++]) {
				if (elem.nodeType != 1) continue;
				var get = $data.getAnimate(elem);
				if (get && get[isAnimate]) {
					get[AnimateList] ? get[AnimateList].push(arg) : get[AnimateList] = [arg];
				} else {
					$data.setAnimate(elem, [isAnimate, 1]);
					newD.nodeList.push(elem);
					lock || (lock = true);
				}
			}
			lock && protected.animate.apply(newD, arg);
			return this;
		},
		empty: function() {
			return this.each(function(i) {
				if (this.nodeType == 1) {
					var seachIndex = protected.seachIndex(["value", "innerHTML"], this);
					seachIndex && (this[seachIndex] = "");
				}
			});
		},
		remove: function() {
			var arr = [];
			this.each(function() {
				try {
					this.parentNode.removeChild(this);
					D(this).unbind().stop();
				} catch (e) {
					arr.push(this);
				}
			});
			this.nodeList = arr;
			arr = null;
			return this;
		},
		on: function(eveName, agent, callback, isOne) {
			if (D.isFunction(agent)) {
				isOne = callback;
				callback = agent;
			}
			return this.bind(eveName, callback, isOne, agent);
		},
		bind: function(eveName, callback, isOne, agent) {
			isOne = isOne === true;
			agent = D.isString(agent) ? [agent, this] : undefined;
			if (D.isString(eveName) && D.isFunction(callback)) {
				protected.bindHandle.call(this, eveName, callback, isOne, agent);
			} else if (D.isObject(eveName)) {
				for (var key in eveName) {
					if (eveName.hasOwnProperty(key)) protected.bindHandle.call(this, key, eveName[key], isOne, agent);
				}
			}

			return this;
		},
		unbind: function(eveName, callback) {
			var elem, i = 0,
				eveNameType = typeof eveName;
			if (eveNameType == "function") {
				callback = eveName;
				eveName = undefined;
			} else {
				var callbackType = typeof callback;
				if (!((eveNameType == "string" || eveNameType == "undefined") && (callbackType == "function" || callbackType == "undefined"))) {
					return this;
				}
			}
			eveName = trim(eveName);
			while (elem = this.nodeList[i++]) {
				$data.removeEvent(elem, eveName, {
					callback: callback
				});
			}
			return this;
		},
		one: function(eveName, callback) {
			return this.bind(eveName, callback, true);
		},
		ready: function(callback) {
			if (D.isFunction(callback)) {
				protected.ready(callback);
			}
			return this;
		},
		children: function(selector) {
			var C = this.contents(selector),
				array = [];
			D.each(C.nodeList, function(i, node) {
				if (node.nodeType === 1) {
					array.push(node);
				}
			});
			C.nodeList = array;
			return C;
		},
		contents: function(selector) {
			var array = [];
			this.each(function() {
				array = array.concat(listToArray(this.childNodes));
			});
			var newD = new D();
			newD.nodeList = removing(array);
			newD.queryOne = virDiv;
			newD.queryTwo = "000";
			return D.isUndefined(selector) ? newD : newD.filter(selector);
		},
		parent: function(selector) {
			return commandNode.call(this, "parentNode", 0, selector);
		},
		siblings: function(selector) {
			var this_ = commandNode.call(this, "previousSibling", 1, selector);
			this_.nodeList = removing(this_.nodeList.concat(commandNode.call(this, "nextSibling", 1, selector).nodeList));
			return this_;
		},
		prev: function(selector) {
			return commandNode.call(this, "previousSibling", 0, selector);
		},
		prevAll: function(selector) {
			return commandNode.call(this, "previousSibling", 1, selector);
		},
		next: function(selector) {
			return commandNode.call(this, "nextSibling", 0, selector);
		},
		nextAll: function(selector) {
			return commandNode.call(this, "nextSibling", 1, selector);
		},
		addClass: function(str) {
			if (D.isString(str)) {
				str = trim(str);
				this.each(function() {
					if (this.nodeType === 1) {
						var className = this.className || "";
						className = removing(trim(className + " " + str).split(/\s+/)).join(" ");
						className == "" || (this.className = className);
					}
				});
			}
			return this;
		},
		hasClass: function(str) {
			try {
				if (D.isString(str)) {
					var className, nodeList = this.nodeList;
					str = " " + trim(str) + " ";
					for (var i = 0; i < nodeList.length; i++) {
						className = nodeList[i].className;
						if (className && (" " + className + " ").indexOf(str) != -1) {
							return true;
						}
					}
				}
			} catch (e) {
				console.log(e.message);
			}
			return false;
		},
		removeAttr: function(str) {
			if (D.isString(str)) {
				str = trim(str);
				this.each(function() {
					var k = protected.isElemProperty(this, str);
					if (k) this[k] = "";
					this.removeAttribute && this.removeAttribute(str);
				});
			}
			return this;
		},
		removeClass: function(str) {
			if (D.isString(str)) {
				str = "(" + trim(str).replace(blankendExpr, "|") + ")";
				this.each(function() {
					if (this.nodeType === 1) {
						var className = this.className;
						if (className) {
							try {
								this.className = className = trim(className.replace(blankendExpr, "  ").replace(RegExp("(^|\\s)" + str + "($|\\s)", "g"), " "));
							} catch (e) {
								console.log(e.message);
							}
						}
					}
				});
			} else if (D.isUndefined(str)) {
				this.each(function() {
					if (this.nodeType === 1) {
						if (this.className) {
							this.className = "";
						}
					}
				});
			}
			return this;
		},
		find: function(str) {
			return canonicalStructure(str, this, {
				find: true
			});
		},
		filter: function(str) {
			var fil = canonicalStructure(str, this, {
				filter: true
			});
			if (D.isElem(this.queryOne)) {
				if (!this.queryTwo && fil.nodeList[0]) {
					fil.queryOne = fil.nodeList[0];
					fil.queryTwo = false;
				} else {
					fil.queryOne = fil.queryTwo = false;
				}
			}
			return fil;
		},
		index: function(obj) {
			var node = this.nodeList;
			try {
				if (obj) {
					return D.inArray(obj.nodeType || D.isWindow(obj) ? obj : obj.nodeList[0], node);
				}
				return D.inArray(node[0], node[0].parentNode[getByTagName]("*"));
			} catch (e) {
				return -1;
			}
		},
		eq: function(index) {
			var M = new D(),
				node = this.nodeList;
			M = index == null ? this : (index = index < 0 ? node.length + index : index, node.hasOwnProperty(index) && (M.nodeList = [M.queryOne = node[index]]),
				M);
			return M;
		},
		size: function() {
			return this.nodeList.length;
		},
		each: function(callback) {
			if (D.isFunction(callback)) {
				var node = this.nodeList,
					length = node.length,
					i = 0;
				for (; i < length; i++) {
					try {
						callback.call(node[i], i, length);
					} catch (e) {
						console.log(e.message);
					}
				}
			}
			return this;
		},
		clientWidth: function() {
			return protected.getCS.call(this, "clientWidth");
		},
		clientHeight: function() {
			return protected.getCS.call(this, "clientHeight");
		},
		scrollWidth: function() {
			return protected.getCS.call(this, "scrollWidth");
		},
		scrollHeight: function() {
			return protected.getCS.call(this, "scrollHeight");
		},
		scrollLeft: function(num) {
			return protected.setS.call(this, "scrollLeft", num);
		},
		scrollTop: function(num) {
			return protected.setS.call(this, "scrollTop", num);
		},
		val: function(str) {
			return protected.htmlVal.call(this, "value", str);
		},
		html: function(str) {
			return protected.htmlVal.call(this, "innerHTML", str);
		},
		text: function(str) {
			return protected.htmlVal.call(this, protected.isIndex("textContent", virDiv) ? "textContent" : "innerText", str);
		},
		css: function(args, val) {
			var i = 0,
				elem, key, arrayKey = {},
				sty, type = typeof args;
			protected.opacity == null && (protected.opacity = D.html5Attribute("opacity") || "filter");
			protected.transform == null && (protected.transform = D.html5Attribute("transform"));
			if (type === "string") {
				args = D.styleName(trim(args));
				if (D.isUndefined(val)) {
					if (!((elem = this.nodeList[0]) && D.isElem(elem))) {
						return null;
					}
					if (transformReg.test(args)) {
						var transform = elem.style[protected.transform];
						if (transform) {
							try {
								i = new RegExp("" + args + "\\s?\\((.*)\\)", "i").exec(transform);
								return i && i[1];
							} catch (e) {
								console.log(e.message);
							}
						}
						return null;
					}
					if ((args == "opacity" || args == "filter") && protected.opacity == "filter") {
						return protected.getFilter(elem);
					}
					return protected.original(elem, args);
				}
				while (elem = this.nodeList[i++]) {
					try {
						sty = elem.style;
						arrayKey = protected.style(sty, args, val);
						sty[arrayKey[0]] = arrayKey[1];
					} catch (e) {
						console.log(e.message);
					}
				}
			} else if (D.isObject(args)) {
				while (elem = this.nodeList[i++]) {
					sty = elem.style;
					for (key in args) {
						try {
							if (i == 1 && args.hasOwnProperty(key)) {
								arrayKey[key] = protected.style(sty, D.styleName(key), args[key]);
							}
							if (arrayKey[key]) {
								sty[arrayKey[key][0]] = arrayKey[key][1];
							}
						} catch (e) {
							console.log(e.message);
						}
					}
				}
			}
			return this;
		},
		get: function(index) {
			var node = this.nodeList;
			return index == null ? node : (index = index < 0 ? node.length + index : index, node.hasOwnProperty(index) ? node[index] : undefined);
		}
	};
	D.fn.extend = D.extend = D.bindFn.extend = function() {
		var length = arguments.length,
			key;
		if (length == 1 && toString.call(arguments[0]) == strObject) {
			var is = false;
			for (key in arguments[0]) {
				if (!(key in this)) {
					this[key] = arguments[0][key];
					is = true;
				}
			}
			return is;
		}
		if (length > 1) {
			var args = arguments,
				i = 1;
			var args0 = D.copyObject(args[0]);
			for (; i < length; i++) {
				args0 = repObject(args0, args[i]);
			}
			return args0;
		}
		return false;
	};
	protected.ajax.prototype = protected.ajaxPrototype;
	D.extend({
		data: function(obj) {
			if (D.isUndefined(obj)) {
				return $data;
			}
			return new CACHE(obj);
		},
		copyObject: function(obj) {
			if (D.isObjArr(obj)) {
				var O = obj.constructor(),
					key;
				for (key in obj) {
					if (obj.hasOwnProperty(key)) O[key] = arguments.callee(obj[key]);
				}
				return O;
			}
			return obj;
		},
		isWindow: function(obj) {
			return obj == window || obj != null && obj.window == window;
		},
		isWINDOC: function(obj) {
			return obj == DOC || D.isWindow(obj);
		},
		isNumeric: function(num) {
			return !isNaN(parseFloat(num)) && isFinite(num);
		},
		isObjArr: function(obj, type) {
			var types = type || toString.call(obj);
			return (D.isObject(obj, types) || types === strArray) && types;
		},
		listToArray: listToArray,
		trim: trim,
		parseJSON: function(s, t) {
			return protected.JsonString.StringToJson(s, t);
		},
		toJSON: function(s) {
			return protected.JsonString.JsonToString(s);
		},
		setVar: function(name) {
			D.delVar(window, varName);
			window[name] = D;
		},
		isElem: function(obj) {
			return !!(obj && obj.nodeType == 1 && obj[getByTagName]);
		},
		isObject: function(obj, type) {
			return typeof obj == "object" && (type || toString.call(obj)) == strObject && obj == strObject;
		},
		isPlainObject: function(obj, type) {
			return D.isObject(obj, type) && obj.constructor == Object;
		},
		isArray: function(obj, type) {
			return (type || toString.call(obj)) === strArray;
		},
		isFunction: function(obj, type) {
			return (type || toString.call(obj)) === "[object Function]";
		},
		isEmptyObject: function(obj) {
			for (var name in obj) {
				if (obj.hasOwnProperty && obj.hasOwnProperty(name) && obj[name] != null) {
					return false;
				}
			}
			return true;
		},
		pushArray: function(arr, val) {
			if (D.isArray(arr)) {
				arr.push(val);
				return arr;
			}
			return [val];
		},
		createScript: function(srcTxt) {
			var head = DOC[getByTagName]("head").item(0),
				script;
			if (head) {
				script = DOC.createElement("script");
				D.isString(srcTxt) && (script.src = srcTxt);
				head.appendChild(script);
				return [head, script];
			}
		},
		post: function(url, data, success) {
			return new protected.ajax().post(url, data, success);
		},
		get: function(url, data, success) {
			return new protected.ajax().get(url, data, success);
		},
		getJSON: function(url, data, success) {
			return new protected.ajax().getJSON(url, data, success);
		},
		ajax: function(options) {
			var returns = new protected.ajax();
			if (D.isObject(options)) {
				returns.ajax(options);
			}
			return returns;
		},
		styleName: function(name, is) {
			var styleNameArrRep = protected.styleNameArrRep;
			try {
				return is ? name.replace(uppercaseAZExpr, styleNameArrRep[0]) : name.replace(convertuppercaseExpr, styleNameArrRep[1]);
			} catch (e) {
				console.log(e.message);
				return name;
			}
		},
		delVar: function(a, b) {
			var is;
			if (b in a) {
				try {
					is = delete a[b];
				} catch (e) {}
				try {
					is || (a[b] = undefined);
				} catch (e) {
					a[b] = emptyFunc;
				}
				return true;
			}
			return false;
		},
		delEmptyOBjArr: function(obj) {
			var DEL = D.delEmptyOBjArr,
				type = toString.call(obj),
				typeArr = D.isArray(obj, type),
				typeObj = D.isObject(obj, type);
			if (typeArr || typeObj) {
				var isNoFor = true,
					isDel = false;
				if (typeArr) {
					for (var i = obj.length - 1; i > -1; i--) {
						isNoFor = false;
						if (obj[i] == null) {
							isDel = true;
							obj.splice(i, 1);
						} else if ((obj[i] = DEL(obj[i])) == null) isDel = true;
					}
				} else if (typeObj) {
					for (var i in obj) {
						if (obj.hasOwnProperty(i)) {
							isNoFor = false;
							if (obj[i] == null) {
								isDel = true;
								D.delVar(obj, i);
							} else if ((obj[i] = DEL(obj[i])) == null) isDel = true;
						}
					}
				}
				if (isNoFor) {
					obj = undefined;
				} else if (isDel) obj = DEL(obj);
			}
			return obj;
		},
		isBoolean: function(b) {
			return typeof b == "boolean";
		},
		userAgent: uaMatch(navigator.userAgent),
		isIe: function() {
			return this.userAgent.browser === "msie" ? this.userAgent.version.charAt(0) : false;
		},
		isTxt: function(str) {
			var of = typeof str;
			return of == "string" || of == "number" && str !== NaN;
		},
		isNumber: function(number) {
			return !(number === null || isNaN(number));
		},
		isUndefined: function(str) {
			return typeof str == "undefined";
		},
		isString: function(str) {
			return typeof str == "string";
		},
		removArray: removing,
		each: function(obj, fun) {
			var elem, i = 0;
			if (D.isFunction(obj)) {
				while (elem = this[i++]) {
					obj.call(elem, i - 1);
				}
			} else if (D.isObjArr(obj) && D.isFunction(fun)) {
				for (i in obj) {
					if (obj.hasOwnProperty(i)) {
						try {
							fun(i, obj[i]);
						} catch (e) {
							console.log(e.message);
						}
					}
				}
				return true;
			}
			return false;
		},
		appendIframe: function(elem) {
			var iframe = DOC.createElement("iframe"),
				isCreate = false;
			if (D.isWINDOC(elem)) elem = DOC.body;
			if (elem && D.isNumber(elem.nodeType)) {
				elem.appendChild(iframe);
			}
			var ifrWin = iframe.contentWindow;
			return {
				elem: iframe,
				WIN: ifrWin,
				DOC: ifrWin.document,
				is: isCreate
			};
		},
		eventCompatible: function(event, eventName) {
			event || (event = window.event);
			if (addEvent.att == 1) {
				var SE = event.srcElement,
					RT = eventName == "mouseenter" ? "fromElement" : "mouseleave" && "toElement";
				if (SE) event.target = SE;
				if (RT) event.relatedTarget = event[RT];
				if ("returnValue" in event) event.preventDefault = protected.preventDefault(event);
			}
			return event;
		},
		runEventApp: protected.runEventApp,
		setInpType: protected.setInpType,
		objToUrl: function(obj) {
			var str = "";
			D.each(obj, function(key, val) {
				D.isTxt(val) && (str += ENCODE(key) + "=" + ENCODE(val) + "&");
			});
			return str.replace(specialSignExpr, "");
		},
		getMobile: function() {
			var ua = navigator.userAgent,
				android = ua.match(/(Android)\s+([\d.]+)/),
				ipad = ua.match(/(iPad).*OS\s([\d_]+)/),
				iphone = !ipad && ua.match(/(iPhone\sOS)\s([\d_]+)/),
				webos = ua.match(/(webOS|hpwOS)[\s\/]([\d.]+)/),
				touchpad = webos && ua.match(/TouchPad/),
				kindle = ua.match(/Kindle\/([\d.]+)/),
				silk = ua.match(/Silk\/([\d._]+)/),
				blackberry = ua.match(/(BlackBerry).*Version\/([\d.]+)/);
			return {
				webkit: this.userAgent.browser == "webkit",
				android: android && android[2],
				ipad: ipad && ipad[2].replace(/_/g, "."),
				iphone: iphone && iphone[2].replace(/_/g, "."),
				webos: webos && webos[2],
				kindle: kindle && kindle[1],
				silk: silk ? silk[1] : android && ua.match(/Kindle Fire/),
				blackberry: blackberry && blackberry[2]
			};
		},
		inArray: function(elem, array) {
			if (array.indexOf) {
				return array.indexOf(elem);
			}
			for (var i = 0, length = array.length; i < length; i++) {
				if (array[i] === elem) {
					return i;
				}
			}
			return -1;
		},
		bubbling: bubbling,
		urlRevise: function(url, args) {
			if (args !== "" && D.isTxt(args)) {
				url += questionExpr.test(url) ? "&" + args : "?" + args;
			}
			return url;
		},
		window: {},
		isHtml5: function() {
			return !!DOC.createElement("canvas").getContext;
		},
		_protected: protected,
		html5Attribute: function(attribute) {
			try {
				var save = false,
					attributeLow = D.isString(attribute) ? D.styleName(attribute) : "transform";
				attribute = attributeLow.replace(wExpr, attribute.charAt(0).toUpperCase());
				var bodyStyle = virDiv.style,
					arr = [attributeLow, "Ms" + attribute, "Moz" + attribute, "Webkit" + attribute, "O" + attribute];
				for (var i = 0; i < 5; i++) {
					if (arr[i] in bodyStyle) {
						save = arr[i];
						break;
					}
				}
			} catch (e) {
				console.log(e.message);
			}
			return save;
		}
	});
	protected.tapFn.prototype = protected.tapFnPrototype;
	D.bindFn.extend({
		tap: protected.tapFn,
		doubleTap: protected.tapFn,
		mouseenter: protected.mouseFn,
		mouseleave: protected.mouseFn
	});
	var CACHE = function(obj) {
		var type = toString.call(obj);
		if ((this.isObject = D.isObject(obj, type)) || D.isArray(obj, type)) {
			this.dataCache = obj;
		} else {
			this.isObject = true;
			this.dataCache = {};
		}
	};
	CACHE.prototype = {
		isObject: null,
		eachCache: function(data, A, leng) {
			for (var i = 0; i < leng; i++) {
				try {
					data = data[A[i]];
				} catch (e) {
					break;
				}
			}
			return data;
		},
		searchCache: function() {
			var A = arguments,
				leng = A.length;
			return this.eachCache(this.dataCache, A, leng);
		},
		getElem: function(elem, index, arr) {
			if (elem) {
				D.isWindow(elem) && (elem = D.window);
				var elemIndex = index;
				index = elem[index];
				if (index) {
					arr = D.isArray(arr) ? [index].concat(arr) : [index];
					return this.searchCache.apply(this, arr);
				}
			}
		},
		delElem: function(elem, index, arr, isEmpty) {
			if (elem) {
				D.isWindow(elem) && (elem = D.window);
				var elemIndex = index;
				index = elem[index];
				if (index) {
					arr = D.isArray(arr) ? [index].concat(arr) : [index];
					var R = this.delCache.apply(this, arr);
					isEmpty && this.delEmpty();
					if (!this.dataCache[index] || D.isEmptyObject(this.dataCache[index])) {
						D.delVar(elem, elemIndex);
					}
					return R;
				}
			}
		},
		setElem: function(elem, index, arr) {
			if (elem) {
				D.isWindow(elem) && (elem = D.window);
				if (!elem[index]) {
					var ran = protected.createKey();
					if (this.dataCache[ran]) return this.setElem.apply(this, arguments);
					this.dataCache[ran] = {};
					elem[index] = ran;
				}
				if (D.isArray(arr)) {
					return this.setCache.apply(this, [elem[index]].concat(arr));
				}
			}
		},
		setCache: function() {
			var A = arguments,
				data = this.dataCache,
				length = A.length,
				leng = length - 2;
			if (length > 1) {
				for (var i = 0; i < leng; i++) {
					if (!D.isObjArr(data[A[i]])) {
						data[A[i]] = {};
					}
					data = data[A[i]];
				}
				data[A[leng]] = A[length - 1];
				return true;
			}
		},
		delEmpty: function() {
			return D.delEmptyOBjArr(this.dataCache) || (this.dataCache = this.isObject ? {} : []);
		},
		key: protected.createKey(),
		eventHandle: function(DOM, object, xxxEvent) {
			var is = false,
				obj = object.event;
			if (D.isObject(object) && D.isObject(obj) && (xxxEvent == addEvent && D.isFunction(object.callback) || xxxEvent == delEvent)) {
				var elem, func;
				for (var name in obj) {
					if (obj.hasOwnProperty(name)) {
						if (D.isArray(obj[name])) {
							elem = obj[name][1] || DOM;
							func = obj[name][0];
						} else {
							elem = DOM;
							func = obj[name];
						}
						if (D.isFunction(func)) {
							xxxEvent(elem, trim(name), func) && (is = true);
						}
					}
				}
			}
			return is;
		},
		writeEvent: function(DOM, eventName, object) {
			var is = this.eventHandle(DOM, object, addEvent);
			if (is) {
				var MingGeBind = MGBD + this.key,
					arr = this.getElem(DOM, MingGeBind, [eventName]);
				if (D.isArray(arr)) {
					arr.push(object);
				} else this.setElem(DOM, MingGeBind, [eventName, [object]]);
			}
			return is;
		},
		forDelEvent: function(arr, DOM, MingGeBind, eventName, object) {
			var is = false,
				callback = object.callback,
				isOne = object.isOne;
			for (var i = 0; i < arr.length; i++) {
				if (arr[i].callback == callback || !callback) {
					if (isOne === true && arr[i].isOne !== true) continue;
					this.eventHandle(DOM, arr[i], delEvent);
					this.delElem(DOM, MingGeBind, [eventName, i]);
					is = true;
				}
			}
			return is;
		},
		delAnimate: function(DOM) {
			return this.delElem(DOM, MGAN + this.key);
		},
		getAnimate: function(DOM, array) {
			return this.getElem(DOM, MGAN + this.key, array);
		},
		setAnimate: function(DOM, array) {
			this.setElem(DOM, MGAN + this.key, array);
		},
		removeEvent: function(DOM, eventName, object) {
			var MingGeBind = MGBD + this.key,
				is = false;
			if (D.isString(eventName)) {
				var arr = this.getElem(DOM, MingGeBind, [eventName]);
				if (D.isArray(arr)) {
					is = this.forDelEvent(arr, DOM, MingGeBind, eventName, object);
				}
			} else {
				var obj = this.getElem(DOM, MingGeBind);
				if (obj) {
					for (var name in obj) {
						if (obj.hasOwnProperty(name) && D.isArray(obj[name])) {
							this.forDelEvent(obj[name], DOM, MingGeBind, name, object) && (is = true);
						}
					}
				}
			}
			this.delEmpty();
			D.isWindow(DOM) && (DOM = D.window);
			if (DOM[MingGeBind] && !this.dataCache[DOM[MingGeBind]]) {
				D.delVar(DOM, MingGeBind);
			}
			return is;
		},
		delCache: function() {
			var A = arguments,
				leng = A.length - 1,
				save = this.eachCache(this.dataCache, A, leng);
			if (save && A[leng] in save) {
				leng = D.delVar(save, A[leng]);
				return leng;
			}
		}
	};
	var $data = new CACHE({});
	D.each(["width", "height", "top", "left"], function(i, item) {
		D.fn[item] = function(item, newItem) {
			return function(str) {
				if (str == null) {
					var node = this.nodeList[0],
						offset = "offset" + newItem;
					if (!node) return null;
					if (D.isWINDOC(node)) {
						if (newItem == "Width") {
							return protected.winWH("Width");
						}
						if (newItem == "Height") {
							return protected.winWH("Height");
						}
						if (!(node = DOC.body)) {
							return null;
						}
					}
					return offset in node ? node[offset] : null;
				}
				numEndExpr.test(str) && (str += "px");
				return this.css(item, str);
			};
		}(item, item.replace(wExpr, item.charAt(0).toUpperCase()));
	});
	D.fn.off = D.fn.unbind;
	var eventFunc = function(isDel) {
			return function(elem, event, callback) {
				var onEve = "on" + event,
					eveArr = isDel ? ["removeEventListener", "detachEvent"] : ["addEventListener", "attachEvent"];
				if (elem[eveArr[0]]) {
					elem[eveArr[0]](event, callback, false);
				} else if (elem[eveArr[1]]) {
					elem[eveArr[1]](onEve, callback);
				} else if (onEve in elem) {
					if (isDel) {
						try {
							elem[onEve] = null;
						} catch (e) {
							elem[onEve] = emptyFunc;
							console.log(e.message);
						}
					} else {
						elem[onEve] = callback;
					}
				} else return false;
				return true;
			};
		},
		addEvent = D.addEvent = eventFunc(),
		delEvent = D.delEvent = eventFunc(true);
	eventFunc = undefined;
	if (DOC.addEventListener) {
		addEvent.add = 1;
	} else if (DOC.attachEvent) {
		addEvent.att = 1;
	} else addEvent.on = 1;
	Date.now || (Date.now = function() {
		return new Date().getTime();
	});
	if (!window.console || !console.log) {
		window.console = {
			log: function() {}
		};
	}
	(function(args) {
		var eveName, i = 0;
		while (eveName = args[i++]) {
			D.fn[eveName] = function(eveName) {
				return function(callback) {
					if (D.isUndefined(callback)) {
						bubbling.call(this, eveName);
						return this;
					}
					return this.bind(eveName, callback);
				};
			}(eveName);
		}
		args = i = undefined;
	})(["blur", "focus", "focusin", "focusout", "resize", "scroll", "unload", "click", "dblclick", "mousedown", "mouseup", "mousemove", "mouseover", "mouseout", "mouseenter", "mouseleave", "change", "select", "submit", "keydown", "keypress", "keyup", "error", "touchstart", "touchmove", "touchend", "touchcancel", "tap", "doubleTap", "input", "propertychange"]);
	window[varName] = D;
})(window, "$");