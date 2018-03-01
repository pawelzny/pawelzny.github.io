---
layout: post
title: "Keep Celery running with Supervisord"
date: 2018-02-27 09:19:00 +0200
categories: [celery]
tags: [celery, supervisord]
---

Supervisor is a client/server system that allows its users to monitor
and control a number of processes on UNIX-like operating systems.

<blockquote>
  <p>
    It shares some of the same goals of programs like launchd,
    daemontools, and runit. Unlike some of these programs,
    it is not meant to be run as a substitute for init as “process id 1”.
  </p>
  <p class="mb-0">
    Instead it is meant to be used to control processes related to
    a project or a customer, and is meant to start like any other program at boot time.
  </p>
  <footer>
    Official Documentation
    <cite title="supervisord.org">
      <a href="http://supervisord.org/">http://supervisord.org/</a>
    </cite>
  </footer>
</blockquote>

Celery has to be run in it's own process, separately from main app.
To ensure Celery is always up even after crash or system reboot we
can use Supervisord.

## Installing

Installation instructions depend whether the system on which you’re
attempting to install. Debian and Ubuntu have repositories for Supervisor.

```console
# apt install supervisor
```

This will integrate Supervisor with service management, and ensure
auto start after reboot.

## Creating a Configuration File

Supervisor uses Windows-INI-style
[Python ConfigParser](https://docs.python.org/3/library/configparser.html)
configuration files.

```console
# vim /etc/supervisor/config.d/mysite.conf
```

Single file can hold multiple sections if you need to
run multiple Celery instances with different arguments.

```ini
[program:mysite]
directory=/path/to/mysite
command=/path/to/.virtualenvs/mysite/bin/celery -A mysite worker -l error
user=pawelzny
stdout_logfile=/path/to/mysite/logs/mysite-worker.log
redirect_stderr=true
autostart=true
autorestart=true
stopwaitsecs=30
stopasgroup=true
killasgroup=true
umask=000
environment=ENV_NAME="production",DEBUG=False
```

Setting `umask=000` instruct Supervisor to create new files with
read and write privileges. Without this log files can't be access
and will crash process due to 'permission denied' error.

I found very useful to set `stopasgroup=true` and `killasgroup=true`.
It prevents Celery to orphan processes and mess up with application
on and after update.

## Reload new config

After any change to existing or new config files,
Supervisor needs to be reloaded.

```console
# supervisorctl reread
# supervisorctl reload
```
