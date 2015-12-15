_test = window._test

module 'Controller 1'
test 'defineController', ->
  container = new casua.Node ''
  testController = casua.defineController ->
  testCtrlInst = new testController {}
  testCtrlInst.renderAt container,
    '.test':
      '.test2': '<test3>'
  equal container[0].innerHTML, '<div class="test"><div class="test2">&lt;test3&gt;</div></div>', 'ok'

test 'array scope', ->
  container = new casua.Node 'ul'
  testController = casua.defineController ->
  testCtrlInst = new testController [
    { title: 'one' }
    { title: 'two' }
  ]
  array = testCtrlInst.scope
  testCtrlInst.renderAt container,
    'li':
      'span': '@title'

  equal container.html(), '<li><span>one</span></li><li><span>two</span></li>', 'render'  
  array.push { title: 'three' }
  equal container.html(), '<li><span>one</span></li><li><span>two</span></li><li><span>three</span></li>', 'watch $add'
  array.shift()
  equal container.html(), '<li><span>two</span></li><li><span>three</span></li>', 'watch $delete'
  array.unshift
    title: 'one'
  equal container.html(), '<li><span>one</span></li><li><span>two</span></li><li><span>three</span></li>', 'watch $move'

test 'CST @child', ->
  testController = casua.defineController ->
  testCtrlInst = new testController
    test: 'parent'
    child_test:
      test2: 'child'
      test3: 'this is a child'
  fragment1 = testCtrlInst.render
    'div':
      'h1': '@test'
      '@child child_test':
        'h2': '@test2'
        'div': '{{@test3}}'

  equal fragment1[0].children[0].innerHTML, '<h1>parent</h1><h2>child</h2><div>this is a child</div>', 'child 1'

  testCtrlInst.scope.get('child_test').set 'test2', 'changed'

  equal fragment1[0].children[0].innerHTML, '<h1>parent</h1><h2>changed</h2><div>this is a child</div>', 'child binding'

test 'CST @child ArrayScope', ->
  testController = casua.defineController ->
  testCtrlInst = new testController
    lists: []
  lists = testCtrlInst.scope.get('lists')

  fragment1 = testCtrlInst.render
    'ul':
      '@child lists':
        'li': 'task{{@no}}'
  equal fragment1[0].children[0].innerHTML, '', 'no child'

  lists.push { no: 1 }
  lists.push { no: 3 }
  equal fragment1[0].children[0].innerHTML, '<li>task1</li><li>task3</li>', '2 childs'

  lists.push { no: 2 }
  equal fragment1[0].children[0].innerHTML, '<li>task1</li><li>task3</li><li>task2</li>', '3 childs'

  lists.sort (a, b) -> a.get('no') - b.get('no')
  equal fragment1[0].children[0].innerHTML, '<li>task1</li><li>task2</li><li>task3</li>', 'sorted childs'

test 'CST @controller', ->
  testController = casua.defineController ->
    name: ->
      'parent'
    parentMethod: ->
      @$parent.name() + ' calls ' + @childMethod()
  childController = casua.defineController (scope) ->
    scope.set 'name', 'task' + scope.get('no')
    name: ->
      'child'
    childMethod: ->
      @name()
  testCtrlInst = new testController
    lists: []
  lists = testCtrlInst.scope.get('lists')
  fragment1 = testCtrlInst.render
    'ul':
      '@child lists':
        '@controller': childController
        'li': '{{@name}}'
    'span': '{{@lists.length}} lists'
  lists.push { no: 1 }
  lists.push { no: 2 }
  equal fragment1[0].children[0].innerHTML, '<li>task1</li><li>task2</li>', '2 childs'
  equal fragment1[0].children[1].innerHTML, '2 lists', '2 childs'
  lists.push { no: 3 }
  equal fragment1[0].children[0].innerHTML, '<li>task1</li><li>task2</li><li>task3</li>', '3 childs'
  equal fragment1[0].children[1].innerHTML, '3 lists', '3 childs'

  fragment2 = testCtrlInst.render
    'ul':
      '@child lists':
        '@controller': childController
        'li': 'parentMethod()'
  equal fragment2[0].children[0].innerHTML, '<li>parent calls child</li><li>parent calls child</li><li>parent calls child</li>', 'child controller call parent method'

