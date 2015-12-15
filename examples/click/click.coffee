exampleController = casua.defineController (scope) ->
  scope.set 'was_or_not', 'was not'
  onClick: -> scope.set 'was_or_not', 'was'

app_node = new casua.Node document.getElementById('app')

template =
  'div':
    '@on click': 'onClick()'
    '@text': 'this {{@was_or_not}} clicked'

new exampleController().renderAt app_node, template