---
layout: post
title: "Celery 4 tasks - best practices"
date: 2017-08-14 00:00:00 +0200
categories: [python, celery]
---

This is third article from series. Check out previous two about
[first steps with celery 4 and Django]({% post_url 2017-07-24-first-steps-with-celery-4-and-django %}) 
and [must have Celery 4 configuration]({% post_url 2017-08-07-must-have-celery-4-configuration %}).

<div class="alert alert-info">
    <i class="fa fa-info-circle"></i> <strong>INFO</strong><br> This article is about Celery 4.0.2
</div>

## Set name for every task

Celery creates task names based on how module is imported. It is a little dangerous.
Set explicitly name for every task. Prefer using proj.package.module.function_name convention
to avoid collisions with 3rd party packages.

```python
@app.task(name='proj.package.tasks.add')
def add(a, b):
    return a + b
```

## Prefer apply_async over delay

Celery gives us two methods `delay()` and `apply_async()` to call tasks. Delay is preconfigured
with default configurations, and only requires arguments which will be passed to task.

```python
add.delay(10, 5)
add.delay(a=10, b=5)
``` 

That is it. Delay function processing with given arguments. It works well and in many cases
it is all we need, but it is not future proof.

Apply_async is more complex, but also more powerful then preconfigured delay.
It is always better to use apply_async with specificly set options.

```python
add.apply_async(queue='low_priority', args=(10, 5))
add.apply_async(queue='high_priority', kwargs={'a': 10, 'b': 5})
```

## Always define queue

Always define queue to easy priorities jobs. You may want to have at least 3 queues,
one for high priority tasks, second for low priority tasks, and default one for normal priority.

In my last post about configuration I set `app.conf.task_create_missing_queues = True`. 
This way I delegate queues creation to Celery. I can use apply_async with any queue I want, 
and Celery will handle it for me.

One change is required to work with different queues. Worker has to know about them, otherwise
worker will listen only for default queue.

Run worker with command:

```shell
celery -A proj worker -l info -Q default,low_priority,high_priority
```

<div class="alert alert-warning" role="alert">
    <i class="fa fa-exclamation-triangle"></i> <strong>WARNING!</strong> <br>
    Celery 4 has nasty, very hard to find bug in worker.
    <p>
        It works only with 4 defined queues after <code class="highlighter-rouge">-Q</code> 
        parameter. If you need more queues,
        just start more workers.
    </p>
</div>

Where is profit in this approach? Obviously in concurrency. 
`-c` parameter defines how many concurrent threads worker create.

```shell
celery -A proj worker -l info -Q default -c 2
celery -A proj worker -l info -Q low_priority -c 1
celery -A proj worker -l info -Q high_priority -c 4
```

And with auto scaling workers

```shell
celery -A proj worker -l info -Q default --autoscale 4,2
celery -A proj worker -l info -Q low_priority --autoscale 2,1
celery -A proj worker -l info -Q high_priority --autoscale 8,4
```

This way you can control tasks consumption speed. 

Keep concurrency number close to CPU cores amount. If server has 4 core CPU, then max concurrency
should be 4. Of course bigger numbers will work but with less efficiency.

## Priority within single queue

Tasks split in many queues it's always better then putting everything in single queue.
But, sometimes even in single queue tasks may have different priority.
To avoid FIFO, it is better to define priority with integer range from 0 to 9.

```python
add.apply_async(queue='high_priority', priority=0, kwargs={'a': 10, 'b': 5})
add.apply_async(queue='high_priority', priority=5, kwargs={'a': 10, 'b': 5})
add.apply_async(queue='high_priority', priority=9, kwargs={'a': 10, 'b': 5})
```

## Use auto_retry always with max_retries

Auto retry gives ability to retry task with the same input and task id when specific exception
occurs. Let's say task calls external API and expect occasional HTTP Exception.

Auto retry takes list of expected exceptions and retry task when one of these occurs.
In that case always set max_retries boundary. Never let tasks repeat infinitely.

```python
from httplib import HTTPException

@app.task(name='proj.package.tasks.fetch_data', auto_retry=[HTTPException], max_retries=3)
def fetch_data():
    return call_api()
```

<div class="alert alert-warning">
    <i class="fa fa-exclamation-triangle"></i> <strong>WARNING!</strong><br>
    <code class="highlighter-rouge">max_retries</code> 
    works only with <code class="highlighter-rouge">auto_retry</code> 
    and <code class="highlighter-rouge">self.retry</code>
</div>

## Divide an iterable of work into pieces 

If you have hundreds of thousands objects it is better idea to process them in chunks.
For example `100 000` elements can be split for `1000` elements per job which 
gives `100` jobs in queue.

```python
@celery_app.task(name='proj.package.tasks.process_data')
def process_data(elements):
    return process_elements(elements)

process_data.chunks(iter(elements), 100).apply_async(queue='low_priority')
```

But chunks are sequential. This mean worker will consume one by another.
We can convert chunks to group which is consumed in parallel.

```python
process_data.chunks(iter(elements), 100).group().apply_async(queue='low_priority')
```

## Link tasks that depend on each other

Using examples from this article. Data have to be processed after fetching.
Instead of using countdown and have hope that fetching will end before processing starts,
chain tasks and run in sequence.

```python
fetch_data.apply_async(queue='low_priority', link=process_data.s(queue='low_priority'))
```

## Avoid launching synchronous subtasks

Never do that:

```python
data = fetch_data.delay().get()
processed_data = process_data.delay(data).get()
```

Do this instead:

```python
from celery import chain

processed_data = chain(fetch_data.s(), process_data.s()).apply_async(queue='low_priority').get()
```

<p class="lead">What are your best practices? Leave down in comments.</p>
