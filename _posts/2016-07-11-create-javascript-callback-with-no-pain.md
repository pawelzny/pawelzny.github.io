---
layout: post
title: "Create JavaScript callback with no pain"
permalink: "/nodejs/javascript/2016/07/11/create-javascript-callback-with-no-pain/"
date: 2016-07-11 00:00:00 +0200
categories: [nodejs, javascript]
tags: [javascript, callback]
description: >-
  Tutorial how to use last-callback package to easily manage callbacks
  without need to check argument type and correctness.
---

Creating function which accepts another function as last parameter is not challenging,
but boring and tiring. Let's change it!

## Standard callback implementation
Designing custom function which accepts callback, you need to take care of few things:

* Declare last argument as callback function
* Check if this argument is callable
* Encapsulate invocation in try-catch block
* Pass parameters to callback function

In result you will get something like that:

### Create myFunc which accept callback

```javascript
function myFunc (param1, param2, callback) {
  let error = null;

  /* some logic */

  // check if callback is callable
  if (typeof callback === 'function') {
    // make environment safe against bugs
    try {
      // if your logic returns error pass the error
      if (error) {
        callback(error);
      } else {
        // else pass other arguments
        callback(null, param1, param2);
      }
    } catch (err) { /* pass, callback bugs */ }
  }
  /* rest of your logic */
}
```

### Invoke myFunc with callback

```javascript
myFunc('test', true, function(err, is_test, flag) {
  if (err) {
    /* error logic */
  } else {
    /* other logic */
  }
});
```

Your callback is tightly coupled with exactly third argument in example above.
It is acceptable but not so flexible. Although whole boilerplate is not hard to
understand, writing it again and again is not necessary.

If you can avoid repeating your code you should do it.

## Simply as last-callback
There is a package in NPM called [last-callback]({{site.url}}/npm/last-callback) ,
which removes need of writing whole callback boilerplate. All you need to do is pass all arguments
to lastCallback() function to get extracted last callable argument.

### Example for NodeJS:
```javascript
const lastCallback = require("last-callback");

function myFunc (param1, param2) {
  let error = null;

  // extract last arguments and make it callable
  // you do not need to declare callback as last argument
  // this way you have truly optional callback
  let callback = lastCallback(...arguments);

  /* some logic */

  // you do not need to check if callback is typeof function
  // even if last arguments is not a function
  // lastCallback always returns callable
  // which may do nothing if optional callback has not been passed
  // as last argument.
  // No more type checking
  try {
    if (error) {
      callback(error);
    } else {
      callback(null, param1, param2);
    }
  } catch (err) { /* pass, callback bugs */ }

  /* rest of your logic */
}
```

### Example for browser:
Download last-callback [for browsers](https://github.com/pawelzny/last-callback/tree/master/browser)
and add to your project as before your code.
Last-callback is dependency free and do not interfere with any libraries like jQuery, Angular, React and other.

```html
<script src="last-callback.v1.0.3.min.js"></script>
<script>
function myFunc (param1, param2) {
  var error = null;

  // ES5 Style:
  var callback = lastCallback.apply(null, arguments);
  // ES6 Style:
  // let callback = lastCallback(...arguments);

  /* some logic */

  try {
    if (error) {
      callback(error);
    } else {
      callback(null, param1, param2);
    }
  } catch (err) { /* pass, callback bugs */ }

  /* rest of your logic */
}
</script>
```

### Pros:

* Do not need to declare last argument as callback
* Callback function is automaticaly extracted from arguments list
* Do not need to check if callback is typeof function
* If last argument is not a function, last-callback returns void function

### Cons:

* One more dependency in your project
