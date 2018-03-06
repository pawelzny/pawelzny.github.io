---
layout: post
title: "Send emails from Django using Gmail SMTP"
permalink: "/python/django/2017/06/27/email-backend-with-smtp-gmail/"
date: 2017-06-27 00:00:00 +0200
categories: [development]
tags: [python, django, email, smtp]
description: >-
  Code snippet with email configuration for Django projects.
---

Add this configurations in your `settings.py`

This configurations is if you work with `smtp.gmail.com`, other smtp is similiar with configurations.

* Unlock Captha: [https://accounts.google.com/DisplayUnlockCaptcha](https://accounts.google.com/DisplayUnlockCaptcha)
* Change to active: [https://www.google.com/settings/security/lesssecureapps](https://www.google.com/settings/security/lesssecureapps)

```python
EMAIL_HOST           = 'smtp.gmail.com'
EMAIL_PORT           = 587
EMAIL_HOST_USER      = 'your_gmail@gmail.com'
EMAIL_HOST_PASSWORD  = 'your_password'
EMAIL_USE_TLS        = True
DEFAULT_FROM_EMAIL   = EMAIL_HOST_USER
EMAIL_FROM           = EMAIL_HOST_USER
EMAIL_SUBJECT_PREFIX = '[Project] '
EMAIL_BACKEND        = 'django.core.mail.backends.smtp.EmailBackend'

# MANAGERS
ADMINS = [('Website Admin', 'website.admin@example.com')]
MANAGERS = ADMINS + [('Website Manager', 'website.manager@example.com')]
```

Sending email is as easy as creating EmailMessage object and calling send method on it.

```python
from django.conf import settings
from django.core.mail import EmailMessage

subject = 'Internal system message'
body = "This is test email."

EmailMessage(subject=subject, body=body, to=[x[1] for x in settings.MANAGERS]).send()
```

But what if you want to pretend sending emails?

Change `EMAIL_BACKEND` setting to `console`.

```python
EMAIL_BACKEND = 'django.core.mail.backends.console.EmailBackend'
```
