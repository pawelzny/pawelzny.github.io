---
layout: post
title: "Tired of typing 'python manage.py'?"
date: 2018-02-26 10:03:00 +0200
categories: [shell, django]
tags: [django, manage, shell]
description: >-
  Create shortcut for most frequently used command when developing
  with Django framework.
---

Using lots of Django commands in a row can be tiring.
Imagine creating new migrations, and then sync some data
and then run dev server to verify whole process. It may looks like this:

```console
(venv) $ python manage.py makemigrations
(venv) $ python manage.py migrate
(venv) $ python manage.py make_something
(venv) $ python manage.py sync_service --with=args
(venv) $ python manage.py runserver
```

It's a lot of typing!

## Solution 1: shortcut shell script

The easiest way to merge two keywords into one is to create an alias script.

```console
$ sudo vim /bin/django
```

And this is it:

```sh
#!/bin/bash
python manage.py "$@"
```

Make it executable:

```console
$ sudo chmod a+x /bin/django
```

Now use it like this:

```console
(venv) $ django makemigrations
(venv) $ django migrate
(venv) $ django make_something
(venv) $ django sync_service --with=args
(venv) $ django runserver
```

Much better. It works good on one machine,
but when you have to manage many machines...
Copying and pasting the same script to every single machine isn't a good idea.

## Solution 2: add manage.py to virtualenv path

Every project has or should have `setup.py` file.
All you need is to add `manage.py` to setup and voilà.

Minimal `setup.py` looks like:

```python
from setuptools import find_packages, setup

setup(
    name='mysite',
    version='1.0.0',
    packages=find_packages(exclude=('docs', 'media', 'static')),
    package_dir={'mysite': 'mysite'},
    install_requires=['django'],
    tests_require=['tox'],
    scripts=['manage.py'],  # <-- relative path to manage.py
)
```

And now project can be installed using pip as always

```console
(venv) $ pip install /path/to/project
```

Setup will take care of adding `manage.py` to environment path.
Now it is available directly like any other executable script.

```console
(venv) $ manage.py runserver
```
