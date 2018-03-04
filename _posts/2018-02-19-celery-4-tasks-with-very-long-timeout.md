---
layout: post
title: "Celery 4 tasks with very long timeout"
permalink: "/python/celery/2018/02/19/celery-4-tasks-with-very-long-timeout/"
date: 2018-02-19 14:30:00 +0200
categories: [python, celery]
tags: [python, celery, queue]
description: >-
  Working with Celery tasks which required very long timeout.
---

Delaying tasks is not obvious and as always when Celery comes in we must
take care about few things.

<div class="alert alert-info">
    <i class="fas fa-info-circle"></i> <strong>INFO</strong><br>
    This article is about Celery 4.0 and 4.1. If you come from the future,
    this may also apply to you.
</div>

## Countdown

First and the easiest way for task delaying is to use `countdown` argument.
Countdown takes Int and stands for the delay time expressed in seconds.

```python
my_task.apply_async(countdown=10)
```

### Pros

* easy to use
* readable

### Cons

* doesn't work when `enable_utc` is set to False and timezone is defined

## Estimated Time of Arrival

Second way is to use `eta` argument, which takes exact date and time of execution.
Works perfectly with native datetime object, date as String or even Pendulum instance.

```python
my_task.apply_async(eta=datetime.now(pytz.timezone("Europe/Warsaw"))
my_task.apply_async(eta="2018-02-19 13:41:14+01:00")
my_task.apply_async(eta=pendulum.now("Europe/Warsaw"))
```

### Pros

* readable
* precise
* works with timezones

### Cons

* require more work

## Visibility timeout

Sometimes there is a need for very long timeout for example 8 hours or more.
For such long timeouts Celery require additional configuration.

```python
app = Celery("project_name", broker="redis://localhost:6379", backend="redis://localhost:6379")

max_timeout_in_seconds = 21600  # 6h this is arbitrary
app.conf.broker_transport_options = {"visibility_timeout": max_timeout_in_seconds}
```

Without `visibility_timeout`, tasks with very long timeout may be dropped or will be executed multiple times.
Once or twice for every active worker.
