// Generated by CoffeeScript 1.9.1

/*
Casua 0.0.2
Copyright (c) 2013-2014 aligo Kang

Released under the MIT license
 */

(function() {
  var __boolean_attr_regexp, __mutiple_levels_key_regexp, _css_selector, _escapeHTML, _escape_chars, _reversed_escape_chars, _scopeCallAltWatch, _scopeCallWatch, _scopeChangeLength, _scopeInitParent, _scopeRemovePrepare, _shallowCopy, casua, k, v,
    extend = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
    hasProp = {}.hasOwnProperty;

  _shallowCopy = function(src, dst) {
    var key, value;
    if (dst == null) {
      dst = {};
    }
    for (key in src) {
      value = src[key];
      dst[key] = value;
    }
    return dst;
  };

  _escape_chars = {
    lt: '<',
    gt: '>',
    quot: '"',
    amp: '&',
    apos: "'"
  };

  _reversed_escape_chars = {};

  for (k in _escape_chars) {
    v = _escape_chars[k];
    _reversed_escape_chars[v] = k;
  }

  _escapeHTML = function(str) {
    return str.replace(/[&<>"']/g, function(m) {
      return '&' + _reversed_escape_chars[m] + ';';
    });
  };

  __boolean_attr_regexp = /^multiple|selected|checked|disabled|required|open$/;

  _css_selector = typeof document.querySelectorAll === 'function';

  casua = {};

  casua.Node = (function() {
    var __addEventListenerFn, __createEventHanlder, __trigger_to_dom_regexp, _addNodes, _forEach, _push;

    _addNodes = function(_node, elements) {
      var element, l, len, results;
      if (elements.nodeName) {
        elements = [elements];
      }
      results = [];
      for (l = 0, len = elements.length; l < len; l++) {
        element = elements[l];
        element._node = _node;
        results.push(_push(_node, element));
      }
      return results;
    };

    _push = function(_node, one) {
      _node[_node.length] = one;
      return _node.length += 1;
    };

    _forEach = function(_node, callback) {
      var idx, one, ret;
      ret = (function() {
        var l, len, results;
        results = [];
        for (idx = l = 0, len = _node.length; l < len; idx = ++l) {
          one = _node[idx];
          results.push(callback.call(one, idx, one));
        }
        return results;
      })();
      return ret[0];
    };

    __addEventListenerFn = window.document.addEventListener ? function(element, type, fn) {
      return element.addEventListener(type, fn, false);
    } : function(element, type, fn) {
      return element.attachEvent('on' + type, fn);
    };

    __createEventHanlder = function(element, events) {
      var ret;
      ret = function(event, type) {
        var eventFns, fn, i, prevent;
        event.preventDefault || (event.preventDefault = function() {
          return event.returnValue = false;
        });
        event.stopPropagation || (event.stopPropagation = function() {
          return event.cancelBubble = true;
        });
        event.target || (event.target = event.srcElement || document);
        if (event.defaultPrevented == null) {
          prevent = event.preventDefault;
          event.preventDefault = function() {
            event.defaultPrevented = true;
            return prevent.call(event);
          };
          event.defaultPrevented = false;
        }
        event.isDefaultPrevented = function() {
          return event.defaultPrevented || (event.returnValue === false);
        };
        eventFns = _shallowCopy(events[type || event.type] || []);
        for (i in eventFns) {
          fn = eventFns[i];
          fn.call(element, event);
        }
        delete event.preventDefault;
        delete event.stopPropagation;
        return delete event.isDefaultPrevented;
      };
      ret.elem = element;
      ret.handleds = [];
      return ret;
    };

    __trigger_to_dom_regexp = /^focus$/;

    function Node(node_meta) {
      var attr, attrs_data, child, div, el, l, len, len1, n, r, ref, tag_data;
      this.handlers = {};
      this.events = {};
      this.length = 0;
      if (node_meta instanceof casua.Node) {
        return node_meta;
      } else if (typeof node_meta === 'string') {
        if (node_meta.charAt(0) !== '<') {
          attrs_data = node_meta.split(' ');
          tag_data = attrs_data.shift();
          el = document.createElement((r = tag_data.match(/^([^\.^#]+)/)) ? r[1] : 'div');
          if (r = tag_data.match(/\.([^\.^#]+)/g)) {
            el.className = r.join(' ').replace(/\./g, '');
          }
          if (r = tag_data.match(/#([^\.^#]+)/)) {
            el.id = r[1];
          }
          _addNodes(this, el);
          for (l = 0, len = attrs_data.length; l < len; l++) {
            attr = attrs_data[l];
            if (attr.charAt(0) !== '#' && (r = attr.match(/^([^=]+)(?:=(['"])(.+?)\2)?$/))) {
              this.attr(r[1], r[3] || r[1]);
            }
          }
        } else {
          div = document.createElement('div');
          div.innerHTML = '<div>&#160;</div>' + node_meta;
          div.removeChild(div.firstChild);
          ref = div.childNodes;
          for (n = 0, len1 = ref.length; n < len1; n++) {
            child = ref[n];
            _addNodes(this, child);
          }
        }
      } else {
        _addNodes(this, node_meta);
      }
    }

    Node.prototype.attr = function(name, value) {
      name = name.toLowerCase();
      if (name.match(/^val|value$/)) {
        return this.val(value);
      }
      if (name.match(__boolean_attr_regexp)) {
        if (value != null) {
          if (value) {
            _forEach(this, function() {
              this.setAttribute(name, name);
              return this[name] = true;
            });
          } else {
            _forEach(this, function() {
              this.removeAttribute(name);
              return this[name] = false;
            });
          }
          return this;
        } else {
          return this[0][name];
        }
      } else {
        if (value != null) {
          _forEach(this, function() {
            return this.setAttribute(name, value);
          });
          return this;
        } else {
          return this[0].getAttribute(name, 2);
        }
      }
    };

    Node.prototype.append = function(node) {
      if (typeof node === 'string') {
        node = new casua.Node(node);
      }
      _forEach(this, function(i, parent) {
        return _forEach(node, function(j, child) {
          return parent.appendChild(child);
        });
      });
      return this;
    };

    Node.prototype.empty = function() {
      _forEach(this, function() {
        var results;
        results = [];
        while (this.firstChild) {
          results.push(this.removeChild(this.firstChild));
        }
        return results;
      });
      return this;
    };

    Node.prototype.html = function(value) {
      if (value != null) {
        this.empty();
        _forEach(this, function() {
          return this.innerHTML = value;
        });
        return this;
      } else {
        return this[0].innerHTML;
      }
    };

    Node.prototype.text = function(value) {
      if (value != null) {
        return this.html(_escapeHTML(value));
      } else {
        return this.html();
      }
    };

    Node.prototype.on = function(type, fn) {
      var _node, base;
      _node = this;
      (base = this.events)[type] || (base[type] = []);
      this.events[type].push(fn);
      _forEach(this, function(idx) {
        var base1, handleds, handler;
        handler = (base1 = _node.handlers)[idx] || (base1[idx] = __createEventHanlder(this, _node.events));
        handleds = handler.handleds;
        if (handleds.indexOf(type) === -1) {
          __addEventListenerFn(this, type, handler);
          return handleds.push(type);
        }
      });
      return this;
    };

    Node.prototype.trigger = function(type, event_data) {
      var trigger_to_dom;
      if (event_data == null) {
        event_data = {};
      }
      if (type.match(__trigger_to_dom_regexp)) {
        trigger_to_dom = true;
      }
      _forEach(this, function() {
        var event, key, value;
        event = document.createEvent('HTMLEvents');
        event.initEvent(type, true, true);
        for (key in event_data) {
          value = event_data[key];
          event[key] = value;
        }
        this.dispatchEvent(event);
        if (trigger_to_dom) {
          return this[type]();
        }
      });
      return this;
    };

    Node.prototype.remove = function() {
      _forEach(this, function() {
        if (this.parentNode) {
          return this.parentNode.removeChild(this);
        }
      });
      return this;
    };

    Node.prototype.replaceWith = function(node) {
      if (typeof node === 'string') {
        node = new casua.Node(node);
      }
      _forEach(this, function(i, from) {
        return _forEach(node, function(j, to) {
          if (from.parentNode) {
            return from.parentNode.replaceChild(to, from);
          }
        });
      });
      return this;
    };

    Node.prototype.val = function(value) {
      if (value != null) {
        _forEach(this, function() {
          return this.value = value;
        });
        return this;
      } else {
        return this[0].value;
      }
    };

    Node.prototype.parent = function() {
      var parent;
      if (parent = this[0].parentNode) {
        return parent._node || new casua.Node(parent);
      }
    };

    Node.prototype.find = function(query) {
      var element;
      element = _css_selector ? this[0].querySelector(query) : this[0].getElementsByTagName(query);
      if (element) {
        return element._node || new casua.Node(element);
      }
    };

    return Node;

  })();

  _scopeInitParent = function(_scope, _parent) {
    _scope._childs = [];
    if (_parent != null) {
      if (_parent._childs.indexOf(_scope) === -1) {
        _parent._childs.push(_scope);
      }
      return _scope._parent = _parent;
    }
  };

  _scopeRemovePrepare = function(_scope, key) {
    var i, s;
    if (_scope._data[key] instanceof casua.Scope) {
      s = _scope._data[key];
      if (s._parent != null) {
        i = s._parent._childs.indexOf(s);
        s._parent._childs.splice(i, 1);
      }
    }
    return _scopeCallWatch(_scope, _scope._data[key], key, '$delete');
  };

  _scopeCallWatch = function(_scope, new_val, old_val, key) {
    var child, fn, l, len, len1, n, ref, ref1, results;
    if (typeof key === 'string' && key.charAt(0) === '$') {
      return _scopeCallAltWatch(_scope, new_val, old_val, key);
    } else {
      if (_scope._watches[key]) {
        ref = _scope._watches[key];
        for (l = 0, len = ref.length; l < len; l++) {
          fn = ref[l];
          fn.call(_scope, new_val, old_val, key);
        }
      }
      ref1 = _scope._childs;
      results = [];
      for (n = 0, len1 = ref1.length; n < len1; n++) {
        child = ref1[n];
        if (child._data[key] == null) {
          results.push(_scopeCallWatch(child, new_val, old_val, key));
        } else {
          results.push(void 0);
        }
      }
      return results;
    }
  };

  _scopeCallAltWatch = function(_scope, new_val, key, type) {
    var fn, l, len, ref, results;
    if (_scope._watches[type]) {
      ref = _scope._watches[type];
      results = [];
      for (l = 0, len = ref.length; l < len; l++) {
        fn = ref[l];
        results.push(fn.call(_scope, new_val, type, key));
      }
      return results;
    }
  };

  __mutiple_levels_key_regexp = /^([^\.]+)\.(.+)$/;

  casua.Scope = (function() {
    function Scope(init_data, parent) {
      var key, value;
      if (init_data instanceof casua.Scope) {
        return init_data;
      } else if (init_data.length != null) {
        return new casua.ArrayScope(init_data, parent);
      } else {
        _scopeInitParent(this, parent);
        this._watches = {};
        this._data = {};
        for (key in init_data) {
          value = init_data[key];
          this.set(key, value);
        }
      }
    }

    Scope.prototype.get = function(key) {
      var r, ret;
      if (this._watch_lists && this._watch_lists.indexOf(key) === -1) {
        this._watch_lists.push(key);
      }
      if (typeof key === 'string' && (r = key.match(__mutiple_levels_key_regexp))) {
        return this.get(r[1]).get(r[2]);
      } else if (key === '$parent') {
        return this._parent;
      } else {
        ret = this._data[key];
        if ((ret == null) && (this._parent != null)) {
          ret = this._parent.get(key);
        }
        return ret;
      }
    };

    Scope.prototype.set = function(key, value) {
      var old, r;
      if (typeof key === 'string' && (r = key.match(__mutiple_levels_key_regexp))) {
        this.get(r[1]).set(r[2], value);
      } else {
        if (!(typeof key === 'string' && key.charAt(0) === '$')) {
          if (typeof value === 'object') {
            value = new casua.Scope(value, this);
          }
          if (this._data[key] !== value) {
            old = this._data[key];
            this._data[key] = value;
            if (old == null) {
              _scopeCallWatch(this, value, key, '$add');
            }
            _scopeCallWatch(this, value, old, key);
          }
        }
      }
      return this;
    };

    Scope.prototype.remove = function(key) {
      var r;
      if (typeof key === 'string' && (r = key.match(__mutiple_levels_key_regexp))) {
        this.get(r[1]).remove(r[2]);
      } else {
        _scopeRemovePrepare(this, key);
        delete this._data[key];
      }
      return this;
    };

    Scope.prototype.$watch = function(key, fn) {
      var base, r;
      if (typeof key === 'string' && (r = key.match(__mutiple_levels_key_regexp))) {
        this.get(r[1]).$watch(r[2], fn);
      } else {
        (base = this._watches)[key] || (base[key] = []);
        this._watches[key].push(fn);
      }
      return this;
    };

    Scope.prototype.$startGetWatches = function() {
      return this._watch_lists = [];
    };

    Scope.prototype.$stopGetWatches = function() {
      var lists, one;
      lists = (function() {
        var l, len, ref, results;
        ref = this._watch_lists;
        results = [];
        for (l = 0, len = ref.length; l < len; l++) {
          one = ref[l];
          results.push(one);
        }
        return results;
      }).call(this);
      delete this._watch_lists;
      return lists;
    };

    return Scope;

  })();

  _scopeChangeLength = function(_scope, fn) {
    var _old_length, ret;
    _old_length = _scope._data.length;
    ret = fn.call(_scope);
    _scopeCallWatch(_scope, _scope._data.length, _old_length, 'length');
    return ret;
  };

  casua.ArrayScope = (function(superClass) {
    extend(ArrayScope, superClass);

    function ArrayScope(init_data, parent) {
      var idx, l, len, value;
      if (init_data instanceof casua.Scope) {
        return init_data;
      } else if (init_data.length == null) {
        return new casua.Scope(init_data, parent);
      } else {
        _scopeInitParent(this, parent);
        this._watches = {};
        this._data = [];
        for (idx = l = 0, len = init_data.length; l < len; idx = ++l) {
          value = init_data[idx];
          this.set(idx, value);
        }
      }
    }

    ArrayScope.prototype.length = function() {
      return this._data.length;
    };

    ArrayScope.prototype.indexOf = function(child) {
      return this._data.indexOf(child);
    };

    ArrayScope.prototype.remove = function(key) {
      return _scopeChangeLength(this, function() {
        _scopeRemovePrepare(this, key);
        return this._data.splice(key, 1);
      });
    };

    ArrayScope.prototype.each = function(fn) {
      var i, l, len, one, ref;
      ref = this._data;
      for (i = l = 0, len = ref.length; l < len; i = ++l) {
        one = ref[i];
        fn.call(this, this.get(i), i);
      }
      return this;
    };

    ArrayScope.prototype.pop = function() {
      return this.remove(this._data.length - 1)[0];
    };

    ArrayScope.prototype.shift = function() {
      return this.remove(0)[0];
    };

    ArrayScope.prototype.push = function() {
      var args;
      args = arguments;
      return _scopeChangeLength(this, function() {
        var l, len, one;
        for (l = 0, len = args.length; l < len; l++) {
          one = args[l];
          this.set(this._data.length, one);
        }
        return this._data.length;
      });
    };

    ArrayScope.prototype.unshift = function() {
      var _old_length, i, one, pos;
      _old_length = this._data.length;
      this.push.apply(this, arguments);
      pos = (function() {
        var l, len, ref, results;
        ref = this._data;
        results = [];
        for (i = l = 0, len = ref.length; l < len; i = ++l) {
          one = ref[i];
          if (i < _old_length) {
            results.push(i + arguments.length);
          } else {
            results.push(i - _old_length);
          }
        }
        return results;
      }).apply(this, arguments);
      _scopeCallWatch(this, pos, null, '$move');
      _scopeCallWatch(this, this._data.length, _old_length, 'length');
      return this._data.length;
    };

    ArrayScope.prototype.reverse = function() {
      var i, one, pos;
      this._data.reverse();
      pos = (function() {
        var l, len, ref, results;
        ref = this._data;
        results = [];
        for (i = l = 0, len = ref.length; l < len; i = ++l) {
          one = ref[i];
          results.push(this._data.length - 1 - i);
        }
        return results;
      }).call(this);
      _scopeCallWatch(this, pos, null, '$move');
      return this;
    };

    ArrayScope.prototype.sort = function(fn) {
      var i, one, pos, self, to_sort;
      self = this;
      to_sort = (function() {
        var l, len, ref, results;
        ref = this._data;
        results = [];
        for (i = l = 0, len = ref.length; l < len; i = ++l) {
          one = ref[i];
          results.push({
            e: one,
            o: i
          });
        }
        return results;
      }).call(this);
      to_sort.sort(function(a, b) {
        return fn.call(self, a.e, b.e);
      });
      pos = [];
      this._data = (function() {
        var l, len, results;
        results = [];
        for (i = l = 0, len = to_sort.length; l < len; i = ++l) {
          one = to_sort[i];
          pos[one.o] = i;
          results.push(one.e);
        }
        return results;
      })();
      _scopeCallWatch(this, pos, null, '$move');
      return this;
    };

    ArrayScope.prototype.filter = function(fn) {
      var i, l, len, len1, n, one, ref, ref1, results, to_remove;
      to_remove = [];
      ref = this._data;
      for (i = l = 0, len = ref.length; l < len; i = ++l) {
        one = ref[i];
        if (!fn.call(this, one, i)) {
          to_remove.push(i);
        }
      }
      ref1 = to_remove.reverse();
      results = [];
      for (n = 0, len1 = ref1.length; n < len1; n++) {
        i = ref1[n];
        results.push(this.remove(i));
      }
      return results;
    };

    return ArrayScope;

  })(casua.Scope);

  casua.defineController = function(init_fn) {
    var __computeBind, __compute_controller_method_regexp, __compute_controller_regexp, __compute_match_key_regexp, __compute_match_regexp, __compute_scope_key_regexp, __compute_scope_regexp, __keep_original_attr_regexp, __nodeAttrBind, __nodeBind, __nodeCondition, __nodeValueBind, __resolveMethod, _generateContext, _renderNode, _renderNodes;
    _renderNode = function(_controller, _scope, _root, named_nodes, template) {
      var _context, child, m, method, new_controller, new_template, node, node_meta, r, ret_nodes;
      if (_scope instanceof casua.ArrayScope) {
        return _renderNodes(_controller, _scope, _root, named_nodes, template);
      } else if (template['@controller']) {
        new_template = _shallowCopy(template);
        new_controller = new template['@controller'](_scope, _controller);
        delete new_template['@controller'];
        return _renderNode(new_controller, _scope, _root, named_nodes, new_template);
      } else {
        _context = _generateContext(_controller, _root, named_nodes);
        ret_nodes = [];
        for (node_meta in template) {
          child = template[node_meta];
          if (node_meta.charAt(0) === '@') {
            if (r = node_meta.toLowerCase().match(/^@(\w+)(?: (\S+))?$/)) {
              switch (r[1]) {
                case 'on':
                  if (m = child.match(__compute_controller_method_regexp)) {
                    method = __resolveMethod(_controller, m[1]);
                    _root.on(r[2], function(e) {
                      return method.call(_context, e);
                    });
                  }
                  break;
                case 'html':
                case 'text':
                  __nodeBind(_controller, _root, r[1], _scope, _context, child);
                  break;
                case 'val':
                  __nodeValueBind(_controller, _root, _scope, _context, child);
                  break;
                case 'attr':
                  __nodeAttrBind(_controller, _root, r[2], _scope, _context, child);
                  break;
                case 'class':
                  __nodeAttrBind(_controller, _root, r[1], _scope, _context, child);
                  break;
                case 'child':
                  _renderNode(_controller, _scope.get(r[2]), _root, named_nodes, child);
                  break;
                case 'if':
                  __nodeCondition(_controller, _root, r[1], _scope, _context, child);
                  break;
                case 'unless':
                  __nodeCondition(_controller, _root, r[1], _scope, _context, child, true);
              }
            }
          } else {
            r = node_meta.match(/^(.*?)(?: \$(\S+))?(?: \#.*)?$/);
            node = new casua.Node(r[1]);
            if (r[2]) {
              named_nodes['$' + r[2]] = node;
            }
            ret_nodes.push(node);
            _root.append(node);
            if (typeof child === 'object') {
              _renderNode(_controller, _scope, node, named_nodes, child);
            } else {
              __nodeBind(_controller, node, 'text', _scope, _context, child);
            }
          }
        }
        return ret_nodes;
      }
    };
    _renderNodes = function(_controller, _scope, _root, named_nodes, template) {
      var _nodes, add_fn;
      _root.empty();
      _nodes = [];
      add_fn = function(new_scope, type, idx) {
        var _new_named_nodes;
        _new_named_nodes = _shallowCopy(named_nodes);
        return _nodes[idx] = _renderNode(_controller, new_scope, _root, _new_named_nodes, template);
      };
      _scope.$watch('$add', add_fn);
      _scope.$watch('$delete', function(new_scope, type, idx) {
        var l, len, node, nodes, results;
        nodes = _nodes.splice(idx, 1)[0];
        results = [];
        for (l = 0, len = nodes.length; l < len; l++) {
          node = nodes[l];
          results.push(node.remove());
        }
        return results;
      });
      _scope.$watch('$move', function(new_pos) {
        var _new_nodes, l, len, len1, n, new_po, node, nodes, old_po, results;
        _new_nodes = [];
        for (old_po = l = 0, len = new_pos.length; l < len; old_po = ++l) {
          new_po = new_pos[old_po];
          _new_nodes[new_po] = _nodes[old_po];
        }
        _nodes = _new_nodes;
        _root.empty();
        results = [];
        for (n = 0, len1 = _nodes.length; n < len1; n++) {
          nodes = _nodes[n];
          results.push((function() {
            var len2, p, results1;
            results1 = [];
            for (p = 0, len2 = nodes.length; p < len2; p++) {
              node = nodes[p];
              results1.push(_root.append(node));
            }
            return results1;
          })());
        }
        return results;
      });
      return _scope.each(function(one, idx) {
        return add_fn.call({}, one, null, idx);
      });
    };
    _generateContext = function(_controller, _node, named_nodes) {
      var $parent, bound_fn, context, fn, name, parent, ref;
      context = {
        $node: function(name) {
          if (name != null) {
            if (name.charAt(0) === '$') {
              return named_nodes[name];
            } else {
              return named_nodes.$root.find(name);
            }
          } else {
            return _node;
          }
        }
      };
      parent = _controller;
      $parent = context;
      while (parent) {
        ref = parent.methods;
        for (name in ref) {
          fn = ref[name];
          bound_fn = fn.bind(context);
          $parent[name] = bound_fn;
          context[name] || (context[name] = bound_fn);
        }
        if (parent = parent._parent) {
          $parent = $parent.$parent = {};
        }
      }
      return context;
    };
    __nodeBind = function(_controller, _node, _method, _scope, _context, src) {
      return __computeBind(_controller, _scope, _context, src, function(result) {
        return _node[_method].call(_node, result);
      });
    };
    __keep_original_attr_regexp = /^class$/;
    __nodeAttrBind = function(_controller, _node, attr, _scope, _context, src) {
      var o, original, r, setter;
      original = attr.match(__keep_original_attr_regexp) && (o = _node.attr(attr)) ? o + ' ' : void 0;
      __computeBind(_controller, _scope, _context, src, function(result) {
        if (original != null) {
          result = original + result;
        }
        return _node.attr(attr, result);
      });
      if (attr.match(__boolean_attr_regexp) && (r = src.match(__compute_scope_key_regexp))) {
        setter = function() {
          return _scope.set(r[1], _node.attr(attr));
        };
        return _node.on('click', setter);
      }
    };
    __nodeValueBind = function(_controller, _node, _scope, _context, src) {
      var getter, key, l, len, method, r, ref, results, setter;
      if (r = src.match(__compute_scope_key_regexp)) {
        getter = function() {
          return _node.val(_scope.get(r[1]));
        };
        setter = function() {
          return _scope.set(r[1], _node.val());
        };
      } else if (r = src.match(__compute_controller_method_regexp)) {
        method = __resolveMethod(_controller, r[1]);
        getter = function() {
          return _node.val(method.call(_context));
        };
        setter = function() {
          return method.call(_context, _node.val());
        };
      } else {
        return __nodeBind(_controller, _root, 'val', _scope, _context, child);
      }
      _node.on('change', setter);
      _node.on('keyup', setter);
      _scope.$startGetWatches();
      getter.call(_scope);
      ref = _scope.$stopGetWatches();
      results = [];
      for (l = 0, len = ref.length; l < len; l++) {
        key = ref[l];
        results.push(_scope.$watch(key, getter));
      }
      return results;
    };
    __nodeCondition = function(_controller, _node, _method, _scope, _context, src, _unless) {
      var cur_node, false_node, true_node;
      if (_unless == null) {
        _unless = false;
      }
      cur_node = true_node = _node;
      false_node = new casua.Node('<!-- -->');
      return __computeBind(_controller, _scope, _context, src, (function(result) {
        if (_unless) {
          result = !result;
        }
        if (result) {
          cur_node.replaceWith(true_node);
          return cur_node = true_node;
        } else {
          cur_node.replaceWith(false_node);
          return cur_node = false_node;
        }
      }), true);
    };
    __compute_match_regexp = /\{\{([\S^\}]+?)\}\}/g;
    __compute_match_key_regexp = /^\{\{([\S^\}]+?)\}\}$/;
    __compute_scope_regexp = /@(\S+)/g;
    __compute_scope_key_regexp = /^@(\S+)$/;
    __compute_controller_regexp = /(\w\S*)\(\)/g;
    __compute_controller_method_regexp = /^(\w\S*)\(\)$/;
    __computeBind = function(_controller, _scope, _context, src, fn, to_eval) {
      var ct, key, keys_to_watch, l, len, method, mm, r, ref, results, sc, watch_fn;
      if (to_eval == null) {
        to_eval = false;
      }
      keys_to_watch = [];
      watch_fn = (r = src.match(__compute_controller_method_regexp)) ? (method = __resolveMethod(_controller, r[1]), function() {
        return fn.call({}, method.call(_context));
      }) : (r = src.match(__compute_scope_key_regexp)) ? function() {
        return fn.call({}, this.get(r[1]));
      } : (r = src.match(__compute_match_regexp)) ? function() {
        var scope;
        scope = this;
        return fn.call({}, src.replace(__compute_match_regexp, function(part) {
          part = part.match(__compute_match_key_regexp);
          if (r = part[1].match(__compute_controller_method_regexp)) {
            method = __resolveMethod(_controller, r[1]);
            return method.call(_context);
          } else if (r = part[1].match(__compute_scope_key_regexp)) {
            return scope.get(r[1]);
          }
        }));
      } : to_eval ? (ct = _context, sc = _scope, mm = {}, src = src.replace(__compute_controller_regexp, function(part) {
        part = part.match(__compute_controller_method_regexp);
        mm[part[1]] = __resolveMethod(_controller, part[1]);
        return 'mm["' + part[1] + '"].call(ct)';
      }), src = src.replace(__compute_scope_regexp, function(part) {
        part = part.match(__compute_scope_key_regexp);
        return 'sc.get("' + part[1] + '")';
      }), function() {
        return fn.call({}, eval(src));
      }) : function() {
        return fn.call({}, src);
      };
      _scope.$startGetWatches();
      watch_fn.call(_scope);
      ref = _scope.$stopGetWatches();
      results = [];
      for (l = 0, len = ref.length; l < len; l++) {
        key = ref[l];
        results.push(_scope.$watch(key, watch_fn));
      }
      return results;
    };
    __resolveMethod = function(_controller, method) {
      var resolved_controller, resolved_method;
      resolved_controller = _controller;
      while (true) {
        resolved_method = resolved_controller.methods != null ? resolved_controller.methods[method] : void 0;
        if (resolved_method != null) {
          break;
        } else {
          if (!(resolved_controller = resolved_controller._parent)) {
            break;
          }
        }
      }
      return resolved_method;
    };
    return (function() {
      function _Class(init_data, _parent1) {
        if (init_data == null) {
          init_data = {};
        }
        this._parent = _parent1;
        this.scope = new casua.Scope(init_data);
        this.methods = init_fn.call(this, this.scope, this);
      }

      _Class.prototype.renderAt = function(container, template) {
        var named_nodes;
        container = (new casua.Node(container)).empty();
        named_nodes = {
          $root: container
        };
        return _renderNode(this, this.scope, container, named_nodes, template);
      };

      _Class.prototype.render = function(template) {
        var fragment;
        fragment = new casua.Node(document.createElement('div'));
        this.renderAt(fragment, template);
        return fragment;
      };

      return _Class;

    })();
  };

  window.casua = casua;

}).call(this);
