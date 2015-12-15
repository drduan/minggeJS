module 'Scope'
test 'Should can be created', ->
  scope = new casua.Scope
    test: 1
  equal scope.get('test'), 1, 'get()'
  scope.set 'test', 2
  equal scope.get('test'), 2, 'set()'
  scope.remove 'test'
  equal scope.get('test')?, false, 'remove()'

test 'Should can handle mutitple-levels scope', ->
  scope = new casua.Scope
    test: 1
    one: 1
    level2:
      test: 2
      two: 2
      level3:
        test: 3
    to_remove:
      test: 3
  equal ( scope._childs.indexOf(scope.get('level2')) == -1 ), false, 'parent._childs be seted up'
  equal ( scope.get('level2')._parent == scope ), true, 'child._parent be seted up'

  equal scope.get('test'), 1, 'get 1st level scope'
  equal (scope.get('level2') instanceof casua.Scope), true, 'level2 is a instance of casua.Scope'
  equal scope.get('level2').get('test'), 2, 'get 2st level scope'
  equal scope.get('level2').get('one'), 1, 'resolve to parent scope'
  scope.get('level2').set('one', 'overwrite')
  equal scope.get('level2').get('one'), 'overwrite', 'overwrite current scope'
  equal scope.get('one'), 1, 'but parent is not changed'

  equal scope._childs.length, 2, 'scope has two childs'
  scope.remove('to_remove')
  equal scope._childs.length, 1, 'to_remove has been remove & release'

  equal scope.get('level2.level3.test'), 3, 'get mutitple-levels scope with dots format'
  watched = []
  scope.$watch 'level2.level3.test', (n, o, k) -> watched = [n, o, k]
  scope.set 'level2.level3.test', 'new'
  equal scope.get('level2').get('level3').get('test'), 'new', 'set mutitple-levels scope with dots format'
  deepEqual watched, ['new', 3, 'test'], 'watch mutitple-levels scope with dots format'

  equal scope.get('level2.level3.$parent'), scope.get('level2'), 'get $parent'

test 'Should can be created to ArrayScope', ->
  scope = new casua.Scope [1, 2, 3]
  equal (scope instanceof casua.ArrayScope), true, 'is a instance of casua.ArrayScope'
  equal (scope instanceof casua.Scope), true, 'is a instance of casua.Scope'
  equal scope.length(), 3, 'array length()'
  equal scope.get(0), 1, 'array get()'
  scope.set 2, 4
  equal scope.get(2), 4, 'array set()'

  scope.push 'x'
  equal scope.length(), 4, 'array push()'
  equal scope.get(3), 'x', 'array push()'

  equal scope.pop(), 'x', 'array pop()'
  equal scope.length(), 3, 'array pop()'

  scope.remove 0
  equal scope.length(), 2, 'array remove()'
  equal scope.get(0), 2, 'array remove()'
  equal scope.get(1), 4, 'array remove()'

  arr = []
  scope.each (value, idx) ->
    arr[idx] = value

  deepEqual arr, scope._data, 'array each()'

  equal arr.indexOf(4), 1, 'scope indexOf()'

test 'Should can watch', ->
  changed = []
  watch_fn = (n, o, k) -> changed.push [n, o, k]
  scope = new casua.Scope
    test: 1
    test2: 2
    child:
      test: 2
      test3: 3
  scope.$watch 'test', watch_fn
  scope.get('child').$watch 'test', watch_fn
  scope.get('child').$watch 'test2', watch_fn
  scope.$watch '$add', watch_fn
  scope.$watch '$delete', watch_fn
  scope.set 'test', 'changed'
  deepEqual changed.pop(), ['changed', 1, 'test'], 'watch set()'
  equal changed.length, 0, 'child\'s watch can not be triggered when it has same key as parent'

  scope.set 'test2', 'changed1'
  deepEqual changed.pop(), ['changed1', 2, 'test2'], 'child\'s watch can be triggered when it has not key same as parent)'

  scope.set 'new', 'new value'
  deepEqual changed.pop(), ['new value', '$add', 'new'], 'watch $add'

  scope.remove 'new'
  deepEqual changed.pop(), ['new value', '$delete', 'new'], 'watch $delete'

