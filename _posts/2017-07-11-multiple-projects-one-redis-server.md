---
layout: post
title: "Multiple Celery projects with one Redis server"
date: 2017-07-11 00:00:00 +0200
categories: [python, celery, redis]
---

This is second article from series about Celery 4. If you miss first article,
you can find it here: <br>
[First steps with celery 4 and django]({% post_url 2017-07-04-first-steps-with-celery-4-and-django %})

Environment:

```
Ubuntu 16.04
Python 3.5+
Celery 4.0.2
Redis 3.2
```

Sometimes there is need to run multiple apps in one server. Let's say server is bored and
doesn't use all it's potential. There are no contraindications to run multiple apps.

All apps are configured following by documentation which looks like:

```python
from celery import Celery

redis = 'redis://localhost:6379/'
app = Celery('proj', broker=redis, backend=redis)
app.autodiscover_tasks()
```

And something strange happens. Workers starts to steal tasks from each others. There is definitely
configuration issue. All apps uses the same database and that is the case.

To avoid such behavior you can mess with queues and routing keys which may be painful 
and not effective. Or use separate database.

Redis-server uses database with index 0 by default. But you can change it by adding different
index to redis url.

```python
redis = 'redis://localhost:6379/1'
```

Out of the box Redis allow to use database with indexes from 0 to 16.
For more databases edit `redis.conf` file

```shell
sudo vim /etc/redis/redis.conf
```

On line `178` change databases amount to required value.
