---
layout: post
title: "The most complete Apache2 config for WSGI, Django and DRF"
permalink: "/server/django/2018/02/26/the-most-complete-apache2-config-for-wsgi-django-and-drf/"
date: 2018-02-26 10:03:00 +0200
categories: [server, django]
tags: [python, django, DRF, apache2, wsgi]
description: >-
  Tutorial, how to configure Apache2 to work with python WSGI server.
---

**Goal of this post:**

Configuration of Apache2 to work with WSGI server,
Django and DRF over HTTPS protocol.

Working with WSGI is not that hard as it appears to be.
Hard part is to find and combine together all config pieces.

**TL;DR** Go to [Final solution]({% post_url 2018-02-26-the-most-complete-apache2-config-for-wsgi-django-and-drf %}#grand-finale-put-it-all-together)

## Apache2 config for HTTP

At this point I assume you have configured domain which points to server IP.

Create config file:

```console
$ sudo vim /etc/apache2/sites-available/mysite.com.conf
```

### Server name and alias

App should work when user tries `http://mysite.com` or `www.mysite.com`.
It's more natural for users to access web pages with `www` subdomain.
However it's not good for SEO and consistency.

I always set both addresses with and without `www` and then redirect
all `www` traffic to `non-www` address.

```
ServerName mysite.com
ServerAlias www.mysite.com

RewriteEngine on
RewriteCond %{SERVER_NAME} =www.mysite.com [OR]
RewriteCond %{SERVER_NAME} =mysite.com
RewriteRule ^ https://%{SERVER_NAME}%{REQUEST_URI} [END,QSA,R=permanent]
```

### Django Rest Framework - Access Control

For Django Rest Framework or any other exposed API.

```
Header set Access-Control-Allow-Origin "http://localhost:3000"
Header set Access-Control-Allow-Headers "Origin, X-Requested-With, Content-Type, Accept"
Header set Access-Control-Allow-Methods "GET, POST, PUT, PATCH, DELETE, OPTIONS, HEAD"
```

* `Access-Control-Allow-Origin` Set address and port of standalone frontend app
* `Access-Control-Allow-Headers` Common headers used with DRF
* `Access-Control-Allow-Methods` What HTTP methods should be allowed

### WSGI auth and group

At this point WSGI config is required only if user tries to access over HTTP
instead of HTTPS protocol.

```
WSGIPassAuthorization On
WSGIApplicationGroup %{GLOBAL}
```

## Apache2 config for HTTPS

At this point Django won't work. It's only a prepare for Let's Encrypt to create SSL cert.
Read more about [Free SSL certificates]({% post_url 2018-02-19-free-ssl-certificates %}).

Now it's time to create SSL certs. Let's Encrypt will copy all basic
config to new file of the same name with suffix `-le-ssl.conf`.

<div class="alert alert-warning" role="alert">
    <i class="fas fa-exclamation-triangle"></i> <strong>WARNING!</strong> <br>
    If you have cert from another entity, create new config file manually.
</div>

```console
$ sudo vim /etc/apache2/sites-available/mysite.com-ssl.conf
```

### App root and WSGI daemon

Define absolute paths to `mysite`, it's `.virtaulenv` and `wsgi.py`.

```
DocumentRoot /path/to/mysite/

WSGIDaemonProcess mysite.com \
  python-home=/path/to/.virtualenv/mysite/ \
  python-path=/path/to/mysite/

WSGIScriptAlias / /path/to/mysite/wsgi.py \
 process-group=mysite.com \
 application-group=%{GLOBAL}
```

`wsgi.py` file should look like below. For more check
[Django documentation](https://docs.djangoproject.com/en/2.0/howto/deployment/wsgi/)

```python
#!/usr/bin/env python
# -*- coding: utf-8 -*-
import os

from django.core.wsgi import get_wsgi_application

os.environ['DJANGO_SETTINGS_MODULE'] = 'mysite.settings'
application = get_wsgi_application()
```

### Grant access to files and directories

Apache should have access to all of this directories and files.

```
<Directory /path/to/mysite>
  <Files wsgi.py>
    Require all granted
  </Files>
</Directory>

<Directory /path/to/.virtualenvs/mysite>
  Require all granted
</Directory>

<Directory /path/to/mysite/static>
  Require all granted
</Directory>

<Directory /path/to/mysite/media>
  Require all granted
</Directory>

<Directory /path/to/mysite/logs>
  Require all granted
</Directory>
```

### Static files aliases

In production Django should not serve static files.
It takes to much resources just to send images or css files.

Apache will serve static files directly, and Django will never know.

```
Alias /media/ /path/to/mysite/media/
Alias /static/ /path/to/mysite/static/
```

### Error logs

Set log level and output files.
Available log levels are:

* emerg - Emergencies - system is unusable.
* alert - Action must be taken immediately.
* crit - Critical Conditions.
* error - Error conditions.
* warn - Warning conditions.
* notice - Normal but significant condition.
* info - Informational.
* debug - Debug-level messages

Read more in [apache docs](https://httpd.apache.org/docs/2.4/mod/core.html#loglevel)

```
ErrorLog /var/log/apache2/mysite-error.log
LogLevel warn
CustomLog /var/log/apache2/mysite-access.log combined
```

### SSL Certificate file

<div class="alert alert-info">
    <i class="fas fa-info-circle"></i> <strong>INFO</strong><br>
    If you use Let's Encrypt, this will be already generated for you.
</div>

```
SSLEngine on
SSLCertificateFile /path/to/cert/fullchain.pem
SSLCertificateKeyFile /path/to/cert/privkey.pem
```

## Grand finale. Put it all together.

Config file for **HTTP** `/etc/apache2/sites-available/mysite.com.conf`:

```apache
<VirtualHost *:80>
  ServerName mysite.com
  ServerAlias www.mysite.com

  Header set Access-Control-Allow-Origin "http://localhost:3000"
  Header set Access-Control-Allow-Headers "Origin, X-Requested-With, Content-Type, Accept"
  Header set Access-Control-Allow-Methods "GET, POST, PUT, PATCH, DELETE, OPTIONS, HEAD"

  RewriteEngine on
  RewriteCond %{SERVER_NAME} =www.mysite.com [OR]
  RewriteCond %{SERVER_NAME} =mysite.com
  RewriteRule ^ https://%{SERVER_NAME}%{REQUEST_URI} [END,QSA,R=permanent]

  WSGIPassAuthorization On
  WSGIApplicationGroup %{GLOBAL}
</VirtualHost>
```

Config file for **HTTPS** `/etc/apache2/sites-available/mysite.com-ssl.conf`:

```apache
<IfModule mod_ssl.c>
<VirtualHost *:443>
  ServerName mysite.com
  ServerAlias www.mysite.com

  Header set Access-Control-Allow-Origin "http://localhost:3000"
  Header set Access-Control-Allow-Headers "Origin, X-Requested-With, Content-Type, Accept"
  Header set Access-Control-Allow-Methods "GET, POST, PUT, PATCH, DELETE, OPTIONS, HEAD"

  DocumentRoot /path/to/mysite/

  WSGIDaemonProcess mysite.com \
    python-home=/path/to/.virtualenv/mysite/ \
    python-path=/path/to/mysite/

  WSGIScriptAlias / /path/to/mysite/wsgi.py \
   process-group=mysite.com \
   application-group=%{GLOBAL}

  <Directory /path/to/mysite>
    <Files wsgi.py>
      Require all granted
    </Files>
  </Directory>

  <Directory /path/to/.virtualenvs/mysite>
    Require all granted
  </Directory>

  <Directory /path/to/mysite/static>
    Require all granted
  </Directory>

  <Directory /path/to/mysite/media>
    Require all granted
  </Directory>

  <Directory /path/to/mysite/logs>
    Require all granted
  </Directory>

  Alias /media/ /path/to/mysite/media/
  Alias /static/ /path/to/mysite/static/

  ErrorLog /var/log/apache2/mysite-error.log
  LogLevel warn
  CustomLog /var/log/apache2/mysite-access.log combined

  SSLEngine on
  SSLCertificateFile /path/to/cert/fullchain.pem
  SSLCertificateKeyFile /path/to/cert/privkey.pem
</VirtualHost>
</IfModule>
```

## Enable site and required mods

Firstly enable mods. Some may not be pre installed.

```console
$ sudo a2enmod ssl rewrite headers wsgi alias
```

Enable site.

```console
$ sudo a2ensite mysite.com.conf mysite.com-ssl.conf
$ sudo service apache2 restart
```