test 'Should can watch ArrayScope', ->
  changed = []
  watch_fn = (n, o, k) -> changed.push [n, o, k]
  scope = new casua.Scope
    arr: [0, 1, 2]
    test: -1
  scope.get('arr').$watch 0, watch_fn
  scope.get('arr').$watch 1, watch_fn
  scope.get('arr').$watch 2, watch_fn
  scope.get('arr').$watch 'test', watch_fn
  scope.get('arr').$watch '$add', watch_fn
  scope.get('arr').$watch '$delete', watch_fn
  scope.get('arr').$watch '$move', watch_fn
  scope.get('arr').$watch 'length', watch_fn
  scope.get('arr').push 4
  deepEqual changed.pop(), [4, 3, 'length'], 'watch length'
  deepEqual changed.pop(), [4, '$add', 3], 'watch $add'

  scope.get('arr').$watch 3, watch_fn
  scope.get('arr').set 3, 'test'
  deepEqual changed.pop(), ['test', 4, 3], 'watch set()'

  equal scope.get('arr').shift(), 0, 'watch shift() -> $delete'
  deepEqual changed.pop(), [3, 4, 'length'], 'watch length'
  deepEqual changed.pop(), [0, '$delete', 0], 'watch shift() -> $delete'

  equal scope.get('arr').pop(), 'test', 'watch pop() -> $delete'
  deepEqual changed.pop(), [2, 3, 'length'], 'watch length'
  deepEqual changed.pop(), ['test', '$delete', 2], 'watch shift() -> $delete'

  scope.get('arr').unshift(1, 2)
  deepEqual changed.shift(), [1, '$add', 2], 'watch $add'
  deepEqual changed.shift(), [1, undefined, 2], 'watch $add'
  deepEqual changed.shift(), [2, '$add', 3], 'watch $add'
  deepEqual changed.shift(), [2, undefined, 3], 'watch $add'
  deepEqual changed.shift(), [4, 2, 'length'], 'watch length'
  deepEqual changed.shift(), [ [2, 3, 0, 1], '$move', null], 'watch unshift() -> $move'

  scope.set 'test', 'change'
  deepEqual changed.pop(), ['change', -1, 'test'], 'watch parent'

test 'Should can watch ArrayScope 2', ->
  changed = []
  watch_fn = (n, o, k) -> changed.push [n, o, k]
  arr = new casua.Scope [5, 3, 2, 1, 4, 0]
  arr.$watch '$move', watch_fn
  arr.reverse()
  deepEqual changed.shift(), [ [5, 4, 3, 2, 1, 0], '$move', null], 'watch reverse() -> $move'

  arr.sort (a, b) -> a - b
  deepEqual changed.shift(), [ [0, 4, 1, 2, 3, 5], '$move', null], 'watch sort() -> $move'

test 'Should can watch ArrayScope 3', ->
  changed = []
  watch_fn = (n, o, k) -> changed.push [n, o, k]
  arr = new casua.Scope [5, 3, 2, 1, 4, 0]
  arr.$watch '$delete', watch_fn
  arr.filter (e) -> e % 2 == 0
  deepEqual arr._data, [2, 4, 0], 'filter()'
  deepEqual changed.pop(), [5, '$delete', 0], 'watch filter() -> $delete'
  deepEqual changed.pop(), [3, '$delete', 1], 'watch filter() -> $delete'
  deepEqual changed.pop(), [1, '$delete', 3], 'watch filter() -> $delete'
  
test 'Should can get watch lists', ->
  scope = new casua.Scope
    test: 1
    test2: 2
    test3: 3
  watch_lists = scope.$startGetWatches()
  deepEqual watch_lists, [], 'get emtpy watch lists'
  equal scope.get('test'), 1, 'normal get()'
  deepEqual watch_lists, ['test'], 'get emtpy watch lists'
  equal scope.get('test'), 1, 'normal get()'
  equal scope.get('test2'), 2, 'normal get()'
  deepEqual scope.$stopGetWatches(), ['test', 'test2'], 'get emtpy watch lists'
  equal scope.get('test3'), 3, 'normal get()'
  deepEqual watch_lists, ['test', 'test2'], 'get emtpy watch lists'

