###
Casua 0.0.2
Copyright (c) 2013-2014 aligo Kang

Released under the MIT license
###


_shallowCopy = (src, dst = {}) ->
  dst[key] = value for key, value of src
  dst

_escape_chars = { lt: '<', gt: '>', quot: '"', amp: '&', apos: "'" }
_reversed_escape_chars = {}
_reversed_escape_chars[v] = k for k, v of _escape_chars 
_escapeHTML = (str) ->
  str.replace /[&<>"']/g, (m) ->
    '&' + _reversed_escape_chars[m] + ';'

__boolean_attr_regexp = /^multiple|selected|checked|disabled|required|open$/

_css_selector = typeof document.querySelectorAll is 'function'

casua = {}

class casua.Node
  _addNodes = (_node, elements) ->
    elements = [elements] if elements.nodeName
    for element in elements
      element._node = _node
      _push _node, element

  _push = (_node, one) ->
    _node[_node.length] = one
    _node.length += 1

  _forEach = (_node, callback) ->
    ret = for one, idx in _node
      callback.call one, idx, one
    ret[0]
      
  __addEventListenerFn = if window.document.addEventListener
    (element, type, fn) -> element.addEventListener type, fn, false
  else
    (element, type, fn) -> element.attachEvent 'on' + type, fn

  __createEventHanlder = (element, events) ->
    ret = (event, type) ->
      event.preventDefault ||= -> event.returnValue = false
      event.stopPropagation ||= -> event.cancelBubble = true
      event.target ||= event.srcElement || document
      unless event.defaultPrevented?
        prevent = event.preventDefault
        event.preventDefault = ->
          event.defaultPrevented = true
          prevent.call event
        event.defaultPrevented = false
      event.isDefaultPrevented = -> ( event.defaultPrevented ) ||  ( event.returnValue == false )
      eventFns = _shallowCopy( events[type || event.type] || [])
      fn.call element, event for i, fn of eventFns
      delete event.preventDefault
      delete event.stopPropagation
      delete event.isDefaultPrevented
    ret.elem = element
    ret.handleds = []
    ret

  __trigger_to_dom_regexp = /^focus$/

  constructor: (node_meta) ->
    @handlers = {}
    @events = {}
    @length = 0
    if node_meta instanceof casua.Node
      return node_meta
    else if typeof node_meta is 'string'
      if node_meta.charAt(0) != '<'
        attrs_data = node_meta.split ' '
        tag_data = attrs_data.shift()
        el = document.createElement if r = tag_data.match(/^([^\.^#]+)/)
          r[1]
        else
          'div'
        if r = tag_data.match /\.([^\.^#]+)/g
          el.className = r.join(' ').replace /\./g, ''
        if r = tag_data.match /#([^\.^#]+)/
          el.id = r[1]
        _addNodes @, el
        for attr in attrs_data
          if attr.charAt(0) != '#' && r = attr.match /^([^=]+)(?:=(['"])(.+?)\2)?$/
            @attr r[1], ( r[3] || r[1] )
      else
        div = document.createElement 'div'
        div.innerHTML = '<div>&#160;</div>' + node_meta
        div.removeChild div.firstChild
        for child in div.childNodes
          _addNodes @, child
    else
      _addNodes @, node_meta

  attr: (name, value) ->
    name = name.toLowerCase()
    return @val(value) if name.match /^val|value$/
    if name.match __boolean_attr_regexp
      if value?
        if value
          _forEach @, -> 
            @setAttribute name, name
            @[name] = true
        else
          _forEach @, -> 
            @removeAttribute name
            @[name] = false
        @
      else
        @[0][name]
    else
      if value?
        _forEach @, -> @setAttribute name, value
        @
      else
        @[0].getAttribute name, 2
    
  append: (node) ->
    node = new casua.Node node if typeof node is 'string'
    _forEach @, (i, parent) -> _forEach node, (j, child) -> parent.appendChild child
    @

  empty: ->
    _forEach @, ->
      while @firstChild
        @removeChild @firstChild
    @

  html: (value) ->
    if value?
      @empty()
      _forEach @, -> @innerHTML = value
      @
    else
      @[0].innerHTML

  text: (value) ->
    if value?
      @html _escapeHTML(value)
    else
      @html()

  on: (type, fn) ->
    _node = @
    @events[type] ||= []
    @events[type].push fn
    _forEach @, (idx) ->
      handler = _node.handlers[idx] ||= __createEventHanlder @, _node.events
      handleds = handler.handleds
      if handleds.indexOf(type) == -1
        __addEventListenerFn @, type, handler
        handleds.push type
    @

  trigger: (type, event_data = {}) ->
    if type.match __trigger_to_dom_regexp
      trigger_to_dom = true
    _forEach @, ->
      event = document.createEvent 'HTMLEvents'
      event.initEvent type, true, true
      event[key] = value for key, value of event_data
      @dispatchEvent event
      @[type]() if trigger_to_dom
    @

  remove: ->
    _forEach @, -> @parentNode.removeChild @ if @parentNode
    @

  replaceWith: (node) ->
    node = new casua.Node node if typeof node is 'string'
    _forEach @, (i, from) -> _forEach node, (j, to) -> from.parentNode.replaceChild to, from if from.parentNode
    @

  val: (value) ->
    if value?
      _forEach @, -> @value = value
      @
    else
      @[0].value

  parent: ->
    if parent = @[0].parentNode
      parent._node || new casua.Node parent

  find: (query) ->
    element = if _css_selector
      @[0].querySelector query
    else
      @[0].getElementsByTagName query
    if element
      element._node || new casua.Node element

_scopeInitParent = (_scope, _parent) ->
  _scope._childs = []
  if _parent?
    _parent._childs.push _scope if _parent._childs.indexOf(_scope) == -1
    _scope._parent = _parent

_scopeRemovePrepare = (_scope, key) ->
  if _scope._data[key] instanceof casua.Scope
    s = _scope._data[key]
    if s._parent?
      i = s._parent._childs.indexOf s
      s._parent._childs.splice i, 1
  _scopeCallWatch _scope, _scope._data[key], key, '$delete'

_scopeCallWatch = (_scope, new_val, old_val, key) ->
  if typeof key is 'string' && key.charAt(0) == '$'
    _scopeCallAltWatch _scope, new_val, old_val, key
  else
    if _scope._watches[key]
      fn.call _scope, new_val, old_val, key for fn in _scope._watches[key]
    for child in _scope._childs
      unless child._data[key]?
        _scopeCallWatch child, new_val, old_val, key

_scopeCallAltWatch = (_scope, new_val, key, type) ->
  if _scope._watches[type]
    fn.call _scope, new_val, type, key for fn in _scope._watches[type]

__mutiple_levels_key_regexp = /^([^\.]+)\.(.+)$/

class casua.Scope

  constructor: (init_data, parent) ->
    if init_data instanceof casua.Scope
      return init_data
    else if init_data.length?
      return new casua.ArrayScope init_data, parent
    else
      _scopeInitParent @, parent
      @_watches = {}
      @_data = {}
      @set key, value for key, value of init_data

  get: (key) ->
    @_watch_lists.push key if @_watch_lists && @_watch_lists.indexOf(key) == -1
    if typeof key is 'string' && r = key.match __mutiple_levels_key_regexp
      @get(r[1]).get(r[2])
    else if key == '$parent'
      @_parent
    else
      ret = @_data[key]
      ret = @_parent.get(key) if !ret? && @_parent?
      ret

  set: (key, value) ->
    if typeof key is 'string' && r = key.match __mutiple_levels_key_regexp
      @get(r[1]).set r[2], value
    else
      unless typeof key is 'string' && key.charAt(0) == '$'
        if typeof value is 'object'
          value = new casua.Scope value, @
        if @_data[key] != value
          old = @_data[key]
          @_data[key] = value
          unless old?
            _scopeCallWatch @, value, key, '$add'
          _scopeCallWatch @, value, old, key
    @

  remove: (key) ->
    if typeof key is 'string' && r = key.match __mutiple_levels_key_regexp
      @get(r[1]).remove(r[2])
    else
      _scopeRemovePrepare @, key
      delete @_data[key]
    @

  $watch: (key, fn) ->
    if typeof key is 'string' && r = key.match __mutiple_levels_key_regexp
      @get(r[1]).$watch r[2], fn
    else
      @_watches[key] ||= []
      @_watches[key].push fn
    @

  $startGetWatches: ->
    @_watch_lists = []

  $stopGetWatches: ->
    lists = for one in @_watch_lists
      one
    delete @_watch_lists
    lists

_scopeChangeLength = (_scope, fn) ->
  _old_length = _scope._data.length
  ret = fn.call _scope
  _scopeCallWatch _scope, _scope._data.length, _old_length, 'length'
  ret

class casua.ArrayScope extends casua.Scope

  constructor: (init_data, parent) ->
    if init_data instanceof casua.Scope
      return init_data
    else if not init_data.length?
      return new casua.Scope init_data, parent
    else
      _scopeInitParent @, parent
      @_watches = {}
      @_data = []
      @set idx, value for value, idx in init_data

  length: -> @_data.length

  indexOf: (child) ->
    @_data.indexOf child

  remove: (key) ->
    _scopeChangeLength @, ->
      _scopeRemovePrepare @, key
      @_data.splice key, 1

  each: (fn) ->
    for one, i in @_data
      fn.call @, @get(i), i
    @

  pop: -> @remove(@_data.length - 1)[0]

  shift: -> @remove(0)[0]

  push: ->
    args = arguments
    _scopeChangeLength @, ->
      @set @_data.length, one for one in args
      @_data.length

  unshift: ->
    _old_length = @_data.length
    @push.apply @, arguments
    pos = for one, i in @_data
      if i < _old_length
        i + arguments.length
      else
        i - _old_length
    _scopeCallWatch @, pos, null, '$move'
    _scopeCallWatch @, @_data.length, _old_length, 'length'
    @_data.length

  reverse: ->
    @_data.reverse()
    pos = for one, i in @_data
      @_data.length - 1 - i
    _scopeCallWatch @, pos, null, '$move'
    @

  sort: (fn) ->
    self = @
    to_sort = for one, i in @_data
      e: one
      o: i
    to_sort.sort (a, b) -> fn.call self, a.e, b.e
    pos = []
    @_data = for one, i in to_sort
      pos[one.o] = i
      one.e
    _scopeCallWatch @, pos, null, '$move'
    @

  filter: (fn) ->
    to_remove = []
    for one, i in @_data
      to_remove.push i unless fn.call @, one, i
    @remove i for i in to_remove.reverse()

casua.defineController = (init_fn) ->

  _renderNode = (_controller, _scope, _root, named_nodes, template) ->
    if _scope instanceof casua.ArrayScope
      _renderNodes _controller, _scope, _root, named_nodes, template
    else if template['@controller']
      new_template = _shallowCopy template
      new_controller = new template['@controller'](_scope, _controller)
      delete new_template['@controller']
      _renderNode new_controller, _scope, _root, named_nodes, new_template
    else
      _context = _generateContext _controller, _root, named_nodes
      ret_nodes = []
      for node_meta, child of template
        if node_meta.charAt(0) == '@'
          if r = node_meta.toLowerCase().match /^@(\w+)(?: (\S+))?$/
            switch r[1]
              when 'on'
                if m = child.match __compute_controller_method_regexp
                  method = __resolveMethod(_controller, m[1])
                  _root.on r[2], (e) -> method.call _context, e
              when 'html', 'text'
                __nodeBind _controller, _root, r[1], _scope, _context, child
              when 'val'
                __nodeValueBind _controller, _root, _scope, _context, child
              when 'attr'
                __nodeAttrBind _controller, _root, r[2], _scope, _context, child
              when 'class'
                __nodeAttrBind _controller, _root, r[1], _scope, _context, child
              when 'child'
                _renderNode _controller, _scope.get(r[2]), _root, named_nodes, child
              when 'if'
                __nodeCondition _controller, _root, r[1], _scope, _context, child
              when 'unless'
                __nodeCondition _controller, _root, r[1], _scope, _context, child, true
        else
          r = node_meta.match /^(.*?)(?: \$(\S+))?(?: \#.*)?$/
          node = new casua.Node r[1]
          named_nodes['$' + r[2]] = node if r[2]
          ret_nodes.push node
          _root.append node
          if typeof child is 'object'
            _renderNode _controller, _scope, node, named_nodes, child
          else
            __nodeBind _controller, node, 'text', _scope, _context, child
      ret_nodes    

  _renderNodes = (_controller, _scope, _root, named_nodes, template) ->
    _root.empty()
    _nodes = []
    add_fn = (new_scope, type, idx) ->
      _new_named_nodes = _shallowCopy named_nodes
      _nodes[idx] = _renderNode _controller, new_scope, _root, _new_named_nodes, template
    _scope.$watch '$add', add_fn
    _scope.$watch '$delete', (new_scope, type, idx) ->
      nodes = _nodes.splice(idx, 1)[0]
      node.remove() for node in nodes
    _scope.$watch '$move', (new_pos) ->
      _new_nodes = []
      _new_nodes[new_po] = _nodes[old_po] for new_po, old_po in new_pos
      _nodes = _new_nodes
      _root.empty()
      for nodes in _nodes
        _root.append node for node in nodes
    _scope.each (one, idx) -> add_fn.call {}, one, null, idx

  _generateContext = (_controller, _node, named_nodes) ->
    context =
      $node: (name) ->
        if name?
          if name.charAt(0) == '$'
            named_nodes[name]
          else
            named_nodes.$root.find name
        else
          _node
    parent = _controller
    $parent = context
    while parent
      for name, fn of parent.methods
        bound_fn = fn.bind context
        $parent[name] = bound_fn
        context[name] ||= bound_fn
      $parent = $parent.$parent = {} if parent = parent._parent
    context

  __nodeBind = (_controller, _node, _method, _scope, _context, src) ->
    __computeBind _controller, _scope, _context, src, (result) ->
      _node[_method].call _node, result

  __keep_original_attr_regexp = /^class$/
  __nodeAttrBind = (_controller, _node, attr, _scope, _context, src) ->
    original = if attr.match(__keep_original_attr_regexp) && o = _node.attr(attr)
      o + ' '
    __computeBind _controller, _scope, _context, src, (result) ->
      result = original + result if original?
      _node.attr attr, result
    if attr.match(__boolean_attr_regexp) && r = src.match(__compute_scope_key_regexp)
      setter = ->
        _scope.set r[1], _node.attr(attr)
      _node.on 'click', setter

  __nodeValueBind = (_controller, _node, _scope, _context, src) ->
    if r = src.match __compute_scope_key_regexp
      getter = -> _node.val _scope.get(r[1])
      setter = -> _scope.set r[1], _node.val()
    else if r = src.match __compute_controller_method_regexp
      method = __resolveMethod _controller, r[1]
      getter = -> _node.val method.call(_context)
      setter = -> method.call _context, _node.val()
    else
      return __nodeBind _controller, _root, 'val', _scope, _context, child
    _node.on 'change', setter
    _node.on 'keyup', setter
    _scope.$startGetWatches()
    getter.call _scope
    _scope.$watch key, getter for key in _scope.$stopGetWatches()

  __nodeCondition = (_controller, _node, _method, _scope, _context, src, _unless = false) ->
    cur_node = true_node = _node
    false_node = new casua.Node '<!-- -->'
    __computeBind _controller, _scope, _context, src, ( (result) ->
      result = !result if _unless
      if result
        cur_node.replaceWith true_node
        cur_node = true_node
      else
        cur_node.replaceWith false_node
        cur_node = false_node
    ), true

  __compute_match_regexp = /\{\{([\S^\}]+?)\}\}/g
  __compute_match_key_regexp = /^\{\{([\S^\}]+?)\}\}$/

  __compute_scope_regexp = /@(\S+)/g
  __compute_scope_key_regexp = /^@(\S+)$/

  __compute_controller_regexp = /(\w\S*)\(\)/g
  __compute_controller_method_regexp = /^(\w\S*)\(\)$/

  __computeBind = (_controller, _scope, _context, src, fn, to_eval = false) ->
    keys_to_watch = []
    watch_fn = if r = src.match __compute_controller_method_regexp
      method = __resolveMethod _controller, r[1]
      -> fn.call {}, method.call(_context)
    else if r = src.match __compute_scope_key_regexp
      -> fn.call {}, @get(r[1])
    else if r = src.match __compute_match_regexp
      ->
        scope = @
        fn.call {}, src.replace __compute_match_regexp, (part) ->
          part = part.match __compute_match_key_regexp
          if r = part[1].match __compute_controller_method_regexp
            method = __resolveMethod _controller, r[1]
            method.call _context
          else if r = part[1].match __compute_scope_key_regexp
            scope.get(r[1])
    else if to_eval
      ct = _context
      sc = _scope
      mm = {}
      src = src.replace __compute_controller_regexp, (part) ->
        part = part.match __compute_controller_method_regexp
        mm[part[1]] = __resolveMethod _controller, part[1]
        'mm["' + part[1] + '"].call(ct)'
      src = src.replace __compute_scope_regexp, (part) ->
        part = part.match __compute_scope_key_regexp
        'sc.get("' + part[1] + '")'
      -> fn.call {}, eval(src)
    else
      -> fn.call {}, src
    _scope.$startGetWatches()
    watch_fn.call _scope
    _scope.$watch key, watch_fn for key in _scope.$stopGetWatches()

  __resolveMethod = (_controller, method) ->
    resolved_controller = _controller
    while true
      resolved_method = if resolved_controller.methods?
        resolved_controller.methods[method]
      if resolved_method?
        break
      else
        break unless resolved_controller = resolved_controller._parent
    resolved_method

  class
    constructor: (init_data = {}, @_parent) ->
      @scope = new casua.Scope init_data
      @methods = init_fn.call @, @scope, @

    renderAt: (container, template) ->
      container = (new casua.Node container).empty()
      named_nodes =
        $root: container
      _renderNode @, @scope, container, named_nodes, template

    render: (template) ->
      fragment = new casua.Node document.createElement 'div'
      @renderAt fragment, template
      fragment

window.casua = casua