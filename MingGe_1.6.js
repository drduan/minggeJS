/*  MingGEjs框架1.6
 *  
 *  你会用JQUERY，那你也会用这个框架，语法都是一样的！
 *
 *  MingGejs选择器的执行速度，是JQUERY的十倍以上,绝对排行世界尖端
 *
 *  作者：明哥先生 --QQ399195513 QQ群461550716 官网www.shearphoto.com
 */
(function(window, varName, undefined) {
    var MingGEjs = "1.6",
    IfGetClassName = document.getElementsByClassName ? true: false,
    IfQuery = document.querySelectorAll ? true: false,
    MySlice = Array.prototype.slice,
    rquickExpr = /^(?:#([\w-]+)|(\w+)|\.([\w-]+))$/,
    toString = Object.prototype.toString,
    fcamelCase = function(all, letter) {
        return letter.toUpperCase();
    },
    rdashAlpha = /-([a-z])/gi,
    ralpha = /alpha\([^)]*\)/,
    transformReg = /^\s?(matrix3d|translate3d|translateX|translateY|translateZ|scale3d|scaleX|scaleY|scaleZ|rotate3d|rotateX|rotateY|rotateZ|perspective|matrix|translate|translateX|translateY|scale|scaleX|scaleY|rotate|skew|skewX|skewY)\s?$/i,
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
    system = {
        transform: false,
        bindEvent: false,
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
                while (elem = this.ObjArray[i++]) {
                    circulateNode.call(newD, elem, R);
                }
                newD.ObjArray = removing(newD.ObjArray);
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
            while (elem = this.ObjArray[i++]) {
                if (Reg.test(elem[analyseResult[1]])) {
                    newD.ObjArray.push(elem);
                }
                newD.ObjArray = removing(newD.ObjArray);
            }
            return newD;
        },
        animate: function(params, speed, callback, model) {
            model = trim(model);
            model = "string" == typeof model && /^linear$|^ease$|^ease-in$|^ease-out$|^ease-in-out$|^cubic-bezier\s?\(.+\)$/.test(model) ? model: "ease-out";
            var timingFunction = system.transition + "TimingFunction",
            elem, transitionArr = {},
            this_ = this,
            timer, eventEnd = function() {
                timer && (clearInterval(timer), timer = null);
                var a, b = 0,
                style;
                while (a = this_.ObjArray[b++]) {
                    if (a.isMingGeAnimate) {
                        style = a.style;
                        style[system.transition] = style[timingFunction] = null;
                        callback.call(a);
                    }
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
            cmd = D.trim(cmd);
            switch (cmd) {
            case "外前":
            case "beforeBegin":
                cmd = "beforeBegin";
                break;

            case "外后":
            case "afterEnd":
                cmd = "afterEnd";
                break;

            case "内前":
            case "afterBegin":
                cmd = "afterBegin";
                break;

            case "内后":
            case "beforeEnd":
            default:
                cmd = "beforeEnd";
                break;
            }
            return cmd;
        },
        insertHTML: function(str, cmd) {
            cmd = system.cmdFun(cmd);
            str = trim(str);
            D.isTxt(str) && this.each(function() {
                this.insertAdjacentHTML(cmd, str);
            });
            return this;
        },
        createNode: function(name, attribute, cmd) {
            var newD = new D(),
            fun,
            attr = {};
            if (D.isTxt(attribute)) {
                attr.html = D.trim(attribute);
            } else if (D.isObject(attribute)) {
                attr = attribute;
                attr.value && (attr.html = attr.value, delete attr.value);
            }
            name = D.trim(name);
            cmd = system.cmdFun(cmd);
            fun = function() {
                var div = document.createElement("div"),
                node = document.createElement(name),
                MingGeTemp = "MingGeTemp" + Math.random().toString().match(/[^.]+D/),
                i;
                div.appendChild(node);
                for (i in attr) {
                    if (i != "id" && attr[i] && D.isTxt(attr[i])) {
                        i == "html" || node.setAttribute(i, attr[i]);
                    }
                }
                node.id = MingGeTemp;
                this.insertAdjacentHTML(cmd, div.innerHTML);
                node = document.getElementById(MingGeTemp);
                attr.id ? node.id = attr.id: node.removeAttribute ? node.removeAttribute("id") : node.id = "";
                try {
                    attr.html && typeof node.value === "string" ? node.value = attr.html: node.innerHTML = attr.html;
                } catch(e) {}
                newD.ObjArray.push(node);
            };
            this.each(fun);
            newD.SelectorTxt = document.body;
            newD.SelectorStr = "000";
            return newD;
        },
        addEvent: function(obj, evetype, fun) {
            var addevent = {
                add: function() {
                    D.isFunction(fun) && obj.addEventListener(evetype, fun, false);
                },
                att: function() {
                    D.isFunction(fun) && obj.attachEvent("on" + evetype, fun);
                },
                no: function() {
                    D.isFunction(fun) && (obj["on" + evetype] = fun);
                }
            };
            this.bindEvent = this.bindEvent || obj.addEventListener && "add" || obj.attachEvent && "att" || "no";
            addevent[this.bindEvent] && addevent[this.bindEvent]();
        },
        delEvent: function(obj, evetype, fun) {
            var delevent = {
                add: function() {
                    D.isFunction(fun) && obj.removeEventListener(evetype, fun, false);
                },
                att: function() {
                    D.isFunction(fun) && obj.detachEvent("on" + evetype, fun);
                },
                no: function() {
                    D.isFunction(fun) && (obj["on" + evetype] = null);
                }
            };
            this.bindEvent = this.bindEvent || obj.addEventListener && "add" || obj.attachEvent && "att" || "no";
            delevent[this.bindEvent] && delevent[this.bindEvent]();
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
            simplify: function(url, type, async, data, success, timeout, cache) {
                this.ajax({
                    url: url,
                    type: type,
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
            handle: function(xmlhttp, arg) {
                if (4 == xmlhttp.readyState) {
                    if (this.stop === true) return;
                    this.transit = true;
                    this.removeUploadEve();
                    if (arg.timeout && arg.async) {
                        clearTimeout(this.timeout);
                        this.timeout = false;
                    }
                    if (200 == xmlhttp.status) {
                        var responseText = this.serverdata = trim(xmlhttp.responseText);
                        D.isFunction(arg.success) && arg.success(responseText, "success");
                    } else {
                        this.erromsg = xmlhttp.status;
                        D.isFunction(arg.error) && arg.error(xmlhttp.status);
                    }
                } else {
                    if (0 == xmlhttp.readyState) {
                        if (this.stop === true) return;
                        this.removeUploadEve();
                        if (arg.timeout && arg.async) {
                            clearTimeout(this.timeout);
                            this.timeout = false;
                        }
                        this.erromsg = xmlhttp.readyState;
                        this.transit = true;
                        D.isFunction(arg.error) && arg.error(xmlhttp.readyState);
                    }
                }
            },
            out: function(arg) {
                this.transit = true;
                this.erromsg = 504;
                this.stop = true;
                this.removeUploadEve();
                D.isFunction(arg.error) && arg.error(504);
            },
            removeUploadEve: function() {},
            ajax: function(arg) {
                if (arg.lock && !this.transit) return false;
                this.transit = false;
                this.stop = this.erromsg = false;
                var xmlhttp;
                if (window.XMLHttpRequest) {
                    xmlhttp = new XMLHttpRequest();
                } else {
                    xmlhttp = new ActiveXObject("Microsoft.XMLHTTP");
                }
                arg.type = arg.type.toUpperCase();
                var ContentType = function() {};
                arg.data = D.objToUrl(arg.data);
                if (D.isTxt(arg.data)) {
                    arg.data = arg.data && trim(arg.data);
                    ContentType = function() {
                        xmlhttp.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
                    };
                } else {
                    if (Object.prototype.toString.call(arg.data) !== "[object FormData]") {
                        arg.data = "";
                        ContentType = function() {
                            xmlhttp.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
                        };
                    } else {
                        if (D.isFunction(arg.progress)) {
                            xmlhttp.upload.addEventListener("progress", arg.progress, false);
                            this.removeUploadEve = function() {
                                xmlhttp.upload.removeEventListener("progress", arg.progress, false);
                            };
                        }
                        arg.type = "POST";
                    }
                }
                var SendArg = arg.data == "" ? [null, ""] : [arg.data, "?" + arg.data],
                self = this;
                D.isFunction(arg.complete) && arg.complete();
                arg.timeout && arg.async && (this.timeout = setTimeout(function() {
                    self.out(arg);
                },
                arg.timeout));
                if (arg.async === true) {
                    xmlhttp.onreadystatechange = function() {
                        self.handle(xmlhttp, arg);
                    };
                }
                try {
                    switch (arg.type) {
                    case "POST":
                        xmlhttp.open("POST", arg.url, arg.async);
                        ContentType();
                        break;

                    default:
                        xmlhttp.open("GET", arg.url + SendArg[1], arg.async);
                        arg.cache === true || xmlhttp.setRequestHeader("If-Modified-Since", "0");
                        break;
                    }
                } catch(e2) {
                    this.erromsg = 505;
                    this.removeUploadEve();
                    if (arg.timeout && arg.async) {
                        clearTimeout(this.timeout);
                        this.timeout = false;
                    }
                    this.transit = true;
                    D.isFunction(arg.error) && arg.error(505);
                    return;
                }
                xmlhttp.send(SendArg[0]);
                if (arg.async === false) {
                    self.handle(xmlhttp, arg);
                }
            }
        },
        JsonString: {
            _json_: null,
            JsonToString: function(arr) {
                try {
                    this._json_ = new Array();
                    this._read_(arr, true);
                    var JsonJoin = this._json_.join("");
                    JsonJoin = JsonJoin.replace(/,([\}\]])/g,
                    function(a, b) {
                        return b;
                    });
                    this._json_ = null;
                    return JsonJoin;
                } catch(e) {
                    alert("格式不符，转换失败");
                    return null;
                }
            },
            StringToJson: function(arrtxt) {
                if (typeof arrtxt !== "string") {
                    alert("你传入不是JSON字符串");
                    return null;
                }
                try {
                    var array = new Function("return " + "(" + arrtxt + ")")();
                    var type = this._type_(array);
                    if (type !== "[object Object]" && type !== "[object Array]") {
                        return false;
                    }
                    return array;
                } catch(e) {
                    return false;
                }
            },
            _type_: function(arr) {
                if (typeof arr.nodeType === "number") return "[object document]";
                var Types = Object.prototype.toString.call(arr);
                return Types;
            },
            _addjson_: function(types, txt, txt2, TrueFalse) {
                var run = {
                    "[object Object]": txt,
                    "[object Array]": txt2
                };
                this._json_.push(run[types]);
            },
            _addstring_: function(parameter) {
                var of = typeof parameter;
                if (of === "string") return '"' + parameter + '"';
                if (of === "number") return parameter;
                var types = this._type_(parameter);
                if (types === "[object Object]" || types === "[object Array]") {
                    return false;
                }
                return '""';
            },
            _read_: function(arr, TrueFalse) {
                var types = this._type_(arr);
                if (TrueFalse && types !== "[object Object]" && types !== "[object Array]") {
                    alert("你传入不是数组或JSON");
                    return this._json_ = null;
                }
                this._addjson_(types, "{", "[", TrueFalse);
                for (var a in arr) {
                    if (typeof arr.constructor.prototype[a] === "undefined") {
                        var ArrA = this._addstring_(arr[a]);
                        if (typeof ArrA !== "boolean") {
                            this._addjson_(types, '"' + a + '":' + ArrA + ",", ArrA + ",");
                        } else {
                            this._addjson_(types, '"' + a + '":', "");
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
            system.bindEvent = system.bindEvent || document.addEventListener && "add" || document.attachEvent && "att" || "no";
            function b() {
                try {
                    var c = function() {
                        "complete" === document.readyState && (system.addEvent(document, "readystatechange", c), a());
                    },
                    d = window.frameElement;
                } catch(e) {
                    return system.addEvent(document, "readystatechange", c),
                    void 0;
                }
                if (null != d) return system.addEvent(document, "readystatechange", c),
                void 0;
                try {
                    document.documentElement.doScroll("left");
                } catch(c) {
                    return setTimeout(b, 13),
                    void 0;
                }
                a();
            }
            var c;
            D.isFunction(a) && (system.bindEvent == "add" ? (c = function() {
                document.removeEventListener("DOMContentLoaded", c, !1),
                a();
            },
            document.addEventListener("DOMContentLoaded", c, !1)) : b());
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
    trim = function(str) {
        try {
            return str.replace(/^(\s|\u00A0)+|(\s|\u00A0)+$/g, "");
        } catch(e) {
            return str;
        }
    },
    circulateNode = function(parent, R) {
        if (R[0] || R[1][3].Id && document === parent) {
            var elemName = R[1][2];
            var ObjArray = parent[R[1][0]](elemName === "MingGeAllelem2015" ? "*": elemName);
            if (ObjArray) {
                ObjArray = R[1][3].Id ? [ObjArray] : listNodeToArray(ObjArray);
                this.ObjArray = this.ObjArray.concat(ObjArray);
            }
            return;
        }
        var ListNode = parent.getElementsByTagName("*"),
        elem,
        i = 0,
        Reg = new RegExp("(^|\\s)" + R[1][2] + "(\\s|$)");
        while (elem = ListNode[i++]) {
            if (Reg.test(elem[R[1][1]])) {
                this.ObjArray.push(elem);
            }
        }
    },
    optionColation = function(Z) {
        var analyseResult = analyse(Z);
        return analyseResult ? [analyseResult[3].Tag || IfGetClassName && analyseResult[3].Class, analyseResult] : false;
    },
    removing = function(array) {
        var contrast, IndexOne = 0,
        ResultArray = [],
        IndexTwo,
        contrastTwo,
        NoAdd = false;
        if (array.item || D.isArray(array)) {
            while (contrast = array[IndexOne++]) {
                IndexTwo = 0;
                while (contrastTwo = ResultArray[IndexTwo++]) {
                    if (contrast === contrastTwo) {
                        NoAdd = true;
                        break;
                    }
                }
                NoAdd || ResultArray.push(contrast);
                NoAdd = false;
            }
        }
        return ResultArray;
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
                if (getObj.SelectorTxt === document || getObj.SelectorTxt === window) {
                    return newD;
                }
                if (getObj.SelectorTxt && str != "") {
                    if (findTrue.filter) {
                        if (getObj.SelectorTxt.ownerDocument) {
                            if (getObj.SelectorStr && getObj.SelectorStr !== "000") {
                                MingGeId = "#" + (getObj.SelectorTxt.id || (remove = true, getObj.SelectorTxt.id = "tempMingGeId2015"));
                                merge = mergeSelector(MingGeId, newD.SelectorStr = mergeSelector(getObj.SelectorStr, str, ""), " ");
                                newD.ObjArray = listNodeToArray(getObj.SelectorTxt.querySelectorAll(merge));
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
                            newD.ObjArray = listNodeToArray(getObj.SelectorTxt.querySelectorAll(merge));
                            newD.SelectorTxt = getObj.SelectorTxt;
                            remove && getObj.SelectorTxt.removeAttribute("id");
                            return newD;
                        }
                        merge = mergeSelector(getObj.SelectorTxt, str, " ");
                    }
                }
                newD.ObjArray = listNodeToArray(document.querySelectorAll(merge));
                newD.SelectorTxt = merge;
            } else {
                var match = /^#([\w-_]+)$/.exec(str),
                getid;
                newD.ObjArray = match ? (getid = document.getElementById(match[1])) ? [getid] : [] : listNodeToArray(document.querySelectorAll(str));
                newD.SelectorTxt = str;
            }
        } catch(e) {}
        return newD;
    },
    CanonicalStructure = function(str, getObj, findTrue) {
        var newD = new D(),
        qu;
        if (typeof str === "string") {
            str = trim(str);
            if (IfQuery) {
                if ((qu = MyQuerySelector(str, getObj, findTrue, newD)) != -1) return qu;
            }
            getObj && D.update(getObj);
            var match = str.match(/[^\,]+/g),
            ObjArray = [];
            if (match) {
                var length = match.length;
                if (length === 1) {
                    return space(match[0], getObj, findTrue);
                }
                for (var i = 0; i < length; i++) {
                    ObjArray = ObjArray.concat(space(match[i], getObj, findTrue).ObjArray);
                }
                return newD.ObjArray = removing(ObjArray),
                newD;
            }
            return newD;
        }
        return findTrue ? newD: newD.init(str || 0, document);
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
                obj = i == 0 ? findTrue ? findTrue.find ? system.find.call(obj, match[0]) : system.filter.call(obj, match[0]) : new D().init(match[0], document) : system.filter.call(obj, match[i]);
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
        this.ObjArray = [];
        this.animateList = [];
    };
    D.fn = D.prototype = {
        version: "你使用的版本是MingGejs1.6",
        init: function(string, parent) {
            var R;
            if (D.isFunction(string)) {
                system.ready(string);
                return this;
            }
            if (string === window || string === document || string.ownerDocument) {
                this.SelectorTxt = string;
                this.ObjArray = [string];
            } else if (R = optionColation(string)) {
                circulateNode.call(this, parent, R);
            }
            return this;
        },
        is: function(str) {
            D.update(this);
            str = trim(str);
            switch (str) {
            case ":animate":
                return this.ObjArray[0].isMingGeAnimate ? true: false;
                break;
            }
        },
        append: function(name) {
            return system.createNode.call(this, name, {},
            "beforeEnd");
        },
        createNode: function() {
            D.update(this);
            return system.createNode.apply(this, arguments);
        },
        load: function(url, arg) {
            var this_ = this,
            successFun = function(HTML) {
                this_.each(function() {
                    typeof this.value === "string" ? this.value = HTML: this.innerHTML = HTML;
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
            D.update(this);
            return system.insertHTML.aply(this, arguments);
        },
        stop: function() {
            system.transition || (system.transition = D.html5Attribute("transition"));
            if (!system.transition) return this;
            var style;
            return this.each(function() {
                if (this.isMingGeAnimate) {
                    delete this.isMingGeAnimate;
                    this.mingGeAnimateList && delete this.mingGeAnimateList;
                    var timingFunction = system.transition + "TimingFunction";
                    style = this.style;
                    style[system.transition] = style[timingFunction] = null;
                }
            });
        },
        fadeToggle: function(time, callback) {
            var arr;
            this.each(function() {
                arr = system.oStyleValue(this);
                if (system.original("display", arr) == "none") {
                    D(this).fadeIn(time, callback);
                } else {
                    D(this).fadeOut(time, callback);
                }
            });
        },
        fadeOut: function(time, callback) {
            var arr, newD = new D();
            system.transition || (system.transition = D.html5Attribute("transition"));
            this.each(function() {
                arr = system.oStyleValue(this);
                system.original("display", arr) == "none" || newD.ObjArray.push(this);
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
        fadeIn: function(time, callback) {
            system.transition || (system.transition = D.html5Attribute("transition"));
            var arr, newD = new D();
            this.each(function() {
                arr = system.oStyleValue(this);
                if (system.original("display", arr) == "none") {
                    system.transition && D(this).css("opacity", 0);
                    newD.ObjArray.push(this);
                    if (this.style.display == "none") {
                        this.style.display = "";
                        system.original("display", arr) == "none" && (this.style.display = "block");
                    } else {
                        this.style.display = "block";
                    }
                }
            });
            if (system.transition) {
                setTimeout(function() {
                    newD.animate({
                        opacity: 1
                    },
                    time - 5,
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
            D.update(this);
            system.transition || (system.transition = D.html5Attribute("transition"));
            if (!system.transition) {
                this.css(params);
                return this;
            }
            if (!D.isObject(params)) return this;
            var typeSpeed = typeof speed,
            newCallback;
            if (typeSpeed !== "number") {
                if (typeSpeed === "string") {
                    typeSpeed = parseFloat(speed);
                    isNaN(typeSpeed) && (speed = 200);
                } else if (typeSpeed === "function") {
                    callback = speed;
                    speed = 200;
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
                    newD.ObjArray = [this];
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
            while (elem = this.ObjArray[b++]) {
                if (elem.isMingGeAnimate) {
                    elem.mingGeAnimateList ? elem.mingGeAnimateList.push(arg) : elem.mingGeAnimateList = [arg];
                } else {
                    elem.isMingGeAnimate = 1;
                    newD.ObjArray.push(elem);
                    lock || (lock = true);
                }
            }
            lock && system.animate.apply(newD, arg);
            return this;
        },
        on: function(eveName, callback) {
            D.update(this);
            var elem, i = 0,
            type = typeof eveName;
            if (type === "string" && D.isFunction(callback)) {
                while (elem = this.ObjArray[i++]) {
                    elem["on" + eveName] = callback;
                }
            } else if (type === "object") {
                while (elem = this.ObjArray[i++]) {
                    for (var key in eveName) {
                        elem["on" + key] = eveName[key];
                    }
                }
            }
            return this;
        },
        empty: function() {
            return this.each(function(i) {
                if (this.nodeType == 1) {
                    this.innerHTML = this.value = "";
                }
            });
        },
        remove: function() {
            this.each(function() {
                this.parentNode.removeChild(this);
            });
            this.ObjArray = [];
            return this;
        },
        click: function(callback) {
            return this.bind("click", callback);
        },
        mouseover: function(callback) {
            return this.bind("mouseover", callback);
        },
        mouseout: function(callback) {
            return this.bind("mouseout", callback);
        },
        bind: function(eveName, callback) {
            D.update(this);
            var elem, i = 0,
            type = typeof eveName;
            if (type === "string" && D.isFunction(callback)) {
                while (elem = this.ObjArray[i++]) {
                    system.addEvent(elem, eveName, callback);
                }
            } else if (type === "object") {
                while (elem = this.ObjArray[i++]) {
                    for (var key in eveName) {
                        system.addEvent(elem, key, eveName[key]);
                    }
                }
            }
            return this;
        },
        unbind: function(eveName, callback) {
            var elem, i = 0;
            D.update(this);
            if (callback) {
                while (elem = this.ObjArray[i++]) {
                    system.delEvent(elem, eveName, callback);
                }
            } else while (elem = this.ObjArray[i++]) {
                elem[on + "eveName"] = null;
            }
            return this;
        },
        one: function(eveName, callback) {
            var type = typeof eveName;
            if (type === "string" && D.isFunction(callback)) {
                var newOne = function() {
                    system.delEvent(this, eveName, newOne);
                    callback.call(this);
                };
                return this.bind(eveName, newOne);
            }
            if (type === "object") {
                var eveObj = {};
                for (var key in eveName) {
                    eveObj[key] = function(keys) {
                        return function() {
                            system.delEvent(this, keys, eveObj[keys]);
                            eveName[keys].call(this);
                        };
                    } (key);
                }
                return this.bind(eveObj);
            }
        },
        SelectorStr: false,
        SelectorTxt: false,
        ObjArray: [],
        ready: function(callback) {
            system.ready(callback);
        },
        removing: function(array) {
            return removing(array);
        },
        parent: function(re) {
            D.update(this);
            var obj, i = 0,
            newD = new D();
            while (obj = this.ObjArray[i++]) {
                obj.parentNode.tagName == "BODY" || newD.ObjArray.push(obj.parentNode);
            }
            newD.ObjArray = removing(newD.ObjArray);
            newD.SelectorTxt = document.body;
            newD.SelectorStr = "000";
            return re ? newD.filter(re) : newD;
        },
        addClass: function(str) {
            if (typeof str == "string") {
                return this.each(function() {
                    if (this.nodeType === 1) {
                        str = trim(str);
                        var className = this.className;
                        if (className) {
                            this.className = className + " " + str;
                        } else {
                            this.className = str;
                        }
                    }
                });
            }
        },
        removeClass: function(str) {
            if (typeof str == "string") {
                return this.each(function() {
                    if (this.nodeType === 1) {
                        str = trim(str);
                        var className = this.className;
                        if (className) {
                            var reg = RegExp("(^|\\s)" + str + "($|\\s)", "ig");
                            if (reg.test(className)) {
                                this.className = className = trim(className.replace(reg, " "));
                                className == "" && (this.removeAttribute ? this.removeAttribute("class") : this.className = "");
                            }
                        }
                    }
                });
            }
        },
        children: function(elem) {
            return elem ? this.find(elem) : IfQuery ? this.find("*") : this.find("MingGeAllelem2015");
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
            this.SelectorTxt.ownerDocument && !this.SelectorStr && fil.ObjArray[0] && (fil.SelectorTxt = fil.ObjArray[0], fil.SelectorStr = false);
            return fil;
        },
        index: function(obj) {
            try {
                D.update(this);
                if (obj) {
                    return D.inArray(obj.ObjArray[0], this.ObjArray);
                }
                return D.inArray(this.ObjArray[0], this.ObjArray[0].parentNode.getElementsByTagName("*"));
            } catch(e) {
                return - 1;
            }
        },
        eq: function(index) {
            var M = new D();
            D.update(this);
            M = index == null ? this: (index = index < 0 ? this.ObjArray.length + index: index, this.ObjArray[index] && (M.ObjArray = [M.SelectorTxt = this.ObjArray[index]]), M);
            return M;
        },
        size: function() {
            D.update(this);
            return this.ObjArray.length;
        },
        each: function(callback) {
            D.update(this);
            if (D.isFunction(callback)) {
                var length = this.ObjArray.length,
                i = 0;
                for (; i < length; i++) {
                    callback.call(this.ObjArray[i], i, length);
                }
            }
            return this;
        },
        html: function(str) {
            D.update(this);
            try {
                if (D.isTxt(str)) {
                    this.ObjArray[0].innerHTML = str;
                    return this;
                }
                return this.ObjArray[0] ? this.ObjArray[0].innerHTML: null;
            } catch(e) {
                return this;
            }
        },
        css: function(args, val) {
            var i = 0,
            elem, type = typeof args,
            key, arrayKey = {},
            sty;
            system.opacity || (system.opacity = D.html5Attribute("opacity") || "filter");
            system.transform || (system.transform = D.html5Attribute("transform"));
            if (type === "string") {
                args = D.styleName(args);
                while (elem = this.ObjArray[i++]) {
                    try {
                        sty = elem.style;
                        arrayKey = system.style(sty, args, val);
                        sty[arrayKey[0]] = arrayKey[1];
                    } catch(e) {}
                }
            } else if (type === "object") {
                while (elem = this.ObjArray[i++]) {
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
        val: function(str) {
            try {
                D.update(this);
                if (D.isTxt(str)) {
                    this.ObjArray[0].value = str;
                    return this;
                }
                return this.ObjArray[0] ? this.ObjArray[0].value: null;
            } catch(e) {
                return null;
            }
        },
        get: function(index) {
            D.update(this);
            return index == null ? this.ObjArray: (index = index < 0 ? this.ObjArray.length + index: index, this.ObjArray[index]);
        }
    };
    D.fn.extend = D.extend = function() {
        var length = arguments.length,
        key;
        if (length === 1 && typeof arguments[0] === "object") {
            for (key in arguments[0]) {
                this[key] || (this[key] = arguments[0][key]);
            }
            return true;
        }
        if (length > 1) {
            return arguments[1] || arguments[0];
        }
        return false;
    };
    system.ajax.prototype = system.ajaxPrototype;
    D.extend({
        parseJSON: function(string) {
            return system.JsonString.StringToJson(string);
        },
        toJSON: function(JSON) {
            return system.JsonString.JsonToString(JSON);
        },
        trim: function(str) {
            return trim(str);
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
            return toString.call(obj) === "[object Object]";
        },
        update: function(getObj) {
            var elem, i = 0,
            array = [];
            while (elem = getObj.ObjArray[i++]) {
                if (elem.ownerDocument) {
                    elem.parentNode && array.push(elem);
                } else array.push(elem);
            }
            getObj.ObjArray = array;
        },
        isArray: function(obj) {
            return toString.call(obj) === "[object Array]";
        },
        isFunction: function(obj) {
            return toString.call(obj) === "[object Function]";
        },
        isEmptyObject: function(obj) {
            for (var name in obj) {
                return false;
            }
            return true;
        },
        createScript: function(srcTxt) {
            if (typeof srcTxt === "string") {
                var head = document.getElementsByTagName("head").item(0),
                script;
                if (head) {
                    script = document.createElement("script");
                    head.appendChild(script);
                    script.src = srcTxt;
                }
            }
        },
        post: function(url, data, success) {
            return new system.ajax().simplify(url, "post", true, data, success, 2e4, false);
        },
        get: function(url, data, success) {
            return new system.ajax().simplify(url, "get", true, data, success, 2e4, true);
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
                return name.replace(rdashAlpha, fcamelCase);
            } catch(e) {
                return name;
            }
        },
        query: document.querySelectorAll,
        userAgent: uaMatch(navigator.userAgent),
        isIe: function() {
            return this.userAgent.browser === "msie" ? this.userAgent.version.charAt(0) : false;
        },
        isTxt: function(str) {
            return typeof str == "string" || !isNaN(str);
        },
        objToUrl: function(obj) {
            if (D.isObject(obj)) {
                var str = "",
                val;
                for (var key in obj) {
                    val = obj[key];
                    D.isTxt(val) && (str += key + "=" + val + "&");
                }
                return str.replace(/&+$/, "");
            }
            return obj;
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
        isHtml5: function() {
            return !!document.createElement('canvas').getContext;
        },
        html5Attribute: function(attribute) {
            try {
                var attributeLow = attribute ? attribute.toLowerCase() : "transform";
                attribute = attributeLow.replace(/^\w/, attribute.charAt(0).toUpperCase());
                var bodyStyle = document.body.style,
                arr = new Array(attributeLow, "Ms" + attribute, "Moz" + attribute, "Webkit" + attribute, "O" + attribute),
                save = false;
                for (var i = 0; i < arr.length; i++) {
                    if (arr[i] in bodyStyle) {
                        save = arr[i];
                        break;
                    }
                }
                return save;
            } catch(e) {
                return false;
            }
        }
    });
    window[varName] = D;
})(window, "$");