test 'CST @if', ->
  testController = casua.defineController (scope) ->
    getBool2: -> scope.get('bool2')
    getBool3: -> false
  testCtrlInst = new testController
    bool1: true
    bool2: false
  scope = testCtrlInst.scope
  fragment1 = testCtrlInst.render
    '.test':
      'span #1':
        '@if': '@bool1'
        '@text': 'bool1 is true'
      'span #2':
        '@if': 'getBool2()'
        '@text': 'bool2 is true'
  equal fragment1[0].children[0].innerHTML, '<span>bool1 is true</span><!-- -->', 'ok'

  scope.set 'bool1', false
  scope.set 'bool2', true

  equal fragment1[0].children[0].innerHTML, '<!-- --><span>bool2 is true</span>', 'ok'

  fragment2 = testCtrlInst.render
    '.test':
      'span #1':
        '@if': '@bool1 && true'
        '@text': 'bool1 is true'
      'span #2':
        '@if': 'getBool2() && !getBool3() && true'
        '@text': 'bool2 is true'

  equal fragment2[0].children[0].innerHTML, '<!-- --><span>bool2 is true</span>', 'ok'

test 'Controller Context', ->
  changed = 0
  root_html = ''
  trigger_html = ''
  testController = casua.defineController ->
    add: -> 1
    name: -> 'parent'
    parentMethod: -> @$parent.name() + ' calls ' + @childMethod()
    clickMethod: ->
      root_html = @$node('$root').html()
      trigger_html = @$node().html()
      changed += @add()
  childController = casua.defineController (scope) ->
    scope.set 'name', 'task' + scope.get('no')
    add: -> 2
    name: -> 'child'
    childMethod: -> @name()

  testCtrlInst = new testController

  fragment1 = testCtrlInst.render
    'div':
      '.parent':
        '@text': '{{name()}}'
        '@on click': 'clickMethod()'
      '.child':
        '@controller': childController
        '@text': '{{childMethod()}} {{parentMethod()}}'
        '@on click': 'clickMethod()'
  equal fragment1[0].children[0].innerHTML, '<div class=\"parent\">parent</div><div class=\"child\">child parent calls child</div>', 'ok'

  _test._trigger fragment1[0].children[0].children[0], 'click'
  equal changed, 1, 'trigger parent'
  equal root_html, '<div><div class=\"parent\">parent</div><div class=\"child\">child parent calls child</div></div>', 'named node $root'
  equal trigger_html, 'parent', 'trigger_html'

  _test._trigger fragment1[0].children[0].children[1], 'click'
  equal changed, 3, 'trigger child'
  equal trigger_html, 'child parent calls child', 'trigger_html'

test 'Named Node', ->
  named_div = false
  named_a = false
  testController = casua.defineController ->
    getNamedNode: ->
      named_div = @$node('$div')
      named_a = @$node('$a')
  testCtrlInst = new testController
    arr: [
      { name: '1' }
      { name: '2' }
      { name: '3' }
    ]
  fragment1 = testCtrlInst.render
    'div $div':
      'a $a':
        '@on click': 'getNamedNode()'
        '@text': 'test'
  _test._trigger fragment1[0].children[0].children[0], 'click'
  equal named_div.html(), '<a>test</a>', 'get named div'
  equal named_a.html(), 'test', 'get named a'

  fragment2 = testCtrlInst.render
    'div $div':
      'a $a':
        '@on click': 'getNamedNode()'
        '@text': 'test'
    'ul':
      '@child arr':
        'li $div':
          '@on click': 'getNamedNode()'
          '@text': '@name'

  equal fragment2.html(), '<div><a>test</a></div><ul><li>1</li><li>2</li><li>3</li></ul>', 'ok'
  _test._trigger fragment2[0].children[0].children[0], 'click'
  equal named_div.html(), '<a>test</a>', 'get named div'
  equal named_a.html(), 'test', 'get named a'

  _test._trigger fragment2[0].children[1].children[1], 'click'

  equal named_div.html(), '2', 'get named div'
  equal named_a.html(), 'test', 'get named a'
