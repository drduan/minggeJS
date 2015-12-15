_test = window._test

module 'Controller 2'

test 'CST @html', ->
  testController = casua.defineController (scope) ->
    computeMethod: ->
      scope.get('test') + ' computed'

  testCtrlInst = new testController
    test: 'scope value'
    test2: 'is good'
  fragment1 = testCtrlInst.render
    'h1':
      '@html': 'pure html'
  equal fragment1[0].children[0].innerHTML, 'pure html', 'pure html'
  fragment2 = testCtrlInst.render
    'h1':
      '@html': '@test'
  equal fragment2[0].children[0].innerHTML, 'scope value', 'single binding'

  fragment3 = testCtrlInst.render
    'h1':
      '@html': '{{@test}} {{@test2}}.'
  equal fragment3[0].children[0].innerHTML, 'scope value is good.', 'computed binding'

  fragment4 = testCtrlInst.render
    'h1':
      '@html': 'computeMethod()'
  equal fragment4[0].children[0].innerHTML, 'scope value computed', 'compute method binding'

  fragment5 = testCtrlInst.render
    'h1':
      '@html': '{{computeMethod()}} is good'
  equal fragment5[0].children[0].innerHTML, 'scope value computed is good', 'compute method binding'

  scope = testCtrlInst.scope
  scope.set 'test', 'changed'

  equal fragment2[0].children[0].innerHTML, 'changed', 'scope value changed 1'
  equal fragment3[0].children[0].innerHTML, 'changed is good.', 'scope value changed 2'
  equal fragment4[0].children[0].innerHTML, 'changed computed', 'changed compute method'
  equal fragment5[0].children[0].innerHTML, 'changed computed is good', 'changed compute method'

  scope.set 'test2', 'is better'
  equal fragment3[0].children[0].innerHTML, 'changed is better.', 'scope value changed 3'

test 'CST @on', ->
  clicked = 0
  testController = casua.defineController ->
    clickOne: -> 
      clicked = 1
    clickTwo: -> 
      clicked += 5
  testCtrlInst = new testController {}
  fragment1 = testCtrlInst.render
    'a':
      '@on click': 'clickOne()'
  _test._trigger fragment1[0].children[0], 'click'
  equal clicked, 1, '@on click: clickOne'

  fragment2 = testCtrlInst.render
    'a':
      '@on click': 'clickOne()'
      '@on click': 'clickTwo()'
  _test._trigger fragment2[0].children[0], 'click'
  equal clicked, 6, '@on click: clickTwo'

  _test._trigger fragment1[0].children[0], 'click'
  equal clicked, 1, '@on click: clickOne'

test 'CST @attr', ->
  testController = casua.defineController ->
  testCtrlInst = new testController
    test: 'value1'
    alt_class: 'alt'
  scope = testCtrlInst.scope
  fragment1 = testCtrlInst.render
    'div':
      '@attr data-attr': '@test'
  equal fragment1[0].children[0].outerHTML, '<div data-attr=\"value1\"></div>', 'bind @attr'
  scope.set 'test', 'new'
  equal fragment1[0].children[0].outerHTML, '<div data-attr=\"new\"></div>', 'bind @attr'

  fragment2 = testCtrlInst.render
    'div.original':
      '@attr class': 'another {{@alt_class}}'
  equal fragment2[0].children[0].outerHTML, '<div class=\"original another alt\"></div>', 'bind @attr class'

  scope.set 'alt_class', 1
  fragment3 = testCtrlInst.render
    'div.original':
      '@class': 'another-{{@alt_class}}'
  equal fragment3[0].children[0].outerHTML, '<div class=\"original another-1\"></div>', 'bind @class for short'

test 'CST @val', ->
  changed = 0
  testController = casua.defineController (scope) ->
    test2: (value) ->
      if value?
        changed += 1
        scope.set 'test2', value
      else
        scope.get 'test2'

  testCtrlInst = new testController
    test: 'value1'
    test2: 'value2'
  scope = testCtrlInst.scope
  fragment1 = testCtrlInst.render
    'input':
      '@val': '@test'
  equal fragment1[0].children[0].value, 'value1', 'bind @val'
  scope.set 'test', 'new'
  equal fragment1[0].children[0].value, 'new', 'bind @val getter'

  fragment1[0].children[0].value = 'set new'
  _test._trigger fragment1[0].children[0], 'keyup'
  equal scope.get('test'), 'set new', 'bind @val setter'

  fragment2 = testCtrlInst.render
    'input':
      '@val': 'test2()'

  equal fragment2[0].children[0].value, 'value2', 'bind @val controller method'
  scope.set 'test2', 'new'
  equal fragment2[0].children[0].value, 'new', 'bind @val getter controller method'

  fragment2[0].children[0].value = 'set new'
  _test._trigger fragment2[0].children[0], 'keyup'
  equal scope.get('test2'), 'set new', 'bind @val setter controller method'
  equal changed, 1, 'bind @val sette controller methodr'
  