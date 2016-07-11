---
layout: post
title: Last-callback
date: 2016-07-11
categories:
    - npm
permalink: /npm/last-callback
description: Get last argument and call if it is a function.
tags:
    - npm
    - nodejs
    - callback
---

## Version
**1.0.0**

## Description

Easly get last argument and call if it is a function.
You do not need to check last argument manually any more.

All you need to do is to pass arguments array to this little module,
then call it, or bind with `this` context.

It is compatybile with ES5 and above.

Sources:
<a href="https://www.npmjs.com/package/last-callback" class="sourceEvent">npmjs.org</a> |
<a href="https://github.com/pawelzny/last-callback" class="sourceEvent">github.com</a>

<img src="https://nodei.co/npm/last-callback.png?downloads=true&downloadRank=true&stars=true" class="center-block">

<img src="/assets/img/last-callback_coverage.png" class="center-block">
---

## Requirements

NodeJS >= 4.4.0

## Instalation

with NPM:

```javascript
npm install -S last-callback
```

## Get last callback

last-callback respects: bind, call, and apply methods;

### ES6 Style

If you are using `NodeJS >= 6.2.0` You should definitly use ES6 style with spread operators.

```javascript
const lastCallback = require('last-callback');

function myFunc (param1) {
    let callback = lastCallback(...arguments);

    callback(param1);
}

myFunc('test value', function (param) {
    console.log(param); // 'test value'
});
```

### ES5 Style

If you are still using `NodeJS < 6.2.0`, i.e. `odeJS 4.4.7 LTS`, you can use ES5 style.


```javascript
var lastCallback = require('last-callback');

function myFunc (param1) {
    var callback = lastCallback.apply(null, arguments);

    callback(param1);
}

myFunc('test value', function (param) {
    console.log(param); // 'test value'
});
```

### ES5 Style with context

```javascript
var lastCallback = require('last-callback');

function myFunc (param1) {
    var callback = lastCallback.apply(null, arguments); // no need to bind context here

    this.contextVariable = 'this is my context';

    callback.call(this, param1); // this is the place where you should bind context
}

myFunc('test value', function (param) {
    console.log(param); // 'test value'
    console.log(this.contextVariable); // 'this is my context'
});
```

### Recursive callback

You can use recursive callbacks if needed.

```javascript
const lastCallback = require('last-callback');

let
    iterator = 1,
    limit = 5;

function myFunc (number) {
    let callback = lastCallback(...arguments);

    callback(number);
}

function recursiveCallabck (number) {
    if (number === limit) {
        return;
    }

    console.log(number);

    number += 1;
    recursiveCallabck(number);
}

myFunc(number, recursiveCallabck);
// console log:
// 1
// 2
// 3
// 4
// 5
```

## Contribution

Feel free to Pull Request

## LICENSE
The MIT License (MIT)
Copyright (c) 2016 Paweł Zadrożny
