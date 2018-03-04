---
layout: post
title: "Free SSL certificates"
permalink: "/ssl/2018/02/19/free-ssl-certificates/"
date: 2018-02-19 16:01:00 +0200
categories: [ssl]
tags: [ssl, cert]
description: >-
  Get free SSL certificate from Let's Encrypt authority.
  Tutorial how to use Certbot shell client.
---

Say Hi to Let's Encrypt.
Let’s Encrypt is a free, automated, and open Certificate Authority.
Certificates are completely free but it is welcome to make a donation.
Read more on [https://letsencrypt.org/](https://letsencrypt.org/)

Official documentation recommend to use Certbot client which is shell tool.

On Debian and Ubuntu:

```console
$ sudo apt install certbot
```

Alternatively:

```console
$ wget https://dl.eff.org/certbot-auto
$ sudo chmod a+x ./certbot-auto
$ ./certbot-auto --help
```

Read more about installation in official documentation [https://certbot.eff.org/docs/install.html](https://certbot.eff.org/docs/install.html)

Before you go with Certbot, make sure you have already configured your domain without SSL.
Domain is pointing to server IP, and you have access to website over HTTP.

In most cases you only have to run Certbot and follow the instructions.
However when I ran Certbot with default arguments I had trouble with permissions and authentication.

My solution:

```console
$ sudo certbot --authenticator standalone \
               --installer apache \
               -d app1.domain.com,app2.domain.com \
               --pre-hook "apachectl stop" \
               --post-hook "apachectl start"
```

Alternatively:

```console
$ sudo ./path/to/certbot-auto --authenticator standalone \
                              --installer apache \
                              -d app1.domain.com,app2.domain.com \
                              --pre-hook "apachectl stop" \
                              --post-hook "apachectl start"
```

* `--authenticator standalone` Use local authentication
* `--installer apache` set Certbot to work with Apache2, works with nginx haproxy and other, check [all-instructions](https://certbot.eff.org/all-instructions/)
* `-d` comma-separated list of domains to obtain a certificates for
* `--pre-hook` and `--post-hook` toggle Apache2, because Certbot uses port 80 to obtain a certificates

Cert renewal is a lot easier, because all domains are already configured.

```console
$ sudo certbot renew
```

or

```console
$ sudo ./path/to/certbot-auto renew
```

Certs expires within 3 months. Create cron job for automatic renew.

```console
$ sudo crontab -e
```

Add new job which will run at noon and midnight every day:

```
0 0,12 * * * certbot renew
```
