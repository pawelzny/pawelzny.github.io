---
layout: post
title: MetaClass
date: 2017-01-10
categories:
    - packagist
    - composer
permalink: /packagist/meta-class
description: Framework agnostic MetaClass support for PHP classes.
tags:
    - packagist
    - string
    - meta
    - class
---

## Description

Framework agnostic MetaClass support for PHP Classes.

Gives ability to have meta attributes and meta methods,
which are encapsulate behind `meta()` API.

MetaClass built in extension `SchemaDiscover` is able to fetch model schema columns. Can be useful when model is not aware of it's schema.

<span class="no-block">![GitHub license](https://img.shields.io/badge/license-ISC-blue.svg)</span>
<span class="no-block">![Packagist version](https://img.shields.io/packagist/v/pawelzny/meta-class.svg)</span>
<span class="no-block">![Packagist](https://img.shields.io/packagist/dt/pawelzny/meta-class.svg)</span>
<span class="no-block">![php](https://img.shields.io/badge/PHP-%5E5.6%20%7C%7C%20%5E7.0-green.svg)</span>
<span class="no-block">![Maintenance](https://img.shields.io/maintenance/yes/2017.svg?maxAge=2592000)</span>

Sources:
<a href="https://packagist.org/packages/pawelzny/meta-class" class="sourceEvent">packagist.org</a> |
<a href="https://github.com/pawelzny/meta-class" class="sourceEvent">github.com</a>

---

## Requirements:

* php: ^5.6 || php 7.0
* doctrine/dbal: ^2.5

## Get started

MetaClass Trait enables meta methods and meta attributes.

Classes with MetaClass Trait has access to public `$this->meta()` method which
gives access to meta attributes and meta methods.

Class has also access to protected `$this->initMeta()` method which
initialize meta attributes and methods on initialization.

```php
<?php

use Pawelzny\MetaClass\Traits\MetaClass;

class Model {
    use MetaClass;
    
    /**
     * Optional hook invoked on MetaClass construction.
     */
    protected function initMeta()
    {
        $this->meta()->custom_init_attribute = 'init attribute';
        $this->meta()->custom_init_method = function () { return 'custom method'; };
    }
}
```

You can add new attributes and methods on runtime:

```php
<?php
$model = new Model();
$model->meta()->custom_meta_attribute = 'this is meta attribute';
$model->meta()->custom_meta_method = function () { return 'meta function'; };

assert($model->meta()->hasAttribute('custom_meta_attribute')); // true
assert($model->meta()->hasAttribute('custom_init_attribute')); // true

assert($model->meta()->hasMethod('custom_meta_method')); // true
assert($model->meta()->hasMethod('custom_init_method')); // true

assert($model->meta()->hasAttribute('undefined_attribute')); //false
assert($model->meta()->hasMethod('undefined_method')); // false
```

## Model schema columns autoload

If model is separated from schema it's difficult to manage automatic jobs
in example generating forms for administrative CRUD purposes.

SchemaDiscovery uses `\Symfony\DBAL` library.

Schema columns are set as `meta()->fields` attribute.

### Requirements

* Your model have to implement database table name getter `getTable()`.
* Your model need `$meta_connection` property pointing to Connectable class.


```php
<?php

use Pawelzny\Discovery\Connections\Connection;
use Pawelzny\Discovery\Contracts\Connectable;
use Pawelzny\Discovery\Traits\SchemaDiscovery;
use Pawelzny\MetaClass\Traits\MetaClass;

/** 
 * Create custom connection class or use one of prebuilt
 * CustomConnection needs to extend Connection abstract and
 * implement Connectable interface.
 */
class CustomConnection extends Connection implements Connectable
{
    /**
     * Connection adapter identifier.
     * Needs to be not empty string value.
     * @return string
     */
    const NAME = 'custom';
    
    /**
     * Get credentials method MUST return array with keys as below
     * @return array ['dbname', 'user', 'password', 'host', 'port', 'driver']
     */
    protected function getCredentials()
    {
        /* 
         * get_config() function is just an example of how you should do this.
         * never use passwords with plain text in your source code under version control.
         */
        return [
            'dbname' => get_config('database'),
            'user' => get_config('username'),
            'password' => get_config('password'),
            'host' => get_config('host'),
            'port' => get_config('port'),
            'driver' => Connection::MYSQL_DRIVER,
        ];
    }
}

/**
 * Model have to use both MetaClass and SchemaDiscovery traits.
 * SchemaDiscovery works as extension to MetaClass.
 * 
 * But it can be used separately with little or no effort.
 */
class Model {
    use MetaClass, SchemaDiscovery;
    
    protected $table = 'models';
    /**
     * Without meta_connection SchemaDiscovery won't work.
     * @var Connectable
     */
    protected $meta_connection = CustomConnection::class;
    
    /**
     * Optional hook to initialize meta attributes and methods.
     */
    protected function initMeta()
    {
        $this->meta()->custom_init_attribute = 'init attribute';
        $this->meta()->custom_init_method = function () { return 'custom method'; };
    }
    
    /**
     * If your framework do not implements
     * database table getter you need to add it manually.
     */
    public function getTable()
    {
        return $this->table;
    }
}
```

### Predefined Connections

Use one of this predefined Connection adapters, or extend and adjust them
if you don't follow framework guides.

1. `\Pawelzny\Discovery\Services\LaravelConnection::class`

## MetaClass API

Access directly from class which uses MetaClass Trait.

```php
<?php

use Pawelzny\MetaClass\Traits\MetaClass;

class MyModel
{
    use MetaClass;
    
    public function getValue()
    {
        return $this->meta()->value;
    }
    
    protected function initMeta()
    {
        $this->meta()->value = 'initial value';
    }
}
```

### `MetaClass: meta()`

Gives access to MetaClass instance.

### `void: initMeta()`

Gives ability to initiate meta attributes and meta methods on MetaClass initialization.

## Meta API

Get access through `meta()` interface.

```php
<?php

use Pawelzny\MetaClass\Traits\MetaClass;

class MyModel
{
    use MetaClass;
    
    public function hasValue()
    {
        return $this->meta()->hasAttribute('value');
    }
    
    public function hasMethod()
    {
        return $this->meta()->hasMethod('custom');
    }
    
    protected function initMeta()
    {
        $this->meta()->value = 'initial value';
        $this->meta()->custom = function () { return null; };
    }
}
```

### `boolean: hasAttribute(string $name)`

Checks if MetaClass instance has attribute

### `boolean: hasMethod(string $name)`

Checks if MetaClass instance has method

## SchemaDiscovery API

With little or no effort you can use SchemaDiscovery alone without MetaClass.

Get access through `discover()` interface.

```php
<?php

use Pawelzny\Discovery\Traits\SchemaDiscovery;

class MyModel
{
    use SchemaDiscovery;

    public function getSchema()
    {
        return $this->discover();
    }
}
```

### `array: discover()`

Returns array of columns from models schema

## Contribution

Feel free to Pull Request

## LICENSE
The ISC License (ISC)
Copyright (c) 2017 Paweł Zadrożny
