morn-js
=======

This is a javascript toolkit library. Just like a lightweght jquery.

It has some useful functions. For example:

## Chain your functions.
  ```js
morn('.class')
    .addClass('class')
    .removeEventHandler('click', function(){ })
    .forEach(function(element,i))
  ```
## selector
  selecting with pleasure!
  ```js
morn.id('id'); // get element by id;
morn.tag('tagname'); // get elements by tag name;
morn.class('className');  // get elements by class name;
  ```
  or even you can use as below:
  ```js
morn('#id');
morn('.class');
morn('tag')
  ```
  ok, here are more css3 selector:
  ```js
morn('tag:odd');
morn('tag:even');
morn('tag:first-child');
morn('tag:last-child');
morn('tag > children');
morn('tag').find('selector');
  ```
  All of them support IE6.
  With a light weight parser, realizing without regex functions.
  
## event add and remove.
  Oh, these ought to be supported;
  ```js
morn('#id').addEventHandler('click', function(e){ });
morn('#id').removeEventHandler('click', func);
morn.ready(function); // invoked when document is ready
  ```
  like jquery does:
  ```js
morn('#id').click(function(){});
morn('#id').scroll(function(){});
  ```
  for IE6/7/8, now `hashchange` is avaliable.
  ```js
morn.hashchange(function(){});
  ```
## style change
  ```js
morn('#id').addClass('classname');
morn('#id').removeClass('classname');
morn('#id').hasClass('classname');
morn('#id').getComputedStyle([stylename]);
morn('#id').width();
  ```
## create dom, append, prepend.
  ```js
morn.createDom('<h1>Hello, morn!</h1>');
morn('#id').append(doms);
morn('#id').prepend(doms);
  ```
  some useful document traveling functions like `.next()`, `.prev()`, `.children()`, '.parent()'
## save your data in dom.
  choose data-* or morn-js according to the browser to save data.
  ```js
morn('dom').data('id', 10)    // save data
morn('dom').data('id')        // get data
morn('dom').removeData('id')  // remove id
morn('dom').removeData()      // remove all data
  ```
## promise for async function
  ```js
morn.promise()                 // return a promise object
    .then(success, failed)     // success function and failed function (optional)
    .reject(value)             // reject the promise
    .catch(handleError);       // runs when any error occurs.
  ```
## ajax method
  sending httpxmlrequest, support modern bowsers.
  ```js
morn.get(url, success, failed);
morn.post(url, dataObject, success, failed);
  ```
  both of above will return a promise.
## matrix transform
  using matrix to transform element in css3
  ```js
morn('dom').matrix()   //return a tranform object. get matrix currently;
morn('dom').matrix().rotate(30).end()   // use end() to apply transform, rotate 30deg.
morn('dom').matrix().rotate(30).translate(10, 50).scale(0.5).end()   //chain the transforms functions
  ```
## modules loader
  mornjs is organized in this way.
  ```js
morn.define(itself_name, ['dependencies'], function(){}); // 
morn.define(['dependencies'], function(){});  // anonymous function and has dependencies 
morn.define(itself_name, function(){}); // no dependencies
morn.define(function(){});  // no dependencies and anonymous
  ```
and even more.

## some ui plugins:

### resize
### sticky
### scroll

I will continue working on it.
