---
layout: post
title: (PHP) Trim strings with the integrity of words
date: 2016-07-11
categories:
    - blog
tags:
    - packagist
    - php
    - trim
    - string
---

## Extracting substring old way

Sometimes you need to trim long string to fit it in narrow html element.
It is easy to use built in `string substr ( string $string , int $start [, int $length ] )` 
function and extract some part of
string ie:

```php
<?PHP

$str = 'This is very long string.';
$sub_str = substr($str, 0, 10);
echo $sub_str; // This is ve
```

As you can see `substr` does not care about integrity of words in sentence.
All it does is to take starting index and length which need to be cut out.

If you want to skip cut in half words you have to implement more complicated logic,
or just use proper package `pawelzny/trimmer`.

## Extracting substring pawelzny way

Install package with composer: `composer require pawelzny/trimmer` and you are good to go.

### Basic usage of Trimmer is like this

```php
<?PHP
use Trimmer\Trimmer; // use Trimmer namespace 

// create new Trimmer object with string and length upfront
$trim = new Trimmer('This is very long string.', $length=10);
echo $trim->toCharacters(); // This is ve...
```

Ok, this is more code then in previous example and basically does same thing, 
trims long string to given length.

### But here comes dat boi!

```php
<?PHP
use Trimmer\Trimmer; // use Trimmer namespace 

// create new Trimmer object with string and length upfront
$trim = new Trimmer('This is very long string.', $length=10);
echo $trim->toWords(); // This is...
```

This time Trimmer trims long string to given length but with integrity of words in mind.

### This is not all

`Trimmer()` has few more methods within its public API, ie. You can set on runtime
new length or delimiter.

Check my other post with documentation of [pawelzny/Trimmer]({{site.baseurl}}/packagist/trimmer).