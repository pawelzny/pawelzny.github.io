---
layout: post
title: "Sentry with Django and Celery"
date: 2018-02-19 15:12:00 +0200
categories: [python, celery, logging, django]
---

Sentry is a service for errors log gathering and aggregation.
Is available as paid SaaS or free to use standalone version.
Read more on [https://sentry.io/welcome/](https://sentry.io/welcome/)

## Install Sentry SDK

Sentry comes with ready to use SDK package compatible with Python 2.7 and 3.x.

```shell
pip install raven; pip freeze | grep raven >> requirements.txt
```

or

```shell
pipenv install raven
```

## Sentry minimal config for Django

In django `settings.py` add:

```python
import raven

RAVEN_CONFIG = {
    'environment': 'production',  # optional but very useful
    'release': raven.fetch_git_sha(BASE_DIR),  # optional but very useful
    'dsn': 'https://example:example@domain.com/n',  # DSN can be obtained from sentry panel
}
```

From now on Sentry will capture all unexpected exceptions,
which are not catched in `try-except` block.
Also all manually created log entries will be sent to Sentry.
However this is limited only to exceptions raised by WSGI.

## Catch exceptions raised inside Celery tasks

To make Sentry to be aware of Celery, register Sentry client just below Celery configuration.
I assume you have created separate file for Celery config. If not i encourage you to read how to do it on:
[First steps with Celery 4 and Django]({% post_url 2017-07-24-first-steps-with-celery-4-and-django %})

```python
from raven.contrib.celery import register_logger_signal, register_signal
from raven.contrib.django.raven_compat.models import client

register_logger_signal(client)
register_logger_signal(client)
register_signal(client)
register_signal(client, ignore_expected=True)
```

