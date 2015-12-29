/*  MingGeminggeJS类库1.8.1
 *  
 *  你会用MingGeJS，那你也会用这个类库，因为语法都是一样的,那有开发文档吗？和MingGeJS一样，要开发文档干嘛？
 *
 *  MingGeminggeJS的运行绝对比MingGeJS快，因为够精简，MingGeminggeJS是你的最佳选择，请多多支持，
 */
(function(window, varName, undefined) {
    var MingGEjs = "1.8.1",
    DOC = document,
    addEvent, delEvent, DOCSCROLL_LT, saveGetMobile, ENCODE = encodeURIComponent,
    isGetClassName = !!DOC.getElementsByClassName,
    isQuery = !!DOC.querySelectorAll,
    MySlice = Array.prototype.slice,
    rquickExpr = /^(?:#([\w-]+)|(\w+)|\.([\w-]+))$/,
    toString = Object.prototype.toString,
    showFast = {
        fast: 200,
        slow: 600,
        normal: 400
    },
    ralpha = /alpha\([^)]*\)/,
    transformReg = /^\s*(matrix3d|translate3d|translateX|translateY|translateZ|scale3d|scaleX|scaleY|scaleZ|rotate3d|rotateX|rotateY|rotateZ|perspective|matrix|translate|translateX|translateY|scale|scaleX|scaleY|rotate|skew|skewX|skewY)\s*$/i,
    uaMatch = function(ua) {
        ua = ua.toLowerCase();
        var match = /(webkit)[ \/]([\w.]+)/.exec(ua) || /(opera)(?:.*version)?[ \/]([\w.]+)/.exec(ua) || /(msie) ([\w.]+)/.exec(ua) || !/compatible/.test(ua) && /(mozilla)(?:.*? rv:([\w.]+))?/.exec(ua) || [];
        return {
            browser: match[1] || "",
            version: match[2] || "0"
        };
    },
    analyse = function(string) {
        var match = rquickExpr.exec(string),
        returnArray = false;
        if (match === null) {
            return false;
        }
        if (match[1]) {
            returnArray = ["getElementById", "id", match[1], {
                Id: true
            }];
        } else if (match[2]) {
            returnArray = ["getElementsByTagName", "tagName", match[2], {
                Tag: true
            }];
        } else {
            returnArray = ["getElementsByClassName", "className", match[3], {
                Class: true
            }];
        }
        return returnArray;
    },
    filterSpecial = function(str) {
        return str.replace(/[\t\r\n\f\v]/g,
        function(un) {
            return {
                "\t": "\\t",
                "\r": "\\r",
                "\n": "\\n",
                "\f": "\\f",
                "\v": "\\v"
            } [un];
        }).replace(/[\x00-\x1f\x7f-\x9f\u0000\u00ad\u0600-\u0604\u070f\u17b4\u17b5\u200c-\u200f\u2028-\u202f\u2060-\u206f\ufeff\ufff0-\uffff]/g,
        function(un) {
            return "\\u" + ("000" + un.charCodeAt(0).toString(16)).slice( - 4);
        }).replace(/\\([\}\]])/g,
        function(all, b) {
            return b;
        });
    },
    stripslashes = function(str) {
        return str.replace(/[\]\}\"\'\\\/]/g,
        function(str) {
            return "\\" + str;
        });
    },
    system = {
        forEve: function(elem, eveName, callback, isOne, isMouse) {
            var myCallback, myEveName;
            if (isMouse) {
                myEveName = isMouse;
                myCallback = this.mouse(callback, isOne, eveName);
            } else {
                myCallback = callback;
                myEveName = eveName;
            }
            var bck = this.bindCallback.call(elem, myCallback, myEveName, isOne, isMouse);
            bck.callback = callback;
            isOne && (bck.callback.isOne = 1);
            this.addElemEve(elem, eveName, bck);
            addEvent(elem, myEveName, bck);
        },
        transform: false,
        bindCallback: function(callback, eveName, isOne, isMouse) {
            var this_ = this;
            return function(eve) {
                if (isOne === true && !isMouse) {
                    system.DelElemEve(this_, eveName, callback);
                }
                callback.call(this_, eve || window.event);
            };
        },
        isMouse: function(name) {
            var val = {
                mouseenter: "mouseover",
                mouseleave: "mouseout"
            } [name];
            return val && addEvent.add ? val: null;
        },
        mouse: function(callback, isOne, eveName) {
            var arrOne = [],
            arrTwo = [];
            return function(event) {
                var parent = event.relatedTarget,
                Target = parent;
                if (parent == null || arrTwo.indexOf(parent) > -1) {
                    isOne && system.DelElemEve(this, eveName, callback);
                    callback.call(this, event);
                    return;
                }
                if (this == window || this == DOC || parent == this || arrOne.indexOf(parent) > -1) {
                    return;
                }
                while (parent && parent != this) {
                    try {
                        parent = parent.parentNode;
                    } catch(e) {
                        break;
                    }
                }
                if (parent == this) {
                    arrOne.push(Target);
                    return false;
                }
                arrTwo.push(Target);
                isOne && system.DelElemEve(this, eveName, callback);
                callback.call(this, event);
            };
        },
        setScroll_LT: function(name, num) {
            if (DOCSCROLL_LT) {
                DOCSCROLL_LT[name] = num;
            } else {
                var DOCELEMENT = DOC.documentElement,
                DOCBODY = DOC.body;
                if (DOCELEMENT) {
                    DOCELEMENT[name] = num;
                    if (DOCELEMENT[name]) {
                        DOCSCROLL_LT = DOCELEMENT;
                    } else {
                        DOCBODY[name] = num;
                        if (DOCBODY[name]) {
                            DOCSCROLL_LT = DOCBODY;
                        }
                    }
                } else {
                    DOCSCROLL_LT = DOCBODY;
                    DOCBODY[name] = num;
                }
            }
        },
        getScroll_LT: function(name) {
            if (DOCSCROLL_LT) {
                return DOCSCROLL_LT[name];
            }
            var DOCELEMENT = DOC.documentElement,
            DOCBODY = DOC.body;
            if (DOCELEMENT) {
                var val = DOCELEMENT[name];
                if (val) {
                    DOCSCROLL_LT = DOCELEMENT;
                    return val;
                }
                val = DOCBODY[name];
                if (val) {
                    DOCSCROLL_LT = DOCBODY;
                    return val;
                }
                return 0;
            }
            DOCSCROLL_LT = DOCBODY;
            return DOCBODY[name];
        },
        setS: function(name, num) {
            if (D.isUndefined(num)) {
                return system.getCS.call(this, name, true);
            }
            num = parseFloat(num);
            if (D.isNumber(num)) {
                D.each.call(this.nodeList,
                function() {
                    try {
                        if (this == window || this == DOC) {
                            system.setScroll_LT(name, num);
                        } else {
                            this[name] = num;
                        }
                    } catch(e) {}
                });
            }
            return this;
        },
        winWH: function(WH) {
            var bo = DOC.documentElement || DOC.body,
            sWH = "scroll" + WH,
            cWH = "client" + WH;
            return Math.max(bo[sWH], bo[cWH]);
        },
        getCS: function(name, is) {
            var node = this.nodeList[0];
            if (node && (node == window || node == DOC)) {
                return is ? system.getScroll_LT(name) : (DOC.documentElement || DOC.body)[name];
            }
            try {
                return node[name];
            } catch(e) {
                return;
            }
        },
        getFilter: function(elem) {
            var ori;
            if (ori = system.original("filter", system.oStyleValue(elem))) {
                ori = /opacity\s*=\s*([0-9]+)/.exec(ori);
                ori = ori ? parseInt(ori[1]) * .01 : 1;
            } else ori = 1;
            return ori;
        },
        getDisplay: function(tag) {
            if (/^(div|ul|p|h1|h2|h3|h4|h5|h6|dd|dt|dl|ol|table|nav|form)$/i.test(tag)) {
                return "block";
            }
            if (/^(span|ul|b|a|em|strong|img)$/i.test(tag)) {
                return "inline";
            }
            if (/^li$/i.test(tag)) {
                return "list-item";
            }
            if (/^(input|button)$/i.test(tag)) {
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
            returns;
            create.style.visibility = "hidden";
            bodys.appendChild(create);
            returns = system.original("display", system.oStyleValue(create));
            bodys.removeChild(create);
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
            isReg,
            isTxt = D.isTxt(jsonp),
            funName,
            timer,
            callName = D.isString(jsonpCallback) ? ENCODE(funName = jsonpCallback) : funName = "MingGe" + Math.random().toString().slice(2);
            try {
                jsonp = isTxt ? ENCODE(jsonp) : "callback";
                url = url.replace(/([^\?&\\\/]+?)\s*=\s*\?+$/,
                function(a, b) {
                    isReg = true;
                    return (isTxt ? jsonp: b) + "=" + callName;
                });
                if (!isReg) {
                    url = D.urlRevise(url, jsonp + "=" + callName);
                }
                url = D.urlRevise(url, D.objToUrl(data));
                if (window[funName] == null) {
                    D.isFunction(arg.complete) && arg.complete();
                    var out = function() {
                        script && script[0].removeChild(script[1]);
                        try {
                            delete window[funName];
                        } catch(e) {
                            window[funName] = null;
                        }
                    };
                    window[funName] = function(data) {
                        timer && (clearTimeout(timer), timer = null);
                        D.isFunction(success) && success(system.JsonString.StringToJson(data) || data, "success");
                        out();
                    };
                    var script = D.createScript(url);
                    timeout || (timeout = 3e4);
                    timer = setTimeout(function() {
                        D.isFunction(erro) && erro(505);
                        out();
                    },
                    timeout);
                    return true;
                }
            } catch(e) {
                D.isFunction(erro) && erro(500);
            }
            return false;
        },
        addElemEve: function(elem, EveName, callback) {
            elem === window && (elem = D);
            var MingGeBind = elem.MingGeBind,
            isObject = D.isObject(MingGeBind);
            if (isObject && D.isArray(MingGeBind[EveName])) {
                MingGeBind[EveName].push(callback);
            } else {
                isObject || (elem.MingGeBind = MingGeBind = {});
                MingGeBind[EveName] = [callback];
            }
        },
        eachDel: function(arr, elem, callback, eveName) {
            var newArr = [];
            D.each(arr,
            function(k, v) {
                if (!callback || v.callback == callback) {
                    delEvent(elem, eveName, v);
                } else {
                    newArr.push(v);
                }
            });
            return newArr;
        },
        DelElemEve: function(elem, eveName, callback) {
            var E, MingGeBind = elem === window ? (E = D).MingGeBind: (E = elem).MingGeBind,
            isMouse;
            if (MingGeBind) {
                if (eveName) {
                    isMouse = this.isMouse(eveName) || eveName;
                    MingGeBind[eveName] && (MingGeBind[eveName] = this.eachDel(MingGeBind[eveName], elem, callback, isMouse), D.isEmptyObject(MingGeBind[eveName]) && delete MingGeBind[eveName]);
                } else {
                    D.each(MingGeBind,
                    function(key, val) {
                        isMouse = system.isMouse(key) || key;
                        MingGeBind[key] = system.eachDel(val, elem, callback, isMouse);
                        D.isEmptyObject(MingGeBind[key]) && delete MingGeBind[key];
                    });
                }
                D.isEmptyObject(MingGeBind) && delete E.MingGeBind;
            }
        },
        htmlVal: function(hv, str) {
            try {
                var isIndex;
                if (D.isTxt(str)) {
                    D.each.call(this.nodeList,
                    function() {
                        system.isIndex(hv, this) && (this[hv] = str);
                    });
                    return this;
                }
                return this.nodeList[0] ? this.nodeList[0][hv] : null;
            } catch(e) {
                return null;
            }
        },
        oStyleValue: function(elem) {
            var oStyle = elem.currentStyle ? elem.currentStyle: window.getComputedStyle(elem, null);
            if (oStyle.getPropertyValue) {
                return [oStyle, "getPropertyValue"];
            }
            return [oStyle, "getAttribute"];
        },
        original: function(styleName, oStyleValue) {
            return oStyleValue[0][oStyleValue[1]](D.styleName(styleName));
        },
        find: function(Z) {
            var elem, i = 0,
            newD = new D(),
            R;
            if (R = optionColation(Z)) {
                while (elem = this.nodeList[i++]) {
                    circulateNode.call(newD, elem, R);
                }
                newD.nodeList = removing(newD.nodeList);
            }
            return newD;
        },
        filter: function(string) {
            var elem, i = 0,
            newD = new D();
            newD.SelectorTxt = this.SelectorTxt;
            var analyseResult = analyse(string);
            if (!analyseResult) {
                return newD;
            }
            var Reg = new RegExp("(^|\\s)" + analyseResult[2] + "(\\s|$)", analyseResult[3].Tag && "i");
            while (elem = this.nodeList[i++]) {
                if (Reg.test(elem[analyseResult[1]])) {
                    newD.nodeList.push(elem);
                }
                newD.nodeList = removing(newD.nodeList);
            }
            return newD;
        },
        animate: function(params, speed, callback, model) {
            model = trim(model);
            model = D.isString(model) && /^(linear|ease|ease-in|ease-out|ease-in-out|cubic-bezier\s*\(.+\))$/.test(model) ? model: "ease-out";
            var timingFunction = system.transition + "TimingFunction",
            transitionArr = {},
            this_ = this,
            timer, eventEnd = function() {
                timer && (clearInterval(timer), timer = null);
                var a, b = 0,
                style;
                while (a = this_.nodeList[b++]) {
                    try {
                        if (a.isMingGeAnimate) {
                            style = a.style;
                            style[system.transition] = style[timingFunction] = null;
                            callback.call(a);
                        }
                    } catch(e) {}
                }
            };
            transitionArr[system.transition] = speed + "ms";
            transitionArr[timingFunction] = model;
            this.css(transitionArr);
            setTimeout(function() {
                this_.css(params);
            },
            5);
            timer = setInterval(system.timeCompute(new Date().getTime(), speed - 1, eventEnd), 5);
            return this;
        },
        cmdFun: function(cmd) {
            try {
                return {
                    "\u5916\u524d": "beforeBegin",
                    beforeBegin: "beforeBegin",
                    "\u5916\u540e": "afterEnd",
                    afterEnd: "afterEnd",
                    "\u5185\u524d": "afterBegin",
                    afterBegin: "afterBegin"
                } [cmd = D.trim(cmd)] || "beforeEnd";
            } catch(e) {
                return "beforeEnd";
            }
        },
        insertHTML: function(str, cmd) {
            cmd = system.cmdFun(cmd);
            str = trim(str);
            D.isTxt(str) && this.each(function() {
                try {
                    this.insertAdjacentHTML(cmd, str);
                } catch(e) {}
            });
            return this;
        },
        createNode: function(name, attribute, cmd) {
            var newD = new D(),
            fun,
            seachIndex,
            div,
            node,
            MingGeTemp,
            i,
            attr = {};
            name = D.trim(name);
            if (D.isTxt(attribute)) {
                attr.html = D.trim(attribute);
            } else if (D.isObject(attribute)) {
                attr = attribute;
                attr.value && (attr.html = attr.value, delete attr.value);
            }
            cmd = system.cmdFun(cmd);
            fun = function() {
                try {
                    div = DOC.createElement("div"),
                    node = DOC.createElement(name),
                    MingGeTemp = "MingGeTemp" + Math.random().toString().slice(2),
                    i;
                    seachIndex = seachIndex || system.seachIndex(["value", "innerHTML"], node);
                    div.appendChild(node);
                    for (i in attr) {
                        if (i != "id" && D.isTxt(attr[i])) {
                            i == "html" || node.setAttribute(i, attr[i]);
                        }
                    }
                    node.id = MingGeTemp;
                    this.insertAdjacentHTML(cmd, div.innerHTML);
                    node = DOC.getElementById(MingGeTemp);
                    attr.id ? node.id = attr.id: node.removeAttribute ? node.removeAttribute("id") : node.id = "";
                    attr.html && seachIndex && (node[seachIndex] = attr.html);
                } catch(e) {}
                node && newD.nodeList.push(node);
            };
            this.each(fun);
            newD.SelectorTxt = DOC.body;
            newD.SelectorStr = "000";
            return newD;
        },
        timeCompute: function(saveTime, timing, callblack) {
            return function() {
                var timeSubtract = new Date().getTime() - saveTime;
                if (timeSubtract > timing || timeSubtract < 0) {
                    callblack();
                }
            };
        },
        ajax: function() {
            this.serverdata = this.erromsg = this.timeout = this.stop = this.xmlhttp = false;
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
                return this.simplify(url, "get", true, data, success, 2e4, true, /[\?&]+.+\s*=\s*\?/.test(url) ? "jsonp": "json");
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
                try {
                    xmlhttp.onreadystatechange = null;
                } catch(e) {
                    xmlhttp.onreadystatechange = function() {};
                }
                if (this.stop === true) return;
                this.removeUploadEve();
                this.timeout && (clearTimeout(this.timeout), this.timeout = false);
                this.erromsg = State;
                this.transit = true;
                D.isFunction(arg.error) && arg.error(State);
            },
            handle: function(xmlhttp, arg) {
                if (4 == xmlhttp.readyState) {
                    if (this.stop === true) return;
                    this.transit = true;
                    this.removeUploadEve();
                    this.timeout && (clearTimeout(this.timeout), this.timeout = false);
                    if (200 == xmlhttp.status) {
                        try {
                            xmlhttp.onreadystatechange = null;
                        } catch(e) {
                            xmlhttp.onreadystatechange = function() {};
                        }
                        var responseText = this.serverdata = trim(xmlhttp.responseText);
                        if (D.isFunction(arg.success)) {
                            if (arg.dataType == "JSON") responseText = system.JsonString.StringToJson(responseText) || responseText;
                            arg.success(responseText, "success");
                        }
                    } else {
                        this.Del(xmlhttp, "\u72b6\u6001\uff1a" + xmlhttp.status, arg);
                    }
                } else {
                    0 == xmlhttp.readyState && this.Del(xmlhttp, 0, arg);
                }
            },
            out: function(arg, xmlhttp) {
                try {
                    xmlhttp.onreadystatechange = null;
                } catch(e) {
                    xmlhttp.onreadystatechange = function() {};
                }
                this.transit = true;
                this.erromsg = 504;
                this.stop = true;
                this.removeUploadEve();
                D.isFunction(arg.error) && arg.error(504);
            },
            removeUploadEve: function() {},
            ajax: function(arg) {
                if (!D.isString(arg.url)) {
                    return;
                }
                this.stop = this.erromsg = false;
                arg = D.extend({
                    type: "GET",
                    timeout: 2e4,
                    async: true
                },
                arg);
                var floadTimeOut = parseFloat(trim(arg.timeout));
                arg.timeout = floadTimeOut == NaN ? 2e4: floadTimeOut;
                if (D.isString(arg.dataType) && (arg.dataType = trim(arg.dataType.toUpperCase())) == "JSONP") {
                    system.jsonp(arg) || alert('Operation failed, please check "jsonpCallback" settings');
                    return;
                }
                if (arg.lock && !this.transit) {
                    return;
                }
                arg.async = !!arg.async;
                this.transit = false;
                D.isString(arg.type) && (arg.type = arg.type.toUpperCase());
                var xmlhttp;
                if (window.XMLHttpRequest) {
                    xmlhttp = new XMLHttpRequest();
                } else {
                    xmlhttp = new ActiveXObject("Microsoft.XMLHTTP");
                }
                var ContentType = function() {
                    xmlhttp.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
                };
                arg.data = D.objToUrl(arg.data);
                if (D.isTxt(arg.data)) {
                    arg.data = trim(arg.data);
                } else {
                    if (toString.call(arg.data) == "[object FormData]") {
                        if (D.isFunction(arg.progress)) {
                            xmlhttp.upload.addEventListener("progress", arg.progress, false);
                            this.removeUploadEve = function() {
                                xmlhttp.upload.removeEventListener("progress", arg.progress, false);
                            };
                        }
                        ContentType = function() {};
                        arg.type = "POST";
                    } else {
                        arg.data = "";
                    }
                }
                var SendArg = arg.data == "" ? null: arg.data,
                self = this;
                D.isFunction(arg.complete) && arg.complete();
                if (arg.async === true) {
                    xmlhttp.onreadystatechange = function() {
                        self.handle(xmlhttp, arg);
                    };
                }
                arg.timeout && arg.async && (this.timeout = setTimeout(function() {
                    self.timeout = false;
                    self.out(arg, xmlhttp);
                },
                arg.timeout));
                try {
                    switch (arg.type) {
                    case "POST":
                        xmlhttp.open("POST", arg.url, arg.async);
                        ContentType();
                        break;

                    default:
                        xmlhttp.open("GET", D.urlRevise(arg.url, SendArg), arg.async);
                        arg.cache === true || xmlhttp.setRequestHeader("If-Modified-Since", "0");
                        break;
                    }
                    xmlhttp.send(SendArg);
                } catch(e2) {
                    this.Del(xmlhttp, e2, arg);
                    return;
                }
                arg.async === false && self.handle(xmlhttp, arg);
            }
        },
        JsonString: {
            _json_: null,
            JsonToString: function(arr) {
                try {
                    this._json_ = [];
                    this._read_(arr, true);
                    var JsonJoin = filterSpecial(this._json_.join("").replace(/,([\}\]])/g,
                    function(a, b) {
                        return b;
                    }));
                    this._json_ = null;
                    return JsonJoin;
                } catch(e) {
                    alert("Format does not match, conversion fails");
                    return;
                }
            },
            StringToJson: function(arrtxt, T) {
                if (!D.isString(arrtxt)) {
                    return;
                }
                try {
                    if (T == null && /^[\],:{}\s]*$/.test(arrtxt.replace(/\\(?:["\\\/bfnrt]|u[0-9a-fA-F]{4})/g, "@").replace(/"[^"\\\n\r]*"|true|false|null|-?\d+(?:\.\d*)?(?:[eE][+\-]?\d+)?/g, "]").replace(/(?:^|:|,)(?:\s*\[)+/g, ""))) {
                        return window.JSON && window.JSON.parse ? window.JSON.parse(arrtxt) : new Function("return (" + arrtxt + ")")();
                    } else if (T) {
                        var array = new Function("return (" + arrtxt + ")")();
                        type = this._type_(array);
                        if (type !== "[object Object]" && type !== "[object Array]") {
                            return false;
                        }
                        return array;
                    }
                    return false;
                } catch(e) {
                    return false;
                }
            },
            _type_: function(arr) {
                if (D.isNumber(arr.nodeType)) return "[object DOC]";
                return toString.call(arr);
            },
            _addjson_: function(types, txt, txt2, TrueFalse) {
                var run = {
                    "[object Object]": txt,
                    "[object Array]": txt2
                };
                this._json_.push(run[types]);
            },
            _addstring_: function(parameter) {
                var of = typeof parameter,
                types;
                if (of === "string") return '"' + stripslashes(parameter) + '"';
                if (of === "number" && parameter != NaN) return parameter;
                if (parameter == null) return "null";
                if (of === "boolean") return parameter.toString();
                types = this._type_(parameter);
                if (typeof parameter.nodeType != "number" && parameter != window && types === "[object Object]" || types === "[object Array]") {
                    return false;
                }
                return '""';
            },
            _read_: function(arr, TrueFalse) {
                var types = this._type_(arr);
                if (TrueFalse && types !== "[object Object]" && types !== "[object Array]") {
                    alert("Your incoming is not an array or JSON");
                    return this._json_ = null;
                }
                this._addjson_(types, "{", "[", TrueFalse);
                var pro = arr.constructor.prototype;
                for (var a in arr) {
                    if (D.isUndefined(pro[a])) {
                        var ArrA = this._addstring_(arr[a]);
                        if (typeof ArrA !== "boolean") {
                            this._addjson_(types, '"' + stripslashes(a) + '":' + ArrA + ",", ArrA + ",");
                        } else {
                            this._addjson_(types, '"' + stripslashes(a) + '":', "");
                            this._read_(arr[a], false);
                        }
                    }
                }
                TrueFalse = TrueFalse ? "": ",";
                this._addjson_(types, "}" + TrueFalse, "]" + TrueFalse);
            }
        },
        opacity: false,
        transition: false,
        style: function(objstyle, name, val) {
            var arr, regexps, transform;
            val = D.isTxt(val) ? trim(val) : "";
            if (transformReg.test(name)) {
                regexps = new RegExp("" + name + "\\s?\\((.*)\\)", "i"),
                transform = objstyle[system.transform];
                val ? name += "(" + val + ")": name = "";
                arr = [system.transform, transform ? regexps.test(transform) ? transform.replace(regexps, name) : transform + " " + name: name];
                return arr;
            }
            if (name == "opacity") {
                var filter, opacity, num;
                if (system.opacity == "opacity") {
                    num = parseFloat(val, 10);
                    arr = ["opacity", isNaN(num) ? null: num];
                } else {
                    filter = objstyle.filter;
                    opacity = parseInt(val, 10) + "" === "NaN" ? "": "alpha(opacity=" + val * 100 + ")";
                    arr = ralpha.test(filter) ? ["filter", filter.replace(ralpha, opacity)] : ["filter", opacity];
                }
                return arr;
            }
            return [name, val];
        },
        ready: function(a) {
            function b() {
                try {
                    var c = function() {
                        "complete" === DOC.readyState && (addEvent(DOC, "readystatechange", c), a());
                    },
                    d = window.frameElement;
                } catch(e) {
                    return addEvent(DOC, "readystatechange", c),
                    void 0;
                }
                if (null != d) return addEvent(DOC, "readystatechange", c),
                void 0;
                try {
                    DOC.documentElement.doScroll("left");
                } catch(c) {
                    return setTimeout(b, 13),
                    void 0;
                }
                a();
            }
            var c;
            D.isFunction(a) && (DOC.addEventListener ? (c = function() {
                DOC.removeEventListener("DOMContentLoaded", c, !1),
                a();
            },
            DOC.addEventListener("DOMContentLoaded", c, !1)) : b());
        }
    },
    listNodeToArray = function(listNode) {
        try {
            return MySlice.call(listNode);
        } catch(e) {
            var array = [];
            for (var i = 0; i < listNode.length; i++) {
                array[i] = listNode[i];
            }
            return array;
        }
    },
    circulateNode = function(parent, R) {
        if (R[0] || R[1][3].Id && DOC === parent) {
            var elemName = R[1][2],
            nodeList = parent[R[1][0]](elemName === "MingGeAllelem2015" ? "*": elemName);
            if (nodeList) {
                nodeList = R[1][3].Id ? [nodeList] : listNodeToArray(nodeList);
                this.nodeList = this.nodeList.concat(nodeList);
            }
            return;
        }
        var ListNode = parent.getElementsByTagName("*"),
        elem,
        i = 0,
        Reg = new RegExp("(^|\\s)" + R[1][2] + "(\\s|$)");
        while (elem = ListNode[i++]) {
            if (Reg.test(elem[R[1][1]])) {
                this.nodeList.push(elem);
            }
        }
    },
    optionColation = function(Z) {
        var analyseResult = analyse(Z);
        return analyseResult ? [analyseResult[3].Tag || isGetClassName && analyseResult[3].Class, analyseResult] : false;
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
    mergeSelector = function(strOne, strTwo, txt) {
        var matchOne = strOne.match(/[^\,]+/g),
        matchTwo = strTwo.match(/[^\,]+/g);
        if (matchOne && matchTwo) {
            var merge = "",
            contxt, spanTrue = txt == " ",
            mstr, rgExp = /^[\w-_]+/,
            match, MT;
            for (var i = 0; i < matchOne.length; i++) {
                contxt = matchOne[i] + txt;
                MT = spanTrue || (match = contxt.match(rgExp));
                for (var ii = 0; ii < matchTwo.length; ii++) {
                    if (MT) {
                        if (contxt == matchTwo[ii]) {
                            merge += contxt + ",";
                        } else {
                            if (match) {
                                mstr = matchTwo[ii].match(rgExp);
                                mstr ? mstr[0] == match[0] && (merge += contxt + matchTwo[ii].replace(rgExp, "") + ",") : merge += contxt + matchTwo[ii] + ",";
                            } else {
                                merge += contxt + matchTwo[ii] + ",";
                            }
                        }
                    } else {
                        merge += matchTwo[ii] + contxt + ",";
                    }
                }
            }
            return merge.replace(/,+$/, "");
        }
    },
    MyQuerySelector = function(str, getObj, findTrue, newD) {
        try {
            var merge, MingGeId, remove = false;
            if (findTrue) {
                if (getObj.SelectorTxt === DOC || getObj.SelectorTxt === window) {
                    return newD;
                }
                if (getObj.SelectorTxt && str != "") {
                    if (findTrue.filter) {
                        if (getObj.SelectorTxt.ownerDocument) {
                            if (getObj.SelectorStr && getObj.SelectorStr !== "000") {
                                MingGeId = "#" + (getObj.SelectorTxt.id || (remove = true, getObj.SelectorTxt.id = "tempMingGeId2015"));
                                merge = mergeSelector(MingGeId, newD.SelectorStr = mergeSelector(getObj.SelectorStr, str, ""), " ");
                                newD.nodeList = listNodeToArray(getObj.SelectorTxt.querySelectorAll(merge));
                                newD.SelectorTxt = getObj.SelectorTxt;
                                remove && getObj.SelectorTxt.removeAttribute("id");
                                return newD;
                            }
                            return - 1;
                        }
                        merge = mergeSelector(getObj.SelectorTxt, str, "");
                    } else {
                        if (getObj.SelectorStr === "000") {
                            return - 1;
                        }
                        if (getObj.SelectorTxt.ownerDocument) {
                            MingGeId = "#" + (getObj.SelectorTxt.id || (remove = true, getObj.SelectorTxt.id = "tempMingGeId2015"));
                            merge = getObj.SelectorStr ? mergeSelector(MingGeId, newD.SelectorStr = mergeSelector(getObj.SelectorStr, str, " "), " ") : mergeSelector(MingGeId, newD.SelectorStr = str, " ");
                            newD.nodeList = listNodeToArray(getObj.SelectorTxt.querySelectorAll(merge));
                            newD.SelectorTxt = getObj.SelectorTxt;
                            remove && getObj.SelectorTxt.removeAttribute("id");
                            return newD;
                        }
                        merge = mergeSelector(getObj.SelectorTxt, str, " ");
                    }
                }
                newD.nodeList = listNodeToArray(DOC.querySelectorAll(merge));
                newD.SelectorTxt = merge;
            } else {
                var match = /^#([\w-_]+)$/.exec(str),
                getid;
                newD.nodeList = match ? (getid = DOC.getElementById(match[1])) ? [getid] : [] : listNodeToArray(DOC.querySelectorAll(str));
                newD.SelectorTxt = str;
            }
        } catch(e) {}
        return newD;
    },
    CanonicalStructure = function(str, getObj, findTrue) {
        var newD = new D(),
        qu;
        if (D.isString(str)) {
            str = trim(str);
            if (isQuery && (qu = MyQuerySelector(str, getObj, findTrue, newD)) != -1) return qu;
            var match = str.match(/[^\,]+/g),
            nodeList = [];
            if (match) {
                var length = match.length;
                if (length === 1) {
                    return space(match[0], getObj, findTrue);
                }
                for (var i = 0; i < length; i++) {
                    nodeList = nodeList.concat(space(match[i], getObj, findTrue).nodeList);
                }
                return newD.nodeList = removing(nodeList),
                newD;
            }
            return newD;
        }
        return findTrue ? newD: newD.init(str || 0, DOC);
    },
    space = function(str, getObj, findTrue) {
        var match = str.match(/[^\s]+/g);
        if (match) {
            var leng = match.length;
            if (findTrue && findTrue.filter && leng > 2) {
                return new D();
            }
            for (var i = 0; i < leng; i++) {
                getObj = EvenLabel(match[i], i, getObj, findTrue);
            }
        }
        return getObj;
    },
    EvenLabel = function(str, num, obj, findTrue) {
        var match = str.match(/[\.#]?([\w-]+)/g);
        if (match) for (var i = 0; i < match.length; i++) {
            if (num == 0) {
                obj = i == 0 ? findTrue ? findTrue.find ? system.find.call(obj, match[0]) : system.filter.call(obj, match[0]) : new D().init(match[0], DOC) : system.filter.call(obj, match[i]);
            } else {
                obj = i == 0 ? system.find.call(obj, match[0]) : system.filter.call(obj, match[i]);
            }
        }
        return obj;
    },
    D = window.MingGe = function(args) {
        if (this === window || this.MingGe) {
            return CanonicalStructure(args);
        }
        this.nodeList = [];
    };
    D.fn = D.prototype = {
        version: "\u4f60\u4f7f\u7528\u7684\u7248\u672c\u662fMingGejs" + MingGEjs,
        init: function(string, parent) {
            var R;
            if (D.isFunction(string)) {
                system.ready(string);
                return this;
            }
            if (string === window || string === DOC || string.ownerDocument) {
                this.SelectorTxt = string;
                this.nodeList = [string];
            } else if (R = optionColation(string)) {
                circulateNode.call(this, parent, R);
            }
            return this;
        },
        is: function(str) {
            str = trim(str);
            switch (str) {
            case ":animate":
                return this.nodeList[0] ? this.nodeList[0].isMingGeAnimate ? true: false: false;
                break;
            }
        },
        append: function(name) {
            return system.createNode.call(this, name, {},
            "beforeEnd");
        },
        createNode: function() {
            return system.createNode.apply(this, arguments);
        },
        load: function(url, arg) {
            if (D.isFunction(url)) {
                return this.bind("load", url);
            }
            var this_ = this,
            successFun = function(HTML) {
                this_.each(function() {
                    var seachIndex = system.seachIndex(["value", "innerHTML"], this);
                    seachIndex && (this[seachIndex] = HTML);
                });
            };
            if (arg == null) {
                D.get(url, null, successFun);
            } else {
                D.post(url, arg, successFun);
            }
            return this;
        },
        insertHTML: function() {
            return system.insertHTML.apply(this, arguments);
        },
        stop: function() {
            system.transition || (system.transition = D.html5Attribute("transition"));
            if (!system.transition) return this;
            return this.each(function() {
                if (this.isMingGeAnimate) {
                    delete this.isMingGeAnimate;
                    this.mingGeAnimateList && delete this.mingGeAnimateList;
                    var timingFunction = system.transition + "TimingFunction";
                    var style = this.style;
                    style[system.transition] = style[timingFunction] = null;
                }
            });
        },
        fadeToggle: function(time, callback) {
            return this.each(function() {
                var arr = system.oStyleValue(this);
                if (system.original("display", arr) == "none") {
                    D(this).fadeIn(time, callback);
                } else {
                    D(this).fadeOut(time, callback);
                }
            });
        },
        attr: function(name, val) {
            var elem = this.nodeList[0],
            this_;
            if (elem) {
                if (D.isObject(name)) {
                    D.each.call(this.nodeList,
                    function() {
                        this_ = this;
                        this.setAttribute && D.each(name,
                        function(k, v) {
                            if (D.isString(k) && D.isTxt(v)) {
                                this_.setAttribute(k, v);
                            }
                        });
                    });
                    return this;
                }
                if (D.isUndefined(val)) {
                    if (elem.getAttribute && D.isString(name)) {
                        return elem.getAttribute(name);
                    }
                    return null;
                }
                if (D.isString(name) && D.isTxt(val)) {
                    D.each.call(this.nodeList,
                    function() {
                        this.setAttribute && this.setAttribute(name, val);
                    });
                }
            }
            return this;
        },
        fadeOut: function(time, callback) {
            var newD = new D();
            system.transition || (system.transition = D.html5Attribute("transition"));
            this.each(function() {
                var arr = system.oStyleValue(this);
                this.nodeType == 1 && (system.original("display", arr) == "none" || this.isMingGeAnimate || newD.nodeList.push(this));
            });
            if (system.transition) {
                newD.animate({
                    opacity: 0
                },
                time,
                function() {
                    D(this).css({
                        display: "none",
                        opacity: null
                    });
                    D.isFunction(callback) && callback.call(this);
                },
                "ease");
            } else {
                newD.css("display", "none");
            }
            return this;
        },
        hide: function() {
            D.each.call(this.nodeList,
            function() {
                if (this.nodeType == 1 && system.original("display", system.oStyleValue(this)) != "none") {
                    this.style.display = "none";
                }
            });
            return this;
        },
        show: function() {
            D.each.call(this.nodeList,
            function() {
                var arr = system.oStyleValue(this);
                if (this.nodeType == 1 && system.original("display", arr) == "none") {
                    if (this.style.display == "none") {
                        this.style.display = "";
                        system.original("display", arr) == "none" && (this.style.display = system.getDisplay(this.tagName));
                    } else {
                        this.style.display = system.getDisplay(this.tagName);
                    }
                }
            });
            return this;
        },
        fadeIn: function(time, callback) {
            system.transition || (system.transition = D.html5Attribute("transition"));
            var newD = new D();
            this.each(function() {
                var arr = system.oStyleValue(this);
                if (this.nodeType == 1 && system.original("display", arr) == "none") {
                    if (this.isMingGeAnimate) return;
                    system.transition && D(this).css("opacity", 0);
                    newD.nodeList.push(this);
                    if (this.style.display == "none") {
                        this.style.display = "";
                        system.original("display", arr) == "none" && (this.style.display = system.getDisplay(this.tagName));
                    } else {
                        this.style.display = system.getDisplay(this.tagName);
                    }
                }
            });
            if (system.transition) {
                setTimeout(function() {
                    newD.animate({
                        opacity: 1
                    },
                    time,
                    function() {
                        D(this).css("opacity", null);
                        D.isFunction(callback) && callback.call(this);
                    },
                    "ease");
                },
                5);
            }
            return this;
        },
        animate: function(params, speed, callback, model) {
            system.transition || (system.transition = D.html5Attribute("transition"));
            if (!system.transition) {
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
                callback = D.isFunction(m) ? m: function() {};
            }
            newCallback = function() {
                var list = this.mingGeAnimateList;
                if (D.isArray(list) && list.length > 0) {
                    var newD = new D(),
                    arg;
                    newD.nodeList = [this];
                    arg = list[0];
                    list.splice(0, 1);
                    system.animate.apply(newD, arg);
                } else {
                    delete this.mingGeAnimateList;
                    delete this.isMingGeAnimate;
                }
                callback.call(this);
            };
            var elem, b = 0,
            newD = new D(),
            arg = [params, speed, newCallback, model],
            lock;
            while (elem = this.nodeList[b++]) {
                if (elem.nodeType != 1) continue;
                if (elem.isMingGeAnimate) {
                    elem.mingGeAnimateList ? elem.mingGeAnimateList.push(arg) : elem.mingGeAnimateList = [arg];
                } else {
                    elem.isMingGeAnimate = 1;
                    newD.nodeList.push(elem);
                    lock || (lock = true);
                }
            }
            lock && system.animate.apply(newD, arg);
            return this;
        },
        empty: function() {
            return this.each(function(i) {
                if (this.nodeType == 1) {
                    var seachIndex = system.seachIndex(["value", "innerHTML"], this);
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
                } catch(e) {
                    arr.push(this);
                }
            });
            this.nodeList = arr;
            arr = null;
            return this;
        },
        bind: function(eveName, callback, isOne) {
            var elem, i = 0,
            args;
            if (D.isString(eveName) && D.isFunction(callback)) {
                eveName = trim(eveName);
                var isMouse = system.isMouse(eveName);
                while (elem = this.nodeList[i++]) {
                    system.forEve(elem, eveName, callback, isOne, isMouse);
                }
            } else if (D.isObject(eveName)) {
                var trimKey;
                while (elem = this.nodeList[i++]) {
                    for (var key in eveName) {
                        trimKey = trim(key);
                        if (D.isString(key) && D.isFunction(eveName[key])) {
                            system.forEve(elem, trimKey, eveName[key], isOne, system.isMouse(trimKey));
                        }
                    }
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
                if (! ((eveNameType == "string" || eveNameType == "undefined") && (callbackType == "function" || callbackType == "undefined"))) {
                    return this;
                }
            }
            eveName = trim(eveName);
            while (elem = this.nodeList[i++]) {
                system.DelElemEve(elem, eveName, callback);
            }
            return this;
        },
        one: function(eveName, callback) {
            return this.bind(eveName, callback, true);
        },
        SelectorStr: false,
        SelectorTxt: false,
        nodeList: [],
        ready: function(callback) {
            system.ready(callback);
            return this;
        },
        parent: function(re) {
            var obj, i = 0,
            newD = new D(),
            par;
            while (obj = this.nodeList[i++]) { (par = obj.parentNode) && (par.tagName == "BODY" || newD.nodeList.push(par));
            }
            newD.nodeList = removing(newD.nodeList);
            newD.SelectorTxt = DOC.body;
            newD.SelectorStr = "000";
            return re ? newD.filter(re) : newD;
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
                return D.isString(str) && RegExp("(^|\\s)" + trim(str) + "($|\\s)").test(this.nodeList[0].className);
            } catch(e) {
                return false;
            }
        },
        removeClass: function(str) {
            if (D.isString(str)) {
                str = "(" + trim(str).replace(RegExp("\\s+", "g"), "|") + ")";
                this.each(function() {
                    if (this.nodeType === 1) {
                        var className = this.className;
                        if (className) {
                            this.className = className = trim(className.replace(/\s+/g, "  ").replace(RegExp("(^|\\s)" + str + "($|\\s)", "g"), " "));
                            className == "" && (this.removeAttribute ? this.removeAttribute("class") : this.className = "");
                        }
                    }
                });
            } else if (D.isUndefined(str)) {
                this.each(function() {
                    if (this.nodeType === 1) {
                        if (this.className) {
                            this.removeAttribute ? this.removeAttribute("class") : this.className = "";
                        }
                    }
                });
            }
            str = "";
            return this;
        },
        children: function(elem) {
            return elem ? this.find(elem) : isQuery ? this.find("*") : this.find("MingGeAllelem2015");
        },
        find: function(str) {
            return CanonicalStructure(str, this, {
                find: true
            });
        },
        filter: function(str) {
            var fil = CanonicalStructure(str, this, {
                filter: true
            });
            this.SelectorTxt.ownerDocument && !this.SelectorStr && fil.nodeList[0] && (fil.SelectorTxt = fil.nodeList[0], fil.SelectorStr = false);
            return fil;
        },
        index: function(obj) {
            try {
                if (obj) {
                    return D.inArray(obj.nodeType || obj == window ? obj: obj.nodeList[0], this.nodeList);
                }
                return D.inArray(this.nodeList[0], this.nodeList[0].parentNode.getElementsByTagName("*"));
            } catch(e) {
                return - 1;
            }
        },
        eq: function(index) {
            var M = new D();
            M = index == null ? this: (index = index < 0 ? this.nodeList.length + index: index, this.nodeList[index] && (M.nodeList = [M.SelectorTxt = this.nodeList[index]]), M);
            return M;
        },
        size: function() {
            return this.nodeList.length;
        },
        each: function(callback) {
            if (D.isFunction(callback)) {
                var length = this.nodeList.length,
                i = 0;
                for (; i < length; i++) {
                    try {
                        callback.call(this.nodeList[i], i, length);
                    } catch(e) {}
                }
            }
            return this;
        },
        clientWidth: function() {
            return system.getCS.call(this, "clientWidth");
        },
        clientHeight: function() {
            return system.getCS.call(this, "clientHeight");
        },
        scrollWidth: function() {
            return system.getCS.call(this, "scrollWidth");
        },
        scrollHeight: function() {
            return system.getCS.call(this, "scrollHeight");
        },
        scrollLeft: function(num) {
            return system.setS.call(this, "scrollLeft", num);
        },
        scrollTop: function(num) {
            return system.setS.call(this, "scrollTop", num);
        },
        val: function(str) {
            return system.htmlVal.call(this, "value", str);
        },
        html: function(str) {
            return system.htmlVal.call(this, "innerHTML", str);
        },
        text: function(str) {
            return system.htmlVal.call(this, system.isIndex("textContent", DOC.body) ? "textContent": "innerText", str);
        },
        css: function(args, val) {
            var i = 0,
            elem, key, arrayKey = {},
            sty, type = typeof args;
            system.opacity || (system.opacity = D.html5Attribute("opacity") || "filter");
            system.transform || (system.transform = D.html5Attribute("transform"));
            if (type === "string") {
                args = D.styleName(trim(args));
                if (D.isUndefined(val)) {
                    if (! ((elem = this.nodeList[0]) && elem.ownerDocument)) {
                        return null;
                    }
                    if (transformReg.test(args)) {
                        var transform = elem.style[system.transform];
                        if (transform) {
                            i = new RegExp("" + args + "\\s?\\((.*)\\)", "i").exec(transform);
                            return i && i[1];
                        }
                        return null;
                    }
                    if (system.opacity == "filter") {
                        return system.getFilter(elem);
                    }
                    return system.original(args, system.oStyleValue(elem));
                }
                while (elem = this.nodeList[i++]) {
                    try {
                        sty = elem.style;
                        arrayKey = system.style(sty, args, val);
                        sty[arrayKey[0]] = arrayKey[1];
                    } catch(e) {}
                }
            } else if (D.isObject(args)) {
                while (elem = this.nodeList[i++]) {
                    sty = elem.style;
                    for (key in args) {
                        try {
                            i == 1 && (arrayKey[key] = system.style(sty, D.styleName(key), args[key]));
                            sty[arrayKey[key][0]] = arrayKey[key][1];
                        } catch(e) {}
                    }
                }
            }
            return this;
        },
        get: function(index) {
            return index == null ? this.nodeList: (index = index < 0 ? this.nodeList.length + index: index, this.nodeList[index]);
        }
    };
    D.fn.extend = D.extend = function() {
        var length = arguments.length,
        key;
        if (length === 1 && toString.call(arguments[0]) === "[object Object]") {
            for (key in arguments[0]) {
                this[key] || (this[key] = arguments[0][key]);
            }
            return true;
        }
        if (length > 1) {
            var arg0 = arguments[0],
            arg1 = arguments[1];
            if (D.isObject(arg1) && D.isObject(arg0)) {
                D.each(arg1,
                function(i, str) {
                    arg0[i] = str;
                });
                return arg0;
            }
            return arguments[1] || arguments[0];
        }
        return false;
    };
    system.ajax.prototype = system.ajaxPrototype;
    D.extend({
        parseJSON: function(string, T) {
            return system.JsonString.StringToJson(string, T);
        },
        toJSON: function(JSON) {
            return system.JsonString.JsonToString(JSON);
        },
        setVar: function(name) {
            try {
                delete window[varName];
            } catch(e) {
                window[varName] = null;
            }
            window[name] = D;
        },
        isObject: function(obj) {
            try {
                return toString.call(obj) == "[object Object]" && typeof obj.nodeType != "number" && obj != window && !!obj;
            } catch(e) {
                return false;
            }
        },
        update: function(getObj) {
            var elem, i = 0,
            array = [];
            while (elem = getObj.nodeList[i++]) {
                if (elem.ownerDocument) {
                    elem.parentNode && array.push(elem);
                } else array.push(elem);
            }
            getObj.nodeList = array;
        },
        isArray: function(obj) {
            return toString.call(obj) === "[object Array]";
        },
        isFunction: function(obj) {
            return toString.call(obj) === "[object Function]";
        },
        isEmptyObject: function(obj) {
            for (var name in obj) {
                if (obj.hasOwnProperty(name) && obj[name] != null) {
                    return false;
                }
            }
            return true;
        },
        createScript: function(srcTxt) {
            var head = DOC.getElementsByTagName("head").item(0),
            script;
            if (head) {
                script = DOC.createElement("script");
                D.isString(srcTxt) && (script.src = srcTxt);
                head.appendChild(script);
                return [head, script];
            }
        },
        post: function(url, data, success) {
            return new system.ajax().post(url, data, success);
        },
        get: function(url, data, success) {
            return new system.ajax().get(url, data, success);
        },
        getJSON: function(url, data, success) {
            return new system.ajax().getJSON(url, data, success);
        },
        ajax: function(options) {
            var returns = new system.ajax();
            if (D.isObject(options)) {
                returns.ajax(options);
            }
            return returns;
        },
        styleName: function(name) {
            try {
                return name.replace(/-([a-z])/gi,
                function(all, letter) {
                    return letter.toUpperCase();
                });
            } catch(e) {
                return name;
            }
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
            return ! (number === null || isNaN(number));
        },
        isUndefined: function(str) {
            return typeof str == "undefined";
        },
        isString: function(str) {
            return typeof str == "string";
        },
        each: function(obj, fun) {
            var elem, i = 0;
            if (D.isFunction(obj)) {
                while (elem = this[i++]) {
                    obj.call(elem);
                }
            } else if ((D.isObject(obj) || D.isArray(obj)) && D.isFunction(fun)) {
                for (i in obj) {
                    obj.hasOwnProperty && obj.hasOwnProperty(i) && fun(i, obj[i]);
                }
                return true;
            }
            return false;
        },
        objToUrl: function(obj) {
            if (D.isObject(obj)) {
                var str = "";
                D.each(obj,
                function(key, val) {
                    D.isTxt(val) && (str += ENCODE(key) + "=" + ENCODE(val) + "&");
                });
                return str.replace(/&+$/, "");
            }
            return obj;
        },
        getMobile: function() {
            if (saveGetMobile) return saveGetMobile;
            var ua = navigator.userAgent,
            android = ua.match(/(Android)\s+([\d.]+)/),
            ipad = ua.match(/(iPad).*OS\s([\d_]+)/),
            iphone = !ipad && ua.match(/(iPhone\sOS)\s([\d_]+)/),
            webos = ua.match(/(webOS|hpwOS)[\s\/]([\d.]+)/),
            touchpad = webos && ua.match(/TouchPad/),
            kindle = ua.match(/Kindle\/([\d.]+)/),
            silk = ua.match(/Silk\/([\d._]+)/),
            blackberry = ua.match(/(BlackBerry).*Version\/([\d.]+)/);
            return saveGetMobile = {
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
            for (var i = 0,
            length = array.length; i < length; i++) {
                if (array[i] === elem) {
                    return i;
                }
            }
            return - 1;
        },
        urlRevise: function(url, args) {
            if (args != "" && D.isTxt(args)) {
                url += /\?/.test(url) ? "&" + args: "?" + args;
            }
            return url;
        },
        isHtml5: function() {
            return !! DOC.createElement("canvas").getContext;
        },
        html5Attribute: function(attribute) {
            try {
                var attributeLow = attribute ? attribute.toLowerCase() : "transform";
                attribute = attributeLow.replace(/^\w/, attribute.charAt(0).toUpperCase());
                var bodyStyle = DOC.body.style,
                arr = [attributeLow, "Ms" + attribute, "Moz" + attribute, "Webkit" + attribute, "O" + attribute],
                save = false;
                for (var i = 0; i < 5; i++) {
                    if (arr[i] in bodyStyle) {
                        save = arr[i];
                        break;
                    }
                }
            } catch(e) {}
            return save;
        }
    });
    D.each(["width", "height", "top", "left"],
    function(i, item) {
        D.fn[item] = function(item, newItem) {
            return function(str) {
                if (str == null) {
                    var node = this.nodeList[0],
                    offset = "offset" + newItem;
                    if (!node) return null;
                    if (node == window || node == DOC) {
                        if (newItem == "Width") {
                            return system.winWH("Width");
                        }
                        if (newItem == "Height") {
                            return system.winWH("Height");
                        }
                        node = DOC.body;
                    }
                    return offset in node ? node[offset] : null;
                }
                /^[0-9]+$/.test(str) && (str += "px");
                return this.css(item, str);
            };
        } (item, item.replace(/^\w/, item.charAt(0).toUpperCase()));
    });
    D.fn.on = D.fn.bind;
    D.fn.off = D.fn.unbind; (function() {
        var A, eventArr = {
            add: [function() {
                A = arguments;
                A[0].addEventListener(A[1], A[2], false);
            },
            function() {
                A = arguments;
                A[0].removeEventListener(A[1], A[2], false);
            }],
            att: [function() {
                A = arguments;
                A[0].attachEvent("on" + A[1], A[2]);
            },
            function() {
                A = arguments;
                A[0].detachEvent("on" + A[1], A[2]);
            }],
            on: [function() {
                A = arguments;
                A[0]["on" + A[1]] = A[2];
            },
            function() {
                A = arguments;
                A[0]["on" + A[1]] = null;
            }]
        },
        add;
        if (DOC.addEventListener) {
            add = eventArr.add;
            add[0].add = 1;
        } else if (DOC.attachEvent) {
            add = eventArr.att;
            add[0].att = 1;
        } else {
            add = eventArr.on;
            add[0].on = 1;
        }
        addEvent = D.addEvent = add[0];
        delEvent = D.delEvent = add[1];
        eventArr = A = add = null;
    })();
    var trim = D.trim = function(str) {
        try {
            return str.replace(/^(\s|\u00A0)+|(\s|\u00A0)+$/g, "");
        } catch(e) {
            return str;
        }
    }; (function(args) {
        var eveName, i = 0;
        while (eveName = args[i++]) {
            D.fn[eveName] = function(eveName) {
                return function(callback) {
                    if (D.isUndefined(callback)) {
                        D.each.call(this.nodeList,
                        function() {
                            if (this[eveName]) {
                                this[eveName]();
                            } else {
                                var MingGeBind = this.MingGeBind,
                                this_ = this;
                                MingGeBind && MingGeBind[eveName] && D.each(MingGeBind[eveName].concat(),
                                function(key, val) {
                                    var callback = val.callback;
                                    try {
                                        callback.isOne && system.DelElemEve(this_, eveName, callback);
                                        callback.call(this_);
                                    } catch(e) {}
                                });
                            }
                        });
                        return this;
                    }
                    return this.bind(eveName, callback);
                };
            } (eveName);
        }
        args = i = null;
    })(["blur", "focus", "focusin", "focusout", "resize", "scroll", "unload", "click", "dblclick", "mousedown", "mouseup", "mousemove", "mouseover", "mouseout", "mouseenter", "mouseleave", "change", "select", "submit", "keydown", "keypress", "keyup", "error", "touchstart", "touchmove", "touchend", "touchcancel"]);
    window[varName] = D;
})(window, "$");
