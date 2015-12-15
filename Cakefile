casua_files = [
  'build'
  'src'
]

qunit_files = [
  '.tmp/test'
  'test'
]

examples_files = [
  'examples'
  'examples'
]

doc_files = [
  'doc'
  'doc'
]

{spawn, exec} = require 'child_process'

try
  which = require('which').sync
catch err
  if process.platform.match(/^win/)?
    console.log 'WARNING: the which module is required for windows\ntry: npm install which'
  which = null

# ANSI Terminal Colors
bold = '\x1b[0;1m'
green = '\x1b[0;32m'
reset = '\x1b[0m'
red = '\x1b[0;31m'

task 'compile', 'compile', -> compile -> log ":-)", green
task 'watch', 'compile and watch', -> compile true, -> log ":-)", green
task 'build', 'compile and build', -> compile -> build -> log ":-)", green
task 'doc', 'update doc file', -> compile -> build -> doc -> log ":-)", green


log = (message, color, explanation) -> console.log color + message + reset + ' ' + (explanation or '')

launch = (cmd, options=[], callback) ->
  cmd = which(cmd) if which
  app = spawn cmd, options
  app.stdout.pipe(process.stdout)
  app.stderr.pipe(process.stderr)
  app.on 'exit', (status) -> callback?() if status is 0

compile = (watch, callback) ->
  if typeof watch is 'function'
    callback = watch
    watch = false

  options = ['-c', '-o']
  if watch
    options.unshift '-w'
    launch 'coffee', options.concat qunit_files
  launch 'coffee', options.concat examples_files
  launch 'coffee', options.concat doc_files
  launch 'coffee', options.concat(casua_files), callback

build = (callback) ->
  exec 'uglifyjs build/casua.js -o build/casua.min.js -c --mangle toplevel,eval -r "ct,sc,mm"', [], callback

doc = (callback) ->
  exec 'coffee ./doc/generate.coffee', [], ->
    launch 'cp', ['doc/doc.css', 'gh-pages/', '-f'], callback