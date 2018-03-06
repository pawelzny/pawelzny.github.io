---
layout: post
title: "First steps with Celery 4 and Django"
permalink: "/python/celery/django/2017/07/24/first-steps-with-celery-4-and-django/"
date: 2017-07-24 00:00:00 +0200
categories: [development]
tags: [python, django, celery, tutorial, queue]
description: >-
  This is first art from series about Celery 4 configurations and quirks.
  I will show you how to properly use Celery with Django projects.
---

This is first art from series about Celery 4 configurations and quirks.
I will show you how to properly use Celery with Django projects.

At that moment I assume, that you know at least python basics.

Followed by [Wikipedia](https://en.wikipedia.org/wiki/Celery_(software)):

> Celery is an open source asynchronous task queue or job queue which is based
> on distributed message passing. While it supports scheduling, its focus is on
> operations in real time.

<div class="alert alert-info">
    <i class="fas fa-info-circle"></i> <strong>INFO</strong><br> This article is about Celery 4.0.2
</div>

Celery 4 gives you ability to place all configuration in `settings.py` with rest Django
settings, but from my experience .. you don't want to do that. It is much cleaner to
keep Celery settings in separate module.

In main project app, next to `settings.py`, create new module `celery.py`.

Structure should looks similar to this:

```
proj
|-- proj
|   |-- __init__.py
|   |-- celery.py
|   |-- settings.py
|   |-- tasks.py
|   |-- urls.py
|-- manage.py
|-- requirements.txt
```

I prefer to use Redis as message broker because it is more familiar to me then RabbitMQ,
but Celery is ready to work with both of them with the same configuration.

```python
from celery import Celery

redis = 'redis://localhost:6379/'
app = Celery('proj', broker=redis, backend=redis)
app.autodiscover_tasks()
```

Celery instance is assign to `app` variable by convention.
Keep your project simple and consistent. Celery instance should be named same as project.

For example if project's name is "gift-catalogue" then
`app = Celery('gift-catalogue', broker=redis, backend=redis)`

At least autodiscover method is called to load all tasks. `autodiscover_tasks()` searches
a list of packages for a `tasks.py` module or use related_name argument,
[more about autodiscover](http://docs.celeryproject.org/en/latest/reference/celery.html#celery.Celery.autodiscover_tasks).

Last thing to do. To `proj/proj/__init__.py` add this lines to load celery on Django startup:

```python
from proj.celery import app as celery_app

__all__ = ['celery_app']
```

From now on we can call tasks with `delay()` and `apply_async()` methods.

```python
from proj import celery_app

@celery_app.task
def add(a, b):
    return a + b

add.delay(4, 5)
add.apply_async(args=(4, 5))
```

Enable virtualenv with installed celery then be sure you are in root project directory.
You have to be one directory above main app directory, exactly where `manage.py` is.

Run worker with `-A proj` argument where `proj` is your main django app directory name,
where `celery.py` exists.

```console
(venv) $ celery -A proj worker -l info
```
