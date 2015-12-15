jsdom = require 'jsdom'
fs = require 'fs'

doc_html = fs.readFileSync __dirname + '/index.html'
static_template = fs.readFileSync __dirname + '/static.template.html'
document = jsdom.jsdom doc_html
window = document.parentWindow
window.addEventListener 'load', ->
  casua = window.casua
  app_node = new casua.Node document.getElementById('doc-app')
  fs.writeFile __dirname + '/../gh-pages/index.html', static_template.toString().replace('{{app_node}}', app_node.html()), (err) ->
    console.log err if err
    process.exit()