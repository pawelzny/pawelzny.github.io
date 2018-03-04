---
layout: post
title: "Must have Celery 4 configuration"
permalink: "/python/celery/2017/08/07/must-have-celery-4-configuration/"
date: 2017-08-07 00:00:00 +0200
categories: [python, celery]
tags: [python, celery]
description: >-
  Celery is not as obvious as you think. Quick example of must have,
  basic configuration when working on Django project.
---

Last time we talk about basic configuration of Celery in Django project.
If you missed that, please see this article before further reading
[First steps with celery 4 and Django]({% post_url 2017-07-24-first-steps-with-celery-4-and-django %})

<div class="alert alert-info">
    <i class="fas fa-info-circle"></i> <strong>INFO</strong><br> This article is about Celery 4.0.2
</div>

I will extend configuration from first article with more options, but this is not full list.
I will focus only on must have options. In most cases default values are best for project,
but as it grows and uses more and more features it requires additional configuration.

Let's start with configuration from first article.

```python
from celery import Celery

redis = 'redis://localhost:6379/'
app = Celery('proj', broker=redis, backend=redis)
app.autodiscover_tasks()
```

I prefer Redis server over RabbitMQ. It is not the best nor the worst choice. It's just a choice.
If you prefer RabbitMQ use it instead. Configuration in this article will work for both.

In Celery 3 use Pickle to serialize arguments passed to tasks,
but Celery 4 use JSON serializer by default.

Future versions may change serializer once again. To avoid painful upgrade set serializer
explicitly in configurations.

```python
app.conf.task_serializer = 'json'
app.conf.result_serializer = 'json'
app.conf.accept_content = ['json']
```

I prefer not to create Queues and Exchange manually. I delegate this job to Celery.
I found that dynamically created queues works as well as defined manually.
Maybe never reach limitations of default behaviour. If you have different experience please
tell mi in comment.

```python
app.conf.task_create_missing_queues = True
```

Last options in my config is prefetch multiplier. It tells workers how many tasks it can reserve
for itself. If applications has many very long run processes this option should be set to 1.
If tasks are quick and not consumes much resources this option may be bigger. Default value
is 4. Zero value means "reserve as many tasks as you want". What about with mixed tasks?
There is no good answer. It depends of tasks. You should try few variants and check what
works best.

```python
app.conf.worker_prefetch_multiplier = 1
```

Put it all together. Whole "must have" configuration is just few lines. Most of time
default values are best for project. Let Celery do it's job for you.

```python
from celery import Celery

redis = 'redis://localhost:6379/'
app = Celery('proj', broker=redis, backend=redis)
app.autodiscover_tasks()

app.conf.task_serializer = 'json'
app.conf.result_serializer = 'json'
app.conf.accept_content = ['json']

app.conf.task_create_missing_queues = True
app.conf.worker_prefetch_multiplier = 1
```

Run worker

```console
(venv) $ celery -A proj worker -l info
```
