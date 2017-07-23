---
layout: post
title: "Celery tasks - best practices"
date: 2017-07-25 00:00:00 +0200
categories: [python, celery]
---

This is third article from series. Check out previous two about
[first steps with celery 4 and Django]({% post_url 2017-07-04-first-steps-with-celery-4-and-django %}) 
and [must have Celery 4 configuration]({% post_url 2017-07-18-must-have-celery-4-configuration %}).

My environment:

```
Ubuntu 16.04
Python 3.5+
Celery 4.0.2
Redis 3.2
```

Celery gives us two methods `delay()` and `apply_async()` to call tasks. Delay is preconfigured
with default configurations, and only requires arguments which will be passed to task.

```python
from proj import celery_app

@celery_app.task
def add(a, b):
    return a + b


add.delay(10, 5)
add.delay(a=10, b=5)
``` 

That is it. Delay function processing with given arguments. It works well and in many cases
it is all we need, but it is not future proof.

## Prefer apply_async over delay

Apply_async is more complex, but also more powerful then preconfigured delay.
It is always better to use apply_async with few arguments then default behavior.

```python
add.apply_async(queue='low_priority', priority=0, retries=0, args=(10, 5))
add.apply_async(queue='high_priority', priority=9, retries=2, kwargs={'a': 10, 'b': 5})
```

## Always define queue

Always define queue to easy priorities task jobs. You may want to have at least 3 queues,
one for high priority tasks, second for low priority tasks, and default one for normal priority.

In my last post about configuration I set `app.conf.task_create_missing_queues = True`. 
This way I delegate queues creation to Celery. I can use apply_async with any queue I want, 
and Celery will handle it for me.

One change is required to work with different queues. Worker has to know about them, otherwise
worker will listen only for default queue.

Run worker with this command

```shell
celery -A proj worker -l info -Q default,low_priority,high_priority
```

<div class="alert alert-warning" role="alert">
    <i class="fa fa-exclamation-triangle"></i> WARNING! <br>
    Celery 4 has nasty, very hard to find bug in worker.
    <p>
        It works only with 4 defined queues after <code class="highlighter-rouge">-Q</code> 
        parameter. If you need more queues,
        just spin off more workers.
    </p>
</div>

Where is profit in this approach? Obviously in concurrency. 
`-c` parameter defines how many concurrent threads worker create.

```shell
celery -A proj worker -l info -Q default -c 2
celery -A proj worker -l info -Q low_priority -c 1
celery -A proj worker -l info -Q high_priority -c 4
```

This way you can control tasks consumption speed. 

Keep concurrency number close to CPU cores amount. If server has 4 core CPU, then max concurrency
should be 4. Of course bigger numbers will work but with less efficiency.

## Set retries argument

Every time tasks raise exception, Celery will try again and again and again. Without 
hard limit Celery never stop. With many broken tasks Redis or RabbitMQ will be flooded 
with tasks that have zero chance to end with success.

And by default Celery will repeat tasks indefinitely.

## Priority within single queue

Tasks split in many queues it's always better then putting everything in single queue.
But, sometimes even in single queue tasks may have different priority.
To avoid FIFO, it is better to define priority with integer range from 0 to 9.
