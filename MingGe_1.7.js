<<<<<<< HEAD:MingGe_1.6.js
/*  MingGEjs框架1.6
 *
=======
/*  MingGEjs类库1.7
 *  
>>>>>>> 2548195c687ab5c6a2844cffaf870fc46dfc0cf0:MingGe_1.7.js
 *  你会用JQUERY，那你也会用这个框架，语法都是一样的！
 *
 *  MingGejs选择器的执行速度，是JQUERY的十倍以上,绝对排行世界尖端,不喜匆喷，本屌要占有JQUERY用户份额关你X事
 *
 *  作者：明哥先生 --QQ399195513 QQ群461550716 官网www.shearphoto.com
 */
<<<<<<< HEAD:MingGe_1.6.js
(function (window, varNames, undefined) {
    var varName = varNames[0];

    // 我做了一个艰难的决定，我觉得如果MingGEjs的用户还在使用JQUERY是一种很SB的行为
    // 所以我有责任提醒用户：前端的世界只需要一个MingGEjs
    (function () {
        for (var i = 0; i < varNames.length; i++) {
            var n = varNames[i];
            if (window[n] && !window[n].isMingGe) {
                alert('为了避免因为jQuery自身的Bug而影响您的页面正常运行，请去掉jQuery！\n请记住：前端的世界只需要一个MingGEjs，其他都是浮云！支持国产，从我做起！');
                break;
            }
        }
    })();

    var MingGEjs = '1.6';
    var IfGetClassName = document.getElementsByClassName ? true : false;
    var IfQuery = document.querySelectorAll ? true : false;
    var MySlice = Array.prototype.slice;
    var rquickExpr = /^(?:#([\w-]+)|(\w+)|\.([\w-]+))$/;
    var toString = Object.prototype.toString;

    function fcamelCase(all, letter) {
        return letter.toUpperCase();
    }

    var rdashAlpha = /-([a-z])/gi;
    var ralpha = /alpha\([^)]*\)/;
    var transformReg = /^\s?(matrix3d|translate3d|translateX|translateY|translateZ|scale3d|scaleX|scaleY|scaleZ|rotate3d|rotateX|rotateY|rotateZ|perspective|matrix|translate|translateX|translateY|scale|scaleX|scaleY|rotate|skew|skewX|skewY)\s?$/i;

    function uaMatch(ua) {
=======
(function(window, varName, undefined) {
    var MingGEjs = "1.7",
    IfGetClassName = document.getElementsByClassName ? true: false,
    IfQuery = document.querySelectorAll ? true: false,
    MySlice = Array.prototype.slice,
    rquickExpr = /^(?:#([\w-]+)|(\w+)|\.([\w-]+))$/,
    toString = Object.prototype.toString,
    fcamelCase = function(all, letter) {
        return letter.toUpperCase();
    },
    rdashAlpha = /-([a-z])/gi,
    showFast = {
        fast: 200,
        slow: 600,
        normal: 400
    },
    ralpha = /alpha\([^)]*\)/,
    transformReg = /^\s*(matrix3d|translate3d|translateX|translateY|translateZ|scale3d|scaleX|scaleY|scaleZ|rotate3d|rotateX|rotateY|rotateZ|perspective|matrix|translate|translateX|translateY|scale|scaleX|scaleY|rotate|skew|skewX|skewY)\s*$/i,
    uaMatch = function(ua) {
>>>>>>> 2548195c687ab5c6a2844cffaf870fc46dfc0cf0:MingGe_1.7.js
        ua = ua.toLowerCase();
        var match = /(webkit)[ \/]([\w.]+)/.exec(ua) || /(opera)(?:.*version)?[ \/]([\w.]+)/.exec(ua) || /(msie) ([\w.]+)/.exec(ua) || !/compatible/.test(ua) && /(mozilla)(?:.*? rv:([\w.]+))?/.exec(ua) || [];
        return {
            browser: match[1] || '',
            version: match[2] || '0'
        };
    }

    function analyse(string) {
        var match = rquickExpr.exec(string),
        returnArray = false;
        if (match === null) {
            return false;
        }
        if (match[1]) {
            returnArray = ['getElementById', 'id', match[1], {
                Id: true
            }];
        } else if (match[2]) {
            returnArray = ['getElementsByTagName', 'tagName', match[2], {
                Tag: true
            }];
        } else {
            returnArray = ['getElementsByClassName', 'className', match[3], {
                Class: true
            }];
        }
        return returnArray;
    }

    var system = {
        transform: false,
        bindEvent: false,
<<<<<<< HEAD:MingGe_1.6.js
        oStyleValue: function (elem) {
=======
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
            if (/^(span|ul|b|a|em|strong|a|img)$/i.test(tag)) {
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
            var create = document.createElement(tag),
            bodys = document.body,
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
            var url = arg.url,
            jsonp = arg.jsonp,
            jsonpCallback = arg.jsonpCallback,
            success = arg.success,
            timeout = arg.timeout,
            erro = arg.error,
            data = arg.data,
            match, script, timer, out = function() {
                script && script[0].removeChild(script[1]);
                try {
                    delete window[match];
                } catch(e) {
                    window[match] = null;
                }
            };
            url = url.replace(/\?+$/, "callback");


            if (D.isTxt(data)) {
                url = D.urlRevise(url, D.objToUrl(data));
            }
            jsonp = trim(jsonp);
            if (jsonpCallback) {
                match = trim(jsonpCallback);
            } else {
                jsonp = "[&|\\?]+(?:" + (D.isTxt(jsonp) ? jsonp: "jsoncallback|callback") + ")";
                match = new RegExp("" + jsonp + "\\s*=\\s*([^?]+?)(&|$)", "i").exec(url);
                match = match ? trim(match[1]) : "callback";
            }
            timeout && (timer = setTimeout(function() {
                D.isFunction(erro) && erro(505);
                out();
            },
            timeout));
            window[match] = function(data) {
                timer && (clearTimeout(timer), timer = null);
                if (D.isFunction(success)) {
                    success(system.JsonString.StringToJson(data) || data, "success");
                }
                out();
            };
            script = D.createScript(url);
        },
        htmlVal: function(hv, str) {
            try {
                D.update(this);
                var isIndex;
                if (D.isTxt(str)) {
                    D.each.call(this.ObjArray,
                    function() {
                        system.isIndex(hv, this) && (this[hv] = str);
                    });
                    return this;
                }
                var html = this.ObjArray[0][hv];
                return this.ObjArray[0] ? html: null;
            } catch(e) {
                return null;
            }
        },
        oStyleValue: function(elem) {
>>>>>>> 2548195c687ab5c6a2844cffaf870fc46dfc0cf0:MingGe_1.7.js
            var oStyle = elem.currentStyle ? elem.currentStyle: window.getComputedStyle(elem, null);
            if (oStyle.getPropertyValue) {
                return [oStyle, 'getPropertyValue'];
            }
            return [oStyle, 'getAttribute'];
        },
        original: function (styleName, oStyleValue) {
            return oStyleValue[0][oStyleValue[1]](D.styleName(styleName));
        },
        find: function (Z) {
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
        filter: function (string) {
            var elem, i = 0,
            newD = new D();
            newD.SelectorTxt = this.SelectorTxt;
            var analyseResult = analyse(string);
            if (!analyseResult) {
                return newD;
            }
            var Reg = new RegExp('(^|\\s)' + analyseResult[2] + '(\\s|$)', analyseResult[3].Tag && 'i');
            while (elem = this.ObjArray[i++]) {
                if (Reg.test(elem[analyseResult[1]])) {
                    newD.ObjArray.push(elem);
                }
                newD.ObjArray = removing(newD.ObjArray);
            }
            return newD;
        },
        animate: function (params, speed, callback, model) {
            model = trim(model);
<<<<<<< HEAD:MingGe_1.6.js
            model = 'string' == typeof model && /^linear$|^ease$|^ease-in$|^ease-out$|^ease-in-out$|^cubic-bezier\s?\(.+\)$/.test(model) ? model: 'ease-out';
            var timingFunction = system.transition + 'TimingFunction',
            elem, transitionArr = {},
=======
            model = D.isString(model) && /^(linear|ease|ease-in|ease-out|ease-in-out|cubic-bezier\s*\(.+\))$/.test(model) ? model: "ease-out";
            var timingFunction = system.transition + "TimingFunction",
            transitionArr = {},
>>>>>>> 2548195c687ab5c6a2844cffaf870fc46dfc0cf0:MingGe_1.7.js
            this_ = this,
            timer, eventEnd = function () {
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
            transitionArr[system.transition] = speed + 'ms';
            transitionArr[timingFunction] = model;
            this.css(transitionArr);
            setTimeout(function () {
                this_.css(params);
            },
            5);
            timer = setInterval(system.timeCompute(new Date().getTime(), speed - 1, eventEnd), 5);
            return this;
        },
        cmdFun: function (cmd) {
            cmd = D.trim(cmd);
            switch (cmd) {
<<<<<<< HEAD:MingGe_1.6.js
            case '外前':
            case 'beforeBegin':
                cmd = 'beforeBegin';
                break;

            case '外后':
            case 'afterEnd':
                cmd = 'afterEnd';
                break;

            case '内前':
            case 'afterBegin':
                cmd = 'afterBegin';
                break;

            case '内后':
            case 'beforeEnd':
=======
            case "\u5916\u524d":
            case "beforeBegin":
                cmd = "beforeBegin";
                break;

            case "\u5916\u540e":
            case "afterEnd":
                cmd = "afterEnd";
                break;

            case "\u5185\u524d":
            case "afterBegin":
                cmd = "afterBegin";
                break;

            case "\u5185\u540e":
            case "beforeEnd":
>>>>>>> 2548195c687ab5c6a2844cffaf870fc46dfc0cf0:MingGe_1.7.js
            default:
                cmd = 'beforeEnd';
                break;
            }
            return cmd;
        },
        insertHTML: function (str, cmd) {
            cmd = system.cmdFun(cmd);
            str = trim(str);
            D.isTxt(str) && this.each(function () {
                this.insertAdjacentHTML(cmd, str);
            });
            return this;
        },
        createNode: function (name, attribute, cmd) {
            var newD = new D(),
            fun,
            seachIndex,
            div,
            node,
            MingGeTemp,
            i,
            attr = {};
            if (D.isTxt(attribute)) {
                attr.html = D.trim(attribute);
            } else if (D.isObject(attribute)) {
                attr = attribute;
                attr.value && (attr.html = attr.value, delete attr.value);
            }
            name = D.trim(name);
            cmd = system.cmdFun(cmd);
<<<<<<< HEAD:MingGe_1.6.js
            fun = function () {
                var div = document.createElement('div'),
                node = document.createElement(name),
                MingGeTemp = 'MingGeTemp' + Math.random().toString().match(/[^.]+D/),
=======
            fun = function() {
                div = document.createElement("div"),
                node = document.createElement(name),
                MingGeTemp = "MingGeTemp" + Math.random().toString().match(/[^\.]+$/)[0],
>>>>>>> 2548195c687ab5c6a2844cffaf870fc46dfc0cf0:MingGe_1.7.js
                i;
                seachIndex = seachIndex || system.seachIndex(["value", "innerHTML"], node);
                div.appendChild(node);
                for (i in attr) {
<<<<<<< HEAD:MingGe_1.6.js
                    if (i != 'id' && attr[i] && D.isTxt(attr[i])) {
                        i == 'html' || node.setAttribute(i, attr[i]);
=======
                    if (i != "id" && D.isTxt(attr[i])) {
                        i == "html" || node.setAttribute(i, attr[i]);
>>>>>>> 2548195c687ab5c6a2844cffaf870fc46dfc0cf0:MingGe_1.7.js
                    }
                }
                node.id = MingGeTemp;
                this.insertAdjacentHTML(cmd, div.innerHTML);
                node = document.getElementById(MingGeTemp);
                attr.id ? node.id = attr.id: node.removeAttribute ? node.removeAttribute('id') : node.id = '';
                try {
<<<<<<< HEAD:MingGe_1.6.js
                    attr.html && typeof node.value === 'string' ? node.value = attr.html: node.innerHTML = attr.html;
=======
                    attr.html && seachIndex && (node[seachIndex] = attr.html);
>>>>>>> 2548195c687ab5c6a2844cffaf870fc46dfc0cf0:MingGe_1.7.js
                } catch(e) {}
                newD.ObjArray.push(node);
            };
            this.each(fun);
            newD.SelectorTxt = document.body;
            newD.SelectorStr = '000';
            return newD;
        },
        addEvent: function (obj, evetype, fun) {
            var addevent = {
                add: function () {
                    D.isFunction(fun) && obj.addEventListener(evetype, fun, false);
                },
                att: function () {
                    D.isFunction(fun) && obj.attachEvent('on' + evetype, fun);
                },
                no: function () {
                    D.isFunction(fun) && (obj['on' + evetype] = fun);
                }
            };
            this.bindEvent = this.bindEvent || obj.addEventListener && 'add' || obj.attachEvent && 'att' || 'no';
            addevent[this.bindEvent] && addevent[this.bindEvent]();
        },
        delEvent: function (obj, evetype, fun) {
            var delevent = {
                add: function () {
                    D.isFunction(fun) && obj.removeEventListener(evetype, fun, false);
                },
                att: function () {
                    D.isFunction(fun) && obj.detachEvent('on' + evetype, fun);
                },
                no: function () {
                    D.isFunction(fun) && (obj['on' + evetype] = null);
                }
            };
            this.bindEvent = this.bindEvent || obj.addEventListener && 'add' || obj.attachEvent && 'att' || 'no';
            delevent[this.bindEvent] && delevent[this.bindEvent]();
        },
<<<<<<< HEAD:MingGe_1.6.js
        timeCompute: function (saveTime, timing, callblack) {
            return function () {
                var timeSubtract = new Date().getTime() - saveTime;
=======
        timeCompute: function(saveTime, timing, callblack) {
            var timeSubtract;
            return function() {
                timeSubtract = new Date().getTime() - saveTime;
>>>>>>> 2548195c687ab5c6a2844cffaf870fc46dfc0cf0:MingGe_1.7.js
                if (timeSubtract > timing || timeSubtract < 0) {
                    callblack();
                }
            };
        },
        ajax: function () {
            this.serverdata = this.erromsg = this.timeout = this.stop = this.xmlhttp = false;
            this.transit = true;
        },
        ajaxPrototype: {
<<<<<<< HEAD:MingGe_1.6.js
            simplify: function (url, type, async, data, success, timeout, cache) {
=======
            get: function(url, data, success) {
                return this.simplify(url, "get", true, data, success, 2e4, true);
            },
            post: function(url, data, success) {
                return this.simplify(url, "post", true, data, success, 2e4, false);
            },
            getJSON: function(url, data, success) {
                return this.simplify(url, "get", true, data, success, 2e4, true, /[\?&]+.+\s*=\s*\?/i.test(url) ? "jsonp": "json");
            },
            simplify: function(url, type, async, data, success, timeout, cache, json) {
                if (D.isFunction(data)) {
                    var s = success;
                    success = data;
                    data = s || null;
                }
>>>>>>> 2548195c687ab5c6a2844cffaf870fc46dfc0cf0:MingGe_1.7.js
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
            handle: function (xmlhttp, arg) {
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
<<<<<<< HEAD:MingGe_1.6.js
                        D.isFunction(arg.success) && arg.success(responseText, 'success');
=======
                        if (D.isFunction(arg.success)) {
                            if (arg.dataType == "json") responseText = system.JsonString.StringToJson(responseText) || responseText;
                            arg.success(responseText, "success");
                        }
>>>>>>> 2548195c687ab5c6a2844cffaf870fc46dfc0cf0:MingGe_1.7.js
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
            out: function (arg) {
                this.transit = true;
                this.erromsg = 504;
                this.stop = true;
                this.removeUploadEve();
                D.isFunction(arg.error) && arg.error(504);
            },
<<<<<<< HEAD:MingGe_1.6.js
            removeUploadEve: function () {},
            ajax: function (arg) {
=======
            removeUploadEve: function() {},
            ajax: function(arg) {
                arg = D.extend({
                    type: "get",
                    timeout: 2e4,
                    async: true
                },
                arg);
                if (arg.dataType) {
                    arg.dataType = trim(arg.dataType);
                    if (arg.dataType == "jsonp") {
                        system.jsonp(arg);
                        return this;
                    }
                }
>>>>>>> 2548195c687ab5c6a2844cffaf870fc46dfc0cf0:MingGe_1.7.js
                if (arg.lock && !this.transit) return false;
                this.transit = false;
                this.stop = this.erromsg = false;
                var xmlhttp;
                if (window.XMLHttpRequest) {
                    xmlhttp = new XMLHttpRequest();
                } else {
                    xmlhttp = new ActiveXObject('Microsoft.XMLHTTP');
                }
                arg.type = arg.type.toUpperCase();
                var ContentType = function () {};
                arg.data = D.objToUrl(arg.data);
                if (D.isTxt(arg.data)) {
                    arg.data = arg.data && trim(arg.data);
                    ContentType = function () {
                        xmlhttp.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
                    };
                } else {
<<<<<<< HEAD:MingGe_1.6.js
                    if (Object.prototype.toString.call(arg.data) !== '[object FormData]') {
                        arg.data = '';
                        ContentType = function () {
                            xmlhttp.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
=======
                    if (toString.call(arg.data) !== "[object FormData]") {
                        arg.data = "";
                        ContentType = function() {
                            xmlhttp.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
>>>>>>> 2548195c687ab5c6a2844cffaf870fc46dfc0cf0:MingGe_1.7.js
                        };
                    } else {
                        if (D.isFunction(arg.progress)) {
                            xmlhttp.upload.addEventListener('progress', arg.progress, false);
                            this.removeUploadEve = function () {
                                xmlhttp.upload.removeEventListener('progress', arg.progress, false);
                            };
                        }
                        arg.type = 'POST';
                    }
                }
<<<<<<< HEAD:MingGe_1.6.js
                var SendArg = arg.data == '' ? [null, ''] : [arg.data, '?' + arg.data],
=======
                var SendArg = arg.data == "" ? null: arg.data,
>>>>>>> 2548195c687ab5c6a2844cffaf870fc46dfc0cf0:MingGe_1.7.js
                self = this;
                D.isFunction(arg.complete) && arg.complete();
                arg.timeout && arg.async && (this.timeout = setTimeout(function () {
                    self.out(arg);
                },
                arg.timeout));
                if (arg.async === true) {
                    xmlhttp.onreadystatechange = function () {
                        self.handle(xmlhttp, arg);
                    };
                }
                try {
                    switch (arg.type) {
                    case 'POST':
                        xmlhttp.open('POST', arg.url, arg.async);
                        ContentType();
                        break;

                    default:
<<<<<<< HEAD:MingGe_1.6.js
                        xmlhttp.open('GET', arg.url + SendArg[1], arg.async);
                        arg.cache === true || xmlhttp.setRequestHeader('If-Modified-Since', '0');
=======
                        xmlhttp.open("GET", D.urlRevise(arg.url, SendArg), arg.async);
                        arg.cache === true || xmlhttp.setRequestHeader("If-Modified-Since", "0");
>>>>>>> 2548195c687ab5c6a2844cffaf870fc46dfc0cf0:MingGe_1.7.js
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
                xmlhttp.send(SendArg);
                if (arg.async === false) {
                    self.handle(xmlhttp, arg);
                }
            }
        },
        JsonString: {
            _json_: null,
            JsonToString: function (arr) {
                try {
                    this._json_ = [];
                    this._read_(arr, true);
                    var JsonJoin = this._json_.join('');
                    JsonJoin = JsonJoin.replace(/,([\}\]])/g,
                    function (a, b) {
                        return b;
                    });
                    this._json_ = null;
                    return JsonJoin;
                } catch(e) {
<<<<<<< HEAD:MingGe_1.6.js
                    alert('格式不符，转换失败');
                    return null;
                }
            },
            StringToJson: function (arrtxt) {
                if (typeof arrtxt !== 'string') {
                    alert('你传入不是JSON字符串');
                    return null;
                }
                try {
                    var array = new Function('return ' + '(' + arrtxt + ')')();
                    var type = this._type_(array);
                    if (type !== '[object Object]' && type !== '[object Array]') {
                        return false;
=======
                    alert("Format does not match, conversion fails");
                    return;
                }
            },
            StringToJson: function(arrtxt, T) {
                if (D.isString(arrtxt)) {
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
>>>>>>> 2548195c687ab5c6a2844cffaf870fc46dfc0cf0:MingGe_1.7.js
                    }
                    return false;
                } catch(e) {
                    return false;
                }
            },
<<<<<<< HEAD:MingGe_1.6.js
            _type_: function (arr) {
                if (typeof arr.nodeType === 'number') return '[object document]';
                var Types = Object.prototype.toString.call(arr);
                return Types;
=======
            _type_: function(arr) {
                if (D.isNumber(arr.nodeType)) return "[object document]";
                return toString.call(arr);
>>>>>>> 2548195c687ab5c6a2844cffaf870fc46dfc0cf0:MingGe_1.7.js
            },
            _addjson_: function (types, txt, txt2, TrueFalse) {
                var run = {
                    '[object Object]': txt,
                    '[object Array]': txt2
                };
                this._json_.push(run[types]);
            },
<<<<<<< HEAD:MingGe_1.6.js
            _addstring_: function (parameter) {
                var of = typeof parameter;
                if (of === 'string') return '"' + parameter + '"';
                if (of === 'number') return parameter;
                var types = this._type_(parameter);
                if (types === '[object Object]' || types === '[object Array]') {
=======
            _addstring_: function(parameter) {
                var of = typeof parameter,
                types;
                if (of === "string") return '"' + parameter.replace(/[\"\'\\\/]/g,
                function(str) {
                    return "\\" + str;
                }) + '"';
                if (of === "number") return parameter;
                types = this._type_(parameter);
                if (types === "[object Object]" || types === "[object Array]") {
>>>>>>> 2548195c687ab5c6a2844cffaf870fc46dfc0cf0:MingGe_1.7.js
                    return false;
                }
                return '""';
            },
            _read_: function (arr, TrueFalse) {
                var types = this._type_(arr);
<<<<<<< HEAD:MingGe_1.6.js
                if (TrueFalse && types !== '[object Object]' && types !== '[object Array]') {
                    alert('你传入不是数组或JSON');
                    return this._json_ = null;
                }
                this._addjson_(types, '{', '[', TrueFalse);
                for (var a in arr) {
                    if (typeof arr.constructor.prototype[a] === 'undefined') {
=======
                if (TrueFalse && types !== "[object Object]" && types !== "[object Array]") {
                    alert("Your incoming is not an array or JSON");
                    return this._json_ = null;
                }
                this._addjson_(types, "{", "[", TrueFalse);
                var pro = arr.constructor.prototype;
                for (var a in arr) {
                    if (D.isUndefined(pro[a])) {
>>>>>>> 2548195c687ab5c6a2844cffaf870fc46dfc0cf0:MingGe_1.7.js
                        var ArrA = this._addstring_(arr[a]);
                        if (typeof ArrA !== 'boolean') {
                            this._addjson_(types, '"' + a + '":' + ArrA + ',', ArrA + ',');
                        } else {
                            this._addjson_(types, '"' + a + '":', '');
                            this._read_(arr[a], false);
                        }
                    }
                }
                TrueFalse = TrueFalse ? '': ',';
                this._addjson_(types, '}' + TrueFalse, ']' + TrueFalse);
            }
        },
        opacity: false,
        transition: false,
        style: function (objstyle, name, val) {
            var arr, regexps, transform;
            val = D.isTxt(val) ? trim(val) : '';
            if (transformReg.test(name)) {
                regexps = new RegExp('' + name + '\\s?\\((.*)\\)', 'i'),
                transform = objstyle[system.transform];
                val ? name += '(' + val + ')': name = '';
                arr = [system.transform, transform ? regexps.test(transform) ? transform.replace(regexps, name) : transform + ' ' + name: name];
                return arr;
            }
            if (name == 'opacity') {
                var filter, opacity, num;
                if (system.opacity == 'opacity') {
                    num = parseFloat(val, 10);
                    arr = ['opacity', isNaN(num) ? null: num];
                } else {
                    filter = objstyle.filter;
                    opacity = parseInt(val, 10) + '' === 'NaN' ? '': 'alpha(opacity=' + val * 100 + ')';
                    arr = ralpha.test(filter) ? ['filter', filter.replace(ralpha, opacity)] : ['filter', opacity];
                }
                return arr;
            }
            return [name, val];
        },
        ready: function (a) {
            system.bindEvent = system.bindEvent || document.addEventListener && 'add' || document.attachEvent && 'att' || 'no';
            function b() {
                try {
                    var c = function () {
                        'complete' === document.readyState && (system.addEvent(document, 'readystatechange', c), a());
                    },
                    d = window.frameElement;
                } catch(e) {
                    return system.addEvent(document, 'readystatechange', c),
                    void 0;
                }
                if (null != d) return system.addEvent(document, 'readystatechange', c),
                void 0;
                try {
                    document.documentElement.doScroll('left');
                } catch(c) {
                    return setTimeout(b, 13),
                    void 0;
                }
                a();
            }
            var c;
            D.isFunction(a) && (system.bindEvent == 'add' ? (c = function () {
                document.removeEventListener('DOMContentLoaded', c, !1),
                a();
            },
            document.addEventListener('DOMContentLoaded', c, !1)) : b());
        }
    };

    function listNodeToArray(listNode) {
        try {
            return MySlice.call(listNode);
        } catch(e) {
            var array = [];
            for (var i = 0; i < listNode.length; i++) {
                array[i] = listNode[i];
            }
            return array;
        }
    }

    function trim(str) {
        try {
            return str.replace(/^(\s|\u00A0)+|(\s|\u00A0)+$/g, '');
        } catch(e) {
            return str;
        }
    }

    function circulateNode(parent, R) {
        if (R[0] || R[1][3].Id && document === parent) {
            var elemName = R[1][2];
            var ObjArray = parent[R[1][0]](elemName === 'MingGeAllelem2015' ? '*': elemName);
            if (ObjArray) {
                ObjArray = R[1][3].Id ? [ObjArray] : listNodeToArray(ObjArray);
                this.ObjArray = this.ObjArray.concat(ObjArray);
            }
            return;
        }
        var ListNode = parent.getElementsByTagName('*'),
        elem,
        i = 0,
        Reg = new RegExp('(^|\\s)' + R[1][2] + '(\\s|$)');
        while (elem = ListNode[i++]) {
            if (Reg.test(elem[R[1][1]])) {
                this.ObjArray.push(elem);
            }
        }
    }

    function optionColation(Z) {
        var analyseResult = analyse(Z);
        return analyseResult ? [analyseResult[3].Tag || IfGetClassName && analyseResult[3].Class, analyseResult] : false;
    }

    function removing(array) {
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
<<<<<<< HEAD:MingGe_1.6.js
    }

    function mergeSelector(strOne, strTwo, txt) {
=======
    },
    mergeSelector = function(strOne, strTwo, txt) {

>>>>>>> 2548195c687ab5c6a2844cffaf870fc46dfc0cf0:MingGe_1.7.js
        var matchOne = strOne.match(/[^\,]+/g),
        matchTwo = strTwo.match(/[^\,]+/g);
        if (matchOne && matchTwo) {
            var merge = '',
            contxt, spanTrue = txt == ' ',
            mstr, rgExp = /^[\w-_]+/,
            match, MT;
            for (var i = 0; i < matchOne.length; i++) {
                contxt = matchOne[i] + txt;
                MT = spanTrue || (match = contxt.match(rgExp));
                for (var ii = 0; ii < matchTwo.length; ii++) {
                    if (MT) {
                        if (contxt == matchTwo[ii]) {
                            merge += contxt + ',';
                        } else {
                            if (match) {
                                mstr = matchTwo[ii].match(rgExp);
                                mstr ? mstr[0] == match[0] && (merge += contxt + matchTwo[ii].replace(rgExp, '') + ',') : merge += contxt + matchTwo[ii] + ',';
                            } else {
                                merge += contxt + matchTwo[ii] + ',';
                            }
                        }
                    } else {
                        merge += matchTwo[ii] + contxt + ',';
                    }
                }
            }
            return merge.replace(/,+$/, '');
        }
    }

    function MyQuerySelector(str, getObj, findTrue, newD) {
        try {
            var merge, MingGeId, remove = false;
            if (findTrue) {
                if (getObj.SelectorTxt === document || getObj.SelectorTxt === window) {
                    return newD;
                }
                if (getObj.SelectorTxt && str != '') {
                    if (findTrue.filter) {
                        if (getObj.SelectorTxt.ownerDocument) {
                            if (getObj.SelectorStr && getObj.SelectorStr !== '000') {
                                MingGeId = '#' + (getObj.SelectorTxt.id || (remove = true, getObj.SelectorTxt.id = 'tempMingGeId2015'));
                                merge = mergeSelector(MingGeId, newD.SelectorStr = mergeSelector(getObj.SelectorStr, str, ''), ' ');
                                newD.ObjArray = listNodeToArray(getObj.SelectorTxt.querySelectorAll(merge));
                                newD.SelectorTxt = getObj.SelectorTxt;
                                remove && getObj.SelectorTxt.removeAttribute('id');
                                return newD;
                            }
                            return - 1;
                        }
                        merge = mergeSelector(getObj.SelectorTxt, str, '');
                    } else {
                        if (getObj.SelectorStr === '000') {
                            return - 1;
                        }
                        if (getObj.SelectorTxt.ownerDocument) {
                            MingGeId = '#' + (getObj.SelectorTxt.id || (remove = true, getObj.SelectorTxt.id = 'tempMingGeId2015'));
                            merge = getObj.SelectorStr ? mergeSelector(MingGeId, newD.SelectorStr = mergeSelector(getObj.SelectorStr, str, ' '), ' ') : mergeSelector(MingGeId, newD.SelectorStr = str, ' ');
                            newD.ObjArray = listNodeToArray(getObj.SelectorTxt.querySelectorAll(merge));
                            newD.SelectorTxt = getObj.SelectorTxt;
                            remove && getObj.SelectorTxt.removeAttribute('id');
                            return newD;
                        }
                        merge = mergeSelector(getObj.SelectorTxt, str, ' ');
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
    }

    function CanonicalStructure(str, getObj, findTrue) {
        var newD = new D(),
        qu;
<<<<<<< HEAD:MingGe_1.6.js
        if (typeof str === 'string') {
=======
        if (D.isString(str)) {
>>>>>>> 2548195c687ab5c6a2844cffaf870fc46dfc0cf0:MingGe_1.7.js
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
    }

    function space(str, getObj, findTrue) {
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
    }

    function EvenLabel(str, num, obj, findTrue) {
        var match = str.match(/[\.#]?([\w-]+)/g);
        if (match) for (var i = 0; i < match.length; i++) {
            if (num == 0) {
                obj = i == 0 ? findTrue ? findTrue.find ? system.find.call(obj, match[0]) : system.filter.call(obj, match[0]) : new D().init(match[0], document) : system.filter.call(obj, match[i]);
            } else {
                obj = i == 0 ? system.find.call(obj, match[0]) : system.filter.call(obj, match[i]);
            }
        }
        return obj;
    }

    var D = window.MingGe = function (args) {
        if (this === window || this.MingGe) {
            return CanonicalStructure(args);
        }
        this.ObjArray = [];
        this.animateList = [];
    };
    D.fn = D.prototype = {
<<<<<<< HEAD:MingGe_1.6.js
        version: '你使用的版本是MingGejs1.6',
        init: function (string, parent) {
=======
        version: "\u4f60\u4f7f\u7528\u7684\u7248\u672c\u662fMingGejs" + MingGEjs,
        init: function(string, parent) {
>>>>>>> 2548195c687ab5c6a2844cffaf870fc46dfc0cf0:MingGe_1.7.js
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
        is: function (str) {
            D.update(this);
            str = trim(str);
            switch (str) {
            case ':animate':
                return this.ObjArray[0].isMingGeAnimate ? true: false;
                break;
            }
        },
        append: function (name) {
            return system.createNode.call(this, name, {},
            'beforeEnd');
        },
        createNode: function () {
            D.update(this);
            return system.createNode.apply(this, arguments);
        },
<<<<<<< HEAD:MingGe_1.6.js
        load: function (url, arg) {
            var this_ = this,
            successFun = function (HTML) {
                this_.each(function () {
                    typeof this.value === 'string' ? this.value = HTML: this.innerHTML = HTML;
=======
        load: function(url, arg) {
            if (D.isFunction(url)) {
                return this.bind("load", url);
            }
            var this_ = this,
            seachIndex;
            successFun = function(HTML) {
                this_.each(function() {
                    seachIndex = system.seachIndex(["value", "innerHTML"], this);
                    seachIndex && (this[seachIndex] = HTML);
>>>>>>> 2548195c687ab5c6a2844cffaf870fc46dfc0cf0:MingGe_1.7.js
                });
            };
            if (arg == null) {
                D.get(url, null, successFun);
            } else {
                D.post(url, arg, successFun);
            }
            return this;
        },
        insertHTML: function () {
            D.update(this);
            return system.insertHTML.apply(this, arguments);
        },
        stop: function () {
            system.transition || (system.transition = D.html5Attribute('transition'));
            if (!system.transition) return this;
            var style;
            return this.each(function () {
                if (this.isMingGeAnimate) {
                    delete this.isMingGeAnimate;
                    this.mingGeAnimateList && delete this.mingGeAnimateList;
                    var timingFunction = system.transition + 'TimingFunction';
                    style = this.style;
                    style[system.transition] = style[timingFunction] = null;
                }
            });
        },
        fadeToggle: function (time, callback) {
            var arr;
            this.each(function () {
                arr = system.oStyleValue(this);
                if (system.original('display', arr) == 'none') {
                    D(this).fadeIn(time, callback);
                } else {
                    D(this).fadeOut(time, callback);
                }
            });
        },
<<<<<<< HEAD:MingGe_1.6.js
        fadeOut: function (time, callback) {
=======
        attr: function(name, val) {
            D.update(this);
            var elem = this.ObjArray[0];
            if (elem) {
                if (D.isUndefined(val)) {
                    if (D.isString(name)) {
                        return elem.getAttribute(name);
                    }
                    return null;
                }
                if (D.isString(name) && D.isTxt(val)) {
                    D.each.call(this.ObjArray,
                    function() {
                        this.setAttribute(name, val);
                    });
                }
            }
            return this;
        },
        fadeOut: function(time, callback) {
>>>>>>> 2548195c687ab5c6a2844cffaf870fc46dfc0cf0:MingGe_1.7.js
            var arr, newD = new D();
            system.transition || (system.transition = D.html5Attribute('transition'));
            this.each(function () {
                arr = system.oStyleValue(this);
<<<<<<< HEAD:MingGe_1.6.js
                system.original('display', arr) == 'none' || newD.ObjArray.push(this);
=======
                system.original("display", arr) == "none" || this.isMingGeAnimate || newD.ObjArray.push(this);
>>>>>>> 2548195c687ab5c6a2844cffaf870fc46dfc0cf0:MingGe_1.7.js
            });
            if (system.transition) {
                newD.animate({
                    opacity: 0
                },
                time,
                function () {
                    D(this).css({
                        display: 'none',
                        opacity: null
                    });
                    D.isFunction(callback) && callback.call(this);
                },
                'ease');
            } else {
                newD.css('display', 'none');
            }
            return this;
        },
<<<<<<< HEAD:MingGe_1.6.js
        fadeIn: function (time, callback) {
            system.transition || (system.transition = D.html5Attribute('transition'));
=======
        hide: function() {
            this.css("display", "none");
        },
        show: function() {
            this.css("display", null);
            D.each.call(this.ObjArray,
            function() {
                if (this.nodeType == 1 && system.original("display", system.oStyleValue(this)) == "none") {
                    this.style.display = system.getDisplay(this.tagName);
                }
            });
        },
        fadeIn: function(time, callback) {
            system.transition || (system.transition = D.html5Attribute("transition"));
>>>>>>> 2548195c687ab5c6a2844cffaf870fc46dfc0cf0:MingGe_1.7.js
            var arr, newD = new D();
            this.each(function () {
                arr = system.oStyleValue(this);
<<<<<<< HEAD:MingGe_1.6.js
                if (system.original('display', arr) == 'none') {
                    system.transition && D(this).css('opacity', 0);
                    newD.ObjArray.push(this);
                    if (this.style.display == 'none') {
                        this.style.display = '';
                        system.original('display', arr) == 'none' && (this.style.display = 'block');
                    } else {
                        this.style.display = 'block';
=======
                if (system.original("display", arr) == "none") {
                    if (this.isMingGeAnimate) return;
                    system.transition && D(this).css("opacity", 0);
                    newD.ObjArray.push(this);
                    if (this.style.display == "none") {
                        this.style.display = "";
                        system.original("display", arr) == "none" && (this.style.display = system.getDisplay(this.tagName));
                    } else {
                        this.style.display = system.getDisplay(this.tagName);
>>>>>>> 2548195c687ab5c6a2844cffaf870fc46dfc0cf0:MingGe_1.7.js
                    }
                }
            });
            if (system.transition) {
                setTimeout(function () {
                    newD.animate({
                        opacity: 1
                    },
<<<<<<< HEAD:MingGe_1.6.js
                    time - 5,
                    function () {
                        D(this).css('opacity', null);
=======
                    time,
                    function() {
                        D(this).css("opacity", null);
>>>>>>> 2548195c687ab5c6a2844cffaf870fc46dfc0cf0:MingGe_1.7.js
                        D.isFunction(callback) && callback.call(this);
                    },
                    'ease');
                },
                5);
            }
            return this;
        },
<<<<<<< HEAD:MingGe_1.6.js
        animate: function (params, speed, callback, model) {
            D.update(this);
            system.transition || (system.transition = D.html5Attribute('transition'));
=======
        animate: function(params, speed, callback, model) {
            system.transition || (system.transition = D.html5Attribute("transition"));
>>>>>>> 2548195c687ab5c6a2844cffaf870fc46dfc0cf0:MingGe_1.7.js
            if (!system.transition) {
                this.css(params);
                return this;
            }
            if (!D.isObject(params)) return this;
            var typeSpeed = typeof speed,
            newCallback;
<<<<<<< HEAD:MingGe_1.6.js
            if (typeSpeed !== 'number') {
                if (typeSpeed === 'string') {
                    typeSpeed = parseFloat(speed);
                    isNaN(typeSpeed) && (speed = 200);
                } else if (typeSpeed === 'function') {
=======
            if (typeSpeed !== "number") {
                if (typeSpeed === "string") {
                    showFast[speed] && (speed = showFast[speed]);
                    isNaN(parseFloat(speed)) && (speed = 500);
                } else if (typeSpeed === "function") {
>>>>>>> 2548195c687ab5c6a2844cffaf870fc46dfc0cf0:MingGe_1.7.js
                    callback = speed;
                    speed = 500;
                } else speed = 500;

            }
            if (!D.isFunction(callback)) {
                var m = model;
                model = callback;
                callback = D.isFunction(m) ? m: function () {};
            }
            newCallback = function () {
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
        on: function (eveName, callback) {
            D.update(this);
            var elem, i = 0,
            type = typeof eveName;
            if (type === 'string' && D.isFunction(callback)) {
                while (elem = this.ObjArray[i++]) {
                    elem['on' + eveName] = callback;
                }
            } else if (type === 'object') {
                while (elem = this.ObjArray[i++]) {
                    for (var key in eveName) {
                        elem['on' + key] = eveName[key];
                    }
                }
            }
            return this;
        },
<<<<<<< HEAD:MingGe_1.6.js
        empty: function () {
            return this.each(function (i) {
                if (this.nodeType == 1) {
                    this.innerHTML = this.value = '';
=======
        empty: function() {
            var seachIndex;
            return this.each(function(i) {
                if (this.nodeType == 1) {
                    seachIndex = system.seachIndex(["value", "innerHTML"], this);
                    seachIndex && (this[seachIndex] = "");
>>>>>>> 2548195c687ab5c6a2844cffaf870fc46dfc0cf0:MingGe_1.7.js
                }
            });
        },
        remove: function () {
            this.each(function () {
                this.parentNode.removeChild(this);
            });
            this.ObjArray = [];
            return this;
        },
<<<<<<< HEAD:MingGe_1.6.js
        click: function (callback) {
            return this.bind('click', callback);
        },
        mouseover: function (callback) {
            return this.bind('mouseover', callback);
        },
        mouseout: function (callback) {
            return this.bind('mouseout', callback);
        },
        bind: function (eveName, callback) {
=======
        bind: function(eveName, callback) {
>>>>>>> 2548195c687ab5c6a2844cffaf870fc46dfc0cf0:MingGe_1.7.js
            D.update(this);
            var elem, i = 0,
            type = typeof eveName;
            if (type === 'string' && D.isFunction(callback)) {
                while (elem = this.ObjArray[i++]) {
                    system.addEvent(elem, eveName, callback);
                }
            } else if (type === 'object') {
                while (elem = this.ObjArray[i++]) {
                    for (var key in eveName) {
                        system.addEvent(elem, key, eveName[key]);
                    }
                }
            }
            return this;
        },
        unbind: function (eveName, callback) {
            var elem, i = 0;
            D.update(this);
            if (callback) {
                while (elem = this.ObjArray[i++]) {
                    system.delEvent(elem, eveName, callback);
                }
            } else while (elem = this.ObjArray[i++]) {
                elem[on + 'eveName'] = null;
            }
            return this;
        },
        one: function (eveName, callback) {
            var type = typeof eveName;
            if (type === 'string' && D.isFunction(callback)) {
                var newOne = function () {
                    system.delEvent(this, eveName, newOne);
                    callback.call(this);
                };
                return this.bind(eveName, newOne);
            }
            if (type === 'object') {
                var eveObj = {};
                for (var key in eveName) {
                    eveObj[key] = function (keys) {
                        return function () {
                            system.delEvent(this, keys, eveObj[keys]);
                            eveName[keys].call(this);
                        };
                    } (key);
                }
                return this.bind(eveObj);
            }
            return this;
        },
        SelectorStr: false,
        SelectorTxt: false,
        ObjArray: [],
        ready: function (callback) {
            system.ready(callback);
        },
        removing: function (array) {
            return removing(array);
        },
        parent: function (re) {
            D.update(this);
            var obj, i = 0,
<<<<<<< HEAD:MingGe_1.6.js
            newD = new D();
            while (obj = this.ObjArray[i++]) {
                obj.parentNode.tagName == 'BODY' || newD.ObjArray.push(obj.parentNode);
=======
            newD = new D(),
            par;
            while (obj = this.ObjArray[i++]) { (par = obj.parentNode) && (par.tagName == "BODY" || newD.ObjArray.push(par));
>>>>>>> 2548195c687ab5c6a2844cffaf870fc46dfc0cf0:MingGe_1.7.js
            }
            newD.ObjArray = removing(newD.ObjArray);
            newD.SelectorTxt = document.body;
            newD.SelectorStr = '000';
            return re ? newD.filter(re) : newD;
        },
<<<<<<< HEAD:MingGe_1.6.js
        addClass: function (str) {
            if (typeof str == 'string') {
                return this.each(function () {
=======
        addClass: function(str) {
            if (D.isString(str)) {
                str = trim(str);
                var className;
                return this.each(function() {
>>>>>>> 2548195c687ab5c6a2844cffaf870fc46dfc0cf0:MingGe_1.7.js
                    if (this.nodeType === 1) {
                        className = this.className;
                        if (className) {
                            this.className = className + ' ' + str;
                        } else {
                            this.className = str;
                        }
                    }
                });
            }
            return this;
        },
<<<<<<< HEAD:MingGe_1.6.js
        removeClass: function (str) {
            if (typeof str == 'string') {
                return this.each(function () {
=======
        removeClass: function(str) {
            str = trim(str);
            var className, reg;
            if (D.isString(str)) {
                return this.each(function() {
>>>>>>> 2548195c687ab5c6a2844cffaf870fc46dfc0cf0:MingGe_1.7.js
                    if (this.nodeType === 1) {
                        className = this.className;
                        if (className) {
<<<<<<< HEAD:MingGe_1.6.js
                            var reg = RegExp('(^|\\s)' + str + '($|\\s)', 'ig');
=======
                            reg = RegExp("(^|\\s)" + str + "($|\\s)", "ig");
>>>>>>> 2548195c687ab5c6a2844cffaf870fc46dfc0cf0:MingGe_1.7.js
                            if (reg.test(className)) {
                                this.className = className = trim(className.replace(reg, ' '));
                                className == '' && (this.removeAttribute ? this.removeAttribute('class') : this.className = '');
                            }
                        }
                    }
                });
            } else if (D.isUndefined(str)) {
                return this.each(function() {
                    if (this.nodeType === 1) {
                        if (this.className) {
                            this.removeAttribute ? this.removeAttribute("class") : this.className = "";
                        }
                    }
                });
            }
            return this;
        },
        children: function (elem) {
            return elem ? this.find(elem) : IfQuery ? this.find('*') : this.find('MingGeAllelem2015');
        },
        find: function (str) {
            return CanonicalStructure(str, this, {
                find: true
            });
        },
        filter: function (str) {
            var fil = CanonicalStructure(str, this, {
                filter: true
            });
            this.SelectorTxt.ownerDocument && !this.SelectorStr && fil.ObjArray[0] && (fil.SelectorTxt = fil.ObjArray[0], fil.SelectorStr = false);
            return fil;
        },
        index: function (obj) {
            try {
                D.update(this);
                if (obj) {
                    return D.inArray(obj.ObjArray[0], this.ObjArray);
                }
                return D.inArray(this.ObjArray[0], this.ObjArray[0].parentNode.getElementsByTagName('*'));
            } catch(e) {
                return - 1;
            }
        },
        eq: function (index) {
            var M = new D();
            D.update(this);
            M = index == null ? this: (index = index < 0 ? this.ObjArray.length + index: index, this.ObjArray[index] && (M.ObjArray = [M.SelectorTxt = this.ObjArray[index]]), M);
            return M;
        },
        size: function () {
            D.update(this);
            return this.ObjArray.length;
        },
        each: function (callback) {
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
<<<<<<< HEAD:MingGe_1.6.js
        html: function (str) {
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
=======
        val: function(str) {
            return system.htmlVal.call(this, "value", str);
        },
        html: function(str) {
            return system.htmlVal.call(this, "innerHTML", str);
        },
        text: function(str) {
            return system.htmlVal.call(this, system.isIndex("textContent", document.body) ? "textContent": "innerText", str);
>>>>>>> 2548195c687ab5c6a2844cffaf870fc46dfc0cf0:MingGe_1.7.js
        },
        css: function (args, val) {
            var i = 0,
<<<<<<< HEAD:MingGe_1.6.js
            elem, type = typeof args,
            key, arrayKey = {},
            sty;
            system.opacity || (system.opacity = D.html5Attribute('opacity') || 'filter');
            system.transform || (system.transform = D.html5Attribute('transform'));
            if (type === 'string') {
                args = D.styleName(args);
=======
            elem, key, arrayKey = {},
            sty, type = typeof args;
            system.opacity || (system.opacity = D.html5Attribute("opacity") || "filter");
            system.transform || (system.transform = D.html5Attribute("transform"));
            if (type === "string") {
                args = D.styleName(trim(args));
                if (D.isUndefined(val)) {
                    D.update(this);
                    if (! ((elem = this.ObjArray[0]) && elem.ownerDocument)) {
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
>>>>>>> 2548195c687ab5c6a2844cffaf870fc46dfc0cf0:MingGe_1.7.js
                while (elem = this.ObjArray[i++]) {
                    try {
                        sty = elem.style;
                        arrayKey = system.style(sty, args, val);
                        sty[arrayKey[0]] = arrayKey[1];
                    } catch(e) {}
                }
            } else if (type === 'object') {
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
<<<<<<< HEAD:MingGe_1.6.js
        val: function (str) {
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
        get: function (index) {
=======
        get: function(index) {
>>>>>>> 2548195c687ab5c6a2844cffaf870fc46dfc0cf0:MingGe_1.7.js
            D.update(this);
            return index == null ? this.ObjArray: (index = index < 0 ? this.ObjArray.length + index: index, this.ObjArray[index]);
        }
    };
    D.fn.extend = D.extend = function () {
        var length = arguments.length,
        key;
<<<<<<< HEAD:MingGe_1.6.js
        if (length === 1 && typeof arguments[0] === 'object') {
=======
        if (length === 1 && toString.call(arguments[0]) === "[object Object]") {
>>>>>>> 2548195c687ab5c6a2844cffaf870fc46dfc0cf0:MingGe_1.7.js
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
    system.ajax.prototype = system.ajaxPrototype; !
    function(args) {
        var elem, i = 0;
        while (elem = args[i++]) {
            D.fn[elem] = function(elem) {
                return function(callback) {
                    return this.bind(elem, callback);
                };
            } (elem);
        }
    } (["blur", "focus", "focusin", "focusout", "resize", "scroll", "unload", "click", "dblclick", "mousedown", "mouseup", "mousemove", "mouseover", "mouseout", "mouseenter", "mouseleave", "change", "select", "submit", "keydown", "keypress", "keyup", "error", "touchstart", "touchmove", "touchend"]);
    D.extend({
<<<<<<< HEAD:MingGe_1.6.js
        parseJSON: function (string) {
            return system.JsonString.StringToJson(string);
=======
        parseJSON: function(string, T) {
            return system.JsonString.StringToJson(string, T);
>>>>>>> 2548195c687ab5c6a2844cffaf870fc46dfc0cf0:MingGe_1.7.js
        },
        toJSON: function (JSON) {
            return system.JsonString.JsonToString(JSON);
        },
        trim: function (str) {
            return trim(str);
        },
<<<<<<< HEAD:MingGe_1.6.js
        setVar: function (name) {
=======
        each: function(obj, fun) {
            var elem, i = 0;
            if (D.isFunction(obj)) {
                while (elem = this[i++]) {
                    obj.call(elem);
                }
            } else if ((D.isObject(obj) || D.isArray(obj)) && D.isFunction(fun)) {
                var a = [],
                b = {};
                for (i in obj) {
                    b[i] || a[i] || fun(i, obj[i]);
                }
                return true;
            }
            return false;
        },
        setVar: function(name) {
>>>>>>> 2548195c687ab5c6a2844cffaf870fc46dfc0cf0:MingGe_1.7.js
            try {
                delete window[varName];
            } catch(e) {
                window[varName] = null;
            }
            window[name] = D;
        },
        isObject: function (obj) {
            return toString.call(obj) === '[object Object]';
        },
        update: function (getObj) {
            var elem, i = 0,
            array = [];
            while (elem = getObj.ObjArray[i++]) {
                if (elem.ownerDocument) {
                    elem.parentNode && array.push(elem);
                } else array.push(elem);
            }
            getObj.ObjArray = array;
        },
        isArray: function (obj) {
            return toString.call(obj) === '[object Array]';
        },
        isFunction: function (obj) {
            return toString.call(obj) === '[object Function]';
        },
        isEmptyObject: function (obj) {
            for (var name in obj) {
                if (obj.hasOwnProperty(name)) {
                    return false;
                }
            }
            return true;
        },
<<<<<<< HEAD:MingGe_1.6.js
        createScript: function (srcTxt) {
            if (typeof srcTxt === 'string') {
                var head = document.getElementsByTagName('head').item(0),
                script;
                if (head) {
                    script = document.createElement('script');
                    head.appendChild(script);
                    script.src = srcTxt;
                }
            }
        },
        post: function (url, data, success) {
            return new system.ajax().simplify(url, 'post', true, data, success, 2e4, false);
        },
        get: function (url, data, success) {
            return new system.ajax().simplify(url, 'get', true, data, success, 2e4, true);
=======
        createScript: function(srcTxt) {
            var head = document.getElementsByTagName("head").item(0),
            script;
            if (head) {
                script = document.createElement("script");
                head.appendChild(script);
                srcTxt && (script.src = srcTxt);
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
>>>>>>> 2548195c687ab5c6a2844cffaf870fc46dfc0cf0:MingGe_1.7.js
        },
        ajax: function (options) {
            var returns = new system.ajax();
            if (D.isObject(options)) {
                returns.ajax(options);
            }
            return returns;
        },
        styleName: function (name) {
            try {
                return name.replace(rdashAlpha, fcamelCase);
            } catch(e) {
                return name;
            }
        },
        userAgent: uaMatch(navigator.userAgent),
        isIe: function () {
            return this.userAgent.browser === 'msie' ? this.userAgent.version.charAt(0) : false;
        },
<<<<<<< HEAD:MingGe_1.6.js
        isTxt: function (str) {
            return typeof str == 'string' || !isNaN(str);
=======
        isTxt: function(str) {
            var ty = typeof str;
            return ty == "string" || ty == "number";
        },
        isNumber: function(number) {
            return typeof str == "number";
        },
        isUndefined: function(str) {
            return typeof str == "undefined";
        },
        isString: function(str) {
            return typeof str == "string";
>>>>>>> 2548195c687ab5c6a2844cffaf870fc46dfc0cf0:MingGe_1.7.js
        },
        objToUrl: function (obj) {
            if (D.isObject(obj)) {
<<<<<<< HEAD:MingGe_1.6.js
                var str = '',
                val;
                for (var key in obj) {
                    val = obj[key];
                    D.isTxt(val) && (str += key + '=' + val + '&');
                }
                return str.replace(/&+$/, '');
=======
                var str = "";
                D.each(obj,
                function(key, val) {
                    D.isTxt(val) && (str += key + "=" + encodeURIComponent(val) + "&");
                });
                return str.replace(/&+$/, "");
>>>>>>> 2548195c687ab5c6a2844cffaf870fc46dfc0cf0:MingGe_1.7.js
            }
            if (D.isString(obj)) {
                return encodeURIComponent(obj);
            }
            return obj;
        },
        inArray: function (elem, array) {
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
<<<<<<< HEAD:MingGe_1.6.js
        isHtml5: function () {
            return document.createElement('canvas').getContext('2d') ? true: false;
=======
        urlRevise: function(url, args) {
            if (args != "" && D.isTxt(args)) {
                if (/\?/.test(url)) {
                    url += "&" + args;
                } else url += "?" + args;
            }
            return url;
        },
        isHtml5: function() {
            return document.createElement("canvas").getContext ? true: false;
>>>>>>> 2548195c687ab5c6a2844cffaf870fc46dfc0cf0:MingGe_1.7.js
        },
        html5Attribute: function (attribute) {
            try {
                var attributeLow = attribute ? attribute.toLowerCase() : 'transform';
                attribute = attributeLow.replace(/^\w/, attribute.charAt(0).toUpperCase());
                var bodyStyle = document.body.style,
<<<<<<< HEAD:MingGe_1.6.js
                arr = new Array(attributeLow, 'Ms' + attribute, 'Moz' + attribute, 'Webkit' + attribute, 'O' + attribute),
=======
                arr = [attributeLow, "Ms" + attribute, "Moz" + attribute, "Webkit" + attribute, "O" + attribute],
>>>>>>> 2548195c687ab5c6a2844cffaf870fc46dfc0cf0:MingGe_1.7.js
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
<<<<<<< HEAD:MingGe_1.6.js
    (function () {
        for (var i = 0; i < varNames.length; i++) {
            window[varNames[i]] = D;
        }
    })();
    D.isMingGe = true;
})(window, ['明哥', 'MingGe', 'MINGGE', '$']);
=======
    D.each(["width", "height", "top", "left"],
    function(i, item) {
        D.fn[item] = function(item, newItem) {
            return function(str) {
                if (str == null) {
                    return this.ObjArray[0]["offset" + newItem];
                }
                /^[0-9]+$/.test(str) && (str += "px");
                return this.css(item, str);
            };
        } (item, item.replace(/^\w/, item.charAt(0).toUpperCase()));
    });
    window[varName] = D;
})(window, "$");
>>>>>>> 2548195c687ab5c6a2844cffaf870fc46dfc0cf0:MingGe_1.7.js